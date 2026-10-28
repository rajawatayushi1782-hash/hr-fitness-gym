const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const testRoutes = [
  '/',
  '/programs/essentials/',
  '/programs/fundamentals/',
  '/programs/go2gether/',
  '/programs/adaptable/',
  '/programs/digital-coaching/',
  '/programs/healthy-ageing/',
  '/programs/go2day/',
  '/programs/hyrox/',
  '/coaches/',
  '/clubs/leeuwarden/',
  '/stories/',
  '/pricing/',
  '/free-trial/',
  '/contact/'
];

const outDir = 'd:/My Data/Desktop Files/HR Fitness/screenshots/diagnose';
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  for (const route of testRoutes) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const failedRequests = [];
    const consoleLogs = [];

    page.on('requestfailed', req => {
      failedRequests.push({ url: req.url(), failure: req.failure()?.errorText });
    });
    page.on('response', res => {
      if (res.status() >= 400) {
        failedRequests.push({ url: res.url(), status: res.status() });
      }
    });
    page.on('console', msg => {
      if (msg.type() === 'error') consoleLogs.push(msg.text());
    });

    console.log(`\n=================== Inspecting ${route} ===================`);
    try {
      await page.goto('http://localhost:3000' + route, { waitUntil: 'networkidle', timeout: 15000 });
    } catch (e) {
      console.log(`  Navigation reached timeout/interrupted: ${e.message}`);
    }

    // Wait a little to let any animations settle or hang
    await page.waitForTimeout(3000);

    const safeName = route.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home';
    const initialShot = path.join(outDir, `initial_${safeName}.png`);
    await page.screenshot({ path: initialShot, fullPage: false });
    console.log(`  Saved initial screenshot: ${initialShot}`);

    // Inspect DOM
    const domAudit = await page.evaluate(() => {
      // 1. Headers count and details
      const headers = Array.from(document.querySelectorAll('header, .header')).map(el => ({
        tag: el.tagName,
        className: el.className,
        rect: el.getBoundingClientRect(),
        opacity: window.getComputedStyle(el).opacity,
        display: window.getComputedStyle(el).display,
        visibility: window.getComputedStyle(el).visibility,
        zIndex: window.getComputedStyle(el).zIndex
      }));

      // 2. Wipe / spinner state
      const wipe = document.querySelector('.wipe');
      const spinner = document.querySelector('.wipe_spinner');
      const wipeState = {
        wipeExists: !!wipe,
        wipeOpacity: wipe ? window.getComputedStyle(wipe).opacity : null,
        wipeTransform: wipe ? window.getComputedStyle(wipe).transform : null,
        wipeZIndex: wipe ? window.getComputedStyle(wipe).zIndex : null,
        spinnerExists: !!spinner,
        spinnerOpacity: spinner ? window.getComputedStyle(spinner).opacity : null,
        spinnerDisplay: spinner ? window.getComputedStyle(spinner).display : null,
        spinnerVisibility: spinner ? window.getComputedStyle(spinner).visibility : null,
        spinnerZIndex: spinner ? window.getComputedStyle(spinner).zIndex : null
      };

      // 3. Body / Main visibility
      const bodyState = {
        bodyOpacity: window.getComputedStyle(document.body).opacity,
        scrollContainerOpacity: document.querySelector('#js-scroll') ? window.getComputedStyle(document.querySelector('#js-scroll')).opacity : null
      };

      // 4. Broken or zero-size images
      const images = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        dataSrc: img.getAttribute('data-src'),
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        offsetWidth: img.offsetWidth,
        offsetHeight: img.offsetHeight,
        classes: img.className,
        isZeroSize: img.naturalWidth === 0 && !img.src.startsWith('data:image/svg+xml')
      }));

      // 5. Horizontal overflow check
      const docWidth = document.documentElement.scrollWidth;
      const winWidth = window.innerWidth;
      const overflowElements = [];
      if (docWidth > winWidth) {
        document.querySelectorAll('*').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.right > winWidth + 5) {
            overflowElements.push({
              tag: el.tagName,
              className: el.className,
              id: el.id,
              right: r.right,
              width: r.width
            });
          }
        });
      }

      // 6. Overlapping header with hero
      const hero = document.querySelector('.headerLower, .headerClub, .slide, .header-program, [class*="headerLower"]');
      const headerEl = document.querySelector('.header');
      let headerOverlapsHero = false;
      if (headerEl && hero) {
        const headerRect = headerEl.getBoundingClientRect();
        const heroRect = hero.getBoundingClientRect();
        // check if header visually overlaps text or content inside hero
        const h1 = hero.querySelector('h1, .slide__title, .h1');
        if (h1) {
          const h1Rect = h1.getBoundingClientRect();
          if (h1Rect.top < headerRect.bottom) {
            headerOverlapsHero = true;
          }
        }
      }

      return {
        headers,
        wipeState,
        bodyState,
        zeroSizeImages: images.filter(i => i.isZeroSize).slice(0, 10),
        totalImages: images.length,
        hasOverflow: docWidth > winWidth,
        overflowDelta: docWidth - winWidth,
        overflowElements: overflowElements.slice(0, 5),
        headerOverlapsHero
      };
    });

    console.log(`  Headers count: ${domAudit.headers.length}`);
    domAudit.headers.forEach((h, i) => {
      console.log(`    Header ${i}: top=${h.rect.top}, height=${h.rect.height}, zIndex=${h.zIndex}, class="${h.className}"`);
    });
    console.log(`  Header overlaps hero H1: ${domAudit.headerOverlapsHero}`);
    console.log(`  Wipe state: wipeExists=${domAudit.wipeState.wipeExists}, wipeOpacity=${domAudit.wipeState.wipeOpacity}, spinnerOpacity=${domAudit.wipeState.spinnerOpacity}`);
    console.log(`  Body state: bodyOpacity=${domAudit.bodyState.bodyOpacity}, scrollOpacity=${domAudit.bodyState.scrollContainerOpacity}`);
    console.log(`  Horizontal overflow: ${domAudit.hasOverflow} (+${domAudit.overflowDelta}px)`);
    if (domAudit.overflowElements.length > 0) {
      console.log(`    Overflow elements:`, domAudit.overflowElements);
    }
    console.log(`  Images: total=${domAudit.totalImages}, broken/zero-size=${domAudit.zeroSizeImages.length}`);
    if (domAudit.zeroSizeImages.length > 0) {
      console.log(`    Sample broken images:`, domAudit.zeroSizeImages);
    }
    if (failedRequests.length > 0) {
      console.log(`  Failed network requests (${failedRequests.length}):`, failedRequests.slice(0, 5));
    }
    if (consoleLogs.length > 0) {
      console.log(`  Console errors:`, consoleLogs.slice(0, 5));
    }

    await page.close();
  }

  await browser.close();
})();
