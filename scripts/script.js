// Tid & datum logik ........................................................
const timeText = document.querySelector("#time-span");
const dateText = document.querySelector("#date-span");

//SETINTERVAL för att uppdatera varje minut.............
const date = new Date();
let hour = date.getHours();
let minutes = date.getMinutes().toString().padStart(2, "0");
let time = hour + ":" + minutes;
timeText.textContent = time;

const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let year = date.getFullYear();
let fullDate =
  date.getUTCDate() + " " + month[date.getMonth() - 1] + " " + year;
dateText.textContent = fullDate;
// ..........................................................................
// Tid & datum logik ........................................................
