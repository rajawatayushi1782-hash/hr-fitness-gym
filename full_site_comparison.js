const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROUTES = [
  { name: '01_home', path: '/' },
  { name: '02_we_are_go180', path: '/we-are-go180/' },
  { name: '03_programs', path: '/programs/' },
  { name: '04_programs_essentials', path: '/programs/essentials/' },
  { name: '05_programs_fundamentals', path: '/programs/fundamentals/' },
  { name: '06_programs_go2gether', path: '/programs/go2gether/' },
  { name: '07_programs_adaptable', path: '/programs/adaptable/' },
  { name: '08_programs_digital_coaching', path: '/programs/digital-coaching/' },
  { name: '09_programs_healthy_ageing', path: '/programs/healthy-ageing/' },
  { name: '10_programs_go2day', path: '/programs/go2day/' },
  { name: '11_programs_hyrox', path: '/programs/hyrox/' },
  { name: '12_coaches', path: '/coaches/' },
  { name: '13_club_leeuwarden', path: '/clubs/leeuwarden/' },
  { name: '14_stories', path: '/stories/' },
  { name: '15_pricing', path: '/pricing/' },
  { name: '16_contact', path: '/contact/' },
  { name: '17_join_now', path: '/join-now/' },
  { name: '18_free_trial', path: '/free-trial/' },
  { name: '19_algemene_voorwaarden', path: '/algemene-voorwaarden/' },
  { name: '20_disclaimer', path: '/disclaimer/' },
  { name: '21_privacy_policy', path: '/privacy-policy/' }
];

async function runFullComparison() {
  const compDir = path.join(__dirname, 'screenshots', 'full_comparison');
  fs.mkdirSync(compDir, { recursive: true });

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const report = [];

  for (const r of ROUTES) {
    console.log(`\n========================================`);
    console.log(`Processing: ${r.name} (${r.path})`);
    console.log(`========================================`);

    // Desktop
    const deskLiveCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const deskRepCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const liveDeskPage = await deskLiveCtx.newPage();
    const repDeskPage = await deskRepCtx.newPage();

    const liveErrors = [];
    const repErrors = [];
    liveDeskPage.on('pageerror', e => liveErrors.push(e.message));
    repDeskPage.on('pageerror', e => repErrors.push(e.message));

    await Promise.all([
      liveDeskPage.goto(`https://go180.nl${r.path}`, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(e => console.log('Live desk load err:', e.message)),
      repDeskPage.goto(`http://localhost:3000${r.path}`, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(e => console.log('Rep desk load err:', e.message))
    ]);

    await liveDeskPage.waitForTimeout(4000);
    await repDeskPage.waitForTimeout(4000);

    // Dismiss any popup
    try { const p1 = await liveDeskPage.$('.pum-close'); if (p1) await p1.click(); } catch(e){}
    try { const p2 = await repDeskPage.$('.pum-close'); if (p2) await p2.click(); } catch(e){}

    const liveDeskSS = `${r.name}_desktop_live.png`;
    const repDeskSS = `${r.name}_desktop_replica.png`;
    await liveDeskPage.screenshot({ path: path.join(compDir, liveDeskSS) });
    await repDeskPage.screenshot({ path: path.join(compDir, repDeskSS) });
    console.log(`Captured Desktop: ${liveDeskSS} vs ${repDeskSS}`);

    // Mobile
    const mobLiveCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const mobRepCtx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const liveMobPage = await mobLiveCtx.newPage();
    const repMobPage = await mobRepCtx.newPage();

    await Promise.all([
      liveMobPage.goto(`https://go180.nl${r.path}`, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(e => console.log('Live mob load err:', e.message)),
      repMobPage.goto(`http://localhost:3000${r.path}`, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(e => console.log('Rep mob load err:', e.message))
    ]);

    await liveMobPage.waitForTimeout(3000);
    await repMobPage.waitForTimeout(3000);

    try { const p1 = await liveMobPage.$('.pum-close'); if (p1) await p1.click(); } catch(e){}
    try { const p2 = await repMobPage.$('.pum-close'); if (p2) await p2.click(); } catch(e){}

    const liveMobSS = `${r.name}_mobile_live.png`;
    const repMobSS = `${r.name}_mobile_replica.png`;
    await liveMobPage.screenshot({ path: path.join(compDir, liveMobSS) });
    await repMobPage.screenshot({ path: path.join(compDir, repMobSS) });
    console.log(`Captured Mobile: ${liveMobSS} vs ${repMobSS}`);

    report.push({
      route: r.name,
      path: r.path,
      liveErrors,
      repErrors,
      desktop: { live: liveDeskSS, replica: repDeskSS },
      mobile: { live: liveMobSS, replica: repMobSS }
    });

    await deskLiveCtx.close();
    await deskRepCtx.close();
    await mobLiveCtx.close();
    await mobRepCtx.close();
  }

  await browser.close();

  fs.writeFileSync(path.join(__dirname, 'all_pages_comparison_final.json'), JSON.stringify(report, null, 2));
  console.log('\nFull comparison run complete. Report saved to all_pages_comparison_final.json');
}

runFullComparison().catch(console.error);
