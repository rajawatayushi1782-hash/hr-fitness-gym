const { chromium } = require('playwright');
const fs = require('fs');

const routes = [
  '/',
  '/we-are-go180/',
  '/clubs/leeuwarden/',
  '/programs/',
  '/programs/essentials/',
  '/programs/fundamentals/',
  '/programs/go2gether/',
  '/programs/go2day/',
  '/programs/hyrox/',
  '/programs/healthy-ageing/',
  '/programs/adaptable/',
  '/programs/digital-coaching/',
  '/coaches/',
  '/coaches/hielke-van-der-lei/',
  '/coaches/arjon-van-der-wal/',
  '/coaches/annick-douma/',
  '/coaches/appie-kooistra/',
  '/coaches/hielke-feenstra/',
  '/coaches/thomas-kramer/',
  '/pricing/',
  '/stories/',
  '/story/wat-zijn-de-kenmerken-van-een-gezonde-leefstijl/',
  '/story/waarom-doet-een-dieetcoach-meer-dan-een-voedingsschema-maken/',
  '/story/is-krachttraining-voor-kinderen-slecht-voor-de-groei/',
  '/story/sportschool-intake/',
  '/story/ik-durf-niet-naar-de-sportschool-hoe-kom-je-over-die-drempel-heen/',
  '/story/waarom-stop-ik-steeds-met-sporten/',
  '/story/beste-glute-oefeningen/',
  '/story/hoe-begin-je-weer-met-sporten-na-een-lange-pauze/',
  '/story/teambuilding-in-leeuwarden-ontdek-de-kracht-van-samen-sporten-bij-go180/',
  '/story/hoe-blijf-je-gezond-met-een-drukke-baan/',
  '/free-trial/',
  '/join-now/',
  '/contact/',
  '/algemene-voorwaarden/',
  '/privacy-policy/',
  '/disclaimer/'
];

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  const report = [];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const resp = await page.goto('http://localhost:3000' + route, { waitUntil: 'domcontentloaded' });
    const status = resp ? resp.status() : 0;
    const title = await page.title();
    const h1 = await page.evaluate(() => {
      const el = document.querySelector('h1');
      return el ? el.innerText.replace(/[\r\n]+/g, ' ').trim() : 'NO H1';
    });
    const body = await page.evaluate(() => document.body.innerText);
    const corrupted = [];
    if (body.includes('Byouild')) corrupted.push('Byouild');
    if (body.includes('tOmOrrOw')) corruptedFound.push('tOmOrrOw');
    if (body.includes('yOur')) corruptedFound.push('yOur');

    report.push({
      route,
      status,
      title,
      h1,
      heroMatch: route === '/' ? (h1 === 'Build Your Tomorrow') : true,
      corrupted: corrupted.length > 0 ? corrupted : 'NONE'
    });
  }

  fs.writeFileSync('playwright_final_audit.json', JSON.stringify(report, null, 2), 'utf8');
  console.log(`Audited all ${report.length} routes. Report written to playwright_final_audit.json`);
  await browser.close();
})();
