# Deferred Items — Phase 4 (Interactive Board)

Items discovered during execution that are out of scope for the plan that found them
(pre-existing, unrelated to that plan's files/behavior). Logged per Scope Boundary —
not fixed here.

## From 04-04 (blind-commit masking + log demotion + final pass)

- **Setup-screen "re-roll temperament" button can throw before a game starts.**
  `index.html`, `renderSetup()`'s bot temperament re-roll button (`roll.onclick = ()=>{
  setupSeats[i].temperament = pick(TEMPERAMENTS); renderSetup(); }`, around line 382)
  calls `pick()` → `rint()` → `rnd()` → `state.rng()`. On the setup screen, before
  `startBtn` is clicked, module-level `state` is still `null` (`let state = null;`),
  so `state.rng()` throws `TypeError: Cannot read properties of null (reading 'rng')`.
  Pre-existing (predates 04-04; not introduced or touched by this plan's masking/log
  changes; unreachable from the 0-human headless harness or any `?seed=` path this
  phase verifies). Out of scope for 04-04 — not fixed here. A follow-up plan should
  either seed a throwaway `Math.random`-backed RNG for pre-game UI randomness, or
  switch this one button to `Math.random()` directly (no determinism contract applies
  before a seeded game exists).
