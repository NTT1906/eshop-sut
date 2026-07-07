# DT-02 - Domain Identification
**Feature:** FR-03 - Forgot Password and Password Reset  
**Date:** 2026-07-07  
**Skill:** DT-02  
**Input:** Reviewed `DT-01-feature-understanding.md` + `REVIEW-01-of-DT-01.md`

---

## Scope

This artifact identifies the input domains for Domain Testing. It uses only reviewed DT-01 evidence and keeps unresolved rules explicit.

Domain variables from DT-01:

- `email`
- `resetToken`
- `newPassword`

Hidden/state-carried input:

- `email` is entered visibly in step 1, then carried forward by the application state and submitted again in step 2 to `POST /api/reset-password`. It remains part of the reset domain even though it is not a visible field on the step 2 form.

Excluded from value-domain testing:

- `requestOtpAction`
- `resetPasswordAction`
- `← Quay lại`
- static labels, messages, header navigation, and footer

---

## Domain Identification Table

| Variable | Type | Valid Domain | Invalid Domain | Evidence |
|----------|------|--------------|----------------|----------|
| `email` | String / text | A non-empty email address belonging to an existing account that can request a reset token. Example format from API: `test@domain.com`. | Empty value; email value not associated with an account; malformed email-like text is a candidate invalid domain but format enforcement is not confirmed. | ENV-01: field "Nhập Email của bạn", DOM type `text`, `required=true`, no `pattern`; API: `/api/forgot-password` body contains `email`; DT-01 PRE-04 and OQ-02. |
| `resetToken` | String / text | A reset token returned by a successful OTP request for the same email used in the reset request. ENV-01 observed a 4-digit token display; API example shows a 6-digit token, so exact length is unresolved. | Empty value; incorrect token; token not issued for the submitted email; malformed token value such as non-numeric text is a candidate invalid domain because UI label says "4 số", but no DOM pattern confirms numeric-only validation. | ENV-01: field "Mã OTP (4 số)", DOM type `text`, `required=true`, no `pattern`; ENV-01 observed `Mã OTP của bạn là: 1132`; API: `/api/reset-password` body contains `resetToken`; DT-01 BR-06, BR-07, OQ-01. |
| `newPassword` | Password string | A non-empty password satisfying the visible password rule recorded in feature input: at least 8 characters, uppercase, lowercase, digit, and special character. API example: `NewPassword123!`. | Empty value; fewer than 8 characters; missing uppercase; missing lowercase; missing digit; missing special character. Backend enforcement is not confirmed yet. | ENV-01: field "Mật khẩu mới", DOM type `password`, `required=true`, no `minlength`, `maxlength`, or `pattern`; FEATURE_INPUT_FR03/DT-01 BR-08 records visible weak-password alert rule; DT-01 OQ-04. |

---

## Variable Details

### Variable 1: `email`

| Attribute | Value | Evidence |
|-----------|-------|----------|
| Data type | String / text | ENV-01 DOM capture: `type="text"` |
| Required | Yes | ENV-01 DOM capture: `required=true` |
| Min length | Not specified | ENV-01: no `minlength` |
| Max length | Not specified | ENV-01: no `maxlength` |
| Format constraint | Not specified in DOM; implied by field name and API example | API examples use email format; DT-01 OQ-02 records uncertainty |
| Account state dependency | Existing account required for successful OTP flow | ENV-01 used a temporary registered account before OTP request |
| Step 2 state dependency | Same email is reused for password reset after OTP request | API reset body requires `email`; DT-01 BR-05 states reset submission uses `email`, `resetToken`, and `newPassword` together |

| Domain Class | Type | Description |
|--------------|------|-------------|
| Existing account email | Valid | Non-empty email value associated with an account eligible for OTP request |
| Empty email | Invalid | Blank input; required field should prevent/deny submission |
| Unregistered email | Invalid | Well-formed email value that does not correspond to an account |
| Malformed email text | Invalid candidate | Text that is not in email format; expected invalid by field semantics, but exact enforcement needs execution confirmation |

---

### Variable 2: `resetToken`

