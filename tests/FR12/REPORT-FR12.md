# FR-12 Test Report - Access Control

**Feature:** FR-12 - Access Control  
**Date:** 2026-07-07  
**Technique:** Domain Testing and Boundary Value Analysis  
**Target Users:** Admin, Normal User, Unauthenticated User

---

## 1. Scope

FR-12 verifies that the Web Admin area and protected backend APIs require:

1. A valid JWT.
2. `role = 'admin'` in the token.

The tested protected surface includes:

- `/api/admin/*`
- Product data-changing APIs: `POST/PUT/DELETE /api/products`
- Category data-changing APIs: `POST/PUT/DELETE /api/categories`
- Coupon Admin APIs, including `GET /api/coupons` and `/api/admin/coupons`
- Admin UI login and stored-token behavior

---

## 2. Artifact Index

| Step | Artifact |
|------|----------|
| Environment | `tests/FR12/ENV-01.md` |
| Feature Understanding | `tests/FR12/DT-01-feature-understanding.md` |
| DT-01 Review | `tests/FR12/REVIEW-01-of-DT-01.md` |
| Domain Identification | `tests/FR12/DT-02-domain-identification.md` |
| DT-02 Review | `tests/FR12/REVIEW-01-of-DT-02.md` |
| Domain Partitioning | `tests/FR12/DT-03-domain-partitioning.md` |
| DT-03 Review | `tests/FR12/REVIEW-01-of-DT-03.md` |
| Domain Test Cases | `tests/FR12/DT-04-test-cases.md` |
| Domain Execution | `tests/FR12/execution.md` |
| Domain Execution Raw Results | `tests/FR12/execution-results.json` |
| Domain Bug Summary | `tests/FR12/BUG-01.md` |
| BVA Analysis | `tests/FR12/BVA-01-boundary-analysis.md` |
| BVA Execution | `tests/FR12/execution-bva.md` |
| BVA Raw Results | `tests/FR12/bva-execution-results.json` |
| BVA Bug Summary | `tests/FR12/BUG-01-bva.md` |
| Gap Analysis | `tests/FR12/GAP-01-gap-analysis.md` |

---

## 3. Domain Testing Summary

### 3.1 Input Domains

The following FR-12 domains were identified:

- `email`
- `password`
- `loginSubmit`
- `actorRole`
- `authenticationState`
- `authorizationHeader`
- `adminToken`
- `protectedOperation`
- `httpMethod`
- `targetResourceId`
- `requestPayloadPresence`
- `accessSurface`

The core behavior-driving domains were access-control categories: role, token validity, header format, stored session token, protected endpoint group, and access surface.

### 3.2 Partitions

Representative partition groups included:

- Admin, Normal User, Unauthenticated, and unknown/non-admin roles.
- Valid Admin JWT, valid non-admin JWT, no JWT, malformed token, invalid/tampered token.
- Valid Bearer header, Normal User Bearer header, missing header, empty header, wrong scheme, malformed Bearer, invalid Bearer.
- Admin UI login gate and stored-token gate.
- Admin user/order/import endpoints, product writes, category writes, coupon operations, and public read contrast.

### 3.3 Test Cases

DT-04 generated 42 representative Domain Testing cases. The suite avoided a full Cartesian product while covering every major business rule and partition group.

---

## 4. Domain Execution Summary

| Total | Passed | Failed | Not Executed |
|-------|--------|--------|--------------|
| 42 | 27 | 15 | 0 |

Failed test cases:

