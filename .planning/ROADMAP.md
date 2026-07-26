# Roadmap: Odyssey Crew

## Milestones

- ✅ **v1.0 Prototype** - Rules-complete single-file build (shipped 2026-07-25, no GSD phases)
- 🚧 **v1.1 Themed Episodes & Interactive Board** - Phases 1-4 (in progress)

## Overview

v1.1 turns the rules-complete v1.0 prototype into a *felt* game. It is an **additive, refactor-friendly** milestone — never a rewrite. The work extends the shipped `index.html`'s existing seams: the render-from-state architecture, the single `rng()` seam, and the `LAND_TABLE`/`SEA_TABLE`/`scene.reskin` data patterns. The journey runs foundation-first: land a declarative effect+narration data model and a sequential-resolution engine change (Phase 1), author the thematic per-scene beats that make each island's moral legible (Phase 2), retrofit the three anchors onto the verb grammar and lock the hand-tuned economy that fixes the known death-spiral (Phase 3), then replace the raw text log with a visual interactive board that is a pure projection of state (Phase 4). Every phase preserves the immovable stack constraint — one self-contained `index.html`, vanilla JS, no libraries/build/network/storage, offline by double-click — and every phase must keep `?seed=` determinism and the 0-human unattended run intact.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Effect Engine & Sequential Resolution** - Declarative `beats` data model + generic resolver + coverage validator, with blind commits resolving sequentially against the shared hold (completed 2026-07-25)
- [x] **Phase 2: Themed Island Content & Favor-Law Reconciliation** - Every island scene (Helios/Cyclops/Sirens/Lotus × 3 stages) authored to its moral with the Dare/Abide/Give asymmetry, favor-law violations reconciled (completed 2026-07-26)
- [ ] **Phase 3: Anchor Verb Retrofit & Balance Retune** - Hades/Phaeacia/Ithaca rebuilt onto the verb grammar without regression, and the hand-tuned deltas become the intended economy that kills the death-spiral
- [x] **Phase 4: Interactive Board** - A visual board (boat, draining marble bag, live dice, clickable verbs, on-board narration/status) replaces the raw log as a pure projection of state (completed 2026-07-26)

## Phase Details

### Phase 1: Effect Engine & Sequential Resolution

**Goal**: The engine resolves every scene through one declarative, validated, CONFIG-traceable effect+narration data model, and blind commits resolve sequentially against the shared hold instead of a simultaneous feasibility check.
**Depends on**: Nothing (first phase; builds directly on the shipped v1.0 `index.html`)
**Requirements**: EFFECT-01, EFFECT-02, EFFECT-03, EFFECT-04, RESOLVE-01, RESOLVE-02, RESOLVE-03
**Success Criteria** (what must be TRUE):

  1. Playing an already-worked island scene, the outcome and its one-sentence story beat come from a declarative `beats` table (verb × face), not inline `reskin` strings — editing a single beat cell changes the game with no other code change.
  2. A coverage check reports pass/fail per scene: every authored scene has all four faces (1/3/4/6) defined for Dare/Abide/Give, and it flags any missing or dead cell rather than silently no-op'ing.
  3. When two players blind-commit hold-drawing actions the hold cannot both cover, the earlier player in turn order gets their action and the later player's is denied and their turn skipped — never partially applied — with narration explaining the shortfall.
  4. The resolution-order rule is a fixed-turn-order seam documented in a code comment, swappable to a future scheme (favor-weighted / turn-chip) without touching resolution logic.
  5. A 0-human `?seed=` run still completes unattended to a winner, every beat payoff traces to the labelled CONFIG convention (no scattered magic numbers), and the game remains one self-contained `index.html` with no new dependency.

**Plans**: 2/2 plans executed
**Wave 1**

