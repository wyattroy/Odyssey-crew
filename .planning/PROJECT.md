# Odyssey Crew

## What This Is

A 4-player tabletop game based on Homer's *Odyssey*, playable digitally and physically in one ~60–90 min sitting. **You are not Odysseus — you are the crew** trying to survive the voyage home while an NPC Odysseus (driven by cards) leads you into predicament after predicament. Two goals, one ranking: get the ship home to Ithaca, and arrive with the most **favor** from the gods. The design is a "one engine, many questions" system: a tiny three-verb grammar (Dare / Abide / Give) replayed across a random subset of self-contained island episodes.

## Core Value

The commons tension must actually fire: disaster should emerge from the *sum of private, individually-reasonable choices* — no coordination, no visible villain — while cooperation stays optimal for *winning* (favor) and defection stays optimal only for *bare survival*. If the prototype doesn't make that tension playable and felt, nothing else matters.

## Current Milestone: v1.1 Themed Episodes & Interactive Board

**Goal:** Turn the rules-complete prototype into a *felt* game — every scene carries its story's moral through tailored Dare/Abide/Give beats and payoffs, and the whole voyage is played on a visual board instead of a text log.

**Target features:**
- Per-scene thematic effect tables: for every stage of every episode (4 islands + Hades/Phaeacia/Ithaca), each verb × each roll (1/3/4/6) gets a one-sentence story beat + a payoff tuned to that stage's moral.
- Encoded design principle: Dare risks self and crew for high upside; Abide is riskless, low-upside, often lethal alone, and the *only* favor path (Zeus's law); Give is riskless, sustains the crew, never moves favor. Pure-abide strands/starves you.
- Effects-as-balance: these hand-tuned per-stage numbers replace the default `[tune]` constants as the intended economy — the death-spiral goes away (hand-tuned, not sim-tuned this pass).
- Interactive game board (replaces the raw narration log): boat crossing the sea, the actual blue/white marbles visibly draining from the crossing bag, dice showing the live roll, clickable Dare/Abide/Give, narration surfaced in the board.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

**v1.0 prototype (shipped in `index.html`):**
- [x] Single self-contained `index.html` — all HTML/CSS/JS inline, vanilla JS, no build/network/storage, runs by double-click offline
- [x] Full voyage end-to-end: Troy → 4 dealt islands → Hades → Phaeacia → Ithaca, no dead-end states
- [x] Eat blind-commit with hold shortfall → lot-casting → starvation (two-strike) → death; death economy (Charon toll, Orpheus rescue)
- [x] Favor only moves via the gods (Abide-6 grants, Dare-1 removes, Give never)
- [x] Crossings: marble bag with rising land odds, variable length, always terminate; world-anger salts the bag
- [x] Four worked episodes (Helios, Cyclops, Sirens, Lotus) + fixed anchors (Hades, Phaeacia, Ithaca finale)
- [x] 1–4 humans + bots via `botDecide`; three temperaments (greedy / balanced / pious); blind-commit masking + director mode
- [x] `?seed=` reproducibility; 0-human seeded game runs unattended to a winner; verbose narration log

### Active

<!-- Current milestone: v1.1 Themed Episodes & Interactive Board. Detailed, scoped requirements with REQ-IDs live in .planning/REQUIREMENTS.md. -->

See `.planning/REQUIREMENTS.md` for v1.1 requirements (per-scene thematic effect tables, effects-as-balance retune, interactive board replacing the log).

### Out of Scope

<!-- Explicit boundaries. -->

- Polished production art / sound — emoji + CSS only; this is a rules-complete first playtest build, not a product
- New verbs, currencies, or tracks beyond the three verbs / two currencies / one world-track-per-episode — surface gaps as code comments, don't invent
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
*Last updated: 2026-07-25 — started milestone v1.1 Themed Episodes & Interactive Board*
