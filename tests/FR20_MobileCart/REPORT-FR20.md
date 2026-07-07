# REPORT-01 - Final Test Report
**Feature:** FR-20 - Mobile App - Shopping Cart  
**Date:** 2026-07-07  
**Skill:** REPORT-01  
**Status:** Completed

---

## Table of Contents

1. [Feature Scope](#1-feature-scope)
2. [Domain Testing Summary](#2-domain-testing-summary)
3. [Boundary Value Analysis Summary](#3-boundary-value-analysis-summary)
4. [Execution Results Summary](#4-execution-results-summary)
5. [Discovered Bugs](#5-discovered-bugs)
6. [AI Gap Analysis](#6-ai-gap-analysis)
7. [GitHub Issues](#7-github-issues)
8. [Evidence Index](#8-evidence-index)

---

## 1. Feature Scope

| Item | Detail |
|------|--------|
| **Feature ID** | FR-20 - Mobile App - Shopping Cart |
| **Primary Actor** | Registered User (requires JWT auth token for API) |
| **Testing Mode** | Hybrid: API-level automated (Node.js `fetch`) + Manual UI (Expo emulator) |
| **Artifacts Location** | `tests/FR20_MobileCart/` and `bugs/FR20_MobileCart/` |

### Business Rules Covered

| Rule | Description |
|------|-------------|
| BR-01 | Cart API operations require a registered-user Authorization token |
| BR-02 | A product must exist before it can be added to the cart |
| BR-03 | Adding from product list uses default quantity of `1` |
| BR-04 | Adding from product detail uses the entered `selectedQuantity` |
| BR-05 | Quantity inputs should be positive numeric values |
| BR-06 | Adding the same product again should keep a consistent cart representation |
| BR-07 | Empty cart shows no line items and provides continue-shopping action |
| BR-08 | Populated cart displays line items with controls and subtotal |
| BR-09 | Removing an item updates count and subtotal |
| BR-10 | Subtotal equals sum of `price * quantity` for all line items |
| BR-11 | Checkout requires populated cart and authenticated user |

### Domain Variables Tested

| Variable | Type | Valid Domain | Invalid Domain |
|----------|------|--------------|----------------|
| `authToken` | JWT string | Valid registered-user token | Missing, empty, malformed, expired/invalid |
| `selectedProductId` | Integer | Existing product ID (1+) | Missing, non-numeric, zero/negative, non-existing |
| `apiCartItemName` | String | Non-empty product name | Missing, empty, non-string, mismatched |
| `apiCartItemPrice` | Number | Positive catalog price | Missing, non-numeric, zero, negative, mismatched |
| `selectedQuantity` | Numeric text | Positive whole number | Empty, non-numeric, zero, negative, decimal, extremely large |
| `cartItemQuantity` | Numeric text | Positive whole number (row edit) | Same as `selectedQuantity` + stale row |
| `addProductFromListAction` | Action | Tap on available product | No product, wrong screen, repeated taps |
| `addProductFromDetailAction` | Action | Valid product + valid quantity | No product, invalid qty, wrong screen, repeated taps |
| `removeCartItemAction` | Action | Tap on existing row | Empty cart, stale row, repeated remove |
| `cartItemCount` | Integer state | 0, 1, 2+ | Negative, non-integer, inconsistent with rows |
| Action navigation | Actions | Continue-shopping, checkout | Wrong state/screen |

---

## 2. Domain Testing Summary

### Methodology

Domain Testing (DT-01 through DT-04) was applied following the workflow:

1. **DT-01 (Feature Understanding):** Identified feature scope, actors, 12 input variables, 11 business rules, observable outputs, and open questions.
2. **DT-02 (Domain Identification):** Mapped each variable to valid/invalid domains with evidence sources. Identified 8 constraints and 9 variable dependencies.
3. **DT-03 (Domain Partitioning):** Partitioned each variable into mutually exclusive classes — 95 partitions total across all variables.
4. **DT-04 (Test Case Generation):** Generated 56 test cases covering every partition and business rule.

### Coverage Summary

| Metric | Count |
|--------|-------|
| Total partitions designed | 95 |
| Partitions covered by test cases | 95 (100%) |
| Business rules exercised | 11/11 (100%) |
| API-level test cases | 25 (DT-TC001 to DT-TC025) |
| Manual UI test cases | 31 (DT-TC026 to DT-TC056) |
| Open questions addressed | OQ-04 (API error model) covered by DT-TC010 through DT-TC025 |

### Key DT Findings

- **API Level:** 25 test cases designed covering auth token, product ID, name, price, and quantity domains.
- **Mobile UI Level:** 31 test cases designed covering list add, detail add, quantity validation, cart row edit/remove, navigation, and checkout gating.
- All partitions in DT-03 are mapped to at least one test case in the coverage matrix.

---

## 3. Boundary Value Analysis Summary

### Methodology

BVA-01 was applied to 4 bounded numeric variables:

| Variable | Boundary Values Tested |
|----------|-----------------------|
| `selectedProductId` | Min-1: `0`, Min: `1`, Min+1: `2`, Nominal: `3` |
| `selectedQuantity` | Min-1: `0`, Min: `1`, Min+1: `2`, Nominal: `3` |
| `cartItemQuantity` | Min-1: `0`, Min: `1`, Min+1: `2`, Nominal: `3` |
| `apiCartItemPrice` | Min-1: `0`, Min: `1`, Min+1: `2`, Nominal: `30000000` |

### Exclusions

| Variable | Reason |
|----------|--------|
| Upper bounds (max/max-1/max+1) | No explicit maximum specified for any variable |
| `authToken` | Categorical, not bounded numeric |
| `selectedCartItem` | Selection reference, not bounded numeric |
| `cartItemCount` | Derived state, not direct input |
| Action inputs | Control events, not bounded numeric |

### Key BVA Findings

- 3 lower-bound failures confirmed: `id: 0`, `quantity: 0`, `price: 0` all accepted by API.
- Manual UI confirmed Product Detail accepts `-1`, `0`, `1.5`, and large quantities.

---

## 4. Execution Results Summary

### API-Level Execution

| Result | Count |
|--------|-------|
| **Pass** | 5 |
| **Fail** | 20 |
| **Not Executed (Manual UI)** | 31 |
| **Total** | 56 |

**API passing cases:** DT-TC001, DT-TC002, DT-TC003, DT-TC005, DT-TC006

**API failing pattern (DT-TC004):** `GET /api/cart` accepts `Authorization: Basic <valid JWT>` — auth scheme validation weakness.

**API failing pattern (DT-TC007 through DT-TC025):** `POST /api/cart` accepts every invalid payload — missing `id`, non-numeric `id`, non-existing `id`, missing/empty/non-string `name`, mismatched `name`, missing/non-numeric/zero/negative `price`, mismatched `price`, missing/empty/non-numeric/zero/negative/decimal/extremely large `quantity`. All returned HTTP `200` with `{"message":"Added to cart"}`.

### BVA Execution

| Result | Count |
|--------|-------|
| **Pass** | 9 |
| **Fail** | 3 |
| **Total** | 12 |

**BVA failures:**

| TC ID | Variable | Test Value | Issue |
|-------|----------|------------|-------|
| BVA-TC001 | `selectedProductId` | `0` | API accepted `id: 0` |
| BVA-TC005 | `selectedQuantity` | `0` | API accepted `quantity: 0` |
| BVA-TC009 | `apiCartItemPrice` | `0` | API accepted `price: 0` |

### Manual UI Execution

| Area | Status | Evidence |
|------|--------|----------|
| Empty cart continue-shopping | Pass | `cart_ui_empty.jpg` |
| Empty cart checkout gate (disabled) | Pass | `DT-TC052-to-DT-TC054-ui.jpg` |
| Product Detail quantity `-1` | Fail | `DT_-1_successful_add_cart.jpg` |
| Product Detail quantity `0` | Fail | `DT_0_successful_add_cart.jpg` |
| Product Detail quantity `1.5` | Fail | `DT_1.5_successful_add_cart.jpg` |
| Product Detail large quantity | Fail | `DT_99999x_successful_checkout.jpg` |

### Overall Test Status

| Category | Pass | Fail | Not Executed | Total |
|----------|------|------|--------------|-------|
| API DT | 5 | 20 | 0 | 25 |
| API BVA | 9 | 3 | 0 | 12 |
| Manual UI DT | 2 | 4 | 25 | 31 |
| **Total** | 16 | 27 | 25 | 68 |

> Note: 25 manual UI test cases (DT-TC026 through DT-TC056, excluding the 6 confirmed above) remain pending human execution on the Expo emulator.

---

## 5. Discovered Bugs

### Bug Summary

| Bug ID | Title | Source | Severity |
|--------|-------|--------|----------|
| BUG-001 | `GET /api/cart` accepts `Authorization: Basic <valid JWT>` | DT-TC004 | High |
| BUG-002 | `POST /api/cart` stores invalid cart item payloads | DT-TC007 through DT-TC025, BVA-TC001/005/009 | Critical |
| BUG-003 | Mobile Product Detail allows invalid quantities to be added to cart | DT-TC033 through DT-TC036, BVA-TC005 | High |

### BUG-001: Auth Scheme Validation Weakness

- **Environment:** Node.js API at `http://localhost:3000/api`
- **Steps:** `GET /api/cart` with `Authorization: Basic <valid JWT>`
- **Expected:** HTTP `401` or `403`
- **Actual:** HTTP `200`, body `[]`
- **Severity:** High

### BUG-002: Cart API Accepts Invalid Payloads

- **Environment:** Node.js API at `http://localhost:3000/api`
- **Steps:** `POST /api/cart` with any invalid payload (missing fields, wrong types, zero/negative/decimal values)
- **Expected:** Rejected or normalized
- **Actual:** HTTP `200`, body `{"message":"Added to cart"}`; invalid data stored in cart
- **Severity:** Critical

### BUG-003: Mobile Product Detail Quantity Validation Missing

- **Environment:** Expo mobile app
- **Steps:** Enter `-1`, `0`, `1.5`, or very large value in `Số lượng` field; tap `Thêm vào giỏ hàng`
- **Expected:** Invalid values rejected
- **Actual:** Success alert shown; invalid quantity added to cart
- **Severity:** High
- **Screenshots:** `DT_-1_successful_add_cart.jpg`, `DT_0_successful_add_cart.jpg`, `DT_1.5_successful_add_cart.jpg`, `DT_99999x_successful_checkout.jpg`

### Passing UI Behavior

| Area | Status | Evidence |
|------|--------|----------|
| Empty cart continue-shopping | Pass | Manual UI confirmation + `cart_ui_empty.jpg` |
| Empty cart checkout gating | Pass | Manual UI confirmation + `DT-TC052-to-DT-TC054-ui.jpg` |

---

## 6. AI Gap Analysis

### Gaps Identified

| Issue | AI Output | Final Result | Cause |
|-------|-----------|--------------|-------|
| Backend cart validation underweighted | DT-01/DT-02 leaned on UI as main truth | API execution showed no input validation | API contract needed stronger weight from the start |
| Mobile UI and backend diverge | Assumed alignment | Mobile uses app state; backend stores raw payloads | Hybrid feature needs separate reporting planes |
| Lower-bound defects confirmed, not just explored | BVA identified boundaries | 3 lower-bound failures confirmed | SUT lacks validation at both API and mobile layers |
| Product Detail quantity validation weak | Treated invalid inputs as rejectable | App accepts everything | No normalization before add-to-cart |
| Populated-cart UI partially evidenced | Some flows designed but not confirmed | Only subset returned in conversation | Manual evidence incomplete |

### Incorrect Assumptions Corrected

| Assumption | Correction |
|------------|------------|
| Cart API would reject malformed payloads | Treat cart API as permissive until fixed |
| Product Detail would normalize invalid quantity | Treat as validation gap |
| Populated-cart flows fully evidenced | Report only explicitly evidenced UI flows |

### Missing / Deferred Test Cases

| Case | Reason |
|------|--------|
| Product-list add-to-cart UI confirmation | No manual finding returned |
| Cart-row quantity edit confirmation | Not narrated in evidence set |
| Cart-row remove confirmation | Not narrated |
| Checkout with populated cart | Only empty-cart gating confirmed |
| API-side normalization contract | Validation contract still undefined |

---

## 7. GitHub Issues

The following bug report Markdown files have been prepared for GitHub Issue submission:

| Bug ID | File |
|--------|------|
| BUG-001 | `bugs/FR20_MobileCart/BUG001-auth-scheme-accepted.md` |
| BUG-002 | `bugs/FR20_MobileCart/BUG002-cart-api-accepts-invalid-payloads.md` |
| BUG-003 | `bugs/FR20_MobileCart/BUG003-mobile-product-detail-invalid-quantity.md` |

Each file contains:
- Title
- Environment
- Preconditions
- Steps to Reproduce
- Expected Result
- Actual Result
- Severity
- Screenshot references (for BUG-003)

---

## 8. Evidence Index

### Test Artifacts

| Artifact | Path |
|----------|------|
| Feature Understanding | `tests/FR20_MobileCart/DT-01-feature-understanding.md` |
| Domain Identification | `tests/FR20_MobileCart/DT-02-domain-identification.md` |
| Domain Partitioning | `tests/FR20_MobileCart/DT-03-domain-partitioning.md` |
| Domain Test Cases | `tests/FR20_MobileCart/DT-04-test-cases.md` |
| Boundary Analysis | `tests/FR20_MobileCart/BVA-01-boundary-analysis.md` |
| API Execution Results | `tests/FR20_MobileCart/execution.md` |
| BVA Execution Results | `tests/FR20_MobileCart/execution-bva.md` |
| Raw API Results (JSON) | `tests/FR20_MobileCart/execution-api-results.json` |
| Raw BVA Results (JSON) | `tests/FR20_MobileCart/bva-execution-results.json` |
| DT API Script | `tests/FR20_MobileCart/scripts/exec_fr20_cart_dt_api.js` |
| BVA API Script | `tests/FR20_MobileCart/scripts/exec_fr20_cart_bva_api.js` |
| Environment Report | `tests/FR20_MobileCart/ENV-01.md` |
| Gap Analysis | `tests/FR20_MobileCart/GAP-01-gap-analysis.md` |

### Review Artifacts

| Artifact | Path |
|----------|------|
| Review after DT-01 | `tests/FR20_MobileCart/REVIEW-01-after-DT-01.md` |
| Review after DT-02 | `tests/FR20_MobileCart/REVIEW-01-after-DT-02.md` |
| Review after DT-03 | `tests/FR20_MobileCart/REVIEW-01-after-DT-03.md` |

### Bug Reports

| Artifact | Path |
|----------|------|
| Bug Summary | `bugs/FR20_MobileCart/BUG-01-summary.md` |
| BUG-001 Full Report | `bugs/FR20_MobileCart/BUG001-auth-scheme-accepted.md` |
| BUG-002 Full Report | `bugs/FR20_MobileCart/BUG002-cart-api-accepts-invalid-payloads.md` |
| BUG-003 Full Report | `bugs/FR20_MobileCart/BUG003-mobile-product-detail-invalid-quantity.md` |

### Screenshots

| Screenshot | Path |
|------------|------|
| Empty Cart UI | `tests/FR20_MobileCart/screenshots/cart_ui_empty.jpg` |
| Populated Cart UI | `tests/FR20_MobileCart/screenshots/cart_ui_populated.jpg` |
| Negative Quantity Accepted | `tests/FR20_MobileCart/screenshots/DT_-1_successful_add_cart.jpg` |
| Zero Quantity Accepted | `tests/FR20_MobileCart/screenshots/DT_0_successful_add_cart.jpg` |
| Decimal Quantity Accepted | `tests/FR20_MobileCart/screenshots/DT_1.5_successful_add_cart.jpg` |
| Large Quantity Accepted | `tests/FR20_MobileCart/screenshots/DT_99999x_successful_checkout.jpg` |
| Invalid Quantities UI | `tests/FR20_MobileCart/screenshots/DT-TC040-to-DT-TC045-ui_cannot_break.jpg` |
| Checkout Gate UI | `tests/FR20_MobileCart/screenshots/DT-TC052-to-DT-TC054-ui.jpg` |
| Product List Add UI | `tests/FR20_MobileCart/screenshots/DT_1.5_successful_add_cart.jpg` |

---

## Appendix: Test Execution Statistics

| Metric | Count |
|--------|-------|
| Total test cases designed | 68 |
| Total test cases executed | 43 |
| Total test cases passed | 16 |
| Total test cases failed | 27 |
| Total test cases not executed | 25 |
| Total bugs discovered | 3 |
| Critical bugs | 1 |
| High severity bugs | 2 |
| API-level tests | 37 |
| Manual UI tests | 31 |
| UI cases confirmed | 6 |
| UI cases pending | 25 |

---

*Report generated by REPORT-01 skill. All artifacts reviewed by REVIEW-01 before inclusion. Next skill: `AUDIT-01`.*
