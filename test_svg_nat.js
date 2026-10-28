const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.setContent('<img id="test" src="http://localhost:3000/images/avatar-placeholder.svg">');
  await page.waitForSelector('#test');
  await page.waitForTimeout(500);

  const nat = await page.evaluate(() => {
    const el = document.getElementById('test');
    return { naturalWidth: el.naturalWidth, naturalHeight: el.naturalHeight, complete: el.complete };
  });

  console.log('SVG natural dimensions in Chromium:', nat);
  await browser.close();
})();
