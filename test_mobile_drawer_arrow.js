const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  console.log('Navigating to http://localhost:3000/ on mobile...');
  await page.goto('http://localhost:3000/', { waitUntil: 'load' });
  await page.waitForTimeout(2500);

  const testDir = path.join(__dirname, 'screenshots', 'mobile_accordion_test');
  fs.mkdirSync(testDir, { recursive: true });

  // 1. Initial mobile
  await page.screenshot({ path: path.join(testDir, '01_mobile_initial.png') });

  // 2. Click hamburger
  console.log('Clicking hamburger...');
  const ham = await page.$('.hamburger');
  if (ham) await ham.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(testDir, '02_drawer_open.png') });

  // 3. Click submenu arrow for Programs
  console.log('Clicking Programs arrow (.js-menu-arrow)...');
  const arrow = await page.$('.menu-item-has-children .js-menu-arrow');
  if (arrow) {
    await arrow.click({ force: true });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(testDir, '03_submenu_expanded.png') });
  }

  const submenuState = await page.evaluate(() => {
    const sub = document.querySelector('.mobile__menu .sub-menu');
    const arr = document.querySelector('.mobile__menu .js-menu-arrow');
    return {
      arrowOpen: arr ? arr.classList.contains('-open') : null,
      submenuDisplay: sub ? window.getComputedStyle(sub).display : null,
      submenuItems: Array.from(document.querySelectorAll('.mobile__menu .sub-menu li a')).map(a => a.innerText)
    };
  });
  console.log('Mobile Submenu State:', JSON.stringify(submenuState, null, 2));

  await browser.close();
})();
