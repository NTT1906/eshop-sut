# EXEC-01 - BVA Test Execution
**Feature:** FR-20 - Mobile App - Shopping Cart  
**Date:** 2026-07-07  
**Skill:** EXEC-01  
**Input:** `BVA-01-boundary-analysis.md`  
**API Script:** `tests/FR20_MobileCart/scripts/exec_fr20_cart_bva_api.js`  
**Raw Results:** `tests/FR20_MobileCart/bva-execution-results.json`

---

## Execution Environment

| Component | Value |
|-----------|-------|
| API | `http://localhost:3000/api` |
| Mobile UI | Expo emulator |
| Test mode | Hybrid API + manual UI |
| API run time | `2026-07-07T15:40:08.172Z` |

---

## Summary

| Total | Passed | Failed | Not Executed |
|-------|--------|--------|--------------|
| 12 | 9 | 3 | 0 |

API boundary coverage:

- `selectedProductId` minimum - 1 failed because the backend accepted `id: 0`.
- `selectedProductId` minimum, minimum + 1, and nominal values passed.
- `selectedQuantity` minimum - 1 failed because the backend accepted `quantity: 0`.
- `selectedQuantity` minimum, minimum + 1, and nominal values passed.
- `apiCartItemPrice` minimum - 1 failed because the backend accepted `price: 0`.
- `apiCartItemPrice` minimum, minimum + 1, and nominal values passed.

Manual UI evidence:

- Product Detail accepted `-1`, `0`, `1.5`, and a very large quantity.
- Empty Cart showed `Tiếp tục mua sắm` and navigation back to the home screen worked.
- Checkout was disabled when the cart was empty.

---

## API Boundary Results

| TC ID | Expected | Actual API | Actual UI | Status | Evidence |
|-------|----------|------------|-----------|--------|----------|
| BVA-TC001 | `selectedProductId` minimum - 1 is rejected. | `POST /api/cart` accepted `id: 0`; cart stored `{"id":0,"name":"iPhone 15 Pro Max","price":30000000,"quantity":1}`. | Not applicable. | Fail | `tests/FR20_MobileCart/bva-execution-results.json` |
| BVA-TC002 | `selectedProductId` minimum is accepted. | `POST /api/cart` accepted `id: 1`. | Not applicable. | Pass | `tests/FR20_MobileCart/bva-execution-results.json` |
| BVA-TC003 | `selectedProductId` minimum + 1 is accepted. | `POST /api/cart` accepted `id: 2`. | Not applicable. | Pass | `tests/FR20_MobileCart/bva-execution-results.json` |
| BVA-TC004 | `selectedProductId` nominal value is accepted. | `POST /api/cart` accepted `id: 3`. | Not applicable. | Pass | `tests/FR20_MobileCart/bva-execution-results.json` |
| BVA-TC005 | `selectedQuantity` minimum - 1 is rejected. | `POST /api/cart` accepted `quantity: 0`. | Product Detail screenshots show quantity `0` was accepted and a success alert appeared. | Fail | `tests/FR20_MobileCart/bva-execution-results.json`, `tests/FR20_MobileCart/screenshots/DT_0_successful_add_cart.jpg` |
| BVA-TC006 | `selectedQuantity` minimum is accepted. | `POST /api/cart` accepted `quantity: 1`. | Manual evidence is consistent with valid quantity behavior. | Pass | `tests/FR20_MobileCart/bva-execution-results.json` |
| BVA-TC007 | `selectedQuantity` minimum + 1 is accepted. | `POST /api/cart` accepted `quantity: 2`. | Cart UI screenshot shows a populated cart row with quantity `2`. | Pass | `tests/FR20_MobileCart/bva-execution-results.json`, `tests/FR20_MobileCart/screenshots/DT-TC040-to-DT-TC045-ui_cannot_break.jpg` |
| BVA-TC008 | `selectedQuantity` nominal value is accepted. | `POST /api/cart` accepted `quantity: 3`. | Manual UI evidence was not needed to confirm the API result. | Pass | `tests/FR20_MobileCart/bva-execution-results.json` |
| BVA-TC009 | `apiCartItemPrice` minimum - 1 is rejected. | `POST /api/cart` accepted `price: 0`. | Not applicable. | Fail | `tests/FR20_MobileCart/bva-execution-results.json` |
| BVA-TC010 | `apiCartItemPrice` minimum is accepted. | `POST /api/cart` accepted `price: 1`. | Not applicable. | Pass | `tests/FR20_MobileCart/bva-execution-results.json` |
| BVA-TC011 | `apiCartItemPrice` minimum + 1 is accepted. | `POST /api/cart` accepted `price: 2`. | Not applicable. | Pass | `tests/FR20_MobileCart/bva-execution-results.json` |
| BVA-TC012 | `apiCartItemPrice` nominal value is accepted. | `POST /api/cart` accepted `price: 30000000`. | Not applicable. | Pass | `tests/FR20_MobileCart/bva-execution-results.json` |

