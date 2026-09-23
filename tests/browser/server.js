// Serve the real CSP over local HTTPS, including upgrade-insecure-requests.
// Test certificates live only in an OS temporary directory and are removed at exit.
// TEMPORARY DIAGNOSTIC BRANCH, NOT FOR MERGE: KEW_HTTP2=1 serves HTTP/2 with an
// HTTP/1.1 fallback; KEW_SERVER_LOG records connections, requests and aborts.
const https = require('node:https');
const http2 = require('node:http2');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '../..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'kew-browser-test-'));
const key = path.join(temporary, 'localhost.key');
const certificate = path.join(temporary, 'localhost.crt');
execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-keyout', key, '-out', certificate, '-days', '1', '-subj', '/CN=127.0.0.1'], { stdio: 'ignore' });
const types = { '.png': 'image/png', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.csv': 'text/csv; charset=utf-8', '.pdf': 'application/pdf', '.md': 'text/markdown; charset=utf-8' };

if (process.env.KEW_SERVER_LOG) fs.mkdirSync(path.dirname(process.env.KEW_SERVER_LOG), { recursive: true });
const logStream = process.env.KEW_SERVER_LOG ? fs.createWriteStream(process.env.KEW_SERVER_LOG, { flags: 'a' }) : null;
const log = (...parts) => { if (logStream) logStream.write((performance.timeOrigin + performance.now()).toFixed(1) + ' ' + parts.join(' ') + '\n'); };
let nextId = 0;
const ids = new WeakMap();
const idOf = object => { if (!ids.has(object)) ids.set(object, ++nextId); return ids.get(object); };

function handler(request, response) {
  const conn = request.stream ? `s${idOf(request.stream.session)}/${request.stream.id}` : `c${idOf(request.socket)}`;
  log('REQ', conn, request.httpVersion, request.method, request.url);
  response.on('finish', () => log('FIN', conn, request.url));
  response.on('close', () => { if (!response.writableFinished) log('ABORT', conn, request.url, request.stream ? 'rst=' + request.stream.rstCode : ''); });
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
}
const options = { key: fs.readFileSync(key), cert: fs.readFileSync(certificate) };
const server = process.env.KEW_HTTP2 === '1' ? http2.createSecureServer({ ...options, allowHTTP1: true }, handler) : https.createServer(options, handler);
server.on('secureConnection', socket => {
  const id = idOf(socket);
  log('CONN', 'c' + id, socket.alpnProtocol || '-', 'port=' + socket.remotePort);
  socket.on('close', () => log('CLOSE', 'c' + id));
});
server.on('session', session => {
  const id = idOf(session);
  log('SESS', 's' + id, 'port=' + session.socket.remotePort);
  session.on('close', () => log('SESSCLOSE', 's' + id));
  session.on('error', error => log('SESSERR', 's' + id, error.code || error.message));
});
server.on('tlsClientError', error => log('TLSERR', error.code || error.message));
function cleanUp() { server.close(); fs.rmSync(temporary, { recursive: true, force: true }); }
process.on('exit', cleanUp);
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { cleanUp(); process.exit(0); });
server.listen(Number(process.env.KEW_PORT || 4173), '127.0.0.1');
