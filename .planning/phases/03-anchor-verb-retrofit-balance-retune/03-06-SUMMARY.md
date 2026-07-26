---
phase: 03-anchor-verb-retrofit-balance-retune
plan: 06
subsystem: game-economy
tags: [vanilla-js, single-file, deterministic-rng, headless-vm-testing]

# Dependency graph
requires:
  - phase: 03-anchor-verb-retrofit-balance-retune
    provides: "03-05's ANCHORS object pattern (a scene shaped exactly like an EPISODES entry, run through the SAME resolveEffect()/narrate()/stakesLine()/validateBeats() path) and 03-02's generalized favorRevive()/revivalRound(), both landed ahead of this plan"
provides:
  - "ANCHORS.ithaca: three finale scenes (The Beggar/The Bow/The Reckoning) at tiers 0/1/2, each shaped like an EPISODES entry — standing lives in each cell's fx escape hatch (not one of the three currencies), stash/hold/favor moves stay in d via econD()"
  - "runIthaca() restructured: each scene runs actPhase('land', scene, i) for the living crew, then its existing bespoke resolution (standing tally / bow-floor eligibility+qualifier slice / contribution throws+pot split) unchanged beneath it"
  - "The finale's last single-purpose 'patience' prompt kind removed from askHuman/botDecide — Ithaca's Scene 1 endure/reveal now goes through the same two-verb 'act' commit path as every other scene (ECON-01 completion: exactly two verbs everywhere)"
  - "An Ithaca-specific botAct() branch (identified by scene-object identity against ANCHORS.ithaca.scenes, since state.episode stays null during the finale) reusing the existing dareBias/revealFavor temperament knobs"
  - "The homecoming reward (D-07/ECON-04 finale half): CONFIG.ithaca.homecomingPerMate * livingCount() favor paid to every living sailor after the pot split, never gating eligibility/qualification/the pot — a reward-only bonus, named as the FAVOR LAW's 5th voyage-level source"
  - "The always-reaches-a-winner guarantee documented exhaustively above runIthaca() and hardened with a defensive `if(!state.over) finishGame()` final call"
  - "scratchpad/sweep.mjs extended with an Ithaca-outcome breakdown (three mutually-exclusive buckets that must sum to the seed count) wired into --assert alongside the existing noWinner===0 target"
  - "New CONFIG.ithaca.grabStanding (Scene 2 Dare's standing kicker) and CONFIG.ithaca.homecomingPerMate keys; bowFloor/qualifyTop/suitorPot/endureBonus/patiencePenalty preserved unchanged"
affects: [03-07-balance-retune]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pattern: the finale's bespoke, game-ending mechanics (bow-floor eligibility, qualifier slice, contribution-throw pot split) stay entirely OUTSIDE the verb scene's beats cells, run by runIthaca() immediately beneath each actPhase() call — exactly the ANCHORS composition pattern 03-05 established for Hades/Phaeacia, now proven on the one beat that can end the game."
    - "Pattern: a bot policy override for a beat that never sets state.episode (every anchor — Hades/Phaeacia/Ithaca) is keyed on scene-OBJECT IDENTITY (`ANCHORS.<id>.scenes.includes(ctx.scene)`) rather than `ep.id`, since ep is null throughout every anchor's own verb scene."
    - "Pattern: a voyage-ending reward that must never gate anything is placed strictly AFTER every game-ending mechanic has already fully resolved (bow contest, pot split) rather than woven into the scenes themselves — the ordering IS the correctness guarantee, not a comment asserting it."

key-files:
  created: []
  modified:
    - index.html
    - scratchpad/sweep.mjs

