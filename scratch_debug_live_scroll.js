const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function debugLiveSiteInteractions() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to live https://go180.nl/ ...');
  await page.goto('https://go180.nl/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Take screenshot 1: initial
  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'original_live', '01_initial.png') });

  // Check event listeners on window and document
  const listeners = await page.evaluate(() => {
    return {
      windowScrollY: window.scrollY,
      htmlScrollTop: document.documentElement.scrollTop,
      bodyScrollTop: document.body.scrollTop,
      bullets: Array.from(document.querySelectorAll('.slide__navigationBullet')).map(b => ({
        class: b.className,
        attr: b.getAttribute('data-scroll-to-element'),
        rect: b.getBoundingClientRect()
      })),
      slides: Array.from(document.querySelectorAll('[id*="slide"]')).map(s => ({
        id: s.id,
        class: s.className,
        rect: s.getBoundingClientRect()
      }))
    };
  });
  console.log('Bullets & Slides on live:', JSON.stringify(listeners, null, 2));

  // Click on bullet 2
  console.log('Clicking Bullet 2...');
  const bullet2 = await page.$('.slide__navigationBullet2, .slide__navigationBullet:nth-child(2)');
  if (bullet2) {
    await bullet2.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(__dirname, 'screenshots', 'original_live', '02_after_bullet2_click.png') });
  }

  // Scroll with page down or wheel over document.body
  console.log('Pressing PageDown...');
  await page.keyboard.press('PageDown');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'original_live', '03_after_pagedown.png') });

  // Move mouse to center and wheel
  console.log('Mouse wheel in center of viewport...');
  await page.mouse.move(720, 450);
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'original_live', '04_after_center_wheel.png') });

  // Check what changed
  const stateAfter = await page.evaluate(() => {
    return {
      windowScrollY: window.scrollY,
      htmlScrollTop: document.documentElement.scrollTop,
      bodyScrollTop: document.body.scrollTop,
      headerClass: document.querySelector('header').className,
      headerStyle: document.querySelector('header').getAttribute('style'),
      activeBullet: document.querySelector('.slide__navigationBullet.-active') ? document.querySelector('.slide__navigationBullet.-active').className : null
    };
  });
  console.log('State after interactions on live:', stateAfter);

  await browser.close();
}

debugLiveSiteInteractions().catch(console.error);
