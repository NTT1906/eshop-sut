# DT-03 - Domain Partitioning
**Feature:** FR-03 - Forgot Password and Password Reset  
**Date:** 2026-07-07  
**Skill:** DT-03  
**Input:** Reviewed `DT-02-domain-identification.md` + `REVIEW-01-of-DT-02.md`

---

## Partitioning Rules Applied

- Each partition receives a unique label.
- Partitions within the same variable are mutually exclusive.
- Partitions cover the observable domain identified in DT-02.
- Partitions are split where expected behavior or validation responsibility differs.
- Confirmation-needed partitions are retained because DT-02 explicitly marked them as unresolved but test-relevant.

---

## Variable 1: `email`

| Partition ID | Type | Label | Description | Example Value |
|--------------|------|-------|-------------|---------------|
| EMAIL-V1 | Valid | Existing account email | Non-empty email value associated with an existing account that can request a reset token | `fr03.user@example.com` |
| EMAIL-I1 | Invalid | Empty email | Blank / no email value submitted from the required UI field | `""` |
| EMAIL-I2 | Invalid | Unregistered well-formed email | Well-formed email value that does not correspond to an account | `not.registered@example.com` |
| EMAIL-I3 | Invalid candidate | Malformed email text | Text that is not in email format; exact enforcement is unresolved because the UI input type is `text` and no DOM pattern was observed | `not-an-email` |

**Rationale:**  
`email` must be split by account state because requesting an OTP for an existing account is different from requesting one for an unknown account. Empty input is separate because it exercises required-field behavior. Malformed text is kept separate from unregistered email because it tests format validation, which DT-02 marked as unresolved.

---

## Variable 2: `resetToken`

| Partition ID | Type | Label | Description | Example Value |
|--------------|------|-------|-------------|---------------|
| TOKEN-V1 | Valid | Current valid token for same email | Token returned by a successful OTP request and submitted with the same email carried into step 2 | Use token returned by step 1, e.g. `1132` |
| TOKEN-I1 | Invalid | Empty token | Blank token value in the required OTP field | `""` |
| TOKEN-I2 | Invalid | Incorrect correctly shaped token | Digit-only 4-character token value that matches the observed UI token shape but was not issued for the submitted email | `0000` |
| TOKEN-I3 | Invalid | Token for another email | Token issued for a different account/email than the reset request email | Token from Account B used with Account A |
| TOKEN-I4 | Invalid candidate | Non-numeric token | Token contains letters or symbols; UI label implies digits but DOM does not enforce numeric-only input | `abcd` |
| TOKEN-I5 | Invalid candidate | Wrong-length token | Digit-only token with a length different from the observed UI token length; token length is unresolved because UI says 4 digits while API example shows 6 digits | `123456` |

**Rationale:**  
`resetToken` behavior depends on both value correctness and the email-token relationship. Empty, correctly shaped but unissued, and other-email tokens exercise different validation paths. Non-numeric and wrong-length values are retained as confirmation-needed candidate partitions because the UI gives a digit/length hint but the DOM has no `pattern`, `minlength`, or `maxlength`, and the API example conflicts with the UI.

---

## Variable 3: `newPassword`

| Partition ID | Type | Label | Description | Example Value |
|--------------|------|-------|-------------|---------------|
| PASS-V1 | Valid | Strong password | At least 8 characters and includes uppercase, lowercase, digit, and special character | `NewPassword123!` |
| PASS-I1 | Invalid | Empty password | Blank password value in the required password field | `""` |
| PASS-I2 | Invalid | Too short | Fewer than 8 characters while still containing uppercase, lowercase, digit, and special character where possible | `Aa1!aaa` |
| PASS-I3 | Invalid | Missing uppercase | At least 8 characters, includes lowercase, digit, and special character, but no uppercase letter | `password1!` |
| PASS-I4 | Invalid | Missing lowercase | At least 8 characters, includes uppercase, digit, and special character, but no lowercase letter | `PASSWORD1!` |
| PASS-I5 | Invalid | Missing digit | At least 8 characters, includes uppercase, lowercase, and special character, but no digit | `Password!!` |
| PASS-I6 | Invalid | Missing special character | At least 8 characters, includes uppercase, lowercase, and digit, but no special character | `Password1` |

