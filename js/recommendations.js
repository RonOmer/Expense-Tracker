let transactions = [];
const MAIN = document.querySelector("main");

const URL =
  "https://yael-ex-expenses-services-299199094731.me-west1.run.app/get-recommendations?lang=en&apiKay=afGre4Eerf223432AXE";

function getTransactionsByMonth(callback) {
  let currentDate = new Date();
  let year = JSON.parse(localStorage.getItem("date"));
  let month = JSON.parse(localStorage.getItem("date"));
  currYear = year ? year.year : year === currentDate.getFullYear();
  currMonth = month ? month.month : currentDate.getMonth()+1;

  JSON.parse(user).cards.forEach((card) => {
    transactions = card.transactions.filter((item) => {
      let [day, month, year] = item.Date.split("/").map(Number);
      return currYear === year && currMonth === month;
    });
    callback();
  });
}





function fetchRecommendations() {
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Content type is JSON
    },
    body: JSON.stringify({ transactions }), // Send the transactions array in the body
  };

  fetch(URL, options)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return res.json();
    })
    .then((data) => {
      MAIN.innerHTML = data.recommendations;
    })
    .catch((error) => {
      const P = document.getElementById("load");
      console.error("Error fetching user information:", error);
      P.innerHTML = "There was an error with data, Try again";
      P.style.color = "red";
      MAIN.appendChild(P);
    });
}

getTransactionsByMonth(fetchRecommendations);
