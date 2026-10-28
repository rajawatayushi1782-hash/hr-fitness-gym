const fs = require('fs');
const content = fs.readFileSync('public/pages/programs-adaptable.html', 'utf8');

const idx5 = content.indexOf('GO180-receptenboek-HR23');
const idx8 = content.indexOf('GO180-Leeuwarden-38-790x860');

console.log('BETWEEN [5] and [8]:');
console.log(content.substring(idx5 - 100, idx8 + 300));
