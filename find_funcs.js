const fs = require('fs');

const code = fs.readFileSync('public/js/original_main.js', 'utf8');

let pos = 890000;
while (pos < 901647) {
  const next = code.indexOf('function(', pos);
  if (next === -1 || next > 901647) break;
  console.log('function( at:', next, code.slice(next, next + 40));
  pos = next + 9;
}
