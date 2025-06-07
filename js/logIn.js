let currentUser = {};

function logIn(event) {
  if (event) {
    event.preventDefault();
  }

  loadUsers();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    Error("Empty fields");
    return false;
  }

  let currentUser = listOfUsers.find(
    (user) => user.username === username && user.password === password
  );

  if (currentUser) {
    window.location.href = "index.html";
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  } else {
    Error("Username or password is incorrect");
  }

  return false;
}

function Error(message) {
  const errorDiv = document.getElementById("error");
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.color = "red";
    errorDiv.style.margin = "20px";
    errorDiv.style.textAlign = "center";
  }
}
