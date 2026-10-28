const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:3000/', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const check = await page.evaluate(() => {
    return {
      hasInitFn: typeof window.initReviewsSwiper,
      hasJquery: typeof window.jQuery !== 'undefined',
      swiperCount: jQuery('.swiper').length,
      wrapperCount: jQuery('.swiper-wrapper').length,
      rBtnCount: jQuery('.es-carousel-arrow-control-right').length
    };
  });
  console.log('Check in browser:', check);

  await browser.close();
})();
