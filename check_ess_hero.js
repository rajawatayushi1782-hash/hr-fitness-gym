const fs = require('fs');
const html = fs.readFileSync('public/pages/programs-essentials.html', 'utf8');

const sIdx = html.indexOf('slide__txtHolder');
console.log(html.substring(sIdx - 50, sIdx + 400));
