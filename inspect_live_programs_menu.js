const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://go180.nl/', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  const menuInfo = await page.evaluate(() => {
    const progLi = Array.from(document.querySelectorAll('.menu-item')).find(el => el.innerText.includes('Programs'));
    if (!progLi) return 'No Programs menu item';

    return {
      outerHTML: progLi.outerHTML,
      rect: progLi.getBoundingClientRect(),
      subMenuHTML: progLi.querySelector('.sub-menu') ? progLi.querySelector('.sub-menu').outerHTML : null,
      imagesInside: Array.from(progLi.querySelectorAll('img')).map(i => i.src),
      computedStyle: {
        fontFamily: window.getComputedStyle(progLi).fontFamily,
        fontSize: window.getComputedStyle(progLi).fontSize,
        fontWeight: window.getComputedStyle(progLi).fontWeight
      }
    };
  });

  console.log('Live Programs Menu Item:', JSON.stringify(menuInfo, null, 2));

  // Now check Slide 2 (The Programs Section on Homepage)
  const slide2Info = await page.evaluate(() => {
    const s2 = document.querySelector('#slide-2');
    return {
      outerHTML: s2 ? s2.outerHTML : null,
      images: Array.from(s2.querySelectorAll('img')).map(i => ({
        src: i.src,
        dataSrc: i.getAttribute('data-src'),
        style: i.getAttribute('style'),
        className: i.className
      })),
      rect: s2 ? s2.getBoundingClientRect() : null
    };
  });

  console.log('\nLive Slide 2 (Programs section on homepage):', JSON.stringify(slide2Info, null, 2));

  await browser.close();
})();
