# DT-04 - Domain Test Case Generation
**Feature:** FR-10 - Order State Machine  
**Date:** 2026-07-07  
**Skill:** DT-04  
**Input:** Reviewed `DT-03-domain-partitioning.md` + `REVIEW-01-of-DT-03.md`

---

## Test Design Rules

- Use one representative value per partition unless dependency coverage requires another combination.
- Keep one main invalid or confirmation-needed partition per test case where practical.
- Separate registered-user cancellation tests from admin status-update tests.
- Treat confirmation-needed partitions as tests that clarify actual SUT behavior during `EXEC-01`.
- These are designed test cases only; they have not been executed in this skill.

---

## Test Data Conventions

| Symbol | Meaning |
|--------|---------|
| User A | Registered user who owns the primary FR-10 test orders |
| User B | Separate registered user used for ownership violation tests |
| Admin | Seeded admin account, e.g. `admin@eshop.com` |
| `orderA_pending` | User A order with current status `pending` |
| `orderA_confirmed` | User A order with current status `confirmed` |
| `orderA_shipping` | User A order with current status `shipping` |
| `orderA_canceled` | User A order with current status `canceled` |
| `orderA_delivered` | User A order with current status `delivered` |
| `orderB_pending` | User B order with current status `pending` |
| `missingOrderId` | Positive integer that does not correspond to any order, e.g. `999999` |

---

## Registered-User Cancellation Test Cases

| TC ID | Input | Expected Result | Covered Domain | Business Rule |
|-------|-------|-----------------|----------------|---------------|
| DT-TC001 | User A session; cancel `orderA_pending` using `PUT /api/orders/:id/cancel` or visible `Hủy đơn`. | Request succeeds; order status becomes `canceled`; user order history refreshes or later displays `Đã hủy`. | ACT-V1, OWN-V1, ID-V1, STATUS-V1, CANCEL-V1, DEP-U-V1 | BR-01, BR-02, BR-03, BR-04 |
| DT-TC002 | User A session; cancel `orderA_confirmed` through visible `Hủy đơn`. | Request succeeds; order status becomes `canceled`. | ACT-V1, OWN-V1, ID-V1, STATUS-V2, CANCEL-V2, DEP-U-V1 | BR-02, BR-03, BR-04 |
| DT-TC003 | User A session; cancel `orderA_shipping` through visible `Hủy đơn`. | Confirmation-needed: execution should determine whether shipping cancellation succeeds as implied by UI/API wording or is rejected. Order must not enter an inconsistent state. | STATUS-V3, CANCEL-C1, DEP-U-C1 | BR-03, BR-04, OQ-01 |
| DT-TC004 | User A session; inspect `orderA_canceled` in UI, then attempt direct API cancel for the same order. | UI shows no `Hủy đơn`. Confirmation-needed: direct API should reject or no-op; order remains `canceled`. | STATUS-V4, CANCEL-C2, DEP-U-I1 | BR-05, OQ-05 |
| DT-TC005 | User A session; inspect `orderA_delivered`, then attempt direct API cancel. | UI shows no `Hủy đơn`; direct API rejects delivered-order cancellation; order remains `delivered`. | STATUS-V5, CANCEL-I1, DEP-U-I1 | BR-03, BR-05 |
| DT-TC006 | User A session; attempt to cancel `orderB_pending`. | Request is rejected because the order is not owned by User A; User B order remains unchanged. | OWN-I1, ID-I6, CANCEL-I2, DEP-U-I2 | PC-02, OQ-04 |
| DT-TC007 | User A session; attempt to cancel `missingOrderId`. | Request is rejected because the order does not exist; no order status changes. | ID-I5, CANCEL-I3, DEP-U-I3, STATUS-I1 | PC-04, OQ-04 |
| DT-TC008 | No session; attempt to cancel `orderA_pending`. | Request is rejected as unauthenticated; order remains `pending`. | ACT-I1, OWN-I2, CANCEL-I4 | PC-01, OQ-04 |
| DT-TC009 | Invalid/expired session; attempt to cancel `orderA_pending`. | Request is rejected as unauthorized; order remains `pending`. | ACT-I2, CANCEL-I4 | PC-01, OQ-04 |
| DT-TC010 | User A session; call cancel endpoint with non-integer ID `abc`. | Request is rejected or fails safely; no order status changes. | ID-I2 | OQ-04 |
| DT-TC011 | User A session; call cancel endpoint with UI-formatted ID `#6`. | Request is rejected or fails safely because API path is expected to use raw numeric ID. | ID-I3 | OQ-04 |
| DT-TC012 | User A session; call cancel endpoint with missing ID path. | Request is rejected or routed away from cancel behavior; no order status changes. | ID-I1 | OQ-04 |
| DT-TC013 | User A session; call cancel endpoint with ID `0` or `-1`. | Request is rejected or fails safely; no order status changes. | ID-I4 | OQ-04 |

