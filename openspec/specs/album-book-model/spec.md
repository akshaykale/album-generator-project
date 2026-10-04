# album-book-model Specification

## Purpose
Defines the physical structure of an album and the plan data that describes it, so that planning, preview, print and pricing all agree on what a book is.

## Requirements

### Requirement: Album pages are square
The system SHALL design every album for square pages. The trim size SHALL be a configurable production parameter (initially 210 x 210 mm) and all layouts SHALL be expressed relative to the trim so a different square size does not change the templates.

#### Scenario: Trim size changes
- **WHEN** the production trim size is changed from 210 mm to 254 mm
- **THEN** every layout still produces valid geometry without template edits

### Requirement: Book structure
An album SHALL consist of, in order: front cover, inside front cover, page 1 (a right-hand single page), zero or more two-page spreads, page N (a left-hand single page), inside back cover, back cover. When the binding has a printable spine the album SHALL also include a spine object whose width is derived from the final page count and the binding's paper caliper.

#### Scenario: Minimal album
- **WHEN** an album is planned with 4 photos at Spacious density
- **THEN** the plan contains a front cover, page 1, page N and a back cover, and may contain zero full spreads

#### Scenario: Spine width follows page count
- **WHEN** the final inner page count is known and the binding is hardcover
- **THEN** the spine width is recomputed from that page count and the binding's caliper table before cover artwork is cropped

### Requirement: Inner page count parity
The inner page count SHALL be even and SHALL satisfy the printer's page multiple (initially 2, configurable to 4). When the packed content does not satisfy parity the system SHALL append a colophon page (album title, dates, photo count) or a blank page rather than alter photo layouts.

#### Scenario: Odd packed page count
- **WHEN** the packer produces 33 content pages and the multiple is 2
- **THEN** the plan contains 34 inner pages and the 34th is a colophon or blank page

### Requirement: Spread plan data
The system SHALL represent an album plan as structured data containing: album identity, theme reference, binding, trim size, the cover definition, an ordered list of spreads, and the single opening and closing pages. Each spread SHALL reference one background variation and SHALL contain a left and a right page, each with a layout identifier and an ordered list of photo identifiers. Each single page SHALL reference which half of a background variation it uses.

#### Scenario: Plan is self-describing
- **WHEN** a plan is serialized and loaded in a different session with the same theme assets and photos
- **THEN** preview and print reproduce the identical book without re-running the planner

### Requirement: Photos stay on one page
A user photo SHALL belong entirely to one page. No photo rectangle in the plan SHALL intersect the gutter line of a spread.

#### Scenario: Validator rejects a gutter-crossing rectangle
- **WHEN** a plan contains a photo rectangle whose horizontal extent includes the spread centre
- **THEN** validation fails with the spread and photo identified

### Requirement: Background artwork may cross the gutter
A spread background SHALL be a single continuous image covering both pages plus bleed on all outer edges. The opening and closing single pages SHALL use the matching half of a background variation.

#### Scenario: Opening page background
- **WHEN** page 1 is rendered
- **THEN** it shows the right half of its assigned background variation, including right-edge bleed, and the inner edge is extended from the adjoining half

### Requirement: Binding is a user choice
The system SHALL support hardcover and softcover bindings as production options chosen by the user at pricing time. The book model SHALL carry the chosen binding so that cover dimensions, spine presence and price derive from it.

#### Scenario: Switching binding
- **WHEN** the user changes binding from softcover to hardcover after planning
- **THEN** the page plan is unchanged, the cover geometry and price are recomputed, and the preview reflects the new cover

### Requirement: Static back cover
The back cover SHALL be a single asset shared by all albums containing company information and an ordering QR code. It SHALL be tinted or framed to the album's palette only if that transformation is deterministic; it SHALL never be generated per album.

#### Scenario: Two albums, one back cover
- **WHEN** two albums with different themes are rendered
- **THEN** their back covers contain identical text and QR content
