const { chromium } = require('playwright');
const path = require('path');

async function test() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto('https://go180.nl/contact/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Check body classes before
  const classesBefore = await page.evaluate(() => document.body.className);
  console.log('Classes before:', classesBefore);

  // Remove loading class if present
  await page.evaluate(() => {
    document.body.classList.remove('loading');
    const curtains = document.querySelectorAll('.curtain, .loader, [class*="transition"], [class*="loading"]');
    curtains.forEach(c => c.style.display = 'none');
  });

  await page.waitForTimeout(1000);

  const classesAfter = await page.evaluate(() => document.body.className);
  console.log('Classes after:', classesAfter);

  const ssPath = path.join(__dirname, 'screenshots', 'original', 'contact_test_noloading.png');
  await page.screenshot({ path: ssPath, fullPage: true });
  console.log('Saved screenshot:', ssPath);

  await browser.close();
}

test().catch(console.error);
