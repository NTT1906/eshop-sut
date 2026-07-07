# DT-03 - Domain Partitioning
**Feature:** FR-10 - Order State Machine  
**Date:** 2026-07-07  
**Skill:** DT-03  
**Input:** Reviewed `DT-02-domain-identification.md` + `REVIEW-01-of-DT-02.md`

---

## Partitioning Rules Applied

- Each partition receives a unique label.
- Partitions within the same variable are mutually exclusive.
- Partitions cover the domains identified in DT-02.
- Partitions are split when expected behavior differs by actor, ownership, order state, or target state.
- Confirmation-needed partitions are retained where DT-02 marked behavior as unresolved but test-relevant.

---

## Variable 1: `actorContext`

| Partition ID | Type | Label | Description | Example |
|--------------|------|-------|-------------|---------|
| ACT-V1 | Valid | Authenticated registered user | Registered user session used for own order history and cancel flow | Bearer token/session for test user |
| ACT-V2 | Valid | Authenticated admin | Admin session used for system-wide order management and status update flow | Bearer token/session for `admin@eshop.com` |
| ACT-I1 | Invalid | No session | Request or UI action attempted without authentication | Missing token/session |
| ACT-I2 | Invalid | Invalid or expired session | Request includes a bad, expired, or corrupted token/session | `Authorization: Bearer invalid` |
| ACT-I3 | Invalid | Authenticated non-admin on admin flow | Authenticated registered user attempts admin order list or admin status update | User token on `/api/admin/orders` |

**Rationale:**  
Actor context changes the reachable endpoint and permission model. Registered-user and admin sessions are separate valid partitions because they exercise different FR-10 flows.

---

## Variable 2: `ownershipRelation`

| Partition ID | Type | Label | Description | Example |
|--------------|------|-------|-------------|---------|
| OWN-V1 | Valid | Own order for registered user | The selected order belongs to the authenticated registered user | User A cancels User A order |
| OWN-V2 | Valid | Admin system-wide order | Admin selects any existing system order; individual user ownership is not a restriction | Admin updates User A order |
| OWN-I1 | Invalid | Other user's order | Registered user selects an existing order owned by another registered user | User A cancels User B order |
| OWN-I2 | Invalid | No ownership context | There is no authenticated user context from which ownership can be established | Unauthenticated cancel request |

**Rationale:**  
Ownership is required for registered-user cancellation but not for admin state management. The admin partition is kept separate so valid admin tests are not incorrectly constrained by registered-user ownership.

---

## Variable 3: `orderId`

| Partition ID | Type | Label | Description | Example |
|--------------|------|-------|-------------|---------|
| ID-V1 | Valid | Existing own order ID | Positive integer ID for an order owned by the authenticated registered user | `6` for user cancel |
| ID-V2 | Valid | Existing system order ID | Positive integer ID for an order visible to admin | `6` for admin update |
| ID-I1 | Invalid | Missing ID | Required path parameter is absent | `/api/orders//cancel` |
| ID-I2 | Invalid | Non-integer ID | Path ID is text, decimal, symbolic, or otherwise not an integer | `abc`, `1.5` |
| ID-I3 | Invalid candidate | UI-formatted ID | ID includes the display-only `#` prefix instead of raw numeric API form | `#6` |
| ID-I4 | Invalid | Zero or negative ID | Integer but outside expected positive identifier range | `0`, `-1` |
| ID-I5 | Invalid | Nonexistent positive ID | Positive integer with no matching order | `999999` |
| ID-I6 | Invalid | Other user's order ID for user cancel | Existing positive integer ID owned by another registered user | User A sends User B order ID |

**Rationale:**  
Shape errors, existence errors, and ownership errors are split because they can fail at different validation layers.

---

## Variable 4: `currentStatus`

| Partition ID | Type | Label | Description | Example |
|--------------|------|-------|-------------|---------|
| STATUS-V1 | Valid | Pending | Order is awaiting confirmation | `pending` |
| STATUS-V2 | Valid | Confirmed | Order has been confirmed | `confirmed` |
| STATUS-V3 | Valid candidate | Shipping | Order is in delivery; user cancel is visible but still needs execution confirmation | `shipping` |
| STATUS-V4 | Valid candidate | Canceled | Order is canceled; admin delivered action is visible but still needs execution confirmation | `canceled` |
| STATUS-V5 | Valid | Delivered | Order has been delivered; no UI action observed | `delivered` |
| STATUS-I1 | Invalid | Missing or unknown state | State is absent or cannot be determined | `null`, missing status |
| STATUS-I2 | Invalid | Outside enum | State value is not one of the documented enum values | `returned` |
| STATUS-I3 | Invalid candidate | Wrong case or spelling | Value resembles an enum member but does not match exact lowercase spelling | `Pending`, `deliverd` |

