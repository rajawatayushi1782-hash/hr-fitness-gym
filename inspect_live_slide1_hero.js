const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('https://go180.nl/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  const slide1 = await page.evaluate(() => {
    const s1 = document.querySelector('#slide-1, .slide:first-child');
    if (!s1) return 'No slide 1';
    
    const videos = Array.from(s1.querySelectorAll('video, source')).map(v => ({
      tag: v.tagName,
      src: v.src,
      currentSrc: v.currentSrc,
      outerHTML: v.outerHTML
    }));

    const images = Array.from(s1.querySelectorAll('img')).map(img => ({
      src: img.src,
      dataSrc: img.getAttribute('data-src'),
      outerHTML: img.outerHTML,
      style: img.getAttribute('style'),
      class: img.className
    }));

    return {
      outerHTML: s1.outerHTML.slice(0, 3000),
      videos,
      images
    };
  });

  console.log('Slide 1 Live details:', JSON.stringify(slide1, null, 2));

  await browser.close();
})();
