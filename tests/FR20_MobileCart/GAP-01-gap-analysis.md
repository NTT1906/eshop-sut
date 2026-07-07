# GAP-01 - AI Gap Analysis
**Feature:** FR-20 - Mobile App - Shopping Cart  
**Date:** 2026-07-07  
**Skill:** GAP-01  
**Input:** Reviewed DT/BVA artifacts, execution results, bug reports, and manual Expo findings

---

## Evidence Sources

| Source | Use |
|--------|-----|
| `tests/FR20_MobileCart/DT-01-feature-understanding.md` | Feature scope, actors, and unresolved questions. |
| `tests/FR20_MobileCart/DT-02-domain-identification.md` | Input domains and explicit exclusions. |
| `tests/FR20_MobileCart/DT-03-domain-partitioning.md` | Domain classes and action partitions. |
| `tests/FR20_MobileCart/DT-04-test-cases.md` | Planned coverage and coverage matrix. |
| `tests/FR20_MobileCart/execution.md` | API execution results for DT cases. |
| `tests/FR20_MobileCart/execution-bva.md` | Boundary execution results and manual UI findings. |
| `tests/FR20_MobileCart/BUG-01-summary.md` | Consolidated bug decisions. |
| `tests/FR20_MobileCart/bugs/BUG001-auth-scheme-accepted.md` | Auth-scheme defect. |
| `tests/FR20_MobileCart/bugs/BUG002-cart-api-accepts-invalid-payloads.md` | Cart payload validation defect. |
| `tests/FR20_MobileCart/bugs/BUG003-mobile-product-detail-invalid-quantity.md` | Mobile quantity validation defect. |

---

## Gap Analysis Table

| Issue | AI Output | Final Result | Cause |
|-------|-----------|--------------|-------|
| Backend cart validation was underweighted relative to the feature scope | DT-01 and DT-02 treated the mobile cart as a hybrid feature with authenticated API cart endpoints, but the early model still leaned on the visible UI states as the main source of truth. | API execution showed that `GET /api/cart` and especially `POST /api/cart` do not enforce the documented input contract. Invalid product IDs, names, prices, and quantities were accepted and stored. | The feature input combined UI observations with API specification, but the API contract needed stronger weight in the oracle from the start. |
| Mobile UI and backend cart behavior diverge | The workflow assumed the mobile app and backend cart would be aligned enough to test together. | The mobile app shows local cart behavior and success alerts, while the backend cart endpoint stores raw request bodies. This means API results and mobile UI results must be reported separately. | The mobile implementation uses app state for cart behavior, while the backend exposes a separate cart API surface. |
| Lower-bound numeric defects were confirmed, not just explored | BVA-01 defined minimum-1, minimum, minimum+1, and nominal values for `selectedProductId`, `selectedQuantity`, `cartItemQuantity`, and `apiCartItemPrice`. | Boundary execution confirmed three lower-bound failures: `selectedProductId = 0`, `selectedQuantity = 0`, and `apiCartItemPrice = 0` were all accepted. | The SUT lacks input validation at both the API and mobile UI layers for the lower numeric boundary family. |
| Product Detail quantity validation was weaker than the AI oracle expected | DT-04 and BVA-01 treated negative, zero, decimal, and large quantities as invalid inputs that should be rejected or normalized. | Manual Expo execution showed the Product Detail page accepted `-1`, `0`, `1.5`, and very large quantities and still showed success. | The implementation does not normalize or reject invalid quantity text before adding to cart. |
| The AI did not fully close the populated-cart UI workflow in the final evidence set | DT-04 included product-list add, cart-row edit/remove, continue-shopping-from-cart, and populated-cart checkout cases. | The conversation only supplied manual confirmation for empty-cart continue-shopping and empty-cart checkout gating, plus the Product Detail quantity defects. Several populated-cart UI flows remain unconfirmed in the supplied evidence trail. | The execution step depended on manual Expo screenshots, but only a subset of the pending UI outcomes was returned in the conversation. |
| Upper-bound BVA was intentionally not generated | BVA-01 excluded max-side rows because no explicit maximum quantity, product ID, or price boundary exists in the feature input or API specification. | This is a valid omission, but it leaves very large values as exploratory cases rather than formal boundary coverage. The manual UI large-quantity finding confirms the risk area without giving a spec-based upper limit. | The specification does not define a maximum bound, so inventing one would have been unsupported. |
| The AI correctly avoided creating duplicate bugs for the same defect family | BUG-01 filed distinct issue drafts for auth-scheme acceptance, invalid cart payload acceptance, and invalid Product Detail quantity acceptance. | The BVA failures are the same root causes already captured by those bug drafts, so no new bug IDs were necessary. | BVA provided stronger boundary evidence, not a new defect class. |

