const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://go180.nl/we-are-go180/', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(2000);

  const faqData = await page.evaluate(() => {
    const faq = document.querySelector('.faq, [class*="faq"]');
    if (!faq) return 'No FAQ section found';
    return {
      outerHTML: faq.outerHTML,
      headings: Array.from(faq.querySelectorAll('h2, h3, h4')).map(h => ({
        tag: h.tagName,
        text: h.innerText,
        nextTag: h.nextElementSibling ? h.nextElementSibling.tagName : null,
        nextDisplay: h.nextElementSibling ? window.getComputedStyle(h.nextElementSibling).display : null
      }))
    };
  });

  console.log('Live FAQ Data:\n', JSON.stringify(faqData, null, 2));
  await browser.close();
})();
