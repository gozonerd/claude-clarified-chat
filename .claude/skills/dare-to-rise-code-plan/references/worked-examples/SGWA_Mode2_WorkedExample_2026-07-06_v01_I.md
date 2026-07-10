---
title: "SGWA Worked Example — Mode 2 (Improvement / findings-driven)"
filename: SGWA_Mode2_WorkedExample_2026-07-06_v01_I.md
mode: 2
example_app: "Simple Games Web App (SGWA) — canonical worked example (L3)"
status: "theoretical/projected (L10) — refine post-actual-build"
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 6 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
---

# SGWA Worked Example — Mode 2 (Improvement / findings-driven)

## The SGWA scenario for this mode

SGWA (Tic-Tac-Toe, Reaction-Time, shared Leaderboard) already exists — built under Mode 1. A
hostile review pass has just run against it and surfaced three findings, ranging from a real
concurrency bug in the game-state layer to a cosmetic accessibility gap. Mode 2 does not touch
anything the hostile review didn't flag: its whole premise is *fix what's confirmed wrong, leave
what already works alone*. This scenario is chosen deliberately to include one finding whose fix
cannot stay local — it crosses the boundary between the `ScoreEventBus` and the Leaderboard's
persistence layer — so this doc can demonstrate the D1 light-with-guard floor actually tripping.

## Inputs

Mode 2's input gate (LEAD §5.0) is **existing bundle, on-demand-required** — 00R may pull the PRD/
TRD/AVD/etc. as needed to ground a finding's context, but does not require the full bundle be
current before starting — plus a **Findings Ledger**, which is unconditionally required (no ledger,
no Mode-2 run). The Findings Ledger for this run:

```yaml
findings:
  - id: F-2026-0201
    severity: high
    source: hostile-review
    verification_status: STILL-PRESENT
    fix_stage_mapping: null
    sources_of_findings: ["SGWA hostile review 2026-07-05, finding #2"]
    tier: T2
    risk_accept_authority: null
    re_test_method: "reproduce the race via concurrent rapid-click + tab-switch on Reaction-Time,
      confirm ScoreEventBus no longer emits a duplicate or stale score event after fix"
    boundary_touch: true   # fix changes the ScoreEventBus publish contract AND the Leaderboard's
                            # localStorage write path that consumes it
  - id: F-2026-0202
    severity: medium
    source: hostile-review
    verification_status: STILL-PRESENT
    fix_stage_mapping: null
    sources_of_findings: ["SGWA hostile review 2026-07-05, finding #5"]
    tier: T3
    risk_accept_authority: null
    re_test_method: "axe-core scan of Leaderboard ranked-list in both themes; confirm no missing
      accessible-name violations on rank-change indicator icons"
    boundary_touch: false  # fix is confined to the Leaderboard component's markup/aria
  - id: F-2026-0203
    severity: low
    source: gate-log
    verification_status: STILL-PRESENT
    fix_stage_mapping: null
    sources_of_findings: ["CI a11y gate run 2026-07-04, contrast-check failure"]
    tier: T4
    risk_accept_authority: null
    re_test_method: "re-run both-theme contrast check on Tic-Tac-Toe board's dark-theme cell
      borders; confirm 3:1 non-text contrast ratio met"
    boundary_touch: false  # fix is a single CSS custom-property value change
```

**F-2026-0201** is the game-state race: on Reaction-Time, a rapid click immediately followed by a
tab-switch (backgrounding the tab mid-round) can cause the state machine to emit a score event
*after* the Leaderboard has already written that session's final rank to `localStorage`, producing
a duplicate/stale entry. **F-2026-0202** is an a11y gap: the Leaderboard's rank-change indicator
icons (up/down arrows on reorder) have no accessible name. **F-2026-0203** is a dark-theme contrast
shortfall on Tic-Tac-Toe's board cell borders, caught by the CI gate rather than the review.

## Stage-00 (00R) walkthrough

00R runs the trichotomy check, regression-surface mapping, and fix-blast-radius analysis
per finding, not once for the ledger as a whole.

