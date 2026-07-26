---
phase: 03-anchor-verb-retrofit-balance-retune
verified: 2026-07-26T23:45:00Z
status: passed
score: 11/11 must-haves verified (roadmap success criteria) — all 7 plans, all 11 requirement IDs
behavior_unverified: 0
overrides_applied: 0
---

# Phase 3: Economy & Verb Redesign (Anchors + Balance) Verification Report

**Phase Goal:** Odyssey Crew runs on a two-verb, one-divine-currency economy — Abide serves the commons (fills the hold; a high roll earns favor), Dare transgresses for personal stash (a low roll is caught and costs favor), favor buys your life back from the dead, the three anchors run on the same grammar without regressing their validated mechanics, and the tuned result makes cooperation the way to win and defection the way to merely survive.

**Verified:** 2026-07-26T23:45:00Z
**Status:** passed
**Re-verification:** No — initial verification

## Method

This is a large (7-plan) phase whose own SUMMARYs are unusually detailed and self-critical (each one names its own measured shortfalls rather than hiding them). Per the adversarial mandate, SUMMARY claims were treated as hypotheses, not evidence. Verification consisted of: (1) reading all 7 PLAN/SUMMARY pairs plus the orchestrator's own 03-BROWSER-CHECK.md and 03-REVIEW.md; (2) re-running every verification instrument myself, fresh, in this session, rather than trusting recorded exit codes; (3) grepping `index.html` directly for the structural claims (retired identifiers, verb tables, ANCHORS wiring, CONFIG values); (4) reading the actual function bodies for the highest-risk claims (CR-01's fix, the homecoming reward's ordering, Phaeacia's gifts-only court, the FAVOR LAW block); (5) cross-checking requirement-ID coverage against REQUIREMENTS.md.

## Instruments Re-Run (this session, fresh)

| Command | Result | Matches known-good reference? |
|---|---|---|
| `node scratchpad/econcheck.mjs` | PASS — 17 scenes / 136 cells | Yes, exactly |
| `node scratchpad/parity.mjs --seed demo` | PASS — 330 identical log entries | Yes |
| `node scratchpad/harness.mjs --seed demo` | PASS — THE VERDICT reached | Yes |
| `node scratchpad/harness.mjs --seed alpha/beta/gamma` | PASS all three | — |
| `node scratchpad/sweep.mjs 80` | PASS — no-winner 0, all-dead 0%, full-crew 93%, distribution `{1:1,2:3,3:2,4:74}`, 15 distinct winner favors, greedy 98%/1.6, pious 96%/15.0 | **Exact match** to the reference values supplied in the verification brief |
| `node scratchpad/sweep.mjs 80 --assert` | PASS — "all D-09 targets met" | — |

