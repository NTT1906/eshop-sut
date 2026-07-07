# BVA-01 - Boundary Value Analysis
**Feature:** FR-10 - Order State Machine  
**Date:** 2026-07-07  
**Skill:** BVA-01  
**Input:** Reviewed `DT-02-domain-identification.md`, reviewed `DT-03-domain-partitioning.md`, `DT-04-test-cases.md`

---

## BVA Scope

BVA is applied only to variables with numeric, length-based, date/time, or ordered boundaries.

| Variable | BVA Decision | Reason |
|----------|--------------|--------|
| `actorContext` | Excluded | Role/session values are categorical, not numeric, length-based, date/time, or ordered. |
| `ownershipRelation` | Excluded | Ownership is categorical: own order, other user's order, admin system-wide order, or no ownership context. |
| `orderId` | Included | API path parameter is an integer identifier. The lower positive-ID boundary is testable. No explicit upper bound is specified. |
| `currentStatus` | Included as ordered state-machine input | Order status has an ordered workflow: `pending` -> `confirmed` -> `shipping` -> `delivered`, with `canceled` as a terminal side branch. |
| `cancelOrderAction` | Included through ordered status boundaries | The action itself is a button/event, but its boundary behavior depends on adjacent `currentStatus` values. |
| `targetStatus` | Included through ordered transition boundaries | Target status validity depends on the current state and adjacent/non-adjacent transitions. |

---

## Boundary Values

### Numeric Boundary: `orderId`

| Variable | Boundary | Test Value | Expected Classification | Evidence |
|----------|----------|------------|-------------------------|----------|
| `orderId` | Minimum - 1 below positive integer range | `0` | Invalid | DT-03 `ID-I4`: zero or negative ID is invalid. |
| `orderId` | Minimum valid positive integer shape | `1` if an order with ID 1 exists in the test run | Valid only if the order exists and actor/context is valid | DT-03 `ID-V1`, `ID-V2`: existing positive integer order ID is valid. |
| `orderId` | Minimum + 1 positive integer shape | `2` if an order with ID 2 exists in the test run | Valid only if the order exists and actor/context is valid | Confirms adjacent valid positive ID shape. |
| `orderId` | Negative side of lower boundary | `-1` | Invalid | DT-03 `ID-I4`: zero or negative ID is invalid. |
| `orderId` | High positive value with no matching order | `999999` | Invalid nonexistent ID, not an upper-bound test | DT-03 `ID-I5`: no explicit maximum ID exists; this checks existence, not max + 1. |

### Ordered Boundary: Registered-User Cancel by `currentStatus`

| Variable | Boundary | Test Value | Expected Classification | Evidence |
|----------|----------|------------|-------------------------|----------|
| `currentStatus` for user cancel | First workflow state | `pending` | Valid cancel boundary | DT-03 `CANCEL-V1`. |
| `currentStatus` for user cancel | Adjacent valid state after `pending` | `confirmed` | Valid cancel boundary | DT-03 `CANCEL-V2`. |
| `currentStatus` for user cancel | Boundary after user-confirmed cancellation states | `shipping` | Confirmation-needed candidate | DT-03 `CANCEL-C1`; DT-04 `DT-TC003`. |
| `currentStatus` for user cancel | Terminal canceled state | `canceled` | Confirmation-needed invalid candidate for direct API; UI action hidden | DT-03 `CANCEL-C2`; DT-04 `DT-TC004`. |
| `currentStatus` for user cancel | Terminal delivered state | `delivered` | Invalid cancel boundary | DT-03 `CANCEL-I1`; DT-04 `DT-TC005`. |

### Ordered Boundary: Admin Status Transitions

| Variable Pair | Boundary | Test Value | Expected Classification | Evidence |
|---------------|----------|------------|-------------------------|----------|
| `currentStatus` + `targetStatus` | First forward transition | `pending` -> `confirmed` | Valid | DT-03 `TARGET-V1`. |
| `currentStatus` + `targetStatus` | First state cancel branch | `pending` -> `canceled` | Valid | DT-03 `TARGET-V2`. |
| `currentStatus` + `targetStatus` | Backward transition across first boundary | `confirmed` -> `pending` | Confirmation-needed invalid candidate | DT-03 `TARGET-C2`. |
| `currentStatus` + `targetStatus` | Middle forward transition | `confirmed` -> `shipping` | Valid | DT-03 `TARGET-V3`. |
| `currentStatus` + `targetStatus` | Middle state cancel branch | `confirmed` -> `canceled` | Valid | DT-03 `TARGET-V4`. |
| `currentStatus` + `targetStatus` | Backward transition across middle boundary | `shipping` -> `confirmed` | Invalid candidate | DT-03 `TARGET-I7`. |
| `currentStatus` + `targetStatus` | Final forward transition | `shipping` -> `delivered` | Valid | DT-03 `TARGET-V5`. |
| `currentStatus` + `targetStatus` | Same-current terminal boundary | `delivered` -> `delivered` | Invalid candidate | DT-03 `TARGET-I6`; DT-04 `DT-TC020`. |
| `currentStatus` + `targetStatus` | Canceled terminal/side-branch boundary | `canceled` -> `delivered` | Confirmation-needed valid candidate from observed UI | DT-03 `TARGET-C1`; DT-04 `DT-TC019`. |
| `currentStatus` + `targetStatus` | Outside ordered enum | `pending` -> `returned` | Invalid | DT-03 `TARGET-I4`, `STATUS-I2`. |

---

## BVA Test Cases

