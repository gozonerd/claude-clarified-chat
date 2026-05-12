---
name: Architecture Vision Document — Template
description: Reusable template for authoring an AVD as a prerequisite input to /dare-to-rise-code-plan. Defines the high-level system shape, component boundaries, data flow, deployment architecture, and architectural decisions with explicit reversal-cost annotations. Filled-in instances feed into Stage 00 research.
type: template
skill: dare-to-rise-code-plan
version: v03_I
date: 2026-04-26
methodology_version: 0.3.0
---

# Architecture Vision Document — Template

## How To Use This Template

Copy this file. Rename to `[ProjectPrefix]_AVD_[YYYY-MM-DD]_v01_I.md`. Fill in every required section. Mark optional sections as NA if not applicable with a one-line reason.

The AVD is downstream of the PRD (what the product IS) and TRD (what it MUST DO), and parallel to the TQVCD (what success looks like quality-wise). The AVD describes the system's HIGH-LEVEL SHAPE before Stage 00 research picks specific libraries and before Stage 01 writes the implementation plan.

For simple projects (e.g., a library with a single consumer), the AVD may be short — components, data flow, deployment, done. For complex projects (multi-surface platforms, distributed systems, cross-app ecosystems), the AVD is the document that keeps architectural decisions coherent across stages.

Required sections must be completed before `/dare-to-rise-code-plan` Stage 00 can run.

### Heading-Prefix IDs

Per `references/Heading_Prefix_ID_Grammar_2026-04-26_v01_I.md`, every load-bearing item appears as a heading with a strict ID prefix in the form `### {DOC}-{TYPE}-{NUMBER}: {Title}`. AVD uses these TYPE prefixes:

- **AC** — Architectural Component (§3.1)
- **DF** — Data Flow (§4.1, §4.2)
- **DT** — Deployment Target (§5.1)
- **AD** — Architectural Decision (§7)
- **TD** — Technical Debt item (§8)
- **OQ** — Open Question (§9)

Example: `### AVD-AC-03: Audit Log Service`. Cross-doc references use the fully-qualified form: `references AVD-AC-03 + AVD-AD-04`.

### Authorship Parallelization Markers

Each section header carries a marker indicating dependency for team-scaled authorship:

- `[independent]` — can be authored at any time
- `[parallelizable-with X]` — can be authored concurrently with X
- `[requires §X]` — must be authored after §X

---

## 1. Document Identity `[requires PRD §1.1, §1.2; TRD §1]`

### 1.1 Project Name And Version

*Project name matching PRD/TRD. Version matching PRD/TRD.*

### 1.2 PRD And TRD References

*Cite the PRD and TRD this AVD is downstream of.*

### 1.3 Revision History

| Version | Date | Changes | Reviewer |
|---------|------|---------|----------|

---

## 2. System Shape `[requires §1; parallelizable-with TRD §6]`

### 2.1 One-Paragraph System Description

