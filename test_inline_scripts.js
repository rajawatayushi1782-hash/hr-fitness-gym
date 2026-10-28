const fs = require('fs');
const html = fs.readFileSync('public/pages/home.html', 'utf8');

const regex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let idx = 0;
while ((match = regex.exec(html)) !== null) {
  idx++;
  const scriptContent = match[1].trim();
  if (!scriptContent) continue;
  try {
    new Function(scriptContent);
  } catch (e) {
    console.log(`Syntax Error in inline script #${idx}:`, e.message);
    console.log('Script content snippet:', scriptContent.slice(0, 200));
  }
}
