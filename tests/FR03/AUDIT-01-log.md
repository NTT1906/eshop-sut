# AUDIT-01 - AI Audit Log
**Feature:** FR-03 - Forgot Password and Password Reset  
**Assignment:** HW02 - AI-First Domain Testing  
**AI Tool:** Codex  
**Conversation Date:** 2026-07-07  
**Timezone:** Asia/Ho_Chi_Minh

---

## Audit Log

| # | Time (UTC+7) | Skill | Prompt / Action | AI Output Summary | Human Review | Changes Made |
|---|--------------|-------|-----------------|-------------------|--------------|--------------|
| 1 | 15:49 | ENV-01 | User requested execution of first workflow skill `ENV-01`. | Loaded `SKILLS.md` and `WORKFLOW.md`; checked existing FR-03 artifacts; verified frontend/backend reachability; installed Playwright Chromium; captured forgot-password step 1 and step 2 evidence. | User approved continuing to DT-01. | Created `tests/FR03/ENV-01.md`, `tests/FR03/ENV-01-ui-state.json`, screenshots, `playwright/env_check_fr03.js`. |
| 2 | 16:00 | DT-01 | User: "Move on to DT-01". | Produced feature understanding: purpose, actors, preconditions, inputs, outputs, business rules, assumptions, and open questions. | Reviewed in next `REVIEW-01`. | Created `tests/FR03/DT-01-feature-understanding.md`. |
| 3 | 16:02 | REVIEW-01 of DT-01 | User: "Move on to REVIEW-01". | Checked DT-01 against feature input, API spec, and ENV-01 evidence. Found two wording/qualification issues. | Accepted after corrections. | Created `tests/FR03/REVIEW-01-of-DT-01.md`; corrected DT-01 success-result wording and weak-password qualification. |
| 4 | 16:04 | DT-02 | User: "Move on to DT-02". | Identified domains for `email`, `resetToken`, and `newPassword`; documented constraints and dependencies. | Reviewed in next `REVIEW-01`. | Created `tests/FR03/DT-02-domain-identification.md`. |
| 5 | 16:06 | REVIEW-01 of DT-02 | User: "Move on to REVIEW-01". | Found that step 2 uses state-carried `email` even though it is not visible. | Accepted after correction. | Created `tests/FR03/REVIEW-01-of-DT-02.md`; updated DT-02 to include hidden/state-carried email dependency. |
| 6 | 16:08 | DT-03 | User: "Move on to DT-03". | Partitioned domains into 17 value partitions plus dependency partitions. | Reviewed in next `REVIEW-01`. | Created `tests/FR03/DT-03-domain-partitioning.md`. |
| 7 | 16:10 | REVIEW-01 of DT-03 | User: "Move on to REVIEW-01". | Found possible overlap between incorrect-token and wrong-length-token partitions. | Accepted after correction. | Created `tests/FR03/REVIEW-01-of-DT-03.md`; refined `TOKEN-I2` to correctly shaped 4-character unissued token. |
| 8 | 16:12 | DT-04 | User: "Move on to DT-04". | Generated 16 domain test cases covering all value and dependency partitions. | Implicit review by continuing to execution. | Created `tests/FR03/DT-04-test-cases.md`. |
| 9 | 16:14 | EXEC-01 for Domain Tests | User: "Move on to EXEC-01". | Wrote Playwright execution script; ran 16 domain tests; captured screenshots; recorded 11 pass and 5 fail. | Results used for BUG-01. | Created `playwright/exec_fr03_dt.js`, `tests/FR03/execution.md`, `tests/FR03/execution-results.json`, DT screenshots. |
| 10 | 16:17 | BUG-01 for Domain Tests | User: "Move on to BUG-01". | Reviewed 5 failed DT cases; consolidated them into one reproducible bug report for valid strong password rejection. | Implicit review by continuing. | Created `bugs/FR03/BUG-001.md` and `tests/FR03/BUG-01.md`. |
| 11 | 16:19 | BVA-01 | User: "Move on to BVA-01". | Identified BVA scope: excluded `email`, included confirmation-needed `resetToken`, included `newPassword`; generated 15 BVA cases. | Implicit review by continuing to BVA execution. | Created `tests/FR03/BVA-01-boundary-analysis.md`. |
| 12 | 16:21 | EXEC-01 for BVA | User: "Move on to EXEC-01". | Wrote Playwright BVA execution script; ran 15 BVA tests; captured screenshots; recorded 8 pass and 7 fail. | Results used for BVA BUG-01. | Created `playwright/exec_fr03_bva.js`, `tests/FR03/execution-bva.md`, `tests/FR03/bva-execution-results.json`, BVA screenshots. |
| 13 | 16:23 | BUG-01 for BVA | User: "Move on to BUG-01". | Reviewed 7 failed BVA cases; confirmed same defect as BUG-001; updated bug report with BVA evidence. | Implicit review by continuing. | Created `tests/FR03/BUG-01-bva.md`; updated `bugs/FR03/BUG-001.md`. |
| 14 | 16:25 | GAP-01 | User: "Move on to GAP-01". | Documented AI/testing gaps: incorrect valid-password assumption, token tests masked by password validation, unresolved token length behavior, deferred tests. | Implicit review by continuing. | Created `tests/FR03/GAP-01-gap-analysis.md`. |
| 15 | 16:27 | REPORT-01 | User: "Move on to REPORT-01". | Compiled final FR-03 report with DT, BVA, execution, bug, evidence, and gap-analysis summaries. | Implicit review by continuing. | Created `tests/FR03/REPORT-FR03.md`. |
| 16 | 16:29 | AUDIT-01 | User: "Move on to AUDIT-01". | Created this AI audit log for the full FR-03 workflow. | Pending user review. | Created `tests/FR03/AUDIT-01-log.md`. |

