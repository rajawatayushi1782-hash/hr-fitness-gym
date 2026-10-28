const fs = require('fs');
const css = fs.readFileSync('public/css/main.css', 'utf8');

const idx = css.indexOf('.slide__line');
console.log(css.substring(idx - 50, idx + 250));
