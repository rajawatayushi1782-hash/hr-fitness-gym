const fs = require('fs');
const inv = JSON.parse(fs.readFileSync('full_dutch_inventory.json', 'utf8'));

const legalFiles = [
  'contact.html',
  'free-trial.html',
  'join-now.html',
  'pricing.html',
  'algemene-voorwaarden.html',
  'privacy-policy.html',
  'disclaimer.html'
];

legalFiles.forEach(f => {
  console.log(`\n=================== ${f} ===================`);
  inv[f].dutchTexts.forEach((t, i) => console.log(`[${i}] ${t}`));
});
