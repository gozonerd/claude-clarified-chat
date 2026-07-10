---
title: "PRD Anti-Patterns — reference"
filename: PRD_AntiPatterns_2026-07-06_v01_I.md
companion_skill: write-prd
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 7 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
per_L7: "separate anti-pattern reference per /write-* skill; in-SKILL sections become summary pointers"
---

## Purpose

Consolidate the failure modes specific to authoring a Product Requirements Document under `/write-prd`, so the skill itself can stay lean (a pointer) while this doc carries the full rationale and fix for each. A PRD sits at the top of the D2R prerequisite chain — every downstream document (TRD, AVD, TQVCD) inherits whatever is wrong here, so PRD anti-patterns are the highest-leverage ones to catch early.

## Anti-patterns

1. **Writing a PRD without the template** — producing a PRD from memory or ad hoc structure rather than `PRD_Template_2026-04-26_v03_I.md`. This produces inconsistent section coverage across projects and breaks downstream tooling (cross-doc audits, ASAE domain checks) that expect the template's section identifiers. Fix: always load the template first (Step 1) and treat its section list as the required structural spec, not a suggestion.

2. **Skipping the validation checklist** — saving the PRD without running the ASAE gate (Step 3) or without confirming every required section is filled or NA-justified. This produces PRDs that look complete but aren't ready for D2R consumption, causing downstream skills to redirect back to `/write-prd` mid-flow. Fix: never advance to Step 4 (save) until the ASAE gate has run and every required section is either filled or marked NA with a one-line justification.

3. **Merging PRD content with TRD or AVD content** — describing technical implementation details ("we'll use Postgres with a composite index on...") or architectural shape ("a three-tier service split into...") inside the PRD's problem/goals/journeys sections. PRD, TRD, and AVD are separate abstraction levels by design (product-is / must-do-technically / high-level-shape); collapsing them defeats the point of having three documents and makes each one harder to review on its own terms. Fix: if technical or architectural content surfaces during PRD authoring, note it as a forward pointer ("see TRD Section X") rather than inlining it.

4. **Filling in content the user hasn't approved** — Claude inventing user segments, problem statements, or success criteria the user never stated, because it seems plausible or fills a gap faster than asking. The PRD is user-facing product definition; it is not Claude's invention to make. Fix: for every section, either capture the user's actual words/decision or explicitly flag the gap and ask — never silently draft a plausible-sounding answer and present it as decided.

5. **Running the ASAE gate above threshold 2** — applying implementation-grade rigor (threshold 3+) to a document that is, by definition, pre-implementation. This either stalls the PRD on scrutiny appropriate to code/architecture (not product definition) or trains reviewers to distrust the gate's calibration. Fix: PRD gate stays at `asae_certainty_threshold: 2`, `severity_policy: standard` — matching the actual rigor the document type warrants.

6. **Solutioning in the problem statement** *(derived)* — describing the solution ("we need a dashboard with real-time charts") instead of the problem ("users can't tell whether their job succeeded without checking three separate tools"). This forecloses the TRD/AVD's job of deciding HOW, and hides whether the "solution" actually addresses the stated problem. Fix: problem statement section must name user pain and evidence only; solution shape belongs in Goals/User Journeys at most, and implementation belongs downstream.

7. **Unfalsifiable success metrics** *(derived)* — success criteria like "users are happier" or "the product feels faster" with no measurable target or timeframe. These can never be checked against, so they can never gate a release or a retro. Fix: every success criterion needs a number and a timeframe (e.g., "task completion time drops below 90s for 80% of sessions within 30 days of launch").

8. **Scope creep via vague acceptance criteria** *(derived)* — user journeys or goals written loosely enough ("handles edge cases gracefully") that any implementation can claim compliance, or scope silently expands because "out of non-goals" was never explicit. Fix: non-goals must be stated as explicitly as goals; acceptance criteria must be specific enough that a reviewer could point to a failing case.

## Summary-pointer text

Full anti-pattern catalog with rationale and fixes lives in `PRD_AntiPatterns_2026-07-06_v01_I.md` (references/anti-patterns/) — covers template-skipping, validation-checklist-skipping, PRD/TRD/AVD content bleed, unapproved invention, ASAE threshold misuse, solutioning-in-problem-statement, unfalsifiable metrics, and scope creep via vague criteria.

## Honest gaps

Anti-patterns 1–5 were extracted directly from the `## Anti-Patterns` section of `write-prd/SKILL.md` (near-verbatim rationale, expanded with the "why it's bad" and "fix" framing this doc's format requires). Anti-patterns 6–8 were not present in the skill file and were derived from the PRD's stated purpose and required sections (Users And Problem, Success Criteria, Goals/Non-Goals) per the task's own example prompts. This doc has not yet been run through an ASAE pass or cross-checked against `Bundle_Index_Schema_2026-04-26_v01_I.md` for whether an anti-patterns reference needs its own bundle-index entry — that determination is deferred to whoever wires Lock L7's in-SKILL pointer changes into the live `write-prd/SKILL.md`.
