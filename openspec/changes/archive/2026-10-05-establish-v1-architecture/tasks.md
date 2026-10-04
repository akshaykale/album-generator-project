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
- [x] 2.4 Add Cursor rules for spec workflow, commit discipline and architecture invariants under `.cursor/rules/`; verify each rule file has valid frontmatter with `alwaysApply: true`
- [x] 2.5 Add a README that explains the repository layout, the OpenSpec workflow and where decisions live; verify links resolve

## Follow-up implementation changes

Not tasks of this change. Each is created later with `openspec new change <name>` and carries its own tasks. Order and verification method are in `docs/technical-plan.md` section 17:

`build-core-plan-model`, `build-planner`, `build-ingestion`, `build-preview`, `build-print-producer`, `build-api-orders`, `build-theme-pipeline`, `build-maps`, `build-covers`, `first-test-print`.
