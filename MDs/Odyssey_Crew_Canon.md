# 🧭 Odyssey Crew — Canonical Design (v1.0)

*"Odysseus's crew all died. Will yours survive?"*

This is the single source of truth. It supersedes the three handoff/design/episode files, which predate the three-verb convergence. Everything below reflects the decisions locked in collaboration. Numbers marked **[tune]** are placeholders for the Pastry-Pirates-style simulation pass; the structures around them are final.

---

## 1. What it is

A 4-player tabletop game, playable online (digital-native) and physically, one sitting (~60–90 min), learnable in minutes. **You are not Odysseus. You are the crew** — the sailors trying to survive the voyage home while Odysseus (an NPC driven by the cards) leads you into one predicament after another.

**Two goals, one ranking:**
1. Get the ship home to Ithaca and help Odysseus reclaim his throne.
2. Arrive with the most **favor** from the gods.

**The core bet.** The Odyssey isn't a plot, it's a bag of self-contained predicaments told out of order even by Homer. So we never script a story. Each game deals a random subset of episodes into a fixed skeleton; replayability is combinatorial, and hoping your favorite island comes up is a real hook. Every episode is a different *question*, but all are played through the same tiny grammar. **One engine, many questions.**

**The values (the compass).** Immersion (the table becomes the deck of a ship). Poetic mechanics (every rule is an abstraction of a real force — luck is the gods speaking, hunger is the crew's undoing, generosity is sacred hospitality). Elegance (learn it in minutes, then get lost in it). Strategy (chaos from the bones, but the cleverest, most far-seeing player wins). Human dynamics (cooperation is optimal, defection is delicious). Storytelling (the story is your own journey through the world).

**The theme, precisely.** The poem runs on two social technologies, and the game keeps them separate:
- **Xenia** — host/guest reciprocity, dyadic and sacred; how two strangers who could kill each other cooperate instead. This is the **episodic** engine: how you treat what the sea washes up.
- **The commons** — group-level shared fate; the thing one man's weakness destroys for all. This is the **chronic** engine: the ship's hold.

Their enforcement is divine, not sovereign: the gods watch, the stranger might be a god in disguise, and they reward or punish. That enforcement layer *is* the favor economy — favor is granted only by the gods and never traded between players, which makes it Zeus Xenios in mechanical form. The game is not only about the commons; it also carries *nostos* (getting home), *metis* (cunning), and *kleos vs. safety* (the Boast, the Sirens).

---

## 2. The journey (8 beats)

```
Troy  →  Island 1  →  Island 2  →  HADES  →  Island 3  →  Island 4  →  PHAEACIA  →  ITHACA
(sack)   (random)     (random)    (fixed)    (random)     (random)     (fixed)       (finale)
```

The four islands are dealt **face-down at the start** from the wandering-episode pool (§10), so the next island is *determined but hidden* — which is what lets Hades peek ahead. **Hades and Phaeacia are fixed anchors and mirror pillars:** the nadir and the zenith, the dead and the ideal living. At Hades you spend rations to *take* sight from the dead; at Phaeacia you spend your record to *earn* voice among the living.

Between every pair of beats is a **sea crossing** of variable length (§8).

---

## 3. The two currencies

**Rations = the flesh.** Survival fuel. Held in two places: your **satchel** (private) and the ship's **hold** (shared). Every sailor eats 1 ration per turn. Lost on death.

**Favor = the soul**, shown physically as **olive** (Athena's tree, the suppliant's bough). The victory currency. **Granted and revoked only by the gods — the cards and the bones — never transferred between players.** This keeps balance independent of table temperament. Favor persists through death, is spent in exactly one place mid-game (Charon's toll at Hades), and is cashed as *standing* at Ithaca.

Poetic frame: rations are the body, favor is the spirit. At death the flesh spills into the sea but the soul persists, and the soul is what buys passage back from the dead.

**Favor is the running verdict.** There is no separate "shame" currency. Abide adds favor, Dare subtracts it, dying and paying Charon bleed it. A player's olive tally already nets their honor against their transgressions — which is exactly why Phaeacia can read it directly (§12).

---

## 4. The bones (astragaloi)

Four landing faces valued **1 / 3 / 4 / 6** (no 2, no 5), historically authentic. **Weighted** so the middle is common and the edges are fated:

| Face | Weight **[tune]** | Feel |
|---|---|---|
| 1 | 10% | the Dog — disaster |
| 3 | 40% | common |
| 4 | 40% | common |
| 6 | 10% | the god's own hand — triumph |

A roll is *the gods speaking* and also *casting lots* — both period-authentic. The physical box ships 16 bones (four per player); online they're free.

---

## 5. The three verbs, the recipients, and the gods

Every action pays into up to four **recipients** at once:

| Recipient | Meaning |
|---|---|
| **you** | your satchel (rations) |
| **crew** | the hold (rations) |
| **favor** | your standing with the gods |
| **world** | the environment / god-anger track (adds bad marbles to the crossing bag and/or docks everyone's rolls) |

Notation: `-r / +r / ++r` = lose 1 / gain 1 / gain 2 rations, to whichever recipient it's tagged under. In sea tables the bare `+ / -` means the same, shortened.

**The gods' two jobs:** they reward or punish **you** *individually* for what you do toward them (favor ±), and they punish the **crew** *collectively* for what the ship does to the world (rolls −1 and worse marbles in the bag).

The three verbs are three postures toward the cosmic order:

- **DARE** — *transgress.* The greedy, high-variance gamble: grab for yourself and damn the ship. The **only** verb that angers the world, and the **only** one the gods punish with lost favor. Big upside, real collective downside.
- **ABIDE** — *uphold* ("abide by Zeus's law"). Modest and safe; respects everyone. Lower upside, lower downside. The **sole in-voyage road to favor** (Abide-6).
- **GIVE** — *human fellowship.* Move a ration from your satchel into the hold. The gods are indifferent to it (no favor either way) because it's mortal-to-mortal solidarity; the gods care about the system, not about who shared bread with whom.

### Land / island Act tables

| Bone | **DARE** | **ABIDE** | **GIVE** |
|---|---|---|---|
| **1** | you −r · crew −r · favor −1 · world − | you 0 · crew 0 | you −r · crew 0 |
| **3** | you +r · crew 0 | you +r · crew 0 | you −r · crew +r |
| **4** | you ++r · crew 0 | you +r · crew +r | you −r · crew +r |
| **6** | you ++r · crew ++r | you +r · crew +r · **favor +1** | you −r · crew +r |

### Sea Act tables

At sea the verbs re-skin to fishing. **Dare = fish for a sea monster** (spends hold rations as bait — that's the `crew −` — for a big personal catch; a 1 can eat you). **Abide = fish with a rod** (safe trickle). **Give** is unchanged.

| Bone | **DARE** (sea monster) | **ABIDE** (rod) | **GIVE** |
|---|---|---|---|
| **1** | you − · crew − · favor − | you 0 · crew 0 | you − · crew 0 |
| **3** | you + · crew − | you + · crew 0 | you − · crew + |
| **4** | you ++ · crew − | you + · crew 0 | you − · crew + |
| **6** | you ++ · crew ++ | you ++ · crew + | you − · crew + |

Fishing tops out at 1–2 rations while the turn's meal costs 1 — so the sea is a **slow bleed you can fight but almost never reverse.** Long crossings are the *generator* of the commons crisis: they drain satchels toward an empty hold.

---

## 6. The turn — two phases

Every turn, in both environments, runs **Eat** then **Act**.

### Phase 1 — Eat (blind commit)

Each living player secretly chooses their food source, then all reveal at once:
- **Satchel** — eat your own (−1 private). Guaranteed safe.
- **Hold** — reach for the shared stores (−1 from the hold, spares your satchel).

**The commit is binding:** once you reach for the hold you may **not** fall back to your satchel when the shortfall is revealed. That blindness is the whole tension — you can't see how many others are also broke and reaching for the same barrel.

**Shortfall → cast lots.** If more sailors reach for the hold than it can feed, it feeds as many as it can and the rest **cast lots**: each short reacher throws a bone, **lowest face loses** and misses the meal. (Straight from the Cyclops casting lots for who Nobody eats.) With a full crew, a hold under 4 can't feed everyone who might reach — a fixed, learnable danger line that *drops* as the voyage kills people.

### Phase 2 — Act

Only living, **non-starving** players act. Each secretly commits **Dare / Abide / Give**, everyone throws bones at once, then reveal one at a time and reckon (§5 tables, land or sea).

The four-beat rhythm inside Act — commit blind, throw together, reveal in turn, reckon — is why disaster emerges from the *sum of private, individually-reasonable choices*, with no coordination and no visible villain. That is the Odyssey's own logic, and it's the online-native core.

---

## 7. Starvation (two-strike)

- **Miss a meal** (drew the short lot, or you were empty everywhere) → you are **Starving**. Tip your token on its side.
- A Starving sailor is too weak to act: **their Act phase is skipped this turn.** They cannot fish, Give, or Dare.
- **Eating anything next turn** — your own satchel, or a hold a crewmate refilled — clears Starving. Stand the token up.
- **Miss a second consecutive meal while Starving → death.**

Two consequences this is built to create:
- **A hoarded satchel ration is single-starve insurance.** Keeping one back means you always survive one bad lot — but it isn't free, since you still lose a turn to weakness and you're now one miss from death.
- **The empty man cannot save himself.** With an empty satchel and his Act skipped, a Starving sailor can't even fish his way out. His only lifeline is a crewmate **Giving into the hold** before the next Eat. Xenia made mechanical: the hungry depend on the generous.

**On the commons message:** hoarding stays *individually survivable* — that's what makes it a genuine temptation and a real tragedy of the commons. The cooperation message rides on the **favor axis**, not the survival axis: Abiding is the only road to favor, so cooperation is optimal *for winning* while defection is optimal only *for bare survival*. The lottery is the **collective** failure state — when everyone hoards and the hold goes bare, long crossings start casting lots. Individual defection survives; universal defection kills.

---

## 8. The two environments

### Sea — the crossing (marble bag, rising land odds)

A crossing spans **many turns**. Each turn you draw one marble from the crossing bag:
- **Blue = still at sea.** Run Eat, then the Sea Act phase (fish or Give).
- **White = land-ho.** The crossing ends; begin the next island's episode.

**Rising land probability.** Start each crossing with **5 blue + 1 white [tune]**. Before every draw *after the first*, add **one more white** to the bag. So land grows likelier the longer you're lost (turn 1 ≈ 1-in-6, turn 2 ≈ 2-in-7, turn 3 ≈ 3-in-8 …), crossings self-terminate in a tunable band, and distance between islands varies every game. The opening blue count sets a leg's expected length. A **bad crossing can kill crew** through starvation, and world-anger (§5) can salt the bag with extra blue/worse marbles.

### Land — the episode (3 scenes)

Each island is a self-contained episode of **three scenes — Setup, Climax, Escape** — and each scene offers the same three verbs, re-skinned. Episodes never add a rule; they only bend what Dare/Abide/Give cost and pay, and set the **collective check** (a pooled-bone triumph threshold and/or a world-anger doom line). The card layout is fixed so the eye learns it once: a read-aloud hook (prose, never rules), the three-verb menu, the scene's tracks and collective check, and the footer *commit in secret · all throw the bones · reveal one by one.*

---

## 9. Death, revival, and the crew-as-asset

Death is an **economic setback, not an elimination.** On death your satchel rations spill into the sea; your favor persists; you go to the **shore of the dead**.

- **Charon's toll:** pay **1 favor [tune]** to cross back and rejoin the ship on a later turn. The thing you hoard to *win* is what buys your life back — recklessness bleeds your score.
- **The Orpheus move:** a living crewmate may pay your toll *for* you, spending their own favor. Every death is a small test of the table — raise them, or let them lie to keep your lead.
- **Crew = asset.** Because triumph thresholds pool the *living* crew's bones, a corpse is a hole in the ship's power. Reviving restores strength; everyone benefits from a full crew, yet it still costs the reviver. Fewer survivors also means an *easier* hold to feed but *weaker* pools — a real trade the sim should watch.
- **The only true game-over** is the whole crew dead at once with no favor left to return.

---

## 10. The episode pool

Four islands are dealt from these ten wandering episodes. Each is a distinct question on the shared grammar. The two most-developed (Cyclops, Helios) are fully re-expressed in §11; the other eight carry their shape here and need full re-expression plus sim-tuning (former "Pray"/"Wait" effects fold into Dare/Abide/Give or into a scene-specific mechanic).

| # | Episode | Question | Distinct shape |
|---|---|---|---|
| 1 | The Cicones | Greed vs. knowing when to quit | Push-your-luck: Dare to plunder more (ticks a world track); Abide to stand ready to leave. Cross the line → the Cicones muster (pooled bones), the greediest die first. |
| 2 | The Lotus-Eaters | Oblivion vs. the hard road | Dare to eat the lotus (free rations, risk becoming Lotus-struck and unable to act); the clear-headed Dare to haul a struck mate out. Anyone still struck when the ship sails is left behind (death). |
| 3 | The Cyclops | Cunning vs. force; pride's price | Private pride → collective curse. **Fully expressed, §11.** |
| 4 | Aeolus & the Bag | Trust vs. suspicion | The sealed bag; Ithaca one crossing away. Dare (secret) to open it, or Abide and trust. If anyone opens it the winds escape and blow the ship back — the cruelest timing makes trust itself the mechanic. |
| 5 | The Laestrygonians | Flight; no clever play | High-lethality survival. Dare to row hard for open water (progress, but exposed — bone vs. death); Abide to hunker unseen (safe, slow). Stress-tests the death economy. |
| 6 | Circe | Appetite makes you a beast; delay | Dare to join her feast (rations, risk being turned to swine and skipping your next Act); Abide the discipline. A lingering tax punishes over-comfort. |
| 7 | The Sirens | Knowledge vs. safety | Open, *rewarded* temptation. Dare to unstop your ears (big favor/kleos) but add to a Rocks/world track pulling the ship onto the reef; Give to bind a mate or stopper their ears (protect the ship); Abide to be bound. One indulges, all imperiled. |
| 8 | Scylla & Charybdis | Sacrifice; the lesser evil | Forced loss. The crew chooses: hug Scylla (a *certain* fixed death) or risk Charybdis (a pooled Dare — a triumph and all live, a doom and the ship is swallowed). Someone dies no matter what. |
| 9 | The Cattle of Helios | Restraint vs. hunger | The canonical commons tragedy; doom via the world track. **Fully expressed, §11.** |
| 10 | Calypso | Comfort vs. homecoming | The inverse episode — the danger is that nothing bad happens. Abide (bent) to soak up the island's ease (bank rations + favor now); Dare to tear yourself away, at a rising cost each turn you stay. A sailor who never tears free is *lost to Calypso* — alive, content, and out of the running. |

---

## 11. The two worked episodes, in three-verb grammar

### 11a. The Cattle of Helios — *restraint vs. hunger*

**Setup values [tune]:** a forbidden **herd of 12 cattle** in the center; the **world track (Helios's Wrath)** 0–10, doom at **7+**; ship's hold low; Ithaca close.

Verbs bend like this, all committed blind as usual:
- **Dare = slaughter a cow.** Reads the standard Dare table: a **1** is *seen by the Sun* (you −r, crew −r, favor −1, **world −** = Wrath climbs hard); **3/4** feed you while Wrath still creeps; a **6** is a bold, clean kill. Every Dare is a private ration grab that raises the shared doom.
- **Abide = restraint.** The pious road, and the episode's virtue: Abide-6 grants the favor that makes holding out *worth* it.
- **Give = feed the hold** so no shipmate is hungry enough to Dare a cow — cooperation that lowers everyone's temptation.

**Doom.** If the world track crosses **7** by the end of Escape, Helios sinks the ship at departure: everyone drowns, full satchels included; all who can pay the Hades toll wash ashore and continue. If the herd stayed nearly whole (**Wrath ≤ 2 [tune]**), Helios *blesses restraint* — a favor bonus to the crew.

The thesis episode: cooperation optimal, defection delicious, disaster emergent from four private panics, and it only ignites because a hungry crossing drove satchels to empty first.

### 11b. The Cyclops (Polyphemus) — *cunning over force, and the price of pride*

**Setup values [tune]:** trapped in the cave, boulder across the mouth; **Escape Progress** needs 3; a **Drunkenness** marker; **Polyphemus's Hunger** — at the end of any scene with no progress on the required beat, he devours a sailor (they miss the rest of the episode and lose the favor earned on this island).

- **Scene 1 — The Wine.** *Give is bent = pour wine* (from the hold) to raise Drunkenness; he must be **Drunk 2+** before blinding works. **Abide = cower** (safe, but he may feed if no one advances the beat). A reckless early **Dare** (attack him sober) needs a 6 — usually folly.
- **Scene 2 — The Stake.** With him drunk, the crew **Dares together** to drive the burning stake home — a pooled-bone triumph threshold. More Darers = more bones = better odds (cooperation made literal). Enough high faces → blinded (Escape Progress + big favor); a pooled **1** → the stake slips, he wakes and feeds. **Give** keeps him under with more wine; **Abide** braces the stake but commits less.
- **Scene 3 — Under the Sheep, and the Pride.** **Dare (cunning)** to slip out under the wool — final Escape Progress. Then the secret **Pride** choice, committed blind: **Abide = hold your tongue** (humble, safe) or **Dare = Boast** ("It was Odysseus!") for a lump of kleos *now* that curses the ship — **Poseidon's Curse** worsens every future crossing bag for the rest of the game. A private choice with a collective cost, reached through pride instead of hunger — the exact mirror of Helios. Because it's secret, one proud fool can doom the voyage, and no one knows who until the reveal.

Same currencies, same bones, same blind-commit loop, utterly different soul. Proof the grammar flexes.

---

## 12. Phaeacia — the gift-reckoning (fixed anchor)

The one place of ideal hospitality in a poem full of hosts who eat their guests, and the frame where Odysseus narrates his own voyage. Here the gods judge your **deeds**, read straight off the favor you already carry. No new currency, no re-litigation.

- **Scene 1 — The welcome.** Stores refill (guest-gifts); no danger.
- **Scene 2 — The song (the judgment).** Each sailor in turn lays their record before the court and throws for the gods' verdict, the pool set by their life: **throw one bone per point of current favor, floored at 1, capped at 5 [tune].** Read the pool — any **6** → the gods are moved and grant their bounty; all low or a lone **1** → the court gives grudgingly. The pious throw a fat handful and can hardly miss; the transgressor throws one bone and is at the gods' mercy.
- **Scene 3 — The gift-ride.** The Phaeacians' magic ship **skips the next crossing's toll** and speeds you toward Ithaca.

**The payout is gifts, never favor** — rations, the toll-free ride, and a **peek at Ithaca**. This rewards the whole-voyage record without moving the standings, so favor keeps meaning exactly one thing all game. It is the mirror of Hades on the favor axis: at Hades you spend rations to take sight; at Phaeacia you spend your record to earn provision.

---

## 13. Ithaca — the mirror finale (the reversal engine)

Not a fifth island — the inversion. The voyage was about surviving what the world did to you; the homecoming is about what *you* do now that you hold the power. The suitors have been draining the house all game (a running hold/stores drain — the bill now comes due). Three scenes, each a verb re-skinned for home.

- **Scene 1 — The Beggar (Abide as patience).** Arrive disguised and endure insult to bank standing toward the bow. The higher your favor, the sharper the temptation and pressure to break cover early — and a favored player who reveals too soon **forfeits part of their standing [tune].** A lead becomes pressure to hold, not insurance. This is the low-favor player's opening, because patience costs the proud the most.
- **Scene 2 — The Bow (Dare, gated by favor).** You must clear a **hard floor of 1 favor** to touch the bow at all — the truly faithless (0 or negative) are shut out, preserving the thesis. Among those who clear the floor, the **top 2 of the living crew qualify** to attempt the string. The dishonorable literally cannot lift it. Stringing is not the win — it is *entry to the reckoning*, and Scene 1's patience is what tips a near-miss sailor over the line or drops a fumbling leader below it. **The contest is live whenever two or more clear the floor; if only one clears, they win the bow alone** (rare, and correct — the last of the faithful stands alone in the hall).
- **Scene 3 — The Reckoning (Dare together).** The suitors are a shared threat carrying a **pot of favor** — everything they stole from the house. Qualified crew Dare together (pooled bones), and the freed favor is split **by contribution to the kill, not by prior rank.** The underdog who strung the bow and struck hardest can claim the largest share of a large pot. Then Penelope's **test of the bed** — a recognition beat that confirms who you truly are (not a scoring event).

**Winning.** Among crew alive in the hall, the one with the most favor is most beloved of the gods. Multiple winners possible.

**Why it reverses without betraying the voyage.** Favor stays the master currency — it is the *gate* to the bow — so a player who ignored the whole voyage still usually can't compete. But the finale is a second, concentrated favor economy redistributed by *homecoming performance*: patience held, threshold cleared, blows landed. Reversal is earned by **deed, not dice**.

**Three sim knobs:**
1. **Qualifying fraction** — top-2-of-the-living is the default; widen or narrow to taste (primary reversal dial).
2. **Suitor pot size [tune]** — large enough to let 2nd or 3rd place win with excellent play, not so large it rescues a sailor deep in favor debt. *Redemption for the near, not the damned.*
3. **Patience penalty [tune]** — how much a proud early reveal costs the favored; the equalizer that turns a lead into pressure.

---

## 14. Troy — the opening (the ethic in one move)

Before the first crossing, each player **takes 1–6 rations** from the sack of Troy and gains **(7 − that) favor**. Greed buys survival now; restraint buys favor (and, since favor buys second lives, restraint literally buys survival later). Asymmetric starts, zero rules overhead, the whole byline in action from turn zero.

---

## 15. Default constants (prototype starting point, all **[tune]**)

| Constant | Default | Note |
|---|---|---|
| Players | 4 | Fixed. |
| Troy take | 1–6 rations → satchel; (7 − take) → favor | Player's opening choice. |
| Hold start | 6 | Shared. |
| Meal | 1 ration / player / turn | Eat phase. |
| Bone weights | 1:10% · 3:40% · 4:40% · 6:10% | Weighted astragaloi. |
| Crossing bag | 5 blue + 1 white; +1 white before each draw after the first | Rising land odds. |
| Starvation | miss 1 → Starving (Act skipped); miss 2 → death | Two-strike. |
| Charon toll | 1 favor | Revival from Hades. |
| Phaeacia pool | bones = favor, floor 1, cap 5; any 6 → full gifts, else lesser | Pays gifts, never favor. |
| Ithaca bow | floor 1 favor; top 2 of living qualify; duel if ≥2 clear, solo win if 1 | Reversal gate. |
| Suitor pot | 6 favor | Split by contribution to the kill. |

---

## 16. What's locked vs. open

**Locked (structure):** three verbs and their two table sets (land/sea); the recipient model (you/crew/favor/world) and the gods' two jobs; the two-phase turn with a blind Eat commit; two-strike starvation with the Act skipped; binding hold-reach with lot-casting on shortfall; favor as the sole running verdict (no shame tokens); the 8-beat journey with Hades and Phaeacia as mirror anchors; marble-bag crossings with rising land odds; fishing as a fightable bleed; Troy's take/favor opening; Phaeacia's favor-weighted pool paying gifts only; Ithaca's floor-1, top-2, contribution-split reversal.

**Open (numbers, for the sim):** every value marked **[tune]**, plus per-episode thresholds; the eight un-worked episodes need full three-verb re-expression; the digital blind-commit/simultaneous-roll/sequential-reveal engine needs scoping (see the prototype spec).
