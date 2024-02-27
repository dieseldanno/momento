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

let users = JSON.parse(localStorage.getItem("users")) || [];

const showPasswordLogin = document.querySelector("#show-password-login");
const showPasswordReg = document.querySelector("#show-password-reg");
const passwordFieldLogin = document.querySelector("#password-login");
const passwordFieldReg = document.querySelector("#password-reg");

function clearInput() {
  let inputField = document.querySelectorAll(
    "input[type='text'], input[type='password']"
  );

  inputField.forEach((field) => (field.value = ""));
}

async function getQuote() {
  try {
    const response = await axios.get("https://api.quotable.io/random");
    const results = response.data;
    randomQuote.textContent = results.content;
    randomAuthor.textContent = `- ${results.author}`;
    return results;
  } catch (error) {
    console.log("Error:", error);
  }
}

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

showPasswordLogin.addEventListener("click", () => {
  toggleVisibility(passwordFieldLogin, showPasswordLogin);
});

showPasswordReg.addEventListener("click", () => {
  toggleVisibility(passwordFieldReg, showPasswordReg);
});

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

  const isValid =
    validateField(usernameReg, userRegError, "Username") &&
    validateField(passwordReg, passRegError, "Password");

  if (!isValid) {
    return;
  }

  if (!userExist) {
    users.push({ username, password });
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

  if (user) {
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
});

proceedLoginBtn.addEventListener("click", () => {
  popupSuccess.classList.remove("open");
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
  errorMsg.style.display = "none";
});

// inputText.addEventListener("click", clearRegField);

// const toggleVisibility = (passwordField, showPassword) => {
//   if (passwordField.type === "password") {
//     passwordField.type = "text";
//     showPassword.classList.remove("fa-eye");
//     showPassword.classList.add("fa-eye-slash");
//   } else {
//     passwordField.type = "password";
//     showPassword.classList.remove("fa-eye-slash");
//     showPassword.classList.add("fa-eye");
//   }
// };

// let userVal = usernameReg.value.trim();
// let passVal = passwordReg.value.trim();

// if (userVal === "") {
//   userRegError.textContent = "Username is required";
//   userRegError.style.display = "block";
//   console.log("username required");
//   return;
// } else if (userVal.length < 5) {
//   userRegError.textContent = "Username needs at least 5 characters";
//   userRegError.style.display = "block";
//   console.log("username < 5");
//   return;
// } else if (passVal === "") {
//   passRegError.textContent = "Password is required";
//   passRegError.style.display = "block";
//   console.log("password required");
//   return;
// } else if (passVal.length < 5) {
//   passRegError.textContent = "Password needs at least 5 characters";
//   passRegError.style.display = "block";
//   console.log("password < 5");
//   return;
// }
