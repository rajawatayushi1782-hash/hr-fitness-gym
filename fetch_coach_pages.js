const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const coachPages = [
  { route: '/coaches/appie-kooistra/', file: 'coach-appie-kooistra.html' },
  { route: '/coaches/thomas-kramer/', file: 'coach-thomas-kramer.html' },
  { route: '/coaches/hielke-feenstra/', file: 'coach-hielke-feenstra.html' },
  { route: '/coaches/arjon-van-der-wal/', file: 'coach-arjon-van-der-wal.html' },
  { route: '/coaches/hielke-van-der-lei/', file: 'coach-hielke-van-der-lei.html' },
  { route: '/coaches/annick-douma/', file: 'coach-annick-douma.html' }
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const c of coachPages) {
    console.log(`Fetching https://go180.nl${c.route} ...`);
    await page.goto('https://go180.nl' + c.route, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(3000);

    let html = await page.content();
    // Normalize links and asset paths to local
    html = html.replace(/https:\/\/go180\.nl\/app\/themes\/go180\/assets\/css\/main\.css[^\"]*/g, '/css/main.css');
    html = html.replace(/https:\/\/go180\.nl\/app\/themes\/go180\/assets\/js\/main\.js[^\"]*/g, '/app/themes/go180/assets/js/main.js');
    html = html.replace(/https:\/\/go180\.nl\/wp\/wp-includes\/js\/jquery\/jquery\.min\.js[^\"]*/g, '/wp/wp-includes/js/jquery/jquery.min.js');
    // Normalize images: /app/smush-webp/... or /app/uploads/... to /images/...
    html = html.replace(/https:\/\/go180\.nl\/app\/(?:smush-webp|uploads)\/\d{4}\/\d{2}\/([^\"]+)/g, '/images/$1');
    html = html.replace(/\/app\/(?:smush-webp|uploads)\/\d{4}\/\d{2}\/([^\"]+)/g, '/images/$1');
    html = html.replace(/https:\/\/go180\.nl\//g, '/');

    const out1 = path.join(__dirname, 'public', 'pages', c.file);
    const out2 = path.join('d:/My Data/Desktop Files/HR Fitness/public/pages', c.file);
    fs.writeFileSync(out1, html, 'utf-8');
    if (fs.existsSync(path.dirname(out2))) {
      fs.writeFileSync(out2, html, 'utf-8');
    }
    console.log(`Saved ${c.file} (${html.length} bytes)`);
  }

  await browser.close();
  console.log('All coach detail pages fetch complete.');
})();
