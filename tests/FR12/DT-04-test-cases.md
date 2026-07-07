# DT-04 - Domain Test Case Generation
**Feature:** FR-12 - Access Control  
**Date:** 2026-07-07  
**Skill:** DT-04  
**Status:** Completed

---

## Evidence Sources

| Source | Use |
|--------|-----|
| `tests/FR12/DT-03-domain-partitioning.md` | Equivalence partitions used for test-case coverage. |
| `tests/FR12/REVIEW-01-of-DT-03.md` | Guidance to use representative combinations instead of full Cartesian product. |
| `tests/FR12/ENV-01.md` | Existing accounts, observable UI state, and initial API observations. |
| `eshop-sut/api_specification.md` | Endpoint methods, paths, and baseline request bodies. |
| `eshop-sut/README.md` | FR-12 and SEC-03 expected access-control rules. |

---

## Test Design Notes

- Expected denial means the request/UI must not expose protected Admin functionality or protected data. If HTTP status is checked, either `401` or `403` is acceptable unless a later requirement specifies one exact status.
- Test payloads should be valid baseline payloads unless the case is specifically about malformed/missing payload handling.
- `expired/stale token` is not included as a required executable case because token expiration behavior is not specified and no reproducible expired token source is available.
- Product/category/coupon/order payload value validation is intentionally outside FR-12 scope.

---

## Domain Test Cases

