const fs = require('fs');
const html = fs.readFileSync('public/pages/programs-adaptable.html', 'utf8');

const sIdx = html.indexOf('slide__txtHolder');
console.log(html.substring(sIdx, sIdx + 1200));
