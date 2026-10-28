const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/clubs/leeuwarden/', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const before = await page.evaluate(() => {
    const t = document.querySelector('.slick-track');
    return t ? t.style.transform : 'none';
  });

  await page.evaluate(() => {
    const el = document.querySelector('.carousel');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(1000);

  const track = await page.$('.slick-track');
  if (track) {
    const box = await track.boundingBox();
    console.log('Bounding box after scroll:', box);
    if (box) {
      await page.mouse.move(box.x + 400, box.y + 100);
      await page.mouse.down();
      await page.mouse.move(box.x + 100, box.y + 100, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(800);
    }
  }

  const after = await page.evaluate(() => {
    const t = document.querySelector('.slick-track');
    return t ? t.style.transform : 'none';
  });

  console.log('Slick mouse drag on /clubs/leeuwarden/:');
  console.log('Before:', before);
  console.log('After:', after);
  console.log('Changed?:', before !== after);

  await browser.close();
})();
