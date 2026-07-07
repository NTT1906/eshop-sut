# EXEC-01 - Domain Test Execution
**Feature:** FR-10 - Order State Machine  
**Date:** 2026-07-07  
**Skill:** EXEC-01  
**Input:** `DT-04-test-cases.md`  
**Execution Script:** `playwright/exec_fr10_dt.js`  
**Raw Results:** `tests/FR10/execution-results.json`

---

## Execution Environment

| Component | Value |
|-----------|-------|
| Frontend web | `http://127.0.0.1:5173` |
| Frontend admin | `http://127.0.0.1:5174` |
| Backend | `http://127.0.0.1:3000` |
| Tool | Playwright Chromium + APIRequestContext |
| Run ID | `1783430134267` |
| Executed At | `2026-07-07T13:17:11.571Z` |

---

## Summary

| Total | Passed | Failed | Not Executed |
|-------|--------|--------|--------------|
| 33 | 32 | 1 | 0 |

---

## Execution Results

| TC ID | Expected | Actual | Status | Evidence |
|-------|----------|--------|--------|----------|
| DT-TC001 | Cancel own pending order succeeds and status becomes `canceled`. | HTTP 200; final status `canceled`; user UI row displayed `Đã hủy`. | Pass | `tests/FR10/screenshots/DT-TC001-after.png` |
| DT-TC002 | Cancel own confirmed order succeeds and status becomes `canceled`. | HTTP 200; final status `canceled`. | Pass | N/A |
| DT-TC003 | Shipping cancellation either succeeds or is rejected without inconsistent state. | User UI showed `Hủy đơn`; cancel returned HTTP 200; final status `canceled`. | Pass | `tests/FR10/screenshots/DT-TC003-after.png` |
| DT-TC004 | Canceled order has no user cancel button; direct API rejects or no-ops and remains `canceled`. | User UI buttons were empty; direct cancel returned HTTP 400; final status `canceled`. | Pass | `tests/FR10/screenshots/DT-TC004-after.png` |
| DT-TC005 | Delivered order has no user cancel button; direct API rejects and remains `delivered`. | User UI buttons were empty; direct cancel returned HTTP 400; final status `delivered`. | Pass | `tests/FR10/screenshots/DT-TC005-after.png` |
| DT-TC006 | Cancel another user's order is rejected and target order remains unchanged. | HTTP 404; final status `pending`. | Pass | N/A |
| DT-TC007 | Cancel nonexistent order is rejected. | HTTP 404; body `{"error":"Order not found"}`. | Pass | N/A |
| DT-TC008 | Cancel without session is rejected and order remains `pending`. | HTTP 401; final status `pending`. | Pass | N/A |
| DT-TC009 | Cancel with invalid session is rejected and order remains `pending`. | HTTP 403; final status `pending`. | Pass | N/A |
| DT-TC010 | Cancel with non-integer ID is rejected. | HTTP 404; body `{"error":"Order not found"}`. | Pass | N/A |
| DT-TC011 | Cancel with UI-formatted `#id` is rejected. | HTTP 404; body `{"error":"Order not found"}`. | Pass | N/A |
| DT-TC012 | Cancel with missing ID path is rejected or routed away. | HTTP 404; response was Express `Cannot PUT /api/orders//cancel` HTML. | Pass | N/A |
| DT-TC013 | Cancel with zero ID is rejected. | HTTP 404; body `{"error":"Order not found"}`. | Pass | N/A |
| DT-TC014 | Admin `pending` -> `confirmed` succeeds. | HTTP 200; final status `confirmed`; admin UI showed `Xác nhận`, `Hủy` before action. | Pass | `tests/FR10/screenshots/DT-TC014-after.png` |
| DT-TC015 | Admin `pending` -> `canceled` succeeds. | HTTP 200; final status `canceled`. | Pass | N/A |
| DT-TC016 | Admin `confirmed` -> `shipping` succeeds. | HTTP 200; final status `shipping`. | Pass | N/A |
| DT-TC017 | Admin `confirmed` -> `canceled` succeeds. | HTTP 200; final status `canceled`. | Pass | N/A |
| DT-TC018 | Admin `shipping` -> `delivered` succeeds. | HTTP 200; final status `delivered`. | Pass | N/A |
| DT-TC019 | Admin `canceled` -> `delivered` either succeeds or is rejected without inconsistent state. | Admin UI showed `Đánh dấu Đã giao`; update returned HTTP 200; final status `delivered`. | Pass | `tests/FR10/screenshots/DT-TC019-after.png` |
| DT-TC020 | Delivered order has no admin action; same-current direct update rejects or no-ops and remains `delivered`. | Admin UI buttons were empty; direct update returned HTTP 400; final status `delivered`. | Pass | `tests/FR10/screenshots/DT-TC020-after.png` |
| DT-TC021 | Enum-valid `pending` target from `confirmed` is rejected or fails safely. | HTTP 400; error `Invalid state transition from confirmed to pending`; final status `confirmed`. | Pass | N/A |
| DT-TC022 | Enum-valid non-UI `shipping` -> `confirmed` is rejected. | HTTP 400; error `Invalid state transition from shipping to confirmed`; final status `shipping`. | Pass | N/A |
| DT-TC023 | Missing status body is rejected. | HTTP 400; error `Invalid state transition from pending to undefined`; final status `pending`. | Pass | N/A |
| DT-TC024 | Empty status is rejected. | HTTP 400; error `Invalid state transition from pending to `; final status `pending`. | Pass | N/A |
| DT-TC025 | Non-string status is rejected. | HTTP 400; error `Invalid state transition from pending to 123`; final status `pending`. | Pass | N/A |
| DT-TC026 | Outside-enum status is rejected. | HTTP 400; error `Invalid state transition from pending to returned`; final status `pending`. | Pass | N/A |
| DT-TC027 | Wrong-case status is rejected. | HTTP 400; error `Invalid state transition from pending to Delivered`; final status `pending`. | Pass | N/A |
| DT-TC028 | Admin update without session is rejected and order remains `pending`. | HTTP 401; final status `pending`. | Pass | N/A |
| DT-TC029 | Authenticated non-admin user is rejected from admin status endpoint and order remains `pending`. | HTTP 200; body `{"message":"Order status updated"}`; final status changed to `confirmed`. | Fail | N/A |
| DT-TC030 | Admin update with invalid token is rejected and order remains `pending`. | HTTP 403; final status `pending`. | Pass | N/A |
| DT-TC031 | Admin status update with non-integer ID is rejected. | HTTP 404; body `{"error":"Order not found"}`. | Pass | N/A |
| DT-TC032 | Admin status update with missing ID path is rejected or routed away. | HTTP 404; response was Express `Cannot PUT /api/admin/orders//status` HTML. | Pass | N/A |
| DT-TC033 | Admin status update with zero ID is rejected. | HTTP 404; body `{"error":"Order not found"}`. | Pass | N/A |

