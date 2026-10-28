// Business data: embedded so it works without a server (running locally)

const BUSINESS_DATA = [
  { "id": 1, "name": "Glow Nail Studio", "email": "info@glownailstudio.example", "category": "Salons & Beauty", "description": "Hair, nails and skincare in a relaxed studio.", "image": "assets/images/businesses/nail-hygiene-care-flat-lay.jpg" },
  { "id": 2, "name": "Quick Fix Garage", "email": "info@quickfixgarage.example", "category": "Auto Services", "description": "Servicing, tyres and general car repairs.", "image": "assets/images/businesses/service.jpg" },
  { "id": 3, "name": "Bella Rossa Cucina", "email": "info@bellarossacucina.example", "category": "Restaurants", "description": "Family-run Italian kitchen with dine-in and takeaway based in Rosebank.", "image": "assets/images/businesses/restaurant.jpg" },
  { "id": 4, "name": "Iron Pulse Fitness", "email": "info@ironpulsefitness.example", "category": "Health & Fitness", "description": "Strength training, group classes and personal coaching.", "image": "assets/images/businesses/dumbells.jpg" },
  { "id": 5, "name": "Sunrise Dental Care", "email": "info@sunrisedentalcare.example", "category": "Health & Medical", "description": "Friendly family dentistry with check-ups, whitening and braces.", "image": "assets/images/businesses/dentist.jpg" },
  { "id": 6, "name": "The Daily Grind Café", "email": "info@thedailygrindcaf.example", "category": "Restaurants", "description": "Specialty coffee, fresh pastries and light breakfast and lunch.", "image": "assets/images/businesses/coffee.jpg" },
  { "id": 7, "name": "Sharp Cuts Barbershop", "email": "info@sharpcutsbarbershop.example", "category": "Salons & Beauty", "description": "Classic cuts, fades and beard trims with walk-ins welcome.", "image": "assets/images/businesses/salon.jpg" },
  { "id": 8, "name": "Spark Electrical Services", "email": "info@sparkelectricalservices.example", "category": "Home Services", "description": "Certified electricians for repairs, installations and compliance certificates.", "image": "assets/images/businesses/electrician-working.jpg" },
  { "id": 9, "name": "PawPals Pet Grooming", "email": "info@pawpalspetgrooming.example", "category": "Pet Services", "description": "Gentle grooming, baths and nail trims for dogs and cats.", "image": "assets/images/businesses/dog.jpg" },
  { "id": 10, "name": "Bright Minds Tutoring", "email": "info@brightmindstutoring.example", "category": "Education", "description": "After-school maths, science and English lessons for primary and high school learners.", "image": "assets/images/businesses/tutor.jpg" },
  { "id": 11, "name": "Green Thumb Landscaping", "email": "info@greenthumblandscaping.example", "category": "Home Services", "description": "Garden design, lawn care and irrigation for homes and small businesses.", "image": "assets/images/businesses/garden.jpg" },
  { "id": 12, "name": "Tyre Kings Auto Centre", "email": "info@tyrekingsautocentre.example", "category": "Auto Services", "description": "New and used tyres, wheel alignment and balancing while you wait.", "image": "assets/images/businesses/tyres.jpg" }
];

// Returns a promise so loadBusinesses can `await` it now 
function getBusinesses() {

   return Promise.resolve(BUSINESS_DATA);

}


//Getting the classes and loading all the icons

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
  //set the toaster timout to 2.2 seconds
}

 
// Any element with data-goto switches to that screen
document.querySelectorAll("[data-goto]").forEach(el  =>

  el.addEventListener("click", () => show(el.dataset.goto))
);
 
// Bottom nav: swap icon colour and highlight

document.querySelectorAll(".nav-btn").forEach( btn =>

  btn.addEventListener("click", () => {

    document.querySelectorAll(".nav-btn").forEach(b  => {
      const active = b  === btn;
      b.classList.toggle("active", active);
      b.querySelector("img").src =  `${ICON_PATH}${active ? "blue" : "grey"}/${b.dataset.icon}.svg`; //load the image for the nav based on its color
       });
     })
);

 
// Display functions Businesses: loaded from data/businesses.json 
const listEl = document.getElementById("business-list");
 const chipsEl = document.getElementById("category-chips");
  const statusEl = document.getElementById("list-status");

   const searchInput = document.getElementById("search-input");
 
let businesses = [];
let activeCategory = "All";
let query = " ";

//Every card is built ONCE and kept here (id -> card), filtering only shows/hides them
const cardEls = new Map();

 
function setStatus(message, isError = false) {

  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
  statusEl.hidden = !message;

}


function createCard(b, index) {

  const card = document.createElement("article");
  card.className =  "place-card";
  card.tabIndex = 0;
  card.dataset.id  = b.id;
 
 const img  = document.createElement("img");
//Create a image element

  img.className =  "place-img";
  img.src =  b.image; //image source
  img.alt = b.name; //image alt text 
  img.decoding = "async"; //decode the picture off the main thread so the page stays smooth
  img.loading = index < 6 ? "eager" : "lazy"; //first 6 (visible on load) load straight away, the rest load as you scroll to them
  if (index < 3) img.fetchPriority = "high"; //top row of pictures is fetched first

 
  const title = document.createElement ("h4");//Creates a H4 tag in the memory
  title.textContent = b.name; //set the business name to the H4 tag created 
 
  const category = document.createElement ("p"); //Create the p tag in memory
  category.textContent = b.category; //Set the p tag to the category
 
  card.append (img, title, category);
  return card;
}


 //funtion to load all the businesses 

