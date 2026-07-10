---
title: "Mode 4 (Staged Replacement / strangler-fig) — mode spec"
filename: Mode4_StagedReplacement_Spec_2026-07-06_v01_I.md
mode: "4 (Staged Replacement) — Stage-00 track = 00S"
input_schema: "Cutover Plan"
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 4 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
d1_floor: "full (non-negotiable)"
---

# Mode 4 (Staged Replacement) — mode spec

## Purpose

Mode 4 is the industry strangler-fig pattern: an existing (OLD) component or subsystem is
replaced by a new (NEW) one while the system keeps running, via an interleaved sequence of
ADDED/REMOVED cutover events rather than a single atomic swap. Mode 4 answers the question
Mode 3 (brownfield-extend) does not have to: *how does the system move from one architecture
to another without ever being caught in an inconsistent or unrecoverable state?* Everything in
this spec is downstream of, and must stay consistent with, the LEAD doc's Mode-4 column
(`docs/Unified_4-Mode_Proposal_LEAD_2026-07-02_v03_I.md`, §2 table and §5.2) and the Cutover
Plan schema's D1 ruling (`Cutover_Plan_Spec_2026-07-06_v01_I.md`).

## Input gate (bundle required + Cutover Plan)

Per LEAD §5.0: Mode 4 = 6-doc bundle (**required**, not on-demand) + **Cutover Plan** (the
delta-origin artifact, schema #5 of 8). Both must be present before Stage-00 (00S) opens.

- **Missing bundle** -> refuse; point to the bundle's own authoring path (Mode 1 / the
  `/write-*` skills), same discipline as Modes 2/3.
- **Missing Cutover Plan** -> refuse; point to the Cutover Plan schema spec's authoring flow.
  This is a **hard refuse, not a soft warning** (Cutover Plan spec, "How it feeds its mode").
- **Size-skipped Cutover Plan** -> refuse at this gate, not later. A Cutover Plan that omits
  `OLD_state_model`, `NEW_state_model`, or `data_consistency_checks` because the component being
  replaced "looks small" is not an abbreviated input — it is a missing one. See the D1 floor
  section below; this gate is where that ruling is enforced mechanically, before Stage 00S ever
  opens.
- Bundle-delta posture: Mode 4 also authors/updates a **Bundle Delta Plan** in-flight (L6, shared
  with Mode 3) — which of the 6 bundle docs change and how, tracked alongside the Cutover Plan
  rather than as an afterthought at ship time.

## Stage-00 (00S) checklist

Per LEAD §5.2, 00S = **00F's additions PLUS** cutover-specific tracks. Concretely, 00S runs:

