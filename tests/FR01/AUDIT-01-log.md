# AUDIT-01 — AI Audit Log
**Feature:** FR-01 — Account Registration  
**Assignment:** HW02 — AI-First Domain Testing  
**AI Tool:** Antigravity (Claude Sonnet 4.6 Thinking)  
**Conversation Start:** 2026-07-07T13:34 +07:00  
**Conversation End:** 2026-07-07T14:10 +07:00

---

## Audit Log

| # | Time (UTC+7) | Skill | Prompt / Action | AI Output Summary | Human Review | Changes Made |
|---|-------------|-------|-----------------|-------------------|-------------|--------------|
| 1 | 13:34 | ENV-01 | User submitted WORKFLOW.md + SKILLS.md; requested start of workflow for FR-01 | Verified backend (port 3000) and frontend (port 5173) reachable; created output directories; captured screenshot of `/register` page; confirmed all 3 form fields visible | User confirmed ✅ | Created `tests/FR01/`, `bugs/FR01/`, `ENV-01.md`, `ENV-register-page.png` |
| 2 | 13:38 | DT-01 | User confirmed to continue | Identified feature purpose, actors, 3 inputs, 9 business rules (BR-01–BR-09), 4 assumptions, 6 open questions | User ticked all checklist items ✅ | Created `DT-01-feature-understanding.md` |
| 3 | 13:41 | REVIEW-01 (DT-01) | User confirmed | Cross-checked DT-01 against UI screenshot and api_specification.md; no corrections required | Implicit approval by user confirming to continue | Created `REVIEW-01-of-DT-01.md` |
| 4 | 13:42 | DT-02 | User confirmed | Ran DOM inspection script (`inspect_fields.js`); discovered email field is `type="text"` (not `type="email"`), all fields `maxlength=-1`; identified domains for all 3 variables | User ticked all checklist items ✅ | Created `DT-02-domain-identification.md`, `inspect_fields.js` |
| 5 | 13:43 | REVIEW-01 (DT-02) | User confirmed | Verified all domains are mutually exclusive, non-overlapping, evidence-based; no corrections | Implicit approval | Created `REVIEW-01-of-DT-02.md` |
| 6 | 13:43 | DT-03 | User confirmed (immediately after REVIEW-01 DT-02) | Partitioned 3 variables into 15 labelled equivalence classes: NAME (2), EMAIL (6), PASS (7) | User ticked all checklist items ✅ | Created `DT-03-domain-partitioning.md` |
| 7 | 13:45 | REVIEW-01 (DT-03) | User confirmed | Verified mutual exclusivity, completeness, no duplicates; no corrections | Implicit approval | Created `REVIEW-01-of-DT-03.md` |
| 8 | 13:45 | DT-04 | User confirmed (immediately after REVIEW-01 DT-03) | Generated 13 test cases covering all 15 partitions; one-invalid-at-a-time strategy for isolation | User ticked all checklist items ✅ | Created `DT-04-test-cases.md` |
| 9 | 13:48 | EXEC-01 (DT) | User confirmed | Wrote and ran `exec_fr01_dt.js`; captured 26 screenshots (before/after × 13 TCs); recorded body text per TC | User reviewed execution.md | Created `exec_fr01_dt.js`, `execution.md`, `execution-results.json`, 26 screenshots |
| 10 | 13:51 | BUG-01 (first pass) | User confirmed | Created 3 bug reports: BUG-001 (Critical — valid password rejected), BUG-002 (High — no email validation), BUG-003 (High — duplicate email undetected, blocked by BUG-001) | User confirmed ✅ | Created `BUG-001.md`, `BUG-002.md`, `BUG-003.md`, copied 5 bug screenshots |
| 11 | 13:53 | BVA-01 | User confirmed | Assessed all 3 variables for boundaries; `name` and `email` skipped (no observable bounds); `password` has min=8 from UI; generated 3 boundary test cases (min−1, min, min+1) with values isolating length | User ticked all checklist items ✅ | Created `BVA-01-boundary-analysis.md` |
| 12 | 13:56 | EXEC-01 (BVA) | User confirmed | Wrote and ran `exec_fr01_bva.js`; all 3 BVA tests rejected with same password error (BUG-001 masking); BVA-TC001 PASS (correct outcome), BVA-TC002 and BVA-TC003 FAIL | User confirmed (implicit, by continuing) | Created `exec_fr01_bva.js`, `execution-bva.md`, `bva-execution-results.json`, 6 screenshots |
| 13 | 14:02 | BUG-01 (second pass) | User confirmed | Reviewed BVA results — no new bugs; all failures caused by BUG-001; noted boundary enforcement unverifiable until BUG-001 fixed | Implicit approval | Created `BUG-01-second-pass.md` |
| 14 | 14:02 | GAP-01 | User confirmed | Identified 10 potential gap items (G-01 to G-10); confirmed 0 hallucinations, 0 incorrect assumptions, 0 reasoning errors; flagged 3 candidate missing tests (whitespace inputs, email with leading space) | User confirmed (implicit, by continuing) | Created `GAP-01-gap-analysis.md` |
| 15 | 14:08 | REPORT-01 | User confirmed | Compiled final report from all verified artifacts; 16 total TCs (9 PASS / 7 FAIL); 3 bugs filed; feature status: BROKEN | User confirmed ✅ | Created `REPORT-FR01.md` |
| 16 | 14:10 | AUDIT-01 | User confirmed | Recording this complete audit log | — | Created `AUDIT-01-log.md` |

