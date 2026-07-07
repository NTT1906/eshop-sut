# BUG-01 - BVA Bug Reporting Summary
**Feature:** FR-20 - Mobile App - Shopping Cart  
**Date:** 2026-07-07  
**Skill:** BUG-01  
**Input:** `tests/FR20_MobileCart/execution-bva.md`, `tests/FR20_MobileCart/bva-execution-results.json`

---

## Failed Boundary Cases

| Failed TC | Failure Summary | Bug Decision |
|-----------|-----------------|--------------|
| BVA-TC001 | `selectedProductId = 0` was accepted by `POST /api/cart`. | Covered as BUG-002 evidence |
| BVA-TC005 | `selectedQuantity = 0` was accepted by `POST /api/cart`. | Covered as BUG-002 evidence and BUG-003 boundary family |
| BVA-TC009 | `apiCartItemPrice = 0` was accepted by `POST /api/cart`. | Covered as BUG-002 evidence |
| Manual UI follow-up | Product Detail accepted `-1`, `0`, `1.5`, and very large quantity values. | Covered as BUG-003 evidence |

---

## Bug Reports Updated

| Bug ID | Title | Severity | Added Evidence |
|--------|-------|----------|----------------|
| BUG-002 | `POST /api/cart` accepts missing, malformed, inconsistent, and invalid cart item fields | Critical | `BVA-TC001`, `BVA-TC005`, `BVA-TC009` |
| BUG-003 | Product Detail page accepts invalid quantities such as `-1`, `0`, `1.5`, and very large values | High | `BVA-TC005` and the boundary follow-up screenshots |

---

## Reproducibility Check

The BVA run confirms the same underlying defects already reported:

- The cart API does not reject lower-bound invalid values.
- The mobile Product Detail quantity input does not block invalid quantity classes.

No new bug IDs were necessary because the boundary failures are the same defects already documented, now with tighter boundary evidence.

---

## Evidence Collected

| Evidence | Path |
|----------|------|
| Boundary execution report | `tests/FR20_MobileCart/execution-bva.md` |
| Raw boundary execution results | `tests/FR20_MobileCart/bva-execution-results.json` |
| BVA API script | `tests/FR20_MobileCart/scripts/exec_fr20_cart_bva_api.js` |
| Product Detail negative quantity screenshot | `tests/FR20_MobileCart/screenshots/DT_-1_successful_add_cart.jpg` |
| Product Detail zero quantity screenshot | `tests/FR20_MobileCart/screenshots/DT_0_successful_add_cart.jpg` |
| Product Detail decimal quantity screenshot | `tests/FR20_MobileCart/screenshots/DT_1.5_successful_add_cart.jpg` |
| Product Detail large quantity screenshot | `tests/FR20_MobileCart/screenshots/DT_99999x_successful_checkout.jpg` |

---

## Notes

- The BVA round is additive evidence, not a distinct defect class.
- The existing bug drafts remain the issue records to carry forward.

Next skill: `GAP-01`.
