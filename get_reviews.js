const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const reviews = await page.evaluate(() => {
    const items = document.querySelectorAll('.es-review-container');
    return Array.from(items).map(item => {
      const author = item.querySelector('.es-review-author-name, [class*="AuthorName"]')?.textContent?.trim();
      const text = item.querySelector('.es-review-text, [class*="ReviewText"], [class*="TextControl"]')?.textContent?.trim();
      const allText = item.innerText;
      return { author, text, allText: allText.substring(0, 150) };
    });
  });

  console.log(`Found ${reviews.length} reviews:`);
  reviews.slice(0, 5).forEach((r, i) => console.log(`[${i}] Author: ${r.author} | Text: ${r.text || r.allText}`));

  await browser.close();
})();
