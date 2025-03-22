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
// Snabblänkar logik ........................................................
const addLinkBtn = document.querySelector("#add-link-button");
const linkInput = document.querySelector("#link-input");
const linkInputDiv = document.querySelector("#add-link-div");
const submitLinkBtn = document.querySelector("#add-link-icon-input");
const linksContainer = document.querySelector("#links-container");

function addLink(urlTwo, name, url) {
  let linkDiv = document.createElement("div");
  linkDiv.classList.add("link-div");
  linkDiv.addEventListener("click", () => {
    urlLink = "https://";
    url = urlLink.concat(url);
    console.log("DET FUNKAR!" + url);

    window.open(url, "_blank");
  });

  //icon variable länken skickades inte med genom addUrl funktionen så jag fick lägga denna logik här....
  let getIcon = "https://www.google.com/s2/favicons?domain=";
  icon = getIcon.concat(urlTwo);
  //......
  let linkImg = document.createElement("img");
  linkImg.id = "favicon";
  linkImg.src = icon;
  linkImg.alt = name + " favicon";

  let linkName = document.createElement("p");
  linkName.id = "quick-link-span";
  linkName.textContent = name;

  let deleteBtn = document.createElement("i");
  deleteBtn.id = "delete-link-button";
  deleteBtn.className = "fa-regular fa-circle-xmark";
  deleteBtn.addEventListener("click", () => {
    linkDiv.remove();
  });

  linkDiv.appendChild(linkImg);
  linkDiv.appendChild(linkName);
  linkDiv.appendChild(deleteBtn);
  linksContainer.appendChild(linkDiv);
}

addLinkBtn.addEventListener("click", () => {
  linkInputDiv.classList.add("show-input");
  linkInput.focus();
});

linkInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addUrl();
    linkInputDiv.classList.remove("show-input");
  }
});

submitLinkBtn.addEventListener("click", () => {
  addUrl();
  linkInputDiv.classList.remove("show-input");
});

function addUrl() {
  url = linkInput.value;

  let link = document.createElement("a");
  link.href = url;

  //Går säkert att göra snyggare, denna del var jag tvungen att googla fram och tog ett par timmar att sätta ihop....
  let urlTwo = link.hostname.replace(/^www\./, "");
  let name = urlTwo.replace(/\.[a-z]+$/, "");
  name = name.replace(/^./, name[0].toUpperCase());
  //......

  addLink(url, name, urlTwo);

  linkInput.value = "";
}
