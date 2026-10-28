const fs = require('fs');
const css = fs.readFileSync('public/css/main.css', 'utf8');

let idx = 0;
while ((idx = css.indexOf('@font-face', idx)) !== -1) {
  console.log(css.substring(idx, idx + 400));
  console.log('------------------------------');
  idx += 10;
}

let h1Idx = 0;
while ((h1Idx = css.indexOf('.h1', h1Idx)) !== -1) {
  console.log(css.substring(Math.max(0, h1Idx - 50), Math.min(css.length, h1Idx + 250)));
  console.log('------------------------------');
  h1Idx += 10;
}