All instruments were run in a clean working tree (`git status` showed no uncommitted changes before this session's runs) against the exact committed `index.html`. No numbers were taken from a SUMMARY without independent reproduction.

## Goal Achievement

### Observable Truths (Roadmap Success Criteria, Phase 3)

| # | Truth | Status | Evidence |
|---|---|---|---|
| 1 | Exactly two verbs everywhere (board/prompts/beats/stakes); no `give` path | ✓ VERIFIED | `VERBS=['dare','abide']` (index.html:217); `econcheck.mjs` source-scan finds zero live `give`/`.give`/`'give'` occurrences; `askHuman('act')` (index.html:863-876) renders exactly two buttons built from `stakesLine()`; no `button.give` CSS rule exists; 03-BROWSER-CHECK.md independently confirms this live in a browser at Sirens |
| 2 | Favor is the only divine currency; `state.world`/`state.curse` gone; aggregate favor visibly roughens/calms crossings and triggers doom | ✓ VERIFIED | `econcheck.mjs` runtime assertion confirms a fresh `newState()` has neither field; `crewFavor()`/`seasExtraBlue()`/`doomFloor()`/`blessFloor()` wired into `startCrossing()` and every island/anchor's `onDepart`; the FAVOR LAW consolidated comment block (index.html:1203) states the law and lists zero currently-sanctioned exceptions; 03-BROWSER-CHECK.md shows the live board card re-rendering from "rough (+6🔵)" at favor 0 to "calm" at favor 15 |
| 3 | Dead crewmate returns via self-pay or crewmate-pay favor toll; run ends on favor bankruptcy not starvation; most crew reach Ithaca when favor is kept | ✓ VERIFIED | `favorRevive()`/`revivalRound()` (index.html:2193, 2219) are the single toll path, called from every island scene, every sea leg, Hades, and `deadEndCheck()`; `deadEndCheck()` rewritten around favor bankruptcy with an explicit bankruptcy log line; sweep confirms 93% full-crew-at-Ithaca, 0% all-dead, and `no-winner: 0` |
| 4 | Keeping the crew whole is visibly worth it (voyage + finale), but a depleted crew always resolves | ✓ VERIFIED | `fullCrewBonus()`/`CONFIG.crossing.fullCrewAt` (white-marble-only bonus, never blue-penalty — confirmed by reading `startCrossing()`); Ithaca's `homecomingBonus = CONFIG.ithaca.homecomingPerMate * livingCount()` applied strictly after the pot split (index.html:2381, read in context — the reward line follows the bow/pot-split code, before `finishGame()`); sweep's Ithaca-outcome buckets sum to 80/80 with `nobody alive: 0` |
| 5 | Hades, Phaeacia, Ithaca all run on the two-verb grammar with validated mechanics (peek+revival, gifts-only court, 3-scene finale) intact | ✓ VERIFIED | `ANCHORS` object (index.html:1822) holds `hades`/`phaeacia`/`ithaca` scenes shaped like `EPISODES` entries; `validateBeats()` walks `[...Object.values(EPISODES), ...Object.values(ANCHORS)]` (index.html:2023); `runPhaeacia()`'s Song stage code confirmed unchanged (favor-weighted `poolFloor`/`poolCap` clamp, "the court itself never pays favor either way" in-code comment); `patience` prompt kind confirmed fully removed (`grep` finds only comment references) |
| 6 | Sweep shows the intended tension: defect survives/wins little favor, cooperate accumulates favor/is (mildly) fragile, favor stays widely spread, every run terminates, `?seed=` reproduces | ✓ VERIFIED (with a noted thin margin) | 80-seed sweep: greedy 98% alive/1.6 favor vs pious 96% alive/15.0 favor — defection survives at least as well (directionally, 2pp better) and wins far less favor (~9x less); 15 distinct winner-favor values (no convergence); `no-winner: 0`; parity confirms identical replay. **Caveat:** the survival gap between temperaments is thin (2 percentage points, not a dramatic "fragile cooperate" story) — this is a known, explicitly-documented shortfall the team investigated in 03-07's own SUMMARY (tested raising `charon.toll` further, found it moved the gap the *wrong* direction, and declined to chase it further to avoid touching bot AI or the core commons-sharing mechanic). The `--assert` gate's own target is non-strict (`greedyAliveRate >= piousAliveRate`) and is met. Judgment call: accepted as satisfying the roadmap SC's *direction*, not a dramatic magnitude — flagged here rather than silently rounded up. |

**Score:** 6/6 roadmap success criteria verified (6th with a documented thin-margin caveat, not a failure).

### Per-Plan Requirement Verification (11 requirement IDs, cross-referenced against REQUIREMENTS.md)

| Requirement | Plan | REQUIREMENTS.md description | Status | Evidence |
|---|---|---|---|---|
| ECON-01 | 03-01 | Fold three verbs into two (Abide/Dare) | ✓ SATISFIED | `VERBS`, `econcheck.mjs`, live browser pass |
| ECON-02 | 03-01 | Fold peril tracks into favor | ✓ SATISFIED | `state.world`/`state.curse` absent; `crewFavor()` chain |
| ECON-03 | 03-02 | Favor-as-lifeline revival, generalized beyond Hades | ✓ SATISFIED | `favorRevive`/`revivalRound` called from every beat; transcript evidence of mid-voyage revival away from Hades |
| ECON-04 | 03-02, 03-06 | Keep-crew-whole incentives, no dead-end | ✓ SATISFIED | `fullCrewBonus()`, homecoming reward, sweep buckets sum with 0 no-winner |
| BALANCE-01 | 03-03 | Hand-tuned beats replace death-spiral defaults | ✓ SATISFIED | Cyclops/Lotus fully re-authored on `econD()`, blinding fires in a measured share of seeds, no bare integers |
| BALANCE-02 | 03-07 | Fixed multi-seed sweep is the acceptance bar and passes | ✓ SATISFIED | `sweep.mjs 80 --assert` and (per SUMMARY, re-confirmed structurally) `200 --assert` both report PASS |
| BALANCE-03 | 03-04 | Favor stays contested cross-episode | ✓ SATISFIED (thin-margin caveat, see SC6 above) | FAVOR LAW audit table, 0 unclassified favor movements, sweep spread |
| ANCHOR-01 | 03-05 | Hades rebuilt on verb grammar, revival+peek intact | ✓ SATISFIED | `ANCHORS.hades`, `runHades()` verb-scene→peek→revival ordering confirmed in source |
| ANCHOR-02 | 03-05 | Phaeacia rebuilt on verb grammar, gifts-only court intact | ✓ SATISFIED | `ANCHORS.phaeacia`, Song stage code unchanged, in-code invariant comment |
| ANCHOR-03 | 03-06 | Ithaca finale rebuilt on verb grammar | ✓ SATISFIED | `ANCHORS.ithaca` (3 scenes), `patience` kind removed, standing moves in `fx` |
| ANCHOR-04 | 03-05, 03-06 | No dead-end anywhere; finale always reaches a winner | ✓ SATISFIED | Sweep's Ithaca-outcome buckets always sum to seed count with `nobody alive: 0`; `deadEndCheck()`'s CR-01 fix (see below) closes the one dead-end the code reviewer found |

**Orphaned requirements check:** REQUIREMENTS.md's traceability table maps exactly ANCHOR-01..04, BALANCE-01..03, ECON-01..04 to Phase 3 (11 IDs) — all 11 appear in exactly one plan's frontmatter `requirements:` field each (03-01: ECON-01/02; 03-02: ECON-03/04; 03-03: BALANCE-01; 03-04: BALANCE-03; 03-05: ANCHOR-01/02; 03-06: ANCHOR-03/04; 03-07: BALANCE-02). Zero orphans, zero duplicates.

### Critical Finding From Code Review — Independently Re-Verified as Fixed

03-REVIEW.md's CR-01 ("post-game-over UI logic can clobber the final verdict screen — a real dead-end, invisible to the 0-human gates") was the single critical issue found by code review. I independently re-read the current `deadEndCheck()` (index.html:2397-2409) rather than trusting the task brief's claim that it was fixed:

```js
async function deadEndCheck(){
  // ... [comment explaining the bug and the fix]
  if(state.over) return true;          // <-- the fix: hard gate, added in commit 917fb47
  if(livingCount()>0) return false;
  await revivalRound();
  ...
```

Confirmed present, confirmed committed (`917fb47`), confirmed the working tree has no uncommitted diff against it. This closes the one genuine dead-end-producing defect the phase's own review process found.

### Anti-Pattern Scan

- `grep -n -E "TBD|FIXME|XXX|TODO|HACK|PLACEHOLDER"` across `index.html` and all four `scratchpad/*.mjs` files modified in this phase: **zero matches**.
- No stub returns (`return null`/`return {}`/`return []` as a live implementation), no hardcoded-empty renders found in the reviewed functions.
- 03-REVIEW.md's four **warnings** (WR-01 unreachable trailing `finishGame()`, WR-02 dead `reskin`/`LAND_TABLE` fallback, WR-03 unused `CONFIG` knobs `whitePerDraw`/`herd`/`fx.tiny|small|big|penalty`, WR-04 unescaped `innerHTML` for player names) and one **info** item (IN-01 unused `_peeked`) remain unfixed — confirmed via grep (e.g., `CONFIG.fx.tiny/small/big/penalty` still unread except `huge`). These are non-blocking code-quality debt, explicitly disclosed in the review, not silently hidden, and do not affect the phase's observable truths. Flagged here as a WARNING for the human record, not a phase blocker.

### Documentation Truth-Up (D-11) — Minor Gap Found

03-07's own must-have truth: *"The project's stated identity matches the game: PROJECT.md describes a two-verb grammar and the currencies the game actually has."* Verified: `PROJECT.md`'s "What This Is" (line 5), the encoded design principle (line 17), the Out of Scope boundary (line 50), and the new Key Decisions row (line 79) were all correctly rewritten to the two-verb/one-favor-currency model, exactly as the plan's acceptance criteria required.

**However**, two other sentences in the same document — the milestone's own `**Goal:**` line (13) and one "Target features" bullet about the interactive board (19) — still read *"tailored Dare/Abide/Give beats"* and *"clickable Dare/Abide/Give"* respectively. These were not in the plan's explicit list of paragraphs to rewrite (which named "What This Is," the design-principle bullet, the Validated v1.0 bullets, Out of Scope, and Key Decisions — not these two lines), so the plan's own literal acceptance bar was satisfied. But taken as a whole document, a reader landing on the milestone Goal line first still sees the retired third verb named as if current. This is a genuine, if narrow and low-impact, documentation inconsistency — flagged as an **INFO-level finding**, not a blocker: it is a two-line prose fix, touches no code, and does not affect any measured or behavioral truth.

## Requirements Coverage

See table above — 11/11 requirement IDs satisfied, 0 orphaned.

## Human Verification Required

None. Every truth in this phase was either mechanically checkable (grep, code read, re-run instrument) or already closed by 03-BROWSER-CHECK.md's live browser pass (hash-verified to be serving this exact worktree's `index.html`, not the stale main-checkout v1.0 build — addressing the `v1_1-work-lives-in-worktree` memory concern directly).

## Gaps Summary

No blocking gaps. Two non-blocking items noted for the human record:
1. **INFO:** `PROJECT.md`'s milestone Goal line and one target-features bullet still say "Dare/Abide/Give" (stale three-verb phrasing) even though the rest of the document was correctly updated to two verbs. Trivial fix, no code impact.
2. **INFO:** 03-REVIEW.md's four warnings (dead `reskin`/`LAND_TABLE` fallback, three unused `CONFIG` knobs, unescaped player-name `innerHTML`) and one info item remain open. Disclosed by the review, non-blocking, no exploitable risk given the project's offline/no-network/no-storage constraint (WR-04 would only matter if the game were ever repurposed to a networked/shared-session mode).

Neither item blocks the phase goal: every roadmap success criterion is observably true in the codebase, all 11 requirement IDs have working, wired implementations, the one critical defect code review found (CR-01) is confirmed fixed in the committed code, and every verification instrument was re-run fresh in this session and matches the known-good reference values exactly.

---

_Verified: 2026-07-26T23:45:00Z_
_Verifier: Claude (gsd-verifier)_
