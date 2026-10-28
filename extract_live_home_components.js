const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://go180.nl/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const homeData = await page.evaluate(() => {
    return {
      slidesHTML: document.querySelector('.slides') ? document.querySelector('.slides').outerHTML : null,
      slideNavHTML: document.querySelector('.slide__navigation') ? document.querySelector('.slide__navigation').outerHTML : null,
      arrowScrollHTML: document.querySelector('.arrowScroll') ? document.querySelector('.arrowScroll').outerHTML : null,
      headerHTML: document.querySelector('header.header') ? document.querySelector('header.header').outerHTML : null,
      mobileMenuHTML: document.querySelector('.mobile__menu') ? document.querySelector('.mobile__menu').outerHTML : null,
      wipeHTML: document.querySelector('.wipe') ? document.querySelector('.wipe').outerHTML : null,
      popupHTML: document.querySelector('.pum') ? document.querySelector('.pum').outerHTML : null
    };
  });

  fs.writeFileSync('live_homepage_components.json', JSON.stringify(homeData, null, 2));
  console.log('Saved live homepage components.');
  await browser.close();
})();
