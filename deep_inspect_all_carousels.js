const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const routes = [
    '/coaches/',
    '/stories/',
    '/clubs/leeuwarden/',
    '/we-are-go180/',
    '/programs/',
    '/programs/digital-coaching/',
    '/programs/hyrox/',
    '/'
  ];

  for (const route of routes) {
    console.log(`\n============================ ROUTE: ${route} ============================`);

    // Check on Desktop and Mobile
    for (const vp of [{ name: 'Desktop', w: 1440, h: 900 }, { name: 'Mobile', w: 390, h: 844 }]) {
      console.log(`\n--- Viewport: ${vp.name} (${vp.w}x${vp.h}) ---`);

      for (const host of ['https://go180.nl', 'http://localhost:3000']) {
        const url = host + route;
        const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
        try {
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
          await page.waitForTimeout(2000);

          const data = await page.evaluate(() => {
            const results = {};

            // 1. Check .dragSlider
            const dragSliders = Array.from(document.querySelectorAll('.dragSlider')).map(ds => ({
              class: ds.className,
              viewerWidth: ds.querySelector('.dragSlider__viewer')?.clientWidth,
              viewerScrollWidth: ds.querySelector('.dragSlider__viewer')?.scrollWidth,
              navExists: !!ds.querySelector('.dragSlider__nav'),
              navActiveTransform: ds.querySelector('.dragSlider__navActive')?.style?.transform,
              navPointsCount: ds.querySelectorAll('.dragSlider__navPoint').length,
              slidesCount: ds.querySelectorAll('.dragSlider__slide').length,
              slidesTransforms: Array.from(ds.querySelectorAll('.dragSlider__slide')).map(s => s.style.transform || s.getAttribute('style'))
            }));
            if (dragSliders.length) results.dragSlider = dragSliders;

            // 2. Check .carousel & .carousel__holder (Slick)
            const carousels = Array.from(document.querySelectorAll('.carousel, .carousel__holder')).map(c => ({
              class: c.className,
              isSlick: c.classList.contains('slick-initialized'),
              slickTrackWidth: c.querySelector('.slick-track')?.clientWidth,
              slickSlidesCount: c.querySelectorAll('.slick-slide').length,
              prevArrow: !!document.querySelector('.carousel__prev, .slick-prev'),
              nextArrow: !!document.querySelector('.carousel__next, .slick-next'),
              dotsCount: document.querySelectorAll('.slick-dots li').length
            }));
            if (carousels.length) results.carousel = carousels;

            // 3. Check .archiveDouble (coaches / stories)
            const archiveDouble = document.querySelector('.archiveDouble');
            if (archiveDouble) {
              const rows = Array.from(archiveDouble.querySelectorAll('.archiveDouble__row')).map(r => ({
                class: r.className,
                clientWidth: r.clientWidth,
                scrollWidth: r.scrollWidth,
                isOverflowingX: r.scrollWidth > r.clientWidth,
                display: window.getComputedStyle(r).display,
                flexWrap: window.getComputedStyle(r).flexWrap,
                flexDirection: window.getComputedStyle(r).flexDirection,
                slides: Array.from(r.querySelectorAll('.archiveDouble__single')).map(s => ({
                  class: s.className,
                  clientWidth: s.clientWidth,
                  scrollWidth: s.scrollWidth
                }))
              }));
              results.archiveDouble = {
                clientWidth: archiveDouble.clientWidth,
                scrollWidth: archiveDouble.scrollWidth,
                isOverflowingX: archiveDouble.scrollWidth > archiveDouble.clientWidth,
                rowsCount: rows.length,
                rows
              };
            }

            // 4. Check .archiveSlider (programs.html)
            const archiveSlider = document.querySelector('.archiveSlider');
            if (archiveSlider) {
              results.archiveSlider = {
                class: archiveSlider.className,
                clientWidth: archiveSlider.clientWidth,
                scrollWidth: archiveSlider.scrollWidth,
                isOverflowingX: archiveSlider.scrollWidth > archiveSlider.clientWidth,
                slidesCount: archiveSlider.querySelectorAll('.archiveSlider__slide').length
              };
            }

            // 5. Check any element with horizontal overflow or scroll-snap or drag
            const allElements = Array.from(document.querySelectorAll('*'));
            const sideScrolling = allElements.filter(el => {
              const s = window.getComputedStyle(el);
              return (s.overflowX === 'auto' || s.overflowX === 'scroll' || s.scrollSnapType !== 'none') && el.scrollWidth > el.clientWidth;
            }).map(el => ({
              tag: el.tagName,
              class: el.className,
              scrollWidth: el.scrollWidth,
              clientWidth: el.clientWidth,
              overflowX: window.getComputedStyle(el).overflowX
            }));
            if (sideScrolling.length) results.sideScrolling = sideScrolling;

            return results;
          });

          console.log(`[${host.includes('go180.nl') ? 'LIVE REF' : 'LOCAL'}] ${route}:`, JSON.stringify(data, null, 2));
        } catch (e) {
          console.error(`Error on ${url}:`, e.message);
        }
        await page.close();
      }
    }
  }

  await browser.close();
})();
