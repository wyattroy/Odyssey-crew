---
phase: 04-interactive-board
plan: 04
subsystem: ui
tags: [vanilla-js, dom-render, board-game, single-file, determinism, masking]

# Dependency graph
requires:
  - phase: 04-03-action-bar-narration
    provides: every human decision kind (troy/eat/act/pride/revive/orpheus/patience) hosting its buttons in the per-seat ctrl-<id> board slot
provides:
  - "A confirmed, documented audit that blind-commit masking (BOARD-08) already
     holds across every board sub-renderer — no board zone reads p.commit or the
     pre-rolled p.lastBone before reveal, for bots or humans."
  - "The ship's-log transcript demoted into a collapsible <details id=\"logPanel\">
     panel (closed by default, opened when directorMode is on) — log()/renderLog()/
     state.log unchanged, so the 0-human seeded run still writes the full
     transcript (BOARD-09)."
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Log demotion is a markup-only wrapper: the pre-existing #log div is nested
       inside <details id=\"logPanel\"><summary>...</summary>...</details>; open
       state is synced to state.directorMode at game start and on every
       directorToggle change ($('logPanel').open = state.directorMode), never a
       new state field."
    - "Masking-audit-as-comment: since prior plans (04-01..03) already built every
       board sub-renderer against the reveal-gated seam correctly, this plan's
       BOARD-08 task made no logic change — it documents the confirmed invariant
       inline (above collectCommits()) so future plans don't have to re-derive it."

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "No masking code changes were needed. Auditing every board sub-renderer
     (renderPlayers/renderDice/renderTrack/renderStrip/renderBag/renderNarration)
     and every collectCommits() call site (troy/eat/act/pride/revive/patience)
     plus the one hand-rolled sequential gate (Orpheus in runHades) confirmed all
     already read only public state or the reveal-gated per-actor transient
     (p._boneShow/state._narration), never p.commit or the pre-rolled p.lastBone,
     for both bots and humans. Documented the confirmation as a comment rather
     than inventing new masking machinery that the plan explicitly said not to add."
  - "Kept the director-mode/speed toggle controls OUTSIDE the <details>, only the
     transcript itself inside — so a human can still reach the director-mode
     checkbox (and thus open the panel) without first having to open the panel to
     find it. The plan's artifact spec described wrapping 'the #log card'; wrapping
     only the transcript (not the toggle row) satisfies the same closed-by-default/
     director-open contract while avoiding a chicken-and-egg control."
  - "Synced <details>.open imperatively (on game start and on directorToggle
     onchange) rather than driving it from a render() call — .open is native
     interactive browser state (like a checkbox's .checked), not a value the pure
     board projection should overwrite on every render (that would fight a user
     manually re-collapsing the panel mid-game)."
  - "Logged a pre-existing, unrelated setup-screen bug (the bot 'reroll
     temperament' button calls pick() → rnd() → state.rng() while state is still
     null, before Start is clicked) to deferred-items.md instead of fixing it —
     out of scope per the Scope Boundary rule (not caused by this plan's masking/
     log-demotion changes, unreachable by the 0-human harness or any ?seed= path
     this phase verifies)."

requirements-completed: [BOARD-08, BOARD-09]

coverage:
  - id: D1
    description: "Blind-commit masking holds across the whole board: with 2+ humans and director mode off, no board zone (renderPlayers/renderDice, or any other sub-renderer) reveals another player's committed verb or bone before reveal; bot commits (set at collectCommits start) are masked identically to human commits; public zones (track/strip/bag) render freely throughout"
    requirement: "BOARD-08"
    verification:
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed demo/alpha/beta (0-human seeded runs unaffected — bots never render through the masked path at all)"
        status: pass
      - kind: other
        ref: "manual code audit: grep '\\.commit\\b' across index.html confirms every read of p.commit is inside a reducer/resolution function (collectCommits, eatPhase's satchel/hold split, actPhase's resolveEffect call, pride/revive/patience resolution), never inside renderPlayers/renderDice/renderTrack/renderStrip/renderBag/renderNarration; renderDice() reads only p._boneShow (comment-documented as reveal-gated, set one actor at a time in actPhase's resolutionOrder() loop), never p.lastBone (pre-rolled for all actors before the loop)"
        status: pass
      - kind: automated_ui
        ref: "orchestrator: serve http://localhost:8777/?seed=demo&humans=2&speed=0 (director mode OFF), screenshot at the pass-gate and mid-reveal to confirm no pre-reveal leak; toggle director mode and confirm reveal-as-you-go returns"
        status: unknown
    human_judgment: true
    rationale: "Confirming no visual leak during a live 2-human masked act (and that reveal-as-you-go returns correctly with director mode on) requires a browser click-through — this executor has no browser in this environment; orchestrator performs the masking click-test + screenshot pass per the plan's explicit instruction (checkpoint:human-verify task not executed by this agent)."
  - id: D2
    description: "The ship's-log transcript is demoted into a collapsible <details> panel (closed by default, auto-open in director mode), NOT deleted — log()/renderLog()/state.log unchanged, so a 0-human seeded run still writes the full transcript; ?seed= determinism holds end-to-end"
    requirement: "BOARD-09"
    verification:
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed demo/alpha/beta all exit 0, validateBeats ok, THE VERDICT reached; --seed demo run twice produces byte-identical stdout"
        status: pass
      - kind: other
        ref: "grep -c '<script>' index.html == 1 (single inline script block preserved, harness.mjs regex still matches the whole engine); log()/logBeat()/flavor()/renderLog()/state.log bodies unchanged — only the surrounding markup gained a <details>/<summary> wrapper and one .open sync line"
        status: pass
      - kind: automated_ui
        ref: "orchestrator: serve http://localhost:8777/?seed=demo&auto=1&humans=0&speed=0 to completion — confirm THE VERDICT with no ENGINE ERROR, the log panel is collapsed by default, and opening director mode expands it with the full transcript visible"
        status: unknown
    human_judgment: true
    rationale: "Confirming the collapsed/auto-open visual behavior and that the expanded panel shows the complete transcript requires a browser session — this executor has no browser in this environment; orchestrator performs this pass alongside the BOARD-08 masking click-test per the plan's explicit instruction."

