// Business data: embedded so it works without a server (running locally)

const BUSINESS_DATA = [
  { "id": 1, "location": "Pretoria", "name": "Glow Nail Studio", "email": "info@glownailstudio.example", "hours": "Tue–Sat 09:00–18:00", "category": "Salons & Beauty", "description": "Hair, nails and skincare in a relaxed studio.", "image": "assets/images/businesses/nail-hygiene-care-flat-lay.jpg" },
  { "id": 2, "location": "Benoni", "name": "Quick Fix Garage", "email": "info@quickfixgarage.example", "hours": "Mon–Fri 07:30–17:00, Sat 08:00–13:00", "category": "Auto Services", "description": "Servicing, tyres and general car repairs.", "image": "assets/images/businesses/service.jpg" },
  { "id": 3, "location": "Johannesburg", "name": "Bella Rossa Cucina", "email": "info@bellarossacucina.example", "hours": "Tue–Sun 12:00–22:00", "category": "Restaurants", "description": "Family-run Italian kitchen with dine-in and takeaway based in Rosebank.", "image": "assets/images/businesses/restaurant.jpg" },
  { "id": 4, "location": "Midrand", "name": "Iron Pulse Fitness", "email": "info@ironpulsefitness.example", "hours": "Mon–Fri 05:00–21:00, Sat–Sun 07:00–15:00", "category": "Health & Fitness", "description": "Strength training, group classes and personal coaching.", "image": "assets/images/businesses/dumbells.jpg" },
  { "id": 5, "location": "Pretoria", "name": "Sunrise Dental Care", "email": "info@sunrisedentalcare.example", "hours": "Mon–Fri 08:00–17:00, Sat 08:00–12:00", "category": "Health & Medical", "description": "Friendly family dentistry with check-ups, whitening and braces.", "image": "assets/images/businesses/dentist.jpg" },
  { "id": 6, "location": "Sandton", "name": "The Daily Grind Café", "email": "info@thedailygrindcaf.example", "hours": "Mon–Sat 06:30–16:00, Sun 07:30–14:00", "category": "Restaurants", "description": "Specialty coffee, fresh pastries and light breakfast and lunch.", "image": "assets/images/businesses/coffee.jpg" },
  { "id": 7, "location": "Soweto", "name": "Sharp Cuts Barbershop", "email": "info@sharpcutsbarbershop.example", "hours": "Mon–Sat 08:00–18:00", "category": "Salons & Beauty", "description": "Classic cuts, fades and beard trims with walk-ins welcome.", "image": "assets/images/businesses/salon.jpg" },
  { "id": 8, "location": "Krugersdorp", "name": "Spark Electrical Services", "email": "info@sparkelectricalservices.example", "hours": "Mon–Fri 07:00–17:00", "category": "Home Services", "description": "Certified electricians for repairs, installations and compliance certificates.", "image": "assets/images/businesses/electrician-working.jpg" },
  { "id": 9, "location": "Alberton", "name": "PawPals Pet Grooming", "email": "info@pawpalspetgrooming.example", "hours": "Mon–Sat 08:00–17:00", "category": "Pet Services", "description": "Gentle grooming, baths and nail trims for dogs and cats.", "image": "assets/images/businesses/dog.jpg" },
  { "id": 10, "location": "Vereeniging", "name": "Bright Minds Tutoring", "email": "info@brightmindstutoring.example", "hours": "Mon–Thu 14:00–19:00, Sat 09:00–13:00", "category": "Education", "description": "After-school maths, science and English lessons for primary and high school learners.", "image": "assets/images/businesses/tutor.jpg" },
  { "id": 11, "location": "Bronkhorstspruit", "name": "Green Thumb Landscaping", "email": "info@greenthumblandscaping.example", "hours": "Mon–Fri 07:00–16:30", "category": "Home Services", "description": "Garden design, lawn care and irrigation for homes and small businesses.", "image": "assets/images/businesses/garden.jpg" },
  { "id": 12, "location": "Cullinan", "name": "Tyre Kings Auto Centre", "email": "info@tyrekingsautocentre.example", "hours": "Mon–Fri 07:30–17:30, Sat 08:00–14:00", "category": "Auto Services", "description": "New and used tyres, wheel alignment and balancing while you wait.", "image": "assets/images/businesses/tyres.jpg" }
];

// Returns a promise so loadBusinesses can `await` it now
function getBusinesses() {
  return Promise.resolve(BUSINESS_DATA);
}


// Getting the classes and loading all the icons

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
  // set the toaster timeout to 2.2 seconds
}

// Any element with data-goto switches to that screen
document.querySelectorAll("[data-goto]").forEach(el =>
  el.addEventListener("click", () => show(el.dataset.goto))
);

