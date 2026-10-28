const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const routes = [
  { name: 'home', path: '/' },
  { name: 'programs', path: '/programs/' },
  { name: 'programs_essentials', path: '/programs/essentials/' },
  { name: 'we_are_go180', path: '/we-are-go180/' },
  { name: 'coaches', path: '/coaches/' },
  { name: 'club_leeuwarden', path: '/clubs/leeuwarden/' },
  { name: 'stories', path: '/stories/' },
  { name: 'pricing', path: '/pricing/' },
  { name: 'contact', path: '/contact/' },
  { name: 'free_trial', path: '/free-trial/' },
  { name: 'join_now', path: '/join-now/' }
];

const outDir = path.join(__dirname, 'screenshots', 'audit_side_by_side');
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const auditReport = [];

  for (const r of routes) {
    console.log(`\n========================================`);
    console.log(`Auditing Route: ${r.name} (${r.path})`);
    console.log(`========================================`);

    // Audit Desktop
    const livePage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const repPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });

    const liveErrors = [];
    const repErrors = [];
    livePage.on('pageerror', err => liveErrors.push(err.message));
    repPage.on('pageerror', err => repErrors.push(err.message));

    const repFailedRequests = [];
    repPage.on('requestfailed', req => repFailedRequests.push({ url: req.url(), failure: req.failure() }));

    // 1. Live page load
    try {
      console.log(`  Loading live: https://go180.nl${r.path}`);
      await livePage.goto(`https://go180.nl${r.path}`, { waitUntil: 'load', timeout: 35000 });
      await livePage.waitForTimeout(3000);
      try { const p = await livePage.$('.pum-close'); if (p) await p.click(); } catch(e){}
    } catch (e) {
      console.log(`  Live load warning: ${e.message}`);
    }

    // 2. Replica page load
    try {
      console.log(`  Loading replica: http://localhost:3000${r.path}`);
      await repPage.goto(`http://localhost:3000${r.path}`, { waitUntil: 'load', timeout: 15000 });
      await repPage.waitForTimeout(4000); // Allow wipe animation to complete
    } catch (e) {
      console.log(`  Replica load warning: ${e.message}`);
    }

    // Capture desktop screenshots
    const liveSsDesktop = path.join(outDir, `${r.name}_desktop_live.png`);
    const repSsDesktop = path.join(outDir, `${r.name}_desktop_replica.png`);
    try { await livePage.screenshot({ path: liveSsDesktop }); } catch(e){}
    try { await repPage.screenshot({ path: repSsDesktop }); } catch(e){}

    // Audit DOM elements comparison
    const comparison = await repPage.evaluate(async (routePath) => {
      const repTitle = document.title;
      const repH1s = Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim());
      const repH2s = Array.from(document.querySelectorAll('h2')).map(h => h.innerText.trim());
      const repImgs = Array.from(document.querySelectorAll('img')).map(i => ({
        src: i.getAttribute('src'),
        dataSrc: i.getAttribute('data-src'),
        alt: i.alt,
        complete: i.complete,
        naturalWidth: i.naturalWidth,
        naturalHeight: i.naturalHeight,
        displayWidth: i.clientWidth,
        displayHeight: i.clientHeight
      }));
      const repBrokenImgs = repImgs.filter(i => i.src && !i.src.startsWith('data:') && i.naturalWidth === 0);
      const repLinks = Array.from(document.querySelectorAll('a')).map(a => ({
        href: a.getAttribute('href'),
        text: a.innerText.trim()
      })).filter(a => a.href && a.href !== '#' && !a.href.startsWith('javascript:'));

      const hasScrollContainer = !!document.querySelector('#js-scroll');
      const isWipeHidden = !document.querySelector('.wipe') || window.getComputedStyle(document.querySelector('.wipe')).opacity === '0';

      return {
        repTitle,
        repH1s,
        repH2Count: repH2s.length,
        repTotalImgs: repImgs.length,
        repBrokenImgs,
        repLinksCount: repLinks.length,
        hasScrollContainer,
        isWipeHidden
      };
    }, r.path);

    console.log(`  Replica Title: ${comparison.repTitle}`);
    console.log(`  Replica H1s: ${JSON.stringify(comparison.repH1s)}`);
    console.log(`  Replica Images: ${comparison.repTotalImgs} (Broken: ${comparison.repBrokenImgs.length})`);
    console.log(`  Replica Errors: ${repErrors.length}`);
    console.log(`  Replica Failed Requests: ${repFailedRequests.length}`);
    if (comparison.repBrokenImgs.length > 0) {
      console.log('  BROKEN IMAGES:', comparison.repBrokenImgs);
    }
    if (repFailedRequests.length > 0) {
      console.log('  FAILED REQUESTS:', repFailedRequests.map(f => f.url));
    }

    await livePage.close();
    await repPage.close();

    // Audit Mobile
    const liveMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const repMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });

    try {
      await liveMobile.goto(`https://go180.nl${r.path}`, { waitUntil: 'load', timeout: 35000 });
      await liveMobile.waitForTimeout(3000);
      try { const p = await liveMobile.$('.pum-close'); if (p) await p.click(); } catch(e){}
    } catch(e){}

    try {
      await repMobile.goto(`http://localhost:3000${r.path}`, { waitUntil: 'load', timeout: 15000 });
      await repMobile.waitForTimeout(3500);
    } catch(e){}

    const liveSsMobile = path.join(outDir, `${r.name}_mobile_live.png`);
    const repSsMobile = path.join(outDir, `${r.name}_mobile_replica.png`);
    try { await liveMobile.screenshot({ path: liveSsMobile }); } catch(e){}
    try { await repMobile.screenshot({ path: repSsMobile }); } catch(e){}

    // Check mobile drawer and header
    const mobileCheck = await repMobile.evaluate(() => {
      const header = document.querySelector('.header');
      const hamburger = document.querySelector('.hamburger');
      const mobileMenu = document.querySelector('.mobile__menu');
      const desktopMenu = document.querySelector('.main__menu');
      return {
        headerVisible: !!header && window.getComputedStyle(header).display !== 'none',
        hamburgerVisible: !!hamburger && window.getComputedStyle(hamburger).display !== 'none',
        desktopMenuHidden: !desktopMenu || window.getComputedStyle(desktopMenu).display === 'none',
        mobileMenuHiddenInitially: !mobileMenu || !mobileMenu.classList.contains('-open')
      };
    });

    console.log(`  Mobile Header Check: DesktopMenuHidden=${mobileCheck.desktopMenuHidden}, HamburgerVisible=${mobileCheck.hamburgerVisible}`);

    await liveMobile.close();
    await repMobile.close();

    auditReport.push({
      route: r.name,
      path: r.path,
      comparison,
      mobileCheck,
      repErrors,
      repFailedRequests
    });
  }

  fs.writeFileSync(path.join(outDir, 'audit_report.json'), JSON.stringify(auditReport, null, 2));
  console.log('\n========================================');
  console.log('Audit completed! Report saved to audit_report.json');
  console.log('========================================');

  await browser.close();
})();
