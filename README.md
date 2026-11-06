# Collected Light

An album-first photo library using the complete Pagelove Invitation/dark design. The nine approved CC0 sample photos are grouped into Weekend away, Around town and Everyday moments.

## What works

Create, rename and describe albums, choose covers, move photos, and remove albums while keeping their photos. Browse a responsive photo grid, search/sort, open the full-size viewer, navigate with keys or swipe, and inspect photo details. Add multiple JPEG/PNG/WebP photos by file picker or drop zone, preview/compress on-device and edit titles/captions/descriptions before committing. Undo recent changes and export/import complete portable HTML backups.

Edits autosave on this device and survive refresh. A transactional revision check prevents silent overwrites between tabs; errors retain the working document and provide export/retry/reconcile actions. This variant does not synchronize with shared Pagelove account storage. There is no owner token in the browser or runtime CDN.

## Document-first contract

The current DOM is the editable authority; the saved domain payload is its serialized semantic HTML document. Legacy format1 seed/backups migrate to version2 stable album references without losing photo identities/images. Version2 Album/Photo/Settings records are validated before replacement. Domain fields are not mirrored into a second editable JSON model. Keep the 2MB aggregate budget; images are compressed and embedded so backups remain self-contained. See docs/architecture.md.

## Develop and verify

Node22+. Install pinned development dependencies with `bun install --ignore-scripts` (or npm install --ignore-scripts), then run `node scripts/check.mjs`, `node --test tests/*.test.mjs` and `node scripts/deploy.mjs --prepare`. Runtime has no package installation. fake-indexeddb/linkedom are development-only test tools.

The existing Pagelove-hosted app is the primary acceptance target (docs/testing.md). The local loopback preview remains a supplemental fixture; its old server writer validates format1 and is not used by the new device-local editor. No fixture establishes native account authorization, cross-device syncing or physical phone acceptance.

## Deploy

Slide4 supplies a site, private authoring token and this repository to the user's coding AI. Run source checks, prepare site/, then use the trusted authoring deployment tool documented in docs/deployment.md. Code updates preserve installed records and visitor device libraries. Never embed credentials or reset user records to samples. Rebuild sharing assets after changing collection identity or deployment URL. HTML exports can be validated as an initial library source; replacing existing hosted data is a separate explicit migration, not a code update.

Source/license/hash records for the sample photography: samples/SOURCES.json. MIT code; source photos retain their CC0 dedication. Retain the complete selected Pagelove design and local fonts.
