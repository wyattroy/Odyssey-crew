# Architecture Research

**Domain:** Single-file vanilla-JS party game — v1.1 integration (thematic effect data model + interactive board)
**Researched:** 2026-07-25
**Confidence:** HIGH — every claim below is grounded in a specific line/function read from the shipped `index.html` (1185 lines), not inferred.

## Standard Architecture

### System Overview

Odyssey Crew is one `index.html`. There is no module system — "components" are named function groups under `/* ---- SECTION --- */` comments, in this file order today:

```
┌───────────────────────────────────────────────────────────────────────────┐
│  CONFIG (global tunables)  →  LAND_TABLE / SEA_TABLE (generic verb×face)   │
├───────────────────────────────────────────────────────────────────────────┤
│  RNG SEAM: makeRng(seed) → rnd()/rint()/pick()/throwBone()  [state.rng]    │
├───────────────────────────────────────────────────────────────────────────┤
│  STATE: newState() → one `state` object (players[], hold, crossing,       │
│         episode, ep, journey[], log[], phase flags)                       │
├───────────────────────────────────────────────────────────────────────────┤
│  RENDER (pure projection of `state`): render() → renderTrack/Strip/       │
│         Players/Log — rebuilds DOM from state, no logic, no writes        │
├───────────────────────────────────────────────────────────────────────────┤
│  PROMPT/INPUT: promptButtons/passGate → Promise-based; askResolve()       │
│         resolves a pending Promise on click — the ONLY human-input path   │
├───────────────────────────────────────────────────────────────────────────┤
│  collectCommits(seats, kind, ctx) — THE single bot/human seam:            │
│    bots → botDecide(p, kind, ctx) (sync, no DOM)                          │
│    humans → askHuman(p, kind, ctx) (awaits a promptButtons Promise)       │
├───────────────────────────────────────────────────────────────────────────┤
│  PHASE REDUCERS (async, sequential, await-paced):                         │
│    eatPhase() · actPhase(env, scene, sceneIndex) · runCrossing()          │
│    runIsland/runHades/runPhaeacia/runIthaca() · setupTroy()               │
├───────────────────────────────────────────────────────────────────────────┤
│  DATA: EPISODES{helios,cyclops,sirens,lotus} — scenes[] with verbs{} +    │
│         reskin{} (per-verb custom resolve fns) + collectiveCheck/onDepart │
├───────────────────────────────────────────────────────────────────────────┤
│  ORCHESTRATOR: runGame() — deals journey, loops beats, awaits each phase  │
└───────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities (as they exist today)

| Component | Responsibility | Where in index.html |
|-----------|-----------------|----------------------|
| `CONFIG` | Global mechanical knobs (bone weights, hold, crossing bag, tolls) **plus** — currently — per-episode numeric defaults (`CONFIG.lotus`, `.sirens`, `.helios`, `.cyclops`) that v1.1 is meant to replace | lines 163–185 |
| `LAND_TABLE`/`SEA_TABLE` | Generic verb×face→delta fallback used when a scene has no custom `reskin` | lines 189–198 |
| `state` (single object) | All game state: players, hold, crossing bag, current episode/scene flags, journey, log | `newState()` lines 220–247 |
| `applyDeltas(p, d)` | The ONE function that mutates satchel/hold/favor/world and returns a narration fragment string | lines 258–265 |
| `render()` / `renderTrack/Strip/Players/Log` | Pure projection: reads `state`, rebuilds DOM. `renderLog` already does incremental append-only diffing (`while(l.childNodes.length < state.log.length)`) — the existing precedent for animation-safe incremental redraw | lines 351–419 |
| `promptButtons`/`passGate`/`askResolve` | The only human-input path: renders buttons, resolves a pending Promise on click | lines 427–451 |
| `collectCommits(seats, kind, ctx)` | THE single bot/human seam — bots call `botDecide` directly (no DOM); humans await `askHuman` | lines 454–468 |
| `botDecide(p, kind, ctx)` / `botAct(p, ctx, T)` | Bot policy — never touches DOM, never touches board, sets `p.commit` only | lines 524–620 |
| `actPhase(env, scene, sceneIndex)` | The per-turn reducer: commits → roll all bones → reveal one at a time → apply effect → collectiveCheck | lines 688–722 |
| `EPISODES` | Data + hybrid logic for the 4 islands: `scenes[].verbs{label}` + `scenes[].reskin{dare,abide,give}` (functions mixing delta-mutation *and* hand-written `log()` narration strings) | lines 742–920 |
| Anchors (`setupTroy`, `runHades`, `runPhaeacia`, `runIthaca`) | Fully bespoke procedural functions, **not** data-driven, **not** using the Dare/Abide/Give verb grammar (Troy = "take t"; Hades = pay/stay + Orpheus pay/no; Phaeacia = automatic bone throws, no player choice; Ithaca = endure/reveal + bow contest) | lines 991–1092, 1145–1155 |

## Answering the four questions

### (a) Where does the per-scene effect/narration table live?

**Decision: extend the existing `EPISODES[id].scenes[si]` objects with a new declarative `beats` field, consumed by one generic resolver — do not create a fully separate top-level structure, and do not keep hand-written `reskin` functions as the primary authoring surface.**

Grounding: the codebase already has the right precedent twice —
1. `LAND_TABLE`/`SEA_TABLE` (lines 189–198) prove the team's own stated convention: "data, not if-chains."
2. `EPISODES[...].scenes[...].reskin` (e.g. `mkHeliosDare()` lines 732–741, `sirensReskin()` lines 873–879) is the *existing* per-scene-per-verb override seam — but today it conflates three concerns in one function: (1) computing the numeric delta, (2) calling `applyDeltas`/mutating state directly, and (3) hand-writing the `log()` narration string inline. That conflation is exactly what makes "7 scenes × 3 verbs × 4 rolls" unmanageable — every cell requires touching a JS function body, not a data literal.

Recommended shape (new field alongside the existing `verbs:{dare,abide,give}` on each scene):

```js
scenes: [
  {
    name: 'The Meadow',
    hook: 'The herd gleams. Odysseus warns: touch nothing.',
    verbs: { dare:{label:'Dare — slaughter a cow'}, abide:{label:'Abide — restraint'}, give:{label:'Give — feed the hold'} },
    beats: {
      dare:  { 1:{ you:-1, world:1, text:"Seen by the Sun — the herd bellows in alarm." },
               3:{ you:1,           text:"A quiet cut; the meat feeds one belly." },
               4:{ you:2,           text:"A clean kill — no one stirs." },
               6:{ you:2, crew:2,   text:"A feast for the whole crew, and no one the wiser." } },
      abide: { 1:{ text:"..." }, 3:{ you:1, text:"..." }, 4:{ you:1, crew:1, text:"..." }, 6:{ you:1, crew:1, favor:1, text:"..." } },
      give:  { 1:{ you:-1, text:"..." }, 3:{ you:-1, crew:1, text:"..." }, 4:{...}, 6:{...} },
    },
    // collectiveCheck/effect stay as functions ONLY where truly stateful (see below)
  },
]
```

- `resolveEffect(scene, verb, bone)` becomes the single generic function replacing the branch at lines 707–714 (`if(scene.reskin...) else table[...]`). It looks up `scene.beats[verb][bone]`, falls back to `LAND_TABLE`/`SEA_TABLE` for anchors/ungenerated scenes, and returns `{delta, text}` uniformly.
- `applyDeltas(p, delta)` is unchanged — it already separates "compute the mechanical fragment string" (e.g. `+2🍖`) from narration; the new `text` field is the *story* sentence, concatenated by one narration formatter (see (c)), not the mechanical fragment.
- Keep `reskin`/`effect` as an *escape hatch function* only for scenes that are genuinely stateful across actors within a single reveal — e.g. Cyclops's `give` incrementing `state.ep.drunk` (line 778), or Lotus's `dare` rescue searching `state.players` for a struck mate (line 887–892). Even there, the function should pull its `text` from the same `beats[verb][bone].text` data cell rather than hand-writing the log string, so narration authoring stays uniform whether or not a cell needs custom logic.
- `collectiveCheck` (Cyclops's `polyphemusHunger`/`stakeCheck`, lines 894–920) is genuinely cross-actor and stays a function — it already is one, correctly separated from the per-actor reveal loop.
- **CONFIG's role shrinks.** Move `CONFIG.lotus`, `CONFIG.sirens.listenFavor`, `CONFIG.helios.restraintBless`, etc. — anything that is really "a specific verb×roll payoff for a specific scene" — out of `CONFIG` and into the `beats` data on that scene. Keep in `CONFIG` only truly global/cross-cutting numbers that aren't tied to one scene's story beat: bone weights, hold start, crossing bag composition, tolls, bot temperament weights, and cross-scene doom thresholds (`doomAt`) that gate an entire episode's `onDepart`, not a single reveal. This is a direct implementation of the milestone's own framing: "these hand-tuned payoffs REPLACE the current default `[tune]` constants."

**Open gap to flag for requirements/roadmap:** the milestone text says "4 islands + Hades/Phaeacia/Ithaca" get this per-verb×roll treatment, but the anchors *do not currently use the Dare/Abide/Give grammar at all* (Hades = pay/stay; Phaeacia = automatic bone throws with no player verb choice; Ithaca = endure/reveal, which only stylistically maps to abide/dare via CSS class, plus a separate bow-contest bone throw). Before content authoring starts on the anchors, REQUIREMENTS.md needs to resolve whether anchors are (1) restructured onto the verb grammar (a real design change, out of the "structure is locked" constraint in PROJECT.md), or (2) get a lighter narration-only table keyed by their *existing* choice kinds (`revive`/`orpheus`/`patience`) instead of verb×roll. Recommend (2) — it's additive, doesn't touch locked structure, and is a smaller `beats`-like table keyed by `{choice: {text}}` per anchor scene rather than `{verb:{roll:{...}}}`.

### (b) Board as a pure projection of state — no parallel state, animation without breaking determinism

Grounding: `render()` (line 351) is already a pure projection — `renderTrack/Strip/Players` read `state.*` and rebuild DOM every call; `renderLog` (line 411) already does incremental append-only diffing keyed on `state.log.length` vs `l.childNodes.length`. **This is the exact precedent the board should extend, not replace with something new.**

Everything the board needs to show is already state, with zero new fields required for the *mechanical* facts:

| Board element | Existing state field | Reducer that mutates it |
|---|---|---|
| Boat position on the sea | `state.beatIndex`, `state.journey[]`, `state.crossing.atSea` | `runGame()` beat loop, `runCrossing()` |
| Marble bag (blue/white counts) | `state.crossing.bag` (array of `'blue'`/`'white'`) | `startCrossing()` (line 923), `drawMarble()` splices it (line 936) |
| Live dice | `p.lastBone` (real value), `p._boneShow` (already exists as the "currently revealed" transient) | `actPhase()` reveal loop (lines 702–718) |
| Verb result flourish | `p._delta` (already exists — the narration fragment shown per-player) | same reveal loop |
| Narration | `state.log[]` entries (`{html, cls}`) | `log()` (line 268) |

Two design moves preserve "no parallel state":

1. **Follow the existing `_`-prefixed convention for anything transient/render-only.** The codebase already annotates state with underscore fields that exist purely for rendering and are cleared per phase (`p._boneShow`, `p._delta`, `p._committing`, `p._acting`, all reset by `clearBones()` line 420). Any new board-only transient (e.g., "which marble was just drawn, to animate it leaving the bag") should be `state.crossing._lastDrawn`, not a separate board state object. This keeps the single-state-object constraint from PROJECT.md intact and keeps `state` inspectable/loggable as one thing.
2. **Animation timing already lives in the phase reducers, not in the renderer.** The reveal loop already does `render(); await botPause();` per actor (line 717) and the crossing loop does `renderStrip(); ... await botPause();` per draw (lines 952, 959). This means "animation" in this codebase is not a CSS/rAF state machine — it is *the reducer calling `render()` after each incremental state mutation, with a real `await sleep(ms)` between them* (`botPause()`, line 256, gated by `state.botSpeed`). The board should adopt the identical pattern: `renderBoard()` gets called at each of these same existing pause points, and needs zero new async/animation-loop machinery. This is the strongest possible guarantee against breaking determinism: the *sequence and values* being animated are already fully computed by the deterministic reducer before any visual frame happens; `botSpeed`/pacing only changes wall-clock delay, never `state.rng()` outcomes or their order.

**Explicit determinism/seam guardrails to state in the roadmap:**
- No board code may call `Math.random()` or introduce any new randomness for visual flourish (e.g., a "random" dice-tumble animation). Any pseudo-random visual variation (rotation, marble jitter) must be a *deterministic function of an already-rolled value* (e.g. `bone`, or array index), so `?seed=` reproduces pixel-identical sequences of state, even if it doesn't need to reproduce identical animation timing.
- `botDecide`/`collectCommits` (lines 454–468, 524) never touch the DOM today — bots set `.commit` directly with no UI interaction (`seats.filter(s=>s.isBot).forEach(b=>{ b.commit = botDecide(...) })`, line 458). The board is strictly a downstream consumer of state; it must not become a second path for bot decisions or a place where board-only logic sets `.commit`. Verb buttons (human or director-mode) must continue to resolve through the existing `promptButtons`/`askResolve` Promise seam (lines 427–451) — the board's clickable Dare/Abide/Give is that same seam, just re-hosted visually (see (c)).
- The board must not read or write anything `render()` doesn't already read — if a board feature needs new information (e.g. "is a marble currently animating out"), it goes into `state` as an underscore field set by the reducer immediately before the `render()` call that should show it, and cleared by the next reducer step, exactly like `_boneShow`/`_delta` are today.

### (c) New/modified components and the click → reducer → state → render data flow

**New:**
- `SCENE_EFFECTS` data — not a new top-level object; realized as the `beats` field added onto each `EPISODES[id].scenes[si]` (see (a)). Sits right next to the existing `verbs{}`/`reskin{}` fields it's replacing.
- `resolveEffect(scene, verb, bone, env)` — new generic function, replaces the inline branch at actPhase lines 707–714 (`if(scene.reskin[p.commit]) ... else table[p.commit][p.lastBone]`). Returns `{delta, text}` uniformly whether the cell is pure data or a stateful escape-hatch function.
- `narrate(p, verb, env, bone, text, deltaFragment)` — new small formatter, centralizing the string assembly that today is duplicated ad hoc inside every `reskin` function's own `log(...)` call (e.g. lines 738, 780, 796, 875, 884, 890). One formatter means the log line and the board's narration surface are guaranteed to show the same sentence, sourced once.
- `renderBoard()` (plus likely sub-renderers `renderBoat()`, `renderBag()`, `renderDice()`, `renderNarration()`) — new render function(s) called from `render()` alongside the existing `renderTrack/Strip/Players`. Since the milestone says the board *replaces* the text log, `renderLog`/`#log` is probably retired or demoted to a collapsed "director" panel — that's a UX-scope call, not an architecture one, and should be confirmed in REQUIREMENTS.md, but either way `renderBoard()` slots into the same `render()` orchestrator function (line 351) that already fans out to the other renderers — no new orchestration layer needed.

