const fs = require('fs');
const html = fs.readFileSync('public/pages/home.html', 'utf8');
let idx = 0;
while ((idx = html.indexOf('slide__title', idx)) !== -1) {
  console.log('--- FOUND AT ' + idx + ' ---');
  console.log(html.substring(Math.max(0, idx - 200), idx + 400));
  idx += 12;
}