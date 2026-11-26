const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testCrop() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const srcImage = path.resolve('public/images/indian_fitness/indian_coaches_trainers_group.jpg');
  const base64 = fs.readFileSync(srcImage).toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64}`;

  const croppedDataUrl = await page.evaluate(async (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Crop left side: male coach (e.g. x: 150, y: 50, w: 450, h: 600) -> 3:4 portrait
        const canvas = document.createElement('canvas');
        canvas.width = 760;
        canvas.height = 990;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Let's crop male coach
        ctx.drawImage(img, 100, 20, 550, 720, 0, 0, 760, 990);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.src = url;
    });
  }, dataUrl);

  const base64Data = croppedDataUrl.replace(/^data:image\/jpeg;base64,/, '');
  fs.writeFileSync('public/images/indian_fitness/coach_crop_test.jpg', base64Data, 'base64');
  console.log('Saved coach_crop_test.jpg successfully! Size:', fs.statSync('public/images/indian_fitness/coach_crop_test.jpg').size);

  await browser.close();
}

testCrop().catch(console.error);
