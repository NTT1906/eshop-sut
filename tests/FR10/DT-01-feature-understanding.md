# DT-01 - Feature Understanding
**Feature:** FR-10 - Order State Machine  
**Date:** 2026-07-07  
**Skill:** DT-01  
**Status:** Completed

---

## Evidence Sources

| Source | Evidence Used |
|--------|---------------|
| `FEATURE_INPUT.md` | FR-10 feature inputs, actors, related endpoints, and excluded UI elements |
| `api_specification.md` | Order and admin order endpoints, cancellation endpoint, status update endpoint, status enum |
| `tests/FR10/ENV-01.md` | Environment availability, prepared order states, observed registered-user and admin UI controls |
| `tests/FR10/ENV-01-ui-state.json` | Captured order rows, visible labels, and visible buttons for each prepared status |

---

## Feature Summary

FR-10 controls the lifecycle state of an existing order.

Registered users can view their own orders and can cancel eligible orders from their profile order history. Admin users can view system-wide orders and move each order to a next status using visible action buttons in the admin order management UI.

The feature is state-dependent: the current order status determines which actions are visible and what target status can be submitted.

---

## Actors

| Actor | Role in Feature |
|-------|-----------------|
| Registered User | Views their own order history and cancels an eligible own order. |
| Admin | Views all orders and updates order status using admin actions. |
| EShop System | Loads orders, handles authenticated status-change requests, updates order status, and returns/display results. |

---

## Preconditions

| ID | Precondition | Evidence |
|----|--------------|----------|
| PC-01 | Registered-user actions require an authenticated registered user. | `GET /api/orders/my-orders` and `PUT /api/orders/:id/cancel` are authenticated user flows; ENV-01 used a registered-user login. |
| PC-02 | Registered-user cancellation requires an existing order owned by the current registered user. | `FEATURE_INPUT.md` lists ownership as a precondition; ENV-01 created and displayed the user's own orders. |
| PC-03 | Admin actions require an authenticated admin account. | `api_specification.md` states admin APIs require `Authorization: Bearer <token>` and admin permission; ENV-01 used the seeded admin account. |
| PC-04 | Admin status update requires an existing order in the system. | `GET /api/admin/orders` and `PUT /api/admin/orders/:id/status` operate on order IDs; ENV-01 displayed prepared orders in admin UI. |
| PC-05 | The order has a current status before an action is chosen. | ENV-01 observed rows for `pending`, `confirmed`, `shipping`, `canceled`, and `delivered`. |

---

## System Inputs

| Input ID | Input | Actor | Type | Required | Evidence |
|----------|-------|-------|------|----------|----------|
| SI-01 | `orderId` from registered-user order row | Registered User | Integer row context | Yes | User order rows display IDs such as `#6`; cancel action targets `/api/orders/:id/cancel`. |
| SI-02 | `cancelOrderAction` through `Hủy đơn` button | Registered User | Button action | Yes for cancellation | ENV-01 observed `Hủy đơn` on `pending`, `confirmed`, and `shipping` user rows. |
| SI-03 | `orderId` from admin order row | Admin | Integer row context | Yes | Admin order rows display IDs such as `#6`; status actions target `/api/admin/orders/:id/status`. |
| SI-04 | `targetStatus` from admin action button | Admin | Enum string | Yes for admin update | API status update body contains `status`; ENV-01 mapped visible buttons to target statuses. |
| SI-05 | `currentStatus` of the order | System state / row context | Enum string | Yes as transition context | Visible actions differ by status in ENV-01. |

### Status Values Identified

| Status Value | UI Label Observed | Evidence |
|--------------|-------------------|----------|
| `pending` | Chờ xác nhận | API status enum and ENV-01 rows |
| `confirmed` | Đã xác nhận | API status enum and ENV-01 rows |
| `shipping` | Đang giao | API status enum and ENV-01 rows |
| `delivered` | Đã giao | API status enum and ENV-01 rows |
| `canceled` | Đã hủy | API status enum and ENV-01 rows |

---

## Outputs

| Output | Actor / Surface | Evidence |
|--------|-----------------|----------|
| Registered-user order list with status labels and action buttons | Registered User profile page | ENV-01 screenshot and UI-state capture |
| Admin order list with status labels and state-transition buttons | Admin order management page | ENV-01 screenshot and UI-state capture |
| Updated order status after a successful transition | Registered User or Admin | API endpoints are state-update endpoints; exact post-action UI refresh is to be confirmed in execution. |
| Rejection response or UI error for invalid/unauthorized requests | Registered User or Admin | Possible for authenticated state-changing endpoints, but exact rejection rules, message, and UI behavior are not confirmed yet. |

