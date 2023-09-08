import { authors, genres, books, BOOKS_PER_PAGE } from "./data.js";

// DOM Elements
const dataListItems = document.querySelector("[data-list-items]");
const dataListActive = document.querySelector("[data-list-active]");
const dataSearchGenres = document.querySelector("[data-search-genres]");
const dataSearchAuthors = document.querySelector("[data-search-authors]");
const dataSettingsTheme = document.querySelector("[data-settings-theme]");
const dataSettingsForm = document.querySelector("[data-settings-form]");
const dataListButton = document.querySelector("[data-list-button]");
const dataSearchCancel = document.querySelector("[data-search-cancel]");
const dataSearchOverlay = document.querySelector("[data-search-overlay]");
const dataSettingsCancel = document.querySelector("[data-settings-cancel]");
const dataSettingsOverlay = document.querySelector("[data-settings-overlay]");
const dataHeaderSettings = document.querySelector("[data-header-settings]");
const dataHeaderSearch = document.querySelector("[data-header-search]");
const dataListClose = document.querySelector("[data-list-close]");
const dataSearchForm = document.querySelector("[data-search-form]");
const dataListMessage = document.querySelector("[data-list-message]");
const dataListImage = document.querySelector("[data-list-image]");
const dataListTitle = document.querySelector("[data-list-title]");
const dataListDescription = document.querySelector("[data-list-description]");
const dataListSubtitle = document.querySelector("[data-list-subtitle]");
const dataListBlur = document.querySelector("[data-list-blur]");

let active = false;
const matches = books;
let page = 1;
const range = [0, 36];

//Genre List

const genreFrag = document.createDocumentFragment();
const element = document.createElement("option");
element.value = "any";
element.innerText = "All Genres";
genreFrag.appendChild(element);

for (const [id, name] of Object.entries(genres)) {
  const createGenre = document.createElement("option");
  createGenre.value = id;
  createGenre.innerText = name;
  genreFrag.appendChild(createGenre);
}

dataSearchGenres.appendChild(genreFrag);

//Author List

const authorFrag = document.createDocumentFragment();
const authorElement = document.createElement("option");
authorElement.value = "any";
authorElement.innerText = "All Authors";
authorFrag.appendChild(authorElement);

for (const [id, name] of Object.entries(authors)) {
  const authorOption = document.createElement("option");
  authorOption.value = id;
  authorOption.innerText = name;
  authorFrag.appendChild(authorOption);
}

dataSearchAuthors.appendChild(authorFrag);

//Night & day mode
const day = {
  dark: "10, 10, 20",
  light: "255, 255, 255",
};

const night = {
  dark: "255, 255, 255",
  light: "10, 10, 20",
};

const css = {
  day,
  night,
};

dataSettingsTheme.value =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "night"
    : "day";
const v =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "night"
    : "day";

document.documentElement.style.setProperty("--color-dark", css[v].dark);
document.documentElement.style.setProperty("--color-light", css[v].light);

const handlerSettingsSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const result = Object.fromEntries(formData);
  document.documentElement.style.setProperty(
    "--color-dark",
    css[result.theme].dark
  );
  document.documentElement.style.setProperty(
    "--color-light",
    css[result.theme].light
  );
};
dataSettingsForm.addEventListener("submit", handlerSettingsSubmit);

//data Button for More previews

const handlerListButton = (event) => {
  const previews = document.createDocumentFragment();
  const appendBooks = books.slice(page * range[1], (page + 1) * range[1]);

  for (const prop of appendBooks) {
    const { author: authorId, id, image, title } = prop;

    const elementMain = document.createElement("button");
    elementMain.classList = "preview";
    elementMain.setAttribute("data-preview", id);

    elementMain.innerHTML = /* html */ `
            <img
                class="preview_ _image"
                src="${image}"
            />
            
            <div class="preview_ _info">
                <h3 class="preview_ _title">${title}</h3>
                <div class="preview_ _author">${authors[authorId]}</div>
            </div>
        `;

    previews.appendChild(elementMain);
  }

  dataListItems.appendChild(previews);
  page = page + 1;

  const initial = matches.length - [page * BOOKS_PER_PAGE];
  let hasRemaining = initial - [page * BOOKS_PER_PAGE];
  const remaining = hasRemaining ? initial : 0;
  dataListButton.disabled = initial < 0;

  dataListButton.innerHTML = /* html */ `
        <span>Show more</span>
        <span class="list_ _remaining"> (${remaining})</span>
    `;

  const newButtons = document.querySelectorAll(".preview");
  newButtons.forEach((b) => b.addEventListener("click", handlerListItems));
  dataListMessage.style.display = "none";
};
dataListButton.addEventListener("click", handlerListButton);