---

## Manual UI Findings

| Area | Finding | Status | Screenshot |
|------|---------|--------|------------|
| Product Detail quantity | `-1` was accepted and triggered the success alert. | Fail | `tests/FR20_MobileCart/screenshots/DT_-1_successful_add_cart.jpg` |
| Product Detail quantity | `0` was accepted and triggered the success alert. | Fail | `tests/FR20_MobileCart/screenshots/DT_0_successful_add_cart.jpg` |
| Product Detail quantity | `1.5` was accepted and triggered the success alert. | Fail | `tests/FR20_MobileCart/screenshots/DT_1.5_successful_add_cart.jpg` |
| Product Detail quantity | Very large quantity input was accepted. | Fail | `tests/FR20_MobileCart/screenshots/DT_99999x_successful_checkout.jpg` |
| Empty Cart continue shopping | `Tiếp tục mua sắm` was visible and returned to the home screen. | Pass | `tests/FR20_MobileCart/screenshots/cart_ui_empty.jpg` |
| Empty Cart checkout gate | Checkout was disabled when the cart was empty. | Pass | `tests/FR20_MobileCart/screenshots/DT-TC052-to-DT-TC054-ui.jpg` |

---

## Observations

- The backend accepts boundary-violating numeric values for cart payloads instead of rejecting them.
- The mobile Product Detail quantity field also accepts invalid numeric boundary values.
- Passing empty-cart navigation and checkout gating are consistent with the feature specification.
- The API and mobile UI behaviors are not equivalent: the API stores invalid payloads, while the UI at least shows the expected empty-cart and checkout-gate behavior.

---

## Evidence Files

| Artifact | Path |
|----------|------|
| BVA API results | `tests/FR20_MobileCart/bva-execution-results.json` |
| BVA API script | `tests/FR20_MobileCart/scripts/exec_fr20_cart_bva_api.js` |
| Product Detail negative quantity screenshot | `tests/FR20_MobileCart/screenshots/DT_-1_successful_add_cart.jpg` |
| Product Detail zero quantity screenshot | `tests/FR20_MobileCart/screenshots/DT_0_successful_add_cart.jpg` |
| Product Detail decimal quantity screenshot | `tests/FR20_MobileCart/screenshots/DT_1.5_successful_add_cart.jpg` |
| Product Detail large quantity screenshot | `tests/FR20_MobileCart/screenshots/DT_99999x_successful_checkout.jpg` |
| Empty cart screenshot | `tests/FR20_MobileCart/screenshots/cart_ui_empty.jpg` |
| Populated cart screenshot | `tests/FR20_MobileCart/screenshots/cart_ui_populated.jpg` |

---

## Human Review Checklist

- [x] Boundary API cases executed.
- [x] Manual Expo UI evidence incorporated.
- [x] Pass/fail status recorded for every boundary case.
- [x] Screenshots referenced for UI evidence.
- [x] Failed boundary cases preserved for bug reporting and gap analysis.

Next skill: `BUG-01`.
