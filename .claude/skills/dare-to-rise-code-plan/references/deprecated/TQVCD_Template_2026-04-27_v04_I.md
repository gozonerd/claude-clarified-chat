---
name: Test Quality + Verification Coverage Document — Template
description: Reusable template for authoring a TQVCD (Test Quality + Verification Coverage Document) as a prerequisite input to /dare-to-rise-code-plan. Defines what success looks like verification-wise — the verification-coverage headline metric (behaviors-verified / behaviors-claimed), applicable Testing Taxonomy categories with exit criteria, applicable standards operationalized as exit criteria, applicable benchmarks with target scores, coverage floors (internal CI metric only — NOT user-facing), accessibility criteria, performance budgets, two-state traceability tables linking FRs to test paths, and the headline-metric ban list for user-facing copy.
type: template
skill: dare-to-rise-code-plan
version: v04_I
date: 2026-04-27
methodology_version: 0.3.0
supersedes: TQCD_Template_2026-04-26_v03_I.md (moved to references/deprecated/ on 2026-04-27 per TQCD→TQVCD rename)
rename_lineage: TQCD (Testing & Quality Criteria Document) → TQVCD (Test Quality + Verification Coverage Document) per Methodology Mods Batch 1 Mod 6.5 lock-in (option (a) full rename + cascade). Krystal's 2026-04-27 explicit rationale: branded-term discipline pattern — every prior substantive change has had a name change to match (FIXES not solution; DRR not recovery; D2R 5-doc not 4-doc; Martinez Methods not Stahl Systems). Keeping TQCD name was keeping the *Test Quality + Coverage Document* doctrine alive — and "coverage" is precisely the measure-what's-easy-to-measure framing the verification-coverage principle rejects. Half-rename creates two-name confusion across history; full commitment is the discipline.
---

# Test Quality + Verification Coverage Document — Template

## How To Use This Template

Copy this file. Rename to `[ProjectPrefix]_TQVCD_[YYYY-MM-DD]_v01_I.md`. Fill in every required section. Mark optional sections as NA if not applicable with a one-line reason.

The TQVCD is downstream of the PRD (what the product IS) and TRD (what it MUST DO), and upstream of the D2R code plan. The TQVCD defines EXIT CRITERIA — what quality looks like, measurably, in a form the plan can be backwards-planned from. The TQVCD's load-bearing headline metric is **behaviors-verified / behaviors-claimed** (§5.0), not coverage % or test counts (which are reporting artifacts visible to operators and explicitly NOT user-facing claims of methodology compliance per the Verification-Coverage Principle in `/asae SKILL.md` Section 0).

The D2R code plan Stage 01 uses the TQVCD to design Stage QA BEFORE designing any implementation stages. This is the operationalization of backwards-planning-from-excellence.

Required sections must be completed before `/dare-to-rise-code-plan` Stage 00 can run. An incomplete TQVCD means Stage 01 cannot QA-first-backwards-plan.

### Heading-Prefix IDs

Per `references/Heading_Prefix_ID_Grammar_2026-04-26_v01_I.md`, every load-bearing item appears as a heading with a strict ID prefix. TQVCD uses these TYPE prefixes:

- **TC** — Test Category applied (§2.1, §2.2)
- **EC** — Exit Criterion (§3, §6.4, §10)
- **BG** — Budget/Gate (§7, §8)
- **AT** — ASAE Threshold (§9.2)
- **CC** — Coverage Criterion (§5)

Example: `### TQVCD-TC-04: End-to-End Tests`. Cross-doc references use the fully-qualified form: `references TQVCD-EC-12 + TRD-NFR-3.1-02`.

### Authorship Parallelization Markers

Section header markers indicate dependency for team-scaled authorship.

---

## 1. Document Identity `[requires PRD §1, TRD §1]`

### 1.1 Project Name And Version

*State the project name (matching the PRD/TRD). State the version this TQVCD applies to.*

### 1.2 PRD And TRD References

*Cite the PRD and TRD this TQVCD is downstream of.*

### 1.3 Revision History

*Track revisions with version, date, changes, reviewer.*

---

## 2. Testing Taxonomy Applicability `[requires TRD §2, §3]`

The D2R skill's reference file at `.claude/skills/dare-to-rise-code-plan/references/Software_Testing_Taxonomy_2026-04-17_v01_I.md` documents 20 test categories (Part 1) and 39 stress test categories (Part 2) with an AI-driven selection strategy (Part 3).

For every category in the Taxonomy, this section declares applicability: YES (with exit criteria) or NO (with reason). Each declared category gets a heading with `### TQVCD-TC-NN: ...` ID format.

### 2.1 Test Categories (Part 1, 20 Categories)

For each category, declare: applies (yes/no), exit criteria if yes, reason for skipping if no.

**Unit Tests** — `### TQVCD-TC-01`
- Applies: [yes/no]
- Exit criteria if yes: [coverage threshold, specific testing patterns expected]
- Skip reason if no:

**Integration Tests** — `### TQVCD-TC-02`
- Applies: [yes/no]
- Exit criteria if yes:
- Skip reason if no:

**Component / Module Tests** — `### TQVCD-TC-03`
- Applies: [yes/no]
- Exit criteria if yes:
- Skip reason if no:

**End-to-End (E2E) Tests** — `### TQVCD-TC-04`
- Applies: [yes/no]
- Exit criteria if yes:
- Skip reason if no:

**Functional Tests** — `### TQVCD-TC-05`
- Applies: [yes/no]
- Exit criteria if yes:
- Skip reason if no:

**Regression Tests** — `### TQVCD-TC-06`
- Applies: [yes/no]
- Exit criteria if yes:
- Skip reason if no:

**Smoke Tests** — `### TQVCD-TC-07`
- Applies: [yes/no]
- Exit criteria if yes:
- Skip reason if no:

