---
title: "TRD Anti-Patterns — reference"
filename: TRD_AntiPatterns_2026-07-06_v01_I.md
companion_skill: write-trd
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 7 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
per_L7: "separate anti-pattern reference per /write-* skill; in-SKILL sections become summary pointers"
---

## Purpose

Consolidate the failure modes specific to authoring a Technical Requirements Document under `/write-trd`, so the skill itself can stay lean (a pointer) while this doc carries the full rationale and fix for each. The TRD translates the PRD's "what the product IS" into "what the system MUST DO technically" — its failure modes mostly involve either skipping that grounding step or letting technical requirements stay vague enough to be unverifiable later.

## Anti-patterns

1. **Authoring a TRD without a completed PRD** — proceeding to write functional/non-functional requirements when the user has said "skip the PRD" or "it'll come later." A TRD written this way has no grounded user/problem/goals context to derive requirements from, so its requirements are guesses dressed up as specifications. Fix: refuse to proceed; offer `/write-prd` or `/ideate-to-d2r-ready` instead. If a PRD path is provided, read it and cache users/goals/constraints before drafting any TRD section.

2. **Accepting adjectives instead of specific numbers for non-functional requirements** — letting "fast," "secure," "reliable," or "scalable" stand as the requirement text. Adjectives can't be tested, can't gate a release, and mean different things to different reviewers. Fix (Step 4 of the skill): convert every adjective to a number — "fast" becomes p50/p95/p99 latency targets, "secure" becomes named OWASP/CERT items, "reliable" becomes uptime/MTBF targets, "scalable" becomes a load-capacity target. If the user has no number yet, document it as an Open Technical Question rather than leaving the adjective in place.

3. **Merging TRD content with PRD content** — restating user journeys or business goals inside the TRD instead of cross-referencing them, or drifting into product-definition language ("users want...") instead of system-requirement language ("the system must..."). PRD and TRD operate at different abstraction levels by design; collapsing them makes both harder to audit independently. Fix: cross-reference PRD sections by pointer (e.g., "per PRD Section 4, Journey 2") rather than re-deriving or restating them.

4. **Skipping hook orchestration requirements** — omitting the D2R-specific technical constraints section (hook orchestration requirements, skill/plugin ecosystem requirements) because it feels like tooling detail rather than "real" requirements. These are prerequisites the D2R stack specifically checks for; a TRD missing them will fail downstream D2R consumption even if every other section is excellent. Fix: treat Technical Constraints Section 6's D2R-specific subsections as required, not optional, on any project that will actually run through `/dare-to-rise-code-plan`.

5. **Every FR lacking acceptance criteria in testable terms** *(derived from ASAE domain checks in Step 5)* — writing functional requirements as narrative descriptions of behavior with no way to check compliance ("the system should handle uploads well"). Fix: every FR needs an acceptance criterion phrased so a tester could mark it pass/fail without interpretation.

6. **Declaring WCAG 2.1 AA implicitly or omitting it** *(derived from Step 5 domain checks and the hardwired NFR requirement in Step 3)* — treating accessibility as understood-but-unstated, or silently dropping it because the project "doesn't really have a UI." Fix: WCAG 2.1 AA must be declared explicitly in every TRD (with any additional standards listed), or explicitly marked NA with a stated reason — never left implicit.

7. **Privacy/security requirements without a named standard** *(derived from Step 5 domain checks)* — writing "handle data securely" or "respect user privacy" without naming which standard (OWASP items, applicable regulations) the requirement is actually checked against. Fix: name the standard or regulation, or explicitly justify NA (e.g., "no PII collected, so [regulation] does not apply").

## Summary-pointer text

Full anti-pattern catalog with rationale and fixes lives in `TRD_AntiPatterns_2026-07-06_v01_I.md` (references/anti-patterns/) — covers PRD-less authorship, adjective-not-number NFRs, TRD/PRD content bleed, skipped hook-orchestration requirements, untestable FR acceptance criteria, implicit WCAG declarations, and unnamed security/privacy standards.

## Honest gaps

Anti-patterns 1–4 were extracted directly from the `## Anti-Patterns` section of `write-trd/SKILL.md` (near-verbatim rationale, expanded with the "why it's bad" and "fix" framing this doc's format requires). Anti-patterns 5–7 were not listed under that heading but were derived from the domain-specific ASAE checks in Step 5 and the hardwired NFR requirement in Step 3 of the skill — they describe the same failure surface the skill's own gate checks for, just not originally labeled "anti-pattern." This doc has not been run through an ASAE pass; whether it needs a bundle-index entry alongside the other `references/` files is deferred to whoever wires the in-SKILL pointer change into the live `write-trd/SKILL.md`.
