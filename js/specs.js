// specs.js
// Fills in the "Materials and colors" table from products.js, so the colors here always
// match what the shop sells. Needs products.js and cart.js loaded first.

const materialsBody = document.getElementById("materials-body");

// The materials the PortaFold comes in (no repeats, in the order products.js lists them)
const materials = [];
PRODUCTS.forEach(function (product) {
  if (product.type === "PortaFold" && materials.indexOf(product.material) === -1) {
    materials.push(product.material);
  }
});

materials.forEach(function (material) {
  const row = document.createElement("tr");

  const name = document.createElement("th");
  name.scope = "row";
  name.textContent = material;

  const colors = document.createElement("td");
  colors.textContent = colorsFor(material).join(", ");

  row.appendChild(name);
  row.appendChild(colors);
  materialsBody.appendChild(row);
});
