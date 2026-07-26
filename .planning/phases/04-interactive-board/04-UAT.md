---
status: complete
phase: 04-interactive-board
source: [04-VERIFICATION.md]
started: 2026-07-26T00:00:00Z
updated: 2026-07-26T00:00:00Z
note: UAT run by the orchestrator in Chrome (screenshots + a live click-test) + node harness — authorized overnight autonomy.
---

## Current Test

[testing complete]

## Tests

### 1. Voyage track + boat + crew row render from state
expected: 8-node track with advancing ⛵ boat, crew cards (temperament/rations/favor/status), shared hold.
result: pass
note: Screenshots at Troy / Cattle of Helios / The Sirens / Island? — boat advances, current node ringed, doom tracks surface.

### 2. Marble bag + dice
expected: crossing shows blue/white marbles draining; dice show the rolled face.
result: pass
note: seed iota screenshot shows CROSSING BAG 🔵×3 ⚪×2 + marble spheres; DOM caught 6 .marble / 4 .die per crossing. (Brief on screen — crossings resolve fast.)

### 3. Clickable Dare/Abide/Give (+ eat) on the board
expected: human decision points render as board buttons that drive the real commit path.
result: pass
note: Click-test — "Take 3 🍖" → P1 satchel 3/favor 4, advanced to beat 1, next eat-choice buttons appeared. No bot/human fork.

### 4. Narration surface + demoted log
expected: current beat text on board; ship's log in a collapsible details (not deleted).
result: pass
note: #narration shows beat text; #logPanel is a <details> (collapsed default, auto-open in director mode); transcript still written.

### 5. Determinism + masking + completion
expected: ?seed= byte-identical; 0-human auto completes; 2+humans+director-off no commit leak; single-file.
result: pass
note: 12/12-seed harness complete + validateBeats ok; same-seed identical; masking audit + 1-human test (only actor shows buttons); 1 <script> block.

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

None. (Marble-bag brief-linger noted as an optional polish in 04-VERIFICATION.md, not a gap.)
