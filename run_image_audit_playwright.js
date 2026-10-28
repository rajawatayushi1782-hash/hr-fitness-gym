const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const routes = [
  { name: 'home', path: '/' },
  { name: 'facilities', path: '/club-leeuwarden/' },
  { name: 'coaches', path: '/coaches/' },
  { name: 'programs', path: '/programs/' },
  { name: 'pricing', path: '/pricing/' },
  { name: 'contact', path: '/contact/' },
  { name: 'glute_exercises', path: '/stories/beste-glute-oefeningen/' },
  { name: 'free_trial', path: '/free-trial/' }
];
const viewports = [
  { name: 'desktop_1440x900', width: 1440, height: 900 },
  { name: 'laptop_1280x800', width: 1280, height: 800 },
  { name: 'tablet_768x1024', width: 768, height: 1024 },
  { name: 'mobile_430x932', width: 430, height: 932 },
  { name: 'mobile_390x844', width: 390, height: 844 },
  { name: 'mobile_375x812', width: 375, height: 812 }
];
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const screenshotDir = path.join(__dirname, 'screenshots', 'image_audit_final');
  const results = [];
  for (const vp of viewports) {
    console.log('Testing Viewport: ' + vp.name);
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    for (const r of routes) {
      const failed = [];
      page.on('response', res => {
        if (res.status() >= 400 && res.url().includes('localhost')) failed.push(res.url());
      });
      const url = 'http://localhost:3000' + r.path;
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForTimeout(600);
        const stats = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll('img'));
          return imgs.map(i => ({
            src: i.currentSrc || i.src,
            nw: i.naturalWidth,
            nh: i.naturalHeight,
            zero: i.naturalWidth === 0 && !i.src.includes('avatar-placeholder') && !i.src.includes('.svg')
          }));
        });
        const broken = stats.filter(s => s.zero);
        const shot = r.name + '_' + vp.name + '.png';
        await page.screenshot({ path: path.join(screenshotDir, shot), fullPage: false });
        results.push({ vp: vp.name, route: r.path, total: stats.length, broken: broken.length, failedReqs: failed.length });
        console.log('  ' + r.path + ': ' + stats.length + ' imgs | broken: ' + broken.length + ' | 404s: ' + failed.length);
      } catch(err) {
        console.log('  Error on ' + r.path + ': ' + err.message);
      }
    }
    await context.close();
  }
  await browser.close();
  fs.writeFileSync('final_verification_report.json', JSON.stringify(results, null, 2));
  console.log('Testing complete!');
})();