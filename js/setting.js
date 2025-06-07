let selectedCard = currUser.cards[0];
let errorsUserObj = {};
let errorsCardObj = {};
document.getElementById("usernameInput").value = currUser.username;
document.getElementById("email").value = currUser.email;

const DAYS = [
  { 1: "1" },
  { 2: "2" },
  { 3: "3" },
  { 4: "4" },
  { 5: "5" },
  { 6: "6" },
  { 7: "7" },
  { 8: "8" },
  { 9: "9" },
  { 10: "10" },
  { 11: "11" },
  { 12: "12" },
  { 13: "13" },
  { 14: "14" },
  { 15: "15" },
  { 16: "16" },
  { 17: "17" },
  { 18: "18" },
  { 19: "19" },
  { 20: "20" },
];

if (currUser.cards[0].billingDate) {
  document.getElementById("currBillingDate").innerHTML +=
    " " + currUser.cards[0].billingDate;
} else {
  document.getElementById("currBillingDate").innerHTML += 1;
}

function loadSelectOptions() {
  const list = document.getElementById("dates");

  list.innerHTML = "";
  const deafultOption = document.createElement("option");
  deafultOption.innerHTML = "";
  deafultOption.textContent = "Select option";
  deafultOption.disabled = true;
  deafultOption.selected = true;
  list.appendChild(deafultOption);

  DAYS.forEach((day) => {
    const key = Object.keys(day)[0];
    const value = day[key];

    const optElement = document.createElement("option");
    optElement.value = key;
    optElement.textContent = value;
    list.appendChild(optElement);
  });
}

function loadCards() {
  const cards = currUser.cards;
  const selectCards = document.getElementById("cards");

  if (cards.length == 1) {
    const deafultCard = document.createElement("option");
    deafultCard.textContent = maskCreditCardFlexible(
      currUser.cards[0].cardNumber
    );
    selectCards.appendChild(deafultCard);
  }

  if (cards.length > 1) {
    cards.forEach((card) => {
      const option = document.createElement("option");
      option.textContent = maskCreditCardFlexible(card.cardNumber);
      selectCards.appendChild(option);
    });
  }
}

function maskCreditCardFlexible(creditCardNumber) {
  const creditCardStr = creditCardNumber.toString();
  const visibleDigits = 4;
  const maskedLength = creditCardStr.length - visibleDigits;

  const masked = "*".repeat(maskedLength) + creditCardStr.slice(-visibleDigits);
  return masked;
}

document.getElementById("cards").addEventListener("change", function () {
  const selectedValue = this.value;

  const cards = currUser.cards;
  selectedCard = cards.find(
    (card) => maskCreditCardFlexible(card.cardNumber) === selectedValue
  );
  document.getElementById("currBillingDate").innerHTML =
    "Current billing date: " + selectedCard.billingDate;
});

function applyChanges(event) {
  if (event) event.preventDefault();

  changeUserErrors(currUser);

  if (Object.keys(errorsUserObj).length > 0) {
    displayUserErrors();
    return;
  }

  changed = false;
  const newBillingDate = document.getElementById("dates");
  if (
    selectedCard.billingDate !== newBillingDate.value &&
    newBillingDate.value !== "Select option"
  ) {
    selectedCard.billingDate = newBillingDate.value;
    changed = true;
  }
  const userNameInput = document.getElementById("usernameInput");
  const passwordInput = document.getElementById("password");
  const emailInput = document.getElementById("email");
  const picture = document.getElementById("imageUpload");

  if (
    userNameInput.value === currUser.username &&
    passwordInput.value === "" &&
    emailInput.value === currUser.email &&
    !changed &&
    picture.files.length === 0
  ) {
    const error = document.getElementById("error");
    if (error) {
      error.remove();
    }
    const DIV = document.getElementById("apply");
    const P = document.createElement("p");
    P.innerHTML = "Nothing changed";
    P.style.color = "red";
    P.id = "error";
    DIV.appendChild(P);
    return;
  }
  if (picture && picture.files.length > 0) {
    saveUserImage();
  }
  if (userNameInput.value !== currUser.username) {
    currUser.username = userNameInput.value;
  }
  if (passwordInput.value !== currUser.password && passwordInput.value !== "") {
    currUser.password = passwordInput.value;
  }
  if (emailInput.value !== currUser.email) {
    currUser.email = emailInput.value;
  }
  const error = document.getElementById("error");
  if (error) {
    error.remove();
  }
  const DIV = document.getElementById("apply");
  const P = document.createElement("p");
  P.innerHTML = "Changes updated successfully";
  P.style.color = "green";
  DIV.appendChild(P);

  updateUser(currUser);
  setTimeout(() => {
    location.reload();
  }, 2000);
}

