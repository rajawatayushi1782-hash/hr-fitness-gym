const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, 'scraped_pages');
const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

const allImages = new Set();
const allSvgs = new Set();

files.forEach(file => {
  const content = fs.readFileSync(path.join(htmlDir, file), 'utf8');

  // img src, data-src, srcset
  const srcMatches = [...content.matchAll(/(?:src|data-src|srcset)=["']([^"']+)["']/gi)];
  srcMatches.forEach(m => {
    m[1].split(',').forEach(item => {
      const u = item.trim().split(' ')[0];
      if (u.includes('go180.nl') || u.startsWith('/') || u.startsWith('http')) {
        if (!u.endsWith('.js') && !u.endsWith('.css')) {
          allImages.add(u);
        }
      }
    });
  });

  // background-image
  const bgMatches = [...content.matchAll(/url\(([^)]+)\)/gi)];
  bgMatches.forEach(m => {
    const u = m[1].replace(/['"]/g, '').trim();
    if (u.includes('go180.nl') || u.startsWith('/') || u.startsWith('http')) {
      if (!u.endsWith('.css')) {
        allImages.add(u);
      }
    }
  });
});

console.log('Total extracted image/media URLs across all pages:', allImages.size);
fs.writeFileSync('all_extracted_images.json', JSON.stringify([...allImages], null, 2), 'utf8');
