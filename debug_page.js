const { chromium } = require('playwright');

async function debugPage() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push(`[console.${msg.type()}] ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    errors.push(`[pageerror] ${err.message}`);
  });

  const failedRequests = [];
  page.on('requestfailed', req => {
    failedRequests.push(`${req.url()} (${req.failure()?.errorText})`);
  });

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  console.log('Console errors:', errors);
  console.log('Failed requests:', failedRequests);

  // Check what element is at (335, 31) where hamburger is
  const elAtPoint = await page.evaluate(() => {
    const el = document.elementFromPoint(335, 31);
    return el ? { tag: el.tagName, class: el.className, id: el.id } : null;
  });
  console.log('Element at hamburger point (335, 31):', elAtPoint);

  await browser.close();
}

debugPage().catch(console.error);
