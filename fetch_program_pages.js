const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const programPages = [
  { route: '/programs/fundamentals/', file: 'programs-fundamentals.html' },
  { route: '/programs/go2gether/', file: 'programs-go2gether.html' },
  { route: '/programs/adaptable/', file: 'programs-adaptable.html' },
  { route: '/programs/digital-coaching/', file: 'programs-digital-coaching.html' },
  { route: '/programs/healthy-ageing/', file: 'programs-healthy-ageing.html' },
  { route: '/programs/go2day/', file: 'programs-go2day.html' },
  { route: '/programs/hyrox/', file: 'programs-hyrox.html' }
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const prog of programPages) {
    console.log(`Fetching https://go180.nl${prog.route} ...`);
    await page.goto('https://go180.nl' + prog.route, { waitUntil: 'domcontentloaded', timeout: 35000 });
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

    const out1 = path.join(__dirname, 'public', 'pages', prog.file);
    const out2 = path.join('d:/My Data/Desktop Files/HR Fitness/public/pages', prog.file);
    fs.writeFileSync(out1, html, 'utf-8');
    if (fs.existsSync(path.dirname(out2))) {
      fs.writeFileSync(out2, html, 'utf-8');
    }
    console.log(`Saved ${prog.file} (${html.length} bytes)`);
  }

  await browser.close();
  console.log('All program detail pages fetch complete.');
})();
