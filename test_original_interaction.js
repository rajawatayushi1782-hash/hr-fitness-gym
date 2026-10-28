const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url.includes('google-analytics') || url.includes('googletagmanager') || url.includes('facebook') || url.includes('hotjar') || url.includes('recaptcha')) {
      return route.abort();
    }
    return route.continue();
  });

  try {
    await page.goto('https://go180.nl/we-are-go180/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    const dragInfo = await page.evaluate(() => {
      const points = Array.from(document.querySelectorAll('.dragSlider__navPoint')).map(p => ({
        text: p.innerText.trim(),
        dataIndex: p.getAttribute('data-slide-index'),
        classes: p.className
      }));
      const slides = Array.from(document.querySelectorAll('.dragSlider__slide')).map(s => ({
        dataIndex: s.getAttribute('data-slide-index'),
        classes: s.className,
        transform: s.style.transform
      }));
      return { points, slides };
    });
    console.log('Original dragSlider initial:', JSON.stringify(dragInfo, null, 2));

    // Try clicking navPoint index 1
    const point1 = await page.$('.dragSlider__navPoint[data-slide-index="1"]');
    if (point1) {
      await point1.click();
      await page.waitForTimeout(1000);
      const afterClick = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.dragSlider__slide')).map(s => ({
          dataIndex: s.getAttribute('data-slide-index'),
          classes: s.className,
          transform: s.style.transform
        }));
      });
      console.log('After clicking navPoint 1:', JSON.stringify(afterClick, null, 2));
    }

    // Now inspect carousel arrows on original site
    const slickNext = await page.$('.carousel__next');
    if (slickNext) {
      console.log('Found slickNext, clicking it...');
      const beforeSlick = await page.evaluate(() => {
        const track = document.querySelector('.slick-track');
        return track ? track.style.transform : 'none';
      });
      await slickNext.click();
      await page.waitForTimeout(1000);
      const afterSlick = await page.evaluate(() => {
        const track = document.querySelector('.slick-track');
        return track ? track.style.transform : 'none';
      });
      console.log('Slick track transform before:', beforeSlick, 'after:', afterSlick);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
})();
