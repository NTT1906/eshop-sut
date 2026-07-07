# BUG-01 - Bug Reporting Summary
**Feature:** FR-03 - Forgot Password and Password Reset  
**Date:** 2026-07-07  
**Skill:** BUG-01  
**Input:** `tests/FR03/execution.md`, `tests/FR03/execution-results.json`

---

## Failed Test Case Review

| Failed TC | Failure Summary | Bug Decision |
|-----------|-----------------|--------------|
| DT-TC001 | `StrongPass1!` was rejected as weak; password was not reset. | Reported as BUG-001 |
| DT-TC006 | Token-domain check was masked because `StrongPass1!` was rejected first. | Covered as BUG-001 impact |
| DT-TC007 | Token/email mismatch check was masked because `StrongPass1!` was rejected first. | Covered as BUG-001 impact |
| DT-TC008 | Non-numeric token check was masked because `StrongPass1!` was rejected first. | Covered as BUG-001 impact |
| DT-TC009 | Wrong-length token check was masked because `StrongPass1!` was rejected first. | Covered as BUG-001 impact |

---

## Bug Reports Created

| Bug ID | Title | Severity | Source Failed Cases | Report |
|--------|-------|----------|---------------------|--------|
| BUG-001 | Valid strong password is rejected during password reset | High | DT-TC001, DT-TC006, DT-TC007, DT-TC008, DT-TC009 | `bugs/FR03/BUG-001.md` |

---

## Reproducibility Check

BUG-001 is considered reproducible because:

- DT-TC001 directly reproduced the failure on the successful reset path.
- DT-TC006 through DT-TC009 observed the same weak-password alert while attempting different token-domain cases.
- Execution confirmed that the password was not changed: old password login returned HTTP 200 and attempted new password login returned HTTP 401.

---

## Evidence Collected

| Evidence | Path |
|----------|------|
| Main failure screenshot | `tests/FR03/screenshots/DT-TC001-after.png` |
| Token-case masked failure screenshots | `tests/FR03/screenshots/DT-TC006-after.png` through `tests/FR03/screenshots/DT-TC009-after.png` |
| Execution report | `tests/FR03/execution.md` |
| Raw execution results | `tests/FR03/execution-results.json` |
| Execution script | `playwright/exec_fr03_dt.js` |

---

## Notes

- No GitHub issue was created automatically. `bugs/FR03/BUG-001.md` is a manual GitHub issue draft.
- Token-domain behavior should be retested after BUG-001 is fixed or after a valid password accepted by the UI is identified and reviewed.

---

## Human Review Checklist

- [x] Failed test cases reviewed.
- [x] Reproducible bug identified.
- [x] Severity assigned.
- [x] Evidence linked.
- [x] Manual GitHub issue draft generated.
