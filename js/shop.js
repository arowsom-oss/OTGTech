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
