---
name: dare-to-rise-code-plan
description: "Use this skill when planning ANY coding task that involves implementation. Triggers on: 'dare-to-rise-code-plan', 'dare-to-rise-code-planning', 'dare to rise code planning', 'd2r-code-plan', 'd2r code plan', '/dare-to-rise-code-plan', '/dare-to-rise-code-planning', '/d2r-code-plan', 'plan this code task', 'code plan with governance gates'. Enforces backwards-planning from excellence, four-track Stage 00 research, QA-designed-first Stage 01 plan authorship, hook-orchestrated ASAE governance at every stage boundary, hardwired accessibility and test coverage, plan-specification-depth as a first-class parameter, and deterministic commit gates via Claude Code hooks and git hooks."
---

# Dare to Rise Code Plan

## Purpose

Excellence is the floor. This skill enforces backwards-planning from an excellent end state — not forward from current capacity. If the plan does not target excellence, it will not produce excellence. Every constraint in this skill is a structural commitment to that floor.

The skill produces a structured code plan whose execution is governed by deterministic hooks at every boundary. Governance is not advisory. It is enforced.

## When to Use

- Planning any coding task that will be implemented
- When the user invokes `/dare-to-rise-code-plan`, `/d2r-code-plan`, or equivalent triggers
- Before generating any multi-step implementation plan
- Before any code is written against a specification

## Prerequisite Inputs

This skill requires four standardized input documents to exist and be approved before Stage 00 can run. Without them, the plan is ungrounded and Stage 00 research has no scoping constraint.

| # | Document | Purpose | Template | Authorship Skill |
|---|----------|---------|----------|------------------|
| 1 | **PRD** (Product Requirements) | What the product IS | `references/PRD_Template_2026-04-17_v01_I.md` | `/write-prd` |
| 2 | **TRD** (Technical Requirements) | What the system MUST DO technically | `references/TRD_Template_2026-04-17_v01_I.md` | `/write-trd` |
| 3 | **AVD** (Architecture Vision) | The system's high-level shape and boundaries | `references/AVD_Template_2026-04-17_v01_I.md` | `/write-avd` |
| 4 | **TQCD** (Testing & Quality Criteria) | What success looks like quality-wise | `references/TQCD_Template_2026-04-17_v01_I.md` | `/write-tqcd` |

The four templates are reusable across projects and across LLMs. Any sufficiently capable planner LLM given the same filled-in PRD + TRD + AVD + TQCD should produce a D2R code plan of comparable structure. This transferability enables experimental comparison of planner LLM quality given identical inputs.

**If any of the four documents is missing or not approved**, the D2R skill does not proceed to Stage 00. Instead it offers three paths:

1. **Author in-thread:** invoke the appropriate `/write-prd`, `/write-trd`, `/write-avd`, or `/write-tqcd` skill directly in this Claude session
2. **Portable prompt:** generate a self-contained portable prompt the user can hand to a different Claude thread or a different LLM entirely. The receiving LLM fills out the template(s) independently and returns the filled-in document(s) to the user for D2R consumption. Template content is embedded inline in the portable prompt so the receiving LLM needs no file access.
3. **Escalate:** tell the user the prerequisite is missing and stop.

Do not proceed to Stage 00 research against an incomplete input set. An incomplete prerequisite set produces degraded plans regardless of Stage 01 rigor.

## Portable Prompt Generation (When Prerequisite Docs Missing)

When the user requests a portable prompt for authoring missing prerequisites, the D2R skill generates a prompt that is:

- **Self-contained:** includes the template content inline, includes the user's project context inline, includes the filename convention, includes the validation checklist
- **Transferable:** works in any Claude thread or any capable LLM with no file-system access
- **ASAE-aware:** includes instructions to run `/asae` if the receiving environment has it; falls back to manual validation checklist if not
- **Output-format-rigorous:** specifies exact filename, exact section structure, exact markers for machine-parseable output

Receiving LLMs use this prompt to produce filled-in documents the user then brings back to the D2R environment. This pattern supports:

- Experimental comparison of planner LLMs (same inputs, different LLMs, comparable outputs)
- Separation of planning-thread compute from execution-thread compute
- Collaboration where the document author and the D2R executor are different people in different contexts

## Core Principles (Hardwired, Not Features)

These are pre-conditions on every plan produced by this skill. They are not optional stages, checklist items, or polish passes. A plan that lacks any of them is not a valid D2R plan.

### 1. Excellence As The Floor

Plans are backwards-planned from the excellent end state. Stage 01 authorship begins from "what does excellent look like for this output" and works backward through the stages required to produce it. Forward planning from current capacity is forbidden — it produces mediocre outputs because mediocre is what forward-from-here permits.

### 2. ASAE Governance At Every Stage Boundary

Every stage exit passes through an ASAE gate at the configured ASAE Certainty Threshold. Stage 00 research exits through an ASAE gate. Stage 01 plan authorship exits through an ASAE gate. Every implementation stage exits through an ASAE gate. Stage QA is itself a convergence loop.