---

## Artifact Index

| Artifact | Path | Created By | Review Status |
|----------|------|------------|---------------|
| Environment report | `tests/FR03/ENV-01.md` | AI | User continued |
| UI state JSON | `tests/FR03/ENV-01-ui-state.json` | AI | Used as evidence |
| Feature understanding | `tests/FR03/DT-01-feature-understanding.md` | AI | Reviewed and corrected |
| Review of DT-01 | `tests/FR03/REVIEW-01-of-DT-01.md` | AI | Accepted |
| Domain identification | `tests/FR03/DT-02-domain-identification.md` | AI | Reviewed and corrected |
| Review of DT-02 | `tests/FR03/REVIEW-01-of-DT-02.md` | AI | Accepted |
| Domain partitioning | `tests/FR03/DT-03-domain-partitioning.md` | AI | Reviewed and corrected |
| Review of DT-03 | `tests/FR03/REVIEW-01-of-DT-03.md` | AI | Accepted |
| Domain test cases | `tests/FR03/DT-04-test-cases.md` | AI | Executed |
| Domain execution report | `tests/FR03/execution.md` | AI | Used for bug reporting |
| Domain raw results | `tests/FR03/execution-results.json` | AI | Used for bug reporting |
| Domain execution script | `playwright/exec_fr03_dt.js` | AI | Executed |
| BVA analysis | `tests/FR03/BVA-01-boundary-analysis.md` | AI | Executed |
| BVA execution report | `tests/FR03/execution-bva.md` | AI | Used for bug reporting |
| BVA raw results | `tests/FR03/bva-execution-results.json` | AI | Used for bug reporting |
| BVA execution script | `playwright/exec_fr03_bva.js` | AI | Executed |
| Domain bug summary | `tests/FR03/BUG-01.md` | AI | Accepted by continuation |
| BVA bug summary | `tests/FR03/BUG-01-bva.md` | AI | Accepted by continuation |
| Bug report draft | `bugs/FR03/BUG-001.md` | AI | Updated with BVA evidence |
| Gap analysis | `tests/FR03/GAP-01-gap-analysis.md` | AI | Included in report |
| Final report | `tests/FR03/REPORT-FR03.md` | AI | Included all verified evidence |
| Audit log | `tests/FR03/AUDIT-01-log.md` | AI | Current artifact |

---

## Statistics

| Metric | Value |
|--------|-------|
| Total workflow skills executed | 16 |
| Review steps executed | 3 |
| Domain test cases designed | 16 |
| Domain test cases executed | 16 |
| Domain test cases passed | 11 |
| Domain test cases failed | 5 |
| BVA test cases designed | 15 |
| BVA test cases executed | 15 |
| BVA test cases passed | 8 |
| BVA test cases failed | 7 |
| Total test cases executed | 31 |
| Total passed | 19 |
| Total failed | 12 |
| Bugs reported | 1 High |
| Playwright scripts created | 3 |
| Screenshots captured for FR-03 | 33 |
| GitHub issues created automatically | 0 |

---

## AI Performance Notes

- The AI followed the one-skill-per-response workflow and waited for user confirmation at each transition.
- The AI kept unresolved requirements explicit, especially OTP length, email format enforcement, and password enforcement location.
- The AI incorrectly treated passwords containing `!` as valid based on visible requirements. Execution exposed this mismatch and it was documented in BUG-001 and GAP-01.
- Review steps corrected overclaims and partition overlap before downstream generation.
- The final report includes only generated and verified artifacts, with token-boundary limitations clearly documented.

---

## Human Review Checklist

- [x] Each AI interaction recorded.
- [x] Skill sequence preserved.
- [x] Outputs summarized.
- [x] Human review and correction points recorded.
- [x] Artifact index included.
- [x] Execution and bug statistics included.
