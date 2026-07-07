# EXEC-01 - Test Execution
**Feature:** FR-20 - Mobile App - Shopping Cart  
**Date:** 2026-07-07  
**Skill:** EXEC-01  
**Status:** Completed for API cases; manual mobile UI cases pending human execution

---

## Execution Mode

Per `SKILLS_mobile.md`, this feature uses hybrid execution:

- API execution: automated with Node.js `fetch`.
- Mobile UI execution: manual on Expo emulator by the human tester.
- Browser Playwright UI automation: not used.

---

## Execution Artifacts

| Artifact | Path |
|----------|------|
| API execution script | `tests/FR20_MobileCart/scripts/exec_fr20_cart_dt_api.js` |
| Raw API execution results | `tests/FR20_MobileCart/execution-api-results.json` |
| Existing empty-cart screenshot evidence | `tests/FR20_MobileCart/screenshots/cart_ui_empty.jpg` |
| Existing populated-cart screenshot evidence | `tests/FR20_MobileCart/screenshots/cart_ui_populated.jpg` |

---

## API Environment

| Item | Value |
|------|-------|
| API base URL | `http://localhost:3000/api` |
| Test user created | `fr20.exec.1783437435518@example.com` |
| Register result | HTTP `200` |
| Login result | HTTP `200` |
| Selected product | `iPhone 15 Pro Max`, ID `1`, price `30000000` |
| Comparison product | `Samsung Galaxy S24 Ultra`, ID `2`, price `28000000` |

---

## API Execution Summary

| Result | Count |
|--------|-------|
| Pass | 5 |
| Fail | 20 |
| Not Executed - Manual UI Pending | 31 |

API result pattern:

- `GET /api/cart` correctly rejects missing/empty/invalid bearer tokens.
- `GET /api/cart` incorrectly accepts `Authorization: Basic <valid JWT>`.
- `POST /api/cart` accepts invalid payloads and appends them to the cart without validation.

---

## Execution Results

