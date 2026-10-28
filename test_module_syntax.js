const fs = require('fs');

const code = fs.readFileSync('public/js/original_main.js', 'utf8');

// Let's find the exact syntax error by testing chunks using node
// We know the error is in the last function/module of webpack bundle!
// Let's find where the last module starts and ends.

const idx = code.indexOf('_revealPage');

// Let's search backward for the function opening of this module
const moduleStart = code.lastIndexOf('function(', idx);
console.log('Module starts at:', moduleStart);

// Let's search forward for the module end
const moduleEnd = code.indexOf('},', idx);
console.log('Module ends at:', moduleEnd);

const moduleCode = code.slice(moduleStart, moduleEnd + 1);
console.log('Testing moduleCode syntax...');
try {
  new Function('e', 't', 'n', moduleCode.slice(moduleCode.indexOf('{') + 1, -1));
  console.log('Module code alone is VALID syntax!');
} catch (e) {
  console.log('Module syntax error:', e.message);
}
