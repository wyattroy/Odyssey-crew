# Pitfalls Research

**Domain:** Single-file vanilla-JS turn-based board game — adding mass thematic content authoring, hand-tuned economy retuning, and a text-log-replacing interactive visual board to a shipped, deterministic, seed-reproducible prototype (`index.html`)
**Researched:** 2026-07-25
**Confidence:** HIGH (grounded in direct read of the shipped `index.html` engine and `.planning/PROJECT.md` invariants, plus the documented death-spiral playtest finding; general patterns are standard game-engineering/software-engineering knowledge, not vendor-specific)

## Critical Pitfalls

### Pitfall 1: The board silently becomes the source of truth (state/render divergence)

**What goes wrong:**
Today, `render()`/`renderTrack()`/`renderStrip()`/`renderPlayers()` are pure functions of `state` — they redraw fully from `state.hold`, `state.crossing.bag`, `p.satchel`, etc., every time they're called (`renderLog` even diffs by comparing `state.log.length` to DOM child count). An animated board (boat sprite position, draining marble bag, rolling dice) tempts a different pattern: the DOM/canvas element itself starts tracking "how many marbles are left visually" or "where the boat currently is" as its own mutable value, updated by animation callbacks instead of re-derived from `state` on every render. Once that happens, `state.crossing.bag.length` and "marbles visibly in the bag" can drift — especially after a fast-forwarded or interrupted animation, a skipped frame, or an out-of-order `await`.

**Why it happens:**
Animating "the actual thing draining" (as the milestone explicitly wants — a real blue/white marble count, not an abstraction) is naturally implemented as "remove one visual marble, then update the count," which inverts the current model's direction of truth (state → render) into (render event → state adjustment). This is the single most common bug class when a text/data UI is replaced by an animated visual one.

**How to avoid:**
Keep the discipline `state` mutates first (as `drawMarble()` already does — `bag.splice(idx,1)[0]`), and the board's animation is *purely illustrative*: it is handed the already-decided outcome (`m`, the marble color and the pre/post bag composition) and animates to match it, never decides or independently tracks anything. The board should have zero fields that aren't recomputed from `state` on the next `render()`. Any "in-flight animation" bookkeeping (e.g., "which marble sprite is currently flying out") must be presentation-layer-only and re-derivable/discardable on every `render()` call without changing game outcomes.

**Warning signs:**
Bag marble count on screen doesn't match `state.crossing.bag.length` after a fast unattended run; reloading mid-animation (or setting `botSpeed=0`) shows a different marble count than a paused run at the same `state`; any new module-level variable that isn't reset by `render()`.

**Phase to address:**
Board-architecture phase (before any island content work), as an explicit design contract: "render is a pure projection of `state`; animation never owns data."

---

### Pitfall 2: Blind-commit masking breaks because the board makes "show everything" the default posture

**What goes wrong:**
The existing masking model is narrow and precise: `collectCommits()` lets bots commit silently into `state` *before* the human turn even starts, and `passGate()` hides the *choosing* player's controls from everyone else via `directorMode`/single-human short-circuits and a literal "pass the device, tap when ready" gate. Nothing in `state` is actually secret — masking is 100% a rendering discipline (only render `ctrl-<id>` into the DOM for the player whose secret turn it is). A "big interactive board" redesign is naturally pulled toward showing all four player panels live and simultaneously (it *looks* like a game board), which is exactly the layout that leaks: bot commits already sit in `state.players[i].commit` the instant `collectCommits` starts (`seats.filter(s=>s.isBot).forEach(b=>{ b.commit = botDecide(...) })`), so a board that renders "current selection" per player-panel — even a highlighted icon, a dimmed/disabled Give button, a dice-preview silhouette — will leak bot intent (and, in masked multi-human play, a nosy player glancing at another's still-uncommitted panel) before the reveal step.

**Why it happens:**
Board/dashboard UIs default to "always show full state for spectacle"; the current masking is a *procedural* guarantee (what gets appended to the DOM and when), not a *data* guarantee (nothing in `state` is actually withheld from the renderer). Any refactor that renders more than the current turn's owner risks exposing pre-reveal state that was always present in memory.

