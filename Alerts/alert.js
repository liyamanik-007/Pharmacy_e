const products =
  JSON.parse(localStorage.getItem("products")) || [];
if (products.length === 0) {

  const sampleProducts = [

    {
      name: "Paracetamol",
      quantity: 5,
      expiry: "2026-05-08"
    },

    {
      name: "Vitamin C",
      quantity: 15,
      expiry: "2026-05-14"
    },

    {
      name: "Dolo 650",
      quantity: 3,
      expiry: "2026-06-10"
    }

  ];

  localStorage.setItem(
    "products",
    JSON.stringify(sampleProducts)
  );

  location.reload();
}


// TODAY DATE

const today = new Date();



// EXPIRED PRODUCTS

const expiredProducts =
  products.filter(product => {

    return new Date(product.expiry)
      < today;

  });



// EXPIRING SOON

const expiringSoon =
  products.filter(product => {

    const expiryDate =
      new Date(product.expiry);

    const difference =
      expiryDate - today;

    const daysLeft =
      difference /
      (1000 * 60 * 60 * 24);

    return daysLeft <= 7
      && daysLeft >= 0;

  });




// LOW STOCK

const lowStock =
  products.filter(product => {

    return product.quantity < 10;

  });




// SELECT CONTAINERS

const expiredContainer =
  document.getElementById(
    "expired-container"
  );

const expiringContainer =
  document.getElementById(
    "expiring-container"
  );

const lowstockContainer =
  document.getElementById(
    "lowstock-container"
  );




// SHOW EXPIRED PRODUCTS

expiredContainer.innerHTML =

  `
    <h2>
      Expired Products
      (${expiredProducts.length})
    </h2>

    ${expiredProducts.map(product => `

      <div class="alert-card red">

        <h3>${product.name}</h3>

        <p>
          Expired:
          ${product.expiry}
        </p>

      </div>

    `).join("")}
  `;




// SHOW EXPIRING SOON

expiringContainer.innerHTML =

  `
    <h2>
      Expiring Soon
      (${expiringSoon.length})
    </h2>

    ${expiringSoon.map(product => `

      <div class="alert-card yellow">

        <h3>${product.name}</h3>

        <p>
          Expiry:
          ${product.expiry}
        </p>

      </div>

    `).join("")}
  `;




// SHOW LOW STOCK

lowstockContainer.innerHTML =

  `
    <h2>
      Low Stock
      (${lowStock.length})
    </h2>

    ${lowStock.map(product => `

      <div class="alert-card blue">

        <h3>${product.name}</h3>

        <p>
          Quantity:
          ${product.quantity}
        </p>

      </div>

    `).join("")}
  `;
if (expiredProducts.length === 0) {

  expiredContainer.innerHTML +=
    `<p>No expired products</p>`;
}

if (expiringSoon.length === 0) {

  expiringContainer.innerHTML +=
    `<p>No products expiring soon</p>`;
}

if (lowStock.length === 0) {

  lowstockContainer.innerHTML +=
    `<p>No low stock alerts</p>`;
}