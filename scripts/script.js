// Tid & datum logik Utan api fetch ........................................
const timeText = document.querySelector("#time-span");
const dateText = document.querySelector("#date-span");

const date = new Date();

function setTime() {
  let date = new Date();
  let hour = date.getHours();
  let minutes = date.getMinutes().toString().padStart(2, "0");
  let time = hour + ":" + minutes;
  timeText.textContent = time;
  setTimeout(setTime, 1000);
}
setTime();

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

const day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let dayIndex = date.getDay();
let dayofWeek = day[dayIndex];
let dayTomorrowIndex = (dayIndex + 1) % 7;
let dayTomorrow = day[dayTomorrowIndex];
let dayAfterTomorrowIndex = (dayIndex + 2) % 7;
let dayAfterTomorrow = day[dayAfterTomorrowIndex];

let year = date.getFullYear();
let fullDate =
  date.getUTCDate() + " " + month[date.getMonth() - 1] + " " + year;
dateText.textContent = fullDate;
// ..........................................................................
// Titel  logik .............................................................
const titel = document.querySelector("#edit-title");
const saveButton = document.querySelector("#save-title-btn");
const storedTitle = localStorage.getItem("titel");
saveButton.style.display = "none";

if (storedTitle) {
  titel.textContent = storedTitle;
} else {
  titel.textContent = "F25D-The Dashboard";
}

saveButton.addEventListener("click", () => {
  console.log("Save button clicked!");
  saveButton.style.display = "none";
  localStorage.setItem("titel", titel.textContent);
});

titel.addEventListener("click", () => {
  titel.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      localStorage.setItem("titel", titel.textContent);
      titel.blur();
      saveButton.style.display = "none";
    }
  });
});

titel.addEventListener("input", () => {
  if (titel.textContent === storedTitle) {
    saveButton.style.display = "none";
  } else {
    saveButton.style.display = "flex";
  }
});

// ..........................................................................
// Snabblänkar logik ........................................................
const addLinkBtn = document.querySelector("#add-link-button");
const linkInput = document.querySelector("#link-input");
const linkInputDiv = document.querySelector("#add-link-div");
const submitLinkBtn = document.querySelector("#add-link-icon-input");
const linksContainer = document.querySelector("#links-container");
const maxLinksText = document.querySelector("#max-links-text");

linkInput.placeholder = "";

function delayedClassApply() {
  setTimeout(() => {
    linkInput.classList.add("delayed-width-input");
  }, 100);
}

function delayedClassRemove() {
  setTimeout(() => {
    linkInput.classList.remove("delayed-width-input");
  }, 100);
  setTimeout(() => {
    linkInputDiv.classList.remove("show-input");
    addLinkBtn.style.display = "flex";
  }, 150);
}

addLinkBtn.addEventListener("click", () => {
  linkInputDiv.classList.add("show-input");
  delayedClassApply();
  linkInput.focus();
  addLinkBtn.style.display = "none";
});

linkInput.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    delayedClassRemove();
    linkInput.value = "";
    linkInput.placeholder = "";
  }
  if (event) {
  }
  if (event.key === "Enter" && Object.keys(links).length > 8) {
    maxLinkReach();
    linkInput.value = "";
  } else if (event.key === "Enter" && Object.keys(links).length < 9) {
    addUrl(linkInput.value);
    delayedClassRemove();
    linkInput.placeholder = "";
  }
});

submitLinkBtn.addEventListener("click", () => {
  if (Object.keys(links).length > 8) {
    maxLinkReach();
  } else {
    addUrl(linkInput.value);
    delayedClassRemove();
  }
});

document.addEventListener("click", (event) => {
  if (
    !addLinkBtn.contains(event.target) &&
    !linkInputDiv.contains(event.target)
  ) {
    delayedClassRemove();
    linkInput.placeholder = "";
  }
});

function maxLinkReach() {
  linkInput.value = "";
  linkInput.placeholder = "Maximum of links reached!";
}

function addUrl(url) {
  url = linkInput.value;
  if (!url.startsWith("https://")) {
    url = "https://" + url;
  }

  let link = document.createElement("a");
  link.href = url;

  //Går säkert att göra snyggare....
  let urlTwo = link.hostname.replace(/^www\./, "");
  let name = urlTwo.replace(/\.[a-z]+$/, "");
  name = name.replace(/^./, name[0].toUpperCase());
  //......

  icon = `https://www.google.com/s2/favicons?domain=${urlTwo}&sz=64`;

  addLinkObject(url, name, icon);

  linkInput.value = "";
}

