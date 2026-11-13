# OTGTech Website Brief

## Prompt for Claude Code

Paste everything from here to the end of this file into Claude Code, or save this file as `CLAUDE.md` in the website folder and type "Start building."

> Build the e-commerce storefront for OTGTech, my Virtual Enterprise class firm. Everything you need is in this file: the product specs, page list, website copy, brand colors, fonts and VE's judging rules.
>
> **Rules**
> - Use plain HTML, CSS and JavaScript. No frameworks and no build step. I'm still learning JavaScript and need to be able to read every file.
> - Make it a static site with no server. It has to work by opening `index.html`, and it has to work on GitHub Pages.
> - Use the exact copy, specs and colors in this brief. Don't invent specs, features or claims. Prices aren't set yet, so put a clearly marked placeholder like `$XX.XX` in one product data file so I can fill them in later.
> - Keep all product data in one JavaScript file: names, colorways, SKUs and prices. Every page reads from that file.
> - Put the VE disclaimer from section 1 in the footer of every page.
> - It has to work well on a phone.
> - The cart can be saved in `localStorage`. The credit card field can't. Follow every rule in section 7 for the card field.
> - The How It Folds page uses `otgtech-fold-model.html` from this folder.
> - Sections 3 and 9 are notes for my team about the physical product. Don't build website features from them.
>
> **How to work with me**
> - Follow the build order in section 7. After each step, stop and give me a short summary: what you built, how it works in plain English, and the names of the concepts it uses so I can look them up.
> - Before you write the checkout, explain how you'll handle the card field and why. I need to be able to defend that code in an interview.
> - If something in this brief is unclear or contradicts itself, ask me instead of guessing.
>
> Start with step 1.

---

**Firm and product: OTGTech**

Everything from the OTGTech product design work, in one place, for building the OTGTech VE storefront.

Status as of October 14, 2026.

---

## 0. Product decision

**OTGTech** is the firm name and the product name. The product is a charging desk-mat case: a pencil case that unfolds into a full desk mat, with wireless charging pads and a power hub built in. It replaces the earlier FoldCase concept, so FoldCase's colors, taglines and sizes no longer apply.

---

## 1. VE website requirements

This comes from VE's published E-Commerce Website rubric, the 2019–20 version. **Ask Mrs. Kollen for the current rubric on the VE Hub before building.** It may have changed.

Four categories, each scored 1 to 5 stars:

1. **Essential Components:** firm name, company description, shopping cart, contact info, products and pricing, working links, and this exact disclaimer:
   > This Virtual Enterprise online store is for educational purposes only. (Year – Firm Name)

   Filled in for this firm: *This Virtual Enterprise online store is for educational purposes only. (2026–2027 – OTGTech)*. Confirm the year format with Mrs. Kollen.
2. **Organization & Efficiency:** logical navigation, intuitive design, and easy add-to-cart and checkout.
3. **Marketing Effectiveness:** a clear brand image, a logo, consistent fonts, and "effective use of multimedia & interactive elements." The 3D fold model counts here.
4. **Content & Presentation:** design, graphics, uniqueness, professional look, and spelling and grammar.

Other rules already confirmed:
- Checkout must **show** a credit card field. It does not have to process payments or connect to VE banking.
- VE firms are allowed to sell to other VE firms.
- During trade shows, customers can buy straight from the website, so the site is a real sales channel, not just a showcase.

---

## 2. Product specs

All numbers are concept specs. Items marked **estimate** are rough math. **Check them against a real battery spec sheet before they go in the business plan.**

### Charging
| Spec | Value |
|---|---|
| Phone | Qi2 magnetic, up to 25 W |
| Apple Watch | Apple-certified MFi module, 5 W. **Verify:** a generic Qi pad probably can't charge an Apple Watch |
| Earbuds | Qi wireless, up to 5 W |
| Wired outputs | 2x USB-C PD, 1x USB-A |
| Total output | **65 W, shared across every pad and port** |
| Input | USB-C PD, 100 W adapter recommended |

