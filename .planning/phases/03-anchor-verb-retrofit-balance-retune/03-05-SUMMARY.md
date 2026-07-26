---
phase: 03-anchor-verb-retrofit-balance-retune
plan: 05
subsystem: game-economy
tags: [vanilla-js, single-file, deterministic-rng, headless-vm-testing]

# Dependency graph
requires:
  - phase: 03-anchor-verb-retrofit-balance-retune
    provides: "03-01's econD()/CONFIG.econ tracer, 03-02's generalized revivalRound()/favorRevive() (callable from any beat), and the consolidated FAVOR LAW block 03-04 wrote — all landed ahead of this plan"
provides:
  - "New top-level ANCHORS object — declarative scene data shaped exactly like an EPISODES entry's scenes[] (name/hook/verbs/beats), consumed by the SAME resolveEffect()/narrate()/stakesLine() path with zero special-casing"
  - "ANCHORS.hades.scenes[0] 'The Rites': Abide observes the rites (plain econD abide shape + CONFIG.hades.riteHold kicker — plays the FAVOR LAW straight, no exception needed); Dare presses the shades for deeper sight via the fx escape hatch, calling the new shared revealNextIsland() helper"
  - "ANCHORS.phaeacia.scenes[0] 'The Court': Abide accepts hospitality graciously (xenia — CONFIG.phaeacia.xeniaGift kicker); Dare boasts for a bigger personal gift (CONFIG.phaeacia.courtGiftBonus) or suffers a xenia-breach (CONFIG.phaeacia.breachFavorExtra)"
  - "validateBeats() extended to walk ANCHORS alongside EPISODES under the identical coverage/verb-set/currency-vocabulary gate (ANCHOR-04)"
  - "revealNextIsland() — the ONE shared helper both the bespoke Tiresias peek and the Hades Dare fx call, so a successful Dare composes with (rather than duplicates) the peek's own reveal"
  - "runHades() restructured: verb scene (actPhase) -> Tiresias peek -> revivalRound(true), bespoke mechanics unchanged beneath"
  - "runPhaeacia() restructured into 4 stages: Welcome (unchanged) -> The Court (NEW) -> The Song (unchanged, favor-weighted/gifts-only) -> the gift-ride (unchanged)"
  - "New CONFIG.hades = {riteHold, direFavorExtra}; extended CONFIG.phaeacia with {xeniaGift, courtGiftBonus, breachFavorExtra}"
affects: [03-06-board-update, 03-07-balance-retune]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pattern: an anchor's verb scene is authored as ANCHORS.<id>.scenes[0], shaped identically to an island's scenes[] entry, and run through the SAME actPhase()/resolveEffect() call every island uses — the anchor's own bespoke mechanics (peek, revival, gift pool) stay entirely OUTSIDE the scene, called before/after it rather than merged into it (Pitfall 9)."
    - "Pattern: a shared reveal-the-next-hidden-island helper (revealNextIsland()) is called from BOTH the bespoke Tiresias peek and a beats cell's own fx — since the verb scene runs before the peek, composing the two calls in sequence produces 'deeper sight' (two islands revealed instead of one) with no special-casing of 'extra' anywhere."
    - "Pattern: a beat that has no scenes[] loop of its own (Hades/Phaeacia, unlike an island's runIsland()) still emits its own logBeat()/scene-hook narration lines immediately before calling actPhase(), matching the coverage and narration shape a real island scene gets for free from runIsland()'s loop."

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "Hades' Abide plays the FAVOR LAW straight (plain econD abide shape + a named CONFIG.hades.riteHold hold kicker) — NO flagged exception was needed. The plan explicitly permitted a favor-only Abide as a flagged exception if a hold gain read as unthematic for the shore of the dead; 'the dead point out what the ship overlooked' reads naturally as a hold contribution, so the default (same law as every island) was used."
  - "Hades' Dare glimpse is delivered through `fx` (a call to revealNextIsland()), NOT through `d` — `d` still carries the standard econD('dare',0,face) shape (dareStash on 3/4/6, dareCaught on 1, plus a CONFIG.hades.direFavorExtra kicker on face 1's cost) so every cell's `d` still traces to econD() per the acceptance bar, while the thematic 'sight' payoff lives in the escape hatch exactly as Lotus's rescue precedent established."
  - "Order of Hades' three phases (verb scene -> peek -> revival) was preserved EXACTLY as specified, not reordered for convenience — this is what makes a Dare's 'extra glimpse' arithmetic rather than special-cased: the scene's fx reveals whichever island is next-hidden BEFORE the peek's own identical search runs, so the peek necessarily finds a FURTHER one."
  - "Phaeacia's new Court scene is tier 1 (not tier 0) per the plan's own framing (the anchor sits late in the voyage) — CONFIG.econ.dareCaught's tier-1 table already costs favor on face 3 as well as face 1, which is why a 'half-landed' Dare-3 boast at Phaeacia costs a small amount of favor even though it isn't the breach face; this is the shared economy's own tier escalation, not a new kicker, and reads correctly thematically (a half-landed tale isn't quite free)."
  - "The Court's own favor movement is entirely separate from the unchanged Scene 3 song's favor-weighted, gifts-only bone pool — documented as a load-bearing invariant in an in-code comment above the song loop so a future tuner does not merge the two or let the pool pay favor."

