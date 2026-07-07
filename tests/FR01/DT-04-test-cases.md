# DT-04 — Domain Test Case Generation
**Feature:** FR-01 — Account Registration  
**Date:** 2026-07-07  
**Skill:** DT-04  
**Input:** Verified DT-03 partitions (15 total)

---

## Strategy

- **Happy path first:** TC001 covers NAME-V1 + EMAIL-V1 + PASS-V1 (all valid).
- **One invalid per test:** Each remaining test case introduces exactly one invalid partition while keeping the other two valid, to isolate the error cause.
- **PASS-I1 (empty password)** and **NAME-I1 (empty name)** and **EMAIL-I1 (empty email)** are tested as single-field-empty cases with others valid.
- No duplicate test cases.

---

## Test Cases

### TC001 — Happy Path (All Valid)
| Field | Value |
|-------|-------|
| `name` | `Nguyen Van A` |
| `email` | `testuser01@example.com` |
| `password` | `Password1!` |

| Attribute | Detail |
|-----------|--------|
| **TC ID** | TC001 |
| **Title** | Successful registration with all valid inputs |
| **Covered Partitions** | NAME-V1, EMAIL-V1, PASS-V1 |
| **Business Rules** | BR-01 through BR-09 |
| **Expected Result** | API returns HTTP 200 `{"message": "User registered successfully", "id": <n>}`. UI shows success indication. |

---

### TC002 — Empty Name
| Field | Value |
|-------|-------|
| `name` | `""` (empty) |
| `email` | `testuser02@example.com` |
| `password` | `Password1!` |

| Attribute | Detail |
|-----------|--------|
| **TC ID** | TC002 |
| **Title** | Registration fails when name is empty |
| **Covered Partitions** | NAME-I1, EMAIL-V1, PASS-V1 |
| **Business Rules** | BR-01 (name required) |
| **Expected Result** | Registration is rejected. Error indicating name is required. |

---

### TC003 — Empty Email
| Field | Value |
|-------|-------|
| `name` | `Nguyen Van B` |
| `email` | `""` (empty) |
| `password` | `Password1!` |

| Attribute | Detail |
|-----------|--------|
| **TC ID** | TC003 |
| **Title** | Registration fails when email is empty |
| **Covered Partitions** | NAME-V1, EMAIL-I1, PASS-V1 |
| **Business Rules** | BR-02 (email required) |
| **Expected Result** | Registration is rejected. Error indicating email is required. |

---

### TC004 — Invalid Email: Missing `@`
| Field | Value |
|-------|-------|
| `name` | `Nguyen Van C` |
| `email` | `invalidemail` |
| `password` | `Password1!` |

| Attribute | Detail |
|-----------|--------|
| **TC ID** | TC004 |
| **Title** | Registration fails when email has no `@` symbol |
| **Covered Partitions** | NAME-V1, EMAIL-I2, PASS-V1 |
| **Business Rules** | BR-02 (email format) |
| **Expected Result** | Registration is rejected. Error indicating invalid email format. |

---

### TC005 — Invalid Email: Missing Domain Part
| Field | Value |
|-------|-------|
| `name` | `Nguyen Van D` |
| `email` | `user@` |
| `password` | `Password1!` |

| Attribute | Detail |
|-----------|--------|
| **TC ID** | TC005 |
| **Title** | Registration fails when email has no domain after `@` |
| **Covered Partitions** | NAME-V1, EMAIL-I3, PASS-V1 |
| **Business Rules** | BR-02 (email format) |
| **Expected Result** | Registration is rejected. Error indicating invalid email format. |

---

### TC006 — Invalid Email: Missing Local Part
| Field | Value |
|-------|-------|
| `name` | `Nguyen Van E` |
| `email` | `@example.com` |
| `password` | `Password1!` |

| Attribute | Detail |
|-----------|--------|
| **TC ID** | TC006 |
| **Title** | Registration fails when email has no local part before `@` |
| **Covered Partitions** | NAME-V1, EMAIL-I4, PASS-V1 |
| **Business Rules** | BR-02 (email format) |
| **Expected Result** | Registration is rejected. Error indicating invalid email format. |

---

### TC007 — Duplicate Email
| Field | Value |
|-------|-------|
| `name` | `Nguyen Van F` |
| `email` | `testuser01@example.com` *(already registered by TC001)* |
| `password` | `Password1!` |

| Attribute | Detail |
|-----------|--------|
| **TC ID** | TC007 |
| **Title** | Registration fails when email is already registered |
| **Covered Partitions** | NAME-V1, EMAIL-I5, PASS-V1 |
| **Business Rules** | BR-02 (email uniqueness — assumption A-02/A-04) |
| **Precondition** | TC001 must have been executed successfully first |
| **Expected Result** | Registration is rejected. Error indicating email is already in use. |