**Rationale:**  
DT-02 identified the visible password rule as length plus four character classes. Each rule receives its own invalid partition so later tests can show which rule is or is not enforced. Empty password is separate from too-short password because required-field handling may differ from password-strength validation.

---

## Dependency Partitions

These are not additional standalone variables, but they guide test-case combinations in DT-04.

| Dependency ID | Type | Label | Description |
|---------------|------|-------|-------------|
| DEP-V1 | Valid | Same email-token pair | `email` and `resetToken` come from the same successful OTP request |
| DEP-I1 | Invalid | Token/email mismatch | `resetToken` was issued for a different email than the email submitted in the reset request |
| DEP-I2 | Invalid | No prior OTP request | Reset is attempted without first obtaining a token for the email |
| DEP-C1 | Confirmation-needed | Password rule location | Invalid `newPassword` may be rejected by UI, backend, or both; execution must identify where enforcement occurs |

---

## Complete Partition Summary

| Variable | Partition ID | Type | Label |
|----------|--------------|------|-------|
| `email` | EMAIL-V1 | Valid | Existing account email |
| `email` | EMAIL-I1 | Invalid | Empty email |
| `email` | EMAIL-I2 | Invalid | Unregistered well-formed email |
| `email` | EMAIL-I3 | Invalid candidate | Malformed email text |
| `resetToken` | TOKEN-V1 | Valid | Current valid token for same email |
| `resetToken` | TOKEN-I1 | Invalid | Empty token |
| `resetToken` | TOKEN-I2 | Invalid | Incorrect correctly shaped token |
| `resetToken` | TOKEN-I3 | Invalid | Token for another email |
| `resetToken` | TOKEN-I4 | Invalid candidate | Non-numeric token |
| `resetToken` | TOKEN-I5 | Invalid candidate | Wrong-length token |
| `newPassword` | PASS-V1 | Valid | Strong password |
| `newPassword` | PASS-I1 | Invalid | Empty password |
| `newPassword` | PASS-I2 | Invalid | Too short |
| `newPassword` | PASS-I3 | Invalid | Missing uppercase |
| `newPassword` | PASS-I4 | Invalid | Missing lowercase |
| `newPassword` | PASS-I5 | Invalid | Missing digit |
| `newPassword` | PASS-I6 | Invalid | Missing special character |

**Total value partitions:** 17  
**Valid partitions:** 3  
**Invalid partitions:** 10  
**Invalid candidate partitions needing execution confirmation:** 4

---

## Traceability to DT-02

| DT-02 Domain Class | DT-03 Partition(s) |
|--------------------|--------------------|
| Existing account email | EMAIL-V1 |
| Empty email | EMAIL-I1 |
| Unregistered email | EMAIL-I2 |
| Malformed email text | EMAIL-I3 |
| Current valid token for same email | TOKEN-V1 |
| Empty token | TOKEN-I1 |
| Incorrect token | TOKEN-I2 |
| Token for another email | TOKEN-I3 |
| Malformed token | TOKEN-I4, TOKEN-I5 |
| Strong password | PASS-V1 |
| Empty password | PASS-I1 |
| Too short password | PASS-I2 |
| Missing uppercase | PASS-I3 |
| Missing lowercase | PASS-I4 |
| Missing digit | PASS-I5 |
| Missing special character | PASS-I6 |

---

## Human Review Checklist

- [x] Partitions are mutually exclusive within each variable.
- [x] Partitions cover the DT-02 domains.
- [x] No duplicated partitions.
- [x] Confirmation-needed behavior is labelled explicitly.
- [x] Dependencies are identified for later test-case combination.
