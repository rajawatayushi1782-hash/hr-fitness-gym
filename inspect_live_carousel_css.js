const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.route('**/*', req => {
    const u = req.request().url();
    if (u.includes('google') || u.includes('analytics') || u.includes('facebook') || u.includes('hotjar') || u.includes('youtube')) {
      return req.abort();
    }
    req.continue();
  });

  await page.goto('https://go180.nl/we-are-go180/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  const cssInfo = await page.evaluate(() => {
    const car = document.querySelector('.carousel');
    const holder = document.querySelector('.carousel__holder');
    const slide = document.querySelector('.carousel__slide');
    const nav = document.querySelector('.carousel__nav');
    const prev = document.querySelector('.carousel__prev');
    const next = document.querySelector('.carousel__next');
    const dots = document.querySelector('.slick-dots');

    function getStyles(el) {
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return {
        display: s.display,
        position: s.position,
        width: s.width,
        height: s.height,
        margin: s.margin,
        padding: s.padding,
        overflow: s.overflow,
        overflowX: s.overflowX,
        cursor: s.cursor,
        zIndex: s.zIndex,
        pointerEvents: s.pointerEvents,
        transform: s.transform
      };
    }

    return {
      carousel: getStyles(car),
      holder: getStyles(holder),
      slide: getStyles(slide),
      nav: getStyles(nav),
      prev: getStyles(prev),
      next: getStyles(next),
      dots: getStyles(dots),
      innerHTML_nav: nav?.innerHTML,
      outerHTML_prev: prev?.outerHTML,
      outerHTML_next: next?.outerHTML
    };
  });

  console.log('LIVE CAROUSEL CSS & DOM:\n', JSON.stringify(cssInfo, null, 2));

  // Now let's test clicking the next and prev buttons on live!
  const clickTest = await page.evaluate(async () => {
    const next = document.querySelector('.carousel__next');
    const holder = document.querySelector('.carousel__holder');
    const track = document.querySelector('.slick-track');
    const initialTransform = track ? track.style.transform : 'none';

    if (next) {
      next.click();
      await new Promise(r => setTimeout(r, 600));
    }
    const afterNextTransform = track ? track.style.transform : 'none';

    return {
      initialTransform,
      afterNextTransform,
      changed: initialTransform !== afterNextTransform
    };
  });

  console.log('LIVE CLICK TEST:', clickTest);

  await browser.close();



})();