---

## Incorrect Assumptions

| Assumption | Why It Was Incorrect or Incomplete | Corrected Understanding |
|------------|------------------------------------|-------------------------|
| The cart API would reject malformed or semantically invalid payload fields. | Execution showed it accepts and stores them. | Treat the cart API as permissive until validation is fixed. |
| The Product Detail quantity field would at least normalize invalid numeric text before add-to-cart. | Manual Expo findings showed it accepts invalid values and still reports success. | Treat the Product Detail quantity control as a validation gap, not a formatting-only issue. |
| A populated-cart UI flow can be considered closed without explicit evidence for list-add, row-edit, row-remove, and checkout-in-populated-state. | Those paths were designed and scripted, but not all were explicitly confirmed in the returned UI findings. | Final reporting should distinguish executed API proof from partially supplied UI proof. |

---

## Missing or Deferred Test Cases

| Missing / Deferred Case | Reason Deferred | Suggested Follow-up |
|-------------------------|-----------------|---------------------|
| Product-list add-to-cart UI confirmation | No explicit manual finding was returned in the conversation for the `Thêm vào giỏ` path. | Capture a screenshot for product-list add and verify cart count and row contents. |
| Cart-row quantity edit confirmation | The evidence set does not include a narrated result for row editing, even though the tests were designed. | Manually confirm row editing on the populated cart screen and verify subtotal/count updates. |
| Cart-row remove confirmation | The evidence set does not include a narrated remove-result beyond the existing populated-cart screenshot. | Capture a removal screenshot and compare cart count/subtotal before and after. |
| Checkout with populated cart | Only empty-cart checkout gating was confirmed in the conversation. | Manually confirm the populated-cart checkout path and login gate behavior. |
| API-side normalization contract | The backend accepted invalid payloads, but the desired normalization/validation contract is still undefined. | Decide whether the API should reject, sanitize, or derive cart payload fields from catalog data. |

---

## Hallucinated or Unsupported Requirements

| Candidate | Assessment | Resolution |
|-----------|------------|------------|
| "Boundary failures are a new defect family separate from the API cart validation bugs." | Unsupported. | Treat BVA failures as boundary evidence for BUG-002 and BUG-003. |
| "Upper-bound numeric behavior must be tested even though no maximum is specified." | Unsupported. | Keep upper-side values exploratory only. |
| "Manual UI evidence proves every planned populated-cart flow." | Unsupported by the conversation record. | Final report should only assert the UI flows explicitly evidenced. |

---

## Lessons for AI-Assisted Testing

- For hybrid mobile features, API and UI are separate observability planes and should be reported separately when they diverge.
- A feature input that mixes UI state, hidden auth, and direct API payloads needs a stronger authority order from the beginning.
- Boundary analysis is most useful when the SUT actually has lower or upper limits; otherwise, documenting the absence of a bound is better than inventing one.
- Manual evidence needs to be complete enough to close the execution matrix, otherwise the final report should call out the missing UI closures explicitly.

---

## Human Review Checklist

- [x] Missing and deferred test cases identified.
- [x] Incorrect assumptions documented.
- [x] Hallucinated or unsupported certainty corrected.
- [x] Causes explained.
- [x] Follow-up testing needs recorded.

Next skill: `REPORT-01`.
