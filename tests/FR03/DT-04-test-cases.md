# DT-04 - Domain Test Case Generation
**Feature:** FR-03 - Forgot Password and Password Reset  
**Date:** 2026-07-07  
**Skill:** DT-04  
**Input:** Reviewed `DT-03-domain-partitioning.md` + `REVIEW-01-of-DT-03.md`

---

## Test Design Rules

- Use one representative value per partition unless dependency coverage requires an additional combination.
- Keep one invalid partition as the main fault per test case where practical.
- Use fresh test accounts/tokens for reset cases so tests do not depend on token reuse behavior.
- Treat confirmation-needed partitions as tests that clarify actual SUT behavior during `EXEC-01`.
- These are designed test cases only; they have not been executed in this skill.

---

## Test Data Conventions

| Symbol | Meaning |
|--------|---------|
| Account A | Existing registered account used for most successful OTP requests |
| Account B | Separate registered account used to test token/email mismatch |
| `tokenA` | OTP/reset token returned for Account A |
| `tokenB` | OTP/reset token returned for Account B |
| `StrongPass1!` | Representative strong password satisfying the visible password rule |

For UI reset tests, first request OTP for the target account through step 1 unless the test case explicitly states otherwise.

---

## Domain Test Cases

| TC ID | Input | Expected Result | Covered Domain | Business Rule |
|-------|-------|-----------------|----------------|---------------|
| DT-TC001 | Step 1: submit existing Account A email. Step 2: submit `tokenA` and `StrongPass1!`. | OTP request succeeds, step 2 appears, password reset succeeds, and user is sent to login/success flow. | EMAIL-V1, TOKEN-V1, PASS-V1, DEP-V1 | BR-01, BR-02, BR-03, BR-04, BR-05, BR-08 |
| DT-TC002 | Step 1: leave `email` empty and click "Lấy mã OTP". | Required-field validation prevents OTP request; user remains on step 1 and no reset token is produced. | EMAIL-I1 | BR-02 |
| DT-TC003 | Step 1: submit `not.registered@example.com`. | OTP request is rejected; user remains on step 1 and no reset token is produced. | EMAIL-I2 | BR-02, BR-03 |
| DT-TC004 | Step 1: submit malformed email text `not-an-email`. | System should reject the email value or fail safely without producing a reset token; actual format enforcement must be confirmed during execution. | EMAIL-I3 | BR-02, OQ-02 |
| DT-TC005 | Setup: request OTP for Account A. Step 2: leave `resetToken` empty and submit `StrongPass1!`. | Required-field validation prevents reset; password remains unchanged. | TOKEN-I1 | BR-04, BR-05 |
| DT-TC006 | Setup: request OTP for Account A. Step 2: submit `0000` as reset token and `StrongPass1!`. | Reset is rejected because the correctly shaped token was not issued for Account A; password remains unchanged. | TOKEN-I2 | BR-04, BR-05 |
| DT-TC007 | Setup: request OTP for Account A and Account B. Step 2 for Account A: submit `tokenB` and `StrongPass1!`. | Reset is rejected because token/email pair does not match; Account A password remains unchanged. | TOKEN-I3, DEP-I1 | BR-05, ASM-01 |
| DT-TC008 | Setup: request OTP for Account A. Step 2: submit `abcd` as reset token and `StrongPass1!`. | System should reject non-numeric token input or fail safely without resetting password; actual token-shape enforcement must be confirmed. | TOKEN-I4 | BR-04, BR-06 |
| DT-TC009 | Setup: request OTP for Account A. Step 2: submit `123456` as reset token and `StrongPass1!`. | System should reject wrong-length token input or fail safely without resetting password; execution should clarify UI 4-digit vs API 6-digit mismatch. | TOKEN-I5 | BR-04, BR-06, BR-07, OQ-01 |
| DT-TC010 | API-level black-box reset request without first requesting OTP: submit Account A email, `0000`, and `StrongPass1!` to `/api/reset-password`. | Reset is rejected because no current token exists for the account; password remains unchanged. | DEP-I2 | BR-05, ASM-01 |
| DT-TC011 | Setup: request OTP for Account A. Step 2: submit `tokenA` and leave `newPassword` empty. | Required-field validation prevents reset; password remains unchanged. | PASS-I1 | BR-04, BR-08 |
| DT-TC012 | Setup: request OTP for Account A. Step 2: submit `tokenA` and `Aa1!aaa`. | Password is rejected as too short; password remains unchanged. | PASS-I2 | BR-08, DEP-C1 |
| DT-TC013 | Setup: request OTP for Account A. Step 2: submit `tokenA` and `password1!`. | Password is rejected for missing uppercase; password remains unchanged. | PASS-I3 | BR-08, DEP-C1 |
| DT-TC014 | Setup: request OTP for Account A. Step 2: submit `tokenA` and `PASSWORD1!`. | Password is rejected for missing lowercase; password remains unchanged. | PASS-I4 | BR-08, DEP-C1 |
| DT-TC015 | Setup: request OTP for Account A. Step 2: submit `tokenA` and `Password!!`. | Password is rejected for missing digit; password remains unchanged. | PASS-I5 | BR-08, DEP-C1 |
| DT-TC016 | Setup: request OTP for Account A. Step 2: submit `tokenA` and `Password1`. | Password is rejected for missing special character; password remains unchanged. | PASS-I6 | BR-08, DEP-C1 |

