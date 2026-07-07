# DT-04 - Domain Test Case Generation
**Feature:** FR-20 - Mobile App - Shopping Cart  
**Date:** 2026-07-07  
**Skill:** DT-04  
**Status:** Completed  
**Input:** Reviewed `DT-03-domain-partitioning.md` + `REVIEW-01-after-DT-03.md`

---

## Test Design Rules

- Use one representative value per partition unless dependency coverage requires another combination.
- Keep API-only payload tests separate from manual Expo emulator UI tests.
- Do not generate Playwright/browser UI automation for this mobile feature.
- Treat wrong-screen or impossible UI action partitions as control-availability checks instead of forcing artificial UI events.
- These are designed test cases only; they have not been executed in this skill.

---

## Test Data Conventions

| Symbol | Meaning |
|--------|---------|
| `validUserToken` | JWT from `POST /api/login` for a registered user. |
| `invalidToken` | Tampered or expired-looking bearer token that backend should reject. |
| `existingProduct` | Product returned by `GET /api/products`, for example iPhone 15 Pro Max. |
| `existingProduct.id` | Existing positive product ID. |
| `existingProduct.name` | Product name from catalog. |
| `existingProduct.price` | Positive product price from catalog. |
| `missingProductId` | Positive integer not present in catalog, for example `999999`. |
| Mobile UI | Expo emulator manual execution by human tester. |

---

## API-Level Domain Test Cases

