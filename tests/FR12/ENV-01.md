# ENV-01 - Testing Environment
**Feature:** FR-12 - Access Control  
**Date:** 2026-07-07  
**Skill:** ENV-01  
**Status:** Completed

---

## Existing Artifact Check

No existing FR-12 artifacts were found before execution:

- `tests/FR12/` did not exist.
- `bugs/FR12/` did not exist.

The ENV-01 run created the FR-12 artifact folders.

---

## Environment Availability

| Component | URL / Command | Result |
|-----------|---------------|--------|
| Backend API | `http://localhost:3000` | Running after starting `node server.js` |
| Frontend admin app | `http://localhost:5174/` | Running after starting `npm run dev` |
| Frontend web app | `http://localhost:5173/` | Running after starting `npm run dev` |
| Playwright | `node env_check_fr12.js` | Executed successfully outside the sandbox |

> Note: initial localhost checks failed because the SUT was not running. Backend, web frontend, and admin frontend were started before collecting ENV-01 evidence.

---

## Evidence Captured

| Evidence | Path |
|----------|------|
| Admin Login screen screenshot | `tests/FR12/screenshots/ENV-admin-login.png` |
| Normal User blocked by Admin UI screenshot | `tests/FR12/screenshots/ENV-normal-user-blocked.png` |
| Admin Users tab screenshot | `tests/FR12/screenshots/ENV-admin-users.png` |
| Captured UI/API state | `tests/FR12/ENV-01-ui-state.json` |
| Playwright environment script | `playwright/env_check_fr12.js` |

---

## Black-Box Setup Action

Test data and sessions were prepared through public APIs and implemented UI flows.

| Setup Item | Result |
|------------|--------|
| Normal User account | Created through `POST /api/register` |
| Normal User login | HTTP 200, role observed as `user` |
| Admin login | HTTP 200, role observed as `admin` |
| Admin UI login with Normal User | Blocked by UI alert: `Bạn không phải là admin!` |
| Admin UI login with Admin | Allowed; admin shell and Users tab visible |

Test accounts from ENV run:

| Account Type | Email |
|--------------|-------|
| Admin | `admin@eshop.com` |
| Normal User | `fr12.env.1783432897442@example.com` |

---

## Observable UI Findings

### Admin Login Screen

| Control | Type | Required | Related Input |
|---------|------|----------|---------------|
| Email | Text input | Not specified in UI attributes | `email` |
| Password | Password input | Not specified in UI attributes | `password` |
| Login | Submit button | N/A | `loginSubmit` |

### Normal User Access Attempt

| Actor | Attempt | Observable Result |
|-------|---------|-------------------|
| Normal User | Login through Admin UI | Alert shown: `Bạn không phải là admin!`; admin shell not entered |

### Admin Access Attempt

| Actor | Attempt | Observable Result |
|-------|---------|-------------------|
| Admin | Login through Admin UI | Admin shell visible; `localStorage.adminToken` present; Users tab visible |

Observed Admin navigation after successful login:

| Visible Admin Area |
|--------------------|
| Dashboard |
| Danh mục |
| Sản phẩm |
| Mã Giảm Giá |
| Đơn hàng |
| Người dùng |
| Đăng xuất |

---

## API Access Snapshot

Endpoint checked during ENV setup: `GET /api/admin/users`

| Authorization State | HTTP Status | Observable Result |
|---------------------|-------------|-------------------|
| No token | 401 | `{"error":"Unauthorized"}` |
| Valid Normal User token | 200 | User list returned |
| Valid Admin token | 200 | User list returned |

> This snapshot is environment evidence only. The Normal User API result appears relevant for later Domain Testing and BUG-01 review because FR-12 requires Admin role checks for `/api/admin/*`.

---

## Notes

- Screenshots were generated from the running local SUT; no screenshots were fabricated.
- The first Playwright/API run failed inside the sandbox due to localhost connection restrictions (`EPERM`). The same script succeeded outside the sandbox.
- ENV-01 did not generate domain partitions or final test cases. It only verified environment readiness and captured observable FR-12 access-control evidence.

---

## Human Review Checklist

- [x] Existing FR-12 artifacts checked.
- [x] Backend API reachable after startup.
- [x] Admin frontend reachable after startup.
- [x] Web frontend reachable after startup.
- [x] Fresh FR-12 screenshots captured.
- [x] UI/API state recorded for later Domain Testing steps.
- [x] Environment limitations and notable observations documented.
