const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', msg => console.log('BROWSER LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  await page.goto('http://localhost:3000/coaches/', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  const state = await page.evaluate(() => {
    return {
      bodyClass: document.body.className,
      htmlClass: document.documentElement.className,
      hasScrollSmooth: document.documentElement.classList.contains('has-scroll-smooth'),
      hasScrollInit: document.documentElement.classList.contains('has-scroll-init'),
      locoContainer: !!document.querySelector('[data-scroll-container]'),
      sectionsCount: document.querySelectorAll('[data-scroll-section]').length,
      sectionsStyles: Array.from(document.querySelectorAll('[data-scroll-section]')).map(s => ({
        id: s.getAttribute('data-scroll-section-id'),
        opacity: window.getComputedStyle(s).opacity,
        pointerEvents: window.getComputedStyle(s).pointerEvents,
        transform: s.style.transform
      }))
    };
  });

  console.log('Coaches state:', JSON.stringify(state, null, 2));

  // Try mouse wheel
  console.log('\nTesting wheel on coaches...');
  await page.mouse.move(700, 500);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(500);

  const afterWheel = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-scroll-section]')).map(s => ({
      id: s.getAttribute('data-scroll-section-id'),
      transform: s.style.transform
    }));
  });

  console.log('After wheel:', afterWheel);

  await browser.close();
})();
