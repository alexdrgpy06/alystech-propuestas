# Third-party notices

This source package does not bundle dependencies in the release ZIP. Installing the exact dependency graph is governed by `package-lock.json`. The following direct dependencies are used by the product:

| Component | Version | Purpose | Declared license |
|---|---:|---|---|
| React | 19.2.7 | User interface | MIT |
| React DOM | 19.2.7 | Browser rendering | MIT |
| PDFKit | 0.15.0 | A4 PDF generation | MIT |
| Vite | 7.3.6 | Development server and build | MIT; its distributed artifact includes notices for transitive code |

`package-lock.json` records the resolved transitive packages and their declared license metadata. When producing a distribution that bundles dependencies or generated assets, regenerate a complete notice file from the installed dependency tree and include all required notices. The Vite package itself contains its bundled notices in `node_modules/vite/LICENSE.md` after installation.

Product code is covered separately by [`../LICENSE`](../LICENSE). This inventory is informational and does not replace the authoritative license texts supplied by each dependency.
