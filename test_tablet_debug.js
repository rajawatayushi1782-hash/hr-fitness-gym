const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  // Compute absolute Y coordinate and scroll using locomotive
  const scrollRes = await page.evaluate(() => {
    const swiper = document.querySelector('.swiper');
    if (!swiper) return null;
    const currentY = (window.locomotive && window.locomotive.scroll && window.locomotive.scroll.instance)
      ? window.locomotive.scroll.instance.scroll.y
      : window.scrollY;
    const targetY = swiper.getBoundingClientRect().top + currentY;

    if (window.locomotive && typeof window.locomotive.scrollTo === 'function') {
      window.locomotive.scrollTo(targetY - 200, { duration: 0, disableLerp: true });
    } else if (window.locomotive && window.locomotive.scroll && typeof window.locomotive.scroll.scrollTo === 'function') {
      window.locomotive.scroll.scrollTo(targetY - 200, { duration: 0, disableLerp: true });
    } else {
      window.scrollTo(0, targetY - 200);
    }
    return { currentY, targetY };
  });
  console.log('Scroll attempted with:', scrollRes);
  await page.waitForTimeout(1000);

  const rectAfterLocoScroll = await page.evaluate(() => {
    const swiper = document.querySelector('.swiper');
    const r = swiper.getBoundingClientRect();
    const currentY = (window.locomotive && window.locomotive.scroll && window.locomotive.scroll.instance)
      ? window.locomotive.scroll.instance.scroll.y
      : window.scrollY;
    return {
      x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, currentY
    };
  });
  console.log('Swiper rect after locomotive.scrollTo(targetY - 200):', rectAfterLocoScroll);

  // Check buttons
  await page.evaluate(() => {
    document.querySelector('.es-carousel-arrow-control-container-next').click();
  });
  await page.waitForTimeout(500);
  const t1 = await page.evaluate(() => document.querySelector('.swiper-wrapper').style.transform);
  console.log('After Next click:', t1);

  await page.evaluate(() => {
    document.querySelector('.es-carousel-arrow-control-container-previous').click();
  });
  await page.waitForTimeout(500);
  const t2 = await page.evaluate(() => document.querySelector('.swiper-wrapper').style.transform);
  console.log('After Prev click:', t2);

  // Now perform mouse drag
  if (rectAfterLocoScroll.y >= 0 && rectAfterLocoScroll.y < 1024) {
    const startX = rectAfterLocoScroll.x + Math.min(250, rectAfterLocoScroll.width * 0.7);
    const startY = rectAfterLocoScroll.y + rectAfterLocoScroll.height / 2;
    console.log('Dragging from valid viewport coords:', startX, startY);
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX - 180, startY, { steps: 12 });
    await page.mouse.up();
    await page.waitForTimeout(800);
  } else {
    console.warn('Swiper is STILL outside viewport!', rectAfterLocoScroll.y);
  }

  const t3 = await page.evaluate(() => document.querySelector('.swiper-wrapper').style.transform);
  console.log('After Drag:', t3);

  await browser.close();
})();
