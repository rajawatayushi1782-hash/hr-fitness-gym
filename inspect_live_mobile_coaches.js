const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  await page.goto('https://go180.nl/coaches/', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    const el = document.querySelector('.archiveDouble');
    const rows = Array.from(document.querySelectorAll('.archiveDouble__row'));
    const cards = Array.from(document.querySelectorAll('.archiveDouble__single'));

    return {
      elStyles: {
        overflowX: window.getComputedStyle(el).overflowX,
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth
      },
      rowsStyles: rows.map(r => ({
        display: window.getComputedStyle(r).display,
        flexDirection: window.getComputedStyle(r).flexDirection,
        flexWrap: window.getComputedStyle(r).flexWrap,
        overflowX: window.getComputedStyle(r).overflowX,
        scrollWidth: r.scrollWidth,
        clientWidth: r.clientWidth
      })),
      cardsStyles: cards.map(c => ({
        width: c.clientWidth,
        height: c.clientHeight,
        left: c.offsetLeft,
        top: c.offsetTop,
        display: window.getComputedStyle(c).display
      }))
    };
  });

  console.log('LIVE Mobile Coaches layout:', JSON.stringify(data, null, 2));
  await page.screenshot({ path: 'live_mobile_coaches.png' });
  await browser.close();
})();