//För att spara länkar som object i local storage............................
// MAN KAN INTE SPARA OBJEKT I LOCALSTORAGE TYDLIGEN..
// Räddare i nöden https://www.youtube.com/watch?v=xGvhj-f6IgQ
let links = JSON.parse(localStorage.getItem("links")) || {};

function addLinkObject(url, name, icon) {
  links[name] = {
    name: name,
    url: url,
    icon: icon,
  };

  localStorage.setItem("links", JSON.stringify(links));

  createLinkDiv(links);
}

// ..........................................................................
//Lägga till element logik ..................................................
function createLinkDiv(links) {
  linksContainer.innerHTML = "";
  //Detta block har varit det svåraste inom kodning än sålänge för mig. Men också det roligaste!
  //Gamla hederliga for i loop, säkert snyggare med någon forEach men började detta block ett tag innan jag vart säkrare på forEach.
  for (let i = 0; i < Object.keys(links).length; i++) {
    const key = Object.keys(links)[i];
    const linkObject = links[key];
    let linksContainer = document.getElementById("links-container");
    if (!linksContainer) {
      return;
    }

    let linkDiv = document.createElement("div");
    linkDiv.classList.add("link-div");
    linkDiv.id = key;

    if (linksContainer.querySelector(`#${key}`)) {
      continue;
    }

    let linkImg = document.createElement("img");
    linkImg.id = "favicon";
    linkImg.src = linkObject.icon;
    linkImg.alt = linkObject.name + " favicon";

    let linkName = document.createElement("p");
    linkName.id = "quick-link-span";
    linkName.contentEditable = true;
    linkName.spellcheck = false;
    linkName.textContent = linkObject.name;

    //Redigering av namnet & spara logik...
    linkName.addEventListener("click", () => {
      console.log(linkObject.name + " Pressed");

      linkName.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          links[key].name = linkName.textContent;
          localStorage.setItem("links", JSON.stringify(links));
          linkName.blur();
        }
      });
    });

    let linkButton = document.createElement("a");
    linkButton.classList.add("link-href");
    linkButton.href = linkObject.url;
    linkButton.target = "_blank";

    let deleteBtn = document.createElement("i");
    deleteBtn.id = "delete-link-button";
    deleteBtn.className = "fa-regular fa-circle-xmark";
    deleteBtn.addEventListener("click", () => {
      linkDiv.style.width = "20px";
      linkDiv.style.opacity = "0";
      setTimeout(() => {
        delete links[key];
        localStorage.setItem("links", JSON.stringify(links));
        createLinkDiv(links);
      }, 150);
    });

    //Responsiv länk höjd, det funkade till viss del med css endast men höjden vart inte den samma på alla divar hela tiden. AV vilket skäl är jag osäker på men misstänker pga olika storlekar på iconen eller något.
    if (Object.keys(links).length > 5) {
      linkDiv.style.maxHeight = "32px";
    }
    if (Object.keys(links).length > 6) {
      linkDiv.style.maxHeight = "26px";
    }
    if (Object.keys(links).length > 7) {
      linkDiv.style.maxHeight = "22px";
    }
    if (Object.keys(links).length > 8) {
      linkDiv.style.maxHeight = "18px";
      linkName.style.fontSize = "12px";
      deleteBtn.style.transform = "scale(80%) translateY(-5px)";
    }
    //.....

    linkDiv.appendChild(linkImg);
    linkDiv.appendChild(linkName);
    linkDiv.appendChild(linkButton);
    linkDiv.appendChild(deleteBtn);

    if (linksContainer) {
      linksContainer.appendChild(linkDiv);
    } else {
      console.error("Links container not found.");
    }
  }
}

createLinkDiv(links);

// ..........................................................................
// Notes logik ..............................................................
//Känns som en onödigt lång kod för en sådan liten funktion, kom gärna med feedback om man kan göra snyggare här.
const notesText = document.querySelector("#notes-text");
const notesCardContent = document.querySelector("#card-content-notes");
const notesControls = document.querySelector("#notes-controls");
const leftAlignBtn = document.querySelector("#left-align");
const centerAlignBtn = document.querySelector("#center-align");
const rightAlignBtn = document.querySelector("#right-align");

const savedAlign = localStorage.getItem("align");

if (savedAlign === "center") {
  centerAlignBtn.classList.add("active-align");
}
if (savedAlign === "left") {
  leftAlignBtn.classList.add("active-align");
}
if (savedAlign === "right") {
  rightAlignBtn.classList.add("active-align");
}

const savedNotes = localStorage.getItem("notes");

let emptyNotesText = "";

if (savedAlign) {
  notesText.style.textAlign = savedAlign;
} else {
  notesText.style.textAlign = "center";
}

