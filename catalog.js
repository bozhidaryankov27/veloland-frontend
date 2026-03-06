function loadProducts() {
  fetch("http://127.0.0.1:8080/api/products")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((products) => {
      allProducts = products;
      console.log(products);
      renderProducts(products);
      loadCartDropdown();
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error,
      );
    });
}

document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});

function loadCartDropdown() {
  const savedCart = JSON.parse(localStorage.getItem("cart"));
  if (savedCart) {
    cart.push(...savedCart);
    updateCartIcon();
    updateCartDropdown();
  }
}

function renderProducts(products) {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product");
    productCard.dataset.category = product.category;

    productCard.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" />
        <h2>${product.name}</h2>
        <p>Цена: ${product.price} €</p>
        <button class = "buy-btn" data-id = "${product.id}">Добави в количката</button>
    `;
    productsContainer.appendChild(productCard);
  });

  applyFilterLogic();

  const buyButtons = document.querySelectorAll(".buy-btn");
  buyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.id);
      addToCart(productId);
      showToast(
        `Продуктът ${getProductById(productId).name} е добавен в количката.`,
      );
    });
  });
}

function applyFilterLogic() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const products = document.querySelectorAll(".product");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const category = button.dataset.category;

      products.forEach((product) => {
        if (category === "all" || product.dataset.category === category) {
          product.style.display = "block";
          product.classList.add("fade-in");
        } else {
          product.style.display = "none";
        }
      });
    });
  });
}

const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.onscroll = function () {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
};

scrollToTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

const cart = [];

const cartIcon = document.querySelector(".shopping-cart-icon");
const cartCount = document.querySelector(".cart-count");

const cartItemsPreview = document.querySelector(".cart-items-preview");
const cartTotalPreviewPrice = document.getElementById(
  "cart-total-preview-price",
);

const checkoutButton = document.querySelector(".checkout-btn");

function addToCart(productId) {
  const existingProduct = cart.find(
    (item) => Number(item.productId) === productId,
  );

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ productId: productId, quantity: 1 });
  }

  updateCartIcon();
  updateCartDropdown();
  saveCart();
}

let allProducts = [];

function getProductById(id) {
  return allProducts.find((p) => p.id === id);
}

function updateCartIcon() {
  cartCount.innerHTML = "";
  const totalItems = cart.reduce(
    (sum, existingProduct) => sum + existingProduct.quantity,
    0,
  );
  cartCount.textContent = totalItems;
}

function updateCartDropdown() {
  cartItemsPreview.innerHTML = "";
  let totalPrice = 0;

  cart.forEach((item) => {
    const product = getProductById(item.productId);
    if (!product) return;

    const itemElement = document.createElement("div");
    itemElement.classList.add("cart-item-preview");

    itemElement.innerHTML = `
            <span>${product.name}</span>
            <div>
                <button class="decrease-qty" data-id="${product.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-qty" data-id="${product.id}">+</button>
            </div>
        `;
    cartItemsPreview.appendChild(itemElement);
    totalPrice += product.price * item.quantity;
  });

  cartTotalPreviewPrice.textContent = `${totalPrice} €`;
  attachQuantityButtons();
}

function attachQuantityButtons() {
  const decreaseButtons = document.querySelectorAll(".decrease-qty");
  const increaseButtons = document.querySelectorAll(".increase-qty");

  decreaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.id);
      updateQuantityById(productId, -1);
    });
  });

  increaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const productId = Number(button.dataset.id);
      updateQuantityById(productId, 1);
    });
  });
}

function updateQuantityById(productId, change) {
  const item = cart.find((item) => Number(item.productId) === productId);
  if (!item) return;
  item.quantity += change;

  if (item.quantity <= 0) {
    const index = cart.indexOf(item);
    cart.splice(index, 1);
  }

  updateCartIcon();
  updateCartDropdown();
  saveCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

document.addEventListener("DOMContentLoaded", () => {
  function showToast(message) {
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("show");
    }, 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }

  checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) {
      showToast("Количката е празна! Добавете продукти преди да поръчате.");
    } else {
      // Calculate total price
      const totalPrice = cart.reduce((sum, item) => {
        const p = getProductById(item.productId);
        return sum + p.price * item.quantity;
      }, 0);
      const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);

      // Redirect to payment.html with total price as query parameter
      window.location.href = `payment.html?total=${totalPrice}&quantity=${quantity}`;
    }
  });
});