| TC ID | Input | Expected Result | Covered Domain | Business Rule |
|-------|-------|-----------------|----------------|---------------|
| DT-TC001 | `GET /api/cart` with `Authorization: Bearer validUserToken`. | Request is authorized and returns the user's cart state. | AUTH-P01-VALID | BR-01 |
| DT-TC002 | `GET /api/cart` with no Authorization header. | Request is rejected as unauthorized. | AUTH-P02-MISSING | BR-01 |
| DT-TC003 | `GET /api/cart` with `Authorization: Bearer ` and no token value. | Request is rejected as unauthorized. | AUTH-P03-EMPTY | BR-01 |
| DT-TC004 | `GET /api/cart` with malformed header, for example `Authorization: Basic validUserToken`. | Request is rejected as unauthorized. | AUTH-P04-MALFORMED | BR-01 |
| DT-TC005 | `GET /api/cart` with `Authorization: Bearer invalidToken`. | Request is rejected as unauthorized. | AUTH-P05-INVALID | BR-01 |
| DT-TC006 | `POST /api/cart` with valid token and body using `existingProduct.id`, `existingProduct.name`, `existingProduct.price`, `quantity: 2`. | Product is accepted into cart; returned/reloaded cart contains the item with quantity `2`. | PRODID-P01-EXISTING, NAME-P01-VALID, PRICE-P01-VALID, SELQTY-P01-VALID_POSITIVE_INTEGER | BR-01, BR-02, BR-04, BR-05, BR-10 |
| DT-TC007 | `POST /api/cart` with valid token and body missing `id`. | Request is rejected or fails safely; cart is not corrupted. | PRODID-P02-MISSING | BR-02 |
| DT-TC008 | `POST /api/cart` with valid token and `id: "abc"`. | Request is rejected or fails safely; cart is not corrupted. | PRODID-P03-NON_NUMERIC | BR-02 |
| DT-TC009 | `POST /api/cart` with valid token and `id: 0` or `id: -1`. | Request is rejected or fails safely; cart is not corrupted. | PRODID-P04-ZERO_OR_NEGATIVE | BR-02 |
| DT-TC010 | `POST /api/cart` with valid token and `id: missingProductId`. | Request is rejected, normalized, or creates no inconsistent product; actual behavior must be recorded. | PRODID-P05-NON_EXISTING_POSITIVE | BR-02, OQ-04 |
| DT-TC011 | `POST /api/cart` with valid token and body missing `name`. | Request is rejected or fails safely; cart is not corrupted. | NAME-P02-MISSING | BR-02, OQ-04 |
| DT-TC012 | `POST /api/cart` with valid token and `name: ""`. | Request is rejected or fails safely; cart is not corrupted. | NAME-P03-EMPTY | BR-02, OQ-04 |
| DT-TC013 | `POST /api/cart` with valid token and `name: 12345`. | Request is rejected or fails safely; cart is not corrupted. | NAME-P04-NON_STRING | BR-02, OQ-04 |
| DT-TC014 | `POST /api/cart` with existing product ID but `name` from a different product. | API should reject or normalize to catalog data; cart must not show inconsistent product identity. | NAME-P05-MISMATCHED | BR-02, OQ-04 |
| DT-TC015 | `POST /api/cart` with valid token and body missing `price`. | Request is rejected or fails safely; cart is not corrupted. | PRICE-P02-MISSING | BR-10, OQ-04 |
| DT-TC016 | `POST /api/cart` with valid token and `price: "abc"`. | Request is rejected or fails safely; totals are not corrupted. | PRICE-P03-NON_NUMERIC | BR-10, OQ-04 |
| DT-TC017 | `POST /api/cart` with valid token and `price: 0`. | Request is rejected unless free products are supported; totals must remain valid. | PRICE-P04-ZERO | BR-10, OQ-04 |
| DT-TC018 | `POST /api/cart` with valid token and `price: -100000`. | Request is rejected or fails safely; negative totals are not created. | PRICE-P05-NEGATIVE | BR-10, OQ-04 |
| DT-TC019 | `POST /api/cart` with existing product ID but positive price from a different product. | API should reject or normalize to catalog price; subtotal must not use inconsistent data. | PRICE-P06-MISMATCHED | BR-10, OQ-04 |
| DT-TC020 | `POST /api/cart` with valid product data and missing/empty `quantity`. | Request is rejected, normalized, or fails safely; no zero/invalid cart line is created. | SELQTY-P02-EMPTY | BR-05, OQ-04 |
| DT-TC021 | `POST /api/cart` with valid product data and `quantity: "abc"`. | Request is rejected, normalized, or fails safely; cart is not corrupted. | SELQTY-P03-NON_NUMERIC | BR-05, OQ-04 |
| DT-TC022 | `POST /api/cart` with valid product data and `quantity: 0`. | Request does not create a zero-quantity cart line. | SELQTY-P04-ZERO | BR-05 |
| DT-TC023 | `POST /api/cart` with valid product data and `quantity: -1`. | Request does not create a negative-quantity cart line. | SELQTY-P05-NEGATIVE | BR-05 |
| DT-TC024 | `POST /api/cart` with valid product data and `quantity: 1.5`. | Request is rejected or consistently normalized to whole-number quantity. | SELQTY-P06_DECIMAL | BR-05 |
| DT-TC025 | `POST /api/cart` with valid product data and `quantity: 999999999`. | Request is constrained, rejected, or handled without overflow/unusable cart state. | SELQTY-P07-EXTREMELY_LARGE | BR-05 |

---

## Manual Mobile UI Domain Test Cases

