# SKILLS.md (Mobile App Edition)

# AI Testing Skills for HW02 – Domain Testing (Mobile / Expo)

## Overview

This document defines reusable AI skills used throughout HW02. Each skill represents a reusable workflow that can be applied to the Mobile App feature (Shopping Cart) of the EShop SUT. 
Due to the constraints of testing a native mobile application (Expo), UI automation is bypassed. The AI acts as a disciplined testing assistant focusing on API-level execution and formatting manual UI evidence.

---

# ENV-01 — Testing Environment (Hybrid Mobile)
## Purpose

Establish the context that the SUT is a native mobile application running on an Expo emulator, interfacing with a Node.js backend API. 

## Available Tools

### API Scripting (Automated)
- Node.js (`fetch` or `axios`)
- cURL

### UI Validation (Manual)
- Human tester executing steps on Expo emulator
- Human tester capturing native screenshots

## Responsibilities

The AI must NEVER attempt to generate Playwright or browser automation scripts for this feature.
Whenever test execution is required, the AI should:
1. Generate API test scripts (e.g., using Node.js `fetch`) to validate backend logic (e.g., POST `/api/cart`).
2. Explicitly instruct the human tester to manually execute the corresponding UI steps on the Expo emulator.
3. Accept the manual screenshot filenames provided by the human tester and integrate them into the bug reports.

## Output Convention

```bash
tests/
└── FR_MobileCart/
    ├── testcases/
    │   ├── TC001.md
    │   └── ...
    ├── scripts/
    │   ├── api_TC001.js
    │   └── ...
    ├── screenshots/
    │   ├── TC001-ui.png
    │   └── ...
    └── execution.md

bugs/
└── FR_MobileCart/
    ├── BUG001.md
    └── screenshots/

```

---

# DT-01 to DT-04 — Domain Testing Procedures

(Keep original Domain Testing logic. Apply it to API inputs and Mobile UI inputs).

# BVA-01 — Boundary Value Analysis

(Keep original Boundary Value logic. Apply to quantities, prices, etc.).

---

# EXEC-01 — Test Execution (Mobile API & Manual UI)

## Purpose

Execute test cases against the Mobile SUT using a hybrid approach.

## Preconditions

* Backend server is running.
* Expo emulator is loaded and logged in with a valid Authorization token.

## Procedure

1. **API Execution:** AI generates a Node.js/Fetch script to test the backend logic with the designated boundaries/domains.
2. **UI Execution:** AI pauses and prompts the human tester to replicate the input on the Expo UI.
3. **Evidence Collection:** Human tester runs the API script and tests the UI manually, then feeds the API response and screenshot filename back to the AI.
4. AI compares actual results with expected results.

## Expected Output

| TC ID | Expected | Actual (API) | Actual (UI) | Status |

---

# BUG-01 — Bug Reporting

## Purpose

Convert failed test cases into reproducible bug reports suitable for GitHub Issues.

## Procedure

1. Compile the API error response and the manual UI observations.
2. Determine severity.
3. Record reproduction steps (both API endpoint and Mobile UI path).
4. Reference the screenshot provided by the human tester.
5. Generate standard GitHub Issue Markdown.

## Expected Output

* Bug ID
* Title
* Environment (Expo Emulator / Node.js Backend)
* Preconditions
* Steps to Reproduce
* Expected Result
* Actual Result
* Severity
* Screenshot (Markdown image link matching the filename provided by the human)

---

# GAP-01, AUDIT-01, REPORT-01, REVIEW-01

(Follow standard review, gap analysis, and logging procedures as previously defined).