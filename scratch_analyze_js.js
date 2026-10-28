const fs = require('fs');
const path = require('path');

const js = fs.readFileSync(path.join(__dirname, 'public', 'js', 'original_main.js'), 'utf8');

// Look for class names, slider logic, transitions, barba, locomotive
function findInJs(term, maxResults = 5) {
  let idx = 0;
  const results = [];
  while ((idx = js.indexOf(term, idx)) !== -1 && results.length < maxResults) {
    const start = Math.max(0, idx - 100);
    const end = Math.min(js.length, idx + 200);
    results.push(js.slice(start, end));
    idx += term.length;
  }
  return results;
}

console.log('=== Locomotive Scroll initialization in main.js ===');
findInJs('LocomotiveScroll', 3).forEach((r, i) => console.log(`[${i}]:\n${r}\n`));

console.log('=== Barba initialization in main.js ===');
findInJs('barba.init', 3).forEach((r, i) => console.log(`[${i}]:\n${r}\n`));

console.log('=== Slide navigation / slider in main.js ===');
findInJs('slide__navigation', 3).forEach((r, i) => console.log(`[${i}]:\n${r}\n`));
findInJs('slide__holder', 3).forEach((r, i) => console.log(`[${i}]:\n${r}\n`));

console.log('=== Wipe in main.js ===');
findInJs('.wipe', 3).forEach((r, i) => console.log(`[${i}]:\n${r}\n`));
