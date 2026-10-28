const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.route('**/*', req => {
    const u = req.request().url();
    if (u.includes('google-analytics') || u.includes('googletagmanager') || u.includes('recaptcha') || u.includes('youtube.com') || u.includes('gstatic') || u.includes('polyfill.io')) {
      return req.abort();
    }
    req.continue();
  });

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      dataSrc: img.getAttribute('data-src'),
      className: img.className,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      complete: img.complete,
      parent: img.parentElement ? img.parentElement.tagName + '.' + img.parentElement.className : 'null'
    })).filter(i => i.naturalWidth === 0);
  });

  console.log('Zero naturalWidth images on mobile home:', JSON.stringify(images, null, 2));
  await browser.close();
})();
