# Decision Ledger

One line per decision, newest at the bottom. Status is `accepted`, `superseded by Dnn` or `revisit`. When an OpenSpec change introduces or reverses a decision, append here in the same commit.

| ID | Date | Decision | Why | Status |
|---|---|---|---|---|
| D01 | 2026-10-04 | The user chooses the photos; the system never selects or ranks them. | Avoids the hardest vision problem and the trust problem; the user already curated. | accepted |
| D02 | 2026-10-04 | Every selected photo appears exactly once unless the user removes it. | Core promise of the product; trivially verifiable in code. | accepted |
| D03 | 2026-10-04 | No automatic cropping in V1. Slots adopt the photo's aspect; background shows around it. | Preserve the photograph as taken. | accepted |
| D04 | 2026-10-04 | Customer photographs are never passed to or altered by an image model. | Authenticity; faces and scenes must be real. | accepted |
| D05 | 2026-10-04 | Square album; trim size is a configurable parameter, initially 210 mm. | Simplifies the layout system; final size depends on printer. | accepted |
| D06 | 2026-10-04 | Photo placement, grouping, page count, parity and price are deterministic code, not an LLM. | Hard constraints are trivial in code and unreliable from a model; identical inputs must give identical books. | accepted |
| D07 | 2026-10-04 | Spread is the design unit; page 1 and page N are single pages facing the covers. | Matches how a book is read and printed. | accepted |
| D08 | 2026-10-04 | User photos never cross the gutter; background artwork may. | Binding eats content; artwork is tolerant. | accepted |
| D09 | 2026-10-04 | Density (Spacious, Balanced, Compact) is the user input; page count is an output. | Users do not know how many pages they want. | accepted |
| D10 | 2026-10-04 | Users can create named special groups with dense justified layouts; groups are protected units. | Thematic collections (e.g. statues across days) need to sit together. | accepted |
| D11 | 2026-10-04 | Every album receives unique AI-generated artwork: three spread backgrounds and one cover artwork. No cache, no reuse across albums. | Personalization is the product; solo project with no designer. | accepted |
| D12 | 2026-10-04 | No human QA on generated artwork. Quality is enforced by prompt constraints and automated checks (luminance, contrast, palette, text detection) with regenerate-then-neutral-fallback. | One-person project; orders must never block on artwork. | accepted |
| D13 | 2026-10-04 | Stamp or motif details inside artwork are not individually controlled; consistency and premium feel are what is checked. | Keep the pipeline simple. | accepted |
| D14 | 2026-10-04 | Original photo files never leave the browser. Only rendered print pages are uploaded. | Cost and privacy. | accepted |
| D15 | 2026-10-04 | Preview (React) and print (PDF) are separate renderers sharing one geometry module in millimetres. | Approved must equal printed; HTML-to-PDF is unsuitable for print. | accepted |
| D16 | 2026-10-04 | Print output is produced page by page in the browser and uploaded in hash-addressed chunks; the server assembles and validates. | Bounded memory; resumable; no source upload. | accepted |
| D17 | 2026-10-04 | Payment is not sequenced yet. The order pipeline has Gate A (before production) and Gate B (after assembly) with no payment logic; payment plugs in later. | Build the product first; keep both orderings possible. | accepted |
| D18 | 2026-10-04 | Binding (hardcover or softcover) is the user's choice at pricing time; the book model supports both. | Price-driven user decision. | accepted |
| D19 | 2026-10-04 | Back cover is one static asset for all albums (company info, QR). | No per-album work needed there. | accepted |
| D20 | 2026-10-04 | Cover placement templates are predefined; AI generates surrounding artwork; the user's photo is placed deterministically. | Real photo, consistent composition. | accepted |
| D21 | 2026-10-04 | Maps use real coordinates for pins and routes and are drawn as vectors in theme colours; AI may only texture behind them. | Geography must be right even when the look is artistic. | accepted |
| D22 | 2026-10-04 | Map licensing and attribution are out of scope. | Product owner decision. | accepted |
| D23 | 2026-10-04 | Final print production is supported on desktop Chromium in V1; other browsers may preview. | File handles, HEIC decode and memory headroom. | accepted |
| D24 | 2026-10-04 | Project state persists in IndexedDB with file handles on Chromium; reselect-and-match elsewhere; originals never stored in browser storage. | Survive reloads without uploading. | accepted |
| D25 | 2026-10-04 | Missing metadata fallback order: metadata, itinerary, neighbors, selection order; grouped questions capped at 5; never random. | Avoid interrogating the user. | accepted |
| D26 | 2026-10-04 | Only place names and cluster centroids are sent to the server; per-photo GPS stays on device. | GPS of homes and schools is sensitive even without pixels. | accepted |
| D27 | 2026-10-04 | Uploaded chunks deleted after assembly; final print file retained 60 days after fulfilment then deleted. | Reprint window versus exposure. | accepted |
| D28 | 2026-10-04 | All commits stay local; no remote is configured. | Owner preference. | accepted |
| D29 | 2026-10-04 | Spec-driven development with OpenSpec; one small local commit per task with a message stating why and what. | Traceability for a solo project. | accepted |
