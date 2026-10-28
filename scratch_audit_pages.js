const fs = require('fs');
const path = require('path');

const pagesDir = 'public/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

const dutchIndicators = [
  ' van ', ' het ', ' een ', ' voor ', ' met ', ' jouw ', ' onze ', ' ook ', ' maar ', ' naar ',
  ' geen ', ' blijvende ', ' resultaten ', ' afgestemd ', ' persoonlijke ', ' ervaring ', ' meer ',
  ' bekijk ', ' leeuwarden', ' groningen', 'go180', 'Bouwen aan', 'toekomst', 'Gratis proefweek',
  'Lidmaatschap', 'Tarieven', 'Verder lezen', 'Lees meer', 'Wat je doel ook is', 'Bij GO180'
];

console.log('Total HTML files in public/pages:', files.length);

const results = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  const foundDutch = [];
  for (const word of dutchIndicators) {
    if (content.toLowerCase().includes(word.toLowerCase())) {
      foundDutch.push(word.trim());
    }
  }

  // Check titles and headings
  const titleMatch = content.match(/<title>(.*?)<\/title>/i);
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'NO TITLE';
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'NO H1';

  results.push({
    file,
    title,
    h1,
    dutchCount: foundDutch.length,
    dutchIndicators: foundDutch
  });
}

console.log(JSON.stringify(results, null, 2));