**How to avoid:**
Explicitly split the board into "public" zones (boat position, hold, crossing bag, world/doom track — always safe to render from `state`, they're common knowledge) and "private-until-reveal" zones (whose verb was picked, what a bone shows) and gate the private zone through the *same* `passGate`/`directorMode`/bot-silent-commit logic that exists today, not a new one. Add a lightweight assertion/lint step: before reveal, render must never read `p.commit` or `p.lastBone` for any player except the one currently gated in. Treat "board redesign" as a rendering-layer change only — do not touch `collectCommits`'s commit-then-reveal ordering.

**Warning signs:**
Any board mockup that shows four dice or four verb icons "live" before the reveal beat; a build where director-mode-off still visually distinguishes bot panels mid-turn (e.g., a "thinking…" animation that differs by chosen verb); QA testing only in director mode (which never had masking to begin with) and never catching a real multi-human masked leak.

**Phase to address:**
Board-architecture phase, verified explicitly in the board's UAT with `directorMode:false` and `humanCount>=2` (the only condition that currently exercises masking at all).

---

### Pitfall 3: Replacing (not supplementing) the log destroys the debuggable, greppable transcript that makes unattended seeded runs verifiable

**What goes wrong:**
`state.log` is currently the *only* artifact of a `?seed=…&auto=1&humans=0` run — a linear, append-only, human-and-machine-readable record of every RNG-driven decision (`${p.name} ${verb} 🎲${bone} → ${delta}`). It's how the death-spiral finding in this project's own memory was diagnosed. If v1.1 "replaces the narration log" by literally deleting `#log`/`state.log` in favor of transient on-board animations and toast-style narration, there is no longer any way to (a) diff two seeded runs, (b) grep for "dies" or "starving" across a full playtest, or (c) verify a balance retune without manually watching an animated board frame-by-frame for each of many seeds.

**Why it happens:**
"The board replaces the log" reads naturally as "the log goes away," when the actual requirement (per `PROJECT.md`'s validated v1.0 line "verbose narration log") is that the log was the *primary playtest instrument*, and nothing in the v1.1 goal says that instrument should stop existing — only that it should stop being the primary *player-facing* UI.

**How to avoid:**
Keep `state.log` and the `log()`/`logBeat()`/`flavor()` calls exactly as-is (they already carry all the semantic narration content the board needs); the board becomes a *second* renderer of the same events (a live in-board narration strip, dice, boat) while the existing `#log`/transcript is retained — collapsed/hidden by default behind a toggle (mirroring the existing `directorToggle` pattern) rather than deleted, and always available via `window.state.log` / a "download transcript" affordance for unattended/CI runs. Any new balance-tuning workflow (Pitfall 7/8) depends on this transcript surviving.

**Warning signs:**
Can no longer answer "what exactly happened in seed X's game" without re-watching the whole board animation; `?auto=1&humans=0` runs produce no text artifact at all; a bug report says "the board looked wrong" with no way to correlate it to a specific `state` transition.

**Phase to address:**
Board-architecture phase — decide "log stays as a data/debug layer, board is an additional view" as an up-front architectural decision, not an afterthought once the board is built.

---

### Pitfall 4: Animation timing gets wired into the async game loop and breaks the "0-human seeded game runs unattended to a winner" guarantee

**What goes wrong:**
Every pacing pause in the current engine (`botPause()` → `await sleep(state.botSpeed)`) is already gated by a single `botSpeed` control, and `botSpeed=0` is what makes `?auto=1` runs fast and CI-viable. A board with real animations (boat gliding, marbles visibly leaving the bag, dice tumbling) will want its own wall-clock durations for those effects. If those are implemented as additional `await` calls stacked on top of (or independent of) `botPause()` — e.g., `await animateMarbleDraw()` taking a fixed 400ms regardless of `botSpeed` — every unattended full-auto run becomes proportionally slower by (animation count × fixed duration), and a headless/off-screen run can hang indefinitely if the animation relies on `requestAnimationFrame` (which browsers throttle or pause entirely on backgrounded/non-visible tabs).

**Why it happens:**
Animation code is usually written and tested with the tab focused and a human watching, so the "does this survive `botSpeed=0`, 0 humans, backgrounded tab" case is easy to skip. `requestAnimationFrame`-driven animation is also an easy reach for anyone giving the board "juice," and it's the exact primitive most likely to silently stall in this project's `?auto=1` regression use case.

**How to avoid:**
Route every new animation duration through the same `botSpeed`/speed-control seam already in `CONFIG`/UI (`botSpeedIn`/`botSpeedToggle`), and make `botSpeed===0` mean *animations are skipped entirely* (snap to end state), not merely "shortened." Never `await` a `requestAnimationFrame`-driven tween as a blocking step in the core game loop (`runCrossing`, `actPhase`, `eatPhase`) — animations should be fire-and-forget visual polish layered on top of state changes that have already happened, not gating state progression.

**Warning signs:**
A full `?auto=1&humans=0&speed=0` run that used to finish in seconds now takes much longer; the same run in a background/minimized tab appears to hang; profiling shows RNG draws (`rnd()`/`rint()`) happening later, or in a different order, than they did pre-board.

**Phase to address:**
Board-architecture phase — bake the speed-gate contract in before any animation code is written; verify with an automated timed run of `?auto=1&speed=0` before/after the board lands.

---

### Pitfall 5: RNG draw order/count is coupled to UI event timing, breaking `?seed=` reproducibility

**What goes wrong:**
Determinism today works because every `rnd()`/`rint()`/`throwBone()`/`pick()` call happens synchronously, in a fixed logical order, inside the reducer functions (`actPhase`, `eatPhase`, `startCrossing`, `drawMarble`, `throwBone`) — never inside a DOM event handler, `requestAnimationFrame` callback, or animation-completion promise. If a board refactor moves any RNG draw to be triggered by (or reordered around) a click handler, a CSS `transitionend`, or an animation-frame callback — e.g., "roll the dice visually first, animate for a bit, *then* call `throwBone()` when the animation lands" — the same seed can produce different results depending on frame timing, browser, or `botSpeed`, silently breaking every property the `?seed=` contract exists to guarantee (bug reproduction, seeded regression comparison, the balance-tuning workflow in Pitfall 7).

**Why it happens:**
"Show the dice rolling, then reveal the result" is the natural animation idiom, and it inverts the current "we already know the result, now show it" flow (`actors.forEach(p=>{ p.lastBone = throwBone(); })` happens *before* the reveal loop). Developers building the visual dice will be tempted to make the visual roll "generate" the number instead of just displaying a number that was already generated.

**How to avoid:**
Preserve the existing invariant explicitly: all `rnd()`-family calls stay inside the synchronous reducer/state-mutation functions, called in the same order as today; the board only ever *displays* an already-computed value (exactly like `p._boneShow = p.lastBone` today). Add a one-line contract comment at the RNG seam (`rnd()`) restating this, and a smoke test that runs the same seed with `speed=0` and `speed=550` and asserts the final log/state are byte-identical.

**Warning signs:**
Two runs of the same `?seed=` at different `botSpeed` values produce different outcomes; a "replay this seed" bug report can't be reproduced; RNG call sites appear inside `.onclick`, `requestAnimationFrame`, or a `.then()` off an animation promise.

**Phase to address:**
Board-architecture phase, enforced as a code-review gate on every board PR that touches dice/marble visuals; verified by the seed-parity smoke test above, re-run after the content-authoring and balance phases too (since those phases add new `rnd()` call sites via reskins).

---

### Pitfall 6: The stated Dare > Abide-favor-monopoly law is already violated in shipped code — mass content authoring will scale the inconsistency instead of fixing it

**What goes wrong:**
`PROJECT.md`'s v1.1 target features list "Abide is riskless, low-upside... and the *only* favor path (Zeus's law); Give... never moves favor" as something v1.1 must *encode* — which is itself evidence it isn't reliably true today. Reading the shipped episode reskins confirms it: Sirens' `dare` (listening) directly grants favor (`sirensReskin(): dare: p.favor+=f` where `f=CONFIG.sirens.listenFavor[b]`), and Cyclops' `dare` outcomes grant favor twice over (the Pride boast: `p.favor+=3` on a Dare choice, and the Stake collective check: `darers.forEach(p=>{ p.favor+=2; ... })`, again gated on having chosen Dare). Both directly contradict "Abide is the only favor path." If the 252-cell mass-authoring pass for the 4 islands + 3 anchors treats the *existing* episodes as the template to copy from (reasonable, since they're the only worked examples), the violation propagates into every new scene instead of being corrected, and the design's core signal — "cooperation optimal for winning, defection optimal only for bare survival" — gets structurally undermined project-wide, not just in one episode.

**Why it happens:**
The existing reskins were written before the "only Abide grants favor" rule was made explicit as a hard law in `PROJECT.md`; they read as thematically justified in isolation (kleos for listening to the Sirens, glory for blinding the Cyclops) even though they break the cross-episode economic law. Under time pressure, a content-authoring pass naturally treats "what's already there" as ground truth rather than re-deriving each cell from the stated law.

**How to avoid:**
Before authoring any new scene tables, explicitly reconcile the existing Sirens/Cyclops favor-on-Dare cells against the law: either (a) treat them as deliberate, documented exceptions (and write down *why* — e.g., "kleos is a distinct favor-adjacent subsystem" — so authors of the other 5 stages don't copy the pattern by accident), or (b) fix them to route through Abide/Give-shaped mechanics instead. Then build a mechanical guardrail: a small validation pass (run once over all `LAND_TABLE`/`SEA_TABLE`/reskin outputs, or even a manual checklist) asserting `favor` deltas only ever appear on `abide` cells (plus the one documented Dare-1-removes-favor penalty and any explicitly-approved exceptions) before the content phase is marked done.

**Warning signs:**
Any new scene where `dare`'s reskin function contains `p.favor+=`; a playtest where Dare becomes favor-competitive with Abide (defeats the "defection optimal only for bare survival" core value); reviewers who only check the *new* scenes for law-compliance and never revisit Sirens/Cyclops.

**Phase to address:**
Content-authoring phase, as the very first task (audit + reconcile existing episodes against the stated law) *before* writing any of the 5 new/expanded stage tables, so the corrected pattern — not the shipped-with-violations one — is what gets replicated 252 times.

---

### Pitfall 7: Hand-tuning without a simulation harness re-introduces (or masks) the documented death-spiral, or over-corrects into trivial survival

**What goes wrong:**
This project's own memory record documents a specific, diagnosed failure: at default constants, the hold economy collapses early, lots get cast almost every crossing, the `deadEndCheck()` safety net auto-pays Charon for every solvent corpse (draining everyone's favor to ~0), and Ithaca's bow-floor gate never meaningfully engages — the finale doesn't fire. Hand-tuning the new per-stage payoffs "by feel" without any harness has two realistic failure modes, both of which are easy to miss from a single seeded playtest: (a) the death-spiral persists because playtest attention goes to the *new* thematic content and not to whether the hold ever actually goes negative-in-expectation across many seeds; (b) the fix over-corrects — payoffs become generous enough that hold/rations pressure never bites, Dare's risk becomes irrelevant because starvation is never a real threat, and the commons tension (private optimal choices summing to disaster) simply never fires because there's no disaster to sum into. Either failure is invisible if verification is "I played it once and it felt fine."

**Why it happens:**
Designer-judgment tuning naturally optimizes for "the run I just watched" rather than "the distribution of runs this seed space produces," and a single manual playtest samples one point from a distribution that the memory note shows is already known to be bimodal (death-spiral vs. trivial) at at least the default constants.

**How to avoid:**
Since the batch-simulation harness is explicitly out of scope this milestone, substitute the cheapest available proxy: run the existing `?seed=…&auto=1&humans=0` unattended mode across a *fixed matrix* of several distinct seeds (not just one) after every meaningful CONFIG/table change, and grep the resulting transcripts (Pitfall 3 — this is exactly why the log must survive) for the two failure signatures: (1) death-spiral — `state.hold` reaching 0 while `livingCount()` > 0 more than once per game, or `l-die` log lines appearing before Hades; (2) trivial-survival — every seed reaching Ithaca with `hold` comfortably above `livingCount()` and no player ever dropping below the Ithaca bow floor. Treat "some crew reach Ithaca with favor > bow floor, and at least one seed produces a real death or starvation scare" as the manual acceptance bar the memory note implies. Re-run the same seed matrix after the content-authoring pass too, since per-stage payoffs are the new balance surface and will shift things again.

**Warning signs:**
Only one seed was ever manually played after a tuning change; nobody checked whether `hold < livingCount()` ever becomes true across the seed matrix; Ithaca's `qualifiers.length===0` fallback path ("no one clears the floor") never fires *or* always fires across the seed matrix (both indicate the bow-floor gate isn't tuned to the intended knife-edge).

