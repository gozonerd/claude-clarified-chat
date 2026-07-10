---
title: "Phased Plan — per-artifact schema spec"
filename: Phased_Plan_Spec_2026-07-06_v01_I.md
schema_artifact: "6 of 8 (L1 Option-B set)"
mode_role: "shared across brownfield modes (2, 3, 4)"
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 3 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
universal_frontmatter_blocks: [session_chain, disclosures, inputs_processed, persona_role_manifest, target_codebase, existing_bundle, effort_deadline_policy, convergence_counter_discipline]
session_chain:
  - kind: external
    path: docs/Unified_4-Mode_Proposal_LEAD_2026-07-02_v03_I.md
    relation: "L1 locks the 8-schema set (row 6, Phased Plan); L9 locks model-assignment-by-world-openness (§5.3); §5 mode table names the per-mode 02X-NN stage tracks this schema executes into."
  - kind: sibling
    path: skills/dare-to-rise-code-plan/references/schemas/Cutover_Plan_Spec_2026-07-06_v01_I.md
    relation: "Schema #5 of 8 — a Mode-4 Cutover Plan's cutover_events[] are executed through a Phased Plan; authored as a pair for Mode 4. Modes 2/3 feed their own delta plans (Findings Ledger / Capability Spec) into a Phased Plan the same way."
disclosures:
  compliance_claims: [none: true]
  shipping_attestation: [none: true]
  known_issues: []
  deviations_from_canonical: []
inputs_processed:
  - source: docs/Unified_4-Mode_Proposal_LEAD_2026-07-02_v03_I.md
    processed: yes
    extracted: "L9 (model assignment by world-openness, Sonnet floor for open-world); §5.3 (closed-world=Haiku, open-world=Sonnet floor, planning=Opus); §5 mode table's 02X-NN stage-track naming."
    influenced: "stages[].model_assignment field definition; the world-openness classification rule in Purpose."
persona_role_manifest:
  path: role-manifests/claudette-claudemilla-goldseam.yaml
  loaded_at_authoring: yes
target_codebase: "mm-d2r-fork-a (D2R Code Plan Stack v03, FORK-A build) — consumed by any repo running dare-to-rise-code-plan Mode 2, 3, or 4"
existing_bundle: "Required alongside whichever mode-specific delta artifact (Findings Ledger / Capability Spec / Cutover Plan) is in play; Phased Plan is the execution layer, never a standalone input"
effort_deadline_policy: "No fixed deadline; gated by Stage-3 schema-authoring completion and META-8 cascade attestation before Stage 9 dare-to-rise-code-plan can dispatch any brownfield mode against this schema"
convergence_counter_discipline: "This spec is author-drafted (TESS-T1 Sonnet under Opus persona); it is NOT a convergence-counted artifact — convergence counting applies to ASAE gate rating, not to per-artifact schema authoring drafts"
---

# Phased Plan — per-artifact schema spec

## Purpose

The Phased Plan is the **executable stage sequence** shared across every brownfield mode (Mode 2
Improvement, Mode 3 New-Feature, Mode 4 Staged Replacement). Where a mode-specific delta artifact
(Findings Ledger, Capability Spec, Cutover Plan) says *what* changes and *why*, the Phased Plan
says *in what order, by whom (which model tier), and at what depth of specification* the change
actually gets executed. It is the layer that turns a Findings Ledger's dispositioned findings, a
Capability Spec's rollout strategy, or a Cutover Plan's `cutover_events[]` into a concrete,
runnable stage sequence — the per-mode **02X-NN** stage tracks (`02R-NN` for Mode 2, `02F-NN` for
Mode 3, `02S-NN` for Mode 4) are literally this schema's `stages[]` array, materialized.

The defining field is `model_assignment`, which is set **by world-openness, not by perceived task
difficulty** (L9): closed-world stages (deep-spec transcription, everything pre-chewed by the
plan) run on **Haiku** economics; open-world stages (environment capture, baseline runs, anything
touching un-pre-chewed repo state) carry a **Sonnet floor**, locked on production experience —
Haiku was spotty specifically on distribution-surprise, not reasoning depth, and the floor is not
revisited casually. Planning/authorship stages are **Opus**, unchanged. Newest-small-model retests
only ever run as eval arms against a seeded repo — never as a quiet production swap of the floor.

## Core fields

