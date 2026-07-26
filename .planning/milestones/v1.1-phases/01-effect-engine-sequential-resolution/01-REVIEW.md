---
phase: 01-effect-engine-sequential-resolution
reviewed: 2026-07-25T21:37:38Z
depth: standard
files_reviewed: 1
files_reviewed_list:
  - index.html
findings:
  critical: 0
  warning: 5
  info: 2
  total: 7
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-07-25T21:37:38Z
**Depth:** standard
**Files Reviewed:** 1
**Status:** issues_found

## Summary

Reviewed the Phase 1 diff (`dabd9ae..HEAD`) in `index.html`: `CONFIG.fx`, `resolutionOrder()`, `canAffordDraw()`, the rewritten `eatPhase` hold-shortfall path, the new `resolveEffect()`/`narrate()` effect engine, the `beats` conversions for Helios "The Meadow" and Cyclops "The Wine", the Cyclops "The Stake" `give` draw-gate patch, `mkHeliosDare()`'s new denial branch, and `validateBeats()`.

No crashes, security issues, or data-loss/dead-end bugs were found — the core deny-not-clamp mechanics (`canAffordDraw`), the deterministic `resolutionOrder()` seam, and `validateBeats()`'s fail-loud behavior are all implemented correctly and match the stated project invariants. `pickLowest` was cleanly retired with no dangling references.

However, five behavior/quality issues were found, all classified Warning: a dead/unused severity-class field in `resolveEffect()` that silently drops the color-coded log feedback (`l-good`/`l-bad`/`l-sys`) the old reskin closures relied on; a UI-feedback gap in `eatPhase`'s new sequential reveal loop (no per-iteration `renderPlayers()`, unlike the analogous `actPhase` loop); a hardcoded magic number in the Cyclops "The Stake" `give` patch that bypasses the very `CONFIG.fx` constant this phase introduced; an inaccurately-labeled "behavior-preserving" conversion for Cyclops "The Wine" that actually changes what happens when the hold is empty; and an undocumented broadening of the deny-whole gate to every generic `SEA_TABLE`/`LAND_TABLE` cell, not just the two scenes the comments call out. None of these are correctness-breaking, but they should be triaged given the project's known hold-economy balance concerns.

## Narrative Findings (AI reviewer)

### Warnings

#### WR-01: `resolveEffect()`'s `cls` field is computed but never used — color-coded log feedback is silently lost

**File:** `index.html:728`, `index.html:740`, `index.html:747-751`, `index.html:777`

**Issue:** `resolveEffect()` computes a `cls` per outcome (`cls: applied ? 'l-act' : 'l-sys'` at line 728, and an unnamed `cls:null`/`cls:'l-bad'` variant elsewhere), but the caller (`actPhase`, line 777) only reads `r.denied` to pick `'l-bad'`; otherwise it uses `n.cls` from `narrate()` (line 747-751), which **unconditionally returns `cls:'l-act'`** regardless of what `resolveEffect()` computed. `r.cls` is never referenced anywhere.

This is directly observable as a regression versus the pre-Phase-1 reskin closures it replaces. For example, the old Cyclops "The Wine" `dare` closure logged progress with `'l-good'` and failed sober attacks with `'l-bad'` (distinct colors); the old `abide` closure logged with `'l-sys'` (dimmed). The new beats-driven conversion of these same outcomes now always renders as `'l-act'` — the red/green/dim distinctions the log relies on for at-a-glance feedback are gone for every beats-converted cell and every generic-table fallback cell that isn't a hold-denial.

**Fix:** Either wire `r.cls` through `narrate()`/`log()`, or drop the dead computation in `resolveEffect()` and be explicit that beats-cells no longer support per-outcome severity coloring. Example:
```javascript
function narrate(p, verb, env, bone, tell, applied, cls){
  const base = `${p.name} ${verbWord(verb,env)} 🎲${bone} → ${applied||'nothing stirs'}.`;
  const html = tell ? `${base} ${tell}` : base;
  return { html, cls: cls || 'l-act' };
}
// actPhase:
const n = narrate(p, p.commit, env, p.lastBone, r.tell, r.applied, r.cls);
log(n.html, r.denied ? 'l-bad' : n.cls);
```

