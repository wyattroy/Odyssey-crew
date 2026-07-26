# Build spec: Odyssey Crew — playable HTML prototype

**Task for Claude Code.** Build a single, self-contained, playable prototype of the board game *Odyssey Crew* as **one `index.html` file**. This is a rules-complete first playtest build, not a polished product. The goal is that four people (hotseat) can play a full voyage from Troy to Ithaca and the core tensions — the hold commons, starvation, favor, the crossings, the finale reversal — all actually fire.

Read this whole file before writing code. The companion `Odyssey_Crew_Canon.md` has the full design rationale; this file has everything you need to build. Where they agree, they agree; if you find a conflict, this build spec wins for the prototype.

---

## 1. Hard constraints

- **One file**, `index.html`. All HTML, CSS, and JS inline. No build step, no bundler, no frameworks, no external network requests, no CDN. It must run by double-clicking the file in any modern browser, offline.
- **Vanilla JS only.** No React, no jQuery, no libraries.
- **No `localStorage`/`sessionStorage`** or any browser storage — keep all state in a single in-memory JS object. (A fresh reload = a fresh game.)
- **Emojis + CSS for all art.** No image files. Use emoji for ships, waves, bones, olives, cattle, etc.
- **Deterministic-testable randomness:** put all randomness behind a single `rng()` seam and support an optional `?seed=` URL param so a playtester can reproduce a game. Default to real randomness when no seed is given.
- Keep it readable: one clear game-state object, pure-ish reducer functions for each phase, and a render function that redraws from state. Favor clarity over cleverness — this will be edited a lot.

---

## 2. The game in one screen

The crew is **always 4 seats (P1–P4)**. **1 to 4 of those seats are human; the rest are automated bots.** A start screen lets the player choose how many humans (1–4) and which seats they occupy; the remaining seats are filled by bots (see §2b). The screen always shows: the **voyage track** (8 beats, current position marked), the **ship's hold** (shared ration count + a danger indicator), the **crossing bag** (marbles remaining, when at sea), **four player panels** (name, human/bot badge, satchel rations, favor/olives, alive/starving/dead status), a **log** (scrolling narration of what happened), and a **prompt area** (the current decision + buttons).

**Blind commit without a network.** At every secret-commit point, **bots commit silently and instantly**; only human seats need a masked commit. The masking rules:
- **1 human:** no masking needed — the human makes their own secret choice, bots have already committed silently, then all reveal together.
- **2–3 humans:** mask *between the humans only.* Show a "🫡 Pass to P2 — tap when ready" gate before each human's turn to commit; they reveal their own controls, choose, confirm, and it hides again before passing to the next human. Bots are not part of the pass chain.
- After all humans and bots have committed, resolve simultaneously and narrate the reveal one seat at a time (bots included), so a human never sees a bot's choice before locking their own.

Provide a **"reveal-all / director mode" toggle** that drops all masking (every human commits openly on one screen) — the fast mode for solo testing, and the sensible default while developing.

---

## 2b. Players and bots

**Setup.** On load, show a small setup panel: number of humans (1–4), optional names, and per-seat human/bot assignment (default: humans take P1…Pn, bots fill the rest). Optionally allow **0 humans (full-auto demo)** as a testing convenience — useful for the `?seed=` reproducibility runs and for watching the commons/finale fire unattended — but the requirement is that any count of 1–4 humans plays a complete game.

**A bot is a full player.** Bots occupy a normal seat, hold rations and favor, can starve, die, revive, qualify for the bow, and win. The *only* difference is that a human's decisions come from the UI and a bot's come from `botDecide(...)`. Every decision point routes through the same resolver functions; only the *source* of the choice differs. Never special-case bots inside the rules — special-case them only at the "who is choosing" seam.

**Temperament (give the table texture).** Assign each bot one of three temperaments at setup (random, or cycled so a 4-bot table has a spread). Temperament is a small weight set in `CONFIG`, not a separate code path:
- **Greedy** — free-rides the hold, Dares often, hoards satchel, tempted to Boast, likelier to reveal early at Ithaca. Models the delicious defector.
- **Balanced** — the default heuristics below, unmodified.
- **Pious** — protects the hold, Abides for favor, Gives when the crew is endangered, endures at Ithaca. Models the cooperator.

