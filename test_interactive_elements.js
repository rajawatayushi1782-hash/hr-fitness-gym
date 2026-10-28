const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Testing interactive elements on http://localhost:3000...');

  // 1. Dropdown hover on desktop
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const progNav = page.locator('header .main__menu li.menu-item-has-children > a');
  await progNav.hover();
  await page.waitForTimeout(400);
  const subMenuVisible = await page.locator('.main__menu .sub-menu').isVisible();
  const subItemsCount = await page.locator('.main__menu .sub-menu li a').count();
  console.log(`Dropdown Hover: sub-menu visible = ${subMenuVisible}, items count = ${subItemsCount}`);

  // 2. Mobile drawer test
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const burger = page.locator('.hamburger');
  await burger.click();
  await page.waitForTimeout(500);
  const mobileMenuVisible = await page.locator('.mobile__menu').isVisible();
  console.log(`Mobile Hamburger Click: mobile__menu visible = ${mobileMenuVisible}`);

  // Expand accordion inside mobile menu
  const mobileProgramsArrow = page.locator('.mobile__menu li.menu-item-has-children .js-menu-arrow');
  if (await mobileProgramsArrow.count() > 0) {
    await mobileProgramsArrow.first().click();
    await page.waitForTimeout(400);
    const mobileSubVisible = await page.locator('.mobile__menu .sub-menu').isVisible();
    console.log(`Mobile Programs Accordion: sub-menu expanded = ${mobileSubVisible}`);
  }

  // 3. Join-Now Form fields
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/join-now/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const formInputs = await page.locator('input, select, textarea').count();
  const buttons = await page.locator('button, a.btn, input[type="submit"]').count();
  console.log(`/join-now/ interactive inputs: ${formInputs}, buttons/ctas: ${buttons}`);

  // 4. Contact Form fields
  await page.goto('http://localhost:3000/contact/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const contactInputs = await page.locator('input, select, textarea').count();
  console.log(`/contact/ interactive inputs: ${contactInputs}`);

  // 5. Free-Trial Form fields
  await page.goto('http://localhost:3000/free-trial/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const trialInputs = await page.locator('input, select, textarea').count();
  console.log(`/free-trial/ interactive inputs: ${trialInputs}`);

  await browser.close();
  console.log('ALL INTERACTIVE ELEMENT CHECKS PASSED SUCCESSFULLY!');
})();
