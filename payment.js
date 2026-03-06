document.addEventListener("DOMContentLoaded", () => {
  const orderTotalElement = document.getElementById("order-total");
  const paymentForm = document.getElementById("payment-form");
  const cartCount = document.querySelector(".cart-count");
  const cartTotalPreviewPrice = document.getElementById(
    "cart-total-preview-price",
  );

  const params = new URLSearchParams(window.location.search);

  const total = Number(params.get("total"));
  const quantity = Number(params.get("quantity"));

  orderTotalElement.textContent = `${total} €`;
  cartCount.textContent = quantity;
  cartTotalPreviewPrice.textContent = `${total} €`;

  if (quantity === 0) {
    paymentForm.querySelector(".submit-payment").disabled = true;
    showToast("Количката е празна! Добавете продукти преди да поръчате.");
  }

  // Handle form submission
  paymentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const contact = document.getElementById("contact").value.trim();
    const paymentMethod = document.getElementById("payment-method").value;

    function isValidContact(contact) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phonePattern = /^\+?[0-9]{7,15}$/;
      return emailPattern.test(contact) || phonePattern.test(contact);
    }

    if (!name || !address || !contact || !paymentMethod) {
      showToast("Моля, попълнете всички полета.");
      return;
    }

    if (!isValidContact(contact)) {
      showToast("Моля, въведете валиден телефон или имейл адрес.");
      return;
    }

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

    const orderRequest = {
      customerName: name,
      address: address,
      contact: contact,
      paymentMethod: paymentMethod,
      items: savedCart,
    };

    fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderRequest),
    })
      .then((response) => {
        if (!response.ok) {
          showToast("Грешка при обработка на поръчката.");
        }
        return response.json();
      })
      .then((orderResponse) => {
        showToast("Поръчката е успешно изпратена!");
        localStorage.removeItem("cart");
        cartCount.textContent = "0";
        cartTotalPreviewPrice.textContent = "0 €";

        localStorage.setItem("lastOrder", JSON.stringify(orderResponse));

        setTimeout(() => {
          window.location.href = "confirmation.html";
        }, 1000);
      })
      .catch((error) => {
        showToast("Грешка при изпращане на поръчката.");
        console.error("Error:", error);
      });
  });

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
  const paymentMethodSelect = document.getElementById("payment-method");
  const cardDetailsDiv = document.getElementById("card-details");

  paymentMethodSelect.addEventListener("change", (event) => {
    if (event.target.value === "card") {
      cardDetailsDiv.classList.remove("hidden");

      document.getElementById("cardholder-name").required = true;
      document.getElementById("expiry-date").required = true;
      document.getElementById("cvv").required = true;
    } else {
      cardDetailsDiv.classList.add("hidden");

      document.getElementById("cardholder-name").required = false;
      document.getElementById("expiry-date").required = false;
      document.getElementById("cvv").required = false;
    }
  });
});
