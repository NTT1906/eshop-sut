# DT-02 - Domain Identification
**Feature:** FR-12 - Access Control  
**Date:** 2026-07-07  
**Skill:** DT-02  
**Status:** Completed

---

## Evidence Sources

| Source | Use |
|--------|-----|
| `tests/FR12/DT-01-feature-understanding.md` | Approved feature purpose, actors, inputs, outputs, and business rules. |
| `tests/FR12/REVIEW-01-of-DT-01.md` | Carry-forward decisions for `GET /api/coupons`, malformed headers, and stored token state. |
| `tests/FR12/ENV-01.md` | Observable UI and API behavior from fresh environment run. |
| `tests/FR12/ENV-01-ui-state.json` | Observed roles, HTTP status values, and Admin UI state. |
| `eshop-sut/api_specification.md` | Protected endpoint list and required `Authorization: Bearer <token>` header. |
| `eshop-sut/README.md` | FR-12 and SEC-03 role-check rules. |

---

## Domain Identification Table

| Variable | Type | Valid Domain | Invalid Domain | Evidence |
|----------|------|--------------|----------------|----------|
| `email` | String | Existing Admin account email for Admin UI access; existing Normal User email for denial path. | Unknown email, malformed email, empty email, or email for an account that cannot authenticate. | Admin Login UI in ENV-01; `POST /api/login` in API spec; ENV observed Admin and Normal User login. |
| `password` | String | Correct password matching the submitted `email`. | Empty password, incorrect password, password for a different account. | Admin Login UI in ENV-01; `POST /api/login` in API spec. |
| `loginSubmit` | Action | Submit the Admin Login form after entering credentials. | No submit action; repeated submit while credentials are invalid or unchanged. | ENV-01 captured Admin Login form and successful/blocked login flows. |
| `actorRole` | Enum | `admin` for allowed Admin operations. | `user` / Normal User for admin-only operations; unauthenticated/no actor for protected operations; unknown role if token claims are not recognized. | README FR-12 requires `role = 'admin'`; ENV observed roles `admin` and `user`. |
| `authenticationState` | Enum | Authenticated with valid JWT. | Unauthenticated/no token; invalid token; malformed token; expired token if produced by system; token present but role not authorized. | README FR-12 requires valid JWT; ENV no-token request returned 401. Expiration behavior is not specified. |
| `authorizationHeader` | String / missing | Header exactly using Bearer scheme with a valid Admin JWT for protected admin/data-changing endpoints. | Missing header; empty header; malformed header; wrong scheme; invalid/tampered JWT; valid Normal User JWT; syntactically valid JWT without Admin role. | API spec requires `Authorization: Bearer <token>`; README SEC-03 requires role check; REVIEW-01 decided to include malformed/invalid classes. |
| `adminToken` | JWT string / empty | Browser `localStorage.adminToken` contains a valid Admin JWT. | Missing stored token; empty stored token; invalid stored token; stored valid Normal User token; stale token if observable. | ENV-01 showed Admin UI reads/stores `adminToken`; REVIEW-01 decided to include stored token state as hidden/system input. |
| `protectedOperation` | Enum / action | Protected operation attempted by an Admin with valid JWT: admin users, admin orders, admin import, product write, category write, coupon list/create/delete. | Same operation attempted by Normal User, unauthenticated user, or malformed/invalid token; operation outside FR-12 scope. | API spec sections 3.3, 3.4, 5.2, 6.1-6.4; README FR-12. |
| `httpMethod` | Enum | Method documented for the selected protected endpoint: `GET`, `POST`, `PUT`, or `DELETE`. | Unsupported method for endpoint; method/resource mismatch; public read method treated as protected when not data-changing, except `GET /api/coupons` which is specified Admin. | API spec endpoint definitions. |
| `targetResourceId` | Integer path parameter | Existing ID for protected endpoints with `:id`, when using baseline valid data. | Missing ID for `:id` endpoint; non-numeric ID; nonexistent ID; ID for resource not appropriate to selected operation. | API spec protected endpoints with `:id`; DT-01 assumption to isolate access control from missing-resource behavior. |
| `requestPayloadPresence` | Enum | Present and structurally valid for protected endpoints requiring body; absent for protected endpoints that do not require body. | Missing payload when body is required; unrelated payload; malformed JSON; body validation failures that prevent isolating access control. | API spec body examples for order status, import products, products, categories, and coupons. |
| `accessSurface` | Enum | Direct API protected endpoint or Admin UI protected shell/action. | Out-of-scope public browsing endpoints, decorative UI, labels, dashboard readout only. | DT-01 business rules; REVIEW-01 requires both UI and direct API coverage. |

---

## Protected Operation Domain

The `protectedOperation` domain is grouped by access-control rule rather than payload-specific feature validation.

