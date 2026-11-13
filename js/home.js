// home.js
// Puts prices and colors on the home page.
// Everything comes from PRODUCTS (products.js) using helpers in cart.js,
// so when a price changes in products.js the home page changes too.

// Hero price: the cheapest PortaFold of any material, like "$499.00".
// The word "From" is already in the HTML, next to this span.
const heroPrice = document.getElementById("hero-price");
const lowest = Math.min(casePrice("Leather"), casePrice("Carbon fiber"));
heroPrice.textContent = formatPrice(lowest);

// Material cards: <span data-material-price="Leather"> gets "$499.00"
document.querySelectorAll("[data-material-price]").forEach(function (span) {
  span.textContent = formatPrice(casePrice(span.dataset.materialPrice));
});

// Material cards: <span data-material-colors="Leather"> gets "Black, Gray, Brown"
document.querySelectorAll("[data-material-colors]").forEach(function (span) {
  span.textContent = colorsFor(span.dataset.materialColors).join(", ");
});

// Single products by SKU: <span data-price-of="PF-CORD-001"> gets "$50.00"
document.querySelectorAll("[data-price-of]").forEach(function (span) {
  const product = findProduct(span.dataset.priceOf);
  if (product) {
    span.textContent = formatPrice(product.price);
  }
});
