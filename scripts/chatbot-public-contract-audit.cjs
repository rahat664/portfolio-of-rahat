/**
 * Read-only, public metadata inspection of the separately deployed chatbot.
 * NO calls to /converse, authentication, mutations or user content.
 * Output is allowlisted to avoid printing remote schema descriptions or secrets.
 *
 * This does NOT verify session isolation, history scoping or data retention.
 */
const fs = require('node:fs');
const path = require('node:path');

const origin = 'https://ai-chatbot-5qwd.onrender.com';
const report = {
  target: origin,
  observedAt: new Date().toISOString(),
  method: 'GET',
  path: '/openapi.json',
  outcome: 'NOT_VERIFIED',
  requestBodyFields: [],
  documentedConversePost: false,
  note: 'Public OpenAPI discovery is informational; no session isolation tests were run.'
};

async function run() {
  try {
    const response = await fetch(origin + '/openapi.json', {
      method: 'GET',
      signal: AbortSignal.timeout(70000),
      headers: { Accept: 'application/json', 'User-Agent': 'PortfolioContractAudit/1.0' },
      redirect: 'manual'
    });
    report.httpStatus = response.status;
    report.contentType = String(response.headers.get('content-type') || '').split(';')[0];

    if (response.ok && report.contentType === 'application/json') {
      const length = Number(response.headers.get('content-length') || 0);
      if (length > 1024 * 1024) throw new Error('Public schema exceeds size limit');
      const body = await response.text();
      if (body.length > 1024 * 1024) throw new Error('Public schema exceeds size limit');
      const doc = JSON.parse(body);
      report.hasOpenApiMarker = Boolean(doc.openapi || doc.swagger);
      const post = doc.paths && doc.paths['/converse'] && doc.paths['/converse'].post;
      report.documentedConversePost = Boolean(post);
      if (post) {
        const request = post.requestBody && post.requestBody.content || {};
        const json = request['application/json'] || {};
        let schema = json.schema || {};
        if (typeof schema.$ref === 'string' && schema.$ref.startsWith('#/components/schemas/')) {
          const name = schema.$ref.slice('#/components/schemas/'.length);
          schema = doc.components && doc.components.schemas && doc.components.schemas[name] || {};
        }
        const allowed = new Set(['user_text', 'user_id', 'company_id']);
        report.requestBodyFields = Object.keys(schema.properties || {}).filter(field => allowed.has(field));
      }
      report.outcome = 'PUBLIC_SCHEMA_OBSERVED';
      console.log('Public OpenAPI metadata inspected (read-only).');
    } else {
      console.log('No publicly readable JSON schema received; backend contract remains unverified.');
    }
  } catch (error) {
    report.errorType = error && error.name || 'UnknownError';
    console.log('Public schema probe unavailable; backend contract remains unverified.');
  }
  const output = path.resolve(__dirname, '..', 'artifacts', 'chatbot-public-contract-audit.json');
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
  if (report.outcome !== 'PUBLIC_SCHEMA_OBSERVED') {
    // Mark this informational step inconclusive, not a verified session result.
    process.exitCode = 2;
  }
}

run().catch(error => {
  console.error(error && error.name || 'UnknownError');
  process.exitCode = 2;
});
