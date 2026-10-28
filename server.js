const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 1. Serve root static files (favicons, manifest, etc.)
const rootFiles = ['apple-touch-icon.png', 'favicon-32x32.png', 'favicon-16x16.png', 'site.webmanifest', 'safari-pinned-tab.svg'];
rootFiles.forEach(f => {
  app.get(`/${f}`, (req, res) => {
    const p = path.join(__dirname, 'public', f);
    if (fs.existsSync(p)) res.sendFile(p);
    else res.status(404).end();
  });
});

// 2. Map WordPress asset paths directly to local assets
app.get('/app/themes/go180/assets/css/main.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'css', 'main.css'));
});

app.get('/app/themes/go180/assets/js/main.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'js', 'original_main.js'));
});

app.get('/wp/wp-includes/js/jquery/jquery.min.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'js', 'jquery.min.js'));
});

// WP i18n & a11y stubs
app.get('/wp/wp-includes/js/dist/i18n.min.js', (req, res) => {
  res.type('application/javascript').send(`
    window.wp = window.wp || {};
    window.wp.i18n = {
      setLocaleData: function() {},
      __: function(s) { return s; },
      _x: function(s) { return s; },
      _n: function(s, p, n) { return n === 1 ? s : p; },
      _nx: function(s, p, n) { return n === 1 ? s : p; },
      isRtl: function() { return false; },
      sprintf: function(fmt) { return fmt; }
    };
    window.ajax = window.ajax || { url: '/wp/wp-admin/admin-ajax.php' };
  `);
});

app.get('/wp/wp-includes/js/dist/a11y.min.js', (req, res) => {
  res.type('application/javascript').send(`
    window.wp = window.wp || {};
    window.wp.a11y = {
      speak: function() {}
    };
  `);
});


let cachedImages = null;
function getCachedImages(dir) {
  if (!cachedImages) {
    try { cachedImages = fs.readdirSync(dir); } catch(e) { cachedImages = []; }
  }
  return cachedImages;
}

// Smart image resolver helper
function resolveImageFile(filename) {
  const imagesDir = path.join(__dirname, 'public', 'images');
  const imgDir = path.join(__dirname, 'public', 'img');
  
  // 1. Direct match in public/images or public/img
  const directPath = path.join(imagesDir, filename);
  if (fs.existsSync(directPath)) return directPath;
  const directImgPath = path.join(imgDir, filename);
  if (fs.existsSync(directImgPath)) return directImgPath;

  // 2. Smart resolution fallback
  try {
    const available = getCachedImages(imagesDir);
    const m = filename.match(/^([a-zA-Z0-9_\-]+?)(?:-\d+x\d+|-scaled.*?)?\.(jpg|jpeg|png|webp|svg)/i);
    if (m) {
      const base = m[1];
      const match = available.find(f => f.startsWith(base));
      if (match) return path.join(imagesDir, match);
      const sub = base.split('-')[0];
      const match2 = available.find(f => f.includes(base) || f.includes(sub));
      if (match2) return path.join(imagesDir, match2);
    }
  } catch (e) {}

  return null;
}

// Smush Lazy Load working implementation
app.use((req, res, next) => {
  if (req.path.includes('smush-lazy-load')) {
    return res.type('application/javascript').send(`
      (function(){
        function loadAllLazy(){
          document.querySelectorAll('img[data-src], img.lazyload').forEach(function(img){
            var ds = img.getAttribute('data-src');
            if (ds && img.src !== ds && !img.src.endsWith(ds)) {
              img.src = ds;
            }
            img.classList.remove('lazyload');
            img.classList.add('lazyloaded');
          });
          document.querySelectorAll('img').forEach(function(img){
            if (img.src && img.src.includes('elfsightcdn')) {
              img.onerror = function() { this.src = '/images/avatar-placeholder.svg'; };
              if (img.complete && img.naturalWidth === 0) {
                img.src = '/images/avatar-placeholder.svg';
              }
            }
          });
        }
        if (document.readyState !== 'loading') {
          loadAllLazy();
        } else {
          document.addEventListener('DOMContentLoaded', loadAllLazy);
        }
        window.addEventListener('load', loadAllLazy);
        setInterval(loadAllLazy, 400);
      })();
    `);
  }
  next();
});

// Any requested image under /images, /app/smush-webp, /app/uploads, /img
app.use(['/images', '/img', '/app/smush-webp', '/app/uploads'], (req, res, next) => {
  const filename = path.basename(req.path);
  const resolved = resolveImageFile(filename);
  if (resolved) {
    return res.sendFile(resolved);
  }
  next();
});

