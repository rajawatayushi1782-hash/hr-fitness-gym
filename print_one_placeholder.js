const fs = require('fs');
const c = fs.readFileSync('./public/pages/coach-annick-douma.html', 'utf8');
const pos = c.indexOf('data:image/svg');
if (pos !== -1) {
  console.log(c.substring(pos - 100, pos + 150));
}
