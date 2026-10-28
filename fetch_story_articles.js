const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const stories = [
  'wat-zijn-de-kenmerken-van-een-gezonde-leefstijl',
  'waarom-doet-een-dieetcoach-meer-dan-een-voedingsschema-maken',
  'is-krachttraining-voor-kinderen-slecht-voor-de-groei',
  'sportschool-intake',
  'ik-durf-niet-naar-de-sportschool-hoe-kom-je-over-die-drempel-heen',
  'waarom-stop-ik-steeds-met-sporten',
  'beste-glute-oefeningen',
  'hoe-begin-je-weer-met-sporten-na-een-lange-pauze',
  'teambuilding-in-leeuwarden-ontdek-de-kracht-van-samen-sporten-bij-go180',
  'hoe-blijf-je-gezond-met-een-drukke-baan'
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const slug of stories) {
    const route = `/stories/${slug}/`;
    const filename = `story-${slug}.html`;
    console.log(`Fetching https://go180.nl${route} ...`);
    try {
      await page.goto('https://go180.nl' + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);

      let html = await page.content();
      html = html.replace(/https:\/\/go180\.nl\/app\/themes\/go180\/assets\/css\/main\.css[^\"]*/g, '/css/main.css');
      html = html.replace(/https:\/\/go180\.nl\/app\/themes\/go180\/assets\/js\/main\.js[^\"]*/g, '/app/themes/go180/assets/js/main.js');
      html = html.replace(/https:\/\/go180\.nl\/wp\/wp-includes\/js\/jquery\/jquery\.min\.js[^\"]*/g, '/wp/wp-includes/js/jquery/jquery.min.js');
      html = html.replace(/https:\/\/go180\.nl\/app\/(?:smush-webp|uploads)\/\d{4}\/\d{2}\/([^\"]+)/g, '/images/$1');
      html = html.replace(/\/app\/(?:smush-webp|uploads)\/\d{4}\/\d{2}\/([^\"]+)/g, '/images/$1');
      html = html.replace(/https:\/\/go180\.nl\//g, '/');

      const out1 = path.join(__dirname, 'public', 'pages', filename);
      const out2 = path.join('d:/My Data/Desktop Files/HR Fitness/public/pages', filename);
      fs.writeFileSync(out1, html, 'utf-8');
      if (fs.existsSync(path.dirname(out2))) {
        fs.writeFileSync(out2, html, 'utf-8');
      }
      console.log(`Saved ${filename} (${html.length} bytes)`);
    } catch (e) {
      console.error(`Failed ${slug}:`, e.message);
    }
  }

  await browser.close();
  console.log('Story articles fetch complete.');
})();