| TC ID | Input | Expected Result | Covered Boundary | Notes |
|-------|-------|-----------------|------------------|-------|
| BVA-TC001 | Registered user cancels existing own order with ID `1`, if ID 1 belongs to that user in the run; otherwise create/use the first generated own order ID. | Cancel succeeds when order exists, is owned by the user, and is in a cancel-valid state. | `orderId` minimum valid positive ID shape | Validity depends on existence/ownership, not numeric value alone. |
| BVA-TC002 | Registered user cancels existing own order with the next generated positive ID, e.g. `2` when available. | Cancel succeeds when order exists, is owned by the user, and is in a cancel-valid state. | `orderId` minimum + 1 positive ID shape | Confirms adjacent positive ID shape. |
| BVA-TC003 | Registered user calls cancel endpoint with `orderId=0`. | Request is rejected; no order status changes. | `orderId` lower boundary min - 1 | Covers invalid zero ID. |
| BVA-TC004 | Registered user calls cancel endpoint with `orderId=-1`. | Request is rejected; no order status changes. | `orderId` negative side of lower boundary | Covers invalid negative ID. |
| BVA-TC005 | Registered user calls cancel endpoint with `orderId=999999`. | Request is rejected as nonexistent; no order status changes. | High positive nonexistent ID | Not a max-boundary test because no upper limit is specified. |
| BVA-TC006 | Registered user cancels own `pending` order. | Request succeeds; status becomes `canceled`. | User cancel first state boundary | Confirms cancel at earliest workflow state. |
| BVA-TC007 | Registered user cancels own `confirmed` order. | Request succeeds; status becomes `canceled`. | User cancel adjacent valid state | Confirms cancel one step after `pending`. |
| BVA-TC008 | Registered user cancels own `shipping` order. | Confirmation-needed: either succeeds or is rejected without inconsistent state. | User cancel boundary after confirmed | Same boundary as DT-TC003. |
| BVA-TC009 | Registered user attempts direct API cancel on own `canceled` order. | Request is rejected or no-ops; status remains `canceled`. | User cancel terminal canceled boundary | UI action should be hidden. |
| BVA-TC010 | Registered user attempts direct API cancel on own `delivered` order. | Request is rejected; status remains `delivered`. | User cancel terminal delivered boundary | UI action should be hidden. |
| BVA-TC011 | Admin updates `pending` order to `confirmed`. | Request succeeds; status becomes `confirmed`. | Admin first forward transition boundary | Covers start of ordered workflow. |
| BVA-TC012 | Admin updates `pending` order to `canceled`. | Request succeeds; status becomes `canceled`. | Admin first-state cancel branch | Covers side branch from minimum state. |
| BVA-TC013 | Admin updates `confirmed` order to `pending`. | Request is rejected or fails safely; status remains `confirmed`. | Backward transition across first boundary | Confirmation-needed invalid candidate. |
| BVA-TC014 | Admin updates `confirmed` order to `shipping`. | Request succeeds; status becomes `shipping`. | Admin middle forward transition boundary | Covers adjacent forward step. |
| BVA-TC015 | Admin updates `confirmed` order to `canceled`. | Request succeeds; status becomes `canceled`. | Admin middle-state cancel branch | Covers cancel branch before shipping. |
| BVA-TC016 | Admin updates `shipping` order to `confirmed`. | Request is rejected or fails safely; status remains `shipping`. | Backward transition across middle boundary | Invalid candidate. |
| BVA-TC017 | Admin updates `shipping` order to `delivered`. | Request succeeds; status becomes `delivered`. | Admin final forward transition boundary | Covers transition into final delivered state. |
| BVA-TC018 | Admin updates `delivered` order to `delivered`. | Request is rejected or no-ops; status remains `delivered`. | Same-current terminal boundary | Confirms delivered terminal behavior. |
| BVA-TC019 | Admin updates `canceled` order to `delivered`. | Confirmation-needed: UI exposes this transition; execution determines whether it succeeds. | Canceled terminal/side-branch boundary | Same boundary as DT-TC019. |
| BVA-TC020 | Admin updates `pending` order to outside-enum target `returned`. | Request is rejected; status remains `pending`. | Outside ordered enum boundary | Confirms invalid status value cannot create a new state. |

---

## Boundary Exclusions

| Variable | Excluded Boundary | Reason |
|----------|-------------------|--------|
| `actorContext` | Min/max | No numeric, length, date/time, or ordered boundary. |
| `ownershipRelation` | Min/max | Ownership is categorical, not ordered. |
| `orderId` | Maximum - 1, maximum, maximum + 1 | No explicit upper bound is specified for generated order IDs. |
| `targetStatus` string length | Empty/non-string/outside enum are domain partitions, not specified length boundaries. |
| Order total/date/address/customer fields | Display-only or out of FR-10 state-machine scope. |

---

## Traceability to Domain Tests

| BVA Case | Related DT Case(s) |
|----------|--------------------|
| BVA-TC001, BVA-TC002 | DT-TC001, DT-TC002 |
| BVA-TC003, BVA-TC004 | DT-TC013 |
| BVA-TC005 | DT-TC007 |
| BVA-TC006 through BVA-TC010 | DT-TC001 through DT-TC005 |
| BVA-TC011 through BVA-TC020 | DT-TC014 through DT-TC022, DT-TC026 |

---

## Human Review Checklist

- [x] Every explicit numeric lower boundary identified.
- [x] Ordered state-machine boundaries identified.
- [x] Invalid boundaries included.
- [x] Nominal values selected where the SUT has no explicit maximum.
- [x] Variables without explicit boundaries excluded.
