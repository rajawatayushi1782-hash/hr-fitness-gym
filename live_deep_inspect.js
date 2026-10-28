const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROUTES = [
  { name: 'home', url: 'https://go180.nl/' },
  { name: 'we-are-go180', url: 'https://go180.nl/we-are-go180/' },
  { name: 'programs', url: 'https://go180.nl/programs/' },
  { name: 'programs-essentials', url: 'https://go180.nl/programs/essentials/' },
  { name: 'coaches', url: 'https://go180.nl/coaches/' },
  { name: 'club-leeuwarden', url: 'https://go180.nl/clubs/leeuwarden/' },
  { name: 'stories', url: 'https://go180.nl/stories/' },
  { name: 'pricing', url: 'https://go180.nl/pricing/' },
  { name: 'contact', url: 'https://go180.nl/contact/' },
  { name: 'join-now', url: 'https://go180.nl/join-now/' },
  { name: 'free-trial', url: 'https://go180.nl/free-trial/' }
];

async function deepInspect() {
  console.log('Launching installed Chrome for deep inspection...');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const screenshotsDir = path.join(__dirname, 'screenshots', 'original_deep');
  fs.mkdirSync(screenshotsDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  // 1. Inspect Homepage Initial Loading & Animations
  console.log('Inspecting Homepage loading sequence...');
  const logs = [];
  page.on('console', msg => logs.push({ type: msg.type(), text: msg.text() }));

  await page.goto('https://go180.nl/', { waitUntil: 'domcontentloaded' });

  // Capture preloader or initial state immediately
  await page.screenshot({ path: path.join(screenshotsDir, '01_dom_content_loaded.png') });

  // Wait 1 second
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '02_after_1s.png') });

  // Wait 3 seconds for full load
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(screenshotsDir, '03_fully_loaded.png') });

  // Dismiss popup if open
  try {
    const pumClose = await page.$('.pum-close');
    if (pumClose) await pumClose.click();
  } catch (e) {}

  // Analyze page architecture and animations
  const techStackDetails = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script')).map(s => ({
      id: s.id,
      src: s.src,
      isInline: !s.src,
      snippet: s.innerText ? s.innerText.slice(0, 150) : ''
    }));

    const stylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href);

    // Check globals
    const globals = {
      hasJQuery: typeof window.jQuery !== 'undefined',
      jQueryVersion: typeof window.jQuery !== 'undefined' ? window.jQuery.fn.jquery : null,
      hasGSAP: typeof window.gsap !== 'undefined',
      hasScrollTrigger: typeof window.ScrollTrigger !== 'undefined',
      hasLocomotive: typeof window.LocomotiveScroll !== 'undefined' || typeof window.locomotive !== 'undefined' || document.documentElement.classList.contains('has-scroll-smooth'),
      hasBarba: typeof window.barba !== 'undefined',
      hasSlick: typeof window.jQuery !== 'undefined' && typeof window.jQuery.fn.slick !== 'undefined',
      bodyClasses: document.body.className,
      htmlClasses: document.documentElement.className,
      dataScrollContainer: !!document.querySelector('[data-scroll-container]'),
      scrollSectionsCount: document.querySelectorAll('[data-scroll-section]').length,
      dataScrollCount: document.querySelectorAll('[data-scroll]').length,
      bulletsCount: document.querySelectorAll('.slide__navigationBullet').length,
      slidesCount: document.querySelectorAll('.slide').length
    };

    // Locomotive scroll instance info if attached
    let locoInfo = null;
    if (window.locomotive || window.scroll || window.lscroll) {
      locoInfo = 'Locomotive found on window';
    }

    // Inspect CSS Custom Properties
    const computedRoot = window.getComputedStyle(document.documentElement);
    const rootVariables = {};
    for (let i = 0; i < computedRoot.length; i++) {
      const prop = computedRoot[i];
      if (prop.startsWith('--')) {
        rootVariables[prop] = computedRoot.getPropertyValue(prop).trim();
      }
    }

    return { scripts, stylesheets, globals, rootVariables, locoInfo };
  });

  console.log('Homepage Tech Stack Details:');
  console.log('Globals:', JSON.stringify(techStackDetails.globals, null, 2));

  // 2. Test Slide Navigation & Scroll behavior
  console.log('\nTesting Slide Bullets & Smooth Scroll...');
  const bullets = await page.$$('.slide__navigationBullet');
  console.log(`Found ${bullets.length} bullets.`);
  if (bullets.length > 1) {
    console.log('Clicking bullet 2...');
    await bullets[1].click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(screenshotsDir, '04_bullet2_clicked.png') });

    const scrollYAfterBullet2 = await page.evaluate(() => {
      const scrollContainer = document.querySelector('[data-scroll-container]');
      return {
        windowScrollY: window.scrollY,
        htmlScrollTop: document.documentElement.scrollTop,
        transform: scrollContainer ? scrollContainer.style.transform : 'none',
        htmlClass: document.documentElement.className,
        activeBulletIdx: Array.from(document.querySelectorAll('.slide__navigationBullet')).findIndex(b => b.classList.contains('-active'))
      };
    });
    console.log('State after bullet 2 click:', scrollYAfterBullet2);
  }

  // 3. Test Navigation Menu / Hover / Dropdown
  console.log('\nTesting Header & Dropdown...');
  const menuItems = await page.$$('.main__menu .menu-item');
  console.log(`Found ${menuItems.length} menu items.`);
  const hasChildren = await page.$('.main__menu .menu-item-has-children');
  if (hasChildren) {
    await hasChildren.hover();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(screenshotsDir, '05_dropdown_hover.png') });
  }

  // 4. Test Mobile Hamburger Menu (Resize to 390x844)
  console.log('\nTesting Mobile Viewport (390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotsDir, '06_mobile_initial.png') });

  const hamburger = await page.$('.hamburger, .header__hamburger, .menu-toggle, [class*="hamburger"]');
  if (hamburger) {
    console.log('Clicking mobile hamburger...');
    await hamburger.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotsDir, '07_mobile_menu_open.png') });
  }

  // Save full tech stack & inspection report
  fs.writeFileSync(
    path.join(__dirname, 'live_tech_stack_report.json'),
    JSON.stringify({ techStackDetails, logs }, null, 2)
  );

  console.log('Deep inspection complete. Saved to live_tech_stack_report.json and screenshots/original_deep/');
  await browser.close();
}

deepInspect().catch(console.error);
