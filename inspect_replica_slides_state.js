const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(3000);

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
          transform: imgCS ? imgCS.transform : null,
          opacity: imgCS ? imgCS.opacity : null,
          zIndex: imgCS ? imgCS.zIndex : null
        } : null
      };
    });
    return slides;
  });

  console.log('Replica Slides Initial State:\n', JSON.stringify(slidesState, null, 2));

  await browser.close();
})();
