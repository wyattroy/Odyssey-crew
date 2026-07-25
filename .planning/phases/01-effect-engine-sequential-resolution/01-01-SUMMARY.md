---
phase: 01-effect-engine-sequential-resolution
plan: 01
subsystem: game-engine
tags: [vanilla-js, single-file, data-driven-resolver, deterministic-rng]

# Dependency graph
requires: []
provides:
  - "beats data model — scene-level verb x face -> {d, tell, fx?} table (EFFECT-01/02)"
  - "resolveEffect(p, scene, verb, bone, env) — single generic resolver with reskin/table fallback and fx escape hatch"
  - "narrate(p, verb, env, bone, tell, applied) — single ship's-log line formatter"
  - "validateBeats() — fail-loud coverage validator invoked before every voyage"
  - "CONFIG.fx — labelled shared payoff-magnitude palette (EFFECT-04)"
  - "Helios 'The Meadow' and Cyclops 'The Wine' converted onto the beats path (tracer + stateful generalization)"
affects: [01-02-sequential-resolution, phase-02-content-authoring, phase-04-interactive-board]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Declarative beats table co-located on scene objects, consumed by one generic resolveEffect() — data, not if-chains"
    - "fx escape hatch on a beats cell for genuine extra state mutation (persistent counters), narration/delta still live in the same cell"
    - "Single narrate() formatter as the one place a ship's-log sentence is assembled, ready to also drive the Phase 4 board"
    - "Labelled CONFIG.fx payoff-magnitude palette — every beats d:{...} number traces to a named constant"

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "Introduced CONFIG.fx in Task 1 (tracer) rather than deferring to Task 3, since Task 1's plan text explicitly permits introducing the palette early; Task 3 then extended usage to Cyclops and added the fx mechanism to resolveEffect"
  - "resolveEffect returns a `logged` flag so actPhase only calls narrate()/log() for paths that haven't already self-logged (the beats path and the plain-table fallback); this prevents double-logging for scenes still served by an existing reskin closure, which the plan's shorthand pseudocode didn't make explicit but the acceptance criteria (identical seeded log, unconverted scenes unchanged) require"
  - "Removed the now-superseded `reskin` field from Helios 'The Meadow' and Cyclops 'The Wine' (the two scenes converted this plan) since resolveEffect checks `beats` before `reskin` and a fully-covered beats table makes the old reskin dead code for those two scenes; `mkHeliosDare()` remains in use for the still-unconverted Hunger/Reckoning scenes"
  - "narrate() always logs with class 'l-act', matching the exact class the pre-existing generic table-fallback path already used unconditionally (line ~713 before this plan) — a deliberate simplification rather than trying to infer good/bad coloring from a delta object"
  - "Built a throwaway headless Node harness (scratchpad only, not committed to the repo) that stubs just enough of `document`/`location` to load and run index.html's <script> body outside a browser, since no browser or headless-browser tooling (puppeteer/jsdom/chromium) is available in this environment; used it to run the full ?seed=&auto=1&humans=0 path across 32+ seeds for regression parity before/after each task"

requirements-completed: [EFFECT-01, EFFECT-02, EFFECT-03, EFFECT-04]

coverage:
  - id: D1
    description: "beats data model + resolveEffect + narrate wired end-to-end through Helios 'The Meadow' (the tracer), behavior-preserving vs. the old mkHeliosDare()/LAND_TABLE path"
    requirement: "EFFECT-01"
    verification:
      - kind: other
        ref: "headless harness (scratchpad): 6 seeds (demo/seed1/seed2/alpha/beta/gamma) — identical favor/status/log-line-count to pre-conversion baseline"
        status: pass
      - kind: other
        ref: "headless harness: same seed run twice produces byte-identical ship's-log (determinism)"
        status: pass
      - kind: other
        ref: "headless harness: editing one beats cell's `tell` text (seed e) changes only that line, all else identical"
        status: pass
    human_judgment: false
  - id: D2
    description: "validateBeats() coverage validator — fails loud (console.error + on-screen l-bad + throw) on any missing/dead declared beats cell, never silently no-ops"
    requirement: "EFFECT-03"
    verification:
      - kind: other
        ref: "headless harness against a copy of index.html with the helios/The Meadow/dare/face-4 cell deleted: console.error + on-screen l-bad line naming episode/scene/verb/face, voyage halts (never reaches THE VERDICT)"
        status: pass
      - kind: other
        ref: "headless harness against the clean file: validateBeats adds zero mechanical effect (identical favor/status/log-line-count to baseline across 6 seeds)"
        status: pass
    human_judgment: false
  - id: D3
    description: "fx escape hatch + Cyclops 'The Wine' converted onto beats, proving the resolver generalizes to a stateful scene; every beats d:{...} magnitude traces to CONFIG.fx"
    requirement: "EFFECT-04"
    verification:
      - kind: other
        ref: "grep -q 'CONFIG.fx' index.html && grep -Eq 'fx *:' index.html && grep -c 'beats:' index.html"
        status: pass
      - kind: other
        ref: "visual scan of every beats d:{...} block: all magnitudes reference CONFIG.fx.*, no bare integers"
        status: pass
      - kind: other
        ref: "headless harness (seed j): Wine's give raises state.ep.drunk visibly in narration (drunk 1/2, drunk 2/2); 32-seed sweep shows zero engine errors"
        status: pass
    human_judgment: false
  - id: D4
    description: "0-human seeded run still completes unattended to a winner after the conversion; all rnd()/throwBone() draws stay synchronous inside reducers"
    requirement: "SC5"
    verification:
      - kind: other
        ref: "headless harness: 32-seed sweep, all complete to THE VERDICT, zero ENGINE ERROR/unhandled rejections"
        status: pass
      - kind: other
        ref: "grep of every rnd()/throwBone()/drawMarble() call site: all remain inside synchronous reducer/bot-policy functions, none inside a click handler, timer, or animation callback (unchanged from pre-plan positions)"
        status: pass
    human_judgment: false

