const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://go180.nl/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Close popup
  try {
    const pum = await page.$('.pum-close');
    if (pum) await pum.click();
  } catch (e) {}

  const slideInfo = await page.evaluate(() => {
    const slidesEl = document.querySelector('.slides');
    const slideItems = Array.from(document.querySelectorAll('.slides > .slide')).map((s, idx) => ({
      idx,
      id: s.id,
      className: s.className,
      style: s.getAttribute('style'),
      rect: s.getBoundingClientRect(),
      computedTransform: window.getComputedStyle(s).transform,
      computedOpacity: window.getComputedStyle(s).opacity
    }));
    return {
      slidesElStyle: slidesEl ? slidesEl.getAttribute('style') : null,
      slidesElClass: slidesEl ? slidesEl.className : null,
      slideItems,
      scrollContainer: document.querySelector('[data-scroll-container]') ? {
        className: document.querySelector('[data-scroll-container]').className,
        style: document.querySelector('[data-scroll-container]').getAttribute('style')
      } : null
    };
  });
  console.log('Slide Info:', JSON.stringify(slideInfo, null, 2));

  // Now click bullet 2 and re-check
  const bullet2 = await page.$('.slide__navigationBullet:nth-child(2)');
  if (bullet2) {
    await bullet2.click();
    await page.waitForTimeout(2000);
    const afterClick = await page.evaluate(() => {
      return {
        activeBullet: document.querySelector('.slide__navigationBullet.-active') ? document.querySelector('.slide__navigationBullet.-active').className : null,
        slides: Array.from(document.querySelectorAll('.slides > .slide')).map((s, idx) => ({
          idx,
          className: s.className,
          style: s.getAttribute('style'),
          rect: s.getBoundingClientRect(),
          computedTransform: window.getComputedStyle(s).transform,
          computedOpacity: window.getComputedStyle(s).opacity
        }))
      };
    });
    console.log('After bullet 2 click:', JSON.stringify(afterClick, null, 2));
  }

  // Now scroll with wheel down
  console.log('Testing wheel scroll...');
  await page.mouse.move(720, 450);
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(2000);
  const afterWheel = await page.evaluate(() => {
    return {
      activeBullet: document.querySelector('.slide__navigationBullet.-active') ? document.querySelector('.slide__navigationBullet.-active').className : null,
      slides: Array.from(document.querySelectorAll('.slides > .slide')).map((s, idx) => ({
        idx,
        className: s.className,
        style: s.getAttribute('style'),
        rect: s.getBoundingClientRect(),
        computedTransform: window.getComputedStyle(s).transform,
        computedOpacity: window.getComputedStyle(s).opacity
      }))
    };
  });
  console.log('After wheel down:', JSON.stringify(afterWheel, null, 2));

  await browser.close();
})();
