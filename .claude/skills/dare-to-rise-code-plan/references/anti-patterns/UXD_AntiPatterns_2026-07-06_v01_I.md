---
title: "UXD Anti-Patterns — reference"
filename: UXD_AntiPatterns_2026-07-06_v01_I.md
companion_skill: write-uxd
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 7 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
per_L7: "separate anti-pattern reference per /write-* skill; in-SKILL sections become summary pointers"
---

## Purpose

Consolidate the failure modes specific to authoring a User Experience Document under `/write-uxd`, so the skill itself can stay lean (a pointer) while this doc carries the full rationale and fix for each. The UXD is the F13-equivalent reality anchor for the visual layer — without concrete, verifiable inputs here, the implementer falls back to generic-component-library defaults regardless of what the PRD/TRD/AVD specify. Most of these anti-patterns are ways that anchor quietly turns into words.

## Anti-patterns

1. **Authoring without the template** — producing a UXD from memory or ad hoc structure rather than `UXD_Template_2026-05-05_v03_I.md`. This produces inconsistent output across projects and breaks the ASAE domain=design checklist, which expects the template's section identifiers. Fix: load the template first (Step 1) and treat its section list as required structure, not a suggestion.

2. **Skipping reference-anchor discipline** — accepting a named reference app in Section 1.1 without a screenshot at a declared path. This re-introduces the F13-class fictional-reference failure at the visual layer: a reference that exists only in prose can't actually constrain what gets built. Fix: capture the screenshot now, use a publicly available one with a stored URL, or explicitly mark the section incomplete — never accept words-only.

3. **Adjective-only brand voice** — stating brand voice as "modern," "clean," or "professional" instead of concrete visual decisions (specific typefaces, specific spacing rules, specific color pairings with rationale). Adjectives don't constrain an implementer's choices; two people can read "clean" and build opposite things. Fix: reject adjective-only input and walk through the template's example format for concrete decisions.

4. **Filling in unapproved visual character** — Claude inventing brand-voice decisions, color palettes, or polish criteria the user never actually decided, because it's faster than asking. The UXD is user-facing visual character; it is not Claude's invention to make. Fix: capture the user's actual decision for every section, or explicitly flag the gap and ask.

5. **Running the ASAE gate above threshold 2** — applying implementation-grade rigor to a document that is, by definition, pre-implementation design spec. Fix: UXD gate stays at `asae_certainty_threshold: 2`, `severity_policy: standard`; cross-doc strict-3 auditing happens later, at `/ideate-to-d2r-ready` Phase 02.

6. **Merging UXD content into TRD, AVD, or TQVCD** — treating the UXD as a place to also specify tech stack (TRD's job), system architecture (AVD's job), or functional/accessibility test criteria (TQVCD's job). These are separate documents by design; collapsing them defeats the point of reviewing each on its own terms, though UXD and TQVCD legitimately overlap on the accessibility axis. Fix: keep UXD to visual + interaction character; cross-reference the sibling doc rather than duplicating its content.

7. **Single-theme design system** *(extracted from §3.5/§5.7 discipline)* — specifying only one palette (or a "system-follow only, no in-app toggle" theme policy) when the product has any significant text content. This is a HIGH-severity §5.8 refusal condition, not a stylistic choice deferred to later — a theme system proposed without user control fails Vis-01 outright. Fix: walk through §3.5's light palette + dark palette + toggle control + persistence + no-surprise-policy explicitly; contrast-verify both themes, not one.

8. **Soft-NA on lived-floor accessibility sections** *(extracted from §5.8 discipline)* — marking §5.5 (cognitive), §5.6 (reading), or §5.7 (vision) as NA with no rationale, treating them as optional nice-to-haves subject to the same casual skip as a truly optional section. Per §5.8, silent NA on these refuses at gate; an app shipped without them is MVP-deployable-failed for users with real accessibility profiles regardless of legal-floor WCAG compliance. Fix: NA is valid only with an explicit product-domain rationale (e.g., no rich-text surface for §5.6); absent that, walk the UP-Cog/Read/Vis-01..04 items explicitly.

9. **Reference assets without versioning** *(extracted from Related Skills / Step 4 discipline)* — saving palette swatches or mockups without a dated, versioned path. Assets evolve; unversioned assets cause downstream stages to silently consume stale references with no way to detect the drift. Fix: save to the dated `uxd-assets/[YYYY-MM-DD]/` path per file-naming-and-versioning convention, and reference `/file-versioning` rules if the project already has them.

10. **Named anti-patterns without concrete examples** *(derived from Section 7 requirement)* — filling the UXD's own "Anti-Patterns To Avoid" section with generic advice ("avoid bad UX") instead of a specific what-it-looks-like / why-anti / replacement triple. Generic anti-pattern entries don't prevent the generic-default fallback they exist to catch. Fix: name at least one concrete accessibility-floor anti-pattern (e.g., system-follow-only theme) with the full triple, per v03 requirement.

## Summary-pointer text

Full anti-pattern catalog with rationale and fixes lives in `UXD_AntiPatterns_2026-07-06_v01_I.md` (references/anti-patterns/) — covers template-skipping, reference-anchor discipline failures, adjective-only brand voice, unapproved invention, ASAE threshold misuse, cross-doc content bleed, single-theme design systems, soft-NA on lived-floor accessibility, unversioned assets, and generic anti-pattern entries.

## Honest gaps

Anti-patterns 1–6 were extracted directly from the `## Anti-Patterns` section of `write-uxd/SKILL.md` (near-verbatim, expanded with "why it's bad" and "fix" framing this doc's format requires). Anti-patterns 7–10 were not listed under that heading but were derived from load-bearing discipline stated elsewhere in the skill body (§3.5/§5.5/§5.6/§5.7/§5.8 lived-floor accessibility discipline, Step 4 asset-versioning instructions, Section 7 template requirement) — each ties to an explicit refusal-table condition or named requirement in the skill, so confidence in the derivation is high, but none were copy-pasted from an existing anti-patterns list. This doc has not been run through an ASAE pass.
