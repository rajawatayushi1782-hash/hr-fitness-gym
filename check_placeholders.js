const fs = require('fs');
const path = require('path');
const dir = './public/pages';

let totalPlaceholders = 0;
fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const count = (content.match(/src=["']data:image\/svg/gi) || []).length;
  if (count > 0) {
    totalPlaceholders += count;
    console.log(f, 'has', count, 'placeholder SVG images!');
  }
});
console.log('Total placeholder SVGs across all pages:', totalPlaceholders);