| TC ID | Input | Expected Result | Covered Domain | Business Rule |
|-------|-------|-----------------|----------------|---------------|
| DT-TC001 | Admin UI opened with no `localStorage.adminToken`. | Admin Login screen is shown; Admin shell is not visible. | STORE-P1, SURFACE-P1, COMBO-P3 | BR-01, BR-07 |
| DT-TC002 | Admin UI login with Admin email `admin@eshop.com` and correct password. | Login succeeds; Admin shell is visible; `adminToken` is stored. | EMAIL-P1, PASS-P1, LOGIN-P1, ROLE-P1, COMBO-P5 | BR-01 |
| DT-TC003 | Admin UI login with valid Normal User email and correct password. | Login is blocked; alert `Bạn không phải là admin!`; Admin shell is not visible. | EMAIL-P2, PASS-P1, LOGIN-P1, ROLE-P2, COMBO-P6 | BR-01, BR-07 |
| DT-TC004 | Admin UI login with unknown email or incorrect password. | Login fails; Admin shell is not visible; no Admin token is granted. | EMAIL-P3, PASS-P2, LOGIN-P1, COMBO-P7 | BR-01 |
| DT-TC005 | Admin UI opened with stored valid Admin token. | Admin shell remains/loads and protected Admin data requests use Bearer token. | STORE-P2, SURFACE-P2, COMBO-P8 | BR-01, BR-02, BR-03 |
| DT-TC006 | Admin UI opened with stored valid Normal User token. | Admin shell is denied or token is cleared; protected Admin data is not exposed. | STORE-P3, SURFACE-P2, COMBO-P9 | BR-01, BR-03, BR-07 |
| DT-TC007 | Admin UI opened with stored invalid token. | Admin shell is denied or token is cleared; protected Admin data is not exposed. | STORE-P4, AUTH-P4, SURFACE-P2, COMBO-P9 | BR-01, BR-02, BR-07 |
| DT-TC008 | Direct `GET /api/admin/users` with `Bearer <valid admin JWT>`. | Request succeeds and returns user list. | ROLE-P1, AUTH-P1, HDR-P1, OP-P1, METHOD-P1, PAYLOAD-P1, COMBO-P1 | BR-02, BR-03 |
| DT-TC009 | Direct `GET /api/admin/users` with `Bearer <valid normal user JWT>`. | Access denied; user list is not returned. | ROLE-P2, AUTH-P2, HDR-P2, OP-P1, METHOD-P1, PAYLOAD-P1, COMBO-P2 | BR-03, BR-07 |
| DT-TC010 | Direct `GET /api/admin/users` with no `Authorization` header. | Access denied; user list is not returned. | ROLE-P3, AUTH-P3, HDR-P3, OP-P1, METHOD-P1, COMBO-P3 | BR-02, BR-07 |
| DT-TC011 | Direct `GET /api/admin/users` with empty `Authorization` header. | Access denied. | HDR-P4, AUTH-P5, OP-P1, METHOD-P1, COMBO-P3 | BR-02 |
| DT-TC012 | Direct `GET /api/admin/users` with wrong scheme, for example `Basic <token>`. | Access denied. | HDR-P5, AUTH-P5, OP-P1, METHOD-P1, COMBO-P4 | BR-02 |
| DT-TC013 | Direct `GET /api/admin/users` with malformed Bearer header, for example `Bearer`. | Access denied. | HDR-P6, AUTH-P5, OP-P1, METHOD-P1, COMBO-P4 | BR-02 |
| DT-TC014 | Direct `GET /api/admin/users` with invalid/tampered Bearer token. | Access denied. | HDR-P7, AUTH-P4, OP-P1, METHOD-P1, COMBO-P4 | BR-02 |
| DT-TC015 | Direct `DELETE /api/admin/users/:id` with Admin token and an existing non-self user ID. | User deletion is allowed or reaches valid protected-operation result; denial must not be due to missing Admin role. | ROLE-P1, AUTH-P1, HDR-P1, OP-P1, METHOD-P4, ID-P1, COMBO-P1 | BR-02, BR-03 |
| DT-TC016 | Direct `DELETE /api/admin/users/:id` with Normal User token and existing user ID. | Access denied; user is not deleted. | ROLE-P2, AUTH-P2, HDR-P2, OP-P1, METHOD-P4, ID-P1, COMBO-P2 | BR-03, BR-07 |
| DT-TC017 | Direct `GET /api/admin/orders` with Admin token. | Request succeeds and returns system order list. | ROLE-P1, AUTH-P1, HDR-P1, OP-P2, METHOD-P1, COMBO-P1 | BR-02, BR-03 |
| DT-TC018 | Direct `GET /api/admin/orders` with no token. | Access denied; system order list is not returned. | ROLE-P3, AUTH-P3, HDR-P3, OP-P2, METHOD-P1, COMBO-P3 | BR-02, BR-07 |
| DT-TC019 | Direct `PUT /api/admin/orders/:id/status` with Admin token, existing order ID, and valid baseline body `{"status":"confirmed"}`. | Status update is allowed or reaches valid protected-operation result; denial must not be due to missing Admin role. | ROLE-P1, AUTH-P1, HDR-P1, OP-P2, METHOD-P3, ID-P1, PAYLOAD-P2, COMBO-P1 | BR-02, BR-03 |
| DT-TC020 | Direct `PUT /api/admin/orders/:id/status` with Normal User token, existing order ID, and valid baseline body. | Access denied; order status is not updated. | ROLE-P2, AUTH-P2, HDR-P2, OP-P2, METHOD-P3, ID-P1, PAYLOAD-P2, COMBO-P2 | BR-03, BR-07 |
| DT-TC021 | Direct `POST /api/admin/import-products` with Admin token and valid baseline `products` array. | Import request is allowed or reaches valid protected-operation result. | ROLE-P1, AUTH-P1, HDR-P1, OP-P3, METHOD-P2, PAYLOAD-P2, COMBO-P1 | BR-02, BR-03 |
| DT-TC022 | Direct `POST /api/admin/import-products` with Normal User token and valid baseline `products` array. | Access denied; products are not imported. | ROLE-P2, AUTH-P2, HDR-P2, OP-P3, METHOD-P2, PAYLOAD-P2, COMBO-P2 | BR-03, BR-07 |
| DT-TC023 | Direct `POST /api/products` with Admin token and valid product body. | Product creation is allowed. | ROLE-P1, AUTH-P1, HDR-P1, OP-P4, METHOD-P2, PAYLOAD-P2, ID-P5, COMBO-P1 | BR-04 |
| DT-TC024 | Direct `POST /api/products` with Normal User token and valid product body. | Access denied; product is not created. | ROLE-P2, AUTH-P2, HDR-P2, OP-P4, METHOD-P2, PAYLOAD-P2, ID-P5, COMBO-P2 | BR-04, BR-07 |
| DT-TC025 | Direct `PUT /api/products/:id` with Admin token, existing product ID, and valid product body. | Product update is allowed only for Admin. | ROLE-P1, AUTH-P1, HDR-P1, OP-P4, METHOD-P3, ID-P1, PAYLOAD-P2, COMBO-P1 | BR-04 |
| DT-TC026 | Direct `DELETE /api/products/:id` with no token and existing product ID. | Access denied; product is not deleted. | ROLE-P3, AUTH-P3, HDR-P3, OP-P4, METHOD-P4, ID-P1, COMBO-P3 | BR-02, BR-04 |
| DT-TC027 | Direct `POST /api/categories` with Admin token and valid category body. | Category creation is allowed. | ROLE-P1, AUTH-P1, HDR-P1, OP-P5, METHOD-P2, PAYLOAD-P2, ID-P5, COMBO-P1 | BR-05 |
| DT-TC028 | Direct `POST /api/categories` with Normal User token and valid category body. | Access denied; category is not created. | ROLE-P2, AUTH-P2, HDR-P2, OP-P5, METHOD-P2, PAYLOAD-P2, ID-P5, COMBO-P2 | BR-05, BR-07 |
| DT-TC029 | Direct `DELETE /api/categories/:id` with no token and existing category ID. | Access denied; category is not deleted. | ROLE-P3, AUTH-P3, HDR-P3, OP-P5, METHOD-P4, ID-P1, COMBO-P3 | BR-02, BR-05 |
| DT-TC030 | Direct `GET /api/coupons` with Admin token. | Coupon list is returned. | ROLE-P1, AUTH-P1, HDR-P1, OP-P6, METHOD-P1, PAYLOAD-P1, COMBO-P1 | BR-06 |
| DT-TC031 | Direct `GET /api/coupons` with Normal User token. | Access denied; coupon list is not returned. | ROLE-P2, AUTH-P2, HDR-P2, OP-P6, METHOD-P1, PAYLOAD-P1, COMBO-P2 | BR-06, BR-07 |
| DT-TC032 | Direct `GET /api/coupons` with no token. | Access denied; coupon list is not returned. | ROLE-P3, AUTH-P3, HDR-P3, OP-P6, METHOD-P1, PAYLOAD-P1, COMBO-P3 | BR-02, BR-06 |
| DT-TC033 | Direct `POST /api/admin/coupons` with Admin token and valid coupon body. | Coupon creation is allowed. | ROLE-P1, AUTH-P1, HDR-P1, OP-P6, METHOD-P2, PAYLOAD-P2, COMBO-P1 | BR-06 |
| DT-TC034 | Direct `POST /api/admin/coupons` with Normal User token and valid coupon body. | Access denied; coupon is not created. | ROLE-P2, AUTH-P2, HDR-P2, OP-P6, METHOD-P2, PAYLOAD-P2, COMBO-P2 | BR-06, BR-07 |
| DT-TC035 | Direct `DELETE /api/admin/coupons/:id` with Admin token and existing coupon ID. | Coupon deletion is allowed only for Admin. | ROLE-P1, AUTH-P1, HDR-P1, OP-P6, METHOD-P4, ID-P1, COMBO-P1 | BR-06 |
| DT-TC036 | Direct `POST /api/admin/coupons` with Normal User token and malformed JSON body. | Access denied should still prevent Admin action; malformed body must not result in unauthorized creation. | ROLE-P2, AUTH-P2, HDR-P2, OP-P6, METHOD-P2, PAYLOAD-P4, COMBO-P2 | BR-03, BR-06, BR-07 |
| DT-TC037 | Direct `PUT /api/products/not-a-number` with Admin token and valid product body. | Request should not update any product; invalid ID handling may occur after Admin authorization. | ROLE-P1, AUTH-P1, HDR-P1, OP-P4, METHOD-P3, ID-P3, PAYLOAD-P2 | BR-04 |
| DT-TC038 | Direct `PUT /api/products/99999999` with Admin token and valid product body. | Request should not update a nonexistent product; not-found handling may occur after Admin authorization. | ROLE-P1, AUTH-P1, HDR-P1, OP-P4, METHOD-P3, ID-P4, PAYLOAD-P2 | BR-04 |
| DT-TC039 | Direct `POST /api/products` with Admin token but missing required body. | Request should not create a product; validation error is acceptable, but access must be limited to Admin actor. | ROLE-P1, AUTH-P1, HDR-P1, OP-P4, METHOD-P2, PAYLOAD-P3 | BR-04 |
| DT-TC040 | Direct `GET /api/products` with no token. | Public product list is accessible; no Admin-only denial expected. | ROLE-P3, AUTH-P3, OP-P7, METHOD-P1, SURFACE-P4, COMBO-P10 | BR-08 |
| DT-TC041 | Direct `GET /api/categories` with Normal User token or no token. | Public category list is accessible; no Admin-only denial expected. | ROLE-P2/ROLE-P3, OP-P7, METHOD-P1, SURFACE-P4, COMBO-P10 | BR-08 |
| DT-TC042 | Direct unsupported/mismatched method against a protected path, for example `PATCH /api/admin/users`. | Request must not grant protected access or expose protected data. | METHOD-P5, OP-P1, SURFACE-P3 | BR-02, BR-03 |

