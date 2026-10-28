const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const livePage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const replicaPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to live /pricing/ ...');
  await livePage.goto('https://go180.nl/pricing/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await livePage.waitForTimeout(4000);

  console.log('Navigating to replica /pricing/ ...');
  await replicaPage.goto('http://localhost:3000/pricing/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await replicaPage.waitForTimeout(3000);

  const liveInfo = await livePage.evaluate(() => {
    return {
      mainChildren: Array.from(document.body.children).map(c => ({
        tag: c.tagName,
        id: c.id,
        className: c.className,
        childrenCount: c.querySelectorAll('*').length
      })),
      scrollContainerChildren: document.querySelector('#js-scroll') ? 
        Array.from(document.querySelector('#js-scroll').children).map(c => ({
          tag: c.tagName,
          id: c.id,
          className: c.className,
          childrenCount: c.querySelectorAll('*').length
        })) : null
    };
  });

  const replicaInfo = await replicaPage.evaluate(() => {
    return {
      mainChildren: Array.from(document.body.children).map(c => ({
        tag: c.tagName,
        id: c.id,
        className: c.className,
        childrenCount: c.querySelectorAll('*').length
      })),
      scrollContainerChildren: document.querySelector('#js-scroll') ? 
        Array.from(document.querySelector('#js-scroll').children).map(c => ({
          tag: c.tagName,
          id: c.id,
          className: c.className,
          childrenCount: c.querySelectorAll('*').length
        })) : null
    };
  });

  console.log('Live Pricing Structure:\n', JSON.stringify(liveInfo, null, 2));
  console.log('Replica Pricing Structure:\n', JSON.stringify(replicaInfo, null, 2));

  await browser.close();
})();