**Phase to address:**
Balance/retune phase, with the seed-matrix regression check written down as an explicit exit criterion before the phase is marked complete, and re-run (not just eyeballed) after the content-authoring phase lands.

---

### Pitfall 8: Favor becomes a dominated/ignorable resource once per-stage payoffs are hand-tuned independently of each other

**What goes wrong:**
Favor currently accrues from scattered sources (Troy allocation, Abide-6, Sirens listening, Cyclops boast/stake, Helios restraint-bless, Phaeacia's bone-throw, Ithaca's Reckoning pot) with no single place that sums "how much favor does a typical run generate" versus "how much favor do the two favor-gated systems (Charon toll, Ithaca bow floor) actually require." When 5 more stages each get their own hand-tuned favor payoffs authored in isolation (one scene at a time, by feel), it's easy for the *sum* across a full voyage to land far above or far below the amounts the two gates (`CONFIG.charonToll`, `CONFIG.ithaca.bowFloor`) need to matter — either favor becomes trivially abundant (everyone clears every gate, the "arrive with the most favor" ranking stops discriminating between players) or it stays scarce enough that the second win condition (favor ranking) is decided almost entirely by Troy's one-time initial roll rather than by choices made across the whole voyage.

**Why it happens:**
Per-scene authoring is naturally scene-local ("does this payoff feel right for *this* beat's story") and nothing in a scene-by-scene authoring workflow forces a check of the cross-episode aggregate, especially without a simulation harness to sum it automatically.

