const fs = require('fs');
const code = fs.readFileSync('public/js/original_main.js', 'utf8');

const terms = [
  'dragSlider',
  'archiveSlider',
  'archiveDouble',
  'carousel',
  'Draggable',
  'Swiper',
  'Flickity',
  'slick',
  'scrollLeft',
  'scrollBy',
  'overflow-x',
  '.navPoint',
  'carousel__holder',
  'carousel__slide'
];

for (const term of terms) {
  let count = 0;
  let pos = 0;
  const snippets = [];
  while ((pos = code.indexOf(term, pos)) !== -1) {
    count++;
    if (snippets.length < 3) {
      const start = Math.max(0, pos - 60);
      const end = Math.min(code.length, pos + term.length + 60);
      snippets.push(code.slice(start, end).replace(/\n/g, ' '));
    }
    pos += term.length;
  }
  console.log(`\n=== "${term}": found ${count} times ===`);
  snippets.forEach((s, idx) => console.log(`  [${idx+1}] ...${s}...`));
}