| TC ID | Input | Expected Result | Covered Domain | Business Rule |
|-------|-------|-----------------|----------------|---------------|
| DT-TC026 | Mobile UI starts with empty cart; open cart and tap `Tiếp tục mua sắm`. | Empty message is shown; cart count is `Giỏ (0)`; tapping continue returns to product browsing. | COUNT-P01-ZERO, CONTEMPTY-P01-EMPTY_CART | BR-07 |
| DT-TC027 | From product list, tap `Thêm vào giỏ` on one available product. | Product is added with default quantity `1`; cart count becomes one item or one row. | ADDLIST-P01-TAP_AVAILABLE_PRODUCT, COUNT-P02-ONE | BR-02, BR-03, BR-08 |
| DT-TC028 | From product list, rapidly tap `Thêm vào giỏ` twice on the same available product. | Cart remains consistent; app either increments quantity or otherwise represents repeated add clearly. | ADDLIST-P04-REPEATED_TAPS, COUNT-P03-MULTIPLE | BR-06, BR-08, BR-10 |
| DT-TC029 | Observe product-list add action when no product card is available, or navigate away from product list and verify list add action is absent. | Add-from-list cannot be triggered without an available product/list screen; no invalid cart state is created. | ADDLIST-P02-NO_PRODUCT_AVAILABLE, ADDLIST-P03-WRONG_SCREEN | BR-02 |
| DT-TC030 | From product detail, enter quantity `2` and tap `Thêm vào giỏ hàng`. | Selected product is added with quantity `2`; cart row and subtotal reflect quantity. | ADDDETAIL-P01-VALID_PRODUCT_VALID_QTY, SELQTY-P01-VALID_POSITIVE_INTEGER | BR-02, BR-04, BR-05, BR-10 |
| DT-TC031 | From product detail, clear the `Số lượng` field and tap `Thêm vào giỏ hàng`. | App rejects or normalizes empty quantity without corrupting cart state. | SELQTY-P02-EMPTY, ADDDETAIL-P03-INVALID_QTY | BR-05 |
| DT-TC032 | From product detail, enter `abc` in `Số lượng` and tap `Thêm vào giỏ hàng`. | App rejects or normalizes non-numeric quantity without corrupting cart state. | SELQTY-P03-NON_NUMERIC, ADDDETAIL-P03-INVALID_QTY | BR-05 |
| DT-TC033 | From product detail, enter `0` in `Số lượng` and tap `Thêm vào giỏ hàng`. | App does not create a zero-quantity line. | SELQTY-P04-ZERO, ADDDETAIL-P03-INVALID_QTY | BR-05 |
| DT-TC034 | From product detail, enter `-1` in `Số lượng` and tap `Thêm vào giỏ hàng`. | App does not create a negative-quantity line. | SELQTY-P05-NEGATIVE, ADDDETAIL-P03-INVALID_QTY | BR-05 |
| DT-TC035 | From product detail, enter `1.5` in `Số lượng` and tap `Thêm vào giỏ hàng`. | App rejects or consistently normalizes decimal quantity to a whole-number count. | SELQTY-P06_DECIMAL, ADDDETAIL-P03-INVALID_QTY | BR-05 |
| DT-TC036 | From product detail, enter `999999999` in `Số lượng` and tap `Thêm vào giỏ hàng`. | App constrains, rejects, or handles the value without overflow/unusable cart state. | SELQTY-P07-EXTREMELY_LARGE, ADDDETAIL-P03-INVALID_QTY | BR-05 |
| DT-TC037 | Confirm add-from-detail cannot be triggered when not on a product detail screen or without a selected product. | The detail add action is unavailable; no cart mutation occurs. | ADDDETAIL-P02-NO_SELECTED_PRODUCT, ADDDETAIL-P04-WRONG_SCREEN | BR-02 |
| DT-TC038 | From product detail, rapidly tap `Thêm vào giỏ hàng` twice with quantity `1`. | Cart remains consistent; app either increments quantity or otherwise represents repeated add clearly. | ADDDETAIL-P05-REPEATED_TAPS | BR-06, BR-08 |
| DT-TC039 | In populated cart, edit an existing row quantity to `3`. | Quantity updates to `3`; line total and subtotal update consistently. | CARTQTY-P01-VALID_POSITIVE_INTEGER, SELITEM-P01-EXISTING_ROW | BR-05, BR-08, BR-10 |
| DT-TC040 | In populated cart, clear an existing row quantity field. | App rejects or normalizes empty quantity without corrupting cart state. | CARTQTY-P02-EMPTY | BR-05 |
| DT-TC041 | In populated cart, enter `abc` in an existing row quantity field. | App rejects or normalizes non-numeric quantity without corrupting cart state. | CARTQTY-P03-NON_NUMERIC | BR-05 |
| DT-TC042 | In populated cart, enter `0` in an existing row quantity field. | App does not keep a zero-quantity cart line. | CARTQTY-P04-ZERO | BR-05 |
| DT-TC043 | In populated cart, enter `-1` in an existing row quantity field. | App does not keep a negative-quantity cart line. | CARTQTY-P05-NEGATIVE | BR-05 |
| DT-TC044 | In populated cart, enter `1.5` in an existing row quantity field. | App rejects or consistently normalizes decimal quantity to a whole-number count. | CARTQTY-P06_DECIMAL | BR-05 |
| DT-TC045 | In populated cart, enter `999999999` in an existing row quantity field. | App constrains, rejects, or handles the value without overflow/unusable UI or totals. | CARTQTY-P07-EXTREMELY_LARGE | BR-05 |
| DT-TC046 | In populated cart, tap `Xóa` for an existing row. | Selected row is removed; item count and subtotal update. | REMOVE-P01-EXISTING_ROW, SELITEM-P01-EXISTING_ROW | BR-09, BR-10 |
| DT-TC047 | In empty cart, verify no row-specific quantity or `Xóa` action is available. | No row can be selected or removed; empty cart remains stable. | SELITEM-P05-EMPTY_CART, REMOVE-P02-EMPTY_CART | BR-07, BR-09 |
| DT-TC048 | Remove a row, then attempt repeated remove or stale quantity edit for the same removed row if the UI still permits it. | Stale operation is ignored or rejected; removed item does not reappear and cart remains consistent. | SELITEM-P03-STALE_REMOVED_ROW, REMOVE-P03-STALE_ROW, REMOVE-P04-REPEATED_REMOVE, CARTQTY-P08-NON_EXISTING_ROW | BR-09 |
| DT-TC049 | Attempt a row-specific operation without selecting a row, or with a row index/control outside visible cart rows if possible. | Operation is unavailable or ignored; no cart mutation occurs. | SELITEM-P02-NONE_SELECTED, SELITEM-P04-OUT_OF_RANGE_ROW | BR-09 |
| DT-TC050 | In populated cart, tap `← Mua tiếp`. | App returns to product browsing while preserving cart contents. | CONTCART-P01-POPULATED_CART | BR-08 |
| DT-TC051 | Check continue-shopping controls in wrong states/screens: empty-cart button while populated, populated-cart button while empty, and either while not on cart screen. | State-specific control is absent or inactive outside its valid screen/state. | CONTEMPTY-P02-POPULATED_CART, CONTEMPTY-P03-WRONG_SCREEN, CONTCART-P02-EMPTY_CART, CONTCART-P03-WRONG_SCREEN | BR-07, BR-08 |
| DT-TC052 | Authenticated user with populated cart taps `Tiến hành thanh toán`. | App navigates to checkout flow; checkout details remain out of cart-feature scope. | CHECKOUT-P01-AUTH_POPULATED_CART | BR-11 |
| DT-TC053 | Empty cart state: verify `Tiến hành thanh toán` is unavailable or cannot be triggered. | Checkout does not start from empty cart. | CHECKOUT-P02-EMPTY_CART | BR-11 |
| DT-TC054 | Unauthenticated user with populated cart taps `Tiến hành thanh toán`. | App blocks checkout and requires login; cart must not be lost. | CHECKOUT-P03-UNAUTH_POPULATED_CART | BR-11 |
| DT-TC055 | Verify checkout action is absent or inactive when not on populated cart screen. | Checkout cannot be triggered from wrong screen. | CHECKOUT-P04-WRONG_SCREEN | BR-11 |
| DT-TC056 | Observe cart count after add/remove/update operations and compare header count with visible rows/items. | Header count never becomes negative/fractional and stays consistent with cart rows; any mismatch is a defect. | COUNT-P04-NEGATIVE, COUNT-P05-NON_INTEGER, COUNT-P06-INCONSISTENT_WITH_ROWS | BR-08, BR-09 |

