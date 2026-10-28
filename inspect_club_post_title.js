const fs = require('fs');
const c = fs.readFileSync('public/pages/club-leeuwarden.html', 'utf8');

const titleEnd = c.indexOf('</h1>', c.indexOf('slide__title'));
console.log(c.slice(titleEnd, titleEnd + 2500).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
