const fs = require('fs');
const content = fs.readFileSync('./public/js/original_main.js', 'utf8');
console.log(content.substring(883200, 886350));
