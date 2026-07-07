# EXEC-01 - Domain Test Execution
**Feature:** FR-12 - Access Control  
**Date:** 2026-07-07  
**Skill:** EXEC-01  
**Status:** Completed

---

## Execution Summary

| Total | Passed | Failed | Not Executed |
|-------|--------|--------|--------------|
| 42 | 27 | 15 | 0 |

---

## Results

| TC ID | Expected | Actual | Status | Evidence |
|-------|----------|--------|--------|----------|
| DT-TC001 | Admin Login shown; Admin shell hidden | Admin Login shown; Admin shell hidden | PASS | screenshots/DT-TC001-after.png |
| DT-TC002 | Admin shell visible; adminToken stored | {"hasShell":true,"hasToken":true} | PASS | screenshots/DT-TC002-after.png |
| DT-TC003 | Normal User blocked; Admin shell hidden | alert=Bạn không phải là admin!; hasShell=false | PASS | screenshots/DT-TC003-after.png |
| DT-TC004 | Invalid credentials denied; Admin shell hidden | alert=Đăng nhập thất bại; hasToken=false; hasShell=false | PASS | screenshots/DT-TC004-after.png |
| DT-TC005 | Stored Admin token allows Admin shell | Admin shell visible | PASS | screenshots/DT-TC005-after.png |
| DT-TC006 | Stored Normal User token denied; Admin shell hidden | Admin shell visible | FAIL | screenshots/DT-TC006-after.png |
| DT-TC007 | Stored invalid token denied; Admin shell hidden | Admin shell hidden/login shown | PASS | screenshots/DT-TC007-after.png |
| DT-TC008 | Allowed 2xx protected-operation result | 200 array(4) | PASS |  |
| DT-TC009 | Access denied (401 or 403), protected data/action not exposed | 200 array(4) | FAIL |  |
| DT-TC010 | Access denied (401 or 403), protected data/action not exposed | 401 {"error":"Unauthorized"} | PASS |  |
| DT-TC011 | Access denied (401 or 403), protected data/action not exposed | 403 {"error":"Forbidden"} | PASS |  |
| DT-TC012 | Access denied (401 or 403), protected data/action not exposed | 200 array(4) | FAIL |  |
| DT-TC013 | Access denied (401 or 403), protected data/action not exposed | 401 {"error":"Unauthorized"} | PASS |  |
| DT-TC014 | Access denied (401 or 403), protected data/action not exposed | 403 {"error":"Forbidden"} | PASS |  |
| DT-TC015 | Allowed 2xx protected-operation result | 200 {"message":"User deleted"} | PASS |  |
| DT-TC016 | Access denied; user not deleted | 200 {"message":"User deleted"}; stillExists=false | FAIL |  |
| DT-TC017 | Allowed 2xx protected-operation result | 200 array(1) | PASS |  |
| DT-TC018 | Access denied (401 or 403), protected data/action not exposed | 401 {"error":"Unauthorized"} | PASS |  |
| DT-TC019 | Allowed 2xx protected-operation result | 200 {"message":"Order status updated"} | PASS |  |
| DT-TC020 | Access denied (401 or 403), protected data/action not exposed | 200 {"message":"Order status updated"} | FAIL |  |
| DT-TC021 | Allowed 2xx protected-operation result | 200 {"message":"Import hoàn tất: 1/1 sản phẩm được thêm","inserted":1,"errors":[]} | PASS |  |
| DT-TC022 | Access denied (401 or 403), protected data/action not exposed | 200 {"message":"Import hoàn tất: 1/1 sản phẩm được thêm","inserted":1,"errors":[]} | FAIL |  |
| DT-TC023 | Allowed 2xx protected-operation result | 200 {"message":"Product created","id":11} | PASS |  |
| DT-TC024 | Access denied (401 or 403), protected data/action not exposed | 200 {"message":"Product created","id":12} | FAIL |  |
| DT-TC025 | Allowed 2xx protected-operation result | 200 {"message":"Product updated"} | PASS |  |
| DT-TC026 | Access denied (401 or 403), protected data/action not exposed | 200 {"message":"Product deleted"} | FAIL |  |
| DT-TC027 | Allowed 2xx protected-operation result | 200 {"message":"Category created","id":4} | PASS |  |
| DT-TC028 | Access denied (401 or 403), protected data/action not exposed | 200 {"message":"Category created","id":5} | FAIL |  |
| DT-TC029 | Access denied (401 or 403), protected data/action not exposed | 401 {"error":"Unauthorized"} | PASS |  |
| DT-TC030 | Allowed 2xx protected-operation result | 200 array(5) | PASS |  |
| DT-TC031 | Access denied (401 or 403), protected data/action not exposed | 200 array(5) | FAIL |  |
| DT-TC032 | Access denied (401 or 403), protected data/action not exposed | 401 {"error":"Unauthorized"} | PASS |  |
| DT-TC033 | Allowed 2xx protected-operation result | 200 {"message":"Coupon created","id":6} | PASS |  |
| DT-TC034 | Access denied (401 or 403), protected data/action not exposed | 200 {"message":"Coupon created","id":7} | FAIL |  |
| DT-TC035 | Allowed 2xx protected-operation result | 200 {"message":"Coupon deleted"} | PASS |  |
| DT-TC036 | Access denied and no unauthorized coupon creation | 400 <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>SyntaxError: Expected property name or &#39;}&#39; in JSON at position 1<br> &nbsp; &nbsp;at JSON.parse (&lt;anonymous&gt;)<br> &nbsp; & | FAIL |  |
| DT-TC037 | No product update for non-numeric ID | 200 {"message":"Product updated"} | FAIL |  |
| DT-TC038 | No update for nonexistent product ID | 200 {"message":"Product updated"} | FAIL |  |
| DT-TC039 | No product created with missing required body | 200 {"message":"Product created","id":13} | FAIL |  |
| DT-TC040 | Public product list accessible without token | 200 array(12) | PASS |  |
| DT-TC041 | Public category list accessible | 200 array(6) | PASS |  |
| DT-TC042 | Unsupported method must not expose protected data | 404 <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot PATCH /api/admin/users</pre>
</body>
</html>
 | PASS |  |

