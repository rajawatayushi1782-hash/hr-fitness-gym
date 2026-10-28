const fs = require('fs');
const filePath = 'public/pages/programs-adaptable.html';
let content = fs.readFileSync(filePath, 'utf8');

const heroImgEnd = content.indexOf('AronWeidenaar_HR–35');
const heroDivEnd = content.indexOf('</div>', heroImgEnd);

const navSvgStart = content.indexOf('<img data-slide-index="2" class="dragSlider__navSVG', heroDivEnd);

console.log('BETWEEN hero and navSvg:', content.substring(heroDivEnd, navSvgStart));

content = content.substring(0, heroDivEnd + 6) + '\r\n\t\t\t\t\t\t\t\t' + content.substring(navSvgStart);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Cleaned top duplicate chunk!');
