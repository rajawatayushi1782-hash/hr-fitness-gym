const fs = require('fs');
const inv = JSON.parse(fs.readFileSync('full_dutch_inventory.json', 'utf8'));

const progFiles = [
  'programs.html',
  'programs-adaptable.html',
  'programs-digital-coaching.html',
  'programs-essentials.html',
  'programs-fundamentals.html',
  'programs-go2day.html',
  'programs-go2gether.html',
  'programs-healthy-ageing.html',
  'programs-hyrox.html'
];

progFiles.forEach(f => {
  console.log(`\n=================== ${f} ===================`);
  inv[f].dutchTexts.forEach((t, i) => console.log(`[${i}] ${t}`));
});