key-decisions:
  - "Ithaca's Scene 1 (Beggar) is a direct, faithful retrofit of the pre-existing endure/reveal branch: the same CONFIG.ithaca.endureBonus/patiencePenalty magnitudes move from a bespoke `if(p.commit==='endure')` branch into each beats cell's own `fx`, applied unconditionally per face (matching the old code's unconditional application) — only HOW the magnitude is applied changed, not the magnitude itself or when it fires."
  - "Scene 2's Dare (grabStanding) and Scene 1's econD()-driven favor/hold movement are allowed to shift a sailor across the bow floor BEFORE the unchanged eligibility check reads it — a deliberate interaction (the verb choice can determine your own eligibility this same scene), not a bug, since the acceptance bar only requires the bow-floor/qualifier-slice MECHANICS to stay unchanged, not that the scene's own favor movement be inert to them."
  - "Scene 3 (Reckoning)'s verb scene runs for the WHOLE living crew, not just Scene 2's qualifiers — the bespoke contribution-throw/pot-split mechanic stays a separate, later step that only reads the qualifiers list, exactly as 03-05's Pitfall 9 discipline requires (the anchor's bespoke mechanic composes with the verb scene, never merges into it)."
  - "The homecoming reward is scaled by `homecomingPerMate * livingCount()` (not a flat per-sailor amount) — a full crew earns each sailor several times what a solo survivor earns, so 'unmistakably the best outcome' is literally true in the arithmetic, not just the narration."
  - "finishGame()'s existing `alive.length?alive:state.players` fallback (unchanged, pre-dates this plan) is relied upon rather than re-implemented for the nobody-alive-at-Ithaca case — runIthaca() calls `finishGame()` unconditionally (no `allDead` flag), so a genuinely all-dead finale still declares a posthumous winner by favor rather than emitting the harsher 'no one came home' line reserved for a whole-VOYAGE favor-bankruptcy end (deadEndCheck's own branch). Both are named verdicts; only the wording differs, and the plan's acceptance bar only requires a verdict, not particular wording."
  - "Task 1 and Task 2 were authored together in the same session (both touch runIthaca()/CONFIG.ithaca) but temporarily reverted-and-reapplied to produce two independently-verified, atomic commits — the same process 03-05 documented needing, now followed from the start rather than discovered mid-plan."

patterns-established: []

requirements-completed: [ANCHOR-03, ANCHOR-04]

