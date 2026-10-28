const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://go180.nl/coaches/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const coachLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*="/coaches/"]'))
      .map(a => a.href)
      .filter(href => href !== 'https://go180.nl/coaches/' && href !== 'https://go180.nl/coaches');
  });

  const uniqueLinks = Array.from(new Set(coachLinks));
  console.log('Unique Coach Links:', JSON.stringify(uniqueLinks, null, 2));

  await browser.close();
})();
