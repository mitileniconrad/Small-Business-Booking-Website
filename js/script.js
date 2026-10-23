// Business data: embedded so it works without a server (running locally)

const BUSINESS_DATA = [
  { "id": 1, "name": "Glow Nail Studio", "category": "Salons & Beauty", "description": "Hair, nails and skincare in a relaxed studio.", "image": "assets/images/businesses/nail-hygiene-care-flat-lay.jpg" },
  { "id": 2, "name": "Quick Fix Garage", "category": "Auto Services", "description": "Servicing, tyres and general car repairs.", "image": "assets/images/businesses/quick-fix-garage.jpg" },
  { "id": 3, "name": "Bella Rossa Cucina", "category": "Restaurants", "description": "Family-run Italian kitchen with dine-in and takeaway based in Rosebank.", "image": "assets/images/businesses/bella-rossa-cucina.jpg" },
  { "id": 4, "name": "Iron Pulse Fitness", "category": "Health & Fitness", "description": "Strength training, group classes and personal coaching.", "image": "assets/images/businesses/iron-pulse-fitness.jpg" },
  { "id": 5, "name": "Sunrise Dental Care", "category": "Health & Medical", "description": "Friendly family dentistry with check-ups, whitening and braces.", "image": "assets/images/businesses/sunrise-dental-care.jpg" },
  { "id": 6, "name": "The Daily Grind Café", "category": "Restaurants", "description": "Specialty coffee, fresh pastries and light breakfast and lunch.", "image": "assets/images/businesses/the-daily-grind-cafe.jpg" },
  { "id": 7, "name": "Sharp Cuts Barbershop", "category": "Salons & Beauty", "description": "Classic cuts, fades and beard trims with walk-ins welcome.", "image": "assets/images/businesses/sharp-cuts-barbershop.jpg" },
  { "id": 8, "name": "Spark Electrical Services", "category": "Home Services", "description": "Certified electricians for repairs, installations and compliance certificates.", "image": "assets/images/businesses/spark-electrical-services.jpg" },
  { "id": 9, "name": "PawPals Pet Grooming", "category": "Pet Services", "description": "Gentle grooming, baths and nail trims for dogs and cats.", "image": "assets/images/businesses/pawpals-pet-grooming.jpg" },
  { "id": 10, "name": "Bright Minds Tutoring", "category": "Education", "description": "After-school maths, science and English lessons for primary and high school learners.", "image": "assets/images/businesses/bright-minds-tutoring.jpg" },
  { "id": 11, "name": "Green Thumb Landscaping", "category": "Home Services", "description": "Garden design, lawn care and irrigation for homes and small businesses.", "image": "assets/images/businesses/green-thumb-landscaping.jpg" },
  { "id": 12, "name": "Tyre Kings Auto Centre", "category": "Auto Services", "description": "New and used tyres, wheel alignment and balancing while you wait.", "image": "assets/images/businesses/tyre-kings-auto-centre.jpg" }
];

// Returns a promise so loadBusinesses can `await` it now 
function getBusinesses() {

   return Promise.resolve(BUSINESS_DATA);

}


const s = document.querySelector(".scroll");
console.log(getComputedStyle(s).overflowY, getComputedStyle(s).minHeight, s.clientHeight, s.scrollHeight);


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

 
function setStatus(message, isError = false) {

  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
  statusEl.hidden = !message;

}


function createCard(b) {

  const card = document.createElement("article");
  card.className =  "place-card";
  card.tabIndex = 0;
  card.dataset.id  = b.id;
 
 const img  = document.createElement("img");
//Create a image element

  img.className =  "place-img";
  img.src =  b.image; //image source
  img.alt = b.name; //image alt text 
  img.loading =  "lazy"; //load image slowly (near viewpoint)

 
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
  const matches = businesses.filter(b =>
    (activeCategory === "All"  || b.category ===  activeCategory) &&
    (!q || [b.name, b.category, b.description].some(v => v.toLowerCase ().includes(q)))
  );
 
  listEl.replaceChildren(...matches.map(createCard));
  setStatus(matches.length ? "" : "No businesses found.");

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

show("screen-detail"); //show the detail page 

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
  //  save the booking JSON implementation now, SQL API later.
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
 