function addCard(event) {
  if (event) event.preventDefault();

  const cardNumber = document.getElementById("creditCard").value.trim();
  const expDate = document.getElementById("expDate").value.trim();
  const cvv = document.getElementById("cvv").value.trim();
  const newCard = {
    username: currUser.username,
    cardNumber,
    expDate,
    cvv,
    billingDate: 1,
    transactions: [],
  };

  addCardErrors(newCard);

  if (Object.keys(errorsCardObj).length > 0) {
    displayCardErrors();
    return;
  }

  const DIV = document.getElementById("add-card");
  const P = document.createElement("p");
  P.innerHTML = "Credit card added successfully";
  P.style.color = "green";
  DIV.appendChild(P);

  currUser.cards.push(newCard);
  updateUser(currUser);
  setTimeout(() => {
    location.reload();
  }, 2000);
}

function addCardErrors(card) {
  errorsCardObj = {};

  if (!validExpDate(card.expDate)) {
    errorsCardObj["Exp-date"] = "Expiration date is invalid";
  }
  if (!checkCardNumber(card.cardNumber)) {
    errorsCardObj["credit-card"] = "Card number is invalid";
  }
  if (!checkCVV(card.cvv)) {
    errorsCardObj["CVV"] = "CVV is invalid";
  }
}

function changeUserErrors(user) {
  errorsUserObj = {};

  const userNameInput = document.getElementById("usernameInput");
  const passwordInput = document.getElementById("password");
  const emailInput = document.getElementById("email");

  if (userNameInput !== user.username) {
    if (!checkUsername(user.username)) {
      errorsUserObj["username"] = "Username is invalid";
    }
  }
  if (passwordInput !== user.password) {
    if (!checkPass(user.password)) {
      errorsUserObj["password"] =
        "Password must contain: 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character";
    }
  }
  if (emailInput !== user.email) {
    if (!checkEmail(user.email)) {
      errorsUserObj["email"] = "Email is invalid";
    }
  }
}

function displayCardErrors() {
  const inputs = document.querySelectorAll("#addCard input");
  if (inputs) {
    inputs.forEach((input) => {
      const errs = input.parentElement.querySelectorAll("p");
      errs.forEach((error) => error.remove());
    });

    inputs.forEach((input) => {
      if (errorsCardObj[input.name]) {
        const P = document.createElement("p");
        P.innerHTML = errorsObj[input.name];
        P.style.color = "red";
        input.parentElement.appendChild(P);
      }
    });
  }
}

function displayUserErrors() {
  let inputs = document.querySelectorAll("#changes input");
  if (inputs) {
    inputs.forEach((input) => {
      let errs = input.parentElement.querySelectorAll("p");
      errs.forEach((error) => error.remove());
    });

    inputs.forEach((input) => {
      if (errorsUserObj[input.name]) {
        const P = document.createElement("p");
        P.innerHTML = errorsObj[input.name];
        P.style.color = "red";
        input.parentElement.appendChild(P);
      }
    });
  }
}

function saveUserImage() {
  const fileInput = document.getElementById("imageUpload");
  const file = fileInput.files[0];

  const reader = new FileReader();
  reader.onload = function (event) {
    const base64Image = event.target.result;

    currUser.pic = base64Image;

    localStorage.setItem("currentUser", JSON.stringify(currUser));
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    console.log("No file selected.");
  }
}

loadSelectOptions();
loadCards();
