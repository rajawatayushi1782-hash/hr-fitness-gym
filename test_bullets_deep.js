const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  // 1. Live site
  const livePage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await livePage.goto('https://go180.nl/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await livePage.waitForTimeout(3000);
  try { const pum = await livePage.$('.pum-close'); if (pum) await pum.click(); } catch(e){}

  console.log('Live site: clicking bullet 2...');
  const b2Live = await livePage.$('.slide__navigationBullet2');
  if (b2Live) {
    await b2Live.click();
    // Wait for scroll animation to complete
    for (let t = 500; t <= 3000; t += 500) {
      await livePage.waitForTimeout(500);
      const state = await livePage.evaluate(() => ({
        activeBullet: document.querySelector('.slide__navigationBullet.-active') ? document.querySelector('.slide__navigationBullet.-active').className : null,
        s1Rect: document.querySelector('#slide-1').getBoundingClientRect(),
        s2Rect: document.querySelector('#slide-2').getBoundingClientRect()
      }));
      console.log(`Live site at ${t}ms: activeBullet=${state.activeBullet}, s1Top=${state.s1Rect.top}, s2Top=${state.s2Rect.top}`);
    }
  }

  // 2. Replica site (without app.js)
  const repPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await repPage.route('**/js/app.js', r => r.fulfill({ status: 200, contentType: 'application/javascript', body: '/* disabled */' }));
  await repPage.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await repPage.waitForTimeout(3000);

  console.log('\nReplica site: clicking bullet 2...');
  const b2Rep = await repPage.$('.slide__navigationBullet2');
  if (b2Rep) {
    await b2Rep.click();
    for (let t = 500; t <= 3000; t += 500) {
      await repPage.waitForTimeout(500);
      const state = await repPage.evaluate(() => ({
        activeBullet: document.querySelector('.slide__navigationBullet.-active') ? document.querySelector('.slide__navigationBullet.-active').className : null,
        s1Rect: document.querySelector('#slide-1').getBoundingClientRect(),
        s2Rect: document.querySelector('#slide-2').getBoundingClientRect()
      }));
      console.log(`Replica site at ${t}ms: activeBullet=${state.activeBullet}, s1Top=${state.s1Rect.top}, s2Top=${state.s2Rect.top}`);
    }
  }

  await browser.close();
})();
