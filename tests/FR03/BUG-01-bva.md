# BUG-01 - BVA Bug Reporting Summary
**Feature:** FR-03 - Forgot Password and Password Reset  
**Date:** 2026-07-07  
**Skill:** BUG-01  
**Input:** `tests/FR03/execution-bva.md`, `tests/FR03/bva-execution-results.json`

---

## Failed BVA Test Case Review

| Failed TC | Failure Summary | Bug Decision |
|-----------|-----------------|--------------|
| BVA-TC002 | Length-8 password `Aa1!aaaa` was rejected as weak. | Added as evidence to BUG-001 |
| BVA-TC003 | Length-9 password `Aa1!aaaaa` was rejected as weak. | Added as evidence to BUG-001 |
| BVA-TC005 | Password `Password1!` with required character classes at minimum was rejected as weak. | Added as evidence to BUG-001 |
| BVA-TC007 | Password `PASSWORd1!` with lowercase count at minimum was rejected as weak. | Added as evidence to BUG-001 |
| BVA-TC009 | Password `Password1!` with digit count at minimum was rejected as weak. | Added as evidence to BUG-001 |
| BVA-TC011 | Password `Password1!` with special-character count at minimum was rejected as weak. | Added as evidence to BUG-001 |
| BVA-TC013 | Actual issued 4-digit token plus valid length-8 password `Aa1!aaaa` was rejected as weak. | Added as evidence to BUG-001 |

---

## Bug Reports Updated

| Bug ID | Title | Severity | Source Failed Cases | Report |
|--------|-------|----------|---------------------|--------|
| BUG-001 | Valid strong password is rejected during password reset | High | DT-TC001, DT-TC006-DT-TC009, BVA-TC002, BVA-TC003, BVA-TC005, BVA-TC007, BVA-TC009, BVA-TC011, BVA-TC013 | `bugs/FR03/BUG-001.md` |

---

## Reproducibility Check

BUG-001 remains reproducible after BVA execution because multiple boundary-valid passwords were rejected with the same weak-password alert:

- minimum valid length 8;
- minimum + 1 length 9;
- one uppercase/lowercase/digit/special-character boundary cases;
- valid issued 4-digit token plus valid boundary password.

Execution confirmed the password was not changed: old password login returned HTTP 200 and attempted new password login returned HTTP 401 in the failed BVA cases.

---

## Evidence Collected

| Evidence | Path |
|----------|------|
| BVA execution report | `tests/FR03/execution-bva.md` |
| BVA raw results | `tests/FR03/bva-execution-results.json` |
| BVA screenshots | `tests/FR03/screenshots/BVA-TC002-after.png`, `BVA-TC003-after.png`, `BVA-TC005-after.png`, `BVA-TC007-after.png`, `BVA-TC009-after.png`, `BVA-TC011-after.png`, `BVA-TC013-after.png` |
| BVA execution script | `playwright/exec_fr03_bva.js` |

---

## Notes

- No new separate bug was created because all failed BVA cases reproduce the same password-validation defect already reported as BUG-001.
- Token-length behavior remains partially masked by BUG-001. Token boundary cases should be retested after the password-validation defect is fixed or after an accepted valid password is identified.
- No GitHub issue was created automatically. `bugs/FR03/BUG-001.md` remains the manual GitHub issue draft.

---

## Human Review Checklist

- [x] Failed BVA test cases reviewed.
- [x] Existing bug updated instead of duplicating the same defect.
- [x] Severity preserved.
- [x] BVA evidence linked.
- [x] Manual GitHub issue draft updated.
