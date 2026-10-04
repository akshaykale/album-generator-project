# order-pipeline Specification

## Purpose
Defines the order lifecycle, the gates where payment can later be attached, deterministic pricing, and the privacy and retention guarantees for uploaded print output.

## Requirements

### Requirement: Order states
An order SHALL move through these states: Planned, Approved, Gate A, Producing, Assembled, Gate B, Submitted to printer, Fulfilled, and a terminal Failed or Cancelled state reachable from any non-terminal state. Transitions SHALL be recorded with timestamps.

#### Scenario: Normal order
- **WHEN** a user approves the preview and production and assembly succeed
- **THEN** the order passes Approved, Gate A, Producing, Assembled, Gate B and reaches Submitted

### Requirement: Gates hold no payment logic
Gate A (before production) and Gate B (after assembly) SHALL be pass-through steps in V1 that complete automatically or by manual operator approval. The gates SHALL expose a hook so that payment authorization, capture or any other check can be attached to either gate later without changing the surrounding states.

#### Scenario: Payment added later at both gates
- **WHEN** a payment integration is attached as authorization at Gate A and capture at Gate B
- **THEN** no other state or transition changes

### Requirement: Pricing is deterministic
Price SHALL be computed by code from: binding, final inner page count (base included pages plus extra pages), cover option and shipping destination. Price SHALL be shown only after the plan has passed validation and SHALL be recomputed on any edit that changes page count or binding.

#### Scenario: Extra pages
- **WHEN** the base includes 20 inner pages and the plan has 34
- **THEN** the price includes 14 extra pages at the configured per-page rate

#### Scenario: Density change
- **WHEN** the user switches density and the page count changes
- **THEN** the displayed price updates before the user can proceed

### Requirement: Price shown before production
The user SHALL see the exact price, page count and binding before Gate A. Production SHALL NOT start until the user has confirmed these.

#### Scenario: Confirmation required
- **WHEN** the plan is valid but the user has not confirmed the summary
- **THEN** production is not started

### Requirement: Source files are never uploaded
At no state SHALL the system upload the user's original photo files. The only image data uploaded SHALL be rendered print pages and thumbnails the user explicitly chooses to attach to a support request.

#### Scenario: Support attachment is explicit
- **WHEN** the user has not opted to attach anything to support
- **THEN** no thumbnail or page is uploaded outside production

### Requirement: Privacy statement matches behavior
The product SHALL state to the user, before order: that individual photo files stay on their device while designing; that the finished album file containing their photos is uploaded so it can be printed; that place names, dates and photo metadata are sent to generate the theme and maps; and how long the album file is retained. The statement SHALL be kept consistent with the actual data flows.

#### Scenario: Statement visible at confirmation
- **WHEN** the user reaches the order summary
- **THEN** the privacy statement is displayed or linked on that screen

### Requirement: Retention of print output
Uploaded page chunks SHALL be deleted once the final file is assembled and validated. The final print file SHALL be retained for a configurable reprint window (initially 60 days after fulfillment) and then deleted. Album plans and theme assets MAY be retained longer; they contain no photographs.

#### Scenario: Chunk cleanup
- **WHEN** assembly succeeds
- **THEN** all per-page chunks for that order are deleted within the configured cleanup interval

#### Scenario: Window expiry
- **WHEN** 60 days have passed since fulfillment
- **THEN** the final print file is deleted and the order record notes the deletion

### Requirement: Access to print output
Print files SHALL be stored privately, encrypted at rest, accessed only through short-lived signed links, and shared only with the printing provider for fulfilment. Access SHALL be logged.

#### Scenario: Link expiry
- **WHEN** a signed link older than its lifetime is used
- **THEN** access is denied

### Requirement: Failure handling
If production or assembly fails, the order SHALL enter Failed with the reason, the project SHALL remain intact so the user can retry, and any gate hook SHALL be notified so an attached payment step can release holds.

#### Scenario: Retry after failure
- **WHEN** assembly fails because two pages are missing
- **THEN** the user can resume production for those pages without re-rendering the rest
