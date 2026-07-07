# BUG-01 - Bug Reporting Summary
**Feature:** FR-20 - Mobile App - Shopping Cart  
**Date:** 2026-07-07  
**Skill:** BUG-01  
**Status:** Completed

---

## Manual UI Results Acknowledged

The tester manually executed the pending Expo emulator UI cases and reported:

| Finding | Result | Bug Filed |
|---------|--------|-----------|
| Product Detail accepted `-1`, `0`, `1.5`, and very large quantity values. | Fail | `BUG-003` |
| Empty Cart showed `Tiếp tục mua sắm` and navigated back to home. | Pass | No |
| Checkout button was disabled when cart was empty. | Pass | No |

---

## Bug Reports Created

| Bug ID | Title | Source | Severity |
|--------|-------|--------|----------|
| BUG-001 | `GET /api/cart` accepts `Authorization: Basic <valid JWT>` | API execution `DT-TC004` | High |
| BUG-002 | `POST /api/cart` stores invalid cart item payloads | API execution `DT-TC007` through `DT-TC025` | Critical |
| BUG-003 | Mobile Product Detail allows invalid quantities to be added to cart | Manual Expo UI execution `DT-TC033` through `DT-TC036` | High |

---

## Non-Bug Passing Findings

| Area | Evidence |
|------|----------|
| Empty cart continue-shopping behavior | Tester reported `Tiếp tục mua sắm` navigated back to home successfully. |
| Empty cart checkout gating | Tester reported checkout button was disabled when cart was empty. |

---

## Evidence Artifacts

| Evidence | Path |
|----------|------|
| API execution report | `tests/FR20_MobileCart/execution.md` |
| Raw API execution JSON | `tests/FR20_MobileCart/execution-api-results.json` |
| Negative quantity screenshot | `tests/FR20_MobileCart/screenshots/DT_-1_successful_add_cart.jpg` |
| Zero quantity screenshot | `tests/FR20_MobileCart/screenshots/DT_0_successful_add_cart.jpg` |
| Decimal quantity screenshot | `tests/FR20_MobileCart/screenshots/DT_1.5_successful_add_cart.jpg` |
| Large quantity screenshot | `tests/FR20_MobileCart/screenshots/DT_99999x_successful_checkout.jpg` |
| Empty cart screenshot | `tests/FR20_MobileCart/screenshots/cart_ui_empty.jpg` |

---

## Notes

- API and mobile UI defects are reported separately because the mobile app uses local cart behavior while the backend exposes authenticated cart endpoints.
- No Playwright/browser UI automation was generated.

Next skill: `BVA-01`.
