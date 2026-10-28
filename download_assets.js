const fs = require('fs');

async function main() {
  console.log('Downloading CSS and JS...');
  const [cssRes, jsRes] = await Promise.all([
    fetch('https://go180.nl/app/themes/go180/assets/css/main.css?ver=5.1.3'),
    fetch('https://go180.nl/app/themes/go180/assets/js/main.js?ver=5.1.3')
  ]);
  
  const css = await cssRes.text();
  const js = await jsRes.text();

  fs.writeFileSync('original_main.css', css);
  fs.writeFileSync('original_main.js', js);
  console.log('Downloaded main.css length:', css.length, 'main.js length:', js.length);

  // Analyze CSS
  console.log('--- CSS Analysis ---');
  console.log('Font families in CSS:');
  const fontMatches = css.match(/font-family:[^;]+;/gi) || [];
  const uniqueFonts = [...new Set(fontMatches.map(f => f.trim()))];
  console.log(uniqueFonts.slice(0, 20));

  console.log('\n@font-face rules:');
  const fontFaceMatches = css.match(/@font-face\s*\{[^}]+\}/gi) || [];
  console.log(fontFaceMatches);

  console.log('\nColor variables or roots:');
  const rootMatches = css.match(/:root\s*\{[^}]+\}/gi) || [];
  console.log(rootMatches.slice(0, 3));

  // Analyze JS
  console.log('\n--- JS Analysis ---');
  console.log('JS start snippet:');
  console.log(js.substring(0, 300));
}

main().catch(console.error);
