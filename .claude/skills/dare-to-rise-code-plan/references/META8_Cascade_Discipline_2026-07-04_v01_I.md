---
title: "META-8 — D2R-Input-Cascade-Discipline (in-repo canonical restatement + v03 extension)"
filename: META8_Cascade_Discipline_2026-07-04_v01_I.md
id: META8_Cascade_Discipline_2026-07-04
version: v01_I
created: 2026-07-04
authored_by: Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 build, Stage 2.5
classification: internal (mm-d2r-code-plan-stack)
supersedes_as_source_of_truth: >
  The archived Batch-2 handoff Lock 4 (Methodology_Mods_Batch2_Handoff_2026-04-27_v01_I.md,
  §4.1–4.3), which lived only in a transcript archive. This file is the in-repo canonical
  restatement so no future session must do transcript archaeology to apply the discipline.
source_provenance: >
  mm-thread-archive/code-sessions/2026-05-09/2026-05-09_c--users-nerdykrystal--grand-repo_
  ad1c87f8-9f5e-4b72-980c-2c68cd4505d9.jsonl (JSONL line 496 tool_result; embedded doc
  Methodology_Mods_Batch2_Handoff_2026-04-27_v01_I.md internal lines 216–271). Extracted
  verbatim by a TESS-T1 Sonnet scout 2026-07-04; §4.1–4.3 below are faithful to that source.
build_ruling: >
  Built EARLY (Stage 2.5, ahead of Stage 3) per FORK-A decision D2 (OPEN-2), so the v03
  stack's own construction — starting with Stage 3's schema-field additions — is itself
  cascade-governed. See §5 (v03 extension) and §6 (bootstrap honesty).
---

# META-8 — D2R-Input-Cascade-Discipline

> **Why this file exists in the repo now.** META-8 was principle-locked and mechanism-designed
> on 2026-04-27, but its specification lived only in a transcript archive. FORK-A decision **D2**
> ruled that META-8 is built **early** (Stage 2.5) rather than last, precisely so the v03 build's
> own input-structure changes (the 8-schema family, the mode dispatch) are governed by the very
> discipline they would otherwise escape. Step one of "build it early" is **restating it in the
> repo** — this document — so the discipline is applyable without archaeology. §1–§4 are the
> faithful restatement of the 2026-04-27 lock; **§5 is the new v03 extension** (the §3.2 nuance
> resolved inline); §6 is the bootstrap-honesty caveat.

---

## 1. Principle (§4.1, faithful restatement)

Any modification to **D2R input-doc structure** — a new doc, a new section, a new field, a
rename, or an alignment-chain change — MUST cascade through **5 layers** before the modification
counts as **"done"**:

1. **`/ideate-to-d2r-ready` skill** — alignment chains updated *semantically* (not just string substitution).
2. **`/write-{doc}` skills** — authoring procedures updated.
3. **Per-doc templates** updated.
4. **Per-repo doc instances** migrated.
5. **Cascade-completion attestation** authored.

A structural change that has touched only some of these layers is **not done** — it is
in-progress. "Done" is a five-layer property, not a single-commit property.

## 2. Enforcement mechanism (§4.2, faithful restatement) — defense in depth

All **three** sub-mechanisms run together (per `codify-larger-principles`: defense-in-depth is
the standing answer when *single-point-of-claim-bypass* is the failure mode).

**(a) Cascade-checklist hook (Hook v07+ Tier 25).**
Any commit touching a D2R template, skill, or canonical methodology doc triggers a
cascade-completion-attestation **requirement**. The hook checks for an attestation file at:

```
_grand_repo/.claude/scratch/cascade-attestations/{change_id}_attestation.md
```

referencing the change and listing each layer's status: `DONE / IN-PROGRESS / RESERVED / NOT-APPLICABLE`.

**(b) Cascade-tracker doc.**
Central ledger at:

```
_grand_repo/docs/Cascade_Tracker_2026-04-27_v01_I.md
```

records every cascade event with this schema:

```yaml
cascades:
  - change_id: <UUID>
    initiating_commit: <SHA>
    description: <e.g., "TQCD→TQVCD rename per Mod 6.5">
    layers:
      ideate_to_d2r_ready: { status, commit_sha, attestation_section_ref }
      write_skills:        { status, commits_per_skill, attestation_section_ref }
      templates:           { status, commit_sha, attestation_section_ref }
      per_repo_instances:  { status, repos_migrated, repos_reserved, attestation_section_ref }
      attestation:         { status, doc_path, commit_sha }
    started: <ISO 8601>
    completed: <ISO 8601 OR null>
```

**(c) Methodology version pin.**
Each consuming repo declares which D2R Code Plan Stack version it uses in `.claude-canonical-ref`
(per the SSOT architecture). The pin is enforced at submodule-update time. A pin mismatch —
consuming repo on an old version while the SSOT has advanced *and* a cascade-attestation exists
for the change — flags that consumer for migration.

**Why all three:** the hook catches at change-time; the tracker provides audit + visibility;
the version pin closes the loop on consumer-side application.

## 3. Trigger conditions (§4.3, faithful restatement)

The following all trigger a META-8 cascade:

- **META-1** registry updates
- **META-4** brand-rename catalog updates
- **META-9** IP-classification catalog updates
- **Mod-12 (A22)** attestation-schema changes
- **Any SSOT version bump** (per the SSOT architecture)

## 4. Origin (why the discipline is structural, not memory-based)

Discovered 2026-04-27 evening during the META-1 walkthrough: Batch 1's **Mod 6.5 TQCD→TQVCD
rename almost shipped without cascading to `/ideate-to-d2r-ready`**. Relying on author memory is
*exactly* the failure mode META-8 prevents. Krystal locked "don't defer beyond Batch 2"; the
principle + the three-part enforcement mechanism were codified together. (Batch 1 was amended in
place to include the Mod-6.5 cascade.)

