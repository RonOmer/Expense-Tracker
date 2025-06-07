let listOfUsers = [];

function loadUsers() {
  const usersData = localStorage.getItem("listOfUsers");
  if (usersData && usersData !== "null") {
    listOfUsers = JSON.parse(usersData);
  } else {
    listOfUsers = [];
  }
}
