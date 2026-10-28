const fs = require('fs');
const path = require('path');

const js = fs.readFileSync(path.join(__dirname, 'public', 'js', 'original_main.js'), 'utf8');

// Find where Barba, GSAP, or page init happens
// Look for strings around ".wipe", "slide__navigationBullet", "new "
const wipeIdx = js.indexOf('.wipe');
console.log('Context around .wipe (500 chars before, 1500 chars after):');
console.log(js.slice(Math.max(0, wipeIdx - 500), wipeIdx + 1500));
