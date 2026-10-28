const fs = require('fs');
const html = fs.readFileSync('public/pages/home.html', 'utf8');

const idx = html.indexOf('es-review-container');
console.log(html.substring(idx, idx + 10000).replace(/<svg[\s\S]*?<\/svg>/gi, '[SVG]'));
