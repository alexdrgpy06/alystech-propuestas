# Start here — Interactive Proposal Builder

1. Install Node.js 20.19 or later.
2. Run `npm install`.
3. Run `npm test` and `npm run build`.
4. Run `npm run build` and `PORT=5182 node server.mjs` (PowerShell: `$env:PORT=5182; node server.mjs`).
5. Open the local URL, select an example, choose an option and add-on, open the summary and download the PDF.
6. In commercial mode, use **Configure proposal**, save a local copy and export the configuration JSON.
7. To review the client experience, open the URL with `?client=1`; for a safe sandbox, use `?demo=1`.

The examples are synthetic. Selections and decision receipts stay in the browser and are not sent to a recipient automatically. The package does not include hosting, payments, CRM, signatures, email, webhooks or a multi-tenant service.