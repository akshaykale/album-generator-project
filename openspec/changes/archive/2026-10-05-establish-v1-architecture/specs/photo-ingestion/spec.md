# Spec Delta

## Purpose

Covers how the user's selected photos enter the project in the browser: metadata and thumbnail extraction, local persistence, and resolution of missing metadata without uploading the originals.

## ADDED Requirements

### Requirement: Photos are selected and read locally
The system SHALL let the user select photo files from their device and SHALL read them in the browser. The original file bytes SHALL NOT be transmitted to any server during selection, planning or preview.

#### Scenario: Selection produces no upload
- **WHEN** the user selects 100 photos
- **THEN** no network request carries photo file bytes, and the project shows 100 photos ready

### Requirement: Supported input formats
The system SHALL accept JPEG, HEIC/HEIF and PNG files. Files that cannot be decoded SHALL be listed to the user by filename with a reason and excluded from the plan until replaced or removed.

#### Scenario: Undecodable placeholder file
- **WHEN** a selected file is a zero-byte or truncated cloud placeholder
- **THEN** the file is reported as unreadable and the user is told to download the original before continuing

### Requirement: Local metadata extraction
For each photo the system SHALL extract locally: a stable project-local identifier, filename, capture timestamp if present, GPS coordinates if present, pixel width and height after applying stored orientation, aspect ratio, orientation class (landscape, portrait, square), file type, file size and selection sequence number.

#### Scenario: Rotated phone photo
- **WHEN** a JPEG stores 3024 x 4032 pixels with an orientation tag indicating 90 degree rotation
- **THEN** the extracted width and height are 4032 x 3024 and the orientation class is landscape

### Requirement: Thumbnails for preview
The system SHALL produce a reduced-resolution thumbnail per photo for preview, with a long edge of at most 1600 pixels, generated one file at a time so that no more than a bounded number of full-resolution decodes are in memory simultaneously.

#### Scenario: Large selection stays responsive
- **WHEN** 150 photos averaging 12 megapixels are selected
- **THEN** thumbnails are produced progressively and the page remains interactive throughout

### Requirement: Project persistence
The system SHALL persist the project locally: plan, group definitions, theme reference, metadata, thumbnails and, where the browser supports it, durable references to the original files. The system SHALL NOT store full-resolution originals in browser storage.

#### Scenario: Reload with durable handles
- **WHEN** the browser supports persisted file references and the user reloads the page
- **THEN** the project reopens and, after any required permission prompt, the original files are readable again

#### Scenario: Reload without durable handles
- **WHEN** the browser does not support persisted file references and the user reloads
- **THEN** the project reopens with thumbnails and plan intact and asks the user to reselect the same files, matching them by filename, size and capture time

### Requirement: Missing metadata fallback order
When capture time or location is missing, the system SHALL infer them in this order: available metadata on the photo, the user's itinerary, neighboring photos in selection order, and finally the selection order itself. The system SHALL never place photos in random order.

#### Scenario: Single photo without timestamp between dated neighbors
- **WHEN** photo 42 has no capture time and photos 41 and 43 are both from 23 September
- **THEN** photo 42 is assigned to 23 September between them without asking the user

### Requirement: Capped user questions
The system SHALL ask the user to resolve metadata only for runs of photos that cannot be inferred from neighbors or itinerary. Questions SHALL allow selecting several photos and answering once. The total number of questions per project SHALL be capped (initially 5); beyond the cap, remaining photos follow selection order.

#### Scenario: Many undated photos
- **WHEN** 40 of 100 photos lack any capture time and form several runs
- **THEN** at most 5 grouped questions are shown and the rest are ordered by selection

### Requirement: Metadata sent to the server is limited
The system SHALL send to the server only: trip text fields, photo count, per-photo orientation class, aspect ratio, capture date and resolved place name or cluster centroid. Raw per-photo GPS coordinates SHALL NOT be sent.

#### Scenario: Planning request payload
- **WHEN** the theme or map request is sent
- **THEN** the payload contains place names and cluster centroids but no per-photo coordinates
