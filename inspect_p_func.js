const fs = require('fs');
const code = fs.readFileSync('public/js/original_main.js', 'utf8');

const idx = code.indexOf('.dragSlider__navPointFirst');
// Search backward for function p( or forward
console.log('Search around idx (886564):');
const snippet = code.slice(idx - 1500, idx + 500);
console.log(snippet);
