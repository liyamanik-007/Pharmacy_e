// GET PRODUCTS FROM LOCALSTORAGE
const products =
  JSON.parse(localStorage.getItem("products")) || [];

// SAMPLE DATA IF STORAGE IS EMPTY
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
    },

    {
      name: "Cough Syrup",
      quantity: 7,
      expiry: "2026-05-20"
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

today.setHours(0, 0, 0, 0);

// SELECT ELEMENTS


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

const searchInput =
  document.getElementById(
    "search"
  );

const expiredCount =
  document.getElementById(
    "expired-count"
  );

const expiringCount =
  document.getElementById(
    "expiring-count"
  );

const lowstockCount =
  document.getElementById(
    "lowstock-count"
  );

// FUNCTION TO CALCULATE DAYS LEFT


function getDaysLeft(expiryDate) {

  const expiry =
    new Date(expiryDate);

  const difference =
    expiry - today;

  return Math.ceil(
    difference /
    (1000 * 60 * 60 * 24)
  );
}

// GET ALERT DATA


function getAlertData() {

  const expiredProducts =
    products.filter(product => {

      return new Date(product.expiry)
        < today;

    });



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



  return {
    expiredProducts,
    expiringSoon,
    lowStock
  };
}

// REUSABLE RENDER FUNCTION

function renderProducts(
  container,
  title,
  products,
  colorClass,
  emptyMessage,
  extraInfo
) {

  container.innerHTML = `

    <h2>
      ${title}
      (${products.length})
    </h2>

    ${products.length > 0

      ?

      products.map(product => `

        <div class="alert-card ${colorClass}">

          <h3>${product.name}</h3>

          <p>
            ${extraInfo(product)}
          </p>

        </div>

      `).join("")

      :

      `<p class="empty-message">
        ${emptyMessage}
      </p>`
    }

  `;
}

// DISPLAY ALERTS


function showAlerts(searchValue = "") {

  const {
    expiredProducts,
    expiringSoon,
    lowStock
  } = getAlertData();



  // SUMMARY COUNTS

  expiredCount.textContent =
    expiredProducts.length;

  expiringCount.textContent =
    expiringSoon.length;

  lowstockCount.textContent =
    lowStock.length;



  // SEARCH FILTERING

  const filteredExpired =
    expiredProducts.filter(product => {

      return product.name
        .toLowerCase()
        .includes(searchValue);

    });



  const filteredExpiring =
    expiringSoon.filter(product => {

      return product.name
        .toLowerCase()
        .includes(searchValue);

    });



  const filteredLowStock =
    lowStock.filter(product => {

      return product.name
        .toLowerCase()
        .includes(searchValue);

    });



  // EXPIRED PRODUCTS

  renderProducts(

    expiredContainer,

    "Expired Products",

    filteredExpired,

    "red",

    "No expired products",

    product => `
      Expired On:
      ${product.expiry}
    `
  );



  // EXPIRING SOON

  renderProducts(

    expiringContainer,

    "Expiring Soon",

    filteredExpiring,

    "yellow",

    "No products expiring soon",

    product => `
      Expiry Date:
      ${product.expiry}

      <br><br>

      ${getDaysLeft(product.expiry)}
      days left
    `
  );



  // LOW STOCK

  renderProducts(

    lowstockContainer,

    "Low Stock",

    filteredLowStock,

    "blue",

    "No low stock alerts",

    product => `
      Quantity Left:
      ${product.quantity}
    `
  );
}

// INITIAL LOAD

showAlerts();

// SEARCH FUNCTIONALITY
searchInput.addEventListener(
  "input",
  function(event) {

    const value =
      event.target.value.toLowerCase();

    showAlerts(value);

  }
);

// FETCH API USING ASYNC/AWAIT

async function fetchMedicineData() {

  try {

    const response =
      await fetch(
        "https://dummyjson.com/products"
      );

    const data =
      await response.json();

    console.log(
      "Fetched API Data:",
      data
    );

  }

  catch(error) {

    console.log(
      "Fetch Error:",
      error
    );
  }
}

// CALL FETCH FUNCTION


fetchMedicineData();
