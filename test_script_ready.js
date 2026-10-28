const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'public', 'pages');

// Helper to replace all occurrences of a string or regex
function replaceText(content, search, replacement) {
  return content.replace(search, replacement);
}

console.log('Update script ready.');