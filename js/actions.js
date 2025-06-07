//Upload csv file
let csvFileInput = document.getElementById("csvFileInput");
const P = document.getElementById("fileText");
let transactions = [];

document.getElementById("uploadFile").addEventListener("click", () => {
  csvFileInput.click();
});

csvFileInput.addEventListener("change", (e) => {
  if (csvFileInput.files.length > 0) {
    const file = csvFileInput.files[0];
    if (file.name.endsWith(".csv")) {
      P.innerText = file.name;
      P.style.color = "green";
    } else {
      P.innerText = "Please upload a valid .csv file.";
      csvFileInput.value = "";
      P.style.color = "red";
    }
  } else {
    P.innerText = "No file yet";
  }

  const file = e.target.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      let csv = e.target.result;
      let rows = csv.split("\n").filter((row) => row.trim() !== "");
      let headers = rows[0].split(",").map((header) => header.trim());
      transactions = rows.slice(1).map((row) => {
        let values = row.split(",");
        let obj = {};
        headers.forEach((header, i) => (obj[header.trim()] = values[i].trim()));
        return obj;
      });
      let parsedUser = JSON.parse(user);
      let list = JSON.parse(localStorage.getItem("listOfUsers"));
      let existingUser = list.find((u) => u.id == parsedUser.id);
      parsedUser.cards.forEach((card, i) => {
        if (!card.transactions) {
          card.transactions = [];
        } else {
          card.transactions.push(...transactions);
        }

        let userCard = existingUser.cards[i];
        if (userCard) {
          if (!userCard.transactions) {
            userCard.transactions = [];
          }

          userCard.transactions.push(...transactions);
        }
      });
      localStorage.setItem("currentUser", JSON.stringify(parsedUser));
      localStorage.setItem("listOfUsers", JSON.stringify(list));
    };
    reader.readAsText(file);
  }
});

document.getElementById("loadButton").addEventListener("click", function () {
  if (!transactions) {
    return;
  }
  let jsString = `let arr = ${JSON.stringify(transactions, null, 2)};`;
  let blob = new Blob([jsString], { type: "application/json" });
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transactions.js";
  const P = document.createElement("p");
  P.innerHTML = "Loaded successfully";
  P.style.color = "green";
  document.querySelector("main").appendChild(P);
  link.click();
});