**F-2026-0201.** Re-reproduced against current `HEAD`: confirmed STILL-PRESENT (00R re-runs the
check rather than trusting the ledger's pre-existing value, which may be stale by dispatch time).
Regression-surface mapping finds the fix touches `ScoreEventBus.publish()` inside Reaction-Time's
state machine, the Leaderboard's `localStorage`-writing subscriber, and — because Tic-Tac-Toe
publishes through the same bus — Tic-Tac-Toe's publish call site too, even though it wasn't named
in the finding. Fix-blast-radius concludes **crossing a module/interface boundary**: the fix
requires changing the `ScoreEventBus` contract itself (a monotonic sequence number so the
Leaderboard can reject stale events), not a fix contained inside Reaction-Time alone.
`boundary_touch = true` is confirmed as accurate, not copied from the ledger unexamined.

**F-2026-0202.** Re-reproduced: STILL-PRESENT. Regression surface: confined to the Leaderboard's
rank-indicator markup, no shared/cross-game surface touched. Blast-radius: contained-to-one-
component. `boundary_touch = false` confirmed.

**F-2026-0203.** Re-reproduced: STILL-PRESENT. Regression surface: one CSS custom-property token
used only by Tic-Tac-Toe's board-cell border. Blast-radius: contained to a single token value.
`boundary_touch = false` confirmed.

### D1 floor in action — the light-with-guard escalation

This is where Mode 2's D1 floor (`docs/FORK-A_Rulings_and_Execution_Spec_2026-07-03_v01_I.md` §2,
§3.1) visibly does two different things on two findings in the same ledger:

- **F-2026-0202 and F-2026-0203 get the light default.** 00R's architecture-fit pass for both is a
  brief, one-line confirmation that the fix stays inside its component's boundary. No architecture
  document is opened, no cross-component contract examined — the blast-radius analysis already
  showed there's nothing there to examine.
- **F-2026-0201 trips the guard.** Because `boundary_touch = true`, 00R escalates: a substantive
  fit-vs-existing-architecture pass on the `ScoreEventBus` contract change — how a sequence-number
  field interacts with both publishers (Tic-Tac-Toe, Reaction-Time) and the subscriber
  (Leaderboard), whether the change is backward-compatible with any future subscriber the AVD
  anticipates, and whether the stale-event-rejection logic introduces its own new failure mode
  (e.g., rejecting a legitimately-delayed-but-valid event). Materially deeper than the light
  default, but scoped to the one boundary crossed — not a full AVD-equivalent review of SGWA's
  whole event system, which would be disproportionate to a three-finding bug-fix ledger.
- **The escalation is per-finding, not per-ledger** — F-2026-0202/0203 aren't dragged into extra
  scrutiny just for sharing the ledger. Light unless `boundary_touch` trips; when it trips,
  escalate for *that finding only*.

This is the concrete gate check the Findings Ledger spec requires: a STILL-PRESENT finding with
`boundary_touch = true` (F-2026-0201) does not reach Stage 01R planning without this escalated
pass completed and recorded — reaching 01R without it would be a gate violation.

## Stage sequence (abbreviated)

- **Stage 01R (Opus):** plans from the Findings Ledger's Section B (the resolved STILL-PRESENT
  subset). Three fix stages are mapped: `02R-01` → F-2026-0201 (ScoreEventBus sequence-number
  contract change + Leaderboard stale-event rejection), `02R-02` → F-2026-0202 (accessible names on
  rank-indicator icons), `02R-03` → F-2026-0203 (contrast token fix). `fix_stage_mapping` is
  populated for all three findings, closing the null-until-planned state.
- **Stage 02R-01 (Haiku, Deep spec — escalated 00R pass feeds the spec depth here):** implements
  the `ScoreEventBus` sequence-number field, updates both publishers, updates the Leaderboard
  subscriber's rejection logic. Because this stage crosses the boundary the D1 guard flagged, its
  Deep spec is written with the escalated architecture-fit pass's findings folded in directly
  (exact field name, exact comparison semantics, exact behavior on out-of-order arrival) — the
  escalation isn't just a planning-time formality, it shapes what Haiku is handed to transcribe.
