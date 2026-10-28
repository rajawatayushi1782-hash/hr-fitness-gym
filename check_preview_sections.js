const fs = require('fs');
const path = require('path');

const p2 = path.join(__dirname, 'gym website (1)', 'gym website', 'asset-preview', 'index.html');
const html = fs.readFileSync(p2, 'utf8');

const matches = html.match(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi);
console.log('Headings in preview:');
if (matches) {
  matches.forEach(m => console.log(' - ' + m.replace(/<[^>]+>/g, '').trim()));
}
