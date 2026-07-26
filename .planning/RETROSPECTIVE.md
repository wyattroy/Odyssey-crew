# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.1 — Themed Episodes & Interactive Board

**Shipped:** 2026-07-26
**Phases:** 4 | **Plans:** 18 | **Tasks:** 38 | **Commits:** 101 | **Span:** 2 days

### What Was Built

- **A declarative effect engine.** One `beats` table per scene (verb × roll face → payoff + one-sentence story beat), one generic `resolveEffect`/`narrate` resolver, a fail-loud `validateBeats()` coverage gate, and a labelled `CONFIG` payoff palette. Replaced per-scene inline closures and hand-written strings.
- **Sequential resolution against the commons.** Blind commits stay simultaneous, but reveal resolves in fixed turn order through a single `resolutionOrder()` seam, with a shared `canAffordDraw()` deny-not-clamp gate. An unaffordable committed draw is denied whole — never partially applied, never decided by a lot-cast.
- **Four islands authored to their morals.** Helios/restraint, Cyclops/pride, Sirens/temptation, Lotus/forgetting — 12 scenes, every verb×face cell carrying both a tuned number and a story sentence.
- **A two-verb, one-currency economy.** The milestone's largest change, and unplanned: three verbs folded to Abide/Dare, and world-anger + Poseidon's curse folded into favor as the single divine currency — win condition, revival lifeline, and the world's mood all at once. All three anchors (Hades/Phaeacia/Ithaca) retrofitted onto the same grammar.
- **An interactive board.** Advancing boat on an 8-node voyage track, draining blue/white marble bag, reveal-gated pip dice, clickable verbs inside each player's own card, on-board narration, live crew status — a pure projection of state, with the ship's log demoted to a collapsible panel rather than deleted.

### What Worked

- **Tracer-first plans.** Every phase led with a single vertical slice (Helios "The Meadow" for the engine, `renderBoard()` for the board, Helios again for the economy fold) before generalizing. Every phase. This is the pattern that most consistently paid.
- **The pure-projection board architecture rescued an out-of-order execution.** Phase 4 shipped before Phase 3 and was therefore built and verified against a three-verb model with peril tracks that Phase 3 then deleted. The close-out audit found **zero** integration regressions — because the board reads from state rather than mirroring it, and never reads `state.episode`. Architecture absorbed a scheduling mistake.
- **Headless Node harnesses as the verification substrate.** `harness`/`parity`/`sweep`/`econcheck` in `scratchpad/`, all vm-context, none adding a dependency to `index.html`. They caught the 18% all-dead regression in 03-02 that source review missed entirely.
- **Self-critical SUMMARYs.** Phase 3's plan summaries named their own measured shortfalls rather than rounding them up — the thin survival margin was surfaced by the team that produced it, not discovered by an auditor. That is the behavior worth keeping.
- **Data discipline made a redesign cheap.** Folding three verbs into two touched every island and all three anchors, and it was still mostly a data migration — because payoffs lived in `CONFIG` and content lived in `beats`.

### What Was Inefficient

- **Executing Phase 4 before Phase 3 cost more than it saved.** It worked, but it left BOARD-04's requirement text describing a verb that no longer exists, forced a re-verification of the board against an economy that landed after it, and made the milestone audit necessary to prove nothing broke. The dependency graph said it was safe; the *design churn* graph said otherwise, and only the first was consulted.
- **Harness evidence had to be re-closed by a real browser later.** Every Phase 3 plan auto-resolved its `checkpoint:human-verify` gate with substituted static/headless evidence because no browser was available in the executor sandboxes, each recording an owed coverage item. All of them were then closed at once by `03-BROWSER-CHECK.md`. That worked, but it deferred a whole phase's visual risk to a single late pass.
- **Status files went stale behind the work.** At close, `01-VERIFICATION.md` still read `behavior_unverified: 2` (both closed downstream), `02-REVIEW.md` still read `issues_found` on a critical that Phase 3 had deleted the code for, and STATE.md's Pending Todos still claimed Phase 3 was unstarted. None was a real gap; all of it was noise the audit had to clear.
- **A dead button survived the whole milestone.** The setup-screen 🎲 re-roll threw a `TypeError` on every click since v1.0. Four phases of verification never caught it, because every instrument was headless or seeded and the setup screen is neither. Found by the close-out audit; fixed before tagging.

