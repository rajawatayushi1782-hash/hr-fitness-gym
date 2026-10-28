const fs = require('fs');
const snap = JSON.parse(fs.readFileSync('image_inventory_snapshot.json', 'utf8'));
const filePath = 'public/pages/programs-adaptable.html';
let current = fs.readFileSync(filePath, 'utf8');

const currentImgs = current.match(/<img[^>]+>/gi) || [];
const expectedImgs = snap['programs-adaptable.html'].imgs;

current = current.replace(currentImgs[6], expectedImgs[6]);
current = current.replace(currentImgs[7], expectedImgs[7]);

fs.writeFileSync(filePath, current, 'utf8');
console.log('Replaced img tags with exact expected strings!');
