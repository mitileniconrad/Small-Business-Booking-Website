const screens = document.querySelectorAll(".screen");
const toastEl = document.getElementById("toast");

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

// Trip / Hotel / Bus chips
document.querySelectorAll(".chip").forEach(chip =>
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
  })
);

// Bottom nav highlight
const ICON_PATH = "assets/icons/";

document.querySelectorAll(".nav-btn").forEach(btn =>
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-btn").forEach(b => {
      const active = b === btn;
      b.classList.toggle("active", active);
      b.querySelector("img").src = `${ICON_PATH}${active ? "blue" : "grey"}/${b.dataset.icon}.svg`;
    });
  })
);

// Search filters the place cards
document.getElementById("search-input").addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();
  document.querySelectorAll(".place-card").forEach(card => {
    card.hidden = q !== "" && !card.dataset.name.toLowerCase().includes(q);
  });
});

// Click a place card -> open its details page
const detailImg = document.getElementById("detail-img");

function openPlace(card) {
  document.getElementById("detail-name").textContent = card.dataset.name;
  document.getElementById("detail-loc").textContent = card.dataset.location;
  document.getElementById("detail-price").textContent = "$" + card.dataset.price;
  detailImg.src = card.dataset.image;
  detailImg.alt = card.dataset.name;
  show("screen-detail");
}

document.querySelectorAll(".place-card").forEach(card => {
  card.addEventListener("click", () => openPlace(card));
  card.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPlace(card);
    }
  });
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
  // Next step: save the booking to Firebase here.
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