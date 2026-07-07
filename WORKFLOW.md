# WORKFLOW.md

# HW02 AI Workflow

This workflow orchestrates the skills defined in `SKILLS.md`.

## Feature Inputs

[INPUT FEATURE INPUTS HERE (HUMAN)]

---

## Workflow

Execute the following skills **one at a time**, in order.

```
ENV-01
↓
DT-01
↓
REVIEW-01
↓
DT-02
↓
REVIEW-01
↓
DT-03
↓
REVIEW-01
↓
DT-04
↓
EXEC-01
↓
BUG-01
↓
BVA-01
↓
EXEC-01
↓
BUG-01
↓
GAP-01
↓
REPORT-01
↓
AUDIT-01
```

---

## Rules

- Follow the procedures defined in `SKILLS.md`.
- Execute only **one skill** per response.
- Wait for user confirmation before continuing.
- Before executing a skill, load any existing artifacts under:

```
tests/FR{feature}/
bugs/FR{feature}/
```

and reuse them whenever possible.
- Save newly generated artifacts back to the appropriate folder.
- Treat the SUT as a **black-box**. Never assume or rely on implementation details that are not externally observable.
- If required information cannot be observed from the UI or user-provided artifacts, ask the user to provide additional evidence instead of making assumptions.
