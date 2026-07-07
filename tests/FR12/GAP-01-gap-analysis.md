# GAP-01 - AI Gap Analysis
**Feature:** FR-12 - Access Control  
**Date:** 2026-07-07  
**Skill:** GAP-01  
**Status:** Completed

---

## Evidence Sources

| Source | Use |
|--------|-----|
| `tests/FR12/DT-01-feature-understanding.md` | Initial AI feature understanding. |
| `tests/FR12/DT-02-domain-identification.md` | Initial AI domain identification. |
| `tests/FR12/DT-03-domain-partitioning.md` | Initial AI partitions. |
| `tests/FR12/DT-04-test-cases.md` | Generated Domain Testing test cases. |
| `tests/FR12/execution.md` | Executed Domain Testing results. |
| `tests/FR12/BUG-01.md` | Final bug grouping after review. |
| `tests/FR12/BVA-01-boundary-analysis.md` | BVA applicability decision. |
| `tests/FR12/execution-bva.md` | BVA execution result. |

---

## Gap Analysis Table

| Issue | AI Output | Final Result | Cause |
|-------|-----------|--------------|-------|
| API access-control risk would have been missed by UI-only testing | ENV/DT initially observed that Admin UI blocks Normal User login, which could imply the feature works from UI perspective. | Direct API tests revealed critical backend role-check failures. Normal User tokens could access or mutate several Admin-only resources. | UI and API behavior diverged. Access control must be tested server-side, not only through the frontend. |
| Product validation cases were included in FR-12 test execution | DT-04 included product invalid ID and missing body cases (`DT-TC037` to `DT-TC039`) because product writes are part of the FR-12 protected surface. | These produced BUG-005, but the bug is mainly product-management/data-integrity, not pure access control. It is documented as discovered during FR-12 rather than core FR-12. | Feature boundaries overlap: product write endpoints are protected by FR-12, but their payload/ID validation belongs to FR-15. |
| BVA initially had no obvious test cases | FR-12 domains are role, token, header, method, and operation categories. | BVA-01 correctly generated no formal BVA test values and EXEC-01 BVA recorded 0 cases. | BVA is not suitable for categorical access-control features unless explicit numeric/string/date boundaries are specified. |
| Exact denial status was unspecified | Test cases expected denial as 401 or 403 rather than one exact code. | Execution accepted either 401 or 403 for denial. Failures were only logged when protected data/action was exposed or a mutation succeeded. | API specification states access must be denied but does not define exact status code for every denial type. |
| Stored-token UI behavior required extra attention | Login UI blocks Normal User credentials, but DT-03 added stored `adminToken` as a hidden/system input. | `DT-TC006` failed: manually stored Normal User token displayed Admin shell. | Hidden client state can bypass visible login controls. AI needed ENV evidence and review guidance to include this input. |
| Malformed JSON was partly outside pure access control | DT-04 included malformed JSON with Normal User token on `POST /api/admin/coupons`. | `DT-TC036` failed with HTML parser error instead of access denial. Reported as BUG-004 because it shows auth-order/error-handling risk. | Middleware ordering and parser errors are cross-cutting; the failure is not purely domain partitioning but still security-relevant. |
| Full Cartesian test generation would have been excessive | DT-03 had many partitions across roles, headers, endpoints, IDs, and payload states. | DT-04 used 42 representative cases rather than multiplying every header class by every endpoint. | Human review constrained AI toward representative coverage to avoid redundant cases while preserving coverage of every rule. |
| `GET /api/coupons` scope was initially uncertain | DT-01 listed `GET /api/coupons` as an open question because it is outside `/api/admin/*`. | REVIEW-01 decided to include it because the API spec labels it Admin and requires Authorization. Execution found Normal User access. | Requirement wording spans both `/api/admin/*` and other Admin-labeled endpoints; careful review was needed. |

---

## Missing Test Cases After Review

No mandatory FR-12 Domain Testing cases remain missing after review. The generated suite covered:

- Admin, Normal User, and Unauthenticated actors.
- UI login gate and stored-token gate.
- Valid Admin token, valid Normal User token, no token, empty header, malformed header, wrong scheme, and invalid token.
- `/api/admin/*` operations.
- Product/category/coupon protected operation groups.
- Public read-only contrast cases.

Optional future cases:

- Expired JWT behavior, if the SUT provides a reproducible way to create expired tokens.
- Additional unknown-role token testing, if a token with a non-`admin`/non-`user` role can be created without white-box manipulation.
- More exhaustive endpoint-by-endpoint replay of every malformed header class, if required for a security-specific assignment.

---

## Incorrect Assumptions Corrected

| Assumption | Correction |
|------------|------------|
| UI login blocking Normal User might be sufficient evidence for access control. | Incorrect. Backend API access must be independently tested. |
| Every numeric-looking ID should receive BVA treatment. | Incorrect for FR-12 because no ID min/max boundary is specified; ID validity was handled as Domain Testing. |
| BVA must always produce test cases. | Incorrect. The BVA rule explicitly says to skip variables without explicit boundaries. |
| Product write tests are entirely FR-12. | Partially incorrect. Authorization for product writes is FR-12; product payload and ID validation belong mainly to FR-15. |

---

## Hallucinated Requirements Check

| Candidate Requirement | Review Result |
|-----------------------|---------------|
| Exact denial status must be 403 for non-admin users. | Not specified. Final tests accepted either 401 or 403. |
| JWT expiration must be tested. | Not specified and no reproducible expired token source was available. Marked optional. |
| Login email/password length boundaries apply to FR-12. | Not specified. Excluded from BVA. |
| Product field validation belongs fully to FR-12. | Not correct. Only product write authorization belongs to FR-12. |

---

## Lessons for AI Collaboration

- Access-control features need both UI and direct API testing because client-side gates can pass while backend enforcement fails.
- Domain Testing is the stronger technique for FR-12 because the main input space is categorical.
- BVA should not be forced onto features without explicit boundaries; documenting non-applicability is better than fabricating boundary values.
- Human review is necessary to keep feature scope clean when endpoints overlap multiple functional requirements.

---

## Human Review Checklist

- [x] Compared AI-generated artifacts with final reviewed results.
- [x] Identified missing or optional cases.
- [x] Identified incorrect assumptions.
- [x] Checked for hallucinated requirements.
- [x] Explained causes of issues.

Next skill: `REPORT-01`.