duration: ~20min
completed: 2026-07-25
status: complete
---

# Phase 01 Plan 01: Effect Engine — Beats + Resolver + Validator Summary

**Declarative `beats` verb x face effect/narration table + one generic `resolveEffect`/`narrate` resolver + a fail-loud `validateBeats()` coverage gate + a labelled `CONFIG.fx` payoff palette, proven end-to-end on Helios "The Meadow" (tracer) and generalized to the stateful Cyclops "The Wine" via an `fx` escape hatch.**

## Performance

- **Duration:** ~20 min (coding + verification)
- **Started:** 2026-07-25T20:55Z (approx., first task commit)
- **Completed:** 2026-07-25T21:00Z
- **Tasks:** 3 (all `type="auto"`/`type="tracer"`, no checkpoints hit)
- **Files modified:** 1 (`index.html`)

## Accomplishments
- Added `CONFIG.fx`, the labelled shared payoff-magnitude palette (EFFECT-04) — `tiny`/`small`/`penalty` — that every converted beats `d:{...}` cell now references instead of a bare integer literal.
- Added `resolveEffect(p, scene, verb, bone, env)`: the single generic resolver. It checks `scene.beats[verb][bone]` first (applying an optional `fx` state-mutation hatch, then `d` via the unchanged `applyDeltas`, then reading `tell`), falls back to a scene's existing `reskin[verb]` closure, and finally falls back to `LAND_TABLE`/`SEA_TABLE` — so every unconverted scene (Cyclops's other two scenes, Sirens, Lotus, all anchors) keeps working exactly as before.
- Added `narrate(p, verb, env, bone, tell, applied)`: the single place a ship's-log sentence is assembled (name, verb word, die face, mechanical fragment, then the story `tell`), replacing the ad hoc inline string-building at the old actPhase reveal-loop branch.
- Replaced actPhase's inline `if(scene.reskin...) else table[...]` branch with a single `resolveEffect()`/`narrate()` call site.
- Converted Helios "The Meadow" (the tracer) to a full `beats` table (dare/abide/give x 1/3/4/6), numerically identical to the old `mkHeliosDare()`/`LAND_TABLE` path, with new one-sentence story beats per cell.
- Added `validateBeats()`: walks every scene that declares `beats`, asserts all four faces are present and well-formed per verb, and fails loud (console.error + on-screen `l-bad` + throw) on any gap — closing Pitfall 10 (silent no-op cells). Scenes with no `beats` field are informational, not a failure. Invoked at the top of `runGame()`, before `dealJourney()`.
- Converted Cyclops "The Wine" (a genuinely stateful scene) to `beats` using the new `fx` escape hatch to preserve `state.ep.drunk`/`state.ep.progress` mutation, proving the resolver generalizes beyond flat deltas; `collectiveCheck`/`polyphemusHunger` untouched.
- Verified throughout via a scratchpad-only headless Node harness (no browser available in this environment) across 32+ distinct seeds: zero behavior regressions, deterministic same-seed reruns, and the fail-loud validator path confirmed by deliberately deleting a cell.

## Task Commits

Each task was committed atomically:

1. **Task 1: Beats data model + resolveEffect + narrate, wired end-to-end through Helios "The Meadow"** - `a6412a4` (feat)
2. **Task 2: Coverage validator (validateBeats) that fails loud on missing/dead cells** - `10dceb6` (feat)
3. **Task 3: Escape-hatch generalization + single labelled CONFIG payoff convention** - `4731e26` (feat)

**Plan metadata:** (this commit, made after this SUMMARY)