**Modified:**
- `actPhase()` (lines 688–722): the reveal loop's branch (707–714) is replaced by a single call to `resolveEffect`, and `render()` is still called per-actor-reveal exactly as today (line 716) — the board just picks up more from that same call.
- `promptButtons()` (lines 427–441): already supports per-seat DOM slots via `seatId`/`ctrl-<id>` (line 440) — this is precisely the mechanism "clickable verbs on the board" needs. The board doesn't need a new input widget; it needs the existing `ctrl-<id>` slots to live inside the board's player/boat layout instead of (or in addition to) the current `.players`/`#prompt` cards.
- `CONFIG` (lines 163–185): shrinks as described in (a) — per-scene numeric subobjects (`lotus`, `sirens`, `helios`, `cyclops`) migrate into scene `beats` data; only global mechanical knobs and cross-scene doom thresholds remain.

**Data flow for one turn, verb click → board (all function/line references are real):**

1. Human clicks a Dare/Abide/Give button. That button was rendered by `promptButtons()` (line 434) inside a per-seat slot (`ctrl-<id>`, line 440) — this slot now lives inside the board layout, not a separate `#prompt` card.
2. `btn.onclick` → `askResolve(b.value)` (line 437) → resolves the pending Promise created in `promptButtons`.
3. `askHuman()` (line 470) returns that value up through `collectCommits()` (line 454–468), which sets `h.commit = value` (line 464) — same for bots via `botDecide(b, kind, ctx)` (line 458), no DOM involved.
4. Once all actors have committed, `actPhase()` rolls every actor's bone via `throwBone()` → `rnd()` → `state.rng()` (the single RNG seam, `makeRng`, line 201) — fully deterministic under `?seed=`.
5. The reveal loop (lines 704–718) processes actors one at a time: sets `p._boneShow = p.lastBone`, calls **new** `resolveEffect(scene, p.commit, p.lastBone, env)` to get `{delta, text}`, applies `delta` via the unchanged `applyDeltas(p, delta)` (line 258), builds the line via **new** `narrate(...)`, calls `log(...)` (unchanged, line 268) which also drives `renderLog` today, sets `p._delta`, calls `render()` (now including `renderBoard()`), then `await botPause()`.
6. `collectiveCheck(actors)`, if the scene has one, runs after the loop (line 720) and may itself mutate `state` (e.g. kill a player) — followed by another `render()`.
7. `renderBoard()` (new) reads the now-current `state` — `state.crossing.bag` for the marble count, `p._boneShow`/`p._delta` for the dice/result flourish, `state.beatIndex`/`state.crossing.atSea` for boat position — and redraws. No board-specific state was written anywhere in steps 1–6 beyond the pattern already established for `_boneShow`/`_delta`.

