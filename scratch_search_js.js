const fs = require('fs');

function searchFile(filePath, term) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  let idx = 0;
  while ((idx = content.indexOf(term, idx)) !== -1) {
    console.log('Match in ' + filePath + ' at ' + idx + ':');
    console.log(content.substring(Math.max(0, idx - 150), Math.min(content.length, idx + 250)));
    console.log('-----------------------------------');
    idx += term.length;
  }
}

searchFile('public/js/app.js', 'slide__title');
searchFile('public/js/app.js', 'titleAnimation');
searchFile('public/js/original_main.js', 'slide__titleAnimation');
searchFile('public/js/original_main.js', 'titleAnimation');
searchFile('public/css/main.css', 'slide__titleAnimation');
searchFile('public/css/main.css', 'slide__title');