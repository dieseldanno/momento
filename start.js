document.addEventListener("DOMContentLoaded", () => {
  const userOnline = JSON.parse(localStorage.getItem("userOnline"));
  const usernameDisplay = document.querySelector("#usernameDisplay");

  if (userOnline) {
    usernameDisplay.innerText = `Welcome ${userOnline.username}`;
    console.log("Current user: ", userOnline.username);
  }
});

const menuBar = document.querySelector("#menu-bars");
const mobileNav = document.querySelector(".mobile-nav");

// State
let isMobileNavOpen = false;

menuBar.addEventListener("click", () => {
  isMobileNavOpen = !isMobileNavOpen;

  if (isMobileNavOpen) {
    mobileNav.style.display = "flex";
    document.body.style.overflowY = "hidden";
    menuBar.classList.remove("fa-bars");
    menuBar.classList.add("fa-xmark");
  } else {
    mobileNav.style.display = "none";
    document.body.style.overflowY = "auto";
    menuBar.classList.remove("fa-xmark");
    menuBar.classList.add("fa-bars");
  }
});
