---
name: Pattern-Space Coverage Audit Document — Template
description: Reusable template for authoring a PSCAD as the 6th D2R prerequisite input to /dare-to-rise-code-plan. Audits pattern-space coverage as a structurally separate axis from code coverage (§5.1) and verification coverage (TQVCD §5.0). Asks "what production input/load/sequence patterns are NOT covered by any test in TQVCD?" — closes the failure mode where tests pass under tested load but deviate under production-shaped concurrency / volume / timing patterns the test surface didn't apply (CDCC plugin Stage 05 proper-lockfile skip empirical case).
type: template
skill: dare-to-rise-code-plan
version: v01_I
date: 2026-04-27
methodology_version: 0.4.0
sibling_to: TQVCD_Template_2026-04-27_v04_I.md (PSCAD audits coverage gaps in TQVCD's verification coverage from a pattern-space angle); PSCAD is authored AFTER TQVCD per /ideate-to-d2r-ready Phase 01 Step 01.6 (deliberate sequence — production memory accumulates between TQVCD authorship and PSCAD authorship)
mod_lineage: Methodology Mods Batch 2 Mod 8 (Production-Pattern Parity Testing + PSCAD); 6th sibling D2R doc joining PRD/TRD/AVD/TQVCD/UXD; META-8 cascade enforced (this template + /write-pscad skill + Production Pattern Catalog + TQVCD §5.0 production_pattern field + D2R SKILL.md 5→6-doc bundle + /ideate-to-d2r-ready Phase 01 Step 01.6 + Phase 02 PSCAD alignment chains)
---

# Pattern-Space Coverage Audit Document — Template

## How To Use This Template

Copy this file. Rename to `[ProjectPrefix]_PSCAD_[YYYY-MM-DD]_v01_I.md`. Fill in every required section. Mark optional sections as NA if not applicable with a one-line reason.

The PSCAD is the 6th D2R prerequisite input. It is downstream of PRD (what the product IS), TRD (what it MUST DO technically), AVD (high-level shape), TQVCD (what success looks like verification-wise), and UXD (visual + interaction polish). The PSCAD is authored DELIBERATELY AFTER TQVCD — the gap between TQVCD-authored time and PSCAD-authored time simulates "production memory accumulating since the code was tested." This delay is structural, not accidental: PSCAD's value is that the author is in a different head-state from TQVCD-author and notices patterns the test surface didn't apply.

**The audit question PSCAD answers:**

> What production input/load/sequence patterns are NOT covered by any test in TQVCD?

Per the Verification-Coverage Principle (`/asae SKILL.md` Section 0, v07), TQVCD §5.0 measures behaviors-verified per behavior-claimed. PSCAD measures pattern-space coverage — a structurally separate axis. A test can satisfy TQVCD §5.0 (mutation-killing test for the claimed behavior) and STILL miss patterns where production load/sequence/concurrency causes the behavior to manifest differently. Coverage metrics (§5.1) measure code-execution density. Pattern-space coverage measures the variety of input/load/sequence shapes the test surface applies to that code.

Empirically motivated by CDCC plugin Stage 05 proper-lockfile skip: passed under tested load, would deviate under production concurrency. The test surface ran tests but didn't apply production-shaped concurrency patterns. Pattern-space coverage was zero for that pattern class even though code coverage was high.

Required sections must be completed before `/dare-to-rise-code-plan` Stage 00 can run. An incomplete PSCAD means Stage 01 cannot fully QA-first-backwards-plan because pattern-space gaps surface late.

### Heading-Prefix IDs

Per `references/Heading_Prefix_ID_Grammar_2026-04-26_v01_I.md`, every load-bearing item appears as a heading with a strict ID prefix. PSCAD uses these TYPE prefixes:

- **PAT** — Pattern declared in scope (§3, §4)
- **CC** — Coverage Claim (§4 — links pattern to TQVCD-VC entry that covers it)
- **GAP** — Gap identified (§5 — pattern with no covering TQVCD entry)
- **REM** — Remediation plan (§6 — what closes the gap)
- **AT** — ASAE Threshold (§7)

Example: `### PSCAD-PAT-04: Concurrent Lockfile Acquisition Under Production Load`. Cross-doc references use the fully-qualified form: `references PSCAD-GAP-02 + TQVCD-VC-12 + TRD-NFR-3.2-04`.

### Authorship Parallelization Markers

Section header markers indicate dependency for team-scaled authorship.

---

## 1. Document Identity `[requires PRD §1, TRD §1, TQVCD §1]`

### 1.1 Project Name And Version

*State the project name (matching the PRD/TRD/TQVCD). State the version this PSCAD applies to.*

### 1.2 PRD / TRD / AVD / TQVCD / UXD References

*Cite all 5 prerequisite docs this PSCAD is downstream of. PSCAD is the 6th doc in the D2R bundle; it depends on TQVCD specifically (each PSCAD-PAT entry references TQVCD-VC entries by ID).*

### 1.3 Production Pattern Catalog Reference

*Cite the canonical Production Pattern Catalog at `_grand_repo/docs/Production_Pattern_Catalog_2026-04-27_v01_I.md` (or its successor). PSCAD-PAT entries reference catalog patterns by ID; new project-specific patterns surfaced during PSCAD authorship are candidates for catalog promotion (per §8 Promotion Protocol).*

### 1.4 Revision History

*Track revisions with version, date, changes, reviewer.*

---

## 2. Audit Scope `[requires TRD §2, §3]`

### 2.1 Production Conditions In Scope

*Declare the production conditions PSCAD audits against. Examples:*
- *Concurrency: number of simultaneous users / requests / processes per unit time*
- *Volume: data sizes that cross caching tier boundaries; payload sizes that cross framework limits*
- *Sequence: temporal ordering of operations that exposes race / order-dependence bugs*
- *Resource pressure: memory / disk / network / CPU saturation states*
- *Latency injection: upstream/downstream delays that surface timeout-handling gaps*
- *Failure injection: downstream error patterns that surface error-handling gaps*

*Each condition class must have measurable thresholds derived from TRD §3.1 (perf budgets) + TRD §3.2 (reliability requirements) + PRD §6.4 (operational constraints) where applicable.*

### 2.2 Production Conditions Out Of Scope

*Declare conditions explicitly NOT audited and the reason. The codify-larger-principles default is broad scope — narrow only with empirical reason. Acceptable narrowing reasons:*
- *Condition class is impossible given declared deployment topology (TRD §6.6) — e.g., "single-tenant deployment" excludes cross-tenant interference patterns*
- *Condition class is empirically irrelevant given declared user model (PRD §1.1) — e.g., "internal-only tool" excludes external-attack-pattern audit*
- *Condition class has no plausible failure mode given declared architecture (AVD §3-4) — e.g., "stateless service" excludes state-corruption sequence patterns*

> **Stop & Verify before continuing past §2.** Confirm:
> - Every production condition class declared YES has measurable thresholds traceable to TRD/PRD/AVD
> - Every production condition class declared NO has empirical narrowing reason (not "default" or "we'll handle it later")

---

## 3. Patterns In Scope `[requires §2 + Production Pattern Catalog]`

For each pattern declared in scope, author one heading per pattern:

```
### PSCAD-PAT-NN: [Pattern Name From Catalog OR New Project-Specific Pattern]
- **Catalog reference:** PAT-CONCURRENCY-LOCKFILE-SKIP (or "NEW: candidate for catalog promotion per §8")
- **Description:** [one-line description of what production condition this pattern represents]
- **Why in scope:** [reference to TRD/PRD/AVD condition that makes this pattern plausible]
- **Detection signature:** [what would signal this pattern is occurring in production — log pattern, metric anomaly, user-visible symptom]
- **Coverage status:** covered_by [PSCAD-CC-NN list] | not_covered | not_applicable
```

Required: every pattern referenced must have catalog-id OR explicit "candidate for catalog promotion" marker. New patterns may be authored per project; catalog promotion happens in a separate gate per §8.

> **Stop & Verify before continuing past §3.** Confirm:
> - Every catalog pattern in scope has a PSCAD-PAT entry
> - Every project-specific pattern has rationale tied to PRD/TRD/AVD
> - No PSCAD-PAT entry is left with `coverage_status: TBD`

---

## 4. Coverage Matrix `[requires §3 + TQVCD §5.0]`

Two-state coverage matrix. Pre-implementation state (Stage 00 → Stage 02 entry) — every PSCAD-PAT row has an `intended_covering_tqvcd_vcs` value. Post-implementation state (per stage commit) — each row's `actual_covering_tqvcd_vcs` populated when the corresponding TQVCD-VC entry's test exists AND verifies the pattern.

| pattern_id | catalog_ref | intended_covering_tqvcd_vcs | actual_covering_tqvcd_vcs | coverage_status |
|------------|-------------|------------------------------|----------------------------|------------------|
| PSCAD-PAT-01 | PAT-CONCURRENCY-LOCKFILE-SKIP | TQVCD-VC-04 + TQVCD-VC-12 | tests/concurrency/lockfile.spec.ts:18 + tests/integration/lock-collision.test.ts:42 | covered |
| PSCAD-PAT-02 | PAT-VOLUME-PAYLOAD-CROSSES-CACHE-TIER | TQVCD-VC-09 | — (test missing) | not_covered |

**Author one PSCAD-CC heading per coverage claim:**

```
### PSCAD-CC-NN: [Pattern Name] covered by [TQVCD-VC-NN]
- **Pattern:** PSCAD-PAT-NN
- **Covering TQVCD entry:** TQVCD-VC-NN
- **Coverage rationale:** [why this TQVCD-VC's mutation_killing_test actually exercises this production pattern; not just "the function is tested" but "the test applies the production-shaped condition"]
- **Pattern parameter values applied:** [the specific concurrency level / volume / sequence / etc. the test applies; if this differs from production-realistic levels, document the gap]
- **Detection-signature exercised:** [whether the test verifies the detection signature from PSCAD-PAT-NN, e.g., "test asserts log line `[lockfile] retrying after collision` appears under N=10 concurrent requests"]
```

Coverage rationale must NOT be tautological. "TQVCD-VC-04 tests `lock_acquire()`" is insufficient. "TQVCD-VC-04's test applies N=10 concurrent `lock_acquire()` calls and asserts that exactly one succeeds while the others retry per PAT-CONCURRENCY-LOCKFILE-SKIP detection signature" is sufficient.

> **Stop & Verify before continuing past §4.** Confirm:
> - Every PSCAD-PAT in §3 with `coverage_status: covered` has a PSCAD-CC entry in §4
> - Every PSCAD-CC's covering TQVCD-VC reference resolves to an actual entry in TQVCD §5.0 traceability table
> - Coverage rationale for each PSCAD-CC describes the specific production-shaped condition the test applies, not just the code-path tested

---

## 5. Gaps Identified `[requires §3, §4]`

For each PSCAD-PAT with `coverage_status: not_covered`, author one heading per gap:

```
### PSCAD-GAP-NN: [Pattern Name] not covered
- **Pattern:** PSCAD-PAT-NN
- **Why no TQVCD-VC covers this:** [empirical reason — was the pattern not anticipated at TQVCD-authoring time? Was a test designed but not implemented? Was a test designed but applies non-production-realistic parameter values?]
- **Severity assessment:** CRITICAL | HIGH | MEDIUM | LOW (severity matches the failure mode if pattern fires in production unverified)
- **Empirical evidence:** [reference to similar patterns surfaced in adversarial reviews, production incident reports, or prior project post-mortems; if no empirical evidence yet, mark "speculative — no prior incident"]
- **Honest gap acknowledgment:** [1-line summary suitable for the corresponding `disclosures.compliance_claims` block in /asae frontmatter if the gap relates to a user-facing claim]
```

Gaps with no corresponding TQVCD-VC remediation plan (§6) MUST appear as honest-gap disclosures in `/asae` frontmatter at the consuming gate (per A11.NEW-1 compliance_claims discipline if the gap relates to a user-facing claim).

> **Stop & Verify before continuing past §5.** Confirm:
> - Every PSCAD-PAT with `coverage_status: not_covered` in §3 has a PSCAD-GAP entry in §5
> - Severity assessments are consistent with TRD-declared NFR criticality
> - No PSCAD-GAP is silently swallowed; each has either a remediation plan in §6 OR an honest-gap disclosure path

---

## 6. Remediation Plans `[requires §5]`

For each PSCAD-GAP, author one heading per remediation:

```
### PSCAD-REM-NN: Remediation for PSCAD-GAP-NN
- **Gap:** PSCAD-GAP-NN
- **Remediation type:** add_test | add_test_with_pattern_param | accept_gap_disclose | revise_pattern_scope
- **Concrete action:** [the specific test to add / parameter-value modification to make / disclosure language to author / scope-revision rationale]
- **Owner:** [stage assignment — Stage 02 / Stage 03+ / Stage QA]
- **TQVCD impact:** [whether this remediation requires TQVCD §5.0 entry update — new TQVCD-VC row OR existing TQVCD-VC parameter-value modification]
- **Acceptance criteria:** [the specific test result OR disclosure presence OR scope-revision approval that closes this remediation]
```

Remediation `accept_gap_disclose` is allowed only when (a) the gap's severity is LOW or MEDIUM AND (b) an honest-gap disclosure path exists per A11.NEW-1 / Mod 1. CRITICAL or HIGH severity gaps cannot be accepted; they must be remediated via `add_test` / `add_test_with_pattern_param` / `revise_pattern_scope`.

`revise_pattern_scope` is the rare case where the pattern, on review, shouldn't be in scope — typically because a §2.2 narrowing reason was missed at original §3 authorship. If used, the corresponding §3 PSCAD-PAT entry moves to §2.2 with rationale.

---

## 7. ASAE Gate Configuration `[requires §3-§6]`

### 7.1 ASAE Threshold For PSCAD Authorship Gate

PSCAD authorship gate runs at `/asae` `domain=document` threshold 2 standard (per `/write-pscad` Step 6).

### 7.2 ASAE Threshold For Coverage Matrix Re-Audit (Per Stage)

Per the current D2R stage structure, after each implementation stage commit, the PSCAD §4 coverage matrix is re-audited at the relevant Stage's `/asae` threshold. Per-stage re-audit verifies `actual_covering_tqvcd_vcs` references resolve and the test ACTUALLY exercises the production-shaped condition (rater Step 6 verification).

### 7.3 PSCAD Threshold At Stage QA Convergence

Stage QA convergence loop runs PSCAD coverage matrix at `/asae` threshold 5 (matching TQVCD §9.2 Stage QA threshold). Any PSCAD-PAT with `coverage_status: not_covered` at Stage QA convergence is a finding unless an authored PSCAD-REM with type `accept_gap_disclose` exists AND the disclosure is committed in the corresponding `/asae` frontmatter.

> **Stop & Verify before continuing past §7.** Confirm:
> - PSCAD authorship gate threshold matches TQVCD authorship gate threshold (2 standard) for sequencing parity
> - Stage QA convergence threshold matches TQVCD §9.2 Stage QA threshold (5)
> - All deviations have rationale recorded under §7 Deviations subsection

---

## 8. Catalog Promotion Protocol `[requires §3]`

When PSCAD authorship surfaces a project-specific pattern that doesn't yet exist in `Production_Pattern_Catalog_2026-04-27_v01_I.md`:

1. Mark the PSCAD-PAT entry as "candidate for catalog promotion" in §3
2. Author a catalog-promotion gate (separate ASAE strict-3) that adds the new PAT-* entry to the canonical catalog with: pattern_id / description / detection_signature / empirical_provenance / first_observed_in_project / first_observed_at_date
3. Cascade per META-8 (catalog updates trigger META-8 cascade per Mod 8 §1.4 + Batch 2 META-8 §4.3)
4. Once landed, the PSCAD-PAT entry can drop the "candidate" marker and reference the new catalog id

Catalogs accumulate across projects; portable knowledge of patterns the methodology has empirically encountered. Resist over-pruning. Patterns observed once but plausible elsewhere should remain in the catalog with `empirical_count: 1`.

---

## 9. Open Pattern Questions `[independent]`

*Author one heading per question (`### PSCAD-OQ-01: Should pattern PAT-X be split into PAT-X-A and PAT-X-B for clearer remediation routing?`). Stage 00 research should address these or the PSCAD must be updated before Stage 01.*

---

## 10. Amendment Protocol

*Per `references/Methodology_Versioning_And_Amendment_Protocol_2026-04-26_v01_I.md` §8 (canonical text). Authors of an instance PSCAD should paste the canonical Amendment Protocol section here. Summary: Phase A (authoring, pre-Stage-00) follows the inline validation hooks; Phase B (execution amendments) requires amendment-log entry + cross-doc audit re-run; Phase C (operational) requires amendment-log entry + ORD update if applicable.*

*Note: PSCAD §4 coverage matrix updates are continuous in Phase B — every implementation stage commit adds `actual_covering_tqvcd_vcs` values. This is normal operating behavior, NOT an amendment-class change. Amendment-class changes to PSCAD include: new PSCAD-PAT entries surfaced post-authorship, new PSCAD-GAP entries discovered post-authorship, severity reclassifications — these require amendment log entries.*

---

## 11. Stakeholder Approvals `[requires every other section]`

*Who has approved this PSCAD? Without documented approval, Stage 00 should not begin.*

---

## Validation Checklist (Pre-Stage-00)

Before invoking `/dare-to-rise-code-plan`, verify:

- [ ] All required sections completed
- [ ] Heading-prefix IDs assigned to all patterns / coverage claims / gaps / remediations / ASAE thresholds
- [ ] §1.3 Production Pattern Catalog referenced by canonical path
- [ ] §2 production conditions in/out of scope declared with empirical narrowing reasons for any out-of-scope condition
- [ ] §3 every pattern in scope has catalog-id OR candidate-for-promotion marker
- [ ] §3 every pattern has `coverage_status` set (no TBD)
- [ ] §4 coverage matrix populated for every covered pattern with non-tautological coverage rationale
- [ ] §4 every PSCAD-CC's covering TQVCD-VC reference resolves
- [ ] §5 every not-covered pattern has a PSCAD-GAP entry
- [ ] §6 every PSCAD-GAP has a PSCAD-REM (or `accept_gap_disclose` with disclosure path documented)
- [ ] §7 ASAE thresholds declared per stage type
- [ ] §8 catalog-promotion candidates marked
- [ ] Amendment Protocol section present (canonical text)
- [ ] `methodology_version: 0.4.0` declared in frontmatter (PSCAD ships in methodology v0.4.0)
- [ ] Authorship parallelization markers acknowledged
- [ ] Bundle Index sidecar reflects current PSCAD IDs (if CDCC v1.1.0 available)
- [ ] Stakeholder approval documented

A PSCAD missing any of these is not ready for D2R.

---

## Companion Documents

This PSCAD is one of SIX prerequisite inputs to `/dare-to-rise-code-plan`:

- **PRD (Product Requirements Document)** — what the product IS (must exist first)
- **TRD (Technical Requirements Document)** — what it MUST DO technically (must exist before this)
- **AVD (Architecture Vision Document)** — high-level system shape
- **TQVCD (Test Quality + Verification Coverage Document)** — what success looks like verification-wise (must exist before this; PSCAD audits TQVCD's coverage from the pattern-space angle)
- **UXD (User Experience Document)** — visual design system + interaction polish

See template files in the same `references/` directory.

---

## Downstream Use

This PSCAD feeds directly into:

- **Stage 00 ASAE gate:** audits whether research findings actually address the production patterns declared in §3
- **Stage 01 Step 2:** the PSCAD §4 coverage matrix is read alongside TQVCD §5.0; Stage 01 backwards-plans implementation stages against BOTH verification-coverage gaps (TQVCD §5.0 ratio < 1.0) AND pattern-space gaps (PSCAD §5 not-covered patterns)
- **Stage NN commit gates:** pre-commit hooks enforce the gates declared in §7 + verify PSCAD §4 `actual_covering_tqvcd_vcs` references resolve + check that any new TQVCD-VC entries added during the stage have their `production_pattern` field populated per Mod 8.1 schema
- **Stage QA:** the convergence loop runs the PSCAD §4 coverage matrix at threshold 5 + verifies all PSCAD-GAP remediations landed OR were promoted to honest-gap disclosures
- **Stage QA pattern-space-coverage check:** every PSCAD-PAT in scope must have `coverage_status: covered` OR `not_covered` with documented `accept_gap_disclose` remediation; orphan PSCAD-PAT entries flag a pattern-space coverage gap

**Cross-doc alignment chains:** PSCAD is gated on EVERY chain leg per `/ideate-to-d2r-ready` Phase 02 PSCAD-related alignment chains:

- **PSCAD↔TQVCD chain:** every PSCAD-PAT's `intended_covering_tqvcd_vcs` references a real TQVCD-VC entry; every TQVCD-VC entry has `production_pattern` field referencing a PSCAD-PAT id (or catalog id directly)
- **PSCAD↔PRD §6 chain:** PSCAD §2 production conditions in scope are derived from PRD §6 operational constraints + PRD §1.1 user model
- **PSCAD↔TRD §perf-and-reliability chain:** PSCAD §2 production conditions thresholds are derived from TRD §3.1 perf budgets + TRD §3.2 reliability requirements

A PSCAD that decouples from any of these chains is structurally incomplete.

---

*PSCAD_Template_2026-04-27_v01_I.md authored 2026-04-27 by Clauda the Spec Genius v01 (Claude Opus 4.7, 1M context). Per Methodology Mods Batch 2 Mod 8 (PSCAD as 6th D2R doc). Held internal; subject to Pre-Publication IP Scrub before external release.*
