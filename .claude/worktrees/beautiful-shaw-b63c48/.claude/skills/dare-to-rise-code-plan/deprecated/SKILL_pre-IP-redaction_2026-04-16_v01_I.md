---
name: dare-to-rise-code-plan
description: "Use this skill when planning ANY coding task that involves implementation. Triggers on: 'dare-to-rise-code-plan', 'dare-to-rise-code-planning', 'dare to rise code planning', 'd2r-code-plan', 'd2r code plan', '/dare-to-rise-code-plan', '/dare-to-rise-code-planning', '/d2r-code-plan', 'plan this code task', 'code plan with audit gates', or when Claude is about to produce an implementation plan for a coding task. Enforces minimum plan inclusion standards: mandatory Stage 00 enterprise-grade research (three tracks: enterprise standards, Claude Code plugins/skills, language/framework best practices), n=5 null-edit asae gates after every implementation step, stress test + adversarial review + remediation convergence loops, and detailed git commits after each passed gate."
---

# Dare to Rise Code Plan — Enterprise Hardened

## Purpose

Enforce minimum plan inclusion standards for any coding task. Every implementation plan produced under this skill MUST include: (1) a mandatory three-track research stage before any code is written, (2) a strict asae quality gate after every implementation step, (3) a detailed git commit after each passed gate, and (4) a terminal stress test + adversarial review + remediation convergence loop that runs until n=5 consecutive null cycles. No exceptions. No shortcuts.

## When to Use

- When planning ANY coding task that involves implementation
- When the user says "dare-to-rise-code-plan", "dare-to-rise-code-planning", "dare to rise code planning", "d2r-code-plan", "d2r code plan"
- When the user invokes `/dare-to-rise-code-plan`, `/dare-to-rise-code-planning`, or `/d2r-code-plan`
- When the user says "plan this code task" or "code plan with audit gates"
- Before generating any multi-step implementation plan

---

## Built-In Quality Constraints (Never Afterthoughts)

### Accessibility (WCAG 2.1 AA)

Accessibility is NOT a polish stage. It is a constraint on every implementation stage that produces UI. Every component, every page, every interactive element must meet WCAG 2.1 AA at the time it is built — not in a later cleanup pass.

**Every UI stage's exit criteria MUST include:**
- Keyboard navigable (Tab, arrow keys, Enter/Space for activation)
- Visible focus indicators (`focus-visible:ring-2` or equivalent)
- Semantic HTML (correct roles, labels, `aria-*` attributes)
- Color is never the sole indicator of meaning — text labels always present
- Contrast ratios met (4.5:1 normal text, 3:1 large text)
- Touch targets ≥44x44px for any element intended for mobile
- `prefers-reduced-motion` respected on all animations

**Every UI stage's `-A` audit gate MUST check:**
- Can a keyboard-only user complete all interactions in this stage?
- Are all new elements properly labeled for screen readers?
- Does color alone convey any meaning without a text alternative?

If a stage adds UI and the audit gate does not check accessibility, the gate has not passed. Accessibility failures count as errors that reset the n=5 consecutive counter.

### Legal Pages (Web Deployments)

Any D2R plan that includes a deploy-to-web stage MUST include a legal pages stage **before** the deployment stage. This is not optional. Legal pages are not an afterthought — they ship with the first deployment.

**Required legal pages for any public web deployment:**
- Privacy Policy (`/privacy`) — data handling, analytics disclosure, cookie policy, GDPR/CCPA considerations
- Terms of Use (`/terms`) — disclaimer, limitation of liability, intellectual property

**Legal page stage requirements:**
- Pages must be accessible from a persistent footer on every page
- Pages must meet the same a11y constraints as all other UI
- Content must be reviewed in the `-A` audit gate for accuracy and completeness
- If the tool collects no PII and runs client-side only, the privacy policy must explicitly state this

**Anti-pattern:** Deploying a public-facing tool and adding legal pages later. The legal pages stage is sequenced before deployment in every plan skeleton.

### Enterprise Standards Compliance

Every D2R plan MUST research and plan against enterprise standards appropriate to the code task. Standards are not aspirational — they are exit criteria. See Stage 00 Track 1 below.

