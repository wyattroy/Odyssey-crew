---
phase: 03-anchor-verb-retrofit-balance-retune
reviewed: 2026-07-26T00:00:00Z
depth: standard
files_reviewed: 4
files_reviewed_list:
  - index.html
  - scratchpad/econcheck.mjs
  - scratchpad/parity.mjs
  - scratchpad/sweep.mjs
findings:
  critical: 1
  warning: 4
  info: 1
  total: 6
status: issues_found
---

# Phase 3: Code Review Report

**Reviewed:** 2026-07-26T00:00:00Z
**Depth:** standard
**Files Reviewed:** 4
**Status:** issues_found

## Summary

Reviewed the full economy retrofit: the two-verb (Abide/Dare) `econD()` payoff surface, the
retirement of world-anger/Poseidon's-curse in favor of a single `favor` currency driving
`seasExtraBlue()`/`doomFloor()`/`blessFloor()`, the generalized `favorRevive`/`revivalRound`
revival path, and the four `ANCHORS` verb scenes (Hades, Phaeacia, Ithaca). The arithmetic in
`econD()`/`applyDeltas()` is sound and consistent — I traced every scene's tier/face table
against `CONFIG.econ` and found no sign errors, no tier/face mismatches, and the documented
non-decreasing-magnitude invariant holds across all islands and anchors. The Cyclops-specific
`Math.max(0, favor - Math.max(0, islandFavorEarned))` death-clawback is applied consistently
at its three documented sites.

The one real functional defect is architectural rather than arithmetic: `deadEndCheck()` was
generalized this phase to call the (now UI-capable) `revivalRound()`, but nothing stops it (or
the unconditional `onDepart` call in `runIsland()`) from running again *after* the game has
already been finished via an earlier call in the same beat — and revival prompts write into the
same `#prompt` element `finishGame()` uses for the final reckoning panel. In a human game this
can silently replace the "THE VERDICT" screen with a stray "pay Charon's toll?" prompt after a
mid-island wipe, i.e. exactly the kind of dead-end-with-no-way-forward the phase's own
ANCHOR-04 "always reaches a winner" guarantee is supposed to rule out. This is not exercised by
`sweep.mjs`/`parity.mjs`/`econcheck.mjs` because all three run 0-human (bot-only) games, where
`botDecide()` never touches the DOM.

I also found several inert/dead-code remnants of the three-verb → two-verb migration (an
unreachable fallback path, unreachable trailing code, and a few CONFIG knobs that are declared
but never read), plus a pre-existing unescaped-innerHTML pattern for player names.

## Critical Issues

### CR-01: Post-game-over UI logic still runs and can clobber the final verdict screen

**File:** `index.html:2395-2402` (`deadEndCheck`), `index.html:2143-2157` (`runIsland`), `index.html:2469` and `index.html:2476` (`runGame`)

**Issue:**
`deadEndCheck()` was generalized this phase (03-02, "generalize favor-revival") to
unconditionally `await revivalRound()` before checking `state.over`:

```js
async function deadEndCheck(){
  if(livingCount()>0) return false;
  await revivalRound();               // <- can now prompt a human via the UI
  if(livingCount()>0) return false;
  log(`☠️ The crew could not afford to bring anyone back...`,'l-die');
  finishGame(true);
  return true;
}
```

`revivalRound()` → `collectCommits`/`askHuman('revive'/'orpheus', …)` → `promptButtons()`
unconditionally does `box.innerHTML = ...` where `box = $('prompt')` — the *same* DOM node
`finishGame()` uses to render the "⚖️ Final reckoning" panel (`index.html:2409`,
`index.html:2424-2428`).

Meanwhile `runIsland()` calls `ep.onDepart.call(ep)` unconditionally after its scene loop, even
when the loop already broke out because `deadEndCheck()` ended the game:

```js
for(let si=0; si<ep.scenes.length; si++){
    if(await deadEndCheck()) break;   // may already have called finishGame(true) here
    ...
}
if(ep.onDepart) ep.onDepart.call(ep);  // still runs unconditionally
```

