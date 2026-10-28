const fs = require('fs');
const c = fs.readFileSync('public/pages/programs-adaptable.html', 'utf8');

const carIdx = c.indexOf('class="carousel');
const carEnd = c.indexOf('nextPage', carIdx);

console.log(c.substring(carIdx, carEnd + 200));
