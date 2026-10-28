const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROUTES = [
  { name: 'home', file: 'home.html', url: 'https://go180.nl/' },
  { name: 'we-are-go180', file: 'we-are-go180.html', url: 'https://go180.nl/we-are-go180/' },
  { name: 'programs', file: 'programs.html', url: 'https://go180.nl/programs/' },
  { name: 'programs-essentials', file: 'programs-essentials.html', url: 'https://go180.nl/programs/essentials/' },
  { name: 'coaches', file: 'coaches.html', url: 'https://go180.nl/coaches/' },
  { name: 'club-leeuwarden', file: 'club-leeuwarden.html', url: 'https://go180.nl/clubs/leeuwarden/' },
  { name: 'stories', file: 'stories.html', url: 'https://go180.nl/stories/' },
  { name: 'pricing', file: 'pricing.html', url: 'https://go180.nl/pricing/' },
  { name: 'contact', file: 'contact.html', url: 'https://go180.nl/contact/' },
  { name: 'join-now', file: 'join-now.html', url: 'https://go180.nl/join-now/' },
  { name: 'free-trial', file: 'free-trial.html', url: 'https://go180.nl/free-trial/' }
];

async function checkAll() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const comparison = [];

  for (const r of ROUTES) {
    console.log(`Checking ${r.name}...`);
    try {
      await page.goto(r.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);

      const liveHTML = await page.content();
      const localFile = path.join(__dirname, 'public', 'pages', r.file);
      const localHTML = fs.readFileSync(localFile, 'utf8');

      comparison.push({
        name: r.name,
        liveBytes: liveHTML.length,
        localBytes: localHTML.length,
        ratio: (localHTML.length / liveHTML.length).toFixed(2)
      });
    } catch (e) {
      comparison.push({ name: r.name, error: e.message });
    }
  }

  console.log('Page Size Comparison:');
  console.log(JSON.stringify(comparison, null, 2));
  await browser.close();
}

checkAll().catch(console.error);
