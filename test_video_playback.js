const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', msg => console.log('LOG:', msg.type(), msg.text()));

  await page.goto('http://localhost:3000/', { waitUntil: 'load' });
  await page.waitForTimeout(3000);

  const videoStatus = await page.evaluate(() => {
    const v = document.querySelector('#videoHeader');
    if (!v) return 'No #videoHeader found';
    return {
      paused: v.paused,
      currentTime: v.currentTime,
      duration: v.duration,
      readyState: v.readyState,
      networkState: v.networkState,
      src: v.currentSrc,
      opacity: window.getComputedStyle(v).opacity
    };
  });

  console.log('Video Status on Replica:', JSON.stringify(videoStatus, null, 2));

  // Screenshot after 2 more seconds
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/replica_video_test.png' });

  await browser.close();
})();
