---
title: "TQVCD Anti-Patterns — reference"
filename: TQVCD_AntiPatterns_2026-07-06_v01_I.md
companion_skill: write-tqvcd
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 7 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
per_L7: "separate anti-pattern reference per /write-* skill; in-SKILL sections become summary pointers"
---

## Purpose

Consolidate the failure modes specific to authoring a Test Quality + Verification Coverage Document under `/write-tqvcd`, so the skill itself can stay lean (a pointer) while this doc carries the full rationale and fix for each. The TQVCD is the QA-first gate for the whole D2R stack — coverage-theater, test tautologies, and unfalsifiable claims that slip through here propagate into every implementation stage and into PSCAD's pattern-space audit, which depends on TQVCD's `mutation_killing_test` entries actually killing mutations.

## Anti-patterns

1. **Kitchen-sink test-category listing** — marking all 20 test categories as applicable without genuine per-category evaluation, to look thorough rather than to be thorough. This dilutes the QA spec: reviewers can no longer tell which categories carry real exit criteria versus which were rubber-stamped, and Stage QA inherits a bloated, unfocused test surface. Fix: every YES category needs specific, measurable exit criteria; every NO category needs a specific skip reason — "not applicable" alone is refused.

2. **Un-selected stress-category sprawl** — applying every one of the 39 stress categories without running the AI-driven selection rule (component present? high-severity? plausible given usage?). This makes Stage QA unmanageable and buries the stress tests that actually matter under ones that don't apply. Fix: run the three-question selection test per category and skip with a specific reason when any answer is no.

3. **Adjective-based exit criteria** — writing exit criteria like "thoroughly tested," "robust error handling," or "comprehensive coverage" instead of measurable thresholds. Adjectives can't gate anything; nobody can point to a failing case for "not thorough enough." Fix: every exit criterion needs a number, a tool, or an observable pass/fail condition (e.g., "p95 < 250ms via k6" not "fast").

4. **Undeclared ASAE thresholds** — leaving Section 9.2 per-stage thresholds blank or silently deviating from the documented defaults (Stage 00: 2, Stage 01a: 2, Stage 01b: 3, Stage 02: 3, Stage 03+: 3, Stage QA: 5). Stage 01 can't configure its gates without these, and undocumented deviation is a standing finding at the orchestrator's Phase 3 cross-doc audit. Fix: declare thresholds explicitly; if deviating, record both the value and the rationale under "Deviations from defaults."

5. **Tautological verification** *(derived from §5.0/§5.4 discipline)* — authoring a `mutation_killing_test` that doesn't actually fail when the claim breaks: `expect(true).toBe(true)`, a component test that mocks the entire data layer and asserts the mock renders, or a mutation-scope carve-out that excludes every load-bearing module. This is the CDCC-plugin failure mode — "100/100/100/100" scores that mean nothing because the tests can't fail. Fix: apply the test-tautology-bans catalog per claim; if no real mutation-killing test can be designed, retract the claim or disclose it as an honest gap rather than shipping a test that can't lose.

6. **Coverage-theater claims** *(derived from §5.4 banned-phrase discipline)* — user-facing copy asserting "100% test coverage," "fully tested," "battle-tested," or an unscoped mutation score, without a populated `disclosures.coverage_mutation_scope` block. This launders a narrow, carved-out test scope into an unqualified guarantee. Fix: run the §5.4 banned-phrase scan against every user-facing copy source before commit; any hit needs either a disclosure block, replacement phrasing, or a `// metric-allowed:` comment with valid rationale.

7. **Behaviors-claimed left unenumerated** *(derived from §5.0 discipline)* — computing or asserting a verification ratio without first sweeping every claim source (PRD journeys/AC, TRD FRs/NFRs, README, SECURITY.md, marketing pages, LAUNCH docs). A ratio computed against an incomplete claim set is a fabricated confidence number, not a measurement. Fix: enumerate `behaviors-claimed` from every listed source first; the §5.0 ratio is only meaningful once the denominator is honest.

8. **Missing `production_pattern` linkage** *(derived from Mod 8.1 discipline)* — leaving TQVCD-VC entries without a populated `production_pattern` field (catalog id, inline block, or `PAT-GENERIC-NO-PRODUCTION-SHAPE` marker). This is the structural link PSCAD needs to audit pattern-space coverage; without it, PSCAD can't tell which production patterns a test actually exercises. Fix: populate the field for every TQVCD-VC row before handoff — this is exactly the CDCC lockfile-skip failure mode (tests passed under tested load, would deviate under production concurrency) recurring one document downstream.

9. **Accessibility floor scoped to legal-only** *(derived from §6 discipline)* — treating "WCAG 2.1 AA" as the complete accessibility scope and leaving §6.5 (cognitive)/§6.6 (reading)/§6.7 (vision) unaddressed or silently marked NA. Per the 2026-05-05 Accessibility Floor Update, legal floor alone refuses at the §6.9 table (HIGH severity). Fix: walk §6.5/§6.6/§6.7 explicitly for every TQVCD; NA is valid only with an explicit product-domain rationale tied to the specific section.

10. **Single-theme accessibility verification** *(derived from §6.7 discipline)* — running the automated accessibility tool (axe-core, Lighthouse, etc.) against only one theme when the product ships both light and dark modes. This is a CRITICAL-severity refusal condition per §6.9 — a theme that was never contrast-checked is a theme that was never verified. Fix: run and document the automated + manual contrast pass separately for each theme.

## Summary-pointer text

Full anti-pattern catalog with rationale and fixes lives in `TQVCD_AntiPatterns_2026-07-06_v01_I.md` (references/anti-patterns/) — covers kitchen-sink category listing, unselected stress sprawl, adjective-based criteria, undeclared ASAE thresholds, tautological verification, coverage-theater claims, unenumerated claim sweeps, missing production_pattern linkage, legal-only accessibility scoping, and single-theme accessibility verification.

## Honest gaps

Anti-patterns 1–4 were extracted directly from the `## Anti-Patterns` section of `write-tqvcd/SKILL.md` (near-verbatim, expanded with "why it's bad" and "fix" framing this doc's format requires). Anti-patterns 5–10 were not listed under that heading but were derived from load-bearing discipline stated elsewhere in the skill body (§5.0 verification-coverage walkthrough, §5.4 banned-phrase list, Mod 8.1 production_pattern field, §6/§6.9 accessibility floor + refusal table) — each ties back to a named empirical failure mode the skill itself cites (CDCC plugin, claude-cost) or a named refusal-table condition, so confidence in these derivations is high, but they were not copy-pasted from an existing anti-patterns list. This doc has not been run through an ASAE pass.
