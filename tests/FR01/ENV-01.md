# ENV-01 — Testing Environment Report
**Feature:** FR-01 — Account Registration  
**Date:** 2026-07-07  
**AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking)

---

## Environment Status

| Component | URL | Status |
|-----------|-----|--------|
| Backend API | http://localhost:3000 | ✅ Reachable (HTTP 404 on root — expected, API routes are under `/api/`) |
| Frontend Web | http://localhost:5173 | ✅ Reachable (HTTP 200) |
| Registration Page | http://localhost:5173/register | ✅ Accessible |

## Playwright Setup

| Item | Status |
|------|--------|
| Playwright installed | ✅ (`playwright/node_modules` present) |
| Screenshot capture | ✅ Working |

## Directory Structure Created

```
tests/
└── FR01/
    ├── testcases/
    ├── scripts/
    ├── screenshots/
    │   ├── ENV-register-page.png   ✅
    │   └── ENV-homepage.png        ✅
    └── ENV-01.md

bugs/
└── FR01/
    └── screenshots/
```

## Screenshots

- `tests/FR01/screenshots/ENV-register-page.png` — Registration page (http://localhost:5173/register)
- `tests/FR01/screenshots/ENV-homepage.png` — Homepage (http://localhost:5173/)

## Notes

- The SUT is treated as a **black-box**. No implementation details are assumed.
- All interactions will go through the frontend UI and/or the documented API endpoints.
- Backend base URL: `http://localhost:3000`
- Frontend base URL: `http://localhost:5173`
