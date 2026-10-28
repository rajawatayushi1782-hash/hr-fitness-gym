const fs = require('fs');
const homeHtml = fs.readFileSync('public/pages/home.html', 'utf8');

const footerStart = homeHtml.indexOf('<footer');
const footerEnd = homeHtml.indexOf('</footer>');
console.log('FOOTER HTML:');
console.log(homeHtml.slice(footerStart, footerEnd + 9));
