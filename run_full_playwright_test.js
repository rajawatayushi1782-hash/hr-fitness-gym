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
  console.log(`Starting Playwright test of all ${routes.length} routes...`);
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const results = [];
  const ssDir = path.join(__dirname, 'screenshots', 'final_verified');
  if (!fs.existsSync(ssDir)) fs.mkdirSync(ssDir, { recursive: true });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const url = `http://localhost:3000${route}`;
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
      const status = resp ? resp.status() : 0;
      await page.waitForTimeout(500);

      // Scroll to trigger any lazyloading/locomotive elements
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
      await page.waitForTimeout(300);
      await page.evaluate(() => window.scrollTo(0, 0));

      const pageTitle = await page.title();
      const h1Text = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? h1.innerText.replace(/[\r\n]+/g, ' ').trim() : 'NO H1';
      });

      // Check for any corrupted strings
      const bodyText = await page.evaluate(() => document.body.innerText);
      const corruptHits = [];
      ['byouild', 'tomorrow', 'your'].forEach(w => {
        if (bodyText.includes('Byouild') || bodyText.includes('tOmOrrOw') || bodyText.includes('yOur')) {
          corruptHits.push('Corrupted text found: ' + w);
        }
      });

      // Capture screenshots for key representative pages
      const safeName = route === '/' ? 'home' : route.replace(/\//g, '_').replace(/^_|_$/g, '');
      const keyPages = ['home', 'we-are-go180', 'clubs_leeuwarden', 'programs', 'coaches', 'pricing', 'stories', 'contact'];
      if (keyPages.includes(safeName)) {
        await page.screenshot({ path: path.join(ssDir, `${safeName}_desktop.png`), fullPage: false });
      }

      results.push({
        route,
        status,
        pageTitle,
        h1Text,
        corruptHits: corruptHits.length > 0 ? corruptHits : 'NONE'
      });
      console.log(`[${i + 1}/${routes.length}] OK (${status}) - Route: ${route} | H1: "${h1Text}"`);
    } catch (err) {
      console.error(`[${i + 1}/${routes.length}] ERROR on ${route}:`, err.message);
      results.push({ route, error: err.message });
    }
  }

  // Mobile layout test for Home and Contact
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  const mobileHeroH1 = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? h1.innerText.replace(/[\r\n]+/g, ' ').trim() : 'NO H1';
  });
  await page.screenshot({ path: path.join(ssDir, 'home_mobile.png'), fullPage: false });
  console.log(`Mobile Home H1: "${mobileHeroH1}"`);

  fs.writeFileSync('final_test_results.json', JSON.stringify({ routesAudited: results.length, consoleErrorsCount: consoleErrors.length, results }, null, 2));
  console.log(`\nPlaywright test finished! Audited ${results.length} routes. All results saved to final_test_results.json`);

  await browser.close();
})();
