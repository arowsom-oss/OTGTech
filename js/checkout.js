// checkout.js
// The checkout page. Needs products.js, settings.js, cart.js, deals.js and luhn.js loaded first.
//
// RULES FOR THE CARD (from the project brief, and this file follows every one):
//   - It is checked in the browser only. No network requests and no form posts.
//   - It is never saved. It is not put in browser storage, and no variable holds it
//     longer than the check itself.
//   - It is never logged. Nothing in this file prints anything to the browser's developer tools.
//   - It is wiped from the page the moment the order is placed.
// checkout.html also has a Content-Security-Policy that tells the browser to block
// network requests and form submits on this page. So even if someone made a mistake in
// this file later, the browser still would not let the card leave the page.
//
// Everything shown on the page is added with textContent, never as HTML. What a
// customer types (their name, for example) can't turn into code.

const gridEl = document.getElementById("checkout-grid");
const emptyEl = document.getElementById("checkout-empty");
const formEl = document.getElementById("checkout-form");
const statusEl = document.getElementById("checkout-status");
const summaryLinesEl = document.getElementById("summary-lines");
const summaryTotalsEl = document.getElementById("summary-totals");
const confirmEl = document.getElementById("confirmation");
const confirmHeadingEl = document.getElementById("confirmation-heading");
const confirmNumberEl = document.getElementById("confirmation-number");
const confirmThanksEl = document.getElementById("confirmation-thanks");
const confirmLinesEl = document.getElementById("confirmation-lines");
const confirmTotalsEl = document.getElementById("confirmation-totals");

// Makes a tag with a class and some text
function makeEl(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
}

// ---------- The order summary (used on the page and on the confirmation) ----------

function totalRow(label, amount, className) {
  const row = makeEl("p", "cart-total-row " + (className || ""));
  row.appendChild(makeEl("span", "", label));
  row.appendChild(makeEl("span", "", amount));
  return row;
}

function fillSummary(listEl, totalsEl, lines, totals) {
  listEl.replaceChildren();
  lines.forEach(function (line) {
    const product = findProduct(line.sku);
    const item = makeEl("li", "summary-line");

    const info = makeEl("span", "summary-info");
    info.appendChild(makeEl("span", "cart-name", line.qty + " × " + product.name));
    const details = [];
    if (product.material && product.color) {
      details.push(product.material + " · " + product.color);
    }
    if (line.note) {
      details.push(line.note);
    }
    if (details.length > 0) {
      info.appendChild(makeEl("span", "cart-detail", details.join(" · ")));
    }
    item.appendChild(info);
    item.appendChild(makeEl("span", "", formatPrice(product.price * line.qty)));
    listEl.appendChild(item);
  });

  totalsEl.replaceChildren();
  if (totals.discount > 0) {
    totalsEl.appendChild(totalRow("Items", formatPrice(totals.itemsTotal)));
    totalsEl.appendChild(totalRow(
      "Deals applied (" + describeDeals(totals.deals) + ")",
      "−" + formatPrice(totals.discount),
      "cart-deals-row"
    ));
  }
  totalsEl.appendChild(totalRow("Total", formatPrice(totals.total), "summary-total"));
}

// ---------- Checking each field ----------
// Each check gets what was typed and returns a message, or "" if it's fine.

function checkRequired(message) {
  return function (value) {
    return value.trim() === "" ? message : "";
  };
}

function checkCardNumber(value) {
  const digits = value.replace(/[\s-]/g, "");   // spaces and dashes are allowed, then ignored
  if (digits === "") {
    return "Enter your card number.";
  }
  if (!/^\d+$/.test(digits)) {
    return "Card numbers only have digits, spaces and dashes.";
  }
  if (digits.length < 13 || digits.length > 19) {
    return "Card numbers have 13 to 19 digits.";
  }
  if (!passesLuhn(digits)) {
    return "That card number doesn't look right. Check for a typo.";
  }
  return "";
}

function checkExpiry(value) {
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value.trim());
  if (!match) {
    return "Enter the expiry as MM/YY, like 08/28.";
  }
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) {
    return "The month must be from 01 to 12.";
  }
  // A card works through the end of its expiry month, so compare whole months
  const now = new Date();
  const thisMonth = now.getFullYear() * 12 + now.getMonth();
  const cardMonth = year * 12 + (month - 1);
  if (cardMonth < thisMonth) {
    return "That card has expired.";
  }
  if (cardMonth > thisMonth + 20 * 12) {
    return "That expiry date is too far away. Check for a typo.";
  }
  return "";
}