---

## Coverage Matrix

| Partition ID | Covered By |
|--------------|------------|
| AUTH-P01-VALID | DT-TC001, DT-TC006 |
| AUTH-P02-MISSING | DT-TC002 |
| AUTH-P03-EMPTY | DT-TC003 |
| AUTH-P04-MALFORMED | DT-TC004 |
| AUTH-P05-INVALID | DT-TC005 |
| PRODID-P01-EXISTING | DT-TC006 |
| PRODID-P02-MISSING | DT-TC007 |
| PRODID-P03-NON_NUMERIC | DT-TC008 |
| PRODID-P04-ZERO_OR_NEGATIVE | DT-TC009 |
| PRODID-P05-NON_EXISTING_POSITIVE | DT-TC010 |
| NAME-P01-VALID | DT-TC006 |
| NAME-P02-MISSING | DT-TC011 |
| NAME-P03-EMPTY | DT-TC012 |
| NAME-P04-NON_STRING | DT-TC013 |
| NAME-P05-MISMATCHED | DT-TC014 |
| PRICE-P01-VALID | DT-TC006 |
| PRICE-P02-MISSING | DT-TC015 |
| PRICE-P03-NON_NUMERIC | DT-TC016 |
| PRICE-P04-ZERO | DT-TC017 |
| PRICE-P05-NEGATIVE | DT-TC018 |
| PRICE-P06-MISMATCHED | DT-TC019 |
| ADDLIST-P01-TAP_AVAILABLE_PRODUCT | DT-TC027 |
| ADDLIST-P02-NO_PRODUCT_AVAILABLE | DT-TC029 |
| ADDLIST-P03-WRONG_SCREEN | DT-TC029 |
| ADDLIST-P04-REPEATED_TAPS | DT-TC028 |
| SELQTY-P01-VALID_POSITIVE_INTEGER | DT-TC006, DT-TC030 |
| SELQTY-P02-EMPTY | DT-TC020, DT-TC031 |
| SELQTY-P03-NON_NUMERIC | DT-TC021, DT-TC032 |
| SELQTY-P04-ZERO | DT-TC022, DT-TC033 |
| SELQTY-P05-NEGATIVE | DT-TC023, DT-TC034 |
| SELQTY-P06_DECIMAL | DT-TC024, DT-TC035 |
| SELQTY-P07-EXTREMELY_LARGE | DT-TC025, DT-TC036 |
| ADDDETAIL-P01-VALID_PRODUCT_VALID_QTY | DT-TC030 |
| ADDDETAIL-P02-NO_SELECTED_PRODUCT | DT-TC037 |
| ADDDETAIL-P03-INVALID_QTY | DT-TC031, DT-TC032, DT-TC033, DT-TC034, DT-TC035, DT-TC036 |
| ADDDETAIL-P04-WRONG_SCREEN | DT-TC037 |
| ADDDETAIL-P05-REPEATED_TAPS | DT-TC038 |
| CARTQTY-P01-VALID_POSITIVE_INTEGER | DT-TC039 |
| CARTQTY-P02-EMPTY | DT-TC040 |
| CARTQTY-P03-NON_NUMERIC | DT-TC041 |
| CARTQTY-P04-ZERO | DT-TC042 |
| CARTQTY-P05-NEGATIVE | DT-TC043 |
| CARTQTY-P06_DECIMAL | DT-TC044 |
| CARTQTY-P07-EXTREMELY_LARGE | DT-TC045 |
| CARTQTY-P08-NON_EXISTING_ROW | DT-TC048 |
| SELITEM-P01-EXISTING_ROW | DT-TC039, DT-TC046 |
| SELITEM-P02-NONE_SELECTED | DT-TC049 |
| SELITEM-P03-STALE_REMOVED_ROW | DT-TC048 |
| SELITEM-P04-OUT_OF_RANGE_ROW | DT-TC049 |
| SELITEM-P05-EMPTY_CART | DT-TC047 |
| REMOVE-P01-EXISTING_ROW | DT-TC046 |
| REMOVE-P02-EMPTY_CART | DT-TC047 |
| REMOVE-P03-STALE_ROW | DT-TC048 |
| REMOVE-P04-REPEATED_REMOVE | DT-TC048 |
| CONTEMPTY-P01-EMPTY_CART | DT-TC026 |
| CONTEMPTY-P02-POPULATED_CART | DT-TC051 |
| CONTEMPTY-P03-WRONG_SCREEN | DT-TC051 |
| CONTCART-P01-POPULATED_CART | DT-TC050 |
| CONTCART-P02-EMPTY_CART | DT-TC051 |
| CONTCART-P03-WRONG_SCREEN | DT-TC051 |
| CHECKOUT-P01-AUTH_POPULATED_CART | DT-TC052 |
| CHECKOUT-P02-EMPTY_CART | DT-TC053 |
| CHECKOUT-P03-UNAUTH_POPULATED_CART | DT-TC054 |
| CHECKOUT-P04-WRONG_SCREEN | DT-TC055 |
| COUNT-P01-ZERO | DT-TC026 |
| COUNT-P02-ONE | DT-TC027 |
| COUNT-P03-MULTIPLE | DT-TC028 |
| COUNT-P04-NEGATIVE | DT-TC056 |
| COUNT-P05-NON_INTEGER | DT-TC056 |
| COUNT-P06-INCONSISTENT_WITH_ROWS | DT-TC056 |

