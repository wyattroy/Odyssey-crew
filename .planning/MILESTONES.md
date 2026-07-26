# Milestones

## v1.1 Themed Episodes & Interactive Board (Shipped: 2026-07-26)

**Delivered:** The rules-complete v1.0 prototype became a *felt* game — every scene resolves through a declarative verb×face table carrying both a tuned payoff and a story beat, the whole voyage is played on a visual board instead of a text log, and a mid-milestone economy redesign (three verbs → two, three divine axes → one favor currency) finally killed the v1.0 death spiral.

**Phases completed:** 4 phases, 18 plans, 38 tasks
**Requirements:** 33/33 satisfied · **Verification:** all 4 phases passed · **Closeout:** verified_closeout
**Git range:** `a6412a4` → `fd8efcc` (101 commits since the v1.0 prototype)
**Timeline:** 2026-07-25 → 2026-07-26 (2 days)
**Code:** `index.html` 899 → 2,495 lines (+1,596 / −286); still one self-contained file, zero dependencies

### Key accomplishments

1. **Declarative effect engine** — one `beats` table per scene (verb × roll face → payoff + one-sentence story beat), one generic `resolveEffect`/`narrate` resolver, a fail-loud `validateBeats()` coverage gate, and a labelled `CONFIG` payoff palette.
2. **Sequential resolution against the commons** — blind commits stay simultaneous, but reveal resolves in fixed turn order via a single `resolutionOrder()` seam with a shared `canAffordDraw()` deny-not-clamp gate. Unaffordable draws are denied whole, never partially applied, never decided by a lot-cast.
3. **Four islands authored to their morals** — Helios/restraint, Cyclops/pride, Sirens/temptation, Lotus/forgetting, across 12 scenes, with the favor law reconciled everywhere.
4. **Two-verb, one-currency economy** (the unplanned headline) — Abide/Dare only; world-anger and Poseidon's curse folded into favor as the single divine currency, which is simultaneously the win condition, the revival lifeline, and the world's mood. All three anchors retrofitted onto the same grammar.
5. **Death spiral fixed and measured** — `sweep.mjs 80/200 --assert` clears every D-09 target: 0% all-dead (from ~50% of seeds), 93-94% full-crew-at-Ithaca with real survivor variance, 15-19 distinct winner-favor values, pious out-earning greedy ~8-9x on favor.
6. **Interactive board** — advancing boat on an 8-node track, draining marble bag, reveal-gated dice, clickable verbs in each player's own card, on-board narration and live crew status. A pure projection of state; `?seed=` determinism and blind-commit masking preserved, ship's log demoted to a collapsible panel rather than deleted.

### Known gaps carried forward

- **Thin survival margin** (BALANCE-03) — satisfied on direction, not magnitude: greedy 98% alive vs pious 96%. Favor is well contested; "cooperation is fragile" is not yet dramatic. 03-07 investigated and correctly stopped (raising `charon.toll` moved it the wrong way); the remaining levers were out of scope.
- **Bookkeeping debt** — `01-VERIFICATION.md` still reads `behavior_unverified: 2` though both items were closed downstream; `02-REVIEW.md` still reads `issues_found` on a critical Phase 3 resolved by deleting the code it described.
- **Live site still serves v1.0** — `wyattroy.github.io/Odyssey-crew` publishes from main's root.

Full close-out audit: `milestones/v1.1-MILESTONE-AUDIT.md` · Retrospective: `RETROSPECTIVE.md`

<details>
<summary>Per-plan execution log (18 plans, chronological)</summary>

*Note: this is a running log written plan-by-plan during execution, so some intermediate
statements were later superseded — the Sirens Dare-favor "sanctioned exception" was retired
in 03-04, and the 18% all-dead rate flagged in 03-02 was fixed by the 03-07 retune. The
curated summary above reflects the shipped state.*

