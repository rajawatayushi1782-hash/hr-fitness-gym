const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const screenshotDir = path.join(__dirname, 'screenshots', 'carousels_verification');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const viewports = [
  { name: 'Desktop', width: 1440, height: 900 },
  { name: 'Laptop', width: 1280, height: 800 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile-430', width: 430, height: 932 },
  { name: 'Mobile-390', width: 390, height: 844 },
  { name: 'Mobile-375', width: 375, height: 812 }
];

async function scrollToSelector(page, selector) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return;
    if (window.locomotive && window.locomotive.scroll && typeof window.locomotive.scroll.scrollTo === 'function') {
      window.locomotive.scroll.scrollTo(el, { duration: 0, disableLerp: true });
    } else if (window.locomotive && typeof window.locomotive.scrollTo === 'function') {
      window.locomotive.scrollTo(el, { duration: 0, disableLerp: true });
    } else {
      el.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
  }, selector);
  await page.waitForTimeout(800);
}

async function runTestSuite() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = [];

  for (const vp of viewports) {
    console.log(`\n========================================`);
    console.log(`Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`========================================`);

    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height }
    });
    const page = await context.newPage();

    const vpResult = {
      viewport: vp.name,
      dimensions: `${vp.width}x${vp.height}`,
      tests: {}
    };

    // ----------------------------------------------------
    // TEST 1: Reviews Swiper Carousel on Homepage (/)
    // ----------------------------------------------------
    try {
      console.log(`[${vp.name}] Testing Reviews Swiper on /...`);
      await page.goto('http://localhost:3000/', { waitUntil: 'load' });
      await page.waitForTimeout(1500);

      await scrollToSelector(page, '.swiper');

      const initialTrans = await page.evaluate(() => document.querySelector('.swiper-wrapper').style.transform);
      await page.screenshot({ path: path.join(screenshotDir, `${vp.name}_reviews_initial.png`) });

      // Click Next
      await page.evaluate(() => {
        const nextBtn = document.querySelector('.es-carousel-arrow-control-container-next');
        if (nextBtn) nextBtn.click();
      });
      await page.waitForTimeout(800);
      const afterNextTrans = await page.evaluate(() => document.querySelector('.swiper-wrapper').style.transform);

      // Click Prev
      await page.evaluate(() => {
        const prevBtn = document.querySelector('.es-carousel-arrow-control-container-previous');
        if (prevBtn) prevBtn.click();
      });
      await page.waitForTimeout(800);
      const afterPrevTrans = await page.evaluate(() => document.querySelector('.swiper-wrapper').style.transform);

      // Mouse/Touch Drag
      const swiperBox = await page.evaluate(() => {
        const el = document.querySelector('.swiper');
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      });

      if (swiperBox && swiperBox.height > 0) {
        const startX = swiperBox.x + Math.min(250, swiperBox.width * 0.7);
        const startY = swiperBox.y + swiperBox.height / 2;
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(startX - 180, startY, { steps: 12 });
        await page.mouse.up();
        await page.waitForTimeout(800);
      }
      const afterDragTrans = await page.evaluate(() => document.querySelector('.swiper-wrapper').style.transform);
      await page.screenshot({ path: path.join(screenshotDir, `${vp.name}_reviews_after_drag.png`) });

      // Test Vertical Page Scrolling remains functional
      const scrollBefore = await page.evaluate(() => {
        if (window.locomotive && window.locomotive.scroll && window.locomotive.scroll.instance) {
          return window.locomotive.scroll.instance.scroll.y;
        }
        return window.scrollY;
      });

      await page.evaluate(() => {
        if (window.locomotive && window.locomotive.scroll && typeof window.locomotive.scroll.scrollTo === 'function') {
          window.locomotive.scroll.scrollTo(2500, { duration: 0, disableLerp: true });
        } else if (window.locomotive && typeof window.locomotive.scrollTo === 'function') {
          window.locomotive.scrollTo(2500, { duration: 0, disableLerp: true });
        } else {
          window.scrollTo(0, 2500);
        }
      });
      await page.waitForTimeout(500);

      const scrollAfter = await page.evaluate(() => {
        if (window.locomotive && window.locomotive.scroll && window.locomotive.scroll.instance) {
          return window.locomotive.scroll.instance.scroll.y;
        }
        return window.scrollY;
      });

      const swiperPassed = (initialTrans !== afterNextTrans && afterNextTrans !== afterPrevTrans && afterDragTrans !== initialTrans);
      const verticalScrollOk = (scrollAfter !== scrollBefore);

      vpResult.tests.reviewsSwiper = {
        passed: swiperPassed,
        verticalScrollPassed: verticalScrollOk,
        initial: initialTrans,
        afterNext: afterNextTrans,
        afterPrev: afterPrevTrans,
        afterDrag: afterDragTrans
      };
      console.log(`[${vp.name}] Reviews Swiper: ${swiperPassed ? 'PASSED' : 'FAILED'} (Vertical scroll: ${verticalScrollOk ? 'OK' : 'FAIL'})`);
    } catch (err) {
      console.error(`[${vp.name}] Reviews Swiper Error:`, err.message);
      vpResult.tests.reviewsSwiper = { passed: false, error: err.message };
    }

    // ----------------------------------------------------
    // TEST 2: Slick Carousel on /clubs/leeuwarden/
    // ----------------------------------------------------
    try {
      console.log(`[${vp.name}] Testing Slick Carousel on /clubs/leeuwarden/...`);
      await page.goto('http://localhost:3000/clubs/leeuwarden/', { waitUntil: 'load' });
      await page.waitForTimeout(1500);

      await scrollToSelector(page, '.carousel');

      const slickInitial = await page.evaluate(() => {
        const t = document.querySelector('.slick-track');
        return t ? t.style.transform : null;
      });
      await page.screenshot({ path: path.join(screenshotDir, `${vp.name}_slick_initial.png`) });

      // Click Slick Next Arrow
      await page.evaluate(() => {
        const next = document.querySelector('.carousel__next');
        if (next) next.click();
      });
      await page.waitForTimeout(800);
      const slickAfterNext = await page.evaluate(() => {
        const t = document.querySelector('.slick-track');
        return t ? t.style.transform : null;
      });

      // Click Slick Prev Arrow
      await page.evaluate(() => {
        const prev = document.querySelector('.carousel__prev');
        if (prev) prev.click();
      });
      await page.waitForTimeout(800);
      const slickAfterPrev = await page.evaluate(() => {
        const t = document.querySelector('.slick-track');
        return t ? t.style.transform : null;
      });

      // Click a Dot
      await page.evaluate(() => {
        const dots = document.querySelectorAll('.slick-dots li button');
        if (dots.length > 2) dots[2].click();
      });
      await page.waitForTimeout(800);
      const slickAfterDot = await page.evaluate(() => {
        const t = document.querySelector('.slick-track');
        return t ? t.style.transform : null;
      });

      // Drag Slick Track
      const trackBox = await page.evaluate(() => {
        const t = document.querySelector('.slick-track');
        const r = t.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      });
      if (trackBox && trackBox.height > 0) {
        const startX = Math.max(100, Math.min(vp.width * 0.7, trackBox.x + 400));
        const startY = trackBox.y + trackBox.height / 2;
        if (startY > 0 && startY < vp.height) {
          await page.mouse.move(startX, startY);
          await page.mouse.down();
          await page.mouse.move(startX - 250, startY, { steps: 12 });
          await page.mouse.up();
          await page.waitForTimeout(800);
        }
      }
      const slickAfterDrag = await page.evaluate(() => {
        const t = document.querySelector('.slick-track');
        return t ? t.style.transform : null;
      });
      await page.screenshot({ path: path.join(screenshotDir, `${vp.name}_slick_after.png`) });

      const slickArrowPassed = (slickInitial !== slickAfterNext);
      const slickDotPassed = (slickAfterDot !== slickAfterPrev);
      const slickPassed = (slickArrowPassed && slickDotPassed);

      vpResult.tests.slickCarousel = {
        passed: slickPassed,
        initial: slickInitial,
        afterNext: slickAfterNext,
        afterPrev: slickAfterPrev,
        afterDot: slickAfterDot,
        afterDrag: slickAfterDrag
      };
      console.log(`[${vp.name}] Slick Carousel: ${slickPassed ? 'PASSED' : 'FAILED'}`);
    } catch (err) {
      console.error(`[${vp.name}] Slick Carousel Error:`, err.message);
      vpResult.tests.slickCarousel = { passed: false, error: err.message };
    }

    // ----------------------------------------------------
    // TEST 3: GSAP DragSlider on /we-are-go180/
    // ----------------------------------------------------
    try {
      console.log(`[${vp.name}] Testing DragSlider on /we-are-go180/...`);
      await page.goto('http://localhost:3000/we-are-go180/', { waitUntil: 'load' });
      await page.waitForTimeout(1500);

      await scrollToSelector(page, '.dragSlider');

      const dragSliderInitial = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.dragSlider__slide')).map(s => s.style.transform);
      });
      await page.screenshot({ path: path.join(screenshotDir, `${vp.name}_dragslider_initial.png`) });

      // Click NavPoint 1
      await page.evaluate(() => {
        const pt1 = document.querySelector('.dragSlider__navPoint[data-slide-index="1"]');
        if (pt1) pt1.click();
      });
      await page.waitForTimeout(1000);

      const dragSliderAfterPt1 = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.dragSlider__slide')).map(s => s.style.transform);
      });

      // Mouse drag on .dragSlider__viewer
      const viewerBox = await page.evaluate(() => {
        const v = document.querySelector('.dragSlider__viewer');
        const r = v.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      });
      if (viewerBox && viewerBox.height > 0) {
        const startX = Math.max(50, Math.min(vp.width * 0.7, viewerBox.x + 300));
        const startY = viewerBox.y + viewerBox.height / 2;
        if (startY > 0 && startY < vp.height) {
          await page.mouse.move(startX, startY);
          await page.mouse.down();
          await page.mouse.move(startX - 200, startY, { steps: 12 });
          await page.mouse.up();
          await page.waitForTimeout(1000);
        }
      }

      const dragSliderAfterDrag = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.dragSlider__slide')).map(s => s.style.transform);
      });
      await page.screenshot({ path: path.join(screenshotDir, `${vp.name}_dragslider_after.png`) });

      const navPointPassed = (JSON.stringify(dragSliderInitial) !== JSON.stringify(dragSliderAfterPt1));
      const dragSliderPassed = navPointPassed;

      vpResult.tests.dragSlider = {
        passed: dragSliderPassed,
        initial: dragSliderInitial,
        afterPt1: dragSliderAfterPt1,
        afterDrag: dragSliderAfterDrag
      };
      console.log(`[${vp.name}] DragSlider: ${dragSliderPassed ? 'PASSED' : 'FAILED'}`);
    } catch (err) {
      console.error(`[${vp.name}] DragSlider Error:`, err.message);
      vpResult.tests.dragSlider = { passed: false, error: err.message };
    }

    results.push(vpResult);
    await context.close();
  }

  await browser.close();

  fs.writeFileSync('multi_viewport_verification_results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\n========================================');
  console.log('ALL VIEWPORTS VERIFICATION COMPLETE!');
  console.log('Results saved to multi_viewport_verification_results.json');
  console.log('Screenshots saved to screenshots/carousels_verification/');
  console.log('========================================');
}

runTestSuite().catch(err => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
