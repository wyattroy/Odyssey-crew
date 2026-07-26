---
phase: 03-anchor-verb-retrofit-balance-retune
plan: 03
subsystem: game-economy
tags: [vanilla-js, single-file, deterministic-rng, headless-vm-testing]

# Dependency graph
requires:
  - phase: 03-anchor-verb-retrofit-balance-retune
    provides: "03-01's CONFIG.econ/econD()/VERBS/DELTA_KEYS tracer (proven on Helios) and 03-02's generalized favorRevive()/revivalRound() lifeline, both landed ahead of this plan"
provides:
  - "EPISODES.cyclops fully re-authored on two verbs: Abide (guest-gift — pour wine/brace stake/steady a mate) built from econD()+CONFIG.cyclops.winePour/steadyCost kickers; Dare (self-interested — strike sober/drive stake/slip out first) built from plain econD() dareStash/dareCaught, escalating across all 3 scenes"
  - "EPISODES.lotus fully re-authored on two verbs, keeping the deliberate D-04 inversion: Abide (take the fruit) now feeds the commons via econD()+CONFIG.lotus.rations instead of the taker's own satchel; Dare (haul back) unchanged in mechanics (lotusDareFx/lotusDareTell), d stays empty since the cost lives in the fx escape hatch"
  - "The 03-01 interim-conversion comment blocks removed from both islands' source"
  - "Cyclops's stakeCheck()/polyphemusHunger() comments updated to state the Dare-favor-cost-not-grant distinction explicitly, and the deliberate non-adoption of a Dare-favor-grant exception at the stake's success branch"
  - "Fixed a stale pre-redesign 'pride' prompt string that still referenced the retired Poseidon-curse mechanic instead of the new favor-cost/seas-roughening chain"
affects: [03-04-sirens-reauthor, 03-05-anchor-retrofit, 03-06-board-update, 03-07-balance-retune]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pattern: a scene whose Abide action has a genuine per-scene cost (Cyclops's wine pour, or a rescuer's steadying effort) layers that cost as a CONFIG.<episode>-sourced negative kicker inside econD()'s `extra` parameter, netted against the shared CONFIG.econ.abideHold tier value — never a bare integer, and the net can legitimately be zero at low faces."
    - "Pattern: when a scene's own escalating mechanic (Lotus's CONFIG.lotus.struckOn) collides with the shared CONFIG.econ tier tables (a face that both strands AND would earn favor), the conflicting favor grant is explicitly cancelled via `extra:{favor:-(CONFIG.econ.abideFavor[tier][face]||0)}` at that one cell, with an inline comment naming why — the shared tuning surface stays intact for every other island."
    - "Pattern: a Dare mechanic that must always COST the actor (never grant, per its own design) does not route through econD()'s dareStash (which only ever grants `you`) — its `d` stays an empty object and the real cost lives in the cell's `fx` escape hatch, exactly as Lotus's rescue already did before this plan."

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "Cyclops's Dare now costs favor on a bad roll (dareCaught, 'the gods mark the recklessness') but still never GRANTS it anywhere — the island's only favor GRANTS come from Abide's high rolls. This is a deliberate reconciliation of two lines in the plan's own text (see Deviations)."
  - "The stake's collective success (stakeCheck) does NOT take the sanctioned Dare-favor-grant exception — escape progress is the only reward. This is the plan's own stated default, not a flagged exception; recorded here per the plan's explicit ask."
  - "For Cyclops's 'attack a monster' Dare cells (Scenes 1 and 3), used the STANDARD econD(dare, tier, face) shape (dareStash grants stash on non-1 faces, dareCaught costs favor on face 1, and on face 3 at tiers 1-2) rather than hand-rolling a bespoke cost-only shape — this reads as 'real personal upside' (the plan's own phrase) for a self-interested verb, and keeps every cell literally produced by econD() with zero cancellation hacks."
  - "For Lotus's free-meal magnitude, kept the existing CONFIG.lotus.rations key but repointed it from a `you` (satchel) bonus to a `crew` (hold) kicker passed through econD()'s `extra` — satisfies both 'produced by econD()' and 'traces to a named CONFIG.lotus key' simultaneously."
  - "Lotus's Cast-Off (tier 2) face 4 explicitly cancels the shared CONFIG.econ.abideFavor[2][4] grant since CONFIG.lotus.struckOn[2] also strands that face — a struck sailor never also earns favor, keeping 'only face 6 escapes and is rewarded' literally true at the highest tier."

