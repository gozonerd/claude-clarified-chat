---
title: "Bundle Delta Plan — per-artifact schema spec"
filename: Bundle_Delta_Plan_Spec_2026-07-06_v01_I.md
schema_artifact: "7 of 8 (L1 Option-B set)"
mode_role: "Mode 3 (00F, primary) + Mode 4 (00S, secondary)"
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 3 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
universal_frontmatter_blocks: [session_chain, disclosures, inputs_processed, persona_role_manifest, target_codebase, existing_bundle, effort_deadline_policy, convergence_counter_discipline]
---

# Bundle Delta Plan — per-artifact schema spec

## Purpose

Per locked LEAD §3 and Lock L6: the Bundle Delta Plan is the record of **which of the 6 bundle
docs (PRD / TRD / AVD / TQVCD / UXD / PSCAD) change and how** when a brownfield mode runs. Lock L6
established that **Mode 3 updates the 6-doc bundle inline** — the bundle is the system of record,
not a side document that drifts from it. The Bundle Delta Plan is what makes "updates inline"
auditable rather than an unverifiable claim: every touch to a bundle doc during Mode 3 (and,
secondarily, Mode 4) is entered here as it happens, in-flight, not reconstructed after the fact.

Without this artifact, a brownfield run can silently under-update the bundle — e.g., TRD changes
but TQVCD's coverage claims go stale, and nothing surfaces the gap. The Bundle Delta Plan is the
mechanism that makes bundle-as-system-of-record a checkable property instead of an intention.

## Core fields

