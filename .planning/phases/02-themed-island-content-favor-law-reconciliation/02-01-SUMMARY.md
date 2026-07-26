---
phase: 02-themed-island-content-favor-law-reconciliation
plan: 01
subsystem: game-content
tags: [beats-engine, config-tiers, headless-harness, vanilla-js]

# Dependency graph
requires:
  - phase: 01-effect-engine-sequential-resolution
    provides: "beats/resolveEffect()/narrate()/validateBeats() seam, CONFIG.fx tiny/small/penalty, resolutionOrder(), canAffordDraw()"
provides:
  - "CONFIG.fx extended with big/huge payoff tiers for cross-scene escalation"
  - "Helios (Cattle of Helios) fully authored to beats across all 3 scenes — the phase's proven authoring pattern"
  - "scratchpad/harness.mjs — reusable headless Node verification harness for the rest of phase 2"
affects: [02-02-cyclops-content, 02-03-sirens-content, 02-04-lotus-content, 02-05-favor-law-audit]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "vm-context headless harness: extract index.html's inline <script>, run it in Node's vm module behind a minimal DOM stub, then run a second vm.Script in the same context to reach the first script's top-level let/const bindings (state, CONFIG, EPISODES, newState, runGame, validateBeats) — no browser required"
    - "Rising-arc authoring: Dare high-face bounty non-decreasing across a 3-scene arc (CONFIG.fx.small/big -> big/huge -> huge/huge) while Abide/Give stay flat, so the widening gap between flat restraint and rising temptation IS the story beat"

key-files:
  created:
    - scratchpad/harness.mjs
  modified:
    - index.html

key-decisions:
  - "CONFIG.fx gained two new tiers (big=4, huge=6) rather than per-episode CONFIG.helios magnitudes — the D-01 bounty and its cross-scene escalation fit the shared cross-scene tier vocabulary cleanly, so no CONFIG.helios additions were needed this plan."
  - "Helios Dare-3 always costs favor (condemned), Dare-1 always raises world (seen by the Sun), Dare-4/6 always pay a private/shared stash bounty, escalating scene to scene — matches the user's verbatim D-01 template exactly for scene 1 and extends its shape for scenes 2-3."
  - "Abide/Give magnitudes intentionally do NOT escalate across the three scenes — only Dare's face-6 bounty and face-1 wrath rise. The flat-vs-rising asymmetry is what makes scene 3 read as the moment restraint stops being able to keep pace with temptation."
  - "mkHeliosDare() retired outright (not left dead) once both remaining callers (scenes 2 and 3) converted to beats — no scene reads from it anymore."

patterns-established:
  - "Headless verification without a browser: vm.createContext + two sequential vm.Script runs sharing one persistent global lexical environment, the same mechanism the Node REPL relies on for cross-statement let/const visibility."

requirements-completed: [CONTENT-01]

coverage:
  - id: D1
    description: "Helios scene 1 'The Meadow' enriched to the D-01 bounty scale: Dare-6 pays stash+2/hold+4, Dare-1 raises the world track (seen by the Sun), Abide inert except a favor-nodding forage gain on 6."
    requirement: "CONTENT-01"
    verification:
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed demo (validateBeats ok, THE VERDICT reached)"
        status: pass
      - kind: other
        ref: "grep -nE \"(you|crew|favor|world):[[:space:]]*-?[0-9]\" index.html — matches only LAND_TABLE/SEA_TABLE fallback"
        status: pass
    human_judgment: false
  - id: D2
    description: "Helios scenes 2 'The Hunger' and 3 'The Reckoning' converted from reskin:{dare:mkHeliosDare()} to full dare/abide/give x {1,3,4,6} beats tables, rising arc, Dare-6 bounty non-decreasing scene to scene, no positive Dare favor anywhere."
    requirement: "CONTENT-01"
    verification:
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed demo && node scratchpad/harness.mjs --seed alpha (both validateBeats ok with no Helios scene in notYetConverted, both reach THE VERDICT)"
        status: pass
      - kind: other
        ref: "10-seed sweep (demo/alpha/beta/gamma/delta/epsilon/zeta/eta/theta/iota) via scratchpad/harness.mjs — all reach THE VERDICT"
        status: pass
    human_judgment: false
  - id: D3
    description: "scratchpad/harness.mjs — reusable headless Node harness (no browser available) asserting a 0-human seeded run reaches THE VERDICT with validateBeats ok, for reuse by every later plan in this phase."
    verification:
      - kind: unit
        ref: "node scratchpad/harness.mjs --seed <any> — exit 0, prints THE VERDICT + validateBeats ok"
        status: pass
    human_judgment: false

duration: ~15min
completed: 2026-07-26
status: complete
---

# Phase 2 Plan 1: Helios Tracer Summary

**CONFIG.fx gained big/huge payoff tiers; all three Cattle-of-Helios scenes now resolve entirely through beats with a non-decreasing Dare-6 bounty (stash+2/hold+4 → +4/+6 → +6/+6) and a matching Dare-1 wrath spike, proven by a new headless vm-based Node harness across a 10-seed sweep.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-07-25T23:48Z (approx, first read after prior commit)
- **Completed:** 2026-07-26T00:00:13-04:00
- **Tasks:** 2
- **Files modified:** 2 (index.html, scratchpad/harness.mjs)

