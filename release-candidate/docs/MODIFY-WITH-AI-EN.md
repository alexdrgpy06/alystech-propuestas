# AI-assisted modification guide

## Before editing

1. Extract the ZIP into a working folder and run `npm ci`, `npm test`, and `npm run build`.
2. Back up the configuration through **Configure proposal → Export JSON**. Do not overwrite the original synthetic example.
3. Ask the AI to change only this package's root folder and to preserve `package-lock.json` unless it explains why a new dependency is needed.

## Changes available in the interface

In commercial mode, **Configure proposal** can edit seller, client, title, descriptive copy, currency, color, terms, options, extras, and prices. Save or export the JSON. To move a proposal to another device, import that JSON in the target browser.

## Common code changes

- Base examples: `src/templates.mjs`.
- Example translations: `src/templateLocales.mjs`.
- Calculations, validation, and extra rules: `src/domain.mjs`.
- Interface: `src/App.jsx` and `src/style.css`.
- PDF: `pdf.mjs`; local endpoint: `server.mjs`; Vercel endpoint: `api/pdf.js`.

Do not put keys, passwords, third-party logos without permission, customer data, or confidential prices in the repository or ZIP.

## Suggested prompt

> Work only in this package. Adapt the `website-example` example for [business type]. Preserve the separation between initial investment and annual charges. Do not add external services, tracking, analytics, payments, accounts, email, or webhooks. Keep all example data synthetic. State which files you will change, update relevant tests, and run `npm test` and `npm run build`.

## Verification before delivery

Run `npm test`, `npm run build`, and `npm audit --omit=dev --package-lock-only`. Review `LISTING-EN.md`, `LICENSE`, and `docs/LICENSES-THIRD-PARTY.md` when adding a dependency. Then run `scripts/Build-OfflinePackage.ps1` to create the clean ZIP.
