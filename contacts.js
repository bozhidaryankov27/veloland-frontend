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

const contactForm = document.querySelector(".contact-form");

function validateContactInfo(value) {
  const phoneRegex = /^(0\d{9}|\+359\d{9})$/;
  const gmailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;

  return phoneRegex.test(value) || gmailRegex.test(value);
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const contactInput = contactForm.querySelector("#contactInfo");
    const contactValue = contactInput.value.trim();

    if (!validateContactInfo(contactValue)) {
      showToast("Моля, въведете валиден телефон или Gmail адрес.");
      return;
    }

    showToast("Благодарим ви за обратната връзка!");
    contactForm.reset();
  });
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
