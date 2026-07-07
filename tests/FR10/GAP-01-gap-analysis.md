# GAP-01 - AI Gap Analysis
**Feature:** FR-10 - Order State Machine  
**Date:** 2026-07-07  
**Skill:** GAP-01  
**Input:** Reviewed DT/BVA artifacts, execution results, and bug reports

---

## Gap Analysis Table

| Issue | AI Output | Final Result | Cause |
|-------|-----------|--------------|-------|
| SRS final-state rules were underweighted during early DT modeling | DT-01 through DT-03 treated user cancel in `shipping` and admin `canceled` -> `delivered` as confirmation-needed because the API specification and observed UI allowed or exposed them. | Execution showed both behaviors succeed: user can cancel `shipping`, and admin can move `canceled` to `delivered`. The SRS says `shipping` cannot be user-canceled and `canceled` is a final state. These should be treated as requirement violations, not merely open questions. | The workflow prompt emphasized `api_specification.md`; the SRS in `README.md` was not incorporated into the FR-10 feature input and early DT artifacts. |
| Domain execution expected safe behavior for two SRS-invalid transitions | DT-TC003 and DT-TC019 were marked as pass if the SUT either accepted or rejected the transition without inconsistency. | Both passed under the chosen oracle, but against the SRS they reveal likely defects: `shipping` -> `canceled` by user and `canceled` -> `delivered` by admin. | Incorrect or incomplete test oracle caused by conflicting artifacts and insufficient authority ranking between API spec, UI behavior, and SRS. |
| BVA repeated the same permissive oracle | BVA-TC008 and BVA-TC019 used the same confirmation-needed expectations as DT execution. | Both passed, but the SRS would classify the observed successful transitions as failures. | The BVA artifact inherited DT-03's confirmation-needed classification instead of revisiting the SRS final-state rules. |
| Admin authorization bug was correctly found but not covered by BVA | DT-TC029 found that a registered user can update order status through the admin endpoint. | BUG-001 was reported and reproduced. BVA did not retest this because role authorization is categorical, not a boundary variable. | This is not a BVA miss; it is a normal limitation of BVA scope. |
| Missing direct SRS oracle tests for final states | DT/BVA tested final-state behavior but did not explicitly assert the SRS rule: `delivered` and `canceled` are terminal states and must not transition anywhere. | `delivered` behaved as terminal; `canceled` did not. The `canceled` terminal-state violation should be highlighted in the report as a gap or potential additional bug candidate. | Early artifacts treated UI-visible `Đánh dấu Đã giao` as a candidate valid transition because the implementation exposed it. |
| Missing admin-role checks across all admin endpoints | DT-TC029 covered admin order-status update with a registered-user token. | That endpoint failed authorization. Other admin endpoints, such as admin order list, users, coupons, and import products, were outside FR-10 or not tested in this feature. | Scope was limited to FR-10 state-machine endpoint. The discovered defect suggests a broader authorization review is warranted. |

---

## Incorrect Assumptions

| Assumption | Why It Was Incorrect or Incomplete | Corrected Understanding |
|------------|------------------------------------|-------------------------|
| If the UI exposes `Đánh dấu Đã giao` for `canceled`, then `canceled` -> `delivered` can be treated as an acceptable candidate. | The SRS states `canceled` is a final state and must not transition to any other state. | UI exposure is implementation evidence, not requirement authority. Treat the successful transition as a requirement violation candidate. |
| If API wording says cancellation is allowed when not delivered, then user cancellation of `shipping` is an unresolved candidate. | The SRS specifically says users cannot self-cancel once an order is `shipping`. | For FR-10, the stricter SRS state-machine rule should override ambiguous API wording. |
| No BVA failures means no boundary-related concerns remain. | BVA passed under the chosen expected results, but two expected results were permissive confirmation-needed oracles. | BVA execution is technically complete, but final reporting should distinguish pass-under-artifact from pass-against-SRS. |

---

## Missing or Deferred Test Cases

| Missing / Deferred Case | Reason Deferred | Suggested Follow-up |
|-------------------------|-----------------|---------------------|
| Requirement-oracle test: user cancel `shipping` should fail | Existing DT/BVA cases allowed either accept or reject as confirmation-needed. | Add or reclassify a test where successful `shipping` cancellation is a failure against the SRS. |
| Requirement-oracle test: admin `canceled` -> `delivered` should fail | Existing DT/BVA cases allowed either accept or reject as confirmation-needed. | Add or reclassify a test where successful transition out of `canceled` is a failure against the SRS. |
| Full final-state matrix for `canceled` | DT/BVA tested `canceled` -> `delivered`, but not every possible target from `canceled`. | Test `canceled` -> `pending`, `confirmed`, `shipping`, `delivered`, and same-current `canceled`. |
| Admin role authorization for related FR-10 read endpoint | DT-TC029 tested status update only. | Test registered-user token on `GET /api/admin/orders` to see whether order data exposure also bypasses admin authorization. |
| Broader `/api/admin/*` authorization sweep | Outside strict FR-10 state-machine scope. | Add a security-focused follow-up for all admin endpoints because BUG-001 suggests shared middleware may authenticate without authorizing role. |

---

## Hallucinated or Unsupported Requirements

| Candidate | Assessment | Resolution |
|-----------|------------|------------|
| "Direct invalid admin transitions should be rejected with HTTP 400." | Supported by execution for tested transitions. | Keep. |
| "Registered-user cancel of `shipping` is acceptable if the API accepts it." | Not supported by SRS. | Reclassify as likely defect/spec mismatch in final report. |
| "`canceled` -> `delivered` is acceptable because admin UI exposes it." | Not supported by SRS. | Reclassify as likely defect/spec mismatch in final report. |

---

## Lessons for AI-Assisted Testing

- When multiple artifacts conflict, the test oracle must identify which artifact is authoritative before execution.
- UI behavior is implementation evidence, not necessarily the intended requirement.
- Confirmation-needed partitions are useful during DT, but after execution they must be reconciled against the SRS, not only against "safe state" criteria.
- BVA can pass while still inheriting an incomplete oracle from earlier domain analysis.
- A discovered admin authorization failure should trigger a scoped follow-up for related admin endpoints even if the current feature only tests one endpoint.

---

## Human Review Checklist

- [x] Missing and deferred test cases identified.
- [x] Incorrect assumptions documented.
- [x] Hallucinated or unsupported certainty corrected.
- [x] Causes explained.
- [x] Follow-up testing needs recorded.
