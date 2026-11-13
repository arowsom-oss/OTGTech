// home.js
// Puts prices and colors on the home page.
// Everything comes from PRODUCTS (products.js) using helpers in cart.js,
// so when a price changes in products.js the home page changes too.

// "From $499.00" under the hero buttons: the cheapest PortaFold of any material
const heroPrice = document.getElementById("hero-price");
const lowest = Math.min(casePrice("Leather"), casePrice("Carbon fiber"));
heroPrice.textContent = "From " + formatPrice(lowest);

// Each material card has data-material="Leather" (or "Carbon fiber").
// Fill in its price and its colors, like "$499.00 · Black, Gray, Brown".
document.querySelectorAll("[data-material]").forEach(function (span) {
  const material = span.dataset.material;
  span.textContent = formatPrice(casePrice(material)) + " · " + colorsFor(material).join(", ");
});
