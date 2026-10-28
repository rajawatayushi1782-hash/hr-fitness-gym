const fs = require('fs');
const path = require('path');

const snapshot = JSON.parse(fs.readFileSync('image_inventory_snapshot.json', 'utf8'));
const pDir = path.join(__dirname, 'public', 'pages');
const files = fs.readdirSync(pDir).filter(f => f.endsWith('.html'));

let allMatch = true;
let totalCheckedImgs = 0;

files.forEach(file => {
  const content = fs.readFileSync(path.join(pDir, file), 'utf8');
  const imgs = content.match(/<img[^>]+>/gi) || [];
  const expected = snapshot[file].imgs;
  totalCheckedImgs += imgs.length;

  if (imgs.length !== expected.length) {
    console.error(`ERROR: ${file} img count mismatch: ${imgs.length} vs expected ${expected.length}`);
    allMatch = false;
  } else {
    for (let i = 0; i < imgs.length; i++) {
      if (imgs[i] !== expected[i]) {
        console.error(`ERROR: ${file} img ${i} mismatch!`);
        allMatch = false;
        break;
      }
    }
  }
});

if (allMatch) {
  console.log(`\n======================================================`);
  console.log(`SUCCESS: ALL ${files.length} PAGES AND ALL ${totalCheckedImgs} IMAGES ARE 100% PERFECT BYTE-FOR-BYTE IDENTICAL!`);
  console.log(`======================================================\n`);
} else {
  console.error(`\nFAILED: Some images do not match snapshot!\n`);
}
