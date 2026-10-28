const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  console.log('Navigating to https://go180.nl/ ...');
  await page.goto('https://go180.nl/', { waitUntil: 'domcontentloaded', timeout: 35000 });
  await page.waitForTimeout(4000);

  // Hover over Programs
  const progLocator = page.locator('.menu-item:has-text("Programs"), nav a:has-text("Programs")').first();
  await progLocator.hover();
  await page.waitForTimeout(1000);

  if (!fs.existsSync('screenshots/comparison')) {
    fs.mkdirSync('screenshots/comparison', { recursive: true });
  }
  await page.screenshot({ path: 'screenshots/comparison/live_programs_dropdown.png' });
  console.log('Captured screenshots/comparison/live_programs_dropdown.png');

  const dropdownDetails = await page.evaluate(() => {
    // Find the programs menu item
    const allMenuItems = Array.from(document.querySelectorAll('.menu-item, li'));
    const progLi = allMenuItems.find(el => {
      const a = el.querySelector('a');
      return a && a.innerText.trim().toLowerCase() === 'programs';
    }) || allMenuItems.find(el => el.innerText.trim().startsWith('Programs'));

    if (!progLi) return { error: 'No Programs item found' };

    const sub = progLi.querySelector('.sub-menu, ul, .dropdown-menu, [class*="sub-menu"]');
    if (!sub) return { error: 'No sub-menu found', progLiHTML: progLi.outerHTML };

    const subComputed = window.getComputedStyle(sub);
    const beforeComputed = window.getComputedStyle(sub, '::before');
    const afterComputed = window.getComputedStyle(sub, '::after');

    const items = Array.from(sub.querySelectorAll('li, a')).map(item => {
      const cs = window.getComputedStyle(item);
      return {
        tag: item.tagName,
        text: item.innerText.trim(),
        href: item.getAttribute('href'),
        className: item.className,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontFamily: cs.fontFamily,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        padding: cs.padding,
        margin: cs.margin,
        color: cs.color,
        display: cs.display,
        whiteSpace: cs.whiteSpace
      };
    });

    return {
      progLiHTML: progLi.outerHTML,
      progLiRect: progLi.getBoundingClientRect(),
      subRect: sub.getBoundingClientRect(),
      subStyles: {
        display: subComputed.display,
        visibility: subComputed.visibility,
        opacity: subComputed.opacity,
        position: subComputed.position,
        top: subComputed.top,
        left: subComputed.left,
        right: subComputed.right,
        bottom: subComputed.bottom,
        width: subComputed.width,
        minWidth: subComputed.minWidth,
        maxWidth: subComputed.maxWidth,
        padding: subComputed.padding,
        margin: subComputed.margin,
        backgroundColor: subComputed.backgroundColor,
        background: subComputed.background,
        borderRadius: subComputed.borderRadius,
        boxShadow: subComputed.boxShadow,
        transform: subComputed.transform,
        transition: subComputed.transition,
        zIndex: subComputed.zIndex,
        border: subComputed.border
      },
      pseudoBefore: {
        content: beforeComputed.content,
        width: beforeComputed.width,
        height: beforeComputed.height,
        border: beforeComputed.border,
        background: beforeComputed.backgroundColor,
        transform: beforeComputed.transform,
        top: beforeComputed.top,
        left: beforeComputed.left
      },
      pseudoAfter: {
        content: afterComputed.content,
        width: afterComputed.width,
        height: afterComputed.height,
        border: afterComputed.border,
        background: afterComputed.backgroundColor,
        transform: afterComputed.transform,
        top: afterComputed.top,
        left: afterComputed.left
      },
      subOuterHTML: sub.outerHTML,
      items
    };
  });

  fs.writeFileSync('live_dropdown_details.json', JSON.stringify(dropdownDetails, null, 2));
  console.log('Saved live_dropdown_details.json');

  await browser.close();
})();
