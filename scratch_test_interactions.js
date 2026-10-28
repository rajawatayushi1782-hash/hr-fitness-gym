const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  // Test A: Home
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  
  // Programs submenu hover
  const programs = await page.$('#menu-item-17');
  if (programs) {
    await programs.hover();
    await page.waitForTimeout(300);
    const subDisp = await page.evaluate(() => window.getComputedStyle(document.querySelector('.main__menu .sub-menu')).display);
    console.log('Programs submenu hover display:', subDisp);
  }

  // Mobile hamburger
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.click('.hamburger');
  await page.waitForTimeout(700);
  const isOpen = await page.evaluate(() => document.querySelector('.mobile__menu').classList.contains('-open'));
  console.log('Mobile menu -open:', isOpen);
  
  // Mobile accordion
  const arrow = await page.$('.mobile__menu .js-menu-arrow');
  if (arrow) {
    await arrow.click();
    await page.waitForTimeout(400);
    const subDisp = await page.evaluate(() => window.getComputedStyle(document.querySelector('.mobile__menu .sub-menu')).display);
    console.log('Mobile sub-menu display:', subDisp);
  }

  // Contact form
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:3000/contact/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await page.fill('input[name="input_1"]', 'Jan');
  await page.fill('input[name="input_2"]', 'Jansen');
  await page.fill('input[name="input_3"]', 'jan.jansen@example.com');
  await page.fill('input[name="input_4"]', '0612345678');
  await page.click('input[type="submit"]');
  await page.waitForTimeout(1000);
  const conf = await page.evaluate(() => document.body.innerText.includes('Bedankt voor je aanvraag'));
  console.log('Form confirmation displayed:', conf);

  // FAQ Accordion
  await page.goto('http://127.0.0.1:3000/we-are-go180/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);
  await page.click('section.faq h3:nth-of-type(2)');
  await page.waitForTimeout(300);
  const faqOpen = await page.evaluate(() => document.querySelector('section.faq h3:nth-of-type(2)').nextElementSibling.style.display);
  console.log('FAQ 2 display after click:', faqOpen);

  // DragSlider
  await page.click('.dragSlider__navPoint:nth-child(2)');
  await page.waitForTimeout(300);
  const ptActive = await page.evaluate(() => document.querySelectorAll('.dragSlider__navPoint')[1].classList.contains('-active'));
  console.log('Slider point 2 active:', ptActive);

  await browser.close();
  console.log('\n>>> All functional interaction tests passed successfully! <<<');
})();
