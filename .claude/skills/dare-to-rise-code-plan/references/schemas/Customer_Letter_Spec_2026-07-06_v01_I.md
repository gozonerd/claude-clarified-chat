---
title: "Customer Letter — per-artifact schema spec"
filename: Customer_Letter_Spec_2026-07-06_v01_I.md
schema_artifact: "2 of 8 (L1 Option-B set)"
mode_role: "all modes (intent)"
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 3 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
universal_frontmatter_blocks: [session_chain, disclosures, inputs_processed, persona_role_manifest, target_codebase, existing_bundle, effort_deadline_policy, convergence_counter_discipline]
---

# Customer Letter — per-artifact schema spec

## Purpose

The Customer Letter answers the question the Opportunity Assessment (schema #1) does not:
**what does it feel like when this is done?** It is outcome-as-narrative, in the
working-backwards tradition (Amazon-style future-state press-release / internal FAQ lineage,
Cagan-canon "acceptance from the user's chair"). Per the LEAD (§3), this is schema **#2 of 8**
in the L1 Option-B set, and like the Opportunity Assessment it is read by **all four modes** —
it carries *intent*, where schema #1 carries *justification*.

Where the Opportunity Assessment is analytic (problem, evidence, sizing, cost), the Customer
Letter is narrative and written from the outside-in: a real user or stakeholder describing the
world after the delta ships, in their own words, as if writing back to say it worked. This
structural discipline — write the ending first — is what prevents a plan from drifting into
solving a problem nobody asked for.

## Core fields

| field | type | required? | description |
|---|---|---|---|
| `narrative_letter` | string (prose, 1–2 paragraphs) | required | The working-backwards letter itself: written in first person from the user/customer's voice, past tense, describing the outcome as already real. Not a feature list — a lived account of the "after." |
| `user_visible_outcome` | string (prose, 1–3 sentences) | required | The concrete, observable thing that changed for the user — stripped of internal implementation language. If an engineer could not verify this by watching the user's screen, it is not user-visible. |
| `acceptance_from_users_chair` | array of {criterion, how_verified} | required (≥1) | The acceptance criteria restated in the user's own terms and verification method — not "endpoint returns 200," but "the designer sees the accessibility badge before export, every time." Each criterion names how a person (not a test suite) would confirm it. |
| `who_is_writing` | string | required | Names the persona/role the letter is voiced as (e.g., "an instructional designer at an underfunded NGO pilot site"). Keeps the letter grounded in a specific reader rather than a generic "the user." |
| `what_would_disappoint` | string (prose, optional but recommended) | optional | The negative space — what a shipped-but-hollow version of this would look like from the same voice. Cheap to write, catches "shipped the feature, missed the point" drift early. |
| `mode_context` | enum {greenfield, improvement, new_feature, staged_replacement} | required | Which of the 4 modes this letter frames; determines how literally "the customer" is read (end-user vs. internal team vs. downstream consumer of a deprecated interface). |

## How it feeds its mode

The Customer Letter is consumed by **every mode** as the intent artifact — it is the check
against which "does this actually solve the thing" is asked at Stage-QA, independent of
whether the acceptance criteria in a downstream schema were technically met:

- **Mode 1 (Greenfield):** the letter is often the earliest artifact written, ahead of any code — it disciplines the 20-track Stage-00 research toward a real outcome instead of a feature checklist.
- **Mode 2 (Improvement / 00R):** the letter's voice is usually the person who filed the original finding; `what_would_disappoint` is especially load-bearing here, since a "fix" that resolves the ticket without addressing the lived problem is the classic Mode-2 failure mode.
- **Mode 3 (New-Feature / 00F):** feeds directly into the Capability Spec's (schema #4) `capability_pr_faq` — the Customer Letter is the narrative seed the PR/FAQ formalizes; `acceptance_from_users_chair` here should be traceable 1:1 into that spec's `acceptance_criteria_summary`.
- **Mode 4 (Staged Replacement / 00S):** `who_is_writing` is often a downstream system or internal team rather than an end-user — the letter still applies, but "acceptance from the user's chair" may mean "the on-call engineer notices nothing during cutover." This is a legitimate mode-specific reading, not a schema violation.

At Stage-QA, every mode's convergence check re-reads the Customer Letter against the shipped
result as a sanity check independent of the technical acceptance criteria — a plan can pass
every listed criterion in schema #3/#4/#5 and still fail this read if the letter's outcome
was never actually delivered.

## Minimal example

```yaml
---
# universal frontmatter (ASAE-compatible; see LEAD §3)
session_chain: [session-uuid-of-authoring-session]
disclosures: []
inputs_processed: [opportunity-assessment_2026-07-06.md]
persona_role_manifest: role-manifests/<authoring-persona>.yaml
target_codebase: mm-example-repo
existing_bundle: bundles/example-bundle_2026-07-06/
effort_deadline_policy: "standard — no external deadline pressure"
convergence_counter_discipline: "re-read at Stage-QA as an independent outcome check"
---

# Customer Letter: <short delta name>

who_is_writing: "an instructional designer at an underfunded NGO pilot site"

narrative_letter: >
  I exported twelve lesson plans this week for our district review, and for the
  first time I didn't have to open each one afterward to check whether the
  alt-text survived. The export screen showed me, before I even clicked
  "download," which plans were fully accessible and which weren't — so the one
  plan that was missing a diagram description got caught before it reached the
  reviewer, not after. That used to be an hour of manual checking every Friday.
  Now it's a glance.

user_visible_outcome: >
  The export screen displays an accessibility-completeness indicator per plan
  before download, and blocks silent metadata loss on export.

acceptance_from_users_chair:
  - criterion: "Designer sees a pass/fail accessibility indicator before every export."
    how_verified: "Manual walkthrough: export 5 plans, confirm indicator shown each time."
  - criterion: "No plan with dropped alt-text metadata reaches the reviewer un-flagged."
    how_verified: "Re-run the hostile-review sample of 8 plans; 0 silent drops."

what_would_disappoint: >
  If the indicator existed but only flagged failures after the file already
  downloaded, or only checked alt-text and not other accessibility fields, this
  would still feel like busywork moved one screen over rather than removed.

mode_context: improvement
```

## Honest gaps

- **No enforced traceability into downstream acceptance criteria.** The spec asserts
  `acceptance_from_users_chair` should map 1:1 into the Capability Spec's
  `acceptance_criteria_summary` (Mode 3) or the Findings Ledger's fix-verification (Mode 2), but
  nothing here mechanically checks that mapping — it is an authoring discipline, not a
  structural guarantee, until a linter exists.
- **Voice authenticity is unverifiable at authoring time.** `who_is_writing` names a persona,
  but there is no requirement that the letter be reviewed by an actual member of that persona's
  group before the plan proceeds. For high-stakes deltas this is a real gap — the letter could
  be a well-written guess rather than a grounded account.
- **`what_would_disappoint` is optional, which weakens it.** It is one of the more useful
  fields for catching hollow implementations, but making it optional means it will be the first
  field skipped under time pressure — exactly when it is most needed. Revisit whether it should
  be required-with-NA-justification instead, matching the PRD template's NA convention.
- **No template file yet.** Per META-8 §5.2 layer 3, a per-schema template is created "as each
  schema is first authored." This spec doc defines the fields; the fillable template is a
  separate, not-yet-authored deliverable.
