# DT-03 - Domain Partitioning
**Feature:** FR-12 - Access Control  
**Date:** 2026-07-07  
**Skill:** DT-03  
**Status:** Completed

---

## Evidence Sources

| Source | Use |
|--------|-----|
| `tests/FR12/DT-02-domain-identification.md` | Domain variables, valid/invalid domains, constraints, and dependencies. |
| `tests/FR12/REVIEW-01-of-DT-02.md` | Review guidance for behavior-driving partitions and scope boundaries. |
| `tests/FR12/ENV-01.md` | Observed UI/API evidence for Admin, Normal User, and no-token behavior. |
| `eshop-sut/api_specification.md` | Endpoint/method definitions. |
| `eshop-sut/README.md` | FR-12 and SEC-03 access-control requirements. |

---

## Partitioning Strategy

FR-12 is an access-control feature, so partitions are based on behavior-driving differences:

- Authentication state and token validity.
- Authorization role in a valid token.
- UI stored-token state.
- Protected operation group and HTTP method.
- Whether required path IDs and baseline request bodies are suitable for isolating access control.

Payload value validation is intentionally not expanded because it belongs to the related CRUD/import/order features.

---

## Domain Partitions

| Variable | Partition | Description |
|----------|-----------|-------------|
| `email` | EMAIL-P1 Valid Admin email | Existing Admin account email, expected to authenticate and pass Admin UI role gate with correct password. |
| `email` | EMAIL-P2 Valid Normal User email | Existing Normal User email, expected to authenticate but fail Admin UI role gate. |
| `email` | EMAIL-P3 Unknown/nonexistent email | Email not tied to an existing account; login should fail before authorization. |
| `email` | EMAIL-P4 Empty or syntactically malformed email | Invalid login input; useful only for UI login gate sanity, not backend access-control rules. |
| `password` | PASS-P1 Correct matching password | Password matches the selected account. |
| `password` | PASS-P2 Incorrect password | Password does not match selected account; login should fail before authorization. |
| `password` | PASS-P3 Empty password | Missing credential; login should fail before authorization. |
| `loginSubmit` | LOGIN-P1 Submit once with entered credentials | Normal Admin Login action. |
| `loginSubmit` | LOGIN-P2 No submit action | No access-control decision is triggered. |
| `loginSubmit` | LOGIN-P3 Repeated submit | Same credential state submitted more than once; should not grant access unless credentials and role are valid. |
| `actorRole` | ROLE-P1 Admin | Valid authenticated actor with `role = 'admin'`; expected to be authorized for FR-12 protected operations. |
| `actorRole` | ROLE-P2 Normal User | Valid authenticated actor with non-admin role, observed as `user`; expected to be denied protected Admin operations. |
| `actorRole` | ROLE-P3 Unauthenticated | No authenticated actor; expected to be denied protected operations. |
| `actorRole` | ROLE-P4 Unknown/non-admin role | Token role is present but not `admin`; expected to be denied if representable. |
| `authenticationState` | AUTH-P1 Valid Admin JWT | Authenticated token is valid and has Admin role; expected allowed for protected operations. |
| `authenticationState` | AUTH-P2 Valid non-admin JWT | Authenticated token is valid but role is not Admin; expected denied. |
| `authenticationState` | AUTH-P3 No JWT | No token/session is provided; expected denied. |
| `authenticationState` | AUTH-P4 Invalid or tampered JWT | Token is not accepted as valid; expected denied. |
| `authenticationState` | AUTH-P5 Malformed token value | Token value is syntactically unusable; expected denied. |
| `authenticationState` | AUTH-P6 Expired/stale JWT | Token is expired or stale if observable; expected denied. Token expiry behavior is not specified. |
| `authorizationHeader` | HDR-P1 `Bearer <valid admin JWT>` | Correct scheme plus valid Admin token; expected allowed for protected endpoints. |
| `authorizationHeader` | HDR-P2 `Bearer <valid normal user JWT>` | Correct scheme plus valid non-admin token; expected denied by role check. |
| `authorizationHeader` | HDR-P3 Missing header | No `Authorization` header; expected denied. |
| `authorizationHeader` | HDR-P4 Empty header | Header present but empty; expected denied. |
| `authorizationHeader` | HDR-P5 Wrong scheme | Header uses a non-Bearer scheme, such as `Basic` or raw token; expected denied. |
| `authorizationHeader` | HDR-P6 Malformed Bearer header | Bearer scheme is present but token is missing/malformed; expected denied. |
| `authorizationHeader` | HDR-P7 Invalid/tampered Bearer token | Bearer token is present but signature/content is invalid; expected denied. |
| `adminToken` | STORE-P1 No stored token | Admin UI should show login screen and should not expose Admin shell. |
| `adminToken` | STORE-P2 Stored valid Admin token | Admin UI may enter protected shell and call Admin APIs. |
| `adminToken` | STORE-P3 Stored valid Normal User token | UI should not expose protected Admin content; API calls should be denied by backend role checks. |
| `adminToken` | STORE-P4 Stored invalid token | UI/API should clear or deny protected state. |
| `adminToken` | STORE-P5 Stored expired/stale token | UI/API should deny protected state if expiry/staleness is observable. |
| `protectedOperation` | OP-P1 Admin user management read/write | `/api/admin/users` and `/api/admin/users/:id`; expected Admin-only. |
| `protectedOperation` | OP-P2 Admin order read/status update | `/api/admin/orders` and `/api/admin/orders/:id/status`; expected Admin-only. |
| `protectedOperation` | OP-P3 Admin product import | `/api/admin/import-products`; expected Admin-only. |
| `protectedOperation` | OP-P4 Product data-changing operations | `POST/PUT/DELETE /api/products`; expected Admin-only. |
| `protectedOperation` | OP-P5 Category data-changing operations | `POST/PUT/DELETE /api/categories`; expected Admin-only. |
| `protectedOperation` | OP-P6 Coupon list/create/delete operations | `GET /api/coupons`, `POST /api/admin/coupons`, `DELETE /api/admin/coupons/:id`; expected Admin-only. |
| `protectedOperation` | OP-P7 Public read-only contrast operation | Public read-only product/category operations such as `GET /api/products` or `GET /api/categories`; outside protected denial expectation. |
| `httpMethod` | METHOD-P1 `GET` protected read/list | Protected read/list method, such as admin users, admin orders, or coupon list. |
| `httpMethod` | METHOD-P2 `POST` protected create/import | Protected creation/import method. |
| `httpMethod` | METHOD-P3 `PUT` protected update | Protected update method. |
| `httpMethod` | METHOD-P4 `DELETE` protected deletion | Protected deletion method. |
| `httpMethod` | METHOD-P5 Unsupported/mismatched method | Method not documented for the selected endpoint; expected not to grant protected access. |
| `targetResourceId` | ID-P1 Existing valid ID | Existing resource ID for an endpoint requiring `:id`; isolates authorization behavior. |
| `targetResourceId` | ID-P2 Missing ID where required | Path parameter omitted or endpoint shape invalid; request should fail independently of authorization. |
| `targetResourceId` | ID-P3 Non-numeric ID | Invalid ID type for numeric path parameter; should fail independently of authorization. |
| `targetResourceId` | ID-P4 Nonexistent numeric ID | Numeric but no matching resource; can produce not-found behavior after authorization. |
| `targetResourceId` | ID-P5 Not applicable | Endpoint does not require `:id`. |
| `requestPayloadPresence` | PAYLOAD-P1 Not required | Endpoint/method does not require a body, such as most `GET` and `DELETE` operations. |
| `requestPayloadPresence` | PAYLOAD-P2 Valid baseline body present | Required body is present and structurally valid to isolate access control. |
| `requestPayloadPresence` | PAYLOAD-P3 Missing required body | Body-required endpoint is called without body; may fail validation before or after auth. |
| `requestPayloadPresence` | PAYLOAD-P4 Malformed JSON body | Body is syntactically invalid; may fail parsing before or after auth. |
| `requestPayloadPresence` | PAYLOAD-P5 Business-invalid body | Body parses but fails another feature's validation; excluded from core FR-12 access-control coverage. |
| `accessSurface` | SURFACE-P1 Admin UI login gate | Visible Admin Login form and client-side role gate. |
| `accessSurface` | SURFACE-P2 Admin UI stored-token gate | Browser storage token controls whether UI enters protected Admin shell. |
| `accessSurface` | SURFACE-P3 Direct protected API call | API is called directly with controlled `Authorization` header. |
| `accessSurface` | SURFACE-P4 Public/non-protected API contrast | Public API used only to confirm contrast with protected endpoints. |