Gate semantics are specified in this skill. Execution of the gate is delegated to the `/asae` skill. The D2R skill does not describe ASAE mechanics. It specifies when the gate runs, what it audits against, and what happens on failure.

### 3. Accessibility Hardwired

Every stage that produces UI produces WCAG 2.1 AA compliant UI at authorship time. Not checked at the end. Not added in a polish pass. Not a separate stage.

A stage that produces UI without WCAG 2.1 AA compliance has not completed its implementation, regardless of feature correctness. The stage's exit criteria include accessibility by default, always, without exception. The word "accessibility" does not appear as a feature name anywhere in any D2R plan because accessibility is not a feature. It is a condition of correctness.

### 4. Test Coverage Hardwired

Every stage that produces code produces code with 100% line and branch coverage of the implementation language's standard testable surface. Backend: 100%. Frontend: 100%. Integration points between the two: covered by contract tests. Not added later. Not deferred.

The word "testing" does not appear as a feature stage anywhere in any D2R plan. Tests are authored alongside implementation or before (TDD). Tests are part of what it means for a stage to have implemented anything.

### 5. Model Awareness Per Subagent (Hook-Enforced)

Every sub-agent and every stage is assigned a specific model and effort level in Stage 01. Assignments are enforced by PreToolUse hooks — not advised.

#### Model Tier Table

| Tier | Role | Examples |
|------|------|----------|
| **Opus** | Plans, decides, audits. Reserved for reasoning work. | Stage 00 research; Stage 01a skeleton authorship; Stage 01b full plan authorship; ASAE gate judgment; architectural decisions; content decisions for READMEs and docs (what to say); IP and license selection |
| **Sonnet** | Setup + judgment-requiring authoring + mid-complexity implementation. Handles work that requires knowing "what good looks like" but not architectural reasoning. | Stage 02 Project Scaffold (repo creation + README drafting per Opus's content decisions + LICENSE + package.json + tsconfig + eslint + vite + prettier + CI workflow + hook scripts + initial scaffolding + commit messages + initial push); mid-complexity implementation where Deep-spec would be fragile; security-sensitive code; nuanced error handling; setup error troubleshooting |
| **Haiku** | Rote transcription of Deep-spec content. Executes fully-specified operations. | Stage 03+ feature implementation at Deep spec depth; exact function writes per exact spec; exact file writes per exact spec; exact command runs per exact spec; test case implementation from exact test spec |

#### Hard Rules

- **Never Opus for implementation.** Opus plans and audits; it does not write the code.
- **Never Haiku for reasoning or QA judgment.** Haiku transcribes; it does not decide.
- **Never Haiku for Stage 02 Project Scaffold.** Setup requires judgment Haiku lacks — license selection, README voice, config-file conventions, troubleshooting.
- **Never Haiku for README or LICENSE authorship.** These are communication artifacts requiring audience judgment. Sonnet drafts from Opus's content decisions.

The hook layer makes violations structurally impossible. See "Hook Orchestration" below.

### 6. Plan-Specification-Depth Parameter

Every stage in Stage 01's output is tagged with a specification depth: `Shallow`, `Medium`, or `Deep`.

| Depth | What The Executing Model Decides | When To Use |
|-------|----------------------------------|-------------|
| Shallow | Library choice, API, error handling, types, iteration style | Only when the executing model has high training coverage of the target stack AND the task is well-within its discretion |
| Medium | API specifics, error handling patterns, types | When the executing model has moderate stack coverage and the library is pre-selected |
| Deep | Only syntax transcription. Plan specifies exact library versions, API signatures, error types, return types, iteration idioms, import styles | Default when executing model is Haiku. Required when target stack is less common in executing model's training data. |

Stage 01 must justify the depth choice per stage. Default assumption: if executing model is Haiku, depth is Deep unless justified otherwise.

## Hook Orchestration

Governance is enforced at three layers. Each layer is non-bypassable independently. Circumvention requires explicit opt-out at each layer and produces audit evidence.

### Layer 1: Claude Code Hooks (In-Session Enforcement)

Located in `.claude/settings.json` or `.claude/settings.local.json`.

**PreToolUse on `Write|Edit` in main session:**
- Block direct code writes from the main (planning) session
- Force delegation to an implementation sub-agent with the stage's assigned model
- Error message: "Main session is planning-only. Delegate this write to the sub-agent assigned to stage [NN] per the D2R plan."

**PreToolUse on `Bash` matching `git commit*`:**
- Verify ASAE summary for the current stage appears in recent thread context
- Verify test suite has passed (check exit code of most recent test command)
- Verify accessibility audit has passed if stage produced UI
- Block commit if any verification fails

**PreToolUse on `Bash` matching `git push*`:**
- Verify all stage commits are present
- Verify final D2R summary exists in repo
- Block push if any verification fails

**PostToolUse on `Write|Edit`:**
- Log every file write to the audit trail with timestamp, agent, stage, model, hash of content

**Stop / StopFailure:**
- Require ASAE summary table for the active stage to be in thread before allowing clean session end
- If missing, append warning to session end and log to audit trail

**UserPromptSubmit:**
- Inject current D2R plan state into Claude's context (active stage, depth tag, model assignment, ASAE gate status)

### Layer 2: Git Hooks (Platform-Level Enforcement)

Located in `.githooks/` in the repo root. Installed via `git config core.hooksPath .githooks` (typically auto-installed by the `prepare` script in `package.json`).

**`pre-commit`:**
- Run formatters (prettier, eslint, or language-appropriate) — refuse commit if violations
- Run type check — refuse commit on type errors
- Run test suite — refuse commit if any test fails or coverage drops below threshold
- Run accessibility audit (axe-core via Playwright, or equivalent) — refuse commit on WCAG 2.1 AA violations if stage produced UI
- Run ASAE log validator — refuse commit if the stage's ASAE artifacts are missing or malformed
- Run secret scanner — refuse commit on detected secrets

**`pre-push`:**
- Run full regression test suite — refuse push on any regression
- Run integration tests — refuse push on integration failure
- Run build — refuse push if build fails

### Layer 3: ASAE Gate (Invoked By Hooks, Executed By `/asae` Skill)

Stage boundaries invoke the `/asae` skill with a scope definition declaring:
- Target: the stage's output artifacts
- Sources: the stage's inputs (prior stage outputs, Stage 00 research findings, Testing Taxonomy categories applicable to this stage, prerequisite PRD/TRD/AVD/TQCD)
- Exit criteria: configured ASAE Certainty Threshold per stage (defaults: Stage 00 = 2, Stage 01a = 2, Stage 01b = 3, Stage 02 = 3, Stage 03+ = 3, Stage QA = 5)
- Severity policy: strict by default (any CRITICAL, HIGH, or MEDIUM finding resets the counter); standard policy permitted for non-regulated domains

The D2R skill does not describe ASAE internals. The `/asae` skill handles the gate. The D2R skill specifies when gates run, scope, and threshold.

### Layer 4: Meta-ASAE (Gates That Verify Prior Gates Fired)

Meta-ASAE is the defense-in-depth layer that verifies ASAE itself ran. Without meta-ASAE, a stage's ASAE gate can be silently skipped (e.g., Haiku claims the gate ran but didn't produce the log; a hook config error causes the gate to not fire; stochastic execution variance causes the gate to be bypassed).

