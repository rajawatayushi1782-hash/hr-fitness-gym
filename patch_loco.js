const fs = require('fs');
const vm = require('vm');

const filePath = 'public/js/original_main.js';
let js = fs.readFileSync(filePath, 'utf8');

const target = 'window.locomotive=t;window.locomotiveScroll=t;';
if (!js.includes(target)) {
  console.error('Target not found!');
  process.exit(1);
}

const replacement = `window.locomotive=t;window.locomotiveScroll=t;(function(){var origScrollTo=t.scrollTo.bind(t);t.scrollTo=function(target,options){if(window.innerWidth<1024){if(typeof target==='string'){if(target==='bottom'){window.scrollTo(0,document.body.scrollHeight);return;}if(target==='top'){window.scrollTo(0,0);return;}var el=document.querySelector(target);if(el){el.scrollIntoView({behavior:'auto',block:'center'});return;}}else if(target&&target.nodeType){target.scrollIntoView({behavior:'auto',block:'center'});return;}else if(typeof target==='number'){window.scrollTo(0,target);return;}}return origScrollTo(target,options);};})();`;

js = js.replace(target, replacement);

try {
  new vm.Script(js);
  console.log('Compiled successfully with 0 errors!');
  fs.writeFileSync(filePath, js, 'utf8');
  console.log('Updated locomotive.scrollTo in original_main.js');
} catch (err) {
  console.error('Syntax error:', err);
  process.exit(1);
}
