// shop-cards.js
// The "Choose your PortaFold" cards at the top of the shop page.
// It fills in the colors, and makes each card's button pick that material in the form below.
// It does not change shop.js. It only "clicks" the same radio buttons a person would click,
// so the Brown/Carbon fiber rule, the price and the photo all update by themselves.

// Colors under each card name, like "Black, Gray, Brown" (from products.js)
document.querySelectorAll("[data-material-colors]").forEach(function (span) {
  span.textContent = colorsFor(span.dataset.materialColors).join(", ");
});

// Prices come from the data-material-price spans. shop.js already fills those in.

document.querySelectorAll("[data-pick]").forEach(function (button) {
  button.addEventListener("click", function () {
    const material = button.dataset.pick;
    const radio = document.querySelector('input[name="material"][value="' + material + '"]');
    radio.checked = true;
    // A script that sets .checked does not fire "change" on its own, so we fire it.
    // That runs the listeners in shop.js (graying out Brown, price, photo).
    radio.dispatchEvent(new Event("change", { bubbles: true }));
    document.getElementById("picker").scrollIntoView({ behavior: "smooth" });
  });
});
