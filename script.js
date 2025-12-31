const inventory = [
  { name: "Blueberry Kush", category: "Flower", type: "Indica" },
  { name: "Lemon Gummies", category: "Edibles", type: "Edible" },
  { name: "Hybrid Wax", category: "Concentrate", type: "Hybrid" },
  { name: "OG Cartridge", category: "Vape", type: "Indica" }
];

const container = document.getElementById("inventory");

inventory.forEach(item => {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h3>${item.name}</h3>
    <p>${item.category}</p>
    <p>${item.type}</p>
  `;

  container.appendChild(card);
});

document.getElementById("year").textContent = new Date().getFullYear();