patterns-established: []

requirements-completed: [ANCHOR-01, ANCHOR-02]

coverage:
  - id: D1
    description: "Hades retrofitted onto the two-verb grammar: ANCHORS.hades.scenes[0] 'The Rites' gives Abide (observe the rites, plain econD shape + riteHold kicker, plays the favor law straight) and Dare (press the shades for deeper sight via the fx-driven revealNextIsland() helper, or pay a favor cost on the low face); runHades() restructured to verb scene -> peek -> revivalRound(true), with the bespoke peek/revival mechanics unchanged beneath and validateBeats() now covering the anchor"
    requirement: "ANCHOR-01"
    verification:
      - kind: unit
        ref: "node scratchpad/econcheck.mjs"
        status: pass
      - kind: integration
        ref: "node scratchpad/harness.mjs --seed demo (+3 more seeds: alpha, beta, gamma)"
        status: pass
      - kind: integration
        ref: "node scratchpad/parity.mjs --seed demo"
        status: pass
      - kind: integration
        ref: "node scratchpad/sweep.mjs 40 (errors/incomplete: 0, no-winner: 0)"
        status: pass
      - kind: integration
        ref: "custom dev-only probe (not committed): 80-seed transcript scan confirms the ordering scene-log -> commit/reveal -> Tiresias peek in 66/80 seeds reaching Hades with at least one live actor; sample transcript recorded below"
        status: pass
      - kind: integration
        ref: "custom dev-only probe (not committed): a Dare-3/4/6 hit shows 'a further glimpse of the road ahead: <b>The Sirens</b>' (probe-0) and a later cell (once no island remains hidden) shows 'the shades have nothing further to give up; the road ahead is already known' (probe-65) — both the fire and graceful no-op paths confirmed live"
        status: pass
      - kind: integration
        ref: "custom dev-only probe (not committed): CONSTRUCTED all-dead-at-Hades case (livingCount()===0 forced immediately before runHades()) — resolves without throwing, the verb scene skips cleanly (no actor lines), the peek and revivalRound(true) both still fire, and two of the four dead sailors are revived via Orpheus in the same call; livingCount() went 0 -> 4 with no stall"
        status: pass
    human_judgment: false
  - id: D2
    description: "Phaeacia retrofitted onto the two-verb grammar: ANCHORS.phaeacia.scenes[0] 'The Court' gives Abide (accept hospitality graciously — xenia, plain econD shape + xeniaGift kicker, plays the favor law straight) and Dare (boast for a bigger personal gift — courtGiftBonus kicker on high faces, or a xenia-breach costing favor and shrinking the gift on the low face); runPhaeacia() restructured into 4 stages (Welcome -> Court -> Song -> gift-ride) with the favor-weighted, gifts-only song pool and the gift-ride completely unchanged and documented as load-bearing"
    requirement: "ANCHOR-02"
    verification:
      - kind: unit
        ref: "node scratchpad/econcheck.mjs"
        status: pass
      - kind: integration
        ref: "node scratchpad/harness.mjs --seed demo (+3 more seeds: alpha, beta, gamma)"
        status: pass
      - kind: integration
        ref: "node scratchpad/parity.mjs --seed demo"
        status: pass
      - kind: integration
        ref: "node scratchpad/sweep.mjs 40 (errors/incomplete: 0, no-winner: 0)"
        status: pass
      - kind: integration
        ref: "custom dev-only probe (not committed): full 4-stage transcript sample (probe-0, recorded below) shows Welcome -> Court commit/reveal lines -> Song bone-throws -> gift-ride, in order"
        status: pass
      - kind: integration
        ref: "custom dev-only probe (not committed): a xenia-breach sample (probe-38, 'P1 dares 🎲1 → -3🫒... the gods mark the xenia-breach') and a grace-earns-favor sample (probe-1, 'P2 abides 🎲6 → +4 hold · +1🫒... gods notice good manners') both confirmed"
        status: pass
      - kind: integration
        ref: "custom dev-only probe (not committed): CONSTRUCTED empty-living-crew case at Phaeacia (livingCount()===0 forced before runPhaeacia()) — resolves without throwing, welcome refill is +0, the Court scene skips cleanly (actPhase not even called), the Song loop iterates zero times, no gift-ride triggers; livingCount() stayed 0, tollSkipNextCrossing stayed false"
        status: pass
    human_judgment: false
  - id: D3
    description: "The two-verb court prompt with per-face stakes previews at Phaeacia, and the full Hades/Phaeacia flow (peek reveal, revival offers, court gift outcomes), confirmed visually in an actual browser"
    verification: []
    human_judgment: true
    rationale: "No live browser is available in this headless sandbox (same documented environment constraint as every prior plan in this phase — 03-01 through 03-04). Substituted evidence: stakesLine()'s existing per-face preview path (unchanged by this plan) renders both ANCHORS.hades and ANCHORS.phaeacia's scenes identically to any island's scene since their beats tables are structurally identical (no fx present on the compact-render faces that would trigger the row-per-face path, so both anchors render the COMPACT inline stakes format already proven for Helios/Cyclops); both scenes route through the same collectCommits()/passGate() masking seam every island's act phase already uses, introducing no new masking path (Pitfall 2, T-03-21). A human or orchestrator browser pass at http://localhost:8777/?seed=demo&humans=1&speed=550 is still owed to visually confirm layout — the server is already running against this exact worktree (confirmed via `lsof`), so no setup is required, only the pass itself."

