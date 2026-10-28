const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to https://go180.nl/programs/ ...');
  await page.goto('https://go180.nl/programs/', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Close popup
  try { const p = await page.$('.pum-close'); if (p) await p.click(); } catch(e){}

  const ssDir = path.join(__dirname, 'screenshots', 'programs_inspect');
  fs.mkdirSync(ssDir, { recursive: true });

  await page.screenshot({ path: path.join(ssDir, '01_programs_top.png') });

  // Scroll down 1000px
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(ssDir, '02_programs_scroll_1000.png') });

  // Scroll down another 1500px
  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(ssDir, '03_programs_scroll_2500.png') });

  // Full page data
  const data = await page.evaluate(() => {
    return {
      title: document.title,
      htmlClasses: document.documentElement.className,
      bodyClasses: document.body.className,
      sections: Array.from(document.querySelectorAll('section, [class*="section"], [class*="holder"], [class*="slider"]')).map(s => ({
        tag: s.tagName,
        className: s.className,
        id: s.id,
        rect: s.getBoundingClientRect()
      })),
      images: Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        dataSrc: img.getAttribute('data-src'),
        alt: img.alt,
        className: img.className,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayedWidth: img.clientWidth,
        displayedHeight: img.clientHeight
      })),
      htmlContent: document.querySelector('.scrollContainer') ? document.querySelector('.scrollContainer').outerHTML : document.body.innerHTML
    };
  });

  fs.writeFileSync(path.join(ssDir, 'live_programs_data.json'), JSON.stringify(data, null, 2));
  console.log('Saved live programs data and screenshots.');

  await browser.close();
})();
