# Proposal

## Why

Nothing runnable exists yet. The fastest way to learn whether the product feels right is a web app a person can walk through: enter a trip, pick photos, choose album options, and see the shape of what comes next. Because the product is a printed book, the app itself should read as a book: paper pages, a spine, and a page turn between steps, so the metaphor is set before the user ever sees a preview.

## What Changes

- Create the monorepo and the `apps/web` application.
- Add a book-themed application shell: a two-page spread on wide screens (left page is the running table of contents of what the user has entered, right page is the active step) and a single page on narrow screens.
- Add a page-turn transition between steps (forward and back), short, interruptible, and replaced by a crossfade when the user prefers reduced motion. Interactions inside a step never flip.
- Add the step pages: Cover (start), Your trip, Your photos (local selection with thumbnails and removal), Your album (density, binding, style note, cover photo), Preview (placeholder until the planner exists) and Order (placeholder summary).
- Keep all photo data local in the browser; this change does not add a server.
- Add always-on keyboard navigation for steps and a dog-ear corner control as the playful "next page" affordance.

Out of scope: EXIF extraction, IndexedDB persistence and file handles (follow-up `build-ingestion`), the planner and real preview, theme generation calls, any server, payment, map rendering.

## Capabilities

### New Capabilities

- `web-shell`: the book-themed application frame, step navigation and transition behavior, responsive layout, and accessibility requirements that every screen in the app inherits.

### Modified Capabilities

None. Photo selection in this change stays within what `photo-ingestion` already requires (local reading, thumbnails, no upload); EXIF and persistence requirements remain for `build-ingestion`.

## Impact

- New: root `package.json` workspaces, `apps/web` (React, TypeScript, Vite, Tailwind, motion library).
- `docs/technical-plan.md` section 2 repo layout is realised for `apps/web`; a new section on the web shell is added.
- No API, no persistence, no external calls.
