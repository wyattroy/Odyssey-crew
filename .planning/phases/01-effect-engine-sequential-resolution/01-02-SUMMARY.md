---
phase: 01-effect-engine-sequential-resolution
plan: 02
subsystem: game-engine
tags: [vanilla-js, single-file, deterministic-rng, turn-order-resolution]

# Dependency graph
requires:
  - phase: 01-effect-engine-sequential-resolution (plan 01)
    provides: "resolveEffect(p, scene, verb, bone, env) / narrate() / validateBeats() — the effect engine this plan routes through resolutionOrder() and canAffordDraw()"
provides:
  - "resolutionOrder(actors) — the single fixed-turn-order resolution seam (RESOLVE-03), documented and swappable, no rnd() call"
  - "canAffordDraw(d) — shared deny-not-clamp feasibility gate (RESOLVE-02) used by eatPhase, resolveEffect's beats/table paths, and the two hold-drawing reskin closures"
  - "Sequential, turn-ordered eat-phase hold resolution replacing the old simultaneous R<=H / bone lot-cast (RESOLVE-01)"
  - "Act reveal loop routed through resolutionOrder(actors); an unaffordable hold-drawing committed cell is denied whole and narrated as skipped"
affects: [phase-02-content-authoring, phase-03-balance-retune, phase-04-interactive-board]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "One isolated resolutionOrder(actors) seam (ascending seat id, no rnd()) governs BOTH eatPhase's hold spend and actPhase's reveal order — swap only this function for a future favor-weighted/turn-chip scheme"
    - "One shared canAffordDraw(d) gate: any code path about to spend from the shared hold checks affordability BEFORE calling applyDeltas/fx, and denies the whole cell (no partial application) rather than letting applyDeltas's Math.max(0,...) clamp shrink a draw"

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "Extended canAffordDraw() beyond resolveEffect's beats/table-fallback paths into the two reskin closures that also draw directly from the hold (mkHeliosDare's crew:-1 dare-1 penalty, and Cyclops 'The Stake' give-wine's state.hold--) — the plan's read_first scoped Task 1 to resolveEffect/applyDeltas, but the must_haves and STRIDE T-01-04 mitigation describe the never-partially-applied guarantee generically ('a committed shared-resource draw'), and both closures were silently partial/no-op-but-narrated-as-success before this change (Rule 2: missing critical functionality — leaving them unguarded would have kept exactly the silent-partial-draw bug RESOLVE-02 exists to close, just in two other call sites)"
  - "Denied-cell narration in actPhase logs with class 'l-bad' (overriding narrate()'s otherwise-fixed 'l-act' class from plan 01) so a hold denial is visually distinct in the ship's-log, matching eatPhase's existing 'l-bad' convention for a missed meal — narrate()'s signature/behavior itself is untouched"
  - "pickLowest() deleted outright (not retained-unused) — grep-confirmed it had exactly one caller (the removed eat-phase lot-cast branch) before deletion"
  - "Task 2's scope was verification-only plus one code comment (the RNG-synchronous-reducer invariant at makeRng()); no additional resolution logic changed, so it is a single small doc-only commit after Task 1's behavioral commit"

requirements-completed: [RESOLVE-01, RESOLVE-02, RESOLVE-03]