notesText.addEventListener("click", () => {
  notesControls.style.display = "flex";
});

notesText.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    localStorage.setItem("notes", notesText.textContent);
    notesText.blur();
    notesControls.style.display = "none";
    if (!notesText.textContent) {
      notesText.textContent = emptyNotesText;
    }
  }
});

document.addEventListener("click", (event) => {
  if (!notesCardContent.contains(event.target)) {
    notesControls.style.display = "none";
    localStorage.setItem("notes", notesText.textContent);
  }
  if (!notesText.textContent) {
    notesText.textContent = emptyNotesText;
  }
});

leftAlignBtn.addEventListener("click", () => {
  leftAlignBtn.classList.add("active-align");
  centerAlignBtn.classList.remove("active-align");
  rightAlignBtn.classList.remove("active-align");
  notesText.focus();

  notesText.style.textAlign = "left";
  localStorage.setItem("align", notesText.style.textAlign);
});

centerAlignBtn.addEventListener("click", () => {
  leftAlignBtn.classList.remove("active-align");
  centerAlignBtn.classList.add("active-align");
  rightAlignBtn.classList.remove("active-align");
  notesText.focus();

  notesText.style.textAlign = "center";
  localStorage.setItem("align", notesText.style.textAlign);
});

rightAlignBtn.addEventListener("click", () => {
  leftAlignBtn.classList.remove("active-align");
  centerAlignBtn.classList.remove("active-align");
  rightAlignBtn.classList.add("active-align");
  notesText.focus();

  notesText.style.textAlign = "right";
  localStorage.setItem("align", notesText.style.textAlign);
});

if (savedNotes) {
  notesText.textContent = savedNotes;
} else {
  notesText.textContent = emptyNotesText;
}

notesText.addEventListener("input", () => {
  if (notesText.textContent != savedNotes) {
    localStorage.setItem("notes", notesText.textContent);
  }
});
// ..........................................................................
// Position logik ...........................................................
const locationInput = document.querySelector("#location-input");
const locationSpan = document.querySelector("#current-location-span");
const pin = document.querySelector("#pin");
let savedwLocation = localStorage.getItem("wLocation");

function showLocationInput() {
  pin.classList.add("hide-pin");
  locationInput.classList.add("show-input");
  locationInput.focus();
  setTimeout(() => {
    locationInput.style.width = "240px";
  }, 50);
}

function hideLocationInput() {
  locationInput.style.width = "30px";
  setTimeout(() => {
    pin.classList.remove("hide-pin");
    locationInput.classList.remove("show-input");
    locationInput.blur();
  }, 50);
}

pin.addEventListener("click", () => {
  showLocationInput();
});

locationInput.addEventListener("blur", () => {
  hideLocationInput();
});

if (savedwLocation) {
  getLocation(savedwLocation);
  locationSpan.textContent = savedwLocation;
} else {
  getLocation();
  locationSpan.textContent = "Stockholm";
}

locationInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    localStorage.setItem("wLocation", locationInput.value);
    getLocation(locationInput.value.toString());
    locationSpan.textContent = localStorage.getItem("wLocation");
    locationInput.value = "";
    locationInput.blur();
    searches.forEach((item) => item.remove());
  }
});

async function getLocation(location = "Stockholm") {
  const url = `https://nominatim.openstreetmap.org/search.php?q=${location}&format=jsonv2`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Response not ok!:", response.status);
    }
    const locationData = await response.json();
    // console.log("Latitude:", locationData[0].lat.slice(0, -5));
    // console.log("Longitude:", locationData[0].lon.slice(0, -5));
    let lat = locationData[0].lat.slice(0, -5);
    let lon = locationData[0].lon.slice(0, -5);

    getWeather(lat, lon);

    ("https://api.open-meteo.com/v1/forecast?latitude=59.33&longitude=18.06&daily=temperature_2m_max,weather_code&forecast_days=3");
  } catch (error) {
    let notFound = "Location not found";
    console.error(notFound);
  }
}

// Väder logik ..............................................................
const todayImage = document.querySelector("#today-img");
const todayCelcius = document.querySelector("#today-celcius-span");
const todayForecast = document.querySelector("#today-forecast-span");

const tomorrowImage = document.querySelector("#tomorrow-img");
const tomorrowCelcius = document.querySelector("#tomorrow-celcius-span");
const tomorrowForecast = document.querySelector("#tomorrow-forecast-span");
document.querySelector("#tomorrow-title").textContent = dayTomorrow;

const thirdImage = document.querySelector("#third-img");
const thirdCelcius = document.querySelector("#third-celcius-span");
const thirdForecast = document.querySelector("#third-forecast-span");
document.querySelector("#third-title").textContent = dayAfterTomorrow;