## Files Created/Modified
- `index.html` - Added `CONFIG.fx`; added `resolveEffect`/`narrate`/`validateBeats`; rewired `actPhase`'s reveal loop; converted Helios "The Meadow" and Cyclops "The Wine" scene objects onto the `beats` data model.

## Decisions Made
- CONFIG.fx introduced in Task 1 rather than deferred to Task 3 (plan-sanctioned: "it is acceptable to reference... a new labelled magnitude palette introduced here").
- `resolveEffect` returns a `logged` flag so `actPhase` skips a second `narrate()`/`log()` call for scenes still served by an existing `reskin` closure (which already self-logs) — required to keep unconverted scenes' output unchanged and avoid duplicate log lines.
- Removed the `reskin` field from the two scenes converted this plan (Meadow, Wine) since `beats` is checked first and a fully-covered beats table makes the old `reskin` for those two scenes unreachable dead code; `mkHeliosDare()` itself is untouched and still used by Helios's still-unconverted Hunger/Reckoning scenes.
- `narrate()` always logs with class `l-act`, matching the exact class the old generic table-fallback branch already used unconditionally — a deliberate simplification over trying to infer good/bad coloring from a resolved delta.
- Built and used a throwaway, scratchpad-only headless Node harness (not committed to the project) to run `index.html`'s own `?seed=&auto=1&humans=0` path outside a browser, since no browser/headless-browser tooling is installed in this environment — this satisfies the plan's "verify by running the game's own transcript" requirement without adding any dependency to the repo.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Prevented double-logging when resolveEffect falls back to an existing reskin closure**
- **Found during:** Task 1 (wiring resolveEffect/narrate into actPhase)
- **Issue:** The plan's action text shows `p._delta = r.applied; log(narrate(...).html, ...)` as an unconditional pattern. Applied literally, this would call `log()` a second time for any scene still resolved via its existing `reskin[verb]` closure — those closures already call `log()` themselves (e.g. `mkHeliosDare`, `sirensReskin`, Lotus's `lotusEat`/`lotusRescue`), so every reveal on an unconverted scene would produce two log lines instead of one, breaking the acceptance criterion that "unconverted scenes... still run unchanged via the fallback" and breaking same-seed log-line-count parity.
- **Fix:** `resolveEffect` returns a `logged: boolean` flag (`true` only for the `reskin` fallback path, which already self-logs). `actPhase` only calls `narrate()`/`log()` when `!r.logged`.
- **Files modified:** index.html
- **Verification:** Headless harness across 32 seeds shows identical `LOG_LINES` counts to the pre-conversion baseline (no line-count drift from double-logging).
- **Committed in:** a6412a4 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug — double-log prevention)
**Impact on plan:** Necessary correctness fix to satisfy the plan's own acceptance criteria (identical seeded logs, unconverted scenes unchanged). No scope creep — implements exactly the "uniform {applied, tell}" contract the plan describes, with the minimal bookkeeping needed to make "uniform" actually uniform across both branches.

## Issues Encountered
- No browser, headless-browser (puppeteer/playwright), or jsdom is available in this environment, and none may be added to the repo (single self-contained `index.html`, no dependencies). Resolved by writing a small (~65-line) throwaway Node harness in the session scratchpad — outside the project — that stubs just the `document.getElementById`/`document.createElement`/`location.search` surface the game's script actually touches (confirmed via grep: no `classList`/`querySelector`/`addEventListener` usage beyond what's stubbed), extracts and runs the `<script>` body via `new Function()`, and polls `state.over` to completion. This let every `<verify>` step in the plan (seeded parity, fail-loud validation, single-cell-edit isolation, RNG discipline) be checked against a real execution of the actual file rather than static reasoning alone.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The `beats`/`resolveEffect`/`narrate`/`validateBeats`/`CONFIG.fx` engine seam is in place and proven on one simple scene (Meadow) and one stateful scene (Cyclops's Wine) — Phase 2's mass content-authoring pass has a validated pattern to extend to the remaining 5 island scenes.
- `validateBeats()` will immediately flag any incomplete beats table authored in Phase 2, before it can silently ship as a no-op cell.
- Plan 01-02 (Sequential Resolution) is next in this phase; it was not touched by this plan and its scope is unaffected.
- Known project-level blocker (unrelated to this plan, tracked since project memory `odyssey-crew-playtest-balance`): several seeds (e.g. `demo`, `beta`) still end in total-crew-death under current `CONFIG` defaults — this plan deliberately did NOT touch payoff magnitudes' relative sizes (only their CONFIG-traceability), so the balance question remains open for the later balance/retune phase, per PROJECT.md's explicit "hand-tuned payoffs replace the defaults" plan.

---
*Phase: 01-effect-engine-sequential-resolution*
*Completed: 2026-07-25*
