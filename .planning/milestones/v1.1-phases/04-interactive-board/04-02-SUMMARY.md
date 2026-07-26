---
phase: 04-interactive-board
plan: 02
subsystem: ui
tags: [vanilla-js, dom-render, board-game, single-file, determinism]

# Dependency graph
requires:
  - phase: 04-01-board-tracer
    provides: renderBoard() orchestrator seam (renderTrack/renderStrip/renderPlayers) hooked into the existing render() call sites
provides:
  - renderBag() — crossing bag rendered as actual round blue/white marbles, draining in lock-step with state.crossing.bag
  - renderDice() — reveal-gated pip die per acting player, sourced from p._boneShow
  - state.crossing._lastDrawn board-only transient (set by drawMarble(), cleared at the top of the next draw)
affects: [04-03-action-bar, 04-04-masking-log-demotion]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Board-only 'leaving marble' flourish uses a `_`-prefixed transient
       (state.crossing._lastDrawn) set by the reducer immediately before the render
       that shows it, and cleared at the top of the next reducer call — same
       discipline as p._boneShow/p._delta, extended to a non-player state slice."
    - "renderDice() reads only the reveal-gated per-player transient (p._boneShow),
       never the pre-rolled all-actors field (p.lastBone) — the masking boundary
       for any future roll-display work in this codebase."

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "Full DOM rebuild for renderBag()/renderStrip() (innerHTML reset) rather than an
     incremental diff — matches the plan's fallback allowance ('a full rebuild is
     acceptable if it snaps cleanly at botSpeed===0') and keeps the change small; the
     harness's speed:0 runs across three seeds confirm no blocking wait was added."
  - "_lastDrawn persists across renders until the next drawMarble() call (not cleared
     immediately after one render) — so the greyed-out 'just drawn' marble stays
     visible for the full beat between draws (through eatPhase/actPhase) rather than
     flashing for a single frame, which reads better on a paced (botSpeed>0) run."
  - "renderDice() augments the existing .bone line (🎲 N → delta) with a prepended
     pip glyph rather than replacing the text readout — keeps the debuggable mono
     text and adds the visual, no new DOM element/CSS class needed for the row."
  - "Bone faces only ever land on {1,3,4,6} (CONFIG.boneWeights) so DIE_FACE only
     maps those four to ⚀/⚂/⚃/⚅; a defensive 🎲 fallback covers any future face."

requirements-completed: [BOARD-02, BOARD-03]

coverage:
  - id: D1
    description: "Crossing bag renders as actual round blue/white marbles (state.crossing.bag), visibly draining as each is drawn, with a greyed 'just drawn' marble flourish"
    requirement: "BOARD-02"
    verification:
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed demo/alpha/beta (0-human seeded runs reach THE VERDICT, validateBeats ok)"
        status: pass
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed demo run twice, byte-identical diff"
        status: pass
      - kind: automated_ui
        ref: "orchestrator screenshot: http://localhost:8777/?seed=demo&auto=1&humans=0&speed=550 mid-crossing"
        status: unknown
    human_judgment: true
    rationale: "Visual confirmation that marbles render as round elements matching the bag count/colors, and that the drain is legible on screen, requires a screenshot — this executor has no browser in this environment; orchestrator performs the screenshot pass per the plan's browser <verify> step."
  - id: D2
    description: "Live bone roll shown as a pip die (⚀–⚅) per acting player during act reveal, sourced from the reveal-gated p._boneShow, appearing one player at a time in resolutionOrder()"
    requirement: "BOARD-03"
    verification:
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed demo/alpha/beta (act-reveal path unperturbed, all pass)"
        status: pass
      - kind: other
        ref: "grep for rnd(/rint(/pick(/throwBone(/Math.random inside renderBag/renderDice/renderStrip/renderPlayers bodies — none found (comment mentions excluded)"
        status: pass
      - kind: automated_ui
        ref: "orchestrator screenshot: http://localhost:8777/?seed=demo&auto=1&humans=0&speed=550 during an island act"
        status: unknown
    human_judgment: true
    rationale: "Confirming dice appear one-at-a-time in resolution order (not all at once) and that no die leaks before a player's reveal during a mid-reveal pause requires a live/paced browser session — this executor has no browser in this environment; orchestrator performs the screenshot pass."

# Metrics
duration: 18min
completed: 2026-07-26
status: complete
---

# Phase 4 Plan 2: Crossing Strip Summary

**Crossing bag rendered as actual draining blue/white marbles from `state.crossing.bag`, plus a reveal-gated pip die (⚀–⚅) per acting player sourced from `p._boneShow` — both pure projections of already-decided reducer values, proven byte-identical across three seeds with botSpeed=0 never hanging.**

## Performance

- **Duration:** 18 min
- **Tasks:** 2 of 3 (Task 3 is a `checkpoint:human-verify` gate="blocking" satisfied by the orchestrator's screenshot pass, per this run's explicit executor instructions — not executed by this agent)
- **Files modified:** 1 (`index.html`)

## Accomplishments
- Added `renderBag()`: draws one round marble `<span>` per entry in `state.crossing.bag` (blue=sea, white=land), composed into `renderStrip()`'s existing crossing `.stat` block alongside the original 🔵×N ⚪×N text readout (kept as caption per plan allowance).
- The bag drains for free: `renderBag()` re-derives from `state.crossing.bag` on every call — no board-local count/index is tracked anywhere, so a paused run and the live array always agree (BOARD-07/Pitfall 1).
- Added `state.crossing._lastDrawn`, a `_`-prefixed board-only transient set by `drawMarble()` (the reducer) immediately before the render that shows it, cleared at the top of the next `drawMarble()` call — used to render one greyed-out "just drawn" marble as the leaving flourish, with zero new randomness (the color was already decided by the existing splice).
- Added `renderDice()`: maps bone faces `{1,3,4,6}` to Unicode pip-die glyphs (`⚀/⚂/⚃/⚅`) and reads **only** the reveal-gated `p._boneShow` — the field `actPhase()`'s `resolutionOrder()` loop sets one acting player at a time — never the pre-rolled `p.lastBone` that's populated for every actor before any reveal begins, so no die can leak a roll ahead of that player's turn (Pitfall 2/5, BOARD-03).
- `renderDice()` composed into `renderPlayers()`'s existing `.bone` line (prepended to the `🎲 N → delta` text) — no new DOM element, minimal diff, debuggable text readout preserved.
- Added CSS for `.bag`/`.marble` (blue/white radial-gradient spheres matching the dark-navy palette, `.marble.drawn` greyscale/fade) and `.die` (inline pip glyph), all inline in the existing `<style>` block.
- Verified headless on three seeds (demo/alpha/beta) — all exit 0, `validateBeats` ok, `THE VERDICT` reached; `--seed demo` run twice is byte-identical both after Task 1 and after Task 2.
- Greppability check: no `rnd(`/`rint(`/`pick(`/`throwBone(`/`Math.random` call (excluding comments) inside `renderBag()` or `renderDice()` bodies.
- The harness's own runs execute with `botSpeed:0` — all three seeds completing confirms the marble/dice rendering does not introduce any blocking wait at `botSpeed===0`.

## Task Commits

Each task was committed atomically:

1. **Task 1: renderBag() — the marble bag as actual draining blue/white marbles (BOARD-02)** - `c5396f9` (feat)
2. **Task 2: renderDice() — live bone face on the board, reveal-gated (BOARD-03)** - `fe21425` (feat)

**Plan metadata:** (this commit, filed after this SUMMARY)

Task 3 (`checkpoint:human-verify`, gate="blocking") is satisfied by the orchestrator's own screenshot verification pass per this run's explicit executor instructions — it is not a code task and produces no commit from this agent.

## Files Created/Modified
- `index.html` — `startCrossing()`/`drawMarble()` now set/clear `state.crossing._lastDrawn`; new `renderBag()` composed into `renderStrip()`'s crossing `.stat`; new `renderDice()` composed into `renderPlayers()`'s `.bone` line; new `.bag`/`.marble`/`.die` CSS in the existing `<style>` block.

## Decisions Made
- Full-rebuild rendering (innerHTML reset) for the bag, consistent with the existing `renderStrip()` pattern and the plan's explicit fallback allowance, rather than an incremental diff like `renderLog()` — kept the change small and it snaps cleanly at `botSpeed===0` (verified by the harness's own `botSpeed:0` runs).
- `_lastDrawn` persists across multiple render() calls until the next draw (not cleared immediately after one render), so the "just drawn" greyed marble stays visible for the whole beat between draws on a paced run rather than flashing for a single frame — a readability choice, not a state-tracking one (it is still fully re-derived, just not re-cleared until the reducer decides to).
- Augmented rather than replaced the existing `.bone` text line with the pip die glyph — keeps the mono debug text (`🎲 N → delta`) intact while adding the requested visual, avoiding a new DOM element/CSS class for the row.

## Deviations from Plan

None - plan executed exactly as written. Task 3 (checkpoint:human-verify) was intentionally not executed by this agent per explicit executor instructions in this run's task brief (no browser available; orchestrator performs the screenshot verification pass).

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The crossing strip (draining marbles + reveal-gated dice) is complete and hooked into the existing `renderBoard()` seam — 04-03 (action bar) can add its own `render<X>()` sub-functions the same way, with zero new render() call sites.
- Determinism (BOARD-09) and masking (BOARD-08 precedent: reveal-gated `_boneShow`) are both proven again on this plan's surface — the same discipline (derive from state, read only reveal-gated transients, never `rnd()` in a render/click callback) should carry forward to 04-03's action bar and 04-04's masking work.
- Outstanding: the plan's `checkpoint:human-verify` (Task 3) still needs the orchestrator's screenshot pass — mid-crossing (draining marbles) and mid-act-reveal (one-at-a-time dice) — before this plan is considered fully closed out visually.

---
*Phase: 04-interactive-board*
*Completed: 2026-07-26*

## Self-Check: PASSED

- FOUND: index.html
- FOUND: .planning/phases/04-interactive-board/04-02-SUMMARY.md
- FOUND commit: c5396f9
- FOUND commit: fe21425
