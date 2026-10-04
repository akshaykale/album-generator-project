# print-rendering Specification

## Purpose
Defines the interactive preview, the production of print-ready output from original photos in the browser, and how that output reaches the server in chunks and becomes one validated print file.

## Requirements

### Requirement: Preview reflects final geometry
The preview SHALL render each spread from the shared geometry contract using thumbnails and preview-size backgrounds, with spread navigation, and SHALL show the same photo positions, sizes, backgrounds, text and maps as the print output.

#### Scenario: Approved is what prints
- **WHEN** the user approves a spread in preview
- **THEN** the printed spread has every element in the same relative position and size

### Requirement: Preview watermark
Before the order is submitted the preview SHALL carry a visible watermark overlay. The watermark SHALL be an overlay in the preview renderer and SHALL NOT be part of the plan or the print output.

#### Scenario: Watermark absent from print
- **WHEN** the print output is produced
- **THEN** it contains no watermark

### Requirement: Preview edits
From the preview the user SHALL be able to: change the cover photo and template, move or remove photos, create and edit special groups, change a group's style, choose an alternate compatible layout for a page, reorder spreads, and edit titles. Every edit SHALL re-validate the plan.

#### Scenario: Reorder spreads
- **WHEN** the user drags spread 6 before spread 4
- **THEN** the plan order updates, backgrounds re-alternate, and validation passes

### Requirement: Print output is produced in the browser from originals
Print output SHALL be generated in the browser using the original photo files at full resolution. The server SHALL NOT receive original photo files.

#### Scenario: Source files unchanged on server
- **WHEN** an order completes
- **THEN** the server holds rendered print pages and no original photo file

### Requirement: Page by page production
Print output SHALL be produced one page at a time. Only the photos of the current page SHALL be decoded at full resolution; after the page is written and queued for upload, its decoded images SHALL be released. The system SHALL cap concurrent full-resolution decodes (initially 1).

#### Scenario: Bounded memory
- **WHEN** a 40-page album with 100 photos averaging 12 megapixels is rendered
- **THEN** peak memory stays bounded by one page's photos plus one page's output, regardless of album length

### Requirement: Image fidelity in print
Each photo SHALL be placed at its orientation-corrected pixels. When a photo's resolution exceeds what the slot needs at 300 dpi it MAY be downscaled to that need; it SHALL NOT be upscaled. Colour SHALL be preserved by converting wide-gamut sources to sRGB or by tagging the embedded image with its colour profile; untagged embedding of wide-gamut data is not permitted.

#### Scenario: Display P3 phone photo
- **WHEN** a photo tagged Display P3 is placed
- **THEN** the printed colours match the on-screen preview within normal print tolerance and are not desaturated

#### Scenario: EXIF-rotated photo
- **WHEN** a photo stored sideways with an orientation tag is placed
- **THEN** it appears upright in both preview and print

### Requirement: Print geometry in output
Every output page SHALL be at trim size plus bleed, SHALL declare its trim and bleed boxes, and SHALL extend background artwork into the bleed. Spread backgrounds SHALL be split per page with the inner edge extended from the adjoining half.

#### Scenario: Printer reads boxes
- **WHEN** the final file is inspected
- **THEN** every page reports the configured trim size and 3 mm bleed

### Requirement: Fonts and text
All text SHALL be real text with fonts embedded and subset. The font set SHALL include a face capable of rendering the scripts of the user's place names (at minimum Latin and Japanese).

#### Scenario: Japanese place name
- **WHEN** a section title contains Japanese characters
- **THEN** the characters render correctly in print and the font is embedded

### Requirement: Preflight before production
Before producing print output the system SHALL verify that every photo file is still readable and decodable, SHALL compute each photo's effective resolution at its printed size and warn below 200 dpi, and SHALL estimate total output size. Production SHALL NOT start while any photo is unreadable.

#### Scenario: Missing file
- **WHEN** one photo's file is no longer accessible
- **THEN** the user is asked to reselect it and production waits

### Requirement: Chunked upload
Each produced page SHALL be uploaded as its own chunk identified by album, page index and content hash. Uploads SHALL be resumable and order-independent, and the client SHALL finish by submitting a manifest listing every page and hash.

#### Scenario: Interrupted upload
- **WHEN** the connection drops after 20 of 34 pages
- **THEN** on reconnect only the missing pages are uploaded and the manifest completes the set

### Requirement: Server assembly and validation
The server SHALL assemble pages in manifest order into one print file and SHALL validate: page count equals the plan, every page has the configured trim and bleed, fonts are embedded, images meet the minimum resolution recorded in preflight, and the file opens. A file failing validation SHALL be rejected with the failing pages identified.

#### Scenario: Wrong page count
- **WHEN** the manifest lists 34 pages but the plan has 36
- **THEN** assembly is refused and the client is told which indices are missing

### Requirement: Supported ordering environment
Final print production SHALL be supported on current desktop Chromium browsers in V1. Other browsers MAY preview and edit; when the user attempts production on an unsupported browser the system SHALL explain the limitation before starting.

#### Scenario: Unsupported browser
- **WHEN** a user on a mobile browser attempts to produce print output
- **THEN** they are told to continue on a desktop browser and the project remains intact
