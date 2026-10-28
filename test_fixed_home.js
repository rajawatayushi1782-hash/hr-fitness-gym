const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
  const ssDir = path.join(__dirname, 'screenshots', 'final_audit');

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000); // Wait for stagger animation to settle completely

  await page.screenshot({ path: path.join(ssDir, 'fixed_mobile_home.png'), fullPage: false });

  // Also desktop hero after animation settles
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ssDir, 'fixed_desktop_home.png'), fullPage: false });

  await browser.close();
  console.log('Saved fixed_mobile_home.png and fixed_desktop_home.png');
})();