| Failed TC | Summary |
|-----------|---------|
| DT-TC006 | Stored Normal User token opens Admin shell. |
| DT-TC009 | Normal User token reads admin user list. |
| DT-TC012 | `Basic <admin-token>` is accepted on admin endpoint. |
| DT-TC016 | Normal User token deletes a user through admin endpoint. |
| DT-TC020 | Normal User token updates order status through admin endpoint. |
| DT-TC022 | Normal User token imports products through admin endpoint. |
| DT-TC024 | Normal User token creates product. |
| DT-TC026 | No-token request deletes product. |
| DT-TC028 | Normal User token creates category. |
| DT-TC031 | Normal User token reads coupon list. |
| DT-TC034 | Normal User token creates coupon through admin endpoint. |
| DT-TC036 | Malformed JSON on admin coupon endpoint returns parser HTML before access denial. |
| DT-TC037 | Product update succeeds with non-numeric ID. |
| DT-TC038 | Product update succeeds with nonexistent ID. |
| DT-TC039 | Product creation succeeds with missing required body. |

Execution evidence:

- `tests/FR12/execution.md`
- `tests/FR12/execution-results.json`
- `playwright/exec_fr12_dt.js`
- UI screenshots under `tests/FR12/screenshots/`

---

## 5. Bugs Found

| Bug ID | Title | Severity | Source Failed Cases | Report |
|--------|-------|----------|---------------------|--------|
| BUG-001 | Normal User token can access multiple Admin-only APIs | Critical | DT-TC006, DT-TC009, DT-TC016, DT-TC020, DT-TC022, DT-TC031, DT-TC034 | `bugs/FR12/BUG-001.md` |
| BUG-002 | Admin endpoint accepts non-Bearer Authorization scheme | Medium | DT-TC012 | `bugs/FR12/BUG-002.md` |
| BUG-003 | Product and category write APIs allow non-admin or unauthenticated mutation | High | DT-TC024, DT-TC026, DT-TC028 | `bugs/FR12/BUG-003.md` |
| BUG-004 | Malformed JSON reaches parser before authorization on admin coupon endpoint | Medium | DT-TC036 | `bugs/FR12/BUG-004.md` |
| BUG-005 | Product API accepts invalid IDs and missing required body | Medium | DT-TC037, DT-TC038, DT-TC039 | `bugs/FR12/BUG-005.md` |

No GitHub issues were created automatically. The files under `bugs/FR12/` are manual GitHub issue drafts.

Focused reproducibility evidence:

- `playwright/repro_fr12_bugs.js`
- `tests/FR12/BUG-01-repro.json`

---

## 6. BVA Summary

BVA-01 found no formal boundary variables for FR-12.

Reason:

- FR-12 inputs are categorical access-control domains.
- No explicit numeric, string-length, date/time, or ordered boundaries are specified for FR-12.
- The BVA skill requires variables without explicit boundaries to be skipped.

| Total BVA Cases | Passed | Failed | Not Executed |
|-----------------|--------|--------|--------------|
| 0 | 0 | 0 | 0 |

No BVA-specific bugs were created.

---

## 7. AI Gap Analysis Summary

Main reviewed gaps:

- UI-only testing would have missed the critical backend role-check failures.
- Product validation findings were discovered during FR-12, but are mainly FR-15/product-management defects.
- BVA does not naturally apply to FR-12 because the feature is categorical.
- Exact denial status was not specified, so tests accepted either 401 or 403.
- Stored-token behavior needed explicit attention because it can bypass the visible login form.

Full gap analysis: `tests/FR12/GAP-01-gap-analysis.md`

---

## 8. Final Assessment

FR-12 does not satisfy the documented access-control requirements.

The Admin UI blocks a Normal User during the normal login flow, but server-side protection is incomplete. Multiple Admin-only or data-changing APIs accept a Normal User token, and some product/category write operations allow unauthorized or invalid mutations.

The most serious defect is BUG-001 because it allows privilege escalation from Normal User to Admin-only operations.

---

## 9. Reviewed Evidence Checklist

- [x] Environment evidence captured.
- [x] Domain Testing inputs, domains, partitions, and test cases documented.
- [x] Domain Testing executed.
- [x] Failed Domain Testing cases converted into bug reports.
- [x] BVA applicability reviewed.
- [x] BVA execution result documented.
- [x] BVA bug report step completed.
- [x] AI gap analysis completed.
- [x] Evidence paths linked.

Next skill: `AUDIT-01`.
