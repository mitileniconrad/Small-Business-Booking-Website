const  screens  =  document.querySelectorAll(".screen");//grabs everything with the class screen 

function show(id) {
    
  screens.forEach(s => s.classList.toggle("active", s.id === id //loops over the screen id and toggles it as active and displays it with the id

  ));
}

// Any element with data-goto switches to that screen

document.querySelectorAll("[data-goto]").forEach(el  =>
  el.addEventListener("click", () => show(el.dataset.goto )));

// Start on the first screen

show("screen-name");