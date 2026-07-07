# DT-01 - Feature Understanding
**Feature:** FR-20 - Mobile App - Shopping Cart  
**Date:** 2026-07-07  
**Skill:** DT-01  
**Status:** Completed

---

## Scope

The Mobile App Shopping Cart feature allows a registered user to build and manage a cart from the mobile product catalog before checkout.

In scope for domain testing:

- Add a product to cart from the product list.
- Add a product to cart from the product detail screen with a selected quantity.
- View the cart in empty and populated states.
- Edit quantity for an existing cart line item.
- Remove a selected cart line item.
- Continue shopping from empty or populated cart.
- Start checkout from a populated cart.
- Validate API-backed cart behavior through authenticated cart endpoints where applicable.

Out of scope for this feature:

- Product catalog search/filter correctness.
- Product detail content correctness beyond selecting a cart item and quantity.
- Checkout form fields, coupon behavior, payment confirmation, and order creation.
- Static header/footer labels and derived display-only values as direct inputs.
- Browser-based Playwright UI automation.

---

## Source Artifacts Used

| Source | Use |
|--------|-----|
| `FEATURE_INPUT_FR20_CART.md` | Feature inputs and declared domain variables. |
| `eshop-sut/WORKFLOW.md` | Workflow sequence and embedded feature input context. |
| `eshop-sut/SKILLS_mobile.md` | Mobile testing constraints and hybrid API/manual UI approach. |
| `eshop-sut/api_specification.md` | Authentication, product, and cart API contract. |
| `eshop-sut/tests/FR20_MobileCart/ENV-01.md` | Environment findings and screenshot evidence summary. |
| `eshop-sut/tests/FR20_MobileCart/ENV-01-ui-state.json` | Structured observed empty/populated cart states. |
| `eshop-sut/tests/FR20_MobileCart/screenshots/cart_ui_empty.jpg` | Empty cart UI evidence. |
| `eshop-sut/tests/FR20_MobileCart/screenshots/cart_ui_populated.jpg` | Populated cart UI evidence. |

Note: the original prompt referenced `eshop-sut/tests/FR20_Carts/screenshots/`, but the available screenshot evidence in this workspace is under `eshop-sut/tests/FR20_MobileCart/screenshots/`.

---

## Primary Actor

| Actor | Role in Feature |
|-------|-----------------|
| Registered User | Primary actor. Uses an authenticated mobile session or token to perform API-backed cart operations and proceed toward checkout. |

Unauthenticated behavior is not the target user type for this feature. If encountered during manual UI testing, it should be treated as a precondition or access-control observation, not the main domain under test.

---

## Related API Contract

| Method | Endpoint | Relevance |
|--------|----------|-----------|
| `POST` | `/api/login` | Produces the registered-user JWT token used in `Authorization: Bearer <token>`. |
| `GET` | `/api/products` | Supplies selectable products for cart entry. |
| `GET` | `/api/products/:id` | Supplies product detail context before adding with quantity. |
| `GET` | `/api/cart` | Retrieves authenticated user's cart. Requires Authorization header. |
| `POST` | `/api/cart` | Adds a product to authenticated user's cart using `id`, `name`, `price`, and `quantity`. Requires Authorization header. |
| `POST` | `/api/checkout` | Downstream action started from cart; checkout details are out of scope for this feature. |

Per the API specification, cart endpoints require:

```text
Authorization: Bearer <token>
```

The `POST /api/cart` body is specified as:

```json
{
  "id": 1,
  "name": "Sản phẩm A",
  "price": 100000,
  "quantity": 2
}
```

---

## Feature Inputs Identified

| Input ID | Variable | Type | Input Mechanism | Required / Conditional | Initial DT-01 Understanding |
|----------|----------|------|-----------------|------------------------|-----------------------------|
| FI-01 | `authToken` | JWT string | Authenticated session / API header | Required for API-backed cart behavior | Determines whether `GET /api/cart` and `POST /api/cart` are authorized. |
| FI-02 | `selectedProductId` | Integer / product reference | Product card or product detail selection | Required when adding an item | Identifies the product line to add or display in cart. |
| FI-03 | `addProductFromListAction` | Action | Product list `Thêm vào giỏ` | Conditional | Adds selected product with default quantity. |
| FI-04 | `selectedQuantity` | Numeric text | Product detail `Số lượng` field | Conditional | Quantity requested before adding from detail screen. |
| FI-05 | `addProductFromDetailAction` | Action | Product detail `Thêm vào giỏ hàng` | Conditional | Submits the selected product and selected quantity to the cart. |
| FI-06 | `cartItemQuantity` | Numeric text | Cart row quantity field | Conditional | Updates quantity for an existing cart row. |
| FI-07 | `selectedCartItem` | Row / object reference | Interaction with a specific cart line item | Conditional | Determines which row is edited or removed. |
| FI-08 | `removeCartItemAction` | Action | Cart row `Xóa` button | Conditional | Removes the selected cart item. |
| FI-09 | `continueShoppingFromEmptyCartAction` | Action | Empty cart `Tiếp tục mua sắm` | Optional | Navigates back to product browsing from empty cart. |
| FI-10 | `continueShoppingFromCartAction` | Action | Populated cart `← Mua tiếp` | Optional | Navigates back to product browsing while preserving cart state. |
| FI-11 | `proceedToCheckoutAction` | Action | Populated cart `Tiến hành thanh toán` | Conditional | Starts checkout only when cart is populated and user is logged in. |
| FI-12 | `cartItemCount` | Integer state | Derived cart state / header count | Conditional precondition/output | Drives empty vs populated cart behavior and cart count display. |

