# BUG-001 - Cart API Accepts Wrong Authorization Scheme

## Title

`GET /api/cart` accepts `Authorization: Basic <valid JWT>` instead of requiring `Bearer <token>`

## Environment

- Feature: FR-20 - Mobile App - Shopping Cart
- Backend: Node.js API at `http://localhost:3000/api`
- Execution mode: API-level Node.js `fetch`
- Test case: `DT-TC004`
- Evidence:
  - `tests/FR20_MobileCart/scripts/exec_fr20_cart_dt_api.js`
  - `tests/FR20_MobileCart/execution-api-results.json`

## Preconditions

- Backend server is running.
- Registered user exists and has a valid JWT.
- A request is made to an authenticated cart endpoint.

## Steps to Reproduce

1. Register or log in as a normal user.
2. Copy the returned JWT token.
3. Send:

```http
GET /api/cart
Authorization: Basic <valid JWT>
```

## Expected Result

The request should be rejected because the API specification requires:

```text
Authorization: Bearer <token>
```

Expected status: `401` or `403`.

## Actual Result

The request was accepted.

Observed result from `DT-TC004`:

```text
HTTP 200
body=[]
```

## Severity

High

## Impact

The backend does not strictly enforce the documented Authorization scheme. Any client that sends a valid JWT with the wrong scheme can still access authenticated cart data.

## Screenshot

Not applicable. This is an API-level defect.

