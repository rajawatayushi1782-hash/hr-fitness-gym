const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const page = await context.newPage();

  await page.goto('http://localhost:3000/', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const locoInfo = await page.evaluate(() => {
    const l = window.locomotive;
    if (!l) return 'no locomotive';
    return {
      keys: Object.keys(l),
      scrollKeys: l.scroll ? Object.keys(l.scroll) : null,
      scrollProto: l.scroll ? Object.getOwnPropertyNames(Object.getPrototypeOf(l.scroll)) : null,
      locoProto: Object.getOwnPropertyNames(Object.getPrototypeOf(l)),
      limit: (l.scroll && l.scroll.instance) ? l.scroll.instance.limit : null,
      isSmooth: l.isSmooth,
      options: l.options
    };
  });
  console.log('Locomotive details:', JSON.stringify(locoInfo, null, 2));

  // Let's test calling scrollTo with different arguments
  const test1 = await page.evaluate(() => {
    try {
      window.locomotive.update();
      const swiper = document.querySelector('.swiper');
      // Locomotive Scroll v4 can take target DOM element or target string
      // Let's see what happens if we pass the DOM element directly:
      window.locomotive.scrollTo(swiper, { duration: 0, disableLerp: true });
      return {
        err: null,
        topAfter: swiper.getBoundingClientRect().top,
        instanceY: window.locomotive.scroll ? window.locomotive.scroll.instance.scroll.y : null
      };
    } catch (e) {
      return { err: e.message, stack: e.stack };
    }
  });
  console.log('Test 1 (scrollTo(swiper DOM element)):', test1);

  // Let's test passing a selector or offset
  const test2 = await page.evaluate(() => {
    try {
      const swiper = document.querySelector('.swiper');
      // What is swiper's offsetTop or position relative to scroll container?
      let el = swiper;
      let totalTop = 0;
      while (el) {
        totalTop += el.offsetTop;
        el = el.offsetParent;
      }
      window.locomotive.scrollTo(totalTop - 200, { duration: 0, disableLerp: true });
      return {
        totalTop,
        topAfter: swiper.getBoundingClientRect().top,
        instanceY: window.locomotive.scroll ? window.locomotive.scroll.instance.scroll.y : null
      };
    } catch (e) {
      return { err: e.message };
    }
  });
  console.log('Test 2 (scrollTo(totalTop)):', test2);

  // What about footer?
  const test3 = await page.evaluate(() => {
    try {
      const footer = document.querySelector('footer');
      window.locomotive.scrollTo(footer, { duration: 0, disableLerp: true });
      return {
        swiperTopAfter: document.querySelector('.swiper').getBoundingClientRect().top,
        instanceY: window.locomotive.scroll ? window.locomotive.scroll.instance.scroll.y : null
      };
    } catch (e) {
      return { err: e.message };
    }
  });
  console.log('Test 3 (scrollTo(footer)):', test3);

  await browser.close();
})();