---

## Observable Outputs

### Empty Cart State

| Output | Observed Value |
|--------|----------------|
| Header cart count | `Giỏ (0)` |
| Empty message | `Giỏ hàng của bạn đang trống` |
| Available action | `Tiếp tục mua sắm` |

### Populated Cart State

| Output | Observed Value |
|--------|----------------|
| Header cart count | `Giỏ (2)` |
| Product rows | 2 rows visible |
| Row controls | Editable quantity field and `Xóa` action |
| Total | `Tổng tạm tính: 58.000.000 đ` |
| Available actions | `← Mua tiếp`, `Tiến hành thanh toán` |

Visible populated-cart rows:

| Product | Price | Quantity | Line Total |
|---------|-------|----------|------------|
| iPhone 15 Pro Max | `30.000.000 đ` | `1` | `30.000.000 đ` |
| Samsung Galaxy S24 Ultra | `28.000.000 đ` | `1` | `28.000.000 đ` |

---

## Business Rules and Expected Behavior

| Rule ID | Rule |
|---------|------|
| BR-01 | Cart API operations require a registered-user Authorization token. |
| BR-02 | A product must exist before it can be added to the cart. |
| BR-03 | Adding from product list uses a default quantity of `1`. |
| BR-04 | Adding from product detail uses the entered `selectedQuantity`. |
| BR-05 | Quantity inputs represent item counts and should be positive numeric values. |
| BR-06 | Adding the same product again should result in one cart line with increased quantity, or otherwise preserve a clear consistent cart representation. |
| BR-07 | Empty cart state displays no line items and provides a continue-shopping action. |
| BR-08 | Populated cart state displays each line item with product name, price, editable quantity, remove action, line total, and cart subtotal. |
| BR-09 | Removing a selected item deletes that item from the cart and updates item count and subtotal. |
| BR-10 | Cart subtotal equals the sum of `price * quantity` for all cart line items. |
| BR-11 | Proceeding to checkout is only meaningful when the cart has at least one item and the user is authenticated. |

---

## Domain Variables for Later Partitioning

| Variable | Candidate Domain Focus |
|----------|------------------------|
| `authToken` | Missing, malformed, expired/invalid, valid registered-user token. |
| `selectedProductId` | Existing product, non-existing product, malformed product reference. |
| `selectedQuantity` | Empty, non-numeric, zero, negative, valid positive integer, large integer, decimal-like input. |
| `cartItemQuantity` | Empty, non-numeric, zero, negative, valid positive integer, large integer, decimal-like input. |
| `selectedCartItem` | Existing row, removed row/stale row, no selected row. |
| `cartItemCount` | `0`, `1`, multiple items. |
| Action variables | Tapped/not tapped, repeated taps, action on empty vs populated cart. |

---

## Assumptions

- Manual UI validation will be performed by the human tester on the Expo emulator.
- API-level validation may use Node.js `fetch`, axios, or cURL against the backend.
- No browser Playwright UI scripts will be generated for this mobile feature.
- The registered-user token can be obtained through `POST /api/login` before API cart tests.
- The screenshot pair is sufficient evidence for the initial empty and populated cart UI states.
- The exact maximum quantity, product ID range, and cart size limit are not specified in the API document and must be explored during later domain and BVA steps.

---

## Open Questions / Risks

| ID | Question / Risk | Impact |
|----|------------------|--------|
| OQ-01 | The API specification defines `GET /api/cart` and `POST /api/cart`, while ENV-01 notes that observed mobile cart behavior is maintained in mobile app state. | API and mobile UI behavior may diverge during execution. |
| OQ-02 | No screenshot evidence was provided for product list or product detail add-to-cart controls. | Manual UI execution must confirm those entry points. |
| OQ-03 | No screenshot evidence was provided for checkout transition or unauthenticated checkout gate. | Later execution may need human-provided screenshots if checkout action is tested. |
| OQ-04 | No API error model is specified for invalid cart input. | Expected results for invalid API bodies may need to be written in behavior-focused form. |

---

## Human Review Checklist

- [x] Feature scope identified.
- [x] Target actor identified.
- [x] Related API contract identified.
- [x] Mobile testing constraint preserved.
- [x] Existing screenshot evidence referenced.
- [x] Feature inputs mapped to variables.
- [x] Candidate outputs and business rules documented.
- [x] Open questions recorded for later review.

Next skill: `REVIEW-01`.
