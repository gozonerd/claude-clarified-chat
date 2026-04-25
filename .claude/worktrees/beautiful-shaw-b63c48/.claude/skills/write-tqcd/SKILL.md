---
name: write-tqcd
description: "Use this skill to author a Testing & Quality Criteria Document as a prerequisite input to /dare-to-rise-code-plan. Triggers on: '/write-tqcd', 'write-tqcd', 'author a TQCD', 'write a testing and quality criteria document', 'generate TQCD', 'draft TQCD'. Requires a completed PRD + TRD as inputs. Loads the TQCD template, walks the user through each required section applying the Testing Taxonomy's 20 test categories + 39 stress categories + AI-driven selection strategy. Produces a validated filled-in instance."
---

# Write TQCD

## Purpose

Author a Testing & Quality Criteria Document from the reusable template. Produces a filled-in TQCD instance ready to serve as a prerequisite input to `/dare-to-rise-code-plan`.

The TQCD is the OPERATIONALIZATION of quality for the project. It converts the TRD's non-functional requirements and applicable standards into measurable exit criteria. Stage 01 of D2R reads the TQCD and designs QA FIRST before any implementation stages.

## When to Use

- When the user invokes `/write-tqcd` or equivalent
- When `/dare-to-rise-code-plan` detects a missing TQCD prerequisite
- When preparing inputs for an experimental D2R run

## Inputs

- **Project name** — required
- **Project prefix** — required
- **PRD reference** — required
- **TRD reference** — required
- **AVD reference** — optional (recommended if AVD exists)
- **Existing TQCD draft** — optional

## Execution Protocol

### Step 1: Verify Prerequisites

PRD and TRD must exist and be approved. If either missing, refuse to proceed and offer the appropriate authoring skill.

Read PRD, TRD, and AVD (if exists). Cache key facts: non-functional requirements (TRD Section 3), applicable standards (TRD Sections 3.3 / 3.4 / 3.5), constraints (TRD Section 6), platform targets.

### Step 2: Load Template And Reference Taxonomy

Read `.claude/skills/dare-to-rise-code-plan/references/TQCD_Template_2026-04-17_v01_I.md` and the Software Testing Taxonomy at `.claude/skills/dare-to-rise-code-plan/references/Software_Testing_Taxonomy_2026-04-17_v01_I.md`.

### Step 3: Gather Required Content

Walk through each required section. Testing Taxonomy applicability is the largest section and requires per-category evaluation.

Required sections:
1. Document Identity (PRD/TRD/AVD references, revisions)
2. **Testing Taxonomy Applicability** — per-category YES/NO with exit criteria or skip reason. Cover all 20 test categories (Part 1) and apply AI-driven selection to all 39 stress categories (Part 2)
3. Standards Operationalized As Exit Criteria (from TRD-applicable standards, converted to measurable criteria with verification methods)
4. Benchmarks With Target Scores
5. Coverage Floors (100% line + branch per D2R hardwired requirement)
6. Accessibility Criteria Detailed (WCAG 2.1 AA specific success criteria + tools + protocols)
7. Performance Budgets (from TRD Section 3.1)
8. Security Quality Gates (pre-commit / CI / pre-deploy per TRD Section 3.3)
9. Quality Review Gates (code review, ASAE gate thresholds per stage type)
10. Open Quality Questions
11. Stakeholder Approvals

### Step 4: Apply AI-Driven Selection To Stress Categories

For each of the 39 stress test categories, apply the selection rule from the Testing Taxonomy Part 3:

For each category:
- Does this system have the component this test targets?
- Is failure in this component high-severity for this use case?
- Is this failure mode plausible given actual usage patterns?

If yes to all three: include with target scenario. If no to any: skip with specific reason (not "not applicable" — a specific reason).

### Step 5: Declare ASAE Thresholds Per Stage

Per the current D2R skill stage structure:
- Stage 00 (research): threshold 2 default
- Stage 01a (skeleton authorship): threshold 2 default
- Stage 01b (full plan authorship): threshold 3 default
- Stage 02 (project scaffold, Sonnet): threshold 3 default
- Stage 03+ (feature implementation, Haiku): threshold 3 default
- Stage QA (convergence loop): threshold 5 default

Declare severity policy: `strict` for regulated domains, published research, production code in high-stakes contexts. `standard` otherwise.

### Step 6: Run ASAE Gate On Draft

Invoke `/asae` with:
- target: TQCD draft
- sources: template + Taxonomy + PRD + TRD + AVD (if exists) + user inputs
- prompt: "Author a TQCD for [project name] per the template"
- domain: `document`
- asae_certainty_threshold: 2
- severity_policy: standard

Domain-specific checks for TQCD:
- Testing Taxonomy applicability declared for all 20 test categories
- All 39 stress categories evaluated via AI-driven selection (included or skipped with reason)
- Every YES category has specific exit criteria (not "follow best practices")
- Every NO category has specific skip reason
- Standards operationalized with measurable exit criteria + verification methods
- Coverage floors declared (100% line + branch per D2R hardwired requirement; exceptions documented)
- Accessibility criteria specific (not "WCAG AA" — specific success criteria + tools + protocols)
- Performance budgets measurable
- ASAE thresholds declared per stage type
- Severity policy declared

### Step 7: Save, Present, Approve

Filename: `[ProjectPrefix]_TQCD_[YYYY-MM-DD]_v01_I.md`
Save to planning directory.

Present for approval. On `✓`: mark approved.

## Portable Prompt Mode

Same pattern as other write-* skills. Note: the portable prompt for TQCD must include the Testing Taxonomy INLINE (the full Part 1 + Part 2 + Part 3 content) so a receiving LLM has the reference material.

## Anti-Patterns

- Kitchen-sink listing all 20 test categories as applicable without evaluation (dilutes the QA spec)
- Applying every stress category without AI-driven selection (Stage QA becomes unmanageable)
- Adjective-based exit criteria ("thoroughly tested") instead of specific measurable criteria
- Leaving ASAE thresholds undeclared (Stage 01 can't configure gates without them)

## Related Skills

- `/write-prd` (must exist first)
- `/write-trd` (must exist first)
- `/write-avd` (recommended if exists)
- `/dare-to-rise-code-plan` (consumes TQCD as primary QA-first input)
- `/asae` (used at Step 6)

## Related References

- Template: `.claude/skills/dare-to-rise-code-plan/references/TQCD_Template_2026-04-17_v01_I.md`
- Taxonomy: `.claude/skills/dare-to-rise-code-plan/references/Software_Testing_Taxonomy_2026-04-17_v01_I.md`