---

## Failed Cases

- DT-TC006: expected Stored Normal User token denied; Admin shell hidden; actual Admin shell visible
- DT-TC009: expected Access denied (401 or 403), protected data/action not exposed; actual 200 array(4)
- DT-TC012: expected Access denied (401 or 403), protected data/action not exposed; actual 200 array(4)
- DT-TC016: expected Access denied; user not deleted; actual 200 {"message":"User deleted"}; stillExists=false
- DT-TC020: expected Access denied (401 or 403), protected data/action not exposed; actual 200 {"message":"Order status updated"}
- DT-TC022: expected Access denied (401 or 403), protected data/action not exposed; actual 200 {"message":"Import hoàn tất: 1/1 sản phẩm được thêm","inserted":1,"errors":[]}
- DT-TC024: expected Access denied (401 or 403), protected data/action not exposed; actual 200 {"message":"Product created","id":12}
- DT-TC026: expected Access denied (401 or 403), protected data/action not exposed; actual 200 {"message":"Product deleted"}
- DT-TC028: expected Access denied (401 or 403), protected data/action not exposed; actual 200 {"message":"Category created","id":5}
- DT-TC031: expected Access denied (401 or 403), protected data/action not exposed; actual 200 array(5)
- DT-TC034: expected Access denied (401 or 403), protected data/action not exposed; actual 200 {"message":"Coupon created","id":7}
- DT-TC036: expected Access denied and no unauthorized coupon creation; actual 400 <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>SyntaxError: Expected property name or &#39;}&#39; in JSON at position 1<br> &nbsp; &nbsp;at JSON.parse (&lt;anonymous&gt;)<br> &nbsp; &
- DT-TC037: expected No product update for non-numeric ID; actual 200 {"message":"Product updated"}
- DT-TC038: expected No update for nonexistent product ID; actual 200 {"message":"Product updated"}
- DT-TC039: expected No product created with missing required body; actual 200 {"message":"Product created","id":13}

---

## Evidence

- Raw execution results: `tests/FR12/execution-results.json`
- Execution script: `playwright/exec_fr12_dt.js`
- UI screenshots: `tests/FR12/screenshots/DT-TC001-after.png` through `DT-TC007-after.png`

---

## Notes

- Tests were executed black-box through the Admin UI and documented REST API endpoints.
- Denial was evaluated as HTTP 401 or 403 for API cases because FR-12 does not specify the exact denial status.
- Failed test cases should be verified and converted into bug reports in BUG-01.

Next skill: `BUG-01`.
