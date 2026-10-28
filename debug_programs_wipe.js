const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const logs = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => logs.push(`[PAGE_ERROR] ${err.message}`));

  await page.goto('http://localhost:3000/programs/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  const wipeVisibility = await page.evaluate(() => {
    const wipe = document.querySelector('.wipe');
    const spinner = document.querySelector('.wipe_spinner');
    return {
      wipeDisplay: wipe ? window.getComputedStyle(wipe).display : null,
      wipeOpacity: wipe ? window.getComputedStyle(wipe).opacity : null,
      wipeVisibility: wipe ? window.getComputedStyle(wipe).visibility : null,
      spinnerDisplay: spinner ? window.getComputedStyle(spinner).display : null,
      spinnerOpacity: spinner ? window.getComputedStyle(spinner).opacity : null
    };
  });

  console.log('Wipe visibility on /programs/:', wipeVisibility);
  console.log('Console logs on /programs/:\n', logs.join('\n'));

  await browser.close();
})();