// 3. Static directory serving
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/fonts', express.static(path.join(__dirname, 'public', 'fonts')));
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/video', express.static(path.join(__dirname, 'public', 'video')));
app.use('/videos', express.static(path.join(__dirname, 'public', 'video')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// 4. Form Submission & AJAX API
app.get(['/wp/wp-admin/admin-ajax.php', '/admin-ajax.php'], (req, res) => {
  const action = req.query.action;
  if (action === 'load_gravity_form') {
    const formid = String(req.query.formid || '');
    if (formid === '9') {
      const p = path.join(__dirname, 'form_free-trial.html');
      if (fs.existsSync(p)) return res.sendFile(p);
    }
    const p = path.join(__dirname, 'form_contact.html');
    if (fs.existsSync(p)) return res.sendFile(p);
    return res.send('<!-- form loaded -->');
  }
  res.send('0');
});

app.post(['/wp/wp-admin/admin-ajax.php', '/api/submit-form', '/api/contact'], (req, res) => {
  console.log('Form submission received:', req.body);
  res.json({
    success: true,
    message: 'Thank you for your inquiry! We will get in touch with you shortly.'
  });
});

// 5. Page Routes
const routes = {
  '/': 'home.html',
  '/we-are-go180/': 'we-are-go180.html',
  '/programs/': 'programs.html',
  '/programs/essentials/': 'programs-essentials.html',
  '/coaches/': 'coaches.html',
  '/clubs/leeuwarden/': 'club-leeuwarden.html',
  '/stories/': 'stories.html',
  '/pricing/': 'pricing.html',
  '/contact/': 'contact.html',
  '/join-now/': 'join-now.html',
  '/free-trial/': 'free-trial.html',

  // Legal footer pages
  '/algemene-voorwaarden/': 'algemene-voorwaarden.html',
  '/disclaimer/': 'disclaimer.html',
  '/privacy-policy/': 'privacy-policy.html',

  // Individual Program Pages
  '/programs/fundamentals/': 'programs-fundamentals.html',
  '/programs/go2gether/': 'programs-go2gether.html',
  '/programs/adaptable/': 'programs-adaptable.html',
  '/programs/digital-coaching/': 'programs-digital-coaching.html',
  '/programs/healthy-ageing/': 'programs-healthy-ageing.html',
  '/programs/go2day/': 'programs-go2day.html',
  '/programs/hyrox/': 'programs-hyrox.html',

  // Individual Coach Pages
  '/coaches/appie-kooistra/': 'coach-appie-kooistra.html',
  '/coaches/thomas-kramer/': 'coach-thomas-kramer.html',
  '/coaches/hielke-feenstra/': 'coach-hielke-feenstra.html',
  '/coaches/arjon-van-der-wal/': 'coach-arjon-van-der-wal.html',
  '/coaches/hielke-van-der-lei/': 'coach-hielke-van-der-lei.html',
  '/coaches/annick-douma/': 'coach-annick-douma.html'
};

// Register routes (both with and without trailing slash)
for (const [routePath, filename] of Object.entries(routes)) {
  const handler = (req, res) => {
    const pagePath = path.join(__dirname, 'public', 'pages', filename);
    if (fs.existsSync(pagePath)) {
      res.sendFile(pagePath);
    } else {
      res.status(404).send('Page not found');
    }
  };

  app.get(routePath, handler);
  if (routePath.endsWith('/') && routePath !== '/') {
    app.get(routePath.slice(0, -1), handler);
  }
}

// Story detail dynamic routes
app.get(['/stories/:slug', '/stories/:slug/'], (req, res, next) => {
  const slug = req.params.slug;
  const storyFile = path.join(__dirname, 'public', 'pages', `story-${slug}.html`);
  if (fs.existsSync(storyFile)) {
    return res.sendFile(storyFile);
  }
  next();
});

// Fallback for missing JS / static assets
app.use((req, res, next) => {
  if (req.path.endsWith('.js')) {
    return res.type('application/javascript').send('/* local stub */');
  }
  if (req.path.endsWith('.css') || req.path.match(/\.(png|jpg|jpeg|webp|svg|gif|woff|woff2|ttf|eot)$/i)) {
    return res.status(404).end();
  }
  if (req.method === 'GET' && req.accepts('html')) {
    if (req.path.startsWith('/wp/') || req.path.startsWith('/app/') || req.path.startsWith('/api/')) {
      return res.status(404).end();
    }
    const p = path.join(__dirname, 'public', 'pages', 'home.html');
    if (fs.existsSync(p)) {
      return res.sendFile(p);
    }
  }
  res.status(404).send('Not found');
});

app.listen(PORT, () => {
  console.log(`HR Fitness Club Server running at http://localhost:${PORT}`);
});
