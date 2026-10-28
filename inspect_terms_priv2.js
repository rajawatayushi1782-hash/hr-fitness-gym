const fs = require('fs');
const inv = JSON.parse(fs.readFileSync('full_dutch_inventory.json', 'utf8'));

console.log('TERMS:');
inv['algemene-voorwaarden.html'].dutchTexts.forEach((t, i) => console.log(`[${i}] ${t}`));

console.log('PRIVACY:');
inv['privacy-policy.html'].dutchTexts.forEach((t, i) => console.log(`[${i}] ${t}`));
