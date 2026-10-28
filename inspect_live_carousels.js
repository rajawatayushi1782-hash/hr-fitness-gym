const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const urls = [
    'https://go180.nl/',
    'https://go180.nl/coaches/',
    'https://go180.nl/programs/',
    'https://go180.nl/clubs/leeuwarden/',
    'https://go180.nl/we-are-go180/',
    'https://go180.nl/stories/'
  ];

  for (const url of urls) {
    console.log(`\n================ Inspecting ${url} ================`);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(2000);

      const info = await page.evaluate(() => {
        // Find all elements that look like sliders or carousels
        const carousels = Array.from(document.querySelectorAll('.carousel, .carousel__holder, .dragSlider, .swiper, .archiveSlider, .slick-slider, [data-scroll-direction="horizontal"], .scroll-track')).map(el => {
          return {
            tag: el.tagName,
            className: el.className,
            childrenCount: el.children.length,
            scrollWidth: el.scrollWidth,
            clientWidth: el.clientWidth,
            isOverflowing: el.scrollWidth > el.clientWidth,
            hasSlick: el.classList.contains('slick-slider') || !!el.querySelector('.slick-track'),
            hasSwiper: el.classList.contains('swiper') || !!el.querySelector('.swiper-wrapper'),
            hasArrows: !!el.parentElement?.querySelector('.slick-prev, .slick-next, .carousel__prev, .carousel__next, .arrow, .dragSlider__nav')
          };
        });

        // Also check any horizontal scroll containers
        const allElements = Array.from(document.querySelectorAll('*'));
        const horizontalContainers = allElements.filter(el => {
          const s = window.getComputedStyle(el);
          return (s.overflowX === 'scroll' || s.overflowX === 'auto') && el.scrollWidth > el.clientWidth;
        }).map(el => ({
          tag: el.tagName,
          className: el.className,
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth
        }));

        return {
          title: document.title,
          carousels,
          horizontalContainers
        };
      });

      console.log('Result:', JSON.stringify(info, null, 2));
    } catch (e) {
      console.error(`Error on ${url}:`, e.message);
    }
    await page.close();
  }

  await browser.close();
})();