patterns-established: []

requirements-completed: [BALANCE-01]

coverage:
  - id: D1
    description: "Cyclops re-authored on two verbs across all 3 scenes (The Wine/The Stake/Under the Sheep): Abide is the guest-gift road (wine pour, brace-the-stake, steady-a-mate) built from econD()+CONFIG.cyclops kickers with escalating hold/favor; Dare is the self-interested road (strike sober, drive the stake, slip out first) built from plain econD() with stash-gain-on-success and favor-cost-when-caught; the drunk counter, collective stake check, individual escape, and boast all fire correctly"
    requirement: "BALANCE-01"
    verification:
      - kind: unit
        ref: "node scratchpad/econcheck.mjs"
        status: pass
      - kind: integration
        ref: "node scratchpad/harness.mjs --seed demo (+ 3 more seeds: alpha, beta, gamma)"
        status: pass
      - kind: integration
        ref: "node scratchpad/parity.mjs --seed demo"
        status: pass
      - kind: integration
        ref: "node scratchpad/sweep.mjs 40 (errors/incomplete: 0, no-winner: 0)"
        status: pass
      - kind: integration
        ref: "custom 40-seed transcript scan (scratchpad, dev-only, not committed): the giant is blinded (BLINDED log line) in 20/40 seeds that reach him (50%) — reachable and meaningful, not a de facto dead outcome (Pitfall 11)"
        status: pass
      - kind: integration
        ref: "transcript inspection (seed sweep-0): a BOAST line is immediately followed in the same island departure by 'the crossing bag is salted with N extra blue' — the boast's favor cost visibly roughens the very next crossing through seasExtraBlue()"
        status: pass
    human_judgment: false
  - id: D2
    description: "Lotus re-authored on two verbs across all 3 scenes (The Offering/Going Back/Cast Off), keeping the deliberate Abide/Dare inversion: Abide (take the fruit) now feeds the commons via econD()+CONFIG.lotus.rations rather than the taker's satchel, with the strand escalation (CONFIG.lotus.struckOn) and per-face stakes preview intact; Dare (haul back) unchanged (lotusDareFx/lotusDareTell), no favor anywhere"
    requirement: "BALANCE-01"
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
        ref: "custom 40-seed transcript scan (scratchpad, dev-only, not committed): stranding fires in 12/40 seeds (30%, e.g. sweep-1/2/4/6/7) and rescue fires in 39/40 seeds (98%, e.g. sweep-0..sweep-4) — both mechanics reachable and escapable"
        status: pass
      - kind: unit
        ref: "code inspection: every lotusAbideFx/lotusDareTell tell() closure reads state without mutating it; stakesLine()'s anyFx check still finds a function fx on every Abide face, so the row-per-face preview path is unchanged"
        status: pass
    human_judgment: false
  - id: D3
    description: "The Lotus act prompt renders the per-face stakes preview (row-per-face, showing both payoff and strand flavor) in an actual browser at http://localhost:8777/?seed=demo&humans=1&speed=0"
    verification: []
    human_judgment: true
    rationale: "No live browser is available in this headless sandbox (same documented constraint as 03-01/03-02's equivalent coverage items). Substituted evidence: stakesLine()'s anyFx detection (unchanged by this plan) still finds a function-valued fx on every Lotus Abide face, so the existing row-per-face rendering path is structurally guaranteed to fire; every tell() closure was manually re-verified to read only state.ep.lotusFreed/CONFIG (no mutation). A human or orchestrator browser pass is still owed to visually confirm layout, matching the same outstanding item from 03-01/03-02."