// Bottom nav: swap icon colour and highlight
// Only Favourites, Bookings and Saved stay highlighted (they open a panel); Home, Search and Profile
// take you elsewhere, so Home is the highlighted one afterwards
document.querySelectorAll(".nav-btn").forEach(btn =>
  btn.addEventListener("click", () => {
    const lit = ["heart", "ticket", "bookmark"].includes(btn.dataset.tab) ? btn : document.querySelector('.nav-btn[data-tab="home"]');

    document.querySelectorAll(".nav-btn").forEach(b => {
      const active = b === lit;
      b.classList.toggle("active", active);
      if (!b.dataset.icon) return;   // the search button keeps its own icon file
      b.querySelector("img").src = `${ICON_PATH}${active ? "blue" : "grey"}/${b.dataset.icon}.svg`; // load the image for the nav based on its colour
    });
  })
);


// Display functions: Businesses
const listEl = document.getElementById("business-list");
const chipsEl = document.getElementById("category-chips");
const statusEl = document.getElementById("list-status");

const searchInput = document.getElementById("search-input");

let businesses = [];
let activeCategory = "All";
let query = " ";

// Every card is built ONCE and kept here (id -> card), filtering only shows/hides them
const cardEls = new Map();

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
  statusEl.hidden = !message;
}

function createCard(b, index) {
  const card = document.createElement("article");
  card.className = "place-card";
  card.tabIndex = 0;
  card.dataset.id = b.id;

  const img = document.createElement("img");   // Create an image element
  img.className = "place-img";
  img.src = b.image;                           // image source
  img.alt = b.name;                            // image alt text
  img.decoding = "async";                      // decode the picture off the main thread so the page stays smooth
  img.loading = index < 6 ? "eager" : "lazy";  // first 6 (visible on load) load straight away, the rest load as you scroll to them
  if (index < 3) img.fetchPriority = "high";   // top row of pictures is fetched first

  const title = document.createElement("h4");
  title.textContent = b.name;

  const category = document.createElement("p");
  category.textContent = b.category;

  const desc = document.createElement("div");  // a div (not p) so it doesn't pick up the category pill style
  desc.className = "place-desc";
  desc.textContent = b.description;

  const hours = document.createElement("div");
  hours.className = "place-hours";
  hours.textContent = "Open: " + b.hours;

  const where = document.createElement("div");
  where.className = "place-loc";
  where.textContent = b.location;

  card.append(img, title, where, desc, hours, category);
  return card;
}


// The area picked on the map ("" when the user chose to see all areas)
function activeLocation() {
  const l = getStoredLocation();
  return l && l !== LOCATION_SKIPPED ? l : "";
}

function renderBusinesses() {
  const q = query.trim().toLowerCase();
  const loc = activeLocation();   // only businesses in this area are shown
  let shown = 0;

  // show or hide the cards that already exist instead of rebuilding every card and picture
  businesses.forEach(b => {
    const match = (!loc || b.location === loc) &&
      (activeCategory === "All" || b.category === activeCategory) &&
      (!q || [b.name, b.category, b.description].some(v => v.toLowerCase().includes(q)));
    cardEls.get(b.id).hidden = !match;
    if (match) shown++;
  });

  setStatus(shown ? "" : (loc ? "No businesses found in " + loc + "." : "No businesses found."));
}

function renderChips() {
  // load the business chips
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

// Search input functions
searchInput.addEventListener("input", e => {   // runs this function on every change to the input
  query = e.target.value;   // save what's currently typed
  renderBusinesses();       // redraw the list using that query
});

// load business functions and show an error upon failed load
async function loadBusinesses() {
  try {
    businesses = await getBusinesses();

    // build every card once and add them to the page in a single step
    const fragment = document.createDocumentFragment();
    businesses.forEach((b, i) => {
      const card = createCard(b, i);
      cardEls.set(b.id, card);
      fragment.append(card);
    });
    listEl.replaceChildren(fragment);

    renderChips();
    renderBusinesses();

  } catch (err) {
    console.error(err);
    setStatus("Could not load businesses: " + err.message, true);
  }
}


// Open a business to details page
const detailImg = document.getElementById("detail-img");

function openBusiness(b) {
  document.getElementById("detail-name").textContent = b.name;
  document.getElementById("detail-category").textContent = b.category;
  document.getElementById("detail-desc").textContent = b.description;
  document.getElementById("detail-hours").textContent = b.hours;
  detailImg.src = b.image;
  detailImg.alt = b.name;

  currentBusiness = b;
  syncDetailButtons();  // reflect whether this business is already a favourite / saved
  syncEmailButton(b);   // point the email button at this business

  show("screen-detail");
}


// ---------- Email the business ----------

const emailBtn = document.getElementById("email-btn");
const emailModal = document.getElementById("email-modal");
const emailForm = document.getElementById("email-form");
const emailTo = document.getElementById("email-to");
const emailFrom = document.getElementById("email-from");   // shows the user's reply-to address
const emailBody = document.getElementById("email-body");
const emailError = document.getElementById("email-error");

function syncEmailButton(b) {
  emailBtn.hidden = !b.email;
}

// Email booking function template
function openEmailModal(b) {
  const name = getStoredName() || "";
  const email = getStoredEmail();

  emailTo.textContent = "To: " + b.email;
  emailFrom.textContent = email
    ? "Reply-to: " + email
    : "No email saved. Add yours in Profile so the business can reply.";
  emailFrom.classList.toggle("warn", !email);

  emailBody.value = "Hi " + b.name + ",\n\nI would like to enquire more about your services and book a date.\n\nKind regards,\n" + name + (email ? "\n" + email : "");
  emailError.hidden = true;
  emailModal.hidden = false;
  emailBody.focus();
}

function closeEmailModal() {
  emailModal.hidden = true;
  emailBtn.focus();
}

emailBtn.addEventListener("click", () => {
  if (currentBusiness && currentBusiness.email) openEmailModal(currentBusiness);
});

emailForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!emailBody.value.trim()) {
    emailError.hidden = false;
    return;
  }
  // demo: no request is made and no email leaves the browser
  toast("Email sent to " + currentBusiness.email);
  emailModal.hidden = true;
});

