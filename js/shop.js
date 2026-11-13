// shop.js
// Grays out Brown when Carbon fiber is picked, because that combination doesn't exist.

// Grab the elements we need from the page
const materialInputs = document.querySelectorAll('input[name="material"]');
const brown = document.querySelector('input[value="Brown"]');
const black = document.querySelector('input[value="Black"]');

// Run this every time the material changes
materialInputs.forEach(function (input) {
  input.addEventListener("change", function () {
    if (input.value === "Carbon fiber") {
      brown.disabled = true;
      if (brown.checked) {
        black.checked = true;
      }
    } else {
      brown.disabled = false;
    }
  });
});
// Map each PortaFold SKU to its product image and caption.
function updatePhoto() {
  const product = selectedCase();

  const photo =
    PRODUCT_PHOTOS[product.sku] ||
    PRODUCT_PHOTOS["PF-LTH-BRN"];

  const image = document.getElementById("product-image");
  const caption = document.getElementById("image-note");

  if (!image || !caption) return;

  image.src = photo.file;
  image.alt = photo.alt;
  caption.textContent = photo.caption;
}
