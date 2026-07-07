# DT-02 — Domain Identification
**Feature:** FR-01 — Account Registration  
**Date:** 2026-07-07  
**Skill:** DT-02  
**Input:** Verified DT-01 output + live DOM inspection (`playwright/inspect_fields.js`)

---

## DOM Inspection Findings

Collected from `node inspect_fields.js` against `http://localhost:5173/register`:

| Field (by position) | DOM type | maxlength | minlength | required |
|---------------------|----------|-----------|-----------|---------|
| Input 1 — Họ Tên (`name`) | `text` | -1 (none) | -1 (none) | `true` |
| Input 2 — Email (`email`) | `text` ⚠️ | -1 (none) | -1 (none) | `true` |
| Input 3 — Mật khẩu (`password`) | `password` | -1 (none) | -1 (none) | `true` |

> ⚠️ **Notable:** The Email field uses `type="text"`, not `type="email"`. This means the browser does NOT enforce email format natively. Format validation (if any) must be handled by client-side JS or the backend API.

> **No HTML `maxlength` or `minlength` constraints on any field.** Any length constraints must be enforced by client JS or the backend.

---

## Domain Table

### Variable 1: `name` (Họ Tên)

| Attribute | Value | Evidence |
|-----------|-------|----------|
| Data Type | String | DOM `type="text"` |
| Required | Yes | DOM `required=true`; WORKFLOW spec |
| Min length | Not specified in UI/HTML | DOM minlength=-1; no UI hint |
| Max length | Not specified in UI/HTML | DOM maxlength=-1; no UI hint |
| Format constraint | None observable | No pattern attribute, no UI hint |

| Domain | Type | Description |
|--------|------|-------------|
| Non-empty string (valid) | Valid | Any non-empty string value |
| Empty string | Invalid | Blank — required field |

> **Note:** Without observable max-length or format rules for `name`, only the empty/non-empty boundary is confirmed. No further partitioning is evidence-supported.

---

### Variable 2: `email` (Email)

| Attribute | Value | Evidence |
|-----------|-------|----------|
| Data Type | String | DOM `type="text"` (not `type="email"`) |
| Required | Yes | DOM `required=true`; WORKFLOW spec |
| Format constraint | Standard email format (user@domain.tld) expected | WORKFLOW spec calls it `String (Email)`; api_specification.md uses example `test@domain.com` |
| Uniqueness | Must be unique in the system | Assumption A-04; to be confirmed in EXEC-01 |
| Min length | Not specified | DOM minlength=-1 |
| Max length | Not specified | DOM maxlength=-1 |

| Domain | Type | Description |
|--------|------|-------------|
| Valid email format, not yet registered | Valid | e.g. `test@domain.com` |
| Empty string | Invalid | Blank — required field |
| Invalid email format (no `@`) | Invalid | e.g. `notanemail` |
| Invalid email format (no domain) | Invalid | e.g. `user@` |
| Invalid email format (no local part) | Invalid | e.g. `@domain.com` |
| Already-registered email (duplicate) | Invalid | Same email as an existing account (assumption; needs execution confirmation) |

---

### Variable 3: `password` (Mật khẩu)

| Attribute | Value | Evidence |
|-----------|-------|----------|
| Data Type | Password string | DOM `type="password"` |
| Required | Yes | DOM `required=true`; WORKFLOW spec |
| Min length | 8 characters | UI hint: *"Tối thiểu 8 ký tự"* |
| Max length | Not specified | DOM maxlength=-1; no UI hint |
| Uppercase | Required | UI hint: *"có chữ hoa"* |
| Lowercase | Required | UI hint: *"chữ thường"* |
| Digit | Required | UI hint: *"số"* |
| Special character | Required | UI hint: *"ký tự đặc biệt"* |

| Domain | Type | Description |
|--------|------|-------------|
| Meets all 5 rules (≥8, upper, lower, digit, special) | Valid | e.g. `Password1!` |
| Empty string | Invalid | Blank — required field |
| Too short (< 8 chars), but meets all other rules | Invalid | e.g. `Pass1!` (7 chars) |
| ≥ 8 chars but missing uppercase | Invalid | e.g. `password1!` |
| ≥ 8 chars but missing lowercase | Invalid | e.g. `PASSWORD1!` |
| ≥ 8 chars but missing digit | Invalid | e.g. `Password!!` |
| ≥ 8 chars but missing special character | Invalid | e.g. `Password1` |

---

## Dependency Analysis

| Dependency | Description |
|-----------|-------------|
| `email` uniqueness | Behaviour when a duplicate email is submitted depends on system state, not just the input domain of `email` alone |
| All three fields | All must be non-empty for a successful registration — the form will not submit if any required field is blank |

---

## Summary

| Variable | Valid Domains | Invalid Domains |
|----------|--------------|-----------------|
| `name` | Non-empty string | Empty string |
| `email` | Valid format, not duplicate | Empty; invalid format (3 sub-types); duplicate |
| `password` | ≥8 chars + upper + lower + digit + special | Empty; <8 chars; missing upper; missing lower; missing digit; missing special |

---

## Human Review Checklist

- [x] Every input variable identified
- [x] No overlapping domains
- [x] Every domain supported by feature specification
