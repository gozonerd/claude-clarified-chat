---
title: "Mode 3 (New-Feature / brownfield-extend) — mode spec"
filename: Mode3_NewFeature_Spec_2026-07-06_v01_I.md
mode: "3 (New-Feature) — Stage-00 track = 00F"
input_schema: "Capability Spec (+ Bundle Delta Plan authored in-flight)"
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 4 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
d1_floor: "substantive-by-default"
session_chain:
  - kind: external
    path: docs/Unified_4-Mode_Proposal_LEAD_2026-07-02_v03_I.md
    relation: "§2 Mode-3 row (delta origin, Stage 00/01/02/QA mapping); §5.0 Mode-3 input gate; §5.2 00F track additions (dependency analysis, integration-point mapping, capability-fit vs existing architecture — OPEN-1-gated at LEAD time)."
  - kind: external
    path: docs/FORK-A_Rulings_and_Execution_Spec_2026-07-03_v01_I.md
    relation: "D1 ruling (§2, §3.1): Mode 3 (00F) = substantive-by-default, the AVD-equivalent capability-fit analysis is real and mandatory by default; §3.1 names Stage 4 (this doc) as where each mode's Stage-00 checklist encodes its floor."
  - kind: sibling
    path: skills/dare-to-rise-code-plan/references/schemas/Capability_Spec_2026-07-06_v01_I.md
    relation: "Mode-3 input schema; its `architecture_fit` block IS the structural encoding this spec's checklist consumes and cannot bypass."
  - kind: sibling
    path: skills/dare-to-rise-code-plan/references/schemas/Bundle_Delta_Plan_Spec_2026-07-06_v01_I.md
    relation: "Authored in-flight during 00F/01F/02F-NN per L6; this spec's checklist requires its delta_entries[] be live, not reconstructed post-hoc."
disclosures:
  compliance_claims: [none: true]
  shipping_attestation: [none: true]
  known_issues: []
  deviations_from_canonical: []
---

# Mode 3 (New-Feature / brownfield-extend) — mode spec

## Purpose

Mode 3 is the D2R track for adding a genuinely new capability to a system that already exists and
already works. Per the LEAD (§2), its delta origin is a capability decision, carried in the
**Capability Spec**, and its defining discipline (Lock L6) is that the 6-doc bundle is updated
**inline** as the new capability lands — the bundle is the system of record, not a document that
drifts behind the code. Mode 3 is not Mode 1 run against an existing repo: most of Mode 1's
research tracks stay, but scoped down to the delta, while a small set of brownfield-specific
concerns get added because something new is being grafted onto something live.

## Input gate

Mode 3 cannot dispatch without both of the following present (LEAD §5.0):

1. **The 6-doc bundle** (PRD / TRD / AVD / TQVCD / UXD / PSCAD) — required, not on-demand. Mode 3
   assumes a working system with an existing bundle; a missing bundle is refused with a pointer to
   its authoring path, the same discipline as the existing Prerequisite-Inputs gate.
