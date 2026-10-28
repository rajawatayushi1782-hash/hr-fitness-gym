const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/programs/adaptable/', { waitUntil: 'domcontentloaded' });
  const h1 = await page.$eval('h1', el => el.innerText);
  console.log('Adaptable H1:', JSON.stringify(h1));
  await browser.close();
})();
