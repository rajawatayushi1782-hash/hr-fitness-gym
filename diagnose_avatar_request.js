const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  page.on('request', r => {
    if (r.url().includes('avatar-placeholder')) {
      console.log('REQUEST:', r.url());
    }
  });

  page.on('response', r => {
    if (r.url().includes('avatar-placeholder')) {
      console.log('RESPONSE:', r.status(), r.headers()['content-type']);
    }
  });

  page.on('requestfailed', r => {
    if (r.url().includes('avatar-placeholder')) {
      console.log('REQUEST FAILED:', r.failure()?.errorText);
    }
  });

  await page.route('**/*', req => {
    const u = req.request().url();
    if (u.includes('google-analytics') || u.includes('googletagmanager') || u.includes('recaptcha') || u.includes('youtube.com') || u.includes('gstatic') || u.includes('polyfill.io')) {
      return req.abort();
    }
    req.continue();
  });

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const check = await page.evaluate(() => {
    const img = document.querySelector('img[src*="avatar-placeholder"]');
    if (!img) return null;
    return {
      src: img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      outerHTML: img.outerHTML
    };
  });

  console.log('Check result:', check);
  await browser.close();
})();
