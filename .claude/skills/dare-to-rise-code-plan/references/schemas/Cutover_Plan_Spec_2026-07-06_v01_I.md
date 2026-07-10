---
title: "Cutover Plan — per-artifact schema spec"
filename: Cutover_Plan_Spec_2026-07-06_v01_I.md
schema_artifact: "5 of 8 (L1 Option-B set)"
mode_role: "Mode 4 · Staged Replacement (00S input)"
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 3 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
universal_frontmatter_blocks: [session_chain, disclosures, inputs_processed, persona_role_manifest, target_codebase, existing_bundle, effort_deadline_policy, convergence_counter_discipline]
session_chain:
  - kind: external
    path: docs/Unified_4-Mode_Proposal_LEAD_2026-07-02_v03_I.md
    relation: "L1 locks the 8-schema Option-B set (§ artifact table, row 5, Cutover Plan); §5 Mode-4 row names Cutover Plan as the 00S delta-origin input."
  - kind: sibling
    path: skills/dare-to-rise-code-plan/references/schemas/Phased_Plan_Spec_2026-07-06_v01_I.md
    relation: "Schema #6 of 8 — every Cutover Plan's cutover_events[] is executed through a Phased Plan; the two are authored as a pair for any Mode-4 run."
disclosures:
  compliance_claims: [none: true]
  shipping_attestation: [none: true]
  known_issues: []
  deviations_from_canonical: []
inputs_processed:
  - source: docs/Unified_4-Mode_Proposal_LEAD_2026-07-02_v03_I.md
    processed: yes
    extracted: "L1 artifact table row 5 field list (OLD/NEW state models, cutover events[], routing/gateway plan, data-consistency checks, rollback-per-event); §5 Mode-4 row (00S track, EV stage)."
    influenced: "Core fields §below; the FORK-A D1-adjacent floor ruling in Purpose."
persona_role_manifest:
  path: role-manifests/claudette-claudemilla-goldseam.yaml
  loaded_at_authoring: yes
target_codebase: "mm-d2r-fork-a (D2R Code Plan Stack v03, FORK-A build) — consumed by any repo running dare-to-rise-code-plan Mode 4"
existing_bundle: "Required alongside the 6-doc bundle (PRD/TRD/AVD/TQVCD/UXD/PSCAD) per §5.0 Mode-4 input gate; missing bundle or missing Cutover Plan -> refuse with authoring pointer"
effort_deadline_policy: "No fixed deadline; gated by Stage-3 schema-authoring completion and META-8 cascade attestation before Stage 9 dare-to-rise-code-plan can dispatch Mode 4 against this schema"
convergence_counter_discipline: "This spec is author-drafted (TESS-T1 Sonnet under Opus persona); it is NOT a convergence-counted artifact — convergence counting applies to ASAE gate rating, not to per-artifact schema authoring drafts"
---

# Cutover Plan — per-artifact schema spec

## Purpose

The Cutover Plan is the Mode-4 (Staged Replacement / industry strangler-fig migration) delta-origin
input. It answers: *what exists today, what replaces it, and how does the system move from one to
the other without ever being in an inconsistent or unrecoverable state?*

**FORK-A D1 ruling — the non-negotiable floor.** Regardless of how small the component being
replaced looks, the OLD-state model, the NEW-state model, and the invariant/data-consistency
checks that prove the system never violates its own contracts mid-migration are **mandatory,
every time**. There is no "lightweight cutover" tier. The ruling's own words: *"cutover IS
architecture surgery, there is no small version."* Mode 4's Stage-00 track (00S) always runs
brownfield-assess + cutover-readiness + OLD/NEW state analysis at full depth — this is the one
place in the 4-mode design where component size does NOT modulate spec depth (contrast Phased
Plan's `spec_depth` field, schema #6, which DOES flex by world-openness/size elsewhere in the
stack). A Cutover Plan that skips OLD/NEW modeling because "it's just a small service swap" is not
an abbreviated Cutover Plan — it is a missing one, and Mode 4's input gate (§5.0) must refuse it.

## Core fields

