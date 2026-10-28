const fs = require('fs');
const snap = JSON.parse(fs.readFileSync('image_inventory_snapshot.json', 'utf8'));
const current = fs.readFileSync('public/pages/programs-adaptable.html', 'utf8');

const currentImgs = current.match(/<img[^>]+>/gi) || [];
const expectedImgs = snap['programs-adaptable.html'].imgs;

console.log('ACTUAL [6]:\n' + currentImgs[6]);
console.log('EXPECTED [6]:\n' + expectedImgs[6]);
console.log('Are they identical?', currentImgs[6] === expectedImgs[6]);

if (currentImgs[6] !== expectedImgs[6]) {
  for (let i = 0; i < Math.max(currentImgs[6].length, expectedImgs[6].length); i++) {
    if (currentImgs[6][i] !== expectedImgs[6][i]) {
      console.log(`Diff at char ${i}: ACTUAL '${currentImgs[6][i]}' vs EXPECTED '${expectedImgs[6][i]}'`);
      break;
    }
  }
}
