/**
 * Read-only production portfolio smoke test.
 * Makes GET requests and renders the public portfolio with headless Chrome.
 * Never logs in, clicks a link, submits the contact form or sends chatbot text.
 */
const fs = require('node:fs');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');

const exec = promisify(execFile);
const base = process.env.PORTFOLIO_PRODUCTION_URL || 'https://portfolio-of-rahat.vercel.app/';
const artifacts = path.resolve(__dirname, '..', 'artifacts');

function target(pathname) {
  return new URL(pathname, base).toString();
}

async function fetchPublic(pathname) {
  const url = target(pathname);
  const result = await fetch(url, {
    signal: AbortSignal.timeout(25000),
    headers: { 'User-Agent': 'PortfolioReadOnlySmoke/1.0' },
    redirect: 'follow'
  });
  if (!result.ok) {
    throw new Error('Live GET ' + pathname + ' returned HTTP ' + result.status);
  }
  if (new URL(result.url).origin !== new URL(base).origin) {
    throw new Error('Live GET ' + pathname + ' redirected to another origin');
  }
  return result;
}

async function render(viewport, screenshotName) {
  const page = target('/');
  const chromeFlags = [
    '--headless=new', '--no-sandbox', '--disable-dev-shm-usage',
    '--disable-gpu', '--no-first-run', '--hide-scrollbars',
    '--window-size=' + viewport, '--virtual-time-budget=12000'
  ];
  const { stdout } = await exec('google-chrome', chromeFlags.concat(['--dump-dom', page]), {
    timeout: 65000,
    maxBuffer: 20 * 1024 * 1024
  });

  if (!stdout.includes('Featured Projects')) {
    throw new Error('Public production page did not render the Featured Projects heading');
  }
  const projectCount = (stdout.match(/<app-project-card\b/g) || []).length;
  if (projectCount !== 7) {
    throw new Error('Public production page rendered ' + projectCount + '/7 project cards');
  }
  for (const text of [
    'GPMS: Garment Production Management',
    'Spotter: Flight Search',
    'CineScope: Movie Watchlist',
    'id="contact"',
    'id="project"',
    'Resume-of-Rahat-Kabir-latests.pdf'
  ]) {
    if (!stdout.includes(text)) throw new Error('Missing live DOM marker: ' + text);
  }
  if (!stdout.includes('This optional chatbot uses a separate external service.') ||
      !stdout.includes('I understand that messages I submit will be sent to the external chatbot service. Enable chat.')) {
    throw new Error('Required chatbot third-party processing disclosure is absent');
  }
  const output = path.join(artifacts, screenshotName);
  await exec('google-chrome', chromeFlags.concat(['--screenshot=' + output, page]), {
    timeout: 65000, maxBuffer: 4 * 1024 * 1024
  });
  if (!fs.existsSync(output) || fs.statSync(output).size < 1024) {
    throw new Error('Live screenshot could not be captured: ' + screenshotName);
  }
  console.log('PASS live Chrome ' + viewport + ' (' + projectCount + ' project cards)');
}

async function main() {
  const homepage = await fetchPublic('/');
  const contentType = homepage.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    throw new Error('Portfolio root did not return HTML: ' + contentType);
  }
  const html = await homepage.text();
  if (!html.includes('Rahat Kabir Dhrubo') || !html.includes('<app-root')) {
    throw new Error('Live response was not the expected portfolio HTML shell');
  }
  console.log('PASS public homepage GET (HTTP ' + homepage.status + ')');

  const pdf = await fetchPublic('/assets/Resume-of-Rahat-Kabir-latests.pdf');
  const bytes = Buffer.from(await pdf.arrayBuffer());
  if (bytes.length < 1024 || bytes.subarray(0, 5).toString('ascii') !== '%PDF-') {
    throw new Error('Public resume response is not a readable PDF file');
  }
  console.log('PASS public resume PDF GET (' + bytes.length + ' bytes)');

  fs.mkdirSync(artifacts, { recursive: true });
  await render('375,812', 'portfolio-live-mobile.png');
  await render('1440,900', 'portfolio-live-desktop.png');
  console.log('Read-only public production smoke test passed. No user inputs were submitted.');
}

main().catch(err => {
  console.error('Live smoke FAILED: ' + (err.message || err));
  process.exitCode = 1;
});
