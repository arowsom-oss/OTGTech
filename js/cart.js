// cart.js
// Shared cart code. Every page loads this (after products.js).
// The cart lives in localStorage as a list of lines: { sku, qty, note }.
//
// Prices are NEVER saved in the cart. Each line only stores the SKU, and the
// price is looked up in PRODUCTS (products.js) every time it's needed. That way
// nobody can change a price by editing what's saved in their browser.

const CART_KEY = "otgtech-cart";
const MAX_QTY = 10;       // most of one item per cart line
const MAX_NOTE = 120;     // longest note (like a color choice) we keep
const MAX_LINES = 50;     // most separate lines in one cart (keeps the math fast even if the cart is tampered with)

// ---------- Small helpers ----------

// Finds a product by SKU. Returns undefined if there isn't one.
function findProduct(sku) {
  if (typeof sku !== "string") {
    return undefined;
  }
  return PRODUCTS.find(function (p) {
    return p.sku === sku;
  });
}

// Cheapest price among the PortaFolds of one material
function casePrice(material) {
  const prices = PRODUCTS
    .filter(function (p) {
      return p.type === "PortaFold" && p.material === material;
    })
    .map(function (p) {
      return p.price;
    });
  return Math.min.apply(null, prices);
}

// 4999 -> "$4,999.00". Money is always shown with two decimals.
function formatPrice(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

// Tidy up free text: collapse extra spaces and cut it to MAX_NOTE characters.
function cleanNote(note) {
  return String(note || "").replace(/\s+/g, " ").trim().slice(0, MAX_NOTE);
}

// ---------- Reading and saving ----------

// Reads the cart from localStorage and CHECKS it. localStorage is just text in
// the browser, and anyone can edit it, so never trust what comes out of it.
function loadCart() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch (error) {
    return [];   // broken JSON, or storage blocked: start with an empty cart
  }
  if (!Array.isArray(saved)) {
    return [];
  }

  const lines = [];
  saved.forEach(function (item) {
    if (!item || typeof item !== "object") {
      return;
    }
    if (!findProduct(item.sku)) {
      return;                       // not one of our products: drop it
    }
    const qty = Math.floor(Number(item.qty));
    if (!Number.isFinite(qty) || qty < 1) {
      return;                       // nonsense quantity: drop it
    }
    lines.push({
      sku: item.sku,
      qty: Math.min(qty, MAX_QTY),
      note: cleanNote(item.note)
    });
  });
  return lines.slice(0, MAX_LINES);
}

// Saves the cart. Returns true if it worked, false if the browser blocked it
// (private browsing and strict settings can do that).
function saveCart(lines) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
    return true;
  } catch (error) {
    return false;
  }
}

// ---------- Changing the cart ----------

// Adds qty of a product. Same SKU + same note = same line, so the quantities merge.
// Returns { ok: true, capped, product } or { ok: false, error }.
function addToCart(sku, qty, note) {
  const product = findProduct(sku);
  if (!product) {
    return { ok: false, error: "That product isn't available." };
  }
  if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
    return { ok: false, error: "Quantity must be a whole number from 1 to " + MAX_QTY + "." };
  }

  const lines = loadCart();
  const cleanedNote = cleanNote(note);
  const existing = lines.find(function (line) {
    return line.sku === sku && line.note === cleanedNote;
  });

  if (!existing && lines.length >= MAX_LINES) {
    return { ok: false, error: "Your cart is full. Please check out or remove something first." };
  }

  let capped = false;
  if (existing) {
    const total = existing.qty + qty;
    capped = total > MAX_QTY;
    existing.qty = Math.min(total, MAX_QTY);
  } else {
    lines.push({ sku: sku, qty: qty, note: cleanedNote });
  }

  if (!saveCart(lines)) {
    return {
      ok: false,
      error: "Your browser is blocking saved carts, so we couldn't add this. Private browsing can cause that."
    };
  }
  updateCartBadge();
  return { ok: true, capped: capped, product: product };
}

// Sets the quantity of one line. Lines are found by SKU + note, not by position,
// so a cart changed in another tab can't make us edit the wrong line.
function setQuantity(sku, note, qty) {
  const lines = loadCart();
  const line = lines.find(function (l) {
    return l.sku === sku && l.note === note;
  });
  if (!line || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
    return false;
  }
  line.qty = qty;
  return saveCart(lines);
}

function removeLine(sku, note) {
  const lines = loadCart().filter(function (l) {
    return !(l.sku === sku && l.note === note);
  });
  return saveCart(lines);
}

// ---------- Totals ----------

// Whole-dollar prices add up exactly in JavaScript, so plain math is safe here.
// (If a price ever gets cents, switch to working in cents.)
function cartSubtotal(lines) {
  return lines.reduce(function (sum, line) {
    return sum + findProduct(line.sku).price * line.qty;
  }, 0);
}

function cartCount(lines) {
  return lines.reduce(function (sum, line) {
    return sum + line.qty;
  }, 0);
}

// ---------- The little number on the Cart link in the nav ----------

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) {
    return;
  }
  const count = cartCount(loadCart());
  badge.textContent = count;
  badge.hidden = count === 0;

  const link = badge.closest("a");
  if (link) {
    // Screen readers read this instead of the bare number
    link.setAttribute(
      "aria-label",
      count === 0 ? "Cart" : "Cart, " + count + (count === 1 ? " item" : " items")
    );
  }
}

updateCartBadge();
// Refresh when the user comes back with the Back button, or changes the cart in another tab
window.addEventListener("pageshow", updateCartBadge);
window.addEventListener("storage", updateCartBadge);
