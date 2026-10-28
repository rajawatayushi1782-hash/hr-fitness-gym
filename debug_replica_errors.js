const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const logs = [];
  const errors = [];
  const failedRequests = [];

  page.on('console', msg => logs.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', err => errors.push(err.stack || err.message));
  page.on('requestfailed', req => failedRequests.push({ url: req.url(), error: req.failure() }));

  console.log('Navigating to http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 15000 });
  await page.waitForTimeout(3000);

  const domState = await page.evaluate(() => {
    return {
      bodyClasses: document.body.className,
      htmlClasses: document.documentElement.className,
      wipeStyle: document.querySelector('.wipe') ? document.querySelector('.wipe').getAttribute('style') : null,
      scrollContainer: document.querySelector('[data-scroll-container]') ? {
        className: document.querySelector('[data-scroll-container]').className,
        style: document.querySelector('[data-scroll-container]').getAttribute('style')
      } : null,
      slides: Array.from(document.querySelectorAll('.slides > .slide')).map((s, idx) => ({
        idx,
        id: s.id,
        className: s.className,
        style: s.getAttribute('style'),
        rect: s.getBoundingClientRect()
      })),
      bullets: Array.from(document.querySelectorAll('.slide__navigationBullet')).map((b, idx) => ({
        idx,
        className: b.className
      }))
    };
  });

  const ssDir = path.join(__dirname, 'screenshots', 'replica_debug');
  fs.mkdirSync(ssDir, { recursive: true });
  await page.screenshot({ path: path.join(ssDir, 'replica_initial.png') });

  console.log('--- REPLICA DOM STATE ---');
  console.log(JSON.stringify(domState, null, 2));

  console.log('\n--- REPLICA ERRORS ---');
  console.log(JSON.stringify(errors, null, 2));

  console.log('\n--- FAILED REQUESTS ---');
  console.log(JSON.stringify(failedRequests, null, 2));

  console.log('\n--- REPLICA LOGS ---');
  console.log(JSON.stringify(logs, null, 2));

  await browser.close();
})();