- [x] 01-01-PLAN.md — Effect engine: beats data model + resolveEffect + narrate + validateBeats + labelled CONFIG convention, proven by converting Helios "The Meadow" (tracer) and Cyclops "The Wine" (stateful)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — Sequential resolution: fixed-turn-order resolutionOrder seam, deny+skip unaffordable hold draws (never partial), retire eat lot-casting, determinism + seed-safety verification

### Phase 2: Themed Island Content & Favor-Law Reconciliation

**Goal**: Every island scene carries its story's moral through tailored Dare/Abide/Give beats that honor the design asymmetry, and every existing Dare-grants-favor violation is reconciled — either retuned off the favor path or recorded as an explicit flagged exception.
**Depends on**: Phase 1
**Requirements**: CONTENT-01, CONTENT-02, CONTENT-03, CONTENT-04, CONTENT-05, CONTENT-06
**Success Criteria** (what must be TRUE):

  1. Playing Helios reads as *restraint*: Abide is inert except a 6 (forage dandelions, small gain), and Dare escalates the cattle transgression with high upside and Helios's wrath.
  2. Playing Cyclops reads as *pride/boasting*: pure-Abide visibly strands the player (stuck eating cheese, left behind), while Dare (boast/escape) carries the curse risk for high upside.
  3. Playing Sirens and Lotus, their morals are legible in the beats — Sirens (*rewarded temptation / wreck*): daring the song risks the ship for a real prize, abiding is safe but thin; Lotus (*forgetting / the strand*): abiding risks being lulled/left, daring pulls the crew back to the voyage.
  4. Across every authored island cell the asymmetry holds by inspection: Dare risks self+crew for high upside, Abide is riskless/low-upside/lethal-if-only, Give sustains the crew and never moves favor.
  5. Every prior Dare-favor case (Sirens, Cyclops-boast, Lotus) is either retuned to a non-favor reward or recorded in the beat data as an explicit, flagged Dare-favor exception — no accidental favor-on-Dare remains, and the seeded 0-human run still completes.

**Plans**: 5/5 plans executed

Plans (single self-contained index.html → each plan runs in its own wave, sequential):

- [x] 02-01-PLAN.md — Tracer: full Helios island to beats + CONFIG payoff-tier scaffolding + reusable headless harness (CONTENT-01)
- [x] 02-02-PLAN.md — Cyclops: scenes 2–3 to beats (collective blinding + individual escape) + boast/stake Dare-favor retuned off → world-anger (CONTENT-02)
- [x] 02-03-PLAN.md — Sirens: 3 scenes to beats, Dare→favor kept as the one flagged exception + wreck risk (CONTENT-03)
- [x] 02-04-PLAN.md — Lotus: 3 scenes to beats, Abide succumbs (lotus-struck) / Dare hauls back (no favor) / Give shares (CONTENT-04)
- [x] 02-05-PLAN.md — Favor-law + asymmetry audit across all 12 island scenes + fixed multi-seed 0-human regression sweep (CONTENT-05, CONTENT-06)

### Phase 3: Anchor Verb Retrofit & Balance Retune

**Goal**: Hades, Phaeacia, and Ithaca gain thematic Dare/Abide/Give beats without regressing their validated bespoke mechanics, and the hand-tuned per-stage deltas become the game's intended economy — the known death-spiral is fixed and verified across a fixed multi-seed 0-human sweep.
**Depends on**: Phase 2
**Requirements**: ANCHOR-01, ANCHOR-02, ANCHOR-03, ANCHOR-04, BALANCE-01, BALANCE-02, BALANCE-03
**Success Criteria** (what must be TRUE):

  1. Hades presents Dare/Abide/Give beats and still delivers the validated revival + peek mechanics; Phaeacia presents verb beats and still pays out the favor-weighted gift-court (gifts only); Ithaca's three-scene reversal finale presents verb beats and still resolves its reckoning to a winner.
  2. All validated v1.0 anchor invariants survive the retrofit: no dead-end states, revival economy intact, favor-weighted Phaeacia pool intact, finale always reaches a winner.
  3. Across the fixed multi-seed 0-human sweep, most games reach Ithaca with some crew alive, the hold/rations economy stays under real pressure (neither mass starvation nor trivial survival), and every run terminates at a winner — the hand-tuned `beats` deltas, not the old `[tune]` defaults, are the intended economy.
  4. Cross-episode favor reconciliation confirms favor stays contested: cooperation (favor) remains the optimal path to *winning* while defection remains optimal only for *bare survival*; favor is neither dominated nor trivially maxed, with real spread in final totals across the seed set.
  5. The retrofit adds no dependency and preserves `?seed=` determinism — the seeded 0-human run reproduces identically and still completes unattended to a winner.

