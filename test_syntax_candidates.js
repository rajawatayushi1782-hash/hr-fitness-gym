const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('public/js/original_main.js', 'utf8');

// Look at the two occurrences
console.log('Includes A()}})):', code.includes('A()}}))'));

// Try replacing A()}})) with A()}))
const candidate1 = code.replace('A()}})),window.addEventListener("resize",d)', 'A()})),window.addEventListener("resize",d)');

try {
  new vm.Script(candidate1);
  console.log('Candidate 1 is completely VALID syntax!');
} catch (e) {
  console.log('Candidate 1 failed:', e.message);
}

// Try candidate 2: A()}}),window
const candidate2 = code.replace('A()}})),window.addEventListener("resize",d)', 'A()}}),window.addEventListener("resize",d)');

try {
  new vm.Script(candidate2);
  console.log('Candidate 2 is completely VALID syntax!');
} catch (e) {
  console.log('Candidate 2 failed:', e.message);
}
