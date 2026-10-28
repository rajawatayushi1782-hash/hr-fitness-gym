const { chromium } = require('playwright');

const routes = [
  '/',
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
  '/coaches/appie-kooistra/',
  '/coaches/thomas-kramer/',
  '/coaches/hielke-feenstra/',
  '/coaches/arjon-van-der-wal/',
  '/coaches/hielke-van-der-lei/',
  '/coaches/annick-douma/',
  '/we-are-go180/',
  '/pricing/',
  '/join-now/',
  '/clubs/leeuwarden/',
  '/stories/',
  '/contact/',
  '/free-trial/',
  '/algemene-voorwaarden/',
  '/disclaimer/',
  '/privacy-policy/'
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  
  console.log(`Starting comprehensive audit of ${routes.length} routes...`);
  
  let totalFailedImages = 0;
  let totalErrors = 0;
  const routeResults = [];

  for (const route of routes) {
    const failedImgs = [];
    const consoleErrors = [];

    page.on('response', (res) => {
      if (res.url().includes('localhost:3000') && res.status() === 404) {
        if (res.url().match(/\.(webp|jpg|jpeg|png|svg|gif|woff2?|ttf|css|js)/i)) {
          failedImgs.push(res.url());
        }
      }
    });

    page.on('pageerror', (err) => {
      consoleErrors.push(err.message);
    });

    try {
      const resp = await page.goto(`http://localhost:3000${route}`, {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });
      const status = resp.status();

      // wait 1s for any dynamically loaded content or wipe to initialize
      await page.waitForTimeout(1000);

      const title = await page.title();
      const bodyLength = await page.evaluate(() => document.body.innerHTML.length);
      const imgCount = await page.evaluate(() => document.querySelectorAll('img').length);

      routeResults.push({
        route,
        status,
        title,
        bodyLength,
        imgCount,
        failedImgsCount: failedImgs.length,
        failedImgs: failedImgs.slice(0, 5),
        errors: consoleErrors.length
      });

      if (failedImgs.length > 0) totalFailedImages += failedImgs.length;
      if (consoleErrors.length > 0) totalErrors += consoleErrors.length;

      console.log(`[${status}] ${route} | imgs: ${imgCount} | failed: ${failedImgs.length} | title: "${title.slice(0, 40)}"`);
      if (failedImgs.length > 0) {
        console.log(`  Failed assets on ${route}:`, failedImgs);
      }
    } catch (err) {
      console.error(`ERROR visiting ${route}: ${err.message}`);
    }

    page.removeAllListeners('response');
    page.removeAllListeners('pageerror');
  }

  console.log(`\n================ AUDIT SUMMARY ================`);
  console.log(`Total Routes Tested: ${routeResults.length}`);
  console.log(`Total 404 Asset Errors: ${totalFailedImages}`);
  console.log(`Total JS Console Errors: ${totalErrors}`);

  await browser.close();
})();
