const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('https://go180.nl/stories/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  const storyLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*="/stories/"]'))
      .map(a => a.href)
      .filter(href => href !== 'https://go180.nl/stories/' && href !== 'https://go180.nl/stories');
  });

  const uniqueLinks = Array.from(new Set(storyLinks));
  console.log('Unique Story Links:', JSON.stringify(uniqueLinks, null, 2));

  await browser.close();
})();
