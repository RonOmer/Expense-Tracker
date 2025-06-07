let select = document.querySelector("select");
let table = document.createElement("table");
let columns = ["Date", "Business Name", "Category", "Amount"];
let main = document.querySelector("main");
let title = document.createElement("h3");
let categoryObj = {};
let monthAmount = 0.0;
let hasResults = false;
let categories = [];
let expenses;
let month = "01";
let year = 2024;
let barChartExist;
let pieChartExist;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
];
const VALUES = [
  { month: "01", year: 2024 },
  { month: "02", year: 2024 },
  { month: "03", year: 2024 },
  { month: "04", year: 2024 },
  { month: "05", year: 2024 },
  { month: "06", year: 2024 },
  { month: "07", year: 2024 },
  { month: "08", year: 2024 },
  { month: "09", year: 2024 },
  { month: "10", year: 2024 },
  { month: "11", year: 2024 },
  { month: "12", year: 2024 },
  { month: "01", year: 2025 },
];

function createHeaderRow() {
  let tr = document.createElement("tr");
  columns.forEach((col) => {
    let th = document.createElement("th");
    th.innerText = col;
    tr.appendChild(th);
  });
  table.appendChild(tr);
  table.setAttribute("class", "charges-table");
}

//Loop over months
function createSelect() {
  VALUES.forEach((value, i) => {
    let option = document.createElement("option");
    let monthName = MONTHS[i % 12];

    option.value = `${value.year}-${value.month}`;
    option.textContent = `${monthName} ${value.year}`;

    select.appendChild(option);
    document.querySelector("main").appendChild(select);
  });
}

document.querySelector("select").addEventListener("change", (event) => {
  let selectedVal = VALUES.find(
    (value) => `${value.year}-${value.month}` === event.target.value
  );

  month = parseInt(selectedVal.month, 10);
  year = parseInt(selectedVal.year, 10);
  if (selectedVal) {
    localStorage.setItem("date", JSON.stringify({ year, month }));
    createFilteredRows(
      parseInt(selectedVal.month, 10),
      parseInt(selectedVal.year, 10)
    );
  }
});

function firstPerform() {
    localStorage.setItem("date", JSON.stringify({ year, month }));
    createFilteredRows(
      parseInt(month, 10),
      parseInt(year, 10)
    );
  
}

function resetFields() {
  hasResults = false;
  table.innerHTML = "";
  monthAmount = 0;
  categoryObj = {};
  title.innerHTML = "";
  if (pieChartExist) {
    pieChartExist.destroy();
    pieChartExist = null;
  }
}

function createFilteredRows(selectedMonth, selectedYear) {
  let parsedUser = JSON.parse(user);

  resetFields();
  createHeaderRow();
  parsedUser.cards.forEach((card) => {
    card.transactions.forEach((item) => {
      let [day, month, year] = item.Date.split("/").map(Number);
      //If selectedMonth = month in the table
      if (month === selectedMonth && year === selectedYear) {
        //Get the total amount of the month
        monthAmount += parseFloat(item.Amount);

        //Dispaly bar chart
        let monthExpenss = getMonthExpenss(card.transactions, month, year);
        displayBarChart(monthExpenss, month, year);

        //Display pie chart
        displayPieChart(card.transactions, selectedMonth, selectedYear);

        //Amount of the month
        hasResults = true;
        let row = document.createElement("tr");
        //Loop over values in the table and added them
        columns.forEach((col) => {
          let td = document.createElement("td");
          td.innerText = item[col];
          row.appendChild(td);
        });
        table.appendChild(row);
      }
    });
  });

  let monthExpenss = getMonthExpenss(
    parsedUser.cards.flatMap((card) => card.transactions),
    selectedMonth,
    selectedYear
  );
  displayBarChart(monthExpenss, selectedMonth, selectedYear);

  //If the selected month different from month in table
  if (!hasResults) {
    title.innerHTML = "No results";
    main.appendChild(title);
  } else {
    //2 numbers after point
    title.innerHTML = `Month amount ${monthAmount.toFixed(2)}₪`;
    title.setAttribute("class", "titleExpense");
    main.appendChild(title);
  }

  main.appendChild(table);
}

//Chart.js

//Get every expense of month
function getMonthExpenss(transactions, currMonth, currYear) {
  let expenses = [0, 0, 0];
  transactions.forEach((item) => {
    let [day, month, year] = item.Date.split("/").map(Number);

    if (year === currYear && month === currMonth) {
      expenses[2] += parseFloat(item.Amount);
    } else if (year === currYear && month === currMonth - 1) {
      expenses[1] += parseFloat(item.Amount);
    } else if (year === currYear && month === currMonth - 2) {
      expenses[0] += parseFloat(item.Amount);
    }
  });

  return expenses;
}

let getPreviousMonthYear = (month, year, num) => {
  let newMonth = month - num;
  if (newMonth <= 0) {
    newMonth += 12;
    year -= 1;
  }
  return { month: newMonth, year: year };
};

function displayBarChart(monthlyExpenses, selectedMonth, selectedYear) {
  let months = [
    getPreviousMonthYear(selectedMonth, selectedYear, 2),
    getPreviousMonthYear(selectedMonth, selectedYear, 1),
    { month: selectedMonth, year: selectedYear },
  ].map(({ month, year }) => `${month}/${year.toString().slice(-2)}`);
  let bar = document.getElementById("barChart");

  if (barChartExist) {
    barChartExist.destroy();
  }

  barChartExist = new Chart(bar, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: "Expense by month",
          data: monthlyExpenses,
          backgroundColor: ["#FF9999", "#FFCC99", "#99CCFF"],
          borderColor: ["#FF6666", "#FF9966", "#6699CC"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: false,
        },
      },
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

//Pie chart

function displayPieChart(transactions, selectedMonth, selectedYear) {
  let pie = document.getElementById("pieChart");

  let categoryExpenses = {};

  transactions.forEach((item) => {
    let [day, month, year] = item.Date.split("/").map(Number);
    if (month === selectedMonth && year === selectedYear) {
      let category = item.Category;
      let amount = parseFloat(item.Amount);
      categoryExpenses[category] = (categoryExpenses[category] || 0) + amount;
    }
  });

  if (Object.keys(categoryExpenses).length === 0) {
    if (pieChartExist) pieChartExist.destroy();
    return;
  }

  let labels = Object.keys(categoryExpenses);
  let data = Object.values(categoryExpenses);

  if (pieChartExist) {
    pieChartExist.destroy();
  }

  pieChartExist = new Chart(pie, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            "#FF9999",
            "#FFCC99",
            "#99CCFF",
            "#66CC99",
            "#CC99FF",
          ],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Expenses for ${selectedMonth}/${selectedYear}`,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.raw || 0;
              return `${label}: ₪${value.toFixed(2)}`;
            },
          },
        },
      },
    },
  });
}

createSelect();
firstPerform();