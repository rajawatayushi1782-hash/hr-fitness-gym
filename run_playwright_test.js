const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");
const routesToTest = [
  { name: "home", path: "/" },
  { name: "facilities", path: "/club-leeuwarden/" },
  { name: "coaches", path: "/coaches/" },
  { name: "programs", path: "/programs/" },
  { name: "essentials", path: "/programs/essentials/" },
  { name: "pricing", path: "/pricing/" },
  { name: "contact", path: "/contact/" },
  { name: "glute_exercises", path: "/stories/beste-glute-oefeningen/" },
  { name: "free_trial", path: "/free-trial/" }
];
const viewports = [
  { name: "desktop_1440x900", width: 1440, height: 900 },
  { name: "laptop_1280x800", width: 1280, height: 800 },
  { name: "tablet_768x1024", width: 768, height: 1024 },
  { name: "mobile_430x932", width: 430, height: 932 },
  { name: "mobile_390x844", width: 390, height: 844 },
  { name: "mobile_375x812", width: 375, height: 812 }
];
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const screenshotDir = path.join(__dirname, "screenshots", "image_audit_final");
  const results = [];
  for (const vp of viewports) {
    console.log("Testing Viewport: " + vp.name + " (" + vp.width + "x" + vp.height + ")");
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    for (const route of routesToTest) {
      const failedRequests = [];
      page.on("response", res => {
        if (res.status() >= 400 && res.url().includes("localhost")) {
          failedRequests.push({ url: res.url(), status: res.status() });
        }
      });
      const url = "http://localhost:3000" + route.path;
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
        await page.waitForTimeout(400);
        await page.evaluate(async () => {
          await new Promise(resolve => {
            let totalHeight = 0;
            const distance = 400;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              if (totalHeight >= scrollHeight) { clearInterval(timer); resolve(); }
            }, 80);
          });
        });
        await page.waitForTimeout(600);
        const imgStats = await page.evaluate(() => {
          const imgs = Array.from(document.querySelectorAll("img"));
          return imgs.map(img => ({
            src: img.currentSrc || img.src,
            naturalWidth: img.naturalWidth,
            isZeroDim: img.naturalWidth === 0 && !img.src.includes("avatar-placeholder") && !img.src.includes(".svg")
          }));
        });
        const zeroWidthImgs = imgStats.filter(i => i.isZeroDim);
        const shotName = route.name + "_" + vp.name + ".png";
        await page.screenshot({ path: path.join(screenshotDir, shotName), fullPage: true });
        const resObj = { viewport: vp.name, route: route.path, totalImages: imgStats.length, brokenImages: zeroWidthImgs.length, failedRequests: failedRequests.length, screenshot: shotName };
        results.push(resObj);
        console.log("[" + vp.name + "] " + route.path + " -> " + imgStats.length + " imgs, " + zeroWidthImgs.length + " broken, " + failedRequests.length + " failed reqs");
      } catch(e) {
        console.log("Error testing " + route.path + ": " + e.message);
      }
    }
    await context.close();
  }
  await browser.close();
  fs.writeFileSync("playwright_verification_results.json", JSON.stringify(results, null, 2), "utf8");
  console.log("
All Playwright verification completed!");
})();