*In 3-5 sentences, describe the system's shape at the highest level. Not what it does (that's the PRD). Not what it must do technically (that's the TRD). Its architectural shape — client-server, static site, CLI, library + consumers, distributed workers, event-driven, etc.*

### 2.2 Architectural Style

*Name the architectural style(s) the system uses:*
- *Monolithic / Microservices / Serverless / Static Site / CLI / Library / Hybrid*
- *Synchronous / Asynchronous / Event-Driven / Request-Response*
- *Stateful / Stateless*
- *Client-Side / Server-Side / Hybrid*

*For each: one-line rationale.*

### 2.3 Surface Layers

*What surfaces does the system expose to consumers? For each surface:*
- *Name*
- *Consumer type (human user via UI, developer via API, developer via CLI, etc.)*
- *Relationship to other surfaces (are they all wrappers around one core? Independent? Dependent?)*

---

## 3. Components And Boundaries `[requires TRD §3, §6.6, §6.7]`

### 3.1 Component Inventory

*Every major component of the system. Author one heading per component (e.g., `### AVD-AC-01: Plan Generator`). Required fields under each heading:*
- *Responsibility (one sentence)*
- *Inputs (from which other components or external sources)*
- *Outputs (to which other components or external sinks)*
- *Interfaces exposed (public API surface)*

The component inventory MUST include the following categories where applicable (NA-with-justification permitted):

**Application components**
- Frontend / UI components (cross-references TRD §6.7 design system)
- Backend services / APIs
- Background workers / job processors
- Scheduled tasks / cron jobs
- CLI surfaces

**Data components**
- Primary databases (operational stores)
- Analytics / warehouse stores (if any)
- Cache layers (cross-references TRD §3.1 caching strategy, Track 11)
- Object storage (S3 / GCS / Azure Blob / etc.)
- Search indexes (if any)

**Observability components (Track 10, mandatory in production)**
- Log aggregator (the named service: Datadog / Splunk / ELK / Loki / CloudWatch)
- Metrics backend (Prometheus / Datadog / etc.)
- Tracing backend (Jaeger / Tempo / Datadog APM / Honeycomb)
- Alerting / on-call routing (PagerDuty / Opsgenie / VictorOps)
- Dashboard hosting (Grafana / Datadog / vendor-native)
- These are first-class components, not afterthoughts. Each appears in the component diagram and the deployment topology.

**Auth & identity components (Track 15, mandatory if system has auth)**
- Identity provider (Auth0 / Cognito / Clerk / Keycloak / custom)
- Session store (Redis / database / signed cookies)
- Token validator / authorizer (gateway-level / service-level / sidecar)
- Authorization policy engine if any (OPA / Cedar / framework-native)

**Queue & messaging components (Track 14, applicability-gated)**
- Message broker (SQS / RabbitMQ / Kafka / NATS / Redis Streams)
- Dead-letter queue (DLQ) destinations
- Event bus / pub-sub topics
- Required if reliability patterns demand async / decoupled processing per TRD §3.2

**AI / ML components (Track 19, applicability-gated)**
- Model serving infrastructure (in-process / inference server / managed API)
- Prompt / system-instruction store (versioned)
- Eval harness location
- Vector store / RAG retriever if applicable
- Output safety / classifier components if applicable
- Required IFF the product has AI in user-facing critical path

> **Stop & Verify before continuing past §3.1.** Confirm:
> - Every component has IDs assigned (`AVD-AC-NN`)
> - Every component has Inputs / Outputs / Responsibility / Interfaces named
> - Categories Observability (Track 10), Auth (Track 15), Queue (Track 14), AI (Track 19) all have either components or NA-with-justification
> - Component inventory aligns with TRD §3 NFRs (e.g., if TRD §3.8 declares Datadog, AVD §3.1 has the Datadog component)

### 3.2 Boundaries

*Where are the hard boundaries between components?*
- *Process boundaries (separate processes, separate services)*
- *Language / runtime boundaries (TypeScript vs Rust vs Python sidecar, etc.)*
- *Trust boundaries (which components can be trusted with which data)*
- *Release boundaries (which components ship together vs independently)*

### 3.3 Component Diagram

*Narrative description of component relationships (since this is a markdown doc, describe in prose or include a link to a separate diagram file). Required: every component in the inventory must appear; every arrow must have a direction and a label.*

---

## 4. Data Flow `[requires §3.1]`

### 4.1 Primary Data Flows

*The main data journeys through the system. Author one heading per flow (e.g., `### AVD-DF-01: User Submits Plan For Generation`). Required fields:*
- *Trigger*
- *Steps: data enters at X → transformed by Y → stored in Z (or transmitted to W)*
- *Output: what the consumer sees / receives*
- *Latency expectations (from TRD)*

> **Stop & Verify before continuing past §4.1.** Confirm:
> - Every flow has a trigger named
> - Every flow has data entering at X → transformed by Y → stored in Z (or transmitted to W) chain
> - Every flow has latency expectation matching TRD §3.1 budgets
> - Every flow is referenced by at least one component in §3.1

### 4.2 Secondary Data Flows

*Background jobs, scheduled tasks, error-recovery flows. Author as `### AVD-DF-NN: ...` headings.*

### 4.3 Data Persistence Points

*Where does data persist?*
- *Location (database type, file system, client-side storage, etc.)*
- *Lifetime (session / persistent / archival)*
- *Consistency model (strong / eventual / last-write-wins)*

---

## 5. Deployment Architecture (Load-Bearing — Track 12) `[requires TRD §6.6 + §3]`

This section is load-bearing in v02+: it captures the outputs of Stage 00 Track 12 (Deployment Architecture & Infrastructure-as-Code). For any production-deployable system this section is mandatory; only NA when the artifact is a pure library with no own runtime.

### 5.1 Deployment Targets

*Every deployment target. Author one heading per target (e.g., `### AVD-DT-01: Production Web (Vercel)`). Required fields:*
- *Hosting / distribution mechanism (specific provider + service per TRD §6.6: AWS Fargate, GCP Cloud Run, Vercel, Fly.io, on-prem k8s, etc.)*
- *Build process (source → artifact)*
- *Release cadence (cross-references TRD §3.9, Track 16)*
- *Versioning scheme used at this target (cross-references TRD §3.9)*

### 5.2 Runtime Environments

*For each deployment target, the runtime environment it assumes:*
- *Browser versions / OS versions / Node versions / etc.*
- *Resource constraints (memory, CPU, disk)*
- *Network assumptions*
- *Container base image and security posture (distroless, non-root, scanned) if containerized*
- *Auto-scaling configuration (min, max, scale triggers)*

### 5.3 Environment Strategy

*Which environments exist and what they're for:*
- *Local / dev / staging / prod / preview-per-PR — per Track 12*
- *Environment parity expectations (how close staging mirrors prod)*
- *Data strategy per environment (synthetic, anonymized prod snapshot, isolated)*
- *Cost profile per environment (which envs run 24/7, which ephemeral)*

### 5.4 Infrastructure-as-Code

*How the infrastructure is reproducible — Track 12 outputs land here:*
- *IaC tooling (Terraform / Pulumi / CDK / SST / framework-native — name the specific tool + version)*
- *State management (where state lives, how it's locked, who can apply)*
- *Module / stack organization (one repo per env? per service? monorepo with workspaces?)*
- *Drift detection cadence and remediation policy*
- *IaC review workflow (PR-based / direct-apply / manual approval gates)*

### 5.5 Configuration And Secrets

*How is configuration delivered to each runtime? Where do secrets live? How are they rotated?*
- *Configuration source (env vars / config service / encrypted file / SSM Parameter Store / etc.)*
- *Secrets backend (KMS / Secrets Manager / Vault / SOPS / etc.) — cross-references TRD §3.3*
- *Secret rotation cadence per secret category (DB creds, API keys, signing keys)*
- *Local-dev secret strategy (no real prod secrets, .env.example pattern)*

### 5.6 Deployment Topology

*If the system spans multiple deployment targets, describe the topology:*
- *Which targets talk to which*
- *Authentication between targets (mTLS, signed JWTs, internal-network-only)*
- *Data replication or sync patterns*
- *Network architecture (VPC layout, subnets, ingress/egress, service mesh if any)*

### 5.7 Backup & Disaster Recovery (Track 12 + cross-references TRD §3.2)

*Required:*
- *What's backed up (specific data stores, configurations, encryption keys)*
- *Backup frequency per data class*
- *Backup storage location (different region / different provider / both)*
- *Backup retention per class*
- *Restore procedure (documented runbook location)*
- *DR drill cadence (last performed date, target frequency)*
- *Observed RTO and RPO from last drill vs. targets in TRD §3.2*

> **Stop & Verify before continuing past §5.7.** Confirm:
> - DR drill last-performed-date is filled in (not "TBD")
> - Observed RTO and RPO are present (or "DR drill not yet performed" with date target)
> - Backup retention per data class is named
> - Restore procedure runbook location is referenced (the runbook is a downstream output produced at Stage 02+, but the location must be reserved at AVD time)

---

## 6. Cross-Cutting Concerns `[requires §3, §4]`

### 6.1 Logging And Observability

*Which components emit logs? What format? Where do they aggregate? (Cross-reference TRD Section 3.8.)*

### 6.2 Error Handling Strategy

*System-wide error handling: thrown exceptions vs Result types vs error channels. Error propagation between components.*

### 6.3 Concurrency Model

*How does the system handle concurrent operations? Event loop, worker threads, async/await patterns, message queues, etc.*

### 6.4 Security Architecture

*High-level: where is authentication enforced? Where is authorization enforced? Where does data encryption happen? (Cross-reference TRD Section 3.3.)*

### 6.5 Accessibility Architecture

*If the system has UI surfaces: how is accessibility architecturally enforced? Component library choice? Testing integration? (Cross-reference TRD Section 3.5 and TQVCD Section 6.)*

---

## 7. Architectural Decisions (Mini-ADRs) `[parallelizable-with §3, §5]`

*For each significant architectural decision, author one heading (e.g., `### AVD-AD-04: SQLite Over Postgres For Local Desktop State`).*

*Required fields under each heading:*
- *Status (Proposed / Accepted / Deprecated / Superseded)*
- *Context: what problem was being solved*
- *Options Considered (with one-line summary each)*
- *Decision: which option was chosen*
- *Rationale: why this option*
- *Consequences: what this decision locks in and what it forecloses*
- *Reversal Cost: one of:*
  - *Trivial — can be undone in <1 day with no downstream rewrites*
  - *Moderate — can be undone in 1-5 days with bounded downstream rewrites (≤3 files)*
  - *Heavy — requires 1-4 weeks and significant rewrites (4-20 files OR a migration)*
  - *Architectural — requires meaningful re-plan from Stage 01 (>20 files OR cross-doc revisions)*
  - *Locked — physically cannot be undone in this codebase's lifetime (e.g., shipped v1 schema to N customers, changing it now requires migration with downtime)*

*Examples of decisions that warrant an AD:*
- *Language choice when multiple were viable*
- *Framework choice*
- *Sync vs async architectural choice*
- *Monolithic vs service-oriented*
- *Database choice*
- *Client-side vs server-side*
- *Custom library vs OSS adoption*

*Worked example:*

### AVD-AD-04: SQLite Over Postgres For Local Desktop State

**Status:** Accepted

**Context:** Desktop app needs persistent local state for plans, audits, decisions. Cloud sync is a separate concern handled at sync layer.

**Options Considered:**
- SQLite (chosen)
- Postgres (rejected — requires running daemon, deployment overhead per user machine)
- Filesystem JSON (rejected — no transactions, no querying)

**Decision:** SQLite via rusqlite for the desktop app's local state.

**Rationale:** Zero-deployment-cost; transactional; well-supported in Tauri/Rust ecosystem; cloud sync layer translates SQLite-shape to Postgres at sync boundary.

**Consequences:** Locked into SQL semantics for queries. Migration discipline required. Cross-process coordination complexity (SQLite single-writer model).

**Reversal Cost:** Heavy. Schema migration to Postgres-backed-local-store would require: (a) translating all rusqlite call sites (~40 files), (b) adding a local Postgres dependency to the install path, (c) re-validating all queries against Postgres semantics. Estimated 2-3 weeks. Justification for accepting: SQLite is proven for desktop-local persistence; the cloud sync layer (Postgres) handles distributed-database concerns separately.

> **Stop & Verify before continuing past §7.** Confirm:
> - Every AD has a Reversal Cost rating
> - No more than 25% of ADs are rated Architectural or Locked (calibrated-rigor signal — too many locks means the plan over-commits)
> - Every AD rated Architectural or Locked has explicit user-confirmation in §10 Stakeholder Approvals OR an open question in §9

---

## 8. Technical Debt And Known Compromises `[parallelizable-with §7]`

*Architectural compromises made in this version. Author one heading per item (e.g., `### AVD-TD-01: No Multi-Region Deployment In MVP`). Required fields:*
- *Compromise description*
- *Why it was made*
- *What it costs*
- *When/whether to revisit*

---

## 9. Open Architectural Questions `[independent]`

*Author one heading per question (`### AVD-OQ-01: Should Sync Layer Use CRDT Or Operational Transform?`). Stage 00 research should address these or Stage 01 must flag them for user decision.*

---

## Amendment Protocol

*Per `references/Methodology_Versioning_And_Amendment_Protocol_2026-04-26_v01_I.md` §8 (canonical text). Authors of an instance AVD should paste the canonical Amendment Protocol section here. Summary: Phase A (authoring, pre-Stage-00) follows the inline validation hooks above; Phase B (execution amendments, Stage 00 through Stage QA) requires amendment-log entry + cross-doc audit re-run + Reversal-Cost-≥-Heavy escalation; Phase C (operational amendments, post-Stage-QA) requires amendment-log entry + ORD update if applicable + stakeholder approval refresh.*

*Note: AVD Mini-ADRs are particularly amendment-sensitive. Any post-Phase-A amendment that changes an AD with Reversal Cost ≥ Heavy MUST trigger explicit user escalation per Phase B discipline.*

---

## 10. Stakeholder Approvals `[requires every other section]`

*Who has approved this AVD?*

*Required per stakeholder: name, role, approval date, notes. For ADs with Reversal Cost ≥ Heavy, stakeholder approval must explicitly acknowledge the lock-in.*

---

## Validation Checklist (Pre-Stage-00)

- [ ] All required sections completed
- [ ] NA sections have one-line justifications
- [ ] Heading-prefix IDs assigned to all components / data flows / deployment targets / ADs / tech debt items / open questions
- [ ] §3.1 Component inventory includes application, data, observability (Track 10), auth (Track 15), queue (Track 14), AI (Track 19) categories with NA-justifications where applicable
- [ ] Every component has inputs, outputs, responsibility named
- [ ] Every primary data flow traced end-to-end
- [ ] §5.1 Every deployment target has runtime environment + build process documented
- [ ] §5.3 Environment strategy declared (which envs exist, parity expectations)
- [ ] §5.4 IaC tooling named with state management strategy (Track 12)
- [ ] §5.5 Configuration and secrets architecture documented
- [ ] §5.7 Backup & DR plan documented with last-drill date and observed RTO/RPO (Track 12 + TRD §3.2)
- [ ] Mini-ADRs present for every significant architectural decision
- [ ] Every Mini-ADR has Reversal Cost rating; ≤25% are Architectural or Locked
- [ ] Inline validation hooks acknowledged at §3.1, §4.1, §5.7, §7
- [ ] Cross-cutting concerns addressed (or explicitly NA)
- [ ] Open questions named for Stage 00 to resolve
- [ ] Amendment Protocol section present (canonical text from `Methodology_Versioning_And_Amendment_Protocol_2026-04-26_v01_I.md` §8)
- [ ] `methodology_version: 0.3.0` declared in frontmatter
- [ ] Bundle Index sidecar reflects current AVD IDs (if CDCC v1.1.0 available)
- [ ] Authorship parallelization markers acknowledged
- [ ] Stakeholder approval documented (with explicit lock-in acknowledgment for any AD ≥ Heavy)

A project does not require an AVD if:
- The system is trivially simple (single file, no cross-component boundaries, no architectural choices to make)
- In which case Stage 00 documents the AVD-skipped status with justification

---

## Companion Documents

This AVD is one of FIVE prerequisite inputs to `/dare-to-rise-code-plan`. The others:

- **PRD (Product Requirements Document)** — what the product IS
- **TRD (Technical Requirements Document)** — what it MUST DO technically
- **TQVCD (Testing & Quality Criteria Document)** — what success looks like quality-wise
- **UXD (User Experience Document)** — visual design system + interaction polish criteria

All five templates live in `.claude/skills/dare-to-rise-code-plan/references/` and each has a corresponding authorship skill (`/write-prd`, `/write-trd`, `/write-avd`, `/write-tqcd`, `/write-uxd`).

---

## Downstream Use

This AVD feeds directly into:

- **Stage 00 Track 1 (Tech Stack):** scopes against architectural style + component inventory (`AVD-AC-NN`)
- **Stage 00 Track 4 (Language Depth):** scopes against component boundaries + runtime environments
- **Stage 00 Track 5 (Plugin Ecosystem):** scopes against cross-cutting concerns
- **Stage 00 Track 9 (Threat Modeling):** scopes against §3.2 boundaries + §6.4 security architecture; threat model lands trust boundaries here
- **Stage 00 Track 10 (Observability Stack):** lands observability components in §3.1 inventory (`AVD-AC-Observability-NN`) + §6.1 cross-cutting concern
- **Stage 00 Track 11 (Performance & Scale):** scopes against §4 data flows + §3 boundaries
- **Stage 00 Track 12 (Deployment Architecture & IaC):** lands its outputs into §5 (load-bearing); component IDs in §3.1 referenced by §5 deployment targets (`AVD-DT-NN`)
- **Stage 00 Track 13 (Data Lifecycle & Privacy):** scopes against §4.3 persistence + §6.4 security architecture
- **Stage 00 Track 14 (Reliability & Resilience):** lands queue / DLQ / retry components in §3.1 (`AVD-AC-Queue-NN`) + topology in §5.6
- **Stage 00 Track 15 (Auth & Identity):** lands identity provider + session store + token validator in §3.1 (`AVD-AC-Auth-NN`) + auth topology in §5.6
- **Stage 00 Track 16 (Release Engineering):** lands release-cadence + versioning per target in §5.1 (`AVD-DT-NN`)
- **Stage 00 Track 19 (AI/ML, applicability-gated):** lands model serving + prompt store + eval harness components in §3.1 (`AVD-AC-AI-NN`) if applicable
- **Stage 01a (Skeleton):** maps components (`AVD-AC-NN`) to implementation stages
- **Stage 01b (Full Plan):** writes Deep-spec content consistent with AVD component boundaries + data flows + deployment topology
- **Stage QA convergence:** ADs with Reversal Cost ≥ Heavy are checked against post-implementation reality — a Heavy AD that turned out to be Trivial in execution is a calibration signal, not an error

**Cross-doc alignment chains (Phase 02 of `/ideate-to-d2r-ready` audit):**
- **Security chain:** AVD-AC (auth components) ↔ TRD §3.3 ↔ TQVCD §8
- **Observability chain:** AVD-AC (Observability category) ↔ TRD §3.8 ↔ TQVCD §10.1 ↔ runbook
- **Reliability chain:** AVD-AC (Queue category) + §5.7 ↔ TRD §3.2 ↔ TQVCD §7.4
- **Auth chain:** AVD-AC (Auth category) + §5.6 ↔ TRD §3.3 ↔ TQVCD §8.4
- **Performance chain:** AVD §4 + AVD-AC (cache) ↔ TRD §3.1 ↔ TQVCD §7.1
- **Deployment chain:** AVD §5 ↔ TRD §6.6 ↔ TQVCD §10.2
- **AI/ML chain (applicability-gated):** AVD-AC (AI category) ↔ TRD §2 + §3.3 ↔ TQVCD §10.3 ↔ Phase 1 Q11
