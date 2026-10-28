const { chromium } = require('playwright');

async function testMobile() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const hamburgerInfo = await page.evaluate(() => {
    const h = document.querySelector('.hamburger');
    if (!h) return { found: false };
    const style = window.getComputedStyle(h);
    const rect = h.getBoundingClientRect();
    return {
      found: true,
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      classes: h.className
    };
  });
  console.log('Hamburger element info:', hamburgerInfo);

  // Click it
  console.log('Clicking hamburger...');
  await page.click('.hamburger');
  await page.waitForTimeout(500);

  const menuInfo = await page.evaluate(() => {
    const m = document.querySelector('.mobile__menu');
    if (!m) return { found: false };
    const style = window.getComputedStyle(m);
    return {
      found: true,
      classes: m.className,
      display: style.display,
      zIndex: style.zIndex,
      opacity: style.opacity
    };
  });
  console.log('Mobile menu info after click:', menuInfo);

  await browser.close();
}

testMobile().catch(console.error);
