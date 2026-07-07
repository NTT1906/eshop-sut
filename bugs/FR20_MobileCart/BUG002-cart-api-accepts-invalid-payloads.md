# BUG-002 - Cart API Stores Invalid Cart Item Payloads

## Title

`POST /api/cart` accepts missing, malformed, inconsistent, and invalid cart item fields

## Environment

- Feature: FR-20 - Mobile App - Shopping Cart
- Backend: Node.js API at `http://localhost:3000/api`
- Execution mode: API-level Node.js `fetch`
- Test cases: `DT-TC007` through `DT-TC025`
- Boundary evidence: `BVA-TC001`, `BVA-TC005`, `BVA-TC009`
- Evidence:
  - `tests/FR20_MobileCart/scripts/exec_fr20_cart_dt_api.js`
  - `tests/FR20_MobileCart/execution-api-results.json`

## Preconditions

- Backend server is running.
- Registered user has a valid JWT.
- At least one product exists in the catalog.

## Steps to Reproduce

1. Log in as a normal user and obtain a JWT token.
2. Send `POST /api/cart` with `Authorization: Bearer <valid token>`.
3. Use any invalid payload, for example:

```json
{
  "id": 1,
  "name": "iPhone 15 Pro Max",
  "price": 30000000,
  "quantity": 0
}
```

Other failing representatives from execution:

- Missing `id`
- `id: "abc"`
- `id: 999999`
- Missing or empty `name`
- `name: 12345`
- Product ID `1` with mismatched product name
- Missing `price`
- `price: "abc"`
- `price: 0`
- `price: -100000`
- Product ID `1` with mismatched product price
- Missing `quantity`
- `quantity: "abc"`
- `quantity: -1`
- `quantity: 1.5`
- `quantity: 999999999`

## Expected Result

The API should reject invalid cart item payloads or normalize them safely without adding inconsistent data to the cart.

At minimum:

- Product ID must identify an existing product.
- Product name and price should match the catalog or be derived from the catalog.
- Price must be a valid positive numeric amount.
- Quantity must be a positive whole number within a practical range.
- Missing required fields must not be stored.

## Actual Result

Every invalid payload tested returned HTTP `200` with:

```json
{"message":"Added to cart"}
```

The cart length increased after every invalid request. The final cart contained invalid entries such as:

```json
{"id":0,"name":"iPhone 15 Pro Max","price":30000000,"quantity":1}
{"id":1,"name":"iPhone 15 Pro Max","price":-100000,"quantity":1}
{"id":1,"name":"iPhone 15 Pro Max","price":30000000,"quantity":0}
{"id":1,"name":"iPhone 15 Pro Max","price":30000000,"quantity":-1}
{"id":1,"name":"iPhone 15 Pro Max","price":30000000,"quantity":999999999}
```

BVA confirmation:

- `id: 0` was accepted in `BVA-TC001`.
- `quantity: 0` was accepted in `BVA-TC005`.
- `price: 0` was accepted in `BVA-TC009`.

## Severity

Critical

## Impact

Invalid cart data can be stored by authenticated users. This can corrupt cart totals, allow impossible quantities, allow negative or zero prices, and create product records that do not match the product catalog.

## Screenshot

Not applicable. This is an API-level defect.
