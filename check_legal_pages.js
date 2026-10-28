const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  for (const p of ['/algemene-voorwaarden/', '/disclaimer/', '/privacy-policy/']) {
    try {
      const resp = await page.goto('https://go180.nl' + p, { waitUntil: 'domcontentloaded', timeout: 20000 });
      console.log(p, 'Status:', resp.status(), 'Title:', await page.title(), 'URL:', page.url());
    } catch (e) {
      console.error(p, 'Error:', e.message);
    }
  }

  await browser.close();
})();