**Sanity Tests** — `### TQVCD-TC-08`
- Applies: [yes/no]
- Exit criteria if yes:
- Skip reason if no:

**Acceptance Tests (UAT)** — `### TQVCD-TC-09`
- Applies: [yes/no]
- Exit criteria if yes:
- Skip reason if no:

**Contract Tests (API-level)** — `### TQVCD-TC-10`
- Applies: [yes/no]
- Exit criteria if yes:
- Skip reason if no:

**Performance Tests** — `### TQVCD-TC-11`
- Applies: [yes/no]
- Exit criteria if yes: [specific p50/p95/p99 targets from TRD]
- Skip reason if no:

**Security Tests** — `### TQVCD-TC-12`
- Applies: [yes/no]
- Exit criteria if yes: [specific standards from TRD §3.3]
- Skip reason if no:

**Usability Tests** — `### TQVCD-TC-13`
- Applies: [yes/no]
- Exit criteria if yes:
- Skip reason if no:

**Accessibility Tests** — `### TQVCD-TC-14`
- Applies: [yes — always for UI, hardwired]
- Exit criteria: [WCAG 2.1 AA minimum; specific AAA items if required; automated tool results + manual testing protocol from TRD §3.5]
- Skip reason: [only valid if product has no UI at all]

**Snapshot / Visual Regression Tests** — `### TQVCD-TC-15`
- Applies: [yes/no]
- Exit criteria if yes:
- Skip reason if no:

**Property-Based / Fuzz Tests** — `### TQVCD-TC-16`
- Applies: [yes/no]
- Exit criteria if yes: [specific invariants the property tests enforce]
- Skip reason if no:

**Mutation Testing** — `### TQVCD-TC-17`
- Applies: [yes/no]
- Exit criteria if yes: [mutation score threshold]
- Skip reason if no:

**CI/CD Pipeline Tests** — `### TQVCD-TC-18`
- Applies: [yes — always if the project uses git]
- Exit criteria: [jobs run on every PR, merge protection, required statuses]
- Skip reason: [only valid if the project has no CI]

**Canary / A/B Testing (in production)** — `### TQVCD-TC-19`
- Applies: [yes/no]
- Exit criteria if yes:
- Skip reason if no: [typically MVP has single deploy target; skip with this reason]

**Monitoring / Observability (post-deploy)** — `### TQVCD-TC-20`
- Applies: [yes/no]
- Exit criteria if yes: [metrics captured, dashboards, alerts — typically tied to TRD §3.8]
- Skip reason if no: [typically MVP without production operation]

> **Stop & Verify before continuing past §2.1.** Confirm:
> - All 20 categories have explicit YES or NO declarations
> - Every YES has specific exit criteria (not just "good test coverage")
> - Every NO has specific skip reason

### 2.2 Stress Test Categories (Part 2, 39 Categories)

For stress tests, apply the AI-driven selection strategy from Part 3 of the Testing Taxonomy:

For each stress category:
- Does this system have the component this test targets?
- Is failure in this component high-severity for this use case?
- Is this failure mode plausible given actual usage patterns?

If yes to all three: include with target scenario. If no to any: skip with justification.

**Shortened per-category format:**

| # | Category | ID | Applies | Scenario (if yes) / Skip Reason (if no) |
|---|----------|-----|---------|----------------------------------------|
| 1 | Classic Stress Test | TQVCD-TC-S01 | | |
| 2 | Spike Testing | TQVCD-TC-S02 | | |
| 3 | Breakpoint Testing | TQVCD-TC-S03 | | |
| 4 | Soak (Endurance) Testing | TQVCD-TC-S04 | | |
| 5 | Volume Testing | TQVCD-TC-S05 | | |
| 6 | Scalability Testing | TQVCD-TC-S06 | | |
| 7 | Capacity Testing | TQVCD-TC-S07 | | |
| 8 | CPU Stress Testing | TQVCD-TC-S08 | | |
| 9 | Memory Stress Testing | TQVCD-TC-S09 | | |
| 10 | Disk I/O Stress Testing | TQVCD-TC-S10 | | |
| 11 | Network Bandwidth Stress | TQVCD-TC-S11 | | |
| 12 | File Descriptor / Handle Exhaustion | TQVCD-TC-S12 | | |
| 13 | Service Dependency Failure | TQVCD-TC-S13 | | |
| 14 | Cascading Failure Simulation | TQVCD-TC-S14 | | |
| 15 | Partition Testing (Network Splits) | TQVCD-TC-S15 | | |
| 16 | Retry Storm Testing | TQVCD-TC-S16 | | |
| 17 | Queue Backlog Stress | TQVCD-TC-S17 | | |
| 18 | Chaos Engineering Tests | TQVCD-TC-S18 | | |
| 19 | Fault Injection Testing | TQVCD-TC-S19 | | |
| 20 | Latency Injection | TQVCD-TC-S20 | | |
| 21 | Resource Throttling | TQVCD-TC-S21 | | |
| 22 | Database Contention Testing | TQVCD-TC-S22 | | |
| 23 | Cache Stress Testing | TQVCD-TC-S23 | | |
| 24 | Data Corruption Simulation | TQVCD-TC-S24 | | |
| 25 | Large Payload Testing | TQVCD-TC-S25 | | |
| 26 | Concurrent User Stress | TQVCD-TC-S26 | | |
| 27 | Peak Traffic Pattern Simulation | TQVCD-TC-S27 | | |
| 28 | Abusive / Edge Behavior Testing | TQVCD-TC-S28 | | |
| 29 | DDoS Simulation | TQVCD-TC-S29 | | |
| 30 | Authentication Flood Testing | TQVCD-TC-S30 | | |
| 31 | UI Stress Testing | TQVCD-TC-S31 | | |
| 32 | Device Resource Stress | TQVCD-TC-S32 | | |
| 33 | Auto-Scaling Stress | TQVCD-TC-S33 | | |
| 34 | Cold Start Stress (serverless) | TQVCD-TC-S34 | | |
| 35 | Deployment Stress | TQVCD-TC-S35 | | |
| 36 | Configuration Stress | TQVCD-TC-S36 | | |
| 37 | Mixed Workload Testing | TQVCD-TC-S37 | | |
| 38 | Game Day / Fire Drill Testing | TQVCD-TC-S38 | | |
| 39 | Recovery Testing (under stress) | TQVCD-TC-S39 | | |

