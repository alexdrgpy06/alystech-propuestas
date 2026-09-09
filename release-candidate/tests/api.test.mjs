import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/pdf.js';
import { templates } from '../src/templates.mjs';

function invoke(body, method = 'POST', url = 'https://example.test/api/pdf?demo=1') {
  const result = { statusCode: 200, payload: undefined, headers: {} };
  const response = {
    setHeader(name, value) { result.headers[name] = value; },
    status(code) { result.statusCode = code; return this; },
    json(value) { result.payload = value; return result; },
    send(value) { result.payload = value; return result; },
  };
  return Promise.resolve(handler({ method, body, url }, response)).then(() => result);
}

test('rejects malformed JSON as a client error', async () => {
  const result = await invoke('{');
  assert.equal(result.statusCode, 400);
  assert.deepEqual(result.payload, { error: 'Invalid proposal or PDF request' });
});

test('rejects oversized JSON before PDF generation', async () => {
  const result = await invoke(JSON.stringify({ padding: 'x'.repeat(1_600_000) }));
  assert.equal(result.statusCode, 413);
  assert.deepEqual(result.payload, { error: 'Request payload is too large' });
});

test('returns a PDF for a valid proposal request', async () => {
  const proposal = structuredClone(templates[0]);
  const result = await invoke({ proposal, selections: { website: 'essential' }, extras: {} });
  assert.equal(result.statusCode, 200);
  assert.equal(result.headers['Content-Type'], 'application/pdf');
  assert.equal(Buffer.from(result.payload).subarray(0, 4).toString(), '%PDF');
});

test('rejects unsupported methods', async () => {
  const result = await invoke(undefined, 'GET');
  assert.equal(result.statusCode, 405);
  assert.equal(result.headers.Allow, 'POST');
});
