# GAP-01 — AI Gap Analysis
**Feature:** FR-01 — Account Registration  
**Date:** 2026-07-07  
**Skill:** GAP-01  
**Reviewer:** Human (student) — validates or rejects every hypothesis below

---

## Purpose

Compare AI-generated artifacts with final reviewed results. Identify missing test cases, incorrect assumptions, hallucinations, and reasoning errors.

---

## Gap Analysis Table

| # | Issue | AI Output | Final Result | Cause | Human Validation |
|---|-------|-----------|-------------|-------|-----------------|
| G-01 | TC001 expected result was wrong | AI expected: "Registration succeeds (HTTP 200)" | Actual: Fails due to BUG-001 (client validator broken). The expected result itself was correct per spec — the SUT has the bug. | Not an AI error — the expected result was correct; the SUT is defective. | ☐ Confirm / ☐ Reject |
| G-02 | Missing test: `name` field whitespace-only input | AI only tested empty string for `name`. A whitespace-only value (e.g. `"   "`) is a distinct edge case — the browser `required` attribute may pass it through. | Not tested. | AI did not observe a whitespace validation rule in the UI, so correctly stayed within observable constraints. However, this is a common edge case worth adding. | ☐ Confirm / ☐ Reject |
| G-03 | Missing test: very long inputs | No test for extremely long `name`, `email`, or `password` values. All fields have `maxlength=-1`. | Not tested — OQ-01/02/03 were flagged but no test was generated since no boundary was confirmed. | Correct — BVA rules state "skip variables without explicit boundaries." AI was consistent with its own rules. However, a grey-box tester might probe for server-side length limits. | ☐ Confirm / ☐ Reject |
| G-04 | TC007 (duplicate email) status is unconfirmed | AI marked TC007 as FAIL because the wrong error was shown. | True FAIL status is masked by BUG-001 — API never called. Whether the server rejects duplicates is unknown. | AI correctly flagged this as blocked by BUG-001. Not an error. | ☐ Confirm / ☐ Reject |
| G-05 | Email partition EMAIL-I2/I3/I4 all showed same error | AI expected a specific email validation error for each. Actual: all showed *"Mật khẩu quá yếu!"* (password error). | All three are FAILs — but they fail because of BUG-001 masking, AND because BUG-002 (no email validation) exists. AI correctly identified BUG-002 from this observation. | No AI error — correct deduction. | ☐ Confirm / ☐ Reject |
| G-06 | BVA applied only to password length | AI skipped BVA for `name` and `email` due to no observable boundaries. | Correct per black-box rules. No HTML-level constraints observed. | Consistent application of BVA rules. If server-side constraints exist, they are not observable in black-box testing. | ☐ Confirm / ☐ Reject |
| G-07 | Missing test: SQL injection / XSS in name/email | No security test cases generated. | Not in scope for Domain Testing or BVA. | AI correctly stayed within the assigned techniques. Security testing is out of scope for this skill set. | ☐ Confirm / ☐ Reject |
| G-08 | Missing test: password with only spaces | PASS-I1 covers empty string. A password of only spaces (e.g., `"        "` — 8 spaces) would pass the `required` check and length check if not trimmed. | Not tested. | Possible edge case not covered. Whitespace-only password is a distinct invalid partition that could bypass the `required` validator. | ☐ Confirm / ☐ Reject |
| G-09 | No test for leading/trailing whitespace in email | Emails like ` user@example.com` (leading space) were not tested. | Not tested. | Minor omission — could be an edge case depending on how the server trims/normalises input. | ☐ Confirm / ☐ Reject |
| G-10 | `name` domain was under-partitioned | AI identified only 2 partitions for `name` (empty / non-empty). No maximum length, no special character, no Unicode tests. | Consistent with observable evidence — no constraints visible. No hallucinated rules were added. | AI correctly refused to invent constraints without evidence. If project spec adds constraints later, `name` partitioning should be updated. | ☐ Confirm / ☐ Reject |

---

## Potential Additional Test Cases (Proposed)

These are hypotheses not confirmed by the reviewer yet. Do not add to the test suite unless approved.

| Proposed TC | Partition | Rationale |
|------------|-----------|-----------|
| TC-NEW-01 | NAME whitespace-only | `name = "   "` — may bypass browser `required` check |
| TC-NEW-02 | PASS whitespace-only | `password = "        "` (8 spaces) — may bypass length check |
| TC-NEW-03 | EMAIL leading/trailing space | `email = " user@example.com"` — server normalisation |

---

## Summary

| Category | Count | Notes |
|---------|-------|-------|
| Missing test cases (confirmed gaps) | 0 confirmed | G-02, G-08, G-09 are candidate gaps — needs human approval |
| Incorrect assumptions | 0 | All assumptions were correctly flagged, not stated as facts |
| Hallucinated requirements | 0 | AI added no rules not present in the UI or spec |
| Incorrect expected results | 0 | Expected results matched the spec; SUT had the defects |
| Reasoning errors | 0 | BUG-001 masking was correctly identified |

**Overall AI quality assessment:** The AI-generated artifacts were accurate, evidence-based, and appropriately cautious. The main limitation was the inability to test beyond client-side behaviour due to BUG-001 blocking all API calls.

---

## Human Review Checklist

- [ ] G-02 (whitespace name): confirm or reject as in-scope gap
- [ ] G-08 (whitespace password): confirm or reject as in-scope gap
- [ ] G-09 (email with leading space): confirm or reject as in-scope gap
- [ ] Proposed TCs (TC-NEW-01/02/03): approve or reject for inclusion
- [ ] Overall gap analysis accepted
