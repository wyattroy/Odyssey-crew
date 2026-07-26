---
phase: 03-anchor-verb-retrofit-balance-retune
plan: 04
subsystem: game-economy
tags: [vanilla-js, single-file, deterministic-rng, headless-vm-testing]

# Dependency graph
requires:
  - phase: 03-anchor-verb-retrofit-balance-retune
    provides: "03-01's CONFIG.econ/econD()/VERBS/DELTA_KEYS/crewFavor()/doomFloor()/doomToll() tracer (proven on Helios) and 03-03's Cyclops/Lotus re-authoring pattern (including the no-favor-grant-on-Dare precedent), both landed ahead of this plan"
provides:
  - "EPISODES.sirens fully re-authored on two verbs: Dare unstops your ears for the song (plain econD() dare shape — stash/kleos on a clean listen, favor COST when caught, escalating tiers 0/1/2), Abide stays bound to the mast and keeps hands on oar/ropes (plain econD() abide shape, the old bind-a-mate action folded in where it always belonged)"
  - "The Dare-favor discretion question settled: the three-verb model's sanctioned exception is RETIRED under two verbs — Dare's relationship to favor stays a pure cost on every island, no carve-outs"
  - "sirens.onDepart rewired onto crewFavor()/doomFloor() via the SAME shared doomToll() helper Helios uses (capped, never the last living sailor), replacing the old bespoke per-player die-throw catastrophe"
  - "CONFIG.sirens retired its peril-denominated interim keys (listenFavor/worldPerListen/bindReduce/wreckWorldExtra/wreckCrew) for favor-denominated, tier-indexed wreckHold/wreckFavorExtra"
  - "ONE consolidated FAVOR LAW comment block above EPISODES stating the law and its (now empty) exception list; every island's own design note points at it instead of restating it"
  - "A whole-game favor-movement audit (recorded below) that found and fixed one real bug: Cyclops's onDepart death-clawback was missing the Math.max(0, islandFavorEarned) guard its two sibling clawback sites already had"
  - "The last 03-01 interim-conversion comment (Sirens' own) removed from the file"