document.getElementById("email-close-btn").addEventListener("click", closeEmailModal);
emailModal.addEventListener("click", e => { if (e.target === emailModal) closeEmailModal(); });
emailBody.addEventListener("input", () => (emailError.hidden = true));

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


// Saved lists (favourites, saved): kept in localStorage, cached in memory
const FAV_KEY = "bookingFavourites";
const SAVED_KEY = "bookingSaved";
const listCache = {};

function readList(key) {
  if (!listCache[key]) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      listCache[key] = Array.isArray(v) ? v : [];
    } catch { listCache[key] = []; }
  }
  return listCache[key];
}

function writeList(key, list) {
  listCache[key] = list;
  try { localStorage.setItem(key, JSON.stringify(list)); } catch { /* storage blocked */ }
}

// Adds the id if missing, removes it if present. Returns true when it is now in the list
function toggleInList(key, id) {
  const list = readList(key);
  const on = !list.includes(id);
  writeList(key, on ? [...list, id] : list.filter(x => x !== id));
  return on;
}

// Bookings are kept in localStorage too (key below)
const BOOKINGS_KEY = "bookingBookings";

// Each booking: { id, businessId, businessName, customerName, date: "YYYY-MM-DD", createdAt, updatedAt? }
function getBookings() {
  // ignore anything without a business and a date (older test data) so it can't break the list
  return sortBookings(readList(BOOKINGS_KEY).filter(bk => bk && bk.businessId && /^\d{4}-\d{2}-\d{2}$/.test(bk.date)));
}

function saveBookings(list) { writeList(BOOKINGS_KEY, list); }

// One booking per business per day
function isDateTaken(businessId, date, ignoreId) {
  return getBookings().some(bk => bk.businessId === businessId && bk.date === date && bk.id !== ignoreId);
}

const ALREADY_BOOKED = "This date is already booked. Please choose another date.";

// soonest date first
function sortBookings(list) {
  return [...list].sort((a, b) => a.date.localeCompare(b.date) || String(a.createdAt).localeCompare(String(b.createdAt)));
}

