# Stack Research

**Domain:** Vanilla single-file browser game — interactive visual board + large per-scene effect/narration data model
**Researched:** 2026-07-25
**Confidence:** MEDIUM (web-platform/browser-support claims cross-checked across MDN/caniuse/web.dev; architectural recommendations derived directly from reading the existing `index.html` render/state model — HIGH confidence on the "how it plugs into what exists" parts, MEDIUM on browser-support currency)

**Hard constraint restated:** everything below is inline in the single `index.html`. No npm, no CDN, no build step, no libraries, no bundler, nothing installed. This file lists *browser-native APIs and code patterns*, not packages.

## Recommended Stack

### Core Technologies (browser-native, zero-dependency)

| Technology | Support status | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| DOM + CSS (existing `el()`/innerHTML render idiom) | Universal | Board pieces that need click handlers + easy CSS transitions: marbles, dice, boat marker, buttons, callouts | The codebase already renders everything (`renderTrack`, `renderStrip`, `renderPlayers`) by rebuilding real DOM nodes from state. At the object count this game needs (a handful of track beats, ~6–12 marbles, up to 4 dice, 4 player panels), DOM is not a performance problem — SVG "is more performant than Canvas for a small number of objects... but degrades as element count climbs into the thousands" and this board never approaches that. Staying DOM+CSS means zero new rendering paradigm, and every piece is natively clickable/CSS-transitionable/inspectable, which Canvas is not. |
| Inline `<svg>` for static/vector art | Universal | Boat silhouette, sea/wave backdrop, island icons, marble-bag outline | SVG lives in the DOM (stylable with the existing CSS custom-property palette, `currentColor`-friendly), scales crisply at any board size, and is easy to hand-author directly in the HTML file (no image assets, no build step — a `<path>` is just markup). Use it for the *backdrop art*, not for the interactive pieces (see below) — SVG shapes *can* be interactive but doing so re-implements what plain DOM elements already give for free. |
| `<dialog>` element (`showModal()`/`close()`, `::backdrop`) | Baseline, wide support (Chrome/Edge/Firefox/Safari incl. iOS 15.6+, Chrome/Firefox for Android) | Blind-commit "pass to \[player\]" gate, end-game reckoning modal | Native focus-trap, native Escape-to-close, native `::backdrop` dimming — replaces the current `passGate()`/final-reckoning approach of overwriting `#prompt`'s innerHTML (which doesn't block interaction with the board behind it or trap focus). This is a strict UX upgrade for zero added code. |
| `<details>`/`<summary>` | Universal (has been for years — not even a currency risk) | Collapsible narration/log panel, collapsible verb-rule reminders | Zero-JS disclosure widget. Good fit for keeping the (now secondary) text log available-but-out-of-the-way once the board becomes primary, and for "what does Dare/Abide/Give do here?" inline help without hand-rolled show/hide JS. |
| Popover API (`popover` attribute, `popovertarget`) | Baseline "Newly available" since Jan 2025; supported in current Chrome/Firefox/Safari/Edge | Narration callouts anchored to a marble/die/player panel when a scene resolves | This is the most load-bearing new API for the milestone: the spec explicitly calls for "narration surfaced inside the board" rather than a scrolling log. `popover` gives declarative top-layer stacking + light-dismiss + Esc-to-close without manual z-index/backdrop/outside-click JS — otherwise you'd hand-roll all of that. |
| CSS Container Queries (size) | Baseline "Widely available" since Feb 2023 (Chrome/Edge 105+, Firefox 110+, Safari 16+; ~90% global support) | Board/marble-bag/dice sizing that responds to its own panel width, not the viewport | The existing `.players` grid already uses `repeat(auto-fit,minmax(180px,1fr))`; container queries let the marble-bag panel or dice size respond to *its own* box (e.g. on a phone passed around a physical table) instead of a viewport media query, which is the correct tool once the board has nested panels of independently-varying width. Container-query *units* (`cqw`/`cqh`) are widely but not universally Baseline — prefer `%`/container-query length functions over raw `cqw` if you want maximum safety, though for a locally-run single-user file this is a minor concern. |
| CSS transitions/keyframe animations (class-toggle driven) | Universal | Marble removal from the bag, dice "roll" spin, boat advancing along the track, favor/hold number tick | This is the correct default per web.dev/MDN guidance: CSS transitions/animations are GPU-compositable and can run off the main thread, "the best default for UI motion." Trigger by adding/removing a CSS class in the render function (already the codebase's idiom — e.g. `p._boneShow`/`p._delta` already drive conditional rendering); let CSS own the timing curve. |
| Web Animations API (`el.animate(keyframes, opts)`) — used selectively | Universal in current engines | The *few* places the game must `await` an animation finishing before continuing game logic | WAAPI has performance identical to CSS animations (same engine) but returns a `.finished` Promise. The existing engine is already `async/await`-structured top to bottom (`collectCommits`, `actPhase`, `botPause`/`sleep`) — so `await el.animate(...).finished` is a drop-in fit with the current control-flow style, versus hand-wiring a `transitionend` listener. Use this only where the *sequence itself* is gated on the animation (e.g. "wait for the dice-spin animation, then reveal the face") — for purely decorative motion, plain CSS transitions are simpler and don't need this. |

### Explicitly NOT recommended for this milestone

| Technology | Why not | Use instead |
|------------|---------|--------------|
| HTML5 Canvas | Canvas is the right call for hundreds/thousands of rapidly-changing bitmap objects; this board has on the order of tens of discrete, mostly-static pieces that need to be individually clickable, CSS-stylable, and screen-reader-inspectable. Canvas graphics "are not part of the DOM, so you cannot style or interact with individual elements using CSS or JavaScript" — you'd have to hand-roll hit-testing for Dare/Abide/Give buttons, dice, and marbles, plus manual ARIA, for no performance benefit at this scale. | DOM+CSS for interactive pieces; inline SVG for backdrop art (see above). |
| `requestAnimationFrame`-driven custom animation loops | rAF is "for per-frame control... an advanced approach, useful if you're building a game or drawing to canvas" doing continuous physics/scene orchestration by hand. This game has *discrete* state transitions (a marble drawn, a die thrown, a boat step), not a continuously-simulated scene — rAF would be strictly more code than CSS transitions/WAAPI for the same visible result, and (see Determinism section) is an easy place to accidentally leak game-affecting randomness into a render-time loop. | CSS transitions for decorative motion; WAAPI `.finished` for sequencing. |
| View Transitions API (same-document/SPA form) | Not yet Baseline widely-available: Chrome 111+/Edge/Safari support it, but Firefox only shipped it in a recent beta (v144) at time of research. MDN/web.dev explicitly say to keep a non-transitioned fallback because support is inconsistent. It also buys nothing here that CSS transitions/WAAPI don't already cover for this board's needs (state → state DOM diffs), so adopting it adds a support caveat for zero unique capability. | CSS transitions / WAAPI, as above. |
| CSS Anchor Positioning (`anchor-name`, `position-anchor`, `anchor()`) | Reached Baseline 2026 status (Chrome 125+, Firefox 132+, Safari 18.2+ core; full `@position-try` flip behavior needs even newer point releases: Firefox 147+, Safari 26+) — genuinely useful for auto-positioning narration callouts next to a marble/die without manual JS math, but it's the *newest* API considered here and its "flip to stay on screen" fallback isn't uniformly available yet. | Popover API alone (it already places at a fixed/CSS-positioned spot without needing anchor math) for v1.1; revisit anchor positioning as a later polish pass once its full feature set is more settled. |
| Any JS animation/tweening library, charting/graphics library, or game-engine micro-framework (GSAP, Konva, PixiJS, anime.js, etc.) | Violates the explicit no-libraries/no-CDN/single-file constraint outright. Also unnecessary: CSS transitions + WAAPI cover every animation need identified above. | The native APIs listed in the Core Technologies table. |
| `localStorage`/`sessionStorage`-backed board state, service workers, any persistence API | Out of scope per PROJECT.md ("no storage... reload = fresh game") — not a stack gap, just flagging so it isn't accidentally reached for while building "an interactive board" (boards often tempt persistence). | Nothing — keep all board state inside the existing in-memory `state` object. |

## Determinism & Architecture Integration (the load-bearing design constraint)

The existing engine has exactly one seam for randomness: `rnd()`/`state.rng()`, seeded via `makeRng(seedStr)` from `?seed=`. Every consumer of randomness (`throwBone()`, `drawMarble()`, `pick()`, bot jitter in `botDecide`) calls through this seam, and `render()` / `renderTrack()` / `renderStrip()` / `renderPlayers()` are pure functions of `state` with **no** randomness of their own. This is exactly the property that must survive the board rework:

- **Rule: the board's visual/animation layer must never call `rnd()`/`Math.random()` for anything that affects displayed values.** All dice faces, marble draws, and effect deltas are decided by the existing reducer functions (`throwBone`, `drawMarble`, `applyDeltas`) *before* any pixel is drawn; the board's job is to animate the reveal of an already-decided value, never to decide it. E.g., a "dice spin" animation should run a fixed, non-random-duration CSS keyframe animation and then display the face `throwBone()` already returned — it must not use its own random spin count/duration, or two runs of the same `?seed=` could visually (and if timing gates game logic, even functionally) diverge.
- **Marble bag → visual bag mapping:** `state.crossing.bag` is already the literal array of remaining marbles; the board should render it directly (n divs of class `.marble.blue`/`.marble.white`) rather than maintaining a shadow copy. When `drawMarble()` splices an entry out, the render step diffs old-DOM-node-count vs `bag.length`, tags the departing marble's element with a `.leaving` class, and removes it from the DOM on `transitionend` (or via `el.animate(...).finished` if the reveal must be awaited before the next crossing step runs) — the *reducer* already decided which marble left; the animation only decides how it visually leaves.
- **Boat position** is derivable purely from `state.beatIndex`/`state.journey` (already tracked) — animate the boat's CSS `left`/`transform` to the position implied by state on every `render()` call; never store an animation-only "current boat position" that could drift from `state`.
- **This keeps `render()` a pure function of `state` in the same sense it already is today** — the only new idea is that some renders also *schedule* a CSS/WAAPI animation as a side effect of a value changing, which is presentational, replayable, and seed-safe as long as no animation branches on `Math.random()`/timing to decide outcomes.
- **`botPause()`/`sleep()` remain the correct place for game-flow pacing** (already fixed-duration, already `state.botSpeed`-driven, already deterministic across seeds since it doesn't affect *values*, only *when the promise resolves*). Any new "wait for the board animation to finish" points should reuse this same pattern (either `await el.animate(...).finished` or `await sleep(FIXED_MS)`), not introduce a second timing mechanism.

## Data-Structure Pattern for the Per-Scene Effect/Narration Table

**What exists today:** two flat, global tables — `LAND_TABLE`/`SEA_TABLE` — each shaped `verb → face → {you, crew, favor, world}` deltas (see `index.html` lines ~189–198), explicitly commented "data, not if-chains." A handful of episodes (`helios`, `cyclops`, `sirens`, `lotus`) override this per-scene via a `reskin` object of `{dare, abide, give}` *closures* that both mutate state and hand-write a `log()` HTML string inline.

**What v1.1 needs:** every stage of every episode (4 islands × 3 scenes + Hades/Phaeacia/Ithaca's stage-equivalents) needs its own verb × face table with a hand-tuned payoff *and* a one-sentence narration — roughly 250+ leaf entries. Two structural risks to design against: (1) narration text becoming buried inside imperative closures (hard to read/edit/tune in bulk, hard to reuse for the board's callouts), and (2) a giant table structurally decoupled from the scene it belongs to (easy for someone hand-tuning a scene to edit the wrong index).

**Recommended pattern — extend the existing per-scene shape, don't replace it:**

1. **Co-locate the table on the scene object**, next to the `hook`/`verbs` it already has (this is the existing precedent in `EPISODES[id].scenes[i]` — don't invent a separate global lookup keyed by episode+scene index, which is exactly the kind of "must stay in sync by position" structure that causes silent drift):
   ```js
   { name:'The Meadow', hook:'...',
     verbs:{ dare:{label:'...'}, abide:{label:'...'}, give:{label:'...'} },
     table: {
       dare:  { 1:{ d:{you:-1,world:1}, tell:p=>`${p.name} raises the blade — and Helios sees.` },
                3:{ d:{you:1},           tell:p=>`${p.name} takes a quiet cut of beef.` },
                4:{ d:{you:2},           tell:p=>`${p.name} carves deep, unseen — for now.` },
                6:{ d:{you:2,crew:2},    tell:p=>`${p.name} feasts the whole crew on stolen meat.` } },
       abide: { 1:{ d:{},                tell:p=>`${p.name} keeps the vow — and goes hungry.` }, /* ... */ },
       give:  { 1:{ d:{you:-1},          tell:p=>`${p.name} gives up a ration to steady the crew.` }, /* ... */ },
     }
   }
   ```
2. **One shared resolver replaces the ad-hoc `reskin` closures for the common case**: `applySceneEffect(p, table, verb, face)` looks up `table[verb][face]`, applies deltas via the existing `applyDeltas()`, and returns `{applied, tell}` — a plain data pair, not a side-effecting closure. The call site (`actPhase`) decides what to *do* with `{applied, tell}`: write it to the log, AND/OR hand it to the board's narration-callout renderer. This is the key integration point for the board: today `reskin` closures call `log()` directly and return a plain string for `p._delta`; decoupling "what happened" (data) from "where it's displayed" (log vs. board callout vs. both) is what lets the same effect table drive two different UI surfaces (the collapsible `<details>` log *and* the popover-based board callout) without duplicating narration text.
3. **Reserve true `reskin`-style closures only for scenes with genuine extra state mutation** that can't be expressed as a flat delta — e.g. Cyclops's `state.ep.drunk++` counter, or Lotus's `p.lotusStruck=true` flag. Even these can still return `{d, tell}`-shaped data for the *narration* half; only the "also mutate this extra counter" part needs to stay imperative. Don't force every scene into the pure-table shape if it fights the mechanic — the existing codebase's own philosophy ("readability over cleverness... this file will be edited a lot") argues for keeping the *narration* data-driven everywhere, while letting genuinely special mechanics keep a small amount of imperative code beside their table.
4. **Generalize the same `{choice: {face: {d, tell}}}` shape to Hades/Phaeacia/Ithaca's non-triad choices** (e.g. Ithaca's endure/reveal patience gate, Phaeacia's gift-roll) rather than inventing a bespoke format per fixed anchor. The *keys* change (`endure`/`reveal` instead of `dare`/`abide`/`give`) but the shape and the resolver stay identical, so the board's narration-surfacing code has exactly one code path to call for "a choice resolved, here's what happened," regardless of which part of the voyage triggered it.
5. **Use small arrow functions for `tell`, not raw template-literal strings stored as data**, since this is a plain `.js` `<script>` block, not JSON — `tell:p=>\`${p.name} …\`` is the natural, lowest-boilerplate JS-native way to parameterize narration by the acting player, and it keeps every leaf entry visually uniform and greppable (`grep 'tell:p=>'` finds all narration in the file) which matters a lot at ~250 entries.

This pattern is a direct, minimal-diff extension of what the file already does (the `LAND_TABLE`/`SEA_TABLE` shape, the `reskin` precedent, the `applyDeltas`/`log` split) — it does not introduce a new sub-language, schema file, or data format, and stays fully inline/editable in the one HTML file.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| DOM+CSS for interactive board pieces | Full inline-SVG board (marbles/dice/boat all as SVG shapes) | If the team wants one unified coordinate system for board art and pieces (e.g. precise geometric layout of a physical-feeling board), SVG-for-everything is defensible — `<circle>`/`<rect>` elements are still real, stylable, clickable DOM nodes. Recommended-against only because it means re-deriving hover/click states and text layout (dice pips, marble counts) in SVG's more verbose authoring model versus reusing the existing `el()`/CSS button/panel idiom already in the file. |
| CSS transitions as animation default | Web Animations API for everything (skip CSS entirely) | If most animations end up needing to be `await`-sequenced with game logic (not just decorative), standardizing on WAAPI everywhere removes the two-system split. Recommended-against as the *default* because CSS is simpler for the majority of purely-decorative motion and is guaranteed compositor-friendly. |
| Popover API for board narration callouts | `<dialog>` (non-modal `show()`) for callouts | `<dialog>`'s non-modal `show()` mode is also a valid zero-JS-styling option and has equally wide support; Popover was preferred because its light-dismiss/auto behavior and `popovertarget` declarative wiring need less JS than manually calling `.show()`/`.close()` per callout instance across potentially many simultaneous marbles/players. Use `<dialog>` instead if you want the callout to also visually block interaction with the board (rare for a "flavor toast," but right for the end-game reckoning, which already uses this pattern). |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|--------------|
| HTML5 Canvas for the board | Loses free CSS styling, free click targets, free DOM accessibility, for no performance benefit at this object count. | DOM+CSS (interactive pieces) + inline SVG (backdrop art). |
| Any animation/game/tweening library (GSAP, PixiJS, anime.js, Konva, Phaser, etc.) | Violates the explicit single-file/no-library/no-CDN constraint. | Native CSS transitions + Web Animations API. |
| View Transitions API as a required dependency | Firefox support only reached beta-recency at research time; not Baseline widely-available. | CSS transitions/WAAPI, which have universal support in current engines. |
| A separate global effect-table object indexed by `[episodeId][sceneIndex][verb][face]` | Structurally decouples the table from the scene definition it describes, inviting index-drift bugs when scenes are added/reordered/hand-tuned. | Co-locate `table` directly on each scene object, per the pattern above. |
| Baking narration directly into `log()` calls inside imperative `reskin` closures for every scene | Makes narration hard to bulk-edit/tune, and gives the board no structured data to pull a callout's text from without re-parsing HTML strings. | Return `{d, tell}` data pairs from a shared resolver; let the call site decide log vs. board callout vs. both. |
| Any new source of randomness inside `render()`/animation code (a second `Math.random()`, a JS-timed "random-length" spin, etc.) | Breaks the `?seed=` determinism guarantee that the whole engine is built around — a visual-only random spin duration is fine only if it never gates *when* the next game-logic step runs or *what* value is displayed; anything that does either must go through the existing `rnd()` seam or a fixed, non-random timer (`sleep`). | Decide all values via the existing `rnd()`/`throwBone()`/`drawMarble()` seam before drawing anything; use fixed-duration CSS/WAAPI/`sleep()` for all animation timing. |

## Stack Patterns by Variant

**If a scene's mechanic needs extra persistent counters beyond the flat verb/face delta shape (e.g. Cyclops's `drunk` counter, Lotus's `lotusStruck` flag):**
- Keep a small `reskin`-style closure for the *state mutation* only, but still return/attach a `{d, tell}` pair for narration, so the board's narration surface stays uniform even where the mechanic isn't.
- Because these are inherently "special," they're also good candidates for the PITFALLS-flagged "needs deeper attention while balancing" scenes — they're already the most complex reskins in the file today.

**If the board needs to show more than one simultaneous narration callout (e.g. two players resolve in the same reveal-in-turn loop):**
- Use the Popover API's stacking (top-layer) behavior with one popover instance per player panel (or a small pool), rather than a single shared "toast" element that would have to queue — this avoids hand-rolled queueing logic for a case the platform already handles.

## Version Compatibility

| Feature | Compatible With | Notes |
|-----------|-----------------|-------|
| `<dialog>` + `::backdrop` | All current-generation evergreen browsers (Chrome/Edge/Firefox/Safari incl. iOS 15.6+) | No polyfill needed for a locally-run, author-controlled-browser single file in 2026. |
| Popover API | All current-generation evergreen browsers since ~April 2024 (Baseline "Newly available" Jan 2025) | Same as above — safe to rely on natively. |
| CSS Container Queries (size) | Chrome/Edge 105+, Firefox 110+, Safari 16+ (Baseline "Widely available" since Feb 2023) | Container query *units* (`cqw`/`cqh`) are less universally battle-tested than the `@container` rule itself — prefer percentage/`container-type: inline-size` queries if avoiding any edge-case risk. |
| Web Animations API | Universal in current engines | Same underlying compositor as CSS transitions/animations — no perf tradeoff either direction. |
| View Transitions API (same-document) | Chrome 111+/Edge/Safari; Firefox only in v144 at time of research | Not relied upon in this recommendation set — flagged here only so it isn't reached for later without checking currency again. |
| CSS Anchor Positioning | Baseline 2026: Chrome 125+, Firefox 132+, Safari 18.2+ core; full `@position-try` flip needs Firefox 147+/Safari 26+ | Newest API considered; deferred to a later polish pass (see "Explicitly NOT recommended"). |

## Sources

- [SVG versus Canvas: Which technology to choose and why? — JointJS](https://www.jointjs.com/blog/svg-versus-canvas) — MEDIUM confidence (cross-checked against CSS-Tricks/SitePoint/LogRocket coverage of the same tradeoff)
- [When to Use SVG vs. When to Use Canvas — CSS-Tricks](https://css-tricks.com/when-to-use-svg-vs-when-to-use-canvas/) — MEDIUM confidence
- [Animations on the Web: CSS, requestAnimationFrame, Web Animations API, and View Transitions — Benedikt Sperl](https://www.benedikt-sperl.de/blog/2026-01-13-animations-on-the-web) — MEDIUM confidence
- [CSS and JavaScript animation performance — MDN](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance) — MEDIUM confidence (MDN, cross-checked)
- [CSS versus JavaScript animations — web.dev](https://web.dev/articles/css-vs-javascript) — MEDIUM confidence
- [Dialog element — caniuse](https://caniuse.com/dialog) — MEDIUM confidence
- [CSS Container Queries (Size) — caniuse](https://caniuse.com/css-container-queries) — MEDIUM confidence
- [CSS container queries — MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries) — MEDIUM confidence
- [Popover API lands in Baseline — web.dev](https://web.dev/blog/popover-api) — MEDIUM confidence
- [popover HTML global attribute — MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover) — MEDIUM confidence
- [View Transition API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) — MEDIUM confidence
- [View transitions for single page applications — web.dev](https://web.dev/learn/css/view-transitions-spas) — MEDIUM confidence
- [Anchor Positioning Updates for Fall 2025 — OddBird](https://www.oddbird.net/2025/10/13/anchor-position-area-update/) — MEDIUM confidence
- [CSS Anchor Positioning: Browser Support — TestMu AI](https://www.testmuai.com/learning-hub/css-anchor-positioning-browser-support/) — MEDIUM confidence
- Direct read of `/index.html` (current shipped v1.0 prototype: `CONFIG`, `LAND_TABLE`/`SEA_TABLE`, `render()`/`renderTrack()`/`renderStrip()`/`renderPlayers()`, `state.rng()`/`makeRng()`, `EPISODES[*].scenes[*].reskin`, `applyDeltas`, `log()`) — HIGH confidence (primary source, ground truth for integration points)

---
*Stack research for: Odyssey Crew v1.1 — interactive board + per-scene effect/narration data model (vanilla single-file constraint)*
*Researched: 2026-07-25*
