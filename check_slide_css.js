const fs = require('fs');
const css = fs.readFileSync('public/css/main.css', 'utf8');

// Find media queries for slide__title
let idx = 0;
while ((idx = css.indexOf('.slide__title', idx)) !== -1) {
  console.log(css.substring(Math.max(0, idx - 80), idx + 250));
  console.log('---');
  idx += 13;
}
