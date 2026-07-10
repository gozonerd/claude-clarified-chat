---
title: "Capability Spec — per-artifact schema spec"
filename: Capability_Spec_2026-07-06_v01_I.md
schema_artifact: "4 of 8 (L1 Option-B set)"
mode_role: "Mode 3 · New-Feature (brownfield-extend) — 00F input"
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 3 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
universal_frontmatter_blocks: [session_chain, disclosures, inputs_processed, persona_role_manifest, target_codebase, existing_bundle, effort_deadline_policy, convergence_counter_discipline]
d1_ruling_applied: true
session_chain:
  - kind: external
    path: docs/Unified_4-Mode_Proposal_LEAD_2026-07-02_v03_I.md
    relation: "L1 locks the 8-schema Option-B set (§3, artifact #4, Capability Spec); §2 Mode-3 row + §5.2 name Capability Spec as the 00F delta-origin input; §5.2 flags capability-fit-vs-existing-architecture as the OPEN-1-gated question."
  - kind: external
    path: docs/FORK-A_Rulings_and_Execution_Spec_2026-07-03_v01_I.md
    relation: "D1 ruling (§2, §3.1) resolves OPEN-1 — Capability Spec is where the Mode-3 'substantive-by-default' floor is encoded via the mandatory architecture_fit block."
  - kind: sibling
    path: skills/dare-to-rise-code-plan/references/schemas/Findings_Ledger_Spec_2026-07-06_v01_I.md
    relation: "Schema #3 of 8 — authored as a pair with this doc; both carry D1's two-place encoding of the architecture-fit floor (guard there, mandatory block here)."
disclosures:
  compliance_claims: [none: true]
  shipping_attestation: [none: true]
  known_issues: []
  deviations_from_canonical: []
inputs_processed:
  - source: docs/Unified_4-Mode_Proposal_LEAD_2026-07-02_v03_I.md
    processed: yes
    extracted: "L1 artifact table row 4 field list (capability_pr_faq, acceptance_criteria_summary, success_criteria_summary, integration_points, rollout_strategy, canary_rings, kill_switch_flag); §5.2 00F track additions (dependency analysis, integration-point mapping, capability-fit vs existing architecture)."
    influenced: "Core fields §below."
  - source: docs/FORK-A_Rulings_and_Execution_Spec_2026-07-03_v01_I.md
    processed: yes
    extracted: "D1 ruling text (§2, §3.1): 'Mode 3 (00F): substantive-by-default... a real, mandatory analysis by default -- proportionality goes UP from there, not down to a paragraph'; architecture_fit 'extends the existing integration_points field... IS the AVD-equivalent, made a first-class schema field so Mode 3 cannot skip it'."
    influenced: "## D1 field section; the architecture_fit block definition and non-skippability rule."
persona_role_manifest:
  path: role-manifests/claudette-claudemilla-goldseam.yaml
  loaded_at_authoring: yes
target_codebase: "mm-d2r-fork-a (D2R Code Plan Stack v03, FORK-A build) — consumed by any repo running dare-to-rise-code-plan Mode 3"
existing_bundle: "Required alongside the 6-doc bundle (PRD/TRD/AVD/TQVCD/UXD/PSCAD) per §5.0 Mode-3 input gate, plus an in-flight-authored Bundle Delta Plan (L6); missing bundle or missing Capability Spec -> refuse with authoring pointer"
effort_deadline_policy: "No fixed deadline; gated by Stage-3 schema-authoring completion and META-8 cascade attestation before Stage 9 dare-to-rise-code-plan can dispatch Mode 3 against this schema"
convergence_counter_discipline: "This spec is author-drafted (TESS-T1 Sonnet under Opus persona); it is NOT a convergence-counted artifact — convergence counting applies to ASAE gate rating, not to per-artifact schema authoring drafts"
---

# Capability Spec — per-artifact schema spec

## Purpose

The Capability Spec is the Mode-3 (New-Feature, brownfield-extend) delta-origin input. It answers:
*what new capability are we adding to a system that already exists, and does it actually fit the
architecture it's landing in?* Per the LEAD (§3, artifact #4), it carries the working-backwards
PR-FAQ framing plus the operational rollout machinery (canary rings, kill switch) that a
new-feature launch into a live system needs and a greenfield build does not.