---

## Admin Status-Update Test Cases

| TC ID | Input | Expected Result | Covered Domain | Business Rule |
|-------|-------|-----------------|----------------|---------------|
| DT-TC014 | Admin session; update `orderA_pending` with `{"status":"confirmed"}`. | Request succeeds; order status becomes `confirmed`. | ACT-V2, OWN-V2, ID-V2, STATUS-V1, TARGET-V1, DEP-A-V1 | BR-06, BR-07, BR-08 |
| DT-TC015 | Admin session; update `orderA_pending` with `{"status":"canceled"}`. | Request succeeds; order status becomes `canceled`. | ACT-V2, OWN-V2, ID-V2, STATUS-V1, TARGET-V2, DEP-A-V1 | BR-06, BR-07, BR-08 |
| DT-TC016 | Admin session; update `orderA_confirmed` with `{"status":"shipping"}`. | Request succeeds; order status becomes `shipping`. | STATUS-V2, TARGET-V3, DEP-A-V1 | BR-07, BR-09 |
| DT-TC017 | Admin session; update `orderA_confirmed` with `{"status":"canceled"}`. | Request succeeds; order status becomes `canceled`. | STATUS-V2, TARGET-V4, DEP-A-V1 | BR-07, BR-09 |
| DT-TC018 | Admin session; update `orderA_shipping` with `{"status":"delivered"}`. | Request succeeds; order status becomes `delivered`. | STATUS-V3, TARGET-V5, DEP-A-V1 | BR-07, BR-10 |
| DT-TC019 | Admin session; update `orderA_canceled` with `{"status":"delivered"}`. | Confirmation-needed: UI exposes this action; execution should determine whether transition succeeds and whether behavior is intended. | STATUS-V4, TARGET-C1, DEP-A-C1 | BR-11, OQ-02 |
| DT-TC020 | Admin UI inspection for `orderA_delivered`, then direct API update with `{"status":"delivered"}`. | UI shows no action; direct same-current update should be rejected or no-op; order remains `delivered`. | STATUS-V5, TARGET-I6 | BR-12, OQ-03 |
| DT-TC021 | Admin session; update `orderA_confirmed` with `{"status":"pending"}`. | Confirmation-needed invalid candidate: `pending` is enum-valid but not UI-exposed as a target; execution should determine API behavior. | TARGET-C2, DEP-A-I1 | BR-07, OQ-03 |
| DT-TC022 | Admin session; update `orderA_shipping` with `{"status":"confirmed"}`. | Request should be rejected or fail safely because the enum-valid transition is not UI-exposed from `shipping`. | TARGET-I7, DEP-A-I1 | BR-07, OQ-03 |
| DT-TC023 | Admin session; update `orderA_pending` with missing `status` body `{}`. | Request is rejected; order remains `pending`. | TARGET-I1, DEP-A-I2 | OQ-04 |
| DT-TC024 | Admin session; update `orderA_pending` with `{"status":""}`. | Request is rejected; order remains `pending`. | TARGET-I2, DEP-A-I2 | OQ-04 |
| DT-TC025 | Admin session; update `orderA_pending` with `{"status":123}`. | Request is rejected; order remains `pending`. | TARGET-I3, DEP-A-I2 | OQ-04 |
| DT-TC026 | Admin session; update `orderA_pending` with `{"status":"returned"}`. | Request is rejected; system must not create outside-enum current status. | TARGET-I4, STATUS-I2, DEP-A-I2 | BR-07, OQ-04 |
| DT-TC027 | Admin session; update `orderA_pending` with `{"status":"Delivered"}`. | Request is rejected; system must not create wrong-case current status. | TARGET-I5, STATUS-I3, DEP-A-I2 | BR-07, OQ-04 |
| DT-TC028 | No session; update `orderA_pending` with `{"status":"confirmed"}`. | Request is rejected as unauthenticated; order remains `pending`. | ACT-I1, DEP-A-I3 | PC-03, OQ-04 |
| DT-TC029 | User A session; call admin status endpoint for `orderA_pending` with `{"status":"confirmed"}`. | Request is rejected because User A is authenticated but not admin; order remains `pending`. | ACT-I3, DEP-A-I3 | PC-03, OQ-04 |
| DT-TC030 | Invalid/expired admin token; update `orderA_pending` with `{"status":"confirmed"}`. | Request is rejected as unauthorized; order remains `pending`. | ACT-I2, DEP-A-I3 | PC-03, OQ-04 |
| DT-TC031 | Admin session; call admin status endpoint with non-integer order ID `abc`. | Request is rejected or fails safely; no order status changes. | ID-I2 | OQ-04 |
| DT-TC032 | Admin session; call admin status endpoint with missing order ID path. | Request is rejected or routed away from status-update behavior; no order status changes. | ID-I1 | OQ-04 |
| DT-TC033 | Admin session; call admin status endpoint with ID `0` or `-1`. | Request is rejected or fails safely; no order status changes. | ID-I4 | OQ-04 |

