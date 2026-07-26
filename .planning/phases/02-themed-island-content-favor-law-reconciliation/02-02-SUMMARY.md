---
phase: 02-themed-island-content-favor-law-reconciliation
plan: 02
subsystem: game-content
tags: [beats-engine, favor-law, headless-harness, vanilla-js]

# Dependency graph
requires:
  - phase: 02-themed-island-content-favor-law-reconciliation
    provides: "CONFIG.fx big/huge tiers, the beats/resolveEffect()/validateBeats() authoring pattern, scratchpad/harness.mjs headless verifier (02-01)"
provides:
  - "Cyclops (The Cyclops) fully authored to beats across all 3 scenes — the D-02 three-stage pride escalation"
  - "Cyclops favor-law reconciliation — the boast and the collective blinding grant zero favor (D-05)"
affects: [02-03-sirens-content, 02-04-lotus-content, 02-05-favor-law-audit]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Collective-vs-individual beats split: a scene's per-cell beats narrate each actor's individual action while a scene-level collectiveCheck (unchanged seam) owns the shared threshold/outcome — used for Cyclops scene 2's stake-driving so individual flavor and the collective blinding gate coexist without either duplicating the other's logic."
    - "No-favor island by convention: Cyclops carries zero favor grants anywhere in its beats or collective-check functions (not just on Dare) — established already by scene 1's Abide cells and extended here to scenes 2-3, matching D-05's framing of Cyclops as survival/pride rather than piety."

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "Scene 2 'The Stake' keeps its collectiveCheck: stakeCheck seam exactly as-is (per plan direction) — per-cell beats narrate the individual heave/brace/pour with a minor personal risk on Dare-1 (a scald/stumble), while stakeCheck() alone still owns the collective blinding threshold and (after Task 2) the no-favor escape-progress award."
  - "Scene 3 'Under the Sheep' Dare uses faces 3 and 4 (each 40% weight) as the primary escape triggers rather than face 6, per Pitfall 11 — a scene's only good outcome must not hinge on a 10%-weight face. Face 1 costs the attempt (a scrap of ration, no progress); face 6 is a flourish (small extra stash) on top of the same progress+1 the 3/4 faces already grant."
  - "Extended the Cyclops no-favor convention (already implicit in scene 1's flat, favor-less Abide cells) to Abide across scenes 2 and 3 as well, not just Dare — Cyclops reads as a survival island throughout, distinct from Helios's Abide-6-favor-nod pattern. Documented as a deliberate departure from the general D-05 default-favor-path law, scoped to this one island."
  - "No new CONFIG.cyclops magnitudes needed — every new cell's d uses the existing CONFIG.fx.tiny/penalty tier vocabulary, consistent with 02-01's finding that the shared cross-scene tiers cover Cyclops's smaller-scale economy without a dedicated per-episode block."

requirements-completed: [CONTENT-02]

coverage:
  - id: D1
    description: "Cyclops scene 2 'The Stake' converted from reskin closures to full dare/abide/give x {1,3,4,6} beats, collectiveCheck: stakeCheck seam intact — collective blinding still resolves via the shared threshold, not per-cell."
    requirement: "CONTENT-02"
    verification:
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed demo && node scratchpad/harness.mjs --seed alpha (validateBeats ok, no Cyclops scene in notYetConverted, both reach THE VERDICT)"
        status: pass
      - kind: other
        ref: "transcript sweep (20+ seeds via a throwaway scratchpad harness) — captured both '🔥 The stake drives home!' (collective success) and 'No one drives the stake — the moment passes.' -> polyphemusHunger(false) victim seizure (pure-Abide strand intact)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Cyclops scene 3 'Under the Sheep' converted to full beats with an individual (non-collective) escape roll — Dare faces 3/4 advance state.ep.progress via fx, face 1 fails without progress, face 6 succeeds with a small extra; onDepart's victim-seizure fires when progress falls short of need."
    requirement: "CONTENT-02"
    verification:
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed demo (validateBeats ok, THE VERDICT reached)"
        status: pass
      - kind: other
        ref: "transcript sweep — captured 'escape N/3' progress lines advancing on faces 3/4/6 and 'Polyphemus seizes {name} at the mouth of the cave' when progress fell short"
        status: pass
    human_judgment: false
  - id: D3
    description: "prideSubCommit (the boast) retuned: grants CONFIG.boastCurse only (world-anger), zero favor. stakeCheck (the collective blinding) retuned: grants escape progress only, zero favor to darers. Both sites carry a D-05 comment. Death-penalty favor clawback (islandFavorEarned) unchanged."
    requirement: "CONTENT-02"
    verification:
      - kind: other
        ref: "grep -n favor scoped to the prideSubCommit and stakeCheck function bodies — zero positive favor grants remain; only the pre-existing victim penalty (favor=Math.max(0,favor-islandFavorEarned)) survives"
        status: pass
      - kind: unit
        ref: "10-seed sweep (demo/alpha/beta/gamma/delta/epsilon/zeta/eta/theta/iota) via scratchpad/harness.mjs — all reach THE VERDICT with validateBeats ok after the retune"
        status: pass
      - kind: other
        ref: "transcript sweep — captured a live BOAST line ('glory, and nothing else. Poseidon's curse deepens...') and a live stake-blinding success line, both now printing with no favor delta"
        status: pass
    human_judgment: false

