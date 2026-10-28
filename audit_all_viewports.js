const { chromium } = require('playwright');
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

const viewports = [
  { name: 'desktop_1440', width: 1440, height: 900 },
  { name: 'laptop_1280', width: 1280, height: 800 },
  { name: 'tablet_768', width: 768, height: 1024 },
  { name: 'mobile_430', width: 430, height: 932 },
  { name: 'mobile_390', width: 390, height: 844 },
  { name: 'mobile_375', width: 375, height: 812 }
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];

  for (const vp of viewports) {
    console.log(`\n=================== Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ===================`);
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

    for (const route of testRoutes) {
      try {
        await page.goto('http://localhost:3000' + route, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(1500);

        const audit = await page.evaluate(() => {
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          const hasOverflow = docWidth > winWidth;
          const delta = docWidth - winWidth;

          const overflowingElements = [];
          if (hasOverflow) {
            document.querySelectorAll('*').forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.right > winWidth + 5) {
                overflowingElements.push({
                  tag: el.tagName,
                  className: el.className,
                  id: el.id,
                  right: Math.round(r.right),
                  width: Math.round(r.width)
                });
              }
            });
          }

          const headers = Array.from(document.querySelectorAll('header, .header')).filter(h => {
            const s = window.getComputedStyle(h);
            return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
          });

          const spinner = document.querySelector('.wipe_spinner');
          const isSpinnerVisible = spinner && window.getComputedStyle(spinner).display !== 'none' && window.getComputedStyle(spinner).opacity !== '0';

          const brokenImages = Array.from(document.querySelectorAll('img')).filter(img => {
            // Ignore GTM pixel
            if (img.src && img.src.includes('data:image/svg') && img.parentElement && img.parentElement.tagName === 'NOSCRIPT') return false;
            // Ignore 1x1 SVGs inside noscript
            if (img.width === 0 && img.height === 0 && img.style.display === 'none') return false;
            return img.naturalWidth === 0 && !img.src.startsWith('data:image/svg');
          }).map(i => ({ src: i.src, className: i.className }));

          return {
            hasOverflow,
            delta,
            overflowingElements: overflowingElements.slice(0, 3),
            headerCount: headers.length,
            isSpinnerVisible,
            brokenImages
          };
        });

        results.push({
          viewport: vp.name,
          route,
          ...audit
        });

        const status = (audit.hasOverflow ? `OVERFLOW(+${audit.delta}px)` : 'OK') +
          (audit.headerCount !== 1 ? ` HEADERS=${audit.headerCount}` : '') +
          (audit.isSpinnerVisible ? ' SPINNER_STUCK' : '') +
          (audit.brokenImages.length > 0 ? ` BROKEN_IMG=${audit.brokenImages.length}` : '');

        console.log(`  [${vp.name}] ${route.padEnd(28)}: ${status}`);
        if (audit.hasOverflow && audit.overflowingElements.length > 0) {
          console.log(`     Overflow culprit:`, audit.overflowingElements[0]);
        }
        if (audit.brokenImages.length > 0) {
          console.log(`     Broken images:`, audit.brokenImages);
        }

      } catch (err) {
        console.error(`  Error on ${route}:`, err.message);
      }
    }
    await page.close();
  }

  await browser.close();
  fs.writeFileSync('audit_results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\nAudit complete! Saved audit_results.json');
})();