---

## Coverage Matrix

| Partition ID | Covered By |
|--------------|------------|
| ACT-V1 | DT-TC001 |
| ACT-V2 | DT-TC014 |
| ACT-I1 | DT-TC008, DT-TC028 |
| ACT-I2 | DT-TC009, DT-TC030 |
| ACT-I3 | DT-TC029 |
| OWN-V1 | DT-TC001 |
| OWN-V2 | DT-TC014 |
| OWN-I1 | DT-TC006 |
| OWN-I2 | DT-TC008 |
| ID-V1 | DT-TC001 |
| ID-V2 | DT-TC014 |
| ID-I1 | DT-TC012, DT-TC032 |
| ID-I2 | DT-TC010, DT-TC031 |
| ID-I3 | DT-TC011 |
| ID-I4 | DT-TC013, DT-TC033 |
| ID-I5 | DT-TC007 |
| ID-I6 | DT-TC006 |
| STATUS-V1 | DT-TC001, DT-TC014, DT-TC015 |
| STATUS-V2 | DT-TC002, DT-TC016, DT-TC017 |
| STATUS-V3 | DT-TC003, DT-TC018 |
| STATUS-V4 | DT-TC004, DT-TC019 |
| STATUS-V5 | DT-TC005, DT-TC020 |
| STATUS-I1 | DT-TC007 |
| STATUS-I2 | DT-TC026 |
| STATUS-I3 | DT-TC027 |
| CANCEL-V1 | DT-TC001 |
| CANCEL-V2 | DT-TC002 |
| CANCEL-C1 | DT-TC003 |
| CANCEL-C2 | DT-TC004 |
| CANCEL-I1 | DT-TC005 |
| CANCEL-I2 | DT-TC006 |
| CANCEL-I3 | DT-TC007 |
| CANCEL-I4 | DT-TC008, DT-TC009 |
| TARGET-V1 | DT-TC014 |
| TARGET-V2 | DT-TC015 |
| TARGET-V3 | DT-TC016 |
| TARGET-V4 | DT-TC017 |
| TARGET-V5 | DT-TC018 |
| TARGET-C1 | DT-TC019 |
| TARGET-C2 | DT-TC021 |
| TARGET-I1 | DT-TC023 |
| TARGET-I2 | DT-TC024 |
| TARGET-I3 | DT-TC025 |
| TARGET-I4 | DT-TC026 |
| TARGET-I5 | DT-TC027 |
| TARGET-I6 | DT-TC020 |
| TARGET-I7 | DT-TC022 |
| DEP-U-V1 | DT-TC001, DT-TC002 |
| DEP-U-C1 | DT-TC003 |
| DEP-U-I1 | DT-TC004, DT-TC005 |
| DEP-U-I2 | DT-TC006 |
| DEP-U-I3 | DT-TC007 |
| DEP-A-V1 | DT-TC014, DT-TC015, DT-TC016, DT-TC017, DT-TC018 |
| DEP-A-C1 | DT-TC019 |
| DEP-A-I1 | DT-TC021, DT-TC022 |
| DEP-A-I2 | DT-TC023, DT-TC024, DT-TC025, DT-TC026, DT-TC027 |
| DEP-A-I3 | DT-TC028, DT-TC029, DT-TC030 |

