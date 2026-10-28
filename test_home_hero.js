const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const heroHeading = await page.$eval('.slide__title', el => el.innerText);
  console.log('RENDERED HERO HEADING:', JSON.stringify(heroHeading));

  await page.screenshot({ path: 'screenshots/home_hero_corrected.png', fullPage: false });
  console.log('Saved screenshot to screenshots/home_hero_corrected.png');

  await browser.close();
})();
