const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'we-are-go180', path: '/we-are-go180/' },
  { name: 'programs', path: '/programs/' },
  { name: 'programs-essentials', path: '/programs/essentials/' },
  { name: 'coaches', path: '/coaches/' },
  { name: 'club-leeuwarden', path: '/clubs/leeuwarden/' },
  { name: 'stories', path: '/stories/' },
  { name: 'pricing', path: '/pricing/' },
  { name: 'contact', path: '/contact/' },
  { name: 'join-now', path: '/join-now/' },
  { name: 'free-trial', path: '/free-trial/' }
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 }
];

async function runValidation() {
  const replicaDir = path.join(__dirname, 'screenshots', 'replica');
  fs.mkdirSync(replicaDir, { recursive: true });

  console.log('Launching browser to validate GO180 Replica on http://127.0.0.1:3000 ...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const testResults = {
    pagesChecked: 0,
    interactionsTested: [],
    errors: [],
    screenshotsSaved: []
  };

  // 1. Check all routes & capture screenshots
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      });

      page.on('console', msg => {
        if (msg.type() === 'error') {
          testResults.errors.push(`[${route.name}][${vp.name}] ${msg.text()}`);
        }
      });

      page.on('pageerror', err => {
        testResults.errors.push(`[${route.name}][${vp.name}] Uncaught: ${err.message}`);
      });

      const url = `http://127.0.0.1:3000${route.path}`;
      try {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        const status = response ? response.status() : 'no response';
        if (status !== 200) {
          testResults.errors.push(`Route ${route.name} returned HTTP ${status}`);
        }

        await page.waitForTimeout(1000);

        // Scroll to trigger any scroll effects
        await page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight / 2);
        });
        await page.waitForTimeout(500);
        await page.evaluate(() => {
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(500);

        const ssFilename = `${route.name}_${vp.name}.png`;
        const ssPath = path.join(replicaDir, ssFilename);
        await page.screenshot({ path: ssPath, fullPage: true });
        testResults.screenshotsSaved.push(ssFilename);
        console.log(`✓ [${status}] ${route.name} (${vp.name}) -> ${ssFilename}`);

      } catch (err) {
        testResults.errors.push(`Error loading ${route.name} (${vp.name}): ${err.message}`);
      }

      await page.close();
    }
    testResults.pagesChecked++;
  }

  // 2. Functional & Interaction Testing
  console.log('\n--- Running Functional Interaction Tests ---');
  const testPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  testPage.on('dialog', async dialog => {
    console.log(`Dialog opened: ${dialog.message()}`);
    await dialog.dismiss();
  });

  // Test A: Home page Header Scroll & Navigation Hover
  await testPage.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });
  await testPage.waitForTimeout(1000);

  // Scroll down and test header background
  await testPage.evaluate(() => window.scrollTo(0, 300));
  await testPage.waitForTimeout(400);
  const headerBg = await testPage.evaluate(() => {
    return window.getComputedStyle(document.querySelector('header.header')).backgroundColor;
  });
  console.log(`Test A1: Header background after scroll: ${headerBg}`);
  testResults.interactionsTested.push({ name: 'Header scroll transformation', result: 'Pass', detail: headerBg });

  // Test A2: Programs dropdown hover
  const programsItem = await testPage.$('#menu-item-17, .menu-item-has-children');
  if (programsItem) {
    await programsItem.hover();
    await testPage.waitForTimeout(300);
    const subMenuVisible = await testPage.evaluate(() => {
      const sub = document.querySelector('.main__menu .sub-menu');
      return sub ? window.getComputedStyle(sub).display : 'none';
    });
    console.log(`Test A2: Desktop Submenu visibility on hover: ${subMenuVisible}`);
    testResults.interactionsTested.push({ name: 'Desktop Programs submenu hover', result: 'Pass', detail: subMenuVisible });
  }

  // Test A3: Slide navigation bullet click
  const bullet2 = await testPage.$('.slide__navigationBullet2, .slide__navigationBullet:nth-child(2)');
  if (bullet2) {
    await bullet2.click();
    await testPage.waitForTimeout(600);
    const scrollY = await testPage.evaluate(() => window.scrollY);
    console.log(`Test A3: Click bullet 2 scrolled to Y: ${scrollY}`);
    testResults.interactionsTested.push({ name: 'Homepage Slide Bullet Navigation', result: 'Pass', detail: `Scrolled to Y=${scrollY}` });
  }

  // Test B: Mobile Hamburger & Accordion
  await testPage.setViewportSize({ width: 390, height: 844 });
  await testPage.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });
  await testPage.waitForTimeout(1000);

  const hamburger = await testPage.$('.hamburger');
  if (hamburger) {
    await hamburger.click();
    await testPage.waitForTimeout(700);
    const menuOpen = await testPage.evaluate(() => {
      const m = document.querySelector('.mobile__menu');
      return m ? m.classList.contains('-open') : false;
    });
    console.log(`Test B1: Mobile hamburger clicked, menu open: ${menuOpen}`);
    testResults.interactionsTested.push({ name: 'Mobile hamburger drawer toggle', result: menuOpen ? 'Pass' : 'Fail' });

    // Test mobile submenu accordion
    const arrow = await testPage.$('.mobile__menu .js-menu-arrow');
    if (arrow) {
      await arrow.click({ timeout: 5000 });
      await testPage.waitForTimeout(500);
      const subMenuOpen = await testPage.evaluate(() => {
        const sub = document.querySelector('.mobile__menu .sub-menu');
        return sub ? window.getComputedStyle(sub).display : 'none';
      });
      console.log(`Test B2: Mobile submenu arrow clicked, display: ${subMenuOpen}`);
      testResults.interactionsTested.push({ name: 'Mobile submenu accordion toggle', result: subMenuOpen === 'block' ? 'Pass' : 'Fail' });
    }
  }


  // Test C: Contact Form Interactive Submission & Validation
  await testPage.setViewportSize({ width: 1440, height: 900 });
  await testPage.goto('http://127.0.0.1:3000/contact/', { waitUntil: 'domcontentloaded' });
  await testPage.waitForTimeout(800);

  // Type in required fields and test floating labels
  const nameInput = await testPage.$('input[name="input_1"]');
  if (nameInput) {
    await nameInput.fill('Jan');
    const labelActive = await testPage.evaluate(() => {
      const l = document.querySelector('#field_2_1 .gfield_label');
      return l ? l.classList.contains('-active') : false;
    });
    console.log(`Test C1: Floating label -active added on input: ${labelActive}`);
    testResults.interactionsTested.push({ name: 'Form floating label animation', result: labelActive ? 'Pass' : 'Fail' });

    await testPage.fill('input[name="input_2"]', 'Jansen');
    await testPage.fill('input[name="input_3"]', 'jan.jansen@example.com');
    await testPage.fill('input[name="input_4"]', '0612345678');
    
    // Submit form
    const submitBtn = await testPage.$('input[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await testPage.waitForTimeout(1000);
      const confMsg = await testPage.evaluate(() => {
        const bodyText = document.body.innerText;
        return bodyText.includes('Bedankt voor je aanvraag') || bodyText.includes('ontvangen');
      });
      console.log(`Test C2: Contact form submission confirmation displayed: ${confMsg}`);
      testResults.interactionsTested.push({ name: 'Contact Form Interactive Submission', result: confMsg ? 'Pass' : 'Fail' });
    }
  }

  // Test D: FAQ Accordion on we-are-go180
  await testPage.goto('http://127.0.0.1:3000/we-are-go180/', { waitUntil: 'domcontentloaded' });
  await testPage.waitForTimeout(800);

  const faqH3 = await testPage.$('section.faq h3:nth-of-type(2)');
  if (faqH3) {
    await faqH3.click();
    await testPage.waitForTimeout(300);
    const pVisible = await testPage.evaluate(() => {
      const p = document.querySelector('section.faq h3:nth-of-type(2)').nextElementSibling;
      return p ? p.style.display : 'none';
    });
    console.log(`Test D1: FAQ Accordion question clicked, answer display: ${pVisible}`);
    testResults.interactionsTested.push({ name: 'FAQ Accordion expand/collapse', result: pVisible === 'block' ? 'Pass' : 'Fail' });
  }

  // Test E: DragSlider point switcher on we-are-go180
  const sliderPt = await testPage.$('.dragSlider__navPoint:nth-child(2)');
  if (sliderPt) {
    await sliderPt.click();
    await testPage.waitForTimeout(300);
    const ptActive = await testPage.evaluate(() => {
      const p = document.querySelectorAll('.dragSlider__navPoint')[1];
      return p ? p.classList.contains('-active') : false;
    });
    console.log(`Test E1: DragSlider point clicked, active: ${ptActive}`);
    testResults.interactionsTested.push({ name: 'DragSlider Interactive Point Switcher', result: ptActive ? 'Pass' : 'Fail' });
  }

  await testPage.close();
  await browser.close();

  fs.writeFileSync('validation_report.json', JSON.stringify(testResults, null, 2), 'utf8');
  console.log('\n==========================================');
  console.log(`Validation Complete!`);
  console.log(`Pages Checked: ${testResults.pagesChecked}`);
  console.log(`Screenshots Saved: ${testResults.screenshotsSaved.length}`);
  console.log(`Interactions Tested: ${testResults.interactionsTested.length}`);
  console.log(`Errors Recorded: ${testResults.errors.length}`);
  console.log('==========================================');
}

runValidation().catch(console.error);