### Power budget
Everything charging at once: phone 25 W + watch 5 W + earbuds 5 W + USB-C 30 W = **65 W**.
With the pads idle, the USB-C port can use the full 65 W for a laptop.
The 100 W adapter is recommended because wireless charging loses some energy as heat, so the input needs room above 65 W.

### Battery module, optional
| Spec | Value |
|---|---|
| Capacity | 20,000 mAh, about 74 Wh |
| Runtime with everything charging | About 2 hours, **estimate** |
| Phone charges | About 3 full charges, **estimate** |
| Air travel | Under the FAA 100 Wh limit. **Carry-on only:** spare lithium batteries can't go in checked bags |
| Added weight | About 1 lb, **estimate** |

### Size and build
| Spec | Value |
|---|---|
| Closed | 12" x 6" x 3" |
| Open | 36" x 18" |
| Panels | 9 panels, each 12" x 6", in a 3 x 3 grid |
| Fold | Sides fold in first, then the ends |
| Thickness budget | 3" closed / 9 layers = 1/3" per panel, about 8.5 mm |
| Weight | About 1.5 to 2 lb without battery, **estimate** |
| Colorways | Black, Navy Blue, Gray |

### Layout of the open mat
| | Left column | Middle column | Right column |
|---|---|---|---|
| **Top row** | Storage: cable loops, pens, small charger | Qi2 phone pad | Tablet stand, folds flat |
| **Middle row** | Storage: cable coils | Open workspace | Watch pad + earbuds pad |
| **Bottom row** | Storage: mesh pockets | Open workspace | Power hub + battery bay |

The open workspace covers the middle two panels and fits a 13 to 14 inch laptop.

### Inside a panel, top to bottom
Fabric surface, charging coils, ferrite shielding, thermal layer, power management board, structural backing, outer fabric.

---

## 3. Known problems to fix before launch

Ranked by how much each one matters. #1 is the one a judge is most likely to ask about.

1. **The battery doesn't fit.** Each panel gets 1/3" of thickness, and a 20,000 mAh pack is probably 0.6 to 1 inch thick. Fix: make the battery a separate snap-on pack that rides on the outside, or make the case thicker.
2. **Group the electronics in one column.** The hub is bottom right but the phone pad is top middle, so wires cross 3 hinges. Moving the phone pad, the watch and earbuds pads, and the hub into the right column cuts that to 2 hinges inside one strip.
3. **The storage pockets flip upside down** in the first fold. They need zippers or flaps.
4. **The tablet stand must fold completely flat,** or it blocks the fold.
5. **Add a 24-inch desk mode.** Let the storage column fold under so the mat opens to 24" x 18". A 36" mat is wider than most school desks.
6. **Turn the pads off when the case is closed.** A small magnet sensor stops it from heating up inside a backpack.
7. **Add a closure.** Nothing holds it shut right now. A magnetic strap or a zip band would work.

If #1 or #5 changes the specs, update section 2 and the site copy before the business plan, banner and video use the old numbers.

---

## 4. Site map

| Page | What's on it |
|---|---|
| **Home** | Hero with the logo and tagline, product photo or the 3D model, 4 feature blurbs, a "Shop now" button |
| **Shop / Product** | Colorway picker, battery yes/no option, price, quantity, Add to Cart |
| **How It Folds** | The interactive 3D fold model, embedded |
| **Specs** | The tables from section 2, plus the power budget bar |
| **About** | OTGTech, mission, team and departments |
| **Contact** | Email, phone, a contact form that doesn't actually send anywhere |
| **Cart** | Line items, quantity changes, subtotal |
| **Checkout** | Name, address, card field, order confirmation |
| **Footer, every page** | The VE disclaimer, contact info, nav links |

### Products and SKUs
Suggested: 3 colorways x 2 versions = **6 SKUs**.
- OTGTech, Black / Navy Blue / Gray
- OTGTech + Battery, Black / Navy Blue / Gray

