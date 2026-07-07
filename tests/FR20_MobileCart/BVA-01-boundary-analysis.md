# BVA-01 - Boundary Value Analysis
**Feature:** FR-20 - Mobile App - Shopping Cart  
**Date:** 2026-07-07  
**Skill:** BVA-01  
**Status:** Completed

---

## Evidence Sources

| Source | Use |
|--------|-----|
| `tests/FR20_MobileCart/DT-02-domain-identification.md` | Verified numeric inputs and constraints. |
| `tests/FR20_MobileCart/DT-03-domain-partitioning.md` | Lower-bound partitions for numeric cart inputs. |
| `tests/FR20_MobileCart/DT-04-test-cases.md` | Existing domain coverage and representative quantities. |
| `tests/FR20_MobileCart/execution.md` | API execution results and manual UI execution notes. |
| `tests/FR20_MobileCart/BUG-01-summary.md` | Confirmed defects and manual Expo findings. |
| `eshop-sut/api_specification.md` | API payload fields for `/api/cart`. |
| `eshop-sut/frontend-mobile/App.js` | Observable mobile behavior for quantity entry and cart display. |

---

## BVA Applicability Decision

BVA applies to ordered numeric inputs with explicit lower bounds. For FR-20 Mobile Cart, the defensible boundary inputs are:

- `selectedProductId` for direct cart payloads and catalog selection.
- `selectedQuantity` on Product Detail.
- `cartItemQuantity` on the Cart screen.
- `apiCartItemPrice` when validating `POST /api/cart` directly.

The feature does not define an explicit maximum value for any of these numeric inputs. Therefore, upper-bound rows such as `max - 1`, `max`, and `max + 1` are not generated.

---

## Boundary Variable Review

| Variable | Boundary Type | Explicit Boundary Found? | BVA Decision | Reason |
|----------|---------------|--------------------------|--------------|--------|
| `selectedProductId` | Ordered integer product identifier | Yes, lower boundary at `1` | Included | Product IDs are positive integers in the seeded catalog. `0` is below the minimum, `1` is the minimum valid identifier, and `2` is the next integer. |
| `selectedQuantity` | Ordered integer item count | Yes, lower boundary at `1` | Included | Quantity represents item count and should be a positive whole number. Manual UI evidence showed invalid values are accepted, so lower-bound coverage is necessary. |
| `cartItemQuantity` | Ordered integer item count | Yes, lower boundary at `1` | Included | Cart-row quantity uses the same item-count semantics as product-detail quantity. |
| `apiCartItemPrice` | Ordered integer currency value | Yes, lower boundary at `1` | Included | The cart API accepts price as a numeric payload field. A value of `0` or below is invalid for normal catalog items. |
| `authToken` | Token string | No explicit ordered/length boundary | Excluded | Authentication state is categorical, not a numeric/length boundary in this feature. |
| `selectedCartItem` | Row reference | No explicit ordered boundary | Excluded | This is a selection/reference value, not a bounded numeric input. |
| `cartItemCount` | Derived state | No explicit user-input boundary | Excluded | It is an output/state indicator, not a direct input boundary for BVA. |
| Action inputs | Control events | No explicit ordered boundary | Excluded | Buttons are categorical controls, not boundary-driven numeric inputs. |

---

## Boundary Values

| Variable | Boundary | Test Value | Expected Classification |
|----------|----------|------------|------------------------|
| `selectedProductId` | Minimum - 1 | `0` | Invalid |
| `selectedProductId` | Minimum | `1` | Valid |
| `selectedProductId` | Minimum + 1 | `2` | Valid |
| `selectedProductId` | Nominal | `3` | Valid |
| `selectedQuantity` | Minimum - 1 | `0` | Invalid |
| `selectedQuantity` | Minimum | `1` | Valid |
| `selectedQuantity` | Minimum + 1 | `2` | Valid |
| `selectedQuantity` | Nominal | `3` | Valid |
| `cartItemQuantity` | Minimum - 1 | `0` | Invalid |
| `cartItemQuantity` | Minimum | `1` | Valid |
| `cartItemQuantity` | Minimum + 1 | `2` | Valid |
| `cartItemQuantity` | Nominal | `3` | Valid |
| `apiCartItemPrice` | Minimum - 1 | `0` | Invalid |
| `apiCartItemPrice` | Minimum | `1` | Valid |
| `apiCartItemPrice` | Minimum + 1 | `2` | Valid |
| `apiCartItemPrice` | Nominal | `30000000` | Valid |

---

## Boundary Notes

- Manual Expo evidence already confirmed that `-1`, `0`, and `1.5` are accepted on the Product Detail quantity input, so the BVA set above is expected to expose the same defect family.
- The cart API execution already showed that invalid payload values are accepted, including invalid `quantity` and `price` values. This makes the lower-bound API checks especially important.
- No upper maximum was defined in the specification or observed in the mobile UI, so very large values remain exploratory rather than formal BVA rows.

---

## Boundary Exclusions

| Variable | Excluded Boundary | Reason |
|----------|-------------------|--------|
| `selectedProductId` | Upper maximum / maximum - 1 / maximum + 1 | No explicit maximum product ID boundary is specified. |
| `selectedQuantity` | Upper maximum / maximum - 1 / maximum + 1 | No explicit maximum quantity is specified. |
| `cartItemQuantity` | Upper maximum / maximum - 1 / maximum + 1 | No explicit maximum cart-row quantity is specified. |
| `apiCartItemPrice` | Upper maximum / maximum - 1 / maximum + 1 | No explicit maximum cart price boundary is specified. |
| `email`-style inputs | Any length boundary | This feature does not use email as a bounded cart input. |
| `authToken` | Length / token expiry boundary | Token validity is categorical in this feature, not a documented numeric boundary. |

---

## Human Review Checklist

- [x] Every bounded numeric variable was reviewed.
- [x] Lower boundaries were identified for cart-relevant numeric inputs.
- [x] Invalid boundary values are included.
- [x] Nominal values were selected using normal cart/product values.
- [x] Variables without explicit boundaries were excluded from formal BVA.

Next skill: `EXEC-01`.
