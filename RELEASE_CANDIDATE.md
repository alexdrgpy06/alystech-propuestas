# Interactive Proposal Builder release candidate

The sanitized bilingual Vercel preview source is versioned under `release-candidate/`.

- Vercel root directory: `release-candidate`
- Locale routes: `/es/` and `/en/`
- PDF function: `api/pdf.js`
- Local verification: `npm ci`, `npm test`, `npm run build`
- The release candidate contains synthetic content and no `.env`, `node_modules`, `dist` or runtime logs.

The legacy AlysTech deployment remains in the repository root. Use the release-candidate directory for the public productized preview and package.
