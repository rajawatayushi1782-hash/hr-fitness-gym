const fs = require('fs');
const html = fs.readFileSync('public/pages/story-beste-glute-oefeningen.html', 'utf8');

const lowerIdx = html.indexOf('class="headerLower"');
console.log(html.substring(lowerIdx + 500, lowerIdx + 3000));
