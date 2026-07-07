# DT-02 - Domain Identification
**Feature:** FR-20 - Mobile App - Shopping Cart  
**Date:** 2026-07-07  
**Skill:** DT-02  
**Status:** Completed

---

## Verified Input

This DT-02 artifact uses the approved output from:

- `eshop-sut/tests/FR20_MobileCart/DT-01-feature-understanding.md`
- `eshop-sut/tests/FR20_MobileCart/REVIEW-01-after-DT-01.md`

Mobile constraint preserved:

- UI behavior will be validated manually on the Expo emulator.
- API behavior may be validated with Node.js `fetch`, axios, or cURL.
- No Playwright/browser UI automation is used for this mobile feature.

---

## Domain Identification Table

| Variable | Type | Valid Domain | Invalid Domain | Evidence |
|----------|------|--------------|----------------|----------|
| `authToken` | JWT string / session credential | Valid registered-user token sent as `Authorization: Bearer <token>`. | Missing header; empty token; malformed token string; expired or invalid token; token not accepted by backend. | API spec states cart APIs require `Authorization: Bearer <token>`; DT-01 BR-01. |
| `selectedProductId` | Integer / product reference | Existing product ID returned by `GET /api/products` or visible from product detail/product card. | Missing product ID; non-numeric ID; negative ID; zero ID if no product exists with ID `0`; non-existing numeric ID. | API spec `GET /api/products`, `GET /api/products/:id`, `POST /api/cart` body includes `id`; DT-01 FI-02. |
| `apiCartItemName` | String | Non-empty product name associated with the selected product when testing `POST /api/cart` directly. | Missing name; empty string; non-string value; name that does not match selected product when consistency is checked. | API spec `POST /api/cart` body includes `name`; DT-01 notes product name is display data in UI but part of API cart payload. |
| `apiCartItemPrice` | Number | Positive numeric product price associated with the selected product when testing `POST /api/cart` directly. | Missing price; non-numeric price; zero price unless free products are explicitly supported; negative price; price that does not match selected product when consistency is checked. | API spec `POST /api/cart` body includes `price`; DT-01 BR-10 uses price for subtotal. |
| `addProductFromListAction` | Action | User taps `Thêm vào giỏ` on an available product card; default quantity is used. | Action attempted when no product is available; repeated rapid taps if they create duplicate or inconsistent cart state; action unavailable from current screen. | Feature input FI-02; DT-01 BR-03 and OQ-02. |
| `selectedQuantity` | Numeric text | Positive whole-number quantity text entered on product detail before add-to-cart. | Empty text; whitespace only; non-numeric text; zero; negative number; fractional/decimal text; extremely large number beyond practical cart handling. | Feature input FI-03; API spec quantity field; DT-01 BR-04, BR-05. |
| `addProductFromDetailAction` | Action | User taps `Thêm vào giỏ hàng` on a product detail screen after selecting a product and quantity. | Action attempted without a selected product; action attempted with invalid `selectedQuantity`; repeated rapid taps if they create duplicate or inconsistent cart state; action unavailable from current screen. | Feature input FI-04; DT-01 BR-04 and OQ-02. |
| `cartItemQuantity` | Numeric text | Positive whole-number quantity text for an existing cart row. | Empty text; whitespace only; non-numeric text; zero; negative number; fractional/decimal text; extremely large number beyond practical cart handling; quantity edited for a removed/non-existing row. | Feature input FI-05; populated cart screenshot shows editable quantity; DT-01 BR-05, BR-08. |
| `selectedCartItem` | Row reference / object reference | Existing cart row selected by interacting with its quantity field or `Xóa` button. | No row selected; stale row after item removal; row index outside current cart; row not visible/available in empty cart. | Feature input FI-10; populated cart screenshot shows rows and per-row controls. |
| `removeCartItemAction` | Action | User taps `Xóa` on an existing cart row. | Action attempted in empty cart; action attempted on stale/non-existing row; repeated remove on already removed item. | Feature input FI-06; populated cart screenshot shows `Xóa`; DT-01 BR-09. |
| `continueShoppingFromEmptyCartAction` | Action | User taps `Tiếp tục mua sắm` while cart item count is `0`. | Action unavailable from populated cart state; action attempted when current screen is not empty cart. | Feature input FI-07; empty cart screenshot; DT-01 BR-07. |
| `continueShoppingFromCartAction` | Action | User taps `← Mua tiếp` while cart item count is greater than `0`. | Action unavailable from empty cart state; action attempted when current screen is not populated cart. | Feature input FI-08; populated cart screenshot. |
| `proceedToCheckoutAction` | Action | User taps `Tiến hành thanh toán` while cart has at least one item and user is authenticated. | Action attempted with empty cart; action attempted while unauthenticated; action unavailable from current screen. | Feature input FI-09; populated cart screenshot; DT-01 BR-11. |
| `cartItemCount` | Integer state | `0` for empty cart; `1` for single-item cart; `2+` for multi-item cart. | Negative count; non-integer count; header count inconsistent with actual cart rows; item count unchanged after add/remove. | Empty screenshot shows `Giỏ (0)`; populated screenshot shows `Giỏ (2)`; DT-01 FI-12. |