- **Stage 02R-02 (Haiku, Deep spec):** adds `aria-label` values to the rank-change indicator icons
  per the UXD's existing icon-labeling convention.
- **Stage 02R-03 (Haiku, Deep spec):** updates the dark-theme board-cell-border CSS custom property
  to a value verified at 3:1 contrast.
- Each fix stage exits through its own ASAE gate + commit gate before the next begins, per the
  standard Stage 02+ discipline Mode 2 shares with Mode 1.

## QA-R walkthrough

QA-R runs its two mandatory components against all three findings:

1. **Re-run hostile review**, targeted at the fixed code paths plus their regression surface —
   critically, this includes re-testing **Tic-Tac-Toe's** publish call site even though the
   original finding only named Reaction-Time, because 00R's regression-surface mapping flagged it
   as sharing the `ScoreEventBus`. The re-run confirms no duplicate/stale score events on either
   game under the same rapid-click-plus-tab-switch pattern.
2. **Per-finding closure substance**, not "marked fixed": F-2026-0201's `re_test_method` (reproduce
   the race, confirm no duplicate/stale event) is actually re-run against `02R-01`'s output — not
   accepted on the strength of the stage being marked complete. Same for F-2026-0202's axe-core
   both-theme scan and F-2026-0203's contrast re-check.

QA-R closes this ledger because all three STILL-PRESENT findings passed their specific re-tests and
the re-run hostile review surfaced nothing new in the regression surface. Had the re-run turned up
a new issue (say, the sequence-number fix introduced a fresh edge case), QA-R would still close
these three findings but would require that new issue captured as a new Findings Ledger entry
before the run is called done — it does not get to silently drop what it finds.

## What this example demonstrates

- The **Findings Ledger as Mode 2's unconditional required input**, distinct from the bundle's
  on-demand posture.
- The **00R trichotomy** applied per finding, including 00R re-confirming a status rather than
  trusting the ledger's existing value.
- **Regression-surface mapping surfacing an un-named related risk** (Tic-Tac-Toe sharing the same
  bus as the named Reaction-Time finding) — the mechanism that makes fix-blast-radius analysis more
  than a rubber stamp.
- **The D1 light-with-guard floor tripping concretely**: two findings (F-2026-0202, F-2026-0203)
  get the light default; one finding (F-2026-0201, `boundary_touch = true`) gets the escalated
  architecture-fit pass, scoped to the boundary actually crossed rather than a full AVD review.
- **QA-R's two-part closure discipline** — hostile-review re-run plus actually-executed per-finding
  re-tests, not acceptance of "marked fixed" claims at face value.

## Honest gaps

- This is a **projected** worked example (L10) — the Findings Ledger, the specific race-condition
  mechanics, and the escalated architecture-fit pass's content are illustrative of the *shape* 00R/
  QA-R output takes, not verified outputs of an actual Mode-2 run against a real, previously-built
  SGWA. Refine against the real hostile-review output once SGWA is actually built and reviewed.
- The **escalated-pass checklist shape is unspecified** in the Mode 2 spec itself (per its own
  Honest Gaps) — this doc shows a plausible instantiation (examine both publishers + the
  subscriber + backward-compatibility + new-failure-mode risk) but that is this doc's own
  construction, not a checklist the spec mandates section-by-section.
- The **tie-breaking rule for a vague blast-radius result** is not exercised here — all three
  findings in this ledger produced a clean boundary-crossing yes/no. A real ledger may include a
  finding where that determination is contested, which this example does not model.
- **Regression-surface completeness is not independently audited** in this example beyond what 00R
  itself found (the Tic-Tac-Toe shared-bus risk) — per the spec, QA-R's hostile-review re-run is
  the only backstop, and it is reactive, not a completeness guarantee.
