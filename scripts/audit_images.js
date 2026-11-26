const fs = require('fs');
const path = require('path');

const pagesDir = path.join('public', 'pages');
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

const imageUsage = {};

for (const page of pages) {
  const content = fs.readFileSync(path.join(pagesDir, page), 'utf8');
  const matches = content.match(/[\/a-zA-Z0-9_\-\.]+\.(jpg|jpeg|png|webp|avif)/gi) || [];
  for (const m of matches) {
    if (m.startsWith('/images/') || m.includes('uploads') || m.includes('assets') || m.startsWith('images/')) {
      const clean = m.replace(/['",)]/g, '');
      if (!imageUsage[clean]) imageUsage[clean] = new Set();
      imageUsage[clean].add(page);
    }
  }
}

const summary = Object.keys(imageUsage).map(img => ({
  image: img,
  count: imageUsage[img].size,
  pages: Array.from(imageUsage[img])
})).sort((a, b) => b.count - a.count);

console.log('Total unique raster images referenced:', summary.length);
fs.writeFileSync('site_images_inventory.json', JSON.stringify(summary, null, 2));
console.log('Saved to site_images_inventory.json');
for (const item of summary.slice(0, 30)) {
  console.log(`${item.image} (${item.count} pages)`);
}