> **Stop & Verify before continuing past §2.2.** Confirm:
> - For every stress category declared YES, every affected user-facing surface in UXD §3.2 has a Catastrophic state declared (reliability ↔ design-polish chain)
> - Stress categories declared YES align with TRD §3.2 reliability patterns

---

## 3. Standards Operationalized As Exit Criteria `[requires TRD §3.3, §3.4, §3.5]`

From the TRD's applicable standards (§3.3 Security, §3.4 Privacy, §3.5 Accessibility, applicable regulations), operationalize each standard as measurable exit criteria.

### 3.1 Per-Standard Exit Criteria

*For each standard referenced in the TRD, author one heading per exit criterion (e.g., `### TQVCD-EC-01: WCAG 2.1 AA — 1.1.1 Non-text Content`). Required fields:*
- *Applicable requirements (specific section or rule numbers)*
- *Measurable exit criterion*
- *Verification method (automated test, manual audit, third-party certification, etc.)*
- *Pass threshold*

*Example for WCAG 2.1 AA:*
- *`### TQVCD-EC-01: WCAG 1.1.1 Non-text Content` — all images have alt text or aria-label. Verified by axe-core. Pass: zero violations.*
- *`### TQVCD-EC-02: WCAG 1.4.3 Contrast (Minimum)` — all text meets 4.5:1 (3:1 for large text). Verified by axe-core + manual spot check. Pass: zero violations at AA level.*

> **Stop & Verify before continuing past §3.1.** Confirm:
> - Every TRD-declared standard has at least one TQVCD-EC entry
> - Every TQVCD-EC has Verification method + Pass threshold (not "tested manually")

### 3.2 Regulatory Compliance Exit Criteria

*For each regulation applicable per TRD §3.4 (and Track 13 / Track 20), specific exit criteria that demonstrate compliance. Author as `### TQVCD-EC-Reg-NN: ...` headings.*

### 3.3 Data Lifecycle & Privacy Exit Criteria (Track 13)

*Operationalizes TRD §3.4 Privacy Requirements as testable exit criteria.*

*Required fields:*
- *Data minimization verification (every collected field has documented purpose; orphan-field scan passes)*
- *Retention policy enforcement test (records past retention deleted or anonymized — verified by job + test)*
- *Subject access request (SAR) workflow tested end-to-end against TRD-declared SLA*
- *Right-to-deletion tested (data actually removed from primary + replicas + backups within policy window)*
- *Right-to-portability tested (export format machine-readable, complete, schema-documented)*
- *Cross-border transfer controls verified (data residency boundaries enforced in code, not just policy)*
- *PII redaction in logs verified (sample log scan passes redaction lint)*
- *Audit trail integrity for data access (tamper-evident, complete coverage of regulated data classes)*

---

## 4. Benchmarks With Target Scores `[requires TRD §3]`

### 4.1 Performance Benchmarks

*Author as `### TQVCD-BG-NN: ...` headings. Required:*
- *Benchmark name*
- *Target score*
- *Measurement tool*
- *Measurement methodology*

*Examples:*
- *Lighthouse Performance score ≥ 90*
- *Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1*
- *Bundle size < 200KB gzipped*

### 4.2 Code Quality Benchmarks

*Examples:*
- *TIOBE Quality Indicator score ≥ 80*
- *Maintainability Index ≥ 85*
- *Cyclomatic complexity median < 10, 95th percentile < 15*

### 4.3 Domain-Specific Benchmarks (If Applicable)

*For AI/ML products: SWE-bench, HumanEval, MMLU, etc. For data products: statistical accuracy benchmarks. For developer tools: adoption / satisfaction proxies.*

---

## 5. Verification Coverage + Coverage Floors `[requires TRD §2, PRD §4]`

### 5.0 Verification Coverage Headline Metric

**This is the load-bearing headline metric.** §5.0 supersedes §5.1 as the document's externally-facing measure of test quality per the Verification-Coverage Principle codified in `/asae SKILL.md` Section 0 (v07).

The metric is:

> **behaviors-verified / behaviors-claimed**

Computed by:

1. **Enumerate `behaviors-claimed`** — every user-facing behavior the application claims (in PRD User Journeys, TRD Functional Requirements, PRD Acceptance Criteria, README claims, marketing copy, SECURITY.md claims, LAUNCH/READINESS docs). Each claim → one row in the §5.0 traceability table.
2. **Map each claim to a mutation-killing test** — a test that fails when the claim breaks. Tautological assertions (`expect(true).toBe(true)`), stub-asserting-stub patterns, and "the data layer is mocked so the test always passes" patterns do NOT satisfy the principle and do NOT count toward `behaviors-verified`.
3. **Compute ratio** — `behaviors-verified / behaviors-claimed` per release. Target: 1.0 (every claim has a verifying test). The ratio appears in §5.0 reporting; it is NOT a user-facing headline.

**`### TQVCD-VC-01: Behaviors-Verified Ratio`** — target 1.0; computed at every Stage QA convergence; reported in audit log.

