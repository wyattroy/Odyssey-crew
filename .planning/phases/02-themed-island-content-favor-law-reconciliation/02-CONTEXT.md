# Phase 2: Themed Island Content & Favor-Law Reconciliation - Context

**Gathered:** 2026-07-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Author the thematic Dare/Abide/Give **beat content** (one-sentence story `tell` + tuned payoff `d`) for the four island episodes — **Helios, Cyclops, Sirens, Lotus** — each across its **3 scenes**, into the Phase-1 effect engine (`beats: {verb: {face: {d, tell}}}` consumed by `resolveEffect()`/`narrate()`, validated by `validateBeats()`). Honor the Dare/Abide/Give asymmetry, and reconcile the three shipped Dare-grants-favor violations.

**In scope:** the 4 islands' beats (Dare/Abide/Give × faces 1/3/4/6 × 3 scenes each), the favor-law reconciliation, the payoff-number organization in CONFIG.
**Out of scope (other phases):** the 3 anchors Hades/Phaeacia/Ithaca (Phase 3), the death-spiral balance tuning / multi-seed sweep (Phase 3), the interactive board (Phase 4). Author *survivable first-draft* numbers here; Phase 3 tunes.
</domain>

<decisions>
## Implementation Decisions

### Island mechanical hooks

- **D-01 (Helios — restraint):** Keep the user's original spec as the authoring template. Abide is inert except a **6** (forage dandelions → small stash gain). Dare escalates the commons transgression (slaughter Helios's cattle) with high upside and the Sun's wrath — a Dare-1 is *seen by the Sun* (world-anger); higher faces stash/hold gains, unseen. Give sustains the crew (ration → hold), no favor. Scenes escalate hunger → temptation → doom.
- **D-02 (Cyclops — pride, 3-stage escalation):**
  - *Scene 1 — trapped:* Abide = hide / eat the Cyclops' cheese (safe but going nowhere). **Pure-Abide strands you** — a sailor who only ever hides is left behind in the cave and dies. Dare = probe/act toward escape.
  - *Scene 2 — the blinding (collective):* Dare = help drive the burning stake into Polyphemus' eye; a **threshold of crew Dares collectively** opens the escape (use the existing `collectiveCheck` seam). Abiders contribute nothing to freeing the crew.
  - *Scene 3 — the escape (individual):* each sailor's Dare rolls their **own** escape (slip out under the sheep) — no collective gate; you get out or you don't. Boasting on the way out is the pride that salts the world (see D-05).
- **D-03 (Sirens — rewarded temptation / wreck):** Abide = bound to the mast, safe but thin. Dare = hear the song → a **favor** grant (the one sanctioned Dare-favor exception, see D-05), with a wreck risk on bad faces (lured toward the rocks → world-anger and/or crew loss). Scenes escalate distant song → full lure → the rocks.
- **D-04 (Lotus — forgetting / strand):** Abide = eat the lotus → **lotus-struck, escalating** (reuse the existing `lotusStruck` state: miss next turn; a repeated lure strands you → left behind → death). Dare = drag yourself / haul crew back to the ship (the survival move, see D-05). Scenes escalate taste → drowse → strand.

### Favor-law reconciliation (CONTENT-06)

