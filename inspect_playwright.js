const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'we-are-go180', path: '/we-are-go180/' },
  { name: 'programs', path: '/programs/' },
  { name: 'programs-essentials', path: '/programs/essentials/' },
  { name: 'coaches', path: '/coaches/' },
  { name: 'club-leeuwarden', path: '/clubs/leeuwarden/' },
  { name: 'stories', path: '/stories/' },
  { name: 'pricing', path: '/pricing/' },
  { name: 'contact', path: '/contact/' },
  { name: 'join-now', path: '/join-now/' },
  { name: 'free-trial', path: '/free-trial/' }
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 }
];

async function inspect() {
  const baseDir = path.join(__dirname, 'screenshots', 'original');
  const htmlDir = path.join(__dirname, 'scraped_pages');
  fs.mkdirSync(baseDir, { recursive: true });
  fs.mkdirSync(htmlDir, { recursive: true });

  console.log('Launching installed Chrome via Playwright...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const allAssets = new Set();
  const consoleMessages = [];

  for (const route of ROUTES) {
    const url = `https://go180.nl${route.path}`;
    console.log(`\n--- Inspecting Route: ${route.name} (${url}) ---`);

    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      });

      const page = await context.newPage();

      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleMessages.push({ route: route.name, vp: vp.name, text: msg.text() });
        }
      });

      page.on('response', response => {
        const reqUrl = response.url();
        if (reqUrl.includes('go180.nl') && (
          reqUrl.includes('/assets/') || 
          reqUrl.includes('/uploads/') || 
          reqUrl.includes('/themes/') ||
          reqUrl.endsWith('.png') || 
          reqUrl.endsWith('.jpg') || 
          reqUrl.endsWith('.jpeg') || 
          reqUrl.endsWith('.svg') || 
          reqUrl.endsWith('.webp') ||
          reqUrl.endsWith('.woff') ||
          reqUrl.endsWith('.woff2')
        )) {
          allAssets.add(reqUrl.split('?')[0]);
        }
      });

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
        await page.waitForTimeout(2000);
      } catch (e) {
        console.log(`Timeout on ${route.name} ${vp.name}: ${e.message}`);
      }

      // Dismiss cookie banner or popup if present
      try {
        const cookieBtn = await page.$('.pum-close, #cookie-law-info-bar .cli_action_button, button[id*="cookie"], a[class*="cookie"]');
        if (cookieBtn) {
          await cookieBtn.click();
          await page.waitForTimeout(500);
        }
      } catch (err) {}

      // Scroll to trigger lazy loading
      try {
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 500;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              if (totalHeight >= scrollHeight || totalHeight > 10000) {
                clearInterval(timer);
                resolve();
              }
            }, 80);
          });
        });
        await page.waitForTimeout(1000);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);
      } catch (err) {}

      // Save screenshot
      const ssPath = path.join(baseDir, `${route.name}_${vp.name}.png`);
      try {
        await page.screenshot({ path: ssPath, fullPage: true });
        console.log(`Saved screenshot: ${ssPath}`);
      } catch (e) {
        console.log(`Screenshot error on ${route.name} ${vp.name}: ${e.message}`);
      }

      // If desktop, save the rendered HTML and inspect computed styles
      if (vp.name === 'desktop') {
        const content = await page.content();
        fs.writeFileSync(path.join(htmlDir, `${route.name}.html`), content, 'utf8');

        // Extract key styles
        try {
          const styles = await page.evaluate(() => {
            const bodyStyle = window.getComputedStyle(document.body);
            const h1 = document.querySelector('h1');
            const h2 = document.querySelector('h2');
            const p = document.querySelector('p');
            const btn = document.querySelector('a.button, button.button, a.btn, .header__button, .button--primary');
            const header = document.querySelector('header, .header');

            return {
              body: {
                fontFamily: bodyStyle.fontFamily,
                color: bodyStyle.color,
                backgroundColor: bodyStyle.backgroundColor,
                fontSize: bodyStyle.fontSize
              },
              h1: h1 ? {
                fontFamily: window.getComputedStyle(h1).fontFamily,
                fontSize: window.getComputedStyle(h1).fontSize,
                fontWeight: window.getComputedStyle(h1).fontWeight,
                lineHeight: window.getComputedStyle(h1).lineHeight,
                color: window.getComputedStyle(h1).color
              } : null,
              h2: h2 ? {
                fontFamily: window.getComputedStyle(h2).fontFamily,
                fontSize: window.getComputedStyle(h2).fontSize,
                fontWeight: window.getComputedStyle(h2).fontWeight,
                lineHeight: window.getComputedStyle(h2).lineHeight,
                color: window.getComputedStyle(h2).color
              } : null,
              p: p ? {
                fontFamily: window.getComputedStyle(p).fontFamily,
                fontSize: window.getComputedStyle(p).fontSize,
                lineHeight: window.getComputedStyle(p).lineHeight,
                color: window.getComputedStyle(p).color
              } : null,
              header: header ? {
                height: window.getComputedStyle(header).height,
                backgroundColor: window.getComputedStyle(header).backgroundColor,
                position: window.getComputedStyle(header).position
              } : null,
              button: btn ? {
                fontFamily: window.getComputedStyle(btn).fontFamily,
                fontSize: window.getComputedStyle(btn).fontSize,
                backgroundColor: window.getComputedStyle(btn).backgroundColor,
                color: window.getComputedStyle(btn).color,
                borderRadius: window.getComputedStyle(btn).borderRadius,
                padding: window.getComputedStyle(btn).padding
              } : null
            };
          });

          fs.writeFileSync(path.join(htmlDir, `${route.name}_styles.json`), JSON.stringify(styles, null, 2), 'utf8');
        } catch (e) {}
      }

      await context.close();
    }
  }

  await browser.close();

  fs.writeFileSync('collected_assets.json', JSON.stringify([...allAssets], null, 2), 'utf8');
  fs.writeFileSync('console_errors.json', JSON.stringify(consoleMessages, null, 2), 'utf8');
  console.log(`\nPlaywright inspection complete! Collected ${allAssets.size} assets.`);
}

inspect().catch(err => {
  console.error('Inspection error:', err);
  process.exit(1);
});