---

## Coverage Matrix

| Domain / Rule Area | Covered By |
|--------------------|------------|
| Admin UI no-token gate | DT-TC001 |
| Admin UI successful Admin login | DT-TC002 |
| Admin UI Normal User role denial | DT-TC003 |
| Admin UI invalid credential denial | DT-TC004 |
| Stored token UI states | DT-TC005, DT-TC006, DT-TC007 |
| Valid Admin Bearer token | DT-TC008, DT-TC015, DT-TC017, DT-TC019, DT-TC021, DT-TC023, DT-TC025, DT-TC027, DT-TC030, DT-TC033, DT-TC035 |
| Valid Normal User Bearer token | DT-TC009, DT-TC016, DT-TC020, DT-TC022, DT-TC024, DT-TC028, DT-TC031, DT-TC034, DT-TC036 |
| Missing/empty/malformed/wrong/invalid headers | DT-TC010, DT-TC011, DT-TC012, DT-TC013, DT-TC014 |
| `/api/admin/*` operations | DT-TC008 to DT-TC022, DT-TC033 to DT-TC036, DT-TC042 |
| Product write operations | DT-TC023 to DT-TC026, DT-TC037 to DT-TC039 |
| Category write operations | DT-TC027 to DT-TC029 |
| Coupon operations | DT-TC030 to DT-TC036 |
| Resource ID classes | DT-TC015, DT-TC016, DT-TC019, DT-TC020, DT-TC025, DT-TC026, DT-TC029, DT-TC035, DT-TC037, DT-TC038 |
| Payload presence classes | DT-TC019 to DT-TC024, DT-TC027, DT-TC028, DT-TC033, DT-TC034, DT-TC036, DT-TC039 |
| Public read contrast | DT-TC040, DT-TC041 |

---

## Human Review Checklist

- [x] Representative values selected from all major partitions.
- [x] Every protected operation group is exercised.
- [x] Admin allowed cases are included.
- [x] Normal User denial cases are included.
- [x] Unauthenticated denial cases are included.
- [x] Malformed/invalid header classes are included.
- [x] UI and direct API surfaces are covered.
- [x] Public-read contrast cases are included.
- [x] Redundant full Cartesian combinations are avoided.

Next skill: `EXEC-01`.
