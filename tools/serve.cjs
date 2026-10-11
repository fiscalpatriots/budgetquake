// Static file server for the Budgetquake folder, local preview only.
const http = require('http'), fs = require('fs'), path = require('path');
const root = process.argv[2], port = +process.argv[3] || 8931;
const types = { '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.md': 'text/plain; charset=utf-8' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(root, p);
  if (!file.startsWith(path.resolve(root))) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end('not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(buf);
  });
}).listen(port, '127.0.0.1', () => console.log('serving ' + root + ' on ' + port));
