const fs = require('fs');
const path = require('path');

const publicPagesDir = path.join(__dirname, 'public', 'pages');
const scrapedPagesDir = path.join(__dirname, 'scraped_pages');

const pages = [
  'we-are-go180.html',
  'programs.html',
  'programs-essentials.html',
  'coaches.html',
  'club-leeuwarden.html',
  'stories.html',
  'pricing.html',
  'contact.html',
  'join-now.html',
  'free-trial.html'
];

pages.forEach(p => {
  const p1 = path.join(publicPagesDir, p);
  const p2 = path.join(scrapedPagesDir, p);

  if (!fs.existsSync(p1)) {
    console.log(p, 'MISSING in public/pages');
    return;
  }
  if (!fs.existsSync(p2)) {
    console.log(p, 'MISSING in scraped_pages');
    return;
  }

  const c1 = fs.readFileSync(p1, 'utf-8');
  const c2 = fs.readFileSync(p2, 'utf-8');

  console.log(p, {
    publicLength: c1.length,
    scrapedLength: c2.length,
    lengthDiff: c1.length - c2.length,
    hasSubMenu: c1.includes('sub-menu'),
    hasHeader: c1.includes('class="header'),
    hasFooter: c1.includes('class="footer')
  });
});
