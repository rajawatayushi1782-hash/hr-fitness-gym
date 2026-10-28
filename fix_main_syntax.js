const fs = require('fs');
const vm = require('vm');

for (const p of ['public/js/original_main.js', 'original_main.js']) {
  if (!fs.existsSync(p)) continue;
  let c = fs.readFileSync(p, 'utf8');

  if (c.includes('window.addEventListener("resize",d),var _pageRevealed=!1;')) {
    c = c.replace(
      'window.addEventListener("resize",d),var _pageRevealed=!1;',
      'window.addEventListener("resize",d);var _pageRevealed=!1;'
    );
    fs.writeFileSync(p, c, 'utf8');
    console.log(`Replaced comma with semicolon in ${p}`);
  } else {
    console.log(`Pattern not found in ${p}`);
  }

  // Validate syntax
  try {
    new vm.Script(c, { filename: p });
    console.log(`SYNTAX VALID in ${p}!`);
  } catch (err) {
    console.error(`SYNTAX ERROR STILL in ${p}:`, err.message);
  }
}
