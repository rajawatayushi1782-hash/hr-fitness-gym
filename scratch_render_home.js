const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const titleInfo = await page.evaluate(() => {
    const el = document.querySelector('.slide__title');
    if (!el) return { error: 'No .slide__title found' };
    return {
      innerHTML: el.innerHTML,
      innerText: el.innerText,
      textContent: el.textContent,
      computedTextTransform: window.getComputedStyle(el).textTransform,
      computedFontFamily: window.getComputedStyle(el).fontFamily,
      chars: Array.from(el.querySelectorAll('.slide__char')).map(c => ({
        text: c.textContent,
        html: c.outerHTML,
        style: c.getAttribute('style')
      }))
    };
  });

  console.log('Title Info:');
  console.log(JSON.stringify(titleInfo, null, 2));

  // Let us also check all text inside #slide-1 and any overlays
  const slide1Info = await page.evaluate(() => {
    const s1 = document.querySelector('#slide-1');
    if (!s1) return { error: 'No #slide-1' };
    return {
      allHeadings: Array.from(s1.querySelectorAll('h1, h2, h3, .slide__title')).map(h => ({
        tag: h.tagName,
        class: h.className,
        innerText: h.innerText,
        innerHTML: h.innerHTML
      }))
    };
  });

  console.log('Slide 1 Headings:');
  console.log(JSON.stringify(slide1Info, null, 2));

  await page.screenshot({ path: 'screenshots/debug_home_hero.png', fullPage: false });
  console.log('Screenshot saved to screenshots/debug_home_hero.png');

  await browser.close();
})();