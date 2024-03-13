const loginBtn = document.querySelector("#loginBtn");
const registerBtn = document.querySelector("#registerBtn");
const registerLink = document.querySelector("#register-link");
const loginLink = document.querySelector("#loginLink");
let loginForm = document.querySelector(".login-form");
let registerForm = document.querySelector(".register-form");
let usernameReg = document.querySelector("#username-reg");
let passwordReg = document.querySelector("#password-reg");
let usernameLogin = document.querySelector("#username-login");
let passwordLogin = document.querySelector("#password-login");
const continueBtn = document.querySelector("#popup-continue");
const popupQuote = document.querySelector(".popup-quote");
const popupSuccess = document.querySelector(".popup-success");
const proceedLoginBtn = document.querySelector("#proceed-login");
let randomQuote = document.querySelector(".random-quote");
let randomAuthor = document.querySelector(".random-author");
const errorMsg = document.querySelector(".error-msg");
const errorMsgReg = document.querySelector(".error-msg-reg");
const userLoginError = document.querySelector(".user-error-login");
const userRegError = document.querySelector(".user-error-reg");
const passLoginError = document.querySelector(".password-error-login");
const passRegError = document.querySelector(".password-error-reg");
const showPasswordLogin = document.querySelector("#show-password-login");
const showPasswordReg = document.querySelector("#show-password-reg");
const passwordFieldLogin = document.querySelector("#password-login");
const passwordFieldReg = document.querySelector("#password-reg");

let users = JSON.parse(localStorage.getItem("users")) || [];

// Function for clearing input fields
function clearInput() {
  let inputField = document.querySelectorAll(
    "input[type='text'], input[type='password']"
  );

  inputField.forEach((field) => (field.value = ""));
}

// Function for getting quote with less than 100 characters
async function getQuote() {
  try {
    const response = await axios.get("https://api.quotable.io/random");
    const results = response.data;
    const quoteLength = 100;

    // Check quote length
    if (results.content.length < quoteLength) {
      randomQuote.textContent = results.content;
      randomAuthor.textContent = `- ${results.author}`;
      return results;
    } else {
      return getQuote();
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

// Function for showing/hiding passwords
function toggleVisibility(passwordField, showPassword) {
  if (passwordField.type === "password") {
    passwordField.type = "text";
    showPassword.classList.remove("fa-eye");
    showPassword.classList.add("fa-eye-slash");
  } else {
    passwordField.type = "password";
    showPassword.classList.remove("fa-eye-slash");
    showPassword.classList.add("fa-eye");
  }
}

// Function for displaying error messages
function validateField(field, errorElement, errorMessage) {
  if (field.value.trim() === "") {
    errorElement.textContent = `${errorMessage} is required`;
    errorElement.style.display = "block";
    return false;
  } else if (field.value.length < 5) {
    errorElement.textContent = `${errorMessage} needs at least 5 characters`;
    errorElement.style.display = "block";
    return false;
  }
  return true;
}

// Function for generating userId for every new registered user
function generateUserId() {
  const randomValue = Math.random().toString(36).substring(2, 15);
  return randomValue;
}

showPasswordLogin.addEventListener("click", () => {
  toggleVisibility(passwordFieldLogin, showPasswordLogin);
});

showPasswordReg.addEventListener("click", () => {
  toggleVisibility(passwordFieldReg, showPasswordReg);
});

// Toggling between register form and login form
registerLink.addEventListener("click", (event) => {
  event.preventDefault();
  loginForm.classList.remove("active");
  registerForm.classList.add("active");

  clearInput();
  errorMsgReg.style.display = "none";
  userRegError.style.display = "none";
  passRegError.style.display = "none";
});

loginLink.addEventListener("click", (event) => {
  event.preventDefault();
  loginForm.classList.add("active");
  registerForm.classList.remove("active");

  clearInput();
  errorMsg.style.display = "none";
  userRegError.style.display = "none";
  passRegError.style.display = "none";
});

registerBtn.addEventListener("click", (event) => {
  event.preventDefault();
  userRegError.style.display = "none";
  passRegError.style.display = "none";
  userLoginError.style.display = "none";
  passLoginError.style.display = "none";

  let username = usernameReg.value;
  let password = passwordReg.value;

  console.log("existing users:", users);

  let userExist = users.some((user) => user.username === username);

  // Error handling for input fields
  const isValid =
    validateField(usernameReg, userRegError, "Username") &&
    validateField(passwordReg, passRegError, "Password");

  if (!isValid) {
    return;
  }

  // If user doesn't exist, generate userId, push new username, password, userId to users
  if (!userExist) {
    const userId = generateUserId();
    users.push({ userId, username, password });
    localStorage.setItem("users", JSON.stringify(users));

    popupSuccess.classList.add("open");
    // console.log(JSON.stringify(users));
    clearInput();
    errorMsgReg.style.display = "none";

    console.log("New user registered:", username);
  } else {
    errorMsgReg.textContent = "Username is already taken";
    errorMsgReg.style.display = "block";

    console.log("Username is already taken:", username);
  }
});

loginBtn.addEventListener("click", (event) => {
  event.preventDefault();
  userRegError.style.display = "none";
  passRegError.style.display = "none";
  userLoginError.style.display = "none";
  passLoginError.style.display = "none";

  let username = usernameLogin.value;
  let password = passwordLogin.value;

  const isValid =
    validateField(usernameLogin, userLoginError, "Username") &&
    validateField(passwordLogin, passLoginError, "Password");

  if (!isValid) {
    return;
  }

  let user = users.find(
    (user) => user.username === username && user.password === password
  );

  console.log(user);

  // If successful login, set userOnline object to logged in user
  if (user) {
    localStorage.setItem("userOnline", JSON.stringify(user));

    // alert("login succesfull");
    getQuote().then(() => {
      popupQuote.classList.add("open");
    });

    // clearInput();
    errorMsg.style.display = "none";
  } else {
    errorMsg.textContent = "Wrong username and/or password";
    errorMsg.style.display = "block";
  }
});

continueBtn.addEventListener("click", () => {
  popupQuote.classList.remove("open");
  clearInput();
  window.location.href = "start.html";
});

proceedLoginBtn.addEventListener("click", () => {
  popupSuccess.classList.remove("open");
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
  errorMsg.style.display = "none";
});
