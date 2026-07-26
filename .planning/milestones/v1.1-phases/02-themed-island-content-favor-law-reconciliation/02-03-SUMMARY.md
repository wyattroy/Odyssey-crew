---
phase: 02-themed-island-content-favor-law-reconciliation
plan: 03
subsystem: game-content
tags: [beats-engine, favor-law, headless-harness, vanilla-js]

# Dependency graph
requires:
  - phase: 02-themed-island-content-favor-law-reconciliation
    provides: "CONFIG.fx big/huge tiers, the beats/resolveEffect()/validateBeats() authoring pattern, scratchpad/harness.mjs headless verifier (02-01); the reskin-to-beats conversion pattern and no-favor-island convention (02-02)"
provides:
  - "Sirens (The Sirens) fully authored to beats across all 3 scenes — the D-03 rewarded-temptation/wreck escalation"
  - "The Sirens Dare-favor grant preserved and explicitly flagged in-data as the single sanctioned D-05 exception"
affects: [02-04-lotus-content, 02-05-favor-law-audit]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Flagged law-exception convention: a large block comment directly above EPISODES.sirens.scenes names the Dare-favor grant as the ONE sanctioned exception to the Abide-only favor law (D-05), explains why (Dare pays real kleos here, Abide inverts the default and pays nothing), and warns future authors not to copy it — mirrors the D-05 no-favor-island comment style established at Cyclops's prideSubCommit/stakeCheck in 02-02, but for the opposite (grant, not withhold) case."
    - "Scene-scaled wreck escalation via CONFIG arithmetic (no fx hatch needed): unlike Cyclops's stateful counters, Sirens needs no `fx:` mutation — every scene's Dare cell expresses its escalating cost as a d:{} arithmetic expression built from CONFIG.sirens.worldPerListen + a per-scene CONFIG.fx tier (tiny in Scene 2, small in Scene 3) plus CONFIG.sirens.wreckWorldExtra/wreckCrew on the worst face — all CONFIG-sourced, no bare integers, and the whole escalation is legible by reading the three dare blocks top to bottom."

key-files:
  created: []
  modified:
    - index.html

key-decisions:
  - "Dare face 1 (zero favor per the existing CONFIG.sirens.listenFavor table) is where the wreck risk lives: it always pays extra world-anger (CONFIG.sirens.wreckWorldExtra) on top of the scene's base world rise, and from Scene 2 ('The Full Song') onward it also costs a point of hold (CONFIG.sirens.wreckCrew) — the lure escalating from purely mystical (world only) to physically dangerous (a mate's grip lost) as the arc progresses toward the reef."
  - "Abide is deliberately flat (d:{} on all four faces, all three scenes) with zero favor anywhere — this is an intentional, in-comment-documented departure from the general D-05 default-favor-path law (Abide-6 normally grants a favor nod, as in Helios): Sirens inverts it on purpose, since the disciplined choice here is to hear nothing at all, and rewarding that would undercut the whole 'rewarded temptation' premise."
  - "Give (bind/plug a mate) keeps a flat effect across all three scenes (CONFIG.fx.penalty satchel cost, -CONFIG.sirens.bindReduce world) rather than scaling by scene — the per-face and per-scene variation lives entirely in tell-text flavor; only Dare's numbers escalate, since Give is the safety-valve mechanic and doesn't need its own arc."
  - "Retired the shared sirensReskin() closure entirely (all three scenes now define `beats`, none retain a `reskin` key) rather than leaving it as dead code, closing out the last of the three original reskin-based islands alongside Cyclops (02-02) and ahead of Lotus (02-04)."
  - "onDepart()'s reef-wreck check (state.world >= doomAt, a per-player 10%-chance drowning via throwBone()) was left completely unchanged — the plan's escalation logic feeds that existing check rather than duplicating or bypassing it, so a run that accumulates enough Rocks across all 3 scenes (not per-scene) still resolves through the same single end-of-island doom path used since Phase 1."

requirements-completed: [CONTENT-03]

coverage:
  - id: D1
    description: "All three Sirens scenes (The First Notes, The Full Song, The Reef) converted from the shared sirensReskin() closure to full dare/abide/give x {1,3,4,6} beats; sirensReskin() function removed as dead code."
    requirement: "CONTENT-03"
    verification:
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed demo && node scratchpad/harness.mjs --seed alpha (validateBeats ok, no sirens scene in notYetConverted, both reach THE VERDICT)"
        status: pass
      - kind: other
        ref: "10-seed sweep (demo/alpha/beta/gamma/delta/epsilon/zeta/eta/theta/iota) via scratchpad/harness.mjs — all 10 reach THE VERDICT with validateBeats ok"
        status: pass
    human_judgment: false
  - id: D2
    description: "Sirens Dare grants favor scaled by face (CONFIG.sirens.listenFavor) and raises the Rocks (CONFIG.sirens.worldPerListen, escalating per scene); the Dare-favor grant is explicitly flagged in-data as the one sanctioned D-05 exception via a block comment above EPISODES.sirens.scenes."
    requirement: "CONTENT-03"
    verification:
      - kind: other
        ref: "grep -n favor:CONFIG index.html — Sirens Dare cells (3/4/6, all three scenes) are the only positive favor grants on a Dare verb anywhere in the file; Helios's only other favor:CONFIG hit on Dare (face 3) is a penalty (favor:CONFIG.fx.penalty), and Helios's favor grant is on Abide-6 (the default law path), not Dare"
        status: pass
      - kind: other
        ref: "transcript sweep (40-300 seeds via throwaway scratchpad scripts, not committed) — captured live Dare-favor lines (e.g. 'A few clear notes reach you — kleos worth having...' with +1..+3 favor) across all three scenes"
        status: pass
    human_judgment: false
  - id: D3
    description: "At least one bad Dare face (face 1) carries a wreck cost: extra world-anger in all three scenes via CONFIG.sirens.wreckWorldExtra, plus a direct crew/hold cost via CONFIG.sirens.wreckCrew from Scene 2 onward; the existing reef-wreck onDepart (world >= doomAt) still fires and is unchanged."
    requirement: "CONTENT-03"
    verification:
      - kind: other
        ref: "transcript sweep (300 seeds, all-greedy temperament bias) — captured 6 direct hits of the Scene-2/3 face-1 crew-loss cells ('a mate's grip torn loose' / 'a mate loses their hold', each with a live '-1 hold' delta) and 12/40 reef-wreck ('grinds onto the reef') triggers in a mixed-temperament 40-seed sweep"
        status: pass
    human_judgment: false
  - id: D4
    description: "Sirens Abide is safe/thin (d:{} on all faces, zero favor, zero wreck, all three scenes) and Give reduces the Rocks at a small satchel cost with zero favor; no bare integer literals in any Sirens beats d:{} cell."
    requirement: "CONTENT-03"
    verification:
      - kind: other
        ref: "grep -nE \"(you|crew|favor|world):[[:space:]]*-?[0-9]\" index.html — only LAND_TABLE/SEA_TABLE fallback lines and unrelated state-init lines match; zero hits inside any Sirens beats cell"
        status: pass
    human_judgment: false

duration: ~25min
completed: 2026-07-26
status: complete
---

# Phase 2 Plan 3: Sirens Summary

**Sirens's three scenes now resolve entirely through beats as a rewarded-temptation escalation (distant song → full lure → the reef), with the Dare-favor grant preserved and explicitly flagged in-data as the single sanctioned exception to the Abide-only favor law, plus a scene-escalating wreck risk on the worst Dare face.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-07-26T04:15Z (approx, first file read)
- **Completed:** 2026-07-26T04:40Z
- **Tasks:** 1
- **Files modified:** 1 (index.html)

## Accomplishments
- Converted all three Sirens scenes ("The First Notes", "The Full Song", "The Reef") from the shared `sirensReskin()` closure to full `beats` (dare/abide/give × {1,3,4,6}); removed `sirensReskin()` as dead code — no scene retains a `reskin` key.
- Preserved Sirens Dare's favor grant (`CONFIG.sirens.listenFavor[face]`) as the deliberate, explicitly flagged exception to the D-05 favor law, documented in a substantial block comment directly above `EPISODES.sirens.scenes` explaining why the exception exists and warning future authors not to copy it.
- Escalated the Rocks (`state.world`) rise per scene: base `CONFIG.sirens.worldPerListen` in Scene 1, `+CONFIG.fx.tiny` in Scene 2, `+CONFIG.fx.small` in Scene 3 — the "distant song → full lure → the reef" arc (D-09) reads directly off the Dare cells' escalating costs.
- Made Dare face 1 (zero favor) the locus of wreck risk: extra world-anger via `CONFIG.sirens.wreckWorldExtra` in every scene, plus a direct hold cost via `CONFIG.sirens.wreckCrew` starting Scene 2 — verified live via transcript sweep (6 crew-loss hits across 300 seeds, 12/40 full reef-wrecks in a mixed-temperament 40-seed sweep).
- Made Abide flat and thin across all three scenes (`d:{}` on every face, zero favor) — an intentional, commented departure from the general Abide-6-favor default, since Sirens' whole point is that the disciplined choice pays nothing.
- Kept Give (bind/plug a mate) at a flat, un-escalating cost (`CONFIG.fx.penalty` satchel, `-CONFIG.sirens.bindReduce` world) across all scenes, with only tell-text flavor varying by scene/face.
- Extended `CONFIG.sirens` with `wreckWorldExtra` and `wreckCrew`; left the existing reef-wreck `onDepart()` check (`world >= doomAt`, per-player 10%-chance drowning) completely unchanged.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author Sirens scenes 1-3 to beats — Dare-favor (flagged) + wreck risk, Abide safe/thin, Give binds** - `9055dc2` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified
- `index.html` - Sirens (`EPISODES.sirens`) all three scenes fully authored to `beats`; `sirensReskin()` removed; `CONFIG.sirens` extended with `wreckWorldExtra`/`wreckCrew`

## Decisions Made
- Dare face 1's wreck risk escalates in two stages: world-anger only in Scene 1 (the song is still just "distant"), then world-anger + a direct hold cost from Scene 2 onward (the lure has "grown physical") — matching D-09's rising-stakes arc without needing a stateful `fx` counter (Sirens has no per-episode counter to track, unlike Cyclops's `drunk`/`progress`).
- Abide grants zero favor on all faces in all three scenes, a deliberate inversion of the general D-05 default (Abide-6 = favor nod) that's true elsewhere (Helios). This is documented in the flag comment so it isn't mistaken for an oversight.
- Give stays flat (no per-scene escalation) — its role is the safety valve (push the Rocks back), and letting it scale up alongside Dare's payoff/risk would blunt the temptation the island is built around.
- `sirensReskin()` was deleted rather than left as unused dead code, since all three scenes it served are now fully converted (matches the pattern set by Cyclops's Task 1 in 02-02, which converted its two remaining reskin scenes without leaving the old closures behind).

## Deviations from Plan

None - plan executed exactly as written. The single task matched its `<action>` and `<acceptance_criteria>` without requiring an architectural change or unplanned bug fix.

## Issues Encountered
- The shared `scratchpad/harness.mjs` only asserts pass/fail + THE VERDICT + `validateBeats` coverage, not per-episode transcript content or wreck-path frequency, so three throwaway (uncommitted) transcript-sweep variants were written in the OS scratchpad directory to confirm: (1) the Dare-favor grant fires and scales by face across all three scenes, (2) the face-1 wreck risk (world-anger and crew/hold cost) actually fires in seeded transcripts, and (3) the reef-wreck `onDepart` path can trigger from accumulated world across a full island run. None of these scripts were added to the repo — they exist only to validate this plan's mechanics before committing and are not part of the deliverable.
- Confirmed the pre-existing hold-economy dynamics (documented in `02-01-SUMMARY.md`/`02-02-SUMMARY.md` and project memory) still apply to Sirens runs, but did not observe any Sirens-specific starvation lockup across the 300+ seed sweep — every sampled seed reached THE VERDICT. The known death-spiral balance issue remains explicitly out of scope for this phase (Phase 3 does the real tuning).

## Next Phase Readiness
- Sirens is fully on the beats path (all 3 scenes) with the D-03 rewarded-temptation/wreck escalation and its single sanctioned D-05 Dare-favor exception explicitly flagged in-data — confirmed the only Dare-favor grant in the whole file (`grep -n favor:CONFIG index.html` shows Helios's other Dare `favor:` hit is a penalty, not a grant).
- Two of the four islands (Cyclops, Sirens) are now fully authored to beats with their favor-law status settled; Lotus remains for 02-04, and 02-05's favor-law audit can now confirm Sirens is the sole exception once Lotus closes out.
- The authoring pattern (beats cells with scene-escalating CONFIG arithmetic, no `fx` hatch needed when there's no stateful counter) is proven and ready for 02-04 (Lotus) to adapt as needed.
- No blockers. The known hold-economy balance question remains explicitly deferred to Phase 3 per the roadmap.

---
*Phase: 02-themed-island-content-favor-law-reconciliation*
*Completed: 2026-07-26*

## Self-Check: PASSED

- FOUND: index.html
- FOUND: .planning/phases/02-themed-island-content-favor-law-reconciliation/02-03-SUMMARY.md
- FOUND: 9055dc2 (Task 1 commit)
