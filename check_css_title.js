const fs = require('fs');
const css = fs.readFileSync('public/css/main.css', 'utf8');

const classes = ['slide__char', 'slide__line', 'slide__titleAnimation', 'slide__title'];

for (const c of classes) {
  let idx = 0;
  while ((idx = css.indexOf('.' + c, idx)) !== -1) {
    console.log('=== CSS rule for .' + c + ' at ' + idx + ' ===');
    console.log(css.substring(Math.max(0, idx - 20), Math.min(css.length, idx + 200)));
    idx += c.length + 1;
  }
}