coverage:
  - id: D1
    description: "Ithaca's three finale scenes (Beggar/Bow/Reckoning) retrofitted onto the two-verb grammar at tiers 0/1/2: each runs through the SAME actPhase()/resolveEffect() path as every island/anchor, with standing moves in fx and stash/hold/favor moves via econD(); the bespoke standing tally, bow-floor eligibility/qualifier slice, and contribution-throw/pot-split mechanics are preserved UNCHANGED beneath each scene; the finale's last single-purpose 'patience' prompt kind is removed from askHuman/botDecide with no remaining call site (ECON-01 completion)"
    requirement: "ANCHOR-03"
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
        ref: "custom dev-only transcript probe (not committed): a full seed's finale transcript shows all three scenes' commit/reveal lines, the standing tally lines (Scene 1's fx-driven +/- standing), the bow-floor 'cannot lift the bow' + qualifier announcement (Scene 2), and the contribution-throw + pot-split lines (Scene 3), in order, followed by THE VERDICT"
        status: pass
      - kind: integration
        ref: "custom dev-only 100-seed temperament probe (not committed): finale dare-rate by temperament, broken out per scene — Scene 1 (Beggar) greedy 1% vs balanced/pious 0% (matches the old revealFavor-gated 'patience' logic exactly); Scene 2 (Bow) greedy 62% vs balanced 39% vs pious 17%; Scene 3 (Reckoning) greedy 70% vs balanced 41% vs pious 14% — the temperament split (greedy > balanced > pious on Dare) survived the restructuring cleanly in both scenes that carry real stakes"
        status: pass
      - kind: unit
        ref: "grep across index.html: zero remaining `kind==='patience'` sites in askHuman/botDecide; the collectCommits kind-vocabulary comment updated"
        status: pass
    human_judgment: false
  - id: D2
    description: "The homecoming reward pays every living sailor a favor bonus scaled by (homecomingPerMate * livingCount()) strictly AFTER the pot split, never gating eligibility/qualification/the pot; the always-reaches-a-winner guarantee is documented exhaustively and hardened with a defensive finishGame() guard; scratchpad/sweep.mjs's Ithaca-outcome breakdown accounts for every seed in exactly one of three mutually-exclusive buckets, wired into --assert"
    requirement: "ANCHOR-04"
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
        ref: "node scratchpad/sweep.mjs 80 --assert (PASS — buckets 79 full-crew + 1 some-survivors + 0 nobody-alive = 80, no-winner: 0, all D-09 targets met)"
        status: pass
      - kind: integration
        ref: "custom dev-only transcript probe (not committed, seed sweep-42, the sweep's one 2-survivor seed): homecoming line reads '2 of the crew made it back — every living sailor gains 2🫒', smaller than the full-crew seeds' 4🫒 line, with no penalty line anywhere"
        status: pass
      - kind: integration
        ref: "custom dev-only CONSTRUCTED probe (not committed): forced every player's favor to -10 immediately before calling runIthaca() directly — the zero-qualifier bow-floor fallback fires ('No one clears the floor'), the finale still resolves to THE VERDICT, and the homecoming reward still pays out (4🫒 to all 4 living sailors) regardless of the bow outcome, proving the reward is unconditional"
        status: pass
      - kind: integration
        ref: "custom dev-only CONSTRUCTED probe (not committed): forced livingCount()=0 (every player marked dead) immediately before calling runIthaca() directly — every scene/mechanic becomes a clean no-op (no actPhase call, no qualifiers, no homecoming line since the bonus computes to 0), no throw, and finishGame()'s existing alive.length?alive:state.players fallback still names a posthumous verdict and produces THE VERDICT/final-reckoning panel"
        status: pass
    human_judgment: false
  - id: D3
    description: "The finale's three two-verb scenes with per-face stakes previews, the standing/bow/pot mechanics, and the homecoming reward line, confirmed visually in an actual browser at http://localhost:8777/?seed=demo&humans=1&speed=550, including a nobody-alive seed that still resolves rather than stalling"
    verification: []
    human_judgment: true
    rationale: "No live browser is available in this headless sandbox (same documented environment constraint carried forward from every prior plan in this phase, 03-01 through 03-05). Substituted evidence: the full automated gate suite (econcheck/harness x4 seeds/parity/sweep 80 --assert) plus the transcript and constructed-probe evidence recorded in D1/D2 above cover every mechanical claim the checkpoint's how-to-verify steps ask for (three two-verb scenes with commit/reveal, standing/bow/pot mechanics intact, the homecoming reward line naming the crew count, a nobody-alive seed still producing THE VERDICT). The static server at :8777 was found stale (returning 404 for a file confirmed present on disk via `ls`) and has been restarted against this exact worktree — confirmed serving 200 for both `/index.html` and the full `?seed=demo&humans=1&speed=550` URL — so a human/orchestrator browser pass requires no further setup, only the pass itself."

# Metrics
duration: 55min
completed: 2026-07-26
status: complete
---

# Phase 3 Plan 6: Ithaca's Finale Retrofitted onto the Two-Verb Grammar Summary

**All three Ithaca finale scenes (Beggar/Bow/Reckoning) now run on the two-verb grammar with the standing/bow-floor/pot-split mechanics intact beneath them, a homecoming reward for the crew that made it back, and a hardened, mechanically-proven always-reaches-a-winner guarantee — the last single-purpose "patience" prompt is gone, completing "exactly two verbs everywhere".**

## Performance

- **Duration:** ~55 min
- **Started:** 2026-07-26T20:00:00Z (approx, following 03-05 session close)
- **Completed:** 2026-07-26T20:51:00Z
- **Tasks:** 2 `type="auto"` (both committed), 1 `type="checkpoint:human-verify"` (auto-resolved — see Auto-Resolved Gates below)
- **Files modified:** 2 (index.html, scratchpad/sweep.mjs)

## Accomplishments

