# AUDIT-01 - AI Audit Log
**Feature:** FR-12 - Access Control  
**Assignment:** HW02 - AI-First Domain Testing  
**AI Tool:** Codex  
**Conversation Date:** 2026-07-07  
**Timezone:** Asia/Ho_Chi_Minh

---

## Audit Log

| # | Time (UTC+7) | Skill | Prompt / Action | AI Output Summary | Human Review | Changes Made |
|---|--------------|-------|-----------------|-------------------|--------------|--------------|
| 1 | 21:05 | Feature Input | User switched from FR-10 to FR-12 and requested feature inputs for Access Control. | Read `api_specification.md` and FR-12 requirements; generated feature inputs for Admin, Normal User, and Unauthenticated User access-control testing. | User continued to workflow. | Created `FEATURE_INPUT_FR12.md` at workspace root; `WORKFLOW.md` also embedded FR-12 feature inputs. |
| 2 | 21:08 | ENV-01 | User requested first workflow skill for FR-12. | Loaded `SKILLS.md` and `WORKFLOW.md`; started local backend, web frontend, and admin frontend; captured Admin Login, Normal User blocked, and Admin Users screenshots; recorded UI/API state. | User approved continuing to DT-01. | Created `tests/FR12/ENV-01.md`, `tests/FR12/ENV-01-ui-state.json`, screenshots, and `playwright/env_check_fr12.js`. |
| 3 | 21:14 | DT-01 | User: "Move on to DT-01". | Produced feature understanding: actors, inputs, outputs, business rules, assumptions, missing information, and open questions. | Reviewed in next `REVIEW-01`. | Created `tests/FR12/DT-01-feature-understanding.md`. |
| 4 | 21:17 | REVIEW-01 of DT-01 | User: "Move on to REVIEW-01". | Reviewed DT-01 for traceability and methodology; approved it and recorded carry-forward decisions for malformed headers, `GET /api/coupons`, and stored-token state. | Accepted for DT-02. | Created `tests/FR12/REVIEW-01-of-DT-01.md`. |
| 5 | 21:19 | DT-02 | User: "Move on to DT-02". | Identified domains for login inputs, actor role, authentication state, authorization header, stored admin token, protected operation, HTTP method, resource ID, payload presence, and access surface. | Reviewed in next `REVIEW-01`. | Created `tests/FR12/DT-02-domain-identification.md`. |
| 6 | 21:22 | REVIEW-01 of DT-02 | User: "Move on to REVIEW-01". | Approved DT-02; clarified that DT-03 should partition behavior-driving access-control domains without expanding CRUD payload validation. | Accepted for DT-03. | Created `tests/FR12/REVIEW-01-of-DT-02.md`. |
| 7 | 21:24 | DT-03 | User: "Move on to DT-03". | Partitioned FR-12 domains into equivalence classes for role, token validity, header classes, stored token state, protected operation groups, methods, IDs, payload presence, and access surfaces. | Reviewed in next `REVIEW-01`. | Created `tests/FR12/DT-03-domain-partitioning.md`. |
| 8 | 21:27 | REVIEW-01 of DT-03 | User: "Move on to REVIEW-01". | Approved DT-03; instructed DT-04 to use representative combinations instead of a full Cartesian product. | Accepted for DT-04. | Created `tests/FR12/REVIEW-01-of-DT-03.md`. |
| 9 | 21:30 | DT-04 | User: "Move on to DT-04". | Generated 42 representative Domain Testing test cases covering UI gates, stored tokens, token/header classes, protected endpoint groups, resource IDs, payload presence, and public-read contrast. | User proceeded to execution. | Created `tests/FR12/DT-04-test-cases.md`. |
| 10 | 21:35 | EXEC-01 for Domain Tests | User: "Move on to EXEC-01". | Wrote and ran Playwright/API execution script; executed 42 Domain Testing cases; captured UI screenshots; recorded 27 pass and 15 fail. | Results used for BUG-01. | Created `playwright/exec_fr12_dt.js`, `tests/FR12/execution.md`, `tests/FR12/execution-results.json`, and DT screenshots. |
| 11 | 21:45 | BUG-01 for Domain Tests | User: "Move on to BUG-01". | Reviewed 15 failed DT cases; grouped them into 5 bug reports; ran focused repro script and confirmed all bug groups. | User proceeded to BVA. | Created `tests/FR12/BUG-01.md`, `tests/FR12/BUG-01-repro.json`, `playwright/repro_fr12_bugs.js`, and `bugs/FR12/BUG-001.md` through `BUG-005.md`. |
| 12 | 21:55 | BVA-01 | User: "Move on to BVA-01". | Reviewed all FR-12 domains for BVA applicability; concluded no explicit numeric, string-length, date/time, or ordered boundaries exist. | User proceeded to BVA execution. | Created `tests/FR12/BVA-01-boundary-analysis.md`. |
| 13 | 21:58 | EXEC-01 for BVA | User: "Move on to EXEC-01". | Recorded that no BVA cases were generated or executed because FR-12 has no explicit boundary variables. | Results used for BVA BUG-01. | Created `tests/FR12/execution-bva.md` and `tests/FR12/bva-execution-results.json`. |
| 14 | 22:00 | BUG-01 for BVA | User: "Move on to BUG-01". | Reviewed BVA execution; confirmed 0 BVA failures and no new BVA bug reports. | User proceeded to GAP-01. | Created `tests/FR12/BUG-01-bva.md`. |
| 15 | 22:02 | GAP-01 | User: "Move on to GAP-01". | Documented gaps: UI-only testing would miss API role failures, product-validation overlap, BVA non-applicability, unspecified denial status, stored-token bypass risk, and endpoint scope uncertainty. | User proceeded to REPORT-01. | Created `tests/FR12/GAP-01-gap-analysis.md`. |
| 16 | 22:05 | REPORT-01 | User: "Move on to REPORT-01". | Compiled final FR-12 report summarizing DT, BVA, execution results, bug reports, evidence, and gap analysis. | User proceeded to AUDIT-01. | Created `tests/FR12/REPORT-FR12.md`. |
| 17 | 22:08 | AUDIT-01 | User: "Move on to AUDIT-01". | Created this AI audit log for the full FR-12 workflow. | Pending user review. | Created `tests/FR12/AUDIT-01-log.md`. |