coverage:
  - id: D1
    description: "Eat-phase hold shortfall resolves by iterating resolutionOrder(holdReachers) and spending state.hold one ration at a time; a denied reacher misses (turn skipped), never partially fed, never decided by a bone lot-cast (pickLowest retired)"
    requirement: "RESOLVE-01"
    verification:
      - kind: other
        ref: "headless harness (scratchpad, not committed): seed 'sweep1' — '2 sailors reach for the hold (🛢️ 1)' → P1 (earlier turn order) draws the last ration → P2 (later) denied with 'reaches for the hold, but it has already run dry'; ~40+ additional seeded sweeps ('sweep1'..'sweep60') all show the same fed-earlier/denied-later pattern on every multi-reacher shortfall, never a partial feed"
        status: pass
      - kind: other
        ref: "grep -q 'function resolutionOrder(' index.html && ! grep -q 'function pickLowest(' index.html"
        status: pass
    human_judgment: false
  - id: D2
    description: "resolutionOrder(actors) is a single documented, swappable, deterministic (no rnd()) seam governing both eatPhase and the Act reveal loop; an Act cell whose hold draw would overdraw the hold is denied whole (fx and applyDeltas both skipped) and narrated as skipped, via the shared canAffordDraw(d) gate applied in resolveEffect's beats/table-fallback paths and in the two hold-drawing reskin closures"
    requirement: "RESOLVE-02, RESOLVE-03"
    verification:
      - kind: other
        ref: "headless harness, seed 'sweep1': 'P4 gives 🎲6 → denied — hold empty. The hold has nothing left to give...' and multiple 'P1 fishes for a monster 🎲3 → denied — hold empty...' lines; 60-seed sweep shows the Act-path denial firing in all 60 seeds with zero engine errors"
        status: pass
      - kind: other
        ref: "code review: resolutionOrder(actors) contains no rnd() call; canAffordDraw(d) is the single feasibility predicate used by resolveEffect (beats + table-fallback), mkHeliosDare, and Cyclops Stake's give closure"
        status: pass
    human_judgment: false
  - id: D3
    description: "Determinism and seed-safety hold after the resolution change: identical ?seed= reproduces an identical ship's-log; the 0-human seeded run still completes to a winner; a hostile/malformed/empty ?seed= completes without crashing; #seedTag stays textContent-only; validateBeats regression (fail-loud on a deliberately broken cell) is intact"
    requirement: "SC5"
    verification:
      - kind: other
        ref: "headless harness: seed 'sweep1' run twice produces a byte-identical ship's-log (diff clean) both before and after Task 2's RNG-seam comment; 60-seed sweep ('sweep1'..'sweep60') plus the original 6-seed set from plan 01 (demo/seed1/seed2/alpha/beta/gamma) all reach GAME_OVER with a determinable winner and zero UNHANDLED/SYNCHRONOUS errors"
        status: pass
      - kind: other
        ref: "headless harness against empty string, '%%%%%%%%%%%%unicode-and-symbols', and an emoji seed ('🎲🎲🎲💀☠️') — all reach GAME_OVER without crashing; grep confirms #seedTag is set only via .textContent (never innerHTML)"
        status: pass
      - kind: other
        ref: "headless harness against a copy of index.html with the Helios 'The Meadow' dare/face-6 beats cell deleted: validateBeats logs 'BEATS VALIDATION FAILED' + throws + the game never reaches GAME_OVER (halts loud) — regression from plan 01 intact"
        status: pass
    human_judgment: false

duration: ~12min
completed: 2026-07-25
status: complete
---

# Phase 01 Plan 02: Sequential Turn-Ordered Resolution Summary

**Replaced the eat-phase's simultaneous bone-lot-cast hold shortfall with a single `resolutionOrder()` fixed-turn-order seam and a shared `canAffordDraw()` deny-not-clamp gate that both `eatPhase` and the Act reveal loop now spend the shared hold through — an unaffordable committed draw is denied whole, never partially applied, never decided by chance.**

## Performance

- **Duration:** ~12 min (coding + verification)
- **Started:** 2026-07-25T21:02Z (approx.)
- **Completed:** 2026-07-25T21:14Z
- **Tasks:** 2 (both `type="auto"`, no checkpoints hit)
- **Files modified:** 1 (`index.html`)

## Accomplishments
- Added `resolutionOrder(actors)`: the single, isolated, documented v1.1 fixed-turn-order seam (ascending seat id) that governs the order both `eatPhase`'s hold resolution and `actPhase`'s reveal loop resolve committed actions against the shared hold — swap only this function for a future favor-weighted/turn-chip scheme; it contains no `rnd()` call.
- Added `canAffordDraw(d)`: the single "deny, never partially apply" feasibility gate. Used in `resolveEffect`'s beats and table-fallback paths (before `fx`/`applyDeltas`) and, since the same never-partially-applied guarantee applies to every path that draws from the hold, also in the two reskin closures that draw directly from the hold (`mkHeliosDare`'s LAND_TABLE dare-1 penalty, Cyclops "The Stake" give-wine).
- Rewrote `eatPhase`'s hold-reacher block: iterates `resolutionOrder(holdReachers)` and spends `state.hold` one ration at a time; a reacher who finds the hold already dry is denied and skipped (`miss(p)`) with a "hold ran dry" narration — never partially fed. Removed the `R<=H` branch, the `throwBone()` lot rolls, and `pickLowest`-based loser selection.
- Deleted `pickLowest` entirely (grep-confirmed no remaining caller after removing the eat-phase lot-cast branch).
- Routed the Act reveal loop through `resolutionOrder(actors)` and wired the same `canAffordDraw` gate into `resolveEffect` so a committed cell whose net hold draw would overdraw the hold is denied whole (no `applyDeltas`, no `fx`) and narrated with an `l-bad` denial line, instead of `applyDeltas`'s prior `Math.max(0, ...)` clamp silently shrinking the draw.
- Documented the RNG-synchronous-reducer invariant with a comment at the `makeRng()` seam, restating that every `rnd()`-family call must stay inside a synchronous reducer, in fixed order, never in a click handler/timer/animation callback — verified unchanged by the resolution-order work.
- Verified end-to-end via the same scratchpad-only headless Node harness used in plan 01 (no browser available in this environment): 60+ seeded sweeps show the shortfall's fed-earlier/denied-later pattern on both eat and Act paths, byte-identical same-seed reruns, hostile/empty seeds complete without crashing, and the `validateBeats` fail-loud regression from plan 01 is intact.

## Task Commits

Each task was committed atomically:

1. **Task 1: Sequential turn-ordered hold resolution + resolutionOrder seam** - `bde1aac` (feat)
2. **Task 2: Determinism, edge-case, and threat verification pass** - `85892ab` (docs)

**Plan metadata:** (this commit, made after this SUMMARY)

## Files Created/Modified
- `index.html` - Added `resolutionOrder`/`canAffordDraw`; rewrote `eatPhase`'s hold shortfall resolution; retired `pickLowest`; routed `actPhase`'s reveal loop and `resolveEffect` through the new feasibility gate; patched `mkHeliosDare` and Cyclops "The Stake" give-wine to use the shared gate; added an RNG-seam invariant comment.

## Decisions Made
- Extended `canAffordDraw()` to the two reskin closures that draw directly from the hold outside `resolveEffect` (`mkHeliosDare`, Cyclops "The Stake" give-wine) — see key-decisions in frontmatter for the Rule 2 rationale (both were silently partial/no-op-but-narrated-as-success before this change, which is exactly the bug RESOLVE-02 closes).
- Denied Act-cell narration logs with `l-bad` (overriding `narrate()`'s otherwise-fixed `l-act`) at the `actPhase` call site only, so denial is visually distinct without touching `narrate()`'s signature/behavior from plan 01.
- `pickLowest` deleted outright rather than retained-unused, since grep confirmed zero remaining callers.
- Recorded seed `sweep1` in the coverage block above as the reproducible two-reacher/one-ration shortfall case (both the eat-phase and Act-phase denial patterns appear in this single seed's transcript).

## Deviations from Plan

None - plan executed exactly as written, with one Rule 2 addition documented above (extending `canAffordDraw` to `mkHeliosDare` and Cyclops "The Stake" give-wine, beyond the `resolveEffect` beats/table paths the plan's read_first pointed to) to keep the "never partially applied" guarantee uniform across every hold-drawing path, not just the ones routed through `resolveEffect`.

## Issues Encountered
None - the same scratchpad-only headless Node harness built in plan 01 (not committed to the repo, per the project's zero-dependency constraint) was reused directly for this plan's verification.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The `resolutionOrder()`/`canAffordDraw()` seam is in place and proven across both the eat phase and the Act reveal loop; Phase 2's content-authoring pass and any future favor-weighted/turn-chip resolution scheme need only touch `resolutionOrder()` itself.
- Determinism, hostile-seed safety, and the `validateBeats` fail-loud regression are all confirmed intact after this RNG-stream-altering change.
- Known project-level blocker (unrelated to this plan, tracked since project memory `odyssey-crew-playtest-balance`): the hold economy under current `CONFIG` defaults still produces frequent shortfalls and total-crew-death across most seeds swept during verification (e.g. seed `demo`, and the majority of `sweep1`-`sweep60`) — this plan deliberately did NOT retune payoff magnitudes (only changed HOW a shortfall resolves, not how often one occurs); the balance question remains open for Phase 3's hand-tuned-payoffs pass, per PROJECT.md.
- Phase 01 (effect-engine-sequential-resolution) is now complete — both plans (01-01 beats/resolver/validator, 01-02 sequential resolution) executed.

## Self-Check: PASSED

- FOUND: index.html
- FOUND: bde1aac (Task 1 commit)
- FOUND: 85892ab (Task 2 commit)

---
*Phase: 01-effect-engine-sequential-resolution*
*Completed: 2026-07-25*
