# REPORT-01 - FR-10 Domain Testing and BVA Report
**Feature:** FR-10 - Order State Machine  
**Date:** 2026-07-07  
**User Type:** Admin and Registered User  
**SUT:** EShop  
**Skill:** REPORT-01

---

## 1. Feature Summary

FR-10 controls order status transitions for registered users and admins.

Related endpoints:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/orders/my-orders` | Registered user loads own orders |
| PUT | `/api/orders/:id/cancel` | Registered user cancels an eligible own order |
| GET | `/api/admin/orders` | Admin loads system-wide orders |
| PUT | `/api/admin/orders/:id/status` | Admin updates order status |

The SRS defines `pending`, `confirmed`, `shipping`, `delivered`, and `canceled` states. It also states that `delivered` and `canceled` are final states, and users must not self-cancel once an order is `shipping`.

---

## 2. Domain Testing Summary

Domain variables:

- `actorContext`
- `ownershipRelation`
- `orderId`
- `currentStatus`
- `cancelOrderAction`
- `targetStatus`

Domain partitioning produced 47 value partitions:

| Variable | Main Coverage |
|----------|---------------|
| `actorContext` | registered user, admin, no session, invalid session, non-admin on admin flow |
| `ownershipRelation` | own order, admin system-wide order, other user's order, no ownership context |
| `orderId` | existing own/system order, missing, non-integer, UI-formatted, zero/negative, nonexistent |
| `currentStatus` | all five states plus missing/outside/wrong-case state values |
| `cancelOrderAction` | cancel by current status, ownership, existence, and actor context |
| `targetStatus` | valid UI transitions, candidate transitions, malformed targets, invalid enum transitions |

Domain test generation created 33 test cases.

Detailed artifacts:

- `tests/FR10/DT-01-feature-understanding.md`
- `tests/FR10/DT-02-domain-identification.md`
- `tests/FR10/DT-03-domain-partitioning.md`
- `tests/FR10/DT-04-test-cases.md`
- `tests/FR10/REVIEW-01-of-DT-01.md`
- `tests/FR10/REVIEW-01-of-DT-02.md`
- `tests/FR10/REVIEW-01-of-DT-03.md`

---

## 3. BVA Summary

BVA was applied where explicit numeric or ordered boundaries existed.

| Variable / Pair | BVA Decision | Reason |
|-----------------|--------------|--------|
| `orderId` | Included | Integer path parameter with lower positive-ID boundary |
| `currentStatus` + `cancelOrderAction` | Included | Ordered state-machine behavior affects user cancellation |
| `currentStatus` + `targetStatus` | Included | Ordered admin transitions and terminal states define boundaries |
| `actorContext`, `ownershipRelation` | Excluded | Categorical, not boundary-based |

BVA generated 20 test cases covering:

- `orderId` lower boundary: `0`, `1`, `2`, `-1`
- high nonexistent ID: `999999`
- registered-user cancel boundaries across `pending`, `confirmed`, `shipping`, `canceled`, `delivered`
- admin ordered transitions and invalid backward/outside-enum transitions

Detailed artifact:

- `tests/FR10/BVA-01-boundary-analysis.md`

---

## 4. Execution Summary

### Domain Testing Execution

| Total | Passed | Failed | Not Executed |
|-------|--------|--------|--------------|
| 33 | 32 | 1 | 0 |

Detailed artifacts:

- `tests/FR10/execution.md`
- `tests/FR10/execution-results.json`
- `playwright/exec_fr10_dt.js`

### BVA Execution

| Total | Passed | Failed | Not Executed |
|-------|--------|--------|--------------|
| 20 | 20 | 0 | 0 |

Detailed artifacts:

- `tests/FR10/execution-bva.md`
- `tests/FR10/bva-execution-results.json`
- `playwright/exec_fr10_bva.js`

### Combined Execution

| Total | Passed | Failed | Not Executed |
|-------|--------|--------|--------------|
| 53 | 52 | 1 | 0 |

---

## 5. Bug Summary

One reproducible bug was formally reported.

| Bug ID | Title | Severity | Source |
|--------|-------|----------|--------|
| BUG-001 | Registered user can update order status through admin endpoint | High | `DT-TC029` |

Summary:

- A normal registered user called `PUT /api/admin/orders/:id/status`.
- The API returned HTTP 200.
- The order status changed from `pending` to `confirmed`.
- Missing token and invalid token controls were rejected, so the defect is role authorization, not authentication absence.

Evidence:

- `bugs/FR10/BUG-001.md`
- `tests/FR10/BUG-001-repro.json`
- `playwright/repro_fr10_bug001.js`

GitHub issue:

- Not submitted automatically. `bugs/FR10/BUG-001.md` is the manual GitHub issue draft.

---

## 6. Requirement-Conformance Notes

The gap analysis identified two important SRS mismatches that were not filed as separate BUG-01 reports because the DT/BVA oracles had originally marked them as confirmation-needed:

| Behavior | Execution Result | SRS Conflict |
|----------|------------------|--------------|
| Registered user cancels `shipping` order | HTTP 200; final status `canceled` | SRS says user cannot self-cancel once order is `shipping`. |
| Admin changes `canceled` -> `delivered` | HTTP 200; final status `delivered` | SRS says `canceled` is a final state and cannot transition elsewhere. |

These should be reviewed as likely additional defects or specification mismatches before final grading/report submission.

---

## 7. Evidence Links

| Evidence Type | Path |
|---------------|------|
| Environment report | `tests/FR10/ENV-01.md` |
| UI state JSON | `tests/FR10/ENV-01-ui-state.json` |
| Domain execution report | `tests/FR10/execution.md` |
| Domain raw results | `tests/FR10/execution-results.json` |
| BVA execution report | `tests/FR10/execution-bva.md` |
| BVA raw results | `tests/FR10/bva-execution-results.json` |
| Domain bug summary | `tests/FR10/BUG-01.md` |
| BVA bug summary | `tests/FR10/BUG-01-bva.md` |
| Bug report | `bugs/FR10/BUG-001.md` |
| Gap analysis | `tests/FR10/GAP-01-gap-analysis.md` |
| Screenshots | `tests/FR10/screenshots/` |

Primary screenshots:

- `tests/FR10/screenshots/ENV-registered-user-orders.png`
- `tests/FR10/screenshots/ENV-admin-orders.png`
- `tests/FR10/screenshots/DT-TC001-after.png`
- `tests/FR10/screenshots/DT-TC003-after.png`
- `tests/FR10/screenshots/DT-TC014-after.png`
- `tests/FR10/screenshots/DT-TC019-after.png`
- `tests/FR10/screenshots/DT-TC020-after.png`

---

## 8. AI Gap Analysis Summary

Detailed artifact:

- `tests/FR10/GAP-01-gap-analysis.md`

Main gaps:

| Issue | Final Result |
|-------|--------------|
| SRS final-state rules were underweighted during early DT modeling. | `shipping` user cancel and `canceled` -> `delivered` admin transition succeeded, but both conflict with the SRS. |
| Domain and BVA expected results used permissive confirmation-needed oracles. | The tests passed under those oracles, but final reporting must distinguish implementation behavior from SRS conformance. |
| Admin-role checks were tested only for status update. | BUG-001 suggests a broader `/api/admin/*` authorization review is needed. |

Follow-up testing recommended:

- Reclassify or add requirement-oracle tests where user `shipping` cancellation must fail.
- Reclassify or add requirement-oracle tests where `canceled` must be terminal.
- Test `GET /api/admin/orders` and related admin endpoints with a registered-user token.
- Run a broader admin authorization sweep.

---

## 9. Final Status

| Item | Status |
|------|--------|
| Environment prepared | Completed |
| Domain Testing design | Completed |
| Domain Testing reviews | Completed |
| Domain Testing execution | Completed |
| Domain Testing bug reporting | Completed |
| BVA design | Completed |
| BVA execution | Completed |
| BVA bug reporting | Completed |
| Gap analysis | Completed |
| Report generation | Completed |

---

## 10. Report Validation

- [x] Domain Testing summarized.
- [x] Boundary Value Analysis summarized.
- [x] Execution results summarized.
- [x] Discovered bug summarized.
- [x] AI Gap Analysis included.
- [x] GitHub issue status referenced.
- [x] Evidence linked.
- [x] Only reviewed and verified information included.