---

## Artifact Index

| Artifact | Path | Created By | Review Status |
|----------|------|------------|---------------|
| Feature input | `FEATURE_INPUT_FR12.md` | AI | Used as workflow input; also embedded in `WORKFLOW.md` |
| Environment report | `tests/FR12/ENV-01.md` | AI | User continued |
| UI/API state JSON | `tests/FR12/ENV-01-ui-state.json` | AI | Used as evidence |
| Environment script | `playwright/env_check_fr12.js` | AI | Executed |
| Environment screenshots | `tests/FR12/screenshots/ENV-*.png` | AI | Evidence captured |
| Feature understanding | `tests/FR12/DT-01-feature-understanding.md` | AI | Reviewed |
| Review of DT-01 | `tests/FR12/REVIEW-01-of-DT-01.md` | AI | Accepted |
| Domain identification | `tests/FR12/DT-02-domain-identification.md` | AI | Reviewed |
| Review of DT-02 | `tests/FR12/REVIEW-01-of-DT-02.md` | AI | Accepted |
| Domain partitioning | `tests/FR12/DT-03-domain-partitioning.md` | AI | Reviewed |
| Review of DT-03 | `tests/FR12/REVIEW-01-of-DT-03.md` | AI | Accepted |
| Domain test cases | `tests/FR12/DT-04-test-cases.md` | AI | Executed |
| Domain execution script | `playwright/exec_fr12_dt.js` | AI | Executed |
| Domain execution report | `tests/FR12/execution.md` | AI | Used for bug reporting |
| Domain raw results | `tests/FR12/execution-results.json` | AI | Used for bug reporting |
| Domain screenshots | `tests/FR12/screenshots/DT-TC*.png` | AI | Evidence captured |
| Domain bug summary | `tests/FR12/BUG-01.md` | AI | Accepted by continuation |
| Focused repro script | `playwright/repro_fr12_bugs.js` | AI | Executed |
| Focused repro JSON | `tests/FR12/BUG-01-repro.json` | AI | Reproduction evidence |
| Bug report draft | `bugs/FR12/BUG-001.md` | AI | Manual issue draft |
| Bug report draft | `bugs/FR12/BUG-002.md` | AI | Manual issue draft |
| Bug report draft | `bugs/FR12/BUG-003.md` | AI | Manual issue draft |
| Bug report draft | `bugs/FR12/BUG-004.md` | AI | Manual issue draft |
| Bug report draft | `bugs/FR12/BUG-005.md` | AI | Manual issue draft |
| BVA analysis | `tests/FR12/BVA-01-boundary-analysis.md` | AI | Executed |
| BVA execution report | `tests/FR12/execution-bva.md` | AI | Used for BVA bug review |
| BVA raw results | `tests/FR12/bva-execution-results.json` | AI | Used for BVA bug review |
| BVA bug summary | `tests/FR12/BUG-01-bva.md` | AI | Accepted by continuation |
| Gap analysis | `tests/FR12/GAP-01-gap-analysis.md` | AI | Included in report |
| Final report | `tests/FR12/REPORT-FR12.md` | AI | Included all verified evidence |
| Audit log | `tests/FR12/AUDIT-01-log.md` | AI | Current artifact |

---

## Statistics

| Metric | Value |
|--------|-------|
| Workflow skills executed | 16 |
| Review steps executed | 3 |
| Domain test cases designed | 42 |
| Domain test cases executed | 42 |
| Domain test cases passed | 27 |
| Domain test cases failed | 15 |
| BVA test cases designed | 0 |
| BVA test cases executed | 0 |
| BVA test cases passed | 0 |
| BVA test cases failed | 0 |
| Total executed test cases | 42 |
| Total passed | 27 |
| Total failed | 15 |
| Bug reports created | 5 |
| Critical bugs | 1 |
| High bugs | 1 |
| Medium bugs | 3 |
| Playwright / Node scripts created | 3 |
| Screenshots captured for FR-12 | 10 |
| GitHub issues created automatically | 0 |

---

## AI Performance Notes

- The AI followed the one-skill-per-response workflow and waited for user confirmation before each next skill.
- Human review steps narrowed the scope, especially around `GET /api/coupons`, malformed headers, stored-token behavior, and avoiding a full Cartesian product.
- Direct API execution was essential. UI-only checks would have missed the most severe defects because the visible Admin Login blocks Normal Users, while the backend accepted Normal User tokens on many protected routes.
- BVA was correctly treated as non-applicable because FR-12 has categorical access-control inputs and no explicit boundaries.
- The AI initially included product invalid-ID and missing-body tests in FR-12 because product writes are part of the protected surface. The final report classifies those findings as data-integrity/product-management issues discovered during FR-12.
- No GitHub issues were created automatically; manual issue drafts were generated instead.

---

## Human Review Checklist

- [x] Each AI workflow interaction recorded.
- [x] Skill sequence preserved.
- [x] Outputs summarized.
- [x] Human review and correction points recorded.
- [x] Artifact index included.
- [x] Execution and bug statistics included.
- [x] Final report and gap-analysis findings referenced.
- [x] Manual issue draft status recorded.