# Metrics
duration: 20min
completed: 2026-07-26
status: complete
---

# Phase 4 Plan 4: Blind-Commit Masking Audit + Ship's Log Demotion + Final Pass Summary

**A masking audit (no logic changes — every board sub-renderer already honored the reveal-gated seam correctly) plus the ship's-log transcript demoted into a collapsible `<details>` panel, closing out Phase 4's Interactive Board with a proven-deterministic full voyage.**

## Performance

- **Duration:** 20 min
- **Tasks:** 2 of 3 (Task 3 is a `checkpoint:human-verify` gate="blocking", satisfied by the orchestrator's masking click-test + log-demotion + determinism pass per this run's explicit executor instructions — not executed by this agent)
- **Files modified:** 1 (`index.html`); 1 new doc (`deferred-items.md`)

## Accomplishments

- **BOARD-08 masking audit (Task 1):** Walked every board sub-renderer (`renderPlayers`/`renderDice`/`renderTrack`/`renderStrip`/`renderBag`/`renderNarration`) and every `collectCommits()` call site (`troy`/`eat`/`act`/`pride`/`revive`/`patience`) plus the one hand-rolled sequential gate that bypasses `collectCommits` (Orpheus's raise-the-dead loop inside `runHades`/`revivalRound`). Confirmed:
  - `renderPlayers()`/`renderDice()` never read `p.commit` — the only per-player transients they draw from (`_committing`, `_boneShow`, `_delta`) are either verb-agnostic labels ("committing…"/"choosing…") or fields set one actor at a time inside `actPhase()`'s `resolutionOrder()` reveal loop, never the all-actors-at-once pre-rolled `p.lastBone`.
  - Bot commits (`b.commit = botDecide(...)`, set the instant `collectCommits` starts) are masked exactly like human commits — nothing in any renderer reads `p.commit` until the reveal loop passes it into `resolveEffect()`.
  - Every `collectCommits()` call site and the Orpheus loop honor the same `masked = !directorMode && humans>1` gate before a human's own buttons render in their `ctrl-<id>` slot; `clearPrompt()` wipes every seat's `ctrl-<id>` slot between turns, so no stale affordance from a prior human's turn lingers.
  - Public zones (`renderTrack`/`renderStrip`/`renderBag` — boat position, hold, favor, alive/starving/dead, crossing bag) read only unconditional `state` fields, by design, per the public/private split.
  - **No code/logic change resulted** — the audit is documented inline as a comment above `collectCommits()` so the invariant is explicit for future plans, per the plan's explicit "no new masking logic is introduced" constraint.
- **BOARD-09 log demotion (Task 2):** Wrapped the existing `#log` transcript div in `<details id="logPanel"><summary>📜 Ship's log</summary>...</details>`, closed by default. `state.directorMode` drives `logPanel.open` at game start and on every `directorToggle` change (`$('logPanel').open = state.directorMode`), so director mode auto-opens the panel and toggling it live opens/closes the transcript. `log()`, `logBeat()`, `flavor()`, `renderLog()`, and `state.log` are byte-for-byte unchanged — same `#log` div, same append-only render loop — so the full narration transcript is still written on every 0-human seeded run regardless of whether the panel is expanded. Added matching dark-aesthetic `<details>`/`<summary>` CSS (custom ▸/▾ marker via `::before`, existing heading font/colors, no library).
- **Final regression/determinism pass:** `node scratchpad/harness.mjs --seed demo`, `--seed alpha`, `--seed beta` all exit 0 (`validateBeats: ok=true`, `THE VERDICT` reached) both before and after each task's commit. `--seed demo` run twice produces byte-identical stdout. `grep -c '<script>' index.html` stayed at `1` throughout — the single inline script block (and `scratchpad/harness.mjs`'s regex match against it) was never split.
- **Deferred (out of scope):** discovered a pre-existing, unrelated bug — the setup screen's bot "🎲 re-roll temperament" button calls `pick(TEMPERAMENTS)` → `rint()` → `rnd()` → `state.rng()` while `state` is still `null` (before `startBtn` is clicked), which would throw. This predates 04-04, is unreachable from the 0-human harness or any `?seed=` path this phase verifies, and is unrelated to blind-commit masking or log demotion — logged to `.planning/phases/04-interactive-board/deferred-items.md` per the Scope Boundary rule rather than fixed here.