**Rationale:**  
All five documented states must be separate because the visible actions differ. `shipping` and `canceled` are valid system states but are marked as confirmation-needed where their downstream transitions remain open questions.

---

## Variable 5: `cancelOrderAction`

| Partition ID | Type | Label | Description | Example |
|--------------|------|-------|-------------|---------|
| CANCEL-V1 | Valid | Cancel own pending order | Registered user cancels an own order in `pending` state | `pending` -> `canceled` |
| CANCEL-V2 | Valid | Cancel own confirmed order | Registered user cancels an own order in `confirmed` state | `confirmed` -> `canceled` |
| CANCEL-C1 | Confirmation-needed valid candidate | Cancel own shipping order | UI exposes `Hủy đơn` and API says not-delivered orders can be canceled; execution must confirm intended behavior | `shipping` -> `canceled` |
| CANCEL-C2 | Confirmation-needed invalid candidate | Cancel own canceled order directly | UI hides the action, but direct API behavior is unresolved because API wording only says not delivered | `canceled` -> `canceled` request |
| CANCEL-I1 | Invalid | Cancel own delivered order | UI hides the action and API says delivered orders cannot be canceled | `delivered` cancel request |
| CANCEL-I2 | Invalid | Cancel non-owned order | Registered user attempts to cancel another user's order | User A cancels User B order |
| CANCEL-I3 | Invalid | Cancel nonexistent order | Registered user attempts to cancel an order ID that does not exist | `999999` |
| CANCEL-I4 | Invalid | Cancel with invalid actor context | Cancellation attempted without a valid registered-user context | Missing token/session |

**Rationale:**  
Cancellation is partitioned by current status and authorization context because the same button action can be visible, hidden, or API-invalid depending on state and ownership.

---

## Variable 6: `targetStatus`

| Partition ID | Type | Label | Description | Example |
|--------------|------|-------|-------------|---------|
| TARGET-V1 | Valid | `confirmed` from `pending` | Admin confirms a pending order | `pending` -> `confirmed` |
| TARGET-V2 | Valid | `canceled` from `pending` | Admin cancels a pending order | `pending` -> `canceled` |
| TARGET-V3 | Valid | `shipping` from `confirmed` | Admin moves a confirmed order to shipping | `confirmed` -> `shipping` |
| TARGET-V4 | Valid | `canceled` from `confirmed` | Admin cancels a confirmed order | `confirmed` -> `canceled` |
| TARGET-V5 | Valid | `delivered` from `shipping` | Admin completes a shipping order | `shipping` -> `delivered` |
| TARGET-C1 | Confirmation-needed valid candidate | `delivered` from `canceled` | Admin UI exposes `Đánh dấu Đã giao` for canceled orders; business intent is unresolved | `canceled` -> `delivered` |
| TARGET-C2 | Confirmation-needed invalid candidate | `pending` as target | `pending` is in the API enum but was not exposed as an admin target in ENV-01 | `confirmed` -> `pending` |
| TARGET-I1 | Invalid | Missing status | Admin status update submitted without `status` | `{}` |
| TARGET-I2 | Invalid | Empty status | Admin status value is empty | `{"status": ""}` |
| TARGET-I3 | Invalid | Non-string status | Admin status value is not a string | `{"status": 123}` |
| TARGET-I4 | Invalid | Outside enum | Status value is not one of the documented enum values | `{"status": "returned"}` |
| TARGET-I5 | Invalid | Wrong case or spelling | Status resembles an enum value but does not match exact lowercase spelling | `{"status": "Delivered"}` |
| TARGET-I6 | Invalid candidate | Same-as-current target | Target status equals current status and is not exposed by the UI | `pending` -> `pending` |
| TARGET-I7 | Invalid candidate | Other enum-valid non-UI transition | Target is enum-valid but not exposed from the current status, excluding `pending`, same-current, and `canceled` -> `delivered` cases | `shipping` -> `confirmed` |

**Rationale:**  
`targetStatus` is not partitioned by enum value alone. The state-machine domain is the pair of `currentStatus` and `targetStatus`, so UI-exposed transitions, enum-valid but non-UI transitions, malformed targets, and missing targets are split.

---

## Admin Transition Matrix Partitions

These partitions guide DT-04 combinations for admin status update.

| Current Status | Valid / Candidate Target Partitions | Invalid Candidate Target Coverage |
|----------------|-------------------------------------|-----------------------------------|
| `pending` | TARGET-V1 (`confirmed`), TARGET-V2 (`canceled`) | `pending` same-current; `shipping`; `delivered`; malformed/missing targets |
| `confirmed` | TARGET-V3 (`shipping`), TARGET-V4 (`canceled`) | `pending`; `confirmed` same-current; `delivered`; malformed/missing targets |
| `shipping` | TARGET-V5 (`delivered`) | `pending`; `confirmed`; `shipping` same-current; `canceled`; malformed/missing targets |
| `canceled` | TARGET-C1 (`delivered`) | `pending`; `confirmed`; `shipping`; `canceled` same-current; malformed/missing targets |
| `delivered` | No UI-exposed target | `pending`; `confirmed`; `shipping`; `canceled`; `delivered` same-current; malformed/missing targets |

---

## Dependency Partitions

These are not standalone variables, but they guide test-case combinations in DT-04.

| Dependency ID | Type | Label | Description |
|---------------|------|-------|-------------|
| DEP-U-V1 | Valid | Registered user + own order + cancel-visible status | `actorContext=registered user`, `ownershipRelation=own`, existing `orderId`, and `currentStatus` in `pending` or `confirmed` |
| DEP-U-C1 | Confirmation-needed | Registered user + own shipping order | User cancel is visible for `shipping`, but execution must confirm behavior |
| DEP-U-I1 | Invalid | Registered user + own terminal order | User cancel is hidden for `canceled` and `delivered` |
| DEP-U-I2 | Invalid | Registered user + other user's order | Own-order precondition is violated |
| DEP-U-I3 | Invalid | Registered user + nonexistent order | Existing-order precondition is violated |
| DEP-A-V1 | Valid | Admin + UI-exposed standard transition | Admin uses one of TARGET-V1 through TARGET-V5 |
| DEP-A-C1 | Confirmation-needed | Admin + `canceled` -> `delivered` | UI exposes the transition, but business intent is unresolved |
| DEP-A-I1 | Invalid candidate | Admin + enum-valid non-UI transition | Admin sends an enum-valid target that the UI does not expose for the current status |
| DEP-A-I2 | Invalid | Admin + malformed target | Admin sends missing, empty, non-string, outside-enum, or wrong-case target |
| DEP-A-I3 | Invalid | Wrong actor + admin endpoint | Non-admin or unauthenticated actor attempts admin status update |

---

## Complete Partition Summary

| Variable | Partition ID | Type | Label |
|----------|--------------|------|-------|
| `actorContext` | ACT-V1 | Valid | Authenticated registered user |
| `actorContext` | ACT-V2 | Valid | Authenticated admin |
| `actorContext` | ACT-I1 | Invalid | No session |
| `actorContext` | ACT-I2 | Invalid | Invalid or expired session |
| `actorContext` | ACT-I3 | Invalid | Authenticated non-admin on admin flow |
| `ownershipRelation` | OWN-V1 | Valid | Own order for registered user |
| `ownershipRelation` | OWN-V2 | Valid | Admin system-wide order |
| `ownershipRelation` | OWN-I1 | Invalid | Other user's order |
| `ownershipRelation` | OWN-I2 | Invalid | No ownership context |
| `orderId` | ID-V1 | Valid | Existing own order ID |
| `orderId` | ID-V2 | Valid | Existing system order ID |
| `orderId` | ID-I1 | Invalid | Missing ID |
| `orderId` | ID-I2 | Invalid | Non-integer ID |
| `orderId` | ID-I3 | Invalid candidate | UI-formatted ID |
| `orderId` | ID-I4 | Invalid | Zero or negative ID |
| `orderId` | ID-I5 | Invalid | Nonexistent positive ID |
| `orderId` | ID-I6 | Invalid | Other user's order ID for user cancel |
| `currentStatus` | STATUS-V1 | Valid | Pending |
| `currentStatus` | STATUS-V2 | Valid | Confirmed |
| `currentStatus` | STATUS-V3 | Valid candidate | Shipping |
| `currentStatus` | STATUS-V4 | Valid candidate | Canceled |
| `currentStatus` | STATUS-V5 | Valid | Delivered |
| `currentStatus` | STATUS-I1 | Invalid | Missing or unknown state |
| `currentStatus` | STATUS-I2 | Invalid | Outside enum |
| `currentStatus` | STATUS-I3 | Invalid candidate | Wrong case or spelling |
| `cancelOrderAction` | CANCEL-V1 | Valid | Cancel own pending order |
| `cancelOrderAction` | CANCEL-V2 | Valid | Cancel own confirmed order |
| `cancelOrderAction` | CANCEL-C1 | Confirmation-needed valid candidate | Cancel own shipping order |
| `cancelOrderAction` | CANCEL-C2 | Confirmation-needed invalid candidate | Cancel own canceled order directly |
| `cancelOrderAction` | CANCEL-I1 | Invalid | Cancel own delivered order |
| `cancelOrderAction` | CANCEL-I2 | Invalid | Cancel non-owned order |
| `cancelOrderAction` | CANCEL-I3 | Invalid | Cancel nonexistent order |
| `cancelOrderAction` | CANCEL-I4 | Invalid | Cancel with invalid actor context |
| `targetStatus` | TARGET-V1 | Valid | `confirmed` from `pending` |
| `targetStatus` | TARGET-V2 | Valid | `canceled` from `pending` |
| `targetStatus` | TARGET-V3 | Valid | `shipping` from `confirmed` |
| `targetStatus` | TARGET-V4 | Valid | `canceled` from `confirmed` |
| `targetStatus` | TARGET-V5 | Valid | `delivered` from `shipping` |
| `targetStatus` | TARGET-C1 | Confirmation-needed valid candidate | `delivered` from `canceled` |
| `targetStatus` | TARGET-C2 | Confirmation-needed invalid candidate | `pending` as target |
| `targetStatus` | TARGET-I1 | Invalid | Missing status |
| `targetStatus` | TARGET-I2 | Invalid | Empty status |
| `targetStatus` | TARGET-I3 | Invalid | Non-string status |
| `targetStatus` | TARGET-I4 | Invalid | Outside enum |
| `targetStatus` | TARGET-I5 | Invalid | Wrong case or spelling |
| `targetStatus` | TARGET-I6 | Invalid candidate | Same-as-current target |
| `targetStatus` | TARGET-I7 | Invalid candidate | Other enum-valid non-UI transition |

**Total value partitions:** 47  
**Valid partitions:** 16  
**Invalid partitions:** 21  
**Confirmation-needed candidate partitions:** 10

---

## Traceability to DT-02

| DT-02 Domain Class | DT-03 Partition(s) |
|--------------------|--------------------|
| Authenticated registered user | ACT-V1 |
| Authenticated admin | ACT-V2 |
| Unauthenticated or invalid session | ACT-I1, ACT-I2 |
| Wrong role for admin flow | ACT-I3 |
| Own order | OWN-V1 |
| Admin system-wide order | OWN-V2 |
| Other user's order | OWN-I1, ID-I6 |
| No ownership context | OWN-I2 |
| Existing own order ID | ID-V1 |
| Existing system order ID | ID-V2 |
| Missing / malformed / nonexistent ID | ID-I1 through ID-I5 |
| Current status enum values | STATUS-V1 through STATUS-V5 |
| Invalid current status values | STATUS-I1 through STATUS-I3 |
| Cancel own eligible order | CANCEL-V1, CANCEL-V2, CANCEL-C1 |
| Cancel hidden or invalid user states | CANCEL-C2, CANCEL-I1 |
| Cancel non-owned or nonexistent order | CANCEL-I2, CANCEL-I3 |
| Cancel with invalid actor | CANCEL-I4 |
| UI-visible admin targets | TARGET-V1 through TARGET-V5, TARGET-C1 |
| `pending` target not UI-exposed | TARGET-C2 |
| Missing or malformed target status | TARGET-I1 through TARGET-I5 |
| Same-current or enum-valid non-UI transition | TARGET-I6, TARGET-I7 |

---

## Human Review Checklist

- [x] Partitions are mutually exclusive within each variable.
- [x] Partitions cover the DT-02 domains.
- [x] No duplicated partitions.
- [x] Confirmation-needed behavior is labelled explicitly.
- [x] Dependencies are identified for later test-case combination.
- [x] Admin state-machine partitions are based on `currentStatus` + `targetStatus`, not `targetStatus` alone.
