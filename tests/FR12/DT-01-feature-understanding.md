# DT-01 - Feature Understanding
**Feature:** FR-12 - Access Control  
**Date:** 2026-07-07  
**Skill:** DT-01  
**Status:** Completed

---

## Evidence Sources

| Source | Evidence Used |
|--------|---------------|
| `FEATURE_INPUT_FR12.md` | FR-12 actors, preconditions, related endpoints, and initial input list. |
| `eshop-sut/WORKFLOW.md` | Embedded FR-12 feature inputs used by the workflow. |
| `eshop-sut/api_specification.md` | Authentication endpoint and protected admin/data-changing endpoints. |
| `eshop-sut/README.md` | FR-12 rule: Admin area and protected APIs require valid JWT and `role = 'admin'`. |
| `tests/FR12/ENV-01.md` | Fresh environment evidence and observed UI/API behavior. |
| `tests/FR12/ENV-01-ui-state.json` | Captured login roles, UI alert, admin shell visibility, and API access snapshot. |
| `tests/FR12/screenshots/` | Admin login, Normal User blocked, and Admin Users tab screenshots. |

---

## Feature Summary

FR-12 controls access to the Web Admin area and protected backend APIs. The feature must distinguish between three actor states:

- Admin with a valid JWT containing `role = 'admin'`.
- Normal User with a valid JWT containing a non-admin role.
- Unauthenticated User with no valid JWT.

The Admin frontend first authenticates through `POST /api/login`. If the returned user role is not `admin`, the UI blocks entry and shows the alert `Bạn không phải là admin!`. If the returned user role is `admin`, the Admin shell becomes visible and the UI stores an `adminToken` used as a Bearer token for protected requests.

The API specification and README require all `/api/admin/*` APIs, plus data-changing product/category/coupon APIs, to require both a valid JWT and Admin role authorization.

---

## Actors

| Actor | Description | Expected Access |
|-------|-------------|-----------------|
| Admin | Authenticated user whose token has `role = 'admin'`. | Can access Web Admin and protected admin/data-changing APIs. |
| Normal User | Authenticated user whose token has non-admin role, observed as `user` in ENV-01. | Must not access Web Admin protected area or admin-only/data-changing APIs. |
| Unauthenticated User | User with no JWT or no usable session. | Must not access Web Admin protected area or protected APIs. |

---

## System Inputs

| Input | Type | Source | Description |
|-------|------|--------|-------------|
| `email` | String | Admin Login UI / `POST /api/login` | Login identifier used to obtain a user role and token. |
| `password` | String | Admin Login UI / `POST /api/login` | Credential paired with email for login. |
| `loginSubmit` | Action | Admin Login UI | Triggers the login request and UI role gate. |
| `actorRole` | Enum | Login response / token identity | Actor role under test: Admin, Normal User, or Unauthenticated User. |
| `adminToken` | JWT string or empty | Browser storage | Admin frontend session token used for protected API requests. |
| `authorizationHeader` | String or missing | Direct API request | Bearer token header used to test backend access control. |
| `protectedOperation` | Enum/action | UI action or API endpoint | Protected operation being attempted, such as viewing admin users or updating admin data. |
| `httpMethod` | Enum | API request | Request method for protected endpoint: `GET`, `POST`, `PUT`, or `DELETE`. |
| `targetResourceId` | Integer path parameter | API request | Required for protected endpoints using `:id`. |
| `requestPayload` | JSON object | API request | Required for protected endpoints with request bodies; should be valid baseline data when testing only access control. |

---

## Observable Outputs

| Trigger / Condition | Observable Output |
|---------------------|-------------------|
| Admin UI loaded without token | Admin Login screen is displayed. |
| Normal User logs in through Admin UI | Alert `Bạn không phải là admin!`; Admin shell is not entered. |
| Admin logs in through Admin UI | Admin shell is visible; `adminToken` exists; Admin Users tab can be opened. |
| Direct `GET /api/admin/users` with no token | HTTP 401 with `{"error":"Unauthorized"}` observed in ENV-01. |
| Direct `GET /api/admin/users` with Admin token | HTTP 200 and user list observed in ENV-01. |
| Direct `GET /api/admin/users` with Normal User token | HTTP 200 and user list observed in ENV-01, which conflicts with the FR-12 requirement and should be examined in later testing skills. |

