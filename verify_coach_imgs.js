const fs = require('fs');
const path = require('path');

const snapshot = JSON.parse(fs.readFileSync('image_inventory_snapshot.json', 'utf8'));
const pDir = path.join(__dirname, 'public', 'pages');

const coachFiles = [
  'coaches.html',
  'coach-annick-douma.html',
  'coach-appie-kooistra.html',
  'coach-arjon-van-der-wal.html',
  'coach-hielke-feenstra.html',
  'coach-hielke-van-der-lei.html',
  'coach-thomas-kramer.html'
];

let allPerfect = true;
coachFiles.forEach(file => {
  const content = fs.readFileSync(path.join(pDir, file), 'utf8');
  const imgs = content.match(/<img[^>]+>/gi) || [];
  const expected = snapshot[file].imgs;
  if (imgs.length !== expected.length) {
    console.error(`${file} img count mismatch: ${imgs.length} vs ${expected.length}`);
    allPerfect = false;
  } else {
    for (let i = 0; i < imgs.length; i++) {
      if (imgs[i] !== expected[i]) {
        console.error(`${file} img ${i} mismatch!`);
        allPerfect = false;
        break;
      }
    }
  }
});

if (allPerfect) {
  console.log('ALL 7 COACH PAGES: 100% PERFECT IMAGE SNAPSHOT MATCH!');
}
