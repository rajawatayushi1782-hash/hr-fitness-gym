const fs = require('fs');

const contactHtml = fs.readFileSync('public/pages/contact.html', 'utf8');
const homeHtml = fs.readFileSync('public/pages/home.html', 'utf8');
const clubHtml = fs.readFileSync('public/pages/club-leeuwarden.html', 'utf8');

function findSnippet(html, pattern, len = 1500) {
  const idx = html.indexOf(pattern);
  if (idx === -1) return 'NOT FOUND: ' + pattern;
  return html.slice(idx, idx + len);
}

console.log('=== CONTACT PAGE CONTENT ===');
console.log(findSnippet(contactHtml, 'id="js-scroll"', 2500));

console.log('\n=== HOMEPAGE HERO / FIRST SECTION ===');
console.log(findSnippet(homeHtml, 'id="js-scroll"', 2000));

console.log('\n=== CLUB LEEUWARDEN FIRST SECTION ===');
console.log(findSnippet(clubHtml, 'id="js-scroll"', 2000));
