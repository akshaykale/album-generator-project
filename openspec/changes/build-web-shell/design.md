# Design

## Context

See proposal.md. Greenfield front end. The constraint that matters most here: the shell must feel like a book without making a six-step form tedious or inaccessible. Published guidance on wizards and transitions converges on the same points: keep steps ordered with visible progress, make transitions brief and directional, reserve 3D flips for singular moments, and honour reduced motion. Flip libraries that deform live DOM (react-pageflip / StPageFlip) only forward clicks for links and buttons, so form fields cannot live inside them.

## Goals / Non-Goals

**Goals:**
- Book metaphor as the frame: paper, spine, contents page, page turn between steps.
- A turn that is fast, directional, interruptible, and never wraps interactive content.
- One layout that works at 390 px and 1440 px.
- Keyboard and screen reader parity with the pointer path.

**Non-Goals:**
- Realistic page curl physics or drag-to-turn.
- Persisting state across reloads (follow-up `build-ingestion`).
- The real album preview.

## Decisions

1. **Custom CSS 3D turn instead of a flipbook library.** The outgoing page is snapshotted as a non-interactive "sheet" layer that rotates around the spine (`rotateY` with `transform-origin` at the spine edge, perspective on the book container) while the incoming page is already mounted flat underneath. When the sheet passes 90 degrees its back face shows the incoming page's paper. Rejected: react-pageflip and similar, because inputs inside deformed pages do not receive events and screen readers cannot read canvas pages. Rejected: animating the live step content, because text blurs during transform and focus/caret behave badly.
2. **Flip only on step change; everything inside a step is flat.** Rejected: flipping on sub-steps (e.g. each photo batch) because frequent 3D motion is the documented path to "gimmicky" and vestibular discomfort.
3. **Duration 550 ms forward and back, ease-in-out; crossfade 180 ms under reduced motion; in-app toggle stored in session.** Rejected: 1 s+ cinematic turns; they would add 5 seconds to a six-step flow.
4. **Spread on >= 1024 px, single page below.** Left page is a contents list that fills in as the user progresses (title, dates, places, photo count, density, binding), which doubles as a review surface. Rejected: showing the same step on both pages; wastes the left page.
5. **Dog-ear corner as a secondary next control, plus a conventional button.** The dog-ear is the playful, book-relatable affordance; the button is the discoverable one. Rejected: dog-ear only; discoverability on mobile is poor.
6. **No swipe-to-turn in V1.** The photo grid scrolls and selects; horizontal swipes would collide with it. Rejected: edge swipes; small hit area and conflicts with browser back gestures.
7. **Stack: React 19, TypeScript, Vite, Tailwind v4 (paper palette as design tokens), `motion` for the turn and small micro-interactions. State in a single reducer context, no router (steps are state, URL hash mirrors step for refresh).** Rejected: Next.js (no server needed yet), Zustand (overkill for one reducer).
8. **Thumbnails via `createImageBitmap` with resize, one decode at a time, held in memory as object URLs.** HEIC decode and EXIF are deferred to `build-ingestion`; HEIC files are accepted and shown with a "preview later" tile so the flow is not blocked.

## Risks / Trade-offs

- [Perspective transforms on large pages drop frames on low-end phones] → the rotating sheet is a flat composited layer with `will-change: transform`; under 1024 px the sheet is smaller and the duration shorter (450 ms).
- [Users miss the dog-ear] → conventional Next button always present.
- [Contents page empty at start looks odd] → opening state shows a short "what will happen" list that converts into entered values.
- [Hash-based step mirror lets users jump ahead by editing the URL] → guard: the reducer clamps to the furthest allowed step.

## Open Questions

- Exact paper palette and type pairing; tuned visually during implementation, does not affect requirements.