function todayYMD() {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

// "2026-11-03" -> "Tue, 3 Nov 2026" (built from parts so the timezone can never shift the day)
function formatDate(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

// Back, favourite, save, book
let currentBusiness = null;   // the business open on the details page

const fav = document.getElementById("fav-btn");
const favIcon = document.getElementById("fav-icon");
const saveBtn = document.getElementById("save-btn");

function syncDetailButtons() {
  const favOn = readList(FAV_KEY).includes(currentBusiness.id);
  fav.setAttribute("aria-pressed", String(favOn));
  favIcon.src = ICON_PATH + (favOn ? "filled-heart.svg" : "white/heart.svg");
  saveBtn.setAttribute("aria-pressed", String(readList(SAVED_KEY).includes(currentBusiness.id)));
}

document.getElementById("back-btn").addEventListener("click", () => {
  show("screen-home");
  renderSheet();  // the tab panel may be open behind the details page, so refresh it
});

fav.addEventListener("click", () => {
  if (!currentBusiness) return;
  const on = toggleInList(FAV_KEY, currentBusiness.id);
  syncDetailButtons();
  toast(on ? "Added to favourites" : "Removed from favourites");
});

saveBtn.addEventListener("click", () => {
  if (!currentBusiness) return;
  const on = toggleInList(SAVED_KEY, currentBusiness.id);
  syncDetailButtons();
  toast(on ? "Saved for later" : "Removed from saved");
});


// Booking modal, opens the calendar to book a new date, or to move an existing booking

const modalEl = document.getElementById("booking-modal");
const bookingForm = document.getElementById("booking-form");
const modalTitle = document.getElementById("booking-modal-title");
const calTitle = document.getElementById("cal-title");
const calDays = document.getElementById("cal-days");

const calPrev = document.getElementById("cal-prev");
const calNext = document.getElementById("cal-next");

const calSummary = document.getElementById("cal-summary");
const bookingError = document.getElementById("booking-error");

const confirmBtn = document.getElementById("booking-confirm-btn");
const bookingEmailRow = document.getElementById("booking-email-row");
const bookingEmailCheck = document.getElementById("booking-email-check");

let modalState = null;           // while the modal is open (booking is null for a new booking)
let modalOpener = null;          // the button that opened it, so focus can go back there
let calMonth = { y: 0, m: 0 };   // month on show
let selectedDate = "";           // "YYYY-MM-DD", or empty until a day is picked

function openBookingModal(b, booking = null, pick = false) {
  modalState = { business: b, booking, pick };
  modalOpener = document.activeElement;

  selectedDate = booking ? booking.date : (pick ? pendingDate : "");
  const [y, m] = (selectedDate || todayYMD()).split("-").map(Number);
  calMonth = { y, m: m - 1 };   // start on the booking's month, or this month

  modalTitle.textContent = booking ? "Reschedule booking" : (pick ? "Choose a date" : "Book " + b.name);
  confirmBtn.textContent = booking || pick ? "Save date" : "Send";
  bookingEmailCheck.checked = false;
  bookingEmailRow.hidden = !!booking || pick || !b.email;   // email option only when making a new booking
  bookingError.hidden = true;

  renderCalendar();

  modalEl.hidden = false;
  const first = calDays.querySelector(".selected") || calDays.querySelector(".today") || calDays.querySelector(".cal-day:not(:disabled)");
  if (first) first.focus();
}

function closeBookingModal() {
  modalEl.hidden = true;
  modalState = null;
  if (modalOpener && modalOpener.focus) modalOpener.focus();
}

function showBookingError(message) {
  bookingError.textContent = message;
  bookingError.hidden = false;
}

// "2026-11-03" -> "Tuesday, 3 November"
function longDate(ymd) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

function renderCalendar() {
  const { y, m } = calMonth;
  const today = todayYMD();
  const [ty, tm] = today.split("-").map(Number);
  const pad = n => String(n).padStart(2, "0");
  const { business, booking } = modalState;

  calTitle.textContent = new Date(y, m, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  calPrev.disabled = y * 12 + m <= ty * 12 + (tm - 1);   // no going back before this month

  const cells = [];
  const offset = new Date(y, m, 1).getDay();   // Sunday = 0, so this many empty cells come first
  for (let i = 0; i < offset; i++) cells.push(document.createElement("span"));

  const daysInMonth = new Date(y, m + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const ymd = y + "-" + pad(m + 1) + "-" + pad(d);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cal-day";
    btn.textContent = d;
    btn.dataset.date = ymd;

    let label = formatDate(ymd);
    if (ymd < today) {
      btn.disabled = true;
      btn.classList.add("past");
    } else if (isDateTaken(business.id, ymd, booking ? booking.id : null)) {
      btn.classList.add("booked");   // struck through; tapping it explains why it can't be picked
      btn.setAttribute("aria-disabled", "true");
      label += ", already booked";
    }

    if (ymd === today) btn.classList.add("today");
    if (ymd === selectedDate) {
      btn.classList.add("selected");
      btn.setAttribute("aria-pressed", "true");
    }

    btn.setAttribute("aria-label", label);
    cells.push(btn);
  }

  calDays.replaceChildren(...cells);

  calSummary.textContent = selectedDate
    ? (booking ? "Your booking will move to " : "Your booking is for ") + longDate(selectedDate) + "."
    : "Pick a date for your booking.";
}

function changeMonth(step) {
  let { y, m } = calMonth;
  m += step;
  if (m < 0) { m = 11; y--; }
  if (m > 11) { m = 0; y++; }
  calMonth = { y, m };
  renderCalendar();
}

calPrev.addEventListener("click", () => changeMonth(-1));
calNext.addEventListener("click", () => changeMonth(1));

calDays.addEventListener("click", e => {
  const btn = e.target.closest(".cal-day");
  if (!btn || btn.disabled) return;
  if (btn.classList.contains("booked")) return showBookingError(ALREADY_BOOKED);

  selectedDate = btn.dataset.date;
  bookingError.hidden = true;
  renderCalendar();
  calDays.querySelector(".selected").focus();   // keep keyboard focus on the day that was picked
});

bookingForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!modalState) return;

  const date = selectedDate;
  if (!date) return showBookingError("Please pick a date to continue.");
  if (date < todayYMD()) return showBookingError("Please choose today or a future date.");

  // pick mode: just hand the date back to the booking page
  if (modalState.pick) {
    pendingDate = date;
    closeBookingModal();
    syncBookingPage();
    return;
  }

  const { business, booking } = modalState;
  if (booking && booking.date === date) return closeBookingModal();   // nothing changed
  if (isDateTaken(business.id, date, booking ? booking.id : null)) return showBookingError(ALREADY_BOOKED);

  if (booking) {
    saveBookings(getBookings().map(x => (x.id === booking.id ? { ...x, date, updatedAt: new Date().toISOString() } : x)));
    toast("Booking rescheduled");
  } else {
    saveBookings([...getBookings(), {
      id: Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      businessId: business.id,
      businessName: business.name,
      customerName: getStoredName() || "",
      customerEmail: getStoredEmail(),
      date,
      createdAt: new Date().toISOString()
    }]);
    // demo: the email option only changes the message, nothing is actually emailed
    toast(bookingEmailCheck.checked ? "Booking sent. Email sent to " + business.email : "Booking sent");
  }

  closeBookingModal();
  renderSheet();
});