### Patterns Established

- **Tracer-first, then generalize** — prove the seam on one scene before authoring twelve.
- **`beats` + `CONFIG` split** — story text and tuned numbers are data; the resolver is the only code that reads them. Retuning is a CONFIG-only diff.
- **Named seams over inline logic** — `resolutionOrder()`, `canAffordDraw()`, `revivalRound()`, `renderBoard()`. Each is a single documented swap point, and each earned its keep when Phase 3 re-opened earlier work.
- **`fx` escape hatch** — when a flat delta can't express a scene's mechanic, drop to a function rather than bending the data model.
- **Headless harness per claim type** — completion (`harness`), determinism (`parity`), balance (`sweep`), traceability (`econcheck`). Each claim gets an instrument, not an argument.
- **Verification treats SUMMARY claims as hypotheses.** Phase 3's verifier re-ran every instrument fresh rather than trusting recorded exit codes. Keep this.

### Key Lessons

1. **Sequence phases by design churn, not just by dependency.** Phase 4 was technically independent of Phase 3 and still got invalidated by it. Ask "what might this phase's inputs *become*?", not only "what does this phase need?"
2. **A pure projection of state is worth the discipline.** It is the single reason an out-of-order board absorbed a total economy redesign for free. The `_`-prefixed-transients-only rule paid for itself.
3. **Headless verification substitutes for live verification; it doesn't replace it.** Everything the harnesses asserted was true. The one defect that reached a user was on the one screen no harness could reach.
4. **When a scope expansion targets the project's stated exit gate, take it.** The two-verb fold roughly doubled Phase 3 and re-opened three earlier phases. It was also the only thing that killed the death spiral — the actual reason the project exists.
5. **Reconcile status files at phase close, not at milestone close.** Four files were stale by the end; each was a minute's work in the moment and an audit finding later.
6. **Hand-tuning has a floor.** Five CONFIG values cleared every acceptance target, but the survival margin would not move — 03-07 tried, found `charon.toll` pushed it the wrong way, and correctly stopped. That is the boundary where the deferred simulation harness (SIM-01) earns its place.

### Cost Observations

- Model mix: adaptive profile (`model_profile: adaptive`); integration checker resolved to haiku at close.
- Config: `mode: yolo`, `granularity: coarse` — gates auto-approved throughout, which suited a solo single-file project and would suit a multi-contributor one much less.
- Notable: 18 plans across 2 days on one 2,495-line file. The single-file constraint forced every plan into its own wave (sequential, same-file conflicts), so parallelization was never available — and the tracer-first pattern is what kept sequential execution from being slow.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 0 | 0 | No GSD ceremony — build spec was rules-complete and served as requirements + roadmap |
| v1.1 | 4 | 18 | Full phase/plan/verification ceremony introduced; headless harness verification established; first milestone audit |

### Cumulative Quality

| Milestone | LOC (`index.html`) | Verification instruments | Zero-dep maintained |
|-----------|--------------------|--------------------------|---------------------|
| v1.0 | 899 | 0 | ✓ |
| v1.1 | 2,495 | 4 (harness/parity/sweep/econcheck) | ✓ |

### Top Lessons (Verified Across Milestones)

1. **The single-file, zero-dependency constraint keeps paying.** It survived a 2.8x growth and a core economy redesign, and it forced the `CONFIG`/`beats` data discipline that made the redesign affordable. (v1.0, v1.1)
2. *(Awaiting a third milestone to cross-validate further.)*
