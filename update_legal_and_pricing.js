const fs = require('fs');
const path = require('path');

const pDir = path.join(__dirname, 'public', 'pages');

// --- 1. pricing.html ---
let pr = fs.readFileSync(path.join(pDir, 'pricing.html'), 'utf8');

pr = pr.replace(/Kosten voor GO2Gether/g, 'Pricing for GO2Gether Group Training');
pr = pr.replace(/Kosten voor GO2day/g, 'Pricing for GO2day Flexible Training');
pr = pr.replace(
  /Train je het liefst in een rustige gym, waar de coaches je kennen\? En wil je vandaag nog een sessie doen, omdat je niet weet hoe your agenda er morgen uitziet\? GO2day is flexibel fitnessen met persoonlijke aandacht van de ervaren coaches van GO180\./g,
  'Prefer working out in a welcoming gym with friendly trainers who know your goals? Experience flexible workout sessions with dedicated attention from our experienced trainers at HR Fitness Club.'
);
pr = pr.replace(/Kosten voor HYROX/g, 'Pricing for HYROX Functional Training');
pr = pr.replace(/Kosten voor personal training bij GO180/g, 'Personal Training Pricing at HR Fitness Club');
pr = pr.replace(/Kosten voor personal training/g, 'Pricing for 1-on-1 Personal Training');
pr = pr.replace(/Het adaptable programma/g, 'Corporate Wellness & Adaptable Program');
pr = pr.replace(/Build your tomorrow/g, 'Build Your Tomorrow');
pr = pr.replace(/>We are GO180</g, '>About Us<');
pr = pr.replace(/>Leeuwarden</g, '>Thatipur Club<');

fs.writeFileSync(path.join(pDir, 'pricing.html'), pr, 'utf8');
console.log('Updated pricing.html');

// --- 2. disclaimer.html ---
let disc = fs.readFileSync(path.join(pDir, 'disclaimer.html'), 'utf8');

disc = disc.replace(
  /De informatie die je op deze website vindt, heeft GO180 met de grootste zorg samengesteld[\s\S]*?de goede zeden\./,
  'The information on this website has been compiled by HR Fitness Club with the utmost care. However, inaccuracies or omissions may unintentionally occur. HR Fitness Club cannot be held liable for any inaccuracies, interruptions, or technical issues that may arise. Use of this website must comply with all applicable local laws, regulations, and public order.'
);

disc = disc.replace(
  /Het is derden niet toegestaan om zonder uitdrukkelijke schriftelijke toestemming van GO180[\s\S]*?op u te verhalen\./,
  'Third parties may not reproduce, store, or distribute website code, content, or design assets in original or modified form without the express written permission of HR Fitness Club. All intellectual property rights are reserved.'
);

disc = disc.replace(
  /GO180 is op geen enkele wijze aansprakelijk voor de gevolgen van activiteiten[\s\S]*?de website van GO180\./,
  'HR Fitness Club is not liable for outcomes resulting from activities undertaken based on content found on this website. Where external links are provided, HR Fitness Club has no control over and assumes no liability for external websites or third-party content.'
);

disc = disc.replace(
  /Suggesties en ideeën over de go180\.nl website die je ons toestuurt[\s\S]*?rechten van derden\./,
  'Inquiries, suggestions, and feedback submitted to HR Fitness Club are handled in accordance with our Privacy Policy. All information provided by users must be accurate, lawful, and respect the privacy rights of others.'
);

disc = disc.replace(
  /Je kunt er van op aan dat GO180 alles in het werk stelt om misbruik te voorkomen[\s\S]*?internet verzonden worden\./,
  'HR Fitness Club takes all reasonable measures to protect user data and ensure online security, but cannot be held liable for unauthorized interception of data transmitted across the public internet.'
);

disc = disc.replace(
  /GO180 behoud zich het recht om de inhoud van de website van GO180[\s\S]*?eigen inzicht te wijzigen\./,
  'HR Fitness Club reserves the right to modify website content, policies, and this disclaimer at any time without prior notice.'
);

disc = disc.replace(
  /Foto’s zijn voor illustratieve doeleinden en kunnen afwijkend zijn van de werkelijkheid\. Alle op deze website vermelde prijzen zijn inclusief BTW\./,
  'All photos and visuals are for illustrative purposes. All pricing is quoted in Indian Rupees (INR / ₹) with applicable taxes included.'
);

