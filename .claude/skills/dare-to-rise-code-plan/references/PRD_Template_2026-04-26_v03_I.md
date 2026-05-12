---
name: Product Requirements Document — Template
description: Reusable template for authoring a PRD as a prerequisite input to /dare-to-rise-code-plan. Defines what the product is, who it serves, what problem it solves, what success looks like, and the non-visual excellence anchors that prevent generic-default output on operational/CLI/audit/documentation surfaces. Filled-in instances feed into Stage 00 research.
type: template
skill: dare-to-rise-code-plan
version: v03_I
date: 2026-04-26
methodology_version: 0.3.0
---

# Product Requirements Document — Template

## How To Use This Template

Copy this file. Rename to `[ProjectPrefix]_PRD_[YYYY-MM-DD]_v01_I.md`. Fill in every required section. Mark optional sections as NA if not applicable with a one-line reason.

Required sections must be completed before `/dare-to-rise-code-plan` Stage 00 can run. Incomplete PRDs produce degraded plans.

Every section has instructions (italic) and a placeholder format. Replace instructions with the filled-in content. Keep the section headers.

### Heading-Prefix IDs

Per `references/Heading_Prefix_ID_Grammar_2026-04-26_v01_I.md`, every load-bearing item appears as a heading with a strict ID prefix in the form `### {DOC}-{TYPE}-{NUMBER}: {Title}`. PRD uses these TYPE prefixes:

- **US** — User Segment (§2.1, §2.2)
- **UJ** — User Journey (§4.1, §4.2)
- **SO** — Success Outcome (§5.1)
- **BC** — Business Constraint (§6.1)
- **RC** — Regulatory Constraint (§6.2)
- **TC** — Technical Constraint at PRD level (§6.3)
- **AS** — Assumption (§7)
- **OQ** — Open Question (§8)
- **OS** — Out of Scope item (§9)
- **AR** — Excellence Anchor Reference (§1.4)

Example: `### PRD-US-01: Instructional Designers At Underfunded NGOs`. Cross-doc references use the fully-qualified form: `references PRD-US-01`.

### Authorship Parallelization Markers

Each section header carries a marker indicating dependency for team-scaled authorship:

- `[independent]` — can be authored at any time
- `[parallelizable-with X]` — can be authored concurrently with X
- `[requires §X]` — must be authored after §X

Solo authors can ignore the markers. Team authors use them as project-management input.

---

## 1. Product Identity `[independent]`

### 1.1 Product Name

*State the product's name. If the product is part of a family or suite, name the family too.*

### 1.2 Version

*Version this PRD applies to. Use semantic versioning (v0.1, v1.0, etc.) or a version milestone descriptor (MVP, v0.2, v1.0, etc.).*

### 1.3 One-Line Description

*State the product in a single sentence. Describe what it does in outcome terms, not implementation terms. If you can't describe the product in one sentence, the product is not ready for a PRD.*

### 1.4 Non-Visual Excellence Anchors `[parallelizable-with §2]`

*The UXD anchors visual excellence (UXD §1.1 Reference Apps). Non-visual quality dimensions need their own anchors. Without them, the implementer's default for error messages, CLI ergonomics, audit logs, and documentation is "generic React-component-library equivalent for non-visual surfaces" — internally consistent, externally bland. This section captures the reality anchors for non-visual quality.*

#### 1.4.1 Operational Ergonomics Anchors

*Name 1-2 reference products for operator/CLI/API ergonomics. The reference is "how does this product communicate what it's about to do, what it just did, and what's failing right now?"*

*Required format per anchor (assign ID PRD-AR-01, PRD-AR-02, ...):*
- *App name*
- *What specifically is the reference (CLI grammar / dry-run pattern / verb-noun command structure / structured output formats / etc.)*
- *Path or URL to documentation or screenshot evidence*
- *What from this reference does NOT apply to this product*

*Example pass:*

*### PRD-AR-01: Stripe CLI — Pre-Action Communication*

*What specifically: tells you what's going to happen before it happens; --dry-run shows the exact request without sending. URL: https://stripe.com/docs/cli. Does not apply: their global flags model is heavier than this product needs.*

*### PRD-AR-02: gh CLI — Structured Output*

*What specifically: structured `--json` output formats; consistent verb-noun command grammar. URL: https://cli.github.com/. Does not apply: their auth model is GitHub-specific.*

*Example fail: "Should be CLI-friendly." — adjective-only without named reference; reject.*

