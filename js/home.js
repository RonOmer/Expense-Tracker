let title = document.getElementById("titleByTime");
let hours = 0;
let creditCard = document.getElementById("creditCard");
let previousAmount = 0;
let nextMonth = 0;
let expenses = "";
let parsedUser = JSON.parse(user);
let now = new Date();
let currMonth = now.getMonth() + 1; //Months start from 0
let currYear = now.getFullYear();

//Get time from computer
function ziroDigit(digit) {
  return digit < 10 ? "0" + digit : digit;
}

function getCurrTime() {
  let time = new Date();
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();
  hours = time.getHours();
  let ampm = hours <= 12 ? "AM" : "PM";

  document.getElementById("time").innerHTML = `${ampm}  ${ziroDigit(
    hours
  )}:${ziroDigit(minutes)}:${ziroDigit(seconds)}`;
  setInterval(getCurrTime, 1000);
}

function getTitleByTime() {
  if (hours >= 5 && hours < 12) {
    title.innerHTML = `Good Morning ${currUser.username}`;
  } else if (hours >= 12 && hours <= 17) {
    title.innerHTML = `Good Afternoon ${currUser.username}`;
  } else {
    title.innerHTML = `Good Evening ${currUser.username}`;
  }
}

//Credit Card
creditCard.addEventListener("click", () => {
  window.location.href = "../pages/charges.html";
});

function getMonthAndYear(currMonth, currYear, num) {
  let newMonth = currMonth + num;
  if (newMonth <= 0) {
    newMonth += 12;
    currYear -= 1;
  } else if (newMonth > 12) {
    //If month > 12 we are in the next year
    newMonth -= 12;
    currYear += 1;
  }
  return { month: newMonth, year: currYear };
}

function sumExpenses(transactions, currMonth, currYear) {
  return (
    transactions
      .filter((item) => {
        //Destructure to array , Split into array and convert it to number and take the values from indexes

        let [day, month, year] = item.Date.split("/").map(Number);
        return currMonth === month && currYear === year;
      })
      //parseFloat convert string to float, the first value is 0
      .reduce((sum, item) => sum + parseFloat(item.Amount), 0)
      .toFixed(2)
  );
}

parsedUser.cards.forEach((card) => {
  //Destructure - variable month gets new name prevMonth with value of month
  let { month: prevMonth, year: prevYear } = getMonthAndYear(
    currMonth,
    currYear,
    -1
  );
  let { month: nextMonth, year: nextYear } = getMonthAndYear(
    currMonth,
    currYear,
    1
  );

  previousAmount = sumExpenses(card.transactions, prevMonth, prevYear);
  expenses = sumExpenses(card.transactions, currMonth, currYear);
  nextMonthAmount = sumExpenses(card.transactions, nextMonth, nextYear);
});

document.getElementById("incomes").innerHTML = "₪0";
document.getElementById("expenses").innerHTML = `₪${expenses}`;

document.getElementById(
  "previous"
).innerHTML = `Previous month's debit amount : ${previousAmount}₪`;
document.getElementById(
  "future"
).innerHTML = `Future debit amount : ${nextMonth}₪`;

getCurrTime();
getTitleByTime();

function birthDayCheck(){
  let birthDate1 = new Date(currUser.birthDate);

  if(birthDate1.getMonth() == now.getMonth() && birthDate1.getDate() == now.getDate()){
    let summary = document.getElementById("summary");

    
    let Btn50 = document.createElement('button');
    Btn50.innerHTML = ("Load 50 Shekel Coupon");
    Btn50.id = "Btn50";
    summary.before(Btn50);

    let divmessage = document.createElement("div");
    divmessage.innerHTML = `Happy Birthday ${currUser.username}! Wishing you a fantastic day!`;

    Btn50.before(divmessage);
    }
}

document.addEventListener('DOMContentLoaded',function(){
  let Btn50 = document.getElementById("Btn50");
  if(currUser.couponLoaded == true){
    Btn50.innerHTML = "Coupon Loaded";
  }

  if(Btn50 != null)
  {
    Btn50.addEventListener('click',function(){
      if(!currUser.hasOwnProperty('couponLoaded')){
        currUser.couponLoaded = false;
      }
      if(currUser.couponLoaded == false){
        currUser.couponLoaded = true;
        Btn50.disabled = true;
        Btn50.innerHTML = "Coupon Loaded";
        document.getElementById("incomes").innerHTML = 50;
        updateExpenses();
      }
      updateUser(currUser);
    })
  }
})

function updateExpenses(){
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
  
  let Transaction1 = {"Date": formattedDate, "Business Name": "Noa and Ron app", "Category": "Birthday coupon", "Amount":"-50"};
  currUser.cards[0].transactions.push(Transaction1);
}

birthDayCheck();