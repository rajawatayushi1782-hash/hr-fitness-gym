const fs = require('fs');
const snap = JSON.parse(fs.readFileSync('image_inventory_snapshot.json', 'utf8'));
const current = fs.readFileSync('public/pages/programs-adaptable.html', 'utf8');

const currentImgs = current.match(/<img[^>]+>/gi) || [];
const expectedImgs = snap['programs-adaptable.html'].imgs;

console.log('Current imgs:', currentImgs.length);
console.log('Expected imgs:', expectedImgs.length);

for (let i = 0; i < Math.max(currentImgs.length, expectedImgs.length); i++) {
  console.log(`[${i}] CURRENT : ${currentImgs[i] ? currentImgs[i].substring(0, 60) : 'MISSING'}`);
  console.log(`    EXPECTED: ${expectedImgs[i] ? expectedImgs[i].substring(0, 60) : 'MISSING'}`);
}