let clear = "fa-solid fa-sun fa-xl";
let cloud = "fa-solid fa-cloud fa-xl";
let fog = "fa-solid fa-smog fa-xl";
let rain = "fa-solid fa-umbrella fa-xl";
let snow = "fa-solid fa-snowflake fa-xl";
let thunder = "fa-solid fa-cloud-bolt fa-xl";

async function getWeather(lat = "59.32", lon = "18.07") {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,weather_code&forecast_days=3`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Response not ok!: ", response.status);
    }
    const weatherData = await response.json();
    placeWeather(weatherData);
  } catch (error) {
    console.error(error.message);
  }
}

function placeWeather(data) {
  let celcius = data.daily.temperature_2m_max;
  let forecast = data.daily.weather_code;

  const images = [todayImage, tomorrowImage, thirdImage];
  const forecasts = [todayForecast, tomorrowForecast, thirdForecast];

  for (let i = 0; i < forecast.length; i++) {
    const wCode = forecast[i];

    if (wCode >= 0 && wCode < 3) {
      images[i].className = clear;
      forecasts[i].textContent = "Clear";
    } else if (wCode >= 3 && wCode < 45) {
      images[i].className = cloud;
      forecasts[i].textContent = "Cloudy";
    } else if (wCode >= 45 && wCode < 61) {
      images[i].className = fog;
      forecasts[i].textContent = "Fog";
    } else if ((wCode >= 61 && wCode < 71) || (wCode >= 80 && wCode <= 82)) {
      images[i].className = rain;
      forecasts[i].textContent = "Rain";
    } else if (wCode >= 71 && wCode < 95) {
      images[i].className = snow;
      forecasts[i].textContent = "Snow";
    } else if (wCode >= 95) {
      images[i].className = thunder;
      forecasts[i].textContent = "Thunder";
    }
  }

  todayCelcius.textContent = `${Math.ceil(celcius[0])}°C`;
  tomorrowCelcius.textContent = `${Math.ceil(celcius[1])}°C`;
  thirdCelcius.textContent = `${Math.ceil(celcius[2])}°C`;
}
// ..........................................................................
// Autocomplete & Huvudstäder api data loggik ...............................
const searchContainer = document.querySelector("#search-filter-container");

let searches = [];

locationInput.addEventListener("keypress", (event) => {
  if (searches.length > 0) {
    searches.forEach((item) => item.remove());
    searches = [];
  }

  let searchLocation = locationInput.value + event.key;
  let count = 0;

  capitalAllData.data.forEach((item) => {
    if (count >= 3) return;

    if (item.capital.includes(searchLocation)) {
      count++;

      let itemDiv = document.createElement("div");
      itemDiv.id = "search-item";
      itemDiv.tabIndex = "0";
      let itemText = document.createElement("p");
      itemText.id = "item-capital-name";
      itemText.textContent = item.capital;
      let itemSpan = document.createElement("span");
      itemSpan.id = "item-country-span";
      itemSpan.textContent = item.name;
      itemText.appendChild(itemSpan);
      itemDiv.appendChild(itemText);
      searchContainer.appendChild(itemDiv);

      searches.push(itemDiv);

      itemDiv.addEventListener("click", () => {
        getLocation(item.capital);
        searches.forEach((item) => item.remove());
        localStorage.setItem("wLocation", item.capital);
        hideLocationInput();
        locationInput.value = "";
        locationSpan.textContent = item.capital;
      });
      itemDiv.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          getLocation(item.capital);
          searches.forEach((item) => item.remove());
          localStorage.setItem("wLocation", item.capital);
          hideLocationInput();
          locationInput.value = "";
          locationSpan.textContent = item.capital;
        }
      });
    }
    if (event.key === "Tab") {
      event.preventDefault();
      itemDiv.focus();
    }
  });
});

locationInput.addEventListener("input", () => {
  if (!locationInput.value) {
    searches.forEach((item) => item.remove());
  }
});

locationInput.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    searches.forEach((item) => item.remove());
    hideLocationInput();
    locationInput.value = "";
  }
});

async function getCapitals() {
  const capitalsURL = "https://countriesnow.space/api/v0.1/countries/capital";
  try {
    const response = await fetch(capitalsURL);
    if (!response.ok) {
      throw new Error("Response not ok!", response.status);
    }
    capitalAllData = await response.json();
  } catch (error) {
    console.error(error.message);
  }
}
getCapitals();
// ..........................................................................
// Bakgrundsbild logik ......................................................
const bg = document.querySelector("#background-image");
const bgBtn = document.querySelector("#bgButton");
