const fs = require('fs');
const html = fs.readFileSync('public/pages/programs-adaptable.html', 'utf8');

const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
console.log('Adaptable H1:', h1Match ? h1Match[0] : 'NONE');
