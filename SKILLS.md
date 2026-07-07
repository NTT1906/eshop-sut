# SKILLS.md

# AI Testing Skills for HW02 – Domain Testing

## Overview

This document defines reusable AI skills used throughout HW02. Each skill represents a reusable workflow that can be applied to different features of the EShop System Under Test (SUT). The goal is to guide the AI through every step of the testing technique rather than requesting complete solutions directly.

These skills were designed according to the assignment's AI-First strategy, where AI acts as a disciplined testing assistant and every result is reviewed by the student before proceeding.

---

# ENV-01 — Testing Environment
## Purpose

Provide the AI with access to the local testing environment so it can inspect, execute, capture evidence, and assist in validating the SUT.
The AI should prefer collecting real evidence over making assumptions whenever possible.

## Available Tools

### Playwright

Location
```
playwright/
```

Purpose
- Navigate the frontend
- Capture screenshots
- Capture page state
- Verify UI behaviour
- Automate repetitive UI interactions

Example

```js
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:5173/');
  await page.screenshot({
    path: 'homepage.png',
    fullPage: true
  });
  await browser.close();
})();
```

## Responsibilities

Whenever UI evidence is required, the AI should:

1. Prefer capturing a fresh screenshot instead of asking the user.
2. Save screenshots using the project directory convention.
3. Reuse existing screenshots if they are still valid.
4. Capture additional screenshots whenever UI changes are observed.

## Output Convention

```bash
tests/
└── FR01/
    ├── testcases/
    │   ├── TC001.md
    │   ├── TC002.md
    │   └── ...
    │
    ├── scripts/
    │   ├── TC001.js
    │   ├── TC002.js
    │   └── ...
    │
    ├── screenshots/
    │   ├── TC001-before.png
    │   ├── TC001-after.png
    │   └── ...
    │
    └── execution.md

bugs/
└── FR01/
    ├── BUG001.md
    ├── BUG002.md
    └── screenshots/
```
## Limitations

The AI must never fabricate screenshots.

If the application cannot be launched or reached, report the issue instead of assuming UI behaviour.

---

# DT-01 — Feature Understanding

## Purpose

Understand the selected feature before applying any testing technique.

## Inputs

- Feature description
- UI screenshots (if available)
- Source code (if available)
- API documentation (if available)
- Database schema (if available)

## Prompt Guidelines

- Ask for clarification if feature information is incomplete.
- Do not infer business rules without evidence.
- Separate assumptions from verified facts.

## Procedure

1. Identify the purpose of the feature.
2. Identify actors.
3. Identify system inputs.
4. Identify outputs.
5. Identify business rules.
6. List assumptions.
7. Highlight missing information instead of guessing.

## Expected Output

- Feature summary
- Input list
- Output list
- Business rules
- Assumptions
- Open questions

## Validation

- No assumptions without evidence.
- Every business rule should be traceable to the SUT.

## Human Review Checklist

- [ ] Feature purpose is correct
- [ ] All actors identified
- [ ] All business rules have evidence
- [ ] No unsupported assumptions, ask for clarification

---

# DT-02 — Domain Identification

## Purpose

Identify all input domains required for Domain Testing.

## Inputs

Verified output from DT-01.

## Procedure

1. List every input variable.
2. Determine its data type.
3. Determine valid domain.
4. Determine invalid domains.
5. Identify constraints.
6. Identify dependencies between variables.

## Constraints

- Ignore display-only fields.
- Include hidden/system-generated inputs if they affect behaviour.
- Consider dependencies between multiple inputs.

## Expected Output

| Variable | Type | Valid Domain | Invalid Domain | Evidence |

## Validation

- Every user input must be included.
- Hidden inputs should also be considered.
- Domain definitions should not overlap.

## Human Review Checklist

- [ ] Every input variable identified
- [ ] No overlapping domains
- [ ] Every domain supported by feature specification

---

# DT-03 — Domain Partitioning

## Purpose

Partition each input domain into equivalence classes.

## Procedure

For each variable:

1. Create valid partitions.
2. Create invalid partitions.
3. Label each partition.
4. Explain why the partition exists.

## Decision Rules

- Merge partitions only if system behaviour is identical.
- Split partitions when business rules differ.
- Label every partition uniquely.

## Expected Output

| Variable | Partition | Description |

## Validation

- Partitions should be mutually exclusive.
- Partitions should completely cover the domain.

## Human Review Checklist

- [ ] Partitions are mutually exclusive
- [ ] Partitions completely cover the domain
- [ ] No duplicated partitions

---

# DT-04 — Domain Test Case Generation

## Purpose

Generate comprehensive Domain Testing test cases.

## Procedure

1. Select representative values from every partition.
2. Combine partitions where appropriate.
3. Avoid redundant cases.
4. Maximize domain coverage.

## Constraints

- Avoid duplicated test cases.
- Prioritize maximum domain coverage.
- One representative value per partition unless additional cases are required.

## Expected Output

| TC ID | Input | Expected Result | Covered Domain | Business Rule |

## Validation

