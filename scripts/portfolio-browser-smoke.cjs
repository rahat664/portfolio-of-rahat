// Production-build smoke test. Runs a local HTTP server and renders the
// compiled Angular app with the Chrome already present on GitHub runners.
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');

const exec = promisify(execFile);
const root = path.resolve(__dirname, '..', 'dist', 'portfolio');
const artifacts = path.resolve(__dirname, '..', 'artifacts');
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.pdf': 'application/pdf',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

function serve(req, res) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const target = path.resolve(root, relative);
  if (!target.startsWith(root + path.sep)) {
    res.writeHead(403).end();
    return;
  }
  fs.readFile(target, (error, buffer) => {
    if (error) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, {
      'Content-Type': mime[path.extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(buffer);
  });
}

async function render(url, viewport, fileName) {
  const capture = path.join(artifacts, fileName);
  const flags = [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--no-first-run',
    '--hide-scrollbars',
    '--window-size=' + viewport,
    '--virtual-time-budget=10000'
  ];
  const { stdout } = await exec('google-chrome', flags.concat(['--dump-dom', url]), {
    maxBuffer: 20 * 1024 * 1024,
    timeout: 60000
  });
  if (!stdout.includes('Featured Projects')) {
    throw new Error('Rendered Angular page did not contain the Featured Projects heading');
  }
  const cards = (stdout.match(/<app-project-card\b/g) || []).length;
  if (cards !== 7) {
    throw new Error('Expected 7 rendered featured project cards, got ' + cards);
  }
  for (const marker of ['GPMS: Garment Production Management', 'Spotter: Flight Search', 'CineScope: Movie Watchlist']) {
    if (!stdout.includes(marker)) throw new Error('Missing rendered project: ' + marker);
  }
    if (!stdout.includes('This optional chatbot uses a separate external service.') ||
      !stdout.includes('I understand that messages I submit will be sent to the external chatbot service. Enable chat.')) {
    throw new Error('Required chatbot third-party processing disclosure is absent');
  }
  if (!stdout.includes('Resume-of-Rahat-Kabir-latests.pdf')) {
    throw new Error('Rendered page is missing the resume download link');
  }
  if (!stdout.includes('id="contact"') || !stdout.includes('id="project"')) {
    throw new Error('Expected navigation section anchors not found');
  }

  await exec('google-chrome', flags.concat(['--screenshot=' + capture, url]), {
    maxBuffer: 10 * 1024 * 1024,
    timeout: 60000
  });
  if (!fs.existsSync(capture) || fs.statSync(capture).size < 1024) {
    throw new Error('Browser screenshot was not generated: ' + capture);
  }
  console.log('PASS ' + viewport + ': ' + cards + ' project cards, resume CTA and section anchors');
}

async function run() {
  if (!fs.existsSync(path.join(root, 'index.html'))) {
    throw new Error('Compile the Angular app first: npm run build');
  }
  fs.mkdirSync(artifacts, { recursive: true });
  const server = http.createServer(serve);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  try {
    const address = server.address();
    const origin = 'http://127.0.0.1:' + address.port;
    const pdf = await fetch(origin + '/assets/Resume-of-Rahat-Kabir-latests.pdf');
    if (!pdf.ok) throw new Error('Resume asset HTTP ' + pdf.status);
    const bytes = Buffer.from(await pdf.arrayBuffer());
    if (bytes.subarray(0, 5).toString('ascii') !== '%PDF-') {
      throw new Error('Resume asset is not a valid PDF header');
    }
    console.log('PASS resume PDF fetch (' + bytes.length + ' bytes)');
    await render(origin + '/#project', '375,812', 'portfolio-mobile.png');
    await render(origin + '/#project', '1440,900', 'portfolio-desktop.png');
    console.log('Portfolio build browser smoke checks passed.');
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
}

run().catch(error => {
  console.error(error && error.message ? error.message : error);
  process.exitCode = 1;
});
