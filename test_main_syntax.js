const fs = require('fs');
const content = fs.readFileSync('public/js/original_main.js', 'utf8');

// Use acorn or basic node parser to find exact line of syntax error
try {
  new Function(content);
  console.log('No syntax error!');
} catch (e) {
  console.log('Error:', e.message);
  console.log(e.stack);
}
