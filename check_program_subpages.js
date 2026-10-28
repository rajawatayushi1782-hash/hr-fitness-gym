const { chromium } = require('playwright');

const progRoutes = [
  '/programs/essentials/',
  '/programs/fundamentals/',
  '/programs/go2gether/',
  '/programs/adaptable/',
  '/programs/digital-coaching/',
  '/programs/healthy-ageing/',
  '/programs/go2day/',
  '/programs/hyrox/'
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  for (const r of progRoutes) {
    try {
      const resp = await page.goto('https://go180.nl' + r, { waitUntil: 'domcontentloaded', timeout: 25000 });
      const info = await page.evaluate(() => {
        const h1 = document.querySelector('h1') ? document.querySelector('h1').innerText.trim() : null;
        const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.innerText.trim()).filter(Boolean);
        return {
          title: document.title,
          h1,
          h2s: h2s.slice(0, 5)
        };
      });
      console.log(r, { status: resp.status(), ...info });
    } catch (e) {
      console.error(r, 'Error:', e.message);
    }
  }

  await browser.close();
})();
