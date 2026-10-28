const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  page.on('pageerror', err => {
    console.log('Page error:', err.message);
  });

  page.on('response', async res => {
    const url = res.url();
    if (url.endsWith('.js') || res.headers()['content-type']?.includes('javascript')) {
      const text = await res.text().catch(() => '');
      try {
        new Function(text);
      } catch (e) {
        console.log(`Syntax error in JS file from ${url}:`, e.message);
        console.log('First 200 chars:', text.slice(0, 200));
      }
    }
  });

  await page.goto('http://localhost:3000', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  await browser.close();
})();