| field | type | required? | description |
|---|---|---|---|
| `capability_spec_ref` | string (file path) | required (Mode 3) | Pointer to the Capability Spec (schema #4) driving this delta plan. Mode 4 runs reference the Cutover Plan (schema #5) instead. |
| `bundle_ref` | string (file path, BIDX) | required | Pointer to the bundle index (`BIDX_*`) whose docs this plan proposes to change. |
| `delta_entries[]` | array of objects | required, min 1 | The core payload — one entry per bundle-doc touch. See sub-fields below. |
| `delta_entries[].doc` | enum: PRD \| TRD \| AVD \| TQVCD \| UXD \| PSCAD | required | Which of the 6 bundle docs this entry touches. One entry per doc per authoring pass; a doc touched twice in one Mode-3 run gets a second entry, not an edit to the first (append-only, mirrors ADR/RUNBOOK lifecycle semantics in `Bundle_Index_Schema_2026-04-26_v01_I.md` §4.2.1). |
| `delta_entries[].change_type` | enum: ADDED \| MODIFIED \| REMOVED | required | ADDED = new section/requirement/field in the doc that didn't exist before this run. MODIFIED = existing content changed in place. REMOVED = content struck (tombstoned per the amendment protocol, not silently deleted). |
| `delta_entries[].sections_touched` | array of heading-prefix IDs (e.g. `TRD-4.3`, `TQVCD-3.2`) | required | Exact heading-prefix IDs per `Heading_Prefix_ID_Grammar_2026-04-26_v01_I.md`. Must resolve against the bundle's BIDX-3 table; an ID that doesn't resolve is a defect in this plan, not a defect in the bundle. |
| `delta_entries[].rationale` | string (prose) | required | Why this bundle doc needed to change — traces back to the Capability Spec (or Cutover Plan) driving the run. Never "per the plan" alone; name the specific capability/finding/cutover event that forced the change. |
| `delta_entries[].authored_at` | ISO 8601 timestamp | required | When this entry was recorded. Entries are timestamped individually because they are authored in-flight across the run, not batched at the end. |
| `delta_entries[].bidx_reindex_required` | boolean | required | Whether this entry's change requires a BIDX rebuild (per `Bundle_Index_Schema_2026-04-26_v01_I.md` §7 update workflow). Almost always `true` for ADDED/REMOVED; may be `false` for a MODIFIED entry that changes prose without touching heading structure. |
| `cascade_check` | enum: NOT-APPLICABLE \| REQUIRED \| ATTESTED | required | Whether this delta plan's changes trip META-8 (a change to D2R input-doc *structure*, not just doc *content*, cascades — see `META8_Cascade_Discipline_2026-07-04_v01_I.md` §1/§3). Most bundle-doc content edits are NOT-APPLICABLE; a new required section pattern or a renamed doc-class would be REQUIRED. |
| `open_gaps[]` | array of strings | optional | Bundle-doc changes identified as needed but not yet entered as delta entries (e.g., discovered late in the run, deferred to a follow-up pass). Mirrors the `GAP` marking convention in BIDX-4. |

## How it feeds its mode

**Mode 3 (00F, primary).** The Bundle Delta Plan is authored **in-flight** during Mode 3 execution,
not as a pre-pass or a post-hoc summary. As each bundle doc is touched — a TRD section revised to
reflect a new capability's technical shape, a TQVCD verification-coverage entry added, a UXD screen
spec updated — the corresponding `delta_entries[]` row is written in the same working session. This
operationalizes Lock L6: "Mode 3 updates the 6-doc bundle inline" is true only if there is a
contemporaneous record proving the bundle was in fact updated, doc by doc, section by section. At
Mode 3 exit, the Bundle Delta Plan is cross-checked against the bundle's own BIDX-5 change log
(`Bundle_Index_Schema_2026-04-26_v01_I.md` §4.5) — every delta entry should have a corresponding
BIDX change-log line, and vice versa; a mismatch is a defect requiring reconciliation before Mode 3
can exit its ASAE gate.

**Mode 4 (00S, secondary).** Mode 4 (staged cutover) touches the bundle less often than Mode 3, but
when a cutover event forces a bundle-doc change (e.g., a rollback path added to TRD, a migration
constraint added to AVD), the same schema applies — driven by the Cutover Plan (schema #5) rather
than the Capability Spec. Mode 4 runs that touch zero bundle docs simply produce a Bundle Delta Plan
with an empty `delta_entries[]` and a note explaining why (e.g., "cutover is routing/infra only, no
bundle-doc-visible change").

## Minimal example

```yaml
capability_spec_ref: docs/CapSpec_inline-edit-mode_2026-07-06_v01_I.md
bundle_ref: cold-read_2026-04-25/BIDX_cold-read_2026-04-25_v03_A.md
delta_entries:
  - doc: TRD
    change_type: MODIFIED
    sections_touched: [TRD-4.3]
    rationale: >
      Capability Spec §2 (inline-edit-mode) requires a new persistence path (debounced
      autosave) not covered by the existing TRD-4.3 persistence-layer section.
    authored_at: 2026-07-06T14:32:00Z
    bidx_reindex_required: false
  - doc: TQVCD
    change_type: ADDED
    sections_touched: [TQVCD-3.5]
    rationale: >
      New verification-coverage entry for debounced-autosave race conditions, per
      Capability Spec §4 acceptance_criteria_summary item 3.
    authored_at: 2026-07-06T15:10:00Z
    bidx_reindex_required: true
  - doc: UXD
    change_type: MODIFIED
    sections_touched: [UXD-2.4]
    rationale: Autosave indicator added to the component token table for the edit surface.
    authored_at: 2026-07-06T15:22:00Z
    bidx_reindex_required: false
cascade_check: NOT-APPLICABLE
open_gaps:
  - "PSCAD not yet updated for autosave's new production pattern (debounce-under-network-flap); deferred to next pass."
```

## Honest gaps

- **Reconciliation timing is not yet hook-enforced.** The cross-check between `delta_entries[]` and
  the bundle's BIDX-5 change log is currently a Mode-3-exit manual/ASAE-gate step, not a
  structurally-enforced hook rule. If Stage 10 hook wiring extends Tier 25 (or a new tier) to check
  this reconciliation automatically, this spec will need a corresponding update — itself a META-8
  cascade candidate.
- **`sections_touched` granularity is author-discretion.** The schema requires heading-prefix IDs
  but does not mandate leaf-level (e.g., `TRD-4.3.1` vs. `TRD-4.3`) granularity. A future amendment
  may tighten this once enough Mode-3 runs exist to observe whether coarse-grained entries cause
  traceability gaps in practice.
- **No first real-world Mode-3 run has exercised this schema yet** (FORK-A v03 stack is still under
  construction as of this writing). The minimal example above is illustrative, not drawn from an
  actual run; field names and semantics may need adjustment once dogfooded.
