const fs = require('fs');
const js = fs.readFileSync('public/js/original_main.js', 'utf8');

let idx = 0;
while ((idx = js.indexOf('slide__titleAnimation', idx)) !== -1) {
  console.log('=== Match at ' + idx + ' ===');
  console.log(js.substring(Math.max(0, idx - 200), Math.min(js.length, idx + 400)));
  idx += 21;
}