---

## Key Cross-Variable Partitions

Some access-control behavior depends on combinations rather than single variables.

| Combined Partition | Variables | Description | Expected Access |
|--------------------|-----------|-------------|-----------------|
| COMBO-P1 Authorized Admin API access | ROLE-P1 + AUTH-P1 + HDR-P1 + protected OP-P1 to OP-P6 | Valid Admin token attempts protected operation. | Allow |
| COMBO-P2 Authenticated non-admin API access | ROLE-P2 + AUTH-P2 + HDR-P2 + protected OP-P1 to OP-P6 | Valid Normal User token attempts protected operation. | Deny |
| COMBO-P3 Unauthenticated API access | ROLE-P3 + AUTH-P3 + HDR-P3/HDR-P4 + protected OP-P1 to OP-P6 | No usable token attempts protected operation. | Deny |
| COMBO-P4 Invalid-token API access | AUTH-P4/AUTH-P5 + HDR-P5/HDR-P6/HDR-P7 + protected OP-P1 to OP-P6 | Header/token cannot prove valid Admin identity. | Deny |
| COMBO-P5 Admin UI successful role gate | EMAIL-P1 + PASS-P1 + LOGIN-P1 + ROLE-P1 | Admin submits correct credentials through Admin UI. | Allow Admin shell |
| COMBO-P6 Admin UI blocks Normal User | EMAIL-P2 + PASS-P1 + LOGIN-P1 + ROLE-P2 | Normal User submits correct credentials through Admin UI. | Deny Admin shell |
| COMBO-P7 Admin UI login failure | EMAIL-P3/EMAIL-P4 or PASS-P2/PASS-P3 + LOGIN-P1 | Credentials do not authenticate. | Deny Admin shell |
| COMBO-P8 Stored Admin token UI access | STORE-P2 + SURFACE-P2 | Browser storage contains valid Admin token. | Allow or maintain Admin shell |
| COMBO-P9 Stored non-admin/invalid token UI access | STORE-P3/STORE-P4 + SURFACE-P2 | Browser storage contains non-admin or invalid token. | Deny or clear Admin shell |
| COMBO-P10 Public read contrast | OP-P7 + SURFACE-P4 + any actor state | Public read endpoint is called. | No Admin-only denial expected |

