---
schema_version: 1
open_count: 0
waived_count: 0
fixed_count: 1
total_count: 1
last_updated: 2026-07-26T21:29:26.096Z
---

# Broken Windows Ledger

> Cross-phase defect register. `/gsd-ship` blocks while `open_count > 0`.
> Waive with `gsd-tools windows waive <id> "<reason>"` (reason required).
> Mark fixed with `gsd-tools windows fixed <id>`.

| id | phase | kind | file | line | description | status | reason | recorded_at | resolved_at |
|----|-------|------|------|------|-------------|--------|--------|-------------|-------------|
| 1 | 03 | unmet-truth | index.html |  | sweep.mjs 40 all-dead rate is 18% (7/40) after 03-02, not lower than 03-01's 0% baseline (an artifact of the old engine's silent permanent population culling) — flagged for 03-07 balance retune (see 03-02-SUMMARY.md Deviations) | fixed |  | 2026-07-26T19:33:55.978Z | 2026-07-26T21:29:26.096Z |

````json
[
  {
    "id": 1,
    "kind": "unmet-truth",
    "phase": "03",
    "file": "index.html",
    "line": null,
    "description": "sweep.mjs 40 all-dead rate is 18% (7/40) after 03-02, not lower than 03-01's 0% baseline (an artifact of the old engine's silent permanent population culling) — flagged for 03-07 balance retune (see 03-02-SUMMARY.md Deviations)",
    "status": "fixed",
    "reason": "",
    "recorded_at": "2026-07-26T19:33:55.978Z",
    "resolved_at": "2026-07-26T21:29:26.096Z"
  }
]
````