---

## Coverage Matrix

| Partition ID | Covered By |
|--------------|------------|
| EMAIL-V1 | DT-TC001 |
| EMAIL-I1 | DT-TC002 |
| EMAIL-I2 | DT-TC003 |
| EMAIL-I3 | DT-TC004 |
| TOKEN-V1 | DT-TC001 |
| TOKEN-I1 | DT-TC005 |
| TOKEN-I2 | DT-TC006 |
| TOKEN-I3 | DT-TC007 |
| TOKEN-I4 | DT-TC008 |
| TOKEN-I5 | DT-TC009 |
| PASS-V1 | DT-TC001 |
| PASS-I1 | DT-TC011 |
| PASS-I2 | DT-TC012 |
| PASS-I3 | DT-TC013 |
| PASS-I4 | DT-TC014 |
| PASS-I5 | DT-TC015 |
| PASS-I6 | DT-TC016 |
| DEP-V1 | DT-TC001 |
| DEP-I1 | DT-TC007 |
| DEP-I2 | DT-TC010 |
| DEP-C1 | DT-TC012, DT-TC013, DT-TC014, DT-TC015, DT-TC016 |

---

## Business Rule Coverage

| Business Rule / Question | Covered By |
|--------------------------|------------|
| BR-01: Feature available to unauthenticated user | DT-TC001 |
| BR-02: Step 1 requires `email` | DT-TC001, DT-TC002, DT-TC003, DT-TC004 |
| BR-03: Successful OTP request returns token and advances to step 2 | DT-TC001 |
| BR-04: Step 2 requires `resetToken` and `newPassword` | DT-TC001, DT-TC005, DT-TC011 |
| BR-05: Reset submits `email`, `resetToken`, and `newPassword` together | DT-TC001, DT-TC006, DT-TC007, DT-TC010 |
| BR-06: UI describes OTP as 4 digits | DT-TC008, DT-TC009 |
| BR-07: API example shows 6-digit reset token | DT-TC009 |
| BR-08: New password complexity rule | DT-TC001, DT-TC011, DT-TC012, DT-TC013, DT-TC014, DT-TC015, DT-TC016 |
| OQ-01: 4-digit UI token vs 6-digit API example | DT-TC009 |
| OQ-02: Email format enforcement | DT-TC004 |
| OQ-04: Password rule enforced by UI/backend/both | DT-TC012, DT-TC013, DT-TC014, DT-TC015, DT-TC016 |

---

## Execution Notes for EXEC-01

- DT-TC001 should verify the post-reset credential by logging in with the new password if the workflow allows it.
- DT-TC007 requires two accounts and two OTP requests so token/email mismatch is tested cleanly.
- DT-TC010 is API-level because the UI does not expose step 2 without a prior successful OTP request.
- Password invalid cases should record whether the rejection happens in the browser UI, the backend API, or both.
- Confirmation-needed candidate tests are expected to clarify actual behavior; if the SUT accepts malformed email, malformed token, wrong-length token, or weak password, those results should be reviewed as potential bugs or specification gaps.

---

## Human Review Checklist

- [x] Every DT-03 partition is covered.
- [x] Every dependency partition is covered.
- [x] Every DT-01 business rule is exercised.
- [x] No duplicate test cases.
- [x] Confirmation-needed behavior is explicitly identified for execution.