- Every partition must be covered.
- Every business rule must be exercised.

## Acceptance Criteria

- Every partition covered
- Every business rule exercised
- No duplicated test cases

---

# BVA-01 — Boundary Value Analysis

## Purpose

Generate Boundary Value Analysis test cases.

## Inputs

Verified input domains.

## Procedure

For each bounded variable:

1. Identify minimum value.
2. Identify minimum + 1.
3. Identify nominal value.
4. Identify maximum − 1.
5. Identify maximum.
6. Identify maximum + 1.

Repeat for all numeric, length-based, date, and ordered inputs.

## Boundary Rules

Apply BVA to:

- Numeric values
- String length
- Date/time
- Ordered values

Skip variables without explicit boundaries.

## Expected Output

| Variable | Boundary | Test Value |

## Validation

- Every boundary should be tested.
- Variables without boundaries should be excluded.

## Human Review Checklist

- [ ] Every boundary identified
- [ ] Invalid boundaries included
- [ ] Nominal value selected correctly

---

# EXEC-01 — Test Execution

## Purpose

Execute test cases against the SUT.

## Preconditions

- Environment prepared
- Test data available
- Correct user role
- Required login state

## Procedure

1. Execute test.
2. Record actual result.
3. Compare with expected result.
4. Record Pass or Fail.
5. Capture evidence if necessary.

## Tool Usage

When frontend interaction is required:

- Use Playwright if appropriate.
- Save the generated script.
- Capture screenshots during execution.
- Reference generated artifacts in the execution result.

## Evidence

Collect automatically whenever possible.

Priority:

- Screenshot
- Video
- Browser console
- Network log
- Trace
## Expected Output

| TC ID | Expected | Actual | Status |

---

# BUG-01 — Bug Reporting

## Purpose

Convert failed test cases into reproducible bug reports.

## Procedure

1. Verify reproducibility.
2. Determine severity.
3. Collect supporting evidence.
Examples:
- Screenshot
- Video
- Trace
- Console log
- Network log.
4. Record reproduction steps.
5. Submit GitHub Issue.

## Evidence

Whenever possible, collect evidence automatically using the available tools.

Examples

- Screenshot
- Browser console
- Network log
- Playwright script

Reference all evidence inside the bug report.

## Severity Guideline

Critical
High
Medium
Low
Cosmetic

## Expected Output

- Bug ID
- Title
- Environment
- Preconditions
- Steps to Reproduce
- Expected Result
- Actual Result
- Severity
- Screenshot
- GitHub Issue Link (If the AI cannot create a GitHub Issue directly, generate a Markdown issue draft that can be submitted manually, named BUG-<|bug_id|>.md)

## Validation

- Bug is reproducible
- Expected and actual results are clear
- Screenshot attached

---

# GAP-01 — AI Gap Analysis

## Purpose

Evaluate AI-generated artifacts through human review and document any missing test cases, incorrect assumptions, hallucinations, or reasoning errors. AI may assist in generating hypotheses about possible causes. Human is responsible for validating or rejecting every explanation.

## Procedure

1. Compare AI-generated artifacts with the final reviewed results.
2. Identify missing test cases.
3. Identify incorrect assumptions.
4. Identify hallucinated requirements.
5. Explain why the issue occurred.

Possible causes include:

- Prompt ambiguity
- Missing project context
- AI reasoning limitations
- Feature complexity
- Human clarification added later

## Analysis Categories

- Missing test cases
- Incorrect assumptions
- Hallucinated requirements
- Missing edge cases
- Incorrect expected results

## Expected Output

| Issue | AI Output | Final Result | Cause |

---

# AUDIT-01 — AI Audit Logging

## Purpose

Maintain a complete AI interaction history.

## Procedure

For every AI interaction, record:

- Date and time
- AI tool
- Skill ID
- Prompt
- AI output summary
- Human review
- Changes made

## Expected Output

| Time | Skill | Prompt | Review | Changes |

---

# REPORT-01 — Report Generation

## Purpose

Generate the final Markdown report using only verified artifacts.

## Procedure

1. Summarize Domain Testing.
2. Summarize Boundary Value Analysis.
3. Summarize execution results.
4. Summarize discovered bugs.
5. Include AI Gap Analysis.
6. Reference GitHub Issues.
7. Ensure all evidence is linked.

## Validation

The report must only contain reviewed and verified information.

---

# REVIEW-01 — Human Review

## Purpose

Review every AI-generated artifact before accepting it.

## Procedure

1. Verify factual correctness.
2. Verify testing methodology.
3. Remove hallucinations.
4. Add missing cases.
5. Record all modifications.

## Expected Output

| Artifact | Issue | Correction | Reviewer |

## Validation

Every AI artifact must be reviewed before inclusion in the final report.

---

# General Principles

These skills follow the HW02 AI-First strategy.

The AI is used throughout every step of the testing process. The student is responsible for reviewing, correcting, and validating every AI-generated artifact before it becomes part of the final submission.

These skills are intentionally feature-independent and can be reused for FR-01, FR-11, FR-14, FR-20, and future testing assignments.