Walk the reachable sequence: a mid-island wipe (e.g. everyone starves via `eatPhase`/`miss()`
during scene 0) is caught by the scene-loop's own `deadEndCheck()` at the top of scene 1's
iteration. That call's own internal `revivalRound()` prompts humans, nobody can/does pay, and
`finishGame(true)` renders the verdict into `#prompt`. The loop then `break`s — but `onDepart`
still runs (harmless for Helios/Sirens since `crewFavor()`/`doomToll()` are no-ops at 0 living),
`runIsland()` returns, and back in `runGame()` a **second** `deadEndCheck()` call fires
(`index.html:2476`). This second call again invokes `revivalRound()` — for any humans still
among `deadPl()`, this raises a fresh "you are among the dead, pay Charon's toll?" prompt via
`promptButtons()`, which **overwrites `#prompt` a second time**, this time with a live prompt
that is never followed by another `finishGame()` render (the second `finishGame(true)` call is
a no-op due to its own `if(state.over) return;` guard). The player is left looking at a stray,
functionally-inert revival prompt instead of the game's final verdict — a genuine dead end.

This is only observable with at least one human player (bot-only games never touch
`promptButtons`/the DOM in `botDecide`), which is why `sweep.mjs`/`parity.mjs`/`econcheck.mjs`
(all 0-human) never catch it.

**Fix:** Make `state.over` a hard gate at the single choke point (`deadEndCheck()` itself), and
skip `onDepart` once the game is already over:

```js
async function deadEndCheck(){
  if(state.over) return true;          // <-- add: never re-run revival/finish logic post-end
  if(livingCount()>0) return false;
  await revivalRound();
  if(livingCount()>0) return false;
  log(`☠️ The crew could not afford to bring anyone back — favor bankruptcy. The voyage ends here.`,'l-die');
  finishGame(true);
  return true;
}
```

```js
// runIsland():
if(!state.over && ep.onDepart) ep.onDepart.call(ep);
```

With that guard in place, the redundant `if(await deadEndCheck()) { if(state.over) return; }`
at `index.html:2469` also stops being a confusing no-op branch (currently `state.over` is
*always* true whenever `deadEndCheck()` returns true, so the inner check never does anything
today) and can be simplified to `if(await deadEndCheck()) return;` for consistency with every
other call site.

## Warnings

### WR-01: Unreachable trailing `finishGame()` call in `runGame()`

**File:** `index.html:2478`