- Declarative `beats` verb x face effect/narration table + one generic `resolveEffect`/`narrate` resolver + a fail-loud `validateBeats()` coverage gate + a labelled `CONFIG.fx` payoff palette, proven end-to-end on Helios "The Meadow" (tracer) and generalized to the stateful Cyclops "The Wine" via an `fx` escape hatch.
- Replaced the eat-phase's simultaneous bone-lot-cast hold shortfall with a single `resolutionOrder()` fixed-turn-order seam and a shared `canAffordDraw()` deny-not-clamp gate that both `eatPhase` and the Act reveal loop now spend the shared hold through — an unaffordable committed draw is denied whole, never partially applied, never decided by chance.
- CONFIG.fx gained big/huge payoff tiers; all three Cattle-of-Helios scenes now resolve entirely through beats with a non-decreasing Dare-6 bounty (stash+2/hold+4 → +4/+6 → +6/+6) and a matching Dare-1 wrath spike, proven by a new headless vm-based Node harness across a 10-seed sweep.
- Cyclops's three scenes now resolve entirely through beats as a pride escalation (trapped → collective blinding → individual escape), and its two shipped Dare-favor violations (the boast, the collective stake blinding) are retuned to grant zero favor — pride is punished with Poseidon's curse, never rewarded.
- Sirens's three scenes now resolve entirely through beats as a rewarded-temptation escalation (distant song → full lure → the reef), with the Dare-favor grant preserved and explicitly flagged in-data as the single sanctioned exception to the Abide-only favor law, plus a scene-escalating wreck risk on the worst Dare face.
- Lotus-Eaters authored to beats with Abide/Dare semantics fully inverted per D-04 — Abide now eats the lotus and risks an escalating (taste→drowse→strand) lotus-struck fate, Dare now hauls the struck back to the ship for zero favor, closing the third and final shipped Dare-favor violation (D-05).
- Whole-game audit confirms the favor-law and Dare/Abide/Give asymmetry hold across all four islands with zero unflagged violations — Sirens remains the sole sanctioned Dare-favor exception, all three prior violations (Cyclops boast, Cyclops blinding, Lotus rescue) stay reconciled, and a 7-seed 0-human sweep completes deterministically with validateBeats() passing every time; no index.html changes were required.
- Two-verb (Abide/Dare) + one-currency (favor) economy landed as a single vertical slice — CONFIG.econ/CONFIG.divine, engine, resolver, validator, and Helios's full 3-scene content re-authored end-to-end, with three new/upgraded measurement instruments (econcheck, parity, sweep) proving it.
- Generalized favor-revival (favorRevive/revivalRound, callable from any beat) shifts the permanent-loss condition to favor bankruptcy, and a near-full crew now earns a shorter-crossing bonus — but a pre-existing hold-economy fragility, previously masked by the old engine's silent permanent culling of unaffordable corpses, now surfaces as an 18% all-dead rate that 03-07's balance retune must address.
- Cyclops now reads as pride and cunning (guest-gift Abide vs. self-interested Dare) and Lotus keeps its forgetting-vs-the-voyage inversion (fruit-into-the-commons Abide vs. survival Dare) — both fully rebuilt on `econD()`+named `CONFIG.<episode>` kickers with escalating payoffs, replacing 03-01's mechanical interim conversion.
- Sirens now reads as rewarded temptation on two verbs (Dare unstops your ears for stash/kleos, Abide stays bound to the mast for hold+favor), its reef doom rewired onto crewFavor()/doomToll(); a single consolidated FAVOR LAW block replaces four scattered restatements and the whole-game audit found and fixed one real clawback bug, confirming favor stays contested but survival no longer is (03-07's tuning input).
- Hades and Phaeacia now play like the islands — a real Abide/Dare scene with commit-blind/throw/reveal, resolved through the exact same shared engine — while the bespoke Tiresias peek, the generalized revival round, and the favor-weighted gifts-only gift court all survive completely unregressed beneath the new scenes.
- All three Ithaca finale scenes (Beggar/Bow/Reckoning) now run on the two-verb grammar with the standing/bow-floor/pot-split mechanics intact beneath them, a homecoming reward for the crew that made it back, and a hardened, mechanically-proven always-reaches-a-winner guarantee — the last single-purpose "patience" prompt is gone, completing "exactly two verbs everywhere".
- Five CONFIG values (holdStart, charon.toll/hadesToll, econ.abideHold, econ.dareCaught, divine.doomFloorPerMate) retuned together so `sweep.mjs 80/200 --assert` clears every D-09 target — full-crew-at-Ithaca down from a 99% single-spike baseline to 93-94% with genuine survivor variance, the previously-dead zero-qualifier bow-floor fallback now fires, and PROJECT.md finally describes the two-verb, one-divine-currency game it ships.
- renderBoard() orchestrator + an advancing ⛵ boat marker on the 8-node voyage track + an upgraded crew row (temperament for every player, 🟢/🟠/💀 status), all rendering purely from state and proven byte-identical across three seeds before any interactivity lands.
- Crossing bag rendered as actual draining blue/white marbles from `state.crossing.bag`, plus a reveal-gated pip die (⚀–⚅) per acting player sourced from `p._boneShow` — both pure projections of already-decided reducer values, proven byte-identical across three seeds with botSpeed=0 never hanging.
- The board becomes the play/read surface: Dare/Abide/Give and eat satchel/hold render as large clickable buttons inside the acting player's own crew card (the existing ctrl-<id> commit seam, re-hosted — director mode no longer diverts them to the old #prompt box), and a new #narration card shows the current beat's story sentence sourced from the exact log() call that writes the ship's-log line.
- A masking audit (no logic changes — every board sub-renderer already honored the reveal-gated seam correctly) plus the ship's-log transcript demoted into a collapsible `<details>` panel, closing out Phase 4's Interactive Board with a proven-deterministic full voyage.

</details>

---