2. **A Capability Spec** (schema #4 of 8, L1) — required. Missing or placeholder → refuse; Mode 3
   has nothing to plan against without it.

**Bundle Delta Plan (schema #7) is authored in-flight, not gated at entry (L6).** Unlike the bundle
and the Capability Spec, the Bundle Delta Plan does not exist yet at dispatch time — it is written
progressively as 00F/01F/02F-NN execution actually touches bundle docs. Its `delta_entries[]` must
be live-authored, timestamped per touch, and cross-checked against the bundle's own BIDX-5 change
log at Mode-3 exit (per the Bundle Delta Plan spec's own "How it feeds its mode" section). A Mode-3
run that reaches its exit gate with no Bundle Delta Plan at all, or with one clearly reconstructed
after the fact rather than authored alongside the work, fails the exit gate — L6 is a claim about
*when* the bundle updates happen, and only a contemporaneous record can support that claim.

A Capability Spec with a missing or placeholder `architecture_fit` block is treated as an
**incomplete artifact**, not a present-but-thin one — see ## D1 floor below. The input gate and
the 00F capability-fit pass enforce this at two different points so it cannot slip through either.

## Stage-00 (00F) checklist

00F keeps most Mode-1 tracks, scoped to the delta, and adds three brownfield-specific tracks named
in the LEAD (§5.2):

**Retained from Mode 1, scoped to the delta (not the whole system):**
- Production-engineering track — but assessed only for the surfaces the new capability touches.
- Accessibility track — for any new UI/UX surface the capability introduces.
- Test-strategy track — for the capability's own acceptance criteria, not a full-system retest.
- Any other Mode-1 track whose applicability gate fires for this specific capability (unchanged
  gating logic; the difference is scope, not which tracks exist).

**Added, brownfield-specific (00F's distinguishing content):**
1. **Dependency analysis** — what the new capability depends on (services, libraries, data, other
   in-flight work) and what would depend on it once shipped.
2. **Integration-point mapping** — where the capability touches existing system surfaces. This
   populates the Capability Spec's `integration_points[]` field directly (component, interface,
   interaction_type, risk_note per entry) — 00F does not produce a separate mapping artifact; it
   fills this field.
3. **Capability-fit-vs-existing-architecture analysis** — the literal AVD-equivalent for Mode 3.
   This populates the Capability Spec's `architecture_fit` block. See ## D1 floor immediately below
   — this is the track OPEN-1 gated at LEAD time and D1 has now ruled.

**00F exit condition:** the Capability Spec's `integration_points[]` and `architecture_fit` block
are both populated to the standard defined below, and the retained Mode-1 tracks scoped to the
delta have cleared their own applicability gates. 00F does not exit with `architecture_fit` absent,
placeholder, or a one-line "fits fine" — see below.

## D1 floor (00F substantive-by-default — THE AVD-equivalent)

**This is the floor this document exists to encode.** FORK-A's D1 ruling (2026-07-03) resolved
OPEN-1 for Mode 3 as: **substantive-by-default.** Verbatim from the ruling: *"The
capability-fit-vs-existing-architecture analysis (the literal AVD-equivalent) is a real, mandatory
analysis by default — proportionality goes up from there, not down to a paragraph."*

Concretely, this means:

- **A real analysis is the default, not the escalated case.** Contrast with Mode 2's 00R floor
  (light-with-guard — light by default, escalates only when a fix trips the `boundary_touch` flag).
  Mode 3 has no light-default tier to fall back to, because Mode 3 exists specifically because
  something new is being grafted onto a live system — the fit question is substantive *every time*,
  by construction, not conditionally.
- **Proportionality only moves in one direction.** A larger or riskier capability may warrant a
  deeper `architecture_fit` analysis than the floor (more architectural_risks entries, a longer
  fit_assessment, more alternatives_considered). A small, low-risk capability does **not** get a
  thinner analysis than the floor — it gets a short but still real one. "Small capability, still a
  genuine fit_assessment" is the floor's whole content; it is not a size-based exemption.
- **The floor is encoded structurally, not left to author discipline.** The Capability Spec's
  `architecture_fit` block (fit_assessment, boundary_map_ref, architectural_risks[],
  alternatives_considered) is `required, always` in the schema itself — not conditionally required,
  not a track whose depth 00F decides informally at run time. 00F **cannot proceed past its
  capability-fit pass without this block populated to schema.** This is the same non-skippability
  rule the Capability Spec schema doc states directly: a missing or placeholder `architecture_fit`
  block makes the whole Capability Spec an incomplete artifact, which blocks Mode-3 dispatch the
  same way a missing Capability Spec itself does.
- **What "not a paragraph" means in practice, per sub-field:**
  - `fit_assessment` must address whether the capability belongs in an existing module, requires a
    new one, or strains an existing boundary's single-responsibility shape — not merely assert that
    it "fits." A one-sentence "fits fine" is explicitly the failure mode D1 is ruling out.
  - `boundary_map_ref` must point at a real, current architecture doc (AVD or equivalent) the
    assessment was actually made against — a fit claim with no falsifiable anchor is not credible.
  - `architectural_risks[]` may legitimately be thin for a genuinely low-risk capability, but an
    **empty array requires an explicit justification note.** "No risks identified" must be argued,
    never defaulted silently.
  - `alternatives_considered` must show at least one alternative integration shape was actually
    weighed, guarding against the first workable integration point being accepted uncritically.
- **This is the LEAD's OPEN-1, now closed for Mode 3.** The LEAD (§5.2) flagged
  "capability-fit vs existing architecture" as depth-undetermined pending Krystal's ruling. D1
  supplies that ruling. This document is the "companion Mode spec" the Capability Spec's own honest
  gaps section points to for the escalated-procedure detail — see ## Honest gaps below for what
  remains genuinely open even after D1.

**Contrast, stated once for clarity:** Mode 2's guard is conditional (escalates on a trip wire).
Mode 4's floor is full, unconditional, non-negotiable regardless of component size (cutover *is*
architecture surgery). Mode 3 sits between: unconditional in that it always runs, but proportionate
in that its depth scales with the capability rather than being maximal by default. D1 is careful
that "substantive-by-default" is not read as "maximal-by-default" — it is the floor, not the
ceiling.

## QA-F protocol

Per the LEAD (§2), Mode 3's QA stage is **canary rollout + acceptance + success metrics**, driven
directly by the Capability Spec fields authored for exactly this purpose:

1. **Acceptance pass.** Verify the capability against `acceptance_criteria_summary` — the condensed,
   testable conditions under which it is considered correctly built. This is a correctness check,
   run before any traffic ramp.
2. **Canary rollout.** Execute the ring sequence in `canary_rings[]` in order (e.g. internal → 1% →
   5% → 25% → 100%, or whatever sequence the Capability Spec actually specifies). At each ring:
   - Confirm the ring's `promotion_criteria` is met before advancing to the next ring.
   - Watch for the ring's `rollback_trigger`; if tripped, roll back — do not "wait and see" past a
     defined trigger.
   - A `rollout_strategy` of `big-bang` still requires `canary_rings[]` to be populated (a
     single-entry 100% ring is valid) — the field is never omitted, only collapsed.
3. **Kill-switch verification.** Before GA, confirm `kill_switch_flag` is real and tested — named
   flag, known default state, known owning system, known activation latency. A capability with no
   verified kill switch does not exit QA-F regardless of how clean its canary run was.
4. **Success-metrics review.** Post-GA (per `success_criteria_summary`'s measurement_window),
   measure the capability against its target metric. This is distinct from acceptance — a capability
   can pass acceptance and canary cleanly and still fail its success criteria (e.g., built correctly,
   adopted by nobody). Success-metric failure does not necessarily mean rollback; it means the
   Opportunity Assessment that motivated this capability gets revisited.
5. **Bundle Delta Plan reconciliation.** Cross-check the Bundle Delta Plan's `delta_entries[]`
   against the bundle's BIDX-5 change log. Every delta entry should have a corresponding change-log
   line and vice versa. A mismatch is a defect requiring reconciliation before QA-F can close —
   this is where L6's "updated inline" claim is actually checked, not just asserted.

**QA-F does not run without `rollout_strategy`, `canary_rings`, and `kill_switch_flag` populated on
the Capability Spec** — the same non-skippability discipline as `architecture_fit`, applied to the
rollout-machinery fields instead of the fit-analysis field.

## Exit gate

Mode 3 exits through the standard **threshold-2** research-rigor gate (LEAD §5.2: "each variant
keeps the threshold-2 research-rigor gate with mode-specific audit checklists"), with the following
Mode-3-specific audit checklist:

- [ ] 6-doc bundle present and was the one actually consulted (not a stale copy).
- [ ] Capability Spec present, all required fields populated (capability_pr_faq,
      acceptance_criteria_summary, success_criteria_summary, integration_points,
      **architecture_fit**, rollout_strategy, canary_rings, kill_switch_flag).
- [ ] `architecture_fit.fit_assessment` is substantive prose addressing module/boundary fit — not a
      one-line assertion. Reviewer applies the qualitative bar directly (see Honest gaps: no
      mechanical word-count check exists yet).
- [ ] `architecture_fit.architectural_risks[]` is either populated or carries an explicit
      justification note for being empty.
- [ ] `architecture_fit.alternatives_considered` names at least one alternative actually weighed.
- [ ] Bundle Delta Plan exists, `delta_entries[]` are timestamped in-flight (not batch-authored at
      the end), and reconcile against BIDX-5.
- [ ] QA-F's four passes (acceptance, canary, kill-switch, success-metrics) all ran; canary ring
      promotion/rollback criteria were objectively checked, not asserted.
- [ ] `cascade_check` on the Bundle Delta Plan correctly marked (NOT-APPLICABLE / REQUIRED /
      ATTESTED) per META-8 discipline — a REQUIRED value with no attestation file fails this gate.
- [ ] This mode-spec's D1 floor was applied — reviewer confirms the Capability Spec was not
      accepted with a placeholder `architecture_fit` block at any point in the run, even an
      early one later fixed (the gate checks the artifact as it stands at exit, but a reviewer
      who notices the floor was skipped-then-patched should flag it as a process finding).

A run failing any checkbox does not exit 00F/QA-F clean; it returns to the relevant stage for
remediation, same as any other threshold-2 gate failure in the stack.

## Honest gaps

- **"Substantive, not a one-liner" has no mechanical enforcement.** This spec, like the Capability
  Spec schema doc itself, states the bar qualitatively and leaves the real/padded distinction to
  reviewer judgment. No word-count or required-sub-question rule exists yet that would let a gate
  check this without a human (or model) reviewer reading the prose.
- **`boundary_map_ref` staleness is not checked.** If the 6-doc bundle's AVD is itself out of date
  relative to the live system, `architecture_fit` can be honestly assessed against a boundary map
  that no longer matches reality, and nothing in this spec or the schema catches that.
- **Bundle Delta Plan reconciliation is not yet hook-enforced.** The BIDX-5 cross-check in QA-F step
  5 is currently a manual/ASAE-gate step; if a future Tier-25 (or new tier) hook automates it, this
  spec's checklist item should be updated to point at the hook rather than describe a manual check.
- **D1 rules the floor, not the escalation ceiling.** This spec is explicit that proportionality
  only goes up from substantive-by-default, but does not define an upper bound or a "this capability
  is large enough that 00F itself should split into sub-passes" trigger — large capabilities may
  need that and it is not yet specified here.
- **No first real-world Mode-3 run has exercised this checklist yet** (FORK-A v03 stack is still
  under construction as of this writing). The checklist is designed against the LEAD + D1 ruling
  text, not dogfooded; field names, gate phrasing, or checklist granularity may need adjustment once
  a real Capability Spec runs through it end to end.