These map directly onto the game's actual strategy axis, so a table of mixed bots produces a *meaningful* playtest, not noise.

### `botDecide` — the policy per decision point

Keep each policy a short, readable function driven by state + temperament. All thresholds live in `CONFIG.bot`.

- **Troy take (1–6):** greedy takes high (5–6, buys survival), pious takes low (1–2, buys favor), balanced takes mid (3–4). Add ±1 jitter via `rng()` so games differ.
- **Eat (satchel vs hold):** the commons crux, so get this right.
  - If my satchel is empty → forced to reach the **hold**.
  - Else if the **hold is safe** (`hold >= livingCount`) → reach the **hold** to spare my satchel (greedy always does this; balanced does; pious does *unless* the hold is only just safe).
  - Else (**hold is short**, `hold < livingCount`) → eat my own **satchel** to avoid the lot — *unless* I'm greedy and gambling, or I'm down to my last satchel ration and would rather risk the hold now and save my own for later (model the "last-ration" reasoning from the design). Pious bots additionally avoid reaching a short hold so they don't cause someone else's starvation.
- **Act (dare / abide / give)** — pick by environment, episode re-skin, and temperament:
  - Never offer an illegal move (no Give with an empty satchel).
  - **Personal hunger high** (low satchel, no safe hold) → lean **Dare** (grab / fish a monster) to refill.
  - **Safe and favor-seeking** → **Abide** (the only favor road) — pious bots weight this heavily.
  - **Hold endangered and I can spare a ration** → **Give** — pious bots weight this heavily; greedy rarely.
  - **Episode overrides** (respect the scene's shape): at **Helios**, pious → Abide, greedy → Dare a cow when hungry, everyone Gives if the hold is dying; at **Cyclops**, follow the required beat (Give=wine in scene 1, Dare the stake in scene 2 when drunk enough), and the scene-3 **Boast** is a temperament gamble (greedy/proud may Boast for kleos, pious holds their tongue); at **Sirens**, greedy Dares to listen, pious Gives to bind mates; at **Lotus**, a clear-headed pious bot Dares to rescue a struck mate, greedy keeps sailing.
- **Hades — revival:** a dead bot pays **its own** toll if it has ≥1 favor (wants back in). **Orpheus:** a living bot pays to revive a dead crewmate only if it's pious (or balanced *and* the crew is short-handed, i.e. `livingCount <= 2`) and it can spare the favor without dropping below the Ithaca bow floor. Greedy bots let them lie.
- **Phaeacia:** the pool throw is automatic for everyone — bots need no policy.
- **Ithaca — patience (endure vs reveal):** bots **endure** by default (patience is almost always right). Exception: a **greedy** bot with high favor may **reveal early** (models "a lead becomes pressure," and gives humans a real opening). Bow and reckoning are computed/automatic throws — bots just participate.

Expose the whole thing so a human can also click a **"let a bot suggest my move"** hint button (optional, nice for teaching). Bots must feel like they're playing the *same* game a smart human plays — that's what makes solo play a valid test.

---

## 3. Core data model

```js
const state = {
  seed, rng,                       // randomness seam
  players: [                       // length 4
    { id, name, satchel, favor, status, // status: 'alive' | 'starving' | 'dead'
      isBot,                       // true → decisions come from botDecide(), not the UI
      temperament,                 // 'greedy' | 'balanced' | 'pious' (bots only; ignored for humans)
      commit,                      // per-phase scratch: 'satchel'|'hold' or 'dare'|'abide'|'give'
      lastBone,                    // last face thrown, for display
      islandFavorEarned }          // favor earned this island (for Cyclops "loses favor on this island")
  ],
  humanCount,                      // 1–4 (0 allowed only in full-auto demo mode)
  hold,                            // shared rations
  journey: [ /* 8 beats, islands dealt face-down at start */ ],
  beatIndex,                       // where we are on the journey
  phase,                           // state-machine tag (see §4)
  crossing: { bag, whitesAdded, atSea },  // marble bag for the current leg
  world,                           // current episode's world/anger track value
  episode,                         // active episode definition + scene index + local flags
  log: [ ... ]
};
```

Bones: `throwBone()` returns 1|3|4|6 using weights **{1:0.10, 3:0.40, 4:0.40, 6:0.10}** via `rng()`. Expose the weights as a constant.

---

## 4. The state machine

Model the whole game as an explicit phase machine. Phases:

1. `SETUP_TROY` — each player picks a **take of 1–6**; satchel += take, favor += (7 − take). Then deal the journey.
2. For each beat: a **CROSSING** (unless skipped) then the **BEAT** itself.
   - `CROSSING_DRAW` → draw a marble. Blue → `SEA_EAT` → `SEA_ACT` → back to `CROSSING_DRAW`. White → end leg → go to the beat.
   - Beats: `ISLAND` (a dealt episode, 3 scenes), `HADES`, `PHAEACIA`, `ITHACA`.
3. Each ISLAND runs `EAT` → `ACT` per scene? **No** — clarify the turn/scene relationship below.
4. `GAME_OVER` when Ithaca resolves, or when all players are dead with no favor to return.

**Turn vs. scene (important):** a *turn* = Eat then Act. At sea, every marble-draw-that-is-blue is one turn. On an island, **each of the 3 scenes is one turn** (Eat then Act, with the scene's re-skinned verbs and its collective check). So an island is 3 turns; a crossing is however many blue draws occur before the white.

**Collecting commits (the one bot seam).** Every secret-commit step uses a single helper, `collectCommits(seats, kind)`: for each seat it calls the UI (human) or `botDecide(seat, kind, state)` (bot) to produce that seat's `commit`. This is the *only* place bots differ from humans — the resolver functions downstream read `commit` and don't care where it came from. Bots resolve with no mask and a one-line log ("P3 🤖 reaches for the hold"); humans resolve via the masking rules in §2. Do the same for Troy takes, Hades revival, and Ithaca patience — always through this seam.

### The two phases every turn

**EAT (§ blind commit):** each living player commits `satchel` or `hold` (via `collectCommits`).
- Resolve: satchel-eaters lose 1 from satchel (if they have it). Hold-eaters are collected; if `count(holdReachers) <= hold`, all eat (hold -= count). Else the hold feeds `hold` of them and the remaining `count - hold` **cast lots**: each throws a bone, the **lowest face** misses the meal (break ties with a re-throw among the tied). Hold set to 0.
- A player who eats nothing this turn (missed lot, or chose satchel/hold but had 0 available) → **misses meal**: if `alive` → becomes `starving`; if already `starving` → becomes `dead` (satchel spills to 0, favor persists, move to shore of the dead).
- **Binding:** a hold-reacher who loses the lot does NOT fall back to their satchel.
- Eating anything clears `starving` back to `alive`.

**ACT:** only `alive` players act (skip `starving` and `dead`). Each commits `dare`/`abide`/`give`, all throw a bone, resolve via the active table (land table on islands/Hades/Phaeacia/Ithaca scenes; **sea table** during a crossing), then apply the episode's collective check if the scene defines one.

Apply recipients exactly: `you` = actor.satchel, `crew` = hold, `favor` = actor.favor, `world` = state.world (higher = angrier; feeds doom lines and can worsen the crossing bag).

---

## 5. Bone tables (encode as data, not if-chains)

Land Act table (per verb, per face → deltas):

```
DARE:  1:{you:-1, crew:-1, favor:-1, world:+1}   3:{you:+1}   4:{you:+2}   6:{you:+2, crew:+2}
ABIDE: 1:{}                                       3:{you:+1}   4:{you:+1, crew:+1}   6:{you:+1, crew:+1, favor:+1}
GIVE:  1:{you:-1}                                 3:{you:-1, crew:+1}   4:{you:-1, crew:+1}   6:{you:-1, crew:+1}
```

Sea Act table (fishing; Dare spends hold as bait):

```
DARE:  1:{you:-1, crew:-1, favor:-1}   3:{you:+1, crew:-1}   4:{you:+2, crew:-1}   6:{you:+2, crew:+2}
ABIDE: 1:{}                             3:{you:+1}            4:{you:+1}            6:{you:+2, crew:+1}
GIVE:  1:{you:-1}                        3:{you:-1, crew:+1}   4:{you:-1, crew:+1}   6:{you:-1, crew:+1}
```

Clamp satchel and hold at ≥ 0. Favor may go negative. A Give with an empty satchel is illegal — don't offer it. On Dare, spending bait/rations you don't have simply floors at 0 (narrate "no rations to spare — the catch is lean").

---

## 6. The crossing (marble bag)

`startCrossing()`: bag = 5 blue + 1 white, `whitesAdded = 0`, `atSea = true`. (If the previous beat granted a toll-skip, e.g. Phaeacia's gift-ride, skip the crossing entirely.)

Each `CROSSING_DRAW`: if not the first draw of this leg, add 1 white (`whitesAdded++`). Draw one marble via `rng()` weighted by current counts and remove it.
- Blue → run one sea turn (Eat, then Sea Act), then draw again.
- White → land-ho: `atSea = false`, narrate arrival, begin the beat.

World-anger effect on the sea: if `world` is high from a prior island (e.g. Poseidon's Curse after a Cyclops Boast), add extra blue marbles to new crossing bags (`extraBlue = f(world)`), making legs longer and hungrier. Expose `f` as a small tunable function.

---

## 7. Beats to implement

Implement **all 8 beat types**. For islands, implement a clean `Episode` object format and ship **four fully-worked episodes**; the game deals 4 islands from those four for now (later more can be added to the pool).

### Episode format

```js
const Episode = {
  id, title, hookText,            // read-aloud prose (flavor only, never rules)
  worldStart: 0, doomAt: null,    // optional world track + doom line
  needProgress: null,             // optional escape-progress target
  scenes: [
    { name, hook,
      // per-verb re-skin: label + optional override of deltas or a custom resolve()
      verbs: { dare:{label, ...}, abide:{label, ...}, give:{label, ...} },
      collectiveCheck: (state) => { ... } // optional: pool bones, test threshold/doom
    }, x3
  ],
  onDepart: (state) => { ... }     // resolve doom/blessing when leaving
};
```

Verbs default to the §5 tables; an episode only supplies a **label** (so the UI reads "Dare: slaughter a cow") and, where it bends, a custom effect. Keep the three verbs present every scene; if an episode wants a verb to be pure folly, keep it selectable but make its table punishing (don't remove it — its presence/absence is information the fixed layout relies on).

### Ship these four episodes (good spread of shapes)

1. **The Cattle of Helios** — world track = Helios's Wrath, `doomAt: 7`. Dare = "slaughter a cow" (standard Dare table; its `world:+1`, and on a **1** add an extra `world:+1` = *seen*). Abide = "restraint" (the favor road). Give = "feed the hold." `onDepart`: if world ≥ 7 → ship sinks (all players die but wash ashore if they can pay Hades toll later — for the prototype, mark all `dead`, then let revival handle it at the next Hades or just narrate the setback + favor loss); if herd nearly whole (world ≤ 2) → +favor to all living. This is the commons thesis — make sure it can actually sink the ship.

2. **The Cyclops** — `needProgress: 3`, local flags `drunk` and `nameGiven`. Scene 1 "The Wine": Give = "pour wine" (+1 drunk instead of feeding hold on 3/4/6); Abide = "cower"; Dare = "attack sober" (needs a 6 to make progress). Scene 2 "The Stake": collectiveCheck pools everyone who Dared — count 6s/high faces vs. a threshold scaled to drunk level; success → +progress and big favor to darers; a pooled 1 → he wakes, a sailor is devoured (dead) and loses island favor. Scene 3 "Under the Sheep + Pride": Dare (cunning) finishes progress; then a **secret Pride sub-commit** — Abide "hold your tongue" (safe) vs Dare "Boast" (+big favor now, but sets `world += BOAST_CURSE` persistently → worsens all future crossing bags). Demonstrates private-choice/collective-cost.

3. **The Sirens** — world track = "Rocks", `doomAt` = a reef threshold. Dare = "unstop your ears and listen" (+big favor, but `world:+2`); Give = "bind a mate / stopper ears" (reduce world); Abide = "be bound" (safe, nothing). `onDepart`: if Rocks ≥ threshold → ship strikes, pooled deaths; else listeners keep their glorious favor. Open, rewarded temptation.

4. **The Lotus-Eaters** — local flag per player `lotusStruck`. Scene 1: Dare = "eat the lotus" (+free rations, throw a bone; a low face → `lotusStruck`); Abide = "resist." A struck player is treated like `starving` for Act (can't act, only drifts) until freed. Scene 2: a clear-headed player Dares "go back for a mate" to free one struck player (costs rations). Scene 3 / onDepart: anyone still struck when the ship sails is **left behind = dead**; rescuers gain favor. Internal/social threat.

### Fixed anchors

- **HADES.** Revival happens here (and can be offered whenever a player is dead — but Hades is the thematic home): a dead player may **pay 1 favor** to return (`alive`, satchel 0), or a living crewmate may pay 1 of *their* favor to revive them (**Orpheus move**). Human seats decide via the UI; bot seats decide via `botDecide` (self-revive if favor ≥ 1; Orpheus only when pious or short-handed, per §2b). Also implement the **peek**: reveal the next face-down island's title in the log/track. Keep it light for the prototype.
- **PHAEACIA.** Scene 1: hold += guest-gift (e.g. +2 per living player). Scene 2 "the song": for each living player, `bones = clamp(favor, 1, 5)`; throw that many; if any face is a **6**, grant the **full gift bundle** (rations + a flag `tollSkipNextCrossing = true` + they've already peeked Ithaca), else a **lesser gift** (fewer rations, no toll skip). **Pays gifts only — never favor.** Scene 3: set `tollSkipNextCrossing` so the crossing into Ithaca is skipped.
- **ITHACA** (finale, the reversal). Implement as three scenes:
  - **Beggar (patience):** each living player secretly chooses `endure` or `reveal` (humans via UI, bots via `botDecide` — bots endure unless greedy-and-high-favor). Endure banks +standing (a local counter, starts = favor). Reveal early forfeits part of standing (e.g. standing −2) — but is tempting to display as an option. Higher-favor players should feel the pull; for the prototype just present the choice and apply the penalty.
  - **Bow (gate):** compute the qualifying field — players with `favor >= 1`, then take the **top 2 by standing** among the living. If ≥2 qualify → a contest; if exactly 1 → they win the bow alone; if 0 → narrate that no one could string it (edge case — fall through to lowest-drama resolution, e.g. the highest-standing living player). Only qualifiers proceed.
  - **Reckoning:** the suitors carry a **pot of 6 favor**. Qualifiers Dare together (each throws; sum their "contribution" = high faces). Distribute the 6-favor pot **proportionally to contribution**, not to prior rank. Then narrate Penelope's test of the bed as a recognition beat (no scoring). **Winner = most favor among the living**; allow ties (multiple winners). Show a final scoreboard.

---

## 8. UI / UX requirements

- **Setup screen (first thing shown):** choose humans (1–4) with a simple stepper, optional names, and per-seat human/bot toggle (default humans = P1…Pn, rest bots); show each bot's temperament and allow re-rolling it. A "start voyage" button begins the game. Optional 0-humans checkbox for full-auto demo.
- **Voyage track** across the top: `⚓Troy · 🏝️I1 · 🏝️I2 · 💀Hades · 🏝️I3 · 🏝️I4 · 🏛️Phaeacia · 🏰Ithaca`, current beat highlighted. Islands show face-down until revealed (by arrival or Hades peek).
- **Hold widget:** big ration number + a state color. Mark the **danger line** clearly: when `hold < (living player count)`, show a warning ("the hold can't feed everyone who reaches"). This visibility is core to the tension.
- **Crossing widget** (at sea): show marbles remaining as 🔵×n 🔍⚪×m and the rising land odds ("land: 2-in-7").
- **Player panels (×4):** name, a **human/bot badge** (🙂 human / 🤖 bot + temperament for bots), 🍖×satchel, 🫒×favor, and a status token (🟢 alive / 🟡 starving-tipped / 💀 dead). During commit, human panels show the secret-commit gate or (director mode) the choice controls inline; bot panels show a brief "committing…" state, then reveal with everyone else.
- **Bone throws:** animate or at least clearly display each thrown face (use 🎲 with the number, or a small custom die face). Show the reveal **one player at a time** with a short narrated line each. Bots reveal in the same sequence as humans — never before a human has locked their own choice. Add a small **bot-speed control** (instant / brief pause) so a solo human can follow what the bots did rather than have three turns flash past.
- **Log:** append a readable sentence for every meaningful event ("P3 reached for the hold — the hold was short — lots cast — P3 drew a 1 and missed the meal, and is now starving"). The log is the main playtest instrument; make it verbose and human.
- **Prompt area:** always tells the player whose decision it is and what the choices mean, in plain language, with buttons. Never require the player to know a rule that isn't on screen.
- Keep the whole thing on one scrollable page, mobile-friendly-ish (flexbox, no fixed pixel layouts that break narrow). Dark, nautical, readable. Don't over-style — legibility first.

---

## 9. Acceptance checklist (the build is "done" when all pass)

1. A full game runs Troy → 4 islands (dealt from the four episodes) with Hades, Phaeacia, and Ithaca in the fixed slots, end to end, without a dead-end state.
2. Crossings vary in length across games and always terminate; the rising-land indicator updates each draw.
3. The **Eat blind-commit** works: hold-reachers can exceed the hold, lots get cast, and the loser misses the meal and becomes starving — visibly, in the log.
4. **Two-strike starvation** works: a starving player's Act is skipped, and a second missed meal kills them; eating (including from a crewmate's Give-refilled hold) clears starving.
5. **Death economy** works: a dead player can pay 1 favor to return, and a crewmate can pay to revive them (Orpheus).
6. **Favor only moves via the gods:** Abide-6 grants favor; Dare-1 removes it; Give never changes favor; no UI ever lets a player hand favor to another (except the involuntary Charon/Orpheus toll).
7. **Helios can actually sink the ship** via the world track; **Cyclops Boast** persistently worsens later crossings; **Sirens** reward listening but can wreck the ship; **Lotus** can strand a player.
8. **Phaeacia pays gifts, never favor**, with the pool sized by favor (floor 1, cap 5).
9. **Ithaca reverses:** set up a game where P4 is 2nd in favor but wins by qualifying for the bow (floor 1, top-2) and taking the larger share of the suitor pot by contribution. Confirm a 0-favor player is shut out of the bow.
10. `?seed=abc` reproduces an identical game; director-mode toggle flips masking on/off.
11. **Any human count 1–4 plays a complete game**, bots filling the rest; a 1-human game and a 4-human game both run start to finish.
12. **Bots decide everywhere a human does** — Troy take, Eat, Act, Hades revival, Ithaca patience — through `botDecide`, and never via a special rules path. A **0-human seeded game** runs unattended to a winner.
13. **Bots don't leak information:** in a masked game a bot's committed choice is never shown before a human on the same turn has locked theirs.
14. **Temperament is visible in play:** across a full-auto game the log shows greedy bots free-riding the hold and Daring, pious bots Abiding and Giving — i.e. the commons tension actually fires among bots.

---

## 10. Build order (do it incrementally, commit-sized steps)

1. State object, `rng`, `throwBone`, render skeleton, log.
2. Setup screen (human count 1–4, seat assignment, temperaments) + Troy setup + journey dealing + voyage track render.
3. The `collectCommits` seam + a first `botDecide` (Eat + Act only). Build bots early so you can run and watch full turns immediately.
4. The turn engine: Eat (with lots) and Act (with the two tables) as pure functions, tested in **full-auto** mode at sea (all bots — the fastest way to shake out the loop).
5. Crossings (marble bag + rising land) wiring sea turns together until land-ho.
6. Episode format + the four episodes + collective checks + doom/blessing on depart (extend `botDecide` with the episode overrides).
7. Hades (revival + peek, bot policy), Phaeacia (gift pool), Ithaca (three-scene reversal + bot patience + scoreboard).
8. Human secret-commit masking UI (1 / 2–3 human rules) + bot-speed control + polish + the acceptance checklist.

Leave every tunable constant (bone weights, hold start, bag composition, tolls, pot size, thresholds, **and the `CONFIG.bot` temperament weights**) in a single clearly-labelled `CONFIG` object at the top so a designer can retune both the game and the bots without hunting through logic.

---

## 11. What to explicitly NOT do

- Don't invent new verbs, currencies, or tracks. Three verbs (Dare/Abide/Give), two currencies (rations/favor), one world track per episode. If something feels missing, surface it in a code comment — don't add it.
- Don't let players trade rations or favor directly (the only inter-player transfer is the Orpheus toll).
- Don't script episode outcomes — outcomes must emerge from the blind commits and the bones.
- Don't let bots cheat: a bot reads only the same public state a human can see at commit time (it must not peek at other players' pending secret commits), and it plays by the identical rules and tables. Bots may be simple, never omniscient.
- Don't add art assets, sound files, or network calls.
- Don't skip the log — it's the whole point of a prototype.
