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
    setStatus("Could not load businesses. ",  true );
  }

}