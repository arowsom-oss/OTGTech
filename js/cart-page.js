// cart-page.js
// Draws the cart on cart.html. Needs products.js and cart.js loaded first.
//
// Security note: everything shown here is added with textContent, never
// innerHTML. The cart comes from localStorage (and a color note someone typed),
// so it could hold HTML or a script. textContent shows it as plain text and
// never runs it.

const listEl = document.getElementById("cart-list");
const emptyEl = document.getElementById("cart-empty");
const summaryEl = document.getElementById("cart-summary");
const subtotalEl = document.getElementById("cart-subtotal");
const statusEl = document.getElementById("cart-status");
const headingEl = document.getElementById("cart-heading");
const itemsRowEl = document.getElementById("cart-items-row");
const itemsTotalEl = document.getElementById("cart-items-total");
const dealsRowEl = document.getElementById("cart-deals-row");
const dealsTextEl = document.getElementById("cart-deals-text");
const dealsAmountEl = document.getElementById("cart-deals-amount");

// Makes a tag with a class and some text
function makeEl(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
}

// Puts a message in the hidden live region so screen readers say it out loud
function announce(message) {
  statusEl.textContent = message;
}

// One row of the cart
function buildRow(line) {
  const product = findProduct(line.sku);
  const row = makeEl("li", "cart-row");

  // Name, details and unit price
  const info = makeEl("div", "cart-info");
  info.appendChild(makeEl("span", "cart-name", product.name));

  const details = [];
  if (product.material && product.color) {
    details.push(product.material + " · " + product.color);
  }
  if (line.note) {
    details.push(line.note);
  }
  details.push(formatPrice(product.price) + " each");
  info.appendChild(makeEl("span", "cart-detail", details.join(" · ")));
  row.appendChild(info);

  // Quantity box and Remove button
  const label = product.name + (line.note ? ", " + line.note : "");
  const controls = makeEl("div", "cart-controls");

  const qtyInput = document.createElement("input");
  qtyInput.type = "number";
  qtyInput.className = "qty-input";
  qtyInput.min = 1;
  qtyInput.max = MAX_QTY;
  qtyInput.value = line.qty;
  qtyInput.setAttribute("aria-label", "Quantity for " + label);
  qtyInput.addEventListener("change", function () {
    const qty = Number(qtyInput.value);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      announce("Quantity must be a whole number from 1 to " + MAX_QTY + ".");
      render();   // put the old number back
      return;
    }
    setQuantity(line.sku, line.note, qty);
    announce("Updated " + product.name + " to " + qty + ".");
    render();
  });
  controls.appendChild(qtyInput);

  const removeButton = makeEl("button", "link-button", "Remove");
  removeButton.type = "button";
  removeButton.setAttribute("aria-label", "Remove " + label + " from cart");
  removeButton.addEventListener("click", function () {
    removeLine(line.sku, line.note);
    render();
    announce("Removed " + product.name + " from your cart.");
    headingEl.focus();   // keep keyboard users from losing their place
  });
  controls.appendChild(removeButton);
  row.appendChild(controls);

  // Line total
  row.appendChild(makeEl("span", "cart-line-total", formatPrice(product.price * line.qty)));
  return row;
}

// Redraws the whole cart from what's saved
function render() {
  const lines = loadCart();

  listEl.replaceChildren();
  lines.forEach(function (line) {
    listEl.appendChild(buildRow(line));
  });

  emptyEl.hidden = lines.length > 0;
  summaryEl.hidden = lines.length === 0;

  // Totals. The Items and Deals rows only show when an automatic deal was applied.
  const totals = cartTotals(lines);
  const hasDeals = totals.discount > 0;
  itemsRowEl.hidden = !hasDeals;
  dealsRowEl.hidden = !hasDeals;
  itemsTotalEl.textContent = formatPrice(totals.itemsTotal);
  dealsTextEl.textContent = "Deals applied (" + describeDeals(totals.deals) + ")";
  dealsAmountEl.textContent = "−" + formatPrice(totals.discount);
  subtotalEl.textContent = formatPrice(totals.total);
  updateCartBadge();
}

render();
