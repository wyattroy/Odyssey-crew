# Feature Research: Odyssey Crew v1.1 — Themed Episodes & Interactive Board

**Domain:** Subsequent-milestone feature work on a shipped single-file, hotseat, digital+physical hybrid tabletop prototype (narrative-choice + push-your-luck commons game)
**Researched:** 2026-07-25
**Confidence:** MEDIUM overall — codebase findings are HIGH confidence (read directly from `index.html`); general digital-boardgame-UI and narrative-consequence-design patterns are well-established genre knowledge but web corroboration returned only generic/LOW-confidence sources (see Sources). Treat the codebase-specific findings (conflicts, dependencies, existing hooks) as the most load-bearing part of this document.

## Codebase-Grounded Context (read before the tables)

The milestone description asks for two things layered on a **rules-complete, already-playable** prototype:

1. **Interactive board** replacing `#log` as the primary surface — but `#track` (journey), `#strip` (hold/crossing-bag/world-track), `#players` (status), and click-to-act buttons **already exist and already work**. This is much closer to "upgrade an existing board" than "build a board from nothing."
2. **Thematic per-scene effect tables** — the *engineering hook* for this already exists: every island scene supports a `scene.reskin = {dare, abide, give}` object of `(p, bone) => narration` functions (see `mkHeliosDare`, `sirensReskin`, `lotusEat/lotusRescue`, Cyclops's three reskin sets). Today only **some** verbs in **some** scenes use it — most `abide`/`give` calls, and all of `SEA_TABLE`, still fall through to the generic `LAND_TABLE`/`SEA_TABLE` defaults with generic narration (`"${name} abides 🎲${b} → ${applied}"`). The milestone work is primarily **authoring content into an existing seam**, not inventing new architecture — with one important exception (see anchors, below).

Two concrete conflicts with the milestone's own locked design principle were found in the current code and should be flagged for requirements/planning:

- **Sirens breaks "Abide is the only favor path."** `sirensReskin().dare` currently grants favor via `CONFIG.sirens.listenFavor` (listening = personal glory), while `abide` (staying bound) grants nothing. The v1.1 principle says favor must move only through Abide. This is a required retune, not just a narration pass — recommend moving the favor grant to Abide ("enduring the binding is obedience to the god-sanctioned plan") and reframing Dare/listening as risk-with-no-mechanical-favor (or a hold/crew cost).
- **Lotus breaks the same rule.** `lotusRescue` (triggered by **Dare**) grants the rescuer `+1` favor; no Lotus verb currently touches favor via Abide at all. Recommend adding an Abide-6 "you alone keep Ithaca in your mind — the gods note your discipline" (+favor) beat, and reconsidering whether the rescue-favor grant should move to Give (helping a struck mate at cost to yourself, riskless-but-costly) to stay inside the locked grammar.

**Anchors are not structurally uniform with the islands.** Hades, Phaeacia, and Ithaca do **not** run through the verb+bone `actPhase()` at all today:
- Hades has two binary choices (pay Charon / stay dead; pay Orpheus for another / let them lie) — no dice, no 1/3/4/6 faces.
- Phaeacia has **no player verb choice whatsoever** — Scene 2 is an automatic bone-pool throw sized by accumulated favor.
- Ithaca mixes one loose verb-like binary (Scene 1: endure≈abide / reveal≈dare, no Give equivalent), one pure sort/gate (Scene 2, no choice), and one automatic bone-throw (Scene 3).

Literally satisfying "each verb × each roll (1/3/4/6) gets a beat" for these three anchors would mean **retrofitting a new choice mechanic onto validated v1.0 systems** (Hades revival, the gift-reckoning, the bow contest) — a materially bigger and riskier lift than authoring text into an existing seam, and it risks regressing mechanics already marked `Validated` in `PROJECT.md`. See the Anti-Features and Anchors sections below for the recommended scoped alternative (author tuned narration for each anchor's *existing* outcomes rather than inventing new bone-roll steps).

---

## Feature Landscape

### A. Interactive Game Board

#### Table Stakes (a digital adaptation of a physical board game is broken without these)

| Feature | Why Expected | Complexity | Dependency / Notes |
|---------|--------------|------------|---------------------|
| Visible randomizer state (marble-bag blue/white composition, visibly draining) | The entire crossing tension IS the shrinking bag — hiding it defeats the mechanic's purpose, same reason physical dice/bags are never hidden in a boardgame | LOW–MED | `state.crossing.bag` array and `renderStrip()`'s `🔵×N ⚪×N` readout already exist; work is presentation (marbles as discrete icons that visibly disappear on `drawMarble()`), not new state |
| Dice/bone roll feedback, live and per-player | Table-stakes for any resolution mechanic borrowed from physical dice — players must see the number land, not just read a result | LOW | `p.lastBone` / `p._boneShow` already populate and render as `🎲 X`; needs a "moment" (brief reveal/flip) around the existing sequential reveal loop in `actPhase()`, which is already turn-by-turn |
| Journey/track visualization (route, current position, revealed vs. face-down islands) | Core "board" experience of a linear voyage game | LOW | `#track` / `renderTrack()` already implemented and already the closest thing to a "board" in v1.0 — v1.1 mostly needs a boat/position marker and visual framing, not new logic |
| Turn/verb affordances (clickable Dare/Abide/Give, disabled states, labels reskinned per scene) | Baseline interactivity for a choice-driven game | LOW | Already shipped via `promptButtons()` / `askHuman()`; scene-specific verb labels already flow through `scene.verbs` |
| Per-player status (satchel, favor, alive/starving/dead, acting/committing) | Players need to track their own and others' state at a glance, as they would on a physical player-board | LOW | Already shipped via `renderPlayers()`; visual polish only |
| Narration surfaced ON the board, not buried in a separate scroll log | Milestone's explicit ask — a player shouldn't have to hunt a scrollback to know what just happened to them | MED | Requires relocating/duplicating narration near the actor (e.g. a toast/beat line anchored to the acting player's panel or a "current beat" strip) sourced from the same `log()` calls — data model unchanged, only the render target changes |
| Explicit "at sea" vs. "on island" board state (a boat that visibly is or isn't crossing) | Most literal reading of "boat crossing the sea" in the milestone; currently only inferable from `state.crossing.atSea` + log text | MED | New: needs a visual boat token/position distinct from the track-beat markers already in `#track` |

#### Differentiators (raise the ceiling, not required to be functional)

| Feature | Value Proposition | Complexity | Notes |
|---------|--------------------|------------|-------|
| Animated boat crossing with visible progress as the bag drains | Makes the marble-draw tension physically legible turn-to-turn, not just numerically | MED | CSS transform/transition on a boat element keyed to `bag.length` or draws-so-far; no physics needed |
| Marble bag as actual bag art (SVG/CSS) with individual marbles popping on draw | Strongest "digital board that feels physical" signal; reinforces that marbles are a finite, shrinking resource | MED | Pure CSS/SVG, stays inside vanilla-JS/no-library constraint |
| Threat/doom meter visualized as a rising gauge (Helios wrath, Sirens rocks, Poseidon's curse) instead of a bare number | Makes the "sum of private choices → collective doom" tension viscerally readable, which is the game's stated Core Value | LOW–MED | `state.world` / `state.curse` already numeric and already rendered in `renderStrip()` — swap number-in-a-box for a fill-bar |
| Sequential bone "reveal" beat (thrown together, flipped one at a time) matching existing reveal order in `actPhase()` | Reinforces the blind-commit → simultaneous-resolve tension already in the design | LOW | Purely presentational wrapper around existing per-player reveal loop |
| Large-touch-target, single-shared-screen layout for pass-and-play | PROJECT.md frames this as "digital+physical" hybrid — the board is meant to sit on a real table with a real device passed around | LOW–MED | Mostly CSS sizing/layout work on top of existing `passGate()` masking flow |
| Collapsible detailed log retained alongside the board | Keeps the existing, working v1.0 log for players/designers who want the full text trail (e.g. for playtest note-taking) while the board becomes primary | LOW | Additive — don't delete `#log`, demote it to a secondary/expandable pane |

#### Anti-Features (would over-scope a playtest instrument)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|----------------|------------------|-------------|
| Canvas/WebGL rendering engine | "Makes it feel like a real game" | Contradicts the project's vanilla-JS/no-library/no-build constraint in spirit; large custom-engine surface area in a file explicitly meant to stay readable and heavily edited | CSS/DOM board with transitions/keyframes inside the existing `render()` architecture |
| Physics-based 3D dice tumbling | "Feels more like real dice" | High complexity for a 2D-icon game; the bones aren't 1–6 d6s, they're weighted 1/3/4/6 astragaloi — a literal 3D die misrepresents the mechanic | Simple 2D flip/reveal on the existing `p.lastBone` value |
| Sound design / music | "Immersion" | Explicitly out of scope in `PROJECT.md` ("Polished production art / sound — emoji + CSS only; this is a rules-complete first playtest build, not a product") | Skip entirely |
| Drag-and-drop marble/token manipulation | "Feels tactile" | No gameplay reason — marbles are drawn by `rng()`, never chosen by a player; implies false agency over the draw | Click-only Dare/Abide/Give affordances; animate the draw automatically |
| Save/replay/undo | "Let me review or redo a turn" | Explicitly out of scope (no storage; reload = fresh game); undo also breaks blind-commit secrecy (you could peek then rewind) | The retained log is the review tool; `?seed=` reproduces a whole game for post-hoc review |
| Networked/remote multiplayer | "Play with friends remotely" | Explicitly out of scope (hotseat only, no network, blind commit simulated locally) | Keep hotseat pass-and-play; `passGate()` already solves in-person secrecy |
| Full accessibility/localization pass (screen readers, i18n) | "Polish" | Real, legitimate work, but not this milestone's goal — a playtest instrument for a rules-complete first build, not a shipping product | Note as a documented future consideration; don't build now |
| Per-player private devices / split-screen | "True secrecy for blind commit" | Implies multi-device or network infrastructure explicitly precluded | Keep the existing single-device pass-the-device `passGate()` pattern, reskin visually only |

---

### B. Thematic Effect System (per-scene, per-verb, per-roll)

#### Table Stakes

| Feature | Why Expected | Complexity | Dependency / Notes |
|---------|---------------|------------|---------------------|
| One authored, deterministic one-sentence narration line per verb × face, for every scene | Milestone's explicit ask; without it the story is generic and the "moral" doesn't differentiate between islands | MED–HIGH (content volume, not engineering) | Extends the existing `scene.reskin` pattern already proven by Helios/Cyclops/Sirens/Lotus — the hook exists; this is authoring, ~12 combos/scene × 3 scenes/island × 4 islands ≈ 144 lines, plus anchor outcomes |
| Payoff asymmetry that matches the locked design principle (Dare = risk self+crew+favor for high upside; Abide = riskless, low upside, often lethal if exclusive, the *only* favor path; Give = riskless, crew-sustaining, never touches favor) | This asymmetry IS the game's Core Value — the commons tension only "fires" if the numbers genuinely encode it | MED | `LAND_TABLE`/`SEA_TABLE` generic defaults already model this shape correctly; per-scene reskins must **preserve** it — audit found Sirens and Lotus currently **violate** it (see Codebase-Grounded Context above) and need retuning, not just re-skinning |
| Consolidated, retunable per-episode effect config (not magic numbers inline in closures) | Project constraint: "every tunable constant lives in one labelled CONFIG object" | LOW–MED | Current reskins mix logic and constants inline (e.g. Cyclops's `stakeThreshold` math); recommend an explicit per-episode `effects` table (verb → face → {delta, text}) so hand-tuning doesn't require reading closures |
| An explicit "what happens if you only ever Abide" failure state per island | Milestone's stated design principle, with a concrete worked example (Cyclops: "stuck in the cave eating cheese until you're eaten") | MED | Cyclops already has this structurally via `polyphemusHunger()` (no progress → someone is eaten); Helios/Sirens/Lotus need the equivalent property authored/verified — see per-scene guidance below, some islands express this as a *social* rather than *personal* lethality |
| Determinism preserved — no extra `rng()`/`pick()` calls used only to vary flavor text | Build spec + `PROJECT.md`: single `rng()` seam, `?seed=` must reproduce an identical game | LOW | Each verb × face maps to exactly one static authored line via lookup; never randomize text choice |
| Balance validated against the known death-spiral finding | Prior playtest (`?seed=alpha`, full-auto) found the hold drains to 0 early and the game death-spirals at default `CONFIG`; `PROJECT.md` explicitly names this pass as the fix ("Effects-as-balance ... the death-spiral goes away") | MED | This is not purely a narrative pass — re-running a seeded full-auto game after retuning and confirming hold survives to Ithaca with players clearing the favor floor is an acceptance criterion, not a nice-to-have |

#### Differentiators

| Feature | Value Proposition | Complexity | Notes |
|---------|---------------------|------------|-------|
| Per-scene escalation within an episode (3 scenes read as an arc: temptation introduced → temptation under pressure → temptation at the brink) | Deepens myth-fidelity and makes replays across islands feel distinct in *shape*, not just flavor text | LOW–MED | Helios already has this shape (Meadow → Hunger → Reckoning); extend the pattern explicitly when authoring Cyclops/Sirens/Lotus |
| Distinct "locus of consequence" per island, matching its myth (Helios's wrath is collective/world-track; Sirens' glory is personal/individual even though doom is collective; Cyclops has no favor track at all — survival, not favor, is the only stake) | Reinforces that each island teaches a different facet of the same commons tension rather than repeating one lesson four times | LOW | Purely a design/authoring lens, no new mechanics |
| A short authored "moral" line at each island's `onDepart` naming the theme explicitly | Gives players (and playtesters coding notes) a clean signal of what the island was "about," useful for tuning/debrief | LOW | `Helios.onDepart` already gestures at this ("Helios blesses restraint..."); make it consistent across all four islands |
| Give's narration consistently framed as *xenia* (sacred hospitality) across all 7 stages | Ties every Give action back to `PROJECT.md`'s own poetic frame ("generosity = sacred hospitality"); currently Give narration is mechanical/generic | LOW | Text-only change, reinforces thematic coherence without new mechanics |

#### Anti-Features

| Feature | Why Requested | Why Problematic | Alternative |
|---------|----------------|------------------|-------------|
| Branching dialogue / free player-authored text | "Let players write their own story" | Breaks the single-sitting, rules-complete playtest scope; adds input UI with no persistence (no storage); dilutes the hand-tuned moral-payoff design the milestone is asking for | The one-line-per-outcome table already gives narrative texture without branching |
| Randomized flavor-text *variants* per outcome (e.g. 3 possible lines for Dare-6) | "Reduces repetition on replay" | Extra `rng()` calls risk breaking `?seed=` determinism, and multiplies authoring burden for a single ~60–90 min sitting where repetition isn't actually a felt problem | One authored line per verb × face is sufficient at this scope |
| Cross-scene narrative memory/callbacks (Scene 1's Dare changes Scene 3's flavor text) | "Make it feel more reactive" | New coupling between text and evolving state beyond what already exists mechanically (drunk counter, progress counter, curse); real risk of narration/mechanics desync; the design is explicitly locked against new tracks | Let flavor stay coupled to the *same* scene's roll/verb outcome; let existing mechanical state (world/curse/drunk) carry cross-scene consequence, as it already does |
| A new "morality"/alignment score distinct from favor | "Reward moral choices more visibly" | A new currency — explicitly out of scope ("no new verbs, currencies, or tracks beyond the three verbs / two currencies / one world-track-per-episode") | Favor already *is* the moral signal; don't duplicate it |
| Literally retrofitting Hades/Phaeacia/Ithaca onto the same verb×bone-face grammar the islands use | "Consistency across all 7 stages" | These three anchors are `Validated` v1.0 mechanics (Charon/Orpheus revival, gift-reckoning bone-pool, patience/bow/reckoning) whose choice structures don't map 1:1 onto a 4-face bone table today — forcing it risks regressing working, already-tested systems for a purely presentational goal, and Phaeacia's Scene 2 has *no* player verb choice at all currently | Author tuned narration for each anchor's *existing* outcomes (see Anchors guidance below) instead of inventing new bone-roll steps |

---

## Feature Dependencies

```
[Board: visible randomizer state]
    └──reuses──> state.crossing.bag (already exists, v1.0)

[Board: dice/bone reveal]
    └──reuses──> p.lastBone / p._boneShow (already exists, v1.0)

[Board: on-board narration]
    └──requires──> a render target near the actor (new: toast/beat-line UI)
                       └──sources from──> existing log() calls (data unchanged)

[Board: boat / at-sea vs on-island state]
    └──requires──> new visual state derived from state.crossing.atSea (already exists) + state.onIsland (already exists)

[Thematic tables: per-scene per-verb per-face narration]
    └──requires──> scene.reskin seam (already exists, proven by Helios/Cyclops/Sirens/Lotus)
    └──requires──> retuning Sirens + Lotus to stop violating "Abide is the only favor path"
                       └──blocks──> "payoff asymmetry" table-stakes item being TRUE game-wide

[Thematic tables: anchors (Hades/Phaeacia/Ithaca)]
    └──conflicts with──> literal verb×4-face retrofit (would touch Validated mechanics)
    └──alternative path──> author narration for each anchor's EXISTING binary/pool outcomes (no new mechanic)

[Effects-as-balance retune]
    └──requires──> thematic per-scene tables to exist (they ARE the new balance numbers)
    └──validates against──> known death-spiral finding (prior seeded playtest)

[Board: threat/doom gauge visualization]
    └──enhances──> thematic effect system's "collective doom" legibility (Helios wrath, Sirens rocks, curse)
```

### Dependency Notes

- **On-board narration requires no new state, only a new render target.** All narration already flows through a single `log()` call site — moving *where* it's displayed doesn't require touching the game logic, phases, or `CONFIG`.
- **Thematic tables and the balance retune are the same piece of work, not two.** `PROJECT.md` states the per-stage hand-tuned numbers *are* the intended economy replacing the default `[tune]` constants — authoring narration without also re-deriving the deltas would leave the death-spiral in place.
- **The Sirens/Lotus favor-path conflicts block a game-wide truth claim.** Until fixed, "Abide is the only favor path" is not actually true of the shipped game — this should be resolved before or during the thematic-table authoring pass, not left for a later milestone, since it's foundational to the commons tension the whole milestone exists to make "felt."
- **Anchor retrofitting conflicts with preserving Validated mechanics.** Recommend explicitly scoping REQUIREMENTS to "author tuned narration for anchors' existing outcomes" rather than "give anchors verb×face tables," to avoid an unplanned architecture change mid-milestone.

---

## MVP Definition

### Launch With (v1.1 must-have)

- [ ] Marble-bag made visual (discrete blue/white icons that visibly disappear as `drawMarble()` runs) — the single highest-value "make it a board" change
- [ ] Bone/dice roll made visual (reveal moment around the existing per-player sequential reveal in `actPhase()`)
- [ ] On-board narration (current-beat text surfaced near the acting player or in a dedicated "what just happened" strip), log retained as secondary/collapsible detail
- [ ] Explicit at-sea vs. on-island board state (boat token/position) extending the existing `#track`
- [ ] Full verb × face narration table authored for all 4 islands (12 scenes total), replacing generic `LAND_TABLE`/`SEA_TABLE` fallback text within those scenes
- [ ] Per-scene effect deltas hand-tuned as the new balance numbers (this is the "effects-as-balance" requirement — not narration alone)
- [ ] Sirens and Lotus retuned so favor only moves via Abide, closing the audit-found conflicts
- [ ] Authored narration (not a new bone-table) for Hades/Phaeacia/Ithaca's existing choice points
- [ ] Re-run of a seeded full-auto game to confirm the death-spiral finding no longer reproduces

### Add After Validation (v1.x)

- [ ] Threat/doom gauge visualization (rising-tide style meter for world/curse tracks) — valuable but the numeric version already exists and functions
- [ ] Marble-bag/board art polish (SVG bag, boat animation easing)
- [ ] Toggleable verbosity in the on-board narration for playtesters who want more/less detail

### Future Consideration (v2+)

- [ ] Accessibility/localization pass
- [ ] Any physical-companion artifact (printable board, app-assisted physical play)
- [ ] Sound

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|----------------------|----------|
| Visible marble bag (icons + draining) | HIGH | LOW–MED | P1 |
| Visual dice/bone reveal | HIGH | LOW | P1 |
| On-board narration | HIGH | MED | P1 |
| Boat / at-sea state | MED | MED | P1 |
| Per-island verb×face narration + retuned deltas | HIGH | MED–HIGH | P1 |
| Sirens/Lotus favor-path conflict fix | HIGH (blocks core value) | LOW–MED | P1 |
| Anchor narration (Hades/Phaeacia/Ithaca outcomes) | MED | MED | P1 |
| Death-spiral re-validation via seeded run | HIGH | LOW (test, not build) | P1 |
| Threat/doom gauge visualization | MED | MED | P2 |
| Board/marble art polish | MED | MED | P2 |
| Collapsible log detail pane | LOW–MED | LOW | P2 |
| Cross-episode moral-arc consistency pass | LOW–MED | LOW | P2 |
| Accessibility/localization | LOW (for this milestone) | HIGH | P3 |
| Sound / physical companion | LOW (for this milestone) | HIGH | P3 |

**Priority key:** P1 = must have for v1.1 to satisfy its own stated goal ("turn the rules-complete prototype into a *felt* game"); P2 = should have, add once P1 is stable; P3 = explicitly deferred per `PROJECT.md` Out of Scope.

---

## Concrete Thematic Guidance — What Each of the 7 Scenes Must Express

For each stage: its myth-source moral, how Dare/Abide/Give should carry it, what "pure Abide" produces, and what's already implemented vs. still needs authoring.

### 1. Helios — Cattle of the Sun
**Moral:** restraint under a divine prohibition; hunger overriding an oath brings collective ruin.
**Already implemented:** `mkHeliosDare` (dare risks the world-track on face 1, escalates hold/self gain on higher faces); `onDepart` collective bless/doom by aggregate `world`.
**Needs authoring:**
- **Dare** — kill a cow: low faces = caught (self/crew/favor loss, world+1, per milestone's own worked example — "kill a cow, share it — Helios FURIOUS"); high faces = clean kill, big personal/hold payoff, no immediate detection ("kill a cow unseen, stash +2 hold +4" per milestone example).
- **Abide** — do essentially nothing individually (this is the point): only face 6 = a small mercy ("find dandelions, fill your belly" +1 stash per milestone example); faces 1/3/4 = no effect.
- **Give** — feed the hold from your own satchel; riskless, sustains crew, never touches favor or the world-track.
**Pure-abide property:** Helios is the one island where full-crew Abide is *rewarded*, not lethal — the `blessAt` threshold pays everyone if the world-track stays low. This is intentional: it's the clearest expression of the game's Core Value (cooperate-to-win vs. defect-to-survive) — a single Dare by one player can doom everyone, including the pious.

### 2. Cyclops — Polyphemus's Cave
**Moral:** cunning and patience beat brute force; pride (the boast) undoes the escape's safety.
**Already implemented:** three-scene structure (Wine/Stake/Sheep) with distinct reskins per verb; `polyphemusHunger()` already enforces "no progress → someone is eaten" — this **is** the milestone's own literal example ("stuck in the cave... until you're eaten").
**Needs authoring:** per-face texture within Abide (currently just "cowers," no differentiation by roll) and Dare (attack-sober-fails-below-6 already has stakes but thin flavor); Give (pour wine) needs face-based flavor variety even though its mechanical effect is currently flat (+drunk).
**Pure-abide property:** already correctly lethal via `polyphemusHunger` — if the whole crew only Abides, no wine is poured and no stake is driven, escape `progress` never advances, and someone is periodically devoured. No mechanical change needed, only narration depth.
**Note:** the Pride sub-scene (boast/hold-tongue) is a bonus binary choice outside the normal verb grammar — flag whether it needs its own effect-table treatment or stays as-is (it already reuses `dare`/`abide` semantics informally).

### 3. Sirens — The Song and the Mast
**Moral:** the wisdom of binding yourself in advance to resist a temptation you know you cannot resist in the moment; glory has a cost paid by the whole crew.
**Already implemented:** `sirensReskin` — Dare/listen grants favor scaled by roll and raises the "Rocks" world-track; Abide/bound is currently a no-op; Give/bind-a-mate reduces the world-track.
**Conflict to fix:** favor currently comes from **Dare**, not Abide — violates the locked v1.1 principle. Recommend: move the favor grant to **Abide** ("staying bound is obedience to the plan Circe/Tiresias sanctioned — the gods honor the discipline"), and reframe Dare/listening as pure risk (personal knowledge, no favor, or a hold/crew cost) so glory-seeking is tempting but no longer mechanically the favor path.
**Pure-abide property:** if reworked as above, full-crew Abide becomes the *safe, favor-earning, doom-avoiding* choice — matching Helios's "collective restraint pays" shape, but through *individual* endurance rather than a world-track threshold (Sirens' doom track should still rise if enough players Dare, so a lone defector can still doom the bound majority — preserve that commons tension).

### 4. Lotus-Eaters — The Land of Forgetting
**Moral:** the danger is comfort and forgetting, not violence — duty to return home can be lost to complacency, and it's the *crew's* job to haul each other back, not the state's.
**Already implemented:** `lotusEat` (dare = free ration, risk of being permanently "struck" unless rescued); `lotusRescue` (dare in later scenes = go back for a struck mate, currently grants the rescuer +1 favor); `onDepart` strands anyone still struck.
**Conflict to fix:** the only favor grant in this island is via **Dare** (`lotusRescue`) — also violates the locked principle. Recommend: add an Abide-6 beat ("you alone keep Ithaca in mind" +favor) for scene 1, and reconsider whether the rescue-favor grant belongs on **Give** instead ("share your ration to steady a mate", currently a separate weaker verb) so that "risking a trip back for someone" reads mechanically as Dare (risk of being struck yourself) while its reward doesn't have to be the favor currency.
**Pure-abide property:** distinct from the other islands — full-crew Abide (nobody eats, nobody gets struck) is actually the *safest possible outcome* for the island as a whole. The lethality of Abide here is **social, not personal**: Abide used specifically in the *rescue* scenes ("mind yourself" instead of going back) is what strands and kills a struck crewmate. The moral to encode: Abide is safe for *you* but can be a betrayal of the crew when someone else needs saving — this is the clearest "riskless but not blameless" reading of Abide in the whole game and worth calling out explicitly in scene hook text.

### 5. Hades — The Shore of the Dead
**Moral:** the toll of mortality; what you'll pay (in favor) to return, and what you'll spend to bring someone else back.
**Already implemented:** peek (free, via Tiresias); self-revival (pay Charon's toll or remain dead); Orpheus (a living player may pay to raise a *different* dead player).
**Scoping call:** Hades has no bone throws — "each verb × each roll" does not literally apply. Recommend authoring one line per **outcome**, not per die face:
- Pay Charon (self-focused, risking your own favor to return) — reads as a personal, Dare-adjacent choice.
- Remain dead (passive, riskless because you're already at the floor) — reads as Abide-adjacent, and is the closest thing Hades has to "pure-abide is a trap": doing nothing forever means never rejoining the voyage.
- Pay Orpheus for another (spend your own favor for someone else's return, no benefit to the payer) — reads as Give-adjacent, the clearest xenia moment in the whole game.

### 6. Phaeacia — The Gift-Reckoning
**Moral:** hospitality (*xenia*) is rewarded on its own terms; the court pays in material gifts, never in the currency of the gods' favor, because favor is not for sale.
**Already implemented:** framed correctly in the existing `flavor()` line ("the gods read the favor you already carry and pay you in gifts, never in favor") — this island is already, uniquely, the pure **Give-shaped anchor**: no favor ever moves here, matching Give's "never moves favor" rule exactly.
**Scoping call:** there is no player verb choice today (Scene 2 is an automatic bone-pool throw sized by accumulated favor). Recommend authoring flavor per **throw outcome** (moved-the-court/rolled-a-6 vs. grudging-gift) rather than inventing a new choice point — inventing one would both violate "no new tracks" in spirit and touch a Validated mechanic for a cosmetic goal.

### 7. Ithaca — The Homecoming
**Moral:** disguise and patience under insult (recognition delayed) earns standing; the finale cashes out accumulated favor as legitimacy — who "deserves" the house.
**Already implemented:** Scene 1 (endure/reveal) already uses `abide`/`dare` CSS classing informally; Scene 2 (bow) is a pure sort/gate by standing + favor floor, no per-player choice; Scene 3 (reckoning) is an automatic bone-throw contribution split.
**Scoping call:** Scene 1 already fits a two-verb (no Give) grammar cleanly — author per-outcome narration for endure vs. reveal (there's no natural "Give" analog for a solo endurance test; treat the missing third verb as an acceptable, documented exception rather than forcing one in). Scene 3's per-qualifier strike outcome (high roll vs. low roll contribution) is the other place worth a one-line-per-outcome pass.

---

## Sources

- **Codebase (HIGH confidence, primary source):** `/Users/wyattroy/Documents/Projects/Odyssey-crew/.claude/worktrees/gsd-new-milestone-acf812/index.html` — read in full; all architecture claims, existing hooks, and the two favor-path conflicts (Sirens, Lotus) are derived directly from this file.
- **Project context (HIGH confidence):** `/Users/wyattroy/Documents/Projects/Odyssey-crew/.claude/worktrees/gsd-new-milestone-acf812/.planning/PROJECT.md` — Core Value, milestone goal, constraints, Out of Scope list, Validated requirements.
- **Prior playtest memory (HIGH confidence, user's own finding):** `odyssey-crew-playtest-balance` memory note — confirms the default-`CONFIG` death-spiral this milestone's effects-as-balance work must resolve.
- [Digital tabletop game (Wikipedia)](https://en.wikipedia.org/wiki/Digital_tabletop_game) — LOW confidence, general background on digital board-game adaptation patterns (visible RNG feedback, hybrid physical/digital approaches).
- [Digital Dice Rolling: Turning Board Games into Video Games](https://meliorgames.com/game-development/digital-dice-rolling-turning-board-games-into-video-games/) — LOW confidence, generic corroboration that visible roll animation/feedback is standard practice.
- [Freedom and Consequence: The Importance of Narrative in Choice-Driven Games (Game Developer)](https://www.gamedeveloper.com/design/freedom-and-consequence-the-importance-of-narrative-in-choice-driven-games) — LOW confidence, generic corroboration for per-choice consequence communication (Telltale's "X will remember that" pattern) informing the on-board narration design.
- [Tragedy of the commons (Board Game Designers Forum)](https://www.bgdf.com/forum/game-creation/design-theory/tragedy-commons) — LOW confidence, forum discussion corroborating that commons-tension mechanics require a visibly better short-term payoff for defection than for restraint, matching this project's Dare > Abide upside asymmetry.
- [Battlestar Galactica: The Board Game (Wikipedia)](https://en.wikipedia.org/wiki/Battlestar_Galactica:_The_Board_Game) / [Pandemic (board game) (Wikipedia)](https://en.wikipedia.org/wiki/Pandemic_(board_game)) — LOW confidence, reference examples of cooperative/hidden-agenda commons-tension games; used only as genre grounding, not directly applicable mechanics.

---
*Feature research for: Odyssey Crew v1.1 — Themed Episodes & Interactive Board*
*Researched: 2026-07-25*
