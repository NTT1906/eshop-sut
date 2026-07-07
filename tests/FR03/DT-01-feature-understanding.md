# DT-01 - Feature Understanding
**Feature:** FR-03 - Forgot Password and Password Reset  
**Date:** 2026-07-07  
**Skill:** DT-01  
**Input:** `FEATURE_INPUT_FR03.md`, `api_specification.md`, `tests/FR03/ENV-01.md`, `tests/FR03/ENV-01-ui-state.json`

---

## Evidence Sources

| Source | Evidence Used |
|--------|---------------|
| `FEATURE_INPUT_FR03.md` | Feature ID, actor, preconditions, UI inputs, excluded UI elements |
| `api_specification.md` | `POST /api/forgot-password` and `POST /api/reset-password` request bodies and successful response example |
| `tests/FR03/ENV-01.md` | Reachability check, screenshots captured, observable UI controls |
| `tests/FR03/ENV-01-ui-state.json` | DOM-observed input types, required attributes, and lack of HTML length/pattern attributes |

---

## Feature Summary

FR-03 allows a guest or unauthenticated user to reset an account password through a two-step flow:

1. The user submits an email address to request an OTP/reset token.
2. After a successful OTP request, the user submits the reset token and a new password to complete the password reset.

The frontend route observed during ENV-01 is `/forgot-password`. The feature is backed by two public authentication API endpoints: `POST /api/forgot-password` and `POST /api/reset-password`.

---

## Actors

| Actor | Role in Feature |
|-------|-----------------|
| Guest / Unauthenticated User | Requests an OTP/reset token and submits a new password without being logged in |
| EShop System | Validates the request, generates or returns the reset token, and updates the password when reset data is accepted |

---

## Preconditions

| ID | Precondition | Evidence |
|----|--------------|----------|
| PRE-01 | User is not authenticated. | Feature input artifact defines the target actor as Guest / Unauthenticated User. |
| PRE-02 | Browser can load `/forgot-password`. | ENV-01 confirmed `http://localhost:5173/forgot-password` returned HTTP 200. |
| PRE-03 | Backend API is reachable. | ENV-01 confirmed backend returned HTTP 200 for a public API reachability check. |
| PRE-04 | For the successful reset path, the submitted email must correspond to an account that can receive/request a reset token. | ENV-01 created a temporary account through the public registration API before requesting OTP. |
| PRE-05 | For step 2, an OTP/reset token must already have been requested for the submitted email. | UI only shows step 2 after successful OTP request in ENV-01. |

---

## System Inputs

| Input | Type | Required | Step | Evidence |
|-------|------|----------|------|----------|
| `email` | String / text | Yes | Step 1 | UI field "Nhập Email của bạn"; DOM type `text`; API body for `/api/forgot-password`. |
| `requestOtpAction` | Submit action | Yes | Step 1 | UI button "Lấy mã OTP"; triggers OTP request flow. |
| `resetToken` | String / text | Yes | Step 2 | UI field "Mã OTP (4 số)"; DOM type `text`; API body for `/api/reset-password`. |
| `newPassword` | Password string | Yes | Step 2 | UI field "Mật khẩu mới"; DOM type `password`; API body for `/api/reset-password`. |
| `resetPasswordAction` | Submit action | Yes | Step 2 | UI button "Đặt lại mật khẩu"; triggers reset submission flow. |

Only `email`, `resetToken`, and `newPassword` are domain variables for later Domain Testing. The submit buttons are feature-triggering controls, not value domains.

---

## System Outputs

| Output | When It Appears | Evidence |
|--------|-----------------|----------|
| OTP/reset token success message | After successful step 1 OTP request | API spec success response contains `message` and `resetToken`; ENV-01 observed message `Mã OTP của bạn là: 1132`. |
| Step 2 reset form | After successful step 1 OTP request | ENV-01 observed transition from email-only form to reset token + new password form. |
| Password reset success result | After successful step 2 reset request | API spec defines the reset endpoint and request body; feature input says UI shows a success alert and navigates to login. This success path was not re-executed in ENV-01. |
| Error feedback | Failed OTP request or failed reset request | Feature input and API spec indicate failure is possible for unknown user or invalid token/email, but exact UI error messages are not fully specified in API spec. |

