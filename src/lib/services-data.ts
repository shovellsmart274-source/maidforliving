import standard from "@/assets/svc-standard.jpg";
import deep from "@/assets/svc-deep.jpg";
import movein from "@/assets/svc-movein.jpg";
import moveout from "@/assets/svc-moveout.jpg";
import apartment from "@/assets/svc-apartment.jpg";
import office from "@/assets/svc-office.jpg";
import green from "@/assets/svc-green.jpg";
import event from "@/assets/svc-event.jpg";
import organization from "@/assets/svc-organization.jpg";

export interface ServiceContent {
  slug: string;
  name: string;
  tagline: string;
  short: string;
  image: string;
  intro: string[];
  benefits: { title: string; text: string }[];
  checklist: string[];
  faqs: { q: string; a: string }[];
}

export const SERVICES: ServiceContent[] = [
  {
    slug: "standard-house-cleaning",
    name: "Standard House Cleaning",
    tagline: "Routine care that keeps your home fresh week after week.",
    short: "Dusting, vacuuming, mopping, kitchen and bathroom cleaning.",
    image: standard,
    intro: [
      "Our Standard House Cleaning keeps the rooms you live in every day clean, tidy and comfortable. It is ideal for homes that are maintained regularly and need consistent upkeep.",
      "Every visit follows a room-by-room checklist so nothing is missed, and you can add extras like inside the fridge or interior windows whenever you need them.",
    ],
    benefits: [
      { title: "Consistent results", text: "The same detailed checklist on every visit." },
      { title: "Flexible plans", text: "Book once, or choose weekly, biweekly or monthly service." },
      { title: "More free time", text: "Spend your weekends on what you love, not chores." },
    ],
    checklist: [
      "Dust reachable surfaces and furniture",
      "Vacuum carpets and rugs",
      "Mop hard floors",
      "Clean kitchen countertops and sink",
      "Wipe appliance exteriors",
      "Clean and sanitize bathrooms",
      "Make beds and tidy rooms",
      "Empty trash bins",
    ],
    faqs: [
      { q: "How long does a standard cleaning take?", a: "Most homes take 2–4 hours depending on size and condition." },
      { q: "Do I need to be home?", a: "No. Many customers provide entry instructions so we can clean while they are out." },
      { q: "Can I customize the checklist?", a: "Yes — add special instructions when booking and we will follow them." },
    ],
  },
  {
    slug: "deep-cleaning",
    name: "Deep Cleaning",
    tagline: "A top-to-bottom reset for every corner of your home.",
    short: "Detailed cleaning of hard-to-reach areas, baseboards, kitchens, and bathrooms.",
    image: deep,
    intro: [
      "Deep Cleaning goes far beyond routine upkeep. We focus on built-up grime, hard-to-reach areas and the details that regular cleaning skips.",
      "It is perfect for a first visit, seasonal refresh, or before starting a recurring plan.",
    ],
    benefits: [
      { title: "Detail-focused", text: "Baseboards, door frames, vents and fixtures." },
      { title: "Healthier home", text: "Removes built-up dust and residue throughout." },
      { title: "Fresh start", text: "The perfect foundation for recurring cleaning." },
    ],
    checklist: [
      "Everything in Standard Cleaning",
      "Hand-wipe baseboards and door frames",
      "Clean light switches and door handles",
      "Degrease kitchen backsplash and stovetop",
      "Scrub tile grout and shower glass",
      "Dust vents, blinds and ceiling fans",
      "Clean behind and under movable furniture",
      "Detail cabinet fronts",
    ],
    faqs: [
      { q: "How often should I book a deep cleaning?", a: "Most homes benefit from a deep cleaning every 3–6 months." },
      { q: "Is inside the oven included?", a: "Inside the oven and fridge are available as add-ons during booking." },
      { q: "How long does it take?", a: "Typically 4–7 hours depending on the size and condition of the home." },
    ],
  },
  {
    slug: "move-in-cleaning",
    name: "Move-In Cleaning",
    tagline: "Start life in your new home with a spotless slate.",
    short: "Prepare your new home before moving in.",
    image: movein,
    intro: [
      "Moving is stressful enough. Our Move-In Cleaning makes sure your new home is fresh, sanitized and ready before the first box comes through the door.",
      "We clean empty cabinets, closets, appliances and floors so you can unpack with confidence.",
    ],
    benefits: [
      { title: "Sanitized spaces", text: "Kitchens and bathrooms cleaned before you use them." },
      { title: "Empty-home access", text: "We reach every shelf, drawer and corner." },
      { title: "Peace of mind", text: "Move in knowing every surface is clean." },
    ],
    checklist: [
      "Clean inside cabinets and drawers",
      "Clean inside closets and shelves",
      "Wipe appliance interiors and exteriors",
      "Scrub bathrooms top to bottom",
      "Clean baseboards and window sills",
      "Vacuum and mop all floors",
      "Wipe doors, frames and switches",
    ],
    faqs: [
      { q: "Should the home be empty?", a: "Yes, an empty home allows us to clean inside every cabinet and closet." },
      { q: "Do you clean inside appliances?", a: "Yes, inside the fridge and oven can be included as add-ons." },
      { q: "Can you clean the day before I move in?", a: "Absolutely — choose your preferred date when booking." },
    ],
  },
  {
    slug: "move-out-cleaning",
    name: "Move-Out Cleaning",
    tagline: "Leave your property spotless for the next chapter.",
    short: "Detailed cleaning before leaving a property.",
    image: moveout,
    intro: [
      "Our Move-Out Cleaning helps you leave your home or rental in excellent condition for landlords, buyers or new tenants.",
      "We follow a detailed checklist covering every room, cabinet and appliance so you can hand over the keys with confidence.",
    ],
    benefits: [
      { title: "Handover-ready", text: "Detailed cleaning landlords and buyers appreciate." },
      { title: "Less stress", text: "Focus on your move while we handle the cleaning." },
      { title: "Thorough checklist", text: "Inside cabinets, closets and appliances." },
    ],
    checklist: [
      "Clean inside empty cabinets and drawers",
      "Clean inside closets",
      "Degrease kitchen surfaces and stovetop",
      "Scrub bathrooms, tubs and showers",
      "Wipe baseboards, doors and frames",
      "Spot-clean walls where possible",
      "Vacuum and mop every floor",
    ],
    faqs: [
      { q: "Will this help with my deposit?", a: "A thorough cleaning helps, though final deposit decisions are made by your landlord." },
      { q: "Do you remove left-behind items?", a: "We focus on cleaning; please remove belongings and trash before the visit." },
      { q: "Can I book on short notice?", a: "Choose your date during booking and we will confirm availability." },
    ],
  },
  {
    slug: "apartment-cleaning",
    name: "Apartment Cleaning",
    tagline: "Big-home quality, sized perfectly for apartments and condos.",
    short: "Cleaning solutions for apartments.",
    image: apartment,
    intro: [
      "Apartment living deserves the same level of care. Our Apartment Cleaning is tailored to studios, condos and multi-bedroom units.",
      "We make the most of every square foot — kitchens, bathrooms, living areas and bedrooms all get detailed attention.",
    ],
    benefits: [
      { title: "Right-sized pricing", text: "Plans designed around apartment layouts." },
      { title: "Building-friendly", text: "Quiet, respectful service for shared buildings." },
      { title: "Recurring options", text: "Weekly, biweekly or monthly visits." },
    ],
    checklist: [
      "Dust surfaces and furniture",
      "Clean kitchen counters, sink and appliance fronts",
      "Clean and sanitize bathroom",
      "Clean mirrors and glass",
      "Vacuum and mop floors",
      "Make beds and tidy",
      "Empty trash",
    ],
    faqs: [
      { q: "Do you clean studio apartments?", a: "Yes — choose 0 bedrooms (studio) during booking." },
      { q: "Do you bring supplies?", a: "Yes, our team brings professional supplies and equipment." },
      { q: "Can you access my building?", a: "Share entry instructions in the booking notes." },
    ],
  },
  {
    slug: "office-cleaning",
    name: "Office Cleaning",
    tagline: "A cleaner workplace for a more productive team.",
    short: "Professional office and commercial cleaning.",
    image: office,
    intro: [
      "First impressions matter. Our Office Cleaning keeps workspaces, break rooms and restrooms clean for your team and visitors.",
      "We can schedule visits around your business hours to keep disruption to a minimum.",
    ],
    benefits: [
      { title: "Professional image", text: "A clean, welcoming space for clients." },
      { title: "Healthier team", text: "Regular sanitizing of shared touchpoints." },
      { title: "Flexible scheduling", text: "Early morning, evening or weekend visits." },
    ],
    checklist: [
      "Dust and wipe desks and workstations",
      "Sanitize door handles and touchpoints",
      "Clean break room and kitchenette",
      "Clean and restock restrooms",
      "Vacuum carpets and mop floors",
      "Empty trash and recycling",
      "Clean glass doors and partitions",
    ],
    faqs: [
      { q: "Do you clean after business hours?", a: "Yes, choose the time that suits you and we will confirm availability." },
      { q: "Can you handle larger offices?", a: "Contact us for a custom quote for larger commercial spaces." },
      { q: "Is recurring service available?", a: "Yes, weekly, biweekly and monthly plans are available." },
    ],
  },
  {
    slug: "green-cleaning",
    name: "Green Cleaning",
    tagline: "Eco-conscious cleaning that is gentle on your home.",
    short: "Eco-conscious cleaning options.",
    image: green,
    intro: [
      "Our Green Cleaning option uses eco-conscious products and methods designed to be gentler on your home, family and pets.",
      "You get the same detailed checklist with products chosen to reduce harsh chemicals and strong fragrances.",
    ],
    benefits: [
      { title: "Eco-conscious products", text: "Plant-based and low-fragrance options." },
      { title: "Family & pet friendly", text: "Gentler choices for sensitive households." },
      { title: "Same great clean", text: "No compromise on quality or detail." },
    ],
    checklist: [
      "Dust furniture with microfiber cloths",
      "Clean kitchens with eco-conscious products",
      "Sanitize bathrooms gently",
      "Clean mirrors and glass streak-free",
      "Vacuum with filtered equipment",
      "Mop floors with gentle solutions",
      "Empty trash",
    ],
    faqs: [
      { q: "Are your green products effective?", a: "Yes — we choose products that clean effectively while reducing harsh chemicals." },
      { q: "Can I provide my own products?", a: "Yes, let us know in your booking notes." },
      { q: "Is green cleaning more expensive?", a: "See the live estimate when you book — pricing is shown upfront." },
    ],
  },
  {
    slug: "after-event-cleaning",
    name: "After Event Cleaning",
    tagline: "You enjoy the celebration — we handle the cleanup.",
    short: "Cleaning after parties and special events.",
    image: event,
    intro: [
      "Hosted a birthday, holiday dinner or celebration? Our After Event Cleaning restores your home quickly so you can relax the next day.",
      "We handle dishes, surfaces, floors, trash and bathrooms so your space feels like home again.",
    ],
    benefits: [
      { title: "Fast turnaround", text: "Get your home back the very next day." },
      { title: "Full reset", text: "Kitchen, living areas and bathrooms." },
      { title: "Stress-free hosting", text: "Plan the party without dreading the cleanup." },
    ],
    checklist: [
      "Collect and dispose of trash and recycling",
      "Wash dishes and clean kitchen surfaces",
      "Wipe tables, counters and chairs",
      "Spot-clean spills on hard floors",
      "Vacuum carpets and mop floors",
      "Clean and refresh bathrooms",
      "Reset furniture to its place",
    ],
    faqs: [
      { q: "How soon after my event can you come?", a: "Choose the next available date when booking." },
      { q: "Do you clean outdoor areas?", a: "Let us know in the notes and we will confirm what is possible." },
      { q: "Can I book before and after an event?", a: "Yes — book two separate visits." },
    ],
  },
  {
    slug: "home-organization",
    name: "Home Organization",
    tagline: "Calm, functional spaces designed around your life.",
    short: "Organizing bedrooms, closets, kitchens, and living spaces.",
    image: organization,
    intro: [
      "Clutter makes cleaning harder. Our Home Organization service helps sort, arrange and organize bedrooms, closets, kitchens and living spaces.",
      "We work with your preferences to create systems that are easy to maintain day to day.",
    ],
    benefits: [
      { title: "Clear spaces", text: "Easier to find what you need." },
      { title: "Personalized systems", text: "Organized the way you live." },
      { title: "Easier upkeep", text: "Organized homes stay clean longer." },
    ],
    checklist: [
      "Sort items by category",
      "Organize closets and wardrobes",
      "Arrange kitchen cabinets and pantry",
      "Tidy bedrooms and living spaces",
      "Group and label storage where requested",
      "Wipe shelves and surfaces while organizing",
    ],
    faqs: [
      { q: "Do I need to buy storage products?", a: "No, but we can suggest bins or baskets that would help." },
      { q: "Will you throw things away?", a: "Never without your approval — you decide what stays." },
      { q: "Can you organize one room only?", a: "Yes, mention the rooms in your booking notes." },
    ],
  },
];

export const getServiceContent = (slug: string) => SERVICES.find((s) => s.slug === slug);
