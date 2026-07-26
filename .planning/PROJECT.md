# Odyssey Crew

## What This Is

A 4-player tabletop game based on Homer's *Odyssey*, playable digitally and physically in one ~60–90 min sitting. **You are not Odysseus — you are the crew** trying to survive the voyage home while an NPC Odysseus (driven by cards) leads you into predicament after predicament. Two goals, one ranking: get the ship home to Ithaca, and arrive with the most **favor** from the gods. The design is a "one engine, many questions" system: a tiny two-verb grammar (Abide / Dare) replayed across a random subset of self-contained island episodes.

## Core Value

The commons tension must actually fire: disaster should emerge from the *sum of private, individually-reasonable choices* — no coordination, no visible villain — while cooperation stays optimal for *winning* (favor) and defection stays optimal only for *bare survival*. If the prototype doesn't make that tension playable and felt, nothing else matters.

## Current Milestone: v1.1 Themed Episodes & Interactive Board

**Goal:** Turn the rules-complete prototype into a *felt* game — every scene carries its story's moral through tailored Abide/Dare beats and payoffs, and the whole voyage is played on a visual board instead of a text log.

**Target features:**
- Per-scene thematic effect tables: for every stage of every episode (4 islands + Hades/Phaeacia/Ithaca), each verb × each roll (1/3/4/6) gets a one-sentence story beat + a payoff tuned to that stage's moral.
- Encoded design principle (Phase 3, D-11 — supersedes the v1.0 three-verb principle below): Abide serves the commons — it always fills the shared hold, and a high roll earns the gods' notice (favor). Dare transgresses for your own stash — a high roll gets away with it, a low roll means the gods catch you and favor is lost. Favor is the single divine currency: the win condition, the lifeline that buys a life back from the dead (Charon's toll / generalized Orpheus), and the world's mood that shapes the seas and staves off collective doom.
- Effects-as-balance: these hand-tuned per-stage numbers replace the default `[tune]` constants as the intended economy — the death-spiral goes away (hand-tuned, not sim-tuned this pass).
- Interactive game board (replaces the raw narration log): boat crossing the sea, the actual blue/white marbles visibly draining from the crossing bag, dice showing the live roll, clickable Abide/Dare, narration surfaced in the board.

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

### Active

<!-- Current milestone: v1.1 Themed Episodes & Interactive Board. Detailed, scoped requirements with REQ-IDs live in .planning/REQUIREMENTS.md. -->

See `.planning/REQUIREMENTS.md` for v1.1 requirements (per-scene thematic effect tables, effects-as-balance retune, interactive board replacing the log).

**Progress:** Phase 1 (Effect Engine & Sequential Resolution) complete ✓ — EFFECT-01…04 + RESOLVE-01…03 validated (declarative `beats` model + `resolveEffect`/`validateBeats` resolver, and sequential turn-ordered hold resolution replacing lot-casting). Next: Phase 2 (themed island content).

### Out of Scope

<!-- Explicit boundaries. -->

- Polished production art / sound — emoji + CSS only; this is a rules-complete first playtest build, not a product
- New verbs, currencies, or tracks beyond the shipped two verbs (Abide / Dare) and three currencies (🍖 personal stash, 🛢️ the shared hold, 🫒 favor) — no separate peril tracks (world-anger/curse retired, Phase 3 D-04/D-11); surface gaps as code comments, don't invent
- Player-to-player trading of rations or favor (only inter-player transfer is the Orpheus toll)
- Networked multiplayer — hotseat only; blind commit is simulated locally
- Browser storage (localStorage/sessionStorage) — all state in one in-memory object; reload = fresh game
- Frameworks/libraries/CDN/bundlers — vanilla only
- The *automated* numeric balance simulation ("Pastry-Pirates") tuning pass — still deferred. v1.1 hand-tunes the economy via the thematic per-stage payoffs (designer judgment, playtest-driven); the batch-simulation harness that machine-optimizes constants is a later milestone.

## Context

- Two design docs are the source of truth, both under `MDs/`:
  - `Odyssey_Crew_Canon.md` — full design rationale (v1.0, the "why")
  - `create-odyssey-crew.md` — the build spec (the "how"); **where the two conflict, the build spec wins for the prototype**
- The design is locked at the structural level; only numbers marked `[tune]` are open, and those are seeded with defaults in a single `CONFIG` object for later simulation tuning.
- The game's poetic frame maps every mechanic to a real force: luck = the gods speaking, hunger = the crew's undoing, generosity = sacred hospitality (xenia), the hold = the commons.

## Constraints

- **Tech stack**: One `index.html`, vanilla JS, inline everything — no libraries, no build, no network, no storage. Runs offline by double-click. (From build spec §1.)
- **Determinism**: All randomness behind a single `rng()` seam with optional `?seed=` for reproducible playtests.
- **Architecture**: One clear game-state object, pure-ish reducer functions per phase, a render function that redraws from state, bots isolated to a single `botDecide` seam. Readability over cleverness — this file will be edited a lot.
- **Retunability**: Every tunable constant (bone weights, hold start, bag composition, tolls, pot size, thresholds, bot temperament weights) lives in one labelled `CONFIG` object.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Skip GSD research/roadmap ceremony for the prototype | The build spec is already rules-complete: §9 acceptance checklist = requirements, §10 build order = roadmap, stack is fixed | — Pending |
| Build spec wins over canon on conflicts | Explicit instruction in the build spec for prototype scope | — Pending |
| Single-file vanilla HTML prototype | Fastest path to a table-playable build; zero setup for playtesters | — Pending |
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
*Last updated: 2026-07-25 — Phase 1 (Effect Engine & Sequential Resolution) complete*