---

## 5. v03 EXTENSION — covering the 8-schema / mode-dispatch family (NEW, 2026-07-04)

**The nuance (FORK-A spec §3.2).** META-8's five layers were written against the **6-doc bundle**
(PRD / TRD / AVD / TQVCD / UXD / PSCAD). The v03 improvement pass introduces a **second,
structurally-distinct input family**: the **8 per-artifact brownfield schemas** (LEAD §3, Option-B
set) plus the **mode-dispatch machinery** (Modes 1–4, the EV stage, the per-mode Stage-00 tracks).
A change to *this* family is unambiguously a "modification to D2R input-doc structure" under §1 —
but the five layers named in §1 point at 6-doc-bundle artifacts that don't all have 1:1 analogues
in the new family. This section resolves that inline: it **maps** the five layers onto the new
family. It is an **extension, not a redesign** — the principle (§1), the enforcement (§2), and the
triggers (§3) are unchanged; only their *referents* are broadened.

### 5.1 The governed artifact set (v03 additions)

The 8 per-artifact brownfield schemas:

| # | Schema | Primary mode-role |
|---|---|---|
| 1 | Opportunity Assessment | all modes (framing) |
| 2 | Customer Letter | all modes (intent) |
| 3 | Findings Ledger | Mode 2 (00R) input |
| 4 | Capability Spec | Mode 3 (00F) input |
| 5 | Cutover Plan | Mode 4 (00S) input |
| 6 | Phased Plan | shared |
| 7 | Bundle Delta Plan | shared |
| 8 | Deprecation Events | Mode 4 (00S) |

…plus the **mode-dispatch logic**, the **EV (Environment-Verification) stage** definition, and the
**per-mode Stage-00 track** definitions (00R / 00F / 00S).

### 5.2 Layer mapping for the 8-schema / mode-dispatch family

| §1 layer | 6-doc-bundle referent | **8-schema / mode-dispatch referent (this extension)** |
|---|---|---|
| 1. `/ideate-to-d2r-ready` alignment chains | doc↔doc alignment chains | **mode-dispatch + input-selection logic** — which schema is required for which mode; the EV-stage entry conditions. A change here must update `/ideate-to-d2r-ready`'s dispatch/onboarding phases *semantically*. |
| 2. `/write-{doc}` skills | one `/write-*` skill per doc | **the authoring procedures for the 8 schemas** — HOW each schema is written/filled (distinct from L1, which is *which* schema a mode selects). In v03 these procedures live in the **Mode 2/3/4 spec docs** (Stage 4) and the **`dare-to-rise-code-plan` per-mode schema-authoring sections** (Stage 9), *not* in separate `/write-{schema}` skills. (L1 = routing/selection logic; L2 = the write-up procedure. If a schema is later promoted to its own `/write-*` skill, that skill joins this layer.) |
| 3. Per-doc templates | one template per doc | **one template per schema** among the 8 (created as each schema is first authored). A schema-structure change cascades to its template. |
| 4. Per-repo doc instances | migrate instances in consuming repos | **migrate brownfield-mode schema instances** — repos that have run Mode 2/3/4 carry Findings-Ledger / Capability-Spec / Cutover-Plan instances; these migrate (or are RESERVED if the repo is dormant). |
| 5. Cascade-completion attestation | attestation authored | **unchanged** — same attestation mechanism (§2a). |

### 5.3 Extended trigger list (adds to §3)

In addition to the §3 triggers, a META-8 cascade is triggered by:

- **A change to any of the 8 per-artifact schemas** (new schema, new field, field rename, removal).
- **A change to mode-dispatch logic** (adding/removing a mode, changing which schema a mode requires).
- **A change to the EV-stage definition** or to a per-mode **Stage-00 track** (00R / 00F / 00S) depth rule.

### 5.4 The D1/D2 interlock — the first cascade this extension governs

FORK-A decision **D1** adds two fields at Stage 3: **`architecture_fit`** (Capability Spec) and
**`boundary_touch`** (Findings Ledger). Under §5.3 those are **schema-field additions** — i.e. the
**first real cascades** governed by META-8's extended definition. Because D2 built META-8 *before*
Stage 3, the stack **dogfoods its own discipline on its own construction**: D1's schema edits do
not ship "done" until they have cascaded through the §5.2 layers and been attested. This is the
whole point of building META-8 early — the near-miss that created META-8 (a structural change
escaping the cascade) is structurally impossible for the v03 build's own structural changes.

## 6. Bootstrap honesty

META-8 **cannot govern the cascade that builds META-8 itself** (chicken-and-egg): the Stage-2.5
commit that introduces this document, the Tier-25 hook, and the Cascade_Tracker is the one
irreducibly-ungoverned cascade. It is therefore attested **by hand** — the first
`cascade-attestations/` file is authored manually for the META-8 build itself (change_id for the
Stage-2.5 build), establishing the ledger's first row. Every subsequent structural change —
starting with D1's Stage-3 field additions — runs under the automated hook.

## 7. Applying this in the v03 build (operational checklist)

For each subsequent FORK-A stage that changes input structure:

1. Mint a `change_id` (UUID) for the structural change.
2. Author `_grand_repo/.claude/scratch/cascade-attestations/{change_id}_attestation.md` listing
   all five layers (§5.2 referents for the 8-schema family) with `DONE / IN-PROGRESS / RESERVED / NOT-APPLICABLE`.
3. Add a `cascades:` row to `_grand_repo/docs/Cascade_Tracker_2026-04-27_v01_I.md` (§2b schema).
4. Do not mark the stage "done" until the attestation shows every applicable layer `DONE`.