This shows the board hooks into the *existing* `collectCommits → actPhase reveal loop → render()` pipeline verbatim; it does not require a new action-dispatch system, and it does not touch `botDecide` at all (bots never see a button).

### (d) Build order

1. **Effect/narration data model first** (the `beats` field + `resolveEffect` + `narrate`), validated purely through the existing text log — no board risk yet. Rationale: this is also the fix for the death-spiral balance finding already on record (`odyssey-crew-playtest-balance` memory: hold economy drains to zero at default `CONFIG`), since the milestone explicitly says these hand-tuned payoffs *replace* the defaults as the intended balance. Locking the numbers/text before building visuals avoids re-verifying the board every time a payoff changes.
   - Convert one episode first as the pattern spike — recommend **Helios**, since it already has a partial `reskin` (only `dare` is overridden today; `abide`/`give` fall through to `LAND_TABLE`) — converting it fully to `beats` proves the resolver against a real, already-partially-custom scene before touching the more heavily stateful ones (Cyclops's drunk counter/stake pooling, Lotus's rescue search).
   - Verify each conversion via full-auto seeded runs (`?seed=X&auto=1&humans=0`) diffing log output before/after, per the file's own existing reproducibility contract (`initFromUrl`, line 336).
   - Anchors (Hades/Phaeacia/Ithaca) last within this phase, and only after REQUIREMENTS.md resolves the verb-grammar gap flagged in (a).