---

## Model Scoping

Every stage in the plan skeleton MUST indicate the recommended model:

| Model | When to Assign |
|-------|---------------|
| **Haiku** | Implementation tasks within its capability: CRUD operations, boilerplate, straightforward feature work, test writing, formatting, file operations |
| **Sonnet** | Complex implementation requiring deeper reasoning: architecture decisions within a stage, nuanced error handling, performance optimization, security-sensitive code |
| **Opus** | Planning, adversarial review, architecture-level decisions, Stage 00 research synthesis, stress test analysis, convergence judgment calls |

**Rules:**
- The plan skeleton declares which model handles each stage
- If a stage could go either way, assign the lower model and note "escalate to [higher model] if [specific condition]"
- The user makes final model assignment decisions — the plan proposes, the user disposes
- All work stays within Claude Code. No external architect tools, no cross-platform review chains

---

## Plan Structure: Mandatory Stage Numbering

Every plan MUST use this stage numbering scheme:

| Stage | Purpose | Sub-Stages |
|-------|---------|------------|
| Stage 00 | Enterprise Standards Research (3 tracks) | 00-A: Audit Gate, 00-B: Commit Gate |
| Stage 01 | [First implementation step] | 01-A: Audit Gate, 01-B: Commit Gate |
| Stage 02 | [Second implementation step] | 02-A: Audit Gate, 02-B: Commit Gate |
| Stage NN | [Nth implementation step] | NN-A: Audit Gate, NN-B: Commit Gate |
| Stage QA | Stress Test + Adversarial Review Loop | QA cycles until n=5 null, QA-B: Final Commit |

- Stage 00 is ALWAYS research. It executes before any code is written.
- Stage 01+ are implementation steps. Each one gets its own audit gate and commit gate.
- Stage QA is ALWAYS the terminal stage. It runs after all implementation is complete.
- The `-A` suffix is always the audit gate. The `-B` suffix is always the commit gate.
- No implementation step may lack its `-A` and `-B` sub-stages.

---

## Stage 00: Enterprise Standards Research (Three Tracks)

### Purpose

Before ANY code is written, research three domains that inform every subsequent stage. This stage produces a research findings document that becomes the standard against which ALL implementation and ALL quality gates are measured.

### Track 1: Enterprise Standards Applicable to This Task

Research which enterprise standards apply to the specific code being built. Start from these frameworks and narrow to what's relevant:

**For desktop applications:**
- ISO/IEC 25010 — Product quality model (functional suitability, reliability, performance, security, maintainability, portability)
- OWASP Desktop App Security Top 10 — DA1 (Injection) through DA8 (Poor Code Quality)
- NIST SSDF — Secure Software Development Framework (Prepare, Protect, Produce, Respond)
- OWASP ASVS — Application Security Verification Standard (auth, crypto, logging, config)
- SOC 2-aligned engineering practices (logging, access control, encryption, audit trails)

**For web applications:**
- OWASP Top 10 Web Application Security Risks
- WCAG 2.1 AA (already hardwired above)

**For any application:**
- CERT Secure Coding Standards for the implementation language
- CWE Top 25 Most Dangerous Software Weaknesses

**Output:** For each applicable standard, document:
- Which specific requirements apply to this task
- What the measurable exit criteria are
- Which implementation stages they constrain

### Track 2: Claude Code Plugins, Skills, and MCP Servers

Research what tools are available to accelerate or improve this specific build:

- Search for Claude Code community skills/plugins on GitHub (look for awesome-claude-code collections, community skill repos)
- Check installed MCP servers and their capabilities
- Identify any existing skills in this repo's `.claude/skills/` that apply
- Search for MCP servers that could provide relevant APIs, linting, testing, or analysis capabilities

**Output:** For each relevant tool found, document:
- Name and source
- What it does
- Which stage(s) it applies to
- Whether to install it before Stage 01

### Track 3: Language/Framework Best Practices for This Task

Research current best practices for the specific technologies and patterns this task uses:

