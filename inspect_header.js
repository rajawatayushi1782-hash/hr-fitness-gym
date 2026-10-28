const fs = require('fs');
const homeHtml = fs.readFileSync('public/pages/home.html', 'utf8');

const headerStart = homeHtml.indexOf('<header class="header">');
const headerEnd = homeHtml.indexOf('</header>');
console.log('HEADER HTML:');
console.log(homeHtml.slice(headerStart, headerEnd + 9));
