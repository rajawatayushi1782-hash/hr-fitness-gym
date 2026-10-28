const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://go180.nl/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const videoData = await page.evaluate(() => {
    const videos = Array.from(document.querySelectorAll('video')).map(v => ({
      outerHTML: v.outerHTML,
      src: v.src,
      currentSrc: v.currentSrc,
      sources: Array.from(v.querySelectorAll('source')).map(s => ({
        src: s.src,
        type: s.type
      })),
      id: v.id,
      className: v.className,
      parentElement: v.parentElement ? {
        tag: v.parentElement.tagName,
        className: v.parentElement.className,
        id: v.parentElement.id
      } : null
    }));

    const iframes = Array.from(document.querySelectorAll('iframe')).map(f => ({
      id: f.id,
      className: f.className,
      src: f.src
    }));

    return { videos, iframes };
  });

  console.log('Video Data on Live Site:', JSON.stringify(videoData, null, 2));
  await browser.close();
})();