#### 1.4.2 Failure-Communication Anchors

*Name 1-2 reference products for how the product communicates during incidents/errors/degradation. Same format as §1.4.1.*

*Example pass:*

*### PRD-AR-03: Cloudflare Status Page — Incident Communication*

*What specifically: cause + impact + scope + ETA + workaround in every incident report. URL: https://www.cloudflarestatus.com/. Does not apply: their multi-region complexity is N/A here.*

*### PRD-AR-04: Linear — Error State Treatment*

*What specifically: error states explain what's wrong AND what the user can do; remediation suggestion is structural not optional.*

#### 1.4.3 Audit-Trail Rendering Anchors

*Name 1-2 reference products for how the product captures and surfaces "what happened, why, by whom." Same format.*

*Example pass:*

*### PRD-AR-05: AWS CloudTrail — Structured Event Log*

*What specifically: structured who/what/when/result fields per event; queryable. Does not apply: their cloud-native scope is N/A here.*

*### PRD-AR-06: Git — Commit Message As Load-Bearing*

*What specifically: every change has a message; the message is enforced as load-bearing communication.*

#### 1.4.4 Documentation Excellence Anchors

*Name 1-2 reference products for how the product's docs answer "why" before "how." Same format.*

*Example pass:*

*### PRD-AR-07: React Docs (Post-2023 Rewrite) — Concept-First*

*What specifically: concept-first, then API. URL: https://react.dev/.*

*### PRD-AR-08: Stripe API Docs — Side-By-Side Examples*

*What specifically: every endpoint has a curl + node + python + ruby example side-by-side. URL: https://stripe.com/docs/api.*

#### 1.4.5 Non-Visual Brand Voice — 5+ Concrete Decisions

*State 5-10 concrete non-visual decisions that express the brand voice. Not "thoughtful" — concrete. Each decision gets ID PRD-AR-NV-01, PRD-AR-NV-02, ...*

