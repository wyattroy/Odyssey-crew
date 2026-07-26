---
phase: 04-interactive-board
verified: 2026-07-26T00:00:00Z
status: passed
score: goal achieved — all 9 requirements verified (source + live browser interaction + harness)
method: direct browser verification (Chrome @ http://localhost:8777) incl. a human click-test + node headless harness
behavior_unverified: 0
---

# Phase 4: Interactive Board — Verification

**Phase Goal:** The whole voyage is played on a visual board — boat, draining marble bag, live dice, clickable verbs, on-board narration and player status — a pure projection of state that preserves determinism, blind-commit masking, and a debuggable transcript.

**Status:** passed — verified by the orchestrator in a real browser (screenshots + an actual click-test that drove the game) plus the node harness. Executed out of roadmap order (before Phase 3) because the board depends only on Phase 1 and is a pure projection of state (it will render Phase-3 anchor content automatically once that lands).

## Requirements Coverage

| Req | Verdict | Evidence |
|-----|---------|----------|
| BOARD-01 voyage track + boat | ✓ | Screenshots: 8-node track Troy→islands→Hades→Phaeacia→Ithaca; ⛵ boat marker advances (seen at Troy, Cattle of Helios, The Sirens, Island?); current node gold-ringed; islands reveal names when reached. |
| BOARD-02 draining marble bag | ✓ | Screenshot (seed iota): CROSSING BAG 🔵×3 ⚪×2 with actual marble spheres rendered below; DOM caught 6 `.marble` (1 `.drawn`/greyed) each crossing. Crossings are short (land-heavy bag) so it's brief on screen. |
| BOARD-03 live dice | ✓ | `renderDice()` maps faces→pip glyphs; DOM caught 4 `.die`; reads reveal-gated `p._boneShow`. |
| BOARD-04 clickable verbs | ✓ | **Click-test:** at Troy P1's 6 choices rendered as buttons in P1's card; clicked "Take 3 🍖" → P1 satchel 3 / favor 4, game advanced to beat 1, next decision ("🍖 Eat my satchel / 🛢️ Reach for the hold") presented on the board. Drives the real `askResolve`/`collectCommits` path (no bot/human fork). |
| BOARD-05 narration surface | ✓ | `#narration` card shows the current beat's `tell` (e.g. "P4 fishes for a monster 🎲3 → +1🍖 · -1 hold") / "The voyage awaits its next beat…" idle. |
| BOARD-06 crew row | ✓ | Player cards show name, temperament (😈/😐/😊), 🍖 rations, 🫒 favor, 🟢/🟠/💀 status; shared 🛢️ hold shown once with a live "can't feed everyone" warning; episode doom tracks (HELIOS'S WRATH, THE ROCKS) surface too. |
| BOARD-07 pure projection | ✓ | renderBoard reads only `state`; board-only transients `_`-prefixed + cleared in `clearBones`; hooked existing render() call-sites. 12/12-seed harness completion; same-seed byte-identical. |
| BOARD-08 masking | ✓ | Audit: every board sub-renderer reads reveal-gated fields (`_boneShow`, gated ctrl slots), never `p.lastBone`/`p.commit` pre-reveal. In the 1-human test only the acting human showed buttons; bots showed no commits. |
| BOARD-09 log demoted + determinism | ✓ | `#logPanel` is a `<details>` (collapsed by default, auto-open in director mode) — NOT deleted; full transcript still written on 0-human runs. `?seed=` byte-identical; 0-human auto completes to a winner; single `<script>` block preserved. |

## Live verification

- **12/12-seed harness sweep** post-build: all reach THE VERDICT, `validateBeats` ok, no ENGINE ERROR. Same-seed replay byte-identical. `botSpeed=0` never hangs (animations snap instant).
- **Human click-test** (1 human): board buttons committed and advanced the game through the real reducer path; eat-phase choices also on-board.
- **No rng in render/click**: grep-confirmed across renderBoard/Bag/Dice/Narration/Players/Strip/Track and the click handlers.
- **Single self-contained index.html**, vanilla JS, offline — preserved.

## Post-completion enhancement — per-roll stakes preview (user request)

After the phase closed, the user flagged a real playability gap: on the board you can't choose Dare vs Abide without seeing the stakes. Added a read-only preview of each verb×face outcome inside the action boxes (commits `79d87ee`, `9cab79a`):
- Reads directly from the public `beats` table authored in Phase 2 — **no engine/RNG/state/masking change** (the hidden thing is the roll, not the payoff table). Determinism + harness unaffected.
- **Compact numeric** for the ~75% of cells whose effect is a plain delta (Helios `🎲6 +2🍖 +4🛢️`, Sirens favor/rocks, all Gives).
- **Targeted hybrid** (user's choice) for the ~25% `fx`-closure cells (mostly Lotus): each face shows the number PLUS the authored flavor `tell`, so hidden risk is legible (`🎲1 +2🍖 «…lotus-struck»`).
- New pure helpers `deltaStakes(d)` / `stakesLine(vt, p)` + `.stakes`/`.stk-*` CSS. Applies to every island verb decision; anchors inherit it once Phase 3 puts them on the verb grammar.
- Verified via live DOM inspection (Helios compact, Lotus flavor rows) + harness completion across seeds. (Chrome screenshot tool was throwing a serialization bug at the time, so this was DOM-verified rather than image-verified.)

## Notes / deferred

- The marble bag is on-screen only briefly per crossing (land-heavy bag → 1–2 draws then "Land ho!"). Functionally correct; if you want it to linger, a small post-crossing hold is a trivial follow-up.
- 04-04 logged a pre-existing setup-screen RNG detail to `04-interactive-board/deferred-items.md` (out of scope; unrelated to BOARD-08/09).
- Executed before Phase 3 — ROADMAP numeric order is 1→2→3→4; Phase 3 (anchors + balance) remains, awaiting your direction (see OVERNIGHT-HANDOFF.md).

---
*Verified: 2026-07-26 by orchestrator (browser click-test + harness)*
