# Phase 3: Economy & Verb Redesign (Anchor Retrofit + Balance) - Context

**Gathered:** 2026-07-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Redesign Odyssey Crew's core economy and verb model, retrofit the three anchors, and tune the result. This grew during discussion from "anchor retrofit + number tuning" into a coherent **core-economy redesign** that re-opens work in Phases 1/2/4. In scope:

1. **Two-verb pivot** — fold the three-verb grammar (Dare/Abide/Give) into **two verbs (Abide / Dare)**. Re-author every island's beats.
2. **Currency unification** — fold the peril tracks (world-anger `state.world`, Poseidon's curse `state.curse`) into **favor**. Favor is the single divine currency.
3. **Favor-as-lifeline revival** — generalized (revive on your turn by paying favor; a crewmate may pay for you).
4. **Keep-the-crew-whole incentives** — more living crew = easier voyage, and Ithaca rewards a full crew (no dead-ends).
5. **Full anchor verb retrofit** — Hades / Phaeacia / Ithaca onto the two-verb grammar, preserving validated invariants.
6. **Balance retune** — tune to the target via the multi-seed 0-human sweep (`scratchpad/sweep.mjs`).
7. **Board update** — three verb buttons → two; the per-roll stakes preview follows.

**Out of scope:** none deferred within this redesign. (New episodes, sim harness, production art remain future/out-of-scope per REQUIREMENTS.md.)
</domain>

<decisions>
## Implementation Decisions

### The verb model (the spine)

- **D-01 — Two verbs: Abide / Dare.** Fold Give into Abide; remove the `give` verb/path everywhere (engine, beats, board, stakes preview). — **Reversibility:** one-way — re-authors all island beats, changes the engine's verb enum, the board's action bar, and PROJECT.md's stated "three-verb grammar" identity; undo is a full revert. Do it tracer-first.
- **D-02 — Abide = serve the commons (uphold Zeus's law / xenia).** Abide ALWAYS contributes to the shared **hold** (base effect), and on a **high roll** the gods notice your piety → **favor** (the blessing on top). Abide never feeds your own stash and is never "bad" — its cost is opportunity (you didn't secure your own belly; you trust the contested commons to feed you).
- **D-03 — Dare = transgress for yourself.** Dare feeds YOUR **stash** (personal food security). On a **high roll you get away with it** (unseen, full stash); on a **low roll the gods catch you → −favor**. Dare is how you survive when you can't trust the commons — but it courts divine judgment.
- **The die is the gods' gaze.** A good roll rewards both paths *in kind* (Abide→favor blessing, Dare→unseen stash); a bad roll gives the lesser outcome (Abide→hold-only/unremarked, Dare→caught/−favor). This fits the project's "luck = the gods speaking" frame. Exact split (base-hold + high-roll-favor vs strict low→hold/high→favor) is tunable; author base-hold + high-roll-favor.

### One divine currency (favor)

- **D-04 — Fold world-anger + Poseidon's curse into favor.** Remove `state.world` and `state.curse`. Favor (🫒) is the single divine axis; remaining currencies are 🍖 personal stash, 🛢️ the hold (commons), 🫒 favor. — **Reversibility:** one-way (removes tracked state + rewrites every `d.world`/curse site + the doom/crossing triggers).
- **D-05 — Favor drives seas and doom.** Low **aggregate** crew favor → rougher crossings (the marble bag salts toward peril) AND collective catastrophe (Helios/Sirens doom) triggers when aggregate favor sinks past a threshold. High favor → calm passage. The commons tragedy made literal: private transgressions (each −favor) pile into collective doom. Must stay deterministic (favor is deterministic state).

### Favor = lifeline (revival)

- **D-06 — Generalized favor-revival.** Death (starvation) sends you to Hades/the dead. On your turn a dead player may **pay Charon a favor to return**; if bankrupt, a **crewmate may spend their favor to raise them** (generalized Orpheus — not only at the Hades stop). The permanent-death condition shifts from starvation to **favor bankruptcy** (the crew collectively can't afford to bring anyone back). Ideally every crew member reaches Ithaca unless the crew bankrupts favor or plays greedy/stingy.

### Keep the crew whole

- **D-07 — Both incentives (must never dead-end; always resolves to a winner).**
  - *Soft, voyage-wide:* more living crew = easier voyage (crossings favor land / safer bag, more hands share the hold, gentler perils). You strongly WANT everyone alive, but a thin crew can still limp to Ithaca.
  - *Finale:* Ithaca's bow/reckoning rewards a full crew (a thin crew still resolves to a winner — just grimmer). Guard hard against a no-win finale.

### Anchor verb retrofit (full, all three — onto TWO verbs)

- **D-08a — Hades:** living crew get a verb moment (peek + Charon/Orpheus revival stay beneath, now generalized). Abide = observe the rites / mourn (piety → favor); Dare = press the shades for deeper sight (extra peek / prophecy) at a favor risk. Preserve revival + peek (ANCHOR-01/04).
- **D-08b — Phaeacia:** introduce a real verb choice (none today). Abide = accept hospitality graciously (xenia → favor + modest gift to the hold); Dare = boast your deeds for a bigger personal gift, risking a xenia-breach (−favor / lesser gift on a bad roll). Preserve the favor-weighted, gifts-only pool (ANCHOR-02/04).
- **D-08c — Ithaca:** full verb retrofit of all 3 finale scenes (Beggar / Bow / Reckoning) onto Abide/Dare beats. Beggar's endure/reveal maps naturally (endure=Abide/patience→favor, reveal=Dare). Preserve always-reaches-a-winner (ANCHOR-03/04).

### Balance & content

- **D-09 — Balance target:** greedy/dare survives but poor; pious/abide wins favor but fragile (defect→bare survival, cooperate→win). With revival, MOST crew reach Ithaca unless the crew is favor-bankrupt. Favor stays contested (wide final spread). Verified via a fixed multi-seed 0-human sweep; NEVER dead-ends. (Revises the earlier "full-crew rare" framing — with favor-revival, keeping the crew whole is the norm the economy gates on.)
- **D-10 — Escalating arc:** stakes/favor ESCALATE across each episode's 3 scenes (rising arc, D-09 of Phase 2). Applied during the two-verb re-authoring. **Settles the Phase-2 WR-02 leftover** (flat numbers under rising narration).
- **D-11 — Ripple work:** re-author ALL island beats (Helios/Cyclops/Sirens/Lotus) to two verbs + favor; update the board (2 verb buttons + stakes preview); update `PROJECT.md` "three-verb grammar" identity → two-verb. The favor-law statement simplifies: Abide is the favor road; Dare's favor is a *cost* (loss when caught).

### Claude's Discretion / open authoring details

- Whether the **Sirens Dare-favor exception** (the one flagged three-verb exception) survives the two-verb re-model — e.g. a high Dare roll at the Sirens = the gods bless boldness. Decide during re-authoring; flag if kept.
- Exact numeric split of Abide (hold base vs high-roll favor threshold) and Dare (seen/caught face thresholds), and all magnitudes — tuned via the sweep toward D-09.
- Exact aggregate-favor threshold for doom, and how crew-count eases the bag (D-05, D-07).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & design
- `.planning/REQUIREMENTS.md` — Phase 3 requirements (ANCHOR-01..04, BALANCE-01..03, + new ECON-01..04) and the design principle.
- `.planning/PROJECT.md` — Core Value (commons tension), favor law, constraints. **Its "three-verb grammar" identity must be updated to two-verb (D-11).**
- `.planning/OVERNIGHT-HANDOFF.md` — the measured baseline (38% death-spiral, inverted tension) that motivated this redesign.

### The code being redesigned
- `index.html` (worktree, branch `claude/gsd-new-milestone-acf812`) — the verb enum + `promptButtons` (kinds: act/eat/revive/patience/pride), `applyDeltas` (you/crew/favor/world), `state.world`/`state.curse`, `runHades`/`revivalRound`/`runPhaeacia`/`runIthaca`, `runCrossing`/`drawMarble` (bag salting), the `beats` tables (three-verb, to become two), the board renderers, and the `deltaStakes`/`stakesLine` stakes preview.

### Tooling
- `scratchpad/sweep.mjs` — the balance measurement sweep (survival + favor distribution by temperament). The acceptance instrument for D-09.
- `scratchpad/harness.mjs` — headless 0-human completion + validateBeats check.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable / to change
- **Verb enum & prompts:** `promptButtons`/`askResolve` (kind `act` builds dare/abide/give buttons at index.html ~641) → drop `give`; two buttons.
- **`applyDeltas`** (~333): `you`→🍖 stash, `crew`→🛢️ hold, `favor`→🫒, `world`→(remove). Add nothing new — favor absorbs world/curse.
- **Peril tracks to remove:** `state.world` (Helios doomAt:7 / Sirens doomAt:6 thresholds; bag salting) and `state.curse` (Cyclops boast → salts crossings). Re-express both via aggregate favor.
- **Revival:** `runHades`/`revivalRound` (Charon toll `CONFIG.charonToll`, Orpheus) → generalize to on-turn + crewmate-pays, available beyond the Hades stop.
- **Crossings:** `runCrossing`/`drawMarble` + `LAND_TABLE`/`SEA_TABLE` — bag composition to read off aggregate crew favor + living-crew count (D-05/D-07).
- **Beats:** all four island episodes' `beats.{dare,abide,give}` → two-verb; `deltaStakes`/`stakesLine` preview already generic (drops the `give` column automatically once beats change).
- **Board:** `renderBoard` action bar (2 buttons), crew cards (drop 🌊/☁️ tracks), doom shown as favor-driven peril.

### Established patterns to keep
- Single self-contained `index.html`, vanilla JS, offline; `?seed=` determinism; no rnd in click/render/timer callbacks; `beats: {verb:{face:{d,tell,cls?,fx?}}}` + `validateBeats` coverage; CONFIG-sourced numbers (no bare integers).

### Integration points
- The two-verb + favor-currency + revival changes are ENGINE-level (Phase 1 territory) → land them first (tracer), then re-author content, then anchors, then board, then sweep-tune.

</code_context>

<specifics>
## Specific Ideas

- **Xenia frame (the why):** Abide = uphold Zeus's law of hospitality (serve the common good, trust it to sustain all). Dare = break the law in self-interest to survive when the world itself is lawless (protect yourself or a mate). The gods reward the law-keeper with favor and judge the law-breaker — but the law-abiding path doesn't feed you, so survival often requires transgression (and its favor cost). To WIN you abide (favor) but risk starving; to SURVIVE you dare (food) but sin.
- **The die is the gods' gaze** — Abide high roll = heaven notices (favor); Dare high roll = heaven doesn't (you get away with it).
- **Favor is everything:** the win condition, your lifeline (buy back from death), and the world's mood (favor shapes the seas and staves off doom).

</specifics>

<deferred>
## Deferred Ideas

None deferred within the redesign. Adjacent future work unchanged: sim/tuning harness (SIM-*), production art/sound + new episodes (POLISH-*).
</deferred>

---

*Phase: 3-anchor-verb-retrofit-balance-retune (Economy & Verb Redesign)*
*Context gathered: 2026-07-26*
