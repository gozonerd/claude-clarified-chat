---
title: "Mode 2 (Improvement / findings-driven) — mode spec"
filename: Mode2_Improvement_Spec_2026-07-06_v01_I.md
mode: "2 (Improvement) — Stage-00 track = 00R"
input_schema: "Findings Ledger"
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 4 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
d1_floor: "light-with-guard"
---

# Mode 2 (Improvement / findings-driven) — mode spec

## Purpose

Mode 2 is the **findings-driven** brownfield mode: its delta origin is not a fresh idea or a
capability decision, but a **Findings Ledger** — a record of things already known to be wrong (or
once known to be wrong) in a codebase that already exists. Mode 2 exists to answer, per finding:
*is it still true, and if so, fix it without re-litigating what already works.* Per the LEAD
(§2 row "Mode 2 · Improvement (findings-driven)"), Stage-00 for this mode is **00R**, Stage-01 is
**01R** (plan from Findings Ledger Section B), fix stages are **02R-NN** (one per finding), and the
exit gate is **QA-R**. This doc specs the 00R checklist, the D1 architecture-fit floor for Mode 2,
and the QA-R protocol.

## Input gate (requires existing bundle on-demand + a Findings Ledger)

Per LEAD §5.0's per-mode input gate: Mode 2 requires the **Findings Ledger** unconditionally (there
is no Mode-2 run without one — an empty or absent ledger is a refusal, not a degenerate "nothing to
do" pass), and the **6-doc bundle on-demand-required** — meaning 00R may pull bundle docs (PRD/TRD/
AVD/etc.) as needed to ground a finding's context, but does not require the full bundle be current
or complete before it can start, unlike Modes 3 and 4 where the bundle is required-universal. If a
Findings Ledger is missing, refuse and point to its authoring path
(`skills/dare-to-rise-code-plan/references/schemas/Findings_Ledger_Spec_2026-07-06_v01_I.md`) rather
than silently proceeding or fabricating findings.

Every finding consumed by 00R must already carry the Findings Ledger's full field set — in
particular `verification_status` and `boundary_touch` (see D1 floor, below) — populated. A finding
missing either field is a schema violation upstream of Mode 2, not something 00R papers over.

## Stage-00 (00R) checklist

00R is a **re-verification** pass, not a from-scratch assessment. Per LEAD §5.2, it explicitly
**drops** the Mode-1 tracks that assume nothing exists yet — the scaffold/stack-selection class
(project scaffolding, framework choice, initial architecture layout) has no object in a brownfield
run where the code is already built. It **keeps** production-engineering, accessibility, and
test-strategy tracks, but runs them as re-verification passes against the existing system rather
than first-time assessments. It **adds** three tracks specific to findings-driven work:

1. **Per-finding verification protocol (the trichotomy).** For every finding in the ledger, confirm
   exactly one of:
   - **STILL-PRESENT** — reproduce the finding against current `HEAD`. Record the reproduction
     method and result. This is the only status that proceeds to fix-stage planning (01R).
   - **REMEDIATED-INCIDENTALLY** — the finding no longer reproduces, and the fix was not a response
     to this finding (it resolved as a side effect of unrelated work since the finding was raised).
     Close with a note citing what incidentally fixed it; do not plan a fix stage.
   - **SCOPE-CHANGED** — the code or feature the finding targeted has changed shape enough (moved,
     renamed, replaced, removed) that the finding as written can no longer be actioned as-is. Route
     back for re-scoping before it can be planned; do not force it into STILL-PRESENT or close it
     silently.

   00R must re-run this check even where the Findings Ledger already carries a
   `verification_status` value — the ledger's value may be stale by the time 00R executes (findings
   can sit between hostile review and Mode-2 dispatch). 00R's job is to *confirm or correct* the
   ledger's status, not trust it blindly.

2. **Regression-surface mapping.** For each STILL-PRESENT finding, map what else touches the code
   path the fix will change — call sites, shared utilities, adjacent tests, other findings in the
   same ledger that share a file or module. This produces the set of things a fix could break that
   the finding itself doesn't mention. Feeds both the fix-blast-radius analysis (next) and QA-R's
   re-test scoping.

3. **Fix-blast-radius analysis.** For each STILL-PRESENT finding, characterize how far the fix's
   effect radiates: contained-to-one-function, contained-to-one-module, or crossing a module/
   interface boundary. This is not a separate exercise from regression-surface mapping — blast-
   radius analysis is what produces the answer regression-surface mapping needs, and it is also the
   **source of truth for `boundary_touch`** (see D1 floor, below). Whoever runs this track must
   produce output specific enough to set `boundary_touch` honestly; a vague or contested blast-
   radius result is itself a finding-level risk to flag, not something to paper over with a default.

Each of these three tracks runs **per finding**, not once for the ledger as a whole — a ledger
commonly mixes trivial local fixes with one or two structurally deeper ones, and 00R's job is to
tell them apart, not average across them.

## D1 floor (00R light-with-guard)

Per the FORK-A D1 ruling (`docs/FORK-A_Rulings_and_Execution_Spec_2026-07-03_v01_I.md`, §2, §3.1):
architecture-fit analysis is **never skipped** in any brownfield mode, but its depth is sized to a
**per-mode floor**. Mode 2's floor is **light-with-guard**:

- **Default: light.** Most findings are local fixes — a bug contained inside one function or
  module. Running a full AVD-equivalent architecture-fit analysis on every bug ticket would be
  disproportionate bureaucracy for the great majority of Mode-2 work. So 00R's architecture-fit pass
  defaults to a light touch: a brief confirmation that the fix stays inside its component's
  boundary, recorded but not belabored.
