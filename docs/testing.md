# Hosted-first Photo Album acceptance

The Pagelove-hosted demo is the primary acceptance environment:
https://kayak-draw-9549.onpagelove.com/onboarding/after/demos/design-refresh-20261106/photo-album/

Wesley selected this testing preference on November 6, 2026. Exercise real hosted asset/selector delivery, browser uploads, album CRUD, viewer/keyboard/touch behavior, IndexedDB save/readback after refresh, two-tab conflicts and HTML backup/restore. Record the exact deployed source and screenshots. Device-local saves are explicitly labeled and do not prove native account storage or permissions. Pure model, transaction and failure tests run locally as supplemental evidence. Never replace live user content while deploying code; preserve the original seed on updates.

Current goal-review acceptance and runtime boundaries: see [goal-review.md](goal-review.md). 53 checks now pass, including atomic batch movement/removal and upload-budget rejection. Hosted-first evidence is in the parent audit/2026-11-06-photo-library-review/.
