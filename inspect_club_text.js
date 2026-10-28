const fs = require('fs');
const c = fs.readFileSync('public/pages/club-leeuwarden.html', 'utf8');

const jsScroll = c.indexOf('id="js-scroll"');
console.log(c.slice(jsScroll, jsScroll + 2500).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
