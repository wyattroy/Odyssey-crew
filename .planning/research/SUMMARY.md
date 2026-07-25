# Research Synthesis: Odyssey Crew v1.1 (Themed Episodes & Interactive Board)

**Synthesized:** 2026-07-25  
**Research sources:** STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md  
**Scope:** Determine roadmap phases for v1.1 milestone: themed per-scene effect tables + interactive board + balance retune

---

## Executive Summary

Odyssey Crew v1.1 is an **additive, not rewrite** milestone layered onto a rules-complete, deterministic, seed-reproducible single-file prototype. All four researchers converged on a unified approach: extend the existing `EPISODES[].scenes[]` scaffolding with a declarative `beats` data structure (replacing ad-hoc `reskin` closures) that supplies both the hand-tuned effect deltas *and* the thematic narration needed to make the commons-tension game feel consequential. The board becomes a second, side-by-side renderer of the same events the text log already captures — no new state model, no parallel game logic, purely a presentational layer that reads from the existing game reducer's output.

**Core invariants that must survive:** (1) render-from-state architecture (board is a pure projection, never a source of truth); (2) single `rng()` seam and `?seed=` determinism (no hidden randomness in animations); (3) blind-commit masking (board layout must not leak pending bot/human choices); (4) the existing log as debuggable, greppable transcript (needed to validate balance changes and catch the known death-spiral). Breaking any of these is easier than it looks and will waste 2-3 weeks in repair cycles.

**Critical design-law conflict already exists:** Sirens and Lotus currently grant favor via **Dare**, directly violating the milestone's stated locked principle "Abide is the only favor path." This must be reconciled in REQUIREMENTS (before content authoring starts) as the first content task, not discovered mid-authoring when it's already propagated across new scenes.

**Three anchors (Hades/Phaeacia/Ithaca) do not use Dare/Abide/Give verb grammar today** — retrofitting them onto that grammar is a *real engine-extension task*, not a content-authoring pass. Recommended scope: author tuned narration for their *existing* outcomes (pay/stay, bone-throw, reckoning), not a new verb table. This needs explicit REQUIREMENTS decision.

---

## Key Findings

### A. Stack (from STACK.md)

**Recommended tech stack:** All browser-native, zero-dependency, inline in single HTML file.

| Component | Why Chosen |
|-----------|-----------|
| **DOM+CSS** for interactive board pieces | Small object count (tens of marbles, 4 dice, buttons); native click-handlers, CSS-transitions, accessibility free |
| **Inline SVG** for static backdrop art | Vector-scales crisply; styles with CSS custom properties; zero asset-build friction |
| **`<dialog>` element** | Native focus-trap, native Escape-to-close, native `::backdrop` dimming — strict UX upgrade for blind-commit masking |
| **`<details>`/`<summary>`** | Zero-JS collapsible narration log; keeps debuggable transcript available without dominating the player-facing board |
| **Popover API** | Declarative top-layer narration callouts (toasts/beat-lines) anchored to actor, light-dismiss, no manual z-index/backdrop JS |
| **CSS Container Queries** (size) | Board/marble-bag panel sizing responsive to its own width, not viewport — correct for pass-and-play on a shared device |
| **CSS transitions/keyframes** | GPU-compositable, off-main-thread, default animation tool per web.dev — class-toggle driven from reducer |
| **Web Animations API** | Only where game logic must `await` animation finishing; reuses existing `async/await` control-flow style |

**Load-bearing design constraint (determinism & RNG seam):** Every `rnd()` call stays inside synchronous reducers in the same order across seeds; board animation never calls `rnd()` for anything affecting displayed values. Dice spin is a fixed-duration CSS keyframe playing a *pre-decided* value, never a random-duration hidden roll.

**Per-scene effect/narration data pattern:** Co-locate a `beats` field on each scene (next to `verbs`/`reskin`). Shape: `beats: { dare: {1:{d:{you:-1,world:1}, tell:p=>`${p.name} is caught`}, 3:{...}, 4:{...}, 6:{...}}, abide: {...}, give: {...} }`. One shared `resolveEffect(scene, verb, bone)` returns `{delta, text}` uniformly. Keep `applyDeltas()` and `log()` exactly as-is.

**Confidence: MEDIUM–HIGH.** Web-platform/browser-API claims cross-checked against MDN/caniuse; architectural recommendations derived from direct read of existing `index.html`.

