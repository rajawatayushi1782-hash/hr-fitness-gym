const fs = require('fs');
const html = fs.readFileSync('public/pages/programs-fundamentals.html', 'utf8');

const sIdx = html.indexOf('slide__txtHolder');
const sEnd = html.indexOf('dragSlider__viewer');
console.log(html.substring(sIdx, sEnd + 50));
