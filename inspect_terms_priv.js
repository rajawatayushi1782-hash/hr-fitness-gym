const fs = require('fs');
const inv = JSON.parse(fs.readFileSync('full_dutch_inventory.json', 'utf8'));

console.log('TERMS:', JSON.stringify(inv['algemene-voorwaarden.html'].dutchTexts, null, 2));
console.log('PRIVACY:', JSON.stringify(inv['privacy-policy.html'].dutchTexts, null, 2));
