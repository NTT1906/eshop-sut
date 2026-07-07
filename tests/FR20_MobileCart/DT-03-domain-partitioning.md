# DT-03 - Domain Partitioning
**Feature:** FR-20 - Mobile App - Shopping Cart  
**Date:** 2026-07-07  
**Skill:** DT-03  
**Status:** Completed

---

## Verified Input

This DT-03 artifact uses the approved output from:

- `eshop-sut/tests/FR20_MobileCart/DT-02-domain-identification.md`
- `eshop-sut/tests/FR20_MobileCart/REVIEW-01-after-DT-02.md`

No test execution is performed in this step.

---

## Partition Table

| Variable | Partition | Description |
|----------|-----------|-------------|
| `authToken` | AUTH-P01-VALID | Valid registered-user JWT token sent as `Authorization: Bearer <token>`. |
| `authToken` | AUTH-P02-MISSING | Authorization header is omitted. |
| `authToken` | AUTH-P03-EMPTY | Authorization header exists but token value is empty. |
| `authToken` | AUTH-P04-MALFORMED | Authorization header exists but does not follow usable bearer-token format. |
| `authToken` | AUTH-P05-INVALID | Token has bearer format but is expired, forged, or not accepted by the backend. |
| `selectedProductId` | PRODID-P01-EXISTING | Product ID exists in the product catalog and can be selected. |
| `selectedProductId` | PRODID-P02-MISSING | Product ID is not supplied in an API cart request or no product is selected in UI. |
| `selectedProductId` | PRODID-P03-NON_NUMERIC | Product ID is a non-numeric value. |
| `selectedProductId` | PRODID-P04-ZERO_OR_NEGATIVE | Product ID is `0` or negative, outside normal positive catalog identifiers. |
| `selectedProductId` | PRODID-P05-NON_EXISTING_POSITIVE | Product ID is a positive integer but does not exist in the catalog. |
| `apiCartItemName` | NAME-P01-VALID | Non-empty string matching or representing the selected product name. |
| `apiCartItemName` | NAME-P02-MISSING | Name field is absent from direct `POST /api/cart` payload. |
| `apiCartItemName` | NAME-P03-EMPTY | Name field is present but empty or whitespace only. |
| `apiCartItemName` | NAME-P04-NON_STRING | Name field is present with a non-string value. |
| `apiCartItemName` | NAME-P05-MISMATCHED | Name is non-empty but inconsistent with the selected product ID when catalog consistency is checked. |
| `apiCartItemPrice` | PRICE-P01-VALID | Positive numeric price associated with the selected product. |
| `apiCartItemPrice` | PRICE-P02-MISSING | Price field is absent from direct `POST /api/cart` payload. |
| `apiCartItemPrice` | PRICE-P03-NON_NUMERIC | Price field is present but not numeric. |
| `apiCartItemPrice` | PRICE-P04-ZERO | Price is numeric `0`; invalid unless free products are explicitly supported. |
| `apiCartItemPrice` | PRICE-P05-NEGATIVE | Price is less than `0`. |
| `apiCartItemPrice` | PRICE-P06-MISMATCHED | Price is positive numeric but inconsistent with the selected product ID when catalog consistency is checked. |
| `addProductFromListAction` | ADDLIST-P01-TAP_AVAILABLE_PRODUCT | User taps `Thêm vào giỏ` on an available product card. |
| `addProductFromListAction` | ADDLIST-P02-NO_PRODUCT_AVAILABLE | User cannot validly add because no product card is available. |
| `addProductFromListAction` | ADDLIST-P03-WRONG_SCREEN | Add-from-list action is attempted while not on the product list. |
| `addProductFromListAction` | ADDLIST-P04-REPEATED_TAPS | User rapidly taps add-from-list for the same product multiple times. |
| `selectedQuantity` | SELQTY-P01-VALID_POSITIVE_INTEGER | Product-detail quantity is a positive whole-number string. |
| `selectedQuantity` | SELQTY-P02-EMPTY | Product-detail quantity is empty or whitespace only. |
| `selectedQuantity` | SELQTY-P03-NON_NUMERIC | Product-detail quantity contains non-numeric text. |
| `selectedQuantity` | SELQTY-P04-ZERO | Product-detail quantity is `0`. |
| `selectedQuantity` | SELQTY-P05-NEGATIVE | Product-detail quantity is less than `0`. |
| `selectedQuantity` | SELQTY-P06_DECIMAL | Product-detail quantity is decimal/fractional text. |
| `selectedQuantity` | SELQTY-P07-EXTREMELY_LARGE | Product-detail quantity is a very large whole number beyond practical cart handling. |
| `addProductFromDetailAction` | ADDDETAIL-P01-VALID_PRODUCT_VALID_QTY | User taps `Thêm vào giỏ hàng` with selected product and valid quantity. |
| `addProductFromDetailAction` | ADDDETAIL-P02-NO_SELECTED_PRODUCT | Add-from-detail action is attempted without a selected product. |
| `addProductFromDetailAction` | ADDDETAIL-P03-INVALID_QTY | Add-from-detail action is attempted with an invalid `selectedQuantity` partition. |
| `addProductFromDetailAction` | ADDDETAIL-P04-WRONG_SCREEN | Add-from-detail action is attempted while not on product detail. |
| `addProductFromDetailAction` | ADDDETAIL-P05-REPEATED_TAPS | User rapidly taps add-from-detail for the same product/quantity multiple times. |
| `cartItemQuantity` | CARTQTY-P01-VALID_POSITIVE_INTEGER | Cart-row quantity is a positive whole-number string for an existing row. |
| `cartItemQuantity` | CARTQTY-P02-EMPTY | Cart-row quantity is empty or whitespace only. |
| `cartItemQuantity` | CARTQTY-P03-NON_NUMERIC | Cart-row quantity contains non-numeric text. |
| `cartItemQuantity` | CARTQTY-P04-ZERO | Cart-row quantity is `0`. |
| `cartItemQuantity` | CARTQTY-P05-NEGATIVE | Cart-row quantity is less than `0`. |
| `cartItemQuantity` | CARTQTY-P06_DECIMAL | Cart-row quantity is decimal/fractional text. |
| `cartItemQuantity` | CARTQTY-P07-EXTREMELY_LARGE | Cart-row quantity is a very large whole number beyond practical cart handling. |
| `cartItemQuantity` | CARTQTY-P08-NON_EXISTING_ROW | Quantity edit is attempted for a removed or non-existing row. |
| `selectedCartItem` | SELITEM-P01-EXISTING_ROW | Selected cart item is an existing visible row. |
| `selectedCartItem` | SELITEM-P02-NONE_SELECTED | No cart row is selected for a row-specific operation. |
| `selectedCartItem` | SELITEM-P03-STALE_REMOVED_ROW | Selected cart item refers to a row already removed. |
| `selectedCartItem` | SELITEM-P04-OUT_OF_RANGE_ROW | Selected cart row reference is outside the current cart row set. |
| `selectedCartItem` | SELITEM-P05-EMPTY_CART | Row-specific selection is attempted while cart has no rows. |
| `removeCartItemAction` | REMOVE-P01-EXISTING_ROW | User taps `Xóa` on an existing visible cart row. |
| `removeCartItemAction` | REMOVE-P02-EMPTY_CART | Remove action is attempted while cart is empty. |
| `removeCartItemAction` | REMOVE-P03-STALE_ROW | Remove action is attempted on a row that was already removed. |
| `removeCartItemAction` | REMOVE-P04-REPEATED_REMOVE | User repeatedly triggers remove for the same item. |
| `continueShoppingFromEmptyCartAction` | CONTEMPTY-P01-EMPTY_CART | User taps `Tiếp tục mua sắm` while empty cart state is displayed. |
| `continueShoppingFromEmptyCartAction` | CONTEMPTY-P02-POPULATED_CART | Empty-cart continue-shopping action is not available because cart is populated. |
| `continueShoppingFromEmptyCartAction` | CONTEMPTY-P03-WRONG_SCREEN | Action is attempted while not on the empty cart screen. |
| `continueShoppingFromCartAction` | CONTCART-P01-POPULATED_CART | User taps `← Mua tiếp` while populated cart state is displayed. |
| `continueShoppingFromCartAction` | CONTCART-P02-EMPTY_CART | Populated-cart continue-shopping action is not available because cart is empty. |
| `continueShoppingFromCartAction` | CONTCART-P03-WRONG_SCREEN | Action is attempted while not on the populated cart screen. |
| `proceedToCheckoutAction` | CHECKOUT-P01-AUTH_POPULATED_CART | User is authenticated and taps `Tiến hành thanh toán` with at least one cart item. |
| `proceedToCheckoutAction` | CHECKOUT-P02-EMPTY_CART | Checkout action is attempted with no cart items. |
| `proceedToCheckoutAction` | CHECKOUT-P03-UNAUTH_POPULATED_CART | Checkout action is attempted with populated cart but no authenticated session. |
| `proceedToCheckoutAction` | CHECKOUT-P04-WRONG_SCREEN | Checkout action is attempted while not on populated cart screen. |
| `cartItemCount` | COUNT-P01-ZERO | Cart contains `0` items and should show empty-cart state. |
| `cartItemCount` | COUNT-P02-ONE | Cart contains exactly `1` item and should show one cart row. |
| `cartItemCount` | COUNT-P03-MULTIPLE | Cart contains `2` or more items and should show multiple rows and subtotal. |
| `cartItemCount` | COUNT-P04-NEGATIVE | Cart count is less than `0`, an invalid state. |
| `cartItemCount` | COUNT-P05-NON_INTEGER | Cart count is fractional or non-numeric, an invalid state. |
| `cartItemCount` | COUNT-P06-INCONSISTENT_WITH_ROWS | Header count does not match visible row/cart state. |

