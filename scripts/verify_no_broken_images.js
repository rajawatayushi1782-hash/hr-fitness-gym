const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve('public/pages');
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

const broken = [];
let totalChecked = 0;

for (const page of pages) {
  const content = fs.readFileSync(path.join(pagesDir, page), 'utf8');
  const matches = content.match(/[\/a-zA-Z0-9_\-\.]+\.(?:jpg|jpeg|png|webp|svg)/gi) || [];

  for (const m of matches) {
    if (m.startsWith('/images/')) {
      totalChecked++;
      const localPath = path.join(__dirname, '..', 'public', m);
      if (!fs.existsSync(localPath)) {
        broken.push({ page, path: m });
      }
    }
  }
}

console.log(`Checked ${totalChecked} image references across all pages.`);
if (broken.length === 0) {
  console.log('SUCCESS: All image paths resolve to valid local files on disk (0 broken images)!');
} else {
  console.error(`Found ${broken.length} broken image references:`, broken);
}
