# GAP-01 - AI Gap Analysis
**Feature:** FR-03 - Forgot Password and Password Reset  
**Date:** 2026-07-07  
**Skill:** GAP-01  
**Input:** Reviewed DT/BVA artifacts, execution results, and bug reports

---

## Gap Analysis Table

| Issue | AI Output | Final Result | Cause |
|-------|-----------|--------------|-------|
| Incorrect valid-password assumption | DT-04 and BVA-01 used `StrongPass1!`, `Aa1!aaaa`, `Password1!`, and similar values as valid strong passwords because they satisfy the visible rule: length >= 8, uppercase, lowercase, digit, and special character. | Execution showed these passwords were rejected with the weak-password alert. BUG-001 was reported and then strengthened with BVA evidence. | The AI trusted the visible validation text and did not know the implemented client-side rule would reject normal special characters. This is a mismatch between visible requirement and implementation behavior. |
| Token-domain tests masked by password validation | DT-TC006 through DT-TC009 were designed to test incorrect token, token/email mismatch, non-numeric token, and wrong-length token using `StrongPass1!` as the otherwise-valid password. | The UI rejected the password before token validation could be observed. These cases failed, but their actual result did not confirm token-domain behavior. | Dependency interaction between `resetToken` and `newPassword`: an earlier client-side password check blocked the intended token validation path. |
| Token BVA cases partially inconclusive | BVA-TC012, BVA-TC014, and BVA-TC015 were designed to clarify token length boundaries 3, 5, and 6 using `Aa1!aaaa` as a valid password. | These cases did not reset the password, but the actual visible reason was again the weak-password alert, so token length behavior remains only partially confirmed. | Same masking issue as above. The AI selected a boundary-valid password according to the stated rule, but the SUT rejected it before token logic. |
| OTP length conflict remains unresolved | DT-01 through BVA-01 correctly documented the UI/API conflict: UI says 4 digits, API example shows 6 digits. BVA included length 3, 4, 5, and 6 cases. | The successful OTP observations showed 4-digit tokens, but the wrong-length negative tests were masked by password validation. | Feature complexity and inconsistent artifacts. Full resolution requires either fixing BUG-001 or finding a password accepted by the UI and then rerunning token boundary cases. |
| Backend password enforcement not isolated | DT-01 and DT-02 listed the question of whether password complexity is enforced by UI, backend, or both. | Execution mainly confirmed UI-side rejection. It did not isolate backend acceptance/rejection for weak passwords via direct API calls. | The workflow prioritized UI feature execution. Additional API-only tests would be needed to answer backend enforcement precisely. |
| Email format behavior only partly clarified | DT-03 marked malformed email as an invalid candidate. DT-TC004 tested `not-an-email`. | The malformed email did not produce a token, but the actual reason was `User not found`, not explicit format validation. | The backend/UI appears to treat malformed input as an account lookup value. More email-format variants would be needed to prove whether any format validation exists. |
| Missing retest after defect discovery | BUG-001 notes that token behavior should be retested after fixing password validation or finding an accepted valid password. | Retest was not performed in this workflow step because each skill must execute only once per response and the next workflow step is report generation. | Workflow sequencing constraint and defect blocking downstream validation. |

---

## Incorrect Assumptions

| Assumption | Why It Was Incorrect or Incomplete | Corrected Understanding |
|------------|------------------------------------|-------------------------|
| A password containing `!` should be accepted as satisfying the special-character rule. | The UI rejected multiple passwords containing `!`, including `StrongPass1!` and `Password1!`. | The stated rule and implementation disagree. Treat this as BUG-001, not as a valid-password assumption. |
| Token validation can be observed by using any strong-looking password as the non-token control value. | Password validation ran first and blocked token validation. | Token tests require a password value actually accepted by the UI or direct API-level testing. |
| Token length BVA can be resolved through UI tests immediately. | UI tests were blocked by password validation. | Token length remains an open follow-up after password validation is unblocked. |

---

## Missing or Deferred Test Cases

| Missing / Deferred Case | Reason Deferred | Suggested Follow-up |
|-------------------------|-----------------|---------------------|
| API-only weak password reset with valid token | Current execution focused on UI flow. | Use `POST /api/reset-password` directly with weak passwords to determine whether backend enforces password complexity. |
| Token length 3/5/6 with a UI-accepted password | No known UI-accepted password satisfying the documented rule after BUG-001. | After fixing BUG-001 or identifying accepted password format, rerun token BVA cases. |
| Token/email mismatch with a UI-accepted password | Masked by BUG-001 in DT-TC007. | Rerun after password issue is resolved. |
| Token reuse / single-use behavior | DT-01 listed token expiry/single-use as an open question, but DT-04 prioritized core partitions first. | Add a state-based test: reset once with a token, then attempt reset again with the same token. |
| Multiple malformed email formats | DT-TC004 used only `not-an-email`. | Add examples such as `user@`, `@domain.com`, and whitespace-only values if broader email-format coverage is required. |

---

## Lessons for AI-Assisted Testing

- Visible requirements must be validated against implementation behavior before using them as stable test oracles.
- When a test has multiple dependent inputs, the non-target inputs must be known-good in the actual SUT, not just theoretically valid.
- A failed test can reveal a real bug while still failing to exercise the intended partition; this should be recorded as masking rather than over-interpreted.
- Confirmation-needed domains are useful, but execution results must distinguish "safe non-reset" from "correct validation reason."

---

## Human Review Checklist

- [x] Missing and deferred test cases identified.
- [x] Incorrect assumptions documented.
- [x] Hallucinated or unsupported certainty corrected.
- [x] Causes explained.
- [x] Follow-up testing needs recorded.