**Prices are not set yet.** They should come from the firm's COGS and margin work in Accounting so the site matches the business plan.

---

## 5. Website copy, ready to use

**Hero headline:** OTGTech
**Hero subhead:** Organize. Charge. Go.
**Secondary line:** One case. Every device. Always ready.

**Feature blurbs**
- **Multi-Device Charging:** Phone, watch, earbuds and a USB-C device at once, sharing one 65 W power budget.
- **Smart Organization:** A full storage column for cables, chargers, pens and small devices. No tangled cords.
- **Clean 3x3 Fold:** Nine 12" x 6" panels fold into one 12" x 6" x 3" case. Electronics never cross a hinge.
- **Travel-Ready Battery:** An optional 74 Wh battery module, under the FAA 100 Wh carry-on limit.

**Made for:** Study, Work, Travel, Home.
**Space note:** The open mat needs a 36" surface, like a library table, dorm desk or work desk.

**FAQ starters**
- *Can it charge everything at full speed at once?* Everything shares 65 W. The phone, watch and earbuds pads get power first, and the USB-C port gets the rest, which is 30 W with all pads in use.
- *Can I fly with it?* Yes. The battery is 74 Wh, under the 100 Wh FAA limit. Keep it in your carry-on, not checked luggage.
- *Does it work with Apple Watch?* Yes, through an Apple-certified charging module. **Confirm this before publishing.**
- *What adapter do I need?* A USB-C PD adapter. 100 W is recommended.

---

## 6. Brand style

From `otgtech-product-sheet.html`.

### Colors
| Use | Hex |
|---|---|
| Page background | `#0d141c` |
| Card / panel | `#141e29` |
| Raised panel | `#1b2836` |
| Borders | `#2a3a4c` |
| Main text | `#eef3f8` |
| Secondary text | `#9fb0c2` |
| Brand blue, the "Tech" in the logo | `#2b8cff` |
| Light blue, headings | `#6fb1ff` |
| Charging green | `#3ddc84` |
| Power / battery amber | `#ffb547` |

### Colorway swatches
| Colorway | Hex |
|---|---|
| Black | `#16191d` |
| Navy Blue | `#1f3354` |
| Gray | `#5a5f66` |

### Type
- Font: **Inter** from Google Fonts. Weights 400, 600, 700, 800.
- Logo: "OTG" in white, "Tech" in brand blue, weight 800, tight letter spacing, then a small ™.
- Section headings: small, uppercase, light blue, slightly spaced out.

---

## 7. Build order and checkout rules

### Build order
The rubric scores checkout on whether it works, so a buggy custom cart can lose to a template site. Build in this order:
1. Layout, nav, footer with the disclaimer
2. Product page with colorway and battery options
3. **Cart:** add, remove, change quantity, subtotal
4. **Checkout:** form, card field, confirmation screen
5. Specs, About and Contact pages
6. **Then** the extras: embed the 3D fold model, add the power budget bar

### Checkout security rules
The card field is fake, but someone will eventually type a real card number into it. Build it so that number never goes anywhere:
- Check the format in the browser only, using the **Luhn algorithm**
- **Never** send it to a server, no `fetch` or `POST`
- **Never** save it to `localStorage`
- **Never** `console.log` it
- Clear it from the page as soon as the order is confirmed

Concepts to look up: **Luhn algorithm**, **client-side vs server-side validation**, **PCI DSS**. That last one explains why real stores hand card entry to a payment company instead of touching the number themselves. This is exactly the kind of thing that comes up in a cybersecurity interview.

---

## 8. Files from this project

- **Product sheet:** `otgtech-product-sheet.html`. The corrected one-page sheet with specs, power budget, fold diagram and colors. Use it as the visual reference for the site.
- **3D fold model:** `otgtech-fold-model.html`. You can drag to orbit it, it plays a stop-motion fold animation, and it can step frame by frame. It loads Three.js 0.160.0 from jsDelivr. Use it on the How It Folds page.
---