---

### B. Features (from FEATURES.md)

**MVP (P1) features for v1.1:**

| Feature | Why Required | Complexity |
|---------|--------------|-----------|
| **Visible marble bag** (discrete blue/white icons draining) | The core crossing-tension IS the shrinking bag | LOW–MED |
| **Dice/bone reveal moment** | Table-stakes for resolution feedback | LOW |
| **On-board narration** (text near actor) | Milestone's explicit ask | MED |
| **Boat/at-sea state** | Visual boat token on track | MED |
| **Full verb×face narration for 4 islands** (144 one-sentence lines + deltas) | Thematic depth + balance retune | MED–HIGH |
| **Sirens/Lotus favor-path fix** | Both violate locked law | LOW–MED |
| **Anchor narration** (Hades/Phaeacia/Ithaca outcomes) | Flavor for existing choices | MED |
| **Death-spiral re-validation** | Multi-seed transcript sweep | LOW |

**Critical:** Thematic tables + balance retune = same piece of work. Sirens/Lotus conflicts must be resolved before Phase 2 content authoring.

**Confidence: HIGH on codebase,** MEDIUM on general patterns.

---

### C. Architecture (from ARCHITECTURE.md)

**Board's core contract:** Pure projection of state, read-only at render time. No new orchestration layers.

**New components:**
- `beats` field on each scene (replaces scattered reskin closures)
- `resolveEffect(scene, verb, bone)` → returns `{delta, text}`
- `narrate()` centralizes string assembly
- `renderBoard()` + sub-renderers

**Build order (critical):**
1. Effect/narration data model first (beats + resolveEffect + narrate), validated through text log
2. Board scaffold second (renderBoard against generic data)
3. Remaining content authoring incremental
4. Final integration + smoke tests

**Anti-pattern: parallel "board state" object** — Everything board shows is derived from `state` at `render()` time; `_`-prefixed transients only.

**Confidence: HIGH.** Every line reference grounded in direct read of shipped index.html.

---

### D. Pitfalls (from PITFALLS.md)

**Critical pitfalls (block milestone if not prevented):**

| Pitfall | Prevention | Phase |
|---------|-----------|-------|
| **Board becomes source of truth** (state/render divergence) | `state` mutates first, animation illustrative only | Board-arch (design) |
| **Blind-commit masking breaks** (board leaks pre-reveal state) | Public vs. private zones; gate through `passGate`/`directorMode` | Board-arch + masked UAT |
| **Log replaced** (destroys debuggable transcript) | Keep `state.log` as-is; board is second renderer; hide not delete | Board-arch (design) |
| **Animation breaks `botSpeed=0`** (unattended runs stall) | Route all animation duration through same `botSpeed`; skip at 0 | Board-arch + timed run test |
| **RNG order coupled to UI/animation** (seed reproducibility breaks) | All `rnd()` in synchronous reducers only | Board-arch + seed-parity smoke test |

**High-impact pitfalls (scale if not caught early):**
- Favor-law violated by Sirens/Cyclops existing code (Phase 1: reconcile before content authoring)
- Death-spiral reintroduced by hand-tuning (Phase 2: multi-seed sweep exit criterion)
- Hades/Phaeacia/Ithaca mistaken for content-only (Phase 1: explicit scoping decision)
- Silent no-op cells from face-key typos (Phase 1: build validator tooling)

**Confidence: HIGH.** Grounded in shipped engine + documented playtest memory.

---

## Implications for Roadmap

### Suggested 5-Phase Structure

**Phase 1: Architecture Foundation (2–3 days)** — REQUIREMENTS + board-arch design contract. Lock: board-as-pure-projection, RNG in reducers, log survives, masking preserved, botSpeed=0 viable. Reconcile Sirens/Lotus favor conflicts. Scope Hades/Phaeacia/Ithaca (retrofit verb grammar vs. narration-only). Build validator tooling. **Risk: MEDIUM** (mistakes cascade). **Verification:** Architecture contract signed off; no code yet.

**Phase 2: Effects Data Model + Resolver (5–7 days)** — Convert Helios (pattern spike) → Sirens/Lotus (with favor reconciliation) to `beats` shape. Run multi-seed transcript sweep; grep for death-spiral signatures (hold reaching 0, or reaching Ithaca comfortably). Fix deltas iteratively. Acceptance: "hold survives to Ithaca, at least one seed produces starvation scare." **Risk: HIGH** (determines if death-spiral fixed). **Verification:** Multi-seed sweep grep passes; final CONFIG/beats recorded.

