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
const locationDiv = document.querySelector(".location-div");
const locationInput = document.querySelector("#location-input");
const locationSpan = document.querySelector("#current-location-span");
let savedwLocation = localStorage.getItem("wLocation");

function showLocationInput() {
  locationDiv.style.display = "none";
  locationInput.classList.add("show-input");
  locationInput.focus();
  setTimeout(() => {
    locationInput.style.width = "240px";
  }, 50);
}

function hideLocationInput() {
  locationInput.style.width = "30px";
  setTimeout(() => {
    locationDiv.style.display = "flex";
    locationInput.classList.remove("show-input");
    locationInput.blur();
  }, 50);
}

locationSpan.addEventListener("click", () => {
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
    locationSpan.placeholder = "";
    hideLocationInput();
    if (savedKey && location !== "Stockholm" && location !== savedwLocation) {
      fetchLocationImage(savedKey, location);
      console.log("New location image fetched");
    } else if (location == "Stockholm") {
      locationImage.style.backgroundImage = "url(./images/Stockholm.jpg)";
    } else {
      console.log("Saved location image is still set");
    }
  } catch (error) {
    let locationNotFound = "Location not found";
    console.error(locationNotFound);
    showLocationInput();
    locationInput.placeholder = locationNotFound;
  }
}

// Väder logik ..............................................................

const todayForecast = document.querySelector("#today-forecast-span");

const tomorrowForecast = document.querySelector("#tomorrow-forecast-span");
document.querySelector("#tomorrow-title").textContent = dayTomorrow;

const thirdForecast = document.querySelector("#third-forecast-span");
document.querySelector("#third-title").textContent = dayAfterTomorrow;

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

// WMO weather code & images ....................
async function fetchGistData() {
  const gistUrl = `https://api.github.com/gists/9490c195ed2b53c707087c8c2db4ec0c`;

  try {
    const response = await fetch(gistUrl);

    if (!response.ok) {
      throw new Error("Response not ok!: ", response.status);
    }
    const gistData = await response.json();
    const files = gistData.files;
    const firstFile = Object.keys(files)[0];
    const fileContent = files[firstFile].content;
    // Tog 1 timme att lista ut att vid firstFile konverterades formatet till en string... Försökte parsa en string med for in och liknande. Här hade typescript sparat mig tid tror jag!
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Svårast hittills.....
async function placeWeather(data) {
  // wmoData har bilder med som jag matchade id till väder kod men dessa bilder var fula så jag bytte ut mot fontawsome bilder tillslut. Hade kunnat skippa denna typ av itteration.
  let cloudy = "bx bx-cloud";
  let clear = "bx bx-sun";
  let partly = "bx bx-cloud";
  let rain = "bx bx-cloud-rain";
  let snow = "bx bx-cloud-snow";
  let thunder = "bx bx-cloud-lightning";
  const weatherDiv = document.querySelectorAll(".weather-div");
  const celcius = data.daily.temperature_2m_max;
  const forecast = data.daily.weather_code;

  const wmoContent = await fetchGistData();

  forecast.forEach((wcode, index) => {
    if (wmoContent.hasOwnProperty(wcode)) {
      const dayData = wmoContent[wcode].day;
      const nightData = wmoContent[wcode].night;
      const desc = nightData.description;

      const wImage = weatherDiv[index].querySelector("#weather-image");
      const wDesc = weatherDiv[index].querySelector(".forecast-span");
      const weatherAtmo = weatherDiv[index].querySelector(".weather-atmo");

      if (desc.includes("Sunny") || desc.includes("Clear")) {
        weatherAtmo.className = "weather-atmo clear";
        wImage.className = clear;
      }
      if (desc.includes("Cloudy")) {
        weatherAtmo.className = "weather-atmo cloudy";
        wImage.className = cloudy;
      }
      if (desc.includes("Foggy") || desc.includes("Fog")) {
        weatherAtmo.className = "weather-atmo cloudy";
        wImage.className = cloudy;
      }

      if (desc.includes("Partly")) {
        weatherAtmo.className = "weather-atmo partly";
        wImage.className = partly;
      }
      if (desc.includes("Snow")) {
        weatherAtmo.className = "weather-atmo snow";
        wImage.className = snow;
      }
      if (
        desc.includes("Drizzle") ||
        desc.includes("Rain") ||
        desc.includes("Showers") ||
        desc.includes("Hail")
      ) {
        weatherAtmo.className = "weather-atmo rain";
        wImage.className = rain;
      }
      if (desc.includes("Thunderstorm")) {
        weatherAtmo.className = "weather-atmo thunderstorm";
        wImage.className = thunder;
      }

      wDesc.textContent = desc;
    }
  });

  const todayCelcius = document.querySelector("#today-celcius-span");
  const tomorrowCelcius = document.querySelector("#tomorrow-celcius-span");
  const thirdCelcius = document.querySelector("#third-celcius-span");

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
const bgKeyBtn = document.querySelector("#random-background-btn");
const bgBtn = document.querySelector("#random-background-fetch-btn");
const clearBgBtn = document.querySelector("#clearImageStorageBtn");
const infoText = document.querySelector("#clear-info-text");
const randomImageInfo = document.querySelector("#random-image-info-text");
const bgBtnImage = document.querySelector("#newBg-icon");
const clearApiBtn = document.querySelector("#clearApiKeyBtn");
const clearApiInfoText = document.querySelector("#clearApiKey-info-text");
const apiKeyInput = document.querySelector("#apiKey");

const savedKey = localStorage.getItem("key");
const savedImage = localStorage.getItem("imageUrl");

if (savedKey) {
  bgKeyBtn.style.display = "none";
  bgBtn.style.display = "flex";
} else {
  bgKeyBtn.style.display = "flex";
  bgBtn.style.display = "none";
  localStorage.removeItem("imageUrl");
  bg.style.backgroundImage = "";
}

clearImageStorageBtn.addEventListener("mouseenter", () => {
  infoText.style.display = "flex";
});

clearImageStorageBtn.addEventListener("mouseleave", () => {
  infoText.style.display = "none";
});

clearApiBtn.addEventListener("mouseenter", () => {
  clearApiInfoText.style.display = "flex";
});

clearApiBtn.addEventListener("mouseleave", () => {
  clearApiInfoText.style.display = "none";
});

bgBtnImage.addEventListener("mouseenter", () => {
  randomImageInfo.style.display = "flex";
});

bgBtnImage.addEventListener("mouseleave", () => {
  randomImageInfo.style.display = "none";
});

if (savedImage) {
  bg.style.backgroundImage = `url(${savedImage})`;
} else {
  bg.style.backgroundImage = "";
}

clearBgBtn.addEventListener("click", () => {
  localStorage.removeItem("imageUrl");
  bg.style.backgroundImage = "";
});

clearApiBtn.addEventListener("click", () => {
  localStorage.removeItem("key");
  localStorage.removeItem("imageUrl");
  console.log("Clear api button clicked");
  bg.style.backgroundImage = "";
  location.reload();
});

apiKeyInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    localStorage.setItem("key", apiKeyInput.value);
    apiKeyInput.value = "";
    location.reload();
  }
});