2. **Board scaffold second, in parallel-capable but logically after step 1's resolver exists** — build `renderBoard()` against whatever data is already flowing (even pre-conversion generic `LAND_TABLE` output has `text`-shaped fragments once `narrate()` exists), so the board's rendering/animation-pacing approach (bag draining, dice reveal, boat position) is validated independent of whether all 7 scenes' prose is finished. The board is driven by generic fields (`state.crossing.bag`, `p.lastBone`, `state.beatIndex`) that exist regardless of content-authoring progress.
3. **Remaining content authoring (the other 3 islands + anchors) proceeds incrementally once both (1)'s resolver and (2)'s board scaffold exist** — each new scene's `beats` data is additive to the `EPISODES` table; neither the resolver nor the board renderer needs to change per scene, which is the entire point of making this declarative.
4. **Final integration pass:** decide/implement whether `#log` is retired or demoted (UX scope call), run full-auto seeded comparisons to confirm determinism held throughout, and confirm `botDecide`/`collectCommits` needed zero changes (verified in (b) — bots never touch the board).

## Architectural Patterns

### Pattern 1: Data table + generic resolver (already established, being extended)

**What:** Verb×face→effect stored as plain object literals (`LAND_TABLE`/`SEA_TABLE`), consumed by one generic lookup instead of per-scene if-chains.
**When to use:** Any place effect logic is "just numbers/text keyed by (verb, roll)" — which is the large majority of the 144 island cells (4 episodes × 3 scenes × 3 verbs × 4 rolls).
**Trade-offs:** Extremely diffable and reviewable (a designer can hand-tune one cell without reading JS control flow); the trade-off is that genuinely stateful effects (Cyclops's drunk counter) don't fit cleanly and need the escape-hatch function, which must still source its `text` from the same data shape to avoid re-fragmenting authoring.

### Pattern 2: `render()` as pure, idempotent projection of one state object

**What:** Every render function reads `state.*` and rebuilds/updates DOM; no render function ever mutates `state`.
**When to use:** All new board sub-renderers.
**Trade-offs:** Full-rebuild renderers (`renderTrack`, `renderPlayers`, `renderStrip`) are simple but re-create DOM nodes every call — fine for small counts (4 players, ~8 track beats) but would kill CSS transitions on the marble bag if copied verbatim. Use the incremental-diff style already proven in `renderLog` (append/update only what changed) for the bag and dice, where per-node CSS transitions matter.

### Pattern 3: Reducer-paced animation via `await sleep()` between `render()` calls

**What:** Phase functions (`actPhase`, `runCrossing`) already call `render()`/`renderStrip()` after each incremental state mutation, separated by `await botPause()`.
**When to use:** All new "animated" board behavior (marble leaving the bag, dice settling, boat advancing).
**Trade-offs:** Extremely simple and fully deterministic (no separate animation-state machine to keep in sync with game state) — but it does mean animation granularity is capped at however many `render()` call sites the reducers already have (or gain); anything faster/smoother than that requires adding more granular `render()` calls inside the reducer itself, not inventing client-side interpolation that could drift from `state`.

## Data Flow

### Turn flow (grounded — see (c) for full annotated version)

```
verb button click (rendered by promptButtons, hosted in board's per-seat slot)
    ↓ askResolve(value)
askHuman() resolves → collectCommits() sets p.commit
    ↓ (all actors committed)
actPhase(): throwBone() via state.rng() for every actor (deterministic, seed-gated)
    ↓ reveal loop, one actor at a time
resolveEffect(scene, verb, bone) → {delta, text}
    ↓
applyDeltas(p, delta)   +   narrate(...) → log()
    ↓
render() → renderBoard() reads updated state, redraws
    ↓ await botPause()
next actor / collectiveCheck / next phase
```

### State shape relevant to the board (no additions needed beyond `_`-prefixed transients)

```
state.crossing = { bag: ['blue','white',...], whitesAdded, atSea }   // marble bag = direct projection
state.beatIndex, state.journey[]                                     // boat position = direct projection
players[i].lastBone, ._boneShow, ._delta, ._committing, ._acting     // dice/result = direct projection (existing convention)
state.log[] = [{html, cls}]                                          // narration = direct projection (existing renderLog pattern)
```

## Anti-Patterns

### Anti-Pattern 1: A parallel "board state" object updated from event handlers

**What people do:** Build a `boardState = {marbles:[], boatX:0, diceRolling:false}` object that a board-click handler updates directly, syncing it to `state` after the fact.
**Why it's wrong:** Violates the project's explicit "one clear game-state object" constraint (PROJECT.md), and immediately risks drift between what the board shows and what the reducers/log say happened — especially dangerous for a game whose core value proposition depends on players trusting the visible economy (marble bag, hold) as ground truth.
**Instead:** Everything the board shows is read from `state` at `render()` time; anything transient/board-only is a `_`-prefixed field on `state` (or on a player object), written by the reducer immediately before the `render()` call that should reflect it — exactly the existing `_boneShow`/`_delta` convention.

### Anti-Pattern 2: Randomized visual flourish that doesn't derive from `state.rng()`

**What people do:** Add `Math.random()`-driven CSS animation (dice tumble direction, marble bounce angle) for polish.
**Why it's wrong:** Breaks the `?seed=` reproducibility contract in spirit even if the *numbers* stay correct — playtesters/designers comparing two runs of the same seed expect visually identical sequences, and any hidden non-seeded randomness undermines debugging via seeded replay (the project's stated playtest-verification method, per `initFromUrl`/`?seed=`).
**Instead:** Derive any visual variation deterministically from already-rolled values (`bone`, array index, player id) so the same seed reproduces the same board frame-for-frame, not just the same numbers.

