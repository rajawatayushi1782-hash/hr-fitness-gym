const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  for (const vp of [{ name: 'Desktop', w: 1440, h: 900 }, { name: 'Mobile', w: 390, h: 844 }]) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    await page.route('**/*', req => {
      const u = req.request().url();
      if (u.includes('google-analytics') || u.includes('googletagmanager') || u.includes('recaptcha') || u.includes('youtube.com') || u.includes('gstatic') || u.includes('polyfill.io')) {
        return req.abort();
      }
      req.continue();
    });

    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    const data = await page.evaluate(() => {
      const allAvatars = Array.from(document.querySelectorAll('img')).filter(i => i.src.includes('avatar-placeholder'));
      return {
        totalAvatars: allAvatars.length,
        loaded: allAvatars.filter(i => i.naturalWidth > 0).length,
        zero: allAvatars.filter(i => i.naturalWidth === 0).length,
        samples: allAvatars.slice(0, 3).map(i => ({
          src: i.src,
          complete: i.complete,
          naturalWidth: i.naturalWidth,
          offsetParent: !!i.offsetParent,
          computedDisplay: window.getComputedStyle(i).display
        }))
      };
    });

    console.log(`${vp.name}:`, JSON.stringify(data, null, 2));
    await page.close();
  }

  await browser.close();
})();
