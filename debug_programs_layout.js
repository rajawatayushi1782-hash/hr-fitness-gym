const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/programs/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  const rects = await page.evaluate(() => {
    const s0 = document.querySelector('[data-scroll-section]');
    const s1 = document.querySelector('#archiveSlider');
    const h1 = document.querySelector('h1');
    const holder = document.querySelector('.slide__txtHolder');
    const wipe = document.querySelector('.wipe');
    const spinner = document.querySelector('.wipe_spinner');

    return {
      windowScrollY: window.scrollY,
      s0Rect: s0 ? s0.getBoundingClientRect() : null,
      s0Style: s0 ? s0.getAttribute('style') : null,
      s1Rect: s1 ? s1.getBoundingClientRect() : null,
      h1Rect: h1 ? h1.getBoundingClientRect() : null,
      holderRect: holder ? holder.getBoundingClientRect() : null,
      holderTransform: holder ? window.getComputedStyle(holder).transform : null,
      holderOpacity: holder ? window.getComputedStyle(holder).opacity : null,
      wipeRect: wipe ? wipe.getBoundingClientRect() : null,
      spinnerRect: spinner ? spinner.getBoundingClientRect() : null,
      spinnerVisible: spinner ? window.getComputedStyle(spinner).visibility : null,
      spinnerOpacity: spinner ? window.getComputedStyle(spinner).opacity : null
    };
  });

  console.log(JSON.stringify(rects, null, 2));
  await browser.close();
})();
