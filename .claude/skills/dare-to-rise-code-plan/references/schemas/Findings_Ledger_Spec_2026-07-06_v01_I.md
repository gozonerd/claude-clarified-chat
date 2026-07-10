---
title: "Findings Ledger — per-artifact schema spec"
filename: Findings_Ledger_Spec_2026-07-06_v01_I.md
schema_artifact: "3 of 8 (L1 Option-B set)"
mode_role: "Mode 2 · Improvement (findings-driven) — 00R input"
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 3 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
universal_frontmatter_blocks: [session_chain, disclosures, inputs_processed, persona_role_manifest, target_codebase, existing_bundle, effort_deadline_policy, convergence_counter_discipline]
d1_ruling_applied: true
session_chain:
  - kind: external
    path: docs/Unified_4-Mode_Proposal_LEAD_2026-07-02_v03_I.md
    relation: "L1 locks the 8-schema Option-B set (§3, artifact #3, Findings Ledger); §2 Mode-2 row + §5.2 name Findings Ledger as the 00R delta-origin input."
  - kind: external
    path: docs/FORK-A_Rulings_and_Execution_Spec_2026-07-03_v01_I.md
    relation: "D1 ruling (§2, §3.1) — Findings Ledger is where the Mode-2 'light-with-guard' floor is encoded via the boundary_touch flag."
  - kind: sibling
    path: skills/dare-to-rise-code-plan/references/schemas/Capability_Spec_2026-07-06_v01_I.md
    relation: "Schema #4 of 8 — authored as a pair with this doc; both carry D1's two-place encoding of the architecture-fit floor (guard here, mandatory block there)."
disclosures:
  compliance_claims: [none: true]
  shipping_attestation: [none: true]
  known_issues: []
  deviations_from_canonical: []
inputs_processed:
  - source: docs/Unified_4-Mode_Proposal_LEAD_2026-07-02_v03_I.md
    processed: yes
    extracted: "L1 artifact table row 3 field list (findings[] with id, severity, source, verification_status, fix_stage_mapping, sources_of_findings, tier, risk_accept_authority, re_test_method); §5.2 00R track additions (per-finding verification protocol, regression-surface mapping, fix-blast-radius analysis)."
    influenced: "Core fields §below."
  - source: docs/FORK-A_Rulings_and_Execution_Spec_2026-07-03_v01_I.md
    processed: yes
    extracted: "D1 ruling text (§2, §3.1): 'Mode 2 (00R): light-with-guard... unless the fix crosses a module/interface boundary -> then it escalates'; boundary_touch is 'derivable from the existing fix-blast-radius track'."
    influenced: "## D1 field section; the boundary_touch flag definition and escalation semantics."
persona_role_manifest:
  path: role-manifests/claudette-claudemilla-goldseam.yaml
  loaded_at_authoring: yes
target_codebase: "mm-d2r-fork-a (D2R Code Plan Stack v03, FORK-A build) — consumed by any repo running dare-to-rise-code-plan Mode 2"
existing_bundle: "Consumed alongside the on-demand-required 6-doc bundle per §5.0 Mode-2 input gate; missing Findings Ledger -> refuse with pointer to its authoring path"
effort_deadline_policy: "No fixed deadline; gated by Stage-3 schema-authoring completion and META-8 cascade attestation before Stage 9 dare-to-rise-code-plan can dispatch Mode 2 against this schema"
convergence_counter_discipline: "This spec is author-drafted (TESS-T1 Sonnet under Opus persona); it is NOT a convergence-counted artifact — convergence counting applies to ASAE gate rating, not to per-artifact schema authoring drafts"
---

# Findings Ledger — per-artifact schema spec

## Purpose

