const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  // Scroll to swiper section
  await page.evaluate(() => {
    if (window.locomotive) {
      window.locomotive.scrollTo('.swiper', { duration: 0, disableLerp: true });
    }
  });
  await page.waitForTimeout(1500);

  // 1. Initial State
  const t0 = await page.evaluate(() => document.querySelector('.swiper-wrapper').style.transform);
  console.log('Reviews initial transform (t0):', t0);

  // 2. Click Next
  await page.evaluate(() => {
    document.querySelector('.es-carousel-arrow-control-container-next').click();
  });
  await page.waitForTimeout(1000);
  const t1 = await page.evaluate(() => document.querySelector('.swiper-wrapper').style.transform);
  console.log('Reviews after 1st right click (t1):', t1);

  // 3. Click Next again
  await page.evaluate(() => {
    document.querySelector('.es-carousel-arrow-control-container-next').click();
  });
  await page.waitForTimeout(1000);
  const t2 = await page.evaluate(() => document.querySelector('.swiper-wrapper').style.transform);
  console.log('Reviews after 2nd right click (t2):', t2);

  // 4. Click Prev
  await page.evaluate(() => {
    document.querySelector('.es-carousel-arrow-control-container-previous').click();
  });
  await page.waitForTimeout(1000);
  const t3 = await page.evaluate(() => document.querySelector('.swiper-wrapper').style.transform);
  console.log('Reviews after left click (t3):', t3);

  const arrowPassed = (t0 !== t1 && t1 !== t2 && t3 === t1);
  console.log('Arrow Click Test Passed:', arrowPassed);

  // 5. Test mouse drag on .swiper
  const beforeDrag = await page.evaluate(() => document.querySelector('.swiper-wrapper').style.transform);

  const swiperBox = await page.evaluate(() => {
    const el = document.querySelector('.swiper');
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });

  if (swiperBox && swiperBox.height > 0) {
    const startX = swiperBox.x + 400;
    const startY = swiperBox.y + swiperBox.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX - 250, startY, { steps: 15 });
    await page.mouse.up();
    await page.waitForTimeout(1000);
  }

  const afterDrag = await page.evaluate(() => document.querySelector('.swiper-wrapper').style.transform);
  console.log('Before drag transform:', beforeDrag);
  console.log('After drag transform:', afterDrag);
  const dragPassed = (afterDrag !== beforeDrag);
  console.log('Drag Test Passed:', dragPassed);

  if (!arrowPassed || !dragPassed) {
    console.error('FAILED Reviews Swiper Test: arrowPassed=' + arrowPassed + ', dragPassed=' + dragPassed);
    process.exit(1);
  } else {
    console.log('ALL REVIEWS SWIPER TESTS PASSED 100%!');
  }

  await browser.close();
})();
