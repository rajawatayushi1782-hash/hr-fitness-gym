const fs = require('fs');
const path = require('path');

const snapshot = JSON.parse(fs.readFileSync('image_inventory_snapshot.json', 'utf8'));
const pDir = path.join(__dirname, 'public', 'pages');

['we-are-go180.html', 'club-leeuwarden.html'].forEach(file => {
  const content = fs.readFileSync(path.join(pDir, file), 'utf8');
  const imgs = content.match(/<img[^>]+>/gi) || [];
  const expected = snapshot[file].imgs;
  if (imgs.length !== expected.length) {
    console.error(`${file} img count mismatch: ${imgs.length} vs ${expected.length}`);
  } else {
    let allOk = true;
    for (let i = 0; i < imgs.length; i++) {
      if (imgs[i] !== expected[i]) {
        console.error(`${file} img ${i} mismatch!`);
        allOk = false;
        break;
      }
    }
    if (allOk) console.log(`${file}: 100% PERFECT IMAGE MATCH!`);
  }
});
