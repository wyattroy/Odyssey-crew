# Odyssey Crew

## What This Is

A 4-player tabletop game based on Homer's *Odyssey*, playable digitally and physically in one ~60–90 min sitting. **You are not Odysseus — you are the crew** trying to survive the voyage home while an NPC Odysseus (driven by cards) leads you into predicament after predicament. Two goals, one ranking: get the ship home to Ithaca, and arrive with the most **favor** from the gods. The design is a "one engine, many questions" system: a tiny two-verb grammar (Abide / Dare) replayed across a random subset of self-contained island episodes.

## Core Value

The commons tension must actually fire: disaster should emerge from the *sum of private, individually-reasonable choices* — no coordination, no visible villain — while cooperation stays optimal for *winning* (favor) and defection stays optimal only for *bare survival*. If the prototype doesn't make that tension playable and felt, nothing else matters.

## Current State

**Shipped: v1.1 Themed Episodes & Interactive Board** (2026-07-26) — 4 phases, 18 plans, 33/33 requirements.

The game is a *felt* game, not just a rules-complete one. Every scene of every island and all three anchors resolve through one declarative `beats` table (verb × roll face) carrying both a tuned payoff and a one-sentence story beat, and the whole voyage is played on a visual board — advancing boat, draining marble bag, live dice, clickable verbs, on-board narration and crew status — rather than read from a text log.

The headline change was **not** in the original v1.1 plan: what began as "anchor retrofit + number tuning" became a core-economy redesign during discuss-phase 3. The game folded from three verbs to **two (Abide / Dare)** and from three divine axes to **one currency (favor)**. That fold is what finally killed the v1.0 death spiral.

**The encoded design law (D-11):** Abide serves the commons — it always fills the shared hold, and a high roll earns the gods' notice (favor). Dare transgresses for your own stash — a high roll gets away with it, a low roll means the gods catch you and favor is lost. Favor is the single divine currency: the win condition, the lifeline that buys a life back from the dead, and the world's mood that shapes the seas and staves off collective doom.

**Measured state:** `sweep.mjs 80/200 --assert` passes every D-09 target — 0% all-dead (from ~50% pre-redesign), 93-94% full-crew-at-Ithaca with real survivor variance, 70-78% of seeds show at least one death, 15-19 distinct winner-favor values, and the pious road out-earns the greedy road on favor by roughly 8-9x while surviving at least as well.

**Known soft spot:** that last clause is the weak one. The survival gap between temperaments is only ~2pp (greedy 98% alive vs pious 96%) — favor is strongly contested, but "cooperation is fragile" is not yet dramatic. Deliberately left for a later milestone; the levers that would move it (bot AI, the commons-sharing mechanic) were out of v1.1's scope.

## Next Milestone Goals

Not yet defined — run `/gsd-new-milestone`. Candidate scope carried forward in `ROADMAP.md`: the automated balance-simulation harness (SIM-01/02), production art/sound (POLISH-01), more episodes (POLISH-02), the thin-survival-margin retune, and shipping v1.1 to GitHub Pages (the live site still serves v1.0).

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

