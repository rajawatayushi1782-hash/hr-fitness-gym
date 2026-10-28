const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testWheelScroll() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  // 1. Live site
  const livePage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await livePage.goto('https://go180.nl/', { waitUntil: 'load' });
  await livePage.waitForTimeout(3000);

  // Wheel scroll 1200px
  await livePage.mouse.wheel(0, 1500);
  await livePage.waitForTimeout(2000);

  const liveState = await livePage.evaluate(() => {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    return {
      scrollContainerTransform: scrollContainer ? scrollContainer.style.transform : 'none',
      headerClass: document.querySelector('header').className,
      headerStyle: document.querySelector('header').getAttribute('style'),
      activeBullet: document.querySelector('.slide-bullet.-active, [class*="bullet"].-active, [class*="active"]') ? document.querySelector('.slide-bullet.-active, [class*="bullet"].-active, [class*="active"]').className : null
    };
  });

  await livePage.screenshot({ path: path.join(__dirname, 'screenshots', 'original_live', 'wheel_scroll_1500.png') });
  console.log('Live state after wheel scroll:', liveState);

  // 2. Replica site
  const replicaPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await replicaPage.goto('http://localhost:3000/', { waitUntil: 'load' });
  await replicaPage.waitForTimeout(3000);

  await replicaPage.mouse.wheel(0, 1500);
  await replicaPage.waitForTimeout(2000);

  const replicaState = await replicaPage.evaluate(() => {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    return {
      scrollContainerTransform: scrollContainer ? scrollContainer.style.transform : 'none',
      headerClass: document.querySelector('header').className,
      headerStyle: document.querySelector('header').getAttribute('style'),
      activeBullet: document.querySelector('.slide-bullet.-active, [class*="bullet"].-active, [class*="active"]') ? document.querySelector('.slide-bullet.-active, [class*="bullet"].-active, [class*="active"]').className : null
    };
  });

  await replicaPage.screenshot({ path: path.join(__dirname, 'screenshots', 'replica_test', 'wheel_scroll_1500.png') });
  console.log('Replica state after wheel scroll:', replicaState);

  await browser.close();
}

testWheelScroll().catch(console.error);
