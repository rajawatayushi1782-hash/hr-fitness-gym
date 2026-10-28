const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('https://go180.nl/coaches/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    const el = document.querySelector('.archiveDouble');
    const rows = Array.from(document.querySelectorAll('.archiveDouble__row'));
    const cards = Array.from(document.querySelectorAll('.archiveDouble__single'));

    return {
      elStyles: {
        display: window.getComputedStyle(el).display,
        position: window.getComputedStyle(el).position,
        overflow: window.getComputedStyle(el).overflow,
        transform: el.style.transform
      },
      rowsStyles: rows.map(r => ({
        display: window.getComputedStyle(r).display,
        flexDirection: window.getComputedStyle(r).flexDirection,
        flexWrap: window.getComputedStyle(r).flexWrap,
        transform: r.style.transform,
        width: r.clientWidth,
        scrollWidth: r.scrollWidth
      })),
      cardsStyles: cards.map(c => ({
        width: c.clientWidth,
        height: c.clientHeight,
        left: c.offsetLeft,
        top: c.offsetTop,
        display: window.getComputedStyle(c).display,
        transform: c.style.transform
      }))
    };
  });

  console.log('LIVE Coaches layout:', JSON.stringify(data, null, 2));
  await browser.close();
})();
