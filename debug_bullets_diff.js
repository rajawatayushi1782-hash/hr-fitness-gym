const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // 1. Check live site
  console.log('--- Inspecting LIVE site currentElements ---');
  const livePage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await livePage.goto('https://go180.nl/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await livePage.waitForTimeout(3000);
  try { const pum = await livePage.$('.pum-close'); if (pum) await pum.click(); } catch(e){}

  const liveInitial = await livePage.evaluate(() => {
    // Check all elements with data-scroll
    const elMap = Array.from(document.querySelectorAll('[data-scroll-id]')).map(el => ({
      id: el.id,
      className: el.className,
      scrollId: el.getAttribute('data-scroll-id'),
      rect: el.getBoundingClientRect()
    }));
    return elMap;
  });
  console.log('Live data-scroll-id elements initial:');
  console.log(JSON.stringify(liveInitial, null, 2));

  // Click bullet 2 on live site
  console.log('\nClicking bullet 2 on LIVE site...');
  const b2 = await livePage.$('.slide__navigationBullet2');
  if (b2) await b2.click();
  await livePage.waitForTimeout(2500);

  const liveAfterB2 = await livePage.evaluate(() => {
    const elMap = Array.from(document.querySelectorAll('[data-scroll-id]')).map(el => ({
      id: el.id,
      className: el.className,
      scrollId: el.getAttribute('data-scroll-id'),
      rect: el.getBoundingClientRect()
    }));
    return {
      activeBullet: document.querySelector('.slide__navigationBullet.-active') ? document.querySelector('.slide__navigationBullet.-active').className : null,
      bullets: Array.from(document.querySelectorAll('.slide__navigationBullet')).map(b => ({
        className: b.className,
        style: b.getAttribute('style'),
        activeStyle: b.querySelector('.slide__navigationBulletActive') ? b.querySelector('.slide__navigationBulletActive').getAttribute('style') : null
      })),
      elMap
    };
  });
  console.log('Live site after bullet 2 click:');
  console.log(JSON.stringify(liveAfterB2, null, 2));

  // 2. Check replica site
  console.log('\n--- Inspecting REPLICA site currentElements ---');
  const repPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await repPage.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await repPage.waitForTimeout(3000);
  try { const pum = await repPage.$('.pum-close'); if (pum) await pum.click(); } catch(e){}

  const repInitial = await repPage.evaluate(() => {
    const elMap = Array.from(document.querySelectorAll('[data-scroll-id]')).map(el => ({
      id: el.id,
      className: el.className,
      scrollId: el.getAttribute('data-scroll-id'),
      rect: el.getBoundingClientRect()
    }));
    return elMap;
  });
  console.log('Replica data-scroll-id elements initial:');
  console.log(JSON.stringify(repInitial, null, 2));

  console.log('\nClicking bullet 2 on REPLICA site...');
  const repB2 = await repPage.$('.slide__navigationBullet2');
  if (repB2) await repB2.click();
  await repPage.waitForTimeout(2500);

  const repAfterB2 = await repPage.evaluate(() => {
    const elMap = Array.from(document.querySelectorAll('[data-scroll-id]')).map(el => ({
      id: el.id,
      className: el.className,
      scrollId: el.getAttribute('data-scroll-id'),
      rect: el.getBoundingClientRect()
    }));
    return {
      activeBullet: document.querySelector('.slide__navigationBullet.-active') ? document.querySelector('.slide__navigationBullet.-active').className : null,
      bullets: Array.from(document.querySelectorAll('.slide__navigationBullet')).map(b => ({
        className: b.className,
        style: b.getAttribute('style'),
        activeStyle: b.querySelector('.slide__navigationBulletActive') ? b.querySelector('.slide__navigationBulletActive').getAttribute('style') : null
      })),
      elMap
    };
  });
  console.log('Replica site after bullet 2 click:');
  console.log(JSON.stringify(repAfterB2, null, 2));

  await browser.close();
})();
