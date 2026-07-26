---
phase: 02-themed-island-content-favor-law-reconciliation
plan: 04
subsystem: game-content
tags: [beats-engine, config-tiers, headless-harness, vanilla-js, favor-law]

# Dependency graph
requires:
  - phase: 01-effect-engine-sequential-resolution
    provides: "beats/resolveEffect()/narrate()/validateBeats() seam, CONFIG.fx tiny/small/penalty, resolutionOrder(), canAffordDraw()"
  - phase: 02-themed-island-content-favor-law-reconciliation
    provides: "scratchpad/harness.mjs headless verification harness (02-01); Dare-favor-retune precedent from Cyclops (02-02)"
provides:
  - "Lotus-Eaters (all 3 scenes) fully authored to beats, with Abide/Dare semantics INVERTED per D-04 — Abide is the risky 'give in to the fruit' road, Dare is the safe 'haul back' survival move"
  - "Third and final shipped Dare-favor violation closed (D-05) — Lotus Dare grants zero favor; Abide-6 is the sole favor path on this island"
  - "botDecide()'s lotus branch generalized to match the inverted mapping across all 3 scenes (previously scene-1-only rescue logic, now uniform)"
affects: [02-05-favor-law-audit]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "fx-hatch narration handoff: resolveEffect's tell(p) signature only receives the acting player, not the fx closure's runtime result — when a dynamic outcome (found a struck mate or not) needs to reach tell(), stash it on state.ep (reset per-island in runIsland) and read it back synchronously in the same resolveEffect call, before the next player's reveal can overwrite it."
    - "Per-scene fx factory: lotusAbideFx(sceneIdx) is a function that RETURNS the fx closure, closing over CONFIG.lotus.struckOn[sceneIdx] — lets one small helper serve three scenes' worth of escalating risk without repeating the membership-check logic three times."

key-files:
  modified:
    - index.html

key-decisions:
  - "Abide/Dare semantics inverted only for Lotus (D-04 is explicit about this): everywhere else Abide is safe/inert and Dare is risky, but here Abide (eating the offered fruit) is the risky path and Dare (hauling back) is the safe survival move — the clearest lethal-if-only reading of Abide in the game."
  - "CONFIG.lotus.struckOn became a per-scene array (`[[1],[1,3],[1,3,4]]`) instead of one flat array, so the strand risk escalates scene-to-scene (taste -> drowse -> strand, D-09) while staying CONFIG-sourced (D-06, no bare integers)."
  - "Dare's conditional satchel cost (paid only when a rescue actually happens) lives entirely inside the fx hatch rather than the cell's `d` — a flat declarative `d` object can't express 'cost 1 only if X', which is exactly what the fx escape hatch exists for."
  - "botDecide()'s lotus branch was generalized from a scene-1-only special case to a uniform rule applied every scene, since Dare now means 'haul back' in all three scenes (not just scenes 2-3 as shipped) — greedy bots now abide (indulge) and pious bots now dare (resist), the mirror image of the old mapping. This was a necessary Rule-1 fix: the shipped bot AI assumed the pre-inversion verb meanings and would have played backward without it."
  - "lotusEat()/lotusRescue() reskin closures retired outright (not left as dead code) — no scene references them once all three converted to beats, matching the mkHeliosDare() precedent from 02-01."

patterns-established:
  - "Per-episode fx factory pattern (lotusAbideFx(sceneIdx)) for expressing scene-to-scene escalation of a boolean state flip without duplicating the membership check."

requirements-completed: [CONTENT-04]

