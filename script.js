const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const backdrop = document.createElement("backdrop");

backdrop.classList.add("backdrop");
document.body.appendChild(backdrop);

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  backdrop.classList.toggle("active");
  hamburger.classList.toggle("toggle");
});

backdrop.addEventListener("click", () => {
  navLinks.classList.remove("active");
  backdrop.classList.remove("active");
  hamburger.classList.remove("toggle");
});

let toastTimeout;

function showToast(message) {
  const existingToast = document.querySelector(".toast");
  if (existingToast) {
    existingToast.remove();
    clearTimeout(toastTimeout);
  }

  const toast = document.createElement("div");
  toast.classList.add("toast");
  toast.textContent = message;
  document.body.appendChild(toast);

  void toast.offsetWidth;

  toast.classList.add("show");

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => {
      toast.remove();
    });
  }, 3000);
}

const newsletterForm = document.querySelector(".newsletter-form");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (email) {
      showToast("Благодарим ви, че се абонирахте!");
      emailInput.value = "";
    }
  });
}

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    question.classList.toggle("active");
    const answer = question.nextElementSibling;

    if (question.classList.contains("active")) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    } else {
      answer.style.maxHeight = null;
    }
  });
});
