---
phase: 04-interactive-board
plan: 01
subsystem: ui
tags: [vanilla-js, dom-render, board-game, single-file]

# Dependency graph
requires:
  - phase: 03-balance-playtest (or latest completed phase before 04)
    provides: rules-complete voyage engine (reducers, CONFIG effects, validateBeats)
provides:
  - renderBoard() orchestrator hooked into the existing render() seam
  - voyage track with an advancing ⛵ boat marker derived from state.beatIndex
  - upgraded crew row (temperament shown for all players, favor, 🟢/🟠/💀 status)
  - horizontal-scroll-safe track container (no page-level overflow)
affects: [04-02-crossing-strip, 04-03-action-bar, 04-04-masking-log-demotion]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "renderBoard() as the single board orchestrator seam — later plans (marble bag,
       dice, narration, action bar) hang their own render<X>() sub-functions off this
       same function rather than adding new render() call sites."
    - "Board-only visuals (boat marker) are derived by comparing a loop index to
       state.beatIndex inline at render time — no board-local position state, keeping
       renderTrack() a pure projection of state.journey/state.beatIndex."

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "renderBoard() wraps the existing three sub-renderers (renderTrack/renderStrip/
     renderPlayers) and render() now delegates to it — zero new call sites, matching
     the plan's key_link constraint."
  - "Boat marker is an absolutely-positioned span inside .beat (not a separate overlay
     layer) so it moves with the flex-wrapped track layout for free and needs no extra
     positioning math."
  - "Track container (#boardTrack) gets overflow-x:auto and the .track row switches
     flex-wrap:nowrap so a full 8-node journey scrolls inside its card instead of
     wrapping to multiple rows or forcing page-level horizontal scroll."
  - "Crew badge now shows temperament for humans too (previously bot-only), since
     BOARD-06 requires temperament visible per card regardless of human/bot."
  - "Starving status glyph changed 🟡 -> 🟠 to match the BOARD-06 status vocabulary
     (🟢/🟠/💀); lotus-struck 🌸 token left unchanged (outside BOARD-06's scope)."

requirements-completed: [BOARD-01, BOARD-06, BOARD-07]

coverage:
  - id: D1
    description: "Voyage track shows all 8 nodes with a ⛵ boat marker on state.beatIndex that advances as the voyage progresses; unrevealed islands render as a face-down chip"
    requirement: "BOARD-01"
    verification:
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed demo (0-human seeded run reaches THE VERDICT, validateBeats ok)"
        status: pass
      - kind: automated_ui
        ref: "orchestrator screenshot: http://localhost:8777/?seed=demo&auto=1&humans=0&speed=0"
        status: unknown
    human_judgment: true
    rationale: "Visual placement/legibility of the boat marker on the track requires a screenshot review, which this executor cannot perform (no browser available in this environment) — orchestrator verifies via screenshot per the plan's browser <verify> step."
  - id: D2
    description: "Crew row shows name, temperament, favor (🫒 N), and alive/starving/dead status (🟢/🟠/💀) per player; shared hold (🛢️) shown once prominently; acting player highlighted"
    requirement: "BOARD-06"
    verification:
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed demo/alpha/beta (crew-row changes did not perturb reducer path)"
        status: pass
      - kind: automated_ui
        ref: "orchestrator screenshot: crew row with temperament/favor/status + single hold stat"
        status: unknown
    human_judgment: true
    rationale: "Visual layout/readability of the crew row requires a screenshot review, which this executor cannot perform (no browser available) — orchestrator verifies via screenshot."
  - id: D3
    description: "renderBoard() is a pure projection of state (no parallel state, no rnd()/pick()/throwBone()/Math.random in any render/click/timer/rAF callback); same ?seed= reproduces byte-identical output"
    requirement: "BOARD-07"
    verification:
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed demo run twice, diffed byte-identical"
        status: pass
      - kind: other
        ref: "grep for rnd(/rint(/pick(/throwBone(/Math.random inside renderBoard/renderTrack/renderPlayers/renderStrip bodies — none found"
        status: pass
    human_judgment: false

# Metrics
duration: 20min
completed: 2026-07-26
status: complete
---

# Phase 4 Plan 1: Board Tracer Summary

**renderBoard() orchestrator + an advancing ⛵ boat marker on the 8-node voyage track + an upgraded crew row (temperament for every player, 🟢/🟠/💀 status), all rendering purely from state and proven byte-identical across three seeds before any interactivity lands.**

## Performance

- **Duration:** 20 min
- **Tasks:** 2 of 3 (Task 3 is a `checkpoint:human-verify` satisfied by the orchestrator's screenshot pass, per plan instructions — not executed by this agent)
- **Files modified:** 1 (`index.html`)

## Accomplishments
- Introduced `renderBoard()` as the board orchestrator, called from the existing `render()` — zero new call sites; every reducer's existing post-mutation `render()` call now composes the board.
- `renderTrack()` places a ⛵ boat marker on the node at `state.beatIndex`, recomputed fresh every render (no board-local position field); existing `.beat.cur`/`.beat.done` accents and the face-down `🎴`/"Island ?" unrevealed-island chip are preserved unchanged.
- Track container (`#boardTrack`) scrolls horizontally inside its own card (`overflow-x:auto`, `flex-wrap:nowrap` on `.track`) so the full 8-node journey never forces page-level horizontal scroll.
- `renderPlayers()` crew badge now shows temperament (emoji + label) for humans as well as bots, satisfying BOARD-06's "temperament visible per card" requirement across all seat types.
- `statusTok()` starving glyph updated 🟡 → 🟠 to match the BOARD-06 status vocabulary (🟢 alive / 🟠 starving / 💀 dead); 🌸 lotus-struck token unchanged.
- Confirmed the shared hold (`🛢️`) remains rendered exactly once, in `renderStrip()`'s hold `.stat`, never duplicated per crew card.
- Verified headless via `node scratchpad/harness.mjs` on three seeds (demo/alpha/beta) — all exit 0, `validateBeats` ok, `THE VERDICT` reached; `--seed demo` run twice produced byte-identical output both before and after each task's edit.
- Greppability check: no `rnd(`/`rint(`/`pick(`/`throwBone(`/`Math.random` inside `renderBoard`/`renderTrack`/`renderPlayers`/`renderStrip` function bodies.

## Task Commits

Each task was committed atomically:

1. **Task 1: renderBoard() scaffold + voyage track with advancing ⛵ boat marker** - `fff5fd3` (feat)
2. **Task 2: Upgrade the crew row — favor / status / temperament + prominent shared hold** - `ff16f2c` (feat)

**Plan metadata:** (this commit, filed after this SUMMARY)

Task 3 (`checkpoint:human-verify`, gate="blocking") is satisfied by the orchestrator's own screenshot verification pass per this plan's explicit executor instructions — it is not a code task and produces no commit from this agent.

## Files Created/Modified
- `index.html` — added `renderBoard()` orchestrator (delegated to from `render()`); `renderTrack()` boat marker + CSS (`#boardTrack`, `.beat .boat`); `renderPlayers()` badge now includes temperament for all players; `statusTok()` starving glyph 🟡→🟠.

## Decisions Made
- Reused the existing `.beat` flex-chip layout for the boat marker (absolutely-positioned span inside `.beat`) instead of a separate SVG overlay layer — zero extra positioning math, moves with the existing responsive track for free.
- Extended the crew badge to always include temperament (previously bot-only) rather than adding a separate temperament element, keeping the crew card compact and matching the existing `.badge` styling with no new CSS class.
- Left `p._acting`/`.p.acting` highlighting untouched — it already satisfies BOARD-06's "acting player highlighted" requirement; no changes needed there.

## Deviations from Plan

None - plan executed exactly as written. Task 3 (checkpoint:human-verify) was intentionally not executed by this agent per explicit executor instructions in this run's task brief (no browser available; orchestrator performs the screenshot verification pass).

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The `renderBoard()` seam is in place for 04-02 (crossing strip: marble bag + dice) to hang its own sub-renderer off, per the UI-SPEC build order.
- Pure-projection (BOARD-07) and determinism (BOARD-09) contracts are proven end-to-end with a passing headless harness across three seeds — later plans inherit this pattern (derive from state at render time, never rnd() in a render/click callback).
- Outstanding: the plan's `checkpoint:human-verify` (Task 3) still needs the orchestrator's screenshot pass to confirm visual placement of the boat marker and crew-row legibility before this plan is considered fully closed out.

---
*Phase: 04-interactive-board*
*Completed: 2026-07-26*

## Self-Check: PASSED

- FOUND: index.html
- FOUND: .planning/phases/04-interactive-board/04-01-SUMMARY.md
- FOUND commit: fff5fd3
- FOUND commit: ff16f2c