---

## Non-Overlapping Domain Classes

### `authToken`

| Class ID | Domain Class | Expected Handling |
|----------|--------------|-------------------|
| AUTH-V1 | Valid registered-user token | Cart API request is accepted if other inputs are valid. |
| AUTH-I1 | Missing token/header | Cart API request is rejected as unauthorized. |
| AUTH-I2 | Empty or malformed token | Cart API request is rejected as unauthorized. |
| AUTH-I3 | Invalid/expired token | Cart API request is rejected as unauthorized. |

### Product Selection and API Product Payload

| Class ID | Domain Class | Variables | Expected Handling |
|----------|--------------|-----------|-------------------|
| PROD-V1 | Existing product with matching `id`, `name`, and positive `price` | `selectedProductId`, `apiCartItemName`, `apiCartItemPrice` | Product can be added to cart. |
| PROD-I1 | Missing product reference | `selectedProductId` | Add-to-cart is rejected or cannot be performed. |
| PROD-I2 | Malformed product reference | `selectedProductId` | Add-to-cart is rejected or cannot be performed. |
| PROD-I3 | Non-existing product reference | `selectedProductId` | Add-to-cart is rejected or product detail cannot be retrieved. |
| PROD-I4 | Direct API payload has missing/invalid `name` or `price` | `apiCartItemName`, `apiCartItemPrice` | API should reject or avoid creating inconsistent cart data. |
| PROD-I5 | Direct API payload product fields are inconsistent with catalog | `selectedProductId`, `apiCartItemName`, `apiCartItemPrice` | API should reject or normalize to catalog data if consistency is enforced. |

### Quantity Inputs

| Class ID | Domain Class | Applies To | Expected Handling |
|----------|--------------|------------|-------------------|
| QTY-V1 | Positive whole-number quantity | `selectedQuantity`, `cartItemQuantity` | Cart quantity is accepted and totals update. |
| QTY-I1 | Empty or whitespace-only input | `selectedQuantity`, `cartItemQuantity` | Input is rejected, normalized, or handled without corrupting cart state. |
| QTY-I2 | Non-numeric text | `selectedQuantity`, `cartItemQuantity` | Input is rejected, normalized, or handled without corrupting cart state. |
| QTY-I3 | Zero | `selectedQuantity`, `cartItemQuantity` | Should not create a zero-quantity cart line. |
| QTY-I4 | Negative number | `selectedQuantity`, `cartItemQuantity` | Should not create or keep a negative-quantity cart line. |
| QTY-I5 | Fractional/decimal text | `selectedQuantity`, `cartItemQuantity` | Should be rejected or consistently normalized to a whole-number quantity. |
| QTY-I6 | Extremely large whole number | `selectedQuantity`, `cartItemQuantity` | Should be constrained, rejected, or handled without overflow/unusable UI. |

### Cart State

| Class ID | Domain Class | Applies To | Expected Handling |
|----------|--------------|------------|-------------------|
| CART-V1 | Empty cart | `cartItemCount = 0` | Empty message and `Tiếp tục mua sắm` are shown; row actions are unavailable. |
| CART-V2 | Single-item cart | `cartItemCount = 1` | One row is shown; quantity/remove/checkout actions are available. |
| CART-V3 | Multi-item cart | `cartItemCount >= 2` | Multiple rows are shown; subtotal is sum of line totals. |
| CART-I1 | Header count differs from actual row count | `cartItemCount` | UI state is inconsistent and should be reported as a defect. |
| CART-I2 | Negative or non-integer cart count | `cartItemCount` | Invalid state; should never be displayed or persisted. |