duration: ~20min
completed: 2026-07-26
status: complete
---

# Phase 2 Plan 2: Cyclops Summary

**Cyclops's three scenes now resolve entirely through beats as a pride escalation (trapped → collective blinding → individual escape), and its two shipped Dare-favor violations (the boast, the collective stake blinding) are retuned to grant zero favor — pride is punished with Poseidon's curse, never rewarded.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-07-26T03:50Z (approx, first file read)
- **Completed:** 2026-07-26T04:10:44Z
- **Tasks:** 2
- **Files modified:** 1 (index.html)

## Accomplishments
- Converted Cyclops scene 2 "The Stake" from its `reskin` closures to full `beats` (dare/abide/give × {1,3,4,6}), keeping the scene's `collectiveCheck: stakeCheck` seam untouched — per-cell beats narrate the individual heave/brace/pour while `stakeCheck()` alone still decides the collective blinding.
- Converted Cyclops scene 3 "Under the Sheep" from its `reskin` closures to full `beats` with an individual, non-collective escape roll — Dare faces 3/4 (each 40% weight, per Pitfall 11) advance `state.ep.progress` via the `fx` hatch, face 1 costs the attempt, face 6 is a flourish escape.
- Retuned `prideSubCommit` (the boast): removed the `+3` favor grant entirely — boasting now only deepens `state.curse` (Poseidon's wrath) via `CONFIG.boastCurse`, with narration reframed to "glory, and nothing else."
- Retuned `stakeCheck` (the collective blinding): removed the `+2` favor grant to each darer on success — the reward is escape progress alone.
- Added a D-05 comment at each retuned site (`prideSubCommit`, `stakeCheck`) marking Cyclops as an intentional no-favor island, so future authors don't accidentally reintroduce a favor grant.
- Verified via a throwaway transcript-inspection script (not committed — scratchpad-only) that live seeded runs actually produce the boast line, both stake-blinding outcomes, and the pure-Abide strand's lethal path, all with the expected mechanics.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author Cyclops scene 2 "The Stake" and scene 3 "Under the Sheep" to beats** - `b62bb0a` (feat)
2. **Task 2: Reconcile the Cyclops Dare-favor violations — boast and collective blinding grant no favor** - `e52f0aa` (fix)

**Plan metadata:** (this commit)

## Files Created/Modified
- `index.html` - Cyclops scenes 2 and 3 (`The Stake`, `Under the Sheep`) fully authored to `beats`; `prideSubCommit` and `stakeCheck` retuned to grant zero favor per D-05, each carrying a marker comment

## Decisions Made
- Scene 2 keeps `collectiveCheck: stakeCheck` exactly as the plan directs — per-cell beats own narration/minor individual risk, `stakeCheck()` alone owns the collective threshold and (post-Task-2) the no-favor escape-progress award.
- Scene 3's escape-triggering faces are 3 and 4 (not 6) to respect Pitfall 11 — the scene's only good outcome must not hinge on a rare 10%-weight face.
- Extended the no-favor convention already implicit in scene 1's flat Abide cells to scenes 2 and 3 as well (Abide never grants favor anywhere in Cyclops, not just Dare) — a deliberate, scoped departure from the general "Abide-6 is the default favor path" law, since Cyclops is explicitly about survival/cunning, not piety (D-02, D-05).
- No new `CONFIG.cyclops` magnitudes were needed — all new cells reference the existing `CONFIG.fx.tiny`/`penalty` tiers, consistent with 02-01's precedent that the shared cross-scene tier vocabulary covers Cyclops's economy.

## Deviations from Plan

None - plan executed exactly as written. Both tasks matched their `<action>` and `<acceptance_criteria>` without requiring an architectural change or unplanned bug fix.

## Issues Encountered
- The shared `scratchpad/harness.mjs` only asserts pass/fail + THE VERDICT, not per-episode transcript content, so a throwaway (uncommitted) transcript-dump variant was written in the OS scratchpad directory to inspect Cyclops-specific log lines (boast text, stake-blinding text, victim-seizure text) across a 20+ seed sweep before committing Task 2. This script was not added to the repo — it exists only to validate this plan's mechanics and is not part of the deliverable.
- Confirmed the pre-existing hold-economy death-spiral (already documented in `02-01-SUMMARY.md` and project memory) also affects Cyclops runs — some seeds reach Scene 2/3 with the whole crew starving before anyone can act. This is expected and explicitly out of scope (Phase 3 does the balance tuning); the acceptance bar here — the run completes and both collective/individual mechanics fire correctly when actors are able to act — was met across the sweep.

## Next Phase Readiness
- Cyclops is fully on the beats path (all 3 scenes) with the D-02 escalation and D-05 favor-law reconciliation complete — two of the three shipped Dare-favor violations are now closed (Cyclops boast, Cyclops blinding); Lotus remains for 02-04, and Sirens' single sanctioned exception is confirmed to stay untouched per D-05.
- The authoring pattern (beats cells + fx hatch for stateful counters + collectiveCheck seam for collective gates) is proven for both the collective and individual escape-roll shapes, ready for 02-03 (Sirens) and 02-04 (Lotus) to replicate.
- No blockers. The known hold-economy death-spiral remains explicitly deferred to Phase 3 per the roadmap.

---
*Phase: 02-themed-island-content-favor-law-reconciliation*
*Completed: 2026-07-26*