**How to avoid:**
After all 5 remaining stages are authored, do one pass that sums the maximum and typical favor generated per stage against `CONFIG.charonToll` and `CONFIG.ithaca.bowFloor`/`qualifyTop`, and sanity-check that the seed-matrix transcripts (Pitfall 7) show real spread in final favor totals across players/seeds — not every game converging to the same favor total regardless of choices.

**Warning signs:**
Final-reckoning boards (the `finishGame()` output) show near-identical favor totals across most seeds/players; the Charon-pay decision (`revive`) is never declined by a bot with sufficient favor across the seed matrix; qualifiers for the Ithaca bow are always the same subset regardless of mid-voyage choices.

**Phase to address:**
Balance/retune phase, as a cross-episode reconciliation step performed *after* all per-stage tables exist, not scene-by-scene.

---

### Pitfall 9: "Content authoring" for Hades/Phaeacia/Ithaca is mistaken for filling in a table, when it's actually an engine change

**What goes wrong:**
The milestone's target features describe the same shape — "each verb × each roll (1/3/4/6) gets a story beat + payoff" — applying to "4 islands + Hades/Phaeacia/Ithaca." But in the shipped engine, `runHades()`, `runPhaeacia()`, and `runIthaca()` are entirely bespoke reducer functions that **never call `actPhase()`** and have no Dare/Abide/Give commit step at all: Hades is a peek + revival-round mechanic, Phaeacia throws `N = clamp(favor)` bones looking for a 6, and Ithaca runs a patience/bow-qualify/pot-split sequence. If this is treated as a content-authoring task ("just fill in the verb×face table for these three too"), the actual work — retrofitting a real Dare/Abide/Give commit-and-reveal scene structure into three anchors that currently have none, while preserving their existing bespoke mechanics (Charon/Orpheus revival, the gift-court bone-throw, the bow-floor/pot-split reckoning) — gets scoped as a small authoring pass when it's really an engine-extension task with real risk of breaking the anchors' existing (already-tested) special-case logic.

**Why it happens:**
The milestone framing ("each stage of every episode... gets a table") reads as uniform across all 7 stages, and it's natural to plan the roadmap phase for "content" as one undifferentiated pass, without first checking (as this research did) that 4 of the 7 stages already have a scene/verb/table shape and 3 do not.

**How to avoid:**
Scope this explicitly as two different phases (or explicitly sequenced sub-phases): (1) author tables for the 4 islands, which already have `scenes[]`/`verbs`/`reskin` scaffolding to extend; (2) design and build new scene structures *inside* `runHades`/`runPhaeacia`/`runIthaca` that add Dare/Abide/Give beats without deleting or fighting their existing bespoke mechanics (e.g., a Dare/Abide/Give scene could gate or modify the *existing* revival-round/gift-court/reckoning rather than replace it outright). Get explicit sign-off on what "a verb×face table for Phaeacia" even means mechanically before authoring content for it.

**Warning signs:**
A phase plan that treats all 7 stages as equal-sized content tasks; a PR that adds `actPhase()` calls into `runPhaeacia`/`runIthaca` and then finds the existing bone-throw/bow-floor logic no longer has a coherent place to live; REQUIREMENTS.md phrasing that doesn't distinguish "extend existing scene scaffolding" from "build new scene scaffolding."

**Phase to address:**
Requirements/spec phase, before roadmap phase-sizing — this should surface during phase planning as a scoping question, not get discovered mid-implementation.

---

### Pitfall 10: Silent no-op cells from face-key typos — the effect table's failure mode is invisible, not a crash

