const fs = require('fs');
const content = fs.readFileSync('original_live_dom.html', 'utf8');

const regex = /<[^>]*data-scroll-id="#bullet-[^>]*>/g;
let m;
while ((m = regex.exec(content)) !== null) {
  console.log(m[0]);
}