- Official documentation for libraries, frameworks, and APIs being used
- Current best practices via web search and Context7 lookups
- Existing patterns and conventions already established in the codebase
- Known deprecations, breaking changes, or common pitfalls

**Output:** For each research target, document:
- What the current best practice is
- What sources confirm it
- How it applies to the planned implementation
- Any warnings or pitfalls found

### Stage 00 Deliverable

Produce a single **Stage 00 Research Summary** that consolidates all three tracks:

```
## Stage 00: Research Summary

### Track 1: Enterprise Standards
#### [Standard Name]
- **Applicable requirements:** [list]
- **Exit criteria:** [measurable]
- **Constrains stages:** [which ones]

### Track 2: Claude Code Tooling
#### [Tool/Plugin/MCP Name]
- **What it does:** [description]
- **Applies to:** [stages]
- **Action:** Install before Stage 01 / Already available / Not needed

### Track 3: Best Practices
#### [Technology/Pattern]
- **Best practice:** [finding]
- **Sources:** [what confirmed this]
- **Applies to:** [stages]
- **Pitfalls:** [warnings]
```

Save as: `D2R_Stage00_Research_Summary_YYYY-MM-DD_v01_I.md`
Location: `.claude/d2r-artifacts/` or `docs/` in the working repo.

Proceed to Stage 00-A (audit gate on the research findings).

### Anti-Patterns

- Skipping Stage 00 because "I already know how to do this"
- Doing a shallow search and moving on — research must cover ALL THREE tracks
- Starting to write code before Stage 00-B (commit gate) passes
- Skipping Track 1 because "this isn't enterprise software" — every D2R plan plans against standards
- Listing standards without defining measurable exit criteria for them
- Skipping Track 2 because "I don't think there are plugins for this" — search first, conclude after

---

## Sub-Stage A: ASAE Gate (n=5)

### Purpose

Quality gate that runs after every stage (including Stage 00). Uses the `asae` skill's 4-step loop but with a STRICTER exit condition.

### How It Differs from Standard ASAE

The standard `asae` skill exits after **1 audit pass returning zero errors.**

This skill requires **5 CONSECUTIVE audit passes returning zero errors / null edits** before the gate passes. If any pass finds even one error, the consecutive counter resets to zero.

### What "5 Consecutive Null-Edit Passes" Means

Each pass is the SAME comprehensive audit repeated from scratch. You re-read ALL sources, re-check ALL code, re-verify ALL requirements — the full audit — and find zero errors. Then you do that again. And again. Five times in a row.

**This is NOT 5 different audits.** It is NOT "pass 1 checks types, pass 2 checks tests, pass 3 checks a11y, pass 4 checks formatting, pass 5 checks naming." That is 5 partial audits, not 5 full passes.

**Each of the 5 passes must independently check EVERYTHING:**
- Correctness against requirements
- Correctness against Stage 00 research findings (ALL three tracks)
- Compliance with enterprise standards identified in Track 1
- Code quality and conventions
- Test coverage and accuracy
- Accessibility (if UI stage)
- File naming and versioning
- All project rules

If pass 3 finds an error that passes 1 and 2 missed, the counter resets to zero. That's the point — repetition catches what single passes miss.

### Procedure

1. **Execute the asae loop** per the `asae` skill:
   - Step 1: Audit (compare work against original sources, prompt, Stage 00 research findings, AND enterprise standards from Track 1)
   - Step 2: Apply Edits (fix every error found)
   - Step 3: Present Summary (in-thread table)
   - Step 4: Bump Versioning — **document outputs only** (Research Summary, implementation notes, spec files). For code files tracked by git, skip the filename version bump; git history serves as the version record.

2. **Track the consecutive null-edit counter.** After each loop iteration:
   - If errors were found: reset counter to 0
   - If zero errors found: increment counter by 1

3. **Augment the Step 3 summary** with the counter:

```
## ASAE Loop [iteration] — D2R Gate [Stage XX-A]

**Errors found:** [count]
**Edits applied:** [count]
**Consecutive null-edit passes:** [M] / 5

| # | Error | Source | Edit Applied |
|---|-------|--------|-------------|
| 1 | [description] | [which source/prompt] | [what was changed] |
```

