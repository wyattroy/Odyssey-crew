# Odyssey Crew

## What This Is

A 4-player tabletop game based on Homer's *Odyssey*, playable digitally and physically in one ~60–90 min sitting. **You are not Odysseus — you are the crew** trying to survive the voyage home while an NPC Odysseus (driven by cards) leads you into predicament after predicament. Two goals, one ranking: get the ship home to Ithaca, and arrive with the most **favor** from the gods. The design is a "one engine, many questions" system: a tiny three-verb grammar (Dare / Abide / Give) replayed across a random subset of self-contained island episodes.

## Core Value

The commons tension must actually fire: disaster should emerge from the *sum of private, individually-reasonable choices* — no coordination, no visible villain — while cooperation stays optimal for *winning* (favor) and defection stays optimal only for *bare survival*. If the prototype doesn't make that tension playable and felt, nothing else matters.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- Current milestone: first playable HTML prototype. Source of truth is MDs/create-odyssey-crew.md §9 acceptance checklist. -->

- [ ] Single self-contained `index.html` — all HTML/CSS/JS inline, vanilla JS, no build step, no network, runs by double-click offline
- [ ] Full voyage runs end-to-end: Troy → 4 dealt islands → Hades → Phaeacia → Ithaca, no dead-end states
- [ ] Eat blind-commit with hold shortfall → lot-casting → starvation (two-strike) → death
- [ ] Death economy: pay 1 favor to return (Charon); crewmate can pay (Orpheus)
- [ ] Favor only moves via the gods (Abide-6 grants, Dare-1 removes, Give never; no player-to-player favor transfer)
- [ ] Crossings: marble bag with rising land odds, variable length, always terminate; world-anger salts the bag
- [ ] Four worked episodes: Helios (commons/doom), Cyclops (Boast curse), Sirens (rewarded temptation/wreck), Lotus (strand)
- [ ] Fixed anchors: Hades (revival + peek), Phaeacia (favor-weighted pool paying gifts only), Ithaca (three-scene reversal finale)
- [ ] 1–4 humans + bots filling the rest; bots decide everywhere a human does via `botDecide` (never a special rules path)
- [ ] Three bot temperaments (greedy / balanced / pious) visibly change play
- [ ] Blind-commit masking (1 / 2–3 human rules) + director-mode toggle; bots never leak commits
- [ ] `?seed=` reproduces an identical game; 0-human seeded game runs unattended to a winner
- [ ] Verbose narration log as the primary playtest instrument

### Out of Scope

<!-- Explicit boundaries. -->

- Polished production art / sound — emoji + CSS only; this is a rules-complete first playtest build, not a product
- New verbs, currencies, or tracks beyond the three verbs / two currencies / one world-track-per-episode — surface gaps as code comments, don't invent
- Player-to-player trading of rations or favor (only inter-player transfer is the Orpheus toll)
- Networked multiplayer — hotseat only; blind commit is simulated locally
- Browser storage (localStorage/sessionStorage) — all state in one in-memory object; reload = fresh game
- Frameworks/libraries/CDN/bundlers — vanilla only
- The numeric balance/simulation ("Pastry-Pirates") tuning pass — deferred to a later milestone; prototype ships the locked structure with default `[tune]` constants

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
*Last updated: 2026-07-24 after initialization*
