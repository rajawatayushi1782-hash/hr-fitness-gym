const fs = require('fs');
const inv = JSON.parse(fs.readFileSync('full_dutch_inventory.json', 'utf8'));

const coachFiles = [
  'coaches.html',
  'coach-annick-douma.html',
  'coach-appie-kooistra.html',
  'coach-arjon-van-der-wal.html',
  'coach-hielke-feenstra.html',
  'coach-hielke-van-der-lei.html',
  'coach-thomas-kramer.html'
];

coachFiles.forEach(f => {
  console.log(`\n=================== ${f} ===================`);
  inv[f].dutchTexts.forEach((t, i) => console.log(`[${i}] ${t}`));
});