---

## Business Rule Coverage

| Business Rule / Question | Covered By |
|--------------------------|------------|
| BR-01: Registered user can load own orders | DT-TC001 through DT-TC005 |
| BR-02: Registered-user cancellation changes an order to `canceled` | DT-TC001, DT-TC002, DT-TC003 |
| BR-03: Registered-user cancellation is only for not-delivered orders by API wording | DT-TC001, DT-TC002, DT-TC003, DT-TC005 |
| BR-04: User UI shows `Hủy đơn` for `pending`, `confirmed`, `shipping` | DT-TC001, DT-TC002, DT-TC003 |
| BR-05: User UI shows no action for `canceled`, `delivered` | DT-TC004, DT-TC005 |
| BR-06: Admin can load all system orders | DT-TC014 through DT-TC020 |
| BR-07: Admin status endpoint uses status enum | DT-TC014 through DT-TC027 |
| BR-08: Admin `pending` actions are `confirmed`, `canceled` | DT-TC014, DT-TC015 |
| BR-09: Admin `confirmed` actions are `shipping`, `canceled` | DT-TC016, DT-TC017 |
| BR-10: Admin `shipping` action is `delivered` | DT-TC018 |
| BR-11: Admin `canceled` action `delivered` is visible | DT-TC019 |
| BR-12: Admin `delivered` has no visible action | DT-TC020 |
| OQ-01: User cancel for `shipping` intended behavior | DT-TC003 |
| OQ-02: Admin `canceled` -> `delivered` intended behavior | DT-TC019 |
| OQ-03: Direct API invalid transition matrix | DT-TC020, DT-TC021, DT-TC022 |
| OQ-04: Error handling for invalid IDs, auth, status values | DT-TC006 through DT-TC013, DT-TC023 through DT-TC033 |
| OQ-05: Terminal states for registered-user actions | DT-TC004, DT-TC005 |

---

## Execution Notes for EXEC-01

- Use fresh orders for each state-changing success case so one test does not consume another test's starting state.
- For UI-visible action tests, capture both the visible buttons before action and the resulting status after action.
- For direct API invalid/candidate tests, verify the order's final status by reloading `GET /api/orders/my-orders` or `GET /api/admin/orders`.
- `STATUS-I1`, `STATUS-I2`, and `STATUS-I3` are not normal UI states; DT-TC007, DT-TC026, and DT-TC027 cover fail-safe handling around missing or invalid state creation.
- Confirmation-needed cases should be reviewed after execution before classifying failures as bugs versus specification gaps.

---

## Human Review Checklist

- [x] Every DT-03 partition is covered.
- [x] Every dependency partition is covered.
- [x] Every DT-01 business rule and open question is exercised.
- [x] No duplicate test cases.
- [x] Confirmation-needed behavior is explicitly identified for execution.