The Findings Ledger is the Mode-2 (Improvement, findings-driven) delta-origin input. It answers:
*what is wrong, how do we know, and is it still true?* Per the LEAD (§3, artifact #3), it carries
the **00R trichotomy** — every finding's verification status is exactly one of STILL-PRESENT,
REMEDIATED-INCIDENTALLY, or SCOPE-CHANGED — so that Mode 2 never plans a fix against a finding
that has already resolved itself, silently mutated, or gone stale between the hostile review that
raised it and the sprint that addresses it.

**FORK-A D1 ruling — the Mode-2 floor.** D1 rules that architecture-fit analysis is *never
skipped* across any brownfield mode, but is sized to a per-mode floor. Mode 2's floor is
**light-with-guard**: 00R's architecture-fit pass stays deliberately light by default (most
findings are local fixes; a full AVD-equivalent analysis on every bug ticket would be
disproportionate bureaucracy) — *unless* the fix crosses a module/interface boundary, in which
case it escalates. The Findings Ledger is where that guard lives structurally, as the
`boundary_touch` field (see ## D1 field below), not as an unwritten judgment call left to whoever
plans the fix.

## Core fields

| field | type | required? | description |
|---|---|---|---|
| `findings[]` | array of finding objects | required (≥1) | The ledger body. Each entry is one discrete finding; an empty array is a schema violation (Mode 2 exists to have something to fix), not a valid "clean bill of health" state. |
| `findings[].id` | string (stable identifier) | required | Unique, stable across ledger revisions — referenced by fix stages, gate logs, and re-test results. Never reused after a finding closes. |
| `findings[].severity` | enum {critical, high, medium, low} | required | Drives `tier` and `risk_accept_authority` (below) and fix-stage sequencing priority. |
| `findings[].source` | enum {hostile-review, gate-log, user-report} | required | Where the finding originated. Distinguishes adversarially-discovered issues from operational gate failures from field reports — different sources carry different re-test obligations. |
| `findings[].verification_status` | enum {STILL-PRESENT, REMEDIATED-INCIDENTALLY, SCOPE-CHANGED} | required | The 00R trichotomy. STILL-PRESENT = confirmed reproducible now; REMEDIATED-INCIDENTALLY = fixed as a side effect of unrelated work since the finding was raised (close with a note, do not plan a fix stage); SCOPE-CHANGED = the underlying code/feature it targeted no longer exists or has changed shape enough that the finding must be re-scoped before it can be actioned. |
| `findings[].fix_stage_mapping` | string or null (stage ref, e.g. `02R-04`) | required (null until planned) | Which 02R-NN fix stage owns remediation. Null is valid pre-Stage-01R planning; a STILL-PRESENT finding must not reach Stage 02R execution with this still null. |
| `findings[].sources_of_findings` | array of strings (provenance detail) | required | Fuller provenance than `source`'s enum bucket — e.g. specific reviewer, gate name + run id, ticket link. Supports re-verification and disputes about whether a finding is legitimately closed. |
| `findings[].tier` | enum or string (severity/effort tier per canonical taxonomy) | required | The canonical tiering this finding is rated at (aligns to the repo's ASAE/gate tier vocabulary) — used for risk-acceptance routing and reporting roll-ups. |
| `findings[].risk_accept_authority` | string (role or name) | required for any finding NOT going to fix stage | Who is authorized to accept the residual risk if this finding is deliberately not fixed (e.g., accepted-as-is, deferred). Required whenever `fix_stage_mapping` will remain permanently null by decision rather than by not-yet-planned. |
| `findings[].re_test_method` | string (prose or structured) | required | How closure is verified after the fix stage runs — the concrete re-test, not just "QA will check." Feeds QA-R's "verify per-finding closure substance" pass. |
| `findings[].boundary_touch` | boolean | required (FORK-A D1 addition) | See ## D1 field below. |

## How it feeds its mode

The Findings Ledger is the primary input to **00R** (`dare-to-rise-code-plan` §5.2, Mode-2 row):
00R runs the per-finding verification protocol directly against `findings[].verification_status`,
resolving each STILL-PRESENT finding into planning scope, closing REMEDIATED-INCIDENTALLY findings
with a note, and routing SCOPE-CHANGED findings back for re-scoping before they can be planned.
Stage 01R ("plan from Findings Ledger Section B") consumes the resolved STILL-PRESENT subset plus
`fix_stage_mapping` to produce the `02R-NN` per-finding fix-stage sequence. `tier` and
`risk_accept_authority` feed risk-acceptance reporting for any finding that will not receive a fix
stage. `re_test_method` feeds QA-R's closure-verification pass at the end of the Mode-2 run. Per
§5.0's input gate, Mode 2 cannot dispatch without either an existing bundle (on-demand-required)
or a present Findings Ledger — a Findings Ledger is always required; the bundle is required only
on demand.

## D1 field

**Field: `findings[].boundary_touch` (boolean, per finding).**

**Semantics.** Set `true` when the finding's fix crosses a module/interface boundary — i.e., the
remediation cannot be contained inside a single component's internals and instead touches how two
or more components, services, or public interfaces interact. This value is **derivable from the
existing fix-blast-radius track** (§5.2's 00R addition) rather than a separate judgment call
invented for this field: whoever runs the fix-blast-radius analysis for a finding already has the
information needed to set this flag honestly. Set `false` when the fix is fully local (internal to
one module, no interface/contract change visible outside it).

**Effect.** When `boundary_touch = true`, Mode 2's Stage-00 (00R) **escalates** architecture-fit
analysis for that specific finding — the light-by-default floor lifts for this finding only, and
00R runs a substantive fit-vs-existing-architecture pass on it (proportionate to the boundary
crossed, not automatically to Mode 3's full substantive-by-default depth, but materially more than
the light default). This is the FORK-A D1 "guard" mechanism for Mode 2: light-with-guard means
"light, unless this trips" — `boundary_touch` is the trip wire, made a first-class, queryable
schema field rather than left to be remembered.

**Why per-finding, not per-ledger.** A single Findings Ledger commonly mixes trivial local fixes
with one or two boundary-crossing ones. Flagging at the ledger level would either over-escalate
every finding in the batch or under-escalate the one that actually needs it. Per-finding scoping
keeps the floor proportionate finding-by-finding, which is the entire point of D1's "proportionate,
never skipped" design.

**Non-optionality.** `boundary_touch` is required on every finding, not just ones the author
suspects matter — an unset or missing flag on a STILL-PRESENT finding is a schema violation, since
00R has no way to decide whether to escalate without it.

## Minimal example

```yaml
findings:
  - id: F-2026-0091
    severity: high
    source: hostile-review
    verification_status: STILL-PRESENT
    fix_stage_mapping: 02R-03
    sources_of_findings: ["gate-9 strict-5 review, finding #4"]
    tier: T2
    risk_accept_authority: null
    re_test_method: "re-run strict-5 hostile review targeting this finding only; must convert to REMEDIATED"
    boundary_touch: true    # fix changes the public contract between auth service and session store
  - id: F-2026-0092
    severity: low
    source: user-report
    verification_status: REMEDIATED-INCIDENTALLY
    fix_stage_mapping: null
    sources_of_findings: ["support ticket #4471"]
    tier: T4
    risk_accept_authority: null
    re_test_method: "confirmed resolved by unrelated dependency bump in gate-8; closed with note"
    boundary_touch: false
  - id: F-2026-0093
    severity: medium
    source: gate-log
    verification_status: SCOPE-CHANGED
    fix_stage_mapping: null
    sources_of_findings: ["commit-msg-v10 Tier 13 log, run 2026-06-30"]
    tier: T3
    risk_accept_authority: "Krystal (pending re-scope)"
    re_test_method: "re-scope required before a re-test method can be specified"
    boundary_touch: false   # cannot be assessed meaningfully until re-scoped; conservative default, revisit at re-scope
```

## Honest gaps

- `boundary_touch`'s "derivable from fix-blast-radius" claim assumes the fix-blast-radius track
  produces output specific enough to answer a boundary-crossing yes/no cleanly. Where blast-radius
  analysis is itself vague or contested, setting this flag becomes a judgment call again — this
  spec does not yet define a tie-breaking rule for that case.
- The example above sets `boundary_touch: false` on a SCOPE-CHANGED finding as a conservative
  default pending re-scope; whether that default should instead be `true` (escalate until proven
  local) is a real open question this spec flags rather than resolves.
- What "substantive, proportionate to the boundary crossed" concretely looks like for an escalated
  finding (checklist? required sections? sign-off?) is deferred to the companion Mode-2 spec doc
  (Stage 4, per FORK-A §3.1) — this schema names the trigger, not the escalated procedure itself.