---

## Business Rules

| Rule ID | Business Rule | Evidence |
|---------|---------------|----------|
| BR-01 | The registered user can load their own orders. | `GET /api/orders/my-orders`; ENV-01 displayed the registered user's prepared orders. |
| BR-02 | The registered user cancellation operation changes an order to `canceled`. | `api_specification.md` describes `PUT /api/orders/:id/cancel` as changing the order state to `canceled`. |
| BR-03 | Registered-user cancellation is only for orders that are not delivered according to the API specification. | `api_specification.md` states cancellation is only when the order has not been delivered. |
| BR-04 | The registered-user UI shows `Hủy đơn` for `pending`, `confirmed`, and `shipping` orders. | ENV-01 registered-user UI findings. |
| BR-05 | The registered-user UI shows no action for `canceled` and `delivered` orders. | ENV-01 registered-user UI findings. |
| BR-06 | The admin can load all system orders. | `GET /api/admin/orders`; ENV-01 displayed all prepared orders in the admin UI. |
| BR-07 | Admin status update accepts a status enum value from `pending`, `confirmed`, `shipping`, `delivered`, and `canceled`. | `api_specification.md` admin status endpoint body description. |
| BR-08 | For `pending` orders, admin UI exposes transitions to `confirmed` and `canceled`. | ENV-01 admin UI findings: `Xác nhận`, `Hủy`. |
| BR-09 | For `confirmed` orders, admin UI exposes transitions to `shipping` and `canceled`. | ENV-01 admin UI findings: `Giao hàng`, `Hủy`. |
| BR-10 | For `shipping` orders, admin UI exposes transition to `delivered`. | ENV-01 admin UI findings: `Hoàn thành`. |
| BR-11 | For `canceled` orders, admin UI exposes transition to `delivered`. | ENV-01 admin UI findings: `Đánh dấu Đã giao`. |
| BR-12 | For `delivered` orders, admin UI exposes no transition action. | ENV-01 admin UI findings. |

---

## Assumptions

| ID | Assumption | Why It Is an Assumption |
|----|------------|-------------------------|
| A-01 | A successful registered-user cancel request updates the selected order status to `canceled` and the refreshed UI displays `Đã hủy`. | API spec defines the target state, but DT-01 has not executed the action yet. |
| A-02 | A successful admin status request updates only the selected `orderId`. | Endpoints are ID-scoped, but execution assertions are still pending. |
| A-03 | `orderId` is an integer even though the UI displays it with a leading `#`. | UI display includes `#`; API path uses the raw `:id`. |
| A-04 | Invalid transitions return an error rather than silently changing state. | This is expected for a state machine, but the API specification does not define invalid-transition responses. |

---

## Open Questions

| ID | Question | Reason |
|----|----------|--------|
| OQ-01 | Is a registered user intended to cancel an order in `shipping` status? | API wording says cancellation is allowed when not delivered, and ENV-01 shows `Hủy đơn` for `shipping`; this should be confirmed by execution. |
| OQ-02 | Is admin `canceled` -> `delivered` intended business behavior? | ENV-01 shows `Đánh dấu Đã giao` for `canceled`, but many order workflows treat canceled as terminal. |
| OQ-03 | Which admin status transitions are rejected when called directly through the API but not exposed in the UI? | API specification lists allowed status values, not the full transition matrix. |
| OQ-04 | What exact error messages are returned/displayed for invalid status values, nonexistent order IDs, unauthorized user access, or ownership violations? | Error behavior is not specified in the API documentation. |
| OQ-05 | Are `delivered` and `canceled` terminal states for registered-user actions? | UI shows no user action, but API-level enforcement still needs execution evidence. |

---

## Human Review Checklist

- [x] Feature purpose is identified.
- [x] Registered User, Admin, and EShop System actors are identified.
- [x] Inputs are listed separately from display-only fields.
- [x] Outputs are listed.
- [x] Business rules are traceable to API specification or ENV-01 evidence.
- [x] Assumptions are separated from verified facts.
- [x] Missing information and unclear rules are documented as open questions.
