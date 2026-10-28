const fs = require('fs');
const p = './public/pages/home.html';
let content = fs.readFileSync(p, 'utf8');

const updated = content.replace(/https:\/\/phosphor\.utils\.elfsightcdn\.com\/\?url=[^"'\s)]+/g, '/images/avatar-placeholder.svg');
fs.writeFileSync(p, updated, 'utf8');
console.log('Replaced elfsightcdn URLs in home.html with /images/avatar-placeholder.svg');