document.getElementById("booking-close-btn").addEventListener("click", closeBookingModal);

modalEl.addEventListener("click", e => {
  if (e.target === modalEl) closeBookingModal();   // tap outside the card
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !modalEl.hidden) closeBookingModal();
});


// Booking page: pick a date and a package, then confirm (prices are placeholder demo values)
const PACKAGES = [
  { name: "Standard", note: "Basic appointment", price: 250 },
  { name: "Premium", note: "Extended time and extras", price: 450 },
  { name: "Deluxe", note: "Full service with a priority slot", price: 750 }
];
let pendingDate = "";      // date chosen on the booking page ("YYYY-MM-DD" or "")
let pendingPackage = 0;    // index into PACKAGES

const bkImg = document.getElementById("bk-img");
const bkName = document.getElementById("bk-name");
const bkCategory = document.getElementById("bk-category");
const bkDateText = document.getElementById("bk-date-text");
const bkPackages = document.getElementById("bk-packages");
const bkTotal = document.getElementById("bk-total");
const bkError = document.getElementById("bk-error");
const bkEmailRow = document.getElementById("bk-email-row");
const bkEmailCheck = document.getElementById("bk-email-check");

const confirmModal = document.getElementById("confirm-modal");

function money(n) { return "R" + n.toLocaleString("en-ZA"); }

function renderPackages() {
  bkPackages.replaceChildren(...PACKAGES.map((p, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pkg" + (i === pendingPackage ? " selected" : "");
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", String(i === pendingPackage));
    btn.dataset.index = i;

    const info = document.createElement("div");
    info.className = "pkg-info";
    const title = document.createElement("strong");
    title.textContent = p.name;
    const note = document.createElement("span");
    note.textContent = p.note;
    info.append(title, note);

    const price = document.createElement("span");
    price.className = "pkg-price";
    price.textContent = money(p.price);

    const radio = document.createElement("span");
    radio.className = "pkg-radio";
    radio.setAttribute("aria-hidden", "true");

    btn.append(info, price, radio);
    return btn;
  }));
}

function syncBookingPage() {
  bkDateText.textContent = pendingDate ? formatDate(pendingDate) : "Pick a date";
  bkTotal.textContent = money(PACKAGES[pendingPackage].price);
}

function openBookingPage(b) {
  pendingDate = "";
  pendingPackage = 0;
  bkEmailCheck.checked = false;
  bkError.hidden = true;
  bkImg.src = b.image;
  bkImg.alt = b.name;
  bkName.textContent = b.name;
  bkCategory.textContent = b.category;
  bkEmailRow.hidden = !b.email;
  renderPackages();
  syncBookingPage();
  show("screen-booking");
}

document.getElementById("book-btn").addEventListener("click", () => {
  if (currentBusiness) openBookingPage(currentBusiness);
});

document.getElementById("bk-back").addEventListener("click", () => show("screen-detail"));

document.getElementById("bk-date-btn").addEventListener("click", () => {
  if (currentBusiness) openBookingModal(currentBusiness, null, true);
});

bkPackages.addEventListener("click", e => {
  const btn = e.target.closest(".pkg");
  if (!btn) return;
  pendingPackage = Number(btn.dataset.index);
  renderPackages();
  syncBookingPage();
});

