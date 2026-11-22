# E-Commerce Website submission checklist

Due **Wed Dec 2, 2026**. The competition page says 11:59 PM EST and the guidelines say 10:55 PM ET, so plan for **10:55 PM ET**. Aim to submit by **Mon Nov 30**.

Last checked against the live site: **Nov 22, 2026**. "Checked" means a script or test did it. "Person needed" means only a human can do it.

## 1. Competition rules

| Item | Status |
|---|---|
| Site is on an `https` address | Checked. `https://getportafold.com` works |
| `http://` and `www.` send visitors to `https://` | Checked. Both redirect (301) |
| VE disclaimer in the footer of every page | Checked. All 8 pages and the 404 page, live |
| Disclaimer year matches what judges expect | **Person needed.** The footer says `2026-2027`, the competition page showed `2025-2026`. Ask Mrs. Kollen which one |
| Site stays live the whole judging period | **Person needed.** Don't move the domain, rename the repo or turn off GitHub Pages until results are out. The custom domain renewal date is worth checking |
| Firm is listed in the Firm Directory (Marketplace Tools, Firm Admin, Marketing Information) | **Person needed** |
| One entry per firm | **Person needed.** Make sure only one person submits |
| URL submitted in the Competitions Manager | **Person needed** |
| Mrs. Kollen has approved the AI-use wording on the About page | **Person needed.** VE's AI policy requires disclosure |
| Current rubric from the VE Hub compared with this site | **Person needed** |

## 2. The four rubric categories

| Category | What the site has | Where it could still lose stars |
|---|---|---|
| Essential components | Firm name, description, cart, contact info, products with prices, disclaimer. Every internal link works (tested) | No phone number (team decision). Check the mission wording on About |
| Organization and efficiency | Clear nav, add to cart, cart, checkout with a card field and a confirmation page (tested end to end) | Try it on an actual phone. A judge will |
| Marketing effectiveness | Logo, one font (Inter) on every page, hero slider, fold videos | Videos use a three-panel concept render. The captions say so |
| Content and presentation | Spelling audit done Nov 16. Accessibility test passes on every page | Claims below that nobody has confirmed |

## 3. Claims on the site nobody has confirmed

A judge or a customer can ask about each of these. The team has to either confirm it or take it off the page.

- **"watch"** (Apple Watch charging). The brief says to verify. It is on Home and Specs
- **"No tangled cords"** (Home)
- **"No wires cross a fold"** (Home)
- **1/3 inch per panel next to a 74 Wh battery.** The battery is probably 0.6 to 1 inch thick. A judge may ask how it fits
- **Prices** ($399 leather, $499 carbon fiber, $799 One of Each, $3,599 Office Bundle). Accounting should confirm they match the business plan. Old prices may still be in the business plan, the banner and the radio script
- **The mission line** on About. The sales script wording differs

## 4. Day-of checks (do these on Nov 30, then again Dec 2)

1. Open `https://getportafold.com` on a phone, on school Wi-Fi.
2. Play both videos on How It Folds, on the phone.
3. Add each material to the cart, go through checkout with `4242 4242 4242 4242`, and check the confirmation.
4. Open `https://getportafold.com/nope` and check the 404 page.
5. Click every link in the footer.
6. Run `npm test` on the latest `main`. All 28 tests should pass (see below).

## 5. Tests

`npm install`, then `npx playwright install chromium` the first time, then `npm test`. The same tests run on every pull request through GitHub Actions. They check every page in a real browser, tampered carts, the card rules, the checkout security policy, and accessibility.

## 6. Known limits (honest list)

- The site has no server, so a cart or price can always be changed by a person in their own browser. That is fine for a practice store. A real store recalculates prices on the server.
- The checkout Content-Security-Policy blocks background requests, forms, images and scripts. It cannot stop the page navigating to another address. `tests/site.test.js` proves both halves.
- The order is not stored anywhere, so reloading the confirmation shows an empty cart.