bgBtnImage.addEventListener("click", () => {
  getImage(savedKey);
});

async function getImage(key) {
  const topicNature = "6sMVjTLSkeQ";
  const topicWallpaper = "9dKjUlgjt5A";
  const topicTextures = "8L2xg3CqN9w";
  const topicSports = "7OQHeV3qjXk";
  const unsplashURL = `https://api.unsplash.com/photos/random?topics=${topicNature}&client_id=${key}`;
  try {
    const response = await fetch(unsplashURL);
    if (!response.ok) {
      throw new Error("Unsplash response not ok!", response.status);
    }
    unsplashData = await response.json();
    imageUrl = unsplashData.urls.full.toString();
    if (
      unsplashData.topics &&
      unsplashData.topics.length > 0 &&
      unsplashData.topics[0].title
    ) {
      imageTopic = unsplashData.topics[0].title.toString();
    } else {
      imageTopic = "Topic not found";
    }

    localStorage.setItem("imageUrl", imageUrl);
    bg.style.backgroundImage = `url(${imageUrl})`;
  } catch (error) {
    console.error(error.message);
  }
}
// ..........................................................................
// Github logik .............................................................
const githubContent = document.querySelector("#github-content");
const githubUserDiv = document.querySelector(".github-user-div");
const githubUserText = document.querySelector("#github-user-text");
const githubCard = document.querySelector("#github-card");
const githubInput = document.querySelector("#github-user-input");
const userIcon = document.querySelector("#user-icon");

const savedGithubUser = localStorage.getItem("githubUser");
const savedUserIcon = localStorage.getItem("githubUserIcon");

if (savedGithubUser) {
  githubUserText.textContent = savedGithubUser;
  userIcon.style.backgroundImage = `url(${savedUserIcon})`;
  getGithub(savedGithubUser);
} else {
  githubUserText.textContent = "toobi-jpg";
  getGithub();
}

async function getGithub(user = "toobi-jpg") {
  const githubUrl = `https://api.github.com/users/${user}/repos?sort=created&direction=desc&per_page=3`;
  try {
    const response = await fetch(githubUrl);
    if (!response.ok) {
      throw new Error("Github users response not ok!", response.status);
    }
    GithubData = await response.json();
    githubUser = GithubData[0].owner.login;
    userIconUrl = GithubData[0].owner.avatar_url;
    localStorage.setItem("githubUser", githubUser);
    localStorage.setItem("githubUserIcon", userIconUrl);
    renderGithub(GithubData);
    githubUserText.textContent = githubUser;
    userIcon.style.backgroundImage = `url(${userIconUrl})`;
  } catch (error) {
    let userNotFound = "User not found";
    console.error(userNotFound);
    githubInput.placeholder = userNotFound;
    showGithubInput();
  }
}

