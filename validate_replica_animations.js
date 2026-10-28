const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function validateAnimations() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const logs = [];
  const errors = [];
  page.on('console', msg => logs.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', err => errors.push(err.stack || err.message));

  console.log('1. Testing Homepage load & preloader animation...');
  await page.goto('http://localhost:3000/', { waitUntil: 'load' });
  await page.waitForTimeout(3000);

  const testDir = path.join(__dirname, 'screenshots', 'validation_final');
  fs.mkdirSync(testDir, { recursive: true });

  await page.screenshot({ path: path.join(testDir, '01_homepage_initial.png') });

  // Verify video is playing
  const videoState = await page.evaluate(() => {
    const v = document.querySelector('#videoHeader');
    return v ? {
      paused: v.paused,
      currentTime: v.currentTime,
      duration: v.duration,
      readyState: v.readyState,
      src: v.currentSrc,
      opacity: window.getComputedStyle(v).opacity
    } : 'NO VIDEO FOUND';
  });
  console.log('Hero Video State:', JSON.stringify(videoState, null, 2));

  // 2. Test Slide 2 Bullet Click
  console.log('2. Testing Bullet 2 click & smooth scroll...');
  const b2 = await page.$('.slide__navigationBullet2');
  if (b2) {
    await b2.click();
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(testDir, '02_bullet2_active.png') });

    const s2State = await page.evaluate(() => ({
      activeBullet: document.querySelector('.slide__navigationBullet.-active') ? document.querySelector('.slide__navigationBullet.-active').className : null,
      slide1Top: document.querySelector('#slide-1').getBoundingClientRect().top,
      slide2Top: document.querySelector('#slide-2').getBoundingClientRect().top
    }));
    console.log('Slide 2 state:', JSON.stringify(s2State, null, 2));
  }

  // 3. Test Slide 3 Bullet Click
  console.log('3. Testing Bullet 3 click & smooth scroll...');
  const b3 = await page.$('.slide__navigationBullet3');
  if (b3) {
    await b3.click();
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(testDir, '03_bullet3_active.png') });

    const s3State = await page.evaluate(() => ({
      activeBullet: document.querySelector('.slide__navigationBullet.-active') ? document.querySelector('.slide__navigationBullet.-active').className : null,
      slide2Top: document.querySelector('#slide-2').getBoundingClientRect().top,
      slide3Top: document.querySelector('#slide-3').getBoundingClientRect().top
    }));
    console.log('Slide 3 state:', JSON.stringify(s3State, null, 2));
  }

  // 4. Test Programs Dropdown Menu Hover
  console.log('4. Testing Desktop Dropdown Menu Hover...');
  const programsMenu = await page.$('.main__menu .menu-item-has-children');
  if (programsMenu) {
    await programsMenu.hover();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(testDir, '04_dropdown_hover.png') });
  }

  // 5. Test Mobile Hamburger & Drawer
  console.log('5. Testing Mobile Hamburger & Drawer (390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(testDir, '05_mobile_initial.png') });

  const hamburger = await page.$('.hamburger');
  if (hamburger) {
    await hamburger.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(testDir, '06_mobile_drawer_open.png') });

    // Test mobile submenu accordion toggle
    const arrow = await page.$('.js-menu-arrow');
    if (arrow) {
      console.log('Clicking mobile submenu arrow...');
      await arrow.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(testDir, '07_mobile_submenu_expanded.png') });
    }
  }

  console.log('\n--- VALIDATION ERRORS ---');
  console.log(JSON.stringify(errors, null, 2));

  await browser.close();
  console.log('Validation complete! Screenshots in screenshots/validation_final/');
}

validateAnimations().catch(console.error);
