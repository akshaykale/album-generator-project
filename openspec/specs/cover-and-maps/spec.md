# cover-and-maps Specification

## Purpose
Defines how the cover is composed from the user's chosen photo and generated artwork, the fixed back cover, and how maps are built from real places and drawn in the album's style.

## Requirements

### Requirement: User chooses the cover photo
The user SHALL choose the cover photo from the selected photos. The system SHALL NOT choose it automatically except as a pre-filled suggestion (the first photo) that the user can change at any time before order.

#### Scenario: Change cover late
- **WHEN** the user changes the cover photo after the plan is complete
- **THEN** only the cover is re-rendered and the inner plan is unchanged

### Requirement: Cover placement templates
The system SHALL offer a small set of cover placement templates (initially: full image, framed editorial, image with small map, minimal, image with destination title). Each template SHALL define where the photo window, title, dates and optional map sit relative to the front cover trim.

#### Scenario: Template switch
- **WHEN** the user switches from full image to framed editorial
- **THEN** the same photo and artwork are recomposed into the new positions without regeneration

### Requirement: The cover photo is placed, never regenerated
The cover SHALL be composed by placing the original photo, uncropped and at its own aspect ratio, into the template's photo window above the generated artwork. The photo SHALL NOT be passed to any image model.

#### Scenario: Portrait photo in a landscape-biased window
- **WHEN** a portrait photo is chosen with the framed editorial template
- **THEN** the photo is fitted inside the window at its own aspect and artwork shows in the remaining window area

### Requirement: Cover artwork is cropped to the binding
Generated cover artwork SHALL be cropped deterministically to the final cover dimensions for the chosen binding, including wrap or bleed and spine where applicable, after the page count is known. Cropping artwork is permitted; cropping the user's photo is not.

#### Scenario: Hardcover after page count change
- **WHEN** inner pages change from 32 to 40 and the binding is hardcover
- **THEN** the spine width is recomputed and the artwork crop shifts accordingly without regenerating artwork

### Requirement: Cover text
The cover SHALL carry the album title and dates as real text rendered by the system in theme typography. Text SHALL never be baked into generated artwork.

#### Scenario: Title edit
- **WHEN** the user corrects a typo in the album title
- **THEN** the cover updates immediately and the artwork is unchanged

### Requirement: Back cover is fixed
The back cover SHALL be the shared static asset defined in the book model, with company information and an ordering QR code, identical across albums.

#### Scenario: No per-album back cover work
- **WHEN** an album is rendered
- **THEN** the back cover is produced without any generation or user input

### Requirement: Maps use real places
Map pins SHALL be positioned from geographic coordinates resolved from the user's listed places, confirmed or extended by on-device photo location clusters. Routes SHALL connect pins in itinerary order as simple curves and SHALL NOT attempt road routing. No image model SHALL place or move geographic features.

#### Scenario: Listed cities only
- **WHEN** the user lists seven cities and no photo has GPS
- **THEN** the map shows seven pins at those cities' coordinates connected in itinerary order

### Requirement: Maps are drawn in theme style
Maps SHALL be rendered by the system as vector shapes (region outline, pins, route, labels) in the theme palette, in preview and in print. Generated artwork MAY be used as a texture behind the map but SHALL NOT replace the vector geometry.

#### Scenario: Map matches album palette
- **WHEN** the theme palette is sage and terracotta
- **THEN** the map outline, pins and route use colours from that palette

### Requirement: Map appearances
A map MAY appear in the cover corner (template dependent), SHALL appear on the opening page when the trip spans more than one place, and MAY appear once more at the end. When all places fall within a small radius (initially 30 km) the inner map SHALL be replaced by a single-marker treatment or omitted.

#### Scenario: Single-city trip
- **WHEN** all places are within 30 km
- **THEN** no regional map is drawn and the opening page uses the single-marker treatment
