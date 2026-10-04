# Proposal

## Why

People take hundreds of photos on trips and at family events, and almost none of them are looked at again. Existing album tools hand the user a grid editor and hours of work. We want a product where the user picks the photos that matter, types a few trip details, and receives a designed, printed square album with a visual identity unique to that trip, with the originals never leaving their device as files.

This change establishes the V1 behavior contract for the whole system before any code exists, so that implementation changes can be small and verified against agreed requirements.

## What Changes

- Define the album book model: square format, spreads as the design unit, single opening and closing pages, front cover, static back cover, both bindings.
- Define local photo ingestion: metadata extraction in the browser, thumbnails, local persistence with file handles, fallback order for missing metadata, capped user questions.
- Define deterministic planning: grouping by time and location, user-created special groups as protected units, density targets, a packer that guarantees every photo appears once with no cropping and no gutter crossing, page parity, and a validator.
- Define the layout library: a small set of layout families with orientation and mirror variants, slot rules, minimum photo sizes, justified dense layouts for special groups, and one geometry contract consumed by preview and print.
- Define the AI theme pipeline: a text inference step producing a theme brief, image generation of three unique spread backgrounds and one cover artwork per album, upscaling to print resolution, automated acceptance checks, regeneration and neutral fallback, server-side storage.
- Define covers and maps: user-chosen cover photo placed deterministically into a chosen placement template over generated artwork; back cover is one static asset; maps built from real coordinates and drawn as vectors in theme colors.
- Define preview and print rendering: React preview on thumbnails with watermark and edits; print PDF built page by page in the browser from original files with correct orientation, color, fonts and print boxes; chunked upload; server assembly and validation.
- Define the order pipeline: state machine with two gates (before rendering, after assembly) that hold no payment logic; pricing from packed page count and binding; privacy statement and retention of uploaded print output.

Out of scope for this change: application code, choice of hosting, the specific printer, payment provider integration, mobile ordering, cropping tools, automatic photo selection, cloud project save, map licensing or attribution.

## Capabilities

### New Capabilities

- `album-book-model`: the physical structure of an album (format, covers, spreads, opening and closing pages, parity, binding options) and the plan data that describes it.
- `photo-ingestion`: selecting photos in the browser, extracting metadata and thumbnails locally, persisting project state, resolving missing metadata.
- `album-planning`: grouping, ordering, special groups, density, packing photos into layouts, validation of the resulting plan.
- `layout-library`: the layout families, slot rules, size minimums, dense group layouts and the shared geometry contract.
- `theme-generation`: inferring a theme brief and generating, checking and storing the per-album artwork.
- `cover-and-maps`: cover composition from user photo plus artwork, the static back cover, and map construction from real places.
- `print-rendering`: preview rendering, print PDF production, color and orientation handling, chunked upload and server assembly.
- `order-pipeline`: order states and gates, pricing, privacy guarantees and retention of print output.

### Modified Capabilities

None. The project has no existing specs.

## Impact

- Creates the first eight specs under `openspec/specs/`.
- Creates `docs/technical-plan.md` (engineering plan) and `docs/decisions.md` (decision ledger).
- Creates always-on Cursor rules for the spec workflow, commit discipline and architecture invariants.
- No code, dependencies or external services are added by this change. Subsequent changes implement each capability.
