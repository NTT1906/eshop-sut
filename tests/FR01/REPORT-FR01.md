# Final Testing Report — FR-01: Account Registration

**Assignment:** HW02 — AI-First Domain Testing & Boundary Value Analysis  
**Feature ID:** FR-01  
**Feature:** Account Registration  
**Date:** 2026-07-07  
**AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking)  
**SUT:** EShop — http://localhost:5173

---

## Table of Contents

1. [Feature Overview](#1-feature-overview)
2. [Testing Environment](#2-testing-environment)
3. [Domain Testing Summary](#3-domain-testing-summary)
4. [Boundary Value Analysis Summary](#4-boundary-value-analysis-summary)
5. [Execution Results](#5-execution-results)
6. [Bug Reports](#6-bug-reports)
7. [AI Gap Analysis](#7-ai-gap-analysis)
8. [Conclusion](#8-conclusion)

---

## 1. Feature Overview

| Item | Detail |
|------|--------|
| Feature | Account Registration |
| Actor | Guest (unauthenticated user) |
| Entry Point | `http://localhost:5173/register` |
| API Endpoint | `POST http://localhost:3000/api/register` |
| Expected Success Response | HTTP 200 — `{"message": "User registered successfully", "id": <n>}` |

### Inputs

| Input | Variable | Required | Constraints (from UI) |
|-------|----------|----------|-----------------------|
| Họ Tên | `name` | Yes | Non-empty |
| Email | `email` | Yes | Valid email format; must be unique |
| Mật khẩu | `password` | Yes | ≥ 8 chars, uppercase, lowercase, digit, special char |

### Key Observations from DOM Inspection

- Email field uses `type="text"` — **no native browser email format validation**
- All fields have `maxlength = -1` — **no HTML-level length limits**
- All fields have `required = true` — browser blocks submission if blank

---

## 2. Testing Environment

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | http://localhost:5173 | ✅ Reachable |
| Backend | http://localhost:3000 | ✅ Reachable |
| Playwright | headless Chromium | ✅ Working |

**Evidence:** `tests/FR01/screenshots/ENV-register-page.png`

---

## 3. Domain Testing Summary

### Methodology

Technique: **Equivalence Partitioning / Domain Testing**  
Artifacts: DT-01 → DT-02 → DT-03 → DT-04 (each reviewed via REVIEW-01)

### Partitions Identified

| Variable | Valid Partitions | Invalid Partitions | Total |
|----------|----------------|-------------------|-------|
| `name` | 1 | 1 | 2 |
| `email` | 1 | 5 | 6 |
| `password` | 1 | 6 | 7 |
| **Total** | **3** | **12** | **15** |

### Test Cases

| TC ID | Scenario | Partitions Covered | Expected | Actual | Status |
|-------|----------|-------------------|----------|--------|--------|
| TC001 | All valid inputs | NAME-V1, EMAIL-V1, PASS-V1 | ✅ Registered | ❌ "Mật khẩu quá yếu!" | **FAIL** |
| TC002 | Empty name | NAME-I1 | ❌ Rejected | ❌ Browser tooltip | **PASS** |
| TC003 | Empty email | EMAIL-I1 | ❌ Rejected | ❌ Browser tooltip | **PASS** |
| TC004 | Email no `@` | EMAIL-I2 | ❌ Rejected (email error) | ❌ Password error shown | **FAIL** |
| TC005 | Email no domain | EMAIL-I3 | ❌ Rejected (email error) | ❌ Password error shown | **FAIL** |
| TC006 | Email no local part | EMAIL-I4 | ❌ Rejected (email error) | ❌ Password error shown | **FAIL** |
| TC007 | Duplicate email | EMAIL-I5 | ❌ Rejected (duplicate) | ❌ Password error shown | **FAIL** |
| TC008 | Empty password | PASS-I1 | ❌ Rejected | ❌ Browser `required` | **PASS** |
| TC009 | Password < 8 chars | PASS-I2 | ❌ Rejected | ❌ "Mật khẩu quá yếu!" | **PASS** |
| TC010 | No uppercase | PASS-I3 | ❌ Rejected | ❌ "Mật khẩu quá yếu!" | **PASS** |
| TC011 | No lowercase | PASS-I4 | ❌ Rejected | ❌ "Mật khẩu quá yếu!" | **PASS** |
| TC012 | No digit | PASS-I5 | ❌ Rejected | ❌ "Mật khẩu quá yếu!" | **PASS** |
| TC013 | No special char | PASS-I6 | ❌ Rejected | ❌ "Mật khẩu quá yếu!" | **PASS** |

**Domain Testing Result: 8 PASS / 5 FAIL**

---

## 4. Boundary Value Analysis Summary

### Applicable Variables

| Variable | Boundaries | Reason Included/Excluded |
|----------|-----------|--------------------------|
| `name` | None observable | ❌ Skipped |
| `email` | None observable | ❌ Skipped |
| `password` | Min = 8 chars (UI stated) | ✅ Applied |

### BVA Test Cases

| TC ID | Boundary | Value | Expected | Actual | Status |
|-------|---------|-------|----------|--------|--------|
| BVA-TC001 | min − 1 (7 chars) | `Pas1!Aa` | ❌ Rejected | ❌ Rejected | **PASS** |
| BVA-TC002 | min (8 chars) | `Pas1!Aab` | ✅ Accepted | ❌ Rejected | **FAIL** |
| BVA-TC003 | min + 1 (9 chars) | `Pas1!Aabc` | ✅ Accepted | ❌ Rejected | **FAIL** |

**BVA Result: 1 PASS / 2 FAIL**  
Both failures caused by BUG-001 — boundary correctness cannot be independently confirmed.

---

## 5. Execution Results

### Overall

| Phase | Total TCs | PASS | FAIL |
|-------|-----------|------|------|
| Domain Testing | 13 | 8 | 5 |
| BVA | 3 | 1 | 2 |
| **Total** | **16** | **9** | **7** |

### Notable Observations

1. **API never reached** — all validation is client-side. BUG-001 blocks every submission.
2. **Generic error message** — *"Mật khẩu quá yếu!"* is shown for all failures including invalid emails.
3. **Email field is `type="text"`** — no native browser email validation.

### Scripts

| Script | Purpose |
|--------|---------|
| `playwright/exec_fr01_dt.js` | Domain Testing execution (13 TCs) |
| `playwright/exec_fr01_bva.js` | BVA execution (3 TCs) |

---

## 6. Bug Reports

### BUG-001 — Critical

| Field | Value |
|-------|-------|
| **ID** | BUG-001 |
| **Title** | Valid password `Password1!` wrongly rejected as too weak |
| **Severity** | 🔴 Critical |
| **Impact** | Completely blocks all new user registrations |
| **Evidence** | `bugs/FR01/screenshots/TC001-after.png` |
| **File** | `bugs/FR01/BUG-001.md` |

**Description:** The client-side password validator rejects any password, including those that satisfy all 5 stated rules (length ≥ 8, uppercase, lowercase, digit, special character). The API is never called.

---

### BUG-002 — High

| Field | Value |
|-------|-------|
| **ID** | BUG-002 |
| **Title** | No email format validation on registration form |
| **Severity** | 🟠 High |
| **Impact** | Users can register with malformed email addresses |
| **Evidence** | `bugs/FR01/screenshots/TC004-after.png`, `TC005-after.png`, `TC006-after.png` |
| **File** | `bugs/FR01/BUG-002.md` |

**Description:** The email field uses `type="text"`. Invalid formats (`invalidemail`, `user@`, `@example.com`) are not rejected by the client. No custom JS validation is present.

---

### BUG-003 — High (Blocked)

| Field | Value |
|-------|-------|
| **ID** | BUG-003 |
| **Title** | Duplicate email registration not detected |
| **Severity** | 🟠 High |
| **Status** | Blocked — requires BUG-001 fix to confirm |
| **Evidence** | `bugs/FR01/screenshots/TC007-after.png` |
| **File** | `bugs/FR01/BUG-003.md` |

**Description:** When a previously-registered email is submitted again, no duplicate-detection error appears. Masked by BUG-001 — API never reached.

---

## 7. AI Gap Analysis

Full analysis in `tests/FR01/GAP-01-gap-analysis.md`.

| Category | Result |
|---------|--------|
| Missing confirmed test cases | 0 |
| Hallucinated requirements | 0 |
| Incorrect expected results | 0 |
| Reasoning errors | 0 |
| Candidate gaps (pending human review) | 3 (whitespace name, whitespace password, email leading space) |

**Overall AI quality:** High. All rules were grounded in observable evidence. Assumptions were flagged explicitly. BUG-001 masking was correctly identified without assuming implementation details.

---

## 8. Conclusion

### Feature Status: ❌ BROKEN

The Account Registration feature (FR-01) is currently **non-functional** due to BUG-001. No user can successfully register via the UI.

### Recommended Priority

| Priority | Action |
|---------|--------|
| 1 | Fix BUG-001 (password validator logic) |
| 2 | Fix BUG-002 (add email format validation) |
| 3 | Re-test TC001 and TC007 after BUG-001 fix |
| 4 | Re-test BVA-TC002 and BVA-TC003 to confirm boundary behaviour |
| 5 | Verify BUG-003 (duplicate email) after BUG-001 fix |

### Artifacts Index

| Artifact | Path |
|---------|------|
| ENV-01 | `tests/FR01/ENV-01.md` |
| DT-01 Feature Understanding | `tests/FR01/DT-01-feature-understanding.md` |
| REVIEW-01 of DT-01 | `tests/FR01/REVIEW-01-of-DT-01.md` |
| DT-02 Domain Identification | `tests/FR01/DT-02-domain-identification.md` |
| REVIEW-01 of DT-02 | `tests/FR01/REVIEW-01-of-DT-02.md` |
| DT-03 Domain Partitioning | `tests/FR01/DT-03-domain-partitioning.md` |
| REVIEW-01 of DT-03 | `tests/FR01/REVIEW-01-of-DT-03.md` |
| DT-04 Test Cases | `tests/FR01/DT-04-test-cases.md` |
| EXEC-01 (Domain Testing) | `tests/FR01/execution.md` |
| BVA-01 Boundary Analysis | `tests/FR01/BVA-01-boundary-analysis.md` |
| EXEC-01 (BVA) | `tests/FR01/execution-bva.md` |
| GAP-01 Gap Analysis | `tests/FR01/GAP-01-gap-analysis.md` |
| BUG-001 | `bugs/FR01/BUG-001.md` |
| BUG-002 | `bugs/FR01/BUG-002.md` |
| BUG-003 | `bugs/FR01/BUG-003.md` |
