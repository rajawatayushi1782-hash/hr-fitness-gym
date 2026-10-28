const fs = require('fs');
const html = fs.readFileSync('public/pages/home.html', 'utf8');

let idx = 0;
while ((idx = html.indexOf('totaalmoment voor jezelf', idx)) !== -1) {
  console.log('Match at', idx);
  console.log(html.substring(Math.max(0, idx - 100), idx + 200));
  idx += 25;
}