#### WR-02: `eatPhase`'s new sequential hold-reveal loop never calls `renderPlayers()` per iteration — the "one at a time" reveal is invisible in the UI

**File:** `index.html:679-691`

**Issue:** The rewritten hold-reachers loop calls `await botPause()` after every reacher is resolved, implying an animated, sequential reveal (matching the design intent described in the surrounding comment at lines 674-678 and the `resolutionOrder()` seam comment at lines 637-647). But unlike the structurally identical `actPhase` reveal loop (`index.html:772-782`), which calls `renderPlayers()` inside the loop after every actor, this loop never calls `renderPlayers()` (or `renderStrip()`) between iterations — only once, after the whole loop finishes (line 692). `feed()`/`miss()` mutate `p.status` (starving/dead), which drives the `.p.starving`/`.p.dead` CSS classes; none of that is visible until the loop has already finished.

Net effect: the pauses fire, but the player panels update all at once at the end. Only the scrolling log text shows incremental progress. This defeats the purpose of the sequential-resolution feature for exactly the phase this review is scoped to.

**Fix:** Add `renderPlayers();` (and optionally `renderStrip();` for the hold count) inside the loop, mirroring `actPhase`:
```javascript
for(const p of resolutionOrder(holdReachers)){
  if(state.hold>0){
    state.hold--; feed(p);
    log(`${p.name} draws from the hold (🛢️ ${state.hold} left).`,'l-eat');
  } else {
    log(`${p.name} reaches for the hold, but it has already run dry — denied, meal missed.`,'l-bad');
    miss(p);
  }
  renderPlayers();
  await botPause();
}
```

#### WR-03: Cyclops "The Stake" `give` draw-gate patch hardcodes `-1` instead of using `CONFIG.fx.penalty`

**File:** `index.html:916-919`

**Issue:** This is one of the two patches this review was specifically asked to check. `CONFIG.fx` was introduced in this same phase explicitly so beats cells and hold-draw amounts don't scatter magic numbers (`index.html:185-193`). The Meadow/Wine `beats` conversions correctly reference `CONFIG.fx.penalty`/`.tiny`/`.small` throughout. This patch, however, still hardcodes the literal in both the affordability check and the actual mutation:
```javascript
give:(p,b)=>{
  if(!canAffordDraw({crew:-1})){ log(...); return 'denied — hold empty'; }
  state.hold--; state.ep.drunk++; log(...); return 'drunk +1';
},
```
If `CONFIG.fx.penalty` is ever retuned, this cell silently drifts out of sync with the rest of the phase's payoffs — the exact failure mode `CONFIG.fx` was created to prevent, and a direct violation of the project's retunability invariant.

**Fix:**
```javascript
give:(p,b)=>{
  if(!canAffordDraw({crew:CONFIG.fx.penalty})){ log(...); return 'denied — hold empty'; }
  state.hold += CONFIG.fx.penalty; state.ep.drunk++; log(...); return 'drunk +1';
},
```

#### WR-04: Cyclops "The Wine" `give` beats conversion is not actually behavior-preserving when the hold is empty — comment's claim is inaccurate

**File:** `index.html:882-896`

