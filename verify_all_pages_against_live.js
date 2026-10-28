const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'we-are-go180', path: '/we-are-go180/' },
  { name: 'programs', path: '/programs/' },
  { name: 'programs-essentials', path: '/programs/essentials/' },
  { name: 'coaches', path: '/coaches/' },
  { name: 'club-leeuwarden', path: '/clubs/leeuwarden/' },
  { name: 'stories', path: '/stories/' },
  { name: 'pricing', path: '/pricing/' },
  { name: 'contact', path: '/contact/' },
  { name: 'join-now', path: '/join-now/' },
  { name: 'free-trial', path: '/free-trial/' }
];

async function compareAllPages() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const liveCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const repCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  const livePage = await liveCtx.newPage();
  const repPage = await repCtx.newPage();

  const results = [];

  for (const r of ROUTES) {
    console.log(`Checking route: ${r.name} (${r.path}) ...`);

    try {
      await livePage.goto(`https://go180.nl${r.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await repPage.goto(`http://localhost:3000${r.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await livePage.waitForTimeout(2000);
      await repPage.waitForTimeout(2000);

      // Extract DOM stats
      const liveStats = await livePage.evaluate(() => ({
        title: document.title,
        bodyClasses: document.body.className,
        htmlClasses: document.documentElement.className,
        elementsCount: document.querySelectorAll('*').length,
        imagesCount: document.querySelectorAll('img').length,
        linksCount: document.querySelectorAll('a').length,
        buttonsCount: document.querySelectorAll('button, .btn').length,
        sectionsCount: document.querySelectorAll('section, .slide, .spacer').length,
        hasScrollContainer: !!document.querySelector('.scrollContainer'),
        hasWipe: !!document.querySelector('.wipe'),
        hasHeader: !!document.querySelector('header.header'),
        hasFooter: !!document.querySelector('footer.footer')
      }));

      const repStats = await repPage.evaluate(() => ({
        title: document.title,
        bodyClasses: document.body.className,
        htmlClasses: document.documentElement.className,
        elementsCount: document.querySelectorAll('*').length,
        imagesCount: document.querySelectorAll('img').length,
        linksCount: document.querySelectorAll('a').length,
        buttonsCount: document.querySelectorAll('button, .btn').length,
        sectionsCount: document.querySelectorAll('section, .slide, .spacer').length,
        hasScrollContainer: !!document.querySelector('.scrollContainer'),
        hasWipe: !!document.querySelector('.wipe'),
        hasHeader: !!document.querySelector('header.header'),
        hasFooter: !!document.querySelector('footer.footer')
      }));

      results.push({
        route: r.name,
        path: r.path,
        live: liveStats,
        replica: repStats,
        titleMatch: liveStats.title === repStats.title,
        elementsDiff: repStats.elementsCount - liveStats.elementsCount,
        imagesDiff: repStats.imagesCount - liveStats.imagesCount
      });
    } catch (e) {
      results.push({ route: r.name, error: e.message });
    }
  }

  fs.writeFileSync('all_pages_comparison.json', JSON.stringify(results, null, 2));
  console.log('Saved all_pages_comparison.json');
  await browser.close();
}

compareAllPages().catch(console.error);
