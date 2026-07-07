# EXEC-01 — Test Execution Report
**Feature:** FR-01 — Account Registration  
**Date:** 2026-07-07  
**Skill:** EXEC-01  
**Script:** `playwright/exec_fr01_dt.js`  
**SUT:** http://localhost:5173/register → POST http://localhost:3000/api/register

---

## Execution Method

- Automated via Playwright (headless Chromium)
- Each test: navigate to `/register` → fill fields → click **Đăng Ký** → capture screenshot → record body text
- API response interception attempted (no API calls reached the backend — all validation handled client-side)
- Screenshots saved to `tests/FR01/screenshots/`

---

## Results

| TC ID | Description | Expected Result | Actual Result | Status | Notes |
|-------|-------------|-----------------|---------------|--------|-------|
| TC001 | All valid inputs | Registration succeeds (HTTP 200) | ❌ Error shown: *"Mật khẩu quá yếu!"* — form stayed on register page | **FAIL** | 🐛 Valid password `Password1!` wrongly rejected |
| TC002 | Empty name | Rejected — name required error | ✅ Browser tooltip: *"Please fill out this field."* on name field. Form not submitted. | **PASS** | Client-side `required` attribute triggered |
| TC003 | Empty email | Rejected — email required error | ✅ Browser tooltip: *"Please fill out this field."* on email field. Form not submitted. | **PASS** | Client-side `required` attribute triggered |
| TC004 | Email missing `@` | Rejected — invalid email format | ❌ Error shown: *"Mật khẩu quá yếu!"* — wrong error type | **FAIL** | 🐛 Invalid email accepted by client; password error shown instead |
| TC005 | Email missing domain (`user@`) | Rejected — invalid email format | ❌ Error shown: *"Mật khẩu quá yếu!"* — wrong error type | **FAIL** | 🐛 Invalid email accepted by client; password error shown instead |
| TC006 | Email missing local part (`@example.com`) | Rejected — invalid email format | ❌ Error shown: *"Mật khẩu quá yếu!"* — wrong error type | **FAIL** | 🐛 Invalid email accepted by client; password error shown instead |
| TC007 | Duplicate email | Rejected — email already registered | ❌ Error shown: *"Mật khẩu quá yếu!"* — wrong error type; duplicate not detected | **FAIL** | 🐛 Duplicate email accepted by client; API never called |
| TC008 | Empty password | Rejected — password required | ✅ No error banner. Form stays on page (browser `required` prevents submit). | **PASS** | Client-side `required` attribute triggered |
| TC009 | Password too short (7 chars, `Pass1!`) | Rejected — password too short | ✅ Error shown: *"Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT."* | **PASS** | Generic password error — correctly rejects |
| TC010 | Password missing uppercase (`password1!`) | Rejected — missing uppercase | ✅ Error shown: *"Mật khẩu quá yếu!"* | **PASS** | Generic error — correctly rejects |
| TC011 | Password missing lowercase (`PASSWORD1!`) | Rejected — missing lowercase | ✅ Error shown: *"Mật khẩu quá yếu!"* | **PASS** | Generic error — correctly rejects |
| TC012 | Password missing digit (`Password!!`) | Rejected — missing digit | ✅ Error shown: *"Mật khẩu quá yếu!"* | **PASS** | Generic error — correctly rejects |
| TC013 | Password missing special char (`Password1`) | Rejected — missing special char | ✅ Error shown: *"Mật khẩu quá yếu!"* | **PASS** | Generic error — correctly rejects |

---

## Summary

| Result | Count | TC IDs |
|--------|-------|--------|
| ✅ PASS | 8 | TC002, TC003, TC008, TC009, TC010, TC011, TC012, TC013 |
| ❌ FAIL | 5 | TC001, TC004, TC005, TC006, TC007 |

---

## Bug Candidates

| Bug # | TC | Description | Severity Estimate |
|-------|-----|-------------|-----------------|
| BUG-001 | TC001 | Valid password `Password1!` is wrongly rejected with *"Mật khẩu quá yếu!"* — happy path registration is broken | **Critical** |
| BUG-002 | TC004–TC006 | Invalid email formats (missing `@`, missing domain, missing local part) are accepted by the client — no email format validation | **High** |
| BUG-003 | TC007 | Duplicate email is not detected — form shows password error instead of email uniqueness error; API never called | **High** |

---

## Evidence

| TC | Before | After |
|----|--------|-------|
| TC001 | `screenshots/TC001-before.png` | `screenshots/TC001-after.png` |
| TC002 | `screenshots/TC002-before.png` | `screenshots/TC002-after.png` |
| TC003 | `screenshots/TC003-before.png` | `screenshots/TC003-after.png` |
| TC004 | `screenshots/TC004-before.png` | `screenshots/TC004-after.png` |
| TC005 | `screenshots/TC005-before.png` | `screenshots/TC005-after.png` |
| TC006 | `screenshots/TC006-before.png` | `screenshots/TC006-after.png` |
| TC007 | `screenshots/TC007-before.png` | `screenshots/TC007-after.png` |
| TC008 | `screenshots/TC008-before.png` | `screenshots/TC008-after.png` |
| TC009 | `screenshots/TC009-before.png` | `screenshots/TC009-after.png` |
| TC010 | `screenshots/TC010-before.png` | `screenshots/TC010-after.png` |
| TC011 | `screenshots/TC011-before.png` | `screenshots/TC011-after.png` |
| TC012 | `screenshots/TC012-before.png` | `screenshots/TC012-after.png` |
| TC013 | `screenshots/TC013-before.png` | `screenshots/TC013-after.png` |

---

## Observations

1. **All validation is client-side** — the backend API (`POST /api/register`) was never called during any test. The form does its own validation before allowing submission.
2. **Password validation fires on submit** — the error *"Mật khẩu quá yếu!"* is triggered for any password that fails the strength check, including the valid `Password1!`.
3. **Email validation is absent** — the client does not validate email format before submission; any string passes the email field.
4. **Empty field blocking** — `name`, `email`, and `password` all use the browser's native `required` attribute, which shows the browser tooltip instead of a custom message.