# Metrics
duration: 55min
completed: 2026-07-26
status: complete
---

# Phase 3 Plan 3: Cyclops & Lotus Re-Authored on Two Verbs Summary

**Cyclops now reads as pride and cunning (guest-gift Abide vs. self-interested Dare) and Lotus keeps its forgetting-vs-the-voyage inversion (fruit-into-the-commons Abide vs. survival Dare) — both fully rebuilt on `econD()`+named `CONFIG.<episode>` kickers with escalating payoffs, replacing 03-01's mechanical interim conversion.**

## Performance

- **Duration:** ~55 min
- **Started:** 2026-07-26T19:00:00Z (approx, following 03-02 session close)
- **Completed:** 2026-07-26T19:55:52Z
- **Tasks:** 2 (both `type="auto"`, no checkpoints)
- **Files modified:** 1 (index.html)

## Accomplishments

- Re-authored all three Cyclops scenes (The Wine / The Stake / Under the Sheep) on the guest-gift-vs-self-interest reading: Abide's wine-pour/stake-brace/mate-steady cells now build `d` via `econD('abide', tier, face, {crew:-CONFIG.cyclops.winePour})` or `{you:-CONFIG.cyclops.steadyCost}`, netting the scene's own cost against the shared rising `CONFIG.econ.abideHold` tier value (faces net to 0 at the low end, positive at the high end, plus favor on high rolls). Dare's strike/drive/slip cells build `d` via plain `econD('dare', tier, face)` — real stash upside on a good roll, a favor cost (never a grant) when caught. The drunk-counter `fx`, `stakeCheck()`'s collective threshold, the individual escape-progress `fx` (moved onto faces 3 and 4 at Scene 3 per Pitfall 11, not just the rare face), and `prideSubCommit()`'s boast are all intact and verified firing.
- Finalized `prideSubCommit()` and fixed a stale 'pride' prompt string that still described the retired Poseidon-curse mechanic ("curses the ship") — rewritten to state plainly that the boast costs the boaster's own favor and that low crew favor roughens every crossing ahead through the one currency (`seasExtraBlue()`), verified end-to-end in a transcript (boast → favor drop → very next crossing salted).
- Re-authored all three Lotus scenes (The Offering / Going Back / Cast Off) keeping the D-04 inversion: Abide's fruit-eating cells now build `d` via `econD('abide', tier, face, {crew: CONFIG.lotus.rations})` — the free meal feeds the shared hold, never the taker's own satchel, matching the general Abide rule used everywhere else. `CONFIG.lotus.struckOn`'s taste→drowse→strand escalation is untouched. At the final tier, face 4 still strands (per `struckOn[2]`) but its would-be shared `abideFavor` grant is explicitly cancelled so a struck sailor never also earns favor — only face 6 both escapes the fruit and is rewarded, as the plan requires. Dare (haul back) is mechanically unchanged: `lotusDareFx`/`lotusDareTell` still find a struck mate, clear them at a small cost to the rescuer, and never touch favor.
- Removed both islands' 03-01 interim-conversion comment blocks and replaced them with design-note comments explaining the final two-verb reading (guest-gift/self-interested for Cyclops; the fruit/haul-back inversion for Lotus).
- Updated `stakeCheck()`'s own comment to name the deliberate choice NOT to take the sanctioned Dare-favor-grant exception on the stake's success branch (escape progress alone), matching the same pattern Sirens already uses for its own sanctioned exception.

## Task Commits

1. **Task 1: Cyclops on two verbs — the guest-gift road and the cunning road, all three scenes** - `e2fc745` (feat)
2. **Task 2: Lotus on two verbs — the fruit and the haul-back, all three scenes** - `c32808f` (feat)

**Plan metadata:** (this commit, docs: complete 03-03)

## Files Created/Modified