document.getElementById("bk-confirm").addEventListener("click", () => {
  if (!currentBusiness) return;
  if (!pendingDate) {
    bkError.textContent = "Please pick a date to continue.";
    bkError.hidden = false;
    return;
  }
  if (isDateTaken(currentBusiness.id, pendingDate, null)) {
    bkError.textContent = ALREADY_BOOKED;
    bkError.hidden = false;
    return;
  }
  bkError.hidden = true;

  const b = currentBusiness;
  const pkg = PACKAGES[pendingPackage];

  saveBookings([...getBookings(), {
    id: Date.now() + "-" + Math.random().toString(36).slice(2, 8),
    businessId: b.id,
    businessName: b.name,
    customerName: getStoredName() || "",
    customerEmail: getStoredEmail(),
    date: pendingDate,
    packageName: pkg.name,
    price: pkg.price,
    createdAt: new Date().toISOString()
  }]);

  // fill in and open the Booking Confirmed modal
  document.getElementById("confirm-text").textContent = "Your booking at " + b.name + " is all set.";
  document.getElementById("confirm-img").src = b.image;
  document.getElementById("confirm-img").alt = b.name;
  document.getElementById("confirm-name").textContent = b.name;
  document.getElementById("confirm-category").textContent = b.category;
  document.getElementById("confirm-date").textContent = formatDate(pendingDate);
  document.getElementById("confirm-package").textContent = pkg.name;
  document.getElementById("confirm-total").textContent = money(pkg.price);
  confirmModal.hidden = false;
  document.getElementById("confirm-view").focus();

  // demo: the email option only changes the message, nothing is actually emailed
  if (bkEmailCheck.checked && b.email) toast("Email sent to " + b.email);
  renderSheet();
});

function closeConfirm() {
  confirmModal.hidden = true;
  show("screen-home");
  document.querySelector('.nav-btn[data-tab="ticket"]').click();
}
document.getElementById("confirm-view").addEventListener("click", closeConfirm);
confirmModal.addEventListener("click", e => { if (e.target === confirmModal) closeConfirm(); });


// Bottom nav tabs: Favourites, Bookings and Saved open a panel over the home list
const sheetEl = document.getElementById("sheet");
const sheetTitle = document.getElementById("sheet-title");
const sheetList = document.getElementById("sheet-list");
const sheetEmpty = document.getElementById("sheet-empty");
const sheetClear = document.getElementById("sheet-clear");

const SHEETS = {
  heart: { title: "Favourites", key: FAV_KEY, empty: "No favourites yet. Tap the heart on a business to add it here.", clearLabel: "Clear favourites", clearToast: "Favourites cleared" },
  ticket: { title: "Bookings", empty: "No bookings yet. Open a business and tap Book Now.", clearLabel: "Clear bookings", clearToast: "All bookings cleared" },
  bookmark: { title: "Saved", key: SAVED_KEY, empty: "Nothing saved yet. Tap the bookmark on a business to keep it here.", clearLabel: "Clear saved", clearToast: "Saved list cleared" }
};
let activeTab = null;   // null = panel closed (Home tab)

function createBookingRow(booking, b) {
  const row = document.createElement("article");
  row.className = "booking-card";

  const img = document.createElement("img");
  img.className = "booking-img";
  img.src = b.image;
  img.alt = b.name;

  const info = document.createElement("div");
  info.className = "booking-info";

  const title = document.createElement("h4");
  title.textContent = b.name;

  const pill = document.createElement("span");
  pill.className = "pill";
  pill.textContent = b.category;

  const date = document.createElement("p");
  date.className = "booking-date";
  date.textContent = "Booked for " + formatDate(booking.date) + (booking.packageName ? " · " + booking.packageName : "");

  info.append(title, pill, date);

  const actions = document.createElement("div");
  actions.className = "booking-actions";

  const reschedule = document.createElement("button");
  reschedule.type = "button";
  reschedule.className = "btn-reschedule";
  reschedule.dataset.bookingId = booking.id;
  reschedule.textContent = "Reschedule";

  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.className = "btn-cancel";
  cancel.dataset.bookingId = booking.id;
  cancel.textContent = "Cancel";

  actions.append(reschedule, cancel);
  row.append(img, info, actions);
  return row;
}

// Clear button: first tap asks "Tap again to confirm", second tap clears (resets after 3 seconds)
let clearArmed = false;
let clearTimer = null;

function resetClear() {
  clearArmed = false;
  clearTimeout(clearTimer);
}

sheetClear.addEventListener("click", () => {
  const cfg = SHEETS[activeTab];
  if (!cfg || !cfg.clearLabel) return;

  if (!clearArmed) {
    clearArmed = true;
    sheetClear.textContent = "Tap again to confirm";
    sheetClear.classList.add("armed");
    clearTimer = setTimeout(renderSheet, 3000);   // nobody confirmed, so put the button back
    return;
  }

  writeList(cfg.key || BOOKINGS_KEY, []);  // bookings have no key in the config so they use BOOKINGS_KEY
  toast(cfg.clearToast);
  renderSheet();
});

function renderSheet() {
  resetClear();

  if (!activeTab) {
    sheetEl.hidden = true;
    return;
  }

  const cfg = SHEETS[activeTab];

  sheetTitle.textContent = cfg.title;
  const emptyMessage = cfg.empty;

  let items;
  if (activeTab === "ticket") {
    sheetList.className = "booking-list";
    items = getBookings()
      .map(bk => { const b = businesses.find(x => x.id === bk.businessId); return b ? createBookingRow(bk, b) : null; })
      .filter(Boolean);
  } else {
    sheetList.className = "cards";
    items = readList(cfg.key)
      .map(id => businesses.find(b => b.id === id))
      .filter(Boolean)
      .map(b => createCard(b, 6));
  }

  sheetList.replaceChildren(...items);
  sheetEmpty.textContent = emptyMessage;
  sheetEmpty.hidden = items.length > 0;

  sheetClear.hidden = !cfg.clearLabel || items.length === 0;   // only when there is something to clear
  sheetClear.textContent = cfg.clearLabel || "";
  sheetClear.classList.remove("armed");

  sheetEl.hidden = false;
}

