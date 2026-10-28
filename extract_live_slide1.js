const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://go180.nl/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const slide1HTML = await page.evaluate(() => {
    const s1 = document.querySelector('#slide-1');
    return s1 ? s1.outerHTML : null;
  });

  fs.writeFileSync('live_slide1.html', slide1HTML);
  console.log('Saved live slide-1 HTML, length:', slide1HTML.length);
  await browser.close();
})();
