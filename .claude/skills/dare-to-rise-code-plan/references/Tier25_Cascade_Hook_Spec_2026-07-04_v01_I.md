---
title: "Tier-25 Cascade-Checklist Hook — implementation spec (for Stage-10 wiring)"
filename: Tier25_Cascade_Hook_Spec_2026-07-04_v01_I.md
id: Tier25_Cascade_Hook_Spec_2026-07-04
version: v01_I
created: 2026-07-04
authored_by: Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 build, Stage 2.5
classification: internal (mm-d2r-code-plan-stack)
implements: META-8 §2(a) — the cascade-checklist hook
wire_at: Stage 10 (hook integration), into commit-msg-v10 → commit-msg-v11 as a new Tier 25 rule
rationale_for_split: >
  The commit-msg hook is a 2801-line production gate. Editing it once, at Stage 10 (where ALL hook
  patterns — EV / 02R/F/S-NN stage names + this Tier-25 rule — are batched), avoids a double-edit and
  keeps hook changes in one gated stage. Stage 2.5 defines + seeds the mechanism (spec, ledger,
  bootstrap attestation, version-pin); Stage 10 turns on enforcement.
---

# Tier-25 Cascade-Checklist Hook — implementation spec

## Purpose
Structurally enforce META-8: a commit that changes D2R input-doc structure cannot be marked "done"
until a cascade attestation exists. Relying on author memory is the exact failure mode META-8 was
born from (the 2026-04-27 TQCD→TQVCD near-miss).

## Trigger condition (when the rule fires)
The staged fileset of the commit touches **any** of:
- a D2R template: `skills/**/references/*_Template_*.md`
- a D2R authoring/dispatch skill: `skills/ideate-to-d2r-ready/**`, `skills/write-*/**`, `skills/dare-to-rise-code-plan/**`
- one of the 8 per-artifact schema spec docs (v03 extension, §5): `skills/**/schemas/*.md` (path TBD-confirmed at Stage 3)
- a canonical methodology doc / SSOT reference under `references/`

## Commit-message contract
Every commit carries exactly one cascade trailer:
```
Cascade: <change_id-uuid>            # a governed structural change; attestation required
# OR
Cascade: NOT-APPLICABLE — <reason>   # touches a triggering path but changes no input structure
                                     # (e.g., typo fix, comment edit, formatting)
```

## Checks (when triggered AND `Cascade:` is a uuid)
1. **Attestation exists:** `_grand_repo/.claude/scratch/cascade-attestations/{change_id}_attestation.md` is present.
2. **All five layers listed:** the attestation names all 5 layers (§L1–§L5) each with a status ∈ {DONE, IN-PROGRESS, RESERVED, NOT-APPLICABLE}.
3. **Ledger row exists:** `_grand_repo/docs/Cascade_Tracker_2026-04-27_v01_I.md` contains a `change_id: {change_id}` row.
4. **Completion honesty (WARN, not REFUSE):** if the commit message claims the stage is "done"/"complete" but any applicable layer is not DONE, warn loudly (a structural change with open layers is legitimately IN-PROGRESS; the hook flags premature done-claims, it does not forbid incremental commits).

## Refusal semantics
- Triggering commit with **no** `Cascade:` trailer → **REFUSE** (`exit 2`): "Tier 25 — cascade trailer required."
- `Cascade: <uuid>` but attestation file missing → **REFUSE**: "Tier 25 — attestation not found for {change_id}."
- `Cascade: NOT-APPLICABLE` without a reason → **REFUSE**: "Tier 25 — NOT-APPLICABLE requires a reason."
- Otherwise → pass.

## Bootstrap exemption
The META-8 build commit itself (change_id `c4670371-c7ae-4c96-8e32-b4d4d9972a9d`) predates the hook
and is attested by hand (§6). No exemption code is needed — the hook does not exist until Stage 10,
which is after Stage 2.5. Document this ordering in the v11 changelog so it is not mistaken for a gap.

## Fail-closed posture
Consistent with the rest of commit-msg-v10 (identity_attestation Tier 13, rater Tier 1c): on any
internal error evaluating this rule, **refuse** (`exit 2`) rather than pass. A silently-skipped
cascade check reproduces the original failure mode.

## Test obligations (author at Stage 10 alongside wiring)
- triggering path + uuid + valid attestation → pass
- triggering path + no trailer → refuse
- triggering path + uuid + missing attestation → refuse
- triggering path + `NOT-APPLICABLE — <reason>` → pass
- non-triggering path (e.g., a README typo) + no trailer → pass (rule not fired)