---

## Completeness Check

| Domain Area | Coverage Status |
|-------------|-----------------|
| Admin, Normal User, Unauthenticated actors | Covered by ROLE-P1 to ROLE-P3. |
| Valid JWT requirement | Covered by AUTH-P1 to AUTH-P6 and HDR-P1 to HDR-P7. |
| Role requirement | Covered by ROLE-P1, ROLE-P2, ROLE-P4 and COMBO-P1/COMBO-P2. |
| `/api/admin/*` endpoints | Covered by OP-P1 to OP-P3. |
| Product data-changing APIs | Covered by OP-P4. |
| Category data-changing APIs | Covered by OP-P5. |
| Coupon APIs | Covered by OP-P6. |
| Admin UI access gate | Covered by SURFACE-P1, SURFACE-P2, COMBO-P5 to COMBO-P9. |
| Public endpoint contrast | Covered by OP-P7 and COMBO-P10. |
| Path IDs and payload requirements | Covered by ID-P1 to ID-P5 and PAYLOAD-P1 to PAYLOAD-P5. |

---

## Human Review Checklist

- [x] Partitions are mutually exclusive within each variable where feasible.
- [x] Partitions cover the valid and invalid domains from DT-02.
- [x] Authentication and authorization partitions are separated.
- [x] UI and direct API access surfaces are both represented.
- [x] Protected operation groups cover all FR-12 endpoint classes.
- [x] Payload-specific business validation is not expanded beyond FR-12 needs.
- [x] Combined partitions capture key access-control dependencies.

Next skill: `REVIEW-01`.
