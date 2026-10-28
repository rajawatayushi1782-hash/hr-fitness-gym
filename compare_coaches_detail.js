
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const livePage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const repPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await livePage.goto('https://go180.nl/coaches/', { waitUntil: 'domcontentloaded' });
  await repPage.goto('http://localhost:3000/coaches/', { waitUntil: 'domcontentloaded' });
  await livePage.waitForTimeout(2000);
  await repPage.waitForTimeout(2000);

  const liveCoaches = await livePage.evaluate(() => {
    const titles = Array.from(document.querySelectorAll('h1, h2, h3, .title, .name')).map(el => el.innerText.trim()).filter(Boolean);
    const coaches = Array.from(document.querySelectorAll('.carousel__slide, .coach, [class*="coach"]')).map(el => ({
      text: el.innerText.trim(),
      img: el.querySelector('img') ? el.querySelector('img').src : null
    }));
    const sections = Array.from(document.querySelectorAll('section, [data-scroll-section]')).map(s => ({
      id: s.id,
      className: s.className,
      headings: Array.from(s.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim()).filter(Boolean)
    }));
    return { titles, coachesCount: coaches.length, coaches: coaches.slice(0, 10), sections };
  });

  const repCoaches = await repPage.evaluate(() => {
    const titles = Array.from(document.querySelectorAll('h1, h2, h3, .title, .name')).map(el => el.innerText.trim()).filter(Boolean);
    const coaches = Array.from(document.querySelectorAll('.carousel__slide, .coach, [class*="coach"]')).map(el => ({
      text: el.innerText.trim(),
      img: el.querySelector('img') ? el.querySelector('img').src : null
    }));
    const sections = Array.from(document.querySelectorAll('section, [data-scroll-section]')).map(s => ({
      id: s.id,
      className: s.className,
      headings: Array.from(s.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim()).filter(Boolean)
    }));
    return { titles, coachesCount: coaches.length, coaches: coaches.slice(0, 10), sections };
  });

  console.log('Live Coaches Details:\n', JSON.stringify(liveCoaches, null, 2));
  console.log('Replica Coaches Details:\n', JSON.stringify(repCoaches, null, 2));

  await browser.close();
})();