| field | type | required? | description |
|---|---|---|---|
| `stages[]` | array of stage objects | required, always; ≥1 entry | The ordered execution sequence. Each entry carries the full stage-metadata set below plus a free-form `description` and `stage_id` matching the owning mode's 02X-NN naming convention. |
| `stages[].stage_id` | string, pattern `02[RFS]-\d{2}` | required | Which per-mode track this stage belongs to and its order within it (e.g. `02F-03`). Ties directly to the mode's Stage-02 dispatch. |
| `stages[].model_assignment` | enum: `haiku` \| `sonnet` \| `opus` | required | Set by world-openness classification (§5.3), not by subjective difficulty. `haiku` = closed-world execution only. `sonnet` = open-world execution floor (never downgraded without an explicit, disclosed eval-arm exception). `opus` = planning/authorship stages. |
| `stages[].world_openness_class` | enum: `closed` \| `open` \| `planning` | required | The classification driving `model_assignment`. Must be justified in `description` when the boundary is non-obvious — the open/closed boundary itself is v03-original taxonomy riding review, not a settled catalog (see Honest gaps). |
| `stages[].spec_depth` | enum: `deep-spec` \| `standard` \| `light-touch` | required | How much of the stage's work is pre-chewed in the plan vs. left for the executing model to discover. `deep-spec` pairs naturally with `closed`/`haiku`; `standard`/`light-touch` pair with `open`/`sonnet`. Unlike the Cutover Plan's OLD/NEW floor (D1 ruling — never shrinks), `spec_depth` is the field in the stack that legitimately flexes by component size and context. |
| `stages[].owning_delta_artifact_ref` | string (cross-doc ID) | required | Points back to the specific Findings-Ledger finding / Capability-Spec rollout item / Cutover-Plan event this stage executes. Keeps the Phased Plan traceable to its origin rather than free-floating. |
| `stages[].exit_criteria` | array of strings | required | What must be true for the stage to be marked complete — feeds the mode's gate/attestation checks. |
| `stages[].eval_arm` | boolean, default `false` | optional | Set `true` only when this stage is a disclosed newest-small-model retest against a seeded repo, not a production dispatch. Never used to quietly downgrade `model_assignment` below the Sonnet floor for a real open-world stage. |

## How it feeds its mode

For every brownfield mode, `dare-to-rise-code-plan` Stage 02 dispatches by reading `stages[]` in
order and routing each stage to the model named in `model_assignment`. The mode's own Stage-00
track (00R / 00F / 00S) has already produced the delta artifact that seeds this Phased Plan;
Stage 01 (01R / 01F / 01S) is where the Phased Plan itself gets authored, translating the delta
artifact's items into `stages[]` entries. The EV (Environment-Verification) stage, which replaces
Scaffold for all three brownfield modes, is itself typically the first `open`/`sonnet` stage in
the sequence, since baseline-capture against real repo state is the canonical open-world case.
Gate/attestation logic downstream (ASAE, META-8 cascade checks) reads `stages[].exit_criteria` to
confirm a stage is genuinely done before the mode advances.

## Minimal example

```yaml
stages:
  - stage_id: 02F-01
    description: "Transcribe Capability Spec integration-point map into deep-spec build tickets"
    world_openness_class: closed
    model_assignment: haiku
    spec_depth: deep-spec
    owning_delta_artifact_ref: CapabilitySpec-IP-03
    exit_criteria: ["all integration points have a ticket", "tickets reference IP-03 verbatim"]
  - stage_id: 02F-02
    description: "Run EV baseline capture against current repo state before extension begins"
    world_openness_class: open
    model_assignment: sonnet
    spec_depth: standard
    owning_delta_artifact_ref: CapabilitySpec-rollout_strategy
    exit_criteria: ["Baseline Ledger populated", "zero undispositioned entries"]
  - stage_id: 02F-06
    description: "Author the Bundle Delta Plan reconciling PRD/TRD changes from this feature"
    world_openness_class: planning
    model_assignment: opus
    spec_depth: standard
    owning_delta_artifact_ref: CapabilitySpec-acceptance_criteria_summary
    exit_criteria: ["Bundle Delta Plan committed", "cascade attestation filed if input structure changed"]
  - stage_id: 02F-07
    description: "Eval-arm retest: newest small model against seeded closed-world ticket transcription"
    world_openness_class: closed
    model_assignment: haiku
    spec_depth: deep-spec
    owning_delta_artifact_ref: CapabilitySpec-IP-03
    exit_criteria: ["eval score logged", "no production dispatch changed"]
    eval_arm: true
```

## Honest gaps

- The open/closed-world **category boundary** (which stage classes count as open vs. closed) is
  v03-original taxonomy operationalized from one production case, not a settled catalog — it rides
  Krystal's review per the LEAD doc's own disclosure (§8.7 in the source). This spec inherits that
  open status rather than resolving it; expect the `world_openness_class` enum's boundary cases to
  need real-run feedback.
- `spec_depth`'s three-value enum (`deep-spec` / `standard` / `light-touch`) is asserted here as a
  reasonable middle layer between "fully pre-chewed" and "fully open," but the LEAD doc does not
  itself define a middle tier explicitly — this spec introduces `standard` as a bridging value,
  flagged as a v03-schema-authoring addition pending confirmation.
- No conflict-resolution rule is yet specified for a stage whose `owning_delta_artifact_ref` points
  to an item that gets re-dispositioned (e.g., a Findings-Ledger finding moves from
  STILL-PRESENT to SCOPE-CHANGED) after the Phased Plan stage is already authored — whether the
  stage is auto-invalidated or requires manual re-authoring is undecided.