| Attribute | Value | Evidence |
|-----------|-------|----------|
| Data type | String / text | ENV-01 DOM capture: `type="text"` |
| Required | Yes | ENV-01 DOM capture: `required=true` |
| Min length | Not specified | ENV-01: no `minlength` |
| Max length | Not specified | ENV-01: no `maxlength` |
| Pattern | Not specified | ENV-01: no `pattern` |
| UI length hint | 4 digits | UI label: "Mã OTP (4 số)" |
| API example length | 6 digits | API example: `"resetToken": "123456"` |

| Domain Class | Type | Description |
|--------------|------|-------------|
| Current valid token for same email | Valid | Token returned by successful step 1 OTP request and submitted with the same email in step 2 |
| Empty token | Invalid | Blank token input; required field should prevent/deny submission |
| Incorrect token | Invalid | Token value that was not issued for the submitted email |
| Token for another email | Invalid | Token issued for a different account/email; this follows DT-01 ASM-01 and needs execution confirmation |
| Malformed token | Invalid candidate | Non-numeric or wrong-length token value; UI implies digits but DOM does not enforce numeric-only input |

---

### Variable 3: `newPassword`

| Attribute | Value | Evidence |
|-----------|-------|----------|
| Data type | Password string | ENV-01 DOM capture: `type="password"` |
| Required | Yes | ENV-01 DOM capture: `required=true` |
| Min length | 8 characters according to visible alert rule | DT-01 BR-08 from feature input artifact |
| Max length | Not specified | ENV-01: no `maxlength` |
| Required character classes | Uppercase, lowercase, digit, special character according to visible alert rule | DT-01 BR-08 from feature input artifact |
| Backend enforcement | Not specified | DT-01 OQ-04 |

| Domain Class | Type | Description |
|--------------|------|-------------|
| Strong password | Valid | At least 8 characters and includes uppercase, lowercase, digit, and special character |
| Empty password | Invalid | Blank password input; required field should prevent/deny submission |
| Too short password | Invalid | Fewer than 8 characters |
| Missing uppercase | Invalid | Length is at least 8 but no uppercase character |
| Missing lowercase | Invalid | Length is at least 8 but no lowercase character |
| Missing digit | Invalid | Length is at least 8 but no numeric digit |
| Missing special character | Invalid | Length is at least 8 but no special character |

---

## Dependency Analysis

| Dependency | Description | Testing Impact |
|------------|-------------|----------------|
| `email` -> `resetToken` | The reset token is meaningful only after an OTP request for an email. | Valid reset tests must first create/request a token for the same email. |
| Step 1 `email` -> step 2 hidden/state email | The email entered in step 1 is carried forward and submitted with the reset request in step 2. | Tests must ensure the reset request uses the intended account email; wrong-email combinations should be covered by invalid token/email tests. |
| `email` + `resetToken` | Successful reset depends on the submitted token matching the submitted email. | Invalid-domain tests should include wrong token and token-for-other-email cases. |
| `resetToken` + `newPassword` | Step 2 submits both values together. | A valid token with an invalid password should fail due to password rules; an invalid token with a valid password should fail due to token rules. |
| UI vs API token length | UI says 4 digits; API example shows 6 digits. | DT-03/DT-04 should include token length partitions and execution should determine actual behavior. |
| UI password rule vs backend | Password complexity appears in UI evidence, but backend enforcement is not yet confirmed. | Execution should distinguish client-side rejection from backend acceptance/rejection. |

---

## Summary

| Variable | Valid Domains | Invalid Domains |
|----------|---------------|-----------------|
| `email` | Existing account email | Empty; unregistered email; malformed email text as a confirmation-needed invalid candidate |
| `resetToken` | Current valid token for same email | Empty; incorrect token; token for another email; malformed token as a confirmation-needed invalid candidate |
| `newPassword` | Strong password satisfying visible rule | Empty; too short; missing uppercase; missing lowercase; missing digit; missing special character |

---

## Human Review Checklist

- [x] Every input variable identified.
- [x] Display-only fields and non-domain buttons excluded.
- [x] Dependencies between variables identified.
- [x] Unresolved rules marked for execution confirmation instead of treated as facts.
- [x] Domains are supported by DT-01, ENV-01, API specification, or explicitly labelled as confirmation-needed candidates.