**v1.0 prototype (shipped in `index.html`):**
- [x] Single self-contained `index.html` — all HTML/CSS/JS inline, vanilla JS, no build/network/storage, runs by double-click offline
- [x] Full voyage end-to-end: Troy → 4 dealt islands → Hades → Phaeacia → Ithaca, no dead-end states
- [x] Eat blind-commit with hold shortfall → lot-casting → starvation (two-strike) → death; death economy (Charon toll, Orpheus rescue)
- [x] *(v1.0 history — superseded by Phase 3's FAVOR LAW, D-04/D-11)* Favor only moved via the gods (Abide-6 grants, Dare-1 removes, Give never). Now: Abide is the sole favor road (grant on a high roll), Dare's only relationship to favor is a cost when caught, and Give no longer exists as a verb — see the two-verb law above.
- [x] *(v1.0 history — superseded by Phase 3's currency unification, D-04/D-05)* Crossings: marble bag with rising land odds, variable length, always terminate; world-anger salted the bag. Now: `state.world`/`state.curse` are retired — aggregate crew **favor** alone salts the bag (`seasExtraBlue()`) and triggers collective doom/blessing (`doomFloor()`/`blessFloor()`), both scaled per living crew member so a shrinking crew never spirals.
- [x] Four worked episodes (Helios, Cyclops, Sirens, Lotus) + fixed anchors (Hades, Phaeacia, Ithaca finale)
- [x] 1–4 humans + bots via `botDecide`; three temperaments (greedy / balanced / pious); blind-commit masking + director mode
- [x] `?seed=` reproducibility; 0-human seeded game runs unattended to a winner; verbose narration log

**v1.1 Themed Episodes & Interactive Board (shipped 2026-07-26):**
- ✓ Declarative `beats` verb×face effect+narration model, one generic `resolveEffect`/`narrate` resolver, fail-loud `validateBeats()` coverage gate, all payoffs CONFIG-traceable — v1.1 (EFFECT-01..04)
- ✓ Sequential turn-ordered resolution against the shared hold; unaffordable committed draws denied whole, never partially applied; lot-casting retired — v1.1 (RESOLVE-01..03)
- ✓ All four islands authored to their moral — Helios/restraint, Cyclops/pride, Sirens/temptation, Lotus/forgetting — with the favor law reconciled across every scene — v1.1 (CONTENT-01..06)
- ✓ Two-verb grammar (Abide/Dare); Give removed engine-wide — v1.1 (ECON-01)
- ✓ Favor as the single divine currency; `state.world` and `state.curse` retired — v1.1 (ECON-02)
- ✓ Favor-as-lifeline revival; permanent loss is favor bankruptcy, not starvation — v1.1 (ECON-03)
- ✓ Keep-the-crew-whole incentives that never dead-end — v1.1 (ECON-04)
- ✓ Hades, Phaeacia and Ithaca retrofitted onto the verb grammar with validated v1.0 mechanics intact — v1.1 (ANCHOR-01..04)
- ✓ Hand-tuned economy replaces the death-spiral defaults; multi-seed sweep is the acceptance bar — v1.1 (BALANCE-01, BALANCE-02)
- ✓ Favor stays contested — v1.1 (BALANCE-03, *satisfied on direction; survival margin thin at 2pp — see Current State*)
- ✓ Interactive board as the primary play surface: voyage track + boat, draining marble bag, live dice, clickable verbs, on-board narration and crew status — v1.1 (BOARD-01..06)
- ✓ Board is a pure projection of state; blind-commit masking preserved; `?seed=` determinism intact with the log demoted but not deleted — v1.1 (BOARD-07..09)

### Active

<!-- No active milestone. Run /gsd-new-milestone to define v1.2 requirements. -->

None — v1.1 is closed and `REQUIREMENTS.md` has been archived. `/gsd-new-milestone` defines the next set fresh.

Carried forward as candidate scope (see `ROADMAP.md`): SIM-01/02 (automated balance harness + regression dashboard), POLISH-01/02 (production art/sound, more episodes), the thin-survival-margin retune, and shipping v1.1 to GitHub Pages.

### Out of Scope

<!-- Explicit boundaries. -->

- Polished production art / sound — emoji + CSS only; this is a rules-complete first playtest build, not a product
- New verbs, currencies, or tracks beyond the shipped two verbs (Abide / Dare) and three currencies (🍖 personal stash, 🛢️ the shared hold, 🫒 favor) — no separate peril tracks (world-anger/curse retired, Phase 3 D-04/D-11); surface gaps as code comments, don't invent
- Player-to-player trading of rations or favor (only inter-player transfer is the Orpheus toll)
- Networked multiplayer — hotseat only; blind commit is simulated locally
- Browser storage (localStorage/sessionStorage) — all state in one in-memory object; reload = fresh game
- Frameworks/libraries/CDN/bundlers — vanilla only
- The *automated* numeric balance simulation ("Pastry-Pirates") tuning pass — still deferred, and the reasoning now has evidence behind it. v1.1 hand-tuned the economy via thematic per-stage payoffs and cleared every acceptance target with five CONFIG values, so machine optimization was not the bottleneck; the fragmented three-verb economy was. Revisit for the thin survival margin (SIM-01), where hand-tuning demonstrably stalled.

## Context

- Two design docs are the source of truth, both under `MDs/`:
  - `Odyssey_Crew_Canon.md` — full design rationale (v1.0, the "why")
  - `create-odyssey-crew.md` — the build spec (the "how"); **where the two conflict, the build spec wins for the prototype**
- The design is locked at the structural level; only numbers marked `[tune]` are open, and those are seeded with defaults in a single `CONFIG` object for later simulation tuning.
- The game's poetic frame maps every mechanic to a real force: luck = the gods speaking, hunger = the crew's undoing, generosity = sacred hospitality (xenia), the hold = the commons.

**Codebase state after v1.1:** `index.html` is 2,495 lines (from 899 at v1.0) — still one self-contained file, vanilla JS, zero dependencies, offline by double-click. v1.1 added +1,596 / −286 lines across 101 commits over 2 days.

**Verification instruments** (all in `scratchpad/`, headless Node, no dependency added to `index.html`):
- `harness.mjs` — vm-context 0-human seeded run to a verdict; the general no-browser verification tool
- `parity.mjs` — same-seed replay diff; the `?seed=` determinism gate
- `sweep.mjs` — multi-seed balance sweep with `--assert` mode; the D-09 acceptance bar
- `econcheck.mjs` — payoff-tier / CONFIG traceability check

**Carried debt** (from the v1.1 close-out audit, `milestones/v1.1-MILESTONE-AUDIT.md`): bookkeeping only — phase-1's VERIFICATION still reads `behavior_unverified: 2` though both items were closed downstream, and phase-2's REVIEW still reads `issues_found` on a critical that Phase 3 resolved by deleting the code it described. No open functional defects.

**Live deployment:** `wyattroy.github.io/Odyssey-crew` serves v1.0 from main's root — **not** v1.1. Shipping the new build is unclaimed work.

## Constraints

- **Tech stack**: One `index.html`, vanilla JS, inline everything — no libraries, no build, no network, no storage. Runs offline by double-click. (From build spec §1.)
- **Determinism**: All randomness behind a single `rng()` seam with optional `?seed=` for reproducible playtests.
- **Architecture**: One clear game-state object, pure-ish reducer functions per phase, a render function that redraws from state, bots isolated to a single `botDecide` seam. Readability over cleverness — this file will be edited a lot.
- **Retunability**: Every tunable constant (bone weights, hold start, bag composition, tolls, pot size, thresholds, bot temperament weights) lives in one labelled `CONFIG` object.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Skip GSD research/roadmap ceremony for the prototype | The build spec is already rules-complete: §9 acceptance checklist = requirements, §10 build order = roadmap, stack is fixed | ✓ Good — v1.0 reached a playable table build fast; v1.1 then added the ceremony where it paid (33 traceable requirements across 4 verified phases) |
| Build spec wins over canon on conflicts | Explicit instruction in the build spec for prototype scope | ✓ Good — no conflict cost the project rework through v1.1 |
| Single-file vanilla HTML prototype | Fastest path to a table-playable build; zero setup for playtesters | ✓ Good — survived a 2.8x growth to 2,495 lines and a full economy redesign without a build step; the constraint forced the `CONFIG`/`beats` data discipline that made retuning cheap |
| Declarative `beats` (verb × face → payoff + story beat) as the single effect model | One resolver, one validator, one place to author content — replaces per-scene inline `reskin` closures and hand-written strings | ✓ Good — made Phase 3's two-verb fold a data migration rather than an engine rewrite; `validateBeats()` caught drift at every step |
| Verify with headless Node harnesses (`harness`/`parity`/`sweep`/`econcheck`) in `scratchpad/` | No browser tooling in the executor sandboxes, and the determinism/balance claims need real execution, not source reading | ✓ Good — caught the 18% all-dead regression in 03-02 that source review missed; kept `index.html` dependency-free. ⚠️ Revisit: harness evidence had to be re-closed later by a real browser pass (`03-BROWSER-CHECK.md`), so it substitutes for but doesn't replace live verification |
| Phase 3: fold three verbs (Dare/Abide/Give) into two (Abide/Dare) and unify world-anger + Poseidon's curse into one favor currency | The measured pre-redesign baseline was a death spiral (~50% of seeds ended with the whole crew dead, no run brought more than one sailor home) — root-caused to a fragmented economy across three verbs and three tracked axes that couldn't be tuned as one surface | ✓ Good — every island + all three anchors re-authored on the two-verb grammar; `sweep.mjs 80/200 --assert` now passes every D-09 target: 0% all-dead, 93-94% full-crew-at-Ithaca with real survivor variance, 70-78% of seeds show a death, 15-19 distinct winner-favor values, pious out-earns greedy ~8x |
| Accept the scope expansion mid-milestone rather than deferring it to v1.2 | The death spiral was the project's stated exit gate; deferring it would have shipped a *felt* game that still wasn't playable | ✓ Good — but it re-opened Phases 1, 2 and 4 and roughly doubled Phase 3 (7 plans). Worth it; the cost was real and was knowingly taken |
| Execute Phase 4 (board) before Phase 3 (economy) | The board depends only on Phase 1 and is a pure projection of state, so it could be built against generic data while Phase 3 was still being designed | ⚠️ Revisit — it worked (the close-out audit found zero integration regressions; the board absorbed the two-verb fold cleanly *because* it projects from state) but it left BOARD-04's requirement text describing three verbs, and Phase 4 was verified against a model that no longer exists. The pure-projection architecture is what made this safe — don't read it as a general licence to reorder phases |
| Keep the ship's-log as a collapsible panel rather than deleting it | Unattended 0-human seeded runs need a readable transcript to stay debuggable | ✓ Good — the log is what every harness asserts against; deleting it would have cost the entire verification approach |
| Phase 3: fold three verbs (Dare/Abide/Give) into two (Abide/Dare) and unify world-anger + Poseidon's curse into one favor currency | The measured pre-redesign baseline was a death spiral (~50% of seeds ended with the whole crew dead, no run brought more than one sailor home) — root-caused to a fragmented economy across three verbs and three tracked axes that couldn't be tuned as one surface | Every island + all three anchors re-authored on the two-verb grammar; the fixed multi-seed sweep (`sweep.mjs 80`/`200 --assert`) now passes every D-09 target: 0% all-dead, 93-94% full-crew-at-Ithaca (down from a 99% single-spike pre-tune baseline, with real survivor-count variance), 70-78% of seeds show at least one death, 15-19 distinct winner-favor values, and the pious/abide road out-earns the greedy/dare road on favor by roughly 8x while surviving at least as well |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone:**
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-26 after v1.1 milestone*
