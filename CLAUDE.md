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

### Product name (Oct 21, 2026)
The product is the **PortaFold**. **OTGTech** is still the firm name and the brand in the logo and hero. Use "the PortaFold" wherever the site means the product itself.

### Pricing draft (from Mrs. Kollen's post, Oct 19, 2026, NOT final; details from Alex, Oct 22)
This replaces the brief's "3 colorways x battery yes/no" product setup. Prices will change, so they stay in `js/products.js` only.
- **Leather:** $499. Colors: Black, Gray, Brown.
- **Carbon fiber:** $599. Colors: Black, Gray only. Carbon fiber is naturally black; other colors need tinted resin or a different fiber woven in.
- **Battery:** the 74 Wh battery is included in every PortaFold. It is no longer an option. That makes known problem #1 (the battery doesn't fit) apply to every unit.
- **One of each material:** $999 (saves $99). The customer picks the colors.
- **Office bundle:** 5 leather + 5 carbon fiber for $4,999 (separately $5,490, saves $491). The customer picks the colors.
- **Wired cord:** $50, sold as its own accessory (a spare or replacement cable to charge a MacBook from the PortaFold, or to charge the PortaFold). It's a separate product, not an add-on to a case.
- **Price format:** Alex chose whole-dollar numbers (`499`) with `toFixed(2)` for display, not cents. Whole numbers add exactly in JavaScript, so there's no floating-point error unless a price ever gets cents.
- **Brown swatch** on the shop page is a placeholder hex (`#5c4033`), not from the brand sheet.
- **Carbon fiber and wireless charging:** real carbon fiber conducts electricity and can interfere with Qi charging. Keep it on the outer shell only, never over the pads. The team should confirm this before the business plan.

### Ground rules agreed with Alex
- Clean, readable code. Never write it to look sloppy or "teenager-written." Authorship stays honest in the git history.
- Alex writes the parts he'll be asked about: `js/products.js`, the Luhn check, and the cart's quantity and subtotal logic. Claude explains the approach, Alex writes it, Claude reviews it.
- "All your pens are yellow" from the first message was probably voice-to-text garble. It was never clarified. Don't add yellow without asking.

### Open questions for Alex (start the next session here, one at a time)
1. **Check question:** in `nav.js`, why does `setAttribute("aria-expanded", isOpen)` matter if the menu already opens and closes visually without it?
2. **Alex's task:** write `js/products.js` from the pricing draft above, with whole-dollar prices. The shop page layout is done (step 2, part 1). The picker logic waits on this file.
3. ~~Instagram handle~~: confirmed `otgtech.ven` on Oct 22.
4. Prices: when does Accounting have COGS and margin numbers?
5. About page: mission statement, team member names and roles, and departments. None of these are in the brief.
6. Battery fix #1 (separate snap-on pack or a thicker case): decided yet? It changes the specs page.
7. Apple Watch charging claim: verified? Until it is, the FAQ answer stays marked unconfirmed.
8. Current rubric from Mrs. Kollen: does it change anything on the site?
9. Send `otgtech-fold-model.html` and `otgtech-product-sheet.html`. They're needed for step 6.
10. Hosting: GitHub Pages, chosen Oct 20. `main` exists. Alex still has to set `main` as the default branch, decide public vs private, turn on Pages from `main` / root, and test the site on school Wi-Fi. New work goes on a feature branch and gets a PR into `main`.
