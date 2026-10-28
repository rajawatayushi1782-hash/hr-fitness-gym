const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const targetPages = [
  '/programs/',
  '/programs/essentials/',
  '/programs/fundamentals/',
  '/programs/go2gether/',
  '/programs/adaptable/',
  '/programs/digital-coaching/',
  '/programs/healthy-ageing/',
  '/programs/go2day/',
  '/programs/hyrox/',
  '/coaches/',
  '/clubs/leeuwarden/',
  '/stories/',
  '/pricing/',
  '/free-trial/',
  '/contact/',
  '/we-are-go180/',
  '/join-now/'
];

// Use D: drive where there is 78 GB free space
const outDir = 'd:/My Data/Desktop Files/HR Fitness/screenshots/deep_audit';
fs.mkdirSync(outDir, { recursive: true });

async function inspectPage(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.evaluate(() => {
    // Remove cookie banner or wipe if present
    document.querySelectorAll('#cookie-law-info-bar, .cli-modal, .cookie-banner, .wipe, .wipe_spinner').forEach(el => el.remove());
    document.body.style.opacity = '1';
    document.body.style.visibility = 'visible';
  });
  await page.waitForTimeout(1500);

  return await page.evaluate(() => {
    const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim()).filter(Boolean);
    const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim()).filter(Boolean);
    const sections = Array.from(document.querySelectorAll('section, main > div, div[data-scroll-section]')).map(s => s.className || s.tagName);
    const imgCount = document.querySelectorAll('img').length;
    const bodyHeight = document.body.scrollHeight;
    const formCount = document.querySelectorAll('form').length;
    const inputCount = document.querySelectorAll('input, select, textarea').length;
    return {
      title: document.title,
      h1s,
      h2s: h2s.slice(0, 10),
      sectionCount: sections.length,
      imgCount,
      bodyHeight,
      formCount,
      inputCount
    };
  });
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const livePage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const localPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const auditReport = [];

  for (const route of targetPages) {
    console.log(`\n================ Inspecting ${route} ================`);
    const liveUrl = 'https://go180.nl' + route;
    const localUrl = 'http://localhost:3000' + route;

    let liveData = null;
    let localData = null;

    try {
      console.log(`Fetching LIVE: ${liveUrl}`);
      liveData = await inspectPage(livePage, liveUrl);
    } catch (e) {
      console.error(`Live fetch failed for ${route}:`, e.message);
    }

    try {
      console.log(`Fetching LOCAL: ${localUrl}`);
      localData = await inspectPage(localPage, localUrl);
    } catch (e) {
      console.error(`Local fetch failed for ${route}:`, e.message);
    }

    // Save screenshots on D: drive
    const safeName = route.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home';
    if (liveData) {
      const liveShot = path.join(outDir, `live_${safeName}.png`);
      await livePage.screenshot({ path: liveShot, fullPage: false });
    }
    if (localData) {
      const localShot = path.join(outDir, `local_${safeName}.png`);
      await localPage.screenshot({ path: localShot, fullPage: false });
    }

    const comparison = {
      route,
      matchH1: JSON.stringify(liveData?.h1s) === JSON.stringify(localData?.h1s),
      liveH1: liveData?.h1s,
      localH1: localData?.h1s,
      liveH2Count: liveData?.h2s?.length || 0,
      localH2Count: localData?.h2s?.length || 0,
      liveImgCount: liveData?.imgCount || 0,
      localImgCount: localData?.imgCount || 0,
      liveFormCount: liveData?.formCount || 0,
      localFormCount: localData?.formCount || 0,
      liveHeight: liveData?.bodyHeight || 0,
      localHeight: localData?.bodyHeight || 0,
      liveTitle: liveData?.title || '',
      localTitle: localData?.title || ''
    };

    console.log(`Result for ${route}:`);
    console.log(`  H1 match: ${comparison.matchH1} (Live: "${comparison.liveH1?.[0] || ''}" | Local: "${comparison.localH1?.[0] || ''}")`);
    console.log(`  Images: Live ${comparison.liveImgCount} vs Local ${comparison.localImgCount}`);
    console.log(`  Forms: Live ${comparison.liveFormCount} vs Local ${comparison.localFormCount}`);
    console.log(`  Height: Live ${comparison.liveHeight}px vs Local ${comparison.localHeight}px`);

    auditReport.push(comparison);
  }

  const reportPath = path.join(outDir, 'audit_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(auditReport, null, 2));
  console.log(`\nAudit complete! Saved report to ${reportPath}`);

  await browser.close();
})();
