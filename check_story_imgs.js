const fs = require('fs');
const snap = JSON.parse(fs.readFileSync('image_inventory_snapshot.json', 'utf8'));

const storyFiles = [
  'stories.html',
  'story-beste-glute-oefeningen.html',
  'story-hoe-begin-je-weer-met-sporten-na-een-lange-pauze.html',
  'story-hoe-blijf-je-gezond-met-een-drukke-baan.html',
  'story-ik-durf-niet-naar-de-sportschool-hoe-kom-je-over-die-drempel-heen.html',
  'story-is-krachttraining-voor-kinderen-slecht-voor-de-groei.html',
  'story-sportschool-intake.html',
  'story-teambuilding-in-leeuwarden-ontdek-de-kracht-van-samen-sporten-bij-go180.html',
  'story-waarom-doet-een-dieetcoach-meer-dan-een-voedingsschema-maken.html',
  'story-waarom-stop-ik-steeds-met-sporten.html',
  'story-wat-zijn-de-kenmerken-van-een-gezonde-leefstijl.html'
];

storyFiles.forEach(f => {
  console.log(`${f}: ${snap[f].imgs.length} images`);
  snap[f].imgs.forEach((img, i) => console.log(`  [${i}] ${img.substring(0, 70)}`));
});
