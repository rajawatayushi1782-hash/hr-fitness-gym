const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://go180.nl/', { waitUntil: 'networkidle' });

  const info = await page.evaluate(() => {
    const jsScroll = document.querySelector('#js-scroll');
    const scrollContainer = document.querySelector('.scrollContainer');
    const mainContainer = document.querySelector('main');
    const body = document.body;

    return {
      hasJsScroll: !!jsScroll,
      jsScrollTag: jsScroll ? jsScroll.tagName : null,
      jsScrollClass: jsScroll ? jsScroll.className : null,
      scrollContainerClass: scrollContainer ? scrollContainer.className : null,
      scrollContainerId: scrollContainer ? scrollContainer.id : null,
      mainTag: mainContainer ? mainContainer.outerHTML.slice(0, 200) : null,
      bodyChildren: Array.from(body.children).map(c => ({
        tag: c.tagName,
        id: c.id,
        className: c.className
      }))
    };
  });

  console.log('Live Container Info:', JSON.stringify(info, null, 2));
  await browser.close();
})();