| TC ID | Expected | Actual API | Actual UI | Status |
|-------|----------|------------|-----------|--------|
| DT-TC001 | Authorized `GET /api/cart` returns cart array. | HTTP `200`; body `[]`. | Not applicable. | Pass |
| DT-TC002 | Missing Authorization is rejected. | HTTP `401`; body `{"error":"Unauthorized"}`. | Not applicable. | Pass |
| DT-TC003 | Empty bearer token is rejected. | HTTP `401`; body `{"error":"Unauthorized"}`. | Not applicable. | Pass |
| DT-TC004 | Malformed/wrong auth scheme is rejected. | HTTP `200`; body `[]`; `Basic <valid JWT>` was accepted. | Not applicable. | Fail |
| DT-TC005 | Invalid bearer token is rejected. | HTTP `403`; body `{"error":"Forbidden"}`. | Not applicable. | Pass |
| DT-TC006 | Valid product payload is accepted into cart with quantity `2`. | HTTP `200`; cart contains valid item with quantity `2`. | Not applicable. | Pass |
| DT-TC007 | Missing product ID is rejected or leaves cart unchanged. | HTTP `200`; cart length changed `1 -> 2`; last item missing `id`. | Not applicable. | Fail |
| DT-TC008 | Non-numeric product ID is rejected or leaves cart unchanged. | HTTP `200`; cart length changed `2 -> 3`; last item has `id:"abc"`. | Not applicable. | Fail |
| DT-TC009 | Zero/non-positive product ID is rejected or leaves cart unchanged. | HTTP `200`; cart length changed `3 -> 4`; last item has `id:0`. | Not applicable. | Fail |
| DT-TC010 | Non-existing product ID is rejected, normalized, or leaves cart unchanged. | HTTP `200`; cart length changed `4 -> 5`; last item has `id:999999`. | Not applicable. | Fail |
| DT-TC011 | Missing name is rejected or leaves cart unchanged. | HTTP `200`; cart length changed `5 -> 6`; last item missing `name`. | Not applicable. | Fail |
| DT-TC012 | Empty name is rejected or leaves cart unchanged. | HTTP `200`; cart length changed `6 -> 7`; last item has `name:""`. | Not applicable. | Fail |
| DT-TC013 | Non-string name is rejected or leaves cart unchanged. | HTTP `200`; cart length changed `7 -> 8`; last item has `name:12345`. | Not applicable. | Fail |
| DT-TC014 | Mismatched product name is rejected, normalized, or leaves cart unchanged. | HTTP `200`; cart length changed `8 -> 9`; last item has ID `1` with Samsung name. | Not applicable. | Fail |
| DT-TC015 | Missing price is rejected or leaves cart unchanged. | HTTP `200`; cart length changed `9 -> 10`; last item missing `price`. | Not applicable. | Fail |
| DT-TC016 | Non-numeric price is rejected or leaves cart unchanged. | HTTP `200`; cart length changed `10 -> 11`; last item has `price:"abc"`. | Not applicable. | Fail |
| DT-TC017 | Zero price is rejected unless free products are supported. | HTTP `200`; cart length changed `11 -> 12`; last item has `price:0`. | Not applicable. | Fail |
| DT-TC018 | Negative price is rejected or leaves cart unchanged. | HTTP `200`; cart length changed `12 -> 13`; last item has `price:-100000`. | Not applicable. | Fail |
| DT-TC019 | Mismatched product price is rejected, normalized, or leaves cart unchanged. | HTTP `200`; cart length changed `13 -> 14`; last item has ID `1` with Samsung price. | Not applicable. | Fail |
| DT-TC020 | Missing quantity is rejected, normalized, or leaves cart unchanged. | HTTP `200`; cart length changed `14 -> 15`; last item missing `quantity`. | Not applicable. | Fail |
| DT-TC021 | Non-numeric quantity is rejected, normalized, or leaves cart unchanged. | HTTP `200`; cart length changed `15 -> 16`; last item has `quantity:"abc"`. | Not applicable. | Fail |
| DT-TC022 | Zero quantity does not create a zero-quantity cart line. | HTTP `200`; cart length changed `16 -> 17`; last item has `quantity:0`. | Not applicable. | Fail |
| DT-TC023 | Negative quantity does not create a negative-quantity cart line. | HTTP `200`; cart length changed `17 -> 18`; last item has `quantity:-1`. | Not applicable. | Fail |
| DT-TC024 | Decimal quantity is rejected or consistently normalized. | HTTP `200`; cart length changed `18 -> 19`; last item has `quantity:1.5`. | Not applicable. | Fail |
| DT-TC025 | Extremely large quantity is constrained, rejected, or handled safely. | HTTP `200`; cart length changed `19 -> 20`; last item has `quantity:999999999`. | Not applicable. | Fail |
| DT-TC026 | Empty cart shows message and `Tiếp tục mua sắm` returns to browsing. | Not applicable. | Pending manual Expo execution. Existing baseline screenshot: `cart_ui_empty.jpg`. | Not Executed |
| DT-TC027 | Product-list add creates one item with default quantity `1`. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC028 | Repeated product-list add keeps cart representation consistent. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC029 | Product-list add is unavailable without product/list screen. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC030 | Product-detail add with quantity `2` updates row and subtotal. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC031 | Empty product-detail quantity is rejected or normalized safely. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC032 | Non-numeric product-detail quantity is rejected or normalized safely. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC033 | Product-detail quantity `0` does not create zero-quantity line. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC034 | Product-detail quantity `-1` does not create negative line. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC035 | Product-detail decimal quantity is rejected or normalized. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC036 | Product-detail extremely large quantity is constrained or safe. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC037 | Add-from-detail unavailable without product detail/selection. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC038 | Repeated product-detail add keeps cart representation consistent. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC039 | Editing cart-row quantity to `3` updates totals consistently. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC040 | Empty cart-row quantity is rejected or normalized safely. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC041 | Non-numeric cart-row quantity is rejected or normalized safely. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC042 | Cart-row quantity `0` does not remain as zero-quantity line. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC043 | Cart-row quantity `-1` does not remain as negative line. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC044 | Cart-row decimal quantity is rejected or normalized. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC045 | Cart-row extremely large quantity is constrained or safe. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC046 | `Xóa` removes selected row and updates subtotal/count. | Not applicable. | Pending manual Expo execution. Existing baseline screenshot: `cart_ui_populated.jpg`. | Not Executed |
| DT-TC047 | Empty cart has no row quantity or `Xóa` action. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC048 | Stale/repeated remove does not corrupt cart. | Not applicable. | Pending manual Expo execution if UI permits. | Not Executed |
| DT-TC049 | Row-specific operation without valid row is unavailable or ignored. | Not applicable. | Pending manual Expo execution if UI permits. | Not Executed |
| DT-TC050 | `← Mua tiếp` returns to browsing and preserves cart. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC051 | Continue-shopping controls are state/screen-specific. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC052 | Authenticated populated cart can proceed to checkout. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC053 | Empty cart cannot proceed to checkout. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC054 | Unauthenticated populated cart is blocked from checkout and cart is preserved. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC055 | Checkout action unavailable outside populated cart screen. | Not applicable. | Pending manual Expo execution. | Not Executed |
| DT-TC056 | Header count never becomes negative/fractional and remains consistent with rows. | Not applicable. | Pending manual Expo execution. | Not Executed |

---

## Manual Expo UI Instructions

The human tester should execute DT-TC026 through DT-TC056 on the Expo emulator and provide screenshot filenames for failed or confirmation-needed cases.

Recommended minimum screenshot evidence:

| Area | Suggested Screenshot Name |
|------|---------------------------|
| Empty cart continue-shopping result | `DT-TC026-ui.png` |
| Product-list add result | `DT-TC027-ui.png` |
| Product-detail quantity add result | `DT-TC030-ui.png` |
| Invalid product-detail quantity behavior | `DT-TC031-to-DT-TC036-ui.png` |
| Cart-row quantity edit result | `DT-TC039-ui.png` |
| Invalid cart-row quantity behavior | `DT-TC040-to-DT-TC045-ui.png` |
| Remove item result | `DT-TC046-ui.png` |
| Continue shopping from populated cart | `DT-TC050-ui.png` |
| Checkout gate behavior | `DT-TC052-to-DT-TC054-ui.png` |

---

## Failure Candidates for BUG-01

| Candidate | Evidence |
|-----------|----------|
| Auth scheme validation weakness | DT-TC004 accepted `Authorization: Basic <valid JWT>` with HTTP `200`. |
| Cart API accepts invalid payloads without validation | DT-TC007 through DT-TC025 all returned HTTP `200` and increased cart length with invalid item data. |

---

## Notes

- Raw token and full cart evidence are stored in `execution-api-results.json`.
- API test data used a newly registered user to avoid contaminating existing seeded accounts.
- Manual UI cases remain pending because the AI cannot operate the Expo emulator in this workflow.

Next skill: `BUG-01`.
