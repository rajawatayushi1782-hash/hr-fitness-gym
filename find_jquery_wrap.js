const fs = require('fs');

const code = fs.readFileSync('public/js/original_main.js', 'utf8');

// Find all occurrences of e(document).ready or function(
let pos = 898000;
while (true) {
  const next = code.indexOf('(jQuery)', pos);
  if (next === -1) break;
  console.log('Found (jQuery) at:', next);
  console.log(code.slice(next - 100, next + 30));
  pos = next + 10;
}
