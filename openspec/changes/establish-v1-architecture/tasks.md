# Tasks

This change produces specifications and documentation only. Implementation happens in the follow-up changes listed in group 3, each with its own tasks.

## 1. Specifications

- [x] 1.1 Write proposal with eight capability boundaries and out-of-scope list; verify `openspec validate establish-v1-architecture` passes
- [x] 1.2 Write delta spec `album-book-model`; verify every requirement has at least one scenario
- [x] 1.3 Write delta spec `photo-ingestion`; verify every requirement has at least one scenario
- [x] 1.4 Write delta spec `album-planning`; verify every requirement has at least one scenario
- [x] 1.5 Write delta spec `layout-library`; verify every requirement has at least one scenario
- [x] 1.6 Write delta spec `theme-generation`; verify every requirement has at least one scenario
- [x] 1.7 Write delta spec `cover-and-maps`; verify every requirement has at least one scenario
- [x] 1.8 Write delta spec `print-rendering`; verify every requirement has at least one scenario
- [x] 1.9 Write delta spec `order-pipeline`; verify every requirement has at least one scenario

## 2. Engineering documentation

- [x] 2.1 Write `docs/technical-plan.md` covering system shape, data model, planner, geometry, theme pipeline, print production, upload, gates, privacy flows, testing and build order; verify every spec capability is referenced by at least one section
- [x] 2.2 Write `docs/decisions.md` ledger with every decision made in the review; verify each row has a date, rationale and status
- [x] 2.3 Write `design.md` indexing decisions with rejected alternatives and pointing into the technical plan; verify no section merely restates the proposal
- [ ] 2.4 Add Cursor rules for spec workflow, commit discipline and architecture invariants under `.cursor/rules/`; verify each rule file has valid frontmatter with `alwaysApply: true`
- [ ] 2.5 Add a README that explains the repository layout, the OpenSpec workflow and where decisions live; verify links resolve

## 3. Follow-up implementation changes (to be created with `openspec new change`, in this order)

- [ ] 3.1 `build-core-plan-model`: plan types, layout library data, geometry module, validator, pricing; verified by unit and property tests with no browser
- [ ] 3.2 `build-planner`: clustering, special groups, density packing, hero promotion, parity padding, incremental repack; verified by property tests (every photo once, no gutter, minimums, determinism)
- [ ] 3.3 `build-ingestion`: selection, EXIF, orientation, thumbnails in a worker, IndexedDB persistence, file handles, metadata questions; verified by Playwright on fixture files including HEIC and a placeholder file
- [ ] 3.4 `build-preview`: React spread view on shared geometry, watermark overlay, edits and validation display; verified by visual snapshot against geometry fixtures
- [ ] 3.5 `build-print-producer`: per-page PDF in a worker, JPEG passthrough and decode paths, colour handling, fonts, boxes, preflight; verified by `qpdf --check` and box inspection on a fixture book
- [ ] 3.6 `build-api-orders`: albums, orders, state machine with auto and manual gates, pricing endpoint, chunk upload, manifest, assembler and validation, retention jobs; verified by integration tests
- [ ] 3.7 `build-theme-pipeline`: brief inference, prompt templates, model adapter, upscaler, acceptance checks, fallback, storage, preview wiring; verified by fixture images through the checks and one real generation
- [ ] 3.8 `build-maps`: geocoding, region shapes, pins, route curve, vector rendering in preview and print, single-marker fallback; verified by rendering a fixture itinerary
- [ ] 3.9 `build-covers`: placement templates, oversized artwork crop per binding and spine, photo placement, title text, static back cover; verified by rendering both bindings from one asset
- [ ] 3.10 `first-test-print`: full flow on 20 fixture photos through assembly and a real printer order; verified by inspecting the physical book against the preview
