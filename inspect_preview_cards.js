const fs = require('fs');
const path = require('path');

const p2 = path.join(__dirname, 'gym website (1)', 'gym website', 'asset-preview', 'index.html');
const html = fs.readFileSync(p2, 'utf8');

// Look for image cards
const cardRegex = /<div class= card image-card[\s\S]*?<\/div>\s*<\/div>/g;
// Or let's see how images are structured
const sample = html.indexOf('Photography & Gym Imagery');
console.log(html.slice(sample, sample + 2500));
