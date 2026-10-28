const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const livePage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const repPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await livePage.goto('https://go180.nl/we-are-go180/', { waitUntil: 'domcontentloaded' });
  await repPage.goto('http://localhost:3000/we-are-go180/', { waitUntil: 'domcontentloaded' });
  await livePage.waitForTimeout(2000);
  await repPage.waitForTimeout(2000);

  const liveDetails = await livePage.evaluate(() => {
    return {
      title: document.title,
      h1: Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim()),
      h2: Array.from(document.querySelectorAll('h2')).map(h => h.innerText.trim()),
      h3: Array.from(document.querySelectorAll('h3')).map(h => h.innerText.trim()),
      sectionsCount: document.querySelectorAll('section, [data-scroll-section]').length,
      imagesCount: document.querySelectorAll('img').length
    };
  });

  const repDetails = await repPage.evaluate(() => {
    return {
      title: document.title,
      h1: Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim()),
      h2: Array.from(document.querySelectorAll('h2')).map(h => h.innerText.trim()),
      h3: Array.from(document.querySelectorAll('h3')).map(h => h.innerText.trim()),
      sectionsCount: document.querySelectorAll('section, [data-scroll-section]').length,
      imagesCount: document.querySelectorAll('img').length
    };
  });

  console.log('Live We Are GO180:\n', JSON.stringify(liveDetails, null, 2));
  console.log('Replica We Are GO180:\n', JSON.stringify(repDetails, null, 2));

  await browser.close();
})();
