# Phase 4: Interactive Board — UI Design Contract (UI-SPEC.md)

**Gathered:** 2026-07-26 (authored by orchestrator during overnight autonomy — grounded in the shipped aesthetic + BOARD-01..09 + the user's request "a game board that shows the boat's journey through the sea; shows the actual blue and white marbles left in the bag; shows the dice and their roll, has an actual basic UI.")
**Status:** Ready for planning
**Scope:** BOARD-01..09.

## Design System (match the shipped look — do NOT restyle the whole app)

The board must feel like the same game. Reuse the existing tokens/aesthetic seen in `index.html`:
- **Palette:** dark navy page bg (~`#0d1a2b`), slightly lighter card panels (~`#16273c`) with subtle 1px borders (~`#2a3f5c`), light text (~`#dce6f2`), muted secondary (~`#8aa0b8`), blue accent (~`#3f6fb0` / brighter on hover). Log classes already exist: `l-good` (green), `l-bad`/`l-die` (red/orange), `l-act`, `l-sys`, `l-eat`, `l-good`. Reuse them.
- **Type:** serif for headings (existing `h1/h2`), the existing UI sans for controls, monospace (`.mono`) for the ship's-log transcript and dice/marble counts.
- **Shape:** rounded cards (~12px), existing button styles. Emoji + CSS/SVG only — NO images, NO libraries, NO fonts beyond system. Everything inline in the single `index.html`.
- **Responsive:** the board must not force horizontal page scroll; wide elements (journey track) scroll inside their own container. Works at ~1000px+ width (desktop-first; the game is hotseat on one screen).

## Layout (top → bottom)

A single-column board that replaces the current stacked panels as the PRIMARY surface:

1. **Voyage track (BOARD-01)** — a horizontal SVG/flex "sea" strip spanning Troy → [island]×4 → Hades → Phaeacia → Ithaca (8 nodes, from `state.journey`). Each node is an icon+label chip (⚓ Troy, island emoji per episode once revealed, 🏛️ Hades, 🎁 Phaeacia, 🏝️ Ithaca). A **boat marker (⛵)** sits on the current node (`state.beatIndex`/journey position) and advances as the voyage progresses. Un-revealed islands show as `?` until reached. Current node highlighted (accent ring). Overflow-x: auto inside its container.

2. **Crossing strip (BOARD-02, BOARD-03)** — visible only during a crossing (`state.phase`/`state.crossing`). Shows the **marble bag** as actual round marbles: blue = sea, white = land, rendered from `state.crossing.bag` contents, and they **visibly drain** (a marble leaves / greys out) as each is drawn. The **dice/bone** area shows the live rolled face(s) as pip dice (⚀–⚅ or CSS pip dice) for the current roll (`p.lastBone` / `p._boneShow`), revealed in `resolutionOrder()` order.

3. **Crew row (BOARD-06)** — the existing per-player cards, upgraded: each shows name, temperament (only its emoji/label — greedy/balanced/pious), **favor (🫒 N)**, **hold/rations context**, and **alive/starving/dead** status (🟢/🟠/💀). The shared **hold** (🛢️ N) is shown once, prominently (it's the commons). Active/acting player highlighted.

4. **Action bar (BOARD-04)** — at each human decision point the prototype currently prompts, render **Dare / Abide / Give** as three large clickable buttons on the board (with the verb's scene-specific label when the scene provides one, e.g. Helios "slaughter a cow" vs "forage"). Clicking commits (routes to the SAME reducer path the current prompt uses — do NOT fork bot/human logic). Disabled/greyed when the player can't act (starving/lotus-struck). Eat-phase choices (satchel/hold) render here too when relevant.

5. **Narration surface (BOARD-05)** — a "current beat" area that shows the latest scene beat's story `tell` text prominently (the `narrate()` output), so the board — not the raw log — is what you read to follow the game. Large, readable, uses the beat's `cls` color.

6. **Ship's log — demoted (BOARD-09)** — the existing `#log` transcript moves into a **collapsible `<details>` panel** ("📜 Ship's log", closed by default; auto-open in director mode). NOT deleted — the seeded 0-human unattended run still writes the full transcript so it stays debuggable and diffable.

## Behavioral contracts (MANDATORY — these are the hard part)

- **Pure projection (BOARD-07):** the board renders entirely from existing `state`. NO parallel/duplicate game state. Board-only visual transients use the existing `_`-prefixed convention (`p._boneShow`, `p._delta`, and new `_`-prefixed fields cleared per phase via the existing `clearBones()`-style reset). A `renderBoard()` (or extended `render()`) redraws from state at the existing call sites (`actPhase`/`eatPhase`/`runCrossing` already call `render()` after each mutation) — hook there, do NOT invent an animation state machine.
- **Determinism (BOARD-09):** NO `rnd()`-family call anywhere in a render/click/animation/`requestAnimationFrame`/`setTimeout` callback. All randomness stays in the reducers (already true). Animations derive ONLY from already-decided values (a marble already drawn, a bone already rolled). `?seed=` must still reproduce byte-identical games; the 0-human `auto=1` seeded run must still complete to a winner unattended. Animations must be skippable/instant when `botSpeed=0` (auto mode) so headless/auto runs don't hang.
- **Masking (BOARD-08):** the board must honor the existing blind-commit masking. During `collectCommits`, with 2+ humans and director-mode OFF, committed verbs/dice for other players must NOT be shown until reveal — public zones (favor, hold, alive/dead, boat position) render freely; the commit/dice zones are gated until `passGate`/reveal, exactly as the current text UI is. Director mode (and 0/1-human rules) reveal as today. Do NOT leak bot commits either.
- **Non-regression:** the full voyage still runs end-to-end (Troy→islands→Hades→Phaeacia→Ithaca), no dead-ends, single self-contained `index.html`, offline, vanilla JS.

## Build order (tracer-first)

1. **Tracer:** `renderBoard()` scaffold + the voyage track (boat on nodes) + upgraded crew row (favor/hold/status) rendering purely from state, verified by a screenshot + a passing 0-human seeded run + `?seed=` parity. Establishes the pure-projection + determinism contracts before any interactivity.
2. Crossing strip: marble bag drain + live dice.
3. Action bar: clickable Dare/Abide/Give (+ eat choices) wired to the existing commit path; narration surface.
4. Masking zones (public vs gated) + director-mode reveal.
5. Log demotion to `<details>` + final determinism/masking/regression pass.

## Acceptance (screenshot-verifiable + headless)

- A screenshot shows the boat on the journey track, the crew row with favor/hold/status, and (mid-crossing) the draining marble bag + dice.
- Clicking Dare/Abide/Give as a human advances the game identically to the current prompt path.
- `?seed=demo&auto=1&humans=0&speed=0` still completes to a winner with no ENGINE ERROR (headless harness + browser).
- Same seed twice → identical transcript. With 2 humans + director off, no pre-reveal commit leak.

---
*Phase: 4-interactive-board*
*UI-SPEC authored: 2026-07-26*