coverage:
  - id: D1
    description: "Lotus-Eaters scenes 1-3 ('The Offering', 'Going Back', 'Cast Off') fully authored to beats (dare/abide/give x {1,3,4,6}) with D-04's inverted semantics: Abide eats the lotus (free ration, escalating lotus-struck risk via CONFIG.lotus.struckOn[sceneIdx]); Dare hauls yourself or a struck mate back to the ship (zero favor); Give shares a ration to the hold (never moves favor)."
    requirement: "CONTENT-04"
    verification:
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed demo && node scratchpad/harness.mjs --seed alpha (both validateBeats ok, no lotus scene in notYetConverted, both reach THE VERDICT)"
        status: pass
      - kind: other
        ref: "grep -nE \"(you|crew|favor|world):[[:space:]]*-?[0-9]\" index.html — matches only LAND_TABLE/SEA_TABLE fallback lines, no bare integers in Lotus beats"
        status: pass
    human_judgment: false
  - id: D2
    description: "Lotus Dare-favor violation closed (D-05): grep across the lotus episode block shows favor appears only on the three Abide-6 cells; no Dare cell in any scene grants favor."
    requirement: "CONTENT-04"
    verification:
      - kind: other
        ref: "awk '/lotus: \\{/,/^};$/' index.html | grep -n favor — only 3 hits, all Abide-6"
        status: pass
    human_judgment: false
  - id: D3
    description: "Full-crew Abide is genuinely lethal-if-only: onDepart strands and kills any player still lotus-struck; a same-scene mid-reveal rescue is also possible since resolution is sequential within a scene."
    verification:
      - kind: other
        ref: "20-seed sweep via scratchpad/harness.mjs (demo/alpha/.../tau) — 7 of 20 seeds exercise a strand-to-death ('still lotus-struck as the ship sails'), and the alpha-seed transcript shows both a same-scene rescue (P4 dares and frees P1 within Scene 2's own reveal) and an eventual strand (P4 dies at Scene 3's onDepart)"
        status: pass
    human_judgment: false
  - id: D4
    description: "A 0-human seeded run still completes across many seeds (the harness's THE VERDICT/validateBeats-ok assertion), keeping Lotus survivable per D-07 despite Abide being the risky road."
    verification:
      - kind: unit
        ref: "20-seed sweep (demo/alpha/beta/gamma/delta/epsilon/zeta/eta/theta/iota/kappa/lambda/mu/nu/xi/omicron/pi/rho/sigma/tau) via scratchpad/harness.mjs — all 20 reach THE VERDICT with validateBeats ok; determinism re-verified (same seed -> byte-identical log)"
        status: pass
    human_judgment: false

duration: ~15min
completed: 2026-07-26
status: complete
---

# Phase 2 Plan 4: Lotus-Eaters Content & Dare-Favor Retune Summary

**Lotus-Eaters authored to beats with Abide/Dare semantics fully inverted per D-04 — Abide now eats the lotus and risks an escalating (taste→drowse→strand) lotus-struck fate, Dare now hauls the struck back to the ship for zero favor, closing the third and final shipped Dare-favor violation (D-05).**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-07-26T00:18Z (approx)
- **Completed:** 2026-07-26T00:33:35-04:00
- **Tasks:** 1
- **Files modified:** 1 (index.html)

## Accomplishments
- Converted all three Lotus-Eaters scenes ("The Offering", "Going Back", "Cast Off") from `reskin`-closure resolution (`lotusEat`/`lotusRescue`) onto full `beats` tables (dare/abide/give × {1,3,4,6}), matching the phase's proven authoring pattern from Helios/Cyclops/Sirens.
- Inverted the shipped Dare/Abide asymmetry specifically for this island per D-04: Abide (giving in to the offered fruit) is now the risky road — it grants a free ration (`CONFIG.lotus.rations`) but on this scene's `struckOn` faces sets `p.lotusStruck` via the `fx` hatch, escalating from `[1]` (scene 1, ~10% risk) to `[1,3]` (scene 2, ~50%) to `[1,3,4]` (scene 3, ~90%) — the taste→drowse→strand arc (D-09). Face 6 resists entirely and is the island's sole favor path (Abide-6, D-05).
- Dare is now the safe survival move in all three scenes (not just scenes 2-3 as shipped): it finds a struck living mate and clears them (`lotusDareFx`, a small satchel cost on success, same as the retired `lotusRescue`), but grants **zero favor** — closing the third and final shipped Dare-favor violation named in the phase context.
- Give shares a ration into the hold on every face, never moving favor, consistent with the general law established across Helios/Sirens.
- Generalized `botDecide()`'s Lotus branch from a scene-1-only rescue special case to a uniform rule spanning all three scenes, and flipped its temperament mapping to match the inverted verb meanings (greedy bots now indulge/abide, pious bots now resist/dare) — the shipped AI assumed the pre-inversion semantics and would have played backward against the new design without this fix.
- Retired `lotusEat()`/`lotusRescue()` outright (no scene references them anymore), matching the `mkHeliosDare()` removal precedent from 02-01.
- Verified via a 20-seed sweep of `scratchpad/harness.mjs`: all 20 reach THE VERDICT with `validateBeats()` ok; 7 of 20 seeds exercise an actual lotus-struck strand-to-death; the `alpha` seed transcript shows both a same-scene mid-reveal rescue and a later unrescued strand, confirming both halves of the "lethal-if-only" design read correctly end to end. Determinism re-confirmed (same seed → byte-identical log).

## Task Commits

Each task was committed atomically:

1. **Task 1: Author Lotus scenes 1-3 to beats — Abide succumbs (struck), Dare hauls back (no favor), Give shares** - `f5e5c2e` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified
- `index.html` - `CONFIG.lotus.struckOn` restructured to a per-scene escalating array; all three Lotus scenes converted to full `beats` tables; `botDecide()`'s lotus branch generalized and flipped; `lotusEat()`/`lotusRescue()` retired in favor of `lotusAbideFx(sceneIdx)`/`lotusDareFx`/`lotusDareTell()`.

