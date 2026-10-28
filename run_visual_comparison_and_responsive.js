const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(__dirname, 'screenshots', 'visual_comparison');
fs.mkdirSync(screenshotDir, { recursive: true });

const pagesToCompare = [
  { name: 'programs', path: '/programs/' },
  { name: 'coaches', path: '/coaches/' },
  { name: 'we-are-go180', path: '/we-are-go180/' },
  { name: 'pricing', path: '/pricing/' },
  { name: 'join-now', path: '/join-now/' }
];

const viewports = [
  { name: 'desktop_1440x900', width: 1440, height: 900 },
  { name: 'laptop_1280x800', width: 1280, height: 800 },
  { name: 'tablet_768x1024', width: 768, height: 1024 },
  { name: 'mobile_430x932', width: 430, height: 932 },
  { name: 'mobile_390x844', width: 390, height: 844 },
  { name: 'mobile_375x812', width: 375, height: 812 }
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  console.log('--- Step 1: Capturing Live vs Local Comparisons (Desktop 1440x900) ---');
  for (const pageInfo of pagesToCompare) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    
    // Local
    try {
      console.log(`Local: ${pageInfo.path}`);
      await page.goto(`http://localhost:3000${pageInfo.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.evaluate(() => {
        const wipe = document.querySelector('.wipe');
        if (wipe) wipe.remove();
        const spinner = document.querySelector('.wipe_spinner');
        if (spinner) spinner.remove();
        document.body.style.opacity = '1';
        document.body.style.visibility = 'visible';
      });
      await page.waitForTimeout(1000);
      const localFile = path.join(screenshotDir, `local_${pageInfo.name}.png`);
      await page.screenshot({ path: localFile, fullPage: false });
      console.log(`  Saved ${localFile}`);
    } catch (e) {
      console.error(`Error capturing local ${pageInfo.name}:`, e.message);
    }

    // Live
    try {
      console.log(`Live: https://go180.nl${pageInfo.path}`);
      await page.goto(`https://go180.nl${pageInfo.path}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.evaluate(() => {
        const cookie = document.querySelector('#cookie-law-info-bar, .cli-modal, .cookie-banner');
        if (cookie) cookie.remove();
        const wipe = document.querySelector('.wipe');
        if (wipe) wipe.remove();
      });
      await page.waitForTimeout(1500);
      const liveFile = path.join(screenshotDir, `live_${pageInfo.name}.png`);
      await page.screenshot({ path: liveFile, fullPage: false });
      console.log(`  Saved ${liveFile}`);
    } catch (e) {
      console.error(`Error capturing live ${pageInfo.name}:`, e.message);
    }

    await page.close();
  }

  console.log('\n--- Step 2: Testing All 6 Responsive Breakpoints on Local Pages ---');
  const responsiveResults = [];
  for (const vp of viewports) {
    console.log(`\nTesting Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    for (const pageInfo of pagesToCompare) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await page.goto(`http://localhost:3000${pageInfo.path}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.evaluate(() => {
        const wipe = document.querySelector('.wipe');
        if (wipe) wipe.remove();
      });
      await page.waitForTimeout(500);

      const check = await page.evaluate(() => {
        const scrollWidth = document.documentElement.scrollWidth;
        const innerWidth = window.innerWidth;
        return {
          scrollWidth,
          innerWidth,
          hasHorizontalScroll: scrollWidth > innerWidth
        };
      });

      const shotName = `responsive_${pageInfo.name}_${vp.name}.png`;
      const shotPath = path.join(screenshotDir, shotName);
      await page.screenshot({ path: shotPath, fullPage: false });

      console.log(`  [${vp.name}] ${pageInfo.path} - scrollWidth: ${check.scrollWidth}, innerWidth: ${check.innerWidth}, overflow: ${check.hasHorizontalScroll}`);
      responsiveResults.push({
        viewport: vp.name,
        page: pageInfo.path,
        hasHorizontalScroll: check.hasHorizontalScroll
      });

      await page.close();
    }
  }

  const overflowCount = responsiveResults.filter(r => r.hasHorizontalScroll).length;
  console.log(`\n================ RESPONSIVE SUMMARY ================`);
  console.log(`Total Breakpoints Tested: ${viewports.length * pagesToCompare.length}`);
  console.log(`Total Horizontal Overflow Issues: ${overflowCount}`);

  await browser.close();
})();
