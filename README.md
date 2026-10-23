# Travel Album Generator

Turns a user's already-curated photos into a printed square photo album with a unique AI-generated visual identity, while the original photo files never leave the browser.

Status: specification complete, implementation not started.

## Where things live

| Path | Purpose |
|---|---|
| `openspec/specs/<capability>/spec.md` | Source of truth for behavior. Eight capabilities: album-book-model, photo-ingestion, album-planning, layout-library, theme-generation, cover-and-maps, print-rendering, order-pipeline. |
| `openspec/changes/<name>/` | In-progress changes: proposal, delta specs, design, tasks. Archived changes move to `openspec/changes/archive/`. |
| `docs/technical-plan.md` | The engineering behind the specs: packages, data model, planner, geometry, theme pipeline, print production, upload, gates, testing, build order. |
| `docs/decisions.md` | Dated ledger of every product and engineering decision. |
| `.cursor/rules/` | Always-on rules: spec workflow, commit discipline, architecture invariants. |

## Workflow

1. Behavior changes start with `openspec new change <name>` (or `/opsx-propose`).
2. Write proposal, delta specs, design where needed, and tasks. Run `openspec validate <name> --strict`.
3. Implement from `tasks.md`, one local commit per task, message states why and what landed.
4. `openspec archive <name>` merges delta specs into `openspec/specs/`. Append new decisions to `docs/decisions.md`.

All git history is local. No remote is configured by design.

## Fixed principles

- The user chooses the photos; code arranges them; nothing is cropped or regenerated.
- Placement, page count and price are deterministic.
- Artwork is AI-generated per album, unique, checked by code, never by a person.
- Preview and print share one geometry; print is built page by page in the browser and uploaded in chunks.
- Payment attaches to a gate later; the pipeline does not depend on where.

See `docs/decisions.md` for the full list with rationale.
