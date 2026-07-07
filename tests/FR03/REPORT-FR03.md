# REPORT-01 - FR-03 Domain Testing and BVA Report
**Feature:** FR-03 - Forgot Password and Password Reset  
**Date:** 2026-07-07  
**User Type:** Guest / Unauthenticated User  
**SUT:** EShop  
**Skill:** REPORT-01

---

## 1. Feature Summary

FR-03 allows an unauthenticated user to reset an account password through two steps:

1. Submit an email address to request an OTP/reset token.
2. Submit the carried email, reset token, and new password to reset the account password.

Related endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/forgot-password` | Request an OTP/reset token |
| POST | `/api/reset-password` | Reset password using email, token, and new password |

Environment and UI evidence were captured in `tests/FR03/ENV-01.md`.

---

## 2. Domain Testing Summary

Domain variables:

- `email`
- `resetToken`
- `newPassword`

Domain partitioning produced 17 value partitions:

| Variable | Partition Count | Main Partitions |
|----------|-----------------|-----------------|
| `email` | 4 | existing account, empty, unregistered, malformed |
| `resetToken` | 6 | valid token, empty, incorrect, other-email token, non-numeric, wrong length |
| `newPassword` | 7 | strong, empty, too short, missing uppercase, missing lowercase, missing digit, missing special |

Detailed artifacts:

- `tests/FR03/DT-01-feature-understanding.md`
- `tests/FR03/DT-02-domain-identification.md`
- `tests/FR03/DT-03-domain-partitioning.md`
- `tests/FR03/DT-04-test-cases.md`

Domain test generation created 16 test cases covering all DT-03 partitions and dependency partitions.

---

## 3. BVA Summary

BVA was applied only where explicit or evidence-supported boundaries existed.

| Variable | BVA Decision | Reason |
|----------|--------------|--------|
| `email` | Excluded | No explicit length/order boundary in UI/API evidence |
| `resetToken` | Included as confirmation-needed | UI says 4 digits, API example shows 6 digits |
| `newPassword` | Included | Visible rule states minimum length 8 and one required character of each class |

BVA generated 15 test cases:

- `newPassword` length: 7, 8, 9
- required character-class counts: 0 and 1 for uppercase, lowercase, digit, special character
- `resetToken` length checks: 3, issued 4-digit token, 5, 6

Detailed artifact:

- `tests/FR03/BVA-01-boundary-analysis.md`

---

## 4. Execution Summary

### Domain Testing Execution

| Total | Passed | Failed | Not Executed |
|-------|--------|--------|--------------|
| 16 | 11 | 5 | 0 |

Detailed artifacts:

- `tests/FR03/execution.md`
- `tests/FR03/execution-results.json`
- `playwright/exec_fr03_dt.js`

### BVA Execution

| Total | Passed | Failed | Not Executed |
|-------|--------|--------|--------------|
| 15 | 8 | 7 | 0 |

Detailed artifacts:

- `tests/FR03/execution-bva.md`
- `tests/FR03/bva-execution-results.json`
- `playwright/exec_fr03_bva.js`

### Combined Execution

| Total | Passed | Failed | Not Executed |
|-------|--------|--------|--------------|
| 31 | 19 | 12 | 0 |

---

## 5. Bug Summary

One reproducible bug was reported.

| Bug ID | Title | Severity | Evidence |
|--------|-------|----------|----------|
| BUG-001 | Valid strong password is rejected during password reset | High | `bugs/FR03/BUG-001.md` |

Summary:

- Passwords such as `StrongPass1!`, `Password1!`, and `Aa1!aaaa` satisfy the visible rule but are rejected with the weak-password alert.
- The password is not changed: old password login still succeeds and attempted new password login fails.
- This defect also masked token-validation and token-length tests because password validation blocked the flow before reset-token behavior could be isolated.

GitHub issue:

- Not submitted automatically. `bugs/FR03/BUG-001.md` is the manual GitHub issue draft.

---

## 6. Evidence Links

| Evidence Type | Path |
|---------------|------|
| Environment report | `tests/FR03/ENV-01.md` |
| UI state JSON | `tests/FR03/ENV-01-ui-state.json` |
| Domain execution report | `tests/FR03/execution.md` |
| Domain raw results | `tests/FR03/execution-results.json` |
| BVA execution report | `tests/FR03/execution-bva.md` |
| BVA raw results | `tests/FR03/bva-execution-results.json` |
| Bug report | `bugs/FR03/BUG-001.md` |
| Gap analysis | `tests/FR03/GAP-01-gap-analysis.md` |
| Screenshots | `tests/FR03/screenshots/` |

Primary screenshots:

- `tests/FR03/screenshots/DT-TC001-after.png`
- `tests/FR03/screenshots/BVA-TC002-after.png`
- `tests/FR03/screenshots/BVA-TC005-after.png`
- `tests/FR03/screenshots/BVA-TC013-after.png`

---

## 7. AI Gap Analysis Summary

Detailed artifact:

- `tests/FR03/GAP-01-gap-analysis.md`

Main gaps:

| Issue | Final Result |
|-------|--------------|
| AI assumed `StrongPass1!` and similar values were valid strong passwords. | Execution showed they were rejected; reported as BUG-001. |
| Token-domain tests were masked by password validation. | Token validation behavior remains partly unresolved through UI. |
| Token length BVA was partly inconclusive. | Wrong-length token tests did not reset password, but weak-password alert appeared before token behavior could be isolated. |
| Backend password enforcement was not isolated. | UI rejection was confirmed; direct API weak-password enforcement still needs follow-up. |
| Email format validation was only partly clarified. | `not-an-email` was rejected as user not found, not explicit format validation. |

Follow-up testing recommended:

- Retest token-domain cases after fixing BUG-001 or identifying a UI-accepted valid password.
- Add API-only reset-password tests to isolate backend password enforcement.
- Add token reuse/single-use tests.
- Add more malformed email variants if email-format validation needs stronger evidence.

---

## 8. Final Status

| Item | Status |
|------|--------|
| Environment prepared | Completed |
| Domain Testing design | Completed |
| Domain Testing execution | Completed |
| Domain Testing bug reporting | Completed |
| BVA design | Completed |
| BVA execution | Completed |
| BVA bug reporting | Completed |
| Gap analysis | Completed |
| Report generation | Completed |

---

## 9. Report Validation

- [x] Domain Testing summarized.
- [x] Boundary Value Analysis summarized.
- [x] Execution results summarized.
- [x] Discovered bug summarized.
- [x] AI Gap Analysis included.
- [x] GitHub issue status referenced.
- [x] Evidence linked.
- [x] Only reviewed and verified information included.