| Operation Group | Endpoint / UI Action | Required Method | Expected Authorized Actor |
|-----------------|----------------------|-----------------|---------------------------|
| Admin user list | `GET /api/admin/users`; Admin Users tab data load | `GET` | Admin |
| Admin user deletion | `DELETE /api/admin/users/:id`; `Xóa` in Users tab | `DELETE` | Admin |
| Admin order list | `GET /api/admin/orders`; Admin Orders tab data load | `GET` | Admin |
| Admin order status update | `PUT /api/admin/orders/:id/status`; order status buttons | `PUT` | Admin |
| Admin product import | `POST /api/admin/import-products`; import action | `POST` | Admin |
| Product creation | `POST /api/products`; product form submit | `POST` | Admin |
| Product update | `PUT /api/products/:id`; product edit submit | `PUT` | Admin |
| Product deletion | `DELETE /api/products/:id`; product delete action | `DELETE` | Admin |
| Category creation | `POST /api/categories`; category form submit | `POST` | Admin |
| Category update | `PUT /api/categories/:id` | `PUT` | Admin |
| Category deletion | `DELETE /api/categories/:id`; category delete action | `DELETE` | Admin |
| Coupon list | `GET /api/coupons`; coupon tab data load | `GET` | Admin |
| Coupon creation | `POST /api/admin/coupons`; coupon form submit | `POST` | Admin |
| Coupon deletion | `DELETE /api/admin/coupons/:id`; coupon delete action | `DELETE` | Admin |

---

## Input Constraints

| Variable | Constraint |
|----------|------------|
| `actorRole` | Must be evaluated together with `authenticationState`; Admin role is valid only when carried in a valid JWT. |
| `authorizationHeader` | Must use `Bearer` format for valid API requests. Token presence alone is not sufficient; `role = 'admin'` is required. |
| `adminToken` | Admin UI protected state depends on browser storage. A stored token may bypass the visible login form and trigger API calls. |
| `protectedOperation` | Expected access result depends on whether the operation is admin-only/data-changing versus public/read-only. |
| `httpMethod` | The same path may have different access rules depending on method, for example public `GET /api/products` versus protected `POST /api/products`. |
| `targetResourceId` | Required only for endpoints whose path includes `:id`; use an existing ID when testing authorization to avoid confusing access denial with not-found behavior. |
| `requestPayloadPresence` | Use valid baseline payloads for access-control cases unless the case specifically targets malformed body handling. |

---

## Dependencies Between Variables

| Dependency | Explanation |
|------------|-------------|
| `actorRole` + `authenticationState` | Admin access requires both authenticated state and Admin role. A Normal User token is authenticated but still unauthorized. |
| `authorizationHeader` + `protectedOperation` | Header validity must be tested against every protected operation group because enforcement may differ by route. |
| `httpMethod` + endpoint path | FR-12 protects data-changing product/category/coupon methods, while some read-only methods remain public. |
| `targetResourceId` + `protectedOperation` | ID is required only for delete/update/status endpoints. |
| `requestPayloadPresence` + `httpMethod` | `POST` and `PUT` operations usually require a valid body; `GET` and `DELETE` usually do not require a body in this API spec. |
| `adminToken` + Admin UI state | A valid stored Admin token should show protected Admin UI; missing/invalid/non-admin stored token should deny or clear access. |

---

## Variables Excluded From DT-02 Domain Testing

| Variable / Element | Reason |
|--------------------|--------|
| Product `name`, `price`, `description`, `imageUrl`, `category_id` value domains | Covered by FR-15 Product management; FR-12 only needs valid baseline product payloads to trigger authorization checks. |
| Category `name` value domain | Covered by FR-14 Category management; FR-12 only needs valid baseline category payloads. |
| Coupon `code`, `type`, `discount_value`, `min_order_amount`, `expired_at`, `max_uses_per_user` value domains | Covered by FR-17 Coupon management; FR-12 only needs valid baseline coupon payloads. |
| CSV row content details | Covered by FR-16 Product import; FR-12 only checks access to the import endpoint. |
| Order status transition validity | Covered by FR-10 and FR-18; FR-12 only checks whether status update is Admin-protected. |
| Admin sidebar labels and dashboard stat cards | Display/navigation outputs, not access-control input domains. |
| User table row checkbox | Rendered in ENV evidence but no implemented protected action was observed. |

---

## Human Review Checklist

- [x] Every DT-01 input variable was considered.
- [x] Hidden/system inputs affecting behavior were included.
- [x] Domains are tied to FR-12 evidence.
- [x] Domain definitions separate authentication from authorization.
- [x] Public read-only endpoints are separated from protected operations.
- [x] Payload value validation is excluded where it belongs to other features.
- [x] Dependencies between variables are identified.

Next skill: `REVIEW-01`.
