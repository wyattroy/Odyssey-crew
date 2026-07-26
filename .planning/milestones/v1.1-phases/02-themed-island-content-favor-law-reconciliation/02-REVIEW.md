---
phase: 02-themed-island-content-favor-law-reconciliation
reviewed: 2026-07-26T00:00:00Z
depth: standard
files_reviewed: 1
files_reviewed_list:
  - index.html
findings:
  critical: 1
  warning: 3
  info: 1
  total: 5
status: issues_found
---

# Phase 2: Code Review Report

**Reviewed:** 2026-07-26
**Depth:** standard
**Files Reviewed:** 1
**Status:** issues_found

## Summary

Reviewed the phase-2 diff (`a91a8f9`..HEAD) in `index.html`: the authored Dare/Abide/Give `beats` content for Helios (scenes 2/3), Cyclops (scenes 2/3 + boast fix), Sirens (all 3 scenes), and Lotus (all 3 scenes); the `CONFIG.fx` `big`/`huge` tier additions; the favor-law reconciliation (Cyclops boast/stake favor removed, Lotus rescue favor removed, Sirens Dare-favor kept as the one flagged exception); and the `botDecide` Lotus-inversion fix.

The favor-law reconciliation itself is solid: no Give cell across any of the four islands moves favor, no Dare cell outside the flagged Sirens exception grants positive favor (Helios's Dare-3 favor delta is a penalty, which is explicitly allowed), and the Sirens exception carries a clear, explicit "DO NOT copy" comment block. `validateBeats()` coverage (all four faces × all declared verbs × all scenes) checks out and no CONFIG references were left dangling. No `rnd()`/`pick()`/`Math.random` calls were introduced inside any `tell`/`fx` closure.

However, converting Sirens' `Give` (bind/plug-ears) from the old `sirensReskin()` reskin closure into `beats` cells dropped a `Math.max(0, …)` floor the old code enforced on `state.world` — this is a real mechanical regression (not a balance-tuning question) that lets players bank an unbounded negative "Rocks" buffer and blunt the entire wreck-risk mechanic this phase built. That is the one blocker. Three further warnings and one info item are narrower issues (a bot-logic edge case in the reviewed Lotus-inversion fix, two narration/payoff-escalation mismatches, and a WR-05 interaction that can accidentally erase a wreck-risk world penalty).

## Critical Issues

### CR-01: Sirens `Give` lost its `state.world` floor-at-0 clamp — Rocks track can be driven negative, neutralizing the wreck-risk mechanic

**File:** `index.html:1144-1219` (all 12 `give` cells across Sirens scenes 1-3), also `index.html:292` (`applyDeltas`)

**Issue:** The pre-phase-2 `sirensReskin().give` closure explicitly floored the Rocks track at zero:
```js
give:(p,b)=>{ if(p.satchel>0)p.satchel--; state.world=Math.max(0,state.world-CONFIG.sirens.bindReduce); ... }
```
The new beats-authored `give` cells (all three scenes) instead express the reduction as a flat delta:
```js
1:{ d:{you:CONFIG.fx.penalty, world:-CONFIG.sirens.bindReduce}, ... }
```
`applyDeltas()` clamps `you` (satchel) and `crew` (hold) to a minimum of 0, but **not** `world`:
```js
if(d.world){ state.world+=d.world; parts.push(...); }   // index.html:292 — no clamp
```
Since `state.world` persists across all 3 scenes of a single island visit (it is reset only once per island in `runIsland()`, not per scene), a crew that leans on `Give` early (scene 1) can push `state.world` to a negative baseline (e.g. -4 with four players each Giving once) with no cost beyond a satchel point apiece. That negative baseline then has to be "paid down" by `Dare` world-increases before it can start counting toward `CONFIG.sirens.doomAt` (6) again in scenes 2-3 — effectively banking a free buffer against the reef-wreck ending. This defeats the intended tension the Sirens scenes are built around (every `Dare` should cost real risk toward the Rocks) and is a genuine logic regression versus the code it replaced, not a numbers-tuning question deferred to Phase 3.

**Fix:** Clamp the world floor either generically in `applyDeltas` (if `world` should never go negative anywhere in the game) or, more conservatively, keep the clamp local to the Sirens `give` cells via the existing `fx` escape hatch (mirrors how Cyclops/Lotus already use `fx` for logic a flat `d` can't express):
```js
give: {
  1:{ d:{you:CONFIG.fx.penalty}, fx:()=>{ state.world = Math.max(0, state.world - CONFIG.sirens.bindReduce); },
      tell:(p)=>`You knot a mate's bonds a little tighter — the Rocks ease back.` },
  ...
}
```
(Repeat for all 12 cells across the 3 Sirens scenes, replacing the `world:-CONFIG.sirens.bindReduce` delta.)

## Warnings

### WR-01: `botAct`'s Lotus rescue branch gates a costless move on an irrelevant resource check

**File:** `index.html:599, 636`

**Issue:** `canGive` is defined once for the whole function as `p.satchel>=1` (line 599) and is reused at line 636 to decide whether a non-greedy bot will attempt a Lotus rescue:
```js
if(struck && p.temperament!=='greedy' && canGive) return 'dare'; // go haul a struck mate back
```
But `lotusDareFx` (index.html:1348-1351) only spends a ration *if the actor has one* — the rescue itself never requires or is blocked by satchel:
```js
function lotusDareFx(p,b){
  const struck = state.players.find(x=>x.lotusStruck && notDead(x));
  if(struck){ struck.lotusStruck=false; if(p.satchel>0)p.satchel--; state.ep.lotusFreed = struck.name; }
  ...
}
```
A `balanced`-temperament bot with an empty satchel and a stranded mate available will *not* take this branch (since `canGive` is false), falling through to the 50/50 coinflip default — even though rescuing costs it nothing when its satchel is already empty. (`greedy` bots never rescue by design and `pious` bots rescue unconditionally via a later branch, so only `balanced` bots are affected — but this is exactly the temperament tier the reviewed inversion fix is supposed to keep working symmetrically across all three islands that use this helper pattern.)

**Fix:** Drop the `canGive` gate for the rescue branch (it doesn't gate an actual cost):
```js
if(struck && p.temperament!=='greedy') return 'dare'; // go haul a struck mate back
```

### WR-02: Narration implies escalating punishment/reward across scenes that the numbers don't back up

**File:** `index.html:843-844, 880-881, 916-917` (Helios Dare-3); `index.html:1134, 1168, 1203-1204` (Sirens Dare-6)

**Issue:** Two places author scene-to-scene *narrative* escalation without a matching *mechanical* escalation, which is exactly the "tell says something the delta doesn't do" pattern this review was asked to hunt for:
- Helios Dare-3 (`favor:CONFIG.fx.penalty`, i.e. -1) is identical in all three scenes, but the `tell` text explicitly escalates: "Helios marks it — condemned, favor lost" (scene 1) → "Helios's condemnation deepens" (scene 2) → "Helios's condemnation is absolute" (scene 3). A player reading "deepens"/"is absolute" would reasonably expect a bigger favor hit later in the arc; it's flat -1 every time.
- Sirens Dare-6 favor (`CONFIG.sirens.listenFavor[6]` = 3) is identical across all three scenes (the `listenFavor` map isn't scene-indexed), but scene 3's `tell` calls it "the richest kleos of the whole voyage" (index.html:1204) — it pays exactly the same favor as scene 1's "rich kleos for the risk" (index.html:1135). Only the `world` cost escalates scene-to-scene; the payoff doesn't, which also runs against D-09's stated intent ("rising mini-story with growing stakes **and payoffs**").

**Fix:** Either scale the numbers to match the narration (e.g. bump Helios's Dare-3 penalty or Sirens' `listenFavor` per scene the same way Helios's Dare-6/world numbers already escalate), or soften the escalating language in the `tell` text so it doesn't over-promise relative to flat mechanics.

### WR-03: Sirens' wreck-face bundles a `world` penalty with a `crew` draw, so an empty hold silently voids the entire wreck penalty (including the part that isn't a hold draw)

**File:** `index.html:1162, 1197` (Sirens scenes 2 & 3, Dare face 1)

**Issue:** Scenes 2 and 3's Dare face-1 wreck cell combines two deltas in one cell:
```js
1:{ d:{world:CONFIG.sirens.worldPerListen+CONFIG.fx.tiny+CONFIG.sirens.wreckWorldExtra, crew:-CONFIG.sirens.wreckCrew}, cls:'l-bad', ... }
```
`resolveEffect()`'s `canAffordDraw()` gate (by design, per the WR-05 "deny the whole cell" invariant) checks the cell's `d` object as a unit — if `state.hold` can't cover the `crew` debit, the **entire** cell is denied, including the `world` increase that has nothing to do with the hold:
```js
if(!canAffordDraw(cell.d)){ return { ..., denied:true }; }   // index.html:746-748
```
So a crew that has already drawn the hold to zero is, as a side effect, immune to the Sirens wreck's Rocks-track penalty on that reveal — the worst outcome (face 1) becomes *safer* than intended precisely when the ship is already in its most precarious state. This is an emergent interaction between this phase's new content (bundling `world` with `crew` in the same cell) and the pre-existing engine-wide deny-whole-cell invariant, not a bug in the invariant itself.

**Fix:** Split the world penalty out from the hold-affordability gate, e.g. via `fx` so the world cost always lands regardless of hold state:
```js
1:{ d:{crew:-CONFIG.sirens.wreckCrew}, fx:()=>{ state.world += CONFIG.sirens.worldPerListen + CONFIG.fx.tiny + CONFIG.sirens.wreckWorldExtra; }, cls:'l-bad', ... }
```
(Note: this still requires the crew draw to be affordable before the fx-only world hit is skipped too, per the existing `fx` runs only if `canAffordDraw` passes; if the intent is "world penalty always lands," the world component may need to live in `d` on a cell with no `crew` component, and the crew loss modeled separately.)

## Info

### IN-01: Cyclops `Give` (pour wine) still reduces the hold rather than sustaining it, with no exception comment in the newly-authored cell

**File:** `index.html:1021-1029` ("The Stake" `give` cells, authored this phase)

**Issue:** Every other island's `Give` cells in this phase's diff follow the stated law ("Give sustains the crew … never moves favor") by crediting `crew` (hold). Cyclops's "pour wine" `Give` (both the pre-existing "Wine" scene and this phase's newly-converted "Stake" scene) instead *debits* the hold (`d:{crew:CONFIG.fx.penalty}`), because "wine" here is modeled as ship stores being spent, not rations being pooled. That's a reasonable thematic choice, and it faithfully reproduces the pre-phase-2 reskin behavior — but unlike the Sirens Dare-favor exception (which got an explicit "DO NOT copy" comment block precisely because it deviates from a stated law), this newly-authored Stake `give` cell carries no comment flagging that it's an intentional deviation from the general Give-sustains-the-crew law. A future author extending the pattern to a new island could reasonably assume Give always credits the hold.

**Fix:** Add a short comment near the Stake `give` cells (mirroring the Sirens exception comment) noting that Cyclops's Give models spending wine stores, not pooling rations, and is an intentional exception to the general Give law — not a template to copy elsewhere.

---

_Reviewed: 2026-07-26_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