### Anti-Pattern 3: Re-fragmenting narration authoring across data cells and escape-hatch functions

**What people do:** Put `text` only in the simple data cells and leave the stateful `reskin`/`effect` functions to keep hand-writing their own `log()` strings inline (as they do today).
**Why it's wrong:** Reintroduces the exact problem being fixed — a writer/designer tuning the story beat for "Cyclops, Wine scene, Give, roll 4" has to know whether that cell is data or code before they can find where to edit it.
**Instead:** Every `beats[verb][bone]` cell — data or escape-hatch function — has a `text` field, and the escape-hatch function reads `text` from its own data cell rather than hard-coding a string, so narration authoring has exactly one place to look regardless of mechanical complexity underneath.

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `EPISODES[...].scenes[...].beats` (new data) ↔ `resolveEffect()` (new function) | Direct object lookup, verb/roll keyed, with fallback to `LAND_TABLE`/`SEA_TABLE` for anchors/unconverted scenes | Single seam; if this lookup returns `undefined`, current code already tolerates it (`table[p.commit][p.lastBone] || {}`, line 710) — keep that defensive default so partially-converted content never crashes |
| `actPhase()` reveal loop ↔ `renderBoard()` | Implicit, via shared `state` — reducer sets `p._boneShow`/`p._delta`/mutates `state.crossing.bag`, then calls `render()` | No direct function call between them; this is the load-bearing "pure projection" contract — do not let `renderBoard()` call back into any reducer |
| `promptButtons()`/`askResolve` ↔ verb click UI (board-hosted) | Promise resolution via `onclick` | Board reuses the exact existing seat-slot mechanism (`ctrl-<id>`); no new input path |
| `collectCommits()` ↔ `botDecide()` | Direct synchronous function call, zero DOM | Confirmed unaffected by board work — bots never render, never click |
| `CONFIG` ↔ `EPISODES[...].beats` | Today, `CONFIG.<episode>.*` constants are read directly inside `reskin` functions and at episode-definition time (e.g. `doomAt:CONFIG.helios.doomAt`, line 744) | Migration should leave only cross-scene thresholds (`doomAt`) reading from `CONFIG` or promoted onto the episode object itself; per-verb payoffs move fully into `beats` |

