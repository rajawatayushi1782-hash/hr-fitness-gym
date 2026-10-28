const fs = require('fs');
const p = 'public/pages/home.html';
let c = fs.readFileSync(p, 'utf8');
const beforeCount = (c.match(/loading="lazy" alt="" class="Avatar/g) || []).length;
c = c.replace(/loading="lazy" alt="" class="Avatar/g, 'loading="eager" alt="" class="Avatar');
fs.writeFileSync(p, c, 'utf8');
console.log(`Replaced ${beforeCount} avatar images from lazy to eager.`);
