const vm = require('vm');
const fs = require('fs');

const content = fs.readFileSync('public/js/original_main.js', 'utf8');

try {
  new vm.Script(content, { filename: 'public/js/original_main.js' });
  console.log('Valid syntax!');
} catch (err) {
  console.error('Syntax error at:', err.message);
  console.error(err.stack);
}
