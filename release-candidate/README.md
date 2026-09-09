# Interactive Proposal Builder

Self-hosted proposal builder for service businesses. Configure packages and add-ons, let a client compare options, calculate the investment, download an A4 PDF, and record a local decision receipt.

This package is a release candidate. It uses synthetic examples and stores commercial configuration in the browser. It does not provide accounts, payments, e-signatures, CRM, email delivery, webhook delivery or cloud synchronization.

## Run

Requires Node.js 20.19 or later.

```text
npm install
npm test
npm run build
npm run dev -- --host 127.0.0.1 --port 5174
```

The Vite server is useful for editing the UI. To test the actual PDF endpoint, build first and run:

```text
npm run build
$env:PORT=5182; node server.mjs
```

Open `http://127.0.0.1:5182/`. The demo server can be started with `DEMO=1`; it always adds the visible demo banner to generated PDFs and ignores saved commercial configuration.

For a client-ready view, open the same URL with `?client=1`. This hides the configuration controls while keeping the option selector, live total, PDF export and decision receipt. Use `?demo=1` for a safe sandbox with synthetic data and a watermark on the PDF.

## Vercel preview

This package includes `vercel.json` and `api/pdf.js` so the real PDF endpoint is available on a Vercel preview. Deploy from this directory with `vercel --yes`; the Vite build serves `dist/` and the Node function handles `POST /api/pdf`.

The public preview has audience routes: `/es/` for Spanish and `/en/` for English. Add `?client=1` for the client-facing view or `?demo=1` for a safe sandbox.

## Buyer flow

Choose a template, compare package options, select eligible add-ons, open the summary and download the PDF. The live estimate keeps the initial investment and recurring charges separate. In commercial mode, open **Configure proposal** to edit seller/client, title, currency, prices, terms and branding. Save locally or export the JSON configuration before moving it to another browser. Selections are restored locally for the current proposal, so a seller can resume a draft without creating an account.

Decision buttons create a JSON receipt containing the proposal version, timestamp, selected options and total snapshot. The receipt is local and must be sent manually if the seller wants to receive it.

## License and limitations

See [LICENSE](LICENSE). Keep third-party notices with any redistribution. Review provenance for any future visual assets before adding them. The package is a source kit; hosting, domain, data retention and support are the buyer's responsibility.
