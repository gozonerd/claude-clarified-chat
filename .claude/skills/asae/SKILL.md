---
name: asae
description: "Use this skill when a caller needs a convergence gate run on an output artifact against original sources and a specification. Triggers on: '/asae', 'asae', 'asae gate', 'run asae', 'asae on this', 'audit this against sources', 'convergence gate', or when a parent skill (e.g., /dare-to-rise-code-plan) invokes ASAE at a stage boundary. Takes a scope definition (target, sources, prompt, domain, ASAE Certainty Threshold, severity policy). Runs iterative comparison passes with severity-classified findings. Exits when the configured ASAE Certainty Threshold is reached or halts on max-iteration exceeded. Produces a versioned audit log."
---

# ASAE

## Purpose

ASAE is a convergence gate. The caller invokes it with a scope definition. The gate iterates until the configured ASAE Certainty Threshold is reached — a structural exit condition, not a self-reported one — or halts with escalation if a maximum iteration bound is exceeded.

This skill specifies execution. It does not document methodology. Methodology lives inside Martinez Methods.

## When to Use

- When invoked by a parent skill at a stage boundary (e.g., `/dare-to-rise-code-plan` at every `-A` sub-stage)
- When the user invokes `/asae`, `asae`, `run asae`, or equivalent
- When an output artifact needs a convergence gate before being treated as complete
- Before finalizing any versioned deliverable where the caller has specified a threshold

## Required Input: Scope Definition

Every invocation requires a scope definition. The caller provides:

| Field | Required | Description |
|-------|----------|-------------|
| `target` | Yes | Path(s) to the output artifact(s) being audited |
| `sources` | Yes | Path(s) to the original materials the output was produced from |
| `prompt` | Yes | Path to the original prompt or spec, or inline description |
| `domain` | Yes | One of: `document`, `code`, `research`, `instructional_design`, `legal`, `other` |
| `asae_certainty_threshold` | Yes | Integer (default 3). Number of consecutive passes required at the exit severity policy. |
| `severity_policy` | Yes | `strict` or `standard` (see Severity Classification below) |
| `max_iterations` | No | Default 10. Halt and escalate if exceeded. |

If the caller does not provide a scope definition, the skill requests one before proceeding. No audit runs without scope.

## Severity Classification

Every finding in every audit pass is classified at one of four severity levels:

| Severity | Definition | Counter Impact (standard policy) | Counter Impact (strict policy) |
|----------|------------|----------------------------------|--------------------------------|
| CRITICAL | Factual inaccuracy, hallucination, missing required content, security vulnerability, regulatory noncompliance | Resets counter to 0; must remediate before next pass | Resets counter to 0 |
| HIGH | Logic gap, structural error, misrepresentation of source, accessibility violation, incorrect type signatures, failed test assertion | Resets counter to 0; must remediate before next pass | Resets counter to 0 |
| MEDIUM | Formatting violation, inconsistent naming, minor omission, non-idiomatic patterns | Does NOT reset counter. Must remediate before loop exit. | Resets counter to 0 |
| LOW | Style preference, minor rewording opportunity, non-material improvement | Does NOT reset counter. Logged. Remediation optional. | Does NOT reset counter. Logged. |

Default policy is `standard` unless caller specifies `strict`. Strict is appropriate for high-stakes outputs (regulatory filings, published research, production code in regulated domains).

## Domain Audit Checklists

When `domain` is specified, ASAE applies the domain's audit checklist in every pass. Every checklist item must be evaluated and assigned a result: PASS, FAIL (with severity), or NA (with reason).

### domain: document
- Factual accuracy (every factual claim traced to a source)
- Source fidelity (no misrepresentation of source material)
- Completeness against prompt (every requested element present)
- Internal consistency (no contradictions within the document)
- Formatting compliance (per applicable style rules)
- File naming and versioning (per project conventions)

### domain: code
- Correctness (behavior matches specification)
- Test coverage (100% line + branch coverage of testable surface, per D2R hardwired requirement)
- Security compliance (OWASP Top 10 applicable items, CERT secure coding)
- Accessibility compliance (WCAG 2.1 AA if UI code, per D2R hardwired requirement)
- Type correctness (no type errors, explicit types where language permits)
- Naming conventions (per project conventions)
- No secrets committed

### domain: research
- Citation accuracy (every citation verifiable)
- Evidence grading (claims matched to evidence strength)
- Claim-source traceability (every claim traces to a source)
- Methodology disclosure (methods documented, limitations named)
- Null result handling (null findings treated as valid outputs, not failures)

### domain: instructional_design
- Learning objective alignment (every activity traces to an objective)
- Standards alignment (content maps to target standards framework)
- Scaffolding completeness (prerequisites addressed before new content)
- Assessment validity (assessments measure what objectives state)
- Accessibility of learning materials

### domain: legal
- Regulatory accuracy (every regulatory claim verifiable against primary source)
- Completeness of required disclosures
- Jurisdiction specificity (jurisdiction correctly identified for each provision)
- Citation to primary statutory sources (not only secondary summaries)

