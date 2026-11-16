# OTGTech

The online store for **OTGTech**, a Virtual Enterprise firm, selling the **PortaFold**: a case that unfolds into a 36" x 18" desk mat with wireless charging pads and a power hub built in.

This is a practice store for a school Virtual Enterprise class. No real payment is taken, and nothing a visitor types is sent anywhere.

Live site: https://getportafold.com

## How it is built

Plain HTML, CSS and JavaScript. No frameworks and no build step. It is a static site: open `index.html` in a browser, or host it on GitHub Pages.

| Folder or file | What it is |
|---|---|
| `*.html` | The eight pages: Home, Shop, How It Folds, Specs, About, Contact, Cart, Checkout |
| `css/style.css` | All the styles. The colors are CSS variables at the top. |
| `js/products.js` | Every product, SKU and price. Every page reads prices from here. |
| `js/cart.js`, `js/cart-page.js` | The cart: add, change quantity, remove, subtotal |
| `js/checkout.js`, `js/luhn.js` | Checkout, and the Luhn check for the card number |
| `js/shop.js` | The shop page: the material and color picker, and the product photo |
| `images/`, `media/` | Product renders and the fold videos |

## The checkout and the card field

The card field is a practice field, but the code treats it as if it were real:

- The card number is checked in the browser only, with the Luhn algorithm.
- It is never sent anywhere (no `fetch`, no form post), never saved to `localStorage`, and never logged.
- It is cleared from the page the moment the order is placed.
- `checkout.html` has a Content-Security-Policy that makes the browser itself block network requests and form submits.

## AI use

AI tools (Claude, from Anthropic) were used to help build this site: much of the code, the 3D concept renders and the fold animations. The team decides what to build and takes responsibility for it. The product list and prices (`js/products.js`) and the shop page's color and photo picker (`js/shop.js`) were written by a student. The details are on the site's About page. The renders are concept art, not photos of a real product.

## Notes

`CLAUDE.md` is the team's working notes and progress log for this project.
