const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('public/js/original_main.js', 'utf8');

// Binary search to find where the syntax error begins
// Since the entire file is wrapped in !function(e){ ... }({ ... })
// We can test parsing slices from index 898000 to the end.

const idx = code.indexOf('_revealPage');
console.log('_revealPage is at:', idx);

// Let's print chars 898500 to 900500 with line numbers / formatting
const snippet = code.slice(idx - 100, idx + 1500);
console.log('Snippet length:', snippet.length);
console.log(snippet);
