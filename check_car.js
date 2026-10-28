const fs = require('fs');
const c = fs.readFileSync('public/pages/programs-essentials.html', 'utf8');

const carIdx = c.indexOf('class="carousel');
const carEnd = c.indexOf('</div>\r\n\t\t\t</div>\r\n\t\t</div>', carIdx);
const carEndLF = c.indexOf('</div>\n\t\t\t</div>\n\t\t</div>', carIdx);

console.log(c.substring(carIdx, (carEnd !== -1 ? carEnd : carEndLF) + 30));
