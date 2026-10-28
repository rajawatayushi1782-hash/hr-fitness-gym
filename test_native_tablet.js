const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const nativeTest = await page.evaluate(() => {
    const swiper = document.querySelector('.swiper');
    const scrollType = window.locomotive && window.locomotive.scroll ? window.locomotive.scroll.constructor.name : 'none';
    const topBefore = swiper.getBoundingClientRect().top;
    
    // Try window.scrollTo
    window.scrollTo(0, topBefore - 200);

    return {
      scrollType,
      topBefore,
      scrollYAfter: window.scrollY,
      topAfter: swiper.getBoundingClientRect().top
    };
  });
  console.log('Native scroll test:', nativeTest);

  // If window.scrollTo didn't change window.scrollY, why?
  // Let's check html, body, and #js-scroll overflow and styles!
  const overflowStyles = await page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;
    const jsScroll = document.querySelector('#js-scroll');
    const getStyles = (el) => {
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return {
        overflow: s.overflow,
        overflowY: s.overflowY,
        overflowX: s.overflowX,
        height: s.height,
        position: s.position,
        transform: s.transform
      };
    };
    return {
      html: getStyles(html),
      htmlClasses: html.className,
      body: getStyles(body),
      bodyClasses: body.className,
      jsScroll: getStyles(jsScroll)
    };
  });
  console.log('Overflow & layout styles:', JSON.stringify(overflowStyles, null, 2));

  await browser.close();
})();
