const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const legalPages = [
  { route: '/algemene-voorwaarden/', file: 'algemene-voorwaarden.html' },
  { route: '/disclaimer/', file: 'disclaimer.html' },
  { route: '/privacy-policy/', file: 'privacy-policy.html' }
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const lp of legalPages) {
    console.log(`Fetching https://go180.nl${lp.route} ...`);
    await page.goto('https://go180.nl' + lp.route, { waitUntil: 'domcontentloaded', timeout: 35000 });
    await page.waitForTimeout(3000);

    let html = await page.content();
    // Normalize links and asset paths to local
    html = html.replace(/https:\/\/go180\.nl\/app\/themes\/go180\/assets\/css\/main\.css[^\"]*/g, '/css/main.css');
    html = html.replace(/https:\/\/go180\.nl\/app\/themes\/go180\/assets\/js\/main\.js[^\"]*/g, '/app/themes/go180/assets/js/main.js');
    html = html.replace(/https:\/\/go180\.nl\/wp\/wp-includes\/js\/jquery\/jquery\.min\.js[^\"]*/g, '/wp/wp-includes/js/jquery/jquery.min.js');
    html = html.replace(/https:\/\/go180\.nl\//g, '/');

    const out1 = path.join(__dirname, 'public', 'pages', lp.file);
    const out2 = path.join('d:/My Data/Desktop Files/HR Fitness/public/pages', lp.file);
    fs.writeFileSync(out1, html, 'utf-8');
    if (fs.existsSync(path.dirname(out2))) {
      fs.writeFileSync(out2, html, 'utf-8');
    }
    console.log(`Saved ${lp.file} (${html.length} bytes)`);
  }

  await browser.close();
  console.log('Legal pages fetch complete.');
})();