function renderBusinesses() {

  const q =  query.trim().toLowerCase();
  let shown = 0;

  //show or hide the cards that already exist instead of rebuilding every card and picture
  businesses.forEach(b => {
    const match = (activeCategory === "All"  || b.category ===  activeCategory) &&
      (!q || [b.name, b.category, b.description].some(v => v.toLowerCase ().includes(q)));
    cardEls.get(b.id).hidden = !match;
    if (match) shown++;
  });
 
  setStatus(shown ? "" : "No businesses found.");

}
 
function renderChips()  {

    //load the business chips
    
   const categories = ["All", ... new Set(businesses.map (b => b.category))];

   chipsEl.replaceChildren (...categories.map(name =>  {
    
    const chip =  document.createElement("button");
    chip.className = "chip" + (name  === activeCategory ?  " active"  :  "");
    chip.setAttribute ("role" , "tab" );

    chip.textContent = name;
    chip.addEventListener ("click", () => {
    activeCategory  =  name;
    chipsEl.querySelectorAll(".chip").forEach (c  => c.classList.toggle ("active", c === chip));
    renderBusinesses();

    });

    return chip;

  }));

}
 //Search input functions
searchInput.addEventListener("input", e => {  // runs this function on every change to the input

  query = e.target.value;   //save what's currently typed
  renderBusinesses();  //redraw the list using that query

});

 //load business functions and throw an error upon failed load 
async function loadBusinesses() {

  try {

    businesses = await getBusinesses();

    //build every card once and add them to the page in a single step
    const fragment = document.createDocumentFragment();
    businesses.forEach((b, i) => {
      const card = createCard(b, i);
      cardEls.set(b.id, card);
      fragment.append(card);
    });
    listEl.replaceChildren(fragment);

    renderChips();

    renderBusinesses();

  }  catch (err) {
    console.error(err);
       setStatus("Could not load businesses: " + err.message,  true );
  }

}



// Open a business to details page
const detailImg = document.getElementById("detail-img");
 
function openBusiness(b) {

document.getElementById("detail-name").textContent = b.name;  //Find the element with id "detail-name", set its text
document.getElementById("detail-category").textContent = b.category;//Puts the category into the detail pages element
document.getElementById("detail-desc").textContent = b.description;// Puts the business's description text into the detail page's description element
detailImg.src = b.image;
detailImg.alt = b.name;

currentBusiness = b;
syncDetailButtons();  //reflect whether this business is already a favourite / saved
syncEmailButton(b);   //point the email button at this business

show("screen-detail"); //show the detail page 

}
 

 
// Email (DEMO ONLY): the compose box and Send button never contact anything, they just show a toast
const emailBtn = document.getElementById("email-btn");
const emailModal = document.getElementById("email-modal");
const emailForm = document.getElementById("email-form");
const emailTo = document.getElementById("email-to");
const emailBody = document.getElementById("email-body");
const emailError = document.getElementById("email-error");

function syncEmailButton(b) {
  emailBtn.hidden = !b.email;
}

function openEmailModal(b) {
  const name = getStoredName() || "";
  emailTo.textContent = "To: " + b.email;
  emailBody.value = "Hi " + b.name + ",\n\nI found you on Open Book and would like to ask about your services.\n\nKind regards,\n" + name;
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
  //demo: no request is made and no email leaves the browser
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
let currentBusiness = null;   //the business open on the details page

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
  renderSheet();  //the tab panel may be open behind the details page, so refresh it
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


// Booking modal: opens the calendar to book a new date, or to move an existing booking
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

let modalState = null;    //{ business, booking } while the modal is open (booking is null for a new booking)
let modalOpener = null;   //the button that opened it, so focus can go back there
let calMonth = { y: 0, m: 0 };   //month on show (m is 0-11)
let selectedDate = "";           //"YYYY-MM-DD", or "" until a day is picked

function openBookingModal(b, booking = null) {
  modalState = { business: b, booking };
  modalOpener = document.activeElement;

  selectedDate = booking ? booking.date : "";
  const [y, m] = (selectedDate || todayYMD()).split("-").map(Number);
  calMonth = { y, m: m - 1 };   //start on the booking's month, or this month

  modalTitle.textContent = booking ? "Reschedule booking" : "Book " + b.name;
  confirmBtn.textContent = booking ? "Save date" : "Send";
  bookingEmailCheck.checked = false;
  bookingEmailRow.hidden = !!booking || !b.email;   //email option only when making a new booking
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
  calPrev.disabled = y * 12 + m <= ty * 12 + (tm - 1);   //no going back before this month

  const cells = [];
  const offset = new Date(y, m, 1).getDay();   //Sunday = 0, so this many empty cells come first
  for 
  (let i = 0;
     i < offset; i++)
      cells.push(document.createElement("span"));

  const daysInMonth = new Date(y, m + 1, 0).getDate();
  for 
  (let d = 1; d 
    <= daysInMonth; 
    d++) 
    {
    const ymd = y + "-" + pad(m + 1) + "-" + pad(d);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cal-day";
    btn.textContent = d;
    btn.dataset.date = ymd;


    let label = formatDate(ymd);
    if
     (ymd < today) 
     {
      btn.disabled = true;
      btn.classList.add("past");
    } else if
     (isDateTaken (business.id, ymd, booking ? booking.id : null))
      {
      btn.classList.add("booked");   //struck through; tapping it explains why it can't be picked
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
  calDays.querySelector(".selected").focus();   //keep keyboard focus on the day that was picked
});

bookingForm.addEventListener("submit", e => {
  e.preventDefault();
  if (!modalState) return;

  const date = selectedDate;
  if (!date) return showBookingError("Please pick a date to continue.");
  if (date < todayYMD()) return showBookingError("Please choose today or a future date.");

  const { business, booking } = modalState;
  if (booking && booking.date === date) return closeBookingModal();   //nothing changed
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
      date,
      createdAt: new Date().toISOString()
    }]);
    //demo: the email option only changes the message, nothing is actually emailed
    toast(bookingEmailCheck.checked ? "Booking sent. Email sent to " + business.email : "Booking sent");
  }
  
  closeBookingModal();
  renderSheet();

});