---

## Partition Rationale

| Partition Group | Why These Partitions Exist |
|-----------------|----------------------------|
| `authToken` | Cart APIs require Authorization; missing, empty, malformed, and invalid bearer tokens can fail for different reasons and should be observed separately. |
| `selectedProductId` | Product identity determines whether an item can be added. Missing, malformed, invalid-range, and non-existing IDs are distinct input failures. |
| `apiCartItemName` | Name is not editable on the mobile cart UI, but it is required by direct `POST /api/cart`; absence, empty value, wrong type, and catalog mismatch are separate backend payload risks. |
| `apiCartItemPrice` | Price affects line totals and subtotal. Missing, non-numeric, zero, negative, and mismatched positive prices can lead to different backend or calculation behavior. |
| Add actions | Action partitions separate valid screen/state, wrong screen/state, missing prerequisite, and repeated taps because each can produce different UI or state transitions. |
| Quantity inputs | Quantity is central to cart behavior. Empty, text, zero, negative, decimal, and large integer inputs are split because validation/normalization may differ. |
| `selectedCartItem` | Row-specific actions depend on a valid current row. No row, stale row, out-of-range row, and empty cart are different invalid contexts. |
| Remove action | Removal behavior differs between existing item, empty cart, stale row, and repeated remove. |
| Continue-shopping actions | Empty-cart and populated-cart continue actions are separate controls visible in different cart states. |
| Checkout action | Checkout is a cart-triggered downstream action and depends on both cart population and authentication state. |
| `cartItemCount` | Empty, single-item, and multi-item states drive visibly different cart screens. Negative, non-integer, and row-count mismatch are invalid state partitions. |

