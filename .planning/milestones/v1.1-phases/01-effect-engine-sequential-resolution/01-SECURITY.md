---
phase: 1
slug: effect-engine-sequential-resolution
status: verified
# threats_open = count of OPEN threats at or above workflow.security_block_on severity (the blocking gate)
threats_open: 0
asvs_level: 1
created: 2026-07-25
---

# Phase 1 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.
> Context: single self-contained `index.html`, vanilla JS, **no network, no storage, no auth, no dependencies, no build**. The only external input is the `?seed=` URL parameter. Attack surface is minimal by construction.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| `?seed=` URL param → `makeRng` / init | The only external, author/attacker-controlled input; seeds all randomness. | Untrusted string |
| beats data → `resolveEffect` / `validateBeats` | Internal author-controlled effect tables; a malformed table must fail loud, not silently no-op. | Trusted-but-fallible data |
| committed action → sequential hold resolution | A committed hold-drawing action crossing the shared-hold boundary must be denied whole when unaffordable, never partially applied. | In-memory game state |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-01-01 | Tampering / DoS | `?seed=` → `makeRng` | low | mitigate | `makeRng` hashes any string deterministically, falls back to `Math.random` only on falsy input; seed is echoed via `seedTag.textContent` (index.html:349), **never** innerHTML — no DOM injection. Verified: no `innerHTML` interpolates the raw seed. | closed |
| T-01-02 | Tampering / silent failure | `validateBeats` / `resolveEffect` | high | mitigate | `validateBeats()` throws on any missing/dead declared cell (index.html:1109); `resolveEffect` never resolves a declared-but-broken cell to a silent `{}`. | closed |
| T-01-03 | Tampering / DoS | `?seed=` → `makeRng` (hostile/empty) | low | mitigate | Hostile (`%%%%unicode`) and empty seeds complete a 0-human run without exception and reach THE VERDICT; empty seed correctly uses a random (non-reproducible) RNG. Verified in UAT Test 2. | closed |
| T-01-04 | Tampering / integrity | sequential hold resolution (eat + act) | medium | mitigate | `canAffordDraw()` denies an unaffordable committed hold draw as a whole (no `applyDeltas`, no `fx`) — never clamped to a partial amount, no hidden negative-hold / half-fed state. Verified in code + UAT Tests 2/3. | closed |
| T-01-SC | Supply chain | package installs | low | accept | Not applicable — zero dependencies, no npm/pip/cargo install, no build, no network. Game stays one self-contained `index.html`. | closed |

*Status: open · closed · open — below high threshold (non-blocking)*
*Severity: critical > high > medium > low — only open threats at or above workflow.security_block_on (high) count toward threats_open*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| R-01 | T-01-SC | Zero-dependency, offline, single-file constraint is a locked project invariant — there is no install/build/network surface to secure. | wyattroy | 2026-07-25 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-25 | 5 | 5 | 0 | /gsd-secure-phase (orchestrator, ASVS L1 short-circuit — register authored at plan time, threats_open 0) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-25