## Task Commits

Each task was committed atomically:

1. **Task 1: Enforce and verify blind-commit masking across the board (BOARD-08)** - `c6b5a94` (docs — audit only, no logic change; also added `deferred-items.md`)
2. **Task 2: Demote the ship's log to a collapsible panel + final determinism/regression pass (BOARD-09)** - `ddcfcdd` (feat)

**Plan metadata:** (this commit, filed after this SUMMARY)

Task 3 (`checkpoint:human-verify`, gate="blocking") is satisfied by the orchestrator's own masking click-test, log-demotion check, and determinism/regression pass per this run's explicit executor instructions — it is not a code task and produces no commit from this agent.

## Files Created/Modified

- `index.html` — BOARD-08 masking-audit comment added above `collectCommits()` (no logic change); `#log` wrapped in `<details id="logPanel"><summary>📜 Ship's log</summary>...</details>` with matching CSS; `logPanel.open` synced to `state.directorMode` at game start and on `directorToggle` change.
- `.planning/phases/04-interactive-board/deferred-items.md` — new file, logs one pre-existing out-of-scope setup-screen RNG bug discovered during the audit.

## Decisions Made

- No masking code changes were needed (see key-decisions in frontmatter) — the audit is documented as a comment rather than adding new masking machinery the plan explicitly said not to introduce.
- Kept `directorToggle`/`botSpeedToggle` controls outside the `<details>`, only the transcript itself inside — avoids a chicken-and-egg control (needing to open the panel to find the checkbox that opens the panel).
- Synced `<details>.open` imperatively at game-start and on toggle-change, not from `render()` — `.open` is native interactive browser state, not a value the pure board projection should overwrite every frame (that would fight a user who manually collapses the panel mid-game).
- Logged the setup-screen RNG bug to `deferred-items.md` instead of fixing it — out of scope per the Scope Boundary rule.

## Deviations from Plan

None — plan executed exactly as written, including its explicit "no new masking logic" and "markup wrapper only" constraints. Task 3 (`checkpoint:human-verify`) was intentionally not executed by this agent per explicit executor instructions in this run's task brief (no browser available; orchestrator performs the masking click-test + log-demotion + determinism pass).

### Auto-fixed Issues

None — the masking audit found the existing implementation already fully compliant; no bugs required fixing within this plan's scope.

## Issues Encountered

None. One pre-existing, out-of-scope bug was discovered and deferred (see Accomplishments / deferred-items.md) rather than fixed, per the Scope Boundary rule.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Phase 4 (Interactive Board) is functionally complete pending the orchestrator's browser verification pass: BOARD-01 through BOARD-09 are all implemented and headlessly verified (three-seed harness pass, byte-identical repeat, single-script-block integrity).
- Outstanding: the plan's `checkpoint:human-verify` (Task 3) still needs the orchestrator's 2-human masking click-test (confirm no pre-reveal leak, confirm director-mode reveal-as-you-go), log-panel visual check (collapsed by default, director-open, full transcript inside), and a browser `?seed=demo&auto=1&humans=0&speed=0` run matching the harness's winner before Phase 4 is considered fully closed out visually.
- Deferred item for a future plan/phase: the setup-screen bot temperament re-roll button's pre-game RNG call against a still-`null` `state` (see `deferred-items.md`) — recommend switching that one button to `Math.random()` directly, since no determinism contract applies before a seeded game exists.

---
*Phase: 04-interactive-board*
*Completed: 2026-07-26*

## Self-Check: PASSED

- FOUND: index.html
- FOUND: .planning/phases/04-interactive-board/deferred-items.md
- FOUND: .planning/phases/04-interactive-board/04-04-SUMMARY.md
- FOUND commit: c6b5a94
- FOUND commit: ddcfcdd
