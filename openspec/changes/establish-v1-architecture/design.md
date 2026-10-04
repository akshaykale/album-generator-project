# Design

## Context

Greenfield. No code exists. The product brief and review conversation produced a set of fixed constraints (see `openspec/config.yaml` context and `docs/decisions.md`). This change writes the behavior contract; the engineering detail that implements it lives in [`docs/technical-plan.md`](../../../docs/technical-plan.md), which this design summarises and points to rather than repeats.

Constraints that shape every choice: solo developer, no designer, no human QA on artwork, originals never uploaded, deterministic placement and price, payment sequencing deferred.

## Goals / Non-Goals

**Goals:**
- One geometry source of truth so approved equals printed.
- Pure, testable planner and pricing with no browser dependency.
- Print production whose memory does not grow with album length.
- Theme pipeline that is safe to run unattended.
- An order pipeline that accepts payment at either gate later.

**Non-Goals:**
- Choosing hosting, printer or payment provider.
- Mobile production, cropping tools, automatic selection, cloud project save.
- Per-page generated art or image-to-image on any user photo.

## Decisions

Full rationale and rejected alternatives for each are in the technical plan; the list here is the index.

1. **Deterministic planner over LLM planning.** Rejected: LLM returns plan JSON that code validates. Reason: validation can reject illegal output but cannot make a model stable or complete; identical inputs must give identical books. (Technical plan §6)
2. **Two renderers, one geometry module in millimetres.** Rejected: render preview DOM to PDF (HTML-to-PDF, Vivliostyle). Reason: re-encodes photos, poor print box control, whole-document memory. (§7, §11)
3. **Per-page PDF production with `pdf-lib`, embedding original JPEG bytes when possible, decoding one image at a time otherwise.** Rejected: one document for the whole book; full-page canvas rasterization. Reason: memory and vector text. (§11)
4. **Hash-addressed per-page chunk upload with manifest; server concatenation and validation.** Rejected: single large upload. Reason: resumability and no giant client allocation. (§12)
5. **Layouts as data with slots that contain-fit the photo; minimum short edge 70 mm normal, 45 mm dense; justified rows for special groups computed at runtime.** Rejected: fixed-aspect frames with cover-fit. Reason: no-crop rule; fixed grids look ragged with mixed aspects. (§7)
6. **Theme artwork generated per album through a fixed style block shared by four prompts, upscaled, and gated by automated checks with neutral fallback.** Rejected: hand-authored themes; cached themes per destination; compositing AI sprites onto static paper. Reason: owner decision — no designer, unique per album, no cache; checks replace human QA. (§8)
7. **Maps as vectors from real coordinates with artwork only as texture.** Rejected: tile screenshots with a filter; model-drawn maps. Reason: geography must be correct; vectors print cleanly in theme colours. (§9)
8. **Order state machine with two pass-through gates behind a handler interface.** Rejected: fixing payment position now. Reason: owner wants payment attachable before or after production. (§13)
9. **Desktop Chromium for production; IndexedDB with file handles for persistence.** Rejected: mobile support in V1; storing originals in browser storage. Reason: HEIC decode, memory headroom, handle persistence only exist there. (§4)
10. **Cluster centroids and place names to the server; per-photo GPS stays local.** Rejected: raw GPS to an LLM. Reason: privacy and determinism. (§5, §14)

## Risks / Trade-offs

- [Lettering or busy motifs slip through generation] → negative prompt, OCR and contrast checks, regenerate, fallback; residual risk accepted by owner.
- [Upscaled artwork soft in print] → prompt for soft illustrative style; accepted.
- [Abandoned albums incur generation cost] → generate once per album; monitor cost per started album; move trigger later if needed.
- [Tab closed mid-production] → chunks persist server-side; manifest resumes missing pages.
- [Wide-gamut photos desaturate] → decode-through-browser path for non-sRGB; embed raw bytes only when sRGB.
- [Hardcover spine mismatch] → spine computed from final page count after packing; cover artwork oversized.
- [Preview and print diverge] → single geometry module; visual diff test.

## Migration Plan

Not applicable; greenfield. Archiving this change creates the eight main specs. Implementation proceeds as separate changes in the order given in technical plan §17.

## Open Questions

- Which image model and upscaler to adopt first. Deferrable: the adapter interface isolates it.
- Which printer, and therefore exact trim, bleed, page multiple and caliper table. Deferrable: all are configuration parameters in the specs.
- Exact thresholds for luminance, contrast and palette checks. Deferrable: tuned on the first generated sets; initial values in the technical plan.
