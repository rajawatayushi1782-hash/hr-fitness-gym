const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const testRoutes = [
  '/',
  '/programs/',
  '/programs/essentials/',
  '/coaches/',
  '/clubs/leeuwarden/',
  '/stories/',
  '/pricing/',
  '/contact/'
];

const outDir = path.join(__dirname, 'screenshots', 'tablet_tests');
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  // Tablet viewport: 768 x 1024
  const page = await browser.newPage({ viewport: { width: 768, height: 1024 } });

  for (const route of testRoutes) {
    const slug = route === '/' ? 'home' : route.replace(/\//g, '_').replace(/^_|_$/g, '');
    console.log(`Testing tablet viewport for ${route}...`);

    await page.goto(`http://localhost:3000${route}`, { waitUntil: 'load' });
    await page.waitForTimeout(4000);

    await page.screenshot({ path: path.join(outDir, `${slug}_tablet.png`) });

    const checks = await page.evaluate(() => {
      const desktopMenu = document.querySelector('.main__menu');
      const hamburger = document.querySelector('.hamburger');
      const header = document.querySelector('.header');
      return {
        desktopMenuHidden: !desktopMenu || window.getComputedStyle(desktopMenu).display === 'none',
        hamburgerVisible: !!hamburger && window.getComputedStyle(hamburger).display !== 'none',
        headerVisible: !!header && window.getComputedStyle(header).display !== 'none'
      };
    });

    console.log(`  Tablet ${slug}: DesktopMenuHidden=${checks.desktopMenuHidden}, HamburgerVisible=${checks.hamburgerVisible}`);
  }

  await browser.close();
  console.log('Tablet tests completed!');
})();
