const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROUTES = [
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

async function main() {
  const ssDir = path.join(__dirname, 'screenshots', 'original');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  for (const route of ROUTES) {
    const url = `https://go180.nl${route.path}`;
    console.log(`Snapshotting: ${route.name}`);

    // Desktop
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3500);

      // Trigger lazy load by scrolling down and back up
      await page.evaluate(async () => {
        window.scrollTo(0, document.body.scrollHeight / 2);
        await new Promise(r => setTimeout(r, 600));
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(r => setTimeout(r, 600));
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1000);

      // Ensure curtain/loading overlay is gone
      await page.evaluate(() => {
        document.body.classList.remove('loading');
        document.querySelectorAll('.curtain, .loader, [class*="transition-screen"]').forEach(e => e.style.display = 'none');
      });

      const ssPath = path.join(ssDir, `${route.name}_desktop.png`);
      await page.screenshot({ path: ssPath, fullPage: true });
      console.log(`Saved ${route.name}_desktop.png`);
    } catch (e) {
      console.error(`Error on ${route.name}:`, e.message);
    }
    await page.close();
  }

  await browser.close();
  console.log('Done snapshotting all subpages!');
}

main().catch(console.error);
