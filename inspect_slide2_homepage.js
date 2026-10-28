const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to https://go180.nl/ ...');
  await page.goto('https://go180.nl/', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);
  try { const p = await page.$('.pum-close'); if (p) await p.click(); } catch(e){}

  const ssDir = path.join(__dirname, 'screenshots', 'homepage_deep_scroll');
  fs.mkdirSync(ssDir, { recursive: true });

  // Scroll through all 6 slides by clicking each bullet
  for (let i = 1; i <= 6; i++) {
    console.log(`Clicking bullet ${i}...`);
    const bullet = await page.$(`.slide__navigationBullet${i}`);
    if (bullet) {
      await bullet.click();
      await page.waitForTimeout(2500);
      await page.screenshot({ path: path.join(ssDir, `slide_${i}.png`) });

      const slideState = await page.evaluate((idx) => {
        const slide = document.querySelector(`#slide-${idx}`);
        return {
          id: slide ? slide.id : null,
          className: slide ? slide.className : null,
          style: slide ? slide.getAttribute('style') : null,
          titleText: slide && slide.querySelector('.slide__title') ? slide.querySelector('.slide__title').innerText : null,
          pText: slide && slide.querySelector('.slide__text') ? slide.querySelector('.slide__text').innerText : null,
          btnText: slide && slide.querySelector('.btn') ? slide.querySelector('.btn').innerText : null,
          imgSrc: slide && slide.querySelector('img') ? slide.querySelector('img').src : null,
          imgStyle: slide && slide.querySelector('img') ? slide.querySelector('img').getAttribute('style') : null,
          rect: slide ? slide.getBoundingClientRect() : null
        };
      }, i);
      console.log(`Slide ${i} details:`, JSON.stringify(slideState, null, 2));
    }
  }

  // Now scroll further down to check footer / reviews
  console.log('Scrolling past slide 6 to footer...');
  await page.mouse.wheel(0, 3000);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ssDir, `slide_footer.png`) });

  await browser.close();
})();
