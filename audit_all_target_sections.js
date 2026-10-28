const { chromium } = require('playwright');
const fs = require('fs');

const pages = [
  { name: 'Programs Hub', url: '/programs/' },
  { name: 'Essentials', url: '/programs/essentials/' },
  { name: 'Fundamentals', url: '/programs/fundamentals/' },
  { name: 'GO2GETHER', url: '/programs/go2gether/' },
  { name: 'Adaptable', url: '/programs/adaptable/' },
  { name: 'Digital Coaching', url: '/programs/digital-coaching/' },
  { name: 'Healthy Ageing', url: '/programs/healthy-ageing/' },
  { name: 'GO2DAY', url: '/programs/go2day/' },
  { name: 'HYROX', url: '/programs/hyrox/' },
  { name: 'Coaches', url: '/coaches/' },
  { name: 'Club Leeuwarden', url: '/clubs/leeuwarden/' },
  { name: 'Stories', url: '/stories/' },
  { name: 'Pricing', url: '/pricing/' },
  { name: 'Free Trial', url: '/free-trial/' },
  { name: 'Contact', url: '/contact/' },
  { name: 'We Are GO180', url: '/we-are-go180/' },
  { name: 'Join Now', url: '/join-now/' }
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  console.log(`Auditing all ${pages.length} target pages for section structure and titles...\n`);

  for (const p of pages) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:3000' + p.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1000);

    const data = await page.evaluate(() => {
      // Clean prefetch / wipe artifacts
      document.querySelectorAll('.wipe, .wipe_spinner').forEach(el => el.remove());
      const h1 = document.querySelector('h1')?.textContent.trim() || 'None';
      const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim()).filter(Boolean);
      const h3s = Array.from(document.querySelectorAll('h3')).map(h => h.textContent.trim()).filter(Boolean);
      const images = Array.from(document.querySelectorAll('img')).map(i => i.src || i.getAttribute('data-src')).filter(Boolean);
      const forms = document.querySelectorAll('form').length;
      const buttons = Array.from(document.querySelectorAll('button, a.btn, input[type="submit"]')).map(b => b.textContent.trim() || b.value).filter(Boolean);
      return {
        h1,
        h2Count: h2s.length,
        h2Sample: h2s.slice(0, 5),
        h3Count: h3s.length,
        imageCount: images.length,
        forms,
        buttonsSample: buttons.slice(0, 5)
      };
    });

    console.log(`[PAGE] ${p.name} (${p.url})`);
    console.log(`  H1: "${data.h1}"`);
    console.log(`  H2s (${data.h2Count}): ${JSON.stringify(data.h2Sample)}`);
    console.log(`  Images: ${data.imageCount} | Forms: ${data.forms} | Buttons: ${JSON.stringify(data.buttonsSample)}\n`);

    await page.close();
  }

  await browser.close();
})();