function checkCvc(value) {
  return /^\d{3,4}$/.test(value.trim()) ? "" : "Enter the 3 or 4 digit security code.";
}

const checks = [
  { id: "ship-name", check: checkRequired("Enter your full name.") },
  { id: "ship-address", check: checkRequired("Enter your street address.") },
  { id: "ship-city", check: checkRequired("Enter your city.") },
  {
    id: "ship-state",
    check: function (value) {
      return /^[A-Za-z]{2}$/.test(value.trim()) ? "" : "Enter your 2-letter state, like NY.";
    }
  },
  {
    id: "ship-zip",
    check: function (value) {
      return /^\d{5}(-\d{4})?$/.test(value.trim()) ? "" : "Enter a 5-digit ZIP code, like 11787.";
    }
  },
  { id: "card-number", check: checkCardNumber },
  { id: "card-expiry", check: checkExpiry },
  { id: "card-cvc", check: checkCvc }
];

// Shows or clears the message under one field
function showError(id, message) {
  const input = document.getElementById(id);
  const error = document.getElementById(id + "-error");
  if (message) {
    error.textContent = message;
    error.hidden = false;
    input.setAttribute("aria-invalid", "true");
  } else {
    error.textContent = "";
    error.hidden = true;
    input.removeAttribute("aria-invalid");
  }
}

// Checks every field. Returns the ids of the ones with a problem.
function validateForm() {
  const problems = [];
  checks.forEach(function (item) {
    const message = item.check(document.getElementById(item.id).value);
    showError(item.id, message);
    if (message) {
      problems.push(item.id);
    }
  });
  return problems;
}

// A field's message goes away as soon as the customer starts fixing it
checks.forEach(function (item) {
  document.getElementById(item.id).addEventListener("input", function () {
    showError(item.id, "");
  });
});

// ---------- Placing the order ----------

// Wipes the card fields. This runs BEFORE anything else once the card has passed.
function clearCardFields() {
  document.getElementById("card-number").value = "";
  document.getElementById("card-expiry").value = "";
  document.getElementById("card-cvc").value = "";
}

// Like OTG-7K2M9Q4X. Made from random bytes. It is shown on the page and not stored anywhere.
function makeOrderNumber() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";   // 32 characters, no I or O (they look like 1 and 0)
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let code = "";
  bytes.forEach(function (byte) {
    code += letters[byte % letters.length];   // 256 divides evenly by 32, so every letter is equally likely
  });
  return "OTG-" + code;
}

function showConfirmation(order) {
  gridEl.hidden = true;
  confirmEl.hidden = false;
  confirmNumberEl.textContent = order.number;
  confirmThanksEl.textContent = "Thanks, " + order.name + ". Your practice order is in.";
  fillSummary(confirmLinesEl, confirmTotalsEl, order.lines, order.totals);
  window.scrollTo(0, 0);
  confirmHeadingEl.focus();
}

function placeOrder(lines) {
  const totals = cartTotals(lines);
  const customerName = document.getElementById("ship-name").value.trim();

  clearCardFields();                 // the card is gone from the page right now
  formEl.reset();                    // and the rest of the form
  saveCart([]);                      // the cart is empty because the order is placed
  updateCartBadge();

  showConfirmation({
    number: makeOrderNumber(),
    name: customerName,
    lines: lines,
    totals: totals
  });
}

formEl.addEventListener("submit", function (event) {
  event.preventDefault();   // never let the browser submit the form itself

  const lines = loadCart();
  if (lines.length === 0) {
    showEmptyCart();
    return;
  }

  const problems = validateForm();
  if (problems.length > 0) {
    statusEl.textContent = problems.length === 1
      ? "Please fix the 1 field marked below."
      : "Please fix the " + problems.length + " fields marked below.";
    document.getElementById(problems[0]).focus();
    return;
  }

  statusEl.textContent = "";
  placeOrder(lines);
});

// ---------- Showing the right thing when the page opens ----------

function showEmptyCart() {
  gridEl.hidden = true;
  emptyEl.hidden = false;
}

const startingLines = loadCart();
if (startingLines.length === 0) {
  showEmptyCart();
} else {
  gridEl.hidden = false;
  fillSummary(summaryLinesEl, summaryTotalsEl, startingLines, cartTotals(startingLines));
}
