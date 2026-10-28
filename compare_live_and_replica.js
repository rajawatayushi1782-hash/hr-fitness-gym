const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function compareSites() {
  const compDir = path.join(__dirname, 'screenshots', 'comparison');
  fs.mkdirSync(compDir, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  // 1. Desktop comparison (1440x900)
  console.log('--- Testing Desktop Viewport (1440x900) ---');
  const liveContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const replicaContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  const livePage = await liveContext.newPage();
  const replicaPage = await replicaContext.newPage();

  // Navigate both
  console.log('Navigating both pages...');
  await Promise.all([
    livePage.goto('https://go180.nl/', { waitUntil: 'load' }),
    replicaPage.goto('http://localhost:3000/', { waitUntil: 'load' })
  ]);

  await livePage.waitForTimeout(3000);
  await replicaPage.waitForTimeout(3000);

  // Close popups
  try {
    const pum1 = await livePage.$('.pum-close');
    if (pum1) await pum1.click();
  } catch (e) {}
  try {
    const pum2 = await replicaPage.$('.pum-close');
    if (pum2) await pum2.click();
  } catch (e) {}

  await livePage.screenshot({ path: path.join(compDir, '01_live_initial.png') });
  await replicaPage.screenshot({ path: path.join(compDir, '01_replica_initial.png') });
  console.log('Saved 01 initial screenshots.');

  // Dropdown hover
  console.log('Hovering Programs menu item...');
  const liveMenu = await livePage.$('.main__menu .menu-item-has-children');
  const repMenu = await replicaPage.$('.main__menu .menu-item-has-children');
  if (liveMenu) await liveMenu.hover();
  if (repMenu) await repMenu.hover();
  await livePage.waitForTimeout(600);
  await replicaPage.waitForTimeout(600);
  await livePage.screenshot({ path: path.join(compDir, '02_live_dropdown.png') });
  await replicaPage.screenshot({ path: path.join(compDir, '02_replica_dropdown.png') });
  console.log('Saved 02 dropdown screenshots.');

  // Click bullet 2
  console.log('Clicking bullet 2...');
  const liveB2 = await livePage.$('.slide__navigationBullet:nth-child(2)');
  const repB2 = await replicaPage.$('.slide__navigationBullet:nth-child(2)');
  if (liveB2) await liveB2.click();
  if (repB2) await repB2.click();
  await livePage.waitForTimeout(2000);
  await replicaPage.waitForTimeout(2000);
  await livePage.screenshot({ path: path.join(compDir, '03_live_bullet2.png') });
  await replicaPage.screenshot({ path: path.join(compDir, '03_replica_bullet2.png') });
  console.log('Saved 03 bullet2 screenshots.');

  // Click bullet 3
  console.log('Clicking bullet 3...');
  const liveB3 = await livePage.$('.slide__navigationBullet:nth-child(3)');
  const repB3 = await replicaPage.$('.slide__navigationBullet:nth-child(3)');
  if (liveB3) await liveB3.click();
  if (repB3) await repB3.click();
  await livePage.waitForTimeout(2000);
  await replicaPage.waitForTimeout(2000);
  await livePage.screenshot({ path: path.join(compDir, '04_live_bullet3.png') });
  await replicaPage.screenshot({ path: path.join(compDir, '04_replica_bullet3.png') });
  console.log('Saved 04 bullet3 screenshots.');

  // Check state differences on Desktop
  const diffDesktop = {
    live: await livePage.evaluate(() => ({
      activeBullet: document.querySelector('.slide__navigationBullet.-active') ? document.querySelector('.slide__navigationBullet.-active').className : null,
      headerClass: document.querySelector('header').className,
      headerStyle: document.querySelector('header').getAttribute('style'),
      slidesStyles: Array.from(document.querySelectorAll('.slides > .slide')).map(s => s.getAttribute('style')),
      logoRotate: document.querySelector('.logo-o') ? document.querySelector('.logo-o').getAttribute('style') : null
    })),
    replica: await replicaPage.evaluate(() => ({
      activeBullet: document.querySelector('.slide__navigationBullet.-active') ? document.querySelector('.slide__navigationBullet.-active').className : null,
      headerClass: document.querySelector('header').className,
      headerStyle: document.querySelector('header').getAttribute('style'),
      slidesStyles: Array.from(document.querySelectorAll('.slides > .slide')).map(s => s.getAttribute('style')),
      logoRotate: document.querySelector('.logo-o') ? document.querySelector('.logo-o').getAttribute('style') : null
    }))
  };
  console.log('Desktop State Diff:', JSON.stringify(diffDesktop, null, 2));

  // 2. Mobile comparison (390x844)
  console.log('\n--- Testing Mobile Viewport (390x844) ---');
  await livePage.setViewportSize({ width: 390, height: 844 });
  await replicaPage.setViewportSize({ width: 390, height: 844 });
  await livePage.waitForTimeout(1000);
  await replicaPage.waitForTimeout(1000);

  await livePage.screenshot({ path: path.join(compDir, '05_live_mobile_initial.png') });
  await replicaPage.screenshot({ path: path.join(compDir, '05_replica_mobile_initial.png') });
  console.log('Saved 05 mobile initial screenshots.');

  // Click hamburger
  const liveHam = await livePage.$('.hamburger, .header__hamburger, .menu-toggle, [class*="hamburger"]');
  const repHam = await replicaPage.$('.hamburger, .header__hamburger, .menu-toggle, [class*="hamburger"]');
  if (liveHam) await liveHam.click();
  if (repHam) await repHam.click();
  await livePage.waitForTimeout(1000);
  await replicaPage.waitForTimeout(1000);

  await livePage.screenshot({ path: path.join(compDir, '06_live_mobile_menu.png') });
  await replicaPage.screenshot({ path: path.join(compDir, '06_replica_mobile_menu.png') });
  console.log('Saved 06 mobile menu screenshots.');

  await browser.close();
  console.log('Comparison complete!');
}

compareSites().catch(console.error);
