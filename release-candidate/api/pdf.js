import { renderPdf } from '../pdf.mjs';

const MAX_BODY_BYTES = 1_500_000;

function parseBody(request) {
  if (typeof request.body !== 'string') {
    return request.body && typeof request.body === 'object' ? request.body : {};
  }
  if (Buffer.byteLength(request.body, 'utf8') > MAX_BODY_BYTES) {
    const error = new Error('Payload too large');
    error.code = 'PAYLOAD_TOO_LARGE';
    throw error;
  }
  try {
    return JSON.parse(request.body);
  } catch {
    const error = new Error('Invalid JSON payload');
    error.code = 'INVALID_JSON';
    throw error;
  }
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = parseBody(request);
    const { proposal, selections, extras } = body || {};
    const demo = new URL(request.url, 'https://vercel.local').searchParams.get('demo') === '1';
    const pdf = await renderPdf(proposal, selections, extras, demo);
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', 'attachment; filename="proposal.pdf"');
    response.setHeader('Cache-Control', 'no-store');
    return response.status(200).send(pdf);
  } catch (error) {
    if (error?.code === 'PAYLOAD_TOO_LARGE') {
      return response.status(413).json({ error: 'Request payload is too large' });
    }
    return response.status(400).json({ error: 'Invalid proposal or PDF request' });
  }
}
