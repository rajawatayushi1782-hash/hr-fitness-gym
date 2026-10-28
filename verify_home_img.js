const fs = require('fs');
const path = require('path');

const snapshot = JSON.parse(fs.readFileSync('image_inventory_snapshot.json', 'utf8'));
const homePath = path.join(__dirname, 'public', 'pages', 'home.html');
const content = fs.readFileSync(homePath, 'utf8');

const imgs = content.match(/<img[^>]+>/gi) || [];
const bgs = content.match(/background(?:-image)?:\s*url\([^)]+\)/gi) || [];
const vids = content.match(/<video[^>]+>|<source[^>]+>|data-video-src="[^"]+"/gi) || [];

const expected = snapshot['home.html'];

let match = true;
if (imgs.length !== expected.imgs.length) {
  console.error(`Img count mismatch: ${imgs.length} vs ${expected.imgs.length}`);
  match = false;
}
for (let i = 0; i < imgs.length; i++) {
  if (imgs[i] !== expected.imgs[i]) {
    console.error(`Img ${i} mismatch:\nACTUAL: ${imgs[i]}\nEXPECTED: ${expected.imgs[i]}`);
    match = false;
  }
}

if (match) {
  console.log('PERFECT MATCH: home.html has 100% exact images from snapshot!');
} else {
  console.error('MISMATCH DETECTED!');
}
