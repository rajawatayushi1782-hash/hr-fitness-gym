const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
  const ssDir = path.join(__dirname, 'screenshots', 'final_audit');

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ssDir, 'fresh_mobile_home.png'), fullPage: false });

  await page.goto('http://localhost:3000/contact/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ssDir, 'fresh_mobile_contact.png'), fullPage: false });

  await browser.close();
  console.log('Mobile screenshots captured successfully!');
})();
