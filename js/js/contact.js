const form = document.getElementById("contact-form");
const nameInput = document.getElementById("contact-name");
const emailInput = document.getElementById("contact-email");
const messageInput = document.getElementById("contact-message");
const status = document.getElementById("contact-status");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  if (name === "" || message === "" || !email.includes("@")) {
    status.textContent = "Please enter your name, a valid email, and a message.";
    return;
  }

  status.textContent = "Thanks. This is a practice store, so your message was not sent.";

  nameInput.value = "";
  emailInput.value = "";
  messageInput.value = "";
});
