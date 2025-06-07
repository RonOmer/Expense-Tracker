let logOut = document.getElementById("logOutLink");
let user = localStorage.getItem("currentUser");
let currUser = user ? JSON.parse(user) : (window.location.href = "login.html");

//For opening menu
function toggleMenu() {
  document.getElementById("sideMenu").classList.toggle("showMenu");
}

//Loop over menu items
function loopOverMenuNames() {
  let linkesNames = [
    "Home",
    "Charges",
    "Actions",
    "Settings",
    "Recommendations",
  ];
  let urls = [
    "index.html",
    "charges.html",
    "actions.html",
    "settings.html",
    "recommendations.html",
  ];

  for (let i = 0; i < linkesNames.length; i++) {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.href = "../pages/" + urls[i];
    a.textContent = linkesNames[i];
    li.appendChild(a);
    document.getElementById("menu").appendChild(li);
  }
}

logOut.addEventListener("click", () => {
  if (currUser) {
    localStorage.removeItem("currentUser");
    window.location.href = "logIn.html";
  }
});

function loopOverImg() {
  let img = currUser.pic;
  document.getElementById("openMenu").src = img;
  document.getElementById("userImgMenu").src = img;
}

document.getElementById("userName").innerText = currUser.username;

//send message

document.getElementById("msgBtn").addEventListener("click", () => {
  document.getElementById("popup").style.display = "flex";
});

document.getElementById("closeBtn").addEventListener("click", () => {
  popup.style.display = "none";
});

document.getElementById("sendBtn").addEventListener("click", () => {
  const content = textarea.value;
  if (content) {
    alert(`Message sent: ${content}`);
    textarea.value = "";
    popup.style.display = "none";
  } else {
    alert("Please write something before sending.");
  }
});

function updateUser(updatedUser) {
  const usersData = JSON.parse(localStorage.getItem("listOfUsers")) || [];

  for (let i = 0; i < usersData.length; i++) {
    if (usersData[i].id === updatedUser.id) {
      usersData[i] = { ...usersData[i], ...updatedUser };
      break;
    }
  }
  console.log(usersData);
  localStorage.setItem("listOfUsers", JSON.stringify(usersData));
  localStorage.setItem("currentUser", JSON.stringify(currUser));
}

loopOverMenuNames();
loopOverImg();