## Accomplishments
- Extended `CONFIG.fx` with `big` (4) and `huge` (6) payoff tiers alongside the existing `tiny`/`small`/`penalty`, sized to express the D-01 hold bounty (stash+2/hold+4 on Helios scene 1's Dare-6).
- Enriched Helios scene 1 "The Meadow" to the user's verbatim D-01 template: Dare-1 raises the world track (seen by the Sun), Dare-3 costs favor (condemned), Dare-4/6 pay a private/shared stash bounty, Abide is inert except a favor-nodding forage gain on 6, Give sustains the hold on every face.
- Converted Helios scenes 2 "The Hunger" and 3 "The Reckoning" off their `mkHeliosDare()` reskin onto full beats tables, escalating the Dare high-face bounty non-decreasingly across the arc (2/4 → 4/6 → 6/6) while Abide/Give stay flat — the growing gap between flat restraint and rising temptation is the D-09 story.
- Retired `mkHeliosDare()` entirely — its only two remaining callers are gone, and no scene references it anymore.
- Built `scratchpad/harness.mjs`, a reusable headless Node verification harness (no browser available in this environment) that runs index.html's inline script in a `vm` context behind a minimal DOM stub and drives a real 0-human `?seed=&auto=1&humans=0&speed=0`-equivalent game to completion, asserting `validateBeats()` ok + `state.over` + a `THE VERDICT` log line. Verified clean across 10 distinct seeds.

## Task Commits

Each task was committed atomically:

1. **Task 1: CONFIG payoff tiers + Helios "The Meadow" enriched to D-01 scale, proven end-to-end** - `def488f` (feat)
2. **Task 2: Author Helios scenes 2 "The Hunger" and 3 "The Reckoning" to full beats** - `5cb4fc9` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified
- `index.html` - CONFIG.fx tiers extended (big/huge); all three Helios scenes (`The Meadow`, `The Hunger`, `The Reckoning`) fully authored to `beats`; `mkHeliosDare()` retired
- `scratchpad/harness.mjs` - new reusable headless Node harness (vm-context DOM stub) for verifying seeded 0-human runs without a browser

## Decisions Made
- Used only the shared `CONFIG.fx` tier vocabulary (no new `CONFIG.helios` scene-specific magnitudes) — the D-01 bounty and its escalation expressed cleanly with `tiny/small/big/huge/penalty`, so D-06's per-episode CONFIG tier stayed unused this plan (available for a future island whose numbers don't fit the shared tiers).
- Abide and Give deltas are held flat across all three Helios scenes by design — only Dare's face-6 bounty and face-1 wrath escalate scene to scene, so the story reads as restraint's reward staying constant while temptation's payoff (and risk) climbs.
- `mkHeliosDare()` removed outright rather than left as dead code, since this plan's own edits eliminated its only two remaining call sites.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed a tell/delta mismatch on Helios Give face 1**
- **Found during:** Task 1 (enriching scene 1's beats)
- **Issue:** The Phase-1 tracer's scene-1 `give` face-1 cell narrated "A ration goes into the hold" but its `d` only ever debited the giver (`you:-1`) with no matching `crew:+1` — inherited unchanged from the old `LAND_TABLE.give[1]` fallback, which intentionally withholds the hold gain on a 1. Since Give is documented as "riskless, sustains the crew" (02-CONTEXT.md `<specifics>`) with no face-dependent asymmetry called for, the mismatch between narration and mechanics was a bug, not an intentional design choice.
- **Fix:** Face 1 now grants `crew:CONFIG.fx.tiny` alongside the existing `you:CONFIG.fx.penalty`, matching its own narration and the other three faces.
- **Files modified:** index.html (scene 1's `beats.give[1]` cell)
- **Verification:** `node scratchpad/harness.mjs --seed demo` still reaches THE VERDICT with `validateBeats()` ok; no bare-integer grep regression.
- **Committed in:** def488f (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Necessary for correctness (narration/mechanics consistency); no scope creep — the fix lives entirely inside the scene-1 beats block this task was already rewriting.

## Issues Encountered
- Node's `vm` module quirk (top-level `let`/`const` do not attach as properties of the sandbox object) required confirming empirically that separate `vm.Script.runInContext()` calls in the *same* context still share one persistent global lexical environment (verified via a standalone smoke test before writing the harness) — this is what lets the harness reach `state`/`newState`/`runGame`/`validateBeats` from a second script without index.html exposing anything new.
- A multi-seed sweep (`beta`, `gamma`) surfaces the pre-existing hold-economy death-spiral noted in project memory (`odyssey-crew-playtest-balance`) — some seeds end with the whole crew dead. This is expected and out of scope: the plan's `<domain>` explicitly defers balance tuning to Phase 3's multi-seed sweep; the acceptance bar here is that the run *completes* (reaches THE VERDICT), which it does on every seed tested.

## Next Phase Readiness
- The authoring pattern (CONFIG tier → beats cells → `validateBeats()` coverage → headless-harness-proven seeded run) is de-risked and ready for 02-02 (Cyclops), 02-03 (Sirens), 02-04 (Lotus) to replicate.
- `scratchpad/harness.mjs` is committed and reusable as-is by every later plan in this phase — no changes needed to run it against newly authored islands (`node scratchpad/harness.mjs --seed <name>`).
- No blockers. The known hold-economy death-spiral remains explicitly deferred to Phase 3 per the roadmap.

---
*Phase: 02-themed-island-content-favor-law-reconciliation*
*Completed: 2026-07-26*