// Any nav button other than the three tabs (Home, Account) closes the panel
document.querySelectorAll(".nav-btn").forEach(btn =>
  btn.addEventListener("click", () => {
    activeTab = SHEETS[btn.dataset.tab] ? btn.dataset.tab : null;
    renderSheet();
    sheetEl.scrollTop = 0;
  })
);

// Nav Search: back to the business list with the search box ready to type in
document.getElementById("nav-search").addEventListener("click", () => {
  document.querySelector(".scroll").scrollTop = 0;
  searchInput.focus();
});

// Nav Profile is the same as the Profile button at the top of the home screen
document.getElementById("nav-user").addEventListener("click", () => {
  document.getElementById("profile-btn").click();
});

// Tap a card to open it; Reschedule and Cancel work on a booking
sheetList.addEventListener("click", e => {
  const cancel = e.target.closest(".btn-cancel");
  if (cancel) {
    saveBookings(getBookings().filter(bk => String(bk.id) !== cancel.dataset.bookingId));
    toast("Booking cancelled");
    renderSheet();
    return;
  }

  const reschedule = e.target.closest(".btn-reschedule");
  if (reschedule) {
    const booking = getBookings().find(bk => String(bk.id) === reschedule.dataset.bookingId);
    const b = booking && businesses.find(x => x.id === booking.businessId);
    if (b) openBookingModal(b, booking);
    return;
  }

  const b = businessFromEvent(e);
  if (b) openBusiness(b);
});

sheetList.addEventListener("keydown", e => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const b = businessFromEvent(e);
  if (b) {
    e.preventDefault();
    openBusiness(b);
  }
});


// ---------- User name + email (saved in localStorage) ----------

const NAME_KEY = "bookingUserName";
const EMAIL_KEY = "bookingUserEmail";
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("name-input");
const nameError = document.getElementById("name-error");

function getStoredName() {
  try { return localStorage.getItem(NAME_KEY); } catch { return null; }
}

function storeName(name) {
  try { localStorage.setItem(NAME_KEY, name); } catch { /* storage blocked */ }
}

// The email is optional: an empty value removes it
function getStoredEmail() {
  try { return localStorage.getItem(EMAIL_KEY) || ""; } catch { return ""; }
}

function storeEmail(email) {
  try {
    if (email) localStorage.setItem(EMAIL_KEY, email);
    else localStorage.removeItem(EMAIL_KEY);
  } catch { /* storage blocked */ }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function renderName(name) {
  // textContent (not innerHTML) so typed text can never run as HTML
  document.querySelectorAll(".user-name").forEach(el => (el.textContent = name));
  // profile avatar shows the first letter of the name e.g. Matt = "M"
  document.getElementById("profile-avatar").textContent = Array.from(name)[0].toUpperCase();
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


// ---------- Select location page: tap a pin on the map, or skip. Saved in localStorage ----------

const LOCATION_KEY = "bookingLocation";
const LOCATION_SKIPPED = "__skipped__";   // if skipped

// Map pins: each one sits at an x / y position (in %) on the map picture
const MAP_PINS = [
  { name: "Pretoria",          x: 52.8, y: 38.4 },
  { name: "Cullinan",          x: 63.2, y: 35.6 },
  { name: "Bronkhorstspruit",  x: 71.1, y: 40.7 },
  { name: "Midrand",           x: 49.1, y: 48.0 },
  { name: "Sandton",           x: 46.7, y: 52.2 },
  { name: "Krugersdorp",       x: 36.5, y: 51.3 },
  { name: "Johannesburg",      x: 46.3, y: 55.9 },
  { name: "Soweto",            x: 39.6, y: 58.3 },
  { name: "Benoni",            x: 56.1, y: 55.3 },
  { name: "Alberton",          x: 49.0, y: 58.3 },
  { name: "Vereeniging",       x: 42.0, y: 73.9 }
];
const locCities = document.getElementById("loc-cities");   // row of city buttons under the map

const mapEl = document.getElementById("map");
const locChosen = document.getElementById("loc-chosen");
const locContinue = document.getElementById("loc-continue");
const homeLocationBtn = document.getElementById("home-location");
const homeClearBtn = document.getElementById("home-clear");   // "Clear filter" button on the home screen

let pickedLocation = "";            // pin currently selected on the map
let locationNext = "screen-home";   // where Continue or Skip will lead to

// null = never answered, LOCATION_SKIPPED = skipped, otherwise a real area will be displayed
function getStoredLocation() {
  try { return localStorage.getItem(LOCATION_KEY); } catch { return null; }
}

function storeLocation(value) {
  try { localStorage.setItem(LOCATION_KEY, value); } catch { /* storage blocked */ }
}

function renderLocation() {
  const loc = getStoredLocation();
  const active = !!loc && loc !== LOCATION_SKIPPED;
  homeLocationBtn.textContent = active ? "Location: " + loc + " (change)" : "Showing all areas (set your location)";
  homeClearBtn.hidden = !active;   // the Clear button only shows while a location filter is on
  renderBusinesses();              // filter the business list to the chosen area
}

// Clear the location filter and go back to showing every area
function clearLocationFilter() {
  storeLocation(LOCATION_SKIPPED);   // same as "Show all areas"
  selectPin("");                     // un-highlight the map pin and city chip
  renderLocation();
  toast("Location filter cleared");
}

function selectPin(name) {
  pickedLocation = name;
  mapEl.querySelectorAll(".map-pin").forEach(p => {
    const on = p.dataset.name === name;
    p.classList.toggle("selected", on);
    p.setAttribute("aria-pressed", String(on));
  });
  locCities.querySelectorAll(".chip").forEach(c => {
    const on = c.dataset.name === name;
    c.classList.toggle("active", on);
    c.setAttribute("aria-pressed", String(on));
    if (on) c.scrollIntoView({ inline: "center", block: "nearest" });
  });
  locChosen.textContent = name ? "Selected: " + name : "No location selected";
  locContinue.disabled = !name;
}

MAP_PINS.forEach(pin => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "map-pin";
  btn.dataset.name = pin.name;
  btn.style.left = pin.x + "%";
  btn.style.top = pin.y + "%";
  btn.setAttribute("aria-pressed", "false");
  btn.setAttribute("aria-label", pin.name);

  const dot = document.createElement("span");
  dot.className = "dot";
  const label = document.createElement("span");
  label.className = "tag-label";
  label.textContent = pin.name;

  btn.append(dot, label);
  btn.addEventListener("click", () => selectPin(pin.name));
  mapEl.append(btn);

  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "chip";
  chip.dataset.name = pin.name;
  chip.textContent = pin.name;
  chip.setAttribute("aria-pressed", "false");
  chip.addEventListener("click", () => selectPin(pin.name));
  locCities.append(chip);
});

function openLocation(next) {
  locationNext = next;
  const current = getStoredLocation();
  selectPin(current && current !== LOCATION_SKIPPED ? current : "");
  show("screen-location");
}

locContinue.addEventListener("click", () => {
  if (!pickedLocation) return;
  storeLocation(pickedLocation);
  renderLocation();
  toast("Location set to " + pickedLocation);
  show(locationNext);
});

document.getElementById("loc-skip").addEventListener("click", () => {
  storeLocation(LOCATION_SKIPPED);   // show all areas (also clears an earlier choice)
  renderLocation();
  show(locationNext);
});

homeLocationBtn.addEventListener("click", () => openLocation("screen-home"));
homeClearBtn.addEventListener("click", clearLocationFilter);

// Welcome page to Get Started: always show the map and select location page first
document.getElementById("get-started").addEventListener("click", () => {
  openLocation("screen-home");
});


// ---------- Profile page: change name and (optional) email ----------

const profileForm = document.getElementById("profile-form");
const profileInput = document.getElementById("profile-name-input");
const profileError = document.getElementById("profile-name-error");
const profileEmailInput = document.getElementById("profile-email-input");
const profileEmailError = document.getElementById("profile-email-error");

document.getElementById("profile-btn").addEventListener("click", () => {
  profileInput.value = getStoredName() || "";     // start with the current name
  profileEmailInput.value = getStoredEmail();     // and the current email
  profileError.hidden = true;
  profileEmailError.hidden = true;
  show("screen-profile");
  profileInput.focus();
});

profileForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = profileInput.value.trim();
  const email = profileEmailInput.value.trim();

  if (!name) {
    profileError.hidden = false;
    profileInput.focus();
    return;
  }
  // the email can be left blank, but if it is filled in it must look like a real address
  if (email && !isValidEmail(email)) {
    profileEmailError.hidden = false;
    profileEmailInput.focus();
    return;
  }

  profileError.hidden = true;
  profileEmailError.hidden = true;
  storeName(name);
  storeEmail(email);
  renderName(name);
  toast("Profile updated");
  show("screen-home");
});

profileInput.addEventListener("input", () => (profileError.hidden = true));
profileEmailInput.addEventListener("input", () => (profileEmailError.hidden = true));


// On every load/refresh: if no name is stored the system goes straight to the name prompt
const savedName = getStoredName();
if (savedName) {
  renderName(savedName);
  renderLocation();
  show("screen-welcome");
} else {
  show("screen-name");
  nameInput.focus();
}

loadBusinesses();