const fs = require('fs');
const c = fs.readFileSync('./public/pages/home.html', 'utf8');
const re = /<script\b[^>]*\bsrc=["']([^"']+)["']/gi;
let m;
const scripts = [];
while ((m = re.exec(c)) !== null) {
  scripts.push(m[1]);
}
console.log('home.html scripts:', scripts);
