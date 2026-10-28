const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  for (const host of ['https://go180.nl', 'http://localhost:3000']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const isLive = host.includes('go180.nl');
    const prefix = isLive ? 'live' : 'local';

    try {
      await page.goto(host + '/coaches/', { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(2000);

      // Scroll down
      const scrollState1 = await page.evaluate(() => {
        return {
          windowScrollY: window.scrollY,
          locoScroll: document.querySelector('.scrollContainer')?.style?.transform,
          archiveDoubleTransform: document.querySelector('.archiveDouble')?.style?.transform,
          archiveDoubleRowTransforms: Array.from(document.querySelectorAll('.archiveDouble__row')).map(r => r.style.transform || r.getAttribute('style')),
          bodyOverflow: window.getComputedStyle(document.body).overflow,
          htmlOverflow: window.getComputedStyle(document.documentElement).overflow
        };
      });

      console.log(`${prefix} before wheel:`, scrollState1);

      // Perform mouse wheel down
      await page.mouse.wheel(0, 1000);
      await page.waitForTimeout(1000);

      const scrollState2 = await page.evaluate(() => {
        return {
          windowScrollY: window.scrollY,
          locoScroll: document.querySelector('.scrollContainer')?.style?.transform,
          archiveDoubleTransform: document.querySelector('.archiveDouble')?.style?.transform,
          archiveDoubleRowTransforms: Array.from(document.querySelectorAll('.archiveDouble__row')).map(r => r.style.transform || r.getAttribute('style'))
        };
      });

      console.log(`${prefix} after wheel 1000:`, scrollState2);

      await page.screenshot({ path: `coaches_${prefix}_desktop.png`, fullPage: false });

    } catch (e) {
      console.error(`Error on ${host}/coaches/:`, e.message);
    }
    await page.close();
  }

  await browser.close();
})();
