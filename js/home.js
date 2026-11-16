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

// ---------- Hero: fade between the leather and carbon fiber pictures ----------
// The two <img class="hero-slide"> sit on top of each other. Only the one with the
// class "is-active" is visible (see style.css), so switching is just moving that class.
const HERO_SECONDS = 4.5;            // how long each picture stays. Change this to speed it up or slow it down.

const heroSlides = document.querySelectorAll(".hero-slide");
const heroButtons = document.querySelectorAll(".hero-toggle-button");
let heroIndex = 0;
let heroTimer = null;

// Show slide number `index` and mark the matching button
function showHeroSlide(index) {
  heroIndex = index;
  heroSlides.forEach(function (slide, i) {
    slide.classList.toggle("is-active", i === index);
  });
  heroButtons.forEach(function (button, i) {
    button.classList.toggle("is-active", i === index);
    button.setAttribute("aria-pressed", i === index ? "true" : "false");
  });
}

function startHeroTimer() {
  heroTimer = setInterval(function () {
    showHeroSlide((heroIndex + 1) % heroSlides.length);   // % wraps back to the first picture
  }, HERO_SECONDS * 1000);
}

function stopHeroTimer() {
  clearInterval(heroTimer);
  heroTimer = null;
}

// Clicking a button picks that material and stops the automatic cycle
heroButtons.forEach(function (button, i) {
  button.addEventListener("click", function () {
    stopHeroTimer();
    showHeroSlide(i);
  });
});

// Start cycling, unless the visitor's device is set to reduce motion
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (heroSlides.length > 1 && !reducedMotion) {
  startHeroTimer();
}
