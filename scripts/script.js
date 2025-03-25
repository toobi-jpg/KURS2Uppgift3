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

  console.log(Object.keys(links).length + " Sparade länkar");
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
      console.log("Delete button clicked");
      linkDiv.style.width = "20px";
      linkDiv.style.opacity = "0";
      setTimeout(() => {
        delete links[key];
        localStorage.setItem("links", JSON.stringify(links));
        createLinkDiv(links);
        console.log(Object.keys(links).length + " Sparade länkar");
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
console.log(Object.keys(links).length + " Sparade länkar");

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

let emptyNotesText = "Write notes!";

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

  notesText.style.textAlign = "left";
  localStorage.setItem("align", notesText.style.textAlign);
});

centerAlignBtn.addEventListener("click", () => {
  leftAlignBtn.classList.remove("active-align");
  centerAlignBtn.classList.add("active-align");
  rightAlignBtn.classList.remove("active-align");

  notesText.style.textAlign = "center";
  localStorage.setItem("align", notesText.style.textAlign);
});

rightAlignBtn.addEventListener("click", () => {
  leftAlignBtn.classList.remove("active-align");
  centerAlignBtn.classList.remove("active-align");
  rightAlignBtn.classList.add("active-align");

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