fs.writeFileSync(path.join(pDir, 'disclaimer.html'), disc, 'utf8');
console.log('Updated disclaimer.html');

// --- 3. Clean gform_i18n and gform_gravityforms across all 37 pages ---
const files = fs.readdirSync(pDir).filter(f => f.endsWith('.html'));

files.forEach(f => {
  const filePath = path.join(pDir, f);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes('\"Zo\",\"Ma\",\"Di\",\"Wo\",\"Do\",\"Vr\",\"Za\"')) {
    content = content.replace('\"Zo\",\"Ma\",\"Di\",\"Wo\",\"Do\",\"Vr\",\"Za\"', '\"Su\",\"Mo\",\"Tu\",\"We\",\"Th\",\"Fr\",\"Sa\"');
    changed = true;
  }
  if (content.includes('\"Januari\",\"Februari\",\"Maart\"')) {
    content = content.replace(
      '\"Januari\",\"Februari\",\"Maart\",\"April\",\"Mei\",\"Juni\",\"Juli\",\"Augustus\",\"September\",\"Oktober\",\"November\",\"December\"',
      '\"January\",\"February\",\"March\",\"April\",\"May\",\"June\",\"July\",\"August\",\"September\",\"October\",\"November\",\"December\"'
    );
    changed = true;
  }
  if (content.includes('\"Selecteer een datum\"')) {
    content = content.replace(/\"Selecteer een datum\"/g, '\"Select a date\"');
    changed = true;
  }
  if (content.includes('\"delete_file\":\"Dit bestand verwijderen\"')) {
    content = content.replace(/\"delete_file\":\"Dit bestand verwijderen\"/g, '\"delete_file\":\"Delete this file\"');
    content = content.replace(/\"in_progress\":\"in behandeling\"/g, '\"in_progress\":\"in progress\"');
    content = content.replace(/\"file_exceeds_limit\":\"Bestand overschrijdt limiet bestandsgrootte\"/g, '\"file_exceeds_limit\":\"File exceeds size limit\"');
    content = content.replace(/\"illegal_extension\":\"Dit type bestand is niet toegestaan\.\"/g, '\"illegal_extension\":\"This file type is not allowed.\"');
    content = content.replace(/\"max_reached\":\"Maximale aantal bestanden bereikt\"/g, '\"max_reached\":\"Maximum number of files reached\"');
    content = content.replace(/\"unknown_error\":\"Er was een probleem bij het opslaan van het bestand op de server\"/g, '\"unknown_error\":\"There was a problem saving the file on the server\"');
    content = content.replace(/\"currently_uploading\":\"Wacht tot het uploaden is voltooid\"/g, '\"currently_uploading\":\"Please wait until the upload is complete\"');
    content = content.replace(/\"cancel\":\"Annuleren\"/g, '\"cancel\":\"Cancel\"');
    content = content.replace(/\"cancel_upload\":\"Deze upload annuleren\"/g, '\"cancel_upload\":\"Cancel this upload\"');
    content = content.replace(/\"cancelled\":\"Geannuleerd\"/g, '\"cancelled\":\"Cancelled\"');
    changed = true;
  }

  // Also global navigation / title casing cleanup
  if (content.includes('Build your tomorrow')) {
    content = content.replace(/Build your tomorrow/g, 'Build Your Tomorrow');
    changed = true;
  }
  if (content.includes('>We are GO180<')) {
    content = content.replace(/>We are GO180</g, '>About Us<');
    changed = true;
  }
  if (content.includes('>Leeuwarden<') && !f.includes('leeuwarden')) {
    content = content.replace(/>Leeuwarden</g, '>Thatipur Club<');
    changed = true;
  }
  if (content.includes('>Voeding<')) {
    content = content.replace(/>Voeding</g, '>Nutrition<');
    changed = true;
  }
  if (content.includes('>Herstel<')) {
    content = content.replace(/>Herstel</g, '>Recovery<');
    changed = true;
  }
  if (content.includes('>Verstuur<')) {
    content = content.replace(/>Verstuur</g, '>Submit<');
    changed = true;
  }
  if (content.includes('value=\"Verstuur\"')) {
    content = content.replace(/value=\"Verstuur\"/g, 'value=\"Submit\"');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

console.log('Finished global legal, form strings, and navigation cleanup!');
