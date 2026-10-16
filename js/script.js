const screens = document.querySelectorAll(".screen");
const toastEl = document.getElementById("toast");
const ICON_PATH = "assets/icons/";

// Show exactly one screen; all others are hidden
function show(id) {
  screens.forEach(s => s.classList.toggle("active", s.id === id));
}

function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

// Any element with data-goto switches to that screen
document.querySelectorAll("[data-goto]").forEach(el =>
  el.addEventListener("click", () => show(el.dataset.goto))
);

// Bottom nav: swap icon colour and highlight
document.querySelectorAll(".nav-btn").forEach(btn =>
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => {
      const active = b === btn;
      b.classList.toggle("active", active);
      b.querySelector("img").src = `${ICON_PATH}${active ? "blue" : "grey"}/${b.dataset.icon}.svg`;
    });
  })
);

// ---- Businesses: loaded from data/businesses.json (see JS/data.js) ----
const listEl = document.getElementById("business-list");
const chipsEl = document.getElementById("category-chips");
const statusEl = document.getElementById("list-status");
const searchInput = document.getElementById("search-input");

let businesses = [];
let activeCategory = "All";
let query = "";

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
  statusEl.hidden = !message;
}

function createCard(b) {
  const card = document.createElement("article");
  card.className = "place-card";
  card.tabIndex = 0;
  card.dataset.id = b.id;

  const img = document.createElement("img");
  img.className = "place-img";
  img.src = b.image;
  img.alt = b.name;
  img.loading = "lazy";

  const title = document.createElement("h4");
  title.textContent = b.name;

  const category = document.createElement("p");
  category.textContent = b.category;

  card.append(img, title, category);
  return card;
}

function renderBusinesses() {
  const q = query.trim().toLowerCase();
  const matches = businesses.filter(b =>
    (activeCategory === "All" || b.category === activeCategory) &&
    (!q || [b.name, b.category, b.description].some(v => v.toLowerCase().includes(q)))
  );

  listEl.replaceChildren(...matches.map(createCard));
  setStatus(matches.length ? "" : "No businesses found.");
}

function renderChips() {
  const categories = ["All", ...new Set(businesses.map(b => b.category))];
  chipsEl.replaceChildren(...categories.map(name => {
    const chip = document.createElement("button");
    chip.className = "chip" + (name === activeCategory ? " active" : "");
    chip.setAttribute("role", "tab");
    chip.textContent = name;
    chip.addEventListener("click", () => {
      activeCategory = name;
      chipsEl.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c === chip));
      renderBusinesses();
    });
    return chip;
  }));
}

searchInput.addEventListener("input", e => {
  query = e.target.value;
  renderBusinesses();
});

async function loadBusinesses() {
  try {
    businesses = await getBusinesses();
    renderChips();
    renderBusinesses();
  } catch (err) {
    console.error(err);
    setStatus("Could not load businesses. Run the site from a local server (for example VS Code Live Server), not by double-clicking index.html.", true);
  }
}

// Open a business -> details page
const detailImg = document.getElementById("detail-img");

function openBusiness(b) {
  document.getElementById("detail-name").textContent = b.name;
  document.getElementById("detail-category").textContent = b.category;
  document.getElementById("detail-desc").textContent = b.description;
  detailImg.src = b.image;
  detailImg.alt = b.name;
  show("screen-detail");
}

function businessFromEvent(e) {
  const card = e.target.closest(".place-card");
  return card ? businesses.find(b => String(b.id) === card.dataset.id) : null;
}

listEl.addEventListener("click", e => {
  const b = businessFromEvent(e);
  if (b) openBusiness(b);
});

listEl.addEventListener("keydown", e => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const b = businessFromEvent(e);
  if (b) {
    e.preventDefault();
    openBusiness(b);
  }
});

// Back, favourite, book
document.getElementById("back-btn").addEventListener("click", () => show("screen-home"));

const fav = document.getElementById("fav-btn");
const favIcon = document.getElementById("fav-icon");
fav.addEventListener("click", () => {
  const on = fav.getAttribute("aria-pressed") === "true";
  fav.setAttribute("aria-pressed", String(!on));
  favIcon.src = on ? ICON_PATH + "white/heart.svg" : ICON_PATH + "red/heart.svg";
});

document.getElementById("book-btn").addEventListener("click", () => {
  const name = document.getElementById("detail-name").textContent;
  toast("Booking started for " + name);
  // Next step: save the booking (Firebase now, SQL API later).
});

// ---- User name: ask, store in localStorage, re-ask if nothing is stored ----
const NAME_KEY = "bookingUserName";
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("name-input");
const nameError = document.getElementById("name-error");

function getStoredName() {
  try { return localStorage.getItem(NAME_KEY); } catch { return null; }
}

function storeName(name) {
  try { localStorage.setItem(NAME_KEY, name); } catch { /* storage blocked */ }
}

function renderName(name) {
  // textContent (not innerHTML) so typed text can never run as HTML
  document.querySelectorAll(".user-name").forEach(el => (el.textContent = name));
}

nameForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name) {
    nameError.hidden = false;
    nameInput.focus();
    return;
  }
  nameError.hidden = true;
  storeName(name);
  renderName(name);
  show("screen-welcome");
});

nameInput.addEventListener("input", () => (nameError.hidden = true));

// On every load/refresh: no stored name -> prompt; stored name -> skip the prompt
const savedName = getStoredName();
if (savedName) {
  renderName(savedName);
  show("screen-welcome");
} else {
  show("screen-name");
  nameInput.focus();
}

loadBusinesses();