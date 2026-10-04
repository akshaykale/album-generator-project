# album-planning Specification

## Purpose
Defines how selected photos are grouped, ordered and packed into pages by deterministic code so that every photo appears once, nothing is cropped, and the page count is exact.

## Requirements

### Requirement: Planning is deterministic
Given the same photos, metadata, user groups, density, binding and layout library, the planner SHALL produce the identical plan every time. No step of placement SHALL depend on a non-deterministic or external model.

#### Scenario: Re-run produces same plan
- **WHEN** the planner runs twice on identical inputs
- **THEN** the two plans are byte-identical after serialization

### Requirement: Every photo exactly once
The plan SHALL contain every selected photo exactly once across cover and inner pages, except photos the user explicitly removed. The cover photo SHALL additionally appear once inside the album unless the user opts out.

#### Scenario: Validation of coverage
- **WHEN** 100 photos are selected and none removed
- **THEN** the validator reports 100 placed, 0 missing, 0 duplicated

### Requirement: Chronological grouping
The planner SHALL order photos by resolved capture time and SHALL split them into moments using time gaps and, when available, on-device location clusters. Moments SHALL be packed in order so the album reads as the trip unfolded.

#### Scenario: Two cities on one day
- **WHEN** photos from the morning cluster 60 km from the afternoon cluster
- **THEN** the two clusters form separate moments and are not mixed on a page

### Requirement: Special groups are protected units
The user SHALL be able to select several photos, create a named group, choose a presentation style and optionally set the internal order. The planner SHALL keep the group contiguous and in its internal order, SHALL place it by default at the position of its earliest photo, and SHALL allow the user to move the group as a unit.

#### Scenario: Statues collected across days
- **WHEN** the user groups 10 photos taken on four different days
- **THEN** all 10 appear consecutively using a dense group layout, and no other photos are interleaved

#### Scenario: Group exceeds one spread
- **WHEN** a group of 14 photos is given a style whose capacity is 10 per spread
- **THEN** the group continues onto the next spread in internal order and is never split by unrelated photos

### Requirement: Density target
The user SHALL choose Spacious, Balanced or Compact. Density SHALL set the target photos per page (approximately 1 to 2, 2 to 3, 3 to 4) and the preference weights for layout families. Density is a target; the resulting page count is an output, never an input.

#### Scenario: Density changes page count
- **WHEN** the same 100 photos are planned at Spacious and at Compact
- **THEN** Spacious yields more inner pages than Compact and both pass validation

### Requirement: No crop packing
The planner SHALL place each photo in a slot whose aspect ratio equals the photo's aspect ratio. When a candidate layout would render any photo below the minimum short edge for its page type, the planner SHALL choose a less dense layout or spill photos to a following page rather than crop or shrink below the minimum.

#### Scenario: Four landscapes at Compact
- **WHEN** four 4:3 landscapes are candidates for a four-up page and the result would put a short edge below the normal-page minimum
- **THEN** the planner uses two two-up pages instead

### Requirement: Layout selection
For each page the planner SHALL select a layout from the layout library whose slot count and accepted orientation pattern match the photos, preferring variety across consecutive spreads (no identical layout on both pages of a spread, no identical spread composition twice in a row when alternatives exist).

#### Scenario: Variety across spreads
- **WHEN** three consecutive moments each contain three mixed-orientation photos
- **THEN** at least two distinct three-photo variants are used across those pages

### Requirement: Occasional hero pages
The planner SHALL promote a photo to a single-photo hero page at a rate governed by density (more often at Spacious), choosing photos that start a moment or have a distinctive aspect ratio, so that the album has visual rhythm.

#### Scenario: Panoramic photo
- **WHEN** a photo has an aspect ratio wider than 2.2
- **THEN** it is placed alone on a page using a full-width slot

### Requirement: Validation before use
The system SHALL validate every plan before preview, pricing or print: coverage, duplicates, layout legality, aspect compatibility, minimum sizes, gutter clearance, parity, and page count. A plan that fails validation SHALL NOT be shown as final or priced.

#### Scenario: Invalid plan is rejected
- **WHEN** an edit leaves a photo referenced by two pages
- **THEN** the edit is refused with a message identifying the photo and pages

### Requirement: User edits stay valid
The user SHALL be able to move a photo between pages, remove a photo, change a page's layout among compatible alternatives, change a group's style and reorder spreads. Each edit SHALL re-pack only the affected pages and re-run validation.

#### Scenario: Alternate layout
- **WHEN** the user requests another layout for a page holding two portraits
- **THEN** only layouts accepting two portraits are offered and the rest of the plan is unchanged
