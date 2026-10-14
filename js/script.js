// ===== Hero rotating word =====
(function () {
    const wordEl = document.getElementById("hero-word");
    if (!wordEl) return;

    // Skip the rotation if the visitor prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const words = ["salons.", "restaurants.", "garages.", "services."];
    let i = 0;

    setInterval(function () {
        // Fade the old word out
        wordEl.classList.add("out");

        setTimeout(function () {
            i = (i + 1) % words.length;
            wordEl.textContent = words[i];

            // Place the new word slightly below, then let it slide up into place
            wordEl.classList.add("pre");
            wordEl.classList.remove("out");
            void wordEl.offsetWidth; // forces the browser to apply "pre" first
            wordEl.classList.remove("pre");
        }, 350);
    }, 2800);
})();


// ===== Businesses =====

// Data layer: the only part that changes when you move to SQL (point it at an API endpoint)
async function getBusinesses() {
    const response = await fetch("data/businesses.json");
    if (!response.ok) throw new Error("Could not load businesses");
    return response.json();
}

// Render layer
function renderBusinesses(businesses) {
    const grid = document.getElementById("business-grid");
    if (!grid) return;

    grid.innerHTML = "";

    if (businesses.length === 0) {
        grid.innerHTML = '<p class="business-status">No businesses listed yet.</p>';
        return;
    }

    businesses.forEach(function (biz) {
        const card = document.createElement("article");
        card.className = "business-card";

        // Image + book button
        const media = document.createElement("div");
        media.className = "business-media";

        const img = document.createElement("img");
        img.className = "business-img";
        img.src = biz.image || "images/businesses/placeholder.jpg";
        img.alt = biz.name;
        img.loading = "lazy";
        img.addEventListener("error", function () {
            img.onerror = null;
            img.removeAttribute("src");
            img.classList.add("business-img-fallback");
        });

        const bookBtn = document.createElement("a");
        bookBtn.className = "business-book-btn";
        bookBtn.href = "#book";
        bookBtn.textContent = "Book";
        bookBtn.setAttribute("aria-label", "Book " + biz.name);

        media.append(img, bookBtn);

        // Text
        const body = document.createElement("div");
        body.className = "business-body";

        const tag = document.createElement("span");
        tag.className = "business-tag";
        tag.textContent = biz.category;

        const title = document.createElement("h3");
        title.textContent = biz.name;

        const desc = document.createElement("p");
        desc.textContent = biz.description;

        body.append(tag, title, desc);
        card.append(media, body);
        grid.appendChild(card);
    });
}

getBusinesses()
    .then(renderBusinesses)
    .catch(function (error) {
        console.error(error);
        const grid = document.getElementById("business-grid");
        if (grid) {
            grid.innerHTML = '<p class="business-status">Unable to load businesses right now.</p>';
        }
    });


// ===== Mobile menu =====
const burger = document.getElementById("burger");
const navLinks = document.getElementById("nav-links");

if (burger && navLinks) {
    burger.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("open");
        burger.setAttribute("aria-expanded", isOpen);
    });

    // Close the menu after tapping a link
    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("open");
            burger.setAttribute("aria-expanded", "false");
        });
    });
}


// ===== Slider =====
(function () {
    const slider = document.getElementById("slider");
    if (!slider) return;

    const track = slider.querySelector(".slider-track");
    const slides = slider.querySelectorAll(".slide");
    const dotsWrap = slider.querySelector(".slider-dots");
    let index = 0;
    let timer;

    // Build dots
    slides.forEach(function (_, i) {
        const dot = document.createElement("button");
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        dot.addEventListener("click", function () { goTo(i); restart(); });
        dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll("button");

    function goTo(i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = "translateX(-" + index * 100 + "%)";
        dots.forEach(function (d, n) {
            d.classList.toggle("active", n === index);
        });
    }

    function start() { timer = setInterval(function () { goTo(index + 1); }, 5000); }
    function restart() { clearInterval(timer); start(); }

    slider.querySelector(".next").addEventListener("click", function () { goTo(index + 1); restart(); });
    slider.querySelector(".prev").addEventListener("click", function () { goTo(index - 1); restart(); });

    // Pause while hovering
    slider.addEventListener("mouseenter", function () { clearInterval(timer); });
    slider.addEventListener("mouseleave", start);

    goTo(0);
    start();
})();