document.getElementById("booking-close-btn").addEventListener("click", closeBookingModal);

modalEl.addEventListener("click", e => {
  if (e.target === modalEl) closeBookingModal();   //tap outside the card
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !modalEl.hidden) closeBookingModal();
});

document.getElementById("book-btn").addEventListener("click", () => {
  if (currentBusiness) openBookingModal(currentBusiness);
});

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
let activeTab = null;   //null = panel closed (Home tab)

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
  date.textContent = "Booked for " + formatDate(booking.date);

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
    clearTimer = setTimeout(renderSheet, 3000);   //nobody confirmed, so put the button back
    return;
  }

  writeList(cfg.key || BOOKINGS_KEY, []);   //bookings have no key on the config, so they use BOOKINGS_KEY
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
  let emptyMessage = cfg.empty;

  let items;
  if (activeTab === "ticket") {
    sheetList.className = "booking-list";
    items = getBookings()
      .map(bk => { const b = businesses.find(x => x.id === bk.businessId); return b ? createBookingRow(bk, b) : null; })
      .filter(Boolean);

  } 
  else {
    sheetList.className = "cards";
    items = readList(cfg.key)
      .map(id => businesses.find(b => b.id === id))
      .filter(Boolean)
      .map(b => createCard(b, 6));
  }

  sheetList.replaceChildren(...items);
  sheetEmpty.textContent = emptyMessage;
  sheetEmpty.hidden = items.length > 0;

  sheetClear.hidden = !cfg.clearLabel || items.length === 0;   //only on Favourites and Bookings, and only when there is something to clear
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

// Tap a card to open it; Reschedule and Cancel work on a booking
sheetList.addEventListener("click", e => {

  const cancel = e.target.closest(".btn-cancel");
  if 
  (cancel) {
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
 
//Save user name in the local storage re-ask if there is no user name stored

const NAME_KEY = "bookingUserName";
const nameForm = document.getElementById("name-form");
const nameInput = document.getElementById("name-input");
const nameError = document.getElementById("name-error");
 
function getStoredName()
 {
  try { return localStorage.getItem(NAME_KEY); } catch { return null; }
}
 
function storeName(name) 
{

  try { localStorage.setItem(NAME_KEY, name); } catch { /* storage blocked */ }
}
 
function renderName(name) 
{
  // textContent (not innerHTML) so typed text can never run as HTML
  document.querySelectorAll(".user-name").forEach(el => (el.textContent = name));
  // profile avatar shows the first letter of the name
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
 
// Profile page: opened from the user icon on the home screen, lets the user change their name
const profileForm = document.getElementById("profile-form");
const profileInput = document.getElementById("profile-name-input");
const profileError = document.getElementById("profile-name-error");

document.getElementById("profile-btn").addEventListener("click", () => {
  profileInput.value = getStoredName() || "";  //start with the current name
  profileError.hidden = true;
  show("screen-profile");
  profileInput.focus();

});

profileForm.addEventListener("submit", e => {
  e.preventDefault();
  const name = profileInput.value.trim();
  if (!name) {
    profileError.hidden = false;
    profileInput.focus();
    return;
  }
  profileError.hidden = true;
  storeName(name);
  renderName(name);
  toast("Name updated");
  show("screen-home");

});

profileInput.addEventListener("input", () => (profileError.hidden = true));

// On every load/refresh: no stored name go straight to prompt
const savedName = getStoredName();
if (savedName) {

  renderName(savedName);
  show("screen-welcome");

}
 else
   {
  show("screen-name");
  nameInput.focus();
}
 
loadBusinesses();