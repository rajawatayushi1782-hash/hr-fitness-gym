const fs = require('fs');

const code = fs.readFileSync('public/js/original_main.js', 'utf8');
const idx = code.indexOf('_revealPage');

// Print 600 characters before idx and 600 after
console.log('--- BEFORE ---');
console.log(code.slice(idx - 600, idx));
console.log('--- AFTER ---');
console.log(code.slice(idx, idx + 600));
