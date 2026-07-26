---
phase: 02-themed-island-content-favor-law-reconciliation
plan: 05
subsystem: game-content
tags: [beats-engine, favor-law, headless-harness, vanilla-js, audit]

# Dependency graph
requires:
  - phase: 02-themed-island-content-favor-law-reconciliation
    provides: "All four islands (Helios/Cyclops/Sirens/Lotus) fully authored to beats across all 3 scenes each, favor-law reconciliation applied per-island (02-01..02-04); scratchpad/harness.mjs headless verifier"
provides:
  - "Game-wide favor-law audit (CONTENT-06): every favor delta in the four islands classified by verb — only Abide-6 (default path) and the single flagged Sirens Dare exception grant positive favor; no accidental Dare-favor or Give-favor found anywhere"
  - "Game-wide asymmetry inspection (CONTENT-05): all 12 island scenes rated against the Dare/Abide/Give asymmetry by inspection — no inversion found beyond the two intentional, already-documented design exceptions (Lotus D-04 verb-label inversion, Helios restraint-bless collective bonus)"
  - "7-seed 0-human regression sweep confirming validateBeats() ok and THE VERDICT reached on every seed, plus a re-confirmed determinism check (same seed -> byte-identical harness output)"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Whole-game audit via targeted grep + full-file EPISODES read, cross-checked against each island's own SUMMARY claims and the shared scratchpad/harness.mjs — no code changes needed since all four per-island plans (02-01..02-04) already closed their local violations correctly."

key-files:
  created: []
  modified: []

key-decisions:
  - "No index.html edits were needed. The audit found zero unflagged Dare-favor grants, zero Give-favor grants, and zero asymmetry inversions beyond the two already-documented, approved exceptions (Sirens' flagged Dare-favor exception per D-05, and Lotus's flagged Abide/Dare label inversion per D-04). The three prior-phase violations (Cyclops boast, Cyclops collective blinding, Lotus rescue) were already closed correctly in 02-02/02-04 and re-verified here at the whole-game level rather than per-island."
  - "Helios's Abide is riskless/low-upside per-cell (no lethal-if-only mechanic of its own within a scene) but the island-level onDepart() restraintBless bonus rewards collective low-world play — this is the explicit 'except where the myth intends' carve-out named in the plan's own Task 2 action text, not a violation."
  - "Lotus's Abide/Dare verb-LABEL inversion (D-04) is treated as compliant-by-design, not an asymmetry violation: the underlying mechanic still holds the law's spirit — the risky/self-indulgent road (labeled Abide here) is low-reward/high-risk (a single free ration vs. escalating lotus-struck->strand->death), the safe/pro-crew road (labeled Dare here) is riskless and favor-neutral, and Give is unaffected (riskless, sustains the crew, never moves favor)."

patterns-established: []

requirements-completed: [CONTENT-05, CONTENT-06]

coverage:
  - id: D1
    description: "Favor-law reconciliation audit (CONTENT-06): every favor delta across all four islands (48 dare/abide/give x face cells x scenes) classified by verb/face with a pass verdict. Only Helios/Lotus Abide-6 (default favor path) and the flagged Sirens Dare exception (all 3 scenes, faces 3/4/6) grant positive favor; Helios Dare-3 (all 3 scenes) is a favor PENALTY (condemnation, allowed); Cyclops grants zero favor anywhere (its own documented no-favor-island convention, D-05-scoped); no Give cell anywhere moves favor."
    requirement: "CONTENT-06"
    verification:
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed demo (validateBeats ok, THE VERDICT reached)"
        status: pass
      - kind: other
        ref: "grep -n favor index.html, scoped read of all four EPISODES.<island> blocks (lines 826-1358) plus prideSubCommit/stakeCheck/polyphemusHunger function bodies (lines 1075-1387) — full classification recorded below in 'Favor-Law Classification'"
        status: pass
    human_judgment: false
  - id: D2
    description: "Asymmetry inspection (CONTENT-05): all 12 island scenes (Helios x3, Cyclops x3, Sirens x3, Lotus x3) rated against the Dare/Abide/Give definitions (Dare risks self+crew for high upside; Abide riskless/low-upside/lethal-if-only; Give riskless and never moves favor) — full 12-row table recorded below in 'Asymmetry Inspection'. No inversion found beyond the two already-approved design exceptions (Lotus D-04, Helios restraint-bless)."
    requirement: "CONTENT-05"
    verification:
      - kind: other
        ref: "full read of EPISODES.helios/cyclops/sirens/lotus (index.html:826-1358) plus onDepart/collectiveCheck/fx helper functions (lines 945-956, 1075-1387, 1345-1357); cross-checked against each island's own 02-0{1,2,3,4}-SUMMARY.md coverage claims"
        status: pass
    human_judgment: false
  - id: D3
    description: "Fixed multi-seed 0-human regression sweep (D-07 completion/determinism gate, NOT the Phase-3 balance sweep): 7 distinct seeds (demo, alpha, beta, gamma, delta, epsilon, zeta) each run via scratchpad/harness.mjs — every seed reaches THE VERDICT with validateBeats() ok and notYetConverted=[] (all 12 island scenes on the beats path, confirming the anchors Hades/Phaeacia/Ithaca are structurally outside EPISODES and thus correctly excluded from this phase's scope). Determinism re-confirmed: two back-to-back runs of the same seed produce byte-identical harness output."
    requirement: "CONTENT-05"
    verification:
      - kind: unit
        ref: "for s in demo alpha beta gamma delta epsilon zeta; do node scratchpad/harness.mjs --seed \"$s\"; done — all 7 exit 0"
        status: pass
      - kind: other
        ref: "diff <(node scratchpad/harness.mjs --seed alpha) <(node scratchpad/harness.mjs --seed alpha) — empty diff, byte-identical"
        status: pass
    human_judgment: false

