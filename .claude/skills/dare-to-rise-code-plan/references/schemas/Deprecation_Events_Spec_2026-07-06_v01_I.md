---
title: "Deprecation Events — per-artifact schema spec"
filename: Deprecation_Events_Spec_2026-07-06_v01_I.md
schema_artifact: "8 of 8 (L1 Option-B set)"
mode_role: "Mode 4 (00S, primary); Mode 2 (00R, occasional)"
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 3 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
universal_frontmatter_blocks: [session_chain, disclosures, inputs_processed, persona_role_manifest, target_codebase, existing_bundle, effort_deadline_policy, convergence_counter_discipline]
---

# Deprecation Events — per-artifact schema spec

## Purpose

Per locked LEAD §3: the Deprecation Events schema records **what is retired, when, with what
notice/migration.** It is the artifact that makes retirement of an old capability, endpoint,
config, or code path an explicit, dated, notice-bearing event rather than a silent removal buried
in a diff. It is primarily a Mode-4 (staged-cutover) artifact — cutovers are the mode where old
things get retired on purpose — but Mode 2 (research/remediation) occasionally produces a
deprecation event when a Findings Ledger entry concludes that something discovered during research
should be scheduled for retirement even though Mode 2 itself does not execute the cutover.

Without this artifact, "retired" is whatever the commit history happens to show. With it, every
retirement has a locatable record of *why*, *when it takes effect*, *who was notified and how
long in advance*, *what the replacement path is*, and *how far back a rollback can reach* — the
same rigor the Cutover Plan (schema #5) applies to the OLD→NEW transition, scoped specifically to
the retirement side of that transition.

## Core fields

| field | type | required? | description |
|---|---|---|---|
| `cutover_plan_ref` | string (file path) | required (Mode 4) | Pointer to the Cutover Plan (schema #5) this deprecation event set belongs to. Mode-2-originated events instead set `findings_ledger_ref`. |
| `findings_ledger_ref` | string (file path) | required (Mode 2, if used) | Pointer to the Findings Ledger (schema #3) entry that identified this retirement candidate. Mutually exclusive with `cutover_plan_ref` at the top level, but a Mode-2-originated event MAY later be adopted into a Mode-4 Cutover Plan, at which point both refs are populated. |
| `deprecation_events[]` | array of objects | required, min 1 | The core payload — one entry per thing being retired. |
| `deprecation_events[].what_retired` | string | required | Precise identification of the retiring thing — an endpoint route, a config key, a code path, a feature flag, a doc/schema, a whole service. Name it exactly (path, route, flag name), not descriptively. |
| `deprecation_events[].effective_when` | ISO 8601 date (or date + condition) | required | The date the retirement takes effect, or a condition-gated date (e.g., "2026-09-01, or when consumer telemetry shows zero traffic for 14 consecutive days, whichever is later"). Must not be in the past at authoring time. |
| `deprecation_events[].notice_period` | duration (e.g., `P30D`) + notice channel(s) | required | How much advance notice consumers get and how it is delivered (changelog entry, deprecation header on the API response, email, Slack/status-page post, etc.). Zero notice is permitted only with an explicit justification (e.g., emergency security retirement) — see `deprecation_events[].emergency_justification`. |
| `deprecation_events[].migration_path` | string (prose + link) | required | What consumers do instead. Must be concrete and actionable (a doc link, a code snippet, a codemod, a new endpoint name) — "use the new system" alone is not sufficient. |
| `deprecation_events[].consumer_impact` | enum: NONE \| LOW \| MEDIUM \| HIGH \| SEVERE + prose | required | Severity plus a one-line justification. HIGH/SEVERE entries require the `rollback_window` field to be non-trivial (see below) — high-impact retirements without a meaningful rollback window are a refusal-grade combination per the D2R accessibility-adjacent "no silent breakage" posture. |
| `deprecation_events[].rollback_window` | duration (e.g., `P14D`) or `NONE` (with justification) | required | How long after `effective_when` the retirement can still be reverted without a full re-build. `NONE` is permitted only for retirements that are structurally irreversible (e.g., a data-schema drop) and must carry a one-line reason. |
| `deprecation_events[].emergency_justification` | string | conditional | Required only when `notice_period` is zero or near-zero. Names the specific emergency (security vuln, legal order, etc.) that overrode normal notice. |
| `deprecation_events[].status` | enum: SCHEDULED \| NOTICE-SENT \| IN-EFFECT \| ROLLED-BACK \| CLOSED | required | Lifecycle state, updated as the event progresses. `CLOSED` means the rollback window has lapsed with no rollback — the retirement is now permanent history. |
| `cascade_check` | enum: NOT-APPLICABLE \| REQUIRED \| ATTESTED | required | Whether this retirement trips META-8 (retiring a D2R input-doc structure — e.g., deprecating an entire schema field or doc class — cascades; retiring an app-level API endpoint typically does not). See `META8_Cascade_Discipline_2026-07-04_v01_I.md` §3. |

## How it feeds its mode

**Mode 4 (00S, primary).** The Deprecation Events schema is the retirement-side complement to the
Cutover Plan's OLD/NEW state models. Where the Cutover Plan (schema #5) enumerates `cutover_events[]`
describing the OLD→NEW routing/gateway transition with per-event rollback, Deprecation Events zooms
in specifically on the OLD side of that transition — the things that stop existing, on what
schedule, with what notice. A Mode-4 run's Cutover Plan and Deprecation Events are authored
together and cross-referenced: every cutover event that has an OLD state being fully retired (not
just superseded-but-kept-around) should have a matching `deprecation_events[]` entry, and the two
documents' rollback windows should agree (a Deprecation Event claiming `rollback_window: NONE` while
its paired cutover event claims a 14-day rollback is a contradiction the Mode-4 ASAE gate should
catch).

**Mode 2 (00R, occasional).** Mode 2 is research/remediation — it does not execute cutovers — but a
Findings Ledger entry can conclude "this should be retired" as a *finding*, without Mode 2 itself
scheduling or executing that retirement. In that case, a Deprecation Events instance is opened with
`findings_ledger_ref` populated and `status: SCHEDULED` at best-guess dates, explicitly flagged as
**advisory** until a Mode 4 (or a follow-up Mode 3, if the retirement is bundled with new capability
work) adopts it and populates `cutover_plan_ref`. This keeps Mode 2 honest about its own boundary:
it can surface that something should go away; it cannot itself make that happen.

## Minimal example

```yaml
cutover_plan_ref: docs/CutoverPlan_legacy-auth-retirement_2026-07-06_v01_I.md
deprecation_events:
  - what_retired: "POST /api/v1/auth/legacy-token"
    effective_when: "2026-09-15"
    notice_period: "P45D"
    notice_channel: [changelog, api-deprecation-header, customer-email]
    migration_path: >
      Consumers migrate to POST /api/v2/auth/token (OAuth2 PKCE). Migration guide:
      docs/migration/legacy-token-to-oauth2-pkce.md. Codemod available at
      scripts/migrate-legacy-auth.ts.
    consumer_impact: "HIGH — breaks all API consumers still on v1 auth (est. 12% of active integrations per telemetry)"
    rollback_window: "P14D"
    status: NOTICE-SENT
  - what_retired: "config key AUTH_LEGACY_FALLBACK_ENABLED"
    effective_when: "2026-09-15"
    notice_period: "P45D"
    notice_channel: [changelog]
    migration_path: "No replacement — fallback path is removed entirely once /api/v1/auth/legacy-token retires."
    consumer_impact: "LOW — internal config only, no external consumers"
    rollback_window: "NONE"
    emergency_justification: null
    status: SCHEDULED
cascade_check: NOT-APPLICABLE
```

## Honest gaps

- **`consumer_impact` severity thresholds are not yet numerically calibrated.** The schema names
  five severity levels and requires a non-trivial `rollback_window` for HIGH/SEVERE, but "non-trivial"
  is not yet pinned to a minimum duration. A future amendment should set a floor (e.g., HIGH/SEVERE
  requires `rollback_window >= P7D` unless `NONE` is separately justified) once real Mode-4 runs
  surface what's actually workable.
- **Cross-document rollback-window agreement (Cutover Plan vs. Deprecation Events) is not yet
  hook-enforced** — currently a manual/ASAE-gate cross-check at Mode 4 exit, same open item as the
  Bundle Delta Plan's BIDX reconciliation. Both may become a single Stage-10 hook rule covering
  cross-schema consistency generally, rather than two separate ad hoc checks.
- **No first real-world Mode-4 run has exercised this schema yet.** The minimal example is
  illustrative, not drawn from an actual cutover; expect field adjustments once dogfooded, especially
  around how `status` transitions are recorded (single field mutated in place vs. an append-only
  history list — the latter would mirror the Bundle Delta Plan's append-only entry discipline).
