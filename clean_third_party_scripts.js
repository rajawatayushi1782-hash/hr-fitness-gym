const fs = require('fs');
const path = require('path');

const pagesDir1 = path.join(__dirname, 'public', 'pages');
const pagesDir2 = 'd:/My Data/Desktop Files/HR Fitness/public/pages';

const files = fs.readdirSync(pagesDir1).filter(f => f.endsWith('.html'));

let modifiedCount = 0;

for (const file of files) {
  const p1 = path.join(pagesDir1, file);
  let content = fs.readFileSync(p1, 'utf8');
  let original = content;

  // Ensure fbq stub exists if fbevents is referenced or remove tracker scripts
  if (!content.includes('window.fbq=')) {
    const stub = `<script>window.fbq=window.fbq||function(){(window.fbq.q=window.fbq.q||[]).push(arguments);};window._fbq=window.fbq;</script>`;
    content = content.replace('<head>', '<head>\n' + stub);
  }

  // Remove broken fbevents.js / mouseflow / connect.facebook.net scripts that error without full tracking keys
  content = content.replace(/<script[^>]*src="https:\/\/connect\.facebook\.net[^"]*"[^>]*><\/script>/gi, '');
  content = content.replace(/<script[^>]*src="https:\/\/cdn\.mouseflow\.com[^"]*"[^>]*><\/script>/gi, '');
  content = content.replace(/<script[^>]*src="https:\/\/snap\.licdn\.com[^"]*"[^>]*><\/script>/gi, '');

  if (content !== original) {
    fs.writeFileSync(p1, content, 'utf8');
    if (fs.existsSync(pagesDir2)) {
      fs.writeFileSync(path.join(pagesDir2, file), content, 'utf8');
    }
    modifiedCount++;
  }
}

console.log(`Cleaned tracker scripts in ${modifiedCount} html files.`);
