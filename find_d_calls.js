const fs = require('fs');
const code = fs.readFileSync('public/js/original_main.js', 'utf8');

const regex = /\bd\(\)/g;
let m;
while ((m = regex.exec(code)) !== null) {
  console.log('Call to d() at:', m.index, code.slice(m.index - 50, m.index + 50));
}