**Plans**: TBD

### Phase 4: Interactive Board

**Goal**: The whole voyage is played on a visual board — boat, draining marble bag, live dice, clickable verbs, on-board narration and player status — that is a pure projection of game state and preserves determinism, blind-commit masking, and a debuggable transcript.
**Depends on**: Phase 1 (the `beats` resolver + `narrate` seam it surfaces). Independent of Phases 2–3 content — buildable against generic data — but sequenced last so it renders finished content.
**Requirements**: BOARD-01, BOARD-02, BOARD-03, BOARD-04, BOARD-05, BOARD-06, BOARD-07, BOARD-08, BOARD-09
**Success Criteria** (what must be TRUE):

  1. The voyage is shown visually — a boat advancing across the sea / island track through Troy → islands → Hades → Phaeacia → Ithaca — and the crossing bag shows actual blue/white marbles that visibly drain as they are drawn.
  2. Dice/bone rolls show the live rolled face, and Dare/Abide/Give are clickable affordances on the board at every human decision point the prototype currently prompts.
  3. Scene narration (the current beat's story text) and each player's live status (favor, hold/rations, alive/dead, temperament) are surfaced *in* the board, making it — not a raw text log — the primary play/read surface.
  4. Blind-commit masking holds: with 2+ humans and director-mode off, no board zone leaks a bot or human commit before reveal (public zones render freely from state; private-until-reveal zones stay gated).
  5. The board is a pure projection of state — no parallel/duplicate state, `_`-prefixed transients only, `rng()` draws stay synchronous inside reducers — so `?seed=` reproduces an identical game, the 0-human seeded run completes unattended to a winner, and a readable transcript survives (log demoted to a collapsible/director panel, not deleted).

**Plans**: 4/4 plans executed
**UI hint**: yes

Plans (single self-contained index.html → each plan runs in its own wave, sequential; tracer-first):

**Wave 1**

- [x] 04-01-PLAN.md — Tracer: renderBoard() scaffold + voyage track with advancing ⛵ boat + upgraded crew row (favor/hold/status), pure projection (BOARD-01, BOARD-06, BOARD-07)

**Wave 2** *(blocked on Wave 1 — same file)*

- [x] 04-02-PLAN.md — Crossing strip: draining blue/white marble bag + live reveal-gated pip dice (BOARD-02, BOARD-03)

**Wave 3** *(blocked on Wave 2 — same file)*

- [x] 04-03-PLAN.md — Action bar: clickable Dare/Abide/Give (+ eat) via the existing commit seam + on-board narration surface (BOARD-04, BOARD-05)

**Wave 4** *(blocked on Wave 3 — same file)*

- [x] 04-04-PLAN.md — Blind-commit masking (public vs private-until-reveal) + ship's-log demotion to collapsible panel + final determinism/regression pass (BOARD-08, BOARD-09)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Effect Engine & Sequential Resolution | v1.1 | 2/2 | Complete    | 2026-07-25 |
| 2. Themed Island Content & Favor-Law Reconciliation | v1.1 | 5/5 | Complete    | 2026-07-26 |
| 3. Anchor Verb Retrofit & Balance Retune | v1.1 | 0/TBD | Not started | - |
| 4. Interactive Board | v1.1 | 4/4 | Complete    | 2026-07-26 |
