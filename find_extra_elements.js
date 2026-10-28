const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const livePage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const repPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await livePage.goto('https://go180.nl/coaches/', { waitUntil: 'domcontentloaded' });
  await repPage.goto('http://localhost:3000/coaches/', { waitUntil: 'domcontentloaded' });
  await livePage.waitForTimeout(2000);
  await repPage.waitForTimeout(2000);

  const diff = await repPage.evaluate(() => {
    // Check main direct children under body and #js-scroll
    const bodyChildren = Array.from(document.body.children).map(c => ({
      tag: c.tagName,
      id: c.id,
      className: c.className,
      count: c.querySelectorAll('*').length
    }));

    const scrollContainer = document.querySelector('#js-scroll');
    const scrollChildren = scrollContainer ? Array.from(scrollContainer.children).map(c => ({
      tag: c.tagName,
      id: c.id,
      className: c.className,
      count: c.querySelectorAll('*').length
    })) : [];

    return { bodyChildren, scrollChildren };
  });

  const liveStructure = await livePage.evaluate(() => {
    const bodyChildren = Array.from(document.body.children).map(c => ({
      tag: c.tagName,
      id: c.id,
      className: c.className,
      count: c.querySelectorAll('*').length
    }));
    return { bodyChildren };
  });

  console.log('Live Coaches Body Children:\n', JSON.stringify(liveStructure, null, 2));
  console.log('Replica Coaches Body Children:\n', JSON.stringify(diff, null, 2));

  await browser.close();
})();
