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

async function main() {
  const ssDir = path.join(__dirname, 'screenshots', 'original');
  const htmlDir = path.join(__dirname, 'scraped_pages');
  fs.mkdirSync(ssDir, { recursive: true });
  fs.mkdirSync(htmlDir, { recursive: true });

  console.log('Launching Chrome via Playwright...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const allAssets = new Set();
  const pageSummaries = [];

  for (const route of ROUTES) {
    const url = `https://go180.nl${route.path}`;
    console.log(`\n>>> Processing route: ${route.name} (${url})`);

    // Desktop
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });

    const page = await context.newPage();

    page.on('response', res => {
      const u = res.url();
      if (u.includes('go180.nl') && (
        u.includes('/assets/') || u.includes('/uploads/') || u.includes('/smush-webp/') ||
        u.endsWith('.png') || u.endsWith('.jpg') || u.endsWith('.svg') || u.endsWith('.webp')
      )) {
        allAssets.add(u.split('?')[0]);
      }
    });

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1500);

      // Close popups or cookie bars if any
      const closeBtn = await page.$('.pum-close, #cookie-law-info-bar .cli_action_button, button[id*="cookie"]');
      if (closeBtn) {
        await closeBtn.click().catch(() => {});
        await page.waitForTimeout(300);
      }

      // Save HTML
      const html = await page.content();
      fs.writeFileSync(path.join(htmlDir, `${route.name}.html`), html, 'utf8');

      // Screenshot desktop
      const desktopSS = path.join(ssDir, `${route.name}_desktop.png`);
      await page.screenshot({ path: desktopSS, fullPage: true });
      console.log(`Saved ${route.name}_desktop.png`);

      // Extract title, h1, section count
      const summary = await page.evaluate(() => {
        return {
          title: document.title,
          h1: Array.from(document.querySelectorAll('h1')).map(e => e.innerText.trim()),
          h2: Array.from(document.querySelectorAll('h2')).map(e => e.innerText.trim()).slice(0, 10),
          metaDesc: document.querySelector('meta[name="description"]')?.content || ''
        };
      });
      pageSummaries.push({ route: route.name, path: route.path, ...summary });

    } catch (err) {
      console.error(`Error on ${route.name} desktop:`, err.message);
    }
    await context.close();

    // Mobile (390 x 844)
    try {
      const mobContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15'
      });
      const mobPage = await mobContext.newPage();
      await mobPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await mobPage.waitForTimeout(1000);
      const mobSS = path.join(ssDir, `${route.name}_mobile.png`);
      await mobPage.screenshot({ path: mobSS, fullPage: true });
      console.log(`Saved ${route.name}_mobile.png`);
      await mobContext.close();
    } catch (err) {
      console.error(`Error on ${route.name} mobile:`, err.message);
    }
  }

  await browser.close();

  fs.writeFileSync('all_site_assets.json', JSON.stringify([...allAssets], null, 2), 'utf8');
  fs.writeFileSync('site_routes_summary.json', JSON.stringify(pageSummaries, null, 2), 'utf8');
  console.log(`\nCompleted snapshotting! Extracted ${allAssets.size} assets and ${pageSummaries.length} pages.`);
}

main().catch(console.error);
