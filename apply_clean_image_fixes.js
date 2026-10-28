const fs = require("fs");
const path = require("path");
const pubDir = path.join(__dirname, "public", "images");
const pagesDir = path.join(__dirname, "public", "pages");
const replacements = {
  "GO180-78-1920x648.jpg.webp": "GO180-70-1920x648.jpg.webp",
  "GO180-79-790x860.jpg.webp": "GO180-79LR1920x1080-790x860.webp",
  "AronWeidenaar_HR-53-1920x648.jpg.webp": "GO180-232LR1920x1080-1920x648.webp",
  "AronWeidenaar_HR-91-1920x648.jpg.webp": "AronWeidenaar_HR-92-1920x648.jpg.webp",
  "AronWeidenaar_HR-49-scaled-e1776779429601.jpg.webp": "AronWeidenaar_HR-52-scaled-e1776779399985.jpg.webp",
  "AronWeidenaar_HR-74-1920x648.jpg.webp": "GO180-112-1920x648.jpg.webp",
  "AronWeidenaar_HR-34-scaled-e1776779544485.jpg.webp": "AronWeidenaar_HR-32-1485x990.jpg.webp",
  "AronWeidenaar_HR-65-1920x648.jpg.webp": "AronWeidenaar_HR-58-1920x648.jpg.webp",
  "AronWeidenaar_HR-77-scaled-e1776778991953.jpg.webp": "AronWeidenaar_HR-73-scaled-e1776779011797.jpg.webp",
  "AronWeidenaar_HR-30-1920x648.jpg.webp": "GO180-28-1920x648.jpg.webp",
  "AronWeidenaar_HR-45-scaled-e1776779443505.jpg.webp": "AronWeidenaar_HR-18-scaled-e1776779630818.jpg.webp",
  "AronWeidenaar_HR-4807-scaled-e1776779716816.jpg.webp": "AronWeidenaar_HR-4883-790x860.jpg.webp",
  "AronWeidenaar_HR-78-1920x648.jpg.webp": "GO180-72-1920x648.jpg.webp",
  "AronWeidenaar_HR-44-scaled-e1776779454739.jpg.webp": "AronWeidenaar_HR-40-1485x990.jpg.webp",
  "AronWeidenaar_HR-85-scaled-e1776778944169.jpg.webp": "AronWeidenaar_HR-78-scaled-e1776778985975.jpg.webp",
  "AronWeidenaar_HR-42-scaled-e1776779461283.jpg.webp": "AronWeidenaar_HR-28-scaled-e1776779578945.jpg.webp",
  "AronWeidenaar_HR-28-1920x648.jpg.webp": "AronWeidenaar_HR-92-1920x648.jpg.webp",
  "AronWeidenaar_HR-55-scaled-e1776779379366.jpg.webp": "GO180-105-790x860.jpg.webp",
  "AronWeidenaar_HR-71-1920x648.jpg.webp": "GO180-79-1920x648.jpg.webp",
  "AronWeidenaar_HR-58-scaled-e1776779329184.jpg.webp": "DSCF7905-scaled-e1785248816279.jpg.webp",
  "AronWeidenaar_HR-73-1920x648.jpg.webp": "AronWeidenaar_HR-68-1920x648.jpg.webp"
};
for (const [oldName, newName] of Object.entries(replacements)) {
  const srcP = path.join(pubDir, newName);
  const dstP = path.join(pubDir, oldName);
  if (fs.existsSync(srcP)) fs.copyFileSync(srcP, dstP);
}
console.log("Safety fallback assets populated in public/images.");
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith(".html"));
let updatedPages = 0;
for (const page of pages) {
  const pPath = path.join(pagesDir, page);
  let html = fs.readFileSync(pPath, "utf8");
  let changed = false;
  for (const [oldName, newName] of Object.entries(replacements)) {
    if (html.includes(oldName)) {
      html = html.split(oldName).join(newName);
      changed = true;
    }
  }
  if (page === "club-leeuwarden.html") {
    if (html.includes("AronWeidenaar_HR-40-scaled-e1776779475401.jpg.webp")) {
      html = html.replace("AronWeidenaar_HR-40-scaled-e1776779475401.jpg.webp", "verified_business/jd_hr_fitness_facade.jpg");
      changed = true;
    }
    if (html.includes("AronWeidenaar_HR--scaled-e1776779811908.jpg.webp")) {
      html = html.replace("AronWeidenaar_HR--scaled-e1776779811908.jpg.webp", "verified_business/jd_hr_fitness_interior_1.jpg");
      changed = true;
    }
    if (html.includes("AronWeidenaar_HR-68-scaled-e1776779268413.jpg.webp")) {
      html = html.replace("AronWeidenaar_HR-68-scaled-e1776779268413.jpg.webp", "verified_business/jd_hr_fitness_interior_2.jpg");
      changed = true;
    }
    if (html.includes("GO180-112-760x990.jpg.webp")) {
      html = html.replace("GO180-112-760x990.jpg.webp", "verified_business/jd_hr_fitness_interior_3.jpg");
      changed = true;
    }
    if (html.includes("GO180-126-760x990.jpg.webp")) {
      html = html.replace("GO180-126-760x990.jpg.webp", "GO180-176LR1920x1080-790x860.webp");
      changed = true;
    }
    if (html.includes("GO180-72-760x990.jpg.webp")) {
      html = html.replace("GO180-72-760x990.jpg.webp", "AronWeidenaar_HR-81-790x860.jpg.webp");
      changed = true;
    }
  }
  const dutchAltWords = [
    ["Sportschoolangst", "Overcoming Gym Anxiety at HR Fitness Club"],
    ["Ik durf niet naar de sportschool", "Overcoming Gym Hesitation and Building Confidence"],
    ["eten voor het sporten", "Pre-Workout Nutrition and Healthy Fueling"],
    ["Tips gezond afvallen", "Healthy and Sustainable Weight Loss Guidance"],
    ["Fitness Leeuwarden", "Fitness Training and Conditioning at HR Fitness Club"],
    ["Personal trainer Leeuwarden", "Personal Training and Coaching at HR Fitness Club"],
    ["Gym Leeuwarden", "HR Fitness Club Thatipur Modern Gym Facility"],
    ["Personal training Leeuwarden", "Dedicated One-on-One Personal Fitness Coaching"],
    ["Sportschool Leeuwarden", "HR Fitness Club Thatipur Gwalior"],
    ["Sportschool in Leeuwarden", "HR Fitness Club Modern Fitness Facility in Thatipur"],
    ["Sporten en mentale gezondheid", "Exercise, Vitality, and Mental Wellbeing"],
    ["Gezond afvallen tips", "Evidence-Based Healthy Weight Loss Coaching"],
    ["krachtoefeningen die niet in jouw schema mogen ontbreken", "Essential Strength Exercises for Full Body Power"],
    ["Meer vitaliteit op de werkvloer", "Corporate Vitality and Workplace Wellness"],
    ["gids voor het maken van je eigen voedingsschema", "Comprehensive Nutrition and Meal Planning Guide"],
    ["Effectieve krachttraining in de gym: Een complete gids", "Effective Strength Training in the Gym: Complete Guide"],
    ["beste eten voor het sporten", "Best Foods for Optimal Workout Energy and Recovery"],
    ["Wat zijn de kenmerken van een gezonde leefstijl", "Key Characteristics of a Sustainable Healthy Lifestyle"],
    ["Vitaliteit werkvloer", "Workplace Vitality and Employee Fitness"],
    ["Gezond eten drukke levensstijl", "Healthy Eating Habits for Busy Professionals"],
    ["Indoor sporten Leeuwarden", "Indoor Fitness and Group Training at HR Fitness Club"],
    ["HYROX Leeuwarden", "HYROX Athletic Conditioning & Functional Endurance"],
    ["HYROX trainingsessies in Leeuwarden", "HYROX Functional Fitness Sessions at HR Fitness Club"],
    ["Waarom doet een dieetcoach meer dan een voedingsschema maken", "Why a Nutrition Coach Does More Than Just Meal Plans"],
    ["Krachttraining voor kinderen", "Youth Strength Training & Safe Motor Development"],
    ["Sportschool intake", "Comprehensive Fitness Club Intake & Assessment"],
    ["Beste glute oefeningen", "Effective Glute Exercises for Strength and Stability"],
    ["Teambuilding Leeuwarden", "Team Building and Group Fitness at HR Fitness Club"],
    ["Hoe blijf je gezond met een drukke baan?", "How to Maintain Optimal Health with a Demanding Career"],
    ["Hoe blijf je gezond met een drukke baan", "Maintaining Fitness and Health with a Busy Job"],
    ["Ik durf niet naar de sportschool: hoe kom je over die drempel heen?", "Overcoming Gym Hesitation: Practical Steps to Gym Confidence"],
    ["Intake sportschool", "Personalized Gym Intake and Movement Analysis"],
    ["Sportschool intake via GO180", "Comprehensive Fitness Consultation at HR Fitness Club"],
    ["Teambuilding in Leeuwarden", "Corporate Team Fitness & Community Training in Thatipur"],
    ["dieetcoach leeuwarden", "Personalized Diet Coaching at HR Fitness Club"],
    ["Gezonde leefstijl kenmerken", "Core Pillars of a Balanced Healthy Lifestyle"],
    ["Gezonde leefstijl", "Healthy and Active Lifestyle Guidance"],
    ["Wat zijn de beste glute oefeningen voor stevige, sterke bilspieren?", "Top Glute Training Movements for Power and Posture"]
  ];
  for (const [d, e] of dutchAltWords) {
    if (html.includes(d)) {
      html = html.split(d).join(e);
      changed = true;
    }
  }
  if (page === "disclaimer.html" || page === "privacy-policy.html") {
    const prev = html;
    html = html.replace(/<img[^>]*src=["']\s*["'][^>]*>/gi, "");
    if (html !== prev) changed = true;
  }
  if (changed) {
    fs.writeFileSync(pPath, html, "utf8");
    updatedPages++;
    console.log("Updated page:", page);
  }
}
console.log("Total pages updated:", updatedPages);