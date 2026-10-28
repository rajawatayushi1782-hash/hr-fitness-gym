const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:3000/', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const swiperStatus = await page.evaluate(() => {
    const swiper = jQuery('.swiper');
    const wrapper = jQuery('.swiper-wrapper');
    const rBtn = jQuery('.es-carousel-arrow-control-right');
    const lBtn = jQuery('.es-carousel-arrow-control-left');
    
    // Check if initReviewsSwiper exists
    const hasInitFn = typeof window.initReviewsSwiper;
    
    return {
      hasSwiper: swiper.length,
      hasWrapper: wrapper.length,
      hasRBtn: rBtn.length,
      hasLBtn: lBtn.length,
      currentTransform: wrapper.css('transform'),
      hasInitFn
    };
  });
  console.log('Swiper status on home:', swiperStatus);

  // Now let's try manually triggering the click on rBtn
  await page.evaluate(() => {
    jQuery('.es-carousel-arrow-control-right').trigger('click');
  });
  await page.waitForTimeout(500);

  const afterClick = await page.evaluate(() => {
    return jQuery('.swiper-wrapper').css('transform');
  });
  console.log('After trigger click:', afterClick);

  await browser.close();
})();