# Metrics
duration: 65min
completed: 2026-07-26
status: complete
---

# Phase 3 Plan 5: Hades & Phaeacia Retrofitted onto the Two-Verb Grammar Summary

**Hades and Phaeacia now play like the islands — a real Abide/Dare scene with commit-blind/throw/reveal, resolved through the exact same shared engine — while the bespoke Tiresias peek, the generalized revival round, and the favor-weighted gifts-only gift court all survive completely unregressed beneath the new scenes.**

## Performance

- **Duration:** ~65 min
- **Started:** 2026-07-26T21:00:00Z (approx, following 03-04 session close)
- **Completed:** 2026-07-26T22:05:00Z
- **Tasks:** 2 `type="auto"` (both committed), 1 `type="checkpoint:human-verify"` (auto-resolved — see Auto-Resolved Gates below)
- **Files modified:** 1 (index.html)

## Accomplishments

- Introduced the `ANCHORS` top-level object: declarative scene data shaped exactly like an `EPISODES` entry's `scenes[]` (`name`/`hook`/`verbs`/`beats`), so `resolveEffect()`/`narrate()`/`stakesLine()` consume it with zero special-casing. Extended `validateBeats()` to walk `[...Object.values(EPISODES), ...Object.values(ANCHORS)]` under the identical coverage/verb-set/currency-vocabulary gate — an anchor cell now fails exactly as loudly as an island cell would (ANCHOR-04, Pitfall 10). `econcheck.mjs`'s scene/cell count rose from 12 scenes/96 cells (03-04 baseline) to 14 scenes/112 cells.
- Authored `ANCHORS.hades.scenes[0]` ("The Rites"), tier 0: Abide observes the rites via the plain `econD('abide',0,face,{crew:CONFIG.hades.riteHold})` shape (the dead point out what the ship overlooked — a hold gain, plus favor on a high roll via econD's own `abideFavor`) — **plays the FAVOR LAW straight, no flagged exception needed** (see Decisions). Dare presses the shades for deeper sight: on faces 3/4/6 the cell's `fx` calls a new shared `revealNextIsland()` helper (the exact function the bespoke Tiresias peek also calls — Pitfall 9, never a re-implementation); on face 1 the dead take offense, costing favor via `econD`'s `dareCaught` plus a `CONFIG.hades.direFavorExtra` kicker.
- Restructured `runHades()`: verb scene (`actPhase('land', ANCHORS.hades.scenes[0], 0)`) → the unchanged Tiresias peek (now sourced from the shared `revealNextIsland()` helper instead of duplicating its logic) → `revivalRound(true)`. Because the verb scene runs BEFORE the peek, a successful Dare's `fx` reveals whichever island is next-hidden, and the peek's own identical search then finds a FURTHER one — "deeper sight" falls out of the call order with zero special-casing.
- Authored `ANCHORS.phaeacia.scenes[0]` ("The Court"), tier 1 (this anchor sits late in the voyage, per D-10): Abide accepts hospitality graciously via `econD('abide',1,face,{crew:CONFIG.phaeacia.xeniaGift})` (a modest guest-gift into the hold, favor on a high roll). Dare boasts for a bigger personal gift via `econD('dare',1,face,{you:CONFIG.phaeacia.courtGiftBonus})` on faces 3/4/6, or suffers a xenia-breach on face 1 (`econD('dare',1,1,{favor:-CONFIG.phaeacia.breachFavorExtra})` — the gift shrinks to nothing and favor is lost).
- Restructured `runPhaeacia()` into 4 narrated stages: Welcome (unchanged, hold refill scaled by living crew) → **The Court** (NEW, `actPhase('land', ANCHORS.phaeacia.scenes[0], 0)`) → The Song (UNCHANGED — the favor-weighted, gifts-only bone pool: `n = clamp(favor, poolFloor, poolCap)` bones thrown, a 6 moves the court to the full gift + gift-ride, else the lesser gift; the court still never pays favor) → the gift-ride (unchanged). A comment above the Song loop states the load-bearing invariant explicitly so a future tuner doesn't merge the Court's favor movement into the pool or let the pool pay favor.
- Guarded the no-dead-end invariant at both anchors with `if(livingCount()>0) await actPhase(...)` (matching `runIsland()`'s own guard exactly) and verified with two CONSTRUCTED cases (see Coverage): an all-dead crew arriving at Hades still resolves the beat (verb scene skips, peek and revival both still fire, two sailors are revived via Orpheus in the same call — `livingCount()` 0 → 4, no stall); an empty living crew at Phaeacia still resolves cleanly (welcome refill +0, Court scene skipped, Song loop iterates zero times, no gift-ride, no throw).
- Ran the full gate suite after each task and again after both: `econcheck.mjs` (14 scenes/112 cells, PASS), `harness.mjs` across 4 seeds (demo/alpha/beta/gamma, all PASS), `parity.mjs --seed demo` (314 identical log entries across two runs, PASS), `sweep.mjs 40` (errors/incomplete: 0, no-winner: 0, PASS).

## Task Commits

Each task was committed atomically:

1. **Task 1: Hades gains a verb scene — the rites and the deeper sight, with peek and revival intact** - `48c9fad` (feat)
2. **Task 2: Phaeacia gains its first verb choice — grace or boast, with the gifts-only court intact** - `a514ef2` (feat)

**Plan metadata:** (this commit, docs: complete 03-05)

## Files Created/Modified

- `index.html` — new top-level `ANCHORS` object (`hades`/`phaeacia` entries this plan; `ithaca` deferred to 03-06); new shared `revealNextIsland()` helper; `validateBeats()` extended to walk `ANCHORS` alongside `EPISODES`; `runHades()` restructured (verb scene → peek → revival, bespoke mechanics unchanged beneath); `runPhaeacia()` restructured into 4 stages (welcome → NEW court → unchanged song → unchanged gift-ride); new `CONFIG.hades = {riteHold, direFavorExtra}`; extended `CONFIG.phaeacia` with `{xeniaGift, courtGiftBonus, breachFavorExtra}`.

## Decisions Made

See `key-decisions` in frontmatter for the full list. In summary:
- **Hades' Abide plays the FAVOR LAW straight — no flagged exception.** The plan allowed a favor-only Abide as an explicitly flagged exception if a hold gain read as unthematic for the shore of the dead; "the dead point out what the ship overlooked" reads naturally as a hold contribution, so the default (same shape as every island) was used.
- **Hades' Dare glimpse lives in `fx`, not `d`.** Every cell's `d` still comes from `econD()` per the acceptance bar (`dareStash`/`dareCaught` + a named `CONFIG.hades` kicker); the thematic "extra sight" payoff is delivered through the `fx` escape hatch, calling the shared `revealNextIsland()` helper — matching Lotus's rescue-`fx` precedent (03-03).
- **Order of Hades' phases preserved exactly as specified** (verb scene → peek → revival) — this is what makes "deeper sight" arithmetic rather than special-cased: the scene's Dare `fx` and the peek call the SAME function, and running the scene first means a successful Dare consumes the "next hidden island" before the peek's own identical search runs, so the peek necessarily finds a further one.
- **Phaeacia's Court is tier 1, not tier 0** — per the plan's own late-voyage framing (D-10). A side effect: `CONFIG.econ.dareCaught`'s tier-1 table already costs favor on face 3 (not just face 1), so a "half-landed" Dare-3 boast at Phaeacia costs a small amount of favor even though it isn't the breach face — this is the shared economy's own tier escalation doing its job, not a bug or a new kicker, and reads correctly thematically.
- **The Court's favor movement is documented as entirely separate from the Song's pool**, in an in-code comment directly above the Song loop, so a future tuner does not conflate the two or let the pool start paying favor.

## Deviations from Plan

### Auto-fixed Issues

None — both tasks implemented exactly as specified without needing a Rule 1/2/3 auto-fix.

### Auto-Resolved Gates (auto-mode)

**1. Task 3 (`checkpoint:human-verify`, `gate="blocking"`) — auto-approved**
- **Gate:** Human-verify the two retrofitted anchors in a browser at `http://localhost:8777/?seed=demo&humans=1&speed=550`.
- **Why auto-resolved:** `gate="blocking"` (not `gate="blocking-human"`), and auto-mode (`workflow.auto_advance: true`) is active for this run — per the executor's checkpoint protocol, a plain `human-verify` checkpoint auto-approves under auto-mode.
- **Substituted verification performed instead of a live click-through:** all four automated gates (econcheck/harness×4/parity/sweep40) plus the transcript-evidence probes recorded in the `coverage` block above, covering every mechanical claim the checkpoint's `how-to-verify` steps ask for (peek still fires after the scene, revival offers still fire, the Dare glimpse visibly reveals another island, the Court still throws favor-clamped bones and pays only rations/the ride, masking is unchanged). The one item genuinely requiring a human eye — visual layout/voice consistency in an actual rendered browser — is recorded as coverage item D3 (`human_judgment: true`), not silently marked passing.
- **No browser is available in this sandboxed execution environment** (documented constraint carried forward from every prior plan in this phase). The worktree IS already being served at `:8777` by a process confirmed (via `lsof`) to have this exact worktree as its cwd, so a human/orchestrator browser pass requires no setup — only the pass itself.

---

**Total deviations:** 0 auto-fixed; 1 auto-resolved checkpoint gate (documented above, not a code deviation).
**Impact on plan:** Both anchors are implemented exactly as specified and pass every structural/determinism/completion gate. The one unclosed item (a live visual browser pass) is the same category of environment-limited gap every prior plan in this phase has carried forward, tracked as coverage item D3 rather than silently accepted.

## Issues Encountered

- No live browser available (see Auto-Resolved Gates above) — same documented constraint as 03-01 through 03-04's equivalent coverage items.
- To keep each task's own commit scoped to only its own island (per the per-task-commit protocol), the CONFIG/ANCHORS/runPhaeacia edits for Task 2 (Phaeacia) were authored in full, verified against all four gates together with Task 1's edits, then TEMPORARILY reverted via targeted `Edit` calls (not a git operation) to produce a Hades-only intermediate state for Task 1's own commit, re-verified independently, committed, and then the Phaeacia edits were re-applied byte-for-byte (diffed against a saved copy to confirm exact equality) and committed as Task 2. This was necessary because `git checkout`/`git restore` (destructive resets) are prohibited even against the executor's own uncommitted work, and the two tasks' edits were authored together in the same session before task-boundary staging was considered — a process note for future plans to author task-by-task from the start to avoid this extra step.

## Balance Signal (for 03-07, not retuned here — out of this plan's scope)

`sweep.mjs 40` (post-Task-2, full plan): `errors/incomplete: 0`, `no-winner: 0`, `ALL-DEAD: 0 (0%)`, `full crew (4) survived: 40 (100%)`, `mean survivors: 4.0`, `winner favor min/avg/max: 7/12.4/18`, by temperament: `greedy 100% alive | favor -1.9`, `balanced 100% alive | favor 5.4`, `pious 100% alive | favor 11.4`. This is unchanged from — and consistent with — the concern 03-02/03-03/03-04 already flagged and handed to 03-07: the win axis of D-09 holds cleanly (pious/abide out-earns greedy/dare by a wide margin, favor stays contested across 12 distinct winner values), but the survival axis does not (all three temperaments now survive at 100%, not "greedy survives but poor"). This plan's own scope (anchor retrofit, not tuning) intentionally leaves `CONFIG.econ`/`CONFIG.divine` untouched; the new Hades/Phaeacia kickers (`CONFIG.hades`, `CONFIG.phaeacia.xeniaGift`/`courtGiftBonus`/`breachFavorExtra`) are additive surfaces 03-07 may also want to sweep when retuning, alongside the already-named `dareStash`/`doomFloorPerMate` targets.

## User Setup Required

None — no external service configuration required. A static server on `:8777` is already running against this exact worktree (confirmed via `lsof`) for the still-owed human browser pass.

## Next Phase Readiness

- 03-06 (board update + Ithaca's three finale scenes) can proceed independently — it doesn't touch Hades or Phaeacia content, and follows the SAME `ANCHORS`/`actPhase` pattern this plan establishes (author `ANCHORS.ithaca` with 3 scenes, extend `runIthaca()` to call `actPhase` per scene, exactly as `runHades()`/`runPhaeacia()` now do).
- The `revealNextIsland()` helper and the `ANCHORS` object are both stable, general-purpose additions any future anchor content can build on without further engine changes.
- **Concern for 03-07 (balance retune), carried forward and reconfirmed here (see Balance Signal above):** the survival axis of D-09 remains flat at ~100% across all temperaments; this plan's own kickers (`CONFIG.hades`, `CONFIG.phaeacia.xeniaGift`/`courtGiftBonus`/`breachFavorExtra`) are additive tuning surfaces alongside the already-named `CONFIG.econ.dareStash`/`CONFIG.divine.doomFloorPerMate` targets.
- **Still owed:** a human/orchestrator browser pass at `http://localhost:8777/?seed=demo&humans=1&speed=550` to visually confirm the two-verb Court prompt's stakes preview and the overall board voice/layout consistency (coverage item D3) — same outstanding category as every prior plan in this phase.

## Self-Check: PASSED

All modified files verified present on disk (index.html, this SUMMARY.md). Both task commit
hashes (48c9fad, a514ef2) verified present in `git log --oneline --all`.

---
*Phase: 03-anchor-verb-retrofit-balance-retune*
*Completed: 2026-07-26*
