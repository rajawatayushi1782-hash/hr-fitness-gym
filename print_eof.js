const fs = require('fs');
const code = fs.readFileSync('public/js/original_main.js', 'utf8');

console.log('Total file length:', code.length);
console.log('End of file snippet (last 1000 chars):\n');
console.log(code.slice(code.length - 1000));
