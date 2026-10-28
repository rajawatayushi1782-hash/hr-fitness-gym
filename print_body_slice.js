const fs = require('fs');
const code = fs.readFileSync('public/js/original_main.js', 'utf8');
const idx = code.indexOf('L(),s(),e("body');
console.log('Index:', idx);
console.log(code.slice(idx - 50, idx + 250));
