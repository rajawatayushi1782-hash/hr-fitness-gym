const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const https = require('https');

const routes = [
  '/programs/go2gether/',
  '/programs/adaptable/',
  '/programs/digital-coaching/',
  '/programs/healthy-ageing/',
  '/programs/hyrox/',
  '/disclaimer/',
  '/privacy-policy/'
];

async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return resolve(false);
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(true)));
    }).on('error', (err) => resolve(false));
  });
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  const missingUrls = [];

  for (const r of routes) {
    await page.goto('http://localhost:3000' + r, { waitUntil: 'domcontentloaded' });
    const broken = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter(img => img.complete && img.naturalWidth === 0 && img.src && !img.src.includes('data:'))
        .map(img => img.src);
    });
    console.log(r, 'broken images:', broken);
    missingUrls.push(...broken);
  }

  const uniqueBroken = Array.from(new Set(missingUrls));
  console.log('\nUnique broken images to fetch:', uniqueBroken);

  for (const src of uniqueBroken) {
    const filename = path.basename(src.split('?')[0]);
    const liveUrl = `https://go180.nl/app/smush-webp/2023/06/${filename}`;
    const liveUrlFallback = `https://go180.nl/app/uploads/2023/06/${filename.replace('.webp', '')}`;
    const dest1 = path.join(__dirname, 'public', 'images', filename);
    const dest2 = path.join('d:/My Data/Desktop Files/HR Fitness/public/images', filename);

    console.log(`Downloading ${filename}...`);
    let ok = await downloadFile(liveUrl, dest1);
    if (!ok) {
      // Try searching via live page
      ok = await downloadFile(`https://go180.nl/images/${filename}`, dest1);
    }
    if (ok) {
      if (fs.existsSync(path.dirname(dest2))) fs.copyFileSync(dest1, dest2);
      console.log(`  Successfully downloaded ${filename}`);
    } else {
      console.log(`  Failed to download ${filename} directly`);
    }
  }

  await browser.close();
})();
