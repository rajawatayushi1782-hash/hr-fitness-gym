const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function inspectOriginal() {
  console.log('Launching Chrome to inspect https://go180.nl/ ...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const networkRequests = [];
  page.on('request', req => {
    networkRequests.push({ url: req.url(), resourceType: req.resourceType() });
  });

  await page.goto('https://go180.nl/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Take screenshot of initial state
  const originalScreenshotsDir = path.join(__dirname, 'screenshots', 'original_live');
  fs.mkdirSync(originalScreenshotsDir, { recursive: true });
  await page.screenshot({ path: path.join(originalScreenshotsDir, 'homepage_initial.png') });

  // Evaluate window properties and libraries
  const pageData = await page.evaluate(() => {
    return {
      title: document.title,
      bodyClasses: document.body.className,
      htmlClasses: document.documentElement.className,
      hasGSAP: typeof window.gsap !== 'undefined',
      hasScrollTrigger: typeof window.ScrollTrigger !== 'undefined',
      hasLocomotiveScroll: typeof window.locomotiveScroll !== 'undefined' || typeof window.LocomotiveScroll !== 'undefined',
      hasBarba: typeof window.barba !== 'undefined',
      hasJQuery: typeof window.jQuery !== 'undefined',
      windowKeys: Object.keys(window).filter(k => /scroll|anim|gsap|loco|barba|slick|swiper|slider/i.test(k)),
      scripts: Array.from(document.querySelectorAll('script')).map(s => ({
        id: s.id,
        src: s.src,
        inline: s.src ? null : s.innerText.slice(0, 200)
      })),
      styles: Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href),
      wipeElement: document.querySelector('.wipe') ? document.querySelector('.wipe').outerHTML : null,
      scrollContainer: document.querySelector('[data-scroll-container]') ? true : false,
      dataScrollElements: document.querySelectorAll('[data-scroll]').length,
      dataScrollSpeedElements: document.querySelectorAll('[data-scroll-speed]').length,
      dataScrollClassElements: document.querySelectorAll('[data-scroll-class]').length,
      dataScrollSectionElements: document.querySelectorAll('[data-scroll-section]').length,
      sections: Array.from(document.querySelectorAll('section, main, [class*="section"], [class*="slider"]')).map(el => ({
        tag: el.tagName,
        className: el.className,
        id: el.id
      }))
    };
  });

  fs.writeFileSync(
    path.join(__dirname, 'original_inspection.json'),
    JSON.stringify({ pageData, networkRequests }, null, 2)
  );

  console.log('Inspection complete! Saved to original_inspection.json');
  console.log('Body Classes:', pageData.bodyClasses);
  console.log('HTML Classes:', pageData.htmlClasses);
  console.log('hasGSAP:', pageData.hasGSAP);
  console.log('hasBarba:', pageData.hasBarba);
  console.log('data-scroll elements count:', pageData.dataScrollElements);
  console.log('data-scroll-speed count:', pageData.dataScrollSpeedElements);
  console.log('data-scroll-section count:', pageData.dataScrollSectionElements);

  // Now scroll and check what happens
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(originalScreenshotsDir, 'homepage_scrolled_1000.png') });

  // Get full page HTML after full execution
  const htmlContent = await page.content();
  fs.writeFileSync(path.join(__dirname, 'original_live_dom.html'), htmlContent);

  await browser.close();
}

inspectOriginal().catch(console.error);
