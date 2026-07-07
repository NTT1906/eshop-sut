# BVA-01 — Boundary Value Analysis
**Feature:** FR-01 — Account Registration  
**Date:** 2026-07-07  
**Skill:** BVA-01  
**Input:** Verified DT-02 domain identification + DOM inspection results

---

## Variable Assessment

| Variable | Has Explicit Boundary? | BVA Applicable? | Reason |
|----------|----------------------|-----------------|--------|
| `name` | No | ❌ Skip | No min/max length or format constraint observable in UI or HTML (`maxlength=-1`, `minlength=-1`, no hint text) |
| `email` | No | ❌ Skip | No length or format boundary observable in UI or HTML (`maxlength=-1`, no HTML type enforcement) |
| `password` | **Yes** | ✅ Apply | UI explicitly states **minimum 8 characters** — a concrete, testable lower bound |

---

## Variable: `password` — Length Boundary

### Boundary Identification

| Boundary Point | Value | Notes |
|---------------|-------|-------|
| Min − 1 | 7 characters | Just below minimum — invalid |
| Min (lower bound) | 8 characters | Exactly at minimum — valid (if all other rules also met) |
| Min + 1 (nominal) | 9 characters | Just above minimum — valid |
| Max − 1 | Not applicable | No maximum defined |
| Max | Not applicable | No maximum defined |
| Max + 1 | Not applicable | No maximum defined |

> **Note:** No upper bound is stated in the UI or API specification. BVA is therefore limited to the lower boundary.

### Strategy for Boundary Tests

Each boundary test value must satisfy **all other password rules** (uppercase, lowercase, digit, special character) so that the only variable being tested is the **length**. This isolates the length boundary from other validation rules.

| Boundary | Length | Test Value | Rule Coverage |
|---------|--------|-----------|---------------|
| Min − 1 | 7 | `Pas1!Aa` | upper ✅ P,A; lower ✅ a,s,a; digit ✅ 1; special ✅ !; length ❌ 7 |
| Min | 8 | `Pas1!Aab` | upper ✅ P,A; lower ✅ a,s,b; digit ✅ 1; special ✅ !; length ✅ 8 |
| Min + 1 | 9 | `Pas1!Aabc` | upper ✅ P,A; lower ✅ a,s,b,c; digit ✅ 1; special ✅ !; length ✅ 9 |

---

## BVA Test Cases

### BVA-TC001 — Password at Min − 1 (7 chars)

| Field | Value |
|-------|-------|
| `name` | `Nguyen Van BVA1` |
| `email` | `bva01@example.com` |
| `password` | `Pas1!Aa` *(7 chars: upper ✅, lower ✅, digit ✅, special ✅, length ❌)* |

| Attribute | Detail |
|-----------|--------|
| **TC ID** | BVA-TC001 |
| **Boundary** | password length = min − 1 (7) |
| **Expected** | Registration rejected — password too short |

---

### BVA-TC002 — Password at Min (exactly 8 chars)

| Field | Value |
|-------|-------|
| `name` | `Nguyen Van BVA2` |
| `email` | `bva02@example.com` |
| `password` | `Pas1!Aab` *(8 chars: upper ✅, lower ✅, digit ✅, special ✅, length ✅)* |

| Attribute | Detail |
|-----------|--------|
| **TC ID** | BVA-TC002 |
| **Boundary** | password length = min (8) |
| **Expected** | Registration accepted — all rules satisfied at boundary |

---

### BVA-TC003 — Password at Min + 1 (9 chars)

| Field | Value |
|-------|-------|
| `name` | `Nguyen Van BVA3` |
| `email` | `bva03@example.com` |
| `password` | `Pas1!Aabc` *(9 chars: upper ✅, lower ✅, digit ✅, special ✅, length ✅)* |

| Attribute | Detail |
|-----------|--------|
| **TC ID** | BVA-TC003 |
| **Boundary** | password length = min + 1 (9) |
| **Expected** | Registration accepted — above minimum boundary |

---

## BVA Coverage Summary

| Variable | Boundary | Test Value | TC | Expected |
|----------|---------|-----------|-----|---------|
| `password` | min − 1 (7 chars) | `Pas1!Aa` | BVA-TC001 | ❌ Rejected |
| `password` | min (8 chars) | `Pas1!Aab` | BVA-TC002 | ✅ Accepted |
| `password` | min + 1 (9 chars) | `Pas1!Aabc` | BVA-TC003 | ✅ Accepted |
| `name` | — | — | Skipped | No boundaries |
| `email` | — | — | Skipped | No boundaries |

---

## Human Review Checklist

- [x] Every boundary identified
- [x] Invalid boundaries included
- [x] Nominal value selected correctly
