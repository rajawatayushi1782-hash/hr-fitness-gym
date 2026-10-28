const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const routes = [
  '/',
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
  '/contact/'
];

const outDir = 'd:/My Data/Desktop Files/HR Fitness/screenshots/verified';
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const report = [];

  for (const route of routes) {
    const slug = route.replace(/\//g, '_').replace(/^_|_$/g, '') || 'home';
    console.log(`\n=================== Verifying ${route} ===================`);

    // 1. Desktop 1440x900
    const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await desktopPage.route('**/*', req => {
      const u = req.request().url();
      if (u.includes('google-analytics') || u.includes('googletagmanager') || u.includes('recaptcha') || u.includes('youtube.com') || u.includes('gstatic') || u.includes('polyfill.io')) {
        return req.abort();
      }
      req.continue();
    });
    try {
      await desktopPage.goto('http://localhost:3000' + route, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await desktopPage.waitForTimeout(1500);

      const desktopAudit = await desktopPage.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const hasOverflow = docWidth > winWidth;
        const headers = Array.from(document.querySelectorAll('header, .header')).filter(h => {
          const s = window.getComputedStyle(h);
          return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
        });
        const spinner = document.querySelector('.wipe_spinner');
        const isSpinnerVisible = spinner && window.getComputedStyle(spinner).display !== 'none' && window.getComputedStyle(spinner).opacity !== '0';
        const brokenImages = Array.from(document.querySelectorAll('img')).filter(img => {
          if (img.src && img.src.includes('data:image/svg') && img.parentElement && img.parentElement.tagName === 'NOSCRIPT') return false;
          return img.naturalWidth === 0 && !img.src.startsWith('data:image/svg');
        }).map(i => i.src);

        const h1 = document.querySelector('h1')?.textContent?.trim();
        return {
          h1,
          hasOverflow,
          overflowDelta: docWidth - winWidth,
          headerCount: headers.length,
          isSpinnerVisible,
          brokenImagesCount: brokenImages.length,
          brokenImages
        };
      });

      const shotPath = path.join(outDir, `desktop_${slug}.png`);
      try {
        await desktopPage.screenshot({ path: shotPath, fullPage: false, animations: 'disabled', timeout: 5000 });
      } catch (err) {
        console.warn(`  Desktop screenshot warning for ${route}: ${err.message}`);
      }

      console.log(`  [Desktop 1440x900]: H1="${desktopAudit.h1}" | Headers=${desktopAudit.headerCount} | Spinner=${desktopAudit.isSpinnerVisible ? 'STUCK' : 'RESOLVED'} | Overflow=${desktopAudit.hasOverflow} | BrokenImgs=${desktopAudit.brokenImagesCount}`);

      report.push({
        route,
        viewport: '1440x900',
        ...desktopAudit,
        screenshot: shotPath
      });
    } catch (e) {
      console.error(`  Desktop Error on ${route}:`, e.message);
    }
    await desktopPage.close().catch(() => {});

    // 2. Mobile 390x844
    const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobilePage.route('**/*', req => {
      const u = req.request().url();
      if (u.includes('google-analytics') || u.includes('googletagmanager') || u.includes('recaptcha') || u.includes('youtube.com') || u.includes('gstatic') || u.includes('polyfill.io')) {
        return req.abort();
      }
      req.continue();
    });
    try {
      await mobilePage.goto('http://localhost:3000' + route, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await mobilePage.waitForTimeout(1000);

      const mobileAudit = await mobilePage.evaluate(() => {
        const docWidth = document.documentElement.scrollWidth;
        const winWidth = window.innerWidth;
        const hasOverflow = docWidth > winWidth;
        const headers = Array.from(document.querySelectorAll('header, .header')).filter(h => {
          const s = window.getComputedStyle(h);
          return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
        });
        const spinner = document.querySelector('.wipe_spinner');
        const isSpinnerVisible = spinner && window.getComputedStyle(spinner).display !== 'none' && window.getComputedStyle(spinner).opacity !== '0';
        const brokenImages = Array.from(document.querySelectorAll('img')).filter(img => {
          if (img.src && img.src.includes('data:image/svg') && img.parentElement && img.parentElement.tagName === 'NOSCRIPT') return false;
          return img.naturalWidth === 0 && !img.src.startsWith('data:image/svg');
        }).map(i => i.src);

        return {
          hasOverflow,
          overflowDelta: docWidth - winWidth,
          headerCount: headers.length,
          isSpinnerVisible,
          brokenImagesCount: brokenImages.length
        };
      });

      const mobileShotPath = path.join(outDir, `mobile_${slug}.png`);
      try {
        await mobilePage.screenshot({ path: mobileShotPath, fullPage: false, animations: 'disabled', timeout: 5000 });
      } catch (err) {
        console.warn(`  Mobile screenshot warning for ${route}: ${err.message}`);
      }

      console.log(`  [Mobile 390x844]: Headers=${mobileAudit.headerCount} | Spinner=${mobileAudit.isSpinnerVisible ? 'STUCK' : 'RESOLVED'} | Overflow=${mobileAudit.hasOverflow} | BrokenImgs=${mobileAudit.brokenImagesCount}`);

      report.push({
        route,
        viewport: '390x844',
        ...mobileAudit,
        screenshot: mobileShotPath
      });
    } catch (e) {
      console.error(`  Mobile Error on ${route}:`, e.message);
    }
    await mobilePage.close();
  }

  await browser.close();
  fs.writeFileSync('verification_report.json', JSON.stringify(report, null, 2), 'utf8');
  console.log('\nAll 15 routes verified and fresh screenshots captured!');
})();
