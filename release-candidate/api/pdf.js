import { renderPdf } from '../pdf.mjs';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    const { proposal, selections, extras } = body || {};
    const demo = new URL(request.url, 'https://vercel.local').searchParams.get('demo') === '1';
    const pdf = await renderPdf(proposal, selections, extras, demo);
    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', 'attachment; filename="proposal.pdf"');
    response.setHeader('Cache-Control', 'no-store');
    return response.status(200).send(pdf);
  } catch (error) {
    return response.status(400).json({ error: 'Invalid proposal or PDF request' });
  }
}