**Mutation testing is the canonical empirical measurement when behaviors-verified can't be enumerated.** When the enumeration approach yields ambiguity (which behavior counts as "claimed"? does a UJ count once or once per acceptance criterion?), mutation score (with honest scope per `disclosures.coverage_mutation_scope` per Mod 3 / A11.NEW-3 in `/asae SKILL.md`) substitutes as the empirical proxy. See §TQVCD-TC-17 Mutation Testing.

**§5.0 traceability table format:**

| behavior_claim | source_doc_ref | mutation_killing_test | last_passing_run | tautology_check |
|---|---|---|---|---|
| "Search returns within 250ms at p95" | TRD §3.1 NFR-3.1-01 | tests/perf/search-p95.k6.js | 2026-04-27T18:42:00Z | not-tautological (mutating threshold to 1ms fails the test) |
| "AES-256 encryption at rest" | SECURITY.md L42 | tests/security/encryption-at-rest.test.ts:18 | 2026-04-27T18:43:00Z | not-tautological (mutating bundled-sqlcipher → bundled fails the test) |
| "Works offline" | README.md L24 | tests/integration/offline-mode.spec.ts:7 | 2026-04-27T18:44:00Z | not-tautological (mutating fetch path to required-online fails the test) |

> **Stop & Verify before continuing past §5.0.** Confirm:
> - Every user-facing claim from PRD / TRD / README / SECURITY / LAUNCH docs has a row in the §5.0 table with a `mutation_killing_test` that exists and last ran passing within retention window
> - Every row's `tautology_check` field has been verified per the test-tautology-bans catalog at `_grand_repo/docs/test-tautology-bans.md`
> - For releases with a `disclosures.coverage_mutation_scope` block (per /asae A11.NEW-3): the block's `tqvcd_reference` paths resolve to actual exclusion-disclosure sections in this TQVCD instance

### 5.1 Code Coverage (Internal CI Metric Only — NOT User-Facing Headline)

**§5.1 is the internal CI metric.** Coverage % is operator-visible and CI-enforced, but it is NEVER a user-facing headline claim of methodology compliance. See §5.0 for the user-facing headline (behaviors-verified ratio). See §5.4 for the banned-phrase list refusing user-facing coverage % claims without honest-scope disclosure.

Per the D2R hardwired test coverage principle:

- **`### TQVCD-CC-01: Line Coverage`** — 100% of backend + 100% of frontend testable code (exclude generated code, scaffolding, and third-party imports)
- **`### TQVCD-CC-02: Branch Coverage`** — 100% of decision points
- **`### TQVCD-CC-03: Integration Coverage`** — 100% of integration points between layers

Exception: code that is provably unreachable or purely structural (type definitions, module declarations, etc.) can be excluded with documented rationale per excluded-path. Each exclusion lives as a sub-bullet under TQVCD-CC-NN; rationale is per-path, not per-module-glob.

Document the coverage tool and the config that enforces these floors. The coverage tool's exclusion configuration (e.g., `vitest.config.ts coverage.exclude`, `cargo tarpaulin` ignore patterns, `pytest --cov-config`) must align with the per-path exclusions documented above. Drift between tool config exclusions and TQVCD-documented exclusions is a refuse-grade audit finding (CDCC plugin's `stryker.conf.mjs:4-10` exclusion-cluster carving was the empirical case Mod 3 closes).

### 5.2 Test Coverage Beyond Code — Two-State Traceability Table

This section is the F13-functional-layer prevention check. Without explicit FR-to-test traceability, "every FR has at least one test" is a count-parity claim that can be silently violated (10 FRs ↔ 10 tests with a 9-1 distribution where one FR has 9 tests and another has 0 still passes a count check).

Author a traceability table covering every TRD-FR + TRD-BR + PRD-UJ + every TRD-NFR with a measurable acceptance criterion. The table has TWO states:

**Pre-implementation state (Stage 00 → Stage 02 entry):** every row has a `test_strategy` value populated.

**Post-implementation state (per stage commit):** the same row gets a `test_path` value populated when the test exists.

| Source ID | Source Type | Source Doc | test_strategy | test_path | reviewer_checklist_path |
|-----------|-------------|------------|----------------|-----------|------------------------|
| TRD-FR-01 | Functional | TRD §2.1 | unit + integration | tests/unit/foo.test.ts:42 | — |
| TRD-BR-03 | Behavior | TRD §2.2 | e2e:browser | tests/e2e/login.spec.ts:18 | — |
| PRD-UJ-02 | User Journey | PRD §4.1 | e2e:browser | tests/e2e/checkout.spec.ts:7 | — |
| TRD-NFR-3.1-01 | Performance | TRD §3.1 | performance:p95 | tests/perf/page-load.k6.js | — |
| TRD-NFR-3.5-04 | Accessibility | TRD §3.5 | accessibility:axe-core | tests/a11y/full-site.spec.ts | — |
| PRD-AR-NV-01 | Brand voice (non-visual) | PRD §1.4.5 | manual:reviewer-checklist | — | docs/reviewer-checklists/brand-voice.md |

**`test_strategy` enumerated values:**

- `unit` — Standalone module test, no I/O
- `integration:db` / `integration:fs` / `integration:network` / etc. — Cross-boundary test against named boundary
- `e2e:browser` / `e2e:cli` / `e2e:api` — Full-stack test through named user surface
- `contract:api` — API contract verification against schema
- `property` — Property-based / fuzz
- `mutation` — Mutation testing target
- `performance:p95` / `performance:throughput` / `performance:budget` — Performance gate against named metric
- `accessibility:axe-core` / `accessibility:keyboard` / `accessibility:screen-reader` — A11y gate per Layer in 6-layer chain
- `manual:reviewer-checklist` — Reviewer-checked, not auto-checkable (use sparingly with rationale; `reviewer_checklist_path` field required)