**Inherited from 00F (Mode 3's brownfield-assess base):**
1. Dependency analysis — what currently depends on the OLD component, transitively.
2. Integration-point mapping — every seam where OLD is called, called from, or shares state.
3. Capability-fit vs existing architecture — whether NEW's shape is compatible with what
   surrounds it (the AVD-equivalent question). Depth here is the D1 **full** floor: OPEN-1 was
   RULED 2026-07-03 (D1; Mode 4 = full, non-negotiable), so the LEAD §6 "gates on OPEN-1" language
   is superseded — architecture-fit is mandatory at full depth, not pending an open item.

**Added for 00S (cutover-specific, not present in 00F):**
4. **Cutover-readiness** — is there a safe entry point at all (traffic can be split/flagged,
   a canary path exists or can be built, rollback is technically possible at every seam
   identified in track 2)? A component with no feasible routing seam is not cutover-ready and
   Mode 4 should not proceed until one is designed.
5. **OLD/NEW state modeling** — the brownfield-assess counterpart of the Cutover Plan's
   `OLD_state_model` / `NEW_state_model` fields: confirm the two models as authored are
   concrete enough that a reviewer can tell what breaks if a step is skipped, and that they are
   field-for-field diffable (same shape, per the Cutover Plan spec's requirement).
6. **Data-migration integrity** — for every data store touched by the cutover, how records
   move (or don't) between OLD's and NEW's storage shape, and what "consistent" means for data
   written during the migration window itself (not just before/after).
7. **Routing/gateway design** — the mechanism (feature flag, proxy, cohort router) that will
   execute `routing_gateway_plan`, verified as buildable/available in this codebase before
   Stage 01S commits to a routing strategy that doesn't exist yet.

Exit gate: threshold-2 research-rigor gate with the Mode-4 audit checklist (see Exit gate,
below) — same mechanism as every other mode's Stage-00 variant (LEAD §5.2), specialized to 00S.

## D1 floor (full, non-negotiable)

**This is the top of the escalating-proportionality scale.** Mode 2's light-guard checks scale
down for small findings; Mode 3's substantive checks scale by component size and world-openness
(Phased Plan's `spec_depth` field flexes). **Mode 4 does not flex.** The FORK-A D1 ruling, in
its own words: *"cutover IS architecture surgery, there is no small version."*

Concretely, regardless of how small the component being replaced looks:

- `OLD_state_model` — mandatory, always, full depth.
- `NEW_state_model` — mandatory, always, full depth, field-for-field diffable against OLD.
- Invariant / data-consistency-preservation checks (`data_consistency_checks[]`, ≥1 per
  carried-over invariant) — mandatory, always, full depth. This is the field the D1 ruling is
  most protective of, because cutovers fail in production almost exclusively here: not because
  the new component is wrong, but because something written during the migration window was
  read back inconsistently by whichever side hadn't caught up yet.
- `rollback_per_event`, 1:1 with `cutover_events[]` — mandatory, always. "Roll back the whole
  migration" is not an acceptable substitute for per-event rollback, at any component size.

**A size-skipped Cutover Plan must be refused at the input gate** (see above) — this is not a
downstream QA-S finding to catch later, it is a precondition Mode 4 will not dispatch without.
There is no proportionality lever in this mode the way there is in Modes 2 and 3; "it's just a
small service swap" is not a valid basis for narrowing OLD/NEW modeling or the consistency
checks. If a genuinely trivial single-file swap turns out to make this floor feel disproportionate
in practice, that is an empirical question for the first real Mode-4 run (flagged as an honest
gap in the Cutover Plan spec already) — not something this spec pre-resolves by carving an
exception into the floor now.

## QA-S protocol

Per LEAD §2's Stage-QA row, QA-S = **re-review-of-OLD + canary-of-NEW + gateway-routing /
data-consistency / cutover-completeness verification.** Unpacked:

1. **Re-review-of-OLD** — confirm the OLD_state_model recorded at 00S still matches production
   reality at cutover time (brownfield systems drift between planning and execution; re-review
   catches drift before it's mistaken for a NEW-side regression).
2. **Canary-of-NEW** — the routing/gateway plan's staged rollout (dark -> canary % -> ... ->
   100%) is executed and observed at each stage before advancing, per the `cutover_events[]`
   sequence and its preconditions/postconditions.
3. **Gateway-routing verification** — the routing mechanism itself (flag, proxy, cohort router)
   is confirmed to be doing what `routing_gateway_plan` says it does — not just that traffic
   arrived at NEW, but that the *mechanism* driving that arrival is the one specified and is
   reversible on demand.
4. **Data-consistency verification** — every entry in `data_consistency_checks[]` is run at its
   declared `run_cadence` (continuous / per-event / pre-post) and any drift is treated as a
   migration-blocking finding, not a follow-up ticket.
5. **Cutover-completeness verification** — every `cutover_events[]` entry has reached its
   postcondition, every REMOVED-type event's target is confirmed actually decommissioned (not
   just routed-around), and no undispositioned event remains open at the point Mode 4 declares
   the migration done.

QA-S shares the re-review instinct with QA-R (Mode 2's re-run-hostile-review) and the staged
rollout instinct with QA-F (Mode 3's canary), but adds the OLD-side re-review and the
completeness check as Mode-4-only concerns — a canary that succeeds on the NEW side while OLD
has silently drifted, or while a REMOVED event never actually decommissioned anything, is not a
complete cutover.

## Delta markers

Mode 4's phased plan uses OpenSpec-compatible delta markers — **ADDED / MODIFIED / REMOVED** —
applied within the interleaved cutover-event stage sequence (LEAD §2, "Mode-4 delta-markers"
row). Concretely:

- Each `cutover_events[]` entry's `type` field (ADDED | REMOVED, per the Cutover Plan schema)
  maps directly to its owning Phased Plan stage's delta marker.
- MODIFIED is available for stages that alter an existing component in place as part of the
  cutover sequence (e.g., adapting a shared dependency to serve both OLD and NEW during the
  transition window) without it being a pure ADDED or pure REMOVED action.
- Stage naming: `02S-NN` (LEAD §2's Stage-03+/02X-NN row) — one stage per cutover event or
  tightly-coupled event group, in the interleaved order `cutover_events[]` specifies. Stages are
  never reordered to "add everything, then remove everything" — the interleaving is the point;
  it's what keeps the system rollback-capable at every step (Cutover Plan spec, `cutover_events[]`
  field description).

## Exit gate

Threshold-2 (same mechanism as every other mode's Stage-00/QA exit gates) with a **Mode-4 audit
checklist** covering:

- [ ] `OLD_state_model` and `NEW_state_model` both present, field-for-field diffable, invariant
      carry-over/relaxation/introduction explicitly stated.
- [ ] Every `cutover_events[]` entry has a paired `rollback_per_event` entry.
- [ ] Every invariant carried over from OLD has ≥1 `data_consistency_checks[]` entry with a
      declared `run_cadence`.
- [ ] `routing_gateway_plan` names a concrete, buildable mechanism — not a placeholder.
- [ ] 00S's cutover-readiness track confirms a rollback path exists at every seam identified by
      integration-point mapping.
- [ ] QA-S's five verifications (re-review-of-OLD, canary-of-NEW, gateway-routing,
      data-consistency, cutover-completeness) all ran and are concordant (zero undispositioned
      lines, per the EV stage's concordance definition — LEAD §5.1 — applied here to the QA-S
      pass rather than the Baseline Ledger).
- [ ] No REMOVED-type event is marked complete without confirmed decommission (not
      routed-around).

## Honest gaps

- The D1 floor's edge case — a genuinely trivial single-file swap — has not been pressure-tested
  against a real run; this spec inherits that gap from the Cutover Plan schema rather than
  resolving it, deliberately (empirical feedback belongs at the first real Mode-4 run, not at
  spec-authoring time).
- 00S track 3 (capability-fit vs existing architecture): OPEN-1 is **CLOSED** — ruled D1 on
  2026-07-03 (Mode 4 = full floor, non-negotiable). The LEAD §6 "gates on OPEN-1" wording predates
  the ruling and is superseded; this spec applies the full floor, it does not wait on an open item.
- The Mode-4 audit checklist above is v04-original (authored here, not recovered from the April
  v02 design) — it operationalizes LEAD §2's QA-S description into a checkable list, and rides
  Krystal's review the same way LEAD §5.2's track mapping does.
- This spec does not yet define what happens when QA-S's data-consistency verification disagrees
  with the Cutover Plan's own `data_consistency_checks[]` results (i.e., a check that passed at
  00S authoring time but fails at QA-S runtime) — that reconciliation rule is not authored here
  and is likely a Stage-9 `dare-to-rise-code-plan` SKILL amendment item, same bucket as the
  Cutover Plan spec's own unresolved conflict-resolution gap.