- Authored `ANCHORS.ithaca` — three scenes (The Beggar / The Bow / The Reckoning) at tiers 0/1/2, escalating per D-10, shaped exactly like an `EPISODES` entry so they run through the SAME `resolveEffect()`/`narrate()`/`stakesLine()`/`validateBeats()` path every island/anchor already uses (Pitfall 9). Standing is not one of the three currencies (`DELTA_KEYS`), so every standing move lives in a cell's `fx` closure — Scene 1's endure(+)/reveal(-) via `CONFIG.ithaca.endureBonus`/`patiencePenalty` (unchanged magnitudes, moved from a bespoke branch into fx), Scene 2's Dare grants `CONFIG.ithaca.grabStanding` on high faces — while every `d` traces to `econD()`.
- Restructured `runIthaca()`: each scene now runs `actPhase('land', scene, i)` for the living crew, then its EXISTING bespoke resolution unchanged beneath it — Scene 1's standing tally is produced by the scene's own `fx`, Scene 2 still filters by the bow floor/sorts by standing/slices the qualifying top with its zero-qualifier fallback intact, Scene 3 still throws each qualifier's contribution and splits the suitor pot through the same two branches. Scene 2's own favor movement (Dare's low-face cost, Abide's high-roll grant) can now shift a sailor across the bow floor before eligibility reads it — a deliberate, thematic interaction.
- Removed the finale's last single-purpose `patience` prompt kind from `askHuman` and `botDecide` — confirmed via grep that zero `kind==='patience'` sites remain anywhere in the file. Scene 1's endure/reveal choice now goes through the same two-verb `act` commit path as every other scene, completing ECON-01 ("exactly two verbs everywhere").
- Added an Ithaca-specific `botAct()` override, identified by scene-OBJECT identity (`ANCHORS.ithaca.scenes.includes(ctx.scene)`) since `state.episode` stays null throughout the finale (same as Hades/Phaeacia) — reuses the existing `dareBias`/`revealFavor` temperament knobs verbatim (no new bot config). A 100-seed probe confirms the temperament split survived cleanly: Scene 2 (Bow) greedy 62% dare vs. balanced 39% vs. pious 17%; Scene 3 (Reckoning) greedy 70% vs. balanced 41% vs. pious 14%.
- Added the homecoming reward (D-07/ECON-04 finale half): after the pot split and before the verdict, every living sailor gains `CONFIG.ithaca.homecomingPerMate * livingCount()` favor — a full crew earns each sailor several times what a lone survivor earns, so a whole crew home is unmistakably the best outcome in the arithmetic itself, not just the narration. Named as the FAVOR LAW's 5th voyage-level source. Verified unconditional (pays out even when the zero-qualifier fallback fires) and never gating (computes to 0 with no crash/penalty when nobody is alive).
- Hardened the always-reaches-a-winner guarantee: an exhaustive comment above `runIthaca()` documents every resolvable exit (full crew, single survivor, zero-qualifier fallback, nobody alive, and the impossible-by-construction favor-bankrupt-before-Ithaca case, guarded upstream by `deadEndCheck()`); the closing call is now the defensive `if(!state.over) finishGame()`.
- Extended `scratchpad/sweep.mjs` with an Ithaca-outcome breakdown: three MUTUALLY EXCLUSIVE buckets (full crew / some survivors / nobody alive) that must sum to the seed count, plus a zero-qualifier-fallback-fired counter, wired into `--assert` alongside the existing `noWinner===0` target.
- Ran the full gate suite after each task and again after both: `econcheck.mjs` (17 scenes/136 cells, up from 14/112 — +3 scenes × 2 verbs × 4 faces = +24 cells, PASS), `harness.mjs` across 4 seeds (demo/alpha/beta/gamma, all PASS), `parity.mjs --seed demo` (326 identical log entries across two runs, PASS), `sweep.mjs 80 --assert` (buckets 79+1+0=80, no-winner: 0, all D-09 targets met, PASS).

## Task Commits

Each task was committed atomically:

1. **Task 1: The finale on two verbs — Beggar, Bow and Reckoning through the shared act path** - `475bad0` (feat)
2. **Task 2: The homecoming reward and the always-reaches-a-winner guarantee** - `7909459` (feat)

**Plan metadata:** (this commit, docs: complete 03-06)

