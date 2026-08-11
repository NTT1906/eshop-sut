# AI Audit Report

## Student Information

| Field | Value |
|-------|-------|
| **Student ID** | 23127053 |
| **Assignment** | HW04 - Automation Testing |
| **AI Tool Used** | OpenCode (mimo-v2.5-free) |
| **Date** | 2026-08-11 |

---

## AI Interactions Log

### Interaction 1: Project Analysis and Setup

| Field | Value |
|-------|-------|
| **Date/Time** | 2026-08-11 21:00 |
| **AI Tool** | OpenCode (mimo-v2.5-free) |
| **Skill ID** | DT-01 - Feature Understanding |

**Prompt:**
```
Let's do HW4, student ID is 23127053, case chosen is FR-05, FR-09, and FR-16
```

**AI Output:**
- Analyzed the homework requirements
- Identified the three features to automate
- Explored the project structure
- Read the SUT documentation and API specification

**Human Review:**
- Verified AI correctly identified the features
- Confirmed understanding of FR-05, FR-09, FR-16 requirements

---

### Interaction 2: Test Data Creation

| Field | Value |
|-------|-------|
| **Date/Time** | 2026-08-11 21:15 |
| **AI Tool** | OpenCode (mimo-v2.5-free) |
| **Skill ID** | DT-04 - Test Case Generation |

**Prompt:**
```
Create test data files for FR-05, FR-09, FR-16
```

**AI Output:**
- Created `fr05_search_data.json` with 12 search scenarios
- Created `fr09_coupon_data.json` with 12 coupon test scenarios
- Created 4 CSV files for FR-16 testing

**Human Review:**
- Verified test data covers positive, negative, and edge cases
- Confirmed CSV files include valid, invalid, and RFC 4180 compliant data

---

### Interaction 3: FR-05 Test Script Generation

| Field | Value |
|-------|-------|
| **Date/Time** | 2026-08-11 21:30 |
| **AI Tool** | OpenCode (mimo-v2.5-free) |
| **Skill ID** | EXEC-01 - Test Execution |

**Prompt:**
```
Create FR-05 automation scripts (Product listing and search)
```

**AI Output:**
- Generated `fr05-product-listing.spec.js` with 16 test cases
- Included grid layout verification, search functionality, XSS prevention tests
- Used multiple assertion patterns: visibility, text content, count, CSS class

**Human Review:**
- Fixed XSS test dialog listener placement (moved before search action)
- Verified all selectors match the actual UI elements
- Confirmed proper use of Playwright assertions

---

### Interaction 4: FR-09 Test Script Generation

| Field | Value |
|-------|-------|
| **Date/Time** | 2026-08-11 21:45 |
| **AI Tool** | OpenCode (mimo-v2.5-free) |
| **Skill ID** | EXEC-01 - Test Execution |

**Prompt:**
```
Create FR-09 automation scripts (Discount coupons)
```

**AI Output:**
- Generated `fr09-discount-coupons.spec.js` with 12 test cases
- Included UI tests and API tests for coupon validation
- Tested percent and fixed coupon types

**Human Review:**
- Verified API endpoint URLs match the backend specification
- Confirmed coupon codes match the test data in the database
- Added proper authentication setup for API tests

---

### Interaction 5: FR-16 Test Script Generation

| Field | Value |
|-------|-------|
| **Date/Time** | 2026-08-11 22:00 |
| **AI Tool** | OpenCode (mimo-v2.5-free) |
| **Skill ID** | EXEC-01 - Test Execution |

**Prompt:**
```
Create FR-16 automation scripts (Product import from CSV)
```

**AI Output:**
- Generated `fr16-product-import.spec.js` with 16 test cases
- Included file upload, preview verification, and API tests
- Fixed syntax error in import button locator

**Human Review:**
- Verified file paths use correct Windows path format
- Confirmed CSV file paths match the test data directory
- Fixed regex pattern syntax error

---

### Interaction 6: Bug Discovery and Reporting

| Field | Value |
|-------|-------|
| **Date/Time** | 2026-08-11 22:15 |
| **AI Tool** | OpenCode (mimo-v2.5-free) |
| **Skill ID** | BUG-01 - Bug Reporting |

**Prompt:**
```
Review and fix AI-generated scripts, create bug reports
```

**AI Output:**
- Identified 5 bugs in the SUT:
  - BUG-001: XSS vulnerability in search results
  - BUG-002: Price display uses VND instead of ₫
  - BUG-003: Incorrect percent coupon calculation
  - BUG-004: Admin dashboard revenue multiplied by 2
  - BUG-005: CSV import doesn't validate positive prices

**Human Review:**
- Verified each bug is reproducible
- Confirmed bug reports follow the template format
- Documented steps to reproduce and suggested fixes

---

## AI Critique (200-300 words)

The AI tool (OpenCode) performed well in generating comprehensive test automation scripts, but there were several areas where it required human intervention and correction:

**Issues Found:**

1. **XSS Test Logic Error**: The AI initially placed the dialog event listener after performing the search action, which would miss any alerts triggered during the search. This required manual correction to move the listener before the search action.

2. **Syntax Errors**: The AI generated a regex pattern with incorrect syntax in the FR-16 test file, which caused a compilation error. This was a simple oversight that could have been caught with better code validation.

3. **Incomplete Bug Analysis**: While the AI identified several bugs, it didn't initially recognize the severity of the XSS vulnerability or the coupon calculation error. Human review was needed to prioritize these issues.

4. **Path Handling**: The AI used Windows-style paths which would work on the development environment but may cause issues on WSL. This required awareness of the target execution environment.

**What AI Got Right:**

1. **Comprehensive Test Coverage**: The AI generated 44 test cases across 3 features, covering positive, negative, and edge cases effectively.

2. **Assertion Patterns**: The AI used multiple assertion patterns (visibility, text, count, API responses) as required by the assignment.

3. **Data-Driven Approach**: The AI created separate test data files and referenced them properly in the test scripts.

4. **Documentation**: The AI generated clear documentation including README, test summary, and bug reports.

**Lessons Learned:**

- AI is excellent at generating boilerplate code and comprehensive test suites
- Human review is essential for logic errors and edge cases
- AI output should always be validated against the actual application behavior
- Clear, specific prompts yield better results than generic requests

---

## Changes Made by Human Reviewer

| File | Issue | Correction |
|------|-------|------------|
| fr05-product-listing.spec.js | Dialog listener placement | Moved before search action |
| fr16-product-import.spec.js | Syntax error in regex | Fixed locator pattern |
| All test files | Verified selectors | Confirmed against actual UI |
| Bug reports | Severity assessment | Adjusted based on impact |
