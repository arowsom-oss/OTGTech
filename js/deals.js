// deals.js
// Works out the cart totals, including automatic deals (only when they're turned on).
// Needs products.js, settings.js and cart.js loaded first.
//
// The deals are the bundle products, so their prices stay in products.js:
//   One of Each Bundle = 1 leather + 1 carbon fiber PortaFold
//   Office Bundle      = 5 leather + 5 carbon fiber PortaFold
// Colors don't matter for a deal. Any leather goes with any carbon fiber.

const DEAL_RULES = [
  { sku: "PF-BND-ONE", leather: 1, carbon: 1 },
  { sku: "PF-BND-OFF", leather: 5, carbon: 5 }
];

// Counts the leather and carbon fiber PortaFolds in the cart.
// Bundles that are already in the cart, and the cord, don't count.
function countCases(lines) {
  const counts = { leather: 0, carbon: 0 };
  lines.forEach(function (line) {
    const product = findProduct(line.sku);
    if (product.type !== "PortaFold") {
      return;
    }
    if (product.material === "Leather") {
      counts.leather += line.qty;
    } else if (product.material === "Carbon fiber") {
      counts.carbon += line.qty;
    }
  });
  return counts;
}

// The price every PortaFold of one material has, or null if they don't all match.
// (The deal math below needs one price per material. If that ever changes, deals switch
// themselves off instead of giving a wrong price.)
function onePriceFor(material) {
  const prices = PRODUCTS
    .filter(function (p) {
      return p.type === "PortaFold" && p.material === material;
    })
    .map(function (p) {
      return p.price;
    });
  return Math.min.apply(null, prices) === Math.max.apply(null, prices) ? prices[0] : null;
}

// Tries every combination of deals and keeps the cheapest one for the customer.
// A deal is only used if it is strictly cheaper than the full prices.
function bestDeals(leather, carbon, leatherPrice, carbonPrice) {
  let best = { cost: Infinity, deals: [] };

  // ruleIndex says which deal we're deciding on. times is how many of that deal to use.
  function search(ruleIndex, leatherLeft, carbonLeft, dealCost, dealsSoFar) {
    if (ruleIndex === DEAL_RULES.length) {
      // Whatever is left over is charged at the full price
      const cost = dealCost + leatherLeft * leatherPrice + carbonLeft * carbonPrice;
      if (cost < best.cost) {
        best = { cost: cost, deals: dealsSoFar };
      }
      return;
    }
    const rule = DEAL_RULES[ruleIndex];
    const dealPrice = findProduct(rule.sku).price;
    const most = Math.min(
      Math.floor(leatherLeft / rule.leather),
      Math.floor(carbonLeft / rule.carbon)
    );
    for (let times = 0; times <= most; times++) {
      search(
        ruleIndex + 1,
        leatherLeft - times * rule.leather,
        carbonLeft - times * rule.carbon,
        dealCost + times * dealPrice,
        times > 0 ? dealsSoFar.concat([{ sku: rule.sku, times: times }]) : dealsSoFar
      );
    }
  }

  search(0, leather, carbon, 0, []);
  return best;
}

// Everything the cart and checkout need to show:
//   itemsTotal = the lines added up at full price
//   discount   = how much the automatic deals take off (0 when deals are off)
//   deals      = what was applied, like [{ name: "One of Each Bundle", times: 2 }]
//   total      = what the customer pays
function cartTotals(lines) {
  const itemsTotal = cartSubtotal(lines);
  let discount = 0;
  let deals = [];

  if (ENABLE_AUTO_DEALS) {
    const leatherPrice = onePriceFor("Leather");
    const carbonPrice = onePriceFor("Carbon fiber");
    if (leatherPrice !== null && carbonPrice !== null) {
      const counts = countCases(lines);
      const result = bestDeals(counts.leather, counts.carbon, leatherPrice, carbonPrice);
      const fullPrice = counts.leather * leatherPrice + counts.carbon * carbonPrice;
      discount = Math.max(0, fullPrice - result.cost);
      deals = result.deals.map(function (deal) {
        return { name: findProduct(deal.sku).name, times: deal.times };
      });
    }
  }

  return {
    itemsTotal: itemsTotal,
    discount: discount,
    deals: deals,
    total: itemsTotal - discount
  };
}

// "One of Each Bundle × 2, Office Bundle × 1"
function describeDeals(deals) {
  return deals
    .map(function (deal) {
      return deal.name + " × " + deal.times;
    })
    .join(", ");
}
