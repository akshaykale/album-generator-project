# layout-library Specification

## Purpose
Defines the layout families, slot rules, physical size minimums and the single geometry contract that both preview and print consume, so the printed book matches what the user approved.

## Requirements

### Requirement: Page geometry zones
Every page SHALL define, in millimetres relative to its trim: bleed (initially 3 mm on outer edges), trim, outer safe margin (initially 8 mm), and inner safe margin at the gutter. The inner safe margin SHALL increase with inner page count according to a configurable table (initially 12 mm up to 40 pages, 15 mm up to 80 pages, 18 mm above).

#### Scenario: Thick book widens gutter margin
- **WHEN** an album has 90 inner pages
- **THEN** no photo rectangle comes within 18 mm of the gutter

### Requirement: Layout families
The layout library SHALL contain these families for normal pages: hero (1 photo), hero plus supporting (1 dominant plus 1 or 2), two large (2), editorial three (1 dominant plus 2), and four balanced (4). Each family SHALL provide landscape, portrait and mixed orientation variants and left and right mirrored variants.

#### Scenario: Mirrored variant exists
- **WHEN** the planner needs a hero-plus-two layout for a left page and for a right page
- **THEN** both a left-weighted and a right-weighted variant are available

### Requirement: Slots adopt the photo aspect
A slot SHALL declare a bounding region and an accepted orientation pattern, and SHALL render the assigned photo at the photo's own aspect ratio fitted entirely inside the region, centred or aligned by the layout's alignment rule. Slots SHALL NOT crop. Unused region area SHALL show the page background.

#### Scenario: 16:9 photo in a 4:3 region
- **WHEN** a 16:9 landscape is assigned to a region sized for 4:3
- **THEN** the photo fills the region's width and background shows above and below

### Requirement: Minimum photo size
Every slot on a normal page SHALL render its photo with a short edge of at least 70 mm at the initial 210 mm trim, scaled proportionally for other trims. Dense group layouts SHALL use a lower minimum of 45 mm. A layout that cannot satisfy the minimum for a given photo set SHALL be reported as incompatible to the planner.

#### Scenario: Four-up incompatible
- **WHEN** four 3:2 landscapes are tested against a 2 x 2 layout at 210 mm trim
- **THEN** the layout reports incompatible because the short edge would be below 70 mm

### Requirement: Dense group layouts
For special groups the library SHALL provide justified layouts: photos arranged in rows of equal height per page, with widths derived from each photo's aspect ratio, zero crop, and capacities of 5, 6, 8 and 10 photos per spread plus a continuation layout for larger groups. Rows SHALL never span the gutter.

#### Scenario: Ten mixed photos
- **WHEN** a group of 10 mixed-orientation photos uses the 10-per-spread style
- **THEN** each page holds about 5 photos in 2 rows, every photo is uncropped, and no row crosses the gutter

### Requirement: Shared geometry contract
The library SHALL expose, for a given plan page, the absolute rectangles in millimetres of every photo, text block and decorative element. Preview and print SHALL both consume these rectangles; neither SHALL compute its own positions.

#### Scenario: Preview and print agree
- **WHEN** the same page is rendered in preview at any zoom and in the print output
- **THEN** every photo's position and size, scaled to the respective output, match within rounding

### Requirement: Text blocks are minimal
Normal pages SHALL have at most one small text block (section or place title with optional date). The opening page SHALL carry the album title and dates. No layout SHALL include body paragraphs or per-photo captions by default.

#### Scenario: Default page has no caption
- **WHEN** a page is rendered without the user adding a label
- **THEN** the page contains photos and background only

### Requirement: Decorative elements are subordinate
Any decorative element (border, tape, frame) SHALL be defined by the theme, SHALL be optional per layout, and SHALL never reduce a photo below its minimum size or overlap more than 5 percent of a photo's area.

#### Scenario: Frame does not shrink photo
- **WHEN** a theme adds a 2 mm frame around photos
- **THEN** the photo rectangle keeps its minimum short edge and the frame extends outward within the region