- **Guard: `boundary_touch` escalates it.** The Findings Ledger schema carries a required
  `findings[].boundary_touch` boolean per finding (schema spec:
  `skills/dare-to-rise-code-plan/references/schemas/Findings_Ledger_Spec_2026-07-06_v01_I.md`,
  ## D1 field). When a finding's `boundary_touch = true` — i.e., the fix-blast-radius analysis above
  determined the fix crosses a module/interface boundary — **00R escalates architecture-fit
  analysis for that finding specifically.** The escalation is per-finding, not per-ledger: a batch
  of ten findings with one boundary-crossing fix among them gets light treatment on nine and a
  substantive fit-vs-existing-architecture pass on the one.
- **Escalated depth, calibrated.** The escalated pass is proportionate to the boundary actually
  crossed — materially more than the light default (a real analysis of how the fix's crossing
  interacts with the components on both sides of the boundary: contract stability, callers on the
  far side, data shape at the seam), but not automatically Mode 3's full substantive-by-default
  depth, since Mode 2's origin is still "fix a known-wrong thing," not "add a capability." The exact
  checklist shape for an escalated 00R pass (required sections, sign-off) is not yet specified
  in this doc — flagged in Honest gaps, below, as deferred detail Stage 9's `dare-to-rise-code-plan`
  SKILL amendment may need to pick up.
- **Encode this as the floor, not a suggestion:** a STILL-PRESENT finding with `boundary_touch =
  true` that reaches Stage 01R planning without a completed escalated architecture-fit pass is a
  gate violation — the same way a finding reaching 02R execution with `fix_stage_mapping` still null
  is a violation per the Findings Ledger spec. "Light-with-guard" is a floor with teeth, not a
  default that can be silently skipped by not noticing the flag.

This is the whole of D1's Mode-2 encoding: **light unless `boundary_touch` trips; when it trips,
escalate for that finding only.**

## QA-R protocol

QA-R is Mode 2's exit gate (LEAD §2, Stage-QA row). It has two components, both mandatory:

1. **Re-run hostile review.** Re-run the same class of hostile/adversarial review that originally
   surfaced STILL-PRESENT findings (or the ledger's `source` class generally — hostile-review,
   gate-log, user-report), targeted at the fixed code paths plus their regression surface (from the
   00R mapping above). The goal is to catch both incomplete fixes and fixes that introduced new
   problems in the regression surface, not just to confirm the original bug is gone.
2. **Verify per-finding closure substance, not just "marked fixed."** For every finding that
   received a fix stage (`fix_stage_mapping` populated), run its `re_test_method` as specified in
   the Findings Ledger and confirm the *specific* re-test converts the finding from STILL-PRESENT to
   closed — a fix stage marked complete without its re-test having actually run, or a re-test that
   checks something adjacent to the finding rather than the finding itself, does not satisfy QA-R.
   "Marked fixed" is a claim; QA-R's job is to check the claim against the substance the
   `re_test_method` field committed to, not accept the claim at face value.

QA-R closes a Mode-2 run only when every STILL-PRESENT finding that received a fix stage has passed
its specific re-test **and** the re-run hostile review does not surface new findings in the
regression surface that the original ledger didn't cover. New findings surfaced by the re-run
hostile review do not block QA-R from closing the *original* ledger's items, but they must be
captured as a new Findings Ledger entry (or amendment) before the run is called done — QA-R does not
silently drop what it finds.

Exit gate: this is the **threshold-2 research-rigor gate**, with a Mode-2 audit checklist covering
(a) trichotomy resolution recorded for every finding, (b) `boundary_touch` set and honest for every
finding, (c) escalated architecture-fit pass completed and recorded for every `boundary_touch: true`
finding, (d) `re_test_method` executed and its result recorded for every finding with a fix stage,
(e) hostile-review re-run executed against the regression surface, with any new findings captured
rather than dropped.

## Honest gaps

- **The escalated-pass checklist shape is unspecified here.** This doc names when 00R must escalate
  architecture-fit analysis (`boundary_touch = true`) and how deep it should land (materially more
  than light, less than Mode 3's substantive-by-default), but does not yet define a concrete
  required-sections/sign-off checklist for that escalated pass. Per the Findings Ledger spec's own
  honest gaps, this is deferred detail that the companion Stage-9 `dare-to-rise-code-plan` SKILL
  amendment may need to pick up before 00R's escalation path is fully executable, not just specified.
- **The tie-breaking rule for a vague blast-radius result is not defined.** If the fix-blast-radius
  track cannot produce a clean boundary-crossing yes/no, `boundary_touch` becomes a judgment call
  again — this spec inherits that open question from the Findings Ledger schema spec rather than
  resolving it.
- **`re_test_method` quality is only as good as what was written into the ledger.** QA-R verifies
  that the specified re-test ran and produced the claimed result; it does not independently judge
  whether the `re_test_method` as written was itself a rigorous enough test. A weak re-test method
  that nonetheless "passes" is a Findings-Ledger-authoring-quality problem, not something this spec
  claims QA-R catches.
- **Regression-surface mapping's completeness is not independently audited.** 00R produces the
  regression surface it finds; there is no second pass in this spec that checks whether 00R missed
  part of the true surface. QA-R's hostile-review re-run is the closest backstop, and it is
  reactive (it finds what it finds), not a completeness guarantee.