---

## Business Rules

| Rule ID | Business Rule | Evidence | Status |
|---------|---------------|----------|--------|
| BR-01 | The feature is available to a guest / unauthenticated user. | Feature input and public API endpoints without documented authorization requirement. | Verified from provided artifacts |
| BR-02 | Step 1 requires an `email` value before requesting OTP. | ENV-01 DOM capture: email input has `required=true`; API body includes `email`. | Verified |
| BR-03 | A successful OTP request returns a reset token and advances the UI to step 2. | API spec success response includes `resetToken`; ENV-01 observed step transition and OTP display. | Verified |
| BR-04 | Step 2 requires `resetToken` and `newPassword`. | ENV-01 DOM capture: both inputs have `required=true`; API body includes both fields. | Verified |
| BR-05 | Password reset submission uses `email`, `resetToken`, and `newPassword` together. | API spec request body for `POST /api/reset-password`. | Verified |
| BR-06 | The UI label describes the OTP as 4 digits. | ENV-01 observed field label "Mã OTP (4 số)". | Verified |
| BR-07 | The API documentation examples show a 6-digit reset token. | API spec examples use `resetToken: "123456"`. | Verified inconsistency |
| BR-08 | New password should be at least 8 characters and include uppercase, lowercase, number, and special character according to visible validation text recorded in the feature input artifact. | `FEATURE_INPUT_FR03.md` records the alert text. | Provided artifact evidence; needs execution confirmation because ENV-01 did not trigger the weak-password path |

---

## Constraints Observed

| Variable | Observed Constraint |
|----------|---------------------|
| `email` | Required in UI. DOM type is `text`. No `minlength`, `maxlength`, or `pattern` was observed. Email format validation is not specified in the DOM evidence. |
| `resetToken` | Required in UI. DOM type is `text`. UI label says 4 digits. No `minlength`, `maxlength`, or `pattern` was observed. |
| `newPassword` | Required in UI. DOM type is `password`. No `minlength`, `maxlength`, or `pattern` was observed in ENV-01. Feature input records a visible weak-password alert rule. |

---

## Assumptions

| Assumption ID | Assumption | Why It Is Needed |
|---------------|------------|------------------|
| ASM-01 | A reset token is valid only for the email address used in the reset request. | The reset API requires both `email` and `resetToken`, but the API spec does not explicitly describe token binding. |
| ASM-02 | An email not associated with an account should not allow a successful password reset. | The feature purpose is account recovery; ENV-01 used an existing account for successful OTP request. |
| ASM-03 | A successful password reset changes the login credential for the account. | The API endpoint name and purpose imply credential update, but login-after-reset was not executed in ENV-01. |

---

## Open Questions

| Question ID | Question | Impact on Later Testing |
|-------------|----------|-------------------------|
| OQ-01 | Is the reset token intended to be 4 digits, as shown by the UI, or 6 digits, as shown in the API specification examples? | Affects valid and invalid token partitions and BVA boundaries. |
| OQ-02 | Is email format validation required for `email`, or is any text accepted until account lookup? | Affects email domain partitions. |
| OQ-03 | Are reset tokens single-use, expiring, or rate-limited? | Affects state-based tests, security tests, and negative partitions. |
| OQ-04 | Is the password complexity rule enforced by the backend or only by the UI? | Affects API-level execution expectations. |
| OQ-05 | What exact error messages/statuses should appear for unknown email, invalid token, and weak password? | Affects expected results for invalid-domain test cases. |

---

## DT-01 Summary

| Category | Result |
|----------|--------|
| Feature purpose | Recover account access by requesting an OTP/reset token and setting a new password |
| Primary actor | Guest / Unauthenticated User |
| Domain variables | `email`, `resetToken`, `newPassword` |
| Main success path | Submit email -> receive/display OTP -> submit OTP and new password -> password reset succeeds |
| Main uncertainty | OTP length mismatch between UI and API spec; exact validation rules are partly unspecified |

---

## Human Review Checklist

- [x] Feature purpose is identified.
- [x] Actor is identified.
- [x] Inputs and outputs are separated.
- [x] Business rules are tied to evidence where possible.
- [x] Assumptions are separated from verified facts.
- [x] Open questions are listed instead of being treated as facts.
