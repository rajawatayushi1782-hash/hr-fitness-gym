const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('https://go180.nl/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  const slidesState = await page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('.slide')).map((s, idx) => {
      const cs = window.getComputedStyle(s);
      const rect = s.getBoundingClientRect();
      const img = s.querySelector('img');
      const imgCS = img ? window.getComputedStyle(img) : null;
      return {
        id: s.id,
        index: idx,
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        styleAttr: s.getAttribute('style'),
        computed: {
          zIndex: cs.zIndex,
          position: cs.position,
          top: cs.top,
          transform: cs.transform,
          opacity: cs.opacity,
          visibility: cs.visibility,
          marginTop: cs.marginTop
        },
        img: img ? {
          src: img.src,
          style: img.getAttribute('style'),
          transform: imgCS.transform,
          opacity: imgCS.opacity,
          zIndex: imgCS.zIndex
        } : null
      };
    });
    return slides;
  });

  console.log('Live Slides Initial State:\n', JSON.stringify(slidesState, null, 2));

  await browser.close();
})();
