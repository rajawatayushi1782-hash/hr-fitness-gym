const { chromium } = require('playwright');
const path = require('path');

const ROUTES = [
  '/',
  '/we-are-go180/',
  '/programs/',
  '/programs/essentials/',
  '/coaches/',
  '/clubs/leeuwarden/',
  '/stories/',
  '/pricing/',
  '/contact/',
  '/join-now/',
  '/free-trial/'
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  // Disable app.js so we test original_main.js cleanly
  await page.route('**/js/app.js', r => r.fulfill({ status: 200, contentType: 'application/javascript', body: '/* disabled */' }));

  const results = [];

  for (const route of ROUTES) {
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    const url = `http://localhost:3000${route}`;
    await page.goto(url, { waitUntil: 'load', timeout: 20000 });
    await page.waitForTimeout(2000);

    const data = await page.evaluate(() => {
      const wipe = document.querySelector('.wipe');
      const header = document.querySelector('header');
      const scrollContainer = document.querySelector('.scrollContainer');
      const slickSliders = document.querySelectorAll('.slick-initialized').length;
      const dragSliders = document.querySelectorAll('.dragSlider').length;

      return {
        title: document.title,
        htmlClass: document.documentElement.className,
        hasScrollSmooth: document.documentElement.classList.contains('has-scroll-smooth'),
        wipeOpacity: wipe ? window.getComputedStyle(wipe).opacity : null,
        slickSliders,
        dragSliders
      };
    });

    results.push({ route, errors, data });
  }

  console.log('All Subpages Results:');
  console.log(JSON.stringify(results, null, 2));

  await browser.close();
})();
