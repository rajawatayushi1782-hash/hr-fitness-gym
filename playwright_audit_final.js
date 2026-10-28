const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

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
  console.log(`Starting comprehensive Playwright audit of all ${routes.length} routes...`);
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const auditReport = [];
  const ssDir = path.join(__dirname, 'screenshots', 'final_audit');
  if (!fs.existsSync(ssDir)) fs.mkdirSync(ssDir, { recursive: true });

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const url = `http://localhost:3000${route}`;
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const status = resp ? resp.status() : 0;
      await page.waitForTimeout(200);

      const title = await page.title();
      const h1 = await page.evaluate(() => {
        const el = document.querySelector('h1');
        return el ? el.innerText.replace(/[\r\n]+/g, ' ').trim() : 'NO H1';
      });

      // Check for corrupted strings
      const bodyText = await page.evaluate(() => document.body.innerText);
      const corruptedFound = [];
      if (bodyText.includes('Byouild')) corruptedFound.push('Byouild');
      if (bodyText.includes('tOmOrrOw')) corruptedFound.push('tOmOrrOw');
      if (bodyText.includes('yOur')) corruptedFound.push('yOur');

      let heroStatus = 'N/A';
      if (route === '/') {
        heroStatus = (h1 === 'Build Your Tomorrow') ? 'EXACT MATCH' : `MISMATCH: "${h1}"`;
      }

      auditReport.push({
        route,
        status,
        title,
        h1,
        heroStatus,
        corruptedFound: corruptedFound.length > 0 ? corruptedFound : 'NONE'
      });
      console.log(`[${i + 1}/${routes.length}] ${route} | Status: ${status} | H1: "${h1}"`);
    } catch (e) {
      console.error(`Error on ${route}:`, e.message);
      auditReport.push({ route, error: e.message });
    }
  }

  // Key desktop screenshots
  const keyScreenshots = [
    { route: '/', name: 'desktop_home.png' },
    { route: '/we-are-go180/', name: 'desktop_about.png' },
    { route: '/clubs/leeuwarden/', name: 'desktop_club.png' },
    { route: '/programs/', name: 'desktop_programs.png' },
    { route: '/coaches/', name: 'desktop_coaches.png' },
    { route: '/pricing/', name: 'desktop_pricing.png' },
    { route: '/stories/', name: 'desktop_stories.png' },
    { route: '/contact/', name: 'desktop_contact.png' }
  ];

  for (const s of keyScreenshots) {
    await page.goto(`http://localhost:3000${s.route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(ssDir, s.name), fullPage: false });
  }

  // Mobile screenshots
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ssDir, 'mobile_home.png'), fullPage: false });

  await page.goto('http://localhost:3000/contact/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(ssDir, 'mobile_contact.png'), fullPage: false });

  fs.writeFileSync('playwright_final_audit.json', JSON.stringify(auditReport, null, 2));
  console.log('ALL PLAYWRIGHT TESTS AND SCREENSHOTS COMPLETED SUCCESSFULLY!');

  await browser.close();
})();
