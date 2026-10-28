const fs = require('fs');
const c = fs.readFileSync('./public/js/original_main.js', 'utf8');
const searchStr = 'e(window).on("load"';
const pos = c.indexOf(searchStr);
console.log('pos:', pos);
if (pos !== -1) {
  console.log(c.substring(pos, pos + 500));
}