## 9. Still open

- [x] Product: OTGTech, the charging version
- [x] Firm name: OTGTech
- [ ] Prices for the 6 SKUs
- [ ] Current website rubric from Mrs. Kollen
- [ ] Battery placement, fix #1
- [ ] Apple Watch charging claim, verified
- [ ] Battery runtime, phone charges and weight, checked against a real spec sheet

---

## 10. Progress log (update this after every step)

### Done
- **Step 1, Oct 14, 2026:** 8 page shells (home, shop, how-it-folds, specs, about, contact, cart, checkout). Shared header with the logo badge (`images/otgtech-logo.webp`), nav with a phone menu (`js/nav.js`), footer on every page. Styles in `css/style.css` use the section 6 colors as CSS variables. Header and footer are copied into each HTML file on purpose: no build step.
- **Footer contact:** email `otgtech.ve@gufsd.org`, TikTok `@otgtech`, Instagram `@otgtech.ven`. No phone number yet.
- **Disclaimer wording**, from the current VE template: `Disclaimer: This Virtual Enterprise online store is for educational purposes only. (2026-2027 – OTGTech)`

- **Step 2, Oct 26-28, 2026:** shop page layout, `js/products.js` and the Brown/Carbon fiber rule in `js/shop.js` (all written by Alex), disabled-option styling.
- **Step 3, Oct 30, 2026 (Claude built it at Alex's request, Alex to review):** Add to Cart, cart page and nav cart count.
  - `js/cart.js` is shared cart code (add, load, save, subtotal, count). `js/cart-page.js` draws the cart. The add-to-cart part of `js/shop.js` is below Alex's lines and marked.
  - The cart saves only `{ sku, qty, note }`. Prices are looked up from `PRODUCTS` every time. Saved data is validated on load, and the cart page uses `textContent`, never `innerHTML`.
  - Whole-dollar prices add exactly, so no cents math. Max 10 of one line.
  - **Assumptions to confirm with the team:** (1) One of Each Bundle lets the customer pick a leather color and a carbon fiber color. (2) Office Bundle has an optional free-text color split. (3) Bundles and the cord are on the shop page below the PortaFold picker. (4) A bundle with different colors is a separate cart line.
  - Checkout page is still a placeholder (step 4).

- **Step 3b, Oct 30, 2026 (Claude built it at Alex's request, Alex to review):**
  - **Look for deals tab** on the shop page, a Deals section (the two bundles) and an Accessories section (the cord). Savings come from `products.js`.
  - **Automatic mix-and-match deals, OFF.** `js/settings.js` has `ENABLE_AUTO_DEALS = false`. The team is checking with Mrs. Kollen before turning it on. When on, `js/deals.js` prices the leather and carbon fiber PortaFolds in the cart the cheapest way using the bundle deals (any colors, any mix), and the cart and checkout show Items, Deals applied and Total. While off, nothing about it shows.
  - **Pricing problem for the team:** 5 One of Each deals cost $4,995, which is $4 LESS than the Office Bundle at $4,999. So the Office Bundle is never the best price, with automatic deals on or off (a customer can add 5 One of Each). The Office Bundle needs a price under $4,995 to be worth having.
  - Carts are capped at 50 separate lines.
- **Step 4, Oct 30, 2026 (Claude built it, Alex chose "Option B", Alex to review):** checkout. `js/luhn.js` (the Luhn check), `js/checkout.js` (form, checks, order, confirmation) and `checkout.html`.
  - Shipping: name, street, city, state, ZIP. Payment: card number, expiry, security code. All checked in the browser only.
  - **Card rules from section 7, all enforced:** no network requests, no form posts, nothing saved, nothing logged, cleared the moment the order is placed. The confirmation page never shows any part of the card.
  - `checkout.html` has a Content-Security-Policy that makes the BROWSER block network requests (`connect-src 'none'`), form submits (`form-action 'none'`) and outside images and scripts. No field has a `name` attribute, so nothing could be submitted even if JavaScript failed.
  - The page says it's a practice store, asks people not to type a real card, and gives the test card `4242 4242 4242 4242`.
  - The order number is made in the browser and is not stored. The order is not kept anywhere (no server in this project). Reloading the confirmation shows an empty cart.
  - **Assumptions to confirm:** shipping is US-style (state and ZIP), there's no email field, and there's no shipping cost or tax. The brief lists none of those.

- **Step 5a, Nov 4, 2026 (Claude built it at Alex's request):** Specs page (`specs.html`, `js/specs.js`).
  - All the tables from section 2 with the exact values, a power budget bar with a text list under it, a Materials and colors table read from `products.js`, the open mat layout table, the panel layers, and three common questions.
  - Updated for what the team decided: the battery is **included** (heading "Battery (included)", "Battery weight" instead of "Added weight"), and the colorways are now the materials and colors from `products.js`.
  - `colorsFor()` moved from `js/shop.js` into `js/cart.js` so the Specs page can use it.
  - **Not published, on purpose:** the "Does it work with Apple Watch?" question (the brief says confirm before publishing). The brief's internal "Verify" note and the known-problems list (section 3) are not on the page.
  - **Things the team must decide, found while building it:**
    1. **Apple Watch is unverified** but is still in the Charging table and on the home page ("watch"). If it can't be confirmed, delete one table row and the word "watch" in the power budget text and the FAQ answer.
    2. **Weight with the included battery (2.5 to 3 lb) is our own sum** of the brief's 1.5 to 2 lb plus the battery's 1 lb. Confirm it.
    3. **Thickness budget (1/3 inch per panel) is published next to an included 20,000 mAh battery** that is probably 0.6 to 1 inch thick. That is known problem #1 and a judge's most likely question. If the battery becomes a snap-on pack or the case gets thicker, the closed size, weights and thickness row all change.
    4. **The layout table puts the phone pad in the middle column and the hub in the right column**, so wires cross hinges. That contradicts the home page claim "Electronics never cross a hinge" (known problem #2). Either adopt fix #2 and update the layout table, or reword the home page blurb.
  - About and Contact pages and the fold model are still to do.

### How It Folds page (Nov 9, 2026, Claude built it at Alex's request, Alex to review)
- `how-it-folds.html` now has a video (`media/portafold-fold.mp4`, about 1.6 MB, plus a poster image) and a 5-step text description under it. Plain HTML `<video controls>`, no JavaScript, works from `file://` and GitHub Pages. The old "coming soon" box is gone. CSS was added at the end of `css/style.css` (additions only).
- The video is a **3D concept animation** rendered from a Three.js scene (not `otgtech-fold-model.html`, which was never provided). The page says so under the video, because VE's AI policy needs accurate disclosure.
- The video shows the three-panel design. On Nov 11 Alex confirmed that design is final, and the rest of the site was updated to match (see the next entry).

### Three-panel design is final (Nov 11, 2026, Claude updated the site at Alex's request, Alex to review)
Alex confirmed the design in the How It Folds video is the final PortaFold. **It replaces the nine-panel design in sections 2, 3, 4 and 5 of the brief above.** Where the brief talks about nine 12" x 6" panels, a 3 x 3 grid, a 12" x 6" x 3" case, a storage column, a tablet stand or the panel layer list, it is out of date. The charging specs, the 65 W power budget, the 74 Wh battery and the FAA note did not change and are still used exactly as written.

**The design:**
- Three 12" x 18" panels side by side, 36" x 18" open. Each panel is about 1/3" thick, so the closed stack is 3 layers, about 12" x 18" x 1".
- Two folds: the right panel folds over the middle, then both fold over the left panel.
- The left panel holds ALL the electronics: a stitched pocket with a fold-flat phone stand charger, a round watch pad, an earbuds pad, a rubber strip with 2 USB-C + 1 USB-A, a padded leather battery door, and a USB-C port on the left edge for the cable. The cable is sold separately (it's the $50 Wired Cord).
- The middle and right panels are plain blue-grey felt in leather binding with cream stitching.
- A flat stitched leather band (about 2") with the round OTG badge wraps the closed stack. Leather outer (brown in the video). No handle, buckles or zippers.

**Files changed:**
- `index.html`: the "Clean 3x3 Fold" blurb is now "Two Simple Folds" (three 12" x 18" panels, about 12" x 18" x 1" closed, electronics on one panel so no wires cross a fold). The "Smart Organization" blurb no longer mentions a storage column. The meta description and footer say "a case" instead of "a pencil case".
- `specs.html`: Size and build table rewritten (closed size, panels, fold, thickness, closure). Both case weight rows removed. Layout table is now three columns (left, middle, right panel) with what's on each and how it folds. The 13 to 14 inch laptop note and the "Inside a panel" layer list are removed.
- `how-it-folds.html`: the 5 steps match the video (unplug, phone off and stand flat, right over middle, both over left, band wraps). The cable links to the shop. The AI disclosure caption is unchanged and still accurate.
- `shop.html`: the Wired Cord text says the PortaFold doesn't come with a cable. The product blurb says "A case" instead of "A pencil case".
- `about.html`, `cart.html`, `checkout.html`, `contact.html`: "pencil case" changed to "case" (footer, and the About intro). A 12" x 18" x 1" flat stack isn't a pencil case.
- `css/style.css`: removed the unused `.layer-list` rule.
- `js/specs.js` needed no change (it only fills in the Materials and colors table). `js/products.js`, the cart, the Luhn check and the checkout logic were not touched. The video and poster were not swapped.

**Still open, team decisions (none of these are on the public site):**
1. **Battery thickness (known problem #1) is now harder.** A 20,000 mAh / 74 Wh pack is probably 0.6 to 1 inch thick, and each panel is about 1/3". The padded leather battery door is on the left panel, but nobody has shown the battery fits behind it. Options: a thinner or smaller battery, a thicker left panel, or a snap-on pack. Any of these can change the closed size and the battery specs.
2. **Weight.** The old 1.5 to 2 lb (and 2.5 to 3 lb with the battery) was for nine panels, so both rows are off the Specs page. The battery's own "about 1 lb (estimate)" is still shown. The team needs a new case weight.
3. **Apple Watch.** Still unverified. The design has a round watch pad, and the Charging table and home page still say "watch". If it can't be confirmed, see Step 5a item 1.
4. **Where the band goes while the mat is open.** It wraps the closed stack, but nothing says where it's stored when the mat is in use.
5. **Laptop fit.** The old note said the workspace fits a 13 to 14 inch laptop. With 12" x 18" panels the team should measure before putting a laptop claim back.
6. **Inside the electronics panel.** The old layer list (fabric, coils, ferrite, thermal, board, backing, outer fabric) was for every panel. The left panel needs its own layer list, with leather outside.
7. **Carbon fiber version.** The video shows leather. The band, binding and felt for the carbon fiber PortaFold aren't described. The Specs page says "leather band" for both.
8. **"Pencil case" in the brief.** Section 0 and the home copy came from the brief. The site now says "case". Confirm the team is happy with that wording.
9. **The cable is not included**, so every buyer needs the $50 Wired Cord or their own cable. Decide whether the shop should say any USB-C PD cable works (that's a claim the team would have to check first).

**Step 5a items 2 to 4 above are replaced by this list.** Item 4 (wires crossing hinges) is fixed by the new design: all the electronics are on the left panel.

### Product name (Oct 21, 2026)
The product is the **PortaFold**. **OTGTech** is still the firm name and the brand in the logo and hero. Use "the PortaFold" wherever the site means the product itself.

### Pricing draft (from Mrs. Kollen's post, Oct 19, 2026, NOT final; details from Alex, Oct 22)
This replaces the brief's "3 colorways x battery yes/no" product setup. Prices will change, so they stay in `js/products.js` only.
- **Leather:** $499. Colors: Black, Gray, Brown.
- **Carbon fiber:** $599. Colors: Black, Gray only. Carbon fiber is naturally black; other colors need tinted resin or a different fiber woven in.
- **Battery:** the 74 Wh battery is included in every PortaFold. It is no longer an option. That makes known problem #1 (the battery doesn't fit) apply to every unit.
- **One of each material:** $999 (saves $99). The customer picks the colors.
- **Office bundle:** 5 leather + 5 carbon fiber for $4,999 (separately $5,490, saves $491). The customer picks the colors.
- **Wired cord:** $50, sold as its own accessory (a cable to charge a MacBook from the PortaFold, or to charge the PortaFold). It's a separate product, not an add-on to a case. Since Nov 11 the PortaFold doesn't come with a cable, so this is the cable, not a spare.
- **Price format:** Alex chose whole-dollar numbers (`499`) with `toFixed(2)` for display, not cents. Whole numbers add exactly in JavaScript, so there's no floating-point error unless a price ever gets cents.
- **Brown swatch** on the shop page is a placeholder hex (`#5c4033`), not from the brand sheet.
- **Carbon fiber and wireless charging:** real carbon fiber conducts electricity and can interfere with Qi charging. Keep it on the outer shell only, never over the pads. The team should confirm this before the business plan.

### About page (Nov 4, 2026)
- Written by **sikandara09** (pull request #12), then rebuilt by Claude inside the site template (header, footer, VE disclaimer, stylesheet) at Alex's request. His commit is kept in the history under his name, and his sections, wording and card and button designs are used.
- Changes from his version: the site template, the brand colors and Inter font, the broken `products.html` link now goes to `shop.html`, and a line saying what the firm makes (the PortaFold).
- **Still needed from the team:** the real mission wording (the sales script says "eliminate clutter and maximise efficiency", which differs from the mission on this page), and the **team and departments** (names, roles). Neither is on the page yet. The "values" are his and haven't been confirmed by the team.
- **Team note (Nov 11, 2026):** Alex took on building the product visuals and the site's media himself, to support Mrs. Kollen and the team. (The How It Folds video was made with AI-assisted code, as its caption discloses.) This is for the log only, not the public page.

### VE AI policy (pasted by Alex, Oct 22, 2026)
> Where AI is used, schools must disclose its use and appropriately cite all sources, including AI-generated content or suggestions. AI should augment the learning experience, not replace intellectual work in the classroom and competitive event submissions.

What this means here: the site needs an AI-use disclosure that Mrs. Kollen approves, and it has to be accurate about who wrote what. The logic judges and employers ask about (`products.js`, the cart math, the Luhn check) stays Alex's work.

### Ground rules agreed with Alex
- Clean, readable code. Never write it to look sloppy or "teenager-written." Authorship stays honest in the git history.
- Alex wrote `js/products.js` and the Brown/Carbon fiber rule in `js/shop.js`. On Oct 30 Alex asked Claude to build the cart, the deals and checkout (including the Luhn check, Option B) because the team is behind. Claude wrote them and flagged it. **Alex should still read `js/cart.js`, `js/luhn.js` and `js/checkout.js` and be able to explain them.** VE's AI policy applies: disclose this.
- "All your pens are yellow" from the first message was probably voice-to-text garble. It was never clarified. Don't add yellow without asking.

### Open questions for Alex (start the next session here, one at a time)
1. **Check question:** in `nav.js`, why does `setAttribute("aria-expanded", isOpen)` matter if the menu already opens and closes visually without it?
2. ~~products.js~~ done by Alex. **Alex should read `js/cart.js`, `js/luhn.js` and `js/checkout.js` line by line** and be able to explain: why prices aren't saved in the cart, why `loadCart` validates, why pages use `textContent`, how the Luhn check works, and why the checkout page has a Content-Security-Policy and fields without `name` attributes.
3. ~~Instagram handle~~: confirmed `otgtech.ven` on Oct 22.
4. Prices: when does Accounting have COGS and margin numbers?
5. About page: mission statement, team member names and roles, and departments. None of these are in the brief.
6. Battery fix #1 (now: does a 74 Wh battery fit in a ~1/3" left panel behind the battery door?): decided yet? It changes the specs page. See the Nov 11 three-panel entry for the other open design decisions.
7. Apple Watch charging claim: verified? Until it is, the FAQ answer stays marked unconfirmed.
8. Current rubric from Mrs. Kollen: does it change anything on the site?
9. Send `otgtech-fold-model.html` and `otgtech-product-sheet.html`. They're needed for step 6. The Specs page is built from the brief's section 2 text. `otgtech-product-sheet.html` would let us check it against the team's one-page sheet.
10. Hosting: GitHub Pages, chosen Oct 20. `main` exists. Alex still has to set `main` as the default branch, decide public vs private, turn on Pages from `main` / root, and test the site on school Wi-Fi. New work goes on a feature branch and gets a PR into `main`.

### Copy audit (Nov 11, 2026, Claude, at Alex's request)
Read every page and `js/` file against the final three-panel design. Everything matched except the Specs "Closure" row, which said "stitched leather band"; the carbon fiber version isn't stitched or leather, so it now says "A flat band, about 2" wide, with the round OTG badge". The How It Folds steps still say "leather band" because they describe the video, which shows the leather version. Not changed, still the team's call: "no wires cross a fold" (home page, inferred from all electronics being on one panel), "No tangled cords", the Apple Watch mention in the Charging table, and the 1/3" panel thickness next to the 74 Wh battery.

### Carbon fiber video fix (Nov 12, 2026, Claude, at Alex's request)
The carbon fiber concept video had carbon weave over the charging panel's inside face, which broke the rule above ("keep it on the outer shell only, never over the pads"). `media/portafold-fold-carbon.mp4` now shows black leather on the inside face of the electronics panel (pads, stand, ports, battery door). Carbon stays on the outside of the closed stack, the edges, the band, and the middle and right panels. The closed carbon photos did not change (only the outside shows). This is a render choice, not a confirmed product spec: the team still has to confirm where carbon fiber goes before any page says so. The How It Folds carbon caption makes no claim about it.

### Home page rework (Nov 13, 2026, Claude built it at Alex's request, Alex to review)
An Opus review of the old home page found the hero was a big copy of the logo already in the header, with the product below the fold. Changes:
- `index.html`: hero now shows the open-mat render (`media/portafold-fold-poster.jpg`) next to the text and a "From $499.00" line. New 4-fact strip (65 W, 74 Wh, 36" x 18", 2 folds, all from the Specs page). New "Choose your material" cards (leather and carbon, closed black renders). Section label is now an `h2` and the feature titles are `h3`. Wording of the feature blurbs is unchanged.
- `js/home.js` (new, about 15 lines): fills in the prices and colors from `products.js` through `casePrice`, `colorsFor` and `formatPrice` in `cart.js`, so prices still live in one place. Alex should read it and be able to explain it.
- `css/style.css`: `.button` now uses dark text (`var(--bg)`) on the brand blue: white on `#2b8cff` is 3.3:1 and WCAG AA needs 4.5:1. Hover is the light blue. Buttons get a keyboard focus outline. The cart count badge in the nav uses dark text for the same reason. This changes buttons on EVERY page, so click through Shop, Cart and Checkout. Unused `.hero-logo` rules removed.
- No new claims. "watch", "No tangled cords" and "no wires cross a fold" are still on the page and still unconfirmed (see the Nov 11 list).
- **Team decisions:** show prices on Home while they are still a draft? Keep a small logo badge above the headline (the brief says the hero has the logo)?
