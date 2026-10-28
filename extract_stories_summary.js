const fs = require('fs');

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

const summaries = {};

storyFiles.forEach(f => {
  const html = fs.readFileSync('public/pages/' + f, 'utf8');
  const h2s = (html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || []).map(h => h.replace(/<[^>]+>/g, '').trim());
  const ps = (html.match(/<p>([\s\S]*?)<\/p>/gi) || []).map(p => p.replace(/<[^>]+>/g, '').trim()).filter(p => p.length > 20);
  summaries[f] = { h2s, pCount: ps.length, firstP: ps[0], lastP: ps[ps.length - 1] };
});

console.log(JSON.stringify(summaries, null, 2));
