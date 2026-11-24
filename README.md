# Open Book: Small Business Booking System

A mobile-first web app that lets people in Gauteng, South Africa discover local service businesses and book them online, with no phone calls or WhatsApp back-and-forth.

**Live demo:** hosted on Firebase Hosting (project `openbook-website`)

---

## Business Problems

Many local service businesses, such as salons, barbers, garages and car washes, have no online presence and take every booking by phone or WhatsApp. That means:

- Missed calls and lost customers
- Double bookings
- No way to show prices or availability

Open Book gives these businesses a simple, browsable listing with prices, opening hours and a booking calendar that blocks dates that are already taken.

---

## Features

- **Personalised onboarding**: enter your name, then pick your location
- **Interactive Gauteng map**: tap a city pin (Pretoria, Sandton, Soweto, Midrand and more) to filter businesses by area, or skip to see all areas
- **Search and category filters**: live search plus category chips (Salons & Beauty, Auto Services, Restaurants, Health & Fitness and more)
- **Business detail pages**: description, category, opening hours, Book Now and Email buttons
- **Booking flow**: calendar date picker, three packages (Standard R250, Premium R450, Deluxe R750), running total and a "Booking Confirmed" modal
- **Double-booking protection**: a date already booked for a business can't be booked again
- **Favourites, Saved and Bookings tabs**: each with clear buttons and confirmation prompts
- **Edit and manage bookings**: view, change or clear bookings from the Bookings tab
- **User profile**: change your name and add an email so businesses can see who is booking
- **Email enquiry template**: pre-filled message to the business (demo only, see Limitations)
- **Persistent state**: everything is saved in the browser via `localStorage`
- **Responsive design**: built for mobile and widened for larger screens

---

## Tech Stack

| Area | Technology |
|------|------------|
| Front end | HTML5, CSS3, vanilla JavaScript (no framework) |
| Data | Embedded JavaScript array of businesses (`BUSINESS_DATA`) |
| Storage | Browser `localStorage` |
| Hosting | Firebase Hosting |
| Font | Plus Jakarta Sans (Google Fonts) |

---

## Project Structure

```
Small Business Booking System/
├── index.html            # All screens, modals and markup
├── css/
│   └── style.css         # Styling for every screen and component
├── js/
│   ├── Main.js           # Screen switching helper
│   └── script.js         # App logic: data, booking, map, storage (loaded by index.html)
├── data/
│   ├── businesses.json   # Earlier static data seed
│   └── Data.js           # Earlier data helper
├── assets/
│   ├── images/           # Business photos, Gauteng map, confirmation graphic
│   └── icons/            # SVG icons in grey, white and blue
├── firebase.json         # Firebase Hosting config
├── .firebaserc           # Firebase project link
├── Package.json          # Project metadata
└── README.md
```

---

## How It Works

1. **Name**: the user enters their name (stored locally).
2. **Location**: tap a pin on the Gauteng map, or show all areas.
3. **Welcome**: intro screen leading to the home page.
4. **Home**: browse, search and filter businesses.
5. **Details**: view hours and description, favourite or save the business.
6. **Book**: choose a date and package, then confirm.
7. **Manage**: review everything from the Favourites, Bookings and Saved tabs.

### localStorage keys

| Key | Purpose |
|-----|---------|
| `bookingUserName` | User's name |
| `bookingLocation` | Selected area (or skipped) |
| `bookingFavourites` | Favourited business IDs |
| `bookingSaved` | Saved-for-later business IDs |
| `bookingBookings` | All bookings |

---

## Known Limitations

- **Demo data only**: businesses, emails and prices are placeholders.
- **Bookings are per-browser**: they live in `localStorage`, so they are not shared between users or devices. Double-booking protection therefore only works within one browser until a real backend exists.
- **Emails are simulated**: the email modal shows a confirmation toast but sends nothing.
- **No authentication or payments.**
- **Housekeeping:** `Package.json` still points to a `server.js` that is not in the repo, and `data/businesses.json` / `data/Data.js` are older copies of the data now embedded in `js/script.js`.

---

## Roadmap

- [ ] **SQL integration**: move from static JSON to a structured, well-planned SQL database
- [ ] **Data injection**: seed and manage business data properly
- [ ] Backend API for shared bookings and true availability
- [ ] Real email or WhatsApp notifications to business owners
- [ ] Business owner dashboard
- [ ] User accounts and authentication
- [ ] **Expand to more provinces**: the app currently covers Gauteng only; add maps, locations and businesses for the other provinces (Western Cape, KwaZulu-Natal, Eastern Cape, Free State, Limpopo, Mpumalanga, North West and Northern Cape)

---

## Author

Conrad Mitileni
