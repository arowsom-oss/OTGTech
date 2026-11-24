// home.js
// Puts prices and colors on the home page.
// Everything comes from PRODUCTS (products.js) using helpers in cart.js,
// so when a price changes in products.js the home page changes too.

// Hero price: the cheapest PortaFold of any material, like "$399.00".
// The word "From" is already in the HTML, next to this span.
const heroPrice = document.getElementById("hero-price");
const lowest = Math.min(casePrice("Leather"), casePrice("Carbon fiber"));
heroPrice.textContent = formatPrice(lowest);

// Material cards: <span data-material-price="Leather"> gets its price, like "$399.00"
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

// ---------- Hero slider: fade between the leather and carbon fiber pictures ----------
// The two <img class="hero-slide"> sit on top of each other. Only the one with the
// class "is-active" is visible (see style.css), so switching is just moving that class.
// The slider also shows the price and colors of the picked material, from products.js.
const HERO_SECONDS = 4.5;            // how long each picture stays. Change this to speed it up or slow it down.

const heroCycle = document.getElementById("hero-cycle");
const heroSlides = document.querySelectorAll(".hero-slide");
const heroButtons = document.querySelectorAll(".hero-toggle-button");
const heroNext = document.querySelector(".hero-next");
const heroProgress = document.querySelector(".hero-progress span");
const heroSlidePrice = document.getElementById("hero-slide-price");
const heroSlideColors = document.getElementById("hero-slide-colors");
let heroIndex = 0;
let heroTimer = null;

// The thin progress line under the picture: restart its animation so it fills over HERO_SECONDS
function restartHeroProgress() {
  heroProgress.style.animation = "none";
  heroProgress.offsetWidth;                      // reading this makes the browser notice the reset
  heroProgress.style.animation = "";
}

// Show slide number `index`: move the picture, the buttons, the backdrop color and the price
function showHeroSlide(index) {
  heroIndex = index;
  heroCycle.dataset.slide = index;
  heroSlides.forEach(function (slide, i) {
    slide.classList.toggle("is-active", i === index);
  });
  heroButtons.forEach(function (button, i) {
    button.classList.toggle("is-active", i === index);
    button.setAttribute("aria-pressed", i === index ? "true" : "false");
  });
  const material = heroButtons[index].dataset.material;
  heroSlidePrice.textContent = formatPrice(casePrice(material));
  heroSlideColors.textContent = colorsFor(material).join(", ");
}

function nextHeroSlide() {
  showHeroSlide((heroIndex + 1) % heroSlides.length);   // % wraps back to the first picture
}

function startHeroTimer() {
  stopHeroTimer();
  heroCycle.classList.add("is-playing");
  restartHeroProgress();
  heroTimer = setInterval(function () {
    nextHeroSlide();
    restartHeroProgress();
  }, HERO_SECONDS * 1000);
}

function stopHeroTimer() {
  clearInterval(heroTimer);
  heroTimer = null;
  heroCycle.classList.remove("is-playing");
}

// Clicking a material button, or the arrow, picks a picture and stops the automatic cycle
heroButtons.forEach(function (button, i) {
  button.addEventListener("click", function () {
    stopHeroTimer();
    showHeroSlide(i);
  });
});
heroNext.addEventListener("click", function () {
  stopHeroTimer();
  nextHeroSlide();
});

// Swipe on a phone: drag left or right on the picture to switch
let swipeStartX = null;
heroCycle.addEventListener("pointerdown", function (event) {
  swipeStartX = event.clientX;
});
heroCycle.addEventListener("pointerup", function (event) {
  if (swipeStartX === null) {
    return;
  }
  const distance = event.clientX - swipeStartX;
  swipeStartX = null;
  if (Math.abs(distance) > 40) {                  // a real swipe, not a tap
    stopHeroTimer();
    nextHeroSlide();
  }
});

// Fill in the price and colors for the first picture
showHeroSlide(0);

// Start cycling, unless the visitor's device is set to reduce motion.
// Cycling pauses while the mouse is over the picture, and starts again when it leaves.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let heroStopped = false;                          // becomes true once the visitor picks a picture by hand
heroButtons.forEach(function (b) { b.addEventListener("click", function () { heroStopped = true; }); });
heroNext.addEventListener("click", function () { heroStopped = true; });
if (heroSlides.length > 1 && !reducedMotion) {
  startHeroTimer();
  heroCycle.addEventListener("mouseenter", function () {
    if (!heroStopped) { stopHeroTimer(); }
  });
  heroCycle.addEventListener("mouseleave", function () {
    if (!heroStopped) { startHeroTimer(); }
  });

  // Keyboard users: stop the slides while focus is on anything in the picture area
  // (the arrow, the Leather and Carbon fiber buttons), and start again when focus leaves it.
  const heroArea = heroCycle.closest(".hero-photo") || heroCycle;
  heroArea.addEventListener("focusin", function () {
    if (!heroStopped) { stopHeroTimer(); }
  });
  heroArea.addEventListener("focusout", function (event) {
    if (!heroStopped && !heroArea.contains(event.relatedTarget)) { startHeroTimer(); }
  });
}