**What goes wrong:**
The bones only ever show `{1,3,4,6}` (never 2 or 5), and the resolution lookup is `table[p.commit][p.lastBone] || {}` — a missing or mistyped key (e.g., a content author writes `5` instead of `4`, or authors a table keyed `1..6` by habit) doesn't throw or warn; it silently resolves to `{}`, which is logged as "nothing stirs" — *exactly the same log text a legitimately empty cell produces* (e.g., the base `LAND_TABLE.abide[1]` is intentionally `{}`). Across ~252 authored cells (7 stages × 3 scenes × 3 verbs × 4 faces), this is the single easiest content bug to introduce and the hardest to catch by playtesting, because a broken cell and a boring-on-purpose cell look identical in the log and in-game.

**Why it happens:**
JS object property lookup on a missing key returns `undefined` rather than erroring, and the `|| {}` fallback (added originally as a safety net for genuinely-sparse tables) also silently swallows genuine authoring mistakes. Mass content authoring, likely done by copy-pasting scene blocks and editing values, is exactly the workflow most prone to a stray keystroke in an object key.

**How to avoid:**
Add a one-time (or load-time, dev-only) validation pass that walks every authored scene's `verbs`/`reskin` definitions and asserts each of `dare`/`abide`/`give` has a defined outcome for exactly the four faces `{1,3,4,6}` (for scenes using the data-table shape) or, for reskin-closure scenes, that the closure is exercised at least once for each face during a validation sweep. Fail loudly (console error or thrown exception) on any gap, rather than falling through to `{}` silently. Keep this validator as a permanent dev-mode check, not a one-off script, since balance retuning (Pitfall 7/8) will keep editing these tables after initial authoring.

**Warning signs:**
A scene where one particular verb "does nothing" on a specific roll across many seeded transcripts and nobody flagged it as odd because low-upside cells are expected to exist; log lines reading "nothing stirs" clustered suspiciously on one face value across multiple unrelated scenes (suggests a systematic keying mistake, e.g., confusing 0-indexed and face-valued arrays).

**Phase to address:**
Content-authoring phase, built as tooling *before* the 252-cell authoring pass starts (cheap to build, expensive to retrofit after the fact); re-run automatically whenever the balance/retune phase edits table values.

---

### Pitfall 11: Rare-face payoffs create de facto unreachable "good" outcomes without technically violating no-dead-end-states

**What goes wrong:**
Bone weights are `{1:0.10, 3:0.40, 4:0.40, 6:0.10}` — faces 1 and 6 are each rolled only ~10% of the time. If a content author puts a scene's "big win" narrative beat and payoff on face 6 (natural, since 6 already carries the best base-table outcomes), and a scene's mechanic requires that beat to fire a specific number of times within a fixed number of turns/players (mirroring the existing Cyclops `need`/`progress` pattern), the actual per-episode probability of the "intended" positive outcome can be low enough that most seeded playthroughs never see it — not a coded dead-end (the engine still terminates, `deadEndCheck()` still holds), but a *narrative* dead-end where the thematic payoff the author wrote for was designed around an event that essentially never happens in practice. This is the same class of problem the project's own memory note already flagged generically ("episodes barely engage because the crew is too starved to Act") but specific to authored-content probability, not just resource scarcity.

**Why it happens:**
Authoring one scene at a time in isolation, a designer reasons about "what should happen on a 6" narratively without doing the arithmetic on cumulative probability across (players × turns × scenes) for that face to appear enough times to matter, especially since there's no simulation harness this pass to surface it automatically.

