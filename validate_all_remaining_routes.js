const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const routes = [
  { name: 'we_are_go180', path: '/we-are-go180/' },
  { name: 'coaches', path: '/coaches/' },
  { name: 'club_leeuwarden', path: '/clubs/leeuwarden/' },
  { name: 'stories', path: '/stories/' },
  { name: 'pricing', path: '/pricing/' },
  { name: 'contact', path: '/contact/' },
  { name: 'free_trial', path: '/free-trial/' },
  { name: 'join_now', path: '/join-now/' }
];

const outDir = path.join(__dirname, 'screenshots', 'audit_all');
fs.mkdirSync(outDir, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  for (const r of routes) {
    console.log(`\nTesting ${r.name} (${r.path})...`);
    
    // 1. Desktop test
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    await page.goto(`http://localhost:3000${r.path}`, { waitUntil: 'load', timeout: 15000 });
    await page.waitForTimeout(4500); // Wait for wipe

    // Take top screenshot
    await page.screenshot({ path: path.join(outDir, `${r.name}_desktop_top.png`) });

    // Test scrolling down 1000px
    await page.mouse.move(700, 500);
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, `${r.name}_desktop_scrolled.png`) });

    // Check DOM details
    const domInfo = await page.evaluate(() => {
      const h1 = document.querySelector('h1') ? document.querySelector('h1').innerText.trim() : null;
      const wipe = document.querySelector('.wipe');
      const wipeHidden = !wipe || window.getComputedStyle(wipe).opacity === '0';
      const forms = Array.from(document.querySelectorAll('form')).map(f => ({
        id: f.id,
        className: f.className,
        inputs: f.querySelectorAll('input, select, textarea').length
      }));
      const images = Array.from(document.querySelectorAll('img')).map(i => ({
        src: i.src,
        complete: i.complete,
        naturalWidth: i.naturalWidth
      }));
      const brokenImages = images.filter(i => i.src && !i.src.startsWith('data:') && !i.src.includes('elfsight') && i.naturalWidth === 0);

      return { h1, wipeHidden, formsCount: forms.length, brokenImagesCount: brokenImages.length };
    });

    console.log(`  Desktop: H1="${domInfo.h1}", WipeHidden=${domInfo.wipeHidden}, Forms=${domInfo.formsCount}, BrokenImgs=${domInfo.brokenImagesCount}, Errors=${errors.length}`);

    await page.close();

    // 2. Mobile test
    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await mobile.goto(`http://localhost:3000${r.path}`, { waitUntil: 'load', timeout: 15000 });
    await mobile.waitForTimeout(4500);

    await mobile.screenshot({ path: path.join(outDir, `${r.name}_mobile_top.png`) });

    const mobInfo = await mobile.evaluate(() => {
      const desktopMenu = document.querySelector('.main__menu');
      const hamburger = document.querySelector('.hamburger');
      return {
        desktopMenuHidden: !desktopMenu || window.getComputedStyle(desktopMenu).display === 'none',
        hamburgerVisible: !!hamburger && window.getComputedStyle(hamburger).display !== 'none'
      };
    });

    console.log(`  Mobile: DesktopMenuHidden=${mobInfo.desktopMenuHidden}, HamburgerVisible=${mobInfo.hamburgerVisible}`);
    await mobile.close();
  }

  await browser.close();
  console.log('\nAll remaining routes tested successfully!');
})();
