const fs = require('fs');
const snap = JSON.parse(fs.readFileSync('image_inventory_snapshot.json', 'utf8'));
const imgs = snap['programs-adaptable.html'].imgs;

for (let i = 4; i <= 9; i++) {
  console.log(`[${i}]`, imgs[i]);
}