function renderGithub(data) {
  data.forEach((repo, index) => {
    let repoDiv = document.createElement("div");
    repoDiv.classList.add("repo-div");
    repoDiv.id = `repo-div-${index + 1}`;

    let repoNameDiv = document.createElement("div");
    repoNameDiv.classList.add("repo-name-div");

    let repoIcon = document.createElement("i");
    repoIcon.className = "fa-solid fa-code-branch fa-xs repo-icon";

    let repoName = document.createElement("p");
    repoName.classList.add("repo-name");
    repoName.id = `repo-name-${index + 1}`;
    repoName.textContent = repo.name;

    let statsDiv = document.createElement("div");
    statsDiv.classList.add("repo-stats-div");
    statsDiv.id = `repo-stats-div-${index + 1}`;

    let languageContainer = document.createElement("div");
    languageContainer.classList.add("repo-container-small");
    languageContainer.id = `language-container-${index + 1}`;
    let languageTitle = document.createElement("p");
    languageTitle.classList.add("repo-stats-title");
    languageTitle.textContent = "Lang:";
    let languageText = document.createElement("p");
    languageText.classList.add("small-span-lang");
    languageText.id = `repo-language-${index + 1}`;
    languageText.textContent = repo.language;

    languageContainer.appendChild(languageTitle);
    languageContainer.appendChild(languageText);

    let issuesContainer = document.createElement("div");
    issuesContainer.classList.add("repo-container-small");
    issuesContainer.id = `issues-container-${index + 1}`;
    let issuesTitle = document.createElement("p");
    issuesTitle.classList.add("repo-stats-title");
    issuesTitle.textContent = "Issues:";
    let issuesText = document.createElement("p");
    issuesText.classList.add("small-span");
    issuesText.id = `repo-issues-${index + 1}`;
    issuesText.textContent = repo.open_issues_count;

    issuesContainer.appendChild(issuesTitle);
    issuesContainer.appendChild(issuesText);

    let forksContainer = document.createElement("div");
    forksContainer.classList.add("repo-container-small");
    forksContainer.id = `forks-container-${index + 1}`;
    let forksTitle = document.createElement("p");
    forksTitle.classList.add("repo-stats-title");
    forksTitle.textContent = "Forks:";
    let forksText = document.createElement("p");
    forksText.classList.add("small-span");
    forksText.id = `repo-forks-${index + 1}`;
    forksText.textContent = repo.forks_count;

    let repoLinkButton = document.createElement("a");
    repoLinkButton.classList.add("github-repo-link");
    repoLinkButton.href = repo.html_url;
    repoLinkButton.target = "_blank";

    forksContainer.appendChild(forksTitle);
    forksContainer.appendChild(forksText);

    statsDiv.appendChild(languageContainer);
    statsDiv.appendChild(issuesContainer);
    statsDiv.appendChild(forksContainer);

    repoDiv.appendChild(repoNameDiv);

    repoNameDiv.appendChild(repoIcon);
    repoNameDiv.appendChild(repoName);
    repoDiv.appendChild(statsDiv);
    repoDiv.appendChild(repoLinkButton);

    githubContent.appendChild(repoDiv);
  });
}

function clearGithub() {
  let repoDivs = document.querySelectorAll(".repo-div");
  repoDivs.forEach((div) => {
    div.remove();
  });
}

function showGithubInput() {
  githubUserDiv.style.display = "none";
  githubInput.style.display = "flex";
  githubInput.focus();
  setTimeout(() => {
    githubInput.style.width = "240px";
  }, 5);
}

function hideGithubInput() {
  githubInput.style.width = "";
  githubInput.value = "";
  githubInput.blur();
  setTimeout(() => {
    githubUserDiv.style.display = "flex";
    githubInput.style.display = "none";
  }, 100);
}

githubUserText.addEventListener("click", () => {
  showGithubInput();
});

githubInput.addEventListener("blur", () => {
  hideGithubInput();
});

githubInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    clearGithub();
    getGithub(githubInput.value.toString());
    hideGithubInput();
  }
  if (event.key === "Escape") {
    hideGithubInput();
  }
});

//............................................................................
// Location bild på väder logik ..............................................
const locationImage = document.querySelector("#location-image");
const savedwLocationImage = localStorage.getItem("savedLImage");

if (savedKey && savedwLocation && savedwLocationImage) {
  locationImage.style.backgroundImage = `url(${savedwLocationImage})`;
}

async function fetchLocationImage(key, location) {
  const locationImageUrl = `https://api.unsplash.com/photos/random?topics=cityscapes&query=${location}&client_id=${key}`;

  try {
    const response = await fetch(locationImageUrl);
    if (!response.ok) {
      throw new Error("Response not ok!", response.status);
    }
    const imageData = await response.json();
    const image = imageData.urls.small_s3.toString();
    locationImage.style.backgroundImage = `url(${image})`;
    localStorage.setItem("savedLImage", image);
  } catch (error) {
    console.error("Error: ", error);
  }
}