Meta-ASAE operates at two levels:

**Hook-level meta-ASAE (automatic):**
- `PreToolUse` hook on `Bash` matching `git commit*`: checks for the current stage's ASAE log file at its expected path, with expected structure (status, timestamp, severity totals, log path), before allowing commit. Blocks commit if missing or malformed.
- Git `pre-commit` hook runs an ASAE log validator script: reads the most recent ASAE log for the current stage, verifies it parses as valid structured output, verifies status is PASS (not HALT — HALT means the gate didn't converge and the commit should not proceed without explicit escalation).

**Stage-level meta-ASAE (explicit sub-stage):**
- Every implementation stage (02, 03+, QA) has an explicit Stage NN-M sub-stage that runs between Stage NN-A (ASAE gate) and Stage NN-B (commit gate)
- Stage NN-M invokes `/asae` with:
  - domain: `document` (the ASAE log IS a document)
  - target: the Stage NN-A ASAE log file
  - sources: the Stage NN-A scope definition (target, sources, prompt, threshold, severity policy)
  - prompt: "Verify this ASAE log is well-formed, has PASS status, and its structure matches the declared scope"
  - asae_certainty_threshold: 2
  - severity_policy: strict
- Stage NN-M produces its own audit trail entry: "Meta-ASAE verified Stage NN-A produced valid gate output"

The two levels compose: hook-level meta-ASAE catches gate-was-skipped as a commit-blocker. Stage-level meta-ASAE catches gate-output-was-malformed as a stage-completion-blocker. Both fire before commit; both produce independent audit artifacts.

**What meta-ASAE does not do:** re-run the underlying ASAE gate. The underlying gate has already run and either produced a valid output or not. Meta-ASAE verifies the output exists and is well-formed; it does not re-audit the stage's content. Re-auditing is the gate's job, not the meta-gate's job.

### Hook Installation Verification

Every new repo initialized under D2R must ship with:
- `.claude/settings.json` containing the PreToolUse, PostToolUse, Stop, UserPromptSubmit hook configurations
- `.githooks/` containing `pre-commit` and `pre-push`
- `package.json` (or equivalent) `prepare` script that installs the git hooks path
- A hook verification test in CI that fails if any hook is missing or bypassed

Stage 00 research must confirm hook support for the target stack. Stage 01 must specify exact hook configurations in the plan output.

## Plan Structure

Every D2R plan follows this stage numbering:

| Stage | Purpose | Model |
|-------|---------|-------|
| Stage 00 | Five-track research. Exits through ASAE gate at threshold 2. | Opus |
| Stage 01a | Skeleton authorship — stage list with metadata. Exits through ASAE gate at threshold 2 + user approval gate. | Opus |
| Stage 01b | Full plan authorship — Deep / Medium / Shallow content per stage, exactly as required for the executing model to operate. Exits through ASAE gate at threshold 3. | Opus |
| Stage 02 | Project Scaffold — repo creation, README, LICENSE, configs, CI workflows, hook scripts, initial scaffolding, initial commit + push, Claude Code hook installation. Exits through ASAE gate at threshold 3 + commit gate. | Sonnet |
| Stage 03...NN | Feature implementation stages at Deep spec depth. Each exits through ASAE gate at threshold 3 + commit gate. | Haiku (default) |
| Stage QA | Convergence loop. Testing Taxonomy full applicable sweep + stress testing. Exits when ASAE Certainty Threshold of 5 consecutive clean cycles is reached. | Opus for judgment; Sonnet for remediation authoring; Haiku for rote fix transcription |

No stage may begin until the prior stage has passed its ASAE gate. No implementation stage (Stage 02+) may begin until Stage 01b has passed its ASAE gate. Stage 01a must pass its gate + user approval before Stage 01b begins. Stage QA cannot begin until all implementation stages have passed.

## Stage 00: Five-Track Research

Stage 00 exits with a Research Findings document that Stage 01 uses as its input. The research is scoped by the prerequisite PRD, TRD, and TQCD documents.

### Track 1: Tech Stack Research (Best-For-Use-Case, Not Familiar)

Research what stack is structurally best for the specific code task being planned. The selection criterion is fit-to-use-case, not "what the executing model knows best." Under Deep plan-specification, executing-model training coverage is not a binding constraint.

Research must cover:
- Frontend framework options evaluated on accessibility defaults, bundle size, reactivity model, ecosystem maturity (per task type)
- Backend / data processing options evaluated on computational fit, deployment complexity, security posture
- Visualization, parsing, storage, export, testing, deployment libraries specifically applicable
- Hook orchestration support (does this stack support the three-layer hook pattern cleanly?)

Output: ranked stack recommendation with rejected alternatives and honest reasons for rejection.

### Track 2: Applicable Standards

Research the enterprise standards and regulatory requirements that apply to this specific code task. Not aspirational — binding.

For any application type:
- ISO/IEC 25010:2023 (product quality model) — which sub-characteristics apply
- CERT secure coding standards for the implementation language
- CWE Top 25 (current year) vulnerabilities applicable to this task

For UI applications:
- WCAG 2.1 AA (or AAA where applicable) — hardwired, confirm no additional standard applies

For web applications:
- OWASP Top 10 Web Application Security Risks (current version)
- OWASP LLM Top 10 if any LLM integration exists

For regulated domains:
- EU AI Act if AI output affects high-risk decisions
- Applicable state laws (Colorado SB 24-205 etc.) if US AI deployment
- FDA, FINRA, HIPAA, FERPA, GDPR per domain

Output: list of applicable standards with specific measurable exit criteria per standard.

### Track 3: Applicable Benchmarks

Research existing industry benchmarks that should be referenced or met. Benchmarks differ from standards — standards are binding requirements, benchmarks are measured comparisons.

Examples:
- Performance benchmarks (Core Web Vitals, Lighthouse, framework-specific)
- Security benchmarks (CIS Benchmarks, STIG)
- Code quality benchmarks (TIOBE Quality Indicator, Maintainability Index thresholds)
- Domain-specific benchmarks (SWE-bench for code generation, MMLU for reasoning, etc.)

Output: list of applicable benchmarks with target scores and rationale.

### Track 4: Language-Depth-Of-Spec Research

Research whether the planning model (typically Opus) can produce Deep-level specifications for the chosen stack. This is a first-class research track specific to the D2R methodology.

Evaluate:
- For each stage's language/framework, can Opus produce a spec at Deep level (exact library versions, API signatures, error types, return types, iteration idioms)?
- Where Deep-level spec is producible, document the exact library-version-pinned API references available
- Where Deep-level spec is not producible (exotic languages, unstable libraries, undocumented internals), flag explicitly — those stages may need to run at Medium depth with Sonnet as executor, or may need to shift to better-documented stack components

Output: per-stage depth feasibility assessment. If any stage requires Deep depth but the planning model cannot produce it, Stage 01 must either shift the stack choice or escalate the executing model.

### Track 5: Skill / Plugin Ecosystem Fit

Research the installed skill and plugin ecosystem for execution support of this specific build. Skills and plugins deepen the effective spec for executing models — a skill that specifies "use this exact pattern for Svelte 5 runes" eliminates a class of decisions the executing model would otherwise make.

Evaluate:
- Which installed skills are directly relevant to this build (list by name with rationale)
- Which installed plugins are directly relevant (list by name with rationale)
- Which installed MCP servers are directly relevant
- Which skills/plugins would help if installed but are not yet (gap analysis)
- Which installed skills/plugins might CONFLICT or confuse execution (e.g., contradictory guidance for the same task)
- Recommend install-before-Stage-02 additions (if any)
- Recommend skills/plugins to DISABLE during this build to prevent conflicts (if any)

This track affects Stage 01 planning by adjusting the effective plan-specification-depth required:
- Where a relevant skill exists, the plan can rely on it and reduce depth at that stage
- Where a gap exists, Stage 01 must produce deeper spec to compensate
- Where a conflict risk exists, Stage 01 must explicitly disable or isolate the conflicting component

Output: skill/plugin inventory with per-item relevance assessment, gap analysis, and recommended ecosystem configuration for this build.

This track also serves experimental transferability: documenting the exact skill/plugin loadout means the experiment can control for ecosystem as a variable. A D2R plan produced by Opus against PRD/TRD/TQCD + ecosystem X may differ from the same inputs against ecosystem Y — that delta is measurable only if Track 5 documents the ecosystem per run.

### Stage 00 Exit

Stage 00 research findings exit through the ASAE gate at threshold 2 (research rigor gate). The gate audits:
- All five tracks complete
- Claims in research findings traced to sources
- Standards and benchmarks actually applicable (not kitchen-sink listed)
- Depth-of-spec assessment honest about what the planning model can and cannot spec Deep for this stack
- Ecosystem inventory complete with gaps and conflicts flagged

On pass: proceed to Stage 01a. On fail: remediate research and re-run gate.

## Stage 01a: Skeleton Authorship (Opus)

Stage 01a produces the plan skeleton — the stage list with metadata required for user approval BEFORE Opus is invested in writing the full plan content. This gate catches scope errors early, before expensive full-plan-content authorship.

### Authorship Protocol

**Step 1: Define Excellent End State**

Describe, in concrete operational terms, what excellent looks like for the final output of this coding task. Include:
- Functional capability at excellence (not at MVP)
- Non-functional properties at excellence (performance, security, accessibility, reliability, maintainability)
- Specific exit criteria tied to Stage 00 standards and benchmarks + the prerequisite TQCD

This is not aspirational. It is the measurable target the plan backwards-plans from.

**Step 2: Design QA First (From Testing Taxonomy)**

Before designing any implementation stages, design the QA that verifies the excellent end state. This step primarily references the prerequisite TQCD which already declared Testing Taxonomy applicability per category — Stage 01a cross-checks that the TQCD's declarations align with Stage 00's research findings and surfaces any discrepancies.

Reference: `.claude/skills/dare-to-rise-code-plan/references/Software_Testing_Taxonomy_2026-04-17_v01_I.md` and the prerequisite TQCD instance.

Output: QA specification that defines Stage QA's exit criteria in advance of any implementation.

**Step 3: Backwards-Plan Implementation Stages (Skeleton-Level)**

With the excellent end state defined and the QA criteria specified, backwards-plan the implementation stages required to produce the end state that passes the QA.

For each stage, specify AT METADATA LEVEL ONLY:
- Stage name and one-line purpose
- Inputs (from which prior stages or from Stage 00 research)
- Outputs (specific artifacts — file paths, deliverables)
- Model assignment (Opus / Sonnet / Haiku) with justification
- Effort level (low / medium / high)
- Spec depth (Shallow / Medium / Deep) with justification
- ASAE gate scope summary and Certainty Threshold
- Commit gate hook configuration summary
- Accessibility exit criteria summary (if UI stage)
- Test coverage exit criteria summary (if code stage)
- Parallelization: which stages can run concurrently and which have hard dependencies

Stage 02 is ALWAYS Project Scaffold, executed by Sonnet. Stage 03+ are feature implementation stages, executed by Haiku at Deep spec depth (unless Stage 01a justifies a different model with explicit rationale tied to Stage 00 Track 4 depth-feasibility findings).

**Step 4: Specify Hook Configurations (Summary Level)**

Stage 01a names the hook configurations to install in Stage 02. Exact hook contents are authored in Stage 01b.

**Step 5: Present Plan Skeleton For Approval**

Present the skeleton to the user in table form. Wait for explicit approval before Stage 01b begins. Do not begin full plan authorship without approval.

### Stage 01a Exit

Stage 01a skeleton exits through the ASAE gate at threshold 2 (rapid-iteration gate), then the user approval gate. The ASAE gate audits:
- All stages traceable to Stage 00 research findings + prerequisite TRD
- QA designed from Testing Taxonomy + prerequisite TQCD
- Model + depth + ASAE threshold assigned per stage with justification
- Stage 02 is present and assigned to Sonnet
- Stage 03+ exist and default to Haiku unless justified otherwise
- No stage missing skeleton-level metadata

On ASAE pass: present skeleton for user approval. On user `✓`: proceed to Stage 01b. On ASAE fail or user redirect: remediate and re-run.

## Stage 01b: Full Plan Authorship (Opus)

Stage 01b is the stage that produces the actual executable D2R plan — the artifact Stage 02+ reads and operates against. Without Stage 01b, Haiku has no Deep-spec content to transcribe from. The skeleton alone is not executable.

### Authorship Protocol

For each stage in the approved skeleton, write the full plan content at the stage's declared depth. Depth-specific requirements:

#### Deep-Depth Stages (default for Haiku executors)

Stage 01b content for every Deep stage must include:

**File operations:**
- Exact file path(s) to create or modify (absolute paths within the repo)
- Exact file content structure (what goes at top vs bottom; section organization)

**Code specification:**
- Exact import statements with pinned library versions (e.g., `import { z } from 'zod@3.22.4'`)
- Exact function signatures with parameter types and return types
- Exact class / interface / type definitions
- Exact error types and their shape
- Exact error handling patterns (e.g., `Result<T, PlanParseError>`)
- Exact constants and configuration values

**Test specification:**
- Exact test case list with: test name, inputs, expected outputs, assertion patterns
- Exact test file paths
- Exact test framework patterns (Vitest `describe`/`it`/`expect` syntax)
- Exact property-based test invariants (for fast-check)

**Step operations:**
- Step-by-step enumeration of operations the executor performs
- Exact commands to run (not "run tests" — `npm test -- --coverage`)
- Exact sequence with ordering

**Validation criteria per step:**
- What output indicates the step succeeded
- What output indicates failure and what failure mode it represents

At Deep depth, Haiku is not making any language-level decisions. It is transcribing the plan into code. The plan-specification-depth hypothesis (that Haiku's training-data coverage ceases to gate execution quality at sufficient spec depth) can only be tested if Stage 01b actually produces Deep content.

#### Medium-Depth Stages (for Sonnet executors)

Stage 01b content for every Medium stage must include:

- Library selection with version constraints
- API usage pattern at high level (not exact idiomatic code)
- Error handling pattern (approach, not exact types)
- Type expectations
- Test requirements (what to test, not exact assertions)
- Exit criteria specific enough that completion is verifiable

Sonnet is making mid-level decisions at Medium depth (idiomatic patterns, specific error types, exact type names within declared type families) but the plan has constrained the space of choices.

#### Shallow-Depth Stages (rare; for Opus executors, or when Stage 00 Track 4 research determined Deep spec is infeasible)

Stage 01b content for every Shallow stage must include:

- Goal statement
- Exit criteria
- Reference to Stage 00 research that explains why deeper spec was not producible
- Acknowledgment that the executor is making significant decisions

Shallow depth is a flag that the D2R plan is less deterministic at this stage and downstream quality depends more on the executor's training. Should be rare; every Shallow-depth stage requires explicit justification.

#### Hook Configurations (Full Detail)

Stage 01b produces the exact hook scripts that Stage 02 installs:

- `.claude/settings.json` with complete PreToolUse / PostToolUse / Stop / UserPromptSubmit entries — exact JSON
- `.githooks/pre-commit` as complete executable script — exact shell content
- `.githooks/pre-push` as complete executable script — exact shell content
- Hook verification CI job as complete YAML — exact GitHub Actions workflow content

#### README And LICENSE Content Decisions

Stage 01b specifies (Opus-decided) the CONTENT the README and LICENSE should communicate. Sonnet's Stage 02 work drafts the prose from these decisions.

README content decisions include:
- Title, tagline, one-paragraph overview
- Key features (what to highlight)
- Installation / setup instructions outline
- Usage examples outline (what examples to show)
- Contributing / community section approach
- License declaration pointing to LICENSE file
- Acknowledgments / credits

LICENSE content decision: exact license selection with rationale (e.g., "MIT for permissive open source with Martinez Methods attribution clause in the NOTICE file").

### Stage 01b Output

The Stage 01b output is a single document (or structured set of documents) containing:
- Excellent end state definition
- QA specification (per Stage 01a Step 2)
- Full stage-by-stage content at declared depth
- Full hook configurations
- README and LICENSE content decisions
- Cross-references to PRD / TRD / TQCD / Stage 00 research findings throughout

Filename convention: `[ProjectPrefix]_D2R_Plan_[YYYY-MM-DD]_v01_I.md`, saved to the project's `docs/planning/` directory.

### Stage 01b Exit

Stage 01b output exits through the ASAE gate at threshold 3 (plan-content gate). The gate audits:
- Every Deep stage has all Deep-depth requirements present
- Every Medium stage has all Medium-depth requirements present
- Every Shallow stage has explicit justification for Shallow depth
- Hook configurations are complete and installable
- README/LICENSE content decisions are specified (not deferred)
- Traceability from plan content back to PRD / TRD / TQCD / Stage 00 research
- No stage has placeholder text ("TBD", "TODO", "fill in later")

On pass: proceed to Stage 02. On fail: remediate plan content and re-run gate.

## Stage 02: Project Scaffold (Sonnet)

Stage 02 is always Project Scaffold. Executed by Sonnet. This stage creates the working project environment that Stage 03+ Haiku implementation runs within.

### Scope

**Repo setup:**
- Create repo on GitHub if it doesn't exist (visibility per Stage 01b decisions; description per Stage 01b)
- Initialize local repo
- Configure remote
- Set up initial branch structure

**Documentation artifacts (drafted by Sonnet per Stage 01b content decisions):**
- README.md (Sonnet authors prose from Opus's content decisions)
- LICENSE (Sonnet authors per Opus's license selection)
- .gitignore (per applicable language/framework patterns; may be largely template-driven)
- Initial CLAUDE.md pointing to the D2R plan and project documentation

**Configuration artifacts (per Stage 01b specifications):**
- package.json or equivalent (exact dependencies per Stage 01b)
- tsconfig.json or equivalent (exact settings per Stage 01b)
- eslint.config.js or equivalent (exact rules per Stage 01b)
- prettier.config.js or equivalent
- Framework-specific configs (svelte.config.js, vite.config.ts, tailwind.config.js, etc. per Stage 01b)
- Test framework configs (vitest.config.ts, playwright.config.ts, etc.)

**Hook installation:**
- `.claude/settings.json` with hook configurations from Stage 01b
- `.githooks/pre-commit` script from Stage 01b
- `.githooks/pre-push` script from Stage 01b
- `prepare` script in package.json that installs the git hooks path

**CI/CD setup:**
- `.github/workflows/` with CI workflow from Stage 01b
- Verify workflow on initial commit

**Initial directory structure:**
- Create folders per Stage 01b's scaffolding spec
- Placeholder README.md in each empty folder explaining intended contents

**Initial commit + push:**
- Stage all scaffold files
- Commit with descriptive message per Stage 01b's content decisions
- Push to main (or default branch per Stage 01b)
- Verify CI runs and passes on initial commit

### Stage 02 Exit

Stage 02 exits through the ASAE gate at threshold 3 (scaffold completeness gate). The gate audits:
- Repo created and remote configured
- README, LICENSE, .gitignore, CLAUDE.md present and aligned with Stage 01b content decisions
- All configuration files per Stage 01b specifications
- Hook scripts installed and executable
- CI workflow runs and passes on initial commit
- Directory scaffolding matches Stage 01b
- Initial commit pushed successfully

Then commit gate: pre-commit hook runs on its own scaffold commit as the first self-test of the hook system.

On pass: proceed to Stage 03+. On fail: remediate scaffold and re-run gate. Common failures: missing dependencies, CI workflow errors, hook script syntax errors, permission issues on hook installation.

## Stage 03 through Stage NN: Feature Implementation (Haiku by default)

Each feature implementation stage executes per its Stage 01b full specification. Exit gates run at threshold configured in Stage 01a/01b (default 3 for implementation stages).

### Sub-Stage Structure Per Implementation Stage

**Stage NN: Execute** — Haiku transcribes Stage 01b content into code per exact spec

**Stage NN-A: ASAE gate** — invoke `/asae` with scope defined in Stage 01b. Gate runs until threshold is met. Returns structured result (status, counter, severity totals, log path).

**Stage NN-M: Meta-ASAE gate** — verify the Stage NN-A gate produced valid output. Invoke `/asae` at `domain: document`, target = the Stage NN-A ASAE log file, threshold 2, strict policy. Returns PASS only if the Stage NN-A log exists, parses correctly, has status PASS (not HALT), and matches the declared scope. Produces its own audit trail entry.

**Stage NN-B: Commit gate** — invoke git commit. Hook-level meta-ASAE fires automatically (PreToolUse on `git commit*` verifies Stage NN-A log exists in context; git pre-commit runs ASAE log validator). Pre-commit hook also runs format, lint, type check, tests, a11y (if UI), secret scan. Commit succeeds only if all checks pass.

**Stage NN-C: Audit trail entry** — PostToolUse hook logs stage completion with model used, artifacts produced, Stage NN-A gate result, Stage NN-M meta-gate result, commit hash, timestamps.

The NN-M sub-stage is not redundant with the hook-level meta-ASAE. NN-M runs before the commit is attempted and produces its own audit artifact; hook-level meta-ASAE runs at commit time. Defense-in-depth: either catching a missing or malformed gate output is sufficient to block commit; both running together produces belt-and-suspenders enforcement.

### Failure Handling

If ASAE gate fails after remediation iterations exceeding a reasonable bound (default 10 iterations), halt and escalate. Do not force-merge.

If commit gate fails, ASAE must re-run against the failure reason. The failure is a signal that either the implementation is incomplete or the QA criteria are wrong — both require governance.

If pre-push gate fails, push does not proceed. Do not bypass `--no-verify` without explicit session-logged justification that the user accepts responsibility.

## Stage QA: Convergence Loop

Terminal stage. Runs after all implementation stages pass their own gates.

### Structure

Stage QA executes the QA specification defined in Stage 01 Step 2 against the complete implementation.

Each QA cycle has three phases:

**Phase 1: Applicable Test Sweep** — execute every test category from Testing Taxonomy Part 1 that Stage 01 marked applicable. Collect results.

**Phase 2: Applicable Stress Sweep** — execute every stress category from Testing Taxonomy Part 2 that Stage 01 marked applicable, using the selection strategy from Part 3. Collect results.

**Phase 3: Remediation** — fix every issue found. Re-run sweeps.

### Exit

Stage QA exits when the ASAE Certainty Threshold of 5 consecutive QA cycles with zero new issues is reached.

This is the highest threshold in the plan because this is the final convergence before the artifact is considered complete.

### Stage QA Commit Gate

On exit, commit with the final D2R summary as the commit message:
- Total stages executed
- Total ASAE gate iterations across all stages
- Total issues found and remediated in Stage QA
- Standards verified with exit criteria met
- Benchmarks achieved with scores
- Testing Taxonomy categories executed (and skipped with justifications)

## Execution Protocol

1. **Receive coding task.** Any task triggering this skill.

2. **Verify prerequisite inputs exist and are approved.** PRD, TRD, TQCD instances must be present and approved. If any is missing, pause and author the missing document(s) using the templates in `references/` before proceeding.

3. **Execute Stage 00 (Opus).** Five-track research. Exit through ASAE gate at threshold 2.

4. **Execute Stage 01a (Opus).** Author plan skeleton — stage list with metadata only. Exit through ASAE gate at threshold 2.

5. **Present plan skeleton for user approval.** Wait for explicit `✓` before proceeding to Stage 01b. Do not begin full plan authorship without approval.

6. **Execute Stage 01b (Opus).** Author full plan content per approved skeleton at declared depth per stage. Includes exact file operations, code specs, test specs, step operations, hook configurations, README/LICENSE content decisions. Exit through ASAE gate at threshold 3.

7. **Execute Stage 02 (Sonnet): Project Scaffold.** Create repo, author README / LICENSE / configs / CI / hooks from Stage 01b specifications, initial commit and push. Exit through ASAE gate at threshold 3 + commit gate.

8. **Execute Stage 03+ feature implementation in order (Haiku by default, or parallel where Stage 01b permits).** Each stage passes ASAE gate + commit gate + audit trail entry.

9. **Execute Stage QA.** Convergence loop until 5 consecutive null cycles across applicable Testing Taxonomy categories.

10. **Final commit with D2R summary.** Push through pre-push hook.

11. **Present final summary to user.** Table of stages, gate iterations, standards verified, benchmarks achieved.

## Anti-Patterns

- Treating accessibility as a feature stage. It is a condition of correctness on every UI stage.
- Treating test coverage as a later concern. Tests are authored alongside implementation or before it.
- Shallow plan-specification depth without justification. Default to Deep when Haiku executes.
- Skipping Stage 00 research. Every plan begins with research.
- Skipping Stage 01 ASAE gate. The plan itself is the most upstream artifact; it requires the tightest gate.
- Skipping hook installation before Stage 02. Ungated execution is forbidden.
- Forward-planning from current capacity. Backwards-plan from excellence.
- Using Haiku for reasoning or QA judgment. Model assignment is hook-enforced.
- Committing without ASAE log. Pre-commit hook refuses.
- Describing ASAE mechanics in the plan. Plan specifies when gates run, not how they work.
- Listing test categories without applying the Testing Taxonomy selection rule. Each category must be evaluated for applicability with documented reasoning.

## Related Skills

- `/write-prd` — Authors a PRD instance. Invoked before D2R if PRD prerequisite missing.
- `/write-trd` — Authors a TRD instance. Invoked before D2R if TRD prerequisite missing.
- `/write-avd` — Authors an AVD instance. Invoked before D2R if AVD prerequisite missing.
- `/write-tqcd` — Authors a TQCD instance. Invoked before D2R if TQCD prerequisite missing.
- `/asae` — Invoked at every stage exit for the primary gate, and at every Stage NN-M for the meta-gate. This skill does not describe ASAE mechanics; the `/asae` skill does.
- `/file-versioning` — For document outputs produced by the plan.
- `/file-presentation` — For presenting generated files to the user.
- `/walk-me-through` — For walking the user through research findings or results.

## Related References

- `references/PRD_Template_2026-04-17_v01_I.md` — Product Requirements Document template. Prerequisite input to D2R. Filled-in instance must exist and be approved before Stage 00. Authored via `/write-prd`.
- `references/TRD_Template_2026-04-17_v01_I.md` — Technical Requirements Document template. Prerequisite input. Authored via `/write-trd`.
- `references/AVD_Template_2026-04-17_v01_I.md` — Architecture Vision Document template. Prerequisite input. Authored via `/write-avd` (or skipped with justification for trivially simple projects).
- `references/TQCD_Template_2026-04-17_v01_I.md` — Testing & Quality Criteria Document template. Prerequisite input. Authored via `/write-tqcd`. Stage 01 QA-first design reads from the TQCD instance.
- `references/Software_Testing_Taxonomy_2026-04-17_v01_I.md` — 20 test categories, 39 stress test categories, AI-driven test selection strategy. Used in TQCD authorship to declare applicability per category, in Stage 01 Step 2 for QA design, and in Stage QA for the applicable sweep.

## Related Rules

- `git-commit-scope` — Only commit files authored in the current session
- `github-discipline` — Push after every commit with descriptive messages
- `file-naming-and-versioning` — Versioning for all document outputs
- `no-silent-execution` — Every phase produces at minimum a short in-thread confirmation
- `ip-language-discipline` — Branded terminology only; methodology not exposed in skill files
