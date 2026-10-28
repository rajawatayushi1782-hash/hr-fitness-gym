const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  page.on('pageerror', err => {
    console.log('PAGE ERROR STACK:', err);
  });

  await page.goto('http://localhost:3000', { waitUntil: 'commit' });
  await page.waitForTimeout(2000);
  await browser.close();
})();
