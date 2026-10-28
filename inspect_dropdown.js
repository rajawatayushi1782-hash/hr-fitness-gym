const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function inspectDropdown() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const urls = [
    { label: 'original', url: 'https://go180.nl/' },
    { label: 'clone', url: 'http://127.0.0.1:3000/' }
  ];

  for (const target of urls) {
    console.log(`\n================ Inspecting ${target.label} (${target.url}) ================`);
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    try {
      await page.goto(target.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2000);

      // Find Programs menu item
      const programsSelector = '.main__menu .menu-item-has-children, #menu-item-17';
      const programsEl = await page.$(programsSelector);

      if (!programsEl) {
        console.log(`[${target.label}] Programs menu item not found with selector: ${programsSelector}`);
        continue;
      }

      // Hover over Programs
      await programsEl.hover();
      await page.waitForTimeout(600);

      // Inspect dropdown details
      const details = await page.evaluate(() => {
        const item = document.querySelector('.main__menu .menu-item-has-children, #menu-item-17');
        const sub = item ? item.querySelector('.sub-menu') : null;
        if (!sub) return { error: 'sub-menu not found' };

        const itemRect = item.getBoundingClientRect();
        const subRect = sub.getBoundingClientRect();
        const subStyle = window.getComputedStyle(sub);
        
        // Before element (notch / pointer)
        const beforeStyle = window.getComputedStyle(sub, '::before');

        // Items inside
        const links = Array.from(sub.querySelectorAll('li a')).map(a => {
          const aStyle = window.getComputedStyle(a);
          const liStyle = window.getComputedStyle(a.closest('li'));
          const rect = a.getBoundingClientRect();
          return {
            text: a.innerText.trim(),
            href: a.getAttribute('href'),
            fontSize: aStyle.fontSize,
            fontWeight: aStyle.fontWeight,
            lineHeight: aStyle.lineHeight,
            fontFamily: aStyle.fontFamily,
            color: aStyle.color,
            whiteSpace: aStyle.whiteSpace,
            width: rect.width,
            height: rect.height,
            liMargin: liStyle.margin,
            liPadding: liStyle.padding
          };
        });

        return {
          itemRect: {
            left: itemRect.left,
            top: itemRect.top,
            width: itemRect.width,
            height: itemRect.height
          },
          subRect: {
            left: subRect.left,
            top: subRect.top,
            width: subRect.width,
            height: subRect.height
          },
          styles: {
            position: subStyle.position,
            top: subStyle.top,
            left: subStyle.left,
            transform: subStyle.transform,
            display: subStyle.display,
            visibility: subStyle.visibility,
            opacity: subStyle.opacity,
            backgroundColor: subStyle.backgroundColor,
            borderRadius: subStyle.borderRadius,
            boxShadow: subStyle.boxShadow,
            padding: subStyle.padding,
            minWidth: subStyle.minWidth,
            maxWidth: subStyle.maxWidth,
            zIndex: subStyle.zIndex,
            whiteSpace: subStyle.whiteSpace
          },
          notch: {
            content: beforeStyle.content,
            position: beforeStyle.position,
            top: beforeStyle.top,
            left: beforeStyle.left,
            width: beforeStyle.width,
            height: beforeStyle.height,
            backgroundColor: beforeStyle.backgroundColor,
            transform: beforeStyle.transform,
            boxShadow: beforeStyle.boxShadow
          },
          links
        };
      });

      console.log(`[${target.label}] Details:`, JSON.stringify(details, null, 2));

      // Take targeted screenshot of header + dropdown area
      const clipRect = {
        x: Math.max(0, Math.floor(details.subRect ? details.subRect.left - 50 : 200)),
        y: 0,
        width: 350,
        height: Math.floor(details.subRect ? details.subRect.top + details.subRect.height + 60 : 600)
      };

      const ssPath = path.join(__dirname, 'screenshots', `dropdown_${target.label}.png`);
      await page.screenshot({ path: ssPath, clip: clipRect });
      console.log(`Saved screenshot to ${ssPath}`);

      // Also take full viewport screenshot
      const fullVpPath = path.join(__dirname, 'screenshots', `header_dropdown_${target.label}.png`);
      await page.screenshot({ path: fullVpPath, clip: { x: 0, y: 0, width: 1440, height: 600 } });
      console.log(`Saved header viewport screenshot to ${fullVpPath}`);

    } catch (err) {
      console.error(`[${target.label}] Error:`, err);
    } finally {
      await page.close();
    }
  }

  await browser.close();
}

inspectDropdown().catch(console.error);