**Phase 3: Board Scaffold (5–7 days)** — Build `renderBoard()` + sub-renderers (boat, bag, dice, narration) reading existing state. Implement marble-bag visual, dice reveal, boat marker, narration strip. Wire `promptButtons` slots into board. Run `?auto=1&speed=0` before/after (no meaningful slowdown). Masked multi-human UAT: no pre-reveal leaks. **Risk: MEDIUM–HIGH** (animation timing easiest RNG/speed breakage). **Verification:** Seed-parity test passes; masked playtest passes.

**Phase 4: Content Authoring (7–10 days)** — Author `beats` for Cyclops/Lotus (108 cells) + anchors (36+ cells). Run validator per scene (face coverage, favor-law, CONFIG trace). Multi-seed sweep after every 3 scenes. Cross-episode favor-sum reconciliation (real spread in finals). **Risk: MEDIUM** (volume, but patterns established). **Verification:** Validator 100%; multi-seed sweep; favor spread >2x.

**Phase 5: Integration + Validation (2–3 days)** — Finalize `#log` disposition (hide not delete). Full regression suite (multi-seed, botSpeed parity, masked multi-human). Permanent seed-parity smoke test. Playtest release notes. **Risk: LOW** (verification only). **Verification:** All smoke tests pass; transcript verified.

**Total: ~3–4 weeks.** Phases 2 & 3 can overlap final week.

---

## Confidence Assessment

| Area | Confidence | Basis | Gaps |
|------|------------|-------|------|
| Stack | MEDIUM–HIGH | Cross-checked vs. MDN/caniuse; Feb 2025 snapshot | Popover on older Android |
| Features | HIGH | Direct codebase read; conflicts verified | Death-spiral acceptance criteria not quantified |
| Architecture | HIGH | Every line grounded in index.html | Anchor scoping decision blocked on Phase 1 |
| Pitfalls | HIGH | Shipped engine + playtest memory | Multi-seed matrix selection not detailed |

### Known Gaps for Phase 1

1. **Death-spiral acceptance criteria:** Quantify "hold pressure never bites" (e.g., "hold ≥ living-count throughout" vs. "hold drops <1 once")
2. **Anchor scoping:** Retrofit verb grammar (engine risk) vs. narration-only (recommended)?
3. **Multi-seed selection:** Which 3–5 seeds? Why those?
4. **Favor-law exceptions:** Sirens/Cyclops violations approved as documented exceptions, or bugs to fix?

---

## Research Flags by Phase

| Phase | Research? | Rationale |
|-------|-----------|-----------|
| 1 (Architecture) | YES, focused | Needs REQUIREMENTS decision on Hades/Phaeacia/Ithaca + death-spiral criteria |
| 2 (Effects) | NO | Pattern proven in shipped code; conversion mechanical |
| 3 (Board) | NO | Stack research covers all tech; architecture covers integration |
| 4 (Content) | MINOR | Validator tooling built in Phase 1, not mid-authoring |
| 5 (Integration) | NO | All components tested; this is composition |

---

## Recommendations

1. **Phase 1 must lock architecture before board code.** Board-as-pure-projection, RNG in reducers, log survives, masking preserved, botSpeed=0 viable = non-negotiable, easiest to enforce at design time.

2. **Reconcile Sirens/Lotus favor conflicts before Phase 2.** Cheaper now than propagating across 5 new stages.

3. **Death-spiral fix requires multi-seed sweep, not single playtest.** Phase 2 exit criterion: "multi-seed sweep grep passes, documented seeds on file."

4. **Anchors scoping is Phase-1 blocker.** Retrofit verbs vs. narration-only has different scope/risk. Lock early.

5. **Build validator tooling before Phase 4 authoring.** 200+ cells × no validator = 200+ hidden typos. Pre-build grep/lint checks.

6. **Keep the log.** Only debuggable artifact of unattended seeded runs. Hide behind toggle, never delete.

---

*Synthesis completed 2026-07-25*  
*For: Odyssey Crew v1.1 — Themed Episodes & Interactive Board*  
*Next: REQUIREMENTS.md & roadmap phase definition*
