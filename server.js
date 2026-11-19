const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8089;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Explicit static references so Vercel's Node File Trace bundles all HTML files and assets
const STATIC_FILES = {
  '/': path.join(__dirname, 'index.html'),
  '/index.html': path.join(__dirname, 'index.html'),
  '/solution': path.join(__dirname, 'solution.html'),
  '/solution.html': path.join(__dirname, 'solution.html'),
  '/why-fsm': path.join(__dirname, 'why-fsm.html'),
  '/why-fsm.html': path.join(__dirname, 'why-fsm.html'),
  '/how-it-works': path.join(__dirname, 'how-it-works.html'),
  '/how-it-works.html': path.join(__dirname, 'how-it-works.html'),
  '/business-value': path.join(__dirname, 'business-value.html'),
  '/business-value.html': path.join(__dirname, 'business-value.html'),
  '/capabilities': path.join(__dirname, 'capabilities.html'),
  '/capabilities.html': path.join(__dirname, 'capabilities.html'),
  '/css/style.css': path.join(__dirname, 'css', 'style.css'),
  '/css/taskgo_base.css': path.join(__dirname, 'css', 'taskgo_base.css'),
  '/js/main.js': path.join(__dirname, 'js', 'main.js'),
  '/js/webflow.js': path.join(__dirname, 'js', 'webflow.js'),
  '/assets/sla-performance-overview.jpg': path.join(__dirname, 'assets', 'sla-performance-overview.jpg'),
};

const FILE_CACHE = {};

for (const [route, filePath] of Object.entries(STATIC_FILES)) {
  try {
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const content = fs.readFileSync(filePath);
      FILE_CACHE[route] = { content, contentType };
    }
  } catch (err) {
    console.error(`Error caching ${filePath}:`, err);
  }
}

function handleRequest(req, res) {
  let reqPath = decodeURI(req.url.split('?')[0].split('#')[0]);
  if (reqPath === '' || reqPath === '/') {
    reqPath = '/';
  }

  // 1. In-memory cache for all pages and core styles/scripts
  if (FILE_CACHE[reqPath]) {
    const item = FILE_CACHE[reqPath];
    res.writeHead(200, {
      'Content-Type': item.contentType,
      'Cache-Control': item.contentType.startsWith('text/html')
        ? 'public, max-age=0, must-revalidate'
        : 'public, max-age=86400'
    });
    res.end(item.content);
    return;
  }

  // 2. Disk lookup fallback
  let filePath = path.normalize(path.join(PUBLIC_DIR, reqPath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

// Local server
if (!process.env.VERCEL) {
  const server = http.createServer(handleRequest);
  server.listen(PORT, () => {
    console.log(`FSM static server running at http://localhost:${PORT}/`);
  });
}

// Vercel serverless function entrypoint
module.exports = handleRequest;
