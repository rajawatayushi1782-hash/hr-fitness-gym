const fs = require('fs');

const file = 'public/pages/home.html';
let html = fs.readFileSync(file, 'utf8');

// 1. Neutralize universe-static script
html = html.replace(
  /src="https:\/\/universe-static\.elfsightcdn\.com[^"]*"/g,
  'data-disabled-src=""'
);

// 2. Neutralize apps.elfsight.com script
html = html.replace(
  /src="https:\/\/apps\.elfsight\.com\/p\/platform\.js"/g,
  'data-disabled-src=""'
);

fs.writeFileSync(file, html, 'utf8');
console.log('Neutralized external Elfsight scripts in home.html');
