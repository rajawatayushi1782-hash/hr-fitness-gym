const fs = require('fs');
const html = fs.readFileSync('public/pages/story-beste-glute-oefeningen.html', 'utf8');

// Find where main content is
const h1Idx = html.indexOf('<h1');
const nextIdx = html.indexOf('class="nextPage');

console.log(html.substring(h1Idx, h1Idx + 2500));
