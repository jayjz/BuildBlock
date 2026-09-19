# BuildBlock Place System

## Status

**Phase:** P0
**Purpose:** Define the canonical spatial model for BuildBlock before implementation expands beyond the first living district.

This document is the durable product decision for how developers, repositories, recent work, and visible world state are represented spatially.

It complements:

* `docs/PRODUCT.md`
* `docs/ARCHITECTURE.md`
* `docs/WORLD_RULES.md`
* `docs/ROADMAP.md`

It does not replace the evidence or world-rule contracts defined elsewhere.

---

# Core decision

A developer block is a **permanent workshop** with a public work frontage displaying repositories observed in recent software activity.

The workshop represents the developer's persistent place in BuildBlock.

Repositories do not permanently own parts of that place during P0.

Recent observable work temporarily changes what is displayed inside the workshop.

---

# Product intent

BuildBlock should feel like a place built from software work, not a GitHub dashboard rendered onto buildings.

A visitor should be able to look at a workshop and understand:

* who occupies the place
* which repositories have recently appeared in observed public activity
* whether merge or release activity has been observed for those repositories
* that the visible state represents a bounded observation window, not the developer's complete work

A visitor should not need to open a detail panel before the workshop has meaning.

---

# Canonical spatial grammar

## Developer parcel

Each configured developer has a fixed parcel and address.

Stable parcel identity includes:

* address
* developer identity
* configured workshop silhouette
* configured material or color character
* threshold or nameplate

These are identity choices, not measures of achievement.

Recent GitHub activity must never change:

* parcel size
* land ownership
* building size
* apparent wealth
* architectural importance

---

## Workshop

The workshop is the developer's primary physical representation.

It remains present regardless of recent observable activity.

The workshop must not visually decay or imply abandonment when no qualifying public activity is observed.

P0 does not infer:

* productivity
* quality
* current online presence
* private activity
* professional skill
* project completion

---

## Repositories

Repositories represent **recently observed work**, not permanent property.

All eligible observed repositories must be derived in the domain layer.

Presentation may display up to three repositories on the workshop frontage.

The three-repository limit is a presentation constraint only.

It must never truncate the derived domain state.

If more than three repositories are eligible:

* display the first three on the workshop frontage
* expose the remaining observed repositories in the detail experience
* use explicit wording such as `+N more observed repositories`

Repository presence must never imply:

* complete project inventory
* repository ownership
* primary-project status
* project quality
* project importance

Preferred label:

> Recently observed here

---

# Repository ordering

Visible repository frontage should be ordered by:

1. most recent eligible observed activity, descending
2. repository ID as deterministic tie-breaker

Do not order repositories by:

* activity volume
* stars
* followers
* commit count
* perceived importance
* repository popularity

Repository ordering exists for temporal orientation, not ranking.

The result must remain deterministic regardless of source input ordering.

---

# Temporary observed state

Temporary state is recomputed from evidence within the existing P0 observation window.

It includes:

* repository frontage
* work-bay state
* merge state
* release state
* source provenance
* observation timestamps

Temporary state does not accumulate.

When supporting evidence leaves the observation window, the corresponding visible state disappears without implying that work was deleted or abandoned.

Recorded fixture state remains anchored to its recorded capture time.

---

# Event-to-world grammar

## `code_pushed`

Meaning:

Observed public code activity exists for the repository.

Spatial consequence:

* repository may occupy a visible work bay
* restrained task-light or workbench-active state may be shown

It does not mean:

* high productivity
* meaningful progress
* project completion
* developer currently working

Repeated pushes do not increase brightness, workshop size, decoration count, or apparent status.

---

## `pull_request_opened`

Meaning:

An observed public pull request was opened.

Spatial consequence:

* repository participates in general observed-work state
* explicit event remains visible in evidence/details

No unique physical queue or review state is required in P0.

It does not mean:

* the PR is still open
* it is awaiting review
* it will be merged

---

## `pull_request_merged`

Meaning:

An observed public pull request merge is supported by the source contract.

Spatial consequence:

* repository receives a restrained merge-specific visual state
* preferred metaphor: a joined-piece or integration inset attached to that repository's work bay

It does not mean:

* project completion
* passing CI
* successful deployment
* quality

Multiple merge events do not multiply the visual state.

---

## `release_published`

Meaning:

An observed public release was published.

Spatial consequence:

* repository receives a restrained publication/shipment marker
* preferred metaphor: a small threshold shipment, crate, or publication marker

Avoid gift-box or celebratory-cartoon styling.

It does not mean:

* deployment success
* adoption
* downloads
* production readiness
* project importance

Multiple releases do not multiply the visual state.

---

# Public silence

When no qualifying public activity exists inside the observation window:

* the workshop remains intact
* the developer address remains visible
* permanent architectural identity remains unchanged
* temporary repository displays may be empty

Acceptable language:

> No public work observed in this window.

Do not use:

* inactive
* abandoned
* idle developer
* low activity
* dormant

GitHub public event coverage is incomplete and cannot support those claims.

---

# Stable identity vs activity

This separation is fundamental.

## Stable identity

* developer
* address
* parcel
* workshop silhouette
* configured visual character
* threshold/nameplate

## Temporary observed state

* repository displays
* task-light state
* merge state
* release state
* evidence
* observation timestamps

Activity must never redefine permanent identity.

---

# Future durable progression

Durable progression is explicitly deferred from P0.

Potential future concepts may include:

* persistent workshop annexes
* historically grounded project spaces
* verified collaboration infrastructure
* release exhibits
* district landmarks

These require:

* claimed identity
* durable historical storage
* explicit progression rules
* validated product need

P0 must not simulate these systems visually before they exist.

---

# District model

## Perimeter

Preserve the existing 40-address district topology.

Developer addresses remain stable regardless of recent activity.

---

## Open plots

Open plots represent unassigned future space.

They should appear as quiet surveyed ground or address markers.

Do not add:

* fake claiming controls
* purchase language
* scarcity messaging
* waitlists
* implied ownership

---

## Civic spaces

The four civic spaces remain fixed landmarks.

They provide orientation and identity, not rewards or game mechanics.

P0 civic spaces should remain primarily static.

---

## District center

The district center should function as a restrained wayfinding court.

Its job is:

* orientation
* District 01 identity
* finding occupied workshops
* supporting movement between workshops

It should not become:

* a dashboard
* analytics view
* leaderboard
* KPI surface
* giant landing-page hero
* dominant navigation menu

The workshops should remain the primary visual subjects.

---

# Exploration loop

The intended first-visit flow is:

1. visitor lands with no developer detail automatically open
2. occupied workshops and addresses are visible immediately
3. recently observed repository names create specific points of curiosity
4. visitor selects a workshop
5. detail view explains the same repository-grouped state shown on the frontage
6. visitor may follow original evidence links
7. visitor can move directly to another configured workshop
8. the next workshop exposes different observed work

The second workshop should feel meaningfully different because the work represented there is different, not because it has a different activity score.

---

# Detail experience

The detail experience must use the same observation window and derived repository groups as the workshop frontage.

Do not independently regroup the unrestricted activity feed inside React.

Details should expose:

* developer identity
* address
* source mode
* capture date
* precise observation window
* observed repositories
* supported activities
* evidence links
* limitations of public GitHub coverage

The detail experience should clarify the world state rather than replace it.

---

# Presentation constraints

Prefer:

* semantic HTML
* CSS
* small inline or componentized SVG
* restrained architectural forms
* tactile materials
* clear typography
* static environmental detail

Avoid:

* dashboard cards as the primary interaction model
* contribution-calendar visuals
* neon AI styling
* glassmorphism
* fake terminal interfaces
* literal Monopoly imitation
* Web3 aesthetics
* arbitrary animations
* game-engine complexity

Activity-dependent movement or animation must have semantic justification.

---

# Accessibility

The spatial metaphor must remain usable without relying on visual interpretation alone.

Requirements include:

* visible keyboard focus
* usable keyboard interaction
* minimum practical 44px interaction targets
* state communicated by label/shape in addition to color
* repository names that wrap safely
* no interaction requiring hover
* reduced-motion support
* appropriate focus movement when opening and closing detail views

Decorative SVG should be hidden from assistive technology where appropriate.

---

# P0 boundaries

Do not add:

* authentication
* claiming
* persistence
* history
* rankings
* scores
* currency
* property mechanics
* chat
* follower systems
* AI summaries
* agents
* autonomous behavior
* project-description inference
* technology inference
* collaboration inference
* additional GitHub endpoints solely to make the workshop richer

P0 exists to test the spatial product hypothesis before expanding the system.

---

# P0 product hypothesis

BuildBlock should test:

> Does representing real software work as a changing physical place make developers want a place of their own?

The repository-fronted workshop slice is intended to improve our ability to answer that question.

---

# Implementation direction

The next vertical slice should:

* preserve the current evidence pipeline
* extend derived block state with all eligible observed repositories
* keep repository grouping in the domain layer
* show up to three repositories on the workshop frontage
* order frontage by most recent eligible observed activity
* attach merge and release state to the relevant repository
* replace the seven-window facade
* keep details closed on initial load
* introduce restrained wayfinding
* preserve fixed developer addresses and workshop identity
* expose source and observation limitations clearly

No durable progression is implemented during this slice.