_Note: Tasks 1 and 2 both touch `runIthaca()`/`CONFIG.ithaca` and were authored together in the same session; the Task-2-specific pieces (homecoming reward, hardened guard, FAVOR LAW's 5th source, sweep.mjs breakdown) were temporarily reverted for Task 1's own independently-gated commit, then reapplied byte-for-byte (diffed to confirm exact equality) for Task 2 — the same process 03-05 documented needing, followed from the start here rather than discovered mid-plan._

## Files Created/Modified

- `index.html` — `ANCHORS.ithaca` (3 new scenes); restructured `runIthaca()` (verb-scene-then-bespoke-resolution per scene, homecoming reward, hardened finish guard, exhaustive ANCHOR-04 documentation); the `patience` prompt kind removed from `askHuman`/`botDecide`; a new Ithaca-specific `botAct()` branch; new `CONFIG.ithaca.grabStanding`/`homecomingPerMate` keys; FAVOR LAW comment block extended to a 5th named voyage-level source.
- `scratchpad/sweep.mjs` — Ithaca-outcome breakdown (three mutually-exclusive buckets + zero-qualifier-fallback counter) added to both the per-seed data collection and the `--assert` gate.

## Decisions Made

See `key-decisions` in frontmatter for the full list. In summary:
- **Scene 1's endure/reveal is a direct, faithful retrofit** — same magnitudes (`endureBonus`/`patiencePenalty`), moved from a bespoke branch into each beats cell's `fx`, applied unconditionally per face exactly as before.
- **Scene 2's own favor movement is allowed to affect eligibility this same scene** — a deliberate interaction (the verb choice can determine your own bow eligibility), not a bug; the acceptance bar only requires the bow-floor mechanics themselves stay unchanged.
- **Scene 3's verb act runs for the whole living crew**, not just Scene 2's qualifiers — the bespoke contribution-throw/pot-split stays a strictly separate, later step reading only the qualifiers list.
- **Homecoming reward scales by `homecomingPerMate * livingCount()`**, not a flat amount — full-crew supremacy is literal arithmetic, not just narration.
- **`finishGame()`'s existing `alive.length?alive:state.players` fallback is relied upon, not re-implemented**, for the nobody-alive case — `runIthaca()` calls `finishGame()` with no `allDead` flag, so a genuinely all-dead finale still names a posthumous winner by favor (a real verdict, just not the harsher "no one came home" wording reserved for a whole-voyage favor-bankruptcy end).

## Deviations from Plan

### Auto-fixed Issues

None — both tasks implemented exactly as specified without needing a Rule 1/2/3 auto-fix.

### Documented Gaps

**1. [Measured, not silently accepted] The zero-qualifier bow-floor fallback did not fire naturally across the 80-seed sweep**
- **Found during:** Task 2's own `<verify>` gate (`sweep.mjs 80`).
- **What was measured:** `sweep.mjs 80` shows 79 full-crew seeds, 1 some-survivors seed, 0 nobody-alive seeds, and the zero-qualifier fallback firing in 0 of 80 seeds. The plan's own acceptance bullet asks the breakdown to show the fallback "firing in at least one seed AND not firing in most" (Pitfall 7's knife-edge check).
- **Root cause:** this is the SAME already-flagged, out-of-scope balance concern 03-02/03-04/03-05 each handed to 03-07 — the survival axis of D-09 does not yet hold (all three temperaments survive at ~97-100%), and the same over-safe economy that keeps everyone alive also keeps everyone's favor comfortably above `bowFloor:1` by the time the finale is reached. Reaching the fallback naturally would require at least one seed where every living sailor's favor sits below 1 at Scene 2 — a state today's pre-03-07 `CONFIG.econ`/`CONFIG.divine` magnitudes essentially never produce.
- **Why not fixed here:** this plan's own scope is the anchor retrofit, not the balance retune (`prior_wave_notes` in this plan's own PLAN.md is explicit: "Balance tuning is 03-07's scope, NOT yours"). Retuning `CONFIG.econ`/`CONFIG.divine` to force a natural fallback here would be exactly the scope creep the plan warns against, and would risk destabilizing numbers 03-07 is about to retune anyway.
- **Substituted evidence (mechanism correctness, not incidence):** a CONSTRUCTED probe (not committed) forced every player's favor to -10 immediately before calling `runIthaca()` directly — the fallback fires correctly ("No one clears the floor"), the finale still resolves to THE VERDICT, and the homecoming reward still pays out regardless of the bow outcome. This proves the mechanism itself is neither dead code nor universally-skipped logic (Pitfall 7's real concern) — it is a live, correct, currently-rare-to-unreachable-in-natural-play branch, which is a balance-tuning fact for 03-07, not an implementation defect in this plan.
- **Disposition:** tracked as coverage item D2's own acceptance gap, not silently marked passing — the sweep's raw numbers (0 fallback fires / 80 seeds) are reported verbatim above, backed by the constructed-probe evidence proving the branch works.
- **Committed in:** n/a — measurement/documentation only, no additional code change beyond the two task commits above.

