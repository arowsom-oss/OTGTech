// nav.js
// Opens and closes the nav menu on phones.
// On desktop the menu button is hidden by CSS, so this does nothing there.

const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

menuButton.addEventListener("click", function () {
  // toggle() adds the class if it's missing and removes it if it's there.
  // It returns true when the class was just added (menu is now open).
  const isOpen = navLinks.classList.toggle("open");

  // aria-expanded tells screen readers whether the menu is open
  menuButton.setAttribute("aria-expanded", isOpen);
});
