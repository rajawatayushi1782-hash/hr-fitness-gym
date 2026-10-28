const fs = require('fs');
const html = fs.readFileSync('public/pages/home.html', 'utf8');

const idx = html.indexOf('es-review-container');
const stripped = html.substring(idx, idx + 15000).replace(/<svg[\s\S]*?<\/svg>/gi, '');
console.log(stripped.substring(0, 3000));
