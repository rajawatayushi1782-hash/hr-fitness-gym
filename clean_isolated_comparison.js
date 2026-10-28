const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const targetPages = [
  '/programs/',
  '/programs/essentials/',
  '/programs/fundamentals/',
  '/programs/go2gether/',
  '/programs/adaptable/',
  '/programs/digital-coaching/',
  '/programs/healthy-ageing/',
  '/programs/go2day/',
  '/programs/hyrox/',
  '/coaches/',
  '/clubs/leeuwarden/',
  '/stories/',
  '/pricing/',
  '/free-trial/',
  '/contact/',
  '/we-are-go180/',
  '/join-now/'
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  console.log(`Auditing all ${targetPages.length} pages in clean isolated page contexts...\n`);
  const results = [];

  for (const route of targetPages) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    
    let localData = null;
    try {
      await page.goto('http://localhost:3000' + route, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(1000);
      localData = await page.evaluate(() => {
        const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim()).filter(Boolean);
        const container = document.querySelector('#js-scroll') || document.body;
        return {
          title: document.title,
          h1: h1s[0] || 'None',
          h1Count: h1s.length,
          height: container.scrollHeight,
          imgCount: document.querySelectorAll('img').length,
          formCount: document.querySelectorAll('form').length,
          inputCount: document.querySelectorAll('input, select, textarea').length
        };
      });
    } catch (e) {
      localData = { error: e.message };
    }

    console.log(`[LOCAL] ${route}`);
    console.log(`  H1: "${localData.h1}" | Images: ${localData.imgCount} | Height: ${localData.height}px | Forms: ${localData.formCount} | Inputs: ${localData.inputCount}`);

    results.push({
      route,
      ...localData
    });

    await page.close();
  }

  const outPath = 'd:/My Data/Desktop Files/HR Fitness/screenshots/clean_audit_results.json';
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nCompleted clean audit. Saved to ${outPath}`);

  await browser.close();
})();
