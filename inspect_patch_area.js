const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('public/js/original_main.js', 'utf8');

// Let's inspect around _revealPage since that was the only place patched
const idx = code.indexOf('_revealPage');
console.log('Index of _revealPage:', idx);
console.log('Snippet around _revealPage (500 chars):\n');
console.log(code.slice(idx - 50, idx + 1800));
