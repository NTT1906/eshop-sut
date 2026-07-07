# BVA-01 - Boundary Value Analysis
**Feature:** FR-12 - Access Control  
**Date:** 2026-07-07  
**Skill:** BVA-01  
**Status:** Completed

---

## Evidence Sources

| Source | Use |
|--------|-----|
| `tests/FR12/DT-02-domain-identification.md` | Verified input domains. |
| `tests/FR12/DT-03-domain-partitioning.md` | Reviewed domain partitions. |
| `tests/FR12/DT-04-test-cases.md` | Existing Domain Testing coverage. |
| `eshop-sut/api_specification.md` | API inputs and endpoint definitions. |
| `eshop-sut/README.md` | FR-12 and SEC-03 access-control rules. |

---

## BVA Applicability Decision

BVA applies to numeric values, string length, date/time, and ordered values with explicit minimum/maximum constraints.

FR-12 Access Control is primarily categorical:

- Actor role: Admin / Normal User / Unauthenticated.
- Authentication state: valid token / missing token / invalid token.
- Authorization header class: valid Bearer / wrong scheme / malformed / missing.
- Access surface: Admin UI / direct API.
- Protected operation group: admin users, admin orders, products, categories, coupons.

The FR-12 specification does not define explicit numeric, length, date, or ordered boundaries for these variables. Therefore, no mandatory BVA test values are generated for FR-12.

---

## Boundary Variable Review

| Variable | Boundary Type | Explicit Boundary Found? | BVA Decision | Reason |
|----------|---------------|--------------------------|--------------|--------|
| `email` | String length / format | No | Excluded | Admin Login uses email as credential input, but FR-12 does not specify min/max length or email format boundaries. Login validation belongs mainly to FR-02. |
| `password` | String length | No | Excluded | No FR-12 password length boundary is specified. Login validation belongs mainly to FR-02. |
| `actorRole` | Enum | N/A | Excluded | Role is categorical, covered by Domain Testing partitions. |
| `authenticationState` | Enum | N/A | Excluded | Token validity state is categorical, covered by Domain Testing partitions. |
| `authorizationHeader` | String format | No explicit length boundary | Excluded | Header format classes are categorical. The spec requires `Authorization: Bearer <token>` but gives no min/max length. |
| `adminToken` | JWT string / empty | No explicit length or expiration boundary | Excluded | Token presence/validity is categorical. Token expiration is not specified. |
| `protectedOperation` | Enum | N/A | Excluded | Endpoint/action group is categorical, covered by Domain Testing. |
| `httpMethod` | Enum | N/A | Excluded | HTTP method is categorical, covered by Domain Testing. |
| `targetResourceId` | Integer path parameter | No explicit min/max | Excluded from formal BVA | IDs are numeric, but FR-12 does not define ID boundaries. Domain Testing already covered existing ID, non-numeric ID, nonexistent ID, missing ID, and not-applicable ID. |
| `requestPayloadPresence` | Enum | N/A | Excluded | Payload presence/shape is categorical for FR-12 access-control scope. |
| `accessSurface` | Enum | N/A | Excluded | UI/API surface is categorical. |

---

## BVA Test Values

| Variable | Boundary | Test Value |
|----------|----------|------------|
| N/A | No explicit FR-12 numeric, string-length, date/time, or ordered input boundary | No BVA test value generated |

---

## Coverage Already Provided By Domain Testing

Although no formal BVA cases apply, DT-04 already covers robustness classes that are sometimes confused with boundary tests:

| Domain Area | DT Coverage |
|-------------|-------------|
| Missing token | `DT-TC010`, `DT-TC018`, `DT-TC026`, `DT-TC029`, `DT-TC032` |
| Empty/malformed/wrong-scheme authorization header | `DT-TC011`, `DT-TC012`, `DT-TC013`, `DT-TC014` |
| Valid Admin token versus valid Normal User token | `DT-TC008`, `DT-TC009`, and protected-operation group cases |
| Existing, non-numeric, and nonexistent resource IDs | `DT-TC015`, `DT-TC016`, `DT-TC019`, `DT-TC020`, `DT-TC037`, `DT-TC038` |
| Missing/malformed request body | `DT-TC036`, `DT-TC039` |

These are Domain Testing equivalence classes, not formal BVA cases, because no explicit lower/upper boundaries are specified.

---

## Human Review Checklist

- [x] Every FR-12 domain variable was reviewed for BVA applicability.
- [x] Variables without explicit boundaries were excluded.
- [x] No artificial min/max values were invented.
- [x] Domain Testing coverage for categorical edge classes was referenced.
- [x] BVA conclusion is traceable to verified FR-12 inputs and specification.

Next skill: `EXEC-01`.