---

### TC008 — Empty Password
| Field | Value |
|-------|-------|
| `name` | `Nguyen Van G` |
| `email` | `testuser08@example.com` |
| `password` | `""` (empty) |

| Attribute | Detail |
|-----------|--------|
| **TC ID** | TC008 |
| **Title** | Registration fails when password is empty |
| **Covered Partitions** | NAME-V1, EMAIL-V1, PASS-I1 |
| **Business Rules** | BR-03 (password required / min length) |
| **Expected Result** | Registration is rejected. Error indicating password is required. |

---

### TC009 — Password Too Short
| Field | Value |
|-------|-------|
| `name` | `Nguyen Van H` |
| `email` | `testuser09@example.com` |
| `password` | `Pass1!` (7 characters — has upper, lower, digit, special but < 8 chars) |

| Attribute | Detail |
|-----------|--------|
| **TC ID** | TC009 |
| **Title** | Registration fails when password has fewer than 8 characters |
| **Covered Partitions** | NAME-V1, EMAIL-V1, PASS-I2 |
| **Business Rules** | BR-03 (min 8 chars) |
| **Expected Result** | Registration is rejected. Error indicating password too short. |

---

### TC010 — Password Missing Uppercase
| Field | Value |
|-------|-------|
| `name` | `Nguyen Van I` |
| `email` | `testuser10@example.com` |
| `password` | `password1!` (8+ chars, lower ✅, digit ✅, special ✅, upper ❌) |

| Attribute | Detail |
|-----------|--------|
| **TC ID** | TC010 |
| **Title** | Registration fails when password has no uppercase letter |
| **Covered Partitions** | NAME-V1, EMAIL-V1, PASS-I3 |
| **Business Rules** | BR-04 (uppercase required) |
| **Expected Result** | Registration is rejected. Error indicating password must contain uppercase letter. |

---

### TC011 — Password Missing Lowercase
| Field | Value |
|-------|-------|
| `name` | `Nguyen Van J` |
| `email` | `testuser11@example.com` |
| `password` | `PASSWORD1!` (8+ chars, upper ✅, digit ✅, special ✅, lower ❌) |

| Attribute | Detail |
|-----------|--------|
| **TC ID** | TC011 |
| **Title** | Registration fails when password has no lowercase letter |
| **Covered Partitions** | NAME-V1, EMAIL-V1, PASS-I4 |
| **Business Rules** | BR-05 (lowercase required) |
| **Expected Result** | Registration is rejected. Error indicating password must contain lowercase letter. |

---

### TC012 — Password Missing Digit
| Field | Value |
|-------|-------|
| `name` | `Nguyen Van K` |
| `email` | `testuser12@example.com` |
| `password` | `Password!!` (8+ chars, upper ✅, lower ✅, special ✅, digit ❌) |

| Attribute | Detail |
|-----------|--------|
| **TC ID** | TC012 |
| **Title** | Registration fails when password has no digit |
| **Covered Partitions** | NAME-V1, EMAIL-V1, PASS-I5 |
| **Business Rules** | BR-06 (digit required) |
| **Expected Result** | Registration is rejected. Error indicating password must contain a digit. |

---

### TC013 — Password Missing Special Character
| Field | Value |
|-------|-------|
| `name` | `Nguyen Van L` |
| `email` | `testuser13@example.com` |
| `password` | `Password1` (8+ chars, upper ✅, lower ✅, digit ✅, special ❌) |

| Attribute | Detail |
|-----------|--------|
| **TC ID** | TC013 |
| **Title** | Registration fails when password has no special character |
| **Covered Partitions** | NAME-V1, EMAIL-V1, PASS-I6 |
| **Business Rules** | BR-07 (special character required) |
| **Expected Result** | Registration is rejected. Error indicating password must contain a special character. |

---

## Coverage Matrix

| Partition | Covered By |
|-----------|-----------|
| NAME-V1 | TC001, TC003–TC013 |
| NAME-I1 | TC002 |
| EMAIL-V1 | TC001, TC002, TC008–TC013 |
| EMAIL-I1 | TC003 |
| EMAIL-I2 | TC004 |
| EMAIL-I3 | TC005 |
| EMAIL-I4 | TC006 |
| EMAIL-I5 | TC007 |
| PASS-V1 | TC001–TC007 |
| PASS-I1 | TC008 |
| PASS-I2 | TC009 |
| PASS-I3 | TC010 |
| PASS-I4 | TC011 |
| PASS-I5 | TC012 |
| PASS-I6 | TC013 |

**All 15 partitions covered. Total test cases: 13.**

---

## Human Review Checklist

- [x] Every partition covered
- [x] Every business rule exercised
- [x] No duplicated test cases
