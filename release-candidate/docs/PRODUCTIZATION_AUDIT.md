# Productization audit / design — 2026-09-09

Source inspected: local owner repository frontend. Strategy: allowlisted extraction into standalone static package. Original worktree is untouched. Existing product spec supplies the approved product boundary; no new SaaS or delivery service is introduced.

| Area | Decision | Reason |
|---|---|---|
| lib/totals.ts | Extract + abstract | Preserve option lookup, default selections, included/applicable add-on exclusions; generic IDs, integer minor units, deduplication and strict validation |
| types/proposal.ts | Abstract | Fixed IT group union and client-specific fields prevent arbitrary proposals; smaller validated JSON contract |
| hooks/useProposalSelections.ts | Adapt concept | Per-group choices and extras kept; static DOM state removes framework runtime |
| wizard/options/summary | Replace presentation | Source hardcodes 13 steps, IT labels, icons and narratives; generic configuration-driven steps needed |
| canvas/PDF endpoint | Replace | Source endpoint requires client-specific backend; print stylesheet uses same summary/prices as UI |
| decisions/API | Replace | Local JSON receipts with normalized decision types, timestamp/version/snapshot; demo never persists or transmits |
| data/*, public/*, legacy HTML | Exclude | Real identities, client pricing, promises, branding and visual reference assets |
| server.js, env, deployments | Exclude | Email/notification/private deployment coupling not part of static V1 |
| external fonts/icons | Exclude | System font, native controls; no third-party assets copied |
| source tests | Replace with generic contracts | Existing fixtures represent real clients; test arithmetic, exclusions, invalid config and payloads synthetically |

Three original synthetic starter examples: website, managed services, consulting. ES/EN UI dictionary. Commercial local configuration editor, JSON import/export, local save, client preview via `?client=1`; demo uses `?demo=1` and ignores saved data. The included Node server generates an actual A4 PDF download through `/api/pdf`; it does not send email or webhook notifications. Decisions are local receipts, not delivered orders or electronic signatures.

Redistribution rights: code provenance must be confirmed by owner before sale; no assertion that repository ownership grants third-party asset rights. No source assets redistributed. License and notices ship separately. V1 release limitations: no webhook delivery, no cloud persistence, no access-control/DRM. JSON import/export remains available for advanced configuration, while the basic editor covers seller/client, title, branding, prices and labels. Position package as a self-hosted source kit.
