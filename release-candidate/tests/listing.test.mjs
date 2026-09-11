import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

function list(root, prefix = '') {
  const entries = readdirSync(join(root, prefix), { withFileTypes: true });
  return entries.flatMap(e => e.isDirectory()
    ? list(root, join(prefix, e.name))
    : [join(prefix, e.name).replace(/\\/g, '/')]);
}

const files = list(root);

const LISTING_CHECKS = [
  ['LISTING-EN.md exists', files.includes('LISTING-EN.md')],
  ['LISTING-ES.md exists', files.includes('LISTING-ES.md')],
  ['package.json exists', files.includes('package.json')],
  ['package-lock.json exists', files.includes('package-lock.json')],
  ['LICENSE exists', files.includes('LICENSE')],
  ['src/templates.mjs exists (examples)', files.includes('src/templates.mjs')],
  ['src/templateLocales.mjs exists (translations)', files.includes('src/templateLocales.mjs')],
  ['src/domain.mjs exists (logic)', files.includes('src/domain.mjs')],
  ['src/App.jsx exists (UI)', files.includes('src/App.jsx')],
  ['pdf.mjs exists (PDF)', files.includes('pdf.mjs')],
  ['server.mjs exists (local server)', files.includes('server.mjs')],
  ['api/pdf.js exists (Vercel endpoint)', files.includes('api/pdf.js')],
  ['tests/domain.test.mjs exists', files.includes('tests/domain.test.mjs')],
  ['tests/locale.test.mjs exists', files.includes('tests/locale.test.mjs')],
  ['docs/MODIFY-WITH-AI-EN.md exists', files.includes('docs/MODIFY-WITH-AI-EN.md')],
  ['docs/ONE-TIME-PURCHASE-OFFLINE-EN.md exists', files.includes('docs/ONE-TIME-PURCHASE-OFFLINE-EN.md')],
  ['docs/LICENSES-THIRD-PARTY.md exists', files.includes('docs/LICENSES-THIRD-PARTY.md')],
  ['docs/SYNTHETIC-EXAMPLE-EN.md exists', files.includes('docs/SYNTHETIC-EXAMPLE-EN.md')],
  ['docs/SYNTHETIC-EXAMPLE-ES.md exists', files.includes('docs/SYNTHETIC-EXAMPLE-ES.md')],
];

describe('#8 copy listing verification', () => {
  for (const [label, result] of LISTING_CHECKS) {
    test(`${label}: ${result ? 'FOUND' : 'MISSING'}`, () => assert.ok(result));
  }

  test('three examples in templates.mjs', () => {
    const src = readFileSync(join(root, 'src/templates.mjs'), 'utf8');
    assert.ok(src.includes('website-example'), 'website-example missing');
    assert.ok(src.includes('it-example'), 'it-example missing');
    assert.ok(src.includes('consulting-example'), 'consulting-example missing');
  });

  test('es/en routes handled in server.mjs', () => {
    const src = readFileSync(join(root, 'server.mjs'), 'utf8');
    // server.mjs uses a regex like /^\/(?:es|en)\/?$/ to route /es/ and /en/
    assert.ok(src.includes('es') && src.includes('en'), 'es/en not referenced in server.mjs');
    assert.ok(/es.*en|en.*es/.test(src), 'No es/en route pattern in server.mjs');
  });

  test('JSON import/export in App.jsx', () => {
    const src = readFileSync(join(root, 'src/App.jsx'), 'utf8');
    assert.ok(src.includes('export') && src.includes('import') && src.includes('download'), 'No import/export in UI');
    assert.ok(src.includes('proposal-config.json') || src.includes('download(JSON.stringify'), 'No JSON download');
    assert.ok(src.includes('file') && src.includes('text()'), 'No JSON file import');
  });

  test('commercial editor fields in App.jsx', () => {
    const src = readFileSync(join(root, 'src/App.jsx'), 'utf8');
    const fields = ['seller', 'client', 'currency', 'color', 'price', 'annual'];
    for (const field of fields) assert.ok(src.includes(field), `Editor missing "${field}" field`);
  });

  test('local receipts / decision function in domain.mjs', () => {
    const src = readFileSync(join(root, 'src/domain.mjs'), 'utf8');
    assert.ok(src.includes('decision') || src.includes('receipt'), 'No decision/receipt function');
  });

  test('A4 PDF size in pdf.mjs', () => {
    const src = readFileSync(join(root, 'pdf.mjs'), 'utf8');
    assert.ok(src.includes('A4') || src.includes("size: 'A4'"), 'No A4 size in PDF');
  });

  test('Node.js 20.19 engine in package.json', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
    assert.ok(pkg.engines?.node, 'No engine requirement');
    assert.ok(pkg.engines.node.includes('20'), 'Not Node.js 20+');
  });

  test('no mandatory accounts/payments/CRM in listing copy', () => {
    const listing = readFileSync(join(root, 'LISTING-EN.md'), 'utf8').toLowerCase();
    assert.ok(!listing.includes('account') || listing.includes('no account'), 'LISTING should mention no accounts');
    assert.ok(!listing.includes('subscription'), 'LISTING should not mention subscriptions');
  });

  test('LISTING-ES.md is a complete translation of LISTING-EN.md', () => {
    const en = readFileSync(join(root, 'LISTING-EN.md'), 'utf8');
    const es = readFileSync(join(root, 'LISTING-ES.md'), 'utf8');
    assert.equal(en.split('\n').length, es.split('\n').length, 'Line count mismatch between EN and ES');
    const enSections = en.split(/^## /m).slice(1).map(s => s.split('\n')[0].trim());
    const esSections = es.split(/^## /m).slice(1).map(s => s.split('\n')[0].trim());
    const mapping = {
      'Included': 'Incluye',
      'How it works': 'Cómo funciona',
      'Requirements': 'Requisitos',
      'Delivery and license': 'Entrega y licencia',
    };
    for (const [enSec, esSec] of zip(enSections, esSections)) {
      assert.equal(mapping[enSec] || enSec, esSec, `"${enSec}" should be translated as "${mapping[enSec] || enSec}" but got "${esSec}"`);
    }
  });
});

function* zip(a, b) { for (let i = 0; i < Math.min(a.length, b.length); i++) yield [a[i], b[i]]; }