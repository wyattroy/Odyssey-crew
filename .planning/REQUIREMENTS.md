# Requirements: Odyssey Crew — Milestone v1.1 (Themed Episodes & Interactive Board)

**Defined:** 2026-07-25
**Core Value:** The commons tension must actually fire — disaster emerges from the sum of private, individually-reasonable choices, while cooperation stays optimal for *winning* (favor) and defection stays optimal only for *bare survival*.

**Milestone goal:** Turn the rules-complete prototype into a *felt* game — every scene carries its story's moral through tailored Dare/Abide/Give beats and payoffs, and the whole voyage is played on a visual board instead of a text log.

**Design principle to encode across all authored effects:**

- **Dare** risks the resources/favor of *both you and the crew*, but the upside is high.
- **Abide** risks nothing and the upside is low; abiding *alone* is often lethal (living requires daring), and the gods don't care if you die. Abiding is the *default* favor path (abiding Zeus's law).
- **Give** carries no risk, is necessary to keep the crew alive, and the gods never notice (no favor change).
- **Favor law:** Abide is the default favor path. Rare, *intentional* Dare-favor exceptions are permitted per-episode, but each must be an explicit, flagged design decision — never an accident.

---

## v1.1 Requirements

### Effect Engine (declarative effect + narration model)

- [x] **EFFECT-01**: Each island scene stage carries a declarative `beats` data structure mapping every verb (Dare/Abide/Give) × every roll face (1/3/4/6) to `{ delta, text }` — a tuned payoff plus a one-sentence story beat.
- [x] **EFFECT-02**: A single generic resolver consumes `beats` to apply effects and produce narration, replacing per-scene inline `reskin` delta-mutation + hand-written strings (extends the existing `LAND_TABLE`/`SEA_TABLE`/`reskin` pattern; no engine rewrite).
- [x] **EFFECT-03**: A coverage validator confirms every authored scene has a complete verb×face table (no missing or dead cells) and runs before/with authoring to prevent drift across scenes.
- [x] **EFFECT-04**: All numeric payoffs are traceable to a single labelled `CONFIG` convention (no magic numbers scattered through beats), preserving the project's retunability constraint.

### Resolution (sequential commit resolution against shared resources)

- [ ] **RESOLVE-01**: Blind commits stay simultaneous, but on reveal they resolve *sequentially* against shared/commons resources (the hold) — replacing the current simultaneous-feasibility check with turn-ordered resolution, so a shared-resource shortfall is decided by who acts first.
- [ ] **RESOLVE-02**: When a player's committed action is no longer affordable at their point in the resolution order (e.g. the last hold ration was consumed by an earlier player's Dare), that action is denied and the player's turn is skipped — never partially applied — with narration explaining the shortfall.
- [ ] **RESOLVE-03**: Resolution order is defined by fixed turn order for v1.1; the ordering is an isolated, documented seam (code comment) so a future scheme (favor-weighted order, or a passed "turn chip") can replace it without touching resolution logic.

### Island Content (thematic authoring — 4 islands × 3 stages)

- [ ] **CONTENT-01**: Helios scenes are authored to the moral of *restraint* — Abide is inert except a 6 (forage dandelions, small gain); Dare escalates the commons transgression (kill the cattle) with high upside and Helios's wrath.
- [ ] **CONTENT-02**: Cyclops scenes are authored to the moral of *pride/boasting* — Abide keeps you hidden/stuck (pure-abide strands you eating cheese until left behind); Dare (boast/escape) carries the curse risk and high upside.
- [ ] **CONTENT-03**: Sirens scenes are authored to the moral of *rewarded temptation / wreck* — daring the song risks the ship for a real prize; abiding is safe but yields little.
- [ ] **CONTENT-04**: Lotus scenes are authored to the moral of *forgetting / the strand* — abiding risks being lulled/left; daring pulls the crew back to the voyage.
- [ ] **CONTENT-05**: Every authored island beat honors the Dare/Abide/Give asymmetry (Dare = high risk to self+crew, high upside; Abide = riskless, low upside, lethal-if-only; Give = riskless, sustains crew, no favor) — verifiable, not aspirational.
- [ ] **CONTENT-06**: Existing favor-law violations (Sirens, Cyclops-boast, Lotus grant favor via Dare) are reconciled — each is either retuned to a non-favor reward or explicitly confirmed as an intentional flagged Dare-favor exception, with the decision recorded in the beat data.

### Anchor Content (full verb retrofit — Hades / Phaeacia / Ithaca)

- [ ] **ANCHOR-01**: Hades is rebuilt onto the Dare/Abide/Give verb×roll grammar with thematic beats, without regressing the validated revival + peek mechanics.
- [ ] **ANCHOR-02**: Phaeacia is rebuilt onto the verb grammar (it has no player verb choice today) with thematic beats, without regressing the validated favor-weighted gift-court payout (gifts only).
- [ ] **ANCHOR-03**: Ithaca's three-scene reversal finale is rebuilt onto the verb grammar with thematic beats, without regressing the validated reversal/reckoning mechanics.
- [ ] **ANCHOR-04**: All validated v1.0 anchor invariants survive the retrofit — no dead-end states, revival economy intact, favor-weighted Phaeacia pool intact, finale always reaches a winner.

### Balance (effects-as-balance retune + death-spiral fix)

- [ ] **BALANCE-01**: The hand-tuned per-stage `beats` deltas replace the default death-spiral `[tune]` constants as the game's intended economy (designer-tuned, playtest-driven — no simulation harness this pass).
- [ ] **BALANCE-02**: A fixed multi-seed 0-human auto sweep is the acceptance bar: across the seed set, most games reach Ithaca with *some* crew alive, the hold/rations economy stays under real pressure (neither mass starvation nor trivial survival), and the run always terminates at a winner.
- [ ] **BALANCE-03**: Cross-episode favor reconciliation confirms favor stays *contested* — cooperation (favor) remains the optimal path to *winning* while defection remains optimal only for *bare survival*; favor is neither dominated nor trivially maxed.

### Interactive Board (replaces the raw narration log)

