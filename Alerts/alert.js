// LOCAL STORAGE FUNCTIONS

function getProducts() {

  return JSON.parse(
    localStorage.getItem("products")
  ) || [];

}

function saveProducts(products) {

  localStorage.setItem(
    "products",
    JSON.stringify(products)
  );

}

// GET PRODUCTS

const products = getProducts();

// SAMPLE DATA IF STORAGE IS EMPTY


if (products.length === 0) {

  const sampleProducts = [

    {
      id: Date.now(),

      name: "Paracetamol",

      category: "Tablet",

      quantity: 5,

      expiry: "2026-05-08",

      price: 20
    },

    {
      id: Date.now() + 1,

      name: "Vitamin C",

      category: "Supplement",

      quantity: 15,

      expiry: "2026-05-14",

      price: 50
    },

    {
      id: Date.now() + 2,

      name: "Dolo 650",

      category: "Tablet",

      quantity: 3,

      expiry: "2026-06-10",

      price: 30
    },

    {
      id: Date.now() + 3,

      name: "Cough Syrup",

      category: "Syrup",

      quantity: 7,

      expiry: "2026-05-20",

      price: 80
    }

  ];

  saveProducts(sampleProducts);

  location.reload();
}

// TODAY DATE

const today = new Date();

today.setHours(0, 0, 0, 0);

// SELECT HTML ELEMENTS


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

// FUNCTION TO FORMAT DATE


function formatDate(date) {

  return new Date(date)
    .toLocaleDateString();

}

// GET ALERT DATA

function getAlertData() {

  const products = getProducts();




  // EXPIRED PRODUCTS

  const expiredProducts =

    products.filter(product => {

      return new Date(product.expiry)
        < today;

    });




  // EXPIRING SOON PRODUCTS

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




  // LOW STOCK PRODUCTS

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

          <div class="card-top">

            <h3>${product.name}</h3>

            <span class="category">

              ${product.category}

            </span>

          </div>

          <p>

            ${extraInfo(product)}

          </p>

          <div class="price">

            ₹${product.price}

          </div>

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

  // RENDER EXPIRED PRODUCTS
  renderProducts(

    expiredContainer,

    "Expired Products",

    filteredExpired,

    "red",

    "No expired products",

    product => `

      Expired On:
      ${formatDate(product.expiry)}

      <br><br>

      Quantity:
      ${product.quantity}

    `
  );

  // RENDER EXPIRING SOON PRODUCTS
  renderProducts(

    expiringContainer,

    "Expiring Soon",

    filteredExpiring,

    "yellow",

    "No products expiring soon",

    product => `

      Expiry Date:
      ${formatDate(product.expiry)}

      <br><br>

      ${getDaysLeft(product.expiry)}
      days left

    `
  );
  
  // RENDER LOW STOCK PRODUCTS
  renderProducts(

    lowstockContainer,

    "Low Stock",

    filteredLowStock,

    "blue",

    "No low stock alerts",

    product => `

      Quantity Left:
      ${product.quantity}

      <br><br>

      Expiry:
      ${formatDate(product.expiry)}

    `
  );

}

// INITIAL PAGE LOAD
showAlerts();

// SEARCH FUNCTIONALITY
searchInput.addEventListener(

  "input",

  function(event) {

    const value =

      event.target.value
        .toLowerCase();

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




    if (!response.ok) {

      throw new Error(
        "Failed to fetch data"
      );

    }




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
