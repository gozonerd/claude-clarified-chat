---
name: write-prd
description: "Use this skill to author a Product Requirements Document as a prerequisite input to /dare-to-rise-code-plan. Triggers on: '/write-prd', 'write-prd', 'author a PRD', 'write a product requirements document', 'generate PRD', 'draft PRD'. Loads the PRD template, walks the user through each required section, produces a validated filled-in instance. Output is a PRD file saved to the project's planning directory, ready for downstream D2R consumption."
---

# Write PRD

## Purpose

Author a Product Requirements Document from the reusable template. Produces a filled-in PRD instance ready to serve as a prerequisite input to `/dare-to-rise-code-plan`.

This skill is designed for transferability: it can run in any Claude thread, and its output feeds into D2R regardless of which thread authored the PRD.

## When to Use

- When the user invokes `/write-prd` or an equivalent trigger
- When `/dare-to-rise-code-plan` detects a missing PRD prerequisite and redirects to this skill
- When preparing inputs for an experimental D2R run across multiple planner LLMs — the same PRD instance fed to each planner

## Inputs

- **Project name** — required
- **Project prefix** for filename (`CC` for Claude Cost, etc.) — required
- **Target D2R skill version** — optional (defaults to current)
- **Existing PRD draft** — optional; if provided, this skill refines rather than authors from scratch

## Execution Protocol

### Step 1: Load Template

Read the template at `.claude/skills/dare-to-rise-code-plan/references/PRD_Template_2026-04-17_v01_I.md`. Use it as the structural spec for the output.

### Step 2: Gather Required Content

Walk through each required section with the user. For each section:
- Present the section's instructions (from the template's italic text)
- Ask the user for the content, or offer a draft based on context available
- Capture the filled-in content

Required sections (see template for details):
1. Product Identity (name, version, one-line description)
2. Users And Problem (primary users, problem statement, why now)
3. Goals (primary goals, non-goals)
4. User Journeys (primary journeys at minimum)
5. Success Criteria (measurable outcomes)
6. Constraints (business, regulatory, technical, accessibility)
7. Assumptions
8. Open Questions
9. Out Of Scope
10. Stakeholder Approvals (at minimum the document author)

Optional sections can be filled or marked NA with one-line justification.

### Step 3: Run ASAE Gate On Draft

Before saving, invoke `/asae` with scope:
- target: the draft PRD content
- sources: the template + user-provided inputs + prior context
- prompt: "Author a PRD for [project name] per the template"
- domain: `document`
- asae_certainty_threshold: 2
- severity_policy: standard

Domain-specific checks for PRD:
- Every user segment described specifically (not "everyone" or "developers")
- Problem statement has evidence, not only intuition
- Goals measurable with targets and timeframes
- Non-goals explicitly named
- User journeys written from user perspective
- All required sections completed or NA-justified

### Step 4: Save The Instance

Filename: `[ProjectPrefix]_PRD_[YYYY-MM-DD]_v01_I.md`
Default location: `[project-root]/docs/planning/` (or a location the user specifies)

Use `/file-versioning` rules if the project already has versioning conventions.

### Step 5: Present For Approval

Present the saved PRD file path to the user with:
- Validation checklist status (all boxes checked, or which items remain pending)
- Stakeholder approval status

Wait for explicit `✓` from the user before marking the PRD approved.

### Step 6: On Approval

- Mark stakeholder approval section complete in the file
- Inform user the PRD is ready for D2R consumption (alongside TRD, AVD, TQCD if they're also ready)

## Portable Prompt Mode

If the user is NOT in the environment where they want the PRD authored (e.g., the filled-in PRD needs to be produced by a different Claude thread or a different LLM), this skill can produce a PORTABLE PROMPT instead of running the authoring directly.

Portable prompt mode triggered by user saying: "give me a portable prompt to fill out the PRD" or equivalent.

The generated portable prompt must:
- Include the template content INLINE (so the receiving LLM doesn't need access to the template file)
- Include the user's project context inline
- Include the filename convention for the output
- Include ASAE gate instructions (run `/asae` if available; else manually verify against the domain-specific checks in Step 3)
- Include a self-contained validation checklist
- Be copyable and pasteable into any Claude thread or any capable LLM with no prerequisites

## Anti-Patterns

- Writing a PRD without the template (produces inconsistent output across projects)
- Skipping validation checklist (produces PRDs not ready for D2R)
- Merging PRD content with TRD or AVD content (these are separate documents by design)
- Filling in content the user hasn't approved (this is user-facing product definition, not Claude's invention)
- Running the ASAE gate at threshold > 2 (a PRD is pre-implementation content; threshold 2 is appropriate rigor for product-definition work)

## Related Skills

- `/write-trd` — Technical Requirements Document (downstream of PRD)
- `/write-avd` — Architecture Vision Document (downstream of PRD + TRD)
- `/write-tqcd` — Testing & Quality Criteria Document (downstream of TRD)
- `/dare-to-rise-code-plan` — consumes the completed PRD as prerequisite input
- `/asae` — used at Step 3 to gate the draft
- `/file-versioning` — governs the output filename convention

## Related References

- Template: `.claude/skills/dare-to-rise-code-plan/references/PRD_Template_2026-04-17_v01_I.md`
