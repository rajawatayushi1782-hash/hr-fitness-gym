const fs = require('fs');
const content = fs.readFileSync('original_live_dom.html', 'utf8');

const idx = content.indexOf('slide__holderBullet1');
console.log(content.slice(Math.max(0, idx - 500), Math.min(content.length, idx + 1500)));
