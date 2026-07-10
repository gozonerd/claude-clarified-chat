---
title: "PSCAD Anti-Patterns — reference"
filename: PSCAD_AntiPatterns_2026-07-06_v01_I.md
companion_skill: write-pscad
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 7 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
per_L7: "separate anti-pattern reference per /write-* skill; in-SKILL sections become summary pointers"
---

## Purpose

Consolidate the failure modes specific to authoring a Pattern-Space Coverage Audit Document under `/write-pscad`, so the skill itself can stay lean (a pointer) while this doc carries the full rationale and fix for each. PSCAD audits a structurally separate axis from code coverage and verification coverage: whether production input/load/sequence patterns are actually exercised by any test. Its entire value collapses if the audit itself becomes security-theater — code-coverage rationale dressed up as pattern-space rationale.

## Anti-patterns

1. **Tautological coverage rationale** — authoring a PSCAD-CC entry that says "the function is tested" or "TQVCD-VC-04 tests `lock_acquire()`" instead of demonstrating the test applies the actual production-shaped condition (realistic concurrency count, realistic load, the specific detection signature). This is exactly the CDCC-plugin failure mode: passed under tested load, would deviate under production concurrency, because the test called the function but never applied production-shaped conditions. Fix: coverage rationale must state which production-shaped condition the test applies and what detection signature it verifies — "TQVCD-VC-04 applies N=10 concurrent `lock_acquire()` calls and asserts exactly one succeeds while others retry" is the bar.

2. **Skipping catalog-promotion marking for novel patterns** — surfacing a project-specific pattern not in the canonical Production Pattern Catalog and failing to mark it "candidate for catalog promotion" per §8. This breaks the methodology's learning loop — patterns discovered on one project never propagate to benefit the next. Fix: every candidate pattern surfaced in §3a gets marked for catalog promotion, with a recommendation to run the separate ASAE strict-3 catalog-promotion gate before merging.

3. **Accepting CRITICAL/HIGH gaps via `accept_gap_disclose`** — closing a high-severity pattern-space gap with a disclosure statement instead of an actual remediation (add_test, add_test_with_pattern_param, or revise_pattern_scope). `accept_gap_disclose` is only valid for LOW/MEDIUM severity; using it for CRITICAL/HIGH gaps launders an unverified, high-stakes production pattern into a documented-but-shipped risk. Fix: CRITICAL/HIGH gaps must remediate via one of the three test-producing or scope-revising paths; disclosure is not a substitute for verification at that severity.

4. **Authoring PSCAD before TQVCD** — running this skill without a completed, approved TQVCD to audit. PSCAD's entire mechanism is auditing TQVCD's `mutation_killing_test` entries for pattern-space coverage; there is nothing to audit if TQVCD doesn't exist yet. Fix: refuse to proceed and redirect to `/ideate-to-d2r-ready` or `/write-tqvcd` if TQVCD is missing or unapproved.

5. **Narrowing scope without empirical reason** — excluding a production condition from §2.2 (audit scope) without a specific, evidence-backed narrowing reason, defaulting to whatever is convenient to skip. The methodology's default is broad-until-narrowed-by-evidence, not narrow-until-proven-necessary; unmotivated narrowing quietly re-opens exactly the blind spot PSCAD exists to close. Fix: every out-of-scope condition needs a stated empirical reason (e.g., "single-tenant deployment topology per AVD §4 rules out multi-tenant contention patterns"), not silence.

6. **Same-day authorship as TQVCD without justification** — writing PSCAD immediately after TQVCD in the same sitting, collapsing the deliberate temporal gap the methodology relies on. PSCAD's structural value comes from the author being in a different head-state than at TQVCD-authoring time — the delay simulates production-memory accumulation and is what surfaces patterns the original test surface didn't consider. Fix: preserve the gap (per `/ideate-to-d2r-ready` Phase 01 Step 01.6 sequencing after Step 01.4); if same-day authorship is unavoidable, document why and treat the audit as higher-risk for missed patterns.

7. **Leaving `production_pattern` unlinked back to TQVCD** *(derived from Step 4 discipline)* — completing the PSCAD pattern/gap/remediation walkthrough without verifying every TQVCD-VC entry has a populated `production_pattern` field (catalog id, inline block, or generic-no-shape marker). PSCAD-authoring time is the designated moment to close this loop; skipping it leaves the TQVCD ↔ PSCAD structural linkage broken for the cross-doc audit. Fix: walk every TQVCD-VC entry at Step 4 and flag or fill any missing `production_pattern` field before handoff.

8. **In-scope patterns without a coverage-status resolution** *(derived from §3/§4 discipline)* — authoring a PSCAD-PAT entry and never resolving its `coverage_status` to covered or not_covered against TQVCD §5.0, leaving it at the placeholder `TBD`. An unresolved pattern is functionally the same as an unaudited one — the whole point of §3a/§3b is to force a determination. Fix: every PSCAD-PAT entry must resolve to either a PSCAD-CC (covered) or a PSCAD-GAP (not covered) before the document is presented for approval.

9. **Remediation entries missing acceptance criteria** *(derived from §3b Step 4 discipline)* — authoring a PSCAD-REM with a remediation type and owner stage but no concrete, checkable acceptance criteria (the specific test result, disclosure presence, or scope-revision approval that closes it). Without acceptance criteria, "remediated" becomes a matter of opinion at the next audit pass rather than a verifiable state. Fix: every PSCAD-REM needs a specific, checkable condition that unambiguously marks it closed.

## Summary-pointer text

Full anti-pattern catalog with rationale and fixes lives in `PSCAD_AntiPatterns_2026-07-06_v01_I.md` (references/anti-patterns/) — covers tautological coverage rationale, skipped catalog-promotion marking, improper accept-with-disclosure on CRITICAL/HIGH gaps, out-of-sequence authorship before TQVCD, unmotivated scope narrowing, collapsed same-day authorship, broken production_pattern linkage, unresolved coverage status, and remediation entries missing acceptance criteria.

## Honest gaps

Anti-patterns 1–6 were extracted directly from the `## Anti-Patterns` section of `write-pscad/SKILL.md` (near-verbatim, expanded with "why it's bad" and "fix" framing this doc's format requires). Anti-patterns 7–9 were not listed under that heading but were derived from load-bearing procedural discipline stated elsewhere in the skill body (Step 4's production_pattern linkage-verification requirement, §3a/§3b's coverage-status resolution requirement, and the Step 3b-4 remediation-entry field list) — each ties to an explicit step the skill marks load-bearing, so confidence in the derivation is high, but none were copy-pasted from an existing anti-patterns list. This doc has not been run through an ASAE pass.
