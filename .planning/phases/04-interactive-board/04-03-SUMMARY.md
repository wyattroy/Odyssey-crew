---
phase: 04-interactive-board
plan: 03
subsystem: ui
tags: [vanilla-js, dom-render, board-game, single-file, determinism]

# Dependency graph
requires:
  - phase: 04-02-crossing-strip
    provides: renderBoard() orchestrator seam (renderTrack/renderStrip/renderPlayers/renderBag/renderDice) hooked into the existing render() call sites
provides:
  - Dare/Abide/Give (and eat satchel/hold) affordances always hosted in the
    per-seat ctrl-<id> board slot (never the shared #prompt box), reusing
    promptButtons()/askResolve() verbatim as the single commit seam
  - renderNarration() — a #narration board card showing the current beat's
    narrate() sentence, sourced from state._narration (a `_`-prefixed
    transient set at the same log() call the ship's-log line comes from)
affects: [04-04-masking-log-demotion]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "promptButtons()'s board-vs-box placement is keyed ONLY on seatId!=null
       now (director mode no longer forces the shared #prompt box) — director
       mode remains scoped to collectCommits' masking (`masked` flag), never
       button placement. One condition, one meaning, going forward."
    - "state._narration follows the same `_`-prefixed board-only-transient
       discipline as p._boneShow/state.crossing._lastDrawn: written by the
       reducer at the exact point the source-of-truth log() call fires, read
       by a pure renderNarration(), cleared per-phase by the existing
       clearBones() reset — no second narration text is ever authored."

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "Dropped the `!state.directorMode` guard from promptButtons()'s holder
     selection entirely rather than adding a second board-placement flag —
     the guard's only original purpose was routing buttons to the shared box
     for the (very common) 1-human default game where directorMode defaults
     true; since BOARD-04 wants the action bar on the board at EVERY human
     decision point regardless of human count, the simplest correct fix is
     to make seatId!=null the sole placement condition. directorMode keeps
     its unrelated, unchanged meaning in collectCommits' masking check."
  - "Re-used the existing per-seat ctrl-<id> slot (inside each crew card) as
     the action bar's host, per the plan's key_link, instead of introducing
     a separate horizontal 'action bar' DOM region — CSS alone (.ctrls
     collapses when empty, expands to a bordered full-width-button panel
     when populated) turns the acting player's own card into the action
     bar, with zero new DOM structure and zero new Promise plumbing."
  - "narrate()'s reveal-loop log(n.html, cls) call is the ONLY place
     state._narration is set (not eatPhase's feed/miss lines, not scene
     hooks/flavor text) — matches the plan's read_first guidance to isolate
     the beat's `tell` from system/hook lines rather than mirroring the
     entire log stream onto the board."
  - "state._narration is cleared inside clearBones() (called at the start of
     both actPhase and eatPhase) rather than at the end of a phase, so the
     narration area shows a placeholder the instant a new commit round
     begins instead of holding stale text from the previous beat while a new
     one is being decided."

requirements-completed: [BOARD-04, BOARD-05]

coverage:
  - id: D1
    description: "Dare/Abide/Give (and eat satchel/hold) render as large clickable board affordances at every human decision point, using the scene's verb labels, wired to the existing promptButtons()/askResolve()/collectCommits() seam — no forked input path, no board read/write of p.commit"
    requirement: "BOARD-04"
    verification:
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed demo/alpha/beta (0-human seeded runs unaffected — bots never touch promptButtons/the board)"
        status: pass
      - kind: other
        ref: "extracted-function grep: promptButtons()/askResolve()/renderPlayers()/clearBones() bodies contain no rnd(/rint(/pick(/throwBone(/Math.random; btn.onclick still reads `()=>askResolve(b.value)` verbatim"
        status: pass
      - kind: automated_ui
        ref: "orchestrator: serve http://localhost:8777/?seed=demo&humans=1&speed=0, click a board Dare/Abide/Give affordance and a satchel/hold affordance"
        status: unknown
    human_judgment: true
    rationale: "Confirming the buttons are visually prominent/legible on the board and that clicking them advances the game exactly as the old #prompt card did requires a live browser click-test — this executor has no browser in this environment; orchestrator performs the click-test per the plan's browser <verify> step."
  - id: D2
    description: "The current scene beat's narrate() story sentence is surfaced prominently on the board (#narration), in the resolved effect's log cls color, sourced from the same log() call that writes the ship's-log line (single narration source, log/state.log/renderLog untouched)"
    requirement: "BOARD-05"
    verification:
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed demo/alpha/beta (act-reveal path unperturbed, all pass); --seed demo run twice byte-identical"
        status: pass
      - kind: other
        ref: "extracted-function grep: renderNarration()/renderBoard() bodies contain no rnd(/rint(/pick(/throwBone(/Math.random"
        status: pass
      - kind: automated_ui
        ref: "orchestrator screenshot: http://localhost:8777/?seed=demo&auto=1&humans=0&speed=550 during an island scene — #narration text matches the newest #log line"
        status: unknown
    human_judgment: true
    rationale: "Confirming visual prominence/legibility of the narration text and that it visually matches the corresponding log line requires a screenshot review — this executor has no browser in this environment; orchestrator performs the screenshot pass."

# Metrics
duration: 15min
completed: 2026-07-26
status: complete
---

# Phase 4 Plan 3: Action Bar + On-Board Narration Summary

**The board becomes the play/read surface: Dare/Abide/Give and eat satchel/hold render as large clickable buttons inside the acting player's own crew card (the existing ctrl-<id> commit seam, re-hosted — director mode no longer diverts them to the old #prompt box), and a new #narration card shows the current beat's story sentence sourced from the exact log() call that writes the ship's-log line.**

## Performance

- **Duration:** 15 min
- **Tasks:** 2 of 3 (Task 3 is a `checkpoint:human-verify` gate="blocking", satisfied by the orchestrator's click-test + screenshot pass per this run's explicit executor instructions — not executed by this agent)
- **Files modified:** 1 (`index.html`)

## Accomplishments
- `promptButtons()`'s holder selection now keys on `seatId!=null` alone — dropped the `!state.directorMode` guard that previously routed a single human's (the common default) buttons into the shared `#prompt` box instead of their own board card. `directorMode` keeps its unrelated, unchanged meaning in `collectCommits()`'s masking check (`masked = !state.directorMode && humans.length>1`); button placement and commit masking are now two independent concerns, correctly separated.
- Every kind that calls `promptButtons(..., p.id)` — `act` (Dare/Abide/Give), `eat` (satchel/hold), and the other human decision kinds (troy/pride/revive/orpheus/patience) — now renders its buttons on the board, inside the acting player's crew card, using the existing `ctrl-<id>` slot verbatim. `btn.onclick = ()=>askResolve(b.value)` is unchanged: the board is the same input path, re-hosted visually, never a second commit route.
- Added `.ctrls` CSS: an empty slot collapses to nothing (`:empty{display:none}`); a populated slot becomes a bordered panel of full-width, left-aligned buttons — the existing `.dare`/`.abide`/`.give` accent border colors and `button:disabled{opacity:.35}` styling carry through unchanged, so Give still greys out when the player's satchel is empty.
- Added `renderNarration()`, composed into `renderBoard()`, reading `state._narration` (a `_`-prefixed board-only transient). It is set at the ONE place a beat's story sentence is assembled and logged — `actPhase()`'s reveal loop, right where `log(n.html, cls)` already writes the ship's-log line — so the board text and the log text are always the identical string from the identical `narrate()` call (Pitfall 3: one narration source, never a forked copy).
- `state._narration` is cleared inside `clearBones()` (called at the start of both `actPhase()` and `eatPhase()`), so the narration card shows a neutral placeholder the instant a new commit round begins rather than holding a stale sentence from a prior phase.
- `log()`/`state.log`/`renderLog()` are completely untouched — the full ship's-log transcript still records every line (feed/miss, scene hooks, flavor text, narrate() lines, everything); the board narration surface is a read-only projection of the same stream, not a replacement.
- Verified headless on three seeds (demo/alpha/beta) after each task's commit — all exit 0, `validateBeats` ok, `THE VERDICT` reached; `--seed demo` run twice is byte-identical both after Task 1 and after Task 2.
- Extracted-function grep (balanced-brace body extraction, not a naive substring scan) confirms zero `rnd(`/`rint(`/`pick(`/`throwBone(`/`Math.random` inside `promptButtons`, `askResolve`, `renderNarration`, `renderBoard`, `renderPlayers`, `clearBones`, `renderTrack`, `renderStrip` — no randomness entered any render/click callback.
- Confirmed the 0-human harness (`humanCount:0`) never calls `promptButtons()`/`askHuman()` at all — bots commit exclusively via `botDecide()` inside `collectCommits()` — so neither task changes anything on the all-bot path; the auto seeded run completes headlessly with no click dependency.

## Task Commits

Each task was committed atomically:

1. **Task 1: Host the Dare/Abide/Give (and eat) affordances on the board via the existing commit seam (BOARD-04)** - `4a82ddb` (feat)
2. **Task 2: renderNarration() — surface the current beat's story text on the board (BOARD-05)** - `6369d6b` (feat)

**Plan metadata:** (this commit, filed after this SUMMARY)

Task 3 (`checkpoint:human-verify`, gate="blocking") is satisfied by the orchestrator's own click-test + screenshot verification pass per this run's explicit executor instructions — it is not a code task and produces no commit from this agent.

## Files Created/Modified
- `index.html` — `promptButtons()` holder condition simplified to `seatId!=null`; new `.p .ctrls`/`.p .ctrls:empty` action-bar CSS; new `#narration` card in the `#game` layout with `.tell`/`.tell.empty` CSS; new `renderNarration()` composed into `renderBoard()`; `clearBones()` now also clears `state._narration`; `actPhase()`'s reveal loop sets `state._narration` alongside its existing `log()` call and calls `renderNarration()` per reveal step; `eatPhase()`/`actPhase()` call `renderNarration()` at their `clearBones()` call sites.

## Decisions Made
- Dropped the `!state.directorMode` guard from `promptButtons()` entirely (see key-decisions in frontmatter) — the simplest fix that makes `seatId!=null` the sole, correct placement condition, leaving `directorMode`'s masking meaning in `collectCommits()` untouched.
- Reused the existing per-seat `ctrl-<id>` slot as the action bar's host rather than building a separate horizontal "action bar" DOM region from the UI-SPEC's layout diagram — CSS alone turns a populated crew card into a prominent button panel, matching the plan's explicit artifact spec (re-host, don't rebuild).
- Scoped `state._narration` to the single `narrate()`-driven `log()` call in `actPhase()`'s reveal loop only, not every `log()` call in the codebase — isolates "the current beat's story tell" from system/hook/flavor lines per the plan's read_first guidance, at the cost of the narration card going blank during `eatPhase` (which never sets it) until the next act reveal.
- Cleared `state._narration` inside `clearBones()` (phase start) rather than at phase end, so a new commit round always begins with a clean narration slate instead of momentarily showing the previous beat's text.

## Deviations from Plan

None - plan executed exactly as written. Task 3 (checkpoint:human-verify) was intentionally not executed by this agent per explicit executor instructions in this run's task brief (no browser available; orchestrator performs the click-test + screenshot verification pass).

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The board is now both the play surface (clickable Dare/Abide/Give + eat choices, hosted on every acting player's own card) and the primary read surface (on-board narration of the current beat), fully wired through the pre-existing commit/log seams with zero forked paths — 04-04 (masking zones + director-mode reveal + log demotion) can build directly on this without touching promptButtons()/renderNarration()'s core contracts.
- Determinism (BOARD-09) and pure projection (BOARD-07) are proven again on this plan's surface (three-seed harness pass, byte-identical repeat, extracted-function randomness grep) — 04-04 should carry forward the same discipline for any masking-zone rendering it adds.
- Outstanding: the plan's `checkpoint:human-verify` (Task 3) still needs the orchestrator's click-test (advance the game via board buttons) and screenshot pass (confirm the narration text reads clearly and matches the log) before this plan is considered fully closed out visually.
- Note for 04-04: with `seatId!=null` now the sole placement condition, EVERY human decision kind (troy/pride/revive/orpheus/patience, not just act/eat) now renders on the board — 04-04's masking-zone work should account for this broader surface when it audits what is/isn't gated pre-reveal.

---
*Phase: 04-interactive-board*
*Completed: 2026-07-26*

## Self-Check: PASSED

- FOUND: index.html
- FOUND: .planning/phases/04-interactive-board/04-03-SUMMARY.md
- FOUND commit: 4a82ddb
- FOUND commit: 6369d6b
