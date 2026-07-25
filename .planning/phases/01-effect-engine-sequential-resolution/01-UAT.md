---
status: testing
phase: 01-effect-engine-sequential-resolution
source: [01-VERIFICATION.md]
started: 2026-07-25T00:00:00Z
updated: 2026-07-25T00:00:00Z
---

## Current Test

number: 1
name: Determinism + completion after the beats/resolveEffect conversion
expected: |
  Opening index.html?seed=demo&auto=1&humans=0 (and 2–3 other seeds) reaches
  "THE VERDICT" with a determined winner and no "ENGINE ERROR" log line; running
  the same seed twice produces byte-identical ship's-logs.
awaiting: user response

## Tests

### 1. Determinism + completion — Plan 01-01 conversion
expected: Open index.html?seed=demo&auto=1&humans=0 in a browser; repeat with 2–3 more seeds; run one seed twice. Every run reaches "THE VERDICT" with a winner and no "ENGINE ERROR" line; same-seed reruns produce identical ship's-logs.
result: [pending]

### 2. Determinism + hostile-seed safety — Plan 01-02 resolution change
expected: Open the same seed twice and diff logs; then open with a hostile seed (e.g. ?seed=%%%%%%%%%%%%unicode-and-symbols&auto=1&humans=0) and an empty seed. Same-seed reruns are byte-identical and both reach a winner; hostile/empty seed runs complete without an unhandled exception.
result: [pending]

### 3. (Optional) Visual confirmation of the hold shortfall
expected: During a multi-seed run, find a crossing/scene where hold-reachers outnumber state.hold. Earlier-turn-order sailor(s) show "draws from the hold"; later one(s) show "reaches for the hold, but it has already run dry — denied, meal missed" (l-bad), never a partial feed.
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps
