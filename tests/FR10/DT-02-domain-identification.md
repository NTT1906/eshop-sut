# DT-02 - Domain Identification
**Feature:** FR-10 - Order State Machine  
**Date:** 2026-07-07  
**Skill:** DT-02  
**Input:** Reviewed `DT-01-feature-understanding.md` + `REVIEW-01-of-DT-01.md`

---

## Scope

This artifact identifies the input domains required for Domain Testing of FR-10. It uses the reviewed DT-01 evidence and keeps unresolved transition rules explicit.

Domain variables from DT-01:

- `orderId`
- `currentStatus`
- `targetStatus`
- `cancelOrderAction`

Hidden/system context that affects behavior:

- `actorContext`
- `ownershipRelation`

Excluded from value-domain testing:

- order date, total amount, shipping address, customer name, table headers, status badge styling, navigation, static page headings, and other display-only fields.

---

## Domain Identification Table

| Variable | Type | Valid Domain | Invalid Domain | Evidence |
|----------|------|--------------|----------------|----------|
| `actorContext` | Authenticated role / session context | Registered user session for `/api/orders/my-orders` and `/api/orders/:id/cancel`; Admin session for `/api/admin/orders` and `/api/admin/orders/:id/status`. | No session; expired/invalid token; registered user attempting admin status update; non-admin account attempting admin order access. | DT-01 PC-01, PC-03; API specification says admin APIs require Bearer token and admin permission; ENV-01 used registered-user and admin logins. |
| `ownershipRelation` | Relationship between authenticated registered user and order | For registered-user cancel: order belongs to the current registered user. For admin status update: ownership is not required because admin manages system-wide orders. | Registered user attempts to cancel an order belonging to another user; order ownership cannot be established; unauthenticated request has no owner context. | DT-01 PC-02; `GET /api/orders/my-orders`; ENV-01 displayed only the created registered user's own orders. |
| `orderId` | Integer path parameter / row context | Existing order ID. For registered-user cancel, the order must belong to the current registered user. For admin update, the order must exist in the system. | Missing ID; non-integer ID; malformed ID with UI `#`; zero/negative ID; nonexistent ID; existing order owned by another user for registered-user cancel. | DT-01 SI-01, SI-03; endpoints `/api/orders/:id/cancel` and `/api/admin/orders/:id/status`; UI rows display IDs such as `#6`. |
| `currentStatus` | Enum string / system state | One of `pending`, `confirmed`, `shipping`, `canceled`, `delivered`. Valid available actions depend on actor and current status. | Missing/unknown status; status outside enum; inconsistent UI/API state; status value with wrong case or spelling. | DT-01 status values; API status enum; ENV-01 observed all five statuses. |
| `cancelOrderAction` | Registered-user button action | User triggers `Hủy đơn` for an eligible own order. UI-valid statuses observed: `pending`, `confirmed`, `shipping`. API wording says cancellation is allowed when the order has not been delivered, but DT-01 leaves terminal-state details open. | Trigger absent/hidden for `canceled` and `delivered`; attempting cancel on nonexistent, non-owned, delivered, or already canceled order; direct API cancel with invalid `orderId` or invalid session. | DT-01 SI-02, BR-02, BR-03, BR-04, BR-05, OQ-01, OQ-05. |
| `targetStatus` | Admin status enum string in request body | One of API enum values: `pending`, `confirmed`, `shipping`, `delivered`, `canceled`. UI-exposed target values are `confirmed`, `canceled`, `shipping`, and `delivered` depending on `currentStatus`. | Missing status; empty string; non-string value; status outside enum; wrong case; same-as-current status when not exposed by UI; enum value not allowed for the order's current state. | DT-01 SI-04, BR-07 through BR-12, OQ-02, OQ-03. |

---

## Variable Details

### Variable 1: `actorContext`

| Attribute | Value | Evidence |
|-----------|-------|----------|
| Data type | Session/authentication context | ENV-01 created both registered-user and admin authenticated sessions |
| Required | Yes | Both user and admin state-changing endpoints require authenticated flows |
| Registered-user valid context | Authenticated registered user for own order history and cancel flow | DT-01 PC-01 |
| Admin valid context | Authenticated admin for admin order list and status update flow | DT-01 PC-03; API admin section |
| Invalid contexts | Unauthenticated, expired token, invalid token, registered user on admin endpoint, non-admin on admin endpoint | API requires authorization/admin permission for admin endpoints; authorization failures need execution confirmation |

| Domain Class | Type | Description |
|--------------|------|-------------|
| Authenticated registered user | Valid for user cancel | Registered user can view own orders and submit cancel requests for own eligible orders. |
| Authenticated admin | Valid for admin update | Admin can view all orders and submit status update requests. |
| Unauthenticated actor | Invalid | Missing session/token for protected order operations. |
| Wrong role | Invalid | Actor role does not match the endpoint or UI flow. |

---

### Variable 2: `ownershipRelation`

| Attribute | Value | Evidence |
|-----------|-------|----------|
| Data type | Relationship / authorization context | Registered-user order history is scoped to `my-orders` |
| Required for user cancel | Yes | DT-01 PC-02 |
| Required for admin update | No user ownership requirement identified | Admin endpoint is system-wide order management |

| Domain Class | Type | Description |
|--------------|------|-------------|
| Own order | Valid for registered-user cancel | Order belongs to the authenticated registered user. |
| Any existing system order | Valid for admin update | Admin manages orders system-wide. |
| Other user's order | Invalid for registered-user cancel | Order exists but does not belong to the authenticated registered user. |
| No ownership context | Invalid | Request lacks a valid authenticated user context. |

---

### Variable 3: `orderId`

| Attribute | Value | Evidence |
|-----------|-------|----------|
| Data type | Integer path parameter | API path uses `:id`; UI displays order IDs as `#<id>` |
| Required | Yes | Both state-changing endpoints include `:id` |
| Valid registered-user domain | Existing own order ID | DT-01 SI-01, PC-02 |
| Valid admin domain | Existing system order ID | DT-01 SI-03, PC-04 |
| UI display form | `#6`, `#7`, etc. | ENV-01 UI-state capture |
| API submission form | Raw numeric ID without `#` | Endpoint path parameter assumption from API path |

| Domain Class | Type | Description |
|--------------|------|-------------|
| Existing own order ID | Valid for registered-user cancel | ID resolves to an order owned by the authenticated registered user. |
| Existing system order ID | Valid for admin update | ID resolves to an order visible in admin order management. |
| Missing ID | Invalid | No path ID supplied. |
| Non-integer ID | Invalid | Text, decimal, symbolic, or otherwise non-numeric ID. |
| UI-formatted `#id` | Invalid candidate | UI displays `#`, but API path is expected to receive raw numeric ID. |
| Zero or negative ID | Invalid | Integer but outside expected positive identifier range. |
| Nonexistent positive ID | Invalid | Correct shape but no matching order. |
| Other user's order ID | Invalid for registered-user cancel | Existing order belongs to another registered user. |

---

### Variable 4: `currentStatus`

| Attribute | Value | Evidence |
|-----------|-------|----------|
| Data type | Enum string / stored order state | API status enum and ENV-01 rows |
| Required | Yes | UI-visible actions depend on status |
| Known values | `pending`, `confirmed`, `shipping`, `canceled`, `delivered` | DT-01 Status Values Identified |
| Directly editable by user | No | DT-01 review confirms it is state context rather than directly editable input |

| Domain Class | Type | Description |
|--------------|------|-------------|
| `pending` | Valid state | User cancel visible; admin `confirmed` and `canceled` targets visible. |
| `confirmed` | Valid state | User cancel visible; admin `shipping` and `canceled` targets visible. |
| `shipping` | Valid state | User cancel visible as an execution-confirmation candidate; admin `delivered` target visible. |
| `canceled` | Valid state | No user cancel button; admin `delivered` target visible in ENV-01 as an execution-confirmation candidate. |
| `delivered` | Valid state | No user cancel button; no admin action visible. |
| Missing/unknown status | Invalid | State machine cannot determine allowed actions. |
| Outside enum | Invalid | Status value not listed in API enum. |
| Wrong case/spelling | Invalid candidate | API enum values are lowercase exact strings. |

---

### Variable 5: `cancelOrderAction`

| Attribute | Value | Evidence |
|-----------|-------|----------|
| Data type | Button/action event | Registered-user UI button `Hủy đơn` |
| Required for user cancel | Yes | Cancellation occurs through `PUT /api/orders/:id/cancel` |
| Target status | `canceled` | API cancellation description |
| UI-visible statuses | `pending`, `confirmed`, `shipping` | ENV-01 registered-user findings |
| UI-hidden statuses | `canceled`, `delivered` | ENV-01 registered-user findings |

| Domain Class | Type | Description |
|--------------|------|-------------|
| Cancel own `pending` order | Valid | UI exposes `Hủy đơn`; API target is `canceled`. |
| Cancel own `confirmed` order | Valid | UI exposes `Hủy đơn`; API target is `canceled`. |
| Cancel own `shipping` order | Valid candidate | UI exposes `Hủy đơn`; API says cancellation is for not-delivered orders. Execution should confirm intended behavior. |
| Cancel own `canceled` order | Invalid candidate | UI hides action; already canceled, but direct API behavior needs execution confirmation because the API wording only says "not delivered." |
| Cancel own `delivered` order | Invalid | UI hides action; API says cancellation only when not delivered. |
| Cancel non-owned order | Invalid | Violates registered-user ownership precondition. |
| Cancel nonexistent order | Invalid | `orderId` has no matching order. |

---

### Variable 6: `targetStatus`

| Attribute | Value | Evidence |
|-----------|-------|----------|
| Data type | Enum string in JSON body | Admin status endpoint body contains `status` |
| Required for admin update | Yes | `PUT /api/admin/orders/:id/status` updates status from submitted body |
| API enum values | `pending`, `confirmed`, `shipping`, `delivered`, `canceled` | API specification |
| UI-exposed target values | `confirmed`, `canceled`, `shipping`, `delivered` | ENV-01 admin findings |
| Unresolved transition matrix | Some enum values may be invalid for a given `currentStatus` even if enum-valid | DT-01 OQ-03 |

| Domain Class | Type | Description |
|--------------|------|-------------|
| `confirmed` | Valid enum; UI-valid from `pending` | Admin `Xác nhận` target. |
| `canceled` | Valid enum; UI-valid from `pending` and `confirmed` | Admin `Hủy` target. |
| `shipping` | Valid enum; UI-valid from `confirmed` | Admin `Giao hàng` target. |
| `delivered` | Valid enum; UI-valid from `shipping` and observed from `canceled` | Admin `Hoàn thành` / `Đánh dấu Đã giao` target. |
| `pending` | Valid enum; not UI-exposed as a target in ENV-01 | API enum includes it, but admin UI did not expose transition to `pending`. |
| Missing status | Invalid | No target state supplied. |
| Empty string | Invalid | Not a status enum value. |
| Non-string value | Invalid | Body value does not match enum-string shape. |
| Outside enum | Invalid | Not one of the five documented statuses. |
| Wrong case/spelling | Invalid | Does not match documented lowercase enum strings. |
| Same-as-current status | Invalid candidate | Not exposed by UI; API behavior needs execution confirmation. |
| Enum-valid but not allowed from current state | Invalid candidate | API lists enum values but not full transition matrix; UI provides observable transition subset. |

---

## Dependency Analysis

| Dependency | Description | Testing Impact |
|------------|-------------|----------------|
| `actorContext` -> endpoint access | Registered-user and admin flows use different endpoints and permissions. | Tests must separate user cancel from admin status update and include wrong-role/unauthenticated invalid cases. |
| `actorContext` + `ownershipRelation` + `orderId` | Registered-user cancel requires the selected order to belong to the authenticated user. | Valid user cancel tests require own order IDs; invalid tests should include other-user and nonexistent IDs. |
| `orderId` + `currentStatus` | The selected order's current state determines which actions should be visible and which requests should be accepted. | Test data must prepare orders in each known status. |
| `currentStatus` + `cancelOrderAction` | Registered-user cancel action is visible for `pending`, `confirmed`, and `shipping`; hidden for `canceled` and `delivered`. | Domain partitions should cover all five statuses for user cancel behavior. |
| `currentStatus` + `targetStatus` | Admin status update validity depends on both current and target status. | DT-03 should partition the transition matrix rather than treat `targetStatus` alone as sufficient. |
| UI-exposed transitions vs API enum | API lists all status values but UI exposes only a subset for each current status. | Execution should include UI-visible valid transitions and direct/API invalid-candidate transitions. |
| `canceled` -> `delivered` | Admin UI exposes this transition, but it is an open business question. | Treat as observed UI-valid candidate and verify in execution. |
| Registered-user `shipping` cancel | User UI exposes cancel for `shipping`, and API says not delivered can be canceled. | Treat as valid candidate and verify in execution. |

---

## Summary

| Variable | Valid Domains | Invalid Domains |
|----------|---------------|-----------------|
| `actorContext` | Authenticated registered user for user cancel; authenticated admin for admin update | Unauthenticated; invalid token; wrong role |
| `ownershipRelation` | Own order for user cancel; any system order for admin | Other user's order for user cancel; no ownership context |
| `orderId` | Existing own order ID for user cancel; existing system order ID for admin | Missing; non-integer; UI-formatted `#id`; zero/negative; nonexistent; other user's ID for user cancel |
| `currentStatus` | `pending`; `confirmed`; `shipping`; `canceled`; `delivered` | Missing/unknown; outside enum; wrong case/spelling |
| `cancelOrderAction` | Cancel own eligible order: `pending`, `confirmed`, `shipping` candidate | Cancel `canceled`; cancel `delivered`; cancel non-owned; cancel nonexistent |
| `targetStatus` | Enum values, with UI-visible targets by current status: `confirmed`, `canceled`, `shipping`, `delivered`; `pending` is enum-valid but not UI-exposed | Missing; empty; non-string; outside enum; wrong case/spelling; same-as-current or enum-valid disallowed transition candidates |

---

## Human Review Checklist

- [x] Every input variable from DT-01 identified.
- [x] Hidden/system context that affects behavior identified.
- [x] Display-only fields excluded.
- [x] Dependencies between variables identified.
- [x] Domain definitions separate API enum validity from transition validity.
- [x] Unresolved rules marked as candidates for later partitioning/execution instead of treated as confirmed facts.