| field | type | required? | description |
|---|---|---|---|
| `OLD_state_model` | object (state-machine or component-graph description) | required, always | The system as it exists now: components, data stores, contracts/invariants it currently upholds, and the traffic/data paths that touch it. Must be concrete enough that a reviewer can tell what breaks if a step is skipped. |
| `NEW_state_model` | object (state-machine or component-graph description) | required, always | The target system after cutover completes: same shape as `OLD_state_model` so the two can be diffed field-for-field. Must state which invariants carry over unchanged, which are relaxed, and which are newly introduced. |
| `cutover_events[]` | array of event objects | required, always; ≥1 entry | The interleaved sequence of ADDED/REMOVED actions that walks the system from OLD to NEW. Each entry: `{ event_id, type: ADDED\|REMOVED, target_component, description, precondition, postcondition, owning_stage_ref }`. Events are interleaved (not "add everything, then remove everything") specifically so the system is never left half-migrated with no rollback path — see `rollback_per_event`. |
| `routing_gateway_plan` | object | required, always | How live traffic/data is routed during the migration window: gateway/proxy/feature-flag mechanism, percentage or cohort-based routing rules per `cutover_events[]` stage, and the specific mechanism that flips a route from OLD to NEW (and back). |
| `data_consistency_checks` | array of check objects | required, always; ≥1 entry per invariant carried over from `OLD_state_model` | Per-invariant verification that data written/read during the migration window remains consistent across OLD and NEW simultaneously-live paths. Each entry: `{ check_id, invariant_ref, verification_method, run_cadence (continuous \| per-event \| pre/post), owning_TQVCD_VC_ref }`. This is the field the D1 floor ruling is most protective of — cutovers fail in production almost exclusively here. |
| `rollback_per_event` | array, 1:1 with `cutover_events[]` | required, always | For every single cutover event, the exact reversal action, its precondition (what must be true to safely roll back), and its own postcondition. No event may ship without a paired rollback — "we'll just roll back the whole migration" is not an acceptable substitute for per-event rollback. |

## How it feeds its mode

The Cutover Plan is the **00S** Stage-00 track's primary input for Mode 4 (`dare-to-rise-code-plan`
§5, Mode 4 column): 00S runs brownfield-assess + cutover-readiness + OLD/NEW state analysis
directly against `OLD_state_model` / `NEW_state_model`. Stage 01S ("plan of interleaved cutover
events") consumes `cutover_events[]` + `rollback_per_event` verbatim to produce the executable
sequence, which is then handed to a **Phased Plan** (schema #6) for stage-by-stage
model-assignment and spec-depth. `routing_gateway_plan` and `data_consistency_checks` feed the
EV (Environment-Verification) stage's baseline-ledger checks and, downstream, TQVCD verification
coverage entries (`owning_TQVCD_VC_ref`). Per §5.0's input gate, Mode 4 cannot dispatch without a
present Cutover Plan — a missing one is a hard refuse, not a soft warning.

## Minimal example

```yaml
OLD_state_model:
  components: [LegacyAuthService]
  invariants: ["session token valid for 24h", "one active session per user"]
NEW_state_model:
  components: [NewAuthService, SessionBroker]
  invariants: ["session token valid for 24h", "one active session per user", "token rotation on refresh"]
cutover_events:
  - event_id: CO-01
    type: ADDED
    target_component: NewAuthService
    description: "Deploy NewAuthService dark (no live traffic)"
    precondition: "LegacyAuthService healthy"
    postcondition: "NewAuthService passes smoke suite"
    owning_stage_ref: 01S-01
  - event_id: CO-02
    type: ADDED
    target_component: routing_gateway
    description: "Route 5% canary cohort to NewAuthService"
    precondition: CO-01 postcondition met
    postcondition: "canary error rate <= baseline"
    owning_stage_ref: 01S-02
  - event_id: CO-03
    type: REMOVED
    target_component: LegacyAuthService
    description: "Decommission LegacyAuthService after 100% cutover + soak"
    precondition: "100% traffic on NewAuthService for 7 days, zero invariant violations"
    postcondition: "LegacyAuthService undeployed"
    owning_stage_ref: 01S-05
routing_gateway_plan:
  mechanism: feature-flag-cohort-router
  stages: ["0% (dark)", "5% canary", "50%", "100%"]
data_consistency_checks:
  - check_id: DC-01
    invariant_ref: "one active session per user"
    verification_method: "dual-write comparator, both paths, per-request diff"
    run_cadence: continuous
    owning_TQVCD_VC_ref: TQVCD-VC-14
rollback_per_event:
  - event_id: CO-02
    reversal_action: "flip router cohort back to 0%"
    precondition: "canary error rate breach detected"
    postcondition: "100% traffic back on LegacyAuthService"
  - event_id: CO-03
    reversal_action: "redeploy LegacyAuthService from last-known-good image"
    precondition: "soak-period regression discovered post-decommission"
    postcondition: "LegacyAuthService serving again, NewAuthService traffic paused"
```

## Honest gaps

- The D1 "no small version" floor is stated here as authored-and-locked (per the FORK-A ruling
  record); this spec does not itself re-litigate it, but it also has not yet been pressure-tested
  against a genuinely trivial single-file swap — that edge case is deferred to the first real
  Mode-4 run for empirical feedback, not resolved here.
- `owning_TQVCD_VC_ref` assumes a TQVCD entry already exists for every carried-over invariant;
  where the invariant is NEW (introduced only in `NEW_state_model`), the authoring flow for minting
  a fresh TQVCD-VC entry mid-Cutover-Plan-authorship is not yet specified — likely a
  `/ideate-to-d2r-ready` alignment-chain addition, flagged for Stage 9.
- This spec does not yet define what happens when `data_consistency_checks` disagree with each
  other (two checks reporting contradictory drift) — a conflict-resolution rule is not authored.
