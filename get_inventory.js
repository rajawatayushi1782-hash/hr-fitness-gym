const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'public', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

const fullInventory = {};

files.forEach(f => {
  const content = fs.readFileSync(path.join(pagesDir, f), 'utf8');
  
  // Extract title, h1, meta description
  const title = (content.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '';
  const metaDesc = (content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["']/i) || [])[1] || '';
  const h1 = (content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '';

  // Extract visible text elements
  // We want to find any text between tags that contains Dutch
  const textMatches = [];
  const tagRegex = />([^<]{4,})</g;
  let match;
  while ((match = tagRegex.exec(content)) !== null) {
    const txt = match[1].replace(/[\r\n\t]+/g, ' ').trim();
    if (txt.length > 5) {
      // Check if it looks Dutch
      const dutchWords = ['van', 'het', 'een', 'voor', 'met', 'jouw', 'onze', 'ook', 'maar', 'naar', 'geen', 'blijvende', 'resultaten', 'afgestemd', 'persoonlijke', 'ervaring', 'bekijk', 'leeuwarden', 'groningen', 'toekomst', 'proefweek', 'lidmaatschap', 'tarieven', 'leefstijl', 'voeding', 'sportschool', 'afvallen', 'waarom', 'kiezen', 'meer', 'we are go180', 'bij go180', 'go180'];
      const words = txt.toLowerCase().split(/[^a-zA-Z0-9]+/);
      const hit = words.filter(w => dutchWords.includes(w));
      if (hit.length >= 2 || (hit.length >= 1 && txt.length < 35 && !txt.includes('/app/'))) {
        textMatches.push(txt);
      }
    }
  }

  fullInventory[f] = {
    title,
    metaDesc,
    h1: h1.replace(/<[^>]+>/g, '').trim(),
    dutchTexts: [...new Set(textMatches)]
  };
});

fs.writeFileSync('full_dutch_inventory.json', JSON.stringify(fullInventory, null, 2), 'utf8');
console.log('Saved full_dutch_inventory.json');
for (const f in fullInventory) {
  if (fullInventory[f].dutchTexts.length > 0) {
    console.log(`Page: ${f} (${fullInventory[f].dutchTexts.length} Dutch texts)`);
  }
}
