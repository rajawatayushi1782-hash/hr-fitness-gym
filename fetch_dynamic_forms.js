const { chromium } = require('playwright');
const fs = require('fs');

async function getForms() {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  
  const pagesToTest = [
    { name: 'contact', url: 'https://go180.nl/contact/' },
    { name: 'free-trial', url: 'https://go180.nl/free-trial/' },
    { name: 'programs-essentials', url: 'https://go180.nl/programs/essentials/' }
  ];

  for (const p of pagesToTest) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    console.log(`Loading ${p.name}...`);
    try {
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(3000);
      
      const formHtml = await page.evaluate(() => {
        const f = document.querySelector('form.gform_wrapper, .gform_wrapper, form');
        return f ? f.outerHTML : null;
      });

      if (formHtml) {
        console.log(`Found form on ${p.name}, length: ${formHtml.length}`);
        fs.writeFileSync(`form_${p.name}.html`, formHtml, 'utf8');
      } else {
        console.log(`No form element found on ${p.name}`);
        const jsForm = await page.evaluate(() => {
          const j = document.querySelector('.js-form, [class*="form"]');
          return j ? j.innerHTML : null;
        });
        console.log(`js-form innerHTML on ${p.name}:`, jsForm?.substring(0, 200));
      }
    } catch (e) {
      console.error(`Error on ${p.name}:`, e.message);
    }
    await page.close();
  }

  await browser.close();
}

getForms();
