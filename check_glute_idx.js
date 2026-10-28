const fs = require('fs');
const html = fs.readFileSync('public/pages/story-beste-glute-oefeningen.html', 'utf8');

const idx = html.indexOf('Glute oefeningen');
console.log('Glute oefeningen at', idx);
console.log(html.substring(Math.max(0, idx - 200), idx + 800));
