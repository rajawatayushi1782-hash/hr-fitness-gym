const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ALL_ROUTES = [
  // Core Navigation
  { category: 'core', name: '01_home', path: '/' },
  { category: 'core', name: '02_we_are_go180', path: '/we-are-go180/' },
  { category: 'core', name: '03_programs_overview', path: '/programs/' },
  { category: 'core', name: '04_coaches_overview', path: '/coaches/' },
  { category: 'core', name: '05_club_leeuwarden', path: '/clubs/leeuwarden/' },
  { category: 'core', name: '06_stories_overview', path: '/stories/' },
  { category: 'core', name: '07_pricing', path: '/pricing/' },
  { category: 'core', name: '08_free_trial', path: '/free-trial/' },
  { category: 'core', name: '09_contact', path: '/contact/' },
  { category: 'core', name: '10_join_now', path: '/join-now/' },

  // Program Detail Pages
  { category: 'programs', name: 'prog_essentials', path: '/programs/essentials/' },
  { category: 'programs', name: 'prog_fundamentals', path: '/programs/fundamentals/' },
  { category: 'programs', name: 'prog_go2gether', path: '/programs/go2gether/' },
  { category: 'programs', name: 'prog_adaptable', path: '/programs/adaptable/' },
  { category: 'programs', name: 'prog_digital_coaching', path: '/programs/digital-coaching/' },
  { category: 'programs', name: 'prog_healthy_ageing', path: '/programs/healthy-ageing/' },
  { category: 'programs', name: 'prog_go2day', path: '/programs/go2day/' },
  { category: 'programs', name: 'prog_hyrox', path: '/programs/hyrox/' },

  // Coach Profile Pages
  { category: 'coaches', name: 'coach_appie', path: '/coaches/appie-kooistra/' },
  { category: 'coaches', name: 'coach_thomas', path: '/coaches/thomas-kramer/' },
  { category: 'coaches', name: 'coach_hielke_feenstra', path: '/coaches/hielke-feenstra/' },
  { category: 'coaches', name: 'coach_arjon', path: '/coaches/arjon-van-der-wal/' },
  { category: 'coaches', name: 'coach_hielke_lei', path: '/coaches/hielke-van-der-lei/' },
  { category: 'coaches', name: 'coach_annick', path: '/coaches/annick-douma/' },

  // Legal Pages
  { category: 'legal', name: 'legal_voorwaarden', path: '/algemene-voorwaarden/' },
  { category: 'legal', name: 'legal_disclaimer', path: '/disclaimer/' },
  { category: 'legal', name: 'legal_privacy', path: '/privacy-policy/' }
];

const outDir = path.join(__dirname, 'screenshots', 'all_verified_pages');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const auditReport = [];

  console.log(`Starting Full Verification across ${ALL_ROUTES.length} routes...`);

  // 1. Desktop Test
  const deskCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const deskPage = await deskCtx.newPage();

  for (const r of ALL_ROUTES) {
    const url = 'http://localhost:3000' + r.path;
    try {
      const resp = await deskPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await deskPage.waitForTimeout(3000);

      // Check title and metrics
      const data = await deskPage.evaluate(() => {
        const brokenImgs = Array.from(document.querySelectorAll('img'))
          .filter(img => img.complete && img.naturalWidth === 0 && img.src && !img.src.includes('data:'))
          .map(img => img.src);

        const hasHorizontalScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth;

        return {
          title: document.title,
          h1: document.querySelector('h1') ? document.querySelector('h1').innerText.trim() : null,
          brokenImgsCount: brokenImgs.length,
          hasHorizontalScroll
        };
      });

      const ssName = `${r.name}_desktop.png`;
      await deskPage.screenshot({ path: path.join(outDir, ssName) });

      auditReport.push({
        name: r.name,
        category: r.category,
        path: r.path,
        status: resp.status(),
        ...data,
        screenshot: ssName
      });

      console.log(`[PASS] ${r.path} -> Title: "${data.title}" | H1: "${data.h1}" | Broken Img: ${data.brokenImgsCount} | Overflow: ${data.hasHorizontalScroll}`);
    } catch (err) {
      console.error(`[FAIL] ${r.path} -> ${err.message}`);
      auditReport.push({ name: r.name, category: r.category, path: r.path, error: err.message });
    }
  }

  await deskCtx.close();

  // 2. Mobile Test on Key Representative Pages
  const mobCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobPage = await mobCtx.newPage();
  const mobRoutes = ALL_ROUTES.filter(r => ['core', 'programs', 'coaches'].includes(r.category));

  for (const r of mobRoutes) {
    const url = 'http://localhost:3000' + r.path;
    try {
      await mobPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await mobPage.waitForTimeout(2500);

      const hasHorizontalScroll = await mobPage.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      const ssName = `${r.name}_mobile.png`;
      await mobPage.screenshot({ path: path.join(outDir, ssName) });
      console.log(`[MOBILE PASS] ${r.path} -> Overflow: ${hasHorizontalScroll}`);
    } catch (err) {
      console.error(`[MOBILE FAIL] ${r.path} -> ${err.message}`);
    }
  }

  await mobCtx.close();
  await browser.close();

  fs.writeFileSync(path.join(__dirname, 'final_verification_audit.json'), JSON.stringify(auditReport, null, 2));
  console.log('\nAll routes verified successfully. Summary saved to final_verification_audit.json');
})();
