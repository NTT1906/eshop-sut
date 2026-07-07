# ENV-01 - Testing Environment
**Feature:** FR-10 - Order State Machine  
**Date:** 2026-07-07  
**Skill:** ENV-01  
**Status:** Completed

---

## Existing Artifact Check

No existing FR-10 artifacts were found before execution:

- `tests/FR10/` did not exist.
- `bugs/FR10/` did not exist.

---

## Environment Availability

| Component | URL / Command | Result |
|-----------|---------------|--------|
| Frontend web app | `http://localhost:5173/profile` | Reachable, HTTP 200 |
| Frontend admin app | `http://localhost:5174/` | Reachable, HTTP 200 |
| Backend API | `http://localhost:3000/api/categories` | Reachable, HTTP 200 |
| Playwright | `node env_check_fr10.js` | Executed successfully outside the sandbox |

---

## Evidence Captured

| Evidence | Path |
|----------|------|
| Registered user order history screenshot | `tests/FR10/screenshots/ENV-registered-user-orders.png` |
| Admin order management screenshot | `tests/FR10/screenshots/ENV-admin-orders.png` |
| Captured UI state | `tests/FR10/ENV-01-ui-state.json` |
| Playwright environment script | `playwright/env_check_fr10.js` |

---

## Black-Box Setup Action

Test data was prepared through public/authenticated APIs:

| Setup Item | Result |
|------------|--------|
| Registered test user | Created through `POST /api/register` |
| Registered user login | HTTP 200 |
| Admin login | HTTP 200 using seeded admin account |
| Orders created | 5 orders in successful ENV run |
| Statuses prepared | `pending`, `confirmed`, `shipping`, `canceled`, `delivered` |

> Note: The first Playwright run failed after creating an initial set of orders because the admin navigation selector matched more than one element. The successful rerun created a second complete set. The captured admin table therefore includes two FR-10 data sets, while the registered-user screenshot uses the successful run's logged-in user and shows the second set.

---

## Observable Registered User UI Findings

Page: `http://localhost:5173/profile`

| Current Status | Visible Label | Visible Action Buttons |
|----------------|---------------|------------------------|
| `pending` | Chờ xác nhận | `Hủy đơn` |
| `confirmed` | Đã xác nhận | `Hủy đơn` |
| `shipping` | Đang giao | `Hủy đơn` |
| `canceled` | Đã hủy | None |
| `delivered` | Đã giao | None |

Registered user order-history controls observed:

| Control | Type | Related API |
|---------|------|-------------|
| `Hủy đơn` | Button | `PUT /api/orders/:id/cancel` |

---

## Observable Admin UI Findings

Page: `http://localhost:5174/`, admin `Đơn hàng` tab

| Current Status | Visible Label | Visible Action Buttons | Target Status Sent |
|----------------|---------------|------------------------|--------------------|
| `pending` | Chờ xác nhận | `Xác nhận`, `Hủy` | `confirmed`, `canceled` |
| `confirmed` | Đã xác nhận | `Giao hàng`, `Hủy` | `shipping`, `canceled` |
| `shipping` | Đang giao | `Hoàn thành` | `delivered` |
| `canceled` | Đã hủy | `Đánh dấu Đã giao` | `delivered` |
| `delivered` | Đã giao | None | N/A |

Admin order-state controls observed:

| Control | Type | Related API |
|---------|------|-------------|
| `Xác nhận` | Button | `PUT /api/admin/orders/:id/status` |
| `Hủy` | Button | `PUT /api/admin/orders/:id/status` |
| `Giao hàng` | Button | `PUT /api/admin/orders/:id/status` |
| `Hoàn thành` | Button | `PUT /api/admin/orders/:id/status` |
| `Đánh dấu Đã giao` | Button | `PUT /api/admin/orders/:id/status` |

---

## Test Data From Successful ENV Run

| Order ID | Prepared Status | Actor UI Evidence |
|----------|-----------------|-------------------|
| `#6` | `pending` | Registered user and admin |
| `#7` | `confirmed` | Registered user and admin |
| `#8` | `shipping` | Registered user and admin |
| `#9` | `canceled` | Registered user and admin |
| `#10` | `delivered` | Registered user and admin |

---

## Notes

- Screenshots were generated from the running local SUT; no screenshots were fabricated.
- Admin credentials were taken from the seeded SUT account: `admin@eshop.com` / `Admin123!`.
- ENV-01 did not execute state-transition assertions. It only prepared and captured evidence for later Domain Testing steps.

---

## Human Review Checklist

- [x] Local web frontend was reachable.
- [x] Local admin frontend was reachable.
- [x] Local backend was reachable.
- [x] Fresh FR-10 registered-user screenshot captured.
- [x] Fresh FR-10 admin screenshot captured.
- [x] UI state recorded for later Domain Testing steps.
- [x] Environment limitations and setup notes documented.