**Issue:** The comment at lines 882-885 states: "Behavior-preserving vs. the old reskin closures." The old reskin closure was:
```javascript
give:(p,b)=>{ if(state.hold>0)state.hold--; state.ep.drunk++; log(...); return `drunk +1`; },
```
Note `state.ep.drunk++` ran **unconditionally**, even when `state.hold` was already 0 (the hold decrement was independently no-op'd via `if(state.hold>0)`, but drunk still advanced). The new beats cell puts the `drunk++` inside the `fx` hatch, which `resolveEffect()` only runs when `canAffordDraw(cell.d)` passes (`index.html:722-725`). When `state.hold===0`, the whole cell — including the `fx` mutation — is now denied, so `state.ep.drunk` no longer advances at all.

This is consistent with the project's global deny-not-clamp invariant, and is arguably the *correct* fix — but it is a genuine behavior change, not a preservation of the old behavior, and the comment should say so. Given the standing project note that "default constants produce a death-spiral" in the hold economy, a change that makes it *harder* to progress the Cyclops episode once the hold is dry deserves explicit playtest verification and an accurate comment, not a claim that nothing changed.

**Fix:** Correct the comment to state this is an intentional behavior change (enforcing RESOLVE-02 uniformly), and confirm via a `?seed=` playtest that Cyclops "The Wine"/"The Stake" can still be won when the hold empties before `drunkNeeded` is reached.

#### WR-05: The deny-whole gate now applies to every generic `SEA_TABLE`/`LAND_TABLE` cell, not just the documented Helios/Cyclops patches

**File:** `index.html:734-740`

**Issue:** `resolveEffect()`'s final fallback branch (used for sea crossings and any land scene without `beats`/`reskin`) now runs every table-driven cell through `canAffordDraw()`:
```javascript
const table = env==='sea' ? SEA_TABLE : LAND_TABLE;
const d = (table[verb] && table[verb][bone]) || {};
if(!canAffordDraw(d)){
  return { applied:'denied — hold empty', tell: HOLD_DENIED_TELL, cls:'l-bad', logged:false, denied:true };
}
const applied = applyDeltas(p, d);
```
Previously, a `SEA_TABLE.dare` cell like face 1 (`{you:-1,crew:-1,favor:-1}`) or face 3/4 (`{you:+1/+2, crew:-1}`) would just clamp the hold decrement to a no-op if `state.hold` was already 0, while still applying the `you`/`favor` portions. Now, if `state.hold===0`, the *entire* cell is denied — the player gets neither the `you` gain nor the `favor`/`world` change, and sees `HOLD_DENIED_TELL` instead. This is the correct application of the stated project invariant ("hold spend is deny-not-clamp"), but it is a materially larger surface than the two "draw-gate patches" (`mkHeliosDare`, Cyclops "The Stake" `give`) the surrounding comments call out — every sea-crossing `dare` action now shares this fate whenever the hold is empty, and hold frequently reaches 0 late-game per the project's own balance notes.

**Fix:** No code change required if this scope was intended, but the comment block at `index.html:700-718` should say explicitly that this generic fallback path — used far more often than the two named scenes — is also gated, and this path should get a dedicated `?seed=` playtest pass for a hold-starved late-game crossing.

### Info

#### IN-01: `CONFIG.fx`'s three shared knobs (`tiny`/`small`/`penalty`) collapse several conceptually distinct payoffs into one retuning lever

**File:** `index.html:185-193`, `index.html:823-854`

**Issue:** `CONFIG.fx.small` (=2) is reused for both the Helios "seen by the Sun" world-doom bump (`dare` face 1) and the "clean kill" personal-ration bonus (`dare` face 4) and the "crew" hold bonus (`dare` face 6) — three unrelated balance levers that happen to share a magnitude today. Retuning one (e.g., making the Sun-doom bump harsher) will silently retune the other two as well, unless a future author remembers to fork them into a new named constant first. This satisfies the letter of "payoffs trace to CONFIG" but weakens the intent of independent retunability the invariant is meant to protect.

**Fix:** Consider naming knobs by role rather than magnitude where they're likely to diverge in future balance passes (e.g., `CONFIG.helios.sunDoomBump` vs. a generic `fx.small`), reserving `CONFIG.fx.*` for genuinely interchangeable magnitudes.

#### IN-02: `resolutionOrder()`'s fixed ascending-seat-id order gives Player 1 a permanent structural advantage in every hold-scarcity contest

**File:** `index.html:637-647`

**Issue:** The seam comment already flags this as a v1.1 placeholder ("uses fixed turn order... to move to a favor-weighted order... swap ONLY this function"), so this is a known, intentional simplification rather than an oversight. Worth surfacing anyway: in every `eatPhase` hold-shortfall and every `actPhase` hold-drawing reveal, the lowest-`id` seat (typically the first human) always resolves first and therefore always wins any hold-scarcity tie, every single game. Given the project's own note that the hold economy already produces a death-spiral under default constants, this consistently advantages one seat and should be called out explicitly in playtesting notes (not just the code comment) before balance conclusions are drawn from games run with more than one human/bot mix.

**Fix:** No action required for this phase; flag for the balance-tuning follow-up work already noted in project memory.

---

_Reviewed: 2026-07-25T21:37:38Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