**Issue:** `dealJourney()` always produces `['troy','island','island','hades','island',
'island','phaeacia','ithaca']` (`index.html:2437`), and the loop's `case 'ithaca': await
runIthaca(); return;` (`index.html:2474`) always returns before the `for` condition can become
false. The trailing `if(!state.over) finishGame();` after the loop (`index.html:2478`) can
never execute — it's leftover scaffolding, presumably from before Ithaca was folded into the
same beat-type switch.

**Fix:** Delete the dead statement, or replace it with an explicit
`throw new Error('unreachable: journey did not end in ithaca');` if you want a loud signal
should `dealJourney()` ever change shape.

### WR-02: Dead fallback path left over from the three-verb → two-verb retrofit

**File:** `index.html:369-372` (`LAND_TABLE`), `index.html:1135-1137` (`resolveEffect`'s
`scene.reskin` branch), `index.html:1139` (`LAND_TABLE` land fallback)

**Issue:** `resolveEffect()` prefers a scene's `beats` table, then falls back to
`scene.reskin[verb]`, then finally to `LAND_TABLE`/`SEA_TABLE`. As of this phase, every scene
in `EPISODES` and `ANCHORS` defines a full `beats` table (confirmed: no scene omits `beats`,
and no scene anywhere defines a `reskin` object — `grep -n "reskin" index.html` only turns up
the resolver's own dead branch and stale comments), and every `actPhase('land', …)` call site
always passes a real scene object, never `null`. `SEA_TABLE` is still genuinely live (sea
crossings call `actPhase('sea', null, 0)`), but `LAND_TABLE` and the `reskin` branch are now
unreachable in the shipped game.

**Fix:** Either remove `LAND_TABLE` and the `scene.reskin` branch entirely (validateBeats()
already enforces full coverage, so the fallback no longer protects anything), or add a one-line
comment acknowledging it's intentionally-kept dead scaffolding for a future not-yet-converted
scene, so the next reader doesn't have to rediscover this via grep.

### WR-03: CONFIG knobs that silently do nothing when tuned

**File:** `index.html:235` (`whitePerDraw`), `index.html:298` (`herd`), `index.html:347-351`
(`CONFIG.fx.tiny/small/big/penalty`)

**Issue:**
- `CONFIG.crossing.whitePerDraw` (declared as `1`) is never read anywhere. `drawMarble()`
  (`index.html:2095-2103`) hardcodes `state.crossing.bag.push('white')` — exactly one white
  marble — on every non-first draw, ignoring this config value entirely. A future tuner
  changing `whitePerDraw` to speed up or slow down crossings would see no effect.
- `CONFIG.helios.herd` (`12`) is never read anywhere in the file — a leftover from an earlier
  herd-count mechanic presumably retired when the economy moved to `favor`.
- Of `CONFIG.fx`'s five magnitude constants, only `CONFIG.fx.huge` is ever referenced
  (`index.html:1337`, Helios's Dare-6 hold bounty). `tiny`, `small`, `big`, and `penalty` are
  declared with a comment claiming this object is "the canonical home for small shared payoff
  magnitudes referenced by beats `d:{...}` cells," but no cell anywhere uses them.

**Fix:** Either wire `drawMarble()` to `CONFIG.crossing.whitePerDraw` (`for(let
i=0;i<CONFIG.crossing.whitePerDraw;i++) state.crossing.bag.push('white');`) or delete the
unused knob; delete `CONFIG.helios.herd`; delete or actually use the unused `CONFIG.fx` entries
so the comment's claim matches reality.

### WR-04: Player-supplied names interpolated unescaped into `innerHTML`

**File:** `index.html:746-747` (`renderPlayers`), and every `log()` call that embeds `${p.name}`
(e.g. `index.html:1061`, `1074`, `1076`, `1090`, `2199-2200`)

**Issue:** `setupSeats[i].name` is taken verbatim from a text `<input>`
(`index.html:576-578`, no sanitization) and later interpolated directly into template strings
assigned to `.innerHTML`, e.g.:

```js
c.innerHTML = `<div class="nm">${p.name} <span class="badge">${badge}</span></div>
  <div class="res">...`;
```

A name like `<img src=x onerror=alert(1)>` executes in the browser tab that entered it. Given
the project's hard offline/no-network/no-storage constraint, the practical blast radius today
is limited to a player scripting their own local tab (no session, credentials, or other users'
data are reachable) — but it's still a real, easily-fixed defect, and it would become a genuine
cross-user risk the moment this code is ever repurposed into any networked or shared-session
context (e.g. a future remote pass-and-play mode).

**Fix:** Escape user-controlled strings before interpolating into `innerHTML`, e.g. a small
helper:

```js
function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
```

and use `${esc(p.name)}` at every interpolation site (or set `textContent` for the name span
specifically instead of building it into a larger `innerHTML` string).

## Info

### IN-01: Unused per-player transient `_peeked`

**File:** `index.html:2275`

**Issue:** `runPhaeacia()`'s Scene 3 sets `p._peeked=true;` alongside `p._tollSkip=true;` on a
moved court roll, but `_peeked` is never read anywhere else in the file (`grep -n "_peeked"`
only turns up this one assignment).

**Fix:** Remove the dead assignment, or if it was meant to drive some rendering affordance,
wire it up.

---

_Reviewed: 2026-07-26T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
