// Business data: embedded so it works without a server (swap for an SQL API later)
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

// Returns a promise so script.js can `await` it now and a real API later
function getBusinesses() {
  return Promise.resolve(BUSINESS_DATA);
}