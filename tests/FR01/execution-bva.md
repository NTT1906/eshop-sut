# EXEC-01 (BVA) — BVA Test Execution Report
**Feature:** FR-01 — Account Registration  
**Date:** 2026-07-07  
**Skill:** EXEC-01 (second pass — BVA test cases)  
**Script:** `playwright/exec_fr01_bva.js`  
**SUT:** http://localhost:5173/register

---

## Results

| TC ID | Boundary | Password | Expected | Actual | Status |
|-------|---------|----------|----------|--------|--------|
| BVA-TC001 | min − 1 (7 chars) | `Pas1!Aa` | ❌ Rejected — too short | ❌ Rejected — *"Mật khẩu quá yếu!"* | **PASS** *(correct rejection, but for wrong reasons — see note)* |
| BVA-TC002 | min (8 chars) | `Pas1!Aab` | ✅ Accepted | ❌ Rejected — *"Mật khẩu quá yếu!"* | **FAIL** 🐛 |
| BVA-TC003 | min + 1 (9 chars) | `Pas1!Aabc` | ✅ Accepted | ❌ Rejected — *"Mật khẩu quá yếu!"* | **FAIL** 🐛 |

---

## Analysis

### BVA-TC001 — Result: PASS (outcome correct, root cause unclear)

`Pas1!Aa` (7 chars) is correctly rejected. However, this is due to **BUG-001** (the password validator rejects any password), not necessarily the length rule working correctly. The rejection is correct but cannot be attributed to the length check functioning properly.

### BVA-TC002 — Result: FAIL

`Pas1!Aab` (exactly 8 characters, satisfying all rules) is **wrongly rejected** with *"Mật khẩu quá yếu!"*. This is a direct extension of BUG-001 — the password strength validator fails at the minimum boundary itself.

### BVA-TC003 — Result: FAIL

`Pas1!Aabc` (9 characters, satisfying all rules) is **wrongly rejected**. Same root cause as BUG-001.

### Root Cause Hypothesis (from black-box observation)

The password validator shows the same generic error *"Mật khẩu quá yếu!"* for:
- TC001: `Password1!` (10 chars, contains `!`)
- BVA-TC002: `Pas1!Aab` (8 chars, contains `!`)
- BVA-TC003: `Pas1!Aabc` (9 chars, contains `!`)

All three contain the `!` character. Passwords without `!` (e.g., TC010–TC013 which use `!` too, but TC009 `Pass1!` 7 chars also fails)...

Observing that ALL passwords with `!` are rejected and the error message says all rules are violated even when they are met, the validator regex or character classification logic appears to have a defect. This is a pre-existing BUG-001.

**No new bug is raised** — BVA results are explained by the existing BUG-001.

---

## Summary

| Result | Count | TCs |
|--------|-------|-----|
| ✅ PASS | 1 | BVA-TC001 *(correct outcome, root cause uncertain)* |
| ❌ FAIL | 2 | BVA-TC002, BVA-TC003 |

**New bugs found:** 0 (both failures are symptoms of BUG-001)

---

## Screenshot Evidence

| TC | After Submit |
|----|-------------|
| BVA-TC001 | `screenshots/BVA-TC001-after.png` |
| BVA-TC002 | `screenshots/BVA-TC002-after.png` |
| BVA-TC003 | `screenshots/BVA-TC003-after.png` |
