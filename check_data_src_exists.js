const fs = require('fs');
const path = require('path');
const dir = './public/pages';

const missingImages = new Set();
const foundImages = new Set();

fs.readdirSync(dir).filter(f => f.endsWith('.html')).forEach(f => {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  const matches = [...content.matchAll(/data-src=["']([^"']+)["']/g)];
  matches.forEach(m => {
    let src = m[1];
    if (src.startsWith('/')) {
      const p = path.join(__dirname, 'public', src.replace(/^\//, ''));
      const pImg = path.join(__dirname, 'public', 'images', path.basename(src));
      if (fs.existsSync(p) || fs.existsSync(pImg)) {
        foundImages.add(src);
      } else {
        missingImages.add(src);
      }
    }
  });
});

console.log('Found local images:', foundImages.size);
console.log('Missing images:', missingImages.size);
if (missingImages.size > 0) {
  console.log('Missing image paths:', Array.from(missingImages));
}