## Decisions Made
- Kept the free-ration gain (`d:{you:CONFIG.lotus.rations}`) declarative on Abide cells, and used the `fx` hatch only for the boolean lotus-struck flip — the numeric delta is expressible in `d` and belongs there; only the face-conditional boolean needs the escape hatch.
- Put Dare's conditional satchel cost (paid only when a rescue actually happens) entirely inside `fx` rather than `d`, since a flat declarative object can't express "cost 1 only if a struck mate was found" — this is exactly the class of extra state mutation the fx hatch's own code comment says it exists for.
- Generalized `botDecide()`'s lotus branch across all three scenes (auto-fixed, see Deviations) rather than leaving the old scene-1-only special case in place, since Dare's meaning ("haul back") is now uniform across all three scenes in the new design, not just scenes 2-3.
- Left `CONFIG.lotus.struckOn`'s escalation at `[1] -> [1,3] -> [1,3,4]` (not more aggressive) to honor D-07's "gentler, survivable first draft" directive — empirically this produces real strand-deaths in a third of sampled seeds without single-handedly forcing a total wipe; the one seed (`epsilon`) that did end in a total-crew-death was independently caused by the pre-existing hold-economy starvation spiral (deaths began well before the crew ever reached Lotus), not by this island's content — this matches the already-documented, phase-3-deferred imbalance noted in 02-01's summary and the project's playtest-balance memory.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Generalized and flipped `botDecide()`'s Lotus temperament mapping to match the inverted verb semantics**
- **Found during:** Task 1, immediately after authoring the beats tables
- **Issue:** The shipped bot AI (`botAct()`'s `ep.id==='lotus'` branch) was written for the pre-inversion semantics: it special-cased only scene index 1 for rescue behavior, and its scene-0/2 fallback mapped `greedy -> dare` (eat) / `pious -> abide` (refuse) — i.e., Dare meant "eat the lotus" and Abide meant "refuse it". This plan's task inverted those meanings everywhere (Dare = haul back, Abide = eat, uniformly across all 3 scenes). Left unchanged, the shipped bot logic would have been silently backward: greedy bots would "dare" (now meaning resist/haul-back) and pious bots would "abide" (now meaning indulge) — the opposite of the intended characterization, and the scene-1-only rescue special case would never fire in scenes 0 or 2 despite Dare now meaning rescue there too.
- **Fix:** Replaced the scene-indexed branch with a single uniform rule applied every scene: look for a struck living mate first (non-greedy + can-give bots rescue), otherwise greedy bots abide (indulge) and pious bots dare (resist), balanced bots split randomly — the mirror image of the removed logic, matching the new verb meanings.
- **Files modified:** index.html (`botAct()`, the `ep.id==='lotus'` branch)
- **Verification:** 20-seed `scratchpad/harness.mjs` sweep all pass; multiple seeds show non-greedy bots correctly choosing "dare" to rescue a struck greedy mate mid-scene (e.g. seed `alpha`: "P4 dares ... and haul P1 to their feet").
- **Committed in:** f5e5c2e (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Necessary for correctness — the plan's own semantic inversion made the shipped bot AI's temperament mapping backward; fixing it was inherent to correctly implementing the task, not scope creep. No architectural change, no new files.

## Issues Encountered
None beyond the deviation above. The known hold-economy death-spiral (documented in 02-01's summary and project memory) surfaced once in the 20-seed sweep (`epsilon`) but was confirmed via full-log inspection to originate from pre-Lotus starvation deaths, not from this plan's content — consistent with the already-deferred Phase 3 balance work.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All three shipped Dare-favor violations named in the phase context (Cyclops boast, Sirens listen [intentionally kept], Lotus rescue) are now resolved per D-05: Cyclops and Lotus grant zero Dare-favor; Sirens remains the one explicitly flagged exception.
- 02-05 (the favor-law audit plan) can now grep the whole file for any remaining stray Dare-favor grant with a clean baseline — Lotus's contribution to that audit is fully closed.
- No blockers. The pre-existing hold-economy death-spiral remains explicitly out of scope for this phase (Phase 3, per `02-CONTEXT.md`'s `<deferred>` section).

---
*Phase: 02-themed-island-content-favor-law-reconciliation*
*Completed: 2026-07-26*

## Self-Check: PASSED

- FOUND: index.html
- FOUND: .planning/phases/02-themed-island-content-favor-law-reconciliation/02-04-SUMMARY.md
- FOUND: f5e5c2e (Task 1 commit)
