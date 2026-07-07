# ENV-01 - Testing Environment
**Feature:** FR-20 - Mobile App - Shopping Cart  
**Date:** 2026-07-07  
**Skill:** ENV-01  
**Status:** Completed

---

## Existing Artifact Check

Existing FR20 Mobile Cart evidence was found before execution:

- `tests/FR20_MobileCart/screenshots/cart_ui_empty.jpg`
- `tests/FR20_MobileCart/screenshots/cart_ui_populated.jpg`

No existing FR20 Mobile Cart workflow artifacts were found before this ENV-01 step.

> Note: the user prompt referenced `eshop-sut/tests/FR20_Carts/screenshots/`, but the available files in the current workspace are under `eshop-sut/tests/FR20_MobileCart/screenshots/`.

---

## Environment Availability

| Component | URL / Path / Command | Result |
|-----------|----------------------|--------|
| Backend API from host | `http://localhost:3000/api/categories` | Reachable, HTTP 200 |
| Mobile app source | `frontend-mobile/App.js` | Available |
| Mobile app API base URL | `http://192.168.1.8:3000/api` | Configured in `frontend-mobile/App.js` |
| Expo emulator | Manual tester responsibility | Evidence provided through screenshots |
| UI automation | Playwright/browser automation | Not used, per mobile skill instructions |

---

## Evidence Captured / Reused

| Evidence | Path |
|----------|------|
| Empty cart screenshot | `tests/FR20_MobileCart/screenshots/cart_ui_empty.jpg` |
| Populated cart screenshot | `tests/FR20_MobileCart/screenshots/cart_ui_populated.jpg` |
| Captured UI/API state summary | `tests/FR20_MobileCart/ENV-01-ui-state.json` |
| Mobile app implementation reference | `frontend-mobile/App.js` |
| Feature input artifact | `FEATURE_INPUT_FR20_CART.md` at workspace root; same content embedded in `WORKFLOW.md` |

---

## Mobile Testing Constraint

Per `SKILLS_mobile.md`, this feature must be tested with a hybrid approach:

- API behavior may be tested with Node.js `fetch`, axios, or cURL.
- Native mobile UI behavior must be executed manually on the Expo emulator.
- Browser Playwright UI scripts must not be generated for this mobile feature.
- Manual screenshot filenames provided by the human tester will be referenced as UI evidence.

---

## Observable UI Findings From Screenshots

### Empty Cart State

Screenshot: `tests/FR20_MobileCart/screenshots/cart_ui_empty.jpg`

| Observable Item | Value |
|-----------------|-------|
| Screen title | `Giỏ Hàng` |
| Cart count in header | `Giỏ (0)` |
| Empty message | `Giỏ hàng của bạn đang trống` |
| Visible action | `Tiếp tục mua sắm` |

### Populated Cart State

Screenshot: `tests/FR20_MobileCart/screenshots/cart_ui_populated.jpg`

| Observable Item | Value |
|-----------------|-------|
| Screen title | `Giỏ Hàng` |
| Cart count in header | `Giỏ (2)` |
| Product rows visible | 2 |
| Row controls | Quantity input and `Xóa` action per item |
| Cart total | `Tổng tạm tính: 58.000.000 đ` |
| Visible actions | `← Mua tiếp`, `Tiến hành thanh toán` |

Visible cart row examples:

| Product | Price | Quantity | Line Total |
|---------|-------|----------|------------|
| iPhone 15 Pro Max | `30.000.000 đ` | `1` | `30.000.000 đ` |
| Samsung Galaxy S24 Ultra | `28.000.000 đ` | `1` | `28.000.000 đ` |

---

## Observable Implementation Findings

These findings come from reading the mobile app source to understand externally observable UI behavior; later testing should still treat the SUT as black-box where possible.

| Behavior | Evidence |
|----------|----------|
| Product list has `Thêm vào giỏ` button with default quantity `1`. | `frontend-mobile/App.js` product card UI. |
| Product detail has numeric `Số lượng` input and `Thêm vào giỏ hàng` button. | `frontend-mobile/App.js` product detail UI. |
| Cart quantity input is editable per cart row. | `frontend-mobile/App.js` cart UI. |
| Cart row has `Xóa` action. | `frontend-mobile/App.js` cart UI. |
| Populated cart has `← Mua tiếp` and `Tiến hành thanh toán` actions. | `frontend-mobile/App.js` cart UI and screenshot. |
| Empty cart has `Tiếp tục mua sắm` action. | `frontend-mobile/App.js` cart UI and screenshot. |
| Cart state is maintained in mobile app state. | `frontend-mobile/App.js` `cart` state. |
| API specification defines authenticated `GET /api/cart` and `POST /api/cart`. | `api_specification.md`. |

---

## Related API Availability

| API | ENV Status |
|-----|------------|
| `POST /api/login` | Not executed in ENV-01; available per API specification. |
| `GET /api/products` | Not directly executed in ENV-01; product catalog is available through app source and screenshots. |
| `GET /api/products/:id` | Not executed in ENV-01; available per API specification. |
| `GET /api/cart` | Not executed in ENV-01; available per API specification and requires Authorization. |
| `POST /api/cart` | Not executed in ENV-01; available per API specification and requires Authorization. |

---

## Notes

- No Playwright browser UI script was created.
- The provided screenshot files are native mobile UI evidence.
- Future `EXEC-01` should provide API-level scripts where useful and ask the human tester to execute corresponding UI steps on the Expo emulator.
- The mobile app API base URL is not `localhost`; emulator/network setup must allow access to `192.168.1.8:3000` or be adjusted before manual execution.

---

## Human Review Checklist

- [x] Mobile skill instructions loaded.
- [x] Workflow sequence loaded.
- [x] Existing FR20 Mobile Cart evidence checked.
- [x] Backend host API reachability checked.
- [x] Manual mobile screenshot evidence referenced.
- [x] Browser Playwright UI automation avoided.
- [x] Environment limitations documented.

Next skill: `DT-01`.
