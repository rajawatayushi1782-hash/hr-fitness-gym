const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to https://go180.nl/programs/ ...');
  await page.goto('https://go180.nl/programs/', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);
  try { const p = await page.$('.pum-close'); if (p) await p.click(); } catch(e){}

  const ssDir = path.join(__dirname, 'screenshots', 'programs_live_scroll');
  fs.mkdirSync(ssDir, { recursive: true });

  await page.screenshot({ path: path.join(ssDir, '01_initial.png') });

  // Check arrow click
  console.log('Clicking Ontdek programma arrow...');
  const arrow = await page.$('.arrowScroll, [class*="arrowScroll"], [class*="arrow"]');
  if (arrow) {
    await arrow.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(ssDir, '02_after_arrow_click.png') });
  }

  // Check scroll with pageDown or keyboard
  console.log('Pressing PageDown multiple times...');
  await page.keyboard.press('PageDown');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(ssDir, '03_pagedown_1.png') });

  await page.keyboard.press('PageDown');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(ssDir, '04_pagedown_2.png') });

  await page.keyboard.press('PageDown');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(ssDir, '05_pagedown_3.png') });

  // Get scroll position and transforms
  const scrollInfo = await page.evaluate(() => {
    const sc = document.querySelector('.scrollContainer');
    return {
      windowScrollY: window.scrollY,
      htmlScrollTop: document.documentElement.scrollTop,
      scrollContainerTransform: sc ? sc.style.transform : null,
      slides: Array.from(document.querySelectorAll('[class*="archiveSlider__slide"]')).map(s => ({
        className: s.className,
        style: s.getAttribute('style'),
        rect: s.getBoundingClientRect()
      }))
    };
  });

  console.log('Scroll Info after PageDowns:\n', JSON.stringify(scrollInfo, null, 2));
  await browser.close();
})();
