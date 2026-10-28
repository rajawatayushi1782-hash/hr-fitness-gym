const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const logs = [];
  const errors = [];
  page.on('console', msg => logs.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', err => errors.push(err.stack || err.message));

  // Temporarily disable app.js by intercepting the request
  await page.route('**/js/app.js', route => {
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* app.js disabled */' });
  });

  console.log('Navigating to http://localhost:3000/ without app.js ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'load' });
  await page.waitForTimeout(3000);

  const state = await page.evaluate(() => {
    const loco = window.locomotive || window.scroll || window.lscroll;
    const scrollContainer = document.querySelector('.scrollContainer');
    const wipe = document.querySelector('.wipe');
    const vHeader = document.querySelector('#videoHeader');

    return {
      bodyClasses: document.body.className,
      htmlClasses: document.documentElement.className,
      wipeStyle: wipe ? wipe.getAttribute('style') : null,
      wipeDisplay: wipe ? window.getComputedStyle(wipe).display : null,
      wipeOpacity: wipe ? window.getComputedStyle(wipe).opacity : null,
      hasVideo: !!vHeader,
      videoSrc: vHeader ? vHeader.querySelector('source') ? vHeader.querySelector('source').src : vHeader.src : null,
      scrollContainerStyle: scrollContainer ? scrollContainer.getAttribute('style') : null,
      activeBullet: document.querySelector('.slide__navigationBullet.-active') ? document.querySelector('.slide__navigationBullet.-active').className : null
    };
  });

  console.log('DOM State without app.js:', JSON.stringify(state, null, 2));
  console.log('Errors:', JSON.stringify(errors, null, 2));
  console.log('Logs:', JSON.stringify(logs, null, 2));

  // Test clicking bullet 2
  const b2 = await page.$('.slide__navigationBullet:nth-child(2)');
  if (b2) {
    console.log('Clicking bullet 2 without app.js...');
    await b2.click();
    await page.waitForTimeout(2000);
    const afterB2 = await page.evaluate(() => ({
      activeBullet: document.querySelector('.slide__navigationBullet.-active') ? document.querySelector('.slide__navigationBullet.-active').className : null,
      slide1Style: document.querySelector('#slide-1').getAttribute('style'),
      slide2Style: document.querySelector('#slide-2').getAttribute('style')
    }));
    console.log('After bullet 2 click without app.js:', JSON.stringify(afterB2, null, 2));
  }

  await browser.close();
})();
