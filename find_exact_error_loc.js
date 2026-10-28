const fs = require('fs');
const acorn = require('acorn');

const code = fs.readFileSync('public/js/original_main.js', 'utf8');

try {
  acorn.parse(code, { ecmaVersion: 2020 });
  console.log('Acorn: parsed successfully!');
} catch (e) {
  console.log('Acorn parse error:', e.message);
  console.log('At pos:', e.pos, 'loc:', e.loc);
  const start = Math.max(0, e.pos - 80);
  const end = Math.min(code.length, e.pos + 80);
  console.log('Snippet around error:\n', code.slice(start, end));
  console.log('Error marker:');
  console.log(' '.repeat(e.pos - start) + '^');
}
