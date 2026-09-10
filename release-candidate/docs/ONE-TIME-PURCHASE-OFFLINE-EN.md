# One-time purchase and offline use

This product is delivered once as a source-code ZIP. It does not activate subscriptions, accounts, telemetry, DRM, payments, or mandatory calls to third-party services. The buyer keeps the ZIP, installs it on their own computer, and can choose to self-host it.

## Offline use

After installing dependencies with `npm ci`, run `npm run build` and `$env:PORT=5182; node server.mjs`. Open `http://127.0.0.1:5182/`; the application and PDF work locally. Configurations, selections, and receipts stay in the current browser. Export JSON to back up or transfer a proposal.

The initial install needs the npm registry or a local/corporate cache containing the `package-lock.json` dependencies. For an air-gapped workstation, prepare that cache in advance or copy a verified installation with its dependencies; the commercial ZIP deliberately excludes `node_modules`.

## Product boundaries

The package does not provide hosting, domain, backup, support, migration, remote access, email, CRM, payments, e-signatures, legal/tax compliance, or data-protection services. Each buyer must assess those services if needed.

## Rights and notices

The package code is distributed under the included `LICENSE`. Third-party components retain their own licenses, identified in `LICENSES-THIRD-PARTY.md`. A one-time purchase price pays for delivery and any seller-agreed services; it does not replace license notices or limit rights already granted by an open-source license. Confirm ownership of any trademark, image, copy, or configuration added before distribution.
