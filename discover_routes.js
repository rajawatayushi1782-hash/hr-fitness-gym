const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto('https://go180.nl/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  const siteLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href]')).map(a => {
      const href = a.getAttribute('href');
      return {
        text: a.innerText.trim(),
        href: href
      };
    });

    const internalLinks = links
      .filter(l => l.href && (l.href.startsWith('/') || l.href.includes('go180.nl')))
      .map(l => {
        let p = l.href.replace('https://go180.nl', '');
        if (!p.startsWith('/')) p = '/' + p;
        return { text: l.text, path: p };
      });

    const uniquePaths = Array.from(new Set(internalLinks.map(l => l.path)));
    return {
      allCount: links.length,
      internalLinks,
      uniquePaths
    };
  });

  console.log('Site Links Discovered:', JSON.stringify(siteLinks.uniquePaths, null, 2));

  await browser.close();
})();