- **D-05:** Favor moves via the gods only; **Abide-6 remains the default favor path**. Of the three shipped Dare-favor violations:
  - **Sirens — KEEP** as the single *intentional, flagged* Dare-favor exception (record the exception explicitly in the beat data / a comment). Daring the song is the one place the gods reward boldness.
  - **Cyclops boast — RETUNE OFF.** Boasting grants **no favor**; instead it adds **world-anger** (Poseidon's wrath salting later crossings). Pride is punished, not rewarded.
  - **Lotus — RETUNE OFF.** Dragging crew back grants **no favor** — it is survival, not piety.

### Payoff scale (numbers)

- **D-06:** Numbers live in **two tiers**: cross-scene magnitudes (extend `CONFIG.fx` with larger named tiers, e.g. `big`, `huge`, alongside `tiny`/`small`/`penalty`) + scene-specific numbers in each episode's own `CONFIG.<episode>` block (e.g. `CONFIG.helios`, `CONFIG.cyclops`). **No bare integer literals in any `beats` `d:{...}` cell** (preserves EFFECT-04 retunability so Phase 3 can tune from CONFIG alone).
- **D-07:** Author a **gentler, survivable first draft** — do NOT try to hit the final death-spiral-fixing balance here. Plausible, playable numbers anchored to the user's Helios scale; **Phase 3** does the real tuning via the multi-seed 0-human sweep. (Interim builds should be survivable, not brutal.)

### Voice & stage arc

- **D-08 (voice):** Beat `tell` text is **terse, concrete callouts** in the user's Helios style (e.g. "find a patch of dandelions and fill your belly") — short, punchy, fast to scan in the log now and on the Phase-4 board later.
- **D-09 (stage arc):** Each island's 3 scenes form a **rising mini-story** with growing stakes and payoffs (Helios hunger→temptation→doom; Cyclops trap→blind→escape; Sirens song→lure→rocks; Lotus taste→drowse→strand).

### Claude's Discretion
- Exact first-draft numeric values within the D-06/D-07 framing (survivable, CONFIG-sourced, Helios-anchored).
- The precise Cyclops collective-Dare threshold, and which faces trigger the Sirens wreck vs. reward, so long as D-01..D-05 hold.
- Per-cell `cls` log-color choices (the Phase-1 `CONFIG.log` map + optional per-cell `cls` are available — e.g. favor grants green, deaths/curses red).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & design law
- `.planning/REQUIREMENTS.md` — CONTENT-01..06 and the Dare/Abide/Give asymmetry + favor-law statement (top of file).
- `.planning/PROJECT.md` — Core Value (commons tension), the favor-only-via-gods law, and the locked-structure / retunability constraints.

### Research (authoring guide + violation locations)
- `.planning/research/FEATURES.md` — per-scene thematic-authoring guide; identifies the Sirens/Lotus Dare-favor conflicts.
- `.planning/research/PITFALLS.md` — favor-law violation reconciliation, face-key coverage validator, CONFIG-tracing, single-file growth.
- `.planning/research/SUMMARY.md` — cross-cutting findings (additive, effects-as-balance, favor-law P1).

### The authoring surface (Phase-1 engine)
- `index.html` (worktree copy on branch `claude/gsd-new-milestone-acf812`) — the `beats`/`resolveEffect()`/`narrate()`/`validateBeats()` seam, `CONFIG.fx`/`CONFIG.log`, `LAND_TABLE`/`SEA_TABLE`, `EPISODES` scene objects, `lotusStruck`/world-anger/`collectiveCheck` state. **Author into the main-checkout is wrong — all v1.1 work is in the worktree.**

> Note: `MDs/Odyssey_Crew_Canon.md` and `MDs/create-odyssey-crew.md` (the source-of-truth design docs cited in PROJECT.md) are **not present in the worktree** — the discussed decisions above (D-01..D-09) supersede them for authoring this phase.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Beats seam (Phase 1):** add `beats: { dare|abide|give: { 1|3|4|6: { d:{...}, tell:(p)=>'…', cls?:'…', fx?:(p,bone)=>{} } } }` to each `EPISODES.<island>.scenes[i]`. `resolveEffect()` prefers `beats`, falls back to `reskin`/`LAND_TABLE`/`SEA_TABLE`.
- **`validateBeats()`** fails loud on any missing/dead cell — every authored scene MUST define all four faces (1/3/4/6) for each verb it uses.
- **`CONFIG.fx` + per-episode `CONFIG.helios`/`CONFIG.cyclops`** already exist — extend these; no magic numbers in beats.
- **`CONFIG.log` + per-cell `cls`** (Phase 1) — data-driven log colors; use for favor grants / deaths / curses.
- **Existing state to lean on:** `lotusStruck` (Lotus strand), world-anger / doom track (Cyclops boast, Helios "seen by the Sun"), `satchel`/`hold`/`favor` via `applyDeltas`, `collectiveCheck` seam (Cyclops scene-2 collective blinding), `canAffordDraw` deny-not-clamp gate (any hold-drawing Dare).

### Established Patterns
- Favor moves **only via the gods** (Abide-6 default path; Sirens is the one flagged Dare-favor exception).
- Determinism invariant: no `rnd()`-family call in click handlers/timers — author is data-only, so this is preserved by construction.
- Give = sacrifice to the commons (you−1 → crew/hold+1), never moves favor.

### Integration Points
- `EPISODES.helios / cyclops / sirens / lotus` scene arrays — the four islands to author.
- Cyclops scene-2 collective gate rides the existing `collectiveCheck` mechanism; scene-3 is per-actor.
- Sirens Dare-favor must be recorded as an explicit exception (beat comment / marker), not an accident.

</code_context>

<specifics>
## Specific Ideas

The user's verbatim Helios round-1 template (the authoring anchor for tone + scale):

- **Abide:** 1 → "look for food, find nothing"; 3 → "pat a cow, trying not to see it as food"; 4 → "cast a line for fish; find nothing"; 6 → "find a patch of dandelions and fill your belly" (small stash gain).
- **Dare:** 1 → "kill a cow, share it with the crew — Helios MAD" (seen by the Sun → world-anger); 3 → "kill a cow, eat it alone. Helios condemns you −1 favor"; 4 → "kill a cow, Helios doesn't see; stash +1, hold +0"; 6 → "kill a cow, Helios doesn't see; stash +2, hold +4".

Guiding asymmetry (applies to every authored cell): **Dare** risks self+crew resources/favor for high upside; **Abide** is riskless, low-upside, and lethal if it's all you do; **Give** is riskless, sustains the crew, and never moves favor.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope. Adjacent work already routed elsewhere by the roadmap:
- Hades / Phaeacia / Ithaca verb retrofit → **Phase 3**.
- Death-spiral balance tuning + multi-seed sweep + cross-episode favor reconciliation → **Phase 3**.
- Interactive board → **Phase 4**.

</deferred>

---

*Phase: 2-themed-island-content-favor-law-reconciliation*
*Context gathered: 2026-07-25*