### External Services

None — the app has no build, no network, no storage (PROJECT.md constraint, confirmed: no `fetch`, no `localStorage` calls anywhere in the 1185-line file). Not applicable to this milestone.

## Scaling Considerations

Not a scaling-sensitive domain (1–4 players, one in-memory session, no persistence) — the only "scale" axis that matters is content volume: 4 episodes × 3 scenes × 3 verbs × 4 rolls = 144 island cells, plus however many anchor cells REQUIREMENTS.md scopes. The data-table + generic-resolver pattern in (a) is what keeps that volume tractable to author and diff; there is no runtime performance concern at this player count.

## Sources

- `/Users/wyattroy/Documents/Projects/Odyssey-crew/.claude/worktrees/gsd-new-milestone-acf812/index.html` (read in full, 1185 lines) — every function/line reference above
- `/Users/wyattroy/Documents/Projects/Odyssey-crew/.claude/worktrees/gsd-new-milestone-acf812/.planning/PROJECT.md` — v1.1 milestone scope, locked architecture constraints, out-of-scope boundaries
- `odyssey-crew-playtest-balance` memory (user auto-memory) — prior playtest finding that default `CONFIG` constants produce a hold-economy death spiral, motivating why effect-data-model-before-board is the right build order

---
*Architecture research for: Odyssey Crew v1.1 (thematic effect data model + interactive board integration)*
*Researched: 2026-07-25*
