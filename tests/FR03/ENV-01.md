# ENV-01 — Testing Environment
**Feature:** FR-03 — Forgot Password and Password Reset  
**Date:** 2026-07-07  
**Skill:** ENV-01  
**Status:** Completed

---

## Existing Artifact Check

No existing FR-03 artifacts were found before execution:

- `tests/FR03/` did not exist.
- `bugs/FR03/` did not exist.

---

## Environment Availability

| Component | URL / Command | Result |
|-----------|---------------|--------|
| Frontend web app | `http://localhost:5173/forgot-password` | Reachable, HTTP 200 |
| Backend API | `http://localhost:3000/api/categories` | Reachable, HTTP 200 |
| Playwright | `node env_check_fr03.js` | Executed successfully after installing Chromium and running outside the sandbox |

---

## Evidence Captured

| Evidence | Path |
|----------|------|
| Step 1 forgot-password page screenshot | `tests/FR03/screenshots/ENV-forgot-password-step1.png` |
| Step 2 reset-password page screenshot | `tests/FR03/screenshots/ENV-forgot-password-step2.png` |
| Captured UI state | `tests/FR03/ENV-01-ui-state.json` |
| Playwright environment script | `playwright/env_check_fr03.js` |

---

## Black-Box Setup Action

A temporary test account was created through the public registration API so that the OTP request could proceed through the implemented UI.

| Field | Value |
|-------|-------|
| Test account email | `fr03.env.1783414243066@example.com` |
| Account creation status | HTTP 200 |
| OTP request flow | Successful; UI moved from step 1 to step 2 |

---

## Observable UI Findings

### Step 1 — Request OTP

| Control | Type | Required | minlength | maxlength | pattern |
|---------|------|----------|-----------|-----------|---------|
| Nhập Email của bạn | `text` | Yes | Not specified | Not specified | Not specified |
| Lấy mã OTP | `submit` button | No | N/A | N/A | N/A |

### Step 2 — Reset Password

| Control | Type | Required | minlength | maxlength | pattern |
|---------|------|----------|-----------|-----------|---------|
| Mã OTP (4 số) | `text` | Yes | Not specified | Not specified | Not specified |
| Mật khẩu mới | `password` | Yes | Not specified | Not specified | Not specified |
| Đặt lại mật khẩu | `submit` button | No | N/A | N/A | N/A |
| ← Quay lại | `button` | No | N/A | N/A | N/A |

---

## Notes

- Playwright was available as a package, but the Chromium browser binary was missing. Chromium was installed with `npx playwright install chromium`.
- The first Playwright run failed inside the sandbox due to Chromium launch restrictions. The same script succeeded when run outside the sandbox.
- No screenshots were fabricated; all screenshots listed above were generated from the running local SUT.

---

## Human Review Checklist

- [x] Local frontend was reachable.
- [x] Local backend was reachable.
- [x] Fresh FR-03 screenshots were captured.
- [x] UI state was recorded for later Domain Testing steps.
- [x] Environment limitations were documented.