- `index.html` - `CONFIG.cyclops` gained `winePour`/`steadyCost` kickers; `EPISODES.cyclops` fully re-authored (all 3 scenes' beats, verb labels, `prideSubCommit()`); `stakeCheck()`'s comment updated; the 'pride' prompt string fixed. `CONFIG.lotus`'s `rations` comment updated to describe its new hold-kicker role; `EPISODES.lotus` fully re-authored (all 3 scenes' Abide beats; Dare beats unchanged); both islands' 03-01 interim-conversion comments replaced.

## Decisions Made

- **Cyclops's Dare may cost favor, never grant it (anywhere on this island).** The plan's own verb-reading text ("the low roll is the moment... the gods mark the recklessness with a favor cost") and its acceptance bullet ("otherwise Cyclops grants no favor on Dare anywhere") read, at first glance, like they might conflict. Resolved by reading "grants... on Dare" narrowly (a GRANT is a positive award; a COST is a debit) — Dare may cost favor via `dareCaught` on a bad roll, but the island's only favor GRANTS remain on Abide's high rolls, and the stake's own collective success bonus (the one place a Dare-favor GRANT could be added as the sanctioned flagged exception, per the acceptance bullet) explicitly does NOT take that option.
- **Cyclops's "attack" Dare cells use the standard econD() dare shape.** Initially considered hand-building a cost-only shape for Scenes 1 and 3 (since a literal reading of "low faces cost the actor" could mean ALL non-top faces should cost, not gain). Chose instead to use plain `econD('dare', tier, face)` uniformly — `dareStash` only ever grants at faces 3/4/6 (never face 1), so face 1 is still a pure cost, and faces 3/4 narrate as "no clean strike lands, but you scavenge opportunistically" rather than a combat success. This keeps every Dare cell literally produced by `econD()` (no cancellation hacks) and matches the plan's own "real personal upside" framing for a self-interested verb.
- **Lotus's Dare cells keep an empty `d` and route their real cost through `fx`.** `econD()`'s dare shape only ever GRANTS stash (`dareStash`), never costs it — but Lotus's rescue move must always cost the rescuer's own stash, never grant anything. Rather than force an artificial cancellation, `d:{}` stays empty (no bare integer, trivially in-vocabulary) and `lotusDareFx` (unchanged from 03-01) applies the real, always-the-same cost. This is the same pattern the plan's own text anticipates ("a flat `d` can't express... the fx escape hatch").
- **Lotus's `CONFIG.lotus.rations` repointed from a `you` bonus to a `crew` kicker.** Satisfies both "every d comes from econD()" and "the free-meal magnitude traces to a named CONFIG.lotus key" simultaneously, and matches the plan's explicit direction that the meal now goes to the commons, not the taker's belly.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Stale pre-redesign 'pride' prompt referenced the retired Poseidon-curse mechanic**
- **Found during:** Task 1 (re-authoring `prideSubCommit()` and its documentation)
- **Issue:** The human-facing prompt for the `pride` decision kind (in `askHuman()`) still read "Boast... but it curses the ship (Poseidon worsens every future crossing)" — a leftover from before the 03-01 currency fold that no longer describes what the code actually does (the boast debits the boaster's own favor, which then feeds `seasExtraBlue()`).
- **Fix:** Rewrote the prompt to state plainly that boasting costs `CONFIG.cyclops.boastFavorCost` favor and that low crew favor roughens every crossing ahead.
- **Files modified:** `index.html`
- **Verification:** Transcript inspection (seed sweep-0) confirms the boast log line and the very next crossing's salted-bag line both fire in the expected causal order.
- **Committed in:** `e2fc745` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (stale prose left over from a prior plan, not this plan's own new content)
**Impact on plan:** Minor, disclosure-only — a documentation/prompt-text bug in code adjacent to this task's own changes, fixed inline per Rule 1.

## Issues Encountered

- Reconciling the plan's own text on Cyclops's Dare-favor behavior (see Decisions above) took the most design judgment in this plan — the verb-reading paragraph and the acceptance bullet read as being in tension until read carefully together. Resolved by treating "grant" and "cost" as distinct in the acceptance bullet's own wording, and documenting the reasoning explicitly here so 03-07 (balance retune) and any future reader has the rationale, not just the result.
- Re-running the full sweep after each task showed the balance numbers moving substantially (03-02's post-tracer baseline: 18% all-dead, mean survivors 2.6 → after Task 1 alone: 5% all-dead, mean survivors 3.6 → after Task 2: 0% all-dead, mean survivors 3.9). This plan did not target these numbers deliberately (BALANCE-01 is about re-authoring content, not tuning); the shift is a side effect of Cyclops/Lotus's Dare cells now granting real stash via the shared `dareStash` tables where the interim conversion granted little to none. Flagging this for 03-07 (balance retune) as the updated baseline to tune from, alongside 03-02's still-open hold-economy concern.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 03-04 (Sirens re-authoring) can proceed independently — it doesn't touch Cyclops or Lotus content, and follows the same `econD()`+named-`CONFIG.<episode>`-kicker pattern established across all three re-authored islands so far (Helios in 03-01, Cyclops/Lotus here).
- 03-05 (anchor retrofit) and 03-06 (board update) are unaffected by this plan's content changes (no engine/board surface touched).
- **Concern for 03-07 (balance retune):** the sweep's all-dead rate has now fallen from 03-02's 18% to 0% (40/40 seeds survived) and mean survivors rose from 2.6 to 3.9, purely as a side effect of Cyclops/Lotus's Dare cells routing through the shared `dareStash` tables. This may now be OVER-corrected relative to D-09's "greedy/dare survives but poor; pious/abide wins favor but fragile" target — full-crew survival is now 93% (37/40), which reads as quite safe. 03-07 should treat this plan's post-Task-2 sweep (recorded below) as an updated baseline, alongside 03-01's and 03-02's, and may need to pull `CONFIG.econ.dareStash`'s magnitudes down (a shared surface, so this affects Helios too) or lean harder on `CONFIG.divine`'s doom/bless thresholds to restore contested tension.
- **Post-Task-2 `sweep.mjs 40` snapshot (recorded for 03-07):**
  ```
  === BALANCE SWEEP: 40 seeds (0-human auto), post-03-03 Task 1+2 ===
  errors/incomplete: 0
  no-winner / incomplete: 0
  ALL-DEAD (death-spiral): 0 (0%)          [03-02 baseline: 7 (18%)]
  ≥1 survivor (reached Ithaca alive): 40 (100%)
  full crew (4) survived: 37 (93%)          [03-02 baseline: 17 (43%)]
  survivor-count distribution: {"0":0,"1":0,"2":0,"3":3,"4":37}
  mean survivors: 3.9                        [03-02 baseline: 2.6]
  seeds with ≥1 death: 28 (70%)
  winner favor — min/avg/max: 6/11.7/17
  favor spread (distinct winner favors): 6,7,8,9,10,11,12,13,14,15,17 (11 distinct)
  by temperament (alive-rate | avg favor):
    greedy: 98% alive | favor -4.8           [03-02 baseline: 65% alive | favor -2.5]
    balanced: 98% alive | favor 4.7           [03-02 baseline: 65% alive | favor 3.2]
    pious: 100% alive | favor 9.9             [03-02 baseline: 70% alive | favor 6.8]
  ```
- Custom transcript-scan evidence (dev-only, not committed to `scratchpad/`) for this plan's own acceptance bullets: Cyclops blinding fires in 20/40 seeds (50%) that reach the giant; Lotus stranding fires in 12/40 (30%) and rescue in 39/40 (98%). Both islands' special mechanics are reachable and neither is a dead outcome.
- Decision recorded per the plan's own output spec: the stake's success branch does **not** grant favor to darers — no flagged exception was added; escape progress remains the sole reward, consistent with the plan's stated default.

## Self-Check: PASSED

All modified files verified present on disk (index.html, this SUMMARY.md). Both task commit
hashes (e2fc745, c32808f) verified present in `git log --oneline --all`.

---
*Phase: 03-anchor-verb-retrofit-balance-retune*
*Completed: 2026-07-26*
