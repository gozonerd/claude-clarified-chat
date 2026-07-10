---
title: "Opportunity Assessment — per-artifact schema spec"
filename: Opportunity_Assessment_Spec_2026-07-06_v01_I.md
schema_artifact: "1 of 8 (L1 Option-B set)"
mode_role: "all modes (framing)"
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 3 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
universal_frontmatter_blocks: [session_chain, disclosures, inputs_processed, persona_role_manifest, target_codebase, existing_bundle, effort_deadline_policy, convergence_counter_discipline]
---

# Opportunity Assessment — per-artifact schema spec

## Purpose

The Opportunity Assessment answers the question every mode asks before anything else gets
authored: **why this delta, now?** It is the market/user grounding for the change — the
Cagan-canon "problem worth solving" case, made explicit and falsifiable rather than assumed.
Per the LEAD (§3), this is schema **#1 of 8** in the L1 Option-B set, and it is the first
artifact touched regardless of which of the four modes (Greenfield / Improvement /
New-Feature / Staged Replacement) is dispatched — every mode needs a framing answer to "why,"
even a one-paragraph one for a small Mode-2 fix.

An Opportunity Assessment that cannot state a do-nothing cost is a request for change dressed
up as a plan. This schema exists so that cost is named, not implied.

## Core fields

| field | type | required? | description |
|---|---|---|---|
| `problem_statement` | string (prose, 1–5 sentences) | required | The problem in the user's or business's terms, not the solution's. States who experiences it and under what conditions. Must be falsifiable — a reader should be able to imagine evidence that would contradict it. |
| `evidence_pointers` | array of {source, type, summary, link_or_location} | required (≥1) | Concrete grounding for the problem statement: user reports, hostile-review findings, support tickets, usage data, a named prior incident, a stakeholder statement. `type` ∈ {user_report, data, incident, stakeholder_statement, competitive_signal, other}. At least one entry; empty array is a schema violation, not an NA. |
| `opportunity_sizing` | string or structured {metric, current, target, confidence} | required | The scale of the win if this delta ships — quantified where possible (affected users, error rate, time cost, revenue signal), qualitative-with-reasoning where not. Confidence is stated, not hidden inside a number. |
| `do_nothing_cost` | string (prose) | required | What happens if this is skipped — the counterfactual. Distinguishes "nice to have" from "actively costing us." Under-specification here is the single most common way weak proposals get through; this field exists to close that gap structurally. |
| `mode_context` | enum {greenfield, improvement, new_feature, staged_replacement} | required | Which of the 4 modes this assessment frames. Determines proportionality (see below) and which downstream schema (#3–#5) it feeds. |
| `proportionality_note` | string (1–2 sentences) | optional | A brief justification when the assessment is intentionally thin (e.g., a small Mode-2 fix where a full sizing analysis would be disproportionate). Absence is read as "full weight was appropriate here." |

## How it feeds its mode

The Opportunity Assessment is consumed by **every mode** as the framing artifact that licenses
everything downstream — it is read before, not instead of, the mode-specific input schema:

- **Mode 1 (Greenfield):** feeds the 20-track Stage-00 research as the founding rationale; thin assessments here are a red flag because greenfield has no existing system to fall back on for justification.
- **Mode 2 (Improvement / 00R):** typically the lightest instance — the problem is often already stated by a Findings Ledger entry (schema #3). The Opportunity Assessment here can be short, but `do_nothing_cost` still must be named per-finding-severity, not asserted generically.
- **Mode 3 (New-Feature / 00F):** feeds the Capability Spec's (schema #4) `capability_pr_faq` — the opportunity sizing here is the seed of the eventual PR/FAQ success metrics.
- **Mode 4 (Staged Replacement / 00S):** the do-nothing cost is usually the load-bearing field — it is what justifies cutover risk (schema #5, Cutover Plan) at all. A Mode-4 Opportunity Assessment with a weak `do_nothing_cost` should block progression to the Cutover Plan.

Across all modes, `opportunity_sizing` and `do_nothing_cost` are the two fields the Phased Plan
(schema #6) reads back when it justifies stage sequencing and prioritization against other work.

## Minimal example

```yaml
---
# universal frontmatter (ASAE-compatible; see LEAD §3)
session_chain: [session-uuid-of-authoring-session]
disclosures: []
inputs_processed: [prior-hostile-review-log.md]
persona_role_manifest: role-manifests/<authoring-persona>.yaml
target_codebase: mm-example-repo
existing_bundle: bundles/example-bundle_2026-07-06/
effort_deadline_policy: "standard — no external deadline pressure"
convergence_counter_discipline: "n/a at authoring time; tracked at Stage-QA"
---

# Opportunity Assessment: <short delta name>

problem_statement: >
  Instructional designers at underfunded NGOs cannot verify whether a generated
  lesson plan meets a named accessibility standard without a manual, hour-long
  review pass — the tool currently silently drops accessibility metadata.

evidence_pointers:
  - source: "hostile-review-log_2026-06-30"
    type: incident
    summary: "3 of 8 generated plans in the sample dropped alt-text fields on export."
    link_or_location: "mm-example-repo/docs/hostile-review-log_2026-06-30.md"
  - source: "user report, NGO pilot cohort"
    type: user_report
    summary: "Two designers independently flagged the same export gap in week-2 feedback."
    link_or_location: "feedback-tracker#142"

opportunity_sizing:
  metric: "% of exported plans retaining full accessibility metadata"
  current: "62%"
  target: "100%"
  confidence: "medium — sample size is 8 plans; broader audit not yet run"

do_nothing_cost: >
  Every week this ships un-fixed, an estimated 30-40% of exported plans require a
  manual accessibility remediation pass before they are usable by the pilot cohort,
  which is the exact manual burden the tool was built to remove.

mode_context: improvement

proportionality_note: >
  Full sizing run (not a stub) because this finding crosses a boundary the
  Findings Ledger flagged boundary_touch: true on — see D1 floor, Mode 2 escalation.
```

## Honest gaps

- **Sizing rigor is not standardized.** `opportunity_sizing` accepts both quantified and
  qualitative-with-reasoning forms; this schema does not yet specify a minimum evidentiary bar
  for when a qualitative sizing is acceptable versus when it should block progression. Left to
  author/reviewer judgment at Stage 3 ship time.
- **Interaction with `boundary_touch` (D1 interlock) is asserted, not enforced.** The
  `proportionality_note` field is where a Mode-2 Opportunity Assessment should acknowledge an
  escalation triggered by a Findings Ledger `boundary_touch: true`, but nothing in this schema
  cross-validates that the note is actually present when it should be — that check would live
  in tooling (a future linter), not in the schema itself.
- **No template file yet.** Per META-8 §5.2 layer 3, a per-schema template is created "as each
  schema is first authored." This spec doc defines the fields; the fillable template (parallel
  to `PRD_Template_*.md`) is a separate, not-yet-authored deliverable.
- **Cross-mode reuse is unverified in practice.** This spec claims one schema serves all four
  modes; that claim has not yet been stress-tested against a real Mode-1 vs. Mode-4 instance
  side by side. Flag for revisit once the SGWA worked examples (Stage 6) produce real instances.
