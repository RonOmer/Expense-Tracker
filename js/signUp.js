let errorsObj = {};

function signUp(event) {
  if (event) event.preventDefault();

  loadUsers();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();
  const birthDate = document.getElementById("birthDate").value.trim();
  const cardNumber = document.getElementById("creditCard").value.trim();
  const expDate = document.getElementById("expDate").value.trim();
  const cvv = document.getElementById("cvv").value.trim();

  const newUser = {
    id: username + password,
    username,
    email,
    password,
    confirmPassword,
    birthDate,
    cards: [],
    pic: "../assets/images/default-user.png",
  };

  const card = { username, cardNumber, expDate, cvv, transactions: [] };

  errors(newUser, card);

  if (Object.keys(errorsObj).length > 0) {
    displayErros();
    return;
  }

  newUser.cards.push(card);
  listOfUsers.push(newUser);
  localStorage.setItem("listOfUsers", JSON.stringify(listOfUsers));
  window.location.href = "login.html";
}

function errors(newUser, card) {
  errorsObj = {};

  if (!validExpDate(card.expDate)) {
    errorsObj["Exp-date"] = "Expiration date is invalid";
  }
  if (!checkAge(newUser.birthDate)) {
    errorsObj["birthDate"] = "You must be over 16 years old";
  }
  if (!checkUsername(newUser.username)) {
    errorsObj["username"] = "Username is invalid";
  }
  if (!checkPass(newUser.password)) {
    errorsObj["password"] =
      "Password must contain: 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character";
  }
  if (!checkEmail(newUser.email)) {
    errorsObj["email"] = "Email is invalid";
  }
  if (!confirmPass(newUser.password, newUser.confirmPassword)) {
    errorsObj["confirmPassword"] = "Passwords do not match";
  }
  if (!checkCardNumber(card.cardNumber)) {
    errorsObj["credit-card"] = "Card number is invalid";
  }
  if (!checkCVV(card.cvv)) {
    errorsObj["CVV"] = "CVV is invalid";
  }
}

function displayErros() {
  const inputs = document.querySelectorAll("input");
  if (inputs) {
    inputs.forEach((input) => {
      const errs = input.parentElement.querySelectorAll("p");
      errs.forEach((error) => error.remove());
    });

    inputs.forEach((input) => {
      if (errorsObj[input.name]) {
        const P = document.createElement("p");
        P.innerHTML = errorsObj[input.name];
        P.style.color = "red";
        input.parentElement.appendChild(P);
      }
    });
  }
}

//Validation

function validExpDate(expDate) {
  const today = new Date().toISOString().split("T")[0];
  return expDate >= today;
}

function checkAge(birthDate) {
  if (!birthDate) return false;
  const today = new Date();
  const birth = new Date(birthDate);
  const age = today.getFullYear() - birth.getFullYear();
  const isBirthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());
  return age > 16 || (age === 16 && isBirthdayPassed);
}

function checkPass(password) {
  const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
  return pattern.test(password);
}

function checkEmail(email) {
  const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return pattern.test(email);
}

function confirmPass(password, confirmPassword) {
  return password === confirmPassword && confirmPassword !== "";
}

function checkCVV(cvv) {
  const pattern = /^[0-9]{3}$/;
  return pattern.test(cvv);
}

function checkCardNumber(cardNumber) {
  return cardNumber.replace(/-/g, "").length === 16;
}

function checkUsername(username) {
  const pattern = /^[a-zA-Z]{3,20}$/;
  return pattern.test(username);
}

function formatCreditCard(input) {
  // Remove all non-digit characters
  let value = input.value.replace(/\D/g, "");
  // Format with dashes after every 4 digits
  value = value.replace(/(\d{4})(?=\d)/g, "$1-");
  // Update the input field
  input.value = value;
}
