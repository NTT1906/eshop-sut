# BUG-01 - Bug Reporting Summary
**Feature:** FR-10 - Order State Machine  
**Date:** 2026-07-07  
**Skill:** BUG-01  
**Input:** `tests/FR10/execution.md`, `tests/FR10/execution-results.json`

---

## Failed Test Case Review

| Failed TC | Failure Summary | Bug Decision |
|-----------|-----------------|--------------|
| DT-TC029 | An authenticated registered user called `PUT /api/admin/orders/:id/status` with `{"status":"confirmed"}` and the order changed from `pending` to `confirmed`. | Reported as BUG-001 |

---

## Bug Reports Created

| Bug ID | Title | Severity | Source Failed Cases | Report |
|--------|-------|----------|---------------------|--------|
| BUG-001 | Registered user can update order status through admin endpoint | High | DT-TC029 | `bugs/FR10/BUG-001.md` |

---

## Reproducibility Check

BUG-001 is reproducible.

Focused API reproduction:

- Created and logged in a normal registered user.
- Created a `pending` order.
- Called `PUT /api/admin/orders/:id/status` using the registered user's token.
- The API returned HTTP 200 with `{"message":"Order status updated"}`.
- The order status changed from `pending` to `confirmed`.
- Control requests confirmed that missing token returns HTTP 401 and invalid token returns HTTP 403.

---

## Evidence Collected

| Evidence | Path |
|----------|------|
| Domain execution report | `tests/FR10/execution.md` |
| Raw domain execution results | `tests/FR10/execution-results.json` |
| Focused repro script | `playwright/repro_fr10_bug001.js` |
| Focused repro JSON | `tests/FR10/BUG-001-repro.json` |
| Screenshot | N/A - API-only authorization defect; JSON/network evidence collected instead |

---

## Notes

- No GitHub issue was created automatically. `bugs/FR10/BUG-001.md` is a manual GitHub issue draft.
- This is an authorization bypass on an admin-only endpoint. It should be fixed before relying on FR-10 state transitions for production-like workflows.

---

## Human Review Checklist

- [x] Failed test case reviewed.
- [x] Bug reproducibility verified.
- [x] Severity assigned.
- [x] Evidence linked.
- [x] Manual GitHub issue draft generated.