dataListButton.innerText = `Show more ${books.length - BOOKS_PER_PAGE}`;
dataListButton.disabled = matches.length - [page * BOOKS_PER_PAGE] > 0;
dataListButton.innerHTML = /* html */ [
  `<span>Show more 
    ${
      matches.length - [page * BOOKS_PER_PAGE] > 0
        ? matches.length - [page * BOOKS_PER_PAGE]
        : 0
    }
    </span>`,
];

// Search Cancel button
const handlerSearchCancel = (event) => {
  dataSearchOverlay.style.display = "none";
};
dataSearchCancel.addEventListener("click", handlerSearchCancel);

// Settings cancel button
const handelerSettingsCancel = (event) => {
  dataSettingsOverlay.style.display = "none";
};
dataSettingsCancel.addEventListener("click", handelerSettingsCancel);

// Settings open
const handlerHeaderSettings = () => {
  if (dataSearchOverlay.style.display === "block") {
    dataSearchOverlay.style.display = "none";
  }
  dataSettingsOverlay.style.display = "block";
};
dataHeaderSettings.addEventListener("click", handlerHeaderSettings);

// Search Open

const handlerHeaderSearch = (event) => {
  if (dataSettingsOverlay.style.display === "block") {
    dataSettingsOverlay.style.display = "none";
  }
  dataSearchOverlay.style.display = "block";
};
dataHeaderSearch.addEventListener("click", handlerHeaderSearch);
dataHeaderSearch.focus();

// Close Summary
const handlerListClose = (event) => {
  dataActive.style.display = "none";
  active = false;
};
dataListClose.addEventListener("click", handlerListClose);

// Filter Books by title, author or genre
const handlerSearchForm = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  let result = [];

  for (const book of books) {
    let titleMatch =
      filters.title.trim() === "" ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());
    let authorMatch =
      filters.author === "any" || book.author === filters.author;
    let genreMatch = filters.genre === "any" || book.genres === filters.genre;

    if (!genreMatch) {
      for (const singleGenre of book.genres) {
        if (singleGenre === filters.genre) {
          genreMatch = true;
        }
      }
    }
    if (titleMatch && authorMatch && genreMatch) {
      result.push(book);
    }
  }

  if (result.length < 1) {
    dataListMessage.style.display = "block";
  } else {
    dataListMessage.style.display = "none";
  }

  BookDisplay(result);
  event.target.reset();
  dataSearchOverlay.style.display = "none";
};

const BookDisplay = (array) => {
  dataListItems.innerHTML = "";
  const dataFrag = document.createDocumentFragment();
  const extractedBooks = array;

  for (const prop of extractedBooks) {
    const { author: authorId, id, image, title } = prop;

    const elementMain = document.createElement("button");
    elementMain.classList = "preview";
    elementMain.setAttribute("data-preview", id);

    elementMain.innerHTML = /* html */ `
            <img
                class="preview_ _image"
                src="${image}"
            />
            
            <div class="preview_ _info">
                <h3 class="preview_ _title">${title}</h3>
                <div class="preview_ _author">${authors[authorId]}</div>
            </div>
        `;

    dataFrag.appendChild(elementMain);
  }

  dataListItems.appendChild(dataFrag);
};
// creating the books on main page
BookDisplay(books.slice(range[0], range[1]));

if (!books && !Array.isArray(books)) {
  throw new Error("Source required");
}
if (!range && range.length < 2) {
  throw new Error("Range must be an array with two numbers");
}

//remaning books on button
const initial = matches.length - [page * BOOKS_PER_PAGE];
let hasRemaining = initial - [page * BOOKS_PER_PAGE];
const remaining = hasRemaining ? initial : 0;
dataListButton.disabled = initial < 0;

dataListButton.innerHTML = /* html */ `
        <span>Show more</span>
        <span class="list_ _remaining"> (${remaining})</span>
    `;

dataSearchForm.addEventListener("submit", handlerSearchForm);

// Preview Summary
const summaryButtons = document.querySelectorAll(".preview");
const handlerListItems = (event) => {
  const pathArray = Array.from(event.path || event.composedPath());

  for (let i = 0; i <= pathArray.length; i++) {
    if (active) break;
    const previewId = pathArray[i].dataset.preview;

    for (const singleBook of books) {
      if (singleBook.id === previewId) active = singleBook;
    }
  }

  if (!active) return;

  dataListActive.style.display = "block";
  dataListImage.src = active.image;
  dataListBlur.src = active.image;
  dataListTitle.innerText = active.title;

  dataListSubtitle.innerText = `${authors[active.author]} (${new Date(
    active.published
  ).getFullYear()})`;
  dataListDescription.innerText = active.description;
};
summaryButtons.forEach((b) => b.addEventListener("click", handlerListItems));
