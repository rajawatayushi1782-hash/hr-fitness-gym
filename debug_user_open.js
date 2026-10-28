const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleLogs = [];
  const errors = [];
  const failedRequests = [];

  page.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });

  page.on('pageerror', err => {
    errors.push(err.message + '\n' + err.stack);
  });

  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), error: req.failure()?.errorText });
  });

  console.log('Navigating to http://localhost:3000 ...');
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 10000 });
  } catch (e) {
    console.log('page.goto load timeout/error:', e.message);
  }

  await page.waitForTimeout(3000);

  const state = await page.evaluate(() => {
    const bodyClass = document.body.className;
    const spinner = document.querySelector('.wipe_spinner');
    const wipe = document.querySelector('.wipe');
    const header = document.querySelector('header');
    const heroH1 = document.querySelector('h1');
    const firstSection = document.querySelector('section, main, .main');
    
    return {
      title: document.title,
      bodyClass,
      bodyStyle: document.body.getAttribute('style'),
      spinnerStyle: spinner ? {
        display: window.getComputedStyle(spinner).display,
        opacity: window.getComputedStyle(spinner).opacity,
        visibility: window.getComputedStyle(spinner).visibility,
        zIndex: window.getComputedStyle(spinner).zIndex,
        pointerEvents: window.getComputedStyle(spinner).pointerEvents
      } : null,
      wipeStyle: wipe ? {
        display: window.getComputedStyle(wipe).display,
        opacity: window.getComputedStyle(wipe).opacity,
        visibility: window.getComputedStyle(wipe).visibility,
        transform: window.getComputedStyle(wipe).transform,
        pointerEvents: window.getComputedStyle(wipe).pointerEvents
      } : null,
      headerVisible: header ? window.getComputedStyle(header).display !== 'none' : false,
      heroH1Text: heroH1 ? heroH1.innerText : null,
      htmlClass: document.documentElement.className
    };
  });

  console.log('\n--- PAGE STATE ---');
  console.log(JSON.stringify(state, null, 2));

  console.log('\n--- PAGE ERRORS ---');
  console.log(errors);

  console.log('\n--- CONSOLE ERRORS & WARNS ---');
  console.log(consoleLogs.filter(l => l.type === 'error' || l.type === 'warning').slice(0, 10));

  console.log('\n--- FAILED REQUESTS ---');
  console.log(failedRequests.slice(0, 10));

  const screenshotPath = 'd:/My Data/Desktop Files/HR Fitness/screenshots/debug_user_open.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('\nScreenshot saved to:', screenshotPath);

  await browser.close();
})();
