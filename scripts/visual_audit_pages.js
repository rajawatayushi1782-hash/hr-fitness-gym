const { chromium } = require('playwright');
const fs = require('fs');

async function auditPages() {
  const browser = await chromium.launch();

  const testRoutes = [
    { url: 'http://localhost:3001/', name: 'home_mobile', vp: { width: 390, height: 844 } },
    { url: 'http://localhost:3001/', name: 'home_desktop', vp: { width: 1440, height: 900 } },
    { url: 'http://localhost:3001/coaches/', name: 'coaches_desktop', vp: { width: 1440, height: 900 } },
    { url: 'http://localhost:3001/programs/', name: 'programs_desktop', vp: { width: 1440, height: 900 } },
    { url: 'http://localhost:3001/club/leeuwarden/', name: 'club_desktop', vp: { width: 1440, height: 900 } },
    { url: 'http://localhost:3001/stories/', name: 'stories_desktop', vp: { width: 1440, height: 900 } }
  ];

  for (const t of testRoutes) {
    const page = await browser.newPage({ viewport: t.vp });
    await page.goto(t.url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const imgAudit = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src || img.getAttribute('data-src'),
        loaded: img.complete && img.naturalWidth > 0,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: img.clientWidth,
        displayHeight: img.clientHeight
      }));
    });

    const failedImgs = imgAudit.filter(i => !i.loaded && !i.src.includes('avatar-placeholder'));
    console.log(`[${t.name}] Total images: ${imgAudit.length}, Failed to load: ${failedImgs.length}`);
    if (failedImgs.length > 0) {
      console.warn('Failed images:', failedImgs);
    }

    await page.screenshot({ path: `audit_${t.name}.png` });
    await page.close();
  }

  await browser.close();
  console.log('Visual audit finished successfully!');
}

auditPages().catch(console.error);
