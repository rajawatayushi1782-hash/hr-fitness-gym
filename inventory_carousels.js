const fs = require('fs');
const path = require('path');

const dir = 'public/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const inventory = {};

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  const foundPatterns = [];

  const patterns = [
    'carousel',
    'swiper',
    'slider',
    'archiveSlider',
    'gallery',
    'flickity',
    'arrowScroll',
    'cards',
    'scroll-track'
  ];

  for (const p of patterns) {
    if (content.toLowerCase().includes(p.toLowerCase())) {
      foundPatterns.push(p);
    }
  }

  // Find elements with carousel/slider classes
  const carClasses = content.match(/class=["'][^"']*(?:carousel|slider|swiper|gallery|track)[^"']*["']/gi) || [];
  const cleanClasses = Array.from(new Set(carClasses.map(c => c.slice(7, -1).trim())));

  // Find buttons/arrows
  const navMatches = content.match(/<[^>]+(?:arrow|prev|next|control|button)[^>]*>/gi) || [];
  const navSnippet = navMatches.filter(n => n.includes('carousel') || n.includes('slider') || n.includes('arrow')).slice(0, 5);

  if (foundPatterns.length > 0) {
    inventory[file] = {
      patterns: foundPatterns,
      classes: cleanClasses,
      sampleNav: navSnippet
    };
  }
}

fs.writeFileSync('carousel_inventory.json', JSON.stringify(inventory, null, 2), 'utf8');
console.log('Saved inventory for', Object.keys(inventory).length, 'pages in carousel_inventory.json');
for (const [k, v] of Object.entries(inventory)) {
  console.log(`- ${k}: [${v.patterns.join(', ')}] -> Classes: ${v.classes.slice(0, 5).join(' | ')}`);
}
