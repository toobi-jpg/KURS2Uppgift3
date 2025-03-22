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
// Snabblänkar data .........................................................

let links = {
  icon: "",
  name: "",
  url: "",
};

// ..........................................................................
// Snabblänkar logik ........................................................
const addLinkBtn = document.querySelector("#add-link-button");
const linkInput = document.querySelector("#link-input");
const linksContainer = document.querySelector("#links-container");

function addLink(icon, name, url) {
  let linkDiv = document.createElement("div");
  linkDiv.classList.add("link-div");

  let linkImg = document.createElement("img");
  linkImg.id = "favicon";

  let linkName = document.createElement("p");
  linkName.id = "quick-link-span";

  let deleteBtn = document.createElement("i");
  deleteBtn.id = "delete-link-button";
  deleteBtn.className = "fa-regular fa-circle-xmark";

  linkDiv.appendChild(linkImg);
  linkDiv.appendChild(linkName);
  linkDiv.appendChild(deleteBtn);
  linksContainer.appendChild(linkDiv);
}

addLinkBtn.addEventListener("click", () => {
  linkInput.classList.add("show-input");
  linkInput.focus();
});

linkInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addUrl();
    linkInput.classList.remove("show-input");
  }
});

function addUrl() {
  let url = linkInput.value;
  console.log("Url inmatad:", url);

  let link = document.createElement("a");
  link.href = url;

  let urlTwo = link.hostname.replace(/^www\./, "");
  let name = urlTwo.replace(/\.[a-z]+$/, "");
  console.log(name);

  linkInput.value = "";
}
