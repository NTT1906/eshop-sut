# DT-03 — Domain Partitioning
**Feature:** FR-01 — Account Registration  
**Date:** 2026-07-07  
**Skill:** DT-03  
**Input:** Verified DT-02 output

---

## Partitioning Rules Applied

- Each partition receives a unique label.
- Partitions within a variable are mutually exclusive.
- Together, all partitions for a variable cover the full observable domain.
- Partitions are split where business rules differ, merged where behaviour is identical.

---

## Variable 1: `name`

| Partition ID | Type | Label | Description | Example Value |
|-------------|------|-------|-------------|---------------|
| NAME-V1 | Valid | Non-empty string | Any string with at least one character | `Nguyen Van A` |
| NAME-I1 | Invalid | Empty string | Blank / whitespace-only value | `""` |

> **Rationale:** No format, length, or character-set constraints are observable for `name`. The only confirmed boundary is empty vs. non-empty.

---

## Variable 2: `email`

| Partition ID | Type | Label | Description | Example Value |
|-------------|------|-------|-------------|---------------|
| EMAIL-V1 | Valid | Valid format, unique | Well-formed email not yet registered in the system | `newuser@test.com` |
| EMAIL-I1 | Invalid | Empty string | Blank email field | `""` |
| EMAIL-I2 | Invalid | Missing `@` symbol | String with no `@` — not a valid email format | `notanemail` |
| EMAIL-I3 | Invalid | Missing domain part | Has `@` but no domain after it | `user@` |
| EMAIL-I4 | Invalid | Missing local part | Has `@` but no username before it | `@domain.com` |
| EMAIL-I5 | Invalid | Duplicate (already registered) | Email that already exists in the system | *(use a pre-registered account)* |

> **Rationale:** The email field uses `type="text"` so browser validation does not apply. Format validation must be performed by the application. Five distinct invalid patterns are distinguished because each exercises a different code path in any reasonable validator. Duplicate is a separate state-dependent invalid class.

---

## Variable 3: `password`

| Partition ID | Type | Label | Description | Example Value |
|-------------|------|-------|-------------|---------------|
| PASS-V1 | Valid | All rules satisfied | ≥ 8 chars, has uppercase, lowercase, digit, and special character | `Password1!` |
| PASS-I1 | Invalid | Empty string | Blank password field | `""` |
| PASS-I2 | Invalid | Too short (< 8 chars) | Meets all character-type rules but length < 8 | `Pass1!` (7 chars) |
| PASS-I3 | Invalid | Missing uppercase | ≥ 8 chars, has lower + digit + special, no uppercase | `password1!` |
| PASS-I4 | Invalid | Missing lowercase | ≥ 8 chars, has upper + digit + special, no lowercase | `PASSWORD1!` |
| PASS-I5 | Invalid | Missing digit | ≥ 8 chars, has upper + lower + special, no digit | `Password!!` |
| PASS-I6 | Invalid | Missing special character | ≥ 8 chars, has upper + lower + digit, no special char | `Password1` |

> **Rationale:** Each of the five password rules (length, uppercase, lowercase, digit, special) is an independent business rule stated in the UI. Each deserves its own invalid partition to confirm the rule is enforced independently. The empty case is kept separate from "too short" because it may trigger a different validation path (required-field check vs. length check).

---

## Complete Partition Summary

| Variable | Partition ID | Type | Label |
|----------|-------------|------|-------|
| `name` | NAME-V1 | Valid | Non-empty string |
| `name` | NAME-I1 | Invalid | Empty string |
| `email` | EMAIL-V1 | Valid | Valid format, unique |
| `email` | EMAIL-I1 | Invalid | Empty string |
| `email` | EMAIL-I2 | Invalid | Missing `@` |
| `email` | EMAIL-I3 | Invalid | Missing domain part |
| `email` | EMAIL-I4 | Invalid | Missing local part |
| `email` | EMAIL-I5 | Invalid | Duplicate email |
| `password` | PASS-V1 | Valid | All rules satisfied |
| `password` | PASS-I1 | Invalid | Empty string |
| `password` | PASS-I2 | Invalid | Too short (< 8 chars) |
| `password` | PASS-I3 | Invalid | Missing uppercase |
| `password` | PASS-I4 | Invalid | Missing lowercase |
| `password` | PASS-I5 | Invalid | Missing digit |
| `password` | PASS-I6 | Invalid | Missing special character |

**Total partitions: 15** (3 valid, 12 invalid)

---

## Human Review Checklist

- [x] Partitions are mutually exclusive
- [x] Partitions completely cover the domain
- [x] No duplicated partitions
