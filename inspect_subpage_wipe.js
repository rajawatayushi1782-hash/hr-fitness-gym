const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const livePage = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to https://go180.nl/we-are-go180/ ...');
  await livePage.goto('https://go180.nl/we-are-go180/', { waitUntil: 'load', timeout: 30000 });
  await livePage.waitForTimeout(3000);

  const liveState = await livePage.evaluate(() => {
    const wipe = document.querySelector('.wipe');
    return {
      bodyClass: document.body.className,
      htmlClass: document.documentElement.className,
      wipeExists: !!wipe,
      wipeStyle: wipe ? wipe.getAttribute('style') : null,
      wipeOpacity: wipe ? window.getComputedStyle(wipe).opacity : null,
      wipeDisplay: wipe ? window.getComputedStyle(wipe).display : null,
      wipeVisibility: wipe ? window.getComputedStyle(wipe).visibility : null
    };
  });

  const ssDir = path.join(__dirname, 'screenshots', 'subpage_compare');
  fs.mkdirSync(ssDir, { recursive: true });
  await livePage.screenshot({ path: path.join(ssDir, 'live_we_are_go180.png') });

  console.log('Live we-are-go180 state:', JSON.stringify(liveState, null, 2));

  // Now inspect replica we-are-go180
  const repPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  console.log('Navigating to http://localhost:3000/we-are-go180/ ...');
  await repPage.goto('http://localhost:3000/we-are-go180/', { waitUntil: 'load', timeout: 30000 });
  await repPage.waitForTimeout(3000);

  const repState = await repPage.evaluate(() => {
    const wipe = document.querySelector('.wipe');
    return {
      bodyClass: document.body.className,
      htmlClass: document.documentElement.className,
      wipeExists: !!wipe,
      wipeStyle: wipe ? wipe.getAttribute('style') : null,
      wipeOpacity: wipe ? window.getComputedStyle(wipe).opacity : null,
      wipeDisplay: wipe ? window.getComputedStyle(wipe).display : null,
      wipeVisibility: wipe ? window.getComputedStyle(wipe).visibility : null
    };
  });

  await repPage.screenshot({ path: path.join(ssDir, 'replica_we_are_go180.png') });
  console.log('Replica we-are-go180 state:', JSON.stringify(repState, null, 2));

  await browser.close();
})();