---

## Observations

- Registered-user cancellation for `shipping` orders succeeded: HTTP 200 and final status `canceled`.
- Direct registered-user cancellation for already `canceled` and `delivered` orders was rejected with HTTP 400.
- Admin `canceled` -> `delivered` succeeded: HTTP 200 and final status `delivered`.
- Direct invalid admin transitions and invalid status values were rejected with HTTP 400.
- The only failed case was DT-TC029: an authenticated registered user could call the admin status endpoint and update an order.

---

## Generated Evidence

| Artifact | Path |
|----------|------|
| Execution script | `playwright/exec_fr10_dt.js` |
| Raw execution JSON | `tests/FR10/execution-results.json` |
| User pending cancel screenshot | `tests/FR10/screenshots/DT-TC001-after.png` |
| User shipping cancel screenshot | `tests/FR10/screenshots/DT-TC003-after.png` |
| User canceled-order screenshot | `tests/FR10/screenshots/DT-TC004-after.png` |
| User delivered-order screenshot | `tests/FR10/screenshots/DT-TC005-after.png` |
| Admin pending action screenshot | `tests/FR10/screenshots/DT-TC014-after.png` |
| Admin canceled action screenshot | `tests/FR10/screenshots/DT-TC019-after.png` |
| Admin delivered action screenshot | `tests/FR10/screenshots/DT-TC020-after.png` |

---

## Human Review Checklist

- [x] Every DT-04 test case executed.
- [x] Actual result recorded for every test case.
- [x] Pass/fail status recorded for every test case.
- [x] Screenshots captured for UI evidence cases.
- [x] Failed cases preserved for later BUG-01 analysis.
