const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'small_mobile', width: 375, height: 812 }
];

const auditPages = [
  { name: 'home', path: '/' },
  { name: 'programs', path: '/programs/' },
  { name: 'programs_essentials', path: '/programs/essentials/' },
  { name: 'coaches', path: '/coaches/' },
  { name: 'we_are_go180', path: '/we-are-go180/' },
  { name: 'club_leeuwarden', path: '/clubs/leeuwarden/' },
  { name: 'pricing', path: '/pricing/' },
  { name: 'stories', path: '/stories/' },
  { name: 'contact', path: '/contact/' },
  { name: 'join_now', path: '/join-now/' },
  { name: 'free_trial', path: '/free-trial/' }
];

const screenshotDir = path.join(__dirname, 'screenshots', 'final_audit');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];

  console.log('Starting Multi-Viewport Audit across Desktop, Laptop, Tablet, and Mobile...');

  // Test primary viewports for all pages
  for (const vp of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'tablet', width: 768, height: 1024 }, { name: 'mobile', width: 390, height: 844 }]) {
    console.log(`\n=== Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    for (const p of auditPages) {
      const url = 'http://localhost:3000' + p.path;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(1500);

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          return {
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
          };
        });

        // Check broken images
        const brokenImages = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('img'))
            .filter(img => img.complete && img.naturalWidth === 0 && img.src && !img.src.includes('data:'))
            .map(img => img.src);
        });

        // Screenshot
        const ssName = `${p.name}_${vp.name}.png`;
        const ssPath = path.join(screenshotDir, ssName);
        await page.screenshot({ path: ssPath, fullPage: false });

        results.push({
          page: p.name,
          path: p.path,
          viewport: vp.name,
          overflow,
          brokenImagesCount: brokenImages.length,
          brokenImagesSample: brokenImages.slice(0, 3),
          screenshot: ssName
        });

        console.log(`  [${vp.name}] ${p.path} -> OK (Broken img: ${brokenImages.length}, Overflow: ${overflow.hasHorizontalScroll})`);
      } catch (err) {
        console.error(`  [${vp.name}] ${p.path} -> ERROR: ${err.message}`);
        results.push({ page: p.name, path: p.path, viewport: vp.name, error: err.message });
      }
    }

    // On mobile, test hamburger menu interaction
    if (vp.name === 'mobile') {
      console.log('Testing Mobile Drawer Menu Interaction...');
      await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      // Click hamburger
      const hamburger = page.locator('.hamburger').first();
      if (await hamburger.isVisible()) {
        await hamburger.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(screenshotDir, 'mobile_menu_open.png') });
        console.log('  Saved mobile_menu_open.png');

        // Click Programs sub-menu arrow
        const arrow = page.locator('.mobile__menu .menu-item-has-children .menu__arrow').first();
        if (await arrow.isVisible()) {
          await arrow.click();
          await page.waitForTimeout(800);
          await page.screenshot({ path: path.join(screenshotDir, 'mobile_menu_programs_expanded.png') });
          console.log('  Saved mobile_menu_programs_expanded.png');
        }
      }
    }

    await page.close();
  }

  fs.writeFileSync('multi_viewport_audit_results.json', JSON.stringify(results, null, 2));
  console.log('\nAudit complete! Results saved to multi_viewport_audit_results.json');

  await browser.close();
})();