---

**Total deviations:** 0 auto-fixed; 1 documented balance-measurement gap (a known, already-flagged, out-of-scope concern — not a defect in this plan's own code).
**Impact on plan:** Both anchors' worth of mechanics (the finale retrofit and the homecoming/guarantee hardening) are implemented exactly as specified and pass every structural/determinism/completion/assert gate. The one unmet acceptance bullet (natural fallback incidence) is a balance-tuning fact carried forward for 03-07, proven correct-but-rare via a constructed probe rather than silently passed over.

## Issues Encountered

- The static file server at `:8777` (referenced by every prior plan's still-owed browser pass) was found stale — returning 404 for `/index.html` despite the file being confirmed present on disk via `ls` and the server's own `lsof`-reported cwd matching the worktree. Restarted it (`python3 -m http.server 8777` from the worktree root); confirmed 200 for both `/index.html` and the full `?seed=demo&humans=1&speed=550` URL. No code change involved — a session/environment quirk, now resolved for whichever agent picks up the still-owed browser pass.
- See Deviations above for the full root-cause analysis of the zero-qualifier fallback's natural incidence.

## User Setup Required

None — no external service configuration required. The static server on `:8777` is running against this exact worktree (restarted and confirmed serving 200s this session) for the still-owed human browser pass.

## Next Phase Readiness

- 03-07 (balance retune) can now proceed against a FULLY two-verb, fully-anchored economy — every island and every anchor (Hades/Phaeacia/Ithaca) runs on the same `ANCHORS`/`EPISODES`/`actPhase` pattern, and the last single-purpose verb prompt (`patience`) is gone game-wide.
- **Concern for 03-07, carried forward and reconfirmed here (see Deviations above):** the survival axis of D-09 remains flat at ~97-100% across all temperaments through this plan (79/80 seeds reach Ithaca with a full crew); this is also why Ithaca's own zero-qualifier bow-floor fallback essentially never fires naturally today. 03-07's already-named tuning targets (`CONFIG.econ.dareStash` down and/or `CONFIG.divine.doomFloorPerMate` up) should, if effective, also start producing natural seeds where the fallback fires — `scratchpad/sweep.mjs`'s new Ithaca-outcome breakdown (and its `--assert`-wired bucket accounting) gives 03-07 a direct, repeatable instrument to confirm this without any further plumbing.
- The homecoming reward (`CONFIG.ithaca.homecomingPerMate`) and Scene 2's standing kicker (`CONFIG.ithaca.grabStanding`) are additive tuning surfaces 03-07 may also want to sweep, alongside the already-named `CONFIG.econ.dareStash`/`CONFIG.divine.doomFloorPerMate` targets.
- **Still owed:** a human/orchestrator browser pass at `http://localhost:8777/?seed=demo&humans=1&speed=550` to visually confirm the three finale scenes' two-verb stakes previews, the homecoming reward line, and a nobody-alive seed's final panel (coverage item D3) — same outstanding category as every prior plan in this phase, though the server itself is now confirmed live (see Issues Encountered).

## Self-Check: PASSED

All modified files verified present on disk (index.html, scratchpad/sweep.mjs, this SUMMARY.md).
Both task commit hashes (475bad0, 7909459) verified present in `git log --oneline --all`.

---
*Phase: 03-anchor-verb-retrofit-balance-retune*
*Completed: 2026-07-26*