*Examples (replace with this product's decisions):*
- *PRD-AR-NV-01: Error messages always include a remediation suggestion, never just the error name*
- *PRD-AR-NV-02: CLI commands always print what they're about to do before doing it; --dry-run is structural not optional*
- *PRD-AR-NV-03: Audit log entries always include the triple decision/rationale/payload, never just event/timestamp*
- *PRD-AR-NV-04: Docs always answer 'why' before 'how' for any concept introduced*
- *PRD-AR-NV-05: API responses have stable error codes; UI surfaces have stable copy keys*

#### 1.4.6 Non-Visual Anti-Patterns

*Name the most-likely-bland anti-patterns the implementer is likely to fall into for non-visual surfaces. Each gets ID PRD-AR-AP-01, PRD-AR-AP-02, ...*

*Required format per anti-pattern:*
- *Anti-pattern name*
- *What it looks like (concrete example)*
- *Why it's anti (what it lacks vs. the reference anchors above)*
- *What to do instead (concrete replacement, referencing §1.4.5 brand-voice decisions)*

*Example pass:*

*### PRD-AR-AP-01: Cryptic Stack-Trace Error Messages*

*What it looks like: `TypeError: cannot read property 'foo' of undefined`. What it lacks: any pointer to what the user can do. Replacement: error code + plain-language description + concrete next step (per PRD-AR-NV-01).*

*### PRD-AR-AP-02: Silent CLI Success*

*What it looks like: `cdcc generate ./bundle` exits 0 with no output. What it lacks: confirmation of what was done. Replacement: print the artifacts written + the audit log entry created (per PRD-AR-NV-02).*

> **Stop & Verify before continuing past §1.4.** Confirm:
> - At least 2 reference products named in each of §1.4.1, §1.4.2, §1.4.3, §1.4.4 with what-specifically-is-the-anchor stated
> - At least 5 concrete non-visual brand-voice decisions in §1.4.5 (not adjectives)
> - At least 2 named anti-patterns in §1.4.6 with concrete replacement
>
> If any condition fails, the bundle is not ready for Stage 00 — Phase 00 ideation interrogation Q13-Q16 (non-visual readiness) must be re-run.

---

## 2. Users And Problem `[parallelizable-with UXD §1]`

### 2.1 Primary Users

*Who is this product for? Describe the primary user segment specifically. Not "everyone." Not "developers." Something specific enough that you could name three real people who fit the description.*

*Author one heading per user segment (e.g., `### PRD-US-01: Instructional Designers At Underfunded NGOs`). Required fields under each heading:*
- *Representative user description (role, context, constraints they operate under)*
- *What they currently do without this product*
- *What they struggle with currently*

> **Stop & Verify before continuing past §2.1.** Confirm:
> - You could name three real people fitting each Primary User segment described
> - Each segment has all required fields filled in
> - No segment uses "everyone" / "developers" / "users" as the description

### 2.2 Secondary Users

*Optional. If the product has additional user segments with different needs, describe them here as `### PRD-US-NN: ...` headings. Mark NA if not applicable.*

### 2.3 Problem Statement

*What specific problem does this product solve? Describe the problem in the users' terms, not in solution terms. Include evidence that the problem is real (user research, personal experience, documented pain points, relevant statistics).*

> **Stop & Verify before continuing past §2.3.** Confirm:
> - The problem statement names at least one piece of evidence that this is a real problem (research finding, observed pattern, cited statistic, documented pain point)
> - The problem is described in users' terms, not solution terms

### 2.4 Why Now

*Why is this the right time to build this product? What has changed in the environment, technology, market, or user population that makes this solvable now when it wasn't before?*

---

## 3. Goals `[requires §2]`

### 3.1 Primary Goals

*What must the product achieve to be considered successful? Each goal must be specific and measurable.*

*Author one heading per goal (e.g., `### PRD-SO-01: Users Export Reports Twice Per Week In First Month`). Required fields:*
- *Goal statement*
- *Measurable criterion*
- *Timeframe to achievement*

> **Stop & Verify before continuing past §3.1.** Confirm:
> - Each goal has a specific measurable criterion AND a specific timeframe
> - No goal uses "users love it" or other unmeasurable phrasing

### 3.2 Secondary Goals

*Optional. As `### PRD-SO-NN: ...` headings. Mark NA if not applicable.*

### 3.3 Non-Goals

*What is explicitly NOT in scope for this product, or at least not for this version? Naming non-goals prevents scope creep during Stage 01 planning and during implementation.*

---

## 4. User Journeys `[requires §2]`

### 4.1 Primary User Journeys

*Walk through the key flows a user takes through the product. Author one heading per journey (e.g., `### PRD-UJ-01: Author A Lesson Plan From An Approved PRD`). Required fields:*
- *User goal entering the journey*
- *Step-by-step narrative (high-level, not technical)*
- *Outcome achieved*
- *Pain points this journey is designed to eliminate*

### 4.2 Edge Case Journeys

*Optional. As `### PRD-UJ-NN: ...` headings. Mark NA if all recovery flows are trivial.*

---

## 5. Success Criteria `[requires §3]`

### 5.1 Measurable Outcomes

*How will you know the product is working? Author one heading per outcome (e.g., `### PRD-SO-Out-01: Users Complete First Plan Within 10 Minutes`). Required fields:*
- *Metric definition*
- *Target value*
- *Measurement method*
- *Measurement frequency*

### 5.2 Qualitative Success Signals

*Optional. As `### PRD-SO-Q-NN: ...` headings.*

---

## 6. Constraints `[independent]`

### 6.1 Business Constraints

*Author one heading per constraint (`### PRD-BC-01: Zero-Budget Build`). Required fields under each: type (budget/timeline/resource/organizational), the specific constraint, what it forecloses.*

### 6.2 Regulatory Constraints

*Author one heading per regulation (`### PRD-RC-01: GDPR Article 30 Records Of Processing`). Mark NA if not applicable (and justify).*

### 6.3 Technical Constraints

*Platforms, stacks, or technologies that MUST be used or MUST NOT be used. Author per constraint (`### PRD-TC-01: Must Run On Vercel Free Tier`). Mark NA if no binding technical constraints exist.*

### 6.4 Accessibility Constraints

*WCAG 2.1 AA compliance is hardwired — not a constraint to negotiate. If additional accessibility standards apply (Section 508, EN 301 549, etc.), author them as `### PRD-RC-Access-NN: ...` headings.*

### 6.5 Cost Constraints (Track 17 Applicability Gate)

*Determines whether D2R Stage 00 Track 17 (Cost Modeling & FinOps) runs for this product. Required answer (one of):*

- *"Track 17 APPLICABLE — non-trivial infrastructure spend expected at MVP or planned within first 12 months."*
  - *Expected monthly infrastructure spend ceiling at MVP: [USD]*
  - *Cost-driving components anticipated: [compute / storage / egress / third-party APIs / AI inference / etc.]*
  - *Unit-economics target if commercial: [cost per active user / per request / per transaction]*
- *"Track 17 NA — [justification]."*
  - *Valid justifications: personal/local-only app with no hosted infra; static-site product with negligible serving cost; product where infra spend is bundled into a parent product's existing budget and out-of-scope here.*
  - *NA without justification is not permitted: cost is a real constraint for any production-deployable system, and silent skips produce launches with surprise infra bills.*

This applicability decision feeds into TRD §3.10 (Cost Requirements). Track 17 outputs land in TRD §3.10 + TQVCD §7.5 (Cost Gates).

> **Stop & Verify before continuing past §6.5.** Confirm:
> - Decision is APPLICABLE (with spend ceiling + drivers) or NA-with-justification from the named valid-justifications list
> - Phase 00 ideation interrogation Q9 answer matches this section

### 6.6 Locale & Language Scope (Track 18 Applicability Gate)

*Determines whether D2R Stage 00 Track 18 (Internationalization & Localization) runs for this product. Required answer (one of):*

- *"Track 18 APPLICABLE — product targets multiple locales, non-English users, or RTL-language users."*
  - *Initial supported locales (BCP-47, e.g., `en-US`, `es-ES`, `ja-JP`): [list]*
  - *Locales planned for next 12 months: [list]*
  - *RTL support required (yes/no — `ar`, `he`, `fa`, `ur` etc.): [yes/no]*
  - *Locale-aware formatting required (date/time/number/currency): [yes/no, with detail]*
- *"Track 18 NA — [justification]."*
  - *Valid justifications: product is intentionally and durably single-locale through planned lifespan; product audience is internal-English-only and there is no realistic path to localization; product is a developer tool with English-only API/CLI surface.*
  - *NA without justification is not permitted: retrofitting i18n after launch is significantly more expensive than designing for it; the decision must be explicit, not silent.*

This applicability decision feeds into TRD §3.11 (Internationalization Requirements). Track 18 outputs land in TRD §3.11 + TQVCD §7.6 (i18n Gates) + UXD §6.5 (Locale-Specific Visual Treatment if APPLICABLE).

> **Stop & Verify before continuing past §6.6.** Confirm:
> - Decision is APPLICABLE (with locale plan) or NA-with-justification from the named valid-justifications list
> - Phase 00 ideation interrogation Q10 answer matches this section
> - If APPLICABLE, UXD §6.5 must address locale-specific visual treatment in the chain audit

---

## 7. Assumptions `[independent]`

*What are you treating as given? Author one heading per assumption (`### PRD-AS-01: D2R Plan Schema Stable Across v0.3.x`). Required fields:*
- *Why this is treated as given*
- *What would invalidate it*
- *Fallback if invalidated*

---

## 8. Open Questions `[independent]`

*Author one heading per question (`### PRD-OQ-01: Should Free Tier Include Export?`). Stage 00 research should address these or Stage 01 must flag them for user decision.*

---

## 9. Out Of Scope (Deferred) `[independent]`

*What features or capabilities have been considered and explicitly deferred? Author one heading per item (`### PRD-OS-01: Multi-User Collaboration Deferred To v2.0`). Note the version or milestone at which they might become in-scope.*

---

## Amendment Protocol

*Per `references/Methodology_Versioning_And_Amendment_Protocol_2026-04-26_v01_I.md` §8 (canonical text). Authors of an instance PRD should paste the canonical Amendment Protocol section here. Summary: Phase A (authoring, pre-Stage-00) follows the inline validation hooks above; Phase B (execution amendments, Stage 00 through Stage QA) requires amendment-log entry + cross-doc audit re-run + Reversal-Cost-≥-Heavy escalation; Phase C (operational amendments, post-Stage-QA) requires amendment-log entry + ORD update if applicable + stakeholder approval refresh.*

---

## 10. Stakeholder Approvals `[requires every other section]`

*Who has approved this PRD? Without documented approval, Stage 00 should not begin.*

*Required format per stakeholder:*
- *Stakeholder name and role*
- *Approval date*
- *Approval notes (any conditions or flags)*

---

## Validation Checklist (Pre-Stage-00)

Before invoking `/dare-to-rise-code-plan`, verify:

- [ ] All required sections completed
- [ ] NA sections have one-line justifications
- [ ] Heading-prefix IDs assigned to all items per `Heading_Prefix_ID_Grammar_2026-04-26_v01_I.md`
- [ ] §1.4 Non-Visual Excellence Anchors completed (1.4.1-1.4.6 with at least 2 references per category, 5+ brand voice decisions, 2+ anti-patterns)
- [ ] Users described specifically (not "everyone" or "developers")
- [ ] Problem statement has evidence (not only intuition)
- [ ] Goals are measurable with targets and timeframes
- [ ] Non-goals explicitly named
- [ ] User journeys written from user perspective
- [ ] Success criteria quantitative where possible
- [ ] Regulatory constraints assessed (or NA justified)
- [ ] Accessibility constraints acknowledged (WCAG 2.1 AA minimum)
- [ ] §6.5 Cost applicability gate answered (Track 17 APPLICABLE or NA-with-justification matching Phase 1 Q9)
- [ ] §6.6 Locale applicability gate answered (Track 18 APPLICABLE or NA-with-justification matching Phase 1 Q10)
- [ ] Inline validation hooks acknowledged at all load-bearing sections (§1.4, §2.1, §2.3, §3.1, §6.5, §6.6)
- [ ] Amendment Protocol section present (canonical text pasted from `Methodology_Versioning_And_Amendment_Protocol_2026-04-26_v01_I.md` §8)
- [ ] `methodology_version: 0.3.0` declared in frontmatter
- [ ] Authorship parallelization markers acknowledged
- [ ] Bundle Index sidecar generated via `cdcc bundle-parse` (or noted as pending if CDCC v1.1.0 not yet available)
- [ ] Stakeholder approval documented

A PRD missing any of these is not ready for D2R.

---

## Companion Documents

This PRD is one of FIVE prerequisite inputs to `/dare-to-rise-code-plan`:

- **TRD (Technical Requirements Document)** — what the system must do technically
- **AVD (Architecture Vision Document)** — system architecture, components, data flow
- **TQVCD (Testing & Quality Criteria Document)** — what success looks like quality-wise
- **UXD (User Experience Document)** — visual design system + interaction polish criteria

See template files in the same `references/` directory.

---

## Downstream Use

This PRD feeds directly into:

**Stage 00 Tracks (consumed by):**
- **Track 6 (Design System Source-Of-Truth + Reference Curation):** consumes §2 (users) + §4 (journeys) — design must serve these users on these journeys
- **Track 9 (Threat Modeling):** consumes §2 (users for threat-actor model) + §6.2 (regulatory exposure)
- **Track 13 (Data Lifecycle & Privacy Engineering):** consumes §6.2 (regulatory) + §2 (users for data-handling consent model)
- **Track 17 (Cost Modeling & FinOps):** consumes §6.5 applicability gate
- **Track 18 (Internationalization & Localization):** consumes §6.6 applicability gate
- **Track 19 (AI/ML Engineering):** consumes §1.4.5 brand voice for AI-specific anti-patterns + §6.2 if AI-regulatory
- **Track 20 (Compliance & Regulatory):** consumes §6.2 + Phase 1 Q12 applicability gate

**Stage 01a (Skeleton authorship):** uses §3 goals + §4 journeys + §5 success criteria as backwards-planning anchor.

**Stage 01b (Full plan authorship):** writes Deep-spec content consistent with §1.4 non-visual excellence anchors (operational ergonomics, failure communication, audit trail, documentation excellence) — the implementer's defaults are constrained by these anchors at authoring time, not at polish time.

**Stage NN+1 Design Polish:** UXD references PRD §1.4 anchors for cross-surface quality (visual + non-visual must both reach the qualitative bar declared here).

**Stage QA:** acceptance tests verify §5 success criteria; reviewer-checklist tests verify §1.4 non-visual brand voice decisions and absence of §1.4.6 anti-patterns.

**Cross-doc alignment chains (Phase 02 of `/ideate-to-d2r-ready` audit):**
- **User consistency chain:** PRD §2 ↔ TRD §2.2 user-facing behavior ↔ TQVCD §6 accessibility population ↔ UXD §1.1 reference apps + §4 IA
- **Cost applicability chain:** Phase 1 Q9 ↔ PRD §6.5 ↔ TRD §3.10 ↔ TQVCD §7.5
- **i18n applicability chain:** Phase 1 Q10 ↔ PRD §6.6 ↔ TRD §3.11 ↔ TQVCD §7.6 ↔ UXD §6.5
- **Compliance applicability chain:** Phase 1 Q12 ↔ PRD §6.2 ↔ TRD §3.4 ↔ TQVCD §10.4
