---
phase: 03-anchor-verb-retrofit-balance-retune
kind: browser-verification
performed_by: execute-phase orchestrator
performed_at: 2026-07-26
closes:
  - "03-01 coverage item D4 (live visual pass)"
  - "03-05 coverage item D3 (live visual pass)"
  - "03-06 checkpoint task 3 (human-verify, auto-resolved with substituted static evidence)"
  - "03-07 coverage item D5 (live visual pass)"
---

# Phase 03 — Live Browser Verification

Every plan in this phase auto-resolved its `checkpoint:human-verify` gate with
substituted static/headless evidence, because no browser was available in the
executor sandboxes. Each recorded the live visual pass as an owed coverage item.
This document closes all of them with a real browser run.

## Build provenance

The static server on `:8777` was hash-verified to be serving **this worktree's**
`index.html`, not the main checkout (which still holds the v1.0 prototype):

```
worktree index.html: b589de053af299ea9d75015bedf6e862bd43c8e807faacc0633db63fb33760df
served   index.html: b589de053af299ea9d75015bedf6e862bd43c8e807faacc0633db63fb33760df
MATCH
```

## What was verified live

**1. Two verbs everywhere (ECON-01).** At The Sirens, the prompt renders exactly
two options with per-roll stakes previews:

- `⚔️ Dare — unstop your ears and listen` · `🎲1 -1🫒 · 🎲3 +1🍖 · 🎲4 +2🍖 · 🎲6 +3🍖`
- `🌿 Abide — keep to the ropes, mind a mate's wax` · `🎲1 — · 🎲3 +1🥫 · 🎲4 +1🥫 · 🎲6 +2🥫 +1🫒`

No third verb appears anywhere in the UI.

**2. Favor is the only divine currency, and it drives seas and doom (ECON-02).**
The board shows a single `CREW FAVOR WITH THE GODS 🫒` panel. At favor 0 the
line reads `seas: rough (+6🔵/crossing) · the gods have turned away — doom`.
After a cooperative spoils division took favor to 15, the same line re-rendered
live as `seas: calm · doom at 4`. No world-anger or Poseidon's-curse readout
exists anywhere on the board.

**3. Dare costs favor and never grants it.** Sirens' Dare shows `-1🫒` on face 1
and no favor grant on any face — the sanctioned Dare-favor exception retired in
03-04, confirmed visually rather than only in source.

**4. Abide serves the commons.** Sirens' Abide moves `🥫` (shared hold), not the
actor's own `🍖` satchel — the folded Give function, visible in the UI.

**5. Board surfaces hold + living crew (03-02).** `SHIP'S HOLD 🥫 2` with
`can't feed everyone who reaches (4 living)`, later `safe line: 2`.

**6. The 0-human unattended run reaches a verdict in a real browser, not just
in the headless VM harness.** `?seed=demo&humans=0&speed=0` ran the full
voyage — Troy → Sirens → Cyclops → Hades → Cattle of Helios → Lotus-Eaters →
Phaeacia → Ithaca — and terminated in `⚖️ Final reckoning` with
`Most beloved of the gods: P1 🏆`.

**7. Mortal stakes are visible post-retune (03-07).** That same demo seed ended
with 2 of 4 sailors dead — the retuned economy producing real losses where the
pre-retune build had every temperament surviving at 100%.

**8. No runtime errors.** Console was clean across the full unattended run
(tracking active from page load through the final reckoning).

## Not covered

This was a functional/mechanical pass on the two-verb economy. It is not a
visual-design or accessibility review, and it exercised one human-play seed
(`demo`) plus one full unattended seed. Balance claims rest on the multi-seed
sweep, not on these runs.