---

## Business Rule Coverage

| Business Rule / Question | Covered By |
|--------------------------|------------|
| BR-01: Cart API operations require registered-user Authorization token | DT-TC001 through DT-TC006 |
| BR-02: Product must exist before it can be added to cart | DT-TC006 through DT-TC014, DT-TC027, DT-TC029, DT-TC030, DT-TC037 |
| BR-03: Product-list add uses default quantity `1` | DT-TC027 |
| BR-04: Product-detail add uses entered quantity | DT-TC006, DT-TC030 through DT-TC036 |
| BR-05: Quantities represent positive item counts | DT-TC020 through DT-TC025, DT-TC031 through DT-TC045 |
| BR-06: Adding same product again should keep clear consistent cart representation | DT-TC028, DT-TC038 |
| BR-07: Empty cart shows no rows and has continue-shopping action | DT-TC026, DT-TC047, DT-TC051 |
| BR-08: Populated cart displays rows, controls, and subtotal | DT-TC027 through DT-TC030, DT-TC039, DT-TC050, DT-TC056 |
| BR-09: Removing a selected item updates cart state | DT-TC046 through DT-TC049, DT-TC056 |
| BR-10: Subtotal equals sum of price times quantity | DT-TC006, DT-TC015 through DT-TC019, DT-TC030, DT-TC039, DT-TC046 |
| BR-11: Proceeding to checkout requires populated cart and authenticated user | DT-TC052 through DT-TC055 |
| OQ-04: API error model for invalid cart input is unspecified | DT-TC010 through DT-TC025 |

---

## Execution Notes for EXEC-01

- API tests can be automated with Node.js `fetch` or cURL.
- Manual UI tests must be executed by the human tester on the Expo emulator.
- For UI tests, capture screenshots after the action or failed validation state.
- For state-changing tests, start with a clean cart or reset app/backend state between cases where needed.
- If a wrong-screen or stale-row action is impossible through normal UI, record it as "control unavailable" rather than forcing an unsupported event.
- API and mobile UI cart state may diverge; record API and UI results separately during execution.

---

## Human Review Checklist

- [x] Representative values selected from every DT-03 partition.
- [x] API-level and manual mobile UI cases are separated.
- [x] Every listed business rule is exercised.
- [x] No Playwright/browser UI automation is proposed.
- [x] Redundant full Cartesian combinations are avoided.
- [x] Unexecutable UI contexts are handled as control-availability checks.

Next skill: `EXEC-01`.