---

## Coverage Matrix

| DT-02 Domain Class | DT-03 Partition(s) |
|--------------------|--------------------|
| AUTH-V1 | AUTH-P01-VALID |
| AUTH-I1 | AUTH-P02-MISSING |
| AUTH-I2 | AUTH-P03-EMPTY, AUTH-P04-MALFORMED |
| AUTH-I3 | AUTH-P05-INVALID |
| PROD-V1 | PRODID-P01-EXISTING, NAME-P01-VALID, PRICE-P01-VALID |
| PROD-I1 | PRODID-P02-MISSING |
| PROD-I2 | PRODID-P03-NON_NUMERIC, PRODID-P04-ZERO_OR_NEGATIVE |
| PROD-I3 | PRODID-P05-NON_EXISTING_POSITIVE |
| PROD-I4 | NAME-P02-MISSING, NAME-P03-EMPTY, NAME-P04-NON_STRING, PRICE-P02-MISSING, PRICE-P03-NON_NUMERIC, PRICE-P04-ZERO, PRICE-P05-NEGATIVE |
| PROD-I5 | NAME-P05-MISMATCHED, PRICE-P06-MISMATCHED |
| QTY-V1 | SELQTY-P01-VALID_POSITIVE_INTEGER, CARTQTY-P01-VALID_POSITIVE_INTEGER |
| QTY-I1 | SELQTY-P02-EMPTY, CARTQTY-P02-EMPTY |
| QTY-I2 | SELQTY-P03-NON_NUMERIC, CARTQTY-P03-NON_NUMERIC |
| QTY-I3 | SELQTY-P04-ZERO, CARTQTY-P04-ZERO |
| QTY-I4 | SELQTY-P05-NEGATIVE, CARTQTY-P05-NEGATIVE |
| QTY-I5 | SELQTY-P06_DECIMAL, CARTQTY-P06_DECIMAL |
| QTY-I6 | SELQTY-P07-EXTREMELY_LARGE, CARTQTY-P07-EXTREMELY_LARGE |
| CART-V1 | COUNT-P01-ZERO |
| CART-V2 | COUNT-P02-ONE |
| CART-V3 | COUNT-P03-MULTIPLE |
| CART-I1 | COUNT-P06-INCONSISTENT_WITH_ROWS |
| CART-I2 | COUNT-P04-NEGATIVE, COUNT-P05-NON_INTEGER |
| ACT-V1 | ADDLIST-P01-TAP_AVAILABLE_PRODUCT, ADDDETAIL-P01-VALID_PRODUCT_VALID_QTY, REMOVE-P01-EXISTING_ROW, CONTEMPTY-P01-EMPTY_CART, CONTCART-P01-POPULATED_CART, CHECKOUT-P01-AUTH_POPULATED_CART |
| ACT-I1 | ADDLIST-P02-NO_PRODUCT_AVAILABLE, ADDLIST-P03-WRONG_SCREEN, ADDDETAIL-P02-NO_SELECTED_PRODUCT, ADDDETAIL-P03-INVALID_QTY, ADDDETAIL-P04-WRONG_SCREEN, REMOVE-P02-EMPTY_CART, REMOVE-P03-STALE_ROW, CONTEMPTY-P02-POPULATED_CART, CONTEMPTY-P03-WRONG_SCREEN, CONTCART-P02-EMPTY_CART, CONTCART-P03-WRONG_SCREEN, CHECKOUT-P02-EMPTY_CART, CHECKOUT-P03-UNAUTH_POPULATED_CART, CHECKOUT-P04-WRONG_SCREEN |
| ACT-I2 | ADDLIST-P04-REPEATED_TAPS, ADDDETAIL-P05-REPEATED_TAPS, REMOVE-P04-REPEATED_REMOVE |

---

## Notes for DT-04

- Use one representative value per partition unless a boundary-focused step later requires more.
- Keep API-only partitions separate from manual UI-only partitions.
- For UI partitions that cannot be directly forced through the emulator, document them as unavailable or API/model-level during DT-04 rather than fabricating evidence.
- Preserve the mobile testing rule: no Playwright/browser UI scripts.

---

## Human Review Checklist

- [x] Partitions are uniquely labeled.
- [x] Valid and invalid partitions are separated by label and description.
- [x] Partitions are intended to be mutually exclusive within each variable.
- [x] DT-02 domain classes are covered by DT-03 partitions.
- [x] API-only payload partitions are identified without treating them as editable mobile UI fields.
- [x] No test execution was performed.

Next skill: `REVIEW-01`.
