# EXEC-01 - BVA Test Execution
**Feature:** FR-10 - Order State Machine  
**Date:** 2026-07-07  
**Skill:** EXEC-01  
**Input:** `BVA-01-boundary-analysis.md`  
**Execution Script:** `playwright/exec_fr10_bva.js`  
**Raw Results:** `tests/FR10/bva-execution-results.json`

---

## Execution Environment

| Component | Value |
|-----------|-------|
| Backend | `http://127.0.0.1:3000` |
| Tool | Node.js Fetch API |
| Run ID | `1783431643103` |
| Executed At | `2026-07-07T13:40:43.438Z` |

---

## Summary

| Total | Passed | Failed | Not Executed |
|-------|--------|--------|--------------|
| 20 | 20 | 0 | 0 |

---

## Execution Results

| TC ID | Expected | Actual | Status | Evidence |
|-------|----------|--------|--------|----------|
| BVA-TC001 | Cancel succeeds for the first generated valid positive own order ID. | `orderId=1`; HTTP 200; final status `canceled`. | Pass | N/A |
| BVA-TC002 | Cancel succeeds for the adjacent generated positive own order ID. | `orderId=2`; HTTP 200; final status `canceled`. | Pass | N/A |
| BVA-TC003 | Cancel with `orderId=0` is rejected. | HTTP 404; body `{"error":"Order not found"}`. | Pass | N/A |
| BVA-TC004 | Cancel with `orderId=-1` is rejected. | HTTP 404; body `{"error":"Order not found"}`. | Pass | N/A |
| BVA-TC005 | Cancel with high nonexistent `orderId=999999` is rejected. | HTTP 404; body `{"error":"Order not found"}`. | Pass | N/A |
| BVA-TC006 | Registered user can cancel own `pending` order. | HTTP 200; final status `canceled`. | Pass | N/A |
| BVA-TC007 | Registered user can cancel own `confirmed` order. | HTTP 200; final status `canceled`. | Pass | N/A |
| BVA-TC008 | `shipping` cancel either succeeds or is rejected without inconsistent state. | HTTP 200; body `{"message":"Order canceled successfully"}`; final status `canceled`. | Pass | N/A |
| BVA-TC009 | Direct cancel on `canceled` order rejects or no-ops and remains `canceled`. | HTTP 400; body `{"error":"Cannot cancel this order."}`; final status `canceled`. | Pass | N/A |
| BVA-TC010 | Direct cancel on `delivered` order rejects and remains `delivered`. | HTTP 400; body `{"error":"Cannot cancel this order."}`; final status `delivered`. | Pass | N/A |
| BVA-TC011 | Admin `pending` -> `confirmed` succeeds. | HTTP 200; body `{"message":"Order status updated"}`; final status `confirmed`. | Pass | N/A |
| BVA-TC012 | Admin `pending` -> `canceled` succeeds. | HTTP 200; body `{"message":"Order status updated"}`; final status `canceled`. | Pass | N/A |
| BVA-TC013 | Admin `confirmed` -> `pending` is rejected or fails safely. | HTTP 400; error `Invalid state transition from confirmed to pending`; final status `confirmed`. | Pass | N/A |
| BVA-TC014 | Admin `confirmed` -> `shipping` succeeds. | HTTP 200; body `{"message":"Order status updated"}`; final status `shipping`. | Pass | N/A |
| BVA-TC015 | Admin `confirmed` -> `canceled` succeeds. | HTTP 200; body `{"message":"Order status updated"}`; final status `canceled`. | Pass | N/A |
| BVA-TC016 | Admin `shipping` -> `confirmed` is rejected or fails safely. | HTTP 400; error `Invalid state transition from shipping to confirmed`; final status `shipping`. | Pass | N/A |
| BVA-TC017 | Admin `shipping` -> `delivered` succeeds. | HTTP 200; body `{"message":"Order status updated"}`; final status `delivered`. | Pass | N/A |
| BVA-TC018 | Admin `delivered` -> `delivered` is rejected or no-ops. | HTTP 400; error `Invalid state transition from delivered to delivered`; final status `delivered`. | Pass | N/A |
| BVA-TC019 | `canceled` -> `delivered` either succeeds or is rejected without inconsistent state. | HTTP 200; body `{"message":"Order status updated"}`; final status `delivered`. | Pass | N/A |
| BVA-TC020 | Admin `pending` -> `returned` is rejected. | HTTP 400; error `Invalid state transition from pending to returned`; final status `pending`. | Pass | N/A |

---

## Observations

- Numeric lower-bound tests for `orderId` behaved safely: `0`, `-1`, and high nonexistent ID values were rejected.
- Registered-user cancellation succeeded for `pending`, `confirmed`, and `shipping` orders.
- Direct cancellation of `canceled` and `delivered` orders was rejected with HTTP 400.
- Admin backward and outside-enum transitions were rejected with HTTP 400.
- Admin `canceled` -> `delivered` succeeded again, matching the earlier domain execution result.
- No BVA test cases failed under the expectations defined in `BVA-01-boundary-analysis.md`.

---

## Generated Evidence

| Artifact | Path |
|----------|------|
| Execution script | `playwright/exec_fr10_bva.js` |
| Raw execution JSON | `tests/FR10/bva-execution-results.json` |

---

## Human Review Checklist

- [x] Every BVA test case executed.
- [x] Actual result recorded for every test case.
- [x] Pass/fail status recorded for every test case.
- [x] Raw JSON evidence saved.
- [x] Failed cases checked; none were found in this BVA run.
