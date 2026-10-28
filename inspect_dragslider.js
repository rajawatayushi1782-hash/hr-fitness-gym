const fs = require('fs');
const code = fs.readFileSync('public/js/original_main.js', 'utf8');

const idx = code.indexOf('.dragSlider__navPointFirst');
console.log('Index of dragSlider:', idx);

// Print 1500 chars around dragSlider
console.log(code.slice(idx - 300, idx + 2000));