---

## Artifact Index

| Artifact | Path | Created By | Reviewed By |
|---------|------|------------|------------|
| ENV-01.md | `tests/FR01/ENV-01.md` | AI | — |
| DT-01-feature-understanding.md | `tests/FR01/DT-01-feature-understanding.md` | AI | Human ✅ |
| REVIEW-01-of-DT-01.md | `tests/FR01/REVIEW-01-of-DT-01.md` | AI | Human ✅ |
| DT-02-domain-identification.md | `tests/FR01/DT-02-domain-identification.md` | AI | Human ✅ |
| REVIEW-01-of-DT-02.md | `tests/FR01/REVIEW-01-of-DT-02.md` | AI | Human ✅ |
| DT-03-domain-partitioning.md | `tests/FR01/DT-03-domain-partitioning.md` | AI | Human ✅ |
| REVIEW-01-of-DT-03.md | `tests/FR01/REVIEW-01-of-DT-03.md` | AI | Human ✅ |
| DT-04-test-cases.md | `tests/FR01/DT-04-test-cases.md` | AI | Human ✅ |
| execution.md | `tests/FR01/execution.md` | AI | Human ✅ |
| execution-results.json | `tests/FR01/execution-results.json` | AI | — |
| BVA-01-boundary-analysis.md | `tests/FR01/BVA-01-boundary-analysis.md` | AI | Human ✅ |
| execution-bva.md | `tests/FR01/execution-bva.md` | AI | Human ✅ |
| GAP-01-gap-analysis.md | `tests/FR01/GAP-01-gap-analysis.md` | AI | Human (partial) |
| REPORT-FR01.md | `tests/FR01/REPORT-FR01.md` | AI | Human ✅ |
| BUG-001.md | `bugs/FR01/BUG-001.md` | AI | Human ✅ |
| BUG-002.md | `bugs/FR01/BUG-002.md` | AI | Human ✅ |
| BUG-003.md | `bugs/FR01/BUG-003.md` | AI | Human ✅ |
| BUG-01-second-pass.md | `bugs/FR01/BUG-01-second-pass.md` | AI | — |

---

## Statistics

| Metric | Value |
|--------|-------|
| Total skills executed | 16 |
| Total artifacts created | 18 |
| Total Playwright scripts | 4 |
| Total screenshots captured | 32 |
| Domain test cases | 13 |
| BVA test cases | 3 |
| Total test cases | 16 |
| Passed | 9 (56%) |
| Failed | 7 (44%) |
| Bugs filed | 3 (1 Critical, 2 High) |
| AI hallucinations | 0 |
| Human corrections to AI output | 0 |

---

## AI Performance Notes

- **Accuracy:** All business rules were grounded in observable evidence (UI + API spec). No rules were invented.
- **Black-box discipline:** AI never assumed implementation details. When client-side blocking prevented API calls, this was correctly reported rather than assumed.
- **Bug detection:** BUG-001 (critical) discovered on first test execution. BUG-002 discovered through pattern analysis of multiple FAIL results. BUG-003 correctly identified as blocked/masked.
- **Limitation:** BUG-001 prevented any test from reaching the backend API, limiting the depth of testing achievable in this session.
