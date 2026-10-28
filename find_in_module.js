const fs = require('fs');

const code = fs.readFileSync('public/js/original_main.js', 'utf8');
const moduleStart = 898564;
const moduleEnd = 902058;
const moduleBody = code.slice(code.indexOf('{', moduleStart) + 1, moduleEnd);

// Binary search by characters
let low = 0;
let high = moduleBody.length;

// Find which prefix fails
for (let len = 10; len < moduleBody.length; len += 10) {
  const sub = moduleBody.slice(0, len);
  try {
    new Function('e', 't', 'n', sub + '\n}');
  } catch (e) {
    if (e.message.includes("Unexpected token ')'")) {
      console.log(`Failed at len ~${len}:`, e.message);
      console.log('Snippet around failure:');
      console.log(moduleBody.slice(Math.max(0, len - 80), len + 40));
      break;
    }
  }
}