4. **Exit condition:** When the counter reaches 5 (five consecutive passes with zero errors), the gate passes. Proceed to Sub-Stage B.

5. **Hard gate.** This gate CANNOT be skipped, abbreviated, or overridden. If it takes 20 loops to get 5 consecutive clean passes, it takes 20 loops.

### What to Audit Against

Each audit pass compares the stage's output against:
- The original task requirements / user prompt
- Stage 00 research findings — ALL three tracks (standards, tooling, best practices)
- Enterprise standards exit criteria (Track 1)
- Project rules (`.claude/rules/`)
- Existing codebase conventions
- The specific stage's stated goal
- **Accessibility constraints** (if the stage produces UI) — see "Built-In Quality Constraints" above
- **Legal page completeness** (if the stage is the legal pages stage) — see "Built-In Quality Constraints" above

### Anti-Patterns

- Exiting after 1 clean pass (that is the standard skill, not this one)
- Declaring "looks good" without actually re-reading sources
- Counting non-consecutive clean passes toward the 5
- Skipping the gate because "nothing changed since last pass" — run the full audit anyway
- Skipping accessibility checks on a UI stage because "there's a polish stage later" — there isn't. A11y is checked NOW.
- Treating accessibility as cosmetic/LOW severity — a11y failures are HIGH severity and reset the counter
- Skipping enterprise standards checks because "that's what Stage QA is for" — standards are checked at EVERY gate, not just the final one

---

## Sub-Stage B: Commit Gate

### Purpose

After each passed audit gate (5 consecutive null-edit passes), commit the work with a detailed, descriptive commit message.

### Procedure

1. **Run `git status`** to see all changed files.

2. **Stage ONLY files created or modified in this step.** Add specific files by name. Never use `git add -A` or `git add .`. Follow `git-commit-scope` rules.

3. **Write the commit message** using this template:

```
Stage [NN]: [Brief description of what was implemented]

WHAT: [Specific files changed and what changed in each]
WHY: [The reasoning behind this implementation approach,
      referencing Stage 00 research findings where applicable]
VERIFIED: ASAE gate passed — [total audit loops] total loops,
          [total edits] total edits applied, 5 consecutive null-edit
          passes confirmed
STANDARDS: [Which enterprise standards from Track 1 were verified]
RESEARCH BASIS: [Which Stage 00 findings informed this step]
```

4. **Commit** with the message above.

5. **Push** immediately after the commit. If push fails, flag immediately per `github-discipline` rules.

6. **Report the commit** in-thread:

```
## Stage [NN]-B: Commit Complete

**Commit:** [short hash]
**Files:** [list of committed files]
**Pushed:** [yes/no + remote]
```

### Anti-Patterns

- Accumulating uncommitted changes across multiple stages
- Using vague commit messages ("updated code", "fixed stuff")
- Committing files not touched in this stage
- Forgetting to push after commit
- Skipping `git status` before staging
- Omitting STANDARDS from the commit message

---

## Stage QA: Stress Test + Adversarial Review + Remediation Loop

### Purpose

Terminal quality convergence stage. Runs AFTER all implementation stages are complete and committed. Executes repeated cycles of stress testing, adversarial code review, and remediation until the system produces n=5 consecutive cycles with zero new issues found.

### When Stage QA Begins

Stage QA begins only after:
- ALL implementation stages (01 through NN) have passed their `-A` audit gates
- ALL implementation stages have passed their `-B` commit gates
- ALL code is committed and pushed

### QA Cycle Structure

Each QA cycle has three phases:

#### Phase 1: Stress Test

Run the full test suite and push beyond normal operation:

- **All existing tests pass** — run the full test suite (frontend + backend)
- **Edge case inputs** — empty strings, null values, maximum-length strings, Unicode, special characters
- **Malformed data** — invalid JSON, truncated YAML, oversized files (>10MB if parser-relevant)
- **Boundary conditions** — zero items, one item, maximum items, negative numbers where applicable
- **Concurrency** — if the app handles concurrent operations, test overlapping operations
- **Error recovery** — force errors and verify graceful handling (no panics, no data corruption)