**FORK-A D1 ruling — the Mode-3 floor, and OPEN-1 resolved.** The LEAD (§5.2) left the depth of
"capability-fit vs existing architecture" as an explicitly open question (OPEN-1 — "the
AVD-equivalent decision for brownfield modes"). D1 rules it: Mode 3's floor is
**substantive-by-default**. The capability-fit-vs-existing-architecture analysis — the literal
AVD-equivalent — is a real, mandatory analysis by default, not a checkbox or a paragraph;
proportionality can go *up* from that floor for a larger or riskier capability, but it never goes
*down* to something thinner. This is the opposite posture from Mode 2's light-with-guard: Mode 3
exists specifically because something new is being grafted onto a live system, so the fit question
is substantive every time, by construction. The Capability Spec is where this floor lives
structurally, as the `architecture_fit` block (see ## D1 field below), not as a track whose depth
was left for 00F to decide informally.

## Core fields

| field | type | required? | description |
|---|---|---|---|
| `capability_pr_faq` | object (working-backwards PR-FAQ: press release + FAQ sections) | required | The capability stated as a launch narrative from the user's vantage point (Cagan/Amazon working-backwards style) — press-release framing plus anticipated FAQ. Forces the capability to be describable in outcome terms before implementation planning starts. |
| `acceptance_criteria_summary` | string or array of criteria | required | The condensed, testable conditions under which this capability is considered correctly built — feeds TQVCD verification-coverage entries and the QA-F acceptance pass. |
| `success_criteria_summary` | string or structured {metric, target, measurement_window} | required | How launch success (not just correctness) is judged post-rollout — the metric(s) canary analysis and post-GA review will be measured against. Distinct from acceptance criteria: a capability can be correct and still not succeed. |
| `integration_points` | array of {component, interface, interaction_type, risk_note} | required | Where the new capability touches existing system surfaces — the dependency/integration-point mapping named in §5.2's 00F additions. This is the field `architecture_fit` extends (see ## D1 field). |
| `architecture_fit` | object (block; see ## D1 field) | required, always (FORK-A D1 addition) | Mandatory fit-assessment vs existing module/service boundaries plus identified architectural risks. See ## D1 field below for full structure and non-skippability rule. |
| `rollout_strategy` | enum or string (e.g. big-bang, staged-canary, dark-launch) | required | The overall shape of how this capability reaches users — sets up `canary_rings` and `kill_switch_flag` below. |
| `canary_rings` | array of {ring_name, audience_pct_or_cohort, promotion_criteria, rollback_trigger} | required for any staged rollout_strategy | The specific ring sequence (e.g. internal → 1% → 5% → 25% → 100%) with objective promotion/rollback criteria per ring. Required whenever `rollout_strategy` is staged; may be a single-entry array (100% at once) when `rollout_strategy` is big-bang, but the field itself is not omitted. |
| `kill_switch_flag` | object {flag_name, default_state, owning_system, activation_latency} | required | The specific, named mechanism to disable this capability in production without a redeploy. A capability with no kill switch is not launch-ready regardless of how well-tested it is. |

## How it feeds its mode

The Capability Spec is the primary input to **00F** (`dare-to-rise-code-plan` §5.2, Mode-3 row):
00F's dependency analysis and integration-point mapping consume `integration_points` directly, and
the capability-fit-vs-existing-architecture pass (formerly depth-undetermined under OPEN-1, now
D1-ruled) consumes `architecture_fit` as its substantive analysis, not merely as a summary of one
performed elsewhere. Stage 01F ("plan from Capability Spec + bundle-delta-induced changes")
consumes the full spec plus the in-flight-authored Bundle Delta Plan (L6) to produce the
`02F-NN` per-feature-component stage sequence. `rollout_strategy`, `canary_rings`, and
`kill_switch_flag` feed QA-F's canary rollout pass (1% → 5% → … → GA) directly — QA-F cannot run
without these three populated. `acceptance_criteria_summary` and `success_criteria_summary` feed,
respectively, QA-F's acceptance pass and its post-launch success-metric review. Per §5.0's input
gate, Mode 3 cannot dispatch without both the required 6-doc bundle and a present Capability Spec.

## D1 field

**Field: `architecture_fit` (object block, mandatory, extends `integration_points`).**

**This is the AVD-equivalent for brownfield Mode 3, resolved by D1 as a first-class schema field.**
Where `integration_points` inventories *where* the capability touches the existing system,
`architecture_fit` is the *analysis* of whether it *should* touch it that way, and what it costs
to. It extends `integration_points` rather than duplicating it — every integration point named
there should be legible in the fit assessment here.

**Required sub-fields:**

| sub-field | type | description |
|---|---|---|
| `fit_assessment` | string (substantive prose, not a one-liner) | How the proposed capability sits against the existing module/service boundary map: does it belong in an existing module, does it require a new one, does it strain an existing boundary's single-responsibility shape? A one-sentence "fits fine" is not an acceptable value — this is the field D1 explicitly protects against being reduced to a paragraph. |
| `boundary_map_ref` | pointer (to the current AVD or equivalent architecture doc/diagram) | Which existing architecture documentation this assessment was made against, so the fit claim is falsifiable/re-checkable rather than asserted from memory. |
| `architectural_risks[]` | array of {risk_id, description, likelihood, impact, mitigation_or_accepted_by} | The identified architectural risks this capability introduces (e.g., a new cross-module dependency, a shared-state coupling, a scaling assumption that may not hold). Empty array requires an explicit justification note — "no risks identified" must be argued, not defaulted. |
| `alternatives_considered` | string or array (brief) | At least a sentence on whether a different integration shape was considered and why this one was chosen — guards against the first workable integration point being accepted uncritically. |

**Non-skippability.** `architecture_fit` is **required, always**, for every Capability Spec,
regardless of how small the capability looks. This is the concrete meaning of
"substantive-by-default, proportionality goes up not down": a trivial capability still gets a
real (if short) `fit_assessment` and an honest `architectural_risks[]` (which may legitimately be
thin, but not absent-without-justification). Mode 3's 00F stage (§5.2) and the Mode-3 input gate
(§5.0) both treat a Capability Spec with a missing or placeholder `architecture_fit` block as an
incomplete artifact — 00F cannot proceed past its capability-fit pass without it, the same way a
missing Capability Spec itself blocks Mode-3 dispatch entirely.

**Contrast with Findings Ledger's `boundary_touch`.** Mode 2's guard is conditional — it escalates
only when a fix crosses a boundary. Mode 3's floor is unconditional — every new capability is, by
definition, adding to the system's boundary map, so the fit question is asked every time, at
mandatory depth. The two fields are D1's two-place encoding of the same underlying principle
(architecture-fit is never skipped) expressed at the appropriate floor for each mode.

## Minimal example

```yaml
capability_pr_faq:
  press_release: "Users can now export their saved-games list as a shareable link."
  faq:
    - q: "Does this expose private game data?"
      a: "No — export includes only titles + completion %, never save-state contents."
integration_points:
  - component: SavedGamesService
    interface: GET /saved-games
    interaction_type: read-only consumer
    risk_note: "existing rate limit may need a higher ceiling for export batch reads"
architecture_fit:
  fit_assessment: >
    Export capability is read-only and fits inside SavedGamesService's existing query surface;
    no new service boundary is required. The share-link generation (new) is proposed as a thin
    new module (ShareLinkService) rather than folding into SavedGamesService, to avoid coupling
    an unrelated concern (public link lifecycle/expiry) into the games-data module.
  boundary_map_ref: "docs/AVD_Template_2026-04-26_v03_I.md#saved-games-module (current AVD, rev 2026-06-15)"
  architectural_risks:
    - risk_id: AR-01
      description: "ShareLinkService introduces a new public-facing endpoint surface"
      likelihood: medium
      impact: medium
      mitigation_or_accepted_by: "gated behind existing auth-proxy; no new perimeter exposure"
  alternatives_considered: "Considered folding share-link logic into SavedGamesService directly; rejected to keep public-link expiry/rotation concerns out of the games-data module."
acceptance_criteria_summary: "Export produces a valid shareable link; link resolves to a read-only summary view; no save-state data present in payload."
success_criteria_summary:
  metric: "export_feature_adoption_rate"
  target: ">=5% of active users within 30 days"
  measurement_window: "30 days post-GA"
rollout_strategy: staged-canary
canary_rings:
  - ring_name: internal
    audience_pct_or_cohort: "internal test accounts"
    promotion_criteria: "zero errors over 48h"
    rollback_trigger: "any data-exposure bug"
  - ring_name: ga
    audience_pct_or_cohort: "100%"
    promotion_criteria: "n/a (final ring)"
    rollback_trigger: "error rate > baseline + 0.5%"
kill_switch_flag:
  flag_name: "export_share_link_enabled"
  default_state: false
  owning_system: "feature-flag-service"
  activation_latency: "< 60s propagation"
```

## Honest gaps

- `fit_assessment`'s "substantive, not a one-liner" bar is asserted qualitatively here; this spec
  does not define an objective minimum (word count, required sub-questions) that would let a gate
  mechanically distinguish a real analysis from a padded one-liner — that is left to reviewer
  judgment for now, flagged for the companion Mode-3 spec doc (Stage 4).
- `boundary_map_ref` assumes a current AVD (or equivalent) exists and is up to date; where the
  6-doc bundle's AVD is itself stale relative to the live system, `architecture_fit` may be
  assessed against a boundary map that is already wrong — this spec does not yet specify a
  staleness check on `boundary_map_ref` before trusting it.
- The "empty `architectural_risks[]` requires justification" rule is stated but not enforced
  structurally (nothing here mechanically blocks an empty array with an empty justification
  string) — enforcement is deferred to the 00F checklist / gate layer (Stage 4).