duration: ~20min
completed: 2026-07-26
status: complete
---

# Phase 2 Plan 5: Favor-Law Audit, Asymmetry Inspection & Regression Sweep Summary

**Whole-game audit confirms the favor-law and Dare/Abide/Give asymmetry hold across all four islands with zero unflagged violations — Sirens remains the sole sanctioned Dare-favor exception, all three prior violations (Cyclops boast, Cyclops blinding, Lotus rescue) stay reconciled, and a 7-seed 0-human sweep completes deterministically with validateBeats() passing every time; no index.html changes were required.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-07-26T04:20Z (approx, first plan read)
- **Completed:** 2026-07-26T04:40:14Z
- **Tasks:** 2 (both audit/verification-only — no code changes needed)
- **Files modified:** 0

## Accomplishments
- Ran the game-wide favor-law audit (CONTENT-06): read all four `EPISODES.<island>` blocks in full (index.html:826-1358) plus the three scene-lifecycle functions that touch favor (`prideSubCommit`, `stakeCheck`, `polyphemusHunger`, lines 1075-1387), and grepped every `favor` occurrence in the file. Confirmed: the only positive-favor Dare cells anywhere are the flagged Sirens Dare cells (faces 3/4/6, all 3 scenes); Helios's other Dare-favor hit (face 3, all 3 scenes) is a `CONFIG.fx.penalty` (condemnation, a negative delta — allowed per the law's "penalties on Dare are allowed" clause); Cyclops grants zero favor anywhere (its own documented no-favor-island scope); no Give cell in any island ever touches `favor`.
- Ran the asymmetry inspection (CONTENT-05) across all 12 island scenes, rating each verb (Dare/Abide/Give) against the definitions in `.planning/REQUIREMENTS.md` and `02-CONTEXT.md`'s `<specifics>`. Found zero inversions beyond the two already-approved, explicitly-documented design exceptions: Lotus's D-04 Abide/Dare verb-label swap (the underlying risk/reward shape still obeys the law's spirit) and Helios's restraint-bless collective bonus (island-level reward for cumulative low-world Abide play, the "except where the myth intends" carve-out named in the plan's own task text).
- Ran a 7-seed 0-human regression sweep (`demo`, `alpha`, `beta`, `gamma`, `delta`, `epsilon`, `zeta`) via `scratchpad/harness.mjs` — every seed reached THE VERDICT (including one full-crew-death ending on `epsilon`, an acceptable and expected outcome per D-07/Phase-3 scoping) with `validateBeats()` returning `{ok:true, notYetConverted:[]}` every time, confirming all 12 island scenes are fully on the beats path.
- Re-confirmed determinism: ran the same seed (`alpha`) twice back-to-back and diffed the harness output — byte-identical, zero diff.
- Re-ran the two acceptance-criteria greps from the plan: the bare-integer sweep (`(you|crew|favor|world):\s*-?[0-9]`) matches only the pre-existing `LAND_TABLE`/`SEA_TABLE` fallback tables and unrelated state-init lines (never inside any island's `beats` cells), and the `rnd()`/`pick()`/`Math.random` sweep shows zero hits inside any island `tell`/`fx` closure — the only `pick()` calls near island content live in scene-lifecycle reducer functions (`onDepart`, `polyphemusHunger`, `stakeCheck`), which the file's own DETERMINISTIC INVARIANT comment (index.html:223-229) explicitly permits since they run synchronously through the seeded `rnd()`/`state.rng()` path, never inside a click handler or timer.
- Because zero violations were found, **no index.html edits were made this plan** — Tasks 1 and 2 are both audit/verification tasks whose `<action>` only calls for a fix "if the sweep finds ANY unflagged positive favor on a Dare cell" or "any cell that inverts the asymmetry"; neither condition was met.

## Task Commits

No task commits — both tasks are audit/verification-only and produced no code changes to commit. This SUMMARY and the accompanying STATE.md/ROADMAP.md/REQUIREMENTS.md updates are captured in the plan-metadata commit below.

**Plan metadata:** (this commit)

## Files Created/Modified
None. This plan's deliverable is the recorded audit, inspection, and sweep results below — no `index.html` changes were required.

## Favor-Law Classification (Task 1 / CONTENT-06)

Every favor-bearing cell in the four islands, plus a confirmation that no other cell (Give, or any unflagged Dare/Abide cell) moves favor.

| Island | Scene(s) | Verb | Face(s) | Favor delta | Verdict |
|---|---|---|---|---|---|
| Helios | The Meadow / The Hunger / The Reckoning (all 3) | Dare | 1 | none (world+ only — "seen by the Sun") | PASS — no favor on this face |
| Helios | all 3 | Dare | 3 | `favor:CONFIG.fx.penalty` (negative) | PASS — condemnation penalty, allowed on Dare |
| Helios | all 3 | Dare | 4, 6 | none (stash/hold gain only) | PASS — no favor on these faces |
| Helios | all 3 | Abide | 1, 3, 4 | none | PASS |
| Helios | all 3 | Abide | 6 | `favor:CONFIG.fx.tiny` (positive) | PASS — default Abide-6 favor path (D-05) |
| Helios | all 3 | Give | all faces | none | PASS — Give never moves favor |
| Cyclops | The Wine / The Stake / Under the Sheep (all 3) | Dare, Abide, Give | all faces | none anywhere | PASS — Cyclops is a documented no-favor island (D-05 scoped exception, distinct from the general Abide-6 default) |
| Cyclops | The Wine, The Stake | `collectiveCheck` (`polyphemusHunger`, `stakeCheck`) | n/a | no positive grant; only the pre-existing death-penalty favor clawback (`favor=Math.max(0,favor-islandFavorEarned)`) on a seized victim | PASS — matches D-05's Cyclops no-favor convention; the clawback is a penalty on death, not a Dare reward |
| Sirens | The First Notes / The Full Song / The Reef (all 3) | Dare | 1 | none (`d:{world:...}` only, `listenFavor[1]=0`) | PASS — the worst face pays zero favor |
| Sirens | all 3 | Dare | 3, 4, 6 | `favor:CONFIG.sirens.listenFavor[face]` (positive, scales 1/2/3 by face) | **SANCTIONED EXCEPTION** — the one flagged Dare-favor grant in the whole game (explicit block comment above `EPISODES.sirens.scenes`, index.html:1103-1118), per D-03/D-05 |
| Sirens | all 3 | Abide | all faces | none | PASS — intentional inversion of the general Abide-6 default (documented in the flag comment) |
| Sirens | all 3 | Give | all faces | none | PASS |
| Lotus | The Offering / Going Back / Cast Off (all 3) | Abide | 1, 3, 4 | none (only the free-ration `you:CONFIG.lotus.rations`) | PASS |
| Lotus | all 3 | Abide | 6 | `favor:CONFIG.fx.tiny` (positive) | PASS — default Abide-6 favor path, the ONLY favor path on this island |
| Lotus | all 3 | Dare | all faces | none | PASS — third and final shipped Dare-favor violation, retuned off (D-05) |
| Lotus | all 3 | Give | all faces | none | PASS |

**Verdict:** Across all 48 island-scene/verb/face cells (12 scenes x 4 faces averaged across dare/abide/give), the only positive-favor Dare cells are the flagged Sirens exception; every other Dare-favor hit is a documented penalty (Helios Dare-3); no Give cell ever moves favor; Helios and Lotus each grant favor only via Abide-6 (the default law path); Cyclops grants no favor at all (its own scoped D-05 exception). **No accidental Dare-favor or Give-favor exists anywhere in the four islands.**

## Asymmetry Inspection (Task 2 / CONTENT-05)

All 12 island scenes rated against: Dare = risks self+crew resources/favor for high upside; Abide = riskless, low-upside, lethal-if-only; Give = riskless, sustains the crew, never moves favor.

| # | Island / Scene | Dare | Abide | Give | Verdict |
|---|---|---|---|---|---|
| 1 | Helios / The Meadow | Dare-1 raises world (wrath); Dare-3 costs favor; Dare-4/6 pay a private/shared stash bounty (high upside) | Inert on 1/3/4; small forage + favor nod only on 6 (low-upside); no per-cell lethality but the island-level restraint-bless rewards cumulative low-world Abide play | Costs the giver a ration, grows the hold; never moves favor | PASS |
| 2 | Helios / The Hunger | Same shape, escalated magnitudes (Dare-6 stash+4/hold+6) | Same low-upside shape | Same | PASS |
| 3 | Helios / The Reckoning | Same shape, climax magnitudes (Dare-6 stash+6/hold+6; Dare-1 world peak) | Same; restraint-bless is the explicit "myth intends" carve-out for collective Abide reward | Same | PASS |
| 4 | Cyclops / The Wine | Dare-6 needs a sober strike for escape progress; Dare-1/3/4 cost a ration for nothing | Riskless but yields zero progress toward the drunk/blind collective threshold — **pure-Abide strands you** (D-02) | Pours wine, costs the shared pool (`crew:penalty`), advances the collective drunk counter; never favor | PASS |
| 5 | Cyclops / The Stake | Dare-1 costs a ration (scald/stumble); Dare-3/4/6 contribute to the pooled `stakeCheck` collective blinding threshold | Riskless but contributes nothing to the collective threshold | Pours more wine, sustains the collective drunk track; never favor | PASS |
| 6 | Cyclops / Under the Sheep | Dare-1 costs a ration for no progress; Dare-3/4 (40% weight each, Pitfall 11) advance individual escape progress; Dare-6 is a flourish escape | Riskless, cling tight — earns zero escape progress (**lethal-if-only**: `onDepart` seizes anyone short of `need`) | Steadies a mate at a small self-cost, tiny hold gain; never favor | PASS |
| 7 | Sirens / The First Notes | High risk-for-reward: favor gain (faces 3/4/6) + Rocks(world) rise; face-1 is the wreck-risk face (extra world, zero favor) | Riskless, thin — bound to the mast, zero gain, zero favor (intentional inversion of the general Abide-6 default) | Binds a mate, reduces the Rocks at a small self-cost; never favor | PASS (Dare-favor is the flagged, sanctioned exception) |
| 8 | Sirens / The Full Song | Same shape; face-1 wreck risk now also costs crew/hold (lure grown physical) | Same | Same | PASS |
| 9 | Sirens / The Reef | Same shape, peak escalation; `onDepart` reef-wreck (world >= doomAt) is the island-level death gate | Same | Same | PASS |
| 10 | Lotus / The Offering | **D-04 label inversion:** Dare = the safe/pro-crew road (haul a struck mate or yourself back), riskless, zero favor | **D-04 label inversion:** Abide = the risky/temptation road (eat the fruit) — low upside (1 free ration) but escalating lotus-struck risk (10% this scene) that leads to death if unrescued (**lethal-if-only**, the sharpest reading in the game per 02-04); face 6 resists and is the island's only favor path | Shares a ration to the hold; never favor | PASS (intentional, documented D-04 exception — underlying risk/reward shape obeys the law's spirit under swapped labels) |
| 11 | Lotus / Going Back | Same inversion; Dare rescues a struck mate | Same inversion; strand risk escalates to faces {1,3} (~50%) | Same | PASS |
| 12 | Lotus / Cast Off | Same inversion; Dare is the last-chance rescue | Same inversion; strand risk escalates to faces {1,3,4} (~90%) — the climax of the taste->drowse->strand arc | Same | PASS |

**Verdict:** The asymmetry holds by inspection across all 12 island scenes. No cell inverts the law in an unintentional way; the only two departures from the vanilla verb-mapping (Lotus's D-04 label swap, Helios's island-level restraint-bless) are pre-existing, explicitly documented design decisions from `02-CONTEXT.md`, already implemented and reviewed in their originating plans (02-01, 02-04), and re-confirmed compliant here at the whole-game level.

## Regression Sweep Results (D-07 completion/determinism gate)

7-seed 0-human sweep via `scratchpad/harness.mjs` (completion + determinism only — the real death-spiral balance sweep is explicitly Phase 3 scope):

| Seed | validateBeats | notYetConverted | Result | THE VERDICT reached |
|---|---|---|---|---|
| demo | ok=true | `[]` | P1 wins, 🫒7 | yes |
| alpha | ok=true | `[]` | P1 wins, 🫒8 | yes |
| beta | ok=true | `[]` | P3 wins, 🫒7 | yes |
| gamma | ok=true | `[]` | P3 wins, 🫒7 | yes |
| delta | ok=true | `[]` | P1 wins, 🫒6 | yes |
| epsilon | ok=true | `[]` | Whole crew dead (no favor left to return) | yes — reached the death-verdict path, still a valid THE VERDICT log line |
| zeta | ok=true | `[]` | P1 wins, 🫒6 | yes |

- `notYetConverted=[]` on every seed confirms all 12 island scenes are on the beats path (`EPISODES` contains only `helios`/`cyclops`/`sirens`/`lotus` — the three anchors Hades/Phaeacia/Ithaca are structurally outside `EPISODES` and are correctly out of this phase's/plan's scope, confirmed by reading `validateBeats()`'s `Object.values(EPISODES).forEach(...)` iteration, index.html:1397-1428).
- Determinism re-check: `diff <(node scratchpad/harness.mjs --seed alpha) <(node scratchpad/harness.mjs --seed alpha)` produced an empty diff — byte-identical replay confirmed.
- `epsilon`'s total-crew-death outcome is expected and acceptable per this plan's explicit scoping ("some seeds ending all-dead is acceptable and expected this pass") and matches the already-documented pre-existing hold-economy death-spiral noted across 02-01 through 02-04's summaries and project memory (`odyssey-crew-playtest-balance`) — Phase 3 does the real balance tuning, not this plan.

## Decisions Made
- Treated Lotus's D-04 Abide/Dare verb-label inversion and Helios's restraint-bless collective bonus as compliant-by-design rather than violations, since both are pre-existing, explicitly documented decisions from `02-CONTEXT.md` already implemented and reviewed in their originating plans — re-litigating or "fixing" either would contradict the phase's own approved design, not correct a bug.
- Scoped the regression sweep to 7 seeds (exceeding the plan's >=5 minimum) to include a genuine total-crew-death outcome (`epsilon`) alongside five distinct winning outcomes, giving the sweep table meaningful variety without expanding into Phase 3's balance-tuning territory.
- Did not touch `index.html` at all — both tasks' `<action>` blocks only call for edits conditional on finding a violation, and none was found; committing "no-op" changes would be scope creep against the plan's own instructions.

## Deviations from Plan

None - plan executed exactly as written. Both audit tasks matched their `<action>` and `<acceptance_criteria>` without requiring any fix, architectural change, or unplanned bug fix — the four per-island plans (02-01 through 02-04) had already correctly closed every favor-law violation and preserved the asymmetry, so this plan's whole-game audit found nothing left to reconcile.

## Issues Encountered
None. The shared `scratchpad/harness.mjs` (built in 02-01, reused unchanged through 02-02/02-03/02-04) needed no modification to serve this plan's multi-seed sweep.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 2's two cross-cutting guarantees (CONTENT-05 asymmetry, CONTENT-06 favor-law) are now proven game-wide, not just per-island — Success Criteria 4 & 5 and Pitfall 6's guardrail are satisfied.
- All 12 island scenes (Helios/Cyclops/Sirens/Lotus x 3) are fully on the beats path with `validateBeats()` returning `notYetConverted:[]` on every sampled seed.
- The known hold-economy death-spiral (documented since 02-01) remains explicitly out of scope and is confirmed still present (`epsilon` seed) but non-blocking — Phase 3's multi-seed balance sweep is the correct place to address it, per `02-CONTEXT.md`'s `<deferred>` section and the roadmap.
- No blockers. Phase 2 is ready to be marked complete.

---
*Phase: 02-themed-island-content-favor-law-reconciliation*
*Completed: 2026-07-26*

## Self-Check: PASSED

- FOUND: .planning/phases/02-themed-island-content-favor-law-reconciliation/02-05-SUMMARY.md
- FOUND: harness still passes (node scratchpad/harness.mjs --seed demo, exit 0)