### domain: other
- Factual accuracy (every factual claim traced to a source)
- Source fidelity
- Completeness against prompt
- Internal consistency
- General formatting and naming

## The Loop

### Step 1: Audit

Re-read all sources. Re-read the target. For every checklist item in the domain (plus any caller-specified additional criteria), evaluate the target against the source. Classify every finding by severity.

Each audit pass is the SAME comprehensive check, repeated. Not different checks on different passes. The same full evaluation against the same full scope.

### Step 2: Apply Edits

Remediate findings per severity policy:
- CRITICAL: always fix before continuing
- HIGH: always fix before continuing
- MEDIUM: fix before loop exit (strict policy: fix before continuing)
- LOW: fix if trivial; log otherwise

### Step 3: Present Summary

In-thread summary after each loop iteration. Format:

```
## ASAE Loop [iteration] — Scope: [scope name]

**Threshold:** [asae_certainty_threshold]
**Severity Policy:** [standard|strict]
**Domain:** [domain]

**Findings this pass:**
| # | Severity | Checklist Item | Description | Source | Edit Applied |
|---|----------|----------------|-------------|--------|--------------|
| 1 | HIGH | source_fidelity | [description] | [source reference] | [what was changed] |

**Counter state:** [current] / [threshold] consecutive clean passes
**Remaining to exit:** [threshold - current] clean passes required
```

### Step 4: Update Counter

Apply the severity policy to update the consecutive-clean-pass counter per the Severity Classification table.

### Step 5: Version Bump (Target-Type-Dependent)

If target type is a document (domain: `document`, `research`, `instructional_design`, `legal`, or `other` with a document output):
- Increment version number per `file-naming-and-versioning` rule
- Move superseded version to `deprecated/` folder in the same directory

If target type is code (domain: `code`) and the target is tracked by git:
- Do NOT bump filename version. Git history carries version.
- Stage the edits for commit; the parent skill's commit gate will handle the git commit with ASAE metadata.

## Iteration Semantics

One loop = Steps 1 through 5. Continue iterating from Step 1 until exit condition.

### Exit Conditions

**Pass:** Counter reaches the configured ASAE Certainty Threshold AND no MEDIUM-severity findings are outstanding.

**Halt:** Iteration count exceeds `max_iterations` (default 10). Return status `HALT` to caller with a report of the final pass's findings. Parent skill decides whether to escalate, re-scope, or abandon.

### What Counts As A Pass

A pass is when the full audit (Step 1) returns zero findings at CRITICAL, HIGH, and (under strict policy) MEDIUM severity. Counter increments only on a full, comprehensive pass with no severity-resetting findings.

Partial audits do not count. If an audit pass checks only some domain checklist items, it is not a pass — it is an incomplete audit. Run the full checklist every time.

## Consolidated Audit Log

On exit (PASS or HALT), concatenate all loop summaries into a single audit log file.

### Log Location

Determined by target type:
- Document targets: `deprecated/asae-logs/[target_name]_asae-log_[YYYY-MM-DD]_v[##].md` within the target's directory
- Code targets: `.asae-logs/[target_name]_asae-log_[YYYY-MM-DD]_v[##].md` at the repo root

Create the log directory if it does not exist.

### Log Contents

- Scope definition (complete)
- Every loop iteration's summary (Steps 1-3 output concatenated)
- Final counter state
- Exit status (PASS or HALT)
- Timestamp of exit
- Total iterations
- Total findings by severity
- Total edits applied

The log is the audit artifact. It is the reproducibility evidence. It is not discarded.

## Return To Caller

Return a structured result to the parent skill:

```
{
  "status": "PASS" | "HALT",
  "asae_certainty_threshold": <integer>,
  "final_counter": <integer>,
  "total_iterations": <integer>,
  "severity_totals": {
    "critical": <integer>,
    "high": <integer>,
    "medium": <integer>,
    "low": <integer>
  },
  "log_path": "<path to audit log>",
  "exit_timestamp": "<ISO 8601>"
}
```

## Anti-Patterns

- Exiting after one clean pass when threshold is > 1
- Running partial audits and counting them as passes
- Skipping the Step 3 summary
- Allowing MEDIUM severity findings to prevent counter reset AND to block exit — MEDIUM does one or the other depending on policy, not both
- Not writing the audit log on exit
- Describing how convergence works in user-facing output (methodology is not exposed in this skill)
- Auditing from memory instead of re-reading sources
- Treating this skill as a one-shot self-review. It is iterative. The iteration is the point.

## Related Skills

- `/dare-to-rise-code-plan` — Invokes this skill at every stage boundary
- `/file-versioning` — Used in Step 5 for document outputs
- `/file-presentation` — Used when presenting the audit log file to the user

## Related Rules

- `file-naming-and-versioning` — Governs Step 5 document version bumps
- `no-silent-execution` — Every loop iteration produces the Step 3 in-thread summary
- `ip-language-discipline` — Branded terminology only in all outputs
