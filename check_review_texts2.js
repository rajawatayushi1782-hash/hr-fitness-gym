const fs = require('fs');
const html = fs.readFileSync('public/pages/home.html', 'utf8');

// Find all elements with text inside .es-review-container
const match = html.match(/es-review-container[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/gi) || [];

// Or search for 'Text__TypographyText'
let idx = 0;
while ((idx = html.indexOf('Text__TypographyText', idx)) !== -1) {
  const close = html.indexOf('>', idx);
  const end = html.indexOf('</', close);
  console.log('TypographyText:', html.substring(close + 1, end).trim());
  idx += 20;
}
