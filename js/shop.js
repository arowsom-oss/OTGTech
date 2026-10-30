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


// ============================================================
// Add to Cart (written by Claude, reviewed by Alex)
// Everything above this line is Alex's. Needs products.js and cart.js loaded first.
// ============================================================

// ---------- Prices on the page come from PRODUCTS, never typed into the HTML ----------

// Colors a material comes in, taken from the products (no repeats)
function colorsFor(material) {
  const colors = [];
  PRODUCTS.forEach(function (p) {
    if (p.type === "PortaFold" && p.material === material && colors.indexOf(p.color) === -1) {
      colors.push(p.color);
    }
  });
  return colors;
}

// How much a bundle saves compared to buying its items one by one (0 if it doesn't save anything)
function savingsAmount(sku) {
  const bundle = findProduct(sku);
  let separately = 0;
  if (sku === "PF-BND-ONE") {
    separately = casePrice("Leather") + casePrice("Carbon fiber");
  } else if (sku === "PF-BND-OFF") {
    separately = 5 * casePrice("Leather") + 5 * casePrice("Carbon fiber");
  }
  return Math.max(0, separately - bundle.price);
}

// "Save $99.00 compared to buying them separately." Blank if the bundle isn't cheaper.
function savingsText(sku) {
  const saved = savingsAmount(sku);
  return saved > 0 ? "Save " + formatPrice(saved) + " compared to buying them separately." : "";
}

// Fill in every price and name on the page
document.querySelectorAll("[data-material-price]").forEach(function (span) {
  span.textContent = formatPrice(casePrice(span.dataset.materialPrice));
});
document.querySelectorAll("[data-name-of]").forEach(function (heading) {
  heading.textContent = findProduct(heading.dataset.nameOf).name;
});
document.querySelectorAll("[data-price-of]").forEach(function (element) {
  element.textContent = formatPrice(findProduct(element.dataset.priceOf).price);
});
document.querySelectorAll("[data-savings-of]").forEach(function (span) {
  span.textContent = savingsText(span.dataset.savingsOf);
});
// The little "Save $99.00" badge on each deal (stays hidden if there's no saving)
document.querySelectorAll("[data-badge-of]").forEach(function (badge) {
  const saved = savingsAmount(badge.dataset.badgeOf);
  if (saved > 0) {
    badge.textContent = "Save " + formatPrice(saved);
    badge.hidden = false;
  }
});

// The "mix and match" note only shows once the team turns automatic deals on (settings.js)
document.getElementById("auto-deals-note").hidden = !ENABLE_AUTO_DEALS;

// ---------- Shows a message under a button ----------

function showStatus(element, message, isError) {
  element.textContent = message;
  element.className = "status-message " + (isError ? "status-error" : "status-ok");
}

// Reads a quantity box. Returns a whole number from 1 to MAX_QTY, or null if it's not valid.
function readQuantity(input) {
  const qty = Number(input.value);
  if (input.value === "" || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
    return null;
  }
  return qty;
}

// Tries to add to the cart and tells the customer what happened
function addAndReport(sku, qty, note, statusElement) {
  const result = addToCart(sku, qty, note);
  if (!result.ok) {
    showStatus(statusElement, result.error, true);
    return;
  }
  const message = result.capped
    ? "Your cart now has the most of this item you can order at once (" + MAX_QTY + ")."
    : "Added " + qty + " × " + result.product.name + " to your cart.";
  statusElement.className = "status-message status-ok";
  statusElement.textContent = message + " ";
  const link = document.createElement("a");
  link.href = "cart.html";
  link.textContent = "View cart";
  statusElement.appendChild(link);
}

// ---------- The PortaFold form: pick a material and color, then add ----------

const caseForm = document.getElementById("product-form");
const priceEl = document.getElementById("product-price");
const addStatus = document.getElementById("add-status");
const quantityInput = document.getElementById("quantity");

// The product that matches the picked material AND color (undefined if there isn't one)
function selectedCase() {
  const material = caseForm.querySelector('input[name="material"]:checked').value;
  const color = caseForm.querySelector('input[name="color"]:checked').value;
  return PRODUCTS.find(function (p) {
    return p.material === material && p.color === color;
  });
}

// Show the price of whatever is picked
function updatePrice() {
  const product = selectedCase();
  priceEl.textContent = product ? formatPrice(product.price) : "Not available";
}

caseForm.querySelectorAll('input[name="material"], input[name="color"]').forEach(function (input) {
  input.addEventListener("change", updatePrice);
});
updatePrice();

caseForm.addEventListener("submit", function (event) {
  event.preventDefault();   // stay on the page instead of reloading it

  const product = selectedCase();
  if (!product) {
    // Second layer of protection: the Brown fix above should stop this from happening
    showStatus(addStatus, "That combination isn't available. Please pick another color.", true);
    return;
  }
  const qty = readQuantity(quantityInput);
  if (qty === null) {
    showStatus(addStatus, "Enter a whole number from 1 to " + MAX_QTY + " for the quantity.", true);
    return;
  }
  addAndReport(product.sku, qty, "", addStatus);
});

// ---------- Bundles and the cord ----------

document.querySelectorAll(".extra-card").forEach(function (card) {
  const sku = card.dataset.sku;
  const status = card.querySelector(".status-message");
  const qtyBox = card.querySelector('input[name="quantity"]');

  // The One of Each bundle's color pickers: fill them from the products
  const leatherSelect = card.querySelector('select[name="leather-color"]');
  const carbonSelect = card.querySelector('select[name="carbon-color"]');
  [[leatherSelect, "Leather"], [carbonSelect, "Carbon fiber"]].forEach(function (pair) {
    const select = pair[0];
    if (!select) {
      return;
    }
    colorsFor(pair[1]).forEach(function (color) {
      select.appendChild(new Option(color, color));
    });
  });

  card.addEventListener("submit", function (event) {
    event.preventDefault();

    const qty = readQuantity(qtyBox);
    if (qty === null) {
      showStatus(status, "Enter a whole number from 1 to " + MAX_QTY + " for the quantity.", true);
      return;
    }

    // The color choices become a short note saved with the cart line
    let note = "";
    if (leatherSelect && carbonSelect) {
      note = "Leather: " + leatherSelect.value + ", Carbon fiber: " + carbonSelect.value;
    }
    const colorsBox = card.querySelector('input[name="colors"]');
    if (colorsBox && colorsBox.value.trim() !== "") {
      note = "Colors: " + colorsBox.value;
    }
    addAndReport(sku, qty, note, status);
  });
});
