const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testReplicaConsole() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const logs = [];
  page.on('console', msg => logs.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', err => logs.push({ type: 'pageerror', text: err.stack || err.message }));
  page.on('requestfailed', req => logs.push({ type: 'requestfailed', url: req.url(), failure: req.failure() }));

  console.log('Navigating to http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 15000 });
  await page.waitForTimeout(2000);

  const state = await page.evaluate(() => {
    return {
      bodyClasses: document.body.className,
      htmlClasses: document.documentElement.className,
      wipeStyle: document.querySelector('.wipe') ? document.querySelector('.wipe').getAttribute('style') : null,
      wipeDisplay: document.querySelector('.wipe') ? window.getComputedStyle(document.querySelector('.wipe')).display : null,
      scrollContainer: document.querySelector('[data-scroll-container]') ? true : false,
      locomotiveClasses: Array.from(document.querySelectorAll('[class*="has-scroll"]')).map(e => e.className),
      sliderState: Array.from(document.querySelectorAll('.js-dragslider, .dragslider')).map(el => ({
        className: el.className,
        childrenCount: el.children.length
      }))
    };
  });

  const replicaScreenshotsDir = path.join(__dirname, 'screenshots', 'replica_test');
  fs.mkdirSync(replicaScreenshotsDir, { recursive: true });
  await page.screenshot({ path: path.join(replicaScreenshotsDir, 'homepage_initial.png') });

  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(replicaScreenshotsDir, 'homepage_scrolled_1000.png') });

  console.log('\n--- Replica Console & Network Logs ---');
  logs.forEach(l => console.log(`[${l.type}] ${l.text || l.url}`));

  console.log('\n--- Replica DOM State ---');
  console.log(JSON.stringify(state, null, 2));

  await browser.close();
}

testReplicaConsole().catch(console.error);
