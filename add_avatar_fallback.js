const fs = require('fs');

const avatarScript = `
// Global Avatar Fallback for offline / blocked avatars
document.addEventListener("error", function(e) {
  if (e.target && e.target.tagName === "IMG") {
    const src = e.target.src || '';
    const cls = String(e.target.className || '');
    if (src.includes('elfsightcdn') || cls.includes('avatar') || cls.includes('es-avatar')) {
      e.target.src = '/images/avatar-placeholder.svg';
    }
  }
}, true);
`;

['./public/js/original_main.js', './original_main.js'].forEach(p => {
  if (fs.existsSync(p)) {
    fs.appendFileSync(p, avatarScript, 'utf8');
    console.log('Appended avatar fallback to', p);
  }
});
