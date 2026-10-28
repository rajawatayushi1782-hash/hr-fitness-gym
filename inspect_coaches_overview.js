const fs = require('fs');
const inv = JSON.parse(fs.readFileSync('full_dutch_inventory.json', 'utf8'));

console.log(JSON.stringify(inv['coaches.html'].dutchTexts, null, 2));