Use existing specialized skills where available:
- `test-gap-analyzer` — identify missing test coverage
- `performance-profiler` — find performance hotspots

**Output:**

```
## QA Cycle [N] — Phase 1: Stress Test

**Tests run:** [count]
**Tests passed:** [count]
**New issues found:** [count]

| # | Issue | Severity | Location | Description |
|---|-------|----------|----------|-------------|
| 1 | [title] | CRIT/HIGH/MED/LOW | file:line | [what's wrong] |
```

#### Phase 2: Adversarial Code Review

Review ALL code produced in the implementation stages with adversarial intent — actively try to break it:

**Security review** (use `security-reviewer` skill checklist):
- Injection vectors (SQL, command, path traversal)
- Authentication/authorization gaps
- Sensitive data exposure (logs, error messages, memory)
- Cryptography misuse (weak algorithms, hardcoded keys)
- IPC/WebView security boundaries
- Input validation completeness

**Accessibility review** (use `accessibility-auditor` skill checklist):
- WCAG 2.1 AA compliance on all UI produced
- Keyboard navigation completeness
- Screen reader compatibility
- Color contrast and non-color-dependent information

**Code quality review:**
- Cyclomatic complexity hotspots (flag functions >15)
- Dead code or unused imports
- Error handling completeness (no swallowed errors, no bare unwrap/expect)
- Naming consistency
- Module boundaries and coupling

**Standards compliance review:**
- Verify every enterprise standard exit criterion from Stage 00 Track 1
- Document which criteria are met and which are not

**Output:**

```
## QA Cycle [N] — Phase 2: Adversarial Review

**Issues found:** [count]
**By severity:** [N CRIT, N HIGH, N MED, N LOW]

| # | Category | Severity | Location | Issue | Standard |
|---|----------|----------|----------|-------|----------|
| 1 | Security | HIGH | file:line | [description] | [which standard] |
```

#### Phase 3: Remediation

Fix every issue found in Phases 1 and 2:

- Fix all CRITICAL issues immediately
- Fix all HIGH issues
- Fix MEDIUM issues unless there is a documented reason to defer (and the deferral is logged)
- LOW issues: fix if trivial, log if not
- After all fixes, re-run the full test suite to confirm no regressions

**Output:**

```
## QA Cycle [N] — Phase 3: Remediation

**Issues remediated:** [count]
**Issues deferred:** [count] (with justification for each)
**Regression tests:** [pass/fail]
```

### QA Cycle Tracking

After each complete cycle (all three phases), track the null counter:

- If Phase 1 + Phase 2 found ANY issues: reset null counter to 0
- If Phase 1 + Phase 2 found ZERO issues: increment null counter by 1

```
## QA Cycle [N] — Summary

**Phase 1 issues:** [count]
**Phase 2 issues:** [count]
**Phase 3 remediations:** [count]
**Consecutive null cycles:** [M] / 5
```

### Exit Condition

**5 consecutive QA cycles with zero new issues found across both Phase 1 and Phase 2.** This means:

- 5 consecutive stress test runs finding nothing new
- 5 consecutive adversarial reviews finding nothing new
- After at least one remediation cycle has been completed (you can't go 5/5 null on the first attempt unless the code was already perfect)

When the null counter reaches 5, Stage QA passes.

### Stage QA-B: Final Commit

After Stage QA passes, commit any remaining changes with:

```
Stage QA: Enterprise quality convergence complete

WHAT: [any files changed during QA remediation cycles]
VERIFIED: [total QA cycles] cycles, [total issues found and fixed],
          5 consecutive null cycles confirmed
STANDARDS MET: [list all enterprise standards from Track 1 that are verified]
STRESS TEST: [total test count], [pass rate]
ADVERSARIAL REVIEW: [total issues found across all cycles by severity]
```

### Anti-Patterns

- Skipping Stage QA because "the audit gates already caught everything"
- Running Phase 2 without adversarial intent (just reading code vs. actively trying to break it)
- Counting a cycle as null when deferred issues exist
- Skipping the security review because "it's not a security-sensitive feature"
- Skipping the accessibility review because "there's no UI in this stage" (verify this is actually true)
- Declaring 5/5 null on the first 5 cycles without ever having found and fixed anything — this is suspicious and should be flagged

---

## Execution Protocol (Full Sequence)

When this skill is active, the Claude instance MUST follow this exact sequence:

1. **Receive the coding task** from the user.

2. **Generate the plan skeleton.** List all implementation steps as Stage 01, 02, 03, etc. Include model assignment for each stage. Present using this format and wait for user confirmation before proceeding:

```
## D2R Plan Skeleton — [Task Name]

| Stage | Description | Model | Parallel? |
|-------|-------------|-------|-----------|
| Stage 00 | Enterprise Standards Research (3 tracks) | Opus | No — sequential |
| Stage 01 | [first implementation step] | [Haiku/Sonnet] | [Yes/No — dependency note] |
| Stage 02 | [second implementation step] | [Haiku/Sonnet] | [Yes/No — dependency note] |
| Stage NN | [Nth step] | [Haiku/Sonnet] | [Yes/No — dependency note] |
| Stage QA | Stress Test + Adversarial Review Loop | [Sonnet/Opus] | No — terminal |

**Parallelization notes:**
- [Which stages can run concurrently]
- [Which stages have hard dependencies on prior stages]

`✓` to approve and begin Stage 00

`?` to discuss stages

`X: [feedback]` to modify the stage list
```

Do not begin Stage 00 until the user responds with `✓`.

3. **Execute Stage 00** (Enterprise Standards Research — Three Tracks).
   - 00: Research all three tracks
   - 00-A: Run n=5 asae gate on research findings
   - 00-B: Commit research artifacts

4. **Execute each implementation stage in order (or in parallel where indicated):**
   - NN: Execute the implementation step
   - NN-A: Run n=5 asae gate on the step's output
   - NN-B: Commit the step's output

5. **Execute Stage QA** (Stress Test + Adversarial Review + Remediation Loop).
   - Run QA cycles until n=5 consecutive null cycles
   - QA-B: Final commit

6. **Never skip ahead.** Stage 02 cannot begin until Stage 01-B is complete (unless the plan marks them as parallelizable). Stage 01 cannot begin until Stage 00-B is complete. Stage QA cannot begin until ALL implementation stages are complete.

7. **Present final summary** after all stages complete:

```
## Dare to Rise Code Plan — Complete

| Stage | Description | Model | Audit Loops | Total Edits | Commit |
|-------|-------------|-------|-------------|-------------|--------|
| 00 | Research (3 tracks) | [model] | [N] | [N] | [hash] |
| 01 | [desc] | [model] | [N] | [N] | [hash] |
| 02 | [desc] | [model] | [N] | [N] | [hash] |
| QA | Convergence Loop | [model] | [N cycles] | [N fixes] | [hash] |

**Total audit loops across all stages:** [sum]
**Total edits applied across all stages:** [sum]
**Total QA cycles:** [count]
**Total QA issues found and fixed:** [count]
**Enterprise standards verified:** [list]
**Total commits:** [count]
```

---

## Related Skills

- `asae` — The base audit loop used in every `-A` sub-stage (with modified exit condition of n=5)
- `security-reviewer` — Used in Stage QA Phase 2 adversarial review
- `accessibility-auditor` — Used in Stage QA Phase 2 and every UI stage's `-A` gate
- `test-gap-analyzer` — Used in Stage QA Phase 1 stress testing
- `performance-profiler` — Used in Stage QA Phase 1 stress testing
- `file-versioning` — Used in Step 4 of each audit loop for version bumps
- `file-presentation` — Used when presenting output files to Krystal

## Related Rules

- `git-commit-scope` — Only commit files from current session
- `github-discipline` — Push after every commit, descriptive messages
- `file-naming-and-versioning` — Versioning standards for all output files
- `command-handlers` — OrchestraError mandate, input validation (Orchestra-specific)
- `parsers` — 10MB limit, no panics, descriptive errors (Orchestra-specific)
- `schema` — Migration rules, node_from_row sync (Orchestra-specific)
- `components` — 500-line max, a11y requirements (Orchestra-specific)
