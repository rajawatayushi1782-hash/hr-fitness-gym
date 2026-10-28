const fs = require('fs');
const c = fs.readFileSync('./public/js/original_main.js', 'utf8');
console.log(c.substring(886300, 887200));
console.log('--- END PART 1 ---');
console.log(c.substring(899000, 900300));
