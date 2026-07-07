# EXEC-01 - Domain Test Execution
**Feature:** FR-03 - Forgot Password and Password Reset  
**Date:** 2026-07-07  
**Skill:** EXEC-01  
**Input:** `DT-04-test-cases.md`  
**Execution Script:** `playwright/exec_fr03_dt.js`  
**Raw Results:** `tests/FR03/execution-results.json`

---

## Execution Environment

| Component | Value |
|-----------|-------|
| Frontend | `http://localhost:5173/forgot-password` |
| Backend | `http://localhost:3000` |
| Tool | Playwright Chromium |
| Run ID | `1783415625558` |
| Executed At | `2026-07-07T09:14:24.065Z` |

---

## Summary

| Total | Passed | Failed | Not Executed |
|-------|--------|--------|--------------|
| 16 | 11 | 5 | 0 |

---

## Execution Results

| TC ID | Expected | Actual | Status | Evidence |
|-------|----------|--------|--------|----------|
| DT-TC001 | OTP request succeeds; reset with valid token and strong password succeeds; new password works. | OTP step 2 appeared, but reset showed weak-password alert for `StrongPass1!`; login with new password returned HTTP 401 and old password still returned HTTP 200. | Fail | `tests/FR03/screenshots/DT-TC001-after.png` |
| DT-TC002 | Required-field validation prevents OTP request for empty email. | Browser required validation blocked empty email submission. | Pass | `tests/FR03/screenshots/DT-TC002-after.png` |
| DT-TC003 | Unregistered well-formed email is rejected and no token is produced. | Rejected with alert: `Lỗi: User not found`. | Pass | `tests/FR03/screenshots/DT-TC003-after.png` |
| DT-TC004 | Malformed email is rejected or fails safely without producing token. | No token was produced; alert shown: `Lỗi: User not found`. | Pass | `tests/FR03/screenshots/DT-TC004-after.png` |
| DT-TC005 | Required-field validation prevents reset for empty token. | Browser required validation blocked empty token; old password login still returned HTTP 200. | Pass | `tests/FR03/screenshots/DT-TC005-after.png` |
| DT-TC006 | Incorrect correctly shaped token is rejected and password remains unchanged. | Expected token-domain rejection, but UI first showed weak-password alert for `StrongPass1!`; old password still worked and new password did not. | Fail | `tests/FR03/screenshots/DT-TC006-after.png` |
| DT-TC007 | Token issued for Account B is rejected when used with Account A. | Expected token/email mismatch rejection, but UI first showed weak-password alert for `StrongPass1!`; old password still worked and new password did not. | Fail | `tests/FR03/screenshots/DT-TC007-after.png` |
| DT-TC008 | Non-numeric token is rejected or fails safely without resetting password. | Expected token-domain rejection, but UI first showed weak-password alert for `StrongPass1!`; old password still worked and new password did not. | Fail | `tests/FR03/screenshots/DT-TC008-after.png` |
| DT-TC009 | Wrong-length token is rejected or fails safely without resetting password. | Expected token-domain rejection, but UI first showed weak-password alert for `StrongPass1!`; old password still worked and new password did not. | Fail | `tests/FR03/screenshots/DT-TC009-after.png` |
| DT-TC010 | API reset without prior OTP is rejected and password remains unchanged. | API reset returned HTTP 400; old password login returned HTTP 200; new password login returned HTTP 401. | Pass | N/A |
| DT-TC011 | Required-field validation prevents reset for empty new password. | Browser required validation blocked empty password; old password login still returned HTTP 200. | Pass | `tests/FR03/screenshots/DT-TC011-after.png` |
| DT-TC012 | Password is rejected for being too short and password remains unchanged. | Rejected with weak-password alert; old password login still returned HTTP 200. | Pass | `tests/FR03/screenshots/DT-TC012-after.png` |
| DT-TC013 | Password is rejected for missing uppercase and password remains unchanged. | Rejected with weak-password alert; old password login still returned HTTP 200. | Pass | `tests/FR03/screenshots/DT-TC013-after.png` |
| DT-TC014 | Password is rejected for missing lowercase and password remains unchanged. | Rejected with weak-password alert; old password login still returned HTTP 200. | Pass | `tests/FR03/screenshots/DT-TC014-after.png` |
| DT-TC015 | Password is rejected for missing digit and password remains unchanged. | Rejected with weak-password alert; old password login still returned HTTP 200. | Pass | `tests/FR03/screenshots/DT-TC015-after.png` |
| DT-TC016 | Password is rejected for missing special character and password remains unchanged. | Rejected with weak-password alert; old password login still returned HTTP 200. | Pass | `tests/FR03/screenshots/DT-TC016-after.png` |

---

## Observations

- `StrongPass1!` was designed as a valid strong password, but the UI rejected it with the weak-password alert. This caused DT-TC001 to fail and masked the intended token-domain checks in DT-TC006 through DT-TC009.
- Empty required fields were blocked by browser required-field validation for `email`, `resetToken`, and `newPassword`.
- Unknown or malformed email values did not produce a reset token. Both showed `Lỗi: User not found`.
- API reset without a prior OTP returned HTTP 400 and left the original password unchanged.
- Failed cases are recorded here only. Bug report creation is reserved for the next `BUG-01` skill.

---

## Generated Evidence

| Artifact | Path |
|----------|------|
| Execution script | `playwright/exec_fr03_dt.js` |
| Raw execution JSON | `tests/FR03/execution-results.json` |
| Screenshots | `tests/FR03/screenshots/DT-TC001-after.png` through `tests/FR03/screenshots/DT-TC016-after.png`, except DT-TC010 which was API-only |

---

## Human Review Checklist

- [x] Every DT-04 test case executed.
- [x] Actual result recorded for every test case.
- [x] Pass/fail status recorded for every test case.
- [x] Screenshots captured for UI cases.
- [x] Failed cases preserved for later BUG-01 analysis.