### Action Availability

| Class ID | Domain Class | Variables | Expected Handling |
|----------|--------------|-----------|-------------------|
| ACT-V1 | Action is triggered from the correct screen and state | All action variables | Navigation/cart state changes as specified. |
| ACT-I1 | Action is triggered from the wrong screen/state | All action variables | Action should be unavailable or should have no invalid side effect. |
| ACT-I2 | Repeated rapid action | Add/remove/checkout actions | App should avoid duplicate, stale, or inconsistent state. |

---

## Constraints

| Constraint ID | Constraint |
|---------------|------------|
| C-01 | `GET /api/cart` and `POST /api/cart` require a valid `Authorization: Bearer <token>` header. |
| C-02 | `POST /api/cart` requires cart item payload fields `id`, `name`, `price`, and `quantity` according to the API specification. |
| C-03 | Cart UI quantity inputs represent whole item counts; fractional, negative, zero, and non-numeric values are outside the valid domain unless the app explicitly normalizes them. |
| C-04 | `selectedCartItem`, `removeCartItemAction`, and `cartItemQuantity` require a populated cart with at least one existing row. |
| C-05 | `continueShoppingFromEmptyCartAction` is only available in empty cart state. |
| C-06 | `continueShoppingFromCartAction` and `proceedToCheckoutAction` are only available in populated cart state. |
| C-07 | `proceedToCheckoutAction` requires an authenticated user session and at least one cart item. Checkout form behavior remains out of scope. |
| C-08 | Subtotal display must equal the sum of all line totals, where each line total is `price * quantity`. |
| C-09 | UI test execution must be manual on Expo emulator; automated execution is limited to API-level scripts. |

---

## Dependencies Between Variables

| Dependency ID | Variables | Relationship |
|---------------|-----------|--------------|
| D-01 | `authToken` -> `GET /api/cart`, `POST /api/cart` | API cart operations depend on a valid authenticated session. |
| D-02 | `selectedProductId` -> `apiCartItemName`, `apiCartItemPrice` | Direct API cart payload should refer to a real product and consistent product data. |
| D-03 | `selectedProductId` + `selectedQuantity` + `addProductFromDetailAction` | Product detail add-to-cart requires a selected product and quantity before action. |
| D-04 | `selectedProductId` + `addProductFromListAction` | Product list add-to-cart requires an available selected product; quantity defaults to `1`. |
| D-05 | `cartItemCount` -> cart screen state | `0` shows empty cart behavior; `1+` shows populated cart rows and actions. |
| D-06 | `selectedCartItem` + `cartItemQuantity` | Quantity editing applies only to a selected existing row. |
| D-07 | `selectedCartItem` + `removeCartItemAction` | Remove action applies only to a selected existing row. |
| D-08 | `cartItemQuantity` + `apiCartItemPrice` -> subtotal | Line and cart totals depend on quantity and price. |
| D-09 | `cartItemCount` + `proceedToCheckoutAction` + `authToken` | Checkout transition requires populated cart and authenticated user. |

---

## Excluded From Domain Testing

| Excluded Element | Reason |
|------------------|--------|
| Static app title/header text | Not user-controllable input. |
| Static cart screen title | Display-only. |
| Footer copyright text | Display-only. |
| Product name/price as cart-screen display fields | Display-only in UI; only included as API payload variables when directly testing `POST /api/cart`. |
| Checkout coupon and payment confirmation fields | Belong to checkout feature, not shopping cart feature. |

---

## Human Review Checklist

- [x] Every DT-01 input variable is represented.
- [x] Hidden/API inputs that affect behavior are included.
- [x] Display-only fields are excluded unless they are direct API payload inputs.
- [x] Valid and invalid domains are separated.
- [x] Domain classes do not intentionally overlap.
- [x] Constraints and variable dependencies are documented.
- [x] Mobile manual-execution constraint is preserved.

Next skill: `REVIEW-01`.
