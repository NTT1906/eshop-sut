# BUG-01 - Bug Reporting Summary
**Feature:** FR-12 - Access Control  
**Date:** 2026-07-07  
**Skill:** BUG-01  
**Input:** `tests/FR12/execution.md`, `tests/FR12/execution-results.json`

---

## Failed Test Case Review

| Failed TC | Failure Summary | Bug Decision |
|-----------|-----------------|--------------|
| DT-TC006 | Stored Normal User token opens Admin shell. | Reported as BUG-001 |
| DT-TC009 | Normal User token reads admin user list. | Reported as BUG-001 |
| DT-TC012 | `Basic <admin-token>` is accepted on admin endpoint. | Reported as BUG-002 |
| DT-TC016 | Normal User token deletes a user through admin endpoint. | Reported as BUG-001 |
| DT-TC020 | Normal User token updates order status through admin endpoint. | Reported as BUG-001 |
| DT-TC022 | Normal User token imports products through admin endpoint. | Reported as BUG-001 |
| DT-TC024 | Normal User token creates product. | Reported as BUG-003 |
| DT-TC026 | No-token request deletes product. | Reported as BUG-003 |
| DT-TC028 | Normal User token creates category. | Reported as BUG-003 |
| DT-TC031 | Normal User token reads coupon list. | Reported as BUG-001 |
| DT-TC034 | Normal User token creates coupon through admin endpoint. | Reported as BUG-001 |
| DT-TC036 | Malformed JSON on admin coupon endpoint returns parser HTML before access denial. | Reported as BUG-004 |
| DT-TC037 | Product update succeeds with non-numeric ID. | Reported as BUG-005 |
| DT-TC038 | Product update succeeds with nonexistent ID. | Reported as BUG-005 |
| DT-TC039 | Product creation succeeds with missing required body. | Reported as BUG-005 |

---

## Bug Reports Created

| Bug ID | Title | Severity | Source Failed Cases | Report |
|--------|-------|----------|---------------------|--------|
| BUG-001 | Normal User token can access multiple Admin-only APIs | Critical | DT-TC006, DT-TC009, DT-TC016, DT-TC020, DT-TC022, DT-TC031, DT-TC034 | `bugs/FR12/BUG-001.md` |
| BUG-002 | Admin endpoint accepts non-Bearer Authorization scheme | Medium | DT-TC012 | `bugs/FR12/BUG-002.md` |
| BUG-003 | Product and category write APIs allow non-admin or unauthenticated mutation | High | DT-TC024, DT-TC026, DT-TC028 | `bugs/FR12/BUG-003.md` |
| BUG-004 | Malformed JSON reaches parser before authorization on admin coupon endpoint | Medium | DT-TC036 | `bugs/FR12/BUG-004.md` |
| BUG-005 | Product API accepts invalid IDs and missing required body | Medium | DT-TC037, DT-TC038, DT-TC039 | `bugs/FR12/BUG-005.md` |

---

## Reproducibility Check

All bug groups were reproduced with focused script `playwright/repro_fr12_bugs.js`.

Focused API reproduction confirmed:

- Normal User token returned HTTP 200 for multiple Admin-only operations.
- `Authorization: Basic <admin-jwt>` returned HTTP 200 for `GET /api/admin/users`.
- Normal User token and no-token requests could mutate product/category data.
- Malformed JSON on `POST /api/admin/coupons` returned HTML parse error instead of access denial.
- Product update/create accepted invalid IDs and missing body.

---

## Evidence Collected

| Evidence | Path |
|----------|------|
| Domain execution report | `tests/FR12/execution.md` |
| Raw domain execution results | `tests/FR12/execution-results.json` |
| Focused repro script | `playwright/repro_fr12_bugs.js` |
| Focused repro JSON | `tests/FR12/BUG-01-repro.json` |
| UI screenshot for stored Normal User token | `tests/FR12/screenshots/DT-TC006-after.png` |
| Manual issue drafts | `bugs/FR12/BUG-001.md` through `bugs/FR12/BUG-005.md` |

---

## Notes

- No GitHub issues were created automatically. The files under `bugs/FR12/` are manual GitHub issue drafts.
- BUG-005 is primarily a product-management/data-integrity issue, but it was discovered during FR-12 execution because product write APIs are part of the FR-12 protected surface.
- The most severe FR-12 finding is BUG-001 because it enables privilege escalation from Normal User to Admin-only actions.

---

## Human Review Checklist

- [x] Failed test cases reviewed.
- [x] Bug groups selected by likely root cause.
- [x] Reproducibility verified with focused script.
- [x] Severity assigned.
- [x] Evidence linked.
- [x] Manual GitHub issue drafts generated.

Next skill: `BVA-01`.
