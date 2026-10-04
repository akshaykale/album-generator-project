# Spec Delta

## Purpose

Defines the book-themed application frame that every screen inherits: how steps are presented as pages, how the page turn behaves, how the layout adapts to screen size, and the accessibility rules for navigation.

## ADDED Requirements

### Requirement: The app presents as a book
The application SHALL render its screens as pages of a book on a paper-toned background with a visible spine. On viewports at least 1024 px wide it SHALL show a two-page spread: the left page holds the running table of contents of what the user has entered so far and the right page holds the active step. On narrower viewports it SHALL show a single page holding the active step with a compact progress indicator.

#### Scenario: Wide viewport
- **WHEN** the viewport is 1280 px wide
- **THEN** a left contents page and a right active-step page are both visible with a spine between them

#### Scenario: Narrow viewport
- **WHEN** the viewport is 390 px wide
- **THEN** only the active step page is visible, the progress indicator shows the current step label, and all controls remain reachable without horizontal scrolling

### Requirement: Steps are ordered pages
The application SHALL present these steps in order: Cover, Your trip, Your photos, Your album, Preview, Order. The user SHALL be able to move forward only when the current step's required fields are complete, and SHALL be able to move back at any time without losing entered data.

#### Scenario: Incomplete step blocks forward
- **WHEN** the user is on Your trip and the title is empty
- **THEN** the next control is disabled and the missing field is indicated

#### Scenario: Back preserves data
- **WHEN** the user goes back from Your photos to Your trip and forward again
- **THEN** the selected photos are still present

### Requirement: Page-turn transition between steps
Moving forward SHALL animate the right page turning over toward the spine to reveal the next step; moving back SHALL animate the reverse. The turn SHALL complete in no more than 700 ms, SHALL not block input on the destination page after it completes, and SHALL be the only transition that uses rotation. Interactions within a step (typing, selecting photos, toggling options) SHALL NOT trigger a page turn.

#### Scenario: Forward turn
- **WHEN** the user activates next on Your trip
- **THEN** the page turns toward the spine and Your photos is interactive within 700 ms

#### Scenario: Selecting a photo does not flip
- **WHEN** the user selects a photo on Your photos
- **THEN** the page stays flat and only the grid updates

### Requirement: Reduced motion
When the user's system requests reduced motion, the page turn SHALL be replaced by a crossfade of at most 200 ms with no rotation or large translation. The application SHALL also offer an in-app toggle to reduce motion that persists for the session.

#### Scenario: System preference
- **WHEN** reduced motion is enabled at the OS level
- **THEN** moving between steps crossfades and nothing rotates

### Requirement: Form content is never transformed during interaction
The interactive content of the active step SHALL be rendered flat (no 3D transform) whenever the user can interact with it. Any rotating element during a turn SHALL be a non-interactive visual layer.

#### Scenario: Input focus after a turn
- **WHEN** a turn completes and the user taps the first input
- **THEN** the input receives focus and the caret is positioned normally

### Requirement: Keyboard and pointer navigation
The application SHALL provide visible next and back controls with accessible names, SHALL move forward on the right arrow key and back on the left arrow key when focus is not in a text field, and SHALL move focus to the new page's heading after a turn. A decorative dog-ear control in the bottom outer corner of the active page SHALL act as an additional next control and SHALL have a minimum 44 x 44 px hit area.

#### Scenario: Arrow keys
- **WHEN** focus is on the page body and the user presses the right arrow
- **THEN** the application moves to the next step if it is allowed

#### Scenario: Screen reader announcement
- **WHEN** a turn completes
- **THEN** the new page heading is announced and receives focus

### Requirement: Photos stay local in the shell
Photo selection in the shell SHALL read files in the browser, show a thumbnail per photo, show the count, and allow removing a photo. No photo bytes SHALL be sent over the network.

#### Scenario: Thumbnails appear progressively
- **WHEN** the user selects 60 photos
- **THEN** thumbnails appear one by one while the page remains interactive and no network request carries photo data

### Requirement: Placeholder steps are honest
Steps whose behavior depends on later changes (Preview, Order) SHALL display a clear statement of what will appear there and SHALL NOT show invented page counts or prices.

#### Scenario: Preview placeholder
- **WHEN** the user reaches Preview before the planner exists
- **THEN** the page explains that the album preview will appear here and shows the number of photos and chosen options, without a page count or price
