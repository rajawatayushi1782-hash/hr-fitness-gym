const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');

async function downloadFile(url, destPath) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve);
      }
      if (res.statusCode !== 200) {
        return resolve(false);
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(true)));
    }).on('error', () => resolve(false));
  });
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  const pages = [
    '/programs/go2gether/',
    '/programs/adaptable/',
    '/programs/healthy-ageing/',
    '/programs/hyrox/'
  ];

  for (const p of pages) {
    console.log(`Checking live ${p} ...`);
    await page.goto('https://go180.nl' + p, { waitUntil: 'domcontentloaded' });
    const imgs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map(i => ({
        src: i.src,
        dataSrc: i.getAttribute('data-src'),
        alt: i.alt
      }));
    });

    for (const img of imgs) {
      const url = img.dataSrc || img.src;
      if (url && url.includes('AronWeidenaar')) {
        console.log(`Found live URL: ${url}`);
        const filename = path.basename(url.split('?')[0]);
        const dest1 = path.join(__dirname, 'public', 'images', filename);
        const dest2 = path.join('d:/My Data/Desktop Files/HR Fitness/public/images', filename);
        const ok = await downloadFile(url, dest1);
        if (ok) {
          if (fs.existsSync(path.dirname(dest2))) fs.copyFileSync(dest1, dest2);
          console.log(`  Downloaded: ${filename}`);
        } else {
          console.log(`  Failed to download: ${url}`);
        }
      }
    }
  }

  await browser.close();
})();
