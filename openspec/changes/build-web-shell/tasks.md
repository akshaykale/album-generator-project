# Tasks

## 1. Scaffold

- [ ] 1.1 Create root `package.json` with npm workspaces (`apps/*`, `packages/*`) and `apps/web` Vite React TypeScript app; verify `npm install` succeeds and `npm run -w apps/web build` produces `dist/`
- [ ] 1.2 Add Tailwind v4 with paper palette tokens and the `motion` library; verify a styled page renders in `npm run dev`

## 2. Book shell

- [ ] 2.1 Implement the book frame (paper background, spine, spread at >= 1024 px, single page below) with step state in a reducer and hash mirroring; verify both layouts render at 1280 px and 390 px
- [ ] 2.2 Implement the page-turn transition as a non-interactive sheet layer with reduced-motion crossfade and session toggle; verify forward and back turns complete under 700 ms and content underneath stays flat and focusable
- [ ] 2.3 Implement next/back controls, dog-ear corner control (>= 44 px hit area), arrow-key navigation outside text fields, and focus move to the new heading; verify with keyboard only

## 3. Steps

- [ ] 3.1 Cover and Your trip steps with required-field gating; verify next is disabled until title is present and data survives back/forward
- [ ] 3.2 Your photos step: local file selection, progressive thumbnails with bounded decode, count, remove, HEIC placeholder tile; verify 60 fixture images show progressively and no network request carries image bytes
- [ ] 3.3 Your album step: density, binding, style note, cover photo chooser from selected photos; verify contents page updates as options change
- [ ] 3.4 Preview and Order placeholder steps that state what will appear and show chosen options without page count or price; verify text matches the spec scenario
- [ ] 3.5 Left contents page that fills in from state; verify every entered field appears once

## 4. Verification and docs

- [ ] 4.1 Run the app in a browser at desktop and mobile widths and exercise the full flow; verify lint passes and no console errors
- [ ] 4.2 Add a web shell section to `docs/technical-plan.md` and append any new decisions to `docs/decisions.md`; verify links resolve