**Test-name discipline (load-bearing):** every test starts with the source ID it covers, e.g., `it("TRD-FR-01: search returns within 250ms at p95")`. This makes the test name the durable identifier; paths are the index for tooling. CI updates paths in the sidecar from names automatically. A renamed test breaks the sidecar regeneration loudly; a moved file with unchanged name regenerates silently.

> **Stop & Verify before continuing past §5.2.** Confirm:
> - At Stage 00 entry: every FR / BR / UJ / NFR with measurable acceptance has a row with `test_strategy` populated
> - At each implementation stage commit: every covered source ID has `test_path` populated (or `reviewer_checklist_path` if `manual:reviewer-checklist` strategy)
> - No row has both `test_path` and `reviewer_checklist_path` empty post-Stage-02

### 5.4 Headline Metric Ban List

**Per the Verification-Coverage Principle (`/asae SKILL.md` Section 0, v07), the following phrases are BANNED in user-facing copy (README, SECURITY.md, marketing pages, landing pages, LAUNCH/READINESS docs) WITHOUT a populated `disclosures.coverage_mutation_scope` block (per Mod 3 / A11.NEW-3 in `/asae SKILL.md`).** Hook v07 Tier 17 enforces refusal at commit time.

Banned phrases:

- **`100% test coverage`** — coverage % is internal CI metric only (§5.1). User-facing claim implies behaviors-verified ratio of 1.0; without §5.0 + tautology-check + mutation-scope disclosure, this is a fabrication-prone headline (CDCC plugin shipped "100/100/100/100" while every load-bearing module was carved out of mutation scope).
- **`complete test coverage`** — synonym; same prohibition.
- **`X tests passing`** (count without verification context) — test count is a reporting artifact (e.g., "256 tests pass" in CDCC plugin included 11 `expect(true)` reliability tests). User-facing claim of test count without §5.0 behaviors-verified-mapping is the count-parity-as-quality fabrication pattern.
- **`comprehensive test suite`** — qualitative-without-quantitative; cannot be falsified, cannot be tested. Banned without §5.0 + §5.4-compliance disclosure.
- **`production-grade testing`** — qualitative-without-quantitative; same problem.
- **`fully tested`** / **`thoroughly tested`** / **`battle-tested`** (the family) — same family of qualitative-without-quantitative claims; banned without disclosure.
- **`X% mutation score`** without honest-scope disclosure — mutation score with carve-outs is the inverse of what it claims (CDCC plugin's 83% mutation with `audit/`, `hook-installer/`, `plan-writer/`, `cli/` excluded). User-facing claim requires §5.0 behavior-mapping + `disclosures.coverage_mutation_scope.mutation.excluded_paths_documented_at` resolving to TQVCD-TC-17 with per-path exclusion rationale.

**Allowed user-facing phrasing** (per Verification-Coverage Principle):

- **`X behaviors verified out of Y claimed`** — the §5.0 ratio, in user-facing form, with linked TQVCD §5.0 table reference.
- **`every documented user-facing behavior has a mutation-killing test (see TQVCD §5.0)`** — the principle stated, with the document reference.
- **`coverage % and test counts are internal CI metrics; see TQVCD §5.0 for verification headline`** — explicit reframe.

**Per-claim exempt with `// metric-allowed: <rationale> + <disclosures.coverage_mutation_scope reference>`** comment for genuine edge cases where a coverage % must appear (e.g., regulatory compliance docs that require coverage % attestation). The exemption requires the disclosures block populated AND the rationale documented in the same commit.

> **Stop & Verify before continuing past §5.4.** Confirm:
> - Every user-facing copy file (README, SECURITY.md, marketing pages, LAUNCH/READINESS docs) has been scanned for the banned-phrase patterns
> - Each banned-phrase hit either (a) has a populated `disclosures.coverage_mutation_scope` block in the staging audit log OR (b) has been replaced with allowed phrasing OR (c) has a per-claim exemption comment with valid rationale
> - The `_grand_repo/docs/test-tautology-bans.md` catalog (per Mod 6 / `/asae domain: code` Tautology-Test Detector) has been cross-checked for adjacent test-pattern bans that would also fire on the test files supporting these claims

---

## 6. Accessibility Criteria (Detailed) `[requires TRD §3.5]`

WCAG 2.1 AA is hardwired per D2R. This section declares specifics.

### 6.1 Target Compliance

- Minimum: WCAG 2.1 AA
- AAA items required: [list specific success criteria if any]
- Additional standards: [Section 508, EN 301 549, etc., from TRD]

### 6.2 Automated Testing

- Tool: [axe-core via Playwright is default]
- CI integration: axe-core violations at `critical` or `serious` level FAIL the build
- Scope: every page, every component variant, every state

### 6.3 Manual Testing Protocol

- Screen reader testing: [specific SR/browser combinations]
- Keyboard-only navigation: every interactive element reachable and operable
- Color contrast spot-checking: dynamic-color elements verified
- Motion sensitivity: `prefers-reduced-motion` honored

### 6.4 Accessibility Exit Criteria For Every UI Stage

Author each as `### TQVCD-EC-Access-NN: ...`:

- Zero axe-core `critical` or `serious` violations
- All functionality keyboard-operable
- All interactive elements have visible focus indicators
- All images have alt text or are marked decorative
- Color is never the sole indicator of meaning
- Contrast ratios meet 4.5:1 (normal text) and 3:1 (large text) minimums
- Touch targets ≥ 44x44px for any mobile-targeted element
- `prefers-reduced-motion` respected on all animations

---

## 7. Performance & Operational Budgets `[requires TRD §3.1, §3.2, §3.10, §3.11]`

From TRD §3.1, §3.2, §3.10, §3.11, convert targets into measurable budgets and gates. Each budget gets `### TQVCD-BG-NN: ...` ID.

### 7.1 User-Facing Performance Budgets (Track 11)

*Required fields:*
- *Page load p50/p95/p99 targets (mirrors TRD §3.1)*
- *Interactive time-to-ready targets*
- *Response time per key interaction targets*
- *Backend response p50/p95/p99 per critical endpoint*
- *Tail-latency floor (p99.9 if SLO requires)*

> **Stop & Verify before continuing past §7.1.** Confirm:
> - All numbers mirror TRD §3.1 NFRs (no orphan budgets, no missing TRD NFRs)
> - Performance chain leg (TRD §3.1 ↔ AVD §4 ↔ TQVCD §7.1) is COMPLETE

### 7.2 Resource Budgets

*Required fields:*
- *Bundle size budget (gzip and brotli, separately)*
- *Memory budget (client-side if web, total if desktop, RSS ceiling if server)*
- *Initial page weight budget*
- *CPU budget per request / per interaction*
- *Database query count and total query time budget per critical endpoint*

### 7.3 Performance Enforcement

- *How the budgets are measured (Lighthouse, WebPageTest, k6, Locust, JMeter, custom)*
- *Where enforcement happens (CI, pre-commit, pre-deploy, continuous synthetic monitoring)*
- *What happens when a budget is exceeded (fail build, warn, request manual review)*
- *Performance regression alarm thresholds (e.g., 10% regression vs. last release fails CI)*

### 7.4 Reliability & Stress Gates (Track 14)

*Operational acceptance criteria derived from TRD §3.2 (Reliability & Resilience).*

*Required fields:*
- *Stress test pass conditions (which categories from §2.2 must pass at what load level)*
- *Chaos / fault-injection pass conditions (target component recovers within RTO under simulated failures)*
- *Idempotency verification (replay-attack tests pass for all idempotent endpoints)*
- *Retry / backoff verification (retry storms do not amplify load beyond N% of baseline)*
- *Queue / DLQ verification (failed messages land in DLQ; replay restores state)*
- *Circuit breaker verification (open state prevents downstream pile-up; half-open recovery works)*
- *DR drill cadence and pass criteria (last drill date, restore-time observed vs. RTO target)*

### 7.5 Cost Gates (Track 17)

*Required fields (or "NA — [justification matching TRD §3.10 + PRD §6.5]"):*
- *Monthly infrastructure spend ceiling enforcement (alert at 80% of ceiling, fail at 100%)*
- *Cost per active user / per request / per transaction observed-vs-target ratio*
- *Cost regression detection (deploy that increases cost per request by >10% triggers review)*
- *Reserved capacity utilization floor (avoid paying for unused commitments)*
- *Idle resource detection (orphaned LBs, zombie databases, unused IPs flagged)*

> **Stop & Verify before continuing past §7.5.** Confirm:
> - Cost chain (Phase 1 Q9 ↔ PRD §6.5 ↔ TRD §3.10 ↔ TQVCD §7.5) shows COMPLETE legs OR matched-NA-justification at every leg

### 7.6 Internationalization Gates (Track 18)

*Required fields (or "NA — [justification matching TRD §3.11 + PRD §6.6]"):*
- *String externalization completeness (zero hardcoded user-facing strings — verified by lint rule or scan)*
- *Translation completeness per locale (target % per release)*
- *Pseudo-locale rendering passes (no truncation, no overflow, no missing glyphs)*
- *RTL mirror rendering passes (for RTL-supported locales)*
- *Locale-aware date/time/number/currency formatting verified by automated test*
- *Translator-blind testing (functional tests pass with placeholder pseudo-translations)*

---

## 8. Security Quality Gates `[requires TRD §3.3]`

From TRD §3.3 Security Requirements (Tracks 9 + 15), operationalize as pre-commit and CI gates. Each gate gets `### TQVCD-BG-Sec-NN: ...` ID.

### 8.1 Pre-Commit Gates

- *Secret scanning (tool: gitleaks / trufflehog / detect-secrets, threshold: zero detected)*
- *Dependency vulnerability scan (tool: npm audit / pip-audit / cargo-audit / snyk, severity threshold)*
- *Static analysis (tool: semgrep / sonarqube / language-native linter, severity threshold)*
- *License-policy lint (no GPL where prohibited, etc.)*

### 8.2 CI Gates

- *Full dependency audit (allowlisted CVEs only, with documented justification)*
- *Container image scanning (Trivy / Grype / Snyk Container, if containerized)*
- *SBOM generation (CycloneDX or SPDX format) and signing*
- *License compliance check (tool, policy)*
- *DAST / interactive scanning if web app (OWASP ZAP / Burp / commercial)*
- *IaC security scan if applicable (Checkov / tfsec / kics)*

### 8.3 Pre-Deploy Gates

- *Penetration testing cadence (if applicable; pass criteria for findings)*
- *Security review sign-off (named approvers per change class)*
- *Production configuration audit (no default credentials, MFA enforced for admins, audit log on)*
- *Threat-model coverage check: every top-threat from TRD §3.3 has a mitigation in code or config (Track 9)*

### 8.4 Authentication & Identity Gates (Track 15)

- *Auth provider integration tested end-to-end (real provider in staging, not mocked)*
- *Session management correctness (timeout, refresh, revocation tested)*
- *Authorization tests cover negative cases (user A cannot access user B's resources)*
- *MFA enrollment and enforcement tested for required roles*
- *Token validation correctness (expired, malformed, revoked, swapped) tested*
- *OAuth/OIDC flow conformance tested if used (state, nonce, PKCE)*
- *Brute-force protection verified (rate limiting + lockout)*
- *Password policy enforcement verified if applicable*

---

## 9. Quality Review Gates `[requires §2-§8]`

### 9.1 Code Review

- Required reviewers per change type
- Review checklist (linked or inline)
- Approval requirements before merge

### 9.2 ASAE Gate Integration

Per D2R, every stage exit passes through an ASAE gate. This section declares ASAE Certainty Thresholds per stage type. Author each as `### TQVCD-AT-NN: ...`:

- `### TQVCD-AT-01: Stage 00 (research)` — threshold [default 2]
- `### TQVCD-AT-02: Stage 01 (plan authorship)` — threshold [default 3]
- `### TQVCD-AT-03: Stage 02-NN (implementation)` — threshold [default 3]
- `### TQVCD-AT-04: Stage NN+1 (Design Polish)` — threshold [default 3, domain=design]
- `### TQVCD-AT-05: Stage QA (convergence loop)` — threshold [default 5]

Severity policy: [strict (default for regulated domains / published research / production code) OR standard]

> **Stop & Verify before continuing past §9.2.** Confirm:
> - ASAE thresholds match D2R skill defaults OR have explicit deviation rationale
> - Severity policy declared (no implicit default)

---

## 10. Operational Acceptance Criteria `[requires TRD §3.8, §3.9, §3.4]`

This section establishes operational gates that determine whether the system is genuinely deployable to production — distinct from §7 (performance budgets), §8 (security gates), and §9 (review gates). Operational acceptance covers what an SRE / platform team would refuse a launch for.

### 10.1 Observability Acceptance (Track 10)

Operationalizes TRD §3.8.

*Required fields:*
- *Structured logging emitted at every defined level (DEBUG / INFO / WARN / ERROR / FATAL) with required fields (request_id, user_id, span_id, timestamp ISO 8601 UTC, event, level)*
- *Log aggregation pipeline verified end-to-end (sample event from prod path appears in aggregator within target latency)*
- *Metrics exposed at /metrics or equivalent; RED method (Rate, Errors, Duration) covered for every critical endpoint*
- *USE method (Utilization, Saturation, Errors) covered for every critical resource*
- *Distributed tracing propagation verified across every service hop (no orphan spans)*
- *SLI / SLO definitions implemented in monitoring (queries written, dashboards live, alerts firing on threshold breach in staging)*
- *Error-budget burn-rate alerts configured (multi-window, multi-burn-rate per Google SRE practice)*
- *On-call runbook exists for every alert; alert → runbook → action chain tested in staging fire drill*
- *Dashboard inventory complete: per-service health, per-endpoint latency, per-dependency status, error budget*

### 10.2 Release Engineering Acceptance (Track 16)

Operationalizes TRD §3.9.

*Required fields:*
- *Versioning scheme adhered to in CI (CI fails on missing/malformed version)*
- *Changelog discipline verified (release without CHANGELOG entry fails or warns)*
- *Branching model enforced via branch protection rules (force-push blocked, required reviews, required status checks)*
- *CI pipeline executes the full declared scope (lint, typecheck, all test categories from §2 declared YES, security scans from §8, SBOM, sign)*
- *CD pipeline executes the full declared scope including staging-mirror-of-prod deploy + smoke test gate before prod*
- *Feature flag platform integration tested (new flag created, evaluated in staging, rolled out, killed) end-to-end*
- *Progressive delivery executed in staging (canary or equivalent verified against rollback trigger)*
- *Rollback procedure tested in staging within last release cycle (one-click rollback verified, time-to-rollback measured)*
- *Release approval gate enforced (no manual override path that bypasses)*

### 10.3 AI / ML Acceptance (Track 19, Applicability-Gated)

Required IFF the product has AI in the user-facing critical path (per /ideate-to-d2r-ready Q11). NA permitted otherwise.

*Required fields (or "NA — [justification matching Q11]"):*
- *Model version pinning verified (production runs documented model version; no silent upgrades)*
- *Prompt / system-instruction versioning under git, with diffable history*
- *Eval suite executed pre-release (gold-set accuracy, regression vs. last release, OWASP LLM Top 10 jailbreak resistance per applicable items)*
- *Eval pass thresholds defined and enforced (specific pass scores, not "looks good")*
- *Output safety classifier integration verified (or hardcoded refusal patterns tested)*
- *Cost-per-call observability verified (cross-references §7.5 if Track 17 also applicable)*
- *Latency budget per AI call enforced (cross-references §7.1)*
- *Retraining / fine-tuning pipeline acceptance criteria (if applicable)*
- *Hallucination mitigation verified (RAG citation accuracy, structured output schema validation)*
- *Refusal behavior tested for prohibited topics*

### 10.4 Compliance & Regulatory Audit-Readiness (Track 20, Applicability-Gated)

Required IFF the product is in regulated scope (per /ideate-to-d2r-ready Q12). NA permitted otherwise.

*Required fields (or "NA — [justification matching Q12]"):*
- *Applicable framework(s) declared (matches TRD §3.4 + PRD §6.2)*
- *Control mapping document maintained (each control mapped to code/config/policy evidence)*
- *Audit log retention policy enforced and tested (records survive declared period, immutable storage if required)*
- *Access reviews scheduled (cadence, reviewer, evidence trail)*
- *Vendor / sub-processor list maintained (with DPA references if GDPR-scoped)*
- *Data processing agreement (DPA) or BAA references current*
- *Penetration test cadence and findings remediation SLA met*
- *Incident response runbook + breach notification timeline documented and tested*
- *Evidence collection automated where possible (control evidence pulled programmatically, not manually)*

> **Stop & Verify before continuing past §10.** Confirm:
> - Observability chain (TRD §3.8 ↔ AVD-AC §3.1 Observability ↔ TQVCD §10.1 ↔ runbook) shows COMPLETE legs
> - Release engineering chain (TRD §3.9 ↔ TQVCD §10.2 ↔ runbook) shows COMPLETE legs
> - AI/ML chain shows COMPLETE legs OR matched-NA at every leg
> - Compliance chain shows COMPLETE legs OR matched-NA at every leg

---

## 11. Open Quality Questions `[independent]`

*Author one heading per question (`### TQVCD-OQ-01: Should Mutation Score Threshold Be 80% Or 85%?`). Stage 00 research should address these or the TQVCD must be updated before Stage 01.*

---

## Amendment Protocol

*Per `references/Methodology_Versioning_And_Amendment_Protocol_2026-04-26_v01_I.md` §8 (canonical text). Authors of an instance TQVCD should paste the canonical Amendment Protocol section here. Summary: Phase A (authoring, pre-Stage-00) follows the inline validation hooks; Phase B (execution amendments) requires amendment-log entry + cross-doc audit re-run; Phase C (operational) requires amendment-log entry + ORD update if applicable.*

*Note: TQVCD §5.2 traceability table updates are continuous in Phase B — every implementation stage commit adds `test_path` values. This is normal operating behavior, NOT an amendment-class change. Amendment-class changes to TQVCD include: new test categories declared YES, new exit criteria, new ASAE thresholds, severity policy changes — these require amendment log entries.*

---

## 12. Stakeholder Approvals `[requires every other section]`

*Who has approved this TQVCD? Without documented approval, Stage 00 should not begin.*

---

## Validation Checklist (Pre-Stage-00)

Before invoking `/dare-to-rise-code-plan`, verify:

- [ ] All required sections completed
- [ ] Heading-prefix IDs assigned to all test categories / exit criteria / budgets / ASAE thresholds / coverage criteria
- [ ] Testing Taxonomy applicability declared for every category in Part 1 (20 categories) — every YES has specific exit criteria; every NO has specific skip reason
- [ ] Stress test applicability declared per AI-driven selection strategy
- [ ] Standards operationalized with measurable exit criteria + verification method
- [ ] §3.3 Data lifecycle / privacy exit criteria specified (Track 13)
- [ ] Benchmarks specified with target scores + measurement methodology
- [ ] Code coverage floors declared (100% line + branch per D2R)
- [ ] §5.2 Two-state traceability table populated: every TRD-FR / TRD-BR / PRD-UJ / measurable TRD-NFR has a row with `test_strategy` value (pre-implementation state)
- [ ] Accessibility criteria specific (not "WCAG AA" — specific TQVCD-EC-Access-NN entries + tools + protocols)
- [ ] §7.1 Performance budgets measurable and enforced (Track 11)
- [ ] §7.4 Reliability/stress gates specified (Track 14)
- [ ] §7.5 Cost gates specified, or NA-with-justification matching TRD §3.10 + PRD §6.5 (Track 17)
- [ ] §7.6 Internationalization gates specified, or NA-with-justification matching TRD §3.11 + PRD §6.6 (Track 18)
- [ ] §8 Security gates specified per stage (pre-commit / CI / pre-deploy)
- [ ] §8.4 Auth & identity gates specified (Track 15)
- [ ] §10.1 Observability acceptance criteria specified (Track 10)
- [ ] §10.2 Release engineering acceptance criteria specified (Track 16)
- [ ] §10.3 AI/ML acceptance criteria specified, or NA-with-justification matching Q11 (Track 19)
- [ ] §10.4 Compliance audit-readiness criteria specified, or NA-with-justification matching Q12 (Track 20)
- [ ] ASAE thresholds declared per stage type (`TQVCD-AT-NN`)
- [ ] Severity policy declared (strict or standard)
- [ ] Inline validation hooks acknowledged at §2.1, §2.2, §3.1, §5.2, §7.1, §7.5, §9.2, §10
- [ ] Amendment Protocol section present (canonical text)
- [ ] `methodology_version: 0.3.0` declared in frontmatter
- [ ] Authorship parallelization markers acknowledged
- [ ] Bundle Index sidecar reflects current TQVCD IDs (if CDCC v1.1.0 available)
- [ ] Stakeholder approval documented

A TQVCD missing any of these is not ready for D2R.

---

## Companion Documents

This TQVCD is one of FIVE prerequisite inputs to `/dare-to-rise-code-plan`:

- **PRD (Product Requirements Document)** — what the product IS (must exist first)
- **TRD (Technical Requirements Document)** — what it MUST DO technically (must exist before this)
- **AVD (Architecture Vision Document)** — high-level system shape
- **UXD (User Experience Document)** — visual design system + interaction polish

See template files in the same `references/` directory.

---

## Downstream Use

This TQVCD feeds directly into:

- **Stage 00 ASAE gate:** audits whether research findings actually address the applicable standards and benchmarks declared here
- **Stage 01 Step 2:** the TQVCD IS the QA specification. Stage 01 reads this document and backwards-plans implementation stages against the exit criteria declared here
- **Stage NN commit gates:** pre-commit hooks enforce the gates declared in §8 and §9.1 + coverage floors from §5
- **Stage QA:** the convergence loop executes the Testing Taxonomy categories declared applicable in §2.1 and §2.2, against the exit criteria declared throughout
- **Stage QA traceability check:** every row in §5.2 must have either `test_path` populated OR `reviewer_checklist_path` populated post-implementation; orphan rows flag a coverage gap

**Cross-doc alignment chains:** TQVCD is the gate-operationalizer on EVERY chain leg; see `/ideate-to-d2r-ready` Phase 3 for the 11 chain audits including:
- Security chain ↔ §8
- Observability chain ↔ §10.1
- Reliability chain ↔ §7.4 + §2.2
- Auth chain ↔ §8.4
- Performance chain ↔ §7.1, §7.3
- Cost chain (gated) ↔ §7.5
- i18n chain (gated) ↔ §7.6
- AI/ML chain (gated) ↔ §10.3
- Compliance chain (gated) ↔ §10.4