**How to avoid:**
For any scene mechanic that requires a specific face to occur N times (accumulator-style, like Cyclops's `progress`/`need`), sanity-check the arithmetic against `CONFIG.boneWeights` and the number of acting players/turns available — favor designs that let *any* of the 40%-weight faces (3 or 4) contribute meaningfully, reserving 1/6 outcomes for flavor-scale bonuses/penalties rather than gating a scene's only good ending. Cross-check against the seed matrix (Pitfall 7) for whether the intended "good" beat actually appears across most seeds, not just whether the game technically terminates.

**Warning signs:**
A scene's most triumphant narration line never appears across a multi-seed transcript sweep; a scene's `progress`/`need`-style gate almost always resolves via the "failure" branch (mirroring `polyphemusHunger`'s victim-selection path) rather than the success branch.

**Phase to address:**
Content-authoring phase for initial design; verified in the balance/retune phase's seed-matrix sweep (same mechanism as Pitfall 7).

---

### Pitfall 12: Magic numbers baked into 252 reskin closures instead of `CONFIG` — the project's own stated retunability constraint quietly dies

**What goes wrong:**
`PROJECT.md` states a hard constraint: "Every tunable constant... lives in one labelled `CONFIG` object." The existing reskin closures already show early erosion of this (e.g., Cyclops's pride boast hardcodes `p.favor+=3` and `state.curse += CONFIG.boastCurse` side-by-side — one number is in `CONFIG`, a related one isn't). A 252-cell mass-authoring pass, if done as inline reskin-closure code (the path of least resistance, since that's the only precedent the shipped episodes provide), will multiply this pattern: dozens of new hand-written numeric deltas embedded directly in narration strings/closures rather than as `CONFIG` entries. The practical effect: the *next* milestone's deferred "batch-simulation numeric balance pass" (explicitly named in `PROJECT.md`'s Out of Scope as future work) becomes materially harder or impossible to do as a clean automated sweep, because the numbers it needs to tune are no longer centralized — they're scattered across ~21 scene closures as literals.

**Why it happens:**
Writing a payoff inline (`p.favor += 2`) inside a narration closure is faster and more readable in the moment than threading it through a new `CONFIG.<episode>.<scene>.<verb>.<face>` entry, and nothing enforces the constraint mechanically — it's a stated convention, not a lint rule.

**How to avoid:**
Decide, before authoring begins, on a consistent data shape for the new tables that keeps every tunable number in `CONFIG` (extending the existing per-episode `CONFIG` sub-objects, e.g., `CONFIG.helios`, `CONFIG.cyclops`) even when the narration/log text lives in a closure — the closure should *reference* `CONFIG` values, never hardcode them. If reskin closures remain the authoring mechanism (likely, given the existing precedent), require every numeric literal inside a new closure to be traced to a `CONFIG` entry in review, mirroring how `CONFIG.lotus.rations` and `CONFIG.sirens.listenFavor` are already done correctly elsewhere in the same file.

**Warning signs:**
`grep -oE '\.(favor|satchel|hold|world)\s*[+-]=\s*[0-9]' index.html` turning up numeric literals inside newly-added reskin closures instead of `CONFIG.*` references; a future balance-tuning pass needing to hunt through prose-narration closures instead of one `CONFIG` object to find the number to change.

**Phase to address:**
Content-authoring phase, as an authoring-convention decision made explicit up front (ideally with a quick grep-based check as part of phase verification) rather than discovered as debt after 252 cells are written.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|-----------------|-----------------|
| Writing new stage payoffs as inline reskin closures with hardcoded numbers (mirroring existing episodes) instead of threading everything through `CONFIG` | Faster authoring, matches existing precedent exactly | Kills the deferred batch-simulation tuning milestone's ability to sweep constants automatically; violates stated project constraint | Never — thread numbers through `CONFIG` even if narration stays in closures |
| Deleting `#log`/`state.log` in favor of on-board-only narration | Cleaner-looking board, less DOM to maintain | Loses the only debuggable/greppable artifact of unattended seeded runs, breaks the balance-tuning workflow | Never — hide/collapse it, don't delete it |
| Tuning balance against a single manually-played seed | Fast, feels conclusive after one playthrough | Re-introduces or masks the documented death-spiral / over-corrects to trivial survival, since the failure is distributional not per-run | Only for a first rough pass; must be followed by a multi-seed sweep before calling a phase done |
| Copying Sirens/Cyclops favor-on-Dare reskins as the template for new scenes | Fastest way to get 3 new scenes' worth of content written | Scales the existing violation of "Abide is the only favor path" across the whole voyage, undermining the core commons-tension value | Never without first reconciling the law violation (Pitfall 6) |
| Animating with `requestAnimationFrame` timelines gated to wall-clock duration | Smooth-feeling, familiar animation idiom | Breaks `botSpeed=0` unattended runs and can stall in backgrounded tabs | Only if every such animation is bypassable/skippable at `botSpeed=0`, never blocking state progression |
| Retrofitting Hades/Phaeacia/Ithaca's verb tables as a "content" task inside the same phase as island content | Simpler phase plan, feels uniform | Underestimates real engine-extension risk to already-working bespoke mechanics (revival, gift-court, reckoning) | Never — split into a separate, explicitly-scoped phase |

## Integration Gotchas

Here "integration" means wiring the new board/content/balance work into the existing engine seams, not third-party services.

| Integration Point | Common Mistake | Correct Approach |
|--------------------|------------------|-------------------|
| `collectCommits()` / `passGate()` (blind-commit masking) | New board renders all four player panels' pending state simultaneously "for spectacle," leaking bot/human commits pre-reveal | Board only ever renders the current gated player's private controls; public board elements (boat, bag, hold) render from `state` freely, private ones stay behind the existing gate |
| `rnd()`/`rint()`/`throwBone()` (RNG seam) | New animated dice/marble code calls RNG from inside a click handler or `requestAnimationFrame` callback to "generate the roll as it animates" | RNG stays inside synchronous reducer functions in the existing call order; animation only displays an already-computed value |
| `botPause()` (pacing seam) | New animation durations are added as separate, ungated `await sleep(...)` calls alongside `botPause()` | Route all new animation timing through the same `botSpeed` control; `botSpeed=0` must skip animations entirely |
| `table[verb][face] || {}` (effect resolution) | New authored tables have missing/mistyped face keys that silently no-op instead of erroring | Add a load-time/dev-mode validator asserting all four faces `{1,3,4,6}` are defined for every verb of every authored scene |
| `actPhase()` (verb/scene loop) | Assuming Hades/Phaeacia/Ithaca can be content-authored the same way as islands, when they don't call `actPhase()` at all today | Scope anchor "content" as an engine-extension task; design how new Dare/Abide/Give beats coexist with existing bespoke mechanics before authoring |
| `state.log` (transcript) | Treating the log as UI to be replaced rather than a data/debug layer to be preserved and given a second (board) renderer | Keep `log()`/`logBeat()`/`flavor()` and `state.log` untouched; board consumes the same event stream, doesn't replace its source |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|-----------------|
| Full board re-render (redrawing boat/bag/dice DOM or canvas from scratch) on every state mutation instead of diffing like `renderLog` already does | Visible flicker/jank during rapid unattended play; CPU usage climbs over a long voyage | Mirror `renderLog`'s append/diff discipline for any new frequently-updated board element (bag marble count, log strip) | Noticeable once a full voyage (8 beats × several crossings × 3 scenes) runs at `botSpeed=0` — dozens of full-board redraws per second |
| Unbounded animation queue when state changes faster than animation duration (e.g., `botSpeed=0` full-auto run firing state updates faster than a fixed-duration marble/boat animation can play) | Animations pile up and play back long after the game has logically ended; UI appears "stuck" replaying a finished game | Skip/collapse queued animations when `botSpeed=0`, or cap the animation queue and snap to final state if it grows past a small threshold | Any full-auto (`humans=0`) run, immediately |
| Growing the effect-table authoring as 252 individual reskin closures inline in the already-1185-line file | Editor slowdown, painful diffs/reviews, hard to spot the one broken cell among hundreds | Consider a clearly-delimited, consistently-shaped data block per episode (even if still inline in the single file) rather than ad hoc closures per scene; keep narration strings short and data-first | Becomes painful well before 252 cells — likely by the second or third fully-authored island |

## Security Mistakes

Not a networked app, so classic OWASP concerns don't apply — the domain-specific "security" surface here is information-integrity (blind-commit) and reproducibility (seed) guarantees.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Board exposes bot/opposing-player commit state before reveal via any visible affordance (disabled buttons reflecting hidden resource state, hover previews, debug toggles left in shipped build) | Breaks the core "blind commit" mechanic that the game's tension depends on; a debug "show bot hand" toggle shipping ungated is the classic version of this | Gate every debug/dev affordance behind `directorMode` (or a build-time flag), and explicitly test masked multi-human play as UAT, not just director mode |
| A refactor makes RNG call order/count depend on animation or event timing | Breaks `?seed=` reproducibility silently — a "security" issue for this project in the sense that it invalidates the entire reproducible-playtest contract | Keep RNG calls synchronous and inside reducers only (see Pitfall 5); add a seed-parity smoke test comparing two `botSpeed` values |
| `?seed=` value or full game state gets exposed/loggable in a way that lets a human player peek at future outcomes mid-game (e.g., a debug panel showing the full crossing bag composition including undrawn marbles) | Undermines fairness for human players even though it's a purely local/hotseat game | Keep any full-state debug view behind `directorMode`, same as today; never surface "what's still in the bag" beyond current counts to players mid-crossing |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-------------------|
| Board shows the boat/bag/dice as pure spectacle disconnected from the numbers that actually matter (hold, favor, satchel) | Players lose track of the resource pressure that drives the commons tension — the core value stops being *felt* even if it's mechanically firing | Keep the existing `.strip`/`.p .res` numeric readouts (hold, favor, satchel, world/doom track) alongside the new visual elements — the board should surface these more vividly, not replace them with abstraction |
| Animation pacing tuned for a human audience gets applied uniformly to bots too, making 3-4-bot games slow and tedious to watch | Playtesters (including designers doing balance passes) burn time watching bot animations they don't need | Keep bot moves near-instant by default (as `botSpeed` already allows) even with new board visuals; don't force a minimum animation duration on bot turns |
| Thematic per-stage narration drifts in tone/length/voice across 21 authored scenes (7 stages × 3 scenes) | The felt experience the milestone is chasing ("every scene carries its story's moral") reads as inconsistent instead of cohesive | Write a short style guide (tense, length, whether verbs are labeled narratively per scene, as `verbs.dare.label` already allows) before the 252-cell authoring pass, and spot-check a sample across all 7 stages together, not scene-by-scene |
| A scene defines custom `verbs.dare.label`/`verbs.abide.label` but forgets `verbs.give.label`, silently falling back to the generic `'Give — move a 🍖 into the hold'` text | One verb in an otherwise-thematic scene reads as generic/out-of-voice, easy to miss since it doesn't error | Validator (same one from Pitfall 10) also asserts all three verb labels are defined whenever a scene defines any custom labels |

## "Looks Done But Isn't" Checklist

- [ ] **Board replacing the log:** Often missing a retained, greppable transcript — verify `state.log`/`window.state` (or an export/download affordance) still exists and a `?seed=…&auto=1&humans=0` run still produces a full text record after the board ships.
- [ ] **Blind-commit masking on the new board:** Often only tested in `directorMode` (which never masked anything) — verify with `humans>=2` and `directorMode:false` that no player-panel ever shows another player's pending verb/dice before reveal.
- [ ] **Seed reproducibility after board work:** Often assumed to still hold because "the logic didn't change" — verify by diffing full transcripts of the same seed at two different `botSpeed` values (and ideally headless vs. focused tab).
- [ ] **Effect table completeness:** Often has silent gaps (missing face keys resolving to `{}`) that look identical to intentionally-empty cells — verify with an automated per-scene, per-verb, per-face coverage check, not manual read-through.
- [ ] **Favor-law compliance (Abide-only favor path):** Often assumed true because it's now stated in `PROJECT.md`, without checking it against what's actually shipped — verify by grepping every reskin/table for `favor` deltas and confirming each is on an `abide` cell (or an explicitly documented exception).
- [ ] **Balance retune verified across seeds:** Often "verified" by one satisfying playtest — verify against a fixed multi-seed matrix checking for both death-spiral and trivial-survival signatures in the transcripts.
- [ ] **Hades/Phaeacia/Ithaca "tables":** Often planned as a content task alongside islands — verify the phase plan explicitly scopes the engine work needed to give these anchors a verb/face structure at all, distinct from the islands' content-only work.
- [ ] **CONFIG retunability preserved:** Often erodes silently as narration closures grow — verify with a grep sweep that new numeric deltas trace back to `CONFIG` entries, not inline literals.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|----------------|------------------|
| Board leaks blind-commit info via a "show everything" layout | MEDIUM | Isolate the private-vs-public zone split (Pitfall 2) as a follow-up patch; re-run masked multi-human UAT before re-shipping |
| Log deleted, transcript debugging lost | LOW–MEDIUM | Re-instrument `log()`/`state.log` calls (they likely still exist under the hood if the reducers weren't rewritten) and re-expose via a hidden/collapsible panel or console access; no data model change needed if reducers were preserved |
| Seed reproducibility silently broken by an animation/RNG coupling regression | MEDIUM–HIGH | Bisect via the seed-parity smoke test (compare `botSpeed` values) to find the offending RNG call site; move it back into the synchronous reducer path |
| Death-spiral or trivial-survival re-introduced by hand-tuned payoffs | MEDIUM | Re-run the seed matrix, identify which stage(s) skew the aggregate (Pitfall 8's cross-episode sum check), adjust the smallest number of `CONFIG` entries needed rather than re-authoring narration |
| Favor-law violation propagated across new content | MEDIUM–HIGH (touches many cells) | Grep all reskins for `favor +=`/`favor -=` on non-`abide` cells, triage each as "intentional documented exception" or "bug," fix the bugs — cheaper the earlier it's caught (Pitfall 6) |
| Anchors (Hades/Phaeacia/Ithaca) content-authored in a way that breaks existing revival/gift-court/reckoning logic | HIGH | Likely requires re-deriving the intended scene structure for that anchor from scratch with explicit design sign-off, since the bespoke mechanics and new verb-table mechanics were conflated rather than composed |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|-------------------|----------------|
| Board becomes source of truth (state/render divergence) | Board-architecture phase | Marble/boat/dice visuals always match `state` after a paused unattended run; no board-local field survives a fresh `render()` call |
| Blind-commit leaked via board layout | Board-architecture phase | Masked multi-human (`humans>=2`, `directorMode:false`) UAT: no panel shows another player's pending choice pre-reveal |
| Log replaced instead of supplemented | Board-architecture phase | `?seed=…&auto=1&humans=0` still produces a full text transcript after the board ships |
| Animation timing breaks unattended `botSpeed=0` runs | Board-architecture phase | Timed `?auto=1&speed=0` run before/after the board lands shows no meaningful slowdown; background-tab run doesn't hang |
| RNG order coupled to UI/animation timing | Board-architecture phase (contract at design time); re-verified every later phase | Seed-parity smoke test: same seed at two `botSpeed` values produces byte-identical transcripts |
| Favor-only-via-Abide law already violated, scaled by new content | Content-authoring phase (first task) | Grep sweep: every `favor` delta traces to an `abide` cell or a documented exception |
| Death-spiral / trivial-survival reintroduced by hand-tuning | Balance/retune phase | Multi-seed transcript sweep checks both failure signatures; some seed reaches Ithaca with favor > bow floor and at least one seed produces a real death/starvation scare |
| Favor becomes a dominated/ignorable resource | Balance/retune phase (after all stages authored) | Cross-episode favor-sum reconciliation against `charonToll`/`bowFloor`; final-reckoning favor totals show real spread across seeds/players |
| Hades/Phaeacia/Ithaca mistaken for a content-only task | Requirements/spec phase, before phase sizing | Phase plan explicitly separates "extend existing scene scaffolding" (islands) from "design new scene scaffolding" (anchors) |
| Silent no-op cells from face-key typos | Content-authoring phase (tooling built first) | Automated validator asserts all four faces defined for every verb of every scene; re-run after any table edit |
| Rare-face payoffs create de facto unreachable good outcomes | Content-authoring phase (design); Balance/retune phase (verification) | Seed-matrix sweep confirms intended "good" narration beats actually appear across most seeds, not just technically-reachable |
| CONFIG retunability erodes via inline magic numbers | Content-authoring phase (convention set up front) | Grep sweep confirms new numeric deltas trace to `CONFIG` entries, not literals inside closures |

## Sources

- Direct read of the shipped engine: `/Users/wyattroy/Documents/Projects/Odyssey-crew/.claude/worktrees/gsd-new-milestone-acf812/index.html` (all line references above are drawn from this file as of the current commit) — RNG seam (`makeRng`/`rnd`/`rint`/`throwBone`), state shape (`newState`), render functions (`render`/`renderTrack`/`renderStrip`/`renderPlayers`/`renderLog`), masking (`collectCommits`/`passGate`/`askHuman`/`botDecide`), effect tables (`LAND_TABLE`/`SEA_TABLE`), episode reskins (`sirensReskin`, Cyclops `prideSubCommit`/`stakeCheck`, Helios `mkHeliosDare`, Lotus `lotusEat`/`lotusRescue`), anchor reducers (`runHades`/`runPhaeacia`/`runIthaca`), and the safety net (`deadEndCheck`/`finishGame`).
- `/Users/wyattroy/Documents/Projects/Odyssey-crew/.claude/worktrees/gsd-new-milestone-acf812/.planning/PROJECT.md` — core value (commons tension), stated design law (Dare/Abide/Give asymmetry, Abide-only favor path), constraints (determinism, retunability, CONFIG-only tunables), and v1.1 target features.
- Project memory: `odyssey-crew-playtest-balance` — first documented full-auto seeded playtest finding (death-spiral at default constants, `deadEndCheck` auto-Charon draining favor to zero, Ithaca finale not engaging) — the concrete precedent this document's balance-related pitfalls (7, 8) are grounded in.
- General game-engineering and software-engineering domain knowledge applied to the above (not vendor/library-specific): the standard "render as a pure projection of state, never a second source of truth" pattern for interactive simulations; the standard "RNG calls must stay inside deterministic logic, never inside UI/animation event handlers" pattern for seeded/replayable simulations; standard risks of single-file growth and data/logic entanglement in mass content-authoring passes.

---
*Pitfalls research for: Odyssey Crew v1.1 (interactive board + mass thematic content authoring + hand-tuned balance)*
*Researched: 2026-07-25*