---

## Business Rules

| Rule ID | Business Rule | Evidence |
|---------|---------------|----------|
| BR-01 | Web Admin is only for accounts with `role = 'admin'`. | `README.md` FR-12; ENV-01 Normal User UI alert; ENV-01 Admin shell visibility. |
| BR-02 | `/api/admin/*` APIs require a valid JWT. | `README.md` FR-12; `api_specification.md` section 6; ENV-01 no-token API result 401. |
| BR-03 | `/api/admin/*` APIs require `role = 'admin'` in the token, not only token presence. | `README.md` FR-12 and SEC-03; `api_specification.md` section 6. |
| BR-04 | Data-changing product APIs require Admin authorization. | `README.md` FR-12; `api_specification.md` section 3.3. |
| BR-05 | Data-changing category APIs require Admin authorization. | `README.md` FR-12; `api_specification.md` section 3.4. |
| BR-06 | Coupon list/create/delete APIs used by Admin require authenticated Admin access. | `README.md` FR-12; `api_specification.md` sections 5.2 and 6.4. |
| BR-07 | Normal User and Unauthenticated User must be denied protected Admin operations. | Derived directly from BR-01 through BR-06. |
| BR-08 | Public read-only product/category browsing endpoints are outside the protected FR-12 access-control surface unless used as setup or contrast checks. | `api_specification.md` sections 3.1, 3.2, and 3.4 list public read endpoints separately from admin/data-changing actions. |

---

## Assumptions

| Assumption | Reason |
|------------|--------|
| Valid baseline payloads will be used for protected create/update/import operations during access-control tests. | FR-12 is about authorization; payload validation belongs to FR-14, FR-15, FR-16, FR-17, FR-18, and FR-19. |
| `user` is the Normal User role label for the current SUT. | ENV-01 observed Normal User login response role as `user`. |
| Direct API tests are required in addition to UI tests. | FR-12 explicitly covers backend APIs, and UI-only testing cannot prove server-side role enforcement. |
| Existing resource IDs may be created or selected through setup steps before testing protected `:id` operations. | Several protected endpoints require `:id`, and access-control behavior should be isolated from missing-resource behavior. |

---

## Open Questions

| Question | Impact |
|----------|--------|
| Should `GET /api/coupons` be treated as admin-only in every test case even though it is outside `/api/admin/*`? | The API spec labels it Admin and requires a token, while FR-12 also names `/api/coupons` as protected. It should be included in DT-02 unless human review narrows scope. |
| Should malformed JWTs and syntactically invalid `Authorization` headers be included in Domain Testing or only in robustness/security testing? | They affect the `authorizationHeader` domain and likely belong in DT-02 because valid JWT is an explicit FR-12 precondition. |
| Should access-control tests include UI attempts to manipulate `localStorage.adminToken` with a Normal User token? | This may be useful because the Admin UI gates role during login, but stored token behavior is part of the observable session input. |

---

## Missing / Not Specified Information

| Item | Status |
|------|--------|
| Exact expected HTTP status for Normal User hitting admin-only API | Not specified. Expected denial is clear, but whether it should be 401 or 403 is not specified. |
| Exact expected HTTP status for malformed/expired token | Not specified. |
| Token expiration behavior | Not specified in API specification or ENV evidence. |
| Required UI field attributes for Admin Login email/password | Not specified in ENV-01 UI evidence. |
| File location discrepancy for feature input artifact | `FEATURE_INPUT_FR12.md` was found at workspace root, while the workflow also embeds the FR-12 inputs. No functional impact on DT-01. |

---

## Human Review Checklist

- [x] Feature purpose is identified.
- [x] Actors are identified.
- [x] System inputs are identified.
- [x] Observable outputs are identified.
- [x] Business rules are traceable to API specification, README, or ENV evidence.
- [x] Assumptions are separated from verified facts.
- [x] Open questions are recorded for review.
