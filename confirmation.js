document.addEventListener("DOMContentLoaded", () => {
  const orderDetails = JSON.parse(localStorage.getItem("lastOrder"));

  if (orderDetails) {
    document.getElementById("order-name").textContent =
      orderDetails.customerName;
    document.getElementById("order-address").textContent = orderDetails.address;
    document.getElementById("order-contact").textContent = orderDetails.contact;
    document.getElementById("order-payment-method").textContent =
      orderDetails.paymentMethod;
    document.getElementById("order-total").textContent =
      `${orderDetails.totalPrice} €`;

    localStorage.removeItem("lastOrder");
  } else {
    window.location.href = "index.html";
  }
});