- [ ] **BOARD-01**: The board shows the voyage visually — the boat advancing across the sea / island track through Troy → islands → Hades → Phaeacia → Ithaca.
- [ ] **BOARD-02**: The crossing marble bag is shown as actual blue/white marbles that visibly drain as they are drawn during a crossing.
- [ ] **BOARD-03**: Dice/bone rolls are shown on the board with the live rolled face.
- [ ] **BOARD-04**: Dare/Abide/Give are clickable affordances on the board (the primary play surface), for each human decision point where the prototype currently prompts.
- [ ] **BOARD-05**: Scene narration (the current beat's story text) is surfaced *in* the board, making the board — not a raw text log — the primary play/read surface.
- [ ] **BOARD-06**: Each player's live status (favor, hold/rations, alive/dead, temperament) is visible on the board.
- [ ] **BOARD-07**: The board is a pure projection of game state — no parallel/duplicate state (uses the existing `_`-prefixed transient convention); all animation derives only from already-decided values, and `rng()` draws stay synchronous inside reducers (never in click handlers or animation callbacks).
- [ ] **BOARD-08**: Blind-commit masking is preserved — the board never leaks bot or human commits before reveal (public/private display zones honor the existing 1 / 2–3 human masking rules and director-mode toggle).
- [ ] **BOARD-09**: Seeded determinism is preserved — `?seed=` reproduces an identical game, and the 0-human seeded run still completes unattended to a winner; a readable narration transcript survives (log demoted to a collapsible / director-mode panel, not deleted) so unattended runs stay debuggable.

---

## Future Requirements

Deferred beyond v1.1. Tracked, not in this milestone's roadmap.

### Simulation & Tuning

- **SIM-01**: Batch "Pastry-Pirates" simulation harness that machine-optimizes `[tune]` constants across many runs.
- **SIM-02**: Automated balance regression dashboard (win-rate / survival / favor-spread charts across seed sweeps).

### Production Polish

- **POLISH-01**: Production art/sound pass beyond emoji + CSS.
- **POLISH-02**: Additional episodes beyond the four worked islands.

---

## Out of Scope

Explicitly excluded for v1.1. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Libraries / frameworks / CDN / bundler / build step | Immovable stack constraint — single self-contained `index.html`, vanilla JS, offline by double-click |
| Networked multiplayer | Hotseat only; blind commit is simulated locally |
| Browser storage (localStorage/sessionStorage) | All state in one in-memory object; reload = fresh game |
| Player-to-player trading of rations or favor | Only inter-player transfer remains the Orpheus toll; favor moves only via the gods |
| New verbs, currencies, or tracks | Locked at three verbs / two currencies / one world-track-per-episode; surface gaps as code comments |
| Automated simulation/tuning harness ("Pastry-Pirates") | v1.1 hand-tunes via thematic payoffs; the machine-optimizing sweep is a later milestone (see SIM-01) |
| Canvas/WebGL rendering engine | DOM+CSS (with inline SVG backdrop) is sufficient for the board's object count and keeps zero-dependency styling/accessibility |

---

## Traceability

Mapped to phases during roadmap creation (2026-07-25). Every v1.1 requirement is assigned to exactly one phase.

| Requirement | Phase | Status |
|-------------|-------|--------|
| EFFECT-01 | Phase 1 | Complete |
| EFFECT-02 | Phase 1 | Complete |
| EFFECT-03 | Phase 1 | Complete |
| EFFECT-04 | Phase 1 | Complete |
| RESOLVE-01 | Phase 1 | Pending |
| RESOLVE-02 | Phase 1 | Pending |
| RESOLVE-03 | Phase 1 | Pending |
| CONTENT-01 | Phase 2 | Pending |
| CONTENT-02 | Phase 2 | Pending |
| CONTENT-03 | Phase 2 | Pending |
| CONTENT-04 | Phase 2 | Pending |
| CONTENT-05 | Phase 2 | Pending |
| CONTENT-06 | Phase 2 | Pending |
| ANCHOR-01 | Phase 3 | Pending |
| ANCHOR-02 | Phase 3 | Pending |
| ANCHOR-03 | Phase 3 | Pending |
| ANCHOR-04 | Phase 3 | Pending |
| BALANCE-01 | Phase 3 | Pending |
| BALANCE-02 | Phase 3 | Pending |
| BALANCE-03 | Phase 3 | Pending |
| BOARD-01 | Phase 4 | Pending |
| BOARD-02 | Phase 4 | Pending |
| BOARD-03 | Phase 4 | Pending |
| BOARD-04 | Phase 4 | Pending |
| BOARD-05 | Phase 4 | Pending |
| BOARD-06 | Phase 4 | Pending |
| BOARD-07 | Phase 4 | Pending |
| BOARD-08 | Phase 4 | Pending |
| BOARD-09 | Phase 4 | Pending |

**Coverage:**

- v1.1 requirements: 29 total
- Mapped to phases: 29 ✓
- Unmapped: 0 ✓

**Phase distribution:**

- Phase 1 (Effect Engine & Sequential Resolution): 7 — EFFECT-01..04, RESOLVE-01..03
- Phase 2 (Themed Island Content & Favor-Law Reconciliation): 6 — CONTENT-01..06
- Phase 3 (Anchor Verb Retrofit & Balance Retune): 7 — ANCHOR-01..04, BALANCE-01..03
- Phase 4 (Interactive Board): 9 — BOARD-01..09

---
*Requirements defined: 2026-07-25*
*Last updated: 2026-07-25 after roadmap creation (traceability filled, 29/29 mapped)*
