const fs = require('fs');
const snap = JSON.parse(fs.readFileSync('image_inventory_snapshot.json', 'utf8'));
const current = fs.readFileSync('public/pages/programs-adaptable.html', 'utf8');

const currentImgs = current.match(/<img[^>]+>/gi) || [];
const expectedImgs = snap['programs-adaptable.html'].imgs;

console.log('Expected:', expectedImgs.length);
console.log('Current:', currentImgs.length);

expectedImgs.forEach((img, i) => {
  if (!current.includes(img)) {
    console.log(`Missing img [${i}]:`, img);
  }
});
