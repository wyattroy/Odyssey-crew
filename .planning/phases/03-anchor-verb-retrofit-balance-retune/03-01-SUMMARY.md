---
phase: 03-anchor-verb-retrofit-balance-retune
plan: 01
subsystem: game-economy
tags: [vanilla-js, single-file, deterministic-rng, headless-vm-testing]

# Dependency graph
requires:
  - phase: 01-effect-engine-sequential-resolution
    provides: declarative beats model (resolveEffect/validateBeats), sequential turn-ordered hold resolution
  - phase: 02-themed-island-content
    provides: four worked island episodes (Helios/Cyclops/Sirens/Lotus) on the three-verb grammar
provides:
  - Two-verb (Abide/Dare) grammar replacing the three-verb (Dare/Abide/Give) grammar everywhere in the engine
  - One divine currency (favor) replacing the two peril tracks (world-anger, Poseidon's curse)
  - CONFIG.econ/CONFIG.divine as the single tunable payoff+threshold surface for the rest of Phase 3
  - crewFavor()/seasExtraBlue()/doomFloor()/blessFloor()/doomToll() — the favor-drives-world causal chain
  - Helios fully re-authored on the new economy with an escalating 3-scene arc (proof-of-model tracer)
  - econcheck.mjs/parity.mjs/upgraded sweep.mjs — the three measurement instruments every later Phase 3 plan verifies against
affects: [03-02-favor-lifeline-revival, 03-03-cyclops-lotus-reauthor, 03-04-sirens-reauthor, 03-05-anchor-retrofit, 03-06-board-update, 03-07-balance-retune]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "econD(verb, tier, face, extra) — every beats cell's `d` built from CONFIG.econ, never a bare integer literal"
    - "DELTA_KEYS whitelist enforced twice: applyDeltas throws at runtime, validateBeats rejects at load"
    - "doomFloor()/blessFloor() scale per living crew member — the anti-spiral guard (a shrinking crew never by itself drives doom)"
    - "doomToll() caps a collective catastrophe and never takes the last living sailor"

key-files:
  created:
    - scratchpad/econcheck.mjs
    - scratchpad/parity.mjs
  modified:
    - index.html
    - scratchpad/sweep.mjs

key-decisions:
  - "Proceed with the two-verb fold (D-01): Give's commons-serving function becomes Abide's base effect; the third verb is gone from the engine, prompts, generic tables, bots, and board."
  - "Proceed with the currency fold (D-04): world-anger and Poseidon's curse are deleted from state; favor is the only divine currency, driving seas (crossing-bag salting) and collective doom, with thresholds scaled per living crew member to prevent a shrinking-crew death spiral."
  - "Cyclops/Sirens/Lotus are converted MECHANICALLY (interim) — Give's function folded into Abide, retired world/curse payoffs re-expressed as favor deltas — deliberately NOT re-authored thematically here; that lands in 03-03/03-04."
  - "Sirens' Dare cells now show a net favor cost even on some high faces (world+favor summed into one number) — a known, accepted artifact of the interim fold, not a design decision; the sanctioned Dare-favor exception (D-05) is restored on purpose in 03-04."

patterns-established:
  - "Pattern: divine-economy helpers (crewFavor/seasExtraBlue/doomFloor/blessFloor/doomToll) live beside applyDeltas, read only deterministic state, and never call the RNG except doomToll's already-established pick()-family seam."
  - "Pattern: an episode's onDepart reads crewFavor() against doomFloor()/blessFloor() instead of a per-episode peril track; three branches (catastrophe/blessing/simmer) for islands that had all three before (Helios), two branches (catastrophe/none) for islands that only had one before (Sirens)."

requirements-completed: [ECON-01, ECON-02]

coverage:
  - id: D1
    description: "Exactly two verbs (Abide/Dare) everywhere the engine, prompts, generic tables, bots, and board can express one"
    requirement: "ECON-01"
    verification:
      - kind: unit
        ref: "node scratchpad/econcheck.mjs"
        status: pass
      - kind: integration
        ref: "node scratchpad/harness.mjs --seed demo (+ 3 more seeds)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Favor is the only divine currency; the two peril tracks are gone from state; aggregate living-crew favor drives crossing-bag salting and collective doom, and is visible on the board"
    requirement: "ECON-02"
    verification:
      - kind: unit
        ref: "node scratchpad/econcheck.mjs"
        status: pass
      - kind: integration
        ref: "transcript inspection: 'salted' bag lines + Helios departure lines across 8 seeds (demo, alpha..theta)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Determinism and the 0-human unattended run survive the redesign; ?seed= still reproduces an identical transcript"
    verification:
      - kind: integration
        ref: "node scratchpad/parity.mjs --seed demo"
        status: pass
      - kind: integration
        ref: "node scratchpad/sweep.mjs 40 (errors/incomplete:0, no-winner:0)"
        status: pass
    human_judgment: false
  - id: D4
    description: "Board renders exactly two verb buttons with per-face stakes previews, and a crew-favor/seas/doom status card, in an actual browser"
    verification: []
    human_judgment: true
    rationale: "No live browser is available in this headless sandbox (consistent with the constraint documented in scratchpad/harness.mjs). Substituted evidence: static grep confirms zero live give-button/CSS/bot-verb references, and headless transcript inspection confirms the act-prompt/stakes-preview/favor-card code paths execute without error across multiple seeds. A human or orchestrator browser pass is still needed to visually confirm rendering."

# Metrics
duration: 45min
completed: 2026-07-26
status: complete
---

# Phase 3 Plan 1: Two-Verb, One-Currency Economy Tracer Summary

**Two-verb (Abide/Dare) + one-currency (favor) economy landed as a single vertical slice — CONFIG.econ/CONFIG.divine, engine, resolver, validator, and Helios's full 3-scene content re-authored end-to-end, with three new/upgraded measurement instruments (econcheck, parity, sweep) proving it.**

## Performance

- **Duration:** ~45 min
- **Started:** 2026-07-26T18:51:31Z (per STATE.md session start)
- **Completed:** 2026-07-26T19:12:36Z
- **Tasks:** 5 (1 auto build, 2 decision gates, 1 tracer, 1 human-verify checkpoint)
- **Files modified:** 4 (index.html, scratchpad/econcheck.mjs [new], scratchpad/parity.mjs [new], scratchpad/sweep.mjs)

## Accomplishments

- Built the phase's three measurement instruments BEFORE the tracer they gate: `scratchpad/econcheck.mjs` (structural economy gate — comment-stripped source scan for retired identifiers + runtime VERBS/DELTA_KEYS/beats-coverage assertions), `scratchpad/parity.mjs` (same-seed determinism gate), and an upgraded `scratchpad/sweep.mjs` (new metrics + `--assert` mode carrying the D-09 balance targets for 03-07 to clear later). Verified all three discriminate correctly against the pre-tracer baseline (~50% all-dead) before using them as gates.
- Landed the two-verb fold (D-01/D-02/D-03): `VERBS = ['dare','abide']`, `DELTA_KEYS = ['you','crew','favor']`, `CONFIG.econ` (the whole two-verb payoff surface) and `econD()` (the single cell builder — no bare integer literal anywhere in Helios's beats).
- Landed the currency fold (D-04/D-05): deleted `state.world`/`state.curse`; added `CONFIG.divine` and `crewFavor()`/`seasExtraBlue()`/`doomFloor()`/`blessFloor()`/`doomToll()` — thresholds scale per living crew member so a shrinking crew never by itself drives doom (the anti-spiral guard confirmed at the Task 3 decision gate).
- Hardened `applyDeltas` (throws on an out-of-vocabulary payoff key) and `validateBeats` (asserts exactly `VERBS` per scene, full face coverage, and every `d`/`alwaysD` key inside `DELTA_KEYS`) — the two-layer fail-loud guarantee against a silent no-op payoff cell (Pitfall 10, T-03-01).
- Re-authored Helios's all three scenes fully on `CONFIG.econ` with a non-decreasing escalating arc (D-10) and a 3-branch `onDepart` (catastrophe/blessing/simmer) reading `crewFavor()` against `doomFloor()`/`blessFloor()`, capped by `doomToll()` so a favor-bankrupt crew is never wiped (D-07/ANCHOR-04) — verified across 8 seeds that all three branches fire correctly and the never-wipe-last-sailor guard held.
- Mechanically converted Cyclops/Sirens/Lotus (interim — marked in-file, thematic re-authoring deferred to 03-03/03-04) so the validator/econcheck never trip: Give's function folded into Abide (Cyclops's load-bearing drunk-counter `fx` carried over verbatim; Lotus's load-bearing lotus-struck `fx` preserved via an additive merge, not a replacement); every retired world/curse payoff re-expressed as a favor delta.
- Rebuilt the board's action bar (two buttons, no third verb, corrected stale eat-hint prose) and status strip (one always-visible crew-favor/seas/doom card replacing the two retired peril-track cards).

## Task Commits

1. **Task 1: Build the three measurement instruments** - `86a950f` (feat)
2. **Task 2: DECISION GATE — fold the three-verb grammar into two verbs** - auto-selected "proceed" (auto mode active, gate="blocking"); no separate commit, informs Task 4
3. **Task 3: DECISION GATE — delete the two peril tracks, favor becomes the only divine currency** - auto-selected "proceed" (auto mode active, gate="blocking"); no separate commit, informs Task 4
4. **Task 4: TRACER — the whole new economy, end-to-end, proven on Helios** - `a7d9566` (feat) — includes a Rule-1 fix to `econcheck.mjs`'s `.world` substring check (see Deviations)
5. **Task 5: Human-verify the two-verb board and favor-driven seas** - auto-approved (auto mode active, gate="blocking", not package-legitimacy); substituted automated/transcript evidence for the unavailable live browser (see Deviations)

**Plan metadata:** (this commit, docs: complete 03-01)

## Files Created/Modified

- `scratchpad/econcheck.mjs` - NEW structural economy gate (source scan + runtime VERBS/DELTA_KEYS/beats assertions)
- `scratchpad/parity.mjs` - NEW same-seed determinism gate
- `scratchpad/sweep.mjs` - upgraded metrics (no-winner, deaths, mean survivors, seeds-with-a-death) + `--assert` mode carrying D-09 targets
- `index.html` - VERBS/DELTA_KEYS constants; CONFIG.econ/CONFIG.divine; econD/crewFavor/seasExtraBlue/doomFloor/blessFloor/doomToll; applyDeltas/deltaStakes/validateBeats hardened; LAND_TABLE/SEA_TABLE/askHuman/botAct/botDecide/verbWord/renderStrip/startCrossing reduced to two verbs and one currency; Helios re-authored; Cyclops/Sirens/Lotus mechanically converted (interim); button.give CSS retired

## Decisions Made

- **D-01/D-02/D-03 (proceed):** Fold the third verb (Give) into Abide's base effect permanently. Confirmed at the Task 2 decision gate as the last cheap moment before this re-authors every island's beats table.
- **D-04/D-05 (proceed):** Delete the two peril tracks; favor is the only divine currency, with doom/bless thresholds scaled per living crew member. Confirmed at the Task 3 decision gate over the `proceed-guarded` (absolute-threshold) alternative, which would re-introduce the documented death-spiral shape.
- **CONFIG.divine first-pass values** (Claude's Discretion per 03-CONTEXT.md — tuned later in 03-07): `calmPerMate:3, roughStep:2, maxExtraBlue:6, doomFloorPerMate:0, blessFloorPerMate:4, doomMaxToll:2`. Chosen to be non-degenerate against the post-tracer sweep (see below) rather than precisely tuned.
- **Interim conversion strategy for Cyclops/Sirens/Lotus:** rather than uniformly "replace Abide with Give's function," used an ADDITIVE merge wherever Abide already carried load-bearing behavior (Lotus's lotus-struck fx) and a straight fold wherever Abide was previously inert (Cyclops, Sirens). This preserves every load-bearing `fx` hook without requiring thematic re-authoring in this plan.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] econcheck.mjs's `.world` retired-identifier check false-positived on legitimate identifiers**
- **Found during:** Task 4 verification (first `node scratchpad/econcheck.mjs` run against the freshly re-authored index.html)
- **Issue:** The structural gate's source scan used a raw substring match for `.world`, which also matched `CONFIG.sirens.worldPerListen` (any identifier starting with "world" immediately after a dot) — the same class of false positive the plan already anticipated for `ep.worldStart` (hence the explicit instruction to retire that field), but the scan itself wasn't robust to it.
- **Fix:** Changed the `.world`/`state.world`/etc. checks to word-boundary regexes (`new RegExp(escaped + '\\b')`) so `.world` only matches an exact property access, not a prefix of a longer identifier. Also split the quoted-`'give'` check to run against a comments-only-stripped source (preserving string literals) rather than raw source, so a comment that merely *mentions* `'give'` in prose can never trip the gate — only a live `==='give'` comparison can.
- **Files modified:** `scratchpad/econcheck.mjs`
- **Verification:** `node scratchpad/econcheck.mjs` now exits 0 against the fully re-authored index.html (12 scenes / 96 cells checked) and still exits non-zero when tested against the pre-tracer baseline (confirmed before the fix, in Task 1).
- **Committed in:** `a7d9566` (folded into the Task 4 commit, since the bug was found and fixed strictly through Task 4's own verification)

**2. [Rule 3 - Blocking, environment limitation] No live browser available for Task 5's visual verification**
- **Found during:** Task 5 (checkpoint:human-verify)
- **Issue:** This sandboxed execution environment has no browser (documented precedent: `scratchpad/harness.mjs`'s own header comment states this explicitly). Task 5's `<how-to-verify>` calls for opening `http://localhost:8777/?seed=demo&humans=1&speed=550` and visually confirming button labels, stakes previews, and the favor/seas card.
- **Fix:** Substituted automated/static evidence: (a) `grep` confirms zero live references to `button.give`, `'give'` verb values, or three-button constructs anywhere in `index.html`; (b) headless transcript inspection across 8 seeds confirms the `askHuman('act')` two-button path resolves correctly every turn, the crossing-bag salting line fires when crew favor is low, and all three Helios `onDepart` branches (doom/bless/simmer) fire and narrate correctly. This does not replace an actual visual/click-through pass.
- **Files modified:** none (verification-only)
- **Committed in:** n/a — documented as a `human_judgment: true` coverage item (D4) for a human or orchestrator-driven browser pass to close out later.

---

**Total deviations:** 2 (1 auto-fixed bug in the plan's own tooling, 1 documented environment limitation)
**Impact on plan:** The econcheck fix was necessary for the gate to be usable at all (it would have false-failed on legitimate Sirens config going forward). The browser-verification gap is a real, disclosed limitation — not a shortcut taken silently — and is tracked as an explicit human-judgment coverage item rather than marked complete.

## Issues Encountered

- Same underlying issue as the econcheck deviation above: designing a robust "no live reference to a retired identifier" source scan without either false-positiving on similarly-named-but-legitimate identifiers or false-negativing on retired ones required two separate comment-stripping passes (comments-only vs. comments+strings) rather than one. Resolved during Task 4.
- Sirens' interim mechanical fold (merging the retired `world` cost/gain directly into `favor`) produces a Dare road that is net favor-negative on several faces in the later scenes — this is flagged explicitly in-code as a known, accepted artifact of the interim conversion, not a regression, since 03-04 re-authors Sirens thematically and restores the sanctioned Dare-favor exception (D-05) on purpose.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The whole rest of Phase 3 (favor-lifeline revival in 03-02, Cyclops/Lotus thematic re-authoring in 03-03, Sirens thematic re-authoring in 03-04, the anchor retrofit in 03-05, the board update in 03-06, and the balance retune in 03-07) can now build directly on `CONFIG.econ`/`CONFIG.divine`, `econD()`, and the `VERBS`/`DELTA_KEYS` vocabulary landed here.
- `scratchpad/econcheck.mjs`/`parity.mjs`/upgraded `sweep.mjs` are ready as the verification instruments every later plan in this phase runs against; `sweep.mjs --assert` carries the D-09 acceptance bar that 03-07 must clear (not asserted here — this plan's post-tracer numbers are the baseline 03-07 tunes from).
- **Post-tracer `sweep.mjs 40` baseline (recorded verbatim for 03-07):**
  ```
  === BALANCE SWEEP: 40 seeds (0-human auto) ===
  errors/incomplete: 0
  no-winner / incomplete: 0
  ALL-DEAD (death-spiral): 0 (0%)
  ≥1 survivor (reached Ithaca alive): 40 (100%)
  full crew (4) survived: 7 (18%)
  survivor-count distribution: {"0":0,"1":10,"2":11,"3":12,"4":7}
  mean survivors: 2.4
  seeds with ≥1 death: 39 (98%)
  winner favor — min/avg/max: -1/10.2/20
  favor spread (distinct winner favors): -1,0,3,4,6,7,8,9,10,11,12,13,14,15,17,19,20 (17 distinct)
  by temperament (alive-rate | avg favor):
    greedy: 43% alive | favor -1.8
    balanced: 65% alive | favor 4.9
    pious: 68% alive | favor 9.9
  ```
  This is already a dramatic improvement over the documented pre-redesign baseline (~50% all-dead, max 1 survivor) even before any deliberate balance tuning — confirming the two-verb/one-currency model itself resolves the death-spiral, independent of number-tuning.
- Concern for 03-03/03-04: Cyclops/Sirens/Lotus's interim mechanical conversions are functionally valid but not thematically tuned — Sirens in particular has a net-negative Dare road in later scenes that needs deliberate re-authoring, not just number adjustment.
- Concern for the orchestrator/next human session: Task 5's browser-based visual verification (button labels, stakes preview rendering, favor/seas card layout) has NOT been performed with an actual browser — only substituted automated/transcript evidence. A click-through pass at `http://localhost:8777/?seed=demo&humans=1&speed=550` is still owed before this plan's board-facing surface is fully confirmed.

---
*Phase: 03-anchor-verb-retrofit-balance-retune*
*Completed: 2026-07-26*
