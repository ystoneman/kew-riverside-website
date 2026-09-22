// Serve the real CSP over local HTTPS, including upgrade-insecure-requests.
// Test certificates live only in an OS temporary directory and are removed at exit.
const https = require('node:https');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '../..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'kew-browser-test-'));
const key = path.join(temporary, 'localhost.key');
const certificate = path.join(temporary, 'localhost.crt');
execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', key, '-out', certificate, '-days', '1', '-subj', '/CN=127.0.0.1'], { stdio: 'ignore' });
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.csv': 'text/csv; charset=utf-8', '.pdf': 'application/pdf', '.md': 'text/markdown; charset=utf-8' };
const server = https.createServer({ key: fs.readFileSync(key), cert: fs.readFileSync(certificate) }, (request, response) => {
  let name;
  try { name = decodeURIComponent(new URL(request.url, 'https://127.0.0.1').pathname).replace(/^\//, '') || 'index.html'; }
  catch { response.writeHead(400).end(); return; }
  const extension = path.extname(name);
  if (!['GET', 'HEAD'].includes(request.method) || name !== path.basename(name) || !types[extension] || !fs.existsSync(path.join(root, name))) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { 'Content-Type': types[extension], 'Cache-Control': 'no-store' });
  if (request.method === 'HEAD') response.end();
  else fs.createReadStream(path.join(root, name)).pipe(response);
});
function cleanUp() { server.close(); fs.rmSync(temporary, { recursive: true, force: true }); }
process.on('exit', cleanUp);
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { cleanUp(); process.exit(0); });
server.listen(4173, '127.0.0.1');
