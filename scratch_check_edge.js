const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ channel: 'msedge', headless: true });
    console.log('Successfully launched msedge!');
    await browser.close();
  } catch (e) {
    console.log('msedge launch failed:', e.message);
    try {
      const browser2 = await chromium.launch({ channel: 'chrome', headless: true });
      console.log('Successfully launched chrome!');
      await browser2.close();
    } catch (e2) {
      console.log('chrome launch failed:', e2.message);
    }
  }
})();