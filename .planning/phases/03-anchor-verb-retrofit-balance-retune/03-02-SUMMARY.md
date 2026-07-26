---
phase: 03-anchor-verb-retrofit-balance-retune
plan: 02
subsystem: game-economy
tags: [vanilla-js, single-file, deterministic-rng, headless-vm-testing]

# Dependency graph
requires:
  - phase: 03-anchor-verb-retrofit-balance-retune
    provides: "03-01's two-verb/one-currency economy tracer — CONFIG.econ/CONFIG.divine, crewFavor()/seasExtraBlue()/doomFloor()/blessFloor(), econcheck.mjs/parity.mjs/sweep.mjs"
provides:
  - favorRevive(dead, payer, toll) — the single toll-payment path (self-pay reads as Charon, crewmate-pay reads as Orpheus)
  - revivalRound(atHades) — generalized, callable from any beat, RNG-free, resolutionOrder()-driven two-pass revival
  - deadEndCheck() rewritten around favor bankruptcy as the sole permanent end, always resolving to THE VERDICT
  - CONFIG.charon (toll/hadesToll) replacing the single charonToll
  - fullCrewBonus()/CONFIG.crossing.fullCrewAt+fullCrewWhiteBonus — the keep-the-crew-whole crossing incentive
  - doomFloor()/blessFloor() anti-spiral guard documented in-file as deliberate ECON-04 behavior
affects: [03-03-cyclops-lotus-reauthor, 03-04-sirens-reauthor, 03-05-anchor-retrofit, 03-06-board-update, 03-07-balance-retune]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "favorRevive(dead, payer, toll) — the ONE function that ever debits a favor toll to return a sailor; every call site (self-pay, Orpheus, favor-bankruptcy rescue) routes through it"
    - "revivalRound(atHades) — RNG-free, resolutionOrder()-driven, short-circuits to a no-op when deadPl() is empty; callable from any beat without pacing cost to a healthy voyage"
    - "fullCrewBonus() — pure read of livingCount()/CONFIG.crossing, only ever ADDS white marbles, never removes/adds blue — composes with (never replaces) seasExtraBlue()'s low-favor blue-salting"

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "CONFIG.charon = {toll:1, hadesToll:1} (Claude's Discretion, tuned later in 03-07) — a distinct at-Hades modifier is exposed per the plan's ask, currently equal to the general toll."
  - "CONFIG.crossing.fullCrewAt = 3 (not 4): read as 'near-full' (3 or 4 of 4 seats living) per D-07's own framing ('a near-full crew draws shorter, safer crossings'), not full-crew-only."
  - "revivalRound() is called at the top of every island scene and every sea leg (before eatPhase), plus unchanged at Hades (now with the at-Hades toll) and inside deadEndCheck() for the whole-crew-dead case — one shared path, four call sites, no bespoke toll logic anywhere else."

patterns-established:
  - "Pattern: a favor toll debit is NEVER hand-rolled at a call site — every revival narrows to calling favorRevive(dead, payer, toll), so a future anchor/island that wants to grant a life back has exactly one function to call."
  - "Pattern: a crew-size incentive is expressed as a bag-composition BONUS (extra white only), never as a bag-composition PENALTY (no extra blue) — the anti-spiral shape that keeps a thin crew no worse than baseline."

requirements-completed: [ECON-03, ECON-04]

coverage:
  - id: D1
    description: "Generalized favor-revival: a dead player may pay Charon's toll to return on their own turn at any beat (not only Hades); if bankrupt, each living crewmate in turn may pay on their behalf (generalized Orpheus); every toll debit routes through one favorRevive() function"
    requirement: "ECON-03"
    verification:
      - kind: unit
        ref: "node scratchpad/econcheck.mjs"
        status: pass
      - kind: integration
        ref: "node scratchpad/harness.mjs --seed demo (+4 more seeds: alpha, beta, gamma, delta)"
        status: pass
      - kind: integration
        ref: "node scratchpad/parity.mjs --seed demo"
        status: pass
      - kind: integration
        ref: "transcript inspection across 40 sweep seeds: mid-voyage self-pay revival away from Hades (e.g. seed sweep-5, sweep-7), crewmate-funded Orpheus raises away from Hades, and explicit favor-bankruptcy lines each immediately followed by a THE VERDICT block"
        status: pass
    human_judgment: false
  - id: D2
    description: "Favor bankruptcy (not starvation) is the one permanent end, and it always resolves to a verdict rather than a stall"
    requirement: "ECON-03"
    verification:
      - kind: integration
        ref: "node scratchpad/sweep.mjs 40 — errors/incomplete: 0, no-winner: 0 (every seed, including the 7 favor-bankrupt ones, reaches THE VERDICT)"
        status: pass
    human_judgment: false
  - id: D3
    description: "A near-full living crew earns extra white marbles (shorter, safer crossings); crew count only ever adds white, never blue, so a thin crew is never composed a worse bag than baseline"
    requirement: "ECON-04"
    verification:
      - kind: unit
        ref: "node scratchpad/econcheck.mjs"
        status: pass
      - kind: integration
        ref: "code inspection of startCrossing()/fullCrewBonus(): the crew-count loop only ever pushes 'white'; transcript grep across 40 sweep seeds confirms the 'hands at the oars... extra white' line fires when living crew >= 3"
        status: pass
    human_judgment: false
  - id: D4
    description: "The living-crew count and current bag advantage/disadvantage are visible on the board during a crossing, in an actual browser"
    verification: []
    human_judgment: true
    rationale: "No live browser is available in this headless sandbox (same documented constraint as 03-01's D4 coverage item). Substituted evidence: code review of renderStrip()'s crossing card (reads fullCrewBonus()/seasExtraBlue()/livingCount() fresh every render, BOARD-07-compliant) plus headless transcript confirmation that the underlying log lines fire correctly. A human or orchestrator browser pass at http://localhost:8777/?seed=demo&auto=1&humans=0&speed=550 is still owed to visually confirm layout."
  - id: D5
    description: "The sweep's balance direction (all-dead rate, mean survivors) after generalized revival + keep-the-crew-whole, measured against the 03-01 post-tracer baseline"
    verification:
      - kind: integration
        ref: "node scratchpad/sweep.mjs 40 (see Deviations — this is a KNOWN, DOCUMENTED partial miss, not a silent gap)"
        status: fail
    human_judgment: true
    rationale: "The plan's acceptance bar requires the all-dead rate to be strictly LOWER than the 03-01 baseline (0%, an artifact of the old engine's silent permanent-population-culling — see Deviations). Post-Task-1+2, mean survivors and full-crew-survival both improved (2.4→2.6, 7→17 of 40), but all-dead is 18% (7/40), not lower than 0%. This is flagged for a human/03-07 balance-retune decision rather than papered over."

# Metrics
duration: 55min
completed: 2026-07-26
status: complete
---

# Phase 3 Plan 2: Favor-as-Lifeline Revival & Keep-the-Crew-Whole Summary

**Generalized favor-revival (favorRevive/revivalRound, callable from any beat) shifts the permanent-loss condition to favor bankruptcy, and a near-full crew now earns a shorter-crossing bonus — but a pre-existing hold-economy fragility, previously masked by the old engine's silent permanent culling of unaffordable corpses, now surfaces as an 18% all-dead rate that 03-07's balance retune must address.**

## Performance

- **Duration:** ~55 min
- **Started:** 2026-07-26T19:20:00Z (approx, following 03-01 session close)
- **Completed:** 2026-07-26T20:15:00Z (approx)
- **Tasks:** 2 (both `type="auto"`, no checkpoints)
- **Files modified:** 1 (index.html)

## Accomplishments

- Extracted `favorRevive(dead, payer, toll)` as the single place a favor toll buys a life back — self-pay reads as Charon, crewmate-pay reads as Orpheus; checks affordability, debits the payer, resurrects the dead player (satchel reset, lotus flag cleared), and logs a line naming who paid. Every toll debit in the file (previously duplicated across `runHades`'s hand-rolled loop and `deadEndCheck`'s bespoke auto-Charon branch) now routes through this one function (T-03-06).
- Rewrote `revivalRound(atHades)` to be callable from any beat, not Hades-only: a cheap, RNG-free no-op when nobody is dead; otherwise a two-pass, `resolutionOrder()`-driven round (self-pay, then Orpheus-style crewmate-pay stopping at the first payer). Bots decide silently through `botDecide`; humans go through `askHuman` behind the existing `passGate`/director-mode gate — no second masking path (Pitfall 2, T-03-08).
- Added revival call sites at the top of every island scene (`runIsland`) and every sea leg (`runCrossing`), both before `eatPhase` so a returning sailor can eat and act that same beat. `runHades` now reduces to the peek plus the same shared round (with the at-Hades toll).
- Rewrote `deadEndCheck()` around favor bankruptcy: it still returns false while anyone lives; when nobody lives, it runs the same `revivalRound()` (no bespoke toll logic), and only if the crew is still entirely dead afterward does it log an explicit favor-bankruptcy line and finish the game. This is now documented in-code as the sole permanent end.
- Replaced `CONFIG.charonToll` with `CONFIG.charon = {toll:1, hadesToll:1}` and updated every reader (`askHuman`'s revive/orpheus branches, `botDecide`'s revive/orpheus branches); updated prompt copy to name favor as simultaneously the win condition, the lifeline, and the seas' mood.
- Added `CONFIG.crossing.fullCrewAt`/`fullCrewWhiteBonus` and `fullCrewBonus()`: a near-full living crew (3 or 4 of 4) salts extra WHITE marbles into the crossing bag — never blue — composing with (not replacing) 03-01's low-favor blue-salting. `startCrossing()` logs the bonus in the crew's own voice; `drawMarble()` is untouched, no RNG added.
- Extended `renderStrip()`'s crossing card to surface the living-crew count and the current bag advantage/disadvantage (full-crew bonus and/or low-favor salting), read fresh from state every render (BOARD-07).
- Documented `doomFloor()`/`blessFloor()`'s per-living-mate scaling in-file as the deliberate ECON-04 anti-spiral guard, warning a future tuner against "simplifying" it to an absolute threshold.

## Task Commits

1. **Task 1: Generalise favor-revival** - `7d8053f` (feat)
2. **Task 2: Keep the crew whole** - `9f4535f` (feat)

**Plan metadata:** (this commit, docs: complete 03-02)

## Files Created/Modified

- `index.html` - `favorRevive()`/`revivalRound()`/rewritten `deadEndCheck()`; `CONFIG.charon`; new `revivalRound()` call sites in `runIsland`/`runCrossing`; `fullCrewBonus()`/`CONFIG.crossing.fullCrewAt`+`fullCrewWhiteBonus`; `startCrossing()` bonus logging; `renderStrip()` crossing-card fullness line; `doomFloor()`/`blessFloor()` anti-spiral comment.

## Decisions Made

- **CONFIG.charon = {toll:1, hadesToll:1}** (Claude's Discretion, per 03-CONTEXT.md — tuned later in 03-07): a distinct at-Hades modifier is exposed per the plan's explicit ask, currently equal to the general toll pending 03-07's numeric pass.
- **CONFIG.crossing.fullCrewAt = 3, not 4:** read as "near-full crew" (3 or 4 of the fixed 4 seats living) matching D-07's own framing, rather than requiring the crew to be perfectly whole before any bonus applies.
- **`deadEndCheck()` calls `revivalRound()` with no `atHades` argument** (uses the general toll, not the Hades one) since a whole-crew-dead check can fire at any beat, not just at the Hades stop.

## Deviations from Plan

### Auto-fixed Issues

None — both tasks implemented as specified without needing a Rule 1/2/3 auto-fix.

### Documented Gaps

**1. [Environment limitation, matches 03-01 precedent] No live browser available for Task 2's board screenshot verification**
- **Found during:** Task 2 (`<browser>` verification step)
- **Issue:** This sandboxed execution environment has no browser (same documented constraint as 03-01's Task 5 deviation). Task 2's browser check calls for opening `http://localhost:8777/?seed=demo&auto=1&humans=0&speed=550` and screenshotting a crossing to confirm the bag composition and the living-crew-count/bonus line.
- **Substituted evidence:** Code review of `renderStrip()`'s crossing card (confirms it reads `fullCrewBonus()`/`seasExtraBlue()`/`livingCount()` fresh on every call, BOARD-07-compliant, no cached transient) plus headless transcript grep across all 40 sweep seeds confirming the underlying "hands at the oars… extra white" log line fires whenever living crew ≥ 3.
- **Files modified:** none (verification-only).
- **Committed in:** n/a — tracked as coverage item D4 (`human_judgment: true`) for a human/orchestrator browser pass to close out later.

**2. [Measured, not silently accepted] `sweep.mjs 40`'s all-dead rate did not drop below the 03-01 baseline — it rose, then partially recovered**
- **Found during:** Task 1's own `<verify>` gate, then re-measured after Task 2.
- **What was measured:** Task 1 alone (generalized revival, before the Task 2 crossing bonus): all-dead rose from the 03-01 baseline's 0% to 25% (10/40), while full-crew survival nearly doubled (7→16/40) and mean survivors held flat (2.4). After Task 2 (the keep-the-crew-whole crossing bonus): all-dead fell to 18% (7/40), full-crew survival rose further to 17/40, and mean survivors rose to 2.6 (up from the 03-01 baseline's 2.4, satisfying Task 2's own "higher than post-Task-1" and "higher than 03-01 baseline" acceptance bullets) — but all-dead is still ABOVE the 03-01 baseline's 0%, not below it.
- **Root cause (verified by transcript inspection, e.g. seeds sweep-5/sweep-7):** the 03-01 baseline's 0% all-dead figure is an artifact of the OLD `deadEndCheck()`'s bespoke auto-Charon branch, which — when the whole crew died — silently and PERMANENTLY excluded any corpse who couldn't self-fund the toll from the rest of the game (no crewmate rescue, no further chances until the single Hades stop). That silently shrinks the crew's food demand for the remainder of the voyage, which is precisely what let the surviving remainder stabilize a chronically-thin hold economy — it wasn't genuine robustness, it was population loss masking a pre-existing hold fragility (the same "default constants produce a hold-economy collapse" issue tracked in STATE.md's Blockers/Concerns and the project's `odyssey-crew-playtest-balance` memory). Once revival is generalized and genuinely available everywhere (as ECON-03 requires), previously-culled corpses keep returning to an already-insufficient hold, and — for a handful of seeds where the hold never recovers (every living player simultaneously starving means `actingPl()` is empty, so nobody can Abide to refill it) — the crew cycles through repeated die→revive→die tolls until favor bankruptcy. This is the intended mechanical shift (D-06: "the permanent-death condition shifts from starvation to favor bankruptcy... a CHOICE the crew makes"), but it is not yet fully offset by a correspondingly-retuned hold economy.
- **Why not fixed here:** every CONFIG surface this plan is scoped to touch (`CONFIG.charon`, `CONFIG.crossing.fullCrewAt`/`fullCrewWhiteBonus`) has been tuned within reason (see Decisions above) and Task 2's bonus already measurably improved the picture (25%→18% all-dead, mean survivors 2.4→2.6). Fully closing the gap to 0% would require retuning `CONFIG.holdStart`/`CONFIG.econ`'s hold-contribution magnitudes — numbers this plan's own frontmatter and 03-01's summary explicitly reserve for 03-07 ("03-07 tunes these; this plan only sets the shape"). Forcing a deeper economy rebalance here would be scope creep into 03-07's stated job and risks destabilizing numbers 03-03/03-04/03-05 will build on.
- **Disposition:** tracked as coverage item D5 (`human_judgment: true`, status `fail`) rather than silently marked passing. Flagged explicitly for 03-07 below.
- **Committed in:** n/a — measurement/documentation only, no additional code change beyond the two task commits above.

---

**Total deviations:** 0 auto-fixed; 2 documented gaps (1 environment limitation matching prior precedent, 1 measured balance shortfall flagged for 03-07 rather than papered over).
**Impact on plan:** The mechanism itself (favorRevive/revivalRound/deadEndCheck/fullCrewBonus) is implemented exactly as specified and passes every structural/determinism/completion gate (econcheck, harness ×5 seeds, parity, sweep exits 0 with zero errors/incomplete/no-winner). The one unmet acceptance bullet is a balance-direction target that depends on hold-economy magnitudes explicitly out of this plan's scope.

## Issues Encountered

- See Deviation #2 above for the full root-cause analysis of the sweep's all-dead rate. In short: generalized revival, as specified, is working correctly — it is surfacing a pre-existing hold-economy fragility that the old engine's mechanism was silently (and unintentionally) masking via permanent population culling. No code defect found; this is a genuine balance-tuning gap for 03-07.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 03-03 (Cyclops/Lotus thematic re-authoring) and 03-04 (Sirens thematic re-authoring) can proceed independently of this plan's revival/crossing-bonus mechanics — neither island touches `favorRevive`/`revivalRound`/`fullCrewBonus` directly.
- 03-05 (anchor retrofit) and 03-06 (board update) should be aware that `revivalRound()` now fires at the top of every island scene and every sea leg (not just Hades) — any new anchor beat that wants revival-adjacent behavior should call `revivalRound()` rather than hand-rolling a toll.
- **Concern for 03-07 (balance retune), flagged explicitly:** the post-Task-2 `sweep.mjs 40` numbers below should be treated as this plan's baseline for 03-07's work, alongside 03-01's. 03-07 needs to retune the hold economy (`CONFIG.holdStart` and/or `CONFIG.econ`'s hold-contribution magnitudes) so that a crew's aggregate favor reserve can sustain the now-persistent revival demand without a subset of seeds cycling into unrecoverable favor bankruptcy. The specific failure mode to design against: a whole-living-crew-simultaneously-starving state makes `actingPl()` empty (no one can Abide to refill the hold), so the hold cannot recover on its own — 03-07 should verify this scenario resolves before calling the retune complete.
  ```
  === BALANCE SWEEP: 40 seeds (0-human auto), post-03-02 Task 1+2 ===
  errors/incomplete: 0
  no-winner / incomplete: 0
  ALL-DEAD (death-spiral): 7 (18%)          [03-01 baseline: 0 (0%) — see Deviations for why this baseline was an artifact]
  ≥1 survivor (reached Ithaca alive): 33 (83%)
  full crew (4) survived: 17 (43%)          [03-01 baseline: 7 (18%)]
  survivor-count distribution: {"0":7,"1":3,"2":4,"3":9,"4":17}
  mean survivors: 2.6                        [03-01 baseline: 2.4]
  seeds with ≥1 death: 40 (100%)             [03-01 baseline: 39 (98%)]
  winner favor — min/avg/max: 0/8.5/20
  favor spread (distinct winner favors): 0,5,6,7,8,9,10,11,12,13,14,15,17,20 (14 distinct)
  by temperament (alive-rate | avg favor):
    greedy: 65% alive | favor -2.5           [03-01 baseline: 43% alive | favor -1.8]
    balanced: 65% alive | favor 3.2          [03-01 baseline: 65% alive | favor 4.9]
    pious: 70% alive | favor 6.8             [03-01 baseline: 68% alive | favor 9.9]
  ```
- Transcript evidence collected (available via `node scratchpad/harness.mjs --seed <s>` or the sweep debug harness) for: mid-voyage self-pay revival away from Hades, crewmate-funded Orpheus raises away from Hades, and every favor-bankruptcy ending followed immediately by THE VERDICT — satisfying Task 1's transcript-evidence acceptance bullets.

## Self-Check: PASSED

All modified files verified present on disk (index.html, this SUMMARY.md). Both task commit
hashes (7d8053f, 9f4535f) verified present in `git log --oneline --all`.

---
*Phase: 03-anchor-verb-retrofit-balance-retune*
*Completed: 2026-07-26*
