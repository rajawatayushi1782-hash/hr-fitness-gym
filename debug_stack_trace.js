const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('pageerror', err => {
    console.log('PAGE ERROR STACK:');
    console.log(err.stack);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  await page.route('**/js/app.js', r => r.fulfill({ status: 200, contentType: 'application/javascript', body: '/* disabled */' }));

  console.log('Navigating to http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  console.log('Navigating to http://localhost:3000/we-are-go180/ ...');
  await page.goto('http://localhost:3000/we-are-go180/', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  await browser.close();
})();
