const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/we-are-go180/', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const initial = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.dragSlider__slide')).map(s => ({
      index: s.getAttribute('data-slide-index'),
      transform: s.style.transform,
      classes: s.className
    }));
  });
  console.log('Initial slides on /we-are-go180/:', JSON.stringify(initial, null, 2));

  // Click navPoint 1
  await page.evaluate(() => {
    const pt1 = document.querySelector('.dragSlider__navPoint[data-slide-index="1"]');
    if (pt1) pt1.click();
  });
  await page.waitForTimeout(800);

  const after = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.dragSlider__slide')).map(s => ({
      index: s.getAttribute('data-slide-index'),
      transform: s.style.transform,
      classes: s.className
    }));
  });
  console.log('After clicking navPoint 1:', JSON.stringify(after, null, 2));

  await browser.close();
})();