affects: [03-05-anchor-retrofit, 03-06-board-update, 03-07-balance-retune]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pattern: a scene whose worst face carries BOTH a deniable hold/crew loss AND an unconditional favor cost splits them across `d` (crew only, denied whole if the hold can't cover it) and `alwaysD` (the favor cost, computed by calling econD() for the base figure and layering a named CONFIG.<episode> kicker on top) — WR-03's invariant applied to a Dare-specific wreck mechanic rather than Lotus's rescue-fx precedent."
    - "Pattern: a single consolidated law comment block (here: FAVOR LAW, placed immediately above EPISODES) with per-island design notes pointing at it rather than restating it — avoids the copy-paste drift risk of the same law/exception list being independently stated four times."
    - "Pattern: death-clawback sites that zero out survival-contingent favor gains must guard with Math.max(0, p.islandFavorEarned) — islandFavorEarned can be net-negative (a Dare-heavy island), and without the guard a death clawback would REFUND that loss instead of merely failing to bank the gain."

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "Sirens' Dare-favor exception (the three-verb model's single sanctioned exception) is RETIRED under two verbs, not carried forward. Dare's only relationship to favor stays a cost everywhere — recommended default per the plan, matches Cyclops's own 03-03 decision, and keeps the favor law exceptionless game-wide."
  - "Sirens' Abide uses the PLAIN econD('abide',tier,face) shape with no scene-specific kicker (unlike Cyclops's wine-pour/steady-cost or Lotus's rations bonus) — Sirens has no per-cell resource cost the design calls out; the standard shape (feed the hold, high roll earns favor) is the whole story."
  - "The reef-wreck face's favor cost is computed by calling econD() for the base dareCaught figure and then layering a named CONFIG.sirens.wreckFavorExtra[tier] kicker on top, applied via `alwaysD` rather than `d` — reconciles the acceptance bar's 'every d produced by econD()' language with the WR-03 requirement that the crew/hold loss stay independently deniable while the favor cost lands unconditionally. Documented explicitly since a maximally literal reading of the acceptance bullet would have broken the correctness invariant instead."
  - "The whole-game favor-law audit found ZERO currently-sanctioned exceptions: Sirens' retirement (this plan) plus Cyclops's stake (03-03) and Lotus's Dare road (never touches favor) each declined the one place their own island could have added a Dare-favor grant. The favor law is, as of this plan, fully exceptionless."
  - "Fixed Cyclops's onDepart death-clawback (found during the Task 2 audit, not previously touched by this plan) to match its two sibling sites' Math.max(0, islandFavorEarned) guard — see Deviations."

patterns-established: []

requirements-completed: [BALANCE-03]

coverage:
  - id: D1
    description: "Sirens re-authored on two verbs across all 3 scenes (The First Notes/The Full Song/The Reef): Dare unstops your ears (plain econD dare shape, stash/kleos on a clean listen, favor cost when caught, escalating), Abide stays bound to the mast (plain econD abide shape, hold + high-roll favor); the reef doom reads off crewFavor()/doomFloor() via the shared doomToll() helper, capped and never wiping the last living sailor; the wreck-face penalty lands even with an empty hold"
    requirement: "BALANCE-03"
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
        ref: "custom dev-only harness run (not committed): an all-greedy 4-crew seed ('greedy-0') wrecks on the reef (doomToll fires, 2 of 4 crew taken, run still reaches THE VERDICT); the default mixed-temperament seed ('demo'/'reef-0') sails past safely — reef doom confirmed reachable but not inevitable"
        status: pass
      - kind: unit
        ref: "custom dev-only vm probe (not committed): forced state.hold=0 then called resolveEffect() directly on the Sirens tier-1 Dare face-1 wreck cell — favor cost (-3) still applied in full (denied:true, hold stayed 0), confirming the WR-03 alwaysD invariant"
        status: pass
    human_judgment: false
  - id: D2
    description: "One consolidated FAVOR LAW block in index.html states the two-verb law and lists every sanctioned exception (currently none) across all four islands; every favor-touching site in the file is classified in the audit table below with zero unclassified entries; one real inconsistency (Cyclops onDepart's clawback) found and fixed during the audit"
    requirement: "BALANCE-03"
    verification:
      - kind: unit
        ref: "node scratchpad/econcheck.mjs"
        status: pass
      - kind: integration
        ref: "node scratchpad/harness.mjs --seed demo"
        status: pass
      - kind: integration
        ref: "node scratchpad/parity.mjs --seed demo"
        status: pass
      - kind: integration
        ref: "node scratchpad/sweep.mjs 80 (errors/incomplete: 0, no-winner: 0) — full output recorded verbatim below"
        status: pass
    human_judgment: false

# Metrics
duration: 50min
completed: 2026-07-26
status: complete
---

# Phase 3 Plan 4: Sirens Re-Authored, Favor Law Consolidated, Balance Audited Summary

**Sirens now reads as rewarded temptation on two verbs (Dare unstops your ears for stash/kleos, Abide stays bound to the mast for hold+favor), its reef doom rewired onto crewFavor()/doomToll(); a single consolidated FAVOR LAW block replaces four scattered restatements and the whole-game audit found and fixed one real clawback bug, confirming favor stays contested but survival no longer is (03-07's tuning input).**

## Performance

- **Duration:** ~50 min
- **Started:** 2026-07-26T20:05:00Z (approx, following 03-03 session close)
- **Completed:** 2026-07-26T20:55:00Z
- **Tasks:** 2 (both `type="auto"`, no checkpoints)
- **Files modified:** 1 (index.html)

## Accomplishments

- Re-authored all three Sirens scenes (The First Notes / The Full Song / The Reef) on the two-verb reading: Dare's `d` is the plain `econD('dare',tier,face)` shape used everywhere else (Helios/Cyclops) — stash/kleos grants on a clean listen via `dareStash`, a favor COST when the gods catch you via `dareCaught`, and Dare never grants favor anywhere on this island. Abide's `d` is likewise the plain `econD('abide',tier,face)` shape (no scene-specific kicker — Sirens has no per-cell resource cost the design calls out) — the old third-verb bind-a-mate/haul-the-oar action folds into Abide's narration, exactly where it always belonged (D-02).
- Settled the one open authoring question the design contract left to discretion: whether the three-verb model's sanctioned Sirens Dare-favor exception (a high Dare roll blessed with favor) survives the two-verb re-model. **Retired it.** Under two verbs, Dare's only relationship to favor is a cost (D-03); grafting a favor grant onto Dare here would have been the one place in the whole game a player could farm favor by transgressing. This is the plan's own recommended default and matches Cyclops's 03-03 decision, so the favor law now reads identically on every island. Recorded in the island's own design-note comment.
- Rewired `sirens.onDepart` from a bespoke per-player die-throw catastrophe onto the SAME shared `doomToll()` helper Helios uses: reads `crewFavor()` against `doomFloor()`, capped at `CONFIG.divine.doomMaxToll`, never taking the last living sailor. The reef's worst face keeps the WR-03 split from the interim conversion — the `crew`/hold loss stays deniable in `d` while the favor cost (computed by calling `econD()` for the base figure, then layered with a named `CONFIG.sirens.wreckFavorExtra[tier]` kicker) lives in `alwaysD` so it lands even when an empty hold denies the crew draw. Verified directly with a forced `state.hold=0` probe: the favor penalty still applies in full.
- Retired `CONFIG.sirens`'s peril-denominated interim keys (`listenFavor`/`worldPerListen`/`bindReduce`/`wreckWorldExtra`/`wreckCrew`) for two tier-indexed, favor/hold-denominated keys (`wreckHold`/`wreckFavorExtra`) matching every other island's D-10 escalation shape. Removed the last 03-01 interim-conversion comment (both at `CONFIG.sirens` and at `EPISODES.sirens`).
- Added ONE consolidated `FAVOR LAW` comment block immediately above `const EPISODES = {` — states the law in its final form (Abide is the only favor road; Dare's favor is only ever a cost; nothing else moves favor except four named voyage-level sources: the Troy allocation, an island's departure blessing, the revival tolls, and Ithaca's Reckoning pot) and lists every sanctioned exception (currently none). Trimmed each island's own design-note comment (Helios, Cyclops, Sirens, Lotus) to point at this block instead of restating the law.
- Audited every live `favor`-touching site in the file (full table below) and found one real bug: Cyclops's `onDepart` death-clawback (`victim.favor = Math.max(0, victim.favor - victim.islandFavorEarned)`) was missing the inner `Math.max(0, ...)` guard around `islandFavorEarned` that its two sibling clawback sites (`polyphemusHunger`, `stakeCheck`) already had. Without the guard, a sailor who died after a net-negative island (Dare's own costs outweighing any Abide gains) would have been incorrectly REFUNDED that loss on death instead of merely forfeiting unbanked gains. Fixed to match the other two sites (Rule 1 — bug found directly by this plan's own audit task, in scope by the task's own explicit mandate).
- Ran `sweep.mjs 80` and recorded the two BALANCE-03 signals verbatim (see below): favor stays genuinely contested (13 distinct winner-favor values, no convergence) and cooperation (pious/abide) out-accumulates favor over defection (greedy/dare) by a wide margin — the win-condition half of D-09 holds. The survival half does not: all three temperaments now survive at ~100%, unchanged from 03-02/03-03's already-flagged over-correction. Diagnosed and handed to 03-07 rather than retuned here.

## Task Commits

1. **Task 1: Sirens on two verbs — the song, the mast, and the reef read off crew favor** - `5beca46` (feat)
2. **Task 2: Whole-game favor-law audit — one written law, one list of exceptions, one contested-favor measurement** - `e2b2f7d` (feat)

**Plan metadata:** (this commit, docs: complete 03-04)

## Files Created/Modified

- `index.html` - `CONFIG.sirens` retired its interim peril-denominated keys for `wreckHold`/`wreckFavorExtra` (tier-indexed); `EPISODES.sirens` fully re-authored (all 3 scenes' beats, verb labels, `onDepart` rewired onto `doomToll()`); a new consolidated `FAVOR LAW` comment block added above `EPISODES`; Helios/Cyclops/Lotus design-note comments trimmed to reference it; `botDecide`'s Sirens branch comment finalized (no longer INTERIM); Cyclops's `onDepart` death-clawback fixed to match its sibling sites' `Math.max(0, islandFavorEarned)` guard.

## Decisions Made

See `key-decisions` in frontmatter for the full list. In summary:
- **Sirens Dare-favor exception: RETIRED**, not carried forward. Dare never grants favor on any island, no exceptions, as of this plan.
- **Sirens Abide: plain `econD()` shape, no scene kicker** — matches Helios's simplicity rather than Cyclops's/Lotus's per-cell cost/bonus pattern, since nothing in the design calls for one here.
- **Reef-wreck favor cost: computed via `econD()`, applied via `alwaysD`** — reconciles "every `d` produced by `econD()`" with the WR-03 requirement that the hold loss stay independently deniable.
- **Favor-law audit: zero currently-sanctioned exceptions.** Documented as the audit's headline finding.
- **Cyclops `onDepart` clawback: fixed to match its siblings**, found and corrected during the Task 2 audit (see Deviations).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Cyclops's onDepart death-clawback could refund a net-negative island's Dare losses on death**
- **Found during:** Task 2 (whole-game favor-movement audit)
- **Issue:** Three sites in the file claw back a dying player's `islandFavorEarned` (the net favor delta accrued while on the current island) so a sailor who dies before an island resolves forfeits favor-road gains earned there: `polyphemusHunger()`, `stakeCheck()`'s stake-slip branch, and Cyclops's `onDepart()` escape-failure branch. The first two already guarded with `Math.max(0, victim.islandFavorEarned)` (so a net-negative island — Dare costs exceeding any Abide gains — never gets refunded on death); `onDepart()`'s formula was missing that inner guard, meaning a player who died on this specific branch after a net-negative island would have had favor ADDED BACK (since subtracting a negative islandFavorEarned increases the result), a genuine reward-for-failure edge case.
- **Fix:** Added the same `Math.max(0, ...)` guard to `onDepart()`'s clawback, matching its two siblings exactly.
- **Files modified:** `index.html`
- **Verification:** `node scratchpad/econcheck.mjs`/`harness.mjs --seed demo`/`parity.mjs --seed demo` all still pass; the fix is a pure bugfix with no beats-table shape change, so no new gate was needed beyond re-running the existing suite.
- **Committed in:** `e2b2f7d` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (a real, if narrow, favor-refund bug found by this plan's own audit mandate, not introduced by this plan's changes)
**Impact on plan:** Minor in practice (the branch only fires when the Cyclops escape fails outright, a low-frequency path), but exactly the class of "unflagged favor movement" T-03-13 exists to catch — fixed per Task 2's own explicit instruction ("Any movement that fits none of those four is a bug — fix it... rather than adding an exception to cover it"), not left as a footnote.

## Issues Encountered

- Reconciling the plan's own acceptance-bullet language ("every Sirens payoff cell's `d` is produced by `econD(...)`") with the WR-03 invariant it explicitly also requires ("the [wreck] penalty must stay in alwaysD... that invariant is correct and stays") took real judgment, since a maximally literal reading of the first bullet would have required bundling the favor cost back into `d`, breaking the second. Resolved the same way 03-03 resolved its own Cyclops-Dare-favor tension: read the two lines together rather than in isolation, keep correctness (WR-03) as the hard constraint, and document the reasoning explicitly (see Decisions and the in-code comment above the wreck cells) rather than silently picking one reading.
- The favor-law audit surfaced fewer "movements to classify" than expected once Sirens' exception was retired — the exceptions list in the consolidated block ended up genuinely EMPTY. This is a legitimate, positive outcome (the law is now fully exceptionless), not a sign the audit missed something; confirmed by an exhaustive `grep` sweep of every live `.favor` mutation site in the file (see the audit table below) before concluding.

## Favor-Movement Audit Table (Task 2)

Every live favor-mutating site in `index.html`, classified into exactly one of: **favor road** (Abide), **cost** (Dare caught), **named voyage-level source**, or **listed exception**. Zero unclassified entries.

| Site (function / line) | Verb | Direction | Classification |
|---|---|---|---|
| `econD()` — `d.favor = e.abideFavor[tier][face]` (~403) | Abide | grant (high roll) | Favor road — the shared mechanism every island's Abide uses |
| `econD()` — `d.favor = e.dareCaught[tier][face]` (~406) | Dare | cost (low roll) | Cost — the shared mechanism every island's Dare uses |
| Sirens reef-wreck cells — `alwaysD.favor` (~1527, ~1553) | Dare | cost (escalated) | Cost — `econD()`'s base dareCaught figure plus the named `wreckFavorExtra[tier]` kicker, applied unconditionally per WR-03 |
| Lotus tier-2 face-4 cancellation — `favor:-(CONFIG.econ.abideFavor[2][4]\|\|0)` (~1665) | Abide | cancellation (nets to 0) | Favor road enforcement — a struck sailor never also earns favor; this cancels the shared grant, it does not add a new one |
| Cyclops `prideSubCommit` boast — `p.favor -= CONFIG.cyclops.boastFavorCost` (~1432) | Dare (the pride sub-commit's own dare/abide choice) | cost (unconditional) | Cost — boasting is the self-interested/dare choice and always costs favor, matching D-03's spine even though it isn't gated by a die face |
| Cyclops `polyphemusHunger` clawback — `Math.max(0, victim.favor - Math.max(0, victim.islandFavorEarned))` (~1716) | n/a (death penalty) | remove (survival-contingent) | Favor road enforcement — strips only unbanked Abide-road gains from this island, never refunds Dare losses |
| Cyclops `stakeCheck` clawback — same formula (~1730) | n/a (death penalty) | remove (survival-contingent) | Favor road enforcement — same as above |
| Cyclops `onDepart` clawback — same formula, **fixed this plan** (~1447) | n/a (death penalty) | remove (survival-contingent) | Favor road enforcement — now matches its two siblings (see Deviations) |
| Helios `onDepart` restraint blessing — `p.favor += CONFIG.helios.restraintBless` for all living (~1305) | n/a (voyage-level) | grant | Named voyage-level source — an island's departure blessing |
| `favorRevive()` — `payer.favor -= toll` (~1914) | n/a (voyage-level) | cost | Named voyage-level source — the revival tolls (Charon self-pay / Orpheus crewmate-pay) |
| `setupTroy()` — `p.favor += (7 - t)` (~2105) | n/a (voyage-level) | grant (restraint-scaled) | Named voyage-level source — the Troy allocation |
| `runIthaca()` Reckoning pot — `p.favor += share` (~2030, ~2033) | n/a (voyage-level) | grant | Named voyage-level source — the finale's pot |

**Sanctioned exceptions found:** NONE. The favor law is, as of this plan, fully exceptionless — every movement above resolves cleanly into the favor road, a cost, or a named voyage-level source; no site required a flagged carve-out.

## Contested-Favor Measurement (Task 2, BALANCE-03)

`node scratchpad/sweep.mjs 80` — full output, recorded verbatim:

```
=== BALANCE SWEEP: 80 seeds (0-human auto) ===
errors/incomplete: 0
no-winner / incomplete: 0
ALL-DEAD (death-spiral): 0 (0%)
≥1 survivor (reached Ithaca alive): 80 (100%)
full crew (4) survived: 78 (98%)
survivor-count distribution: {"0":0,"1":0,"2":0,"3":2,"4":78}
mean survivors: 4.0
seeds with ≥1 death: 51 (64%)
winner favor — min/avg/max: 6/11.8/18
favor spread (distinct winner favors): 6,7,8,9,10,11,12,13,14,15,16,17,18 (13 distinct)
by temperament (alive-rate | avg favor):
  greedy: 100% alive | favor -2.1
  balanced: 99% alive | favor 6.0
  pious: 100% alive | favor 10.6
```

**Is favor contested?** Yes — 13 distinct winner-favor values across 80 seeds (6 through 18), no convergence to a single total; the ranking still discriminates between players' choices.

**Does the cooperate/defect split point the intended way?** Half yes, half no. On the WIN axis it does: pious/abide accumulates far more favor than greedy/dare (10.6 vs -2.1 avg), so cooperation is clearly the way to win, matching D-09. On the SURVIVE axis it does not: all three temperaments now survive at ~100% (greedy 100%, balanced 99%, pious 100%), so greedy is not "surviving but poor" relative to a "fragile" pious road — everyone survives essentially equally well. This is the SAME over-correction 03-02 (18% all-dead) and 03-03 (0% all-dead, 93% full-crew) already flagged, unchanged by this plan (Sirens' re-authoring and the favor-law audit are content/bookkeeping changes, not economy-magnitude changes).

**Named diagnosis for 03-07:** the survival axis is flat because CONFIG.econ.dareStash's shared magnitudes (used identically by Helios/Cyclops/Sirens's Dare roads) grant real stash gains broadly enough that starvation risk stays low regardless of temperament, while CONFIG.divine's doom/bless thresholds (doomFloorPerMate:0, blessFloorPerMate:4) sit far enough apart that the crew rarely approaches doomFloor() even on a greedy-leaning run. 03-07 should pull `CONFIG.econ.dareStash` down and/or tighten `CONFIG.divine.doomFloorPerMate` upward (or `roughStep`/`maxExtraBlue` for the sea-crossing side) to restore the "greedy survives but poor, pious wins but fragile" contested shape D-09 calls for — this plan intentionally leaves those CONFIG magnitudes untouched, per its own scope (measurement, not tuning).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All four islands are now fully authored on the two-verb economy (Helios in 03-01, Cyclops/Lotus in 03-03, Sirens here) — no interim conversion remains anywhere in `index.html` (confirmed by `grep` for the retired Sirens CONFIG keys and the removed INTERIM comments).
- 03-05 (anchor retrofit: Hades/Phaeacia/Ithaca) can proceed independently — this plan touched none of those beats, only the four island episodes and the shared favor-law documentation.
- 03-06 (board update) is unaffected by this plan's content-only changes.
- **Concern for 03-07 (balance retune), carried forward from 03-02/03-03 and reconfirmed here:** the survival axis of D-09 ("greedy survives but poor, pious wins but fragile") does not hold — all three temperaments survive at ~97-100% across 80 seeds. The win axis (favor spread + pious out-earning greedy) does hold. 03-07's named tuning input: pull `CONFIG.econ.dareStash` down and/or raise `CONFIG.divine.doomFloorPerMate` (and possibly `roughStep`/`maxExtraBlue`) to reintroduce real survival risk on the defect road without breaking the now-solid win-condition contrast.
- The favor law is now stated exactly once in the file (the consolidated `FAVOR LAW` block above `EPISODES`) with zero currently-sanctioned exceptions — any future author adding island content or a new exception has one place to update, not four.

## Self-Check: PASSED

All modified files verified present on disk (index.html, this SUMMARY.md). Both task commit
hashes (5beca46, e2b2f7d) verified present in `git log --oneline --all`.

---
*Phase: 03-anchor-verb-retrofit-balance-retune*
*Completed: 2026-07-26*
