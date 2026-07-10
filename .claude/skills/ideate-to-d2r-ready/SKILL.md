---
name: ideate-to-d2r-ready
description: "Walk a user from an app idea to all six D2R prerequisite documents (PRD, TRD, AVD, TQVCD, UXD, PSCAD) completed and approved. Triggers on: '/ideate-to-d2r-ready', '/idea-to-d2r', 'ideate to d2r', 'app idea to D2R', 'prep D2R inputs', 'author D2R prerequisites'. Interrogates the idea for PRD-readiness AND UXD-readiness AND production-pattern-readiness (per Mod 8 Pattern-Space Coverage Audit) AND accessibility-floor-readiness (NEW per 2026-05-05 D2R Accessibility Floor Update — Q18/Q19/Q20 cover cognitive ADHD-conscious design / reading dyslexia-conscious typography / vision user-controlled theme toggle as the LIVED accessibility floor that complements the legal WCAG 2.1 AA floor), orchestrates the six authorship skills in sequence (PSCAD authored deliberately AFTER TQVCD per Phase 01 Step 01.6), runs a cross-doc consistency audit (including the three-way TRD↔UXD↔TQVCD standards alignment check + PSCAD↔TQVCD pattern-space-coverage chain + PSCAD↔TRD §perf-and-reliability chain + accessibility lived-floor chain), and presents the six approved documents ready for /dare-to-rise-code-plan consumption."
---

# Ideate To D2R Ready

## Purpose

Orchestrate an app idea from raw ideation to six approved D2R prerequisite documents. This is the recommended entry point when a user starts from an idea and wants to produce the full PRD + TRD + AVD + TQVCD + UXD + PSCAD bundle that `/dare-to-rise-code-plan` requires.

The skill runs five phases:

1. Ideation interrogation (pre-authorship, surfaces under-baked ideas before authorship starts; covers both PRD-readiness AND UXD-readiness)
2. Sequential authorship of the six documents via the six `/write-*` skills
3. Cross-doc consistency audit via a convergence gate at threshold 3, strict (includes the three-way TRD↔UXD↔TQVCD standards alignment check)
4. Bundle approval gate
5. Optional portable prompt generation for handoff to another thread or LLM

Individual authorship skills (`/write-prd`, `/write-trd`, `/write-avd`, `/write-tqvcd`, `/write-uxd`, `/write-pscad`) remain invokable standalone. This orchestrator is the recommended path when starting from an idea or when any of the six documents is missing.

## When to Use

- User has an app idea and wants to produce all D2R prerequisite documents end-to-end
- User invokes `/ideate-to-d2r-ready` or an equivalent trigger
- User is preparing inputs for an experimental D2R run across multiple planner LLMs — the same document bundle fed to each planner
- User has asked for help "getting ready for D2R" without having authored any of the six documents
- User has authored a subset and wants the missing documents plus a cross-doc audit — enter at the first missing document

## When NOT To Use

- User already has all six D2R documents authored, approved, and cross-doc consistent — invoke `/dare-to-rise-code-plan` directly
- User wants to draft in the PRD template themselves without interrogation — invoke `/write-prd` standalone
- User wants only the cross-doc audit with six already-authored documents — invoke `/asae` with the Phase 02 scope block from this skill inline

## Inputs

- **App idea** — required; free text describing the product
- **Project name** — required (surfaced during Phase 00 if absent)
- **Project prefix** for filenames — required (e.g., `CC`, `DW`, `LE`) — surfaced during Phase 00 if absent
- **Planning directory** — optional; defaults to `[project-root]/docs/planning/`
- **Existing drafts** — optional; any of PRD / TRD / AVD / TQVCD / UXD already drafted will be consumed as starting points and refined rather than re-authored from scratch
- **Existing reference design assets** — optional; if user has Figma exports, screenshots, or palette specimens already prepared, paths captured for UXD authorship in Phase 01 Step 01.5

## Mode-Input-Selection Logic (NEW per LEAD §5.0 — L1 layer of META-8 cascade bb477923)

This skill dispatches on a `mode: 1|2|3|4` parameter declared at invocation (LEAD Lock L5: one skill, mode-dispatch parameter — no per-mode skill forks). Mode selection determines which required artifacts gate entry before Phase 00.0 onboarding proceeds.

**Declare mode at invocation:**

- `mode: 1` — Greenfield. No existing bundle assumed.
- `mode: 2` — Improvement (findings-driven).
- `mode: 3` — New-Feature (brownfield-extend).
- `mode: 4` — Staged Replacement (strangler-fig cutover).

**Per-mode required inputs (refuse-on-missing-artifact):**

| Mode | Required inputs | Missing-artifact refusal |
|---|---|---|
| 1 (Greenfield) | 6-doc bundle (PRD, TRD, AVD, TQVCD, UXD, PSCAD) — authored BY this skill's own Phase 01, not a precondition | N/A — Mode 1 is the bundle-authoring path itself |
| 2 (Improvement) | Existing 6-doc bundle (on-demand — required only if a bundle-dependent step is reached) + **Findings Ledger** (per LEAD §3 schema 3: findings[] with id, severity, source, verification status, fix-stage mapping) | If Findings Ledger absent: refuse and point to its authoring path (Findings Ledger is authored from hostile-review output / gate logs / user reports — no `/write-*` skill exists for it yet in this bundle; escalate to the user for the authoring source). If bundle absent when a bundle-dependent step is reached: refuse and point to `/ideate-to-d2r-ready mode=1` to author it first. |
| 3 (New-Feature) | Bundle (required, not on-demand) + **Capability Spec** (per LEAD §3 schema 4: capability_pr_faq, acceptance_criteria_summary, success_criteria_summary, integration points, rollout_strategy, canary_rings, kill_switch_flag) + **Bundle Delta Plan** authored in-flight (per Lock L6 — Mode 3 updates the 6-doc bundle inline; the Delta Plan is produced during the run, not required at entry) | If bundle absent: refuse and point to `/ideate-to-d2r-ready mode=1` to author it first. If Capability Spec absent: refuse and point to its authoring path (no `/write-*` skill exists for it yet — escalate to the user or the capability-decision source document). |
| 4 (Staged Replacement) | Bundle (required) + **Cutover Plan** (per LEAD §3 schema 5: OLD/NEW state models, cutover events[], routing/gateway plan, data-consistency checks, rollback-per-event) | If bundle absent: refuse and point to `/ideate-to-d2r-ready mode=1` to author it first. If Cutover Plan absent: refuse and point to its authoring path (no `/write-*` skill exists for it yet — escalate to the user or the replacement-decision source document). |

**Default-mode rule:** if `mode` is absent at invocation, do NOT silently assume Mode 1. Interactively confirm which mode applies before proceeding to Phase 00.0. This mirrors the existing Prerequisite-Inputs discipline (mirrors the missing-required-artifact refusal already in place for the 6-doc bundle) and is the L1 layer of the broader META-8 cascade (cascade id bb477923) that governs how D2R input-doc structure changes propagate through downstream alignment-chain logic rather than being handled as a silent file-rename.

**Refusal format (any mode, any missing required artifact):**

```
Mode [N] requires [artifact name], which is not present.
Pointer: [authoring path — /write-* skill, or escalation to user/source document if no skill exists yet].
This skill will not proceed until [artifact name] is available or explicitly waived by the user.
```

Once mode is confirmed and required inputs are validated (or their absence explicitly accepted where the input is on-demand, per Mode 2), proceed to Phase 00.0 Onboarding.

## Execution Protocol

### Phase 00.0: Onboarding (NEW per LEAD §4 — recap of the approved 8-stage plan's `/ideate-to-d2r-ready` rewrite scope)

Runs before Phase 00 Ideation Interrogation. Establishes the working relationship for this session and confirms how the user wants to work before any interrogation content is collected.

**Greeting — no time-estimates.** Open with a plain-language greeting describing what this skill does (idea → six D2R prerequisite documents) and what happens next. Do NOT include any time-estimate, duration guess, or "this should take about X" framing — session length varies too widely by idea complexity and user pacing to respond honestly with a number, and a wrong number sets a bad expectation. If the user asks directly how long it will take, say so plainly rather than fabricating a figure.

**Chat-vs-upload path selection.** Ask the user which mode of idea-transfer they prefer for this session:
- **Chat path** — the user describes the idea conversationally; this skill asks the Phase 00 interrogation questions one at a time (or in small batches) as a dialogue.
- **Upload path** — the user has existing material (a doc, notes, a deck, a voice memo, a video walkthrough) that already contains the idea; this skill ingests it first and pre-fills as many Phase 00 answers as it can from the material, then interrogates only the gaps.

Do not assume which path the user wants. Ask explicitly and proceed on their answer.

**Idea-development assessment.** Before diving into the twenty Phase 00 questions, assess out loud (briefly) how developed the idea sounds from what the user has said or uploaded so far: fully-formed-with-detail / partially-formed / early-spark. This sets expectations for how much interrogation is ahead — a fully-formed idea may sail through Phase 00 quickly; an early-spark idea will need more back-and-forth. State the assessment plainly; do not pair it with a time-estimate (per the no-time-estimates rule above).

**Media handling — acknowledge the transcription gap.** If the user's upload path includes audio or video material (a voice memo, a recorded walkthrough, a video demo), explicitly acknowledge that this skill does not have a built-in audio/video transcription capability — the user needs to supply a transcript (or this skill needs to hand off to a transcription tool first) before that material's content can feed Phase 00 answers. Do not silently skip audio/video uploads or pretend to have processed them. Name the gap, then ask the user how they want to proceed (provide a transcript themselves / use an external transcription tool / describe the content verbally instead).

**ASAE gate at phase end.** Before proceeding to Phase 00 Ideation Interrogation, run an ASAE gate over the Phase 00.0 onboarding outputs (mode confirmed if it was ambiguous, path selected, idea-development assessment recorded, media-gap disposition recorded) at threshold 2 standard. This is a lightweight onboarding-completeness gate, not a content-quality gate — it confirms the session is set up correctly, not that the idea itself is sound (that's Phase 00's job).

Report completion in-thread with a one-line confirmation before proceeding to Phase 00.

### Phase 00: Ideation Interrogation

Before touching any authorship template, interrogate the idea for PRD-readiness AND UXD-readiness AND applicability-gate readiness AND non-visual-excellence readiness AND runtime-egress readiness (per Mod 12 / A22) AND accessibility-floor readiness (NEW 2026-05-05 D2R Accessibility Floor Update — cognitive / reading / vision lived-floor questions). Each of the twenty questions below gets an explicit answer captured. Do not proceed to Phase 01 until all twenty pass.

Questions 1-5 cover PRD-readiness (the original interrogation set). Questions 6-8 cover UXD-readiness (added 2026-04-25 per the F13-class lesson: visual design needs reality-anchor inputs at ideation time, not after PRD/TRD/AVD/TQVCD are already locked). Questions 9-12 cover applicability-gate readiness for D2R Stage 00's four applicability-gated tracks — Cost (17), Internationalization (18), AI/ML (19), Compliance (20) — added 2026-04-26 with the 16+4 track Stage 00 expansion. Questions 13-16 cover non-visual excellence anchor readiness for PRD §1.4 (added 2026-04-26 in methodology v0.3.0): the F13-equivalent reality-anchor lesson applied to operational ergonomics, failure communication, audit-trail rendering, and documentation. Question 17 covers runtime-egress readiness (added 2026-04-27 per Mod 12 / A22). **Questions 18-20 cover accessibility-floor readiness (added 2026-05-05 per D2R Accessibility Floor Update — cognitive ADHD-conscious design / reading dyslexia-conscious typography / vision user-controlled theme toggle):** the lived-floor expansion that complements the legal WCAG 2.1 AA floor; each question forces an explicit floor-applicability decision and seeds UXD §3.5/§5.5/§5.6/§5.7 + TQVCD §6.5/§6.6/§6.7 authorship. Without these decisions at ideation time, the lived floor is silently omitted and the app ships MVP-deployable-failed regardless of WCAG compliance because daily-driver-instrument users (neurodivergent / dyslexic / low-vision / variable-light-environments) cannot adopt and sustain use.

Applicability-gate and non-visual-anchor and accessibility-floor questions establish EXPLICIT decisions at ideation time; silent skips at Stage 00 are not permitted.

**Interrogation questions:**

1. **Who specifically is this for?**
   - Force segment specificity. Reject "everyone", "developers", "users", "people who need X".
   - Require: role, context, the constraints they operate under, and enough specificity that three real people could be named fitting the description.
   - Fail condition: the user answers with a generic demographic label.
   - Example pass: "Instructional designers working at NGOs in low-resource contexts who operate under $0 tooling budgets and need offline-capable authoring."
   - Example fail: "Developers who want better AI tools."

2. **What problem are you solving?**
   - Force evidence. Reject problems stated only as intuition or "it would be cool if".
   - Require at least one of: "I've observed X repeatedly in my work", documented pain point, user research finding, cited statistic, or a failure mode seen in production.
   - Fail condition: the user cannot describe the problem in the users' terms or cannot name evidence.
   - Example pass: "I've run 40+ Claude Code sessions for planning work and hit the same token-budget surprise on 31 of them — no tool surfaces a pre-run estimate or a post-run variance."
   - Example fail: "It would be great if there were a way to see costs."

3. **Why now?**
   - Force environment-change specificity. Reject "AI has made this possible" (too vague).
   - Require: a specific recent change in technology, market, user population, regulation, or organizational state that makes this solvable now when it wasn't before.
   - Fail condition: the user cannot name a specific change.
   - Example pass: "Claude 4.7's tokenizer change introduced ~35% per-call overhead vs. 4.6. No public library accounts for this yet; existing cost estimators are wrong by a measurable margin."
   - Example fail: "AI is moving fast."

4. **What's the one-line description?**
   - Force outcome terms, not implementation terms. Reject "uses LLMs to...", "built with Tauri to...", "is an AI agent that...".
   - Require: one sentence describing what the user achieves, not how it's built.
   - Fail condition: the sentence leads with technology or is longer than one sentence.
   - Example pass: "Users see an accurate pre-run cost estimate for a Claude Code session and a post-run variance report against that estimate."
   - Example fail: "A Tauri app that uses the Anthropic SDK and Zod schemas to estimate Claude costs."

5. **Any hard constraints from day one?**
   - Walk the user through each category explicitly so "none" is an informed answer: budget, timeline, regulatory, platform, accessibility, organizational, data-sensitivity, team-size.
   - Accept "none" per category only after explicit consideration.
   - Record any hard constraints for propagation into PRD Section 6 and TRD Section 6.

6. **What does excellence look like for this product visually? (Reference apps with screenshots)**
   - Force concrete reference apps with actual screenshots, not adjectives. Reject "modern", "clean", "professional", "polished" without specific named anchors.
   - Require: at least 2 named existing apps that capture the visual + interaction character this product should embody. For each: app name + what specifically about it is the reference (the layout, the typography, the interaction feel, the empty states, etc.) + screenshot path or URL.
   - Fail condition: the user cannot name reference apps OR cannot provide screenshots OR provides reference apps without specifying what about them is the anchor.
   - Example pass: "Linear (for the keyboard-first command palette + the way it renders empty states with concrete next-step suggestions); Vercel dashboard (for the typography system and the deliberate use of monospace only for data, never prose). Screenshots at `inputs/uxd-refs/linear-empty.png` and `inputs/uxd-refs/vercel-typography.png`."
   - Example fail: "Something modern and clean, like a typical SaaS app."
   - This is the F13-equivalent reality anchor for the visual layer. Without screenshots, the reference set is words-only and re-introduces the fictional-validation tautology. Hold the gate.

7. **What's the brand voice expressed visually? (5+ concrete decisions, not adjectives)**
   - Force concrete visual decisions, not aesthetic adjectives. Reject "modern", "minimal", "warm", "professional" without explicit downstream-implementable choices.
   - Require: 5-10 concrete visual decisions that express the brand voice. Named anti-patterns count and are encouraged ("no purple gradients ever"; "monospace only for data, never for prose").
   - Fail condition: the user answers with adjectives only OR fewer than 5 concrete decisions.
   - Example pass: "Rounded corners on interactive elements, sharp on data-display surfaces. Generous whitespace, never crowded. No purple gradients, ever. Monospace only for code/timestamps/IDs, never for prose. Color used sparingly for state (success/warning/danger) — most of the UI is grayscale + one accent. No drop shadows on cards; use 1px borders + background contrast instead."
   - Example fail: "Modern, clean, professional, and warm but serious."

8. **What's the most-likely-bland anti-pattern your implementer is going to fall into?**
   - Force articulation of the failure mode the visual layer is most likely to default to. This is the F13-prevention question explicitly: it makes the "implementer falls back to generic-component-library defaults" failure mode visible at ideation time, where it can be designed against, not at Stage NN+1 Design Polish where it's already shipped.
   - Require: at least 1 concrete anti-pattern named with what-it-looks-like + why-it's-anti + what-to-do-instead.
   - Fail condition: the user cannot name a specific anti-pattern, OR names a generic concern ("looks bad") without specificity.
   - Example pass: "Most likely fallback: generic React-component-library cards with default rounded corners + drop shadows + the 'professional SaaS' color palette of indigo-on-white. What it lacks: any of the brand-voice decisions in Question 7. Replacement: borders not shadows; grayscale base with single accent; rounded only on interactive, sharp on data surfaces."
   - Example fail: "I'm worried it'll look generic."

9. **Cost — non-trivial infrastructure spend expected? (Track 17 applicability gate)**
   - Force an explicit decision: APPLICABLE or NA-with-justification. Silent skip not permitted.
   - APPLICABLE answer requires: expected monthly infrastructure spend ceiling at MVP (USD), cost-driving components anticipated (compute / storage / egress / third-party APIs / AI inference / etc.), and unit-economics target if commercial.
   - NA answer requires a specific justification from the valid-justifications list: personal/local-only app with no hosted infra; static-site product with negligible serving cost; product where infra spend is bundled into a parent product's existing budget and out-of-scope here.
   - Fail condition: vague answer ("probably not much"), no spend ceiling for APPLICABLE, or NA without naming a justification.
   - Example pass (APPLICABLE): "APPLICABLE. Expected MVP spend ceiling: $400/month. Cost drivers: AI inference (~70%), compute (~20%), egress (~10%). Unit-economics target: <$0.05 per active user per month."
   - Example pass (NA): "NA. This is a personal CLI tool that runs locally with no hosted infrastructure; cost is bounded by the user's local machine."
   - This decision feeds into PRD §6.5 + TRD §3.10 + TQVCD §7.5.

10. **Locale — non-English / multi-locale users? (Track 18 applicability gate)**
    - Force an explicit decision: APPLICABLE or NA-with-justification. Silent skip not permitted.
    - APPLICABLE answer requires: initial supported locales (BCP-47), locales planned for next 12 months, RTL support requirement, and locale-aware formatting requirement.
    - NA answer requires a specific justification: product is intentionally and durably single-locale through planned lifespan; product audience is internal-English-only with no realistic localization path; product is a developer tool with English-only API/CLI surface.
    - Fail condition: vague answer ("we'll add languages later"), no locale list for APPLICABLE, or NA without naming a justification.
    - Example pass (APPLICABLE): "APPLICABLE. Initial: en-US, es-ES. Next 12 months: ja-JP, de-DE. RTL: not yet but architecture must support. Locale-aware date/number/currency formatting required from day one."
    - Example pass (NA): "NA. Developer-facing CLI for an English-only Anthropic-internal audience. No localization path planned within the product's expected 18-month lifespan."
    - This decision feeds into PRD §6.6 + TRD §3.11 + TQVCD §7.6.

11. **AI-native — AI in user-facing critical path? (Track 19 applicability gate)**
    - Force an explicit decision: APPLICABLE or NA-with-justification. Silent skip not permitted.
    - APPLICABLE answer requires: AI use cases in user-facing critical path (specific features), model(s) targeted (provider + model name + version pinning posture), eval-suite intent (gold-set source, accuracy targets, OWASP LLM Top 10 coverage targets), latency budget per AI call, and cost observability requirement (cross-references Q9 if cost is also APPLICABLE).
    - NA answer requires: AI is not in the user-facing critical path. AI used internally for development tooling (e.g., Claudette / D2R itself) does not require Track 19 acceptance for the product being built — only for the development tooling's own product.
    - Fail condition: vague answer ("it might use AI"), no model/eval plan for APPLICABLE, or NA when AI is clearly in the critical path.
    - Example pass (APPLICABLE): "APPLICABLE. Feature: real-time content suggestions. Model: Claude Sonnet 4.6 (pinned). Eval suite: 200-prompt gold set covering safety, accuracy, refusal-correctness; OWASP LLM Top 10 jailbreak resistance for items 1-3-6. Latency budget: p95 <2s. Cost observability: yes (cross-references Q9 cost APPLICABLE)."
    - Example pass (NA): "NA. The product has no AI in user-facing flows. Internal AI use (Claudette for the dev workflow) is out-of-scope for this product's Track 19."
    - This decision feeds into TQVCD §10.3 (AI/ML acceptance criteria).

12. **Regulatory scope? (Track 20 applicability gate)**
    - Force an explicit decision: APPLICABLE or NA-with-justification. Silent skip not permitted.
    - APPLICABLE answer requires: applicable framework(s) (HIPAA / PCI-DSS / SOC 2 / FedRAMP / GDPR Article 30 / FERPA / COPPA / EU AI Act / state-law-equivalents like CCPA/CPRA), specific data classes triggering scope, evidence-collection posture (manual / programmatic / hybrid), audit-readiness target date if known, and incident-response runbook commitment.
    - NA answer requires: no regulated data classes processed AND no compliance framework imposed by customer/contract/jurisdiction. NA is harder to justify than other applicability gates because privacy regulations (GDPR / CCPA) often apply by default once any user data is processed.
    - Fail condition: vague answer ("we'll worry about compliance later"), no framework named for APPLICABLE, or NA without affirmatively ruling out the common-default frameworks (GDPR for any product reachable by EU users, CCPA for any product reachable by California users).
    - Example pass (APPLICABLE): "APPLICABLE. Frameworks: GDPR Article 30 (we have EU users), SOC 2 Type II (customer-required by Q4). Data classes triggering: user account data, content user creates, usage telemetry. Evidence collection: programmatic via vendor (Vanta) with manual review. Audit-readiness target: 2026-Q3."
    - Example pass (NA): "NA. Personal local-only product with no user-data persistence beyond the local machine. No EU/California user reach because the product is not distributed publicly."
    - This decision feeds into TQVCD §10.4 (Compliance audit-readiness criteria) + cross-references PRD §6.2 (Regulatory Constraints) + TRD §3.4 (Privacy Requirements).

13. **What does excellent OPERATIONAL ergonomics look like for this product? (Reference products with what-specifically-is-the-anchor)**
    - Force concrete reference products for operator/CLI/API ergonomics. Reject "should be CLI-friendly" or "good developer experience" without specific named anchors.
    - Require: at least 2 named existing products + what specifically about each is the operational reference (CLI grammar / dry-run pattern / verb-noun command structure / structured output formats / pre-action communication / etc.) + path or URL to documentation evidence.
    - Fail condition: cannot name reference products OR cannot specify what about them is the operational anchor OR provides only adjectives.
    - Example pass: "Stripe CLI (for the way it tells you what's going to happen before it happens; --dry-run shows the exact request without sending. https://stripe.com/docs/cli); gh CLI (for structured `--json` output formats and consistent verb-noun command grammar. https://cli.github.com/)."
    - Example fail: "Should have a good CLI."
    - This is the F13-equivalent reality anchor for the operational layer. Without named operator/CLI/API references, the implementer's default is "generic Commander.js scaffolding" — internally consistent, externally bland. Hold the gate.
    - This decision feeds into PRD §1.4.1 Operational Ergonomics Anchors.

14. **What does excellent FAILURE COMMUNICATION look like for this product? (Reference products)**
    - Force concrete reference products for how the product communicates during incidents/errors/degradation. Reject "good error messages" without named anchors.
    - Require: at least 2 named existing products + what specifically about each is the failure-communication reference (cause + impact + scope + ETA + workaround discipline; remediation suggestion as structural; transparent recovery messaging; etc.) + path or URL.
    - Fail condition: cannot name reference products OR provides only "errors should be helpful" adjectives.
    - Example pass: "Cloudflare status page (for incident communication discipline: cause + impact + scope + ETA + workaround in every report. https://www.cloudflarestatus.com/); Linear error states (for explaining what's wrong AND what the user can do — remediation suggestion is structural not optional)."
    - Example fail: "Errors should be user-friendly."
    - This decision feeds into PRD §1.4.2 Failure-Communication Anchors AND constrains UXD §3.2 catastrophic state copy + UXD §3.4 catastrophic failure voice.

15. **What does excellent AUDIT-TRAIL rendering look like for this product? (Reference products)**
    - Force concrete reference products for how the product captures and surfaces "what happened, why, by whom." Reject "we'll log things" without specific structure references.
    - Require: at least 2 named existing products + what specifically about each is the audit-trail reference (structured who/what/when/result fields; queryable; commit-message-as-load-bearing communication; tamper-evident; etc.) + path or URL.
    - Fail condition: cannot name reference products OR cannot specify what about each is the structural reference.
    - Example pass: "AWS CloudTrail (for structured who/what/when/result fields per event; queryable); Git itself (for every change has a message; the message is enforced as load-bearing communication, not optional metadata)."
    - Example fail: "We should have audit logs."
    - This decision feeds into PRD §1.4.3 Audit-Trail Anchors AND cross-references TRD §3.8 observability + AVD-AC observability components + the audit-trail patterns at every layer of the system.

16. **What does excellent DOCUMENTATION look like for this product? (Reference products)**
    - Force concrete reference products for how docs answer "why" before "how." Reject "docs should be clear" without anchors.
    - Require: at least 2 named existing products + what specifically about each is the documentation reference (concept-first-then-API; side-by-side language examples; runnable examples; "why" before "how" structurally; etc.) + path or URL.
    - Fail condition: cannot name reference products OR cannot specify what about each is the structural reference.
    - Example pass: "React docs post-2023 rewrite (for concept-first then API. https://react.dev/); Stripe API docs (for every endpoint having a curl + node + python + ruby example side-by-side. https://stripe.com/docs/api)."
    - Example fail: "Docs should be helpful."
    - This decision feeds into PRD §1.4.4 Documentation Excellence Anchors AND constrains every README, every CHANGELOG, every API doc the project produces.

17. **Runtime third-party destinations — what data leaves your app to where? (Mod 12 / A22 Runtime Egress Disclosure readiness)**
    - Force enumeration of every outbound network call destination the runtime will make. Reject "we'll figure that out later" — runtime egress is a TRD §3.5 + ASAE A22 attestation requirement and ships at refuse-grade once implementation begins (per Mod 12 fail-closed full-whitelist enforcement).
    - Require: per destination — hostname or URL pattern + protocol (HTTP / WS / WebRTC / TCP / UDP / DNS — all IP-protocol egress in scope) + data classification (user_input / derived_from_user_input / metadata / telemetry) + purpose (1-line) + user_consent_gate (required / not_required + rationale) + retention_per_their_tos (link to third-party privacy policy + last-checked date) + proxy_architecture (direct / via_own_server).
    - Acceptable answer "no third-party destinations — fully first-party" only after explicit consideration of: analytics services, error tracking (Sentry/Bugsnag/etc.), CDN font loaders (Google Fonts / Adobe Fonts), payment processors, authentication providers (OAuth/OIDC), AI APIs (OpenAI/Anthropic/etc.), email providers (Mailgun/SendGrid), file storage (S3/R2/etc.), search providers (Algolia/etc.), feature-flag services (LaunchDarkly/etc.), maps APIs, translation APIs, document-rendering services (PlantUML/Mermaid/etc.).
    - Empirical motivation: drwrite renders PlantUML diagrams by POSTing user-typed content to a third-party PlantUML server. User has no idea their text is being shipped externally. No disclosure surface, no consent gate, no attestation record. Mod 12 / A22 requires every outbound destination to be explicitly attested OR explicitly first-party — fail-closed for ALL data classifications (no carve-out for metadata/telemetry per Cody-influenced refinement 2026-04-27 evening).
    - Fail condition: cannot enumerate destinations OR cannot specify data classification per destination OR claims "no third parties" without explicitly considering the standard categories above.
    - Example pass: "Three runtime third-party destinations: (1) api.openai.com (HTTPS) — user_input — for AI completion — user_consent_gate required (privacy notice + opt-in checkbox at signup) — retention per OpenAI ToS (https://openai.com/policies/api-data-usage-policies/, last-checked 2026-04-27) — proxy_architecture: via_own_server (api.openai.com calls go through our edge function for rate-limit handling); (2) o123.ingest.sentry.io (HTTPS) — metadata + derived_from_user_input (error stacks may contain user data) — for error reporting — user_consent_gate not_required (rationale: errors only sent if user opts in to crash reporting at first-run; deny by default) — retention per Sentry ToS (https://sentry.io/legal/dpa/, last-checked 2026-04-27) — proxy_architecture: direct; (3) fonts.googleapis.com (HTTPS) — metadata only (no user content; CDN font fetch) — for typography — user_consent_gate required (cookie consent banner per GDPR) — retention per Google Fonts ToS (last-checked 2026-04-27) — proxy_architecture: direct (alternative: self-host fonts to remove this destination — flagged for TRD design pass)."
    - Example fail: "We just use a few APIs."
    - This decision feeds into TRD §3.5 Security third-party-destinations subsection AND ASAE A22 attestation block (per Mod 12 of Methodology Mods Batch 2). Hook v07+ Tier 23 (when active) verifies tandem-update consistency between TRD §3.5 and A22 attestation. Hook v07+ Tier 24 (when active) refuses commits where outbound network calls don't match the attested whitelist.

18. **Cognitive accessibility floor — does the product have focused-work surfaces? (LIVED FLOOR readiness, NEW 2026-05-05)**
    - Force an explicit decision: APPLICABLE or NA-with-justification. Silent skip not permitted.
    - APPLICABLE answer requires: confirmation that the product has surfaces where users do focused work (writing / reading / coding / planning / editing / etc.) AND commitment to ship the cognitive accessibility floor — zen-focus default mode (minimal chrome; quiet visual environment), no unsolicited modal interruption (modals fire on user action only), cognitive-load-aware defaults (sensible first-launch defaults so user does not have to make decisions before working), friction-at-entry minimized (time-to-first-productive-action measurable and bounded). User commits to authoring TQVCD-EC-Access-Cog-01..04 entries + UXD §5.5 design specs.
    - NA answer requires a specific justification: product genuinely has no focused-work surface (e.g., webcam-only video chat thumbnail viewer; numeric dashboard with chart-only content; one-action utility like "open VPN connection").
    - Fail condition: vague answer ("we'll think about ADHD users later"); APPLICABLE without commitment to the four floor elements; NA without naming a non-focused-work product domain.
    - Example pass (APPLICABLE): "APPLICABLE. Markdown editor — primary surface is the editing pane where users write for extended periods. Will ship: zen-focus default with sidebar collapsed; modals only on user explicit action; first-launch opens to blank document with no onboarding wizard; time-to-first-keystroke target <500ms p95."
    - Example pass (NA): "NA. Product is a one-action CLI utility (`vpn up` / `vpn down`); no focused-work surface; cognitive-load floor does not apply."
    - Empirical motivation: Krystal's daily-driver markdown editor (DrWrite) — ADHD-mediated work needs zen-focus environment as floor, not feature. The cognitive floor mandates discipline; per-app UXD §5.5 specifies the manifestation.
    - This decision feeds into TQVCD §6.5 (TQVCD-EC-Access-Cog-01..04) + UXD §5.5 (UXD-UP-Cog-01..04) + PRD §1.4.4 friction-at-entry bound declaration.

19. **Reading accessibility floor — does the product have rich-text/WYSIWYG/prose surfaces? (LIVED FLOOR readiness, NEW 2026-05-05)**
    - Force an explicit decision: APPLICABLE or NA-with-justification. Silent skip not permitted.
    - APPLICABLE answer requires: confirmation that the product has rich-text / WYSIWYG / prose-rendering / document-viewer surfaces AND commitment to ship the reading accessibility floor — at least one research-backed dyslexic-friendly font available as user-selectable option from candidate set (Lexend / OpenDyslexic / Atkinson Hyperlegible — all free / OFL-licensed); tunable letter-spacing / line-height / paragraph-width on rich-text surfaces; code surfaces excluded from font swap (monospace retained); font + tuning preference persistence. User commits to picking AT LEAST ONE candidate font; per-app UXD §5.6 picks the specific font(s).
    - NA answer requires a specific justification: product has no rich-text / WYSIWYG / prose / document-viewer surface (e.g., CLI-only tool with no GUI prose; numeric dashboard with chart-only content; webcam viewer).
    - Fail condition: vague answer ("we'll add dyslexic font later"); APPLICABLE without picking at least one candidate; NA when product clearly has prose surfaces.
    - Example pass (APPLICABLE): "APPLICABLE. Markdown editor — both editor pane and rendered preview are rich-text/prose surfaces. Picking Lexend as the dyslexic-friendly alternative font (strongest reading-speed evidence per Renaissance Learning research; OFL-licensed, free). Will ship: settings-panel font toggle (default sans-serif / Lexend); tunable line-height + letter-spacing on preview pane; code blocks always monospace; preferences persist via user-account-setting."
    - Example pass (NA): "NA. Product is a numeric dashboard with chart-only content; no prose / rich-text surface; reading-floor does not apply (legal §6.4 alt-text on charts still applies)."
    - Empirical motivation: Krystal's profile (dyslexic) — dyslexic-friendly font on WYSIWYG side is non-negotiable for daily-driver-instrument use. Honest gap acknowledgment: dyslexia-font research has live debate (OpenDyslexic mixed evidence; Lexend stronger; Atkinson Hyperlegible BVI-primary); the floor mandates AT LEAST ONE — don't relitigate the research at the floor level; per-app UXD picks.
    - This decision feeds into TQVCD §6.6 (TQVCD-EC-Access-Read-01..04) + UXD §5.6 (UXD-UP-Read-01..04) + UXD §2.2 typographic scale (alternative font integration).

20. **Vision accessibility floor — does the product have significant text content? (LIVED FLOOR readiness, NEW 2026-05-05; HIGHEST-SEVERITY-CLASS)**
    - Force an explicit decision: APPLICABLE or NA-with-justification. Silent skip not permitted.
    - APPLICABLE answer requires: confirmation that the product has significant text content AND commitment to ship the vision accessibility floor — dark/light theme toggle MANDATORY (user-controlled, not just system-follow; system-follow MAY be one option but cannot be the ONLY option); both themes WCAG 2.1 AA contrast (body text AND code where applicable, in BOTH themes — single-theme passing is not passing); theme persistence across sessions; no surprise re-themes (no auto-switch mid-session without explicit user action, excluding system-follow mode). User commits to authoring TQVCD-EC-Access-Vis-01..04 entries + UXD §3.5 theme system + UXD §5.7 vision design specs.
    - NA answer requires a specific justification: product has no significant text content (e.g., webcam-only video chat; pure-numeric trading interface that user only glances at; transient toast notification system). NA is HARDER to justify than other floors because most apps have significant text content in some form.
    - Fail condition: vague answer ("dark mode would be nice eventually"); APPLICABLE with system-follow-only proposed (per UXD §5.7-Vis-01 + §5.8 refusal table this REFUSES at HIGH); NA when product clearly has significant text content.
    - Example pass (APPLICABLE): "APPLICABLE. Markdown editor — text-primary product. Will ship: in-app theme toggle (settings panel + keyboard shortcut); light + dark palettes both verified WCAG 2.1 AA contrast for body + code; theme choice persists via user-account-setting; system-follow available as one option (not the only option); no time-of-day auto-switch in user-explicit-light mode."
    - Example pass (NA): "NA. Product is a pure webcam-thumbnail viewer with no text labels beyond timestamps; no significant text content; vision-floor theme-toggle does not apply (dark webcam thumbnails work fine in any system theme)."
    - Empirical motivation: Krystal's profile (vision needs) — dark/light toggle non-negotiable, system-follow not sufficient. Honest gap acknowledgment: theme-toggle implementation is stack-dependent (Tauri / Electron / SvelteKit each have idiomatic patterns) — the floor mandates the requirement at the design layer; the sandbox-rules-* docs cover stack-specific implementation; cross-reference, don't duplicate.
    - This decision feeds into TQVCD §6.7 (TQVCD-EC-Access-Vis-01..04) + UXD §3.5 theme system + UXD §5.7 (UXD-UP-Vis-01..04) + UXD §2.1 color tokens (BOTH light + dark hex values mandatory per v03 expansion).

**On fail for any question:**

Surface the insufficiency explicitly. Do not soften. Use this format:

```
Phase 00 — Question [N] ([label]): insufficient.
Reason: [specific diagnosis — what the answer lacks].
Next-step questions:
- [specific follow-up 1]
- [specific follow-up 2]
- [specific follow-up 3]

This skill will not proceed to PRD authorship until Question [N] is answered adequately.
```

Where the user is stuck, offer 2–3 candidate drafts for the user to react to, drawn from the idea context. Drafts first, not open-ended questions.

**On pass:**

Produce a Phase 00 summary block containing:
- The twenty answers (Questions 1-5 PRD-readiness; Questions 6-8 UXD-readiness; Questions 9-12 applicability-gate readiness; Questions 13-16 non-visual-excellence readiness; Question 17 runtime-egress readiness; **Questions 18-20 accessibility-floor readiness, NEW 2026-05-05**)
- Project name
- Project prefix
- Planning directory
- Captured hard constraints (per Question 5)
- Reference design assets paths (per Question 6) — screenshots stored at the user-specified or default `[planning-directory]/uxd-assets/[YYYY-MM-DD]/`
- Captured visual brand-voice decisions (per Question 7)
- Captured visual anti-pattern targets (per Question 8)
- Track applicability decisions table (Questions 9-12):

  | Track | Question | Decision | Justification or Detail |
  |-------|----------|----------|------------------------|
  | 17 (Cost) | Q9 | APPLICABLE / NA | [spend ceiling + drivers OR NA justification] |
  | 18 (i18n) | Q10 | APPLICABLE / NA | [locale plan OR NA justification] |
  | 19 (AI/ML) | Q11 | APPLICABLE / NA | [AI feature + model + eval plan OR NA justification] |
  | 20 (Compliance) | Q12 | APPLICABLE / NA | [frameworks + data classes OR NA justification] |

- Non-visual excellence anchors table (Questions 13-16):

  | Dimension | Question | Reference Products | Specific Anchor |
  |-----------|----------|--------------------|-----------------|
  | Operational ergonomics | Q13 | [App 1, App 2] | [what specifically each anchors] |
  | Failure communication | Q14 | [App 1, App 2] | [what specifically each anchors] |
  | Audit-trail rendering | Q15 | [App 1, App 2] | [what specifically each anchors] |
  | Documentation excellence | Q16 | [App 1, App 2] | [what specifically each anchors] |

- Runtime egress destinations (per Question 17) — captured for TRD §3.5 + ASAE A22 attestation
- **Accessibility floor decisions table (Questions 18-20, NEW 2026-05-05):**

  | Floor element | Question | Decision | Commitment / Justification |
  |---------------|----------|----------|----------------------------|
  | Cognitive (ADHD-conscious) | Q18 | APPLICABLE / NA | [TQVCD-EC-Access-Cog-01..04 commitment + UXD §5.5 design specs OR no-focused-work-surface NA justification] |
  | Reading (dyslexia-conscious) | Q19 | APPLICABLE / NA | [picked dyslexic-friendly font from candidate set (Lexend / OpenDyslexic / Atkinson Hyperlegible) + commitment to TQVCD §6.6 + UXD §5.6 OR no-rich-text-surface NA justification] |
  | Vision (theme toggle) | Q20 | APPLICABLE / NA | [in-app user-controlled toggle commitment + both-themes-AA contrast + persistence + no-surprise + commitment to TQVCD §6.7 + UXD §3.5 + UXD §5.7 OR no-significant-text-content NA justification] |

Save the Phase 00 summary to `[planning-directory]/[prefix]_Phase00_Ideation_Summary_[YYYY-MM-DD]_v01_I.md` per `/file-versioning` conventions. This file becomes the ideation context input for `/write-prd` in Phase 01 Step 01.1 AND for `/write-uxd` in Phase 01 Step 01.5.

Report completion in-thread with a one-line confirmation and the summary path. Present the summary for visual confirmation before proceeding.

### Phase 01: Sequential Authorship (Opus-dispatch drafting, NEW per LEAD §4)

Invoke the six authorship skills in order. Each skill runs its own convergence gate at threshold 2 (`/write-uxd` runs at `/asae domain=design` threshold 2; the others at `domain=document` threshold 2). Do not proceed to the next skill until the current document is user-approved.

**Opus-dispatch drafting.** Drafting work for each of the six authorship skills is dispatched to Opus (the planning/authorship model tier, per LEAD §5.3 — planning/authorship stays Opus, unchanged from the April design). This orchestrator does not draft document content itself; it dispatches each `/write-*` invocation as a unit of Opus work and waits for the result.

**2-sentence prompt summaries per dispatched unit.** For every dispatched drafting unit (each of the six `/write-*` invocations), report a 2-sentence summary of the prompt being dispatched before waiting on the result — one sentence naming what is being drafted and against which upstream inputs, one sentence naming the expected output artifact and gate. This keeps the dispatch visible in-thread without dumping the full prompt payload. Example: "Dispatching `/write-trd` to Opus against the approved PRD at [path] and the Phase 00 summary's hard-constraints capture. Expect a TRD draft gated at `/asae domain=document` threshold 2 before Step 01.3 AVD can start."

Report phase-by-phase progress per the no-silent-execution rule: at minimum a short in-thread confirmation at the start of each step (the 2-sentence dispatch summary above satisfies this) and the individual gate summary at the end.

**Step 01.1: PRD**

Invoke `/write-prd` with:
- Project name + project prefix from Phase 00 summary
- Phase 00 summary path (as ideation context)
- Planning directory
- Invocation context: `called from /ideate-to-d2r-ready Phase 01 Step 01.1`

Report: `/write-prd` starting against Phase 00 summary at [path].

Wait for `/write-prd` to complete its own convergence gate and Krystal's approval. Capture the resulting PRD file path.

**Step 01.2: TRD**

Invoke `/write-trd` with:
- Project name + project prefix
- PRD reference (path from Step 01.1)
- Planning directory
- Invocation context: `called from /ideate-to-d2r-ready Phase 01 Step 01.2`

Report: `/write-trd` starting against approved PRD at [path].

Wait for TRD to complete and be approved. Capture path.

**Step 01.3: AVD**

Invoke `/write-avd` with:
- Project name + project prefix
- PRD reference + TRD reference
- Planning directory
- Invocation context: `called from /ideate-to-d2r-ready Phase 01 Step 01.3`

Report: `/write-avd` starting against approved PRD + TRD.

The AVD skill assesses whether the project is trivially simple. If it produces a Skipped-Status AVD, accept that as the AVD artifact for downstream Phase 02 checks. Skipped-Status AVD is a valid artifact and does not block Phase 02.

Wait for AVD to complete and be approved. Capture path.

**Step 01.4: TQVCD**

Invoke `/write-tqvcd` with:
- Project name + project prefix
- PRD reference + TRD reference + AVD reference (path, whether full AVD or Skipped-Status)
- Planning directory
- Invocation context: `called from /ideate-to-d2r-ready Phase 01 Step 01.4`

Report: `/write-tqvcd` starting against approved PRD + TRD (+ AVD).

Wait for TQVCD to complete and be approved. Capture path.

**Step 01.5: UXD**

Invoke `/write-uxd` with:
- Project name + project prefix
- PRD reference (UXD draws user segments + journeys from PRD Sections 2 + 4)
- TRD reference (UXD's design system runs on the tech stack TRD specifies)
- Phase 00 summary path (Questions 6-8 captured the reference apps + brand voice + anti-pattern targets that seed UXD authorship)
- Reference design asset paths captured in Phase 00 (Question 6 screenshots, etc.)
- Planning directory
- Invocation context: `called from /ideate-to-d2r-ready Phase 01 Step 01.5`

Report: `/write-uxd` starting against approved PRD + TRD with reference design assets at [paths].

Wait for UXD to complete and be approved. Capture path AND reference assets directory path.

The UXD authorship gate runs at `/asae` `domain=design` threshold 2 standard (per `/write-uxd` Step 3). The cross-doc audit in Phase 02 runs at threshold 3 strict and includes the three-way TRD↔UXD↔TQVCD standards alignment check + PSCAD↔TQVCD pattern-space-coverage chain + PSCAD↔TRD §perf-and-reliability chain.

**Step 01.6: PSCAD** (NEW per Methodology Mods Batch 2 Mod 8 — 6th D2R doc; sequenced AFTER TQVCD and UXD)

Invoke `/write-pscad` with:
- Project name + project prefix
- PRD reference + TRD reference + AVD reference + TQVCD reference (path; PSCAD §4 coverage matrix references TQVCD-VC entries by id) + UXD reference (path; optional but recommended for cross-doc PSCAD §3 references to UXD §3.2 state catalog)
- Planning directory
- Invocation context: `called from /ideate-to-d2r-ready Phase 01 Step 01.6`

Report: `/write-pscad` starting against approved PRD + TRD + AVD + TQVCD (+ UXD).

The PSCAD authorship is sequenced AFTER TQVCD per Mod 8 design — the gap between TQVCD-author time and PSCAD-author time simulates "production memory accumulating since the code was tested." This delay is structural, not accidental. /write-pscad Step 1 verifies all 5 prerequisite docs exist; Step 2 loads PSCAD template + Production Pattern Catalog at `_grand_repo/docs/Production_Pattern_Catalog_2026-04-27_v01_I.md`; Steps 3a-3b walk through patterns-in-scope + coverage matrix + gaps + remediations; Step 4 verifies TQVCD §5.0 production_pattern fields populated per Mod 8.1 v05+ schema.

Wait for PSCAD to complete and be approved. Capture path AND any pattern_promotion_candidates list.

**End of Phase 01:** all six documents authored, individually gated at threshold 2, individually approved. Paths captured for Phase 02 (seven paths total: PRD, TRD, AVD-or-Skipped-Status, TQVCD, UXD, PSCAD, plus the reference assets directory). If PSCAD authorship surfaced any pattern_promotion_candidates, flag for separate ASAE strict-3 catalog-promotion gate (per Mod 8 §8) — promotion is post-Phase-2 work, not Phase 01-blocking.

**META-9 IP-Class Frontmatter Discipline (applies to all 6 docs per Methodology Mods Batch 2 META-9):**

All 6 D2R bundle docs are authored as `_I` (Internal) classification by default. Each doc's frontmatter MUST declare:

```yaml
classification: I              # I = Internal (default for working drafts), S = Shareable (external review), X = External (public release)
audience: krystal_only         # OR cody_only / shared_internal / shared_external / public — strict mapping enforced
classification_reason: Working draft for D2R Stage 00 consumption; planning-directory artifact not for external sharing
```

**Strict mapping enforced per META-9:**
- `classification: I` ↔ `audience: krystal_only` (or `cody_only` per per-user identity); LAX IP rules; methodology vocabulary clustering allowed
- `classification: S` ↔ `audience: shared_external`; STRICT IP-clean; passes Pre-Publication IP Scrub Sections 1-3; cluster-vocabulary scan
- `classification: X` ↔ `audience: public`; STRICTEST; full Pre-Publication IP Scrub + signed scrub report

**For Cody's app build path:** all 6 docs default to `classification: I` + `audience: cody_only` + `classification_reason: D2R bundle for [project name] app build; working draft`. Promotion to `_S` or `_X` is a separate audit per META-9 Layer 5 promotion gate; not in Phase 01 scope.

**Hook v07+ enforcement (when active):** Hook v07+ Tier 25 (per Batch 2 META-9 implementation) refuses commits where classification/audience mismatch the strict mapping. /ideate Phase 03 Bundle Approval verifies all 6 docs have these 3 frontmatter fields populated and consistent before marking the bundle approved.

### Phase 02: Cross-Doc Consistency Audit (Sonnet-dispatch, NEW per LEAD §4)

Individual gates catch per-document issues. This phase catches issues that only emerge when the six documents are read together.

**Sonnet-dispatch execution tier.** The cross-doc audit and its remediation-routing follow-through are execution-shaped work against an already-authored bundle (checklist traversal, chain-leg verification, routing table lookups) rather than fresh planning/authorship — this phase dispatches to Sonnet, not Opus. This mirrors LEAD §5.3's world-openness model-assignment logic: closed-world, pre-chewed execution (the audit runs against six documents that already exist, with a fully-specified checklist) sits at the execution tier rather than the planning tier. Report each dispatched audit pass with a short in-thread confirmation naming the checklist scope being run and the gate it feeds, per the no-silent-execution rule.

**Cross-doc checklist:**

- **User consistency (PRD ↔ TRD ↔ TQVCD ↔ UXD):** PRD Section 2 users appear consistently in TRD Section 2.2 user-facing behavior requirements, TQVCD Section 6 accessibility criteria target populations, AND UXD Section 1.1 reference apps + Section 4 information architecture (the reference apps + IA decisions must serve the PRD user segments, not arbitrary user types). No TRD user-facing behavior references a user segment absent from the PRD. No TQVCD accessibility target population inconsistent with PRD primary/secondary users. No UXD reference apps or anti-pattern targets that don't trace to a PRD user segment's needs.

- **Technical constraint propagation (TRD ↔ AVD ↔ UXD):** TRD Section 6.1 Mandatory and Section 6.2 Prohibited technology choices are reflected in the AVD Section 2.2 Architectural Style and Section 3.1 Component Inventory AND in UXD Section 2 Visual Design System (the UXD's design tokens + component definitions must be implementable in the TRD's tech stack — no "use Tailwind utilities" if TRD prohibits Tailwind; no 200ms transitions if TRD specifies a UI framework that doesn't support that easily). If AVD is Skipped-Status, the justification must either acknowledge the TRD constraints or explicitly state that they impose no architectural shape.

- **Three-way standards alignment (TRD ↔ UXD ↔ TQVCD):** This is the load-bearing check for the 6-layer accessibility hardwiring documented in `/dare-to-rise-code-plan` skill. For each standard declared applicable in TRD (Security, Privacy, Accessibility, etc.):
  - **TRD** must declare the standard applicable AND name the tech-stack support for it (e.g., for accessibility: jsx-a11y eslint plugin, ARIA library, accessibility-aware framework choice)
  - **UXD** must specify the design-layer behavior for that standard (e.g., for accessibility: Section 5 Accessibility-As-Delight criteria — ARIA label quality, keyboard nav quality, screen reader experience, motion preferences)
  - **TQVCD** must operationalize the test gates for that standard (e.g., for accessibility: Section 3.5 Per-Standard Exit Criteria — axe-core thresholds, Lighthouse Accessibility score, keyboard nav coverage)
  
  All three sides required for a hardwired standard. Missing in TRD → declaration is aspirational, no stack support. Missing in UXD → design-layer behavior unspecified, implementer falls back to generic defaults at Stage NN+1. Missing in TQVCD → no test gate, no enforcement. Any 1-of-3 or 2-of-3 alignment is a finding; 3-of-3 alignment passes.

- **N-way alignment for production-engineering tracks:** Beyond the three-way TRD↔UXD↔TQVCD check above, the Stage 00 16+4 expansion (2026-04-26) introduces additional alignment chains. Each chain enforces that a track's outputs land coherently across every document that should reference them. Missing any leg of a chain is a finding (severity HIGH on production-engineering tracks; severity MEDIUM on applicability-gated tracks where NA-with-justification is permitted but inconsistency between sides is still a finding).

  - **Security chain (TRD ↔ AVD ↔ TQVCD):** TRD §3.3 declared standards + threat model (Track 9) + auth model (Track 15) → AVD §3.1 auth components + §6.4 security architecture + threat-model trust boundaries → TQVCD §8 security gates (pre-commit / CI / pre-deploy) + §8.4 auth & identity gates. Missing in any leg → finding.
  - **Observability chain (TRD ↔ AVD ↔ TQVCD ↔ runbook):** TRD §3.8 logging/metrics/tracing/alerting requirements (Track 10) → AVD §3.1 observability components + §6.1 logging-and-observability cross-cutting concern → TQVCD §10.1 observability acceptance criteria → runbook(s) referenced from TQVCD must exist with alert→runbook→action chain documented for every alert.
  - **Reliability chain (TRD ↔ AVD ↔ TQVCD):** TRD §3.2 RTO/RPO + resilience patterns + queue/async patterns (Track 14) → AVD §3.1 queue components + §5.7 backup & DR plan with last-drill-date → TQVCD §7.4 reliability/stress gates with chaos/fault-injection pass conditions + §2.2 stress test categories declared YES with target scenarios.
  - **Data lifecycle chain (TRD ↔ AVD ↔ TQVCD ↔ PRD §6.2 regulatory):** TRD §3.4 privacy + retention + SAR workflow (Track 13) → AVD §4.3 persistence points + §6.4 security architecture for data → TQVCD §3.3 data lifecycle & privacy exit criteria + §10.4 compliance audit-readiness if Track 20 APPLICABLE → PRD §6.2 regulatory constraints align with TRD §3.4 declared regulations.
  - **Auth chain (TRD ↔ AVD ↔ TQVCD):** TRD §3.3 auth provider + protocol + session model (Track 15) → AVD §3.1 identity provider + session store + token validator components + §5.6 deployment topology auth between targets → TQVCD §8.4 auth & identity gates with end-to-end staging tests against real provider.
  - **Release engineering chain (TRD ↔ TQVCD ↔ runbook):** TRD §3.9 versioning + branching + CI/CD + flags + rollback (Track 16) → TQVCD §10.2 release engineering acceptance criteria with canary/rollback verification → runbook(s) for rollback procedure with last-tested-date.
  - **Performance & scale chain (TRD ↔ AVD ↔ TQVCD):** TRD §3.1 p50/p95/p99 + budget allocation + cache strategy + scale model (Track 11) → AVD §4 data flows latency expectations + §3.1 cache layer components → TQVCD §7.1 user-facing performance budgets + §7.3 performance enforcement.
  - **Deployment architecture chain (TRD ↔ AVD ↔ TQVCD §10.2):** TRD §6.6 hosting + envs + IaC tooling + DR plan (Track 12) → AVD §5 deployment architecture (now load-bearing in v02) → TQVCD §10.2 release engineering acceptance criteria reference deployment topology.
  - **Cost chain (PRD §6.5 ↔ TRD §3.10 ↔ TQVCD §7.5, applicability-gated):** Phase 00 Q9 decision → PRD §6.5 → TRD §3.10 → TQVCD §7.5. If APPLICABLE, all four legs required. If NA, the justification must match across all four legs (no "APPLICABLE in PRD but NA in TQVCD" inconsistencies).
  - **i18n chain (PRD §6.6 ↔ TRD §3.11 ↔ TQVCD §7.6 ↔ UXD §6.5, applicability-gated):** Phase 00 Q10 → PRD §6.6 → TRD §3.11 → TQVCD §7.6 → UXD §6.5 (Locale-Specific Visual Treatment, added in v0.3.0). Same APPLICABLE-or-NA-consistency rule as cost. If Q10 APPLICABLE: all five legs required; UXD §6.5 must address content-length variance, RTL mirror rendering (if RTL locales), script-specific typography, locale-aware data formatting, and pseudo-locale visual testing. If NA, all five legs declare NA with matching justification.

  - **Non-Visual Excellence Anchors chain (Phase 00 Q13-Q16 ↔ PRD §1.4 ↔ Stage NN+1 reviewer checklist, hardwired in v0.3.0):** Phase 00 Q13 → PRD §1.4.1 (Operational); Q14 → PRD §1.4.2 (Failure-Communication); Q15 → PRD §1.4.3 (Audit-Trail); Q16 → PRD §1.4.4 (Documentation). All four legs required. PRD §1.4.5 brand voice + §1.4.6 anti-patterns must reference at least one anchor from each Q13-Q16 category. The reviewer checklist invoked at Stage QA + Stage NN+1 Design Polish must verify each PRD-AR-NV-NN brand-voice decision and absence of each PRD-AR-AP-NN anti-pattern. Missing in any leg → finding (severity HIGH on production-engineering tracks because non-visual quality is what users feel for non-UI interactions).
  - **AI/ML chain (Phase 00 Q11 ↔ TRD §2 + §3.3 ↔ AVD §3.1 ↔ TQVCD §10.3, applicability-gated):** If Q11 APPLICABLE: TRD §2 must include the AI feature in functional requirements; TRD §3.3 must include OWASP LLM Top 10 in security standards; AVD §3.1 must include AI components (model serving, prompt store, eval harness); TQVCD §10.3 must declare AI/ML acceptance criteria. If NA, all four legs declare NA with matching justification.
  - **Compliance chain (Phase 00 Q12 ↔ PRD §6.2 ↔ TRD §3.4 ↔ TQVCD §10.4, applicability-gated):** If Q12 APPLICABLE: PRD §6.2 names the regulatory frameworks; TRD §3.4 lists matching regulations; TQVCD §10.4 declares compliance audit-readiness criteria. If NA, all four legs consistent.

- **ASAE threshold alignment (TQVCD ↔ D2R stage structure):** TQVCD Section 9.2 declared thresholds match the current D2R stage structure:
  - Stage 00 = 2
  - Stage 01a = 2
  - Stage 01b = 3
  - Stage 02 = 3
  - Stage 03+ = 3
  - Stage QA = 5
  Any deviation from these defaults must have a written rationale in the TQVCD; deviations without rationale are findings.

- **NFR operationalization (TRD ↔ TQVCD):** Every TRD Section 3 non-functional requirement maps to at least one TQVCD exit criterion in Sections 3–8. Any TRD NFR with no TQVCD exit criterion is a finding. Any TQVCD exit criterion with no corresponding TRD NFR is a finding.

- **Mini-ADR grounding (AVD ↔ TRD/PRD):** Every AVD Section 7 Mini-ADR rationale references at least one TRD constraint or PRD goal. Mini-ADRs with rationale unattached to any upstream requirement are findings. (Skipped-Status AVD is NA for this check.)

- **Coverage alignment (TQVCD ↔ TRD/PRD):** TQVCD Section 5.2 requires every TRD FR / BR has at least one test and every PRD user journey has at least one E2E test. Verify the TRD FR/BR count matches the TQVCD requirement coverage statement and the PRD user journey count matches the TQVCD user journey coverage statement. (Internal CI metric only per TQVCD §5.1; user-facing headline lives in §5.0 — see Verification-coverage chain below.)

- **Verification-coverage chain (TQVCD §5.0 + §5.4 ↔ PRD/TRD/README/SECURITY/marketing user-facing claim sources, post-Mod 6.5):** Per the Verification-Coverage Principle in `/asae SKILL.md` Section 0 (v07), TQVCD §5.0 (behaviors-verified / behaviors-claimed) is the load-bearing user-facing headline for test quality — NOT coverage % (§5.1) or test counts. This chain audits:
  - **§5.0 enumeration completeness:** every user-facing behavior claim across the doc set (PRD User Journeys, PRD Acceptance Criteria, TRD Functional Requirements, TRD measurable NFRs, README claims, SECURITY.md claims, marketing/landing copy, LAUNCH/READINESS docs) has a row in TQVCD §5.0 traceability table with `mutation_killing_test` populated. Missing rows = orphan claims = findings.
  - **§5.0 mutation-killing-test verification:** each `mutation_killing_test` path in §5.0 resolves to an existing test file AND the test fails when the corresponding behavior is mutated (per TQVCD §5.0 Step 2 falsification check). Reviewer Step 6 verifies semantic correctness (regex resolves the path; rater verifies the test ACTUALLY fails when behavior breaks).
  - **§5.0 tautology-check linkage:** every §5.0 row's `tautology_check` field has been verified against the canonical catalog at `_grand_repo/docs/test-tautology-bans.md` (per Mod 6 / `/asae SKILL.md` domain=code Tautology-Test Detector). Tautological tests do NOT count toward `behaviors-verified`.
  - **§5.4 banned-phrase compliance:** every user-facing copy file (README, SECURITY.md, marketing, landing, LAUNCH/READINESS) has been scanned for the §5.4 banned-phrase patterns ("100% test coverage", "complete test coverage", "X tests passing", "comprehensive test suite", "production-grade testing", "fully tested", "thoroughly tested", "battle-tested", "X% mutation score" without honest-scope disclosure). Each banned-phrase hit either (a) has a populated `disclosures.coverage_mutation_scope` block in the staging audit log per Mod 3 / A11.NEW-3 OR (b) has been replaced with allowed phrasing OR (c) has a per-claim `// metric-allowed: <rationale> + <disclosures.coverage_mutation_scope reference>` exemption.
  - **A11.NEW-1 compliance-claims chain:** for each TRD-declared standard that ALSO appears as a user-facing claim (e.g., "AES-256 encryption at rest" claimed in SECURITY.md), the verification linkage runs through TQVCD §5.0 + `disclosures.compliance_claims` + a verifying test that fails when the claim breaks. Standards-only chains (security / accessibility / etc.) verify TRD↔TQVCD test-gate alignment; verification-coverage chain ADDS the user-facing-claim → mutation-killing-test linkage on top.

  Missing in §5.0 → user-facing claim has no verifying test → A11.NEW-1 compliance_claims block must declare the gap explicitly. Missing in §5.4 scan → silent shipping of headline-metric theater. Missing in tautology-check → §5.0 ratio is inflated by non-falsifying tests.

  This chain is NEW per Mod 6.5 (Verification-Coverage Principle) + Mod 1 (compliance_claim_verification) + Mod 6 (Tautology-Test Detector) + META-8 cascade discipline (D2R input doc structure changes must cascade through alignment chain logic, not just file-rename).

- **PSCAD↔TQVCD pattern-space-coverage chain (post-Mod 8):** Per Mod 8 of Methodology Mods Batch 2, PSCAD audits TQVCD's verification coverage from the pattern-space angle. This chain audits:
  - **Bidirectional reference integrity:** every PSCAD-PAT entry in PSCAD §3 with `coverage_status: covered` has at least one PSCAD-CC entry in PSCAD §4 referencing a TQVCD-VC entry by id; the referenced TQVCD-VC entry exists in TQVCD §5.0 traceability table; the TQVCD-VC entry's `production_pattern` field references back to the PSCAD-PAT id (or to an inline pattern that PSCAD §3 covers via its catalog reference)
  - **Coverage-rationale non-tautology:** every PSCAD-CC's coverage rationale describes the SPECIFIC production-shaped condition the test applies (concurrency level, payload size, sequence, latency, etc.), not just the code-path the test exercises. Tautological coverage rationale ("the function is tested") is a finding
  - **Production-pattern field completeness:** every TQVCD-VC entry has `production_pattern` populated (catalog id OR inline `production_pattern_inline` block OR `PAT-GENERIC-NO-PRODUCTION-SHAPE` marker with rationale per Mod 8.1 v05+ schema). Empty `production_pattern` field is a finding
  - **Gap-remediation completeness:** every PSCAD-PAT with `coverage_status: not_covered` has a PSCAD-GAP entry in PSCAD §5 AND a PSCAD-REM entry in PSCAD §6 (or `accept_gap_disclose` remediation with disclosures.compliance_claims linkage if severity ≤ MEDIUM). CRITICAL or HIGH severity gaps with no remediation are findings
  - **Pattern catalog reference integrity:** every PSCAD-PAT entry's catalog reference resolves to an actual entry in `_grand_repo/docs/Production_Pattern_Catalog_2026-04-27_v01_I.md` OR is marked "candidate for catalog promotion" with a separate ASAE strict-3 catalog-promotion gate scheduled

  This chain is NEW per Mod 8 (Production-Pattern Parity Testing + PSCAD as 6th D2R doc) + META-8 cascade discipline. Empirical motivation: CDCC plugin Stage 05 lockfile skip — passed under tested load, would deviate under production concurrency. Tests didn't fail because the production-shaped concurrency pattern wasn't applied. PSCAD makes pattern-space coverage a structurally separate, adversarially-disciplined audit.

- **Accessibility lived-floor chain (Phase 00 Q18-Q20 ↔ TRD §3.5 ↔ TQVCD §6.5/§6.6/§6.7/§6.8/§6.9 ↔ UXD §3.5/§5.5/§5.6/§5.7/§5.8, NEW 2026-05-05 per D2R Accessibility Floor Update):** This chain audits the LIVED accessibility floor (cognitive ADHD-conscious design / reading dyslexia-conscious typography / vision user-controlled theme toggle) alongside the existing legal floor (WCAG 2.1 AA) three-way TRD↔UXD↔TQVCD alignment. Every leg required when applicable per Q18/Q19/Q20:
  - **Cognitive floor leg (Q18 ↔ TQVCD §6.5 ↔ UXD §5.5):** if Q18 APPLICABLE, TQVCD §6.5 has TQVCD-EC-Access-Cog-01..04 entries populated AND UXD §5.5 has UXD-UP-Cog-01..04 specifications. NA permitted only with matching no-focused-work-surface rationale across all three legs.
  - **Reading floor leg (Q19 ↔ TQVCD §6.6 ↔ UXD §5.6 ↔ UXD §2.2 typographic scale):** if Q19 APPLICABLE, TQVCD §6.6 has TQVCD-EC-Access-Read-01..04 entries populated; UXD §5.6 has UXD-UP-Read-01..04 specifications including a picked dyslexic-friendly font from candidate set (Lexend / OpenDyslexic / Atkinson Hyperlegible); UXD §2.2 typographic scale accommodates the alternative font. NA permitted only with matching no-rich-text-surface rationale.
  - **Vision floor leg (Q20 ↔ TQVCD §6.7 ↔ UXD §3.5 ↔ UXD §5.7 ↔ UXD §2.1 color tokens):** if Q20 APPLICABLE, TQVCD §6.7 has TQVCD-EC-Access-Vis-01..04 entries populated (theme-toggle MANDATORY + both-themes-WCAG-AA + persistence + no-surprise); UXD §3.5 has full theme-system specification (light + dark palettes; toggle control; persistence; no-surprise); UXD §5.7 has UXD-UP-Vis-01..04 design criteria; UXD §2.1 color tokens have BOTH light AND dark hex values for every token. NA permitted only with matching no-significant-text-content rationale.
  - **Refusal table cross-application:** TQVCD §6.9 + UXD §5.8 lived-floor refusal tables are applied at this Phase 02 audit at the same severities (CRITICAL: TQVCD tests one theme but not both; UXD §3.5 specifies one theme palette only. HIGH: UXD omits dyslexic-font option for WYSIWYG/rich-text apps; system-follow proposed as sufficient substitute for user-controlled toggle; Stage 00 research missing accessibility floor; TQVCD with WCAG 2.1 AA only scope; UXD §2.1 color tokens missing dark-mode hex values; UXD §5.5 cognitive section absent. MEDIUM-strict: any of the floor sub-criteria marked NA without explicit product-domain rationale.)
  - **TRD §3.5 stack-support leg:** TRD §3.5 must declare stack support for theme toggle (CSS-variable theming / framework theme provider / etc.) + dyslexic-font integration tooling (font-loading strategy; font-fallback chains for the picked candidate) + chrome-quietness measurement tooling (UXD-anchored visual review path). Missing TRD §3.5 stack support → declaration is aspirational → finding at HIGH severity per Mod 5 (sandbox/standards stack-support discipline).

  Empirical motivation: Krystal's profile (ADHD + dyslexic + vision needs) named the gap during DrWrite review — minutes after describing the daily-driver-instrument app she actually wants. The expansion is NOT Krystal-specific; it applies to all D2R apps. Many users — neurodivergent users, dyslexic users, low-vision users, users in variable-light environments — share these needs. WCAG 2.1 AA is the legal floor; the LIVED floor sits higher. Per the larger principle: accessibility floor = legal floor + lived floor.

- **PSCAD↔TRD §perf-and-reliability chain (post-Mod 8):** PSCAD §2 production conditions in scope must derive their measurable thresholds from TRD §3.1 (performance budgets) + TRD §3.2 (reliability requirements). Every PSCAD-PAT in scope must trace its production-shape parameters (concurrency level / payload size / latency injection / etc.) back to TRD-declared thresholds. Patterns whose parameters don't trace are findings (PSCAD scope is unanchored).

- **PSCAD↔PRD §6 chain (post-Mod 8):** PSCAD §2 production conditions in scope must derive from PRD §6 operational constraints + PRD §1.1 user model (deployment topology, tenant model, scale tier). Patterns whose plausibility doesn't trace to PRD-declared operational context are findings (PSCAD scope is over-broad without empirical anchor — narrow scope per §2.2 with empirical reason or remove from §3).

- **Runtime egress chain (Phase 00 Q17 ↔ TRD §3.5 ↔ ASAE A22, post-Mod 12):** Per Mod 12 of Methodology Mods Batch 2, every runtime third-party destination must be attested in BOTH TRD §3.5 Security (third-party destinations subsection) AND ASAE A22 Runtime Egress Disclosure block. This chain audits:
  - **Phase 00 Q17 → TRD §3.5 trace:** every destination enumerated in Phase 00 Question 17 answer appears in TRD §3.5 with destination + protocol + data_classification + purpose + user_consent_gate + retention_per_their_tos + proxy_architecture fields populated. Missing destinations in TRD §3.5 = finding (silent runtime egress).
  - **TRD §3.5 ↔ A22 tandem-update verification:** TRD §3.5 third-party-destinations subsection MIRRORS the ASAE A22 attestation block in the consuming gate's frontmatter. Per Mod 12 §2.3, hook v07+ Tier 23 hashes BOTH sides and refuses commits where they diverge. Sync is verification, not generation — either side can be hand-authored, but they must agree at commit time. The /ideate Phase 02 audit treats divergence as a finding to remediate before Bundle Approval.
  - **Fail-closed whitelist completeness:** every outbound network call destination the runtime makes must be either (a) attested in A22 + mirrored in TRD §3.5 OR (b) on the documented first-party allowlist. Per Mod 12 §2.4, NO carve-out for metadata/telemetry — `data_classification` field is informational + drives consent UX, but does NOT determine enforcement strictness. Hook v07+ Tier 24 (when active) refuses commits where any outbound network call destination isn't whitelisted.
  - **User-consent-gate consistency:** every destination with `data_classification: user_input` or `derived_from_user_input` MUST have `user_consent_gate: required` UNLESS rationale documented (e.g., destination IS the first-party API the user invoked). Inconsistencies between data classification and consent gate are findings.

  This chain is NEW per Mod 12 (Privacy/Data-Leakage Disclosure + ASAE A22 Runtime Egress Disclosure). Empirical motivation: drwrite renders PlantUML diagrams by POSTing user-typed content to a third-party PlantUML server; user has no idea their text is being shipped externally; no disclosure surface, no consent gate, no attestation record. ASAE A14 covers external DEPS; Track 9 covers INPUTS; Track 13 covers data lifecycle; before Mod 12 nothing covered runtime third-party egress carrying user data OUT.

- **UXD component-token alignment (UXD ↔ AVD):** UXD Section 2.4 component tokens map to AVD Section 3.1 component inventory. Every UXD-named component (button, input, card, modal, timeline-item, etc.) appears in the AVD component inventory; every AVD UI component has a UXD component token specifying its visual character. NA if AVD is Skipped-Status — but the UXD's component tokens must still be declared so Stage NN+1 Design Polish has a target. NA-with-rationale acceptable only if the project has zero UI components (rare).

- **UXD reality-anchor verification (UXD-internal):** UXD Section 8.1 Reference Design Assets must exist at the paths declared in the document. Audit verifies file existence — paths that resolve to missing files are findings. This is the F13-prevention check: a UXD without reference assets is words-only and re-introduces the fictional-validation tautology at the design layer.

- **UXD anti-pattern coverage (UXD ↔ Phase 00 Question 8):** UXD Section 7 anti-patterns must include the anti-pattern targets captured in Phase 00 Question 8. The UXD is the place where the implementer-falls-back-to-generic-defaults concern gets structurally addressed; if Question 8's named anti-patterns don't appear in UXD Section 7, the UXD is missing the most-likely-failure-mode prevention.

**Gate invocation:**

Invoke `/asae` with:
- `target`: the set of six document paths from Phase 01 (PRD + TRD + AVD-or-Skipped-Status + TQVCD + UXD + PSCAD) + the reference design assets directory from Step 01.5
- `sources`: the six templates + Production Pattern Catalog (for PSCAD) + Phase 00 summary + any standards referenced in TRD/TQVCD/UXD/PSCAD
- `prompt`: "Audit cross-doc consistency across PRD, TRD, AVD, TQVCD, UXD per the Phase 02 checklist in /ideate-to-d2r-ready (including the three-way TRD↔UXD↔TQVCD standards alignment check + the UXD reality-anchor verification + the N-way alignment chains for security / observability / reliability / data lifecycle / auth / release engineering / performance / deployment / cost / i18n / AI-ML / compliance — every chain leg verified)"
- `domain`: `document`
- `asae_certainty_threshold`: 3
- `severity_policy`: `strict`

Under `strict`, CRITICAL, HIGH, and MEDIUM findings all reset the counter and must remediate before loop exit. LOW findings are logged.

**Remediation routing:**

When the audit finds an inconsistency, route remediation to the appropriate authorship skill:

| Inconsistency locus | Route to |
|---|---|
| User segment mismatch | `/write-prd` (if PRD is root cause) or `/write-trd` / `/write-tqvcd` / `/write-uxd` (if downstream misstatement) |
| Tech constraint propagation | `/write-avd` (re-author constraint-aware sections) or `/write-uxd` (if UXD design tokens incompatible with TRD stack) |
| Standards mismatch (any 1-of-3 or 2-of-3 in the TRD↔UXD↔TQVCD three-way alignment) | Whichever side is missing. Standards declared in TRD with no UXD design-layer behavior → `/write-uxd` Section 5. Standards declared in TRD with no TQVCD test gate → `/write-tqvcd` Section 3. UXD design-layer behavior or TQVCD test gate without TRD declaration → `/write-trd` (decide whether to declare or remove). Confirm with user. |
| ASAE threshold deviation | `/write-tqvcd` (Section 9.2) |
| NFR–exit-criterion mismatch | `/write-tqvcd` (add exit criterion) or `/write-trd` (remove orphan NFR) |
| Mini-ADR ungrounded | `/write-avd` (Section 7) |
| Coverage alignment gap | `/write-tqvcd` (Section 5.2) |
| UXD component-token mismatch with AVD inventory | `/write-uxd` (add missing tokens) or `/write-avd` (add missing components); confirm with user which is source of truth |
| UXD reference asset missing at declared path | `/write-uxd` Section 8.1 (capture the missing asset OR remove the reference); the UXD reality-anchor cannot be aspirational |
| UXD anti-pattern coverage gap (Phase 00 Question 8 anti-patterns missing from UXD Section 7) | `/write-uxd` Section 7 (add the named anti-patterns from Phase 00) |
| Security chain leg missing (TRD↔AVD↔TQVCD) | Whichever side missing: `/write-trd` §3.3 / `/write-avd` §3.1 + §6.4 / `/write-tqvcd` §8 |
| Observability chain leg missing | `/write-trd` §3.8 / `/write-avd` §3.1 + §6.1 / `/write-tqvcd` §10.1 / runbook author |
| Reliability chain leg missing | `/write-trd` §3.2 / `/write-avd` §3.1 + §5.7 / `/write-tqvcd` §7.4 + §2.2 |
| Data-lifecycle chain leg missing | `/write-trd` §3.4 / `/write-avd` §4.3 + §6.4 / `/write-tqvcd` §3.3 + §10.4 / `/write-prd` §6.2 |
| Auth chain leg missing | `/write-trd` §3.3 / `/write-avd` §3.1 + §5.6 / `/write-tqvcd` §8.4 |
| Release-engineering chain leg missing | `/write-trd` §3.9 / `/write-tqvcd` §10.2 / runbook author |
| Performance & scale chain leg missing | `/write-trd` §3.1 / `/write-avd` §4 + §3.1 / `/write-tqvcd` §7.1 + §7.3 |
| Deployment-architecture chain leg missing | `/write-trd` §6.6 / `/write-avd` §5 (load-bearing) / `/write-tqvcd` §10.2 |
| Cost applicability-gate inconsistency (Phase 00 Q9 ↔ PRD §6.5 ↔ TRD §3.10 ↔ TQVCD §7.5) | Whichever leg disagrees; user confirms canonical decision |
| i18n applicability-gate inconsistency (Phase 00 Q10 ↔ PRD §6.6 ↔ TRD §3.11 ↔ TQVCD §7.6 ↔ UXD §6.5) | Whichever leg disagrees; user confirms canonical decision |
| Non-visual excellence anchor chain leg missing (Phase 00 Q13-Q16 ↔ PRD §1.4) | `/write-prd` Section 1.4 (add the missing dimension's reference products + brand voice decision + anti-pattern); confirm with user which dimension's anchors are canonical |
| PRD §1.4.5 brand voice or §1.4.6 anti-pattern not traceable to any Q13-Q16 anchor | `/write-prd` Section 1.4 (add the missing reference) OR Phase 00 re-run for the anchor that's missing |
| AI/ML applicability-gate inconsistency (Phase 00 Q11 ↔ TRD §2 + §3.3 ↔ AVD §3.1 ↔ TQVCD §10.3) | Whichever leg disagrees; user confirms canonical decision |
| Compliance applicability-gate inconsistency (Phase 00 Q12 ↔ PRD §6.2 ↔ TRD §3.4 ↔ TQVCD §10.4) | Whichever leg disagrees; user confirms canonical decision |
| Cognitive accessibility floor leg missing (Q18 ↔ TQVCD §6.5 ↔ UXD §5.5) | Whichever leg disagrees: `/write-tqvcd` §6.5 / `/write-uxd` §5.5; if Q18 itself is silent NA, re-run Phase 00 Q18 |
| Reading accessibility floor leg missing (Q19 ↔ TQVCD §6.6 ↔ UXD §5.6 ↔ UXD §2.2) | Whichever leg disagrees: `/write-tqvcd` §6.6 / `/write-uxd` §5.6 / `/write-uxd` §2.2 typographic scale; if Q19 itself is silent NA, re-run Phase 00 Q19 |
| Vision accessibility floor leg missing (Q20 ↔ TQVCD §6.7 ↔ UXD §3.5 ↔ UXD §5.7 ↔ UXD §2.1) | Whichever leg disagrees: `/write-tqvcd` §6.7 / `/write-uxd` §3.5 (theme system) / `/write-uxd` §5.7 / `/write-uxd` §2.1 color tokens add dark-mode hex values; if Q20 itself is silent NA, re-run Phase 00 Q20 |
| TQVCD §6.9 or UXD §5.8 lived-floor refusal-table condition present | Route per refusal table — fix the offending floor element via the appropriate write-* skill in remediation mode |

Between iterations, apply edits via the routed skill. Re-invoking `/write-*` in remediation mode is lightweight (target a specific section; do not re-run the full authorship protocol unless a section requires full re-authoring).

Report at the start of each iteration (one line) and present the full convergence gate summary table at gate completion per the no-silent-execution rule.

**Exit condition:**

Phase 02 exits successfully only when the convergence gate reaches its threshold under the strict severity policy. Any CRITICAL or HIGH finding blocks exit until remediated. On max-iteration halt, escalate to the user with the findings ledger; do not auto-advance.

### Phase 03: Approval Gate + Bundle Commit

Present the four completed docs to the user with:
- File paths
- Approval status per document
- Phase 02 convergence gate summary table (iterations, findings, edits applied, final status)

Format (use the output-formatting rule's response-options convention):

```
All six D2R prerequisite documents are authored and cross-doc consistent.

| Doc  | Path                                       | Status   |
|------|--------------------------------------------|----------|
| PRD  | [path]                                     | Approved |
| TRD  | [path]                                     | Approved |
| AVD  | [path] or Skipped-Status                   | Approved |
| TQVCD | [path]                                     | Approved |
| UXD  | [path] (assets at [reference assets dir])  | Approved |

Phase 02 convergence gate summary:
[full summary table from /asae]

`✓` to mark the bundle ready for /dare-to-rise-code-plan AND commit + push to the repo

`✓ no-commit` to mark the bundle ready but skip the git commit + push step

`?` to discuss any document

`X: [feedback]` to request changes
```

Wait for explicit approval.

**On `✓` (approval + commit):**

1. **Mark approvals** — Update each document's Stakeholder Approvals section with current date and the role that approved.

2. **Identify the target repo.** Determine which git repo contains the planning directory:
   - If the planning dir is inside a git submodule, target that submodule's repo.
   - If the planning dir is inside a non-submodule directory of a parent grand repo, target the parent repo.
   - If the planning dir is not in a git repo, skip git operations, warn the user, and proceed to the bundle-ready report.

3. **Pre-commit state check.** Run `git status` on the target repo. Capture pre-existing modified / untracked files (these belong to other sessions per the `git-commit-scope` rule and MUST NOT be staged). Report the count of pre-existing files; proceed only with files generated by this orchestrator run.

4. **Stage specifically the 6 orchestrator-generated files + the reference assets directory** per the `git-commit-scope` rule. NEVER use `git add -A` or `git add .`. The 6 files to stage are the Phase 00 ideation summary + PRD + TRD + AVD (full or Skipped-Status) + TQVCD + UXD, all by full path. Plus stage the reference design assets directory contents (each asset by full path). If any of the 6 files or the assets directory is outside the target repo (unusual), warn and skip staging that file with an explicit note.

5. **Commit** with a descriptive message per the `github-discipline` rule. Template (use a here-doc to preserve formatting):

    ```
    Add [Project Name] D2R prerequisite bundle via /ideate-to-d2r-ready

    Produced by /ideate-to-d2r-ready end-to-end on [YYYY-MM-DD]:
    - Phase 00 ideation summary (all 20 interrogation questions passed —
      5 PRD-readiness + 3 UXD-readiness + 4 applicability-gate readiness +
      4 non-visual-excellence readiness + 1 runtime-egress readiness +
      3 accessibility-floor readiness per 2026-05-05 D2R Accessibility Floor Update)
    - PRD: [one-line description from PRD Section 1.3]
    - TRD: [one-line description]
    - AVD: [one-line description OR "Skipped-Status (rationale: <reason>)"]
    - TQVCD: [one-line description]
    - UXD: [one-line description] + reference assets at [assets dir]
    - Phase 02 cross-doc audit: convergence gate PASS at threshold 3 strict,
      [N] iterations, [M] edits applied. Three-way TRD↔UXD↔TQVCD standards
      alignment verified. UXD reality-anchor verified (reference assets
      exist at declared paths).

    Stakeholder approval: [stakeholder name + role], [YYYY-MM-DD].

    Co-Authored-By: Clauda the [persona] (Opus 4.7, 1M context) <noreply@anthropic.com>
    ASAE-Gate: strict-3-PASS
    ```

    If a pre-commit hook fails, report the failure verbatim and do NOT bypass (never pass `--no-verify`). User resolves the hook failure and re-approves.

6. **Push** per the `feedback_no_prs_default` rule:
   - On private repos where the user is the sole committer: push to `main` / `master` (whichever the repo uses as default) on the current branch. Direct commit to main is the default; no PR.
   - If the current branch is NOT main/master (e.g., a worktree branch), commit there, then report the branch state to the user and ask whether to fast-forward main or continue on the feature branch. Do not force-push master silently.
   - If push fails (auth, non-fast-forward, branch protection): report the failure verbatim and stop. Do not retry blindly. User resolves.

7. **Report** the commit SHA, branch, remote, and push status per the `no-silent-execution` rule. Confirm the bundle is ready for `/dare-to-rise-code-plan` and report the ordered set of paths the user will pass to D2R.

8. End the orchestrator.

**On `✓ no-commit` (approval without commit):**

- Mark approvals as in step 1 above.
- Skip steps 2–7 (no git operations).
- Confirm the bundle is ready for `/dare-to-rise-code-plan` and report the ordered set of paths.
- End the orchestrator.

**On discussion or change request:**

- Route the change to the appropriate authorship skill per the Phase 02 remediation-routing table.
- After the change is applied, re-run Phase 02 (cross-doc audit) — a change in one document may invalidate consistency elsewhere.
- Re-present Phase 03 with the updated bundle.

**Git operation failure modes and handling:**

| Failure | Response |
|---|---|
| Planning directory not in a git repo | Skip git ops; warn user; proceed to bundle-ready report |
| Pre-commit hook blocks | Report hook failure verbatim; do NOT bypass; user resolves + re-approves |
| Commit fails for other reasons | Report error; halt; user investigates |
| Push fails on auth | Report auth failure; halt; user resolves |
| Push fails on non-fast-forward | Report; halt; surface rebase / merge options; never force-push without explicit user instruction |
| Push fails on branch protection | Report protection rule; halt; user decides PR vs. direct commit by policy |
| Files outside target repo | Warn + skip staging those files; still commit the in-repo subset if non-empty |

### Phase 04: End-Prompt Generation and Portable Prompt Export

This phase now has two sub-parts: Phase 04a is NEW (per LEAD §4, the end-prompt generation added to the approved 8-stage plan's `/ideate-to-d2r-ready` rewrite scope) and runs automatically at the end of a completed bundle; Phase 04b is the pre-existing optional user-triggered portable-prompt export, unchanged in behavior.

**Phase 04a: End-Prompt Generation (NEW per LEAD §4)**

Runs automatically once Phase 03 Approval Gate + Bundle Commit completes (either on `✓` commit or `✓ no-commit`) — this is the standard hand-off close of a successful run, not something the user has to ask for.

Generate a hand-off end-prompt that packages the completed bundle for its next consumer (`/dare-to-rise-code-plan`, or a human reviewer, or another planner LLM in an experimental multi-planner run). The end-prompt must contain:

- **Bundle manifest** — the six document paths (PRD, TRD, AVD-or-Skipped-Status, TQVCD, UXD, PSCAD) plus the reference design assets directory, plus the Phase 00.0 onboarding disposition (mode, path selected, media-gap disposition) and the Phase 00 ideation summary path
- **Approval + commit state** — Stakeholder Approvals status per document, commit SHA/branch/push status if committed (per Phase 03 step 7), or explicit "not committed" if `✓ no-commit` was chosen
- **Phase 02 convergence gate summary** — final status, iteration count, findings resolved, so the next consumer knows the audit history without re-deriving it
- **Explicit next action** — a one-line instruction naming the intended next consumer (typically: "pass this bundle to `/dare-to-rise-code-plan`") and any known caveats (e.g., outstanding LOW findings logged but not blocking)

Save the end-prompt to `[planning-directory]/[prefix]_EndPrompt_[YYYY-MM-DD]_v01_I.md` per `/file-versioning` conventions. Report completion in-thread with a one-line confirmation and the path.

The end-prompt is deliberately lighter-weight than the Phase 04b portable prompt below: it assumes the receiving party HAS file access (it's a hand-off manifest + state summary, not a content-inlined export for a file-access-less LLM). Use Phase 04b instead when the receiving party has no file access.

**Phase 04b (Optional): Portable Prompt Generation**

Triggered at any phase when the user says "give me a portable prompt", "export as a prompt", "I want to run this in another LLM", or equivalent.

The generated portable prompt must contain:

- **Current phase state** — which phase, which step within the phase, what the next action is
- **All completed documents' content inline** — receiving LLM does not need file access
- **Phase 00 summary content inline** — if Phase 00 is complete
- **The phase's continuation instructions** — copied from this skill's execution protocol
- **Convergence gate instructions** — for any outstanding gate (threshold + severity policy + scope)
- **In-flight pending actions** — e.g., "Step 01.3 AVD draft pending user approval"
- **Filename conventions** — for any documents the receiving LLM will author

The portable prompt is self-contained. A receiving Claude thread or capable LLM can resume the journey from the point the portable prompt was generated.

Save the portable prompt to `[planning-directory]/[prefix]_Portable_Prompt_[YYYY-MM-DD]_v01_I.md` per `/file-versioning` conventions.

## Orchestrator vs Standalone Behavior

The six authorship skills (`/write-prd`, `/write-trd`, `/write-avd`, `/write-tqvcd`, `/write-uxd`) behave the same way whether invoked by this orchestrator or invoked standalone. This orchestrator passes context (Phase 00 summary, upstream document paths, invocation context marker) but does not change the authorship skills' internal execution protocols.

When invoked by this orchestrator, each authorship skill returns control to the orchestrator on user approval of its document. When invoked standalone, each skill returns control to the user.

Authorship skills detect orchestrated mode via the invocation context marker in the inputs. In orchestrated mode, they skip redundant next-step guidance (the orchestrator handles the next step) and return a structured handoff block with the approved document path.

## Anti-Patterns

- Skipping Phase 00 interrogation and jumping straight to `/write-prd` when the idea is under-baked. This produces a PRD against intuition and cascades into degraded downstream documents.
- Running Phase 02 cross-doc audit before all four individual gates pass. Individual gates catch per-doc issues; cross-doc audit is for relationships only.
- Running Phase 02 with `severity_policy: standard`. Cross-doc inconsistency is load-bearing for D2R planning; `strict` is appropriate.
- Presenting for approval before Phase 02 completes. The approval gate is the bundle gate, not individual gates.
- Treating Skipped-Status AVD as missing. A trivially simple project with an explicit Skipped-Status AVD artifact satisfies the D2R prerequisite.
- Generating a portable prompt without inlining all completed documents. The receiving LLM must be able to continue without file access.
- Soft-exiting on a failed interrogation question. Under-baked answers produce under-baked PRDs. Surface the insufficiency explicitly and hold the gate.
- Auto-advancing to Phase 03 on max-iteration halt in Phase 02. Escalate to the user with the findings ledger; the orchestrator does not self-approve.
- Using `git add -A` or `git add .` during the Phase 03 bundle commit. Per the `git-commit-scope` rule, stage specifically the 6 orchestrator-generated files plus the reference design assets directory contents by full path. Other sessions' work must never be swept into the bundle commit.
- Bypassing a pre-commit hook with `--no-verify`. If a hook blocks the bundle commit, report the failure and let the user resolve it; never bypass.
- Force-pushing master (or any shared branch) silently when the Phase 03 push fails on non-fast-forward. Report the state and let the user decide.
- Auto-creating a PR when a direct commit would do. Per `feedback_no_prs_default`, direct-to-main on private repos is the default; a PR requires an explicit load-bearing reason (branch protection, collaborator review, etc.).

## Related Skills

- `/write-prd` — Phase 01 Step 01.1 (authors the PRD)
- `/write-trd` — Phase 01 Step 01.2 (authors the TRD; requires approved PRD)
- `/write-avd` — Phase 01 Step 01.3 (authors the AVD or Skipped-Status artifact; requires approved PRD + TRD)
- `/write-tqvcd` — Phase 01 Step 01.4 (authors the TQVCD; requires approved PRD + TRD)
- `/write-uxd` — Phase 01 Step 01.5 (authors the UXD; requires approved PRD + TRD; references AVD if not Skipped-Status)
- `/write-pscad` — Phase 01 Step 01.6 (authors the PSCAD as the 6th D2R doc per Mod 8; requires approved PRD + TRD + TQVCD; sequenced AFTER TQVCD per design — production-memory accumulation discipline)
- `/asae` — used at every authorship skill's internal gate (threshold 2; standard for documents, design for UXD) and at Phase 02 cross-doc audit (threshold 3, strict)
- `/dare-to-rise-code-plan` — downstream consumer of the six approved documents
- `/file-versioning` — governs filename conventions across all artifacts produced in this skill
- `/file-presentation` — governs how documents are presented for approval (one-at-a-time with confirmation gates)

## Related References

- PRD template: `.claude/skills/dare-to-rise-code-plan/references/PRD_Template_2026-04-17_v01_I.md`
- TRD template: `.claude/skills/dare-to-rise-code-plan/references/TRD_Template_2026-04-17_v01_I.md`
- AVD template: `.claude/skills/dare-to-rise-code-plan/references/AVD_Template_2026-04-17_v01_I.md`
- TQVCD template: `.claude/skills/dare-to-rise-code-plan/references/TQVCD_Template_2026-05-05_v06_I.md` (v06_I: legal floor + lived floor accessibility per 2026-05-05 D2R Accessibility Floor Update)
- UXD template: `.claude/skills/dare-to-rise-code-plan/references/UXD_Template_2026-05-05_v03_I.md` (v03_I: §3.5 theme system + §5.5/§5.6/§5.7 lived-floor design specs per 2026-05-05 D2R Accessibility Floor Update)
- Software Testing Taxonomy: `.claude/skills/dare-to-rise-code-plan/references/Software_Testing_Taxonomy_2026-04-17_v01_I.md`

## Related Rules (Phase 03 Bundle Commit)

- `git-commit-scope` — only commit files generated by this orchestrator run; never `git add -A` or `git add .`
- `github-discipline` — descriptive commit messages; push after every commit; never bypass hooks
- `feedback_no_prs_default` — direct commit to main on private repos; PRs only when load-bearing
- `feedback_ip_discipline_filesystem` — commit messages + branch names + log entries follow the same IP discipline as prose (branded terminology, no methodology exposure)
- `no-silent-execution` — report commit SHA + branch + push status after the Phase 03 git operations

## v03 changelog

Added 2026-07-06 (TESS T1 implement pass), implementing LEAD doc `Unified_4-Mode_Proposal_LEAD_2026-07-02_v03_I.md` §4 (upstream `/ideate-to-d2r-ready` rewrite scope) and §5.0 (dispatch + input validation). This is the **L1 layer of META-8 cascade bb477923** — the layer that governs how D2R input-doc structure changes propagate through downstream alignment-chain logic rather than being handled as a silent file-rename.

Additions, preserving all existing structure/content:

- **Mode-Input-Selection Logic** (new section, placed before Execution Protocol) — declares `mode: 1|2|3|4` at invocation per LEAD §5.0; per-mode required-input table (Mode 1 = 6-doc bundle authored by this skill; Mode 2 = existing bundle on-demand + Findings Ledger; Mode 3 = bundle required + Capability Spec + in-flight Bundle Delta Plan; Mode 4 = bundle required + Cutover Plan); refuse-on-missing-artifact rule with pointer to authoring path; default-absent-mode → interactive confirm, never silent Mode-1 assumption.
- **Phase 00.0: Onboarding** (new phase, before the existing Phase 00 Ideation Interrogation) — no-time-estimate greeting; chat-vs-upload path selection; idea-development assessment; media handling with the audio/video transcription gap explicitly acknowledged (not silently skipped); ASAE gate (threshold 2 standard) at phase end.
- **Phase 01: Sequential Authorship** — retitled to note Opus-dispatch drafting; added the Opus-dispatch framing (drafting stays at the planning/authorship tier per LEAD §5.3) plus the 2-sentence prompt-summary requirement per dispatched `/write-*` unit.
- **Phase 02: Cross-Doc Consistency Audit** — retitled to note Sonnet-dispatch; added the Sonnet-dispatch execution-tier framing (closed-world, pre-chewed audit work sits at the execution tier per LEAD §5.3's world-openness model-assignment logic, distinct from Opus-tier planning/authorship).
- **Phase 04: End-Prompt Generation and Portable Prompt Export** — restructured the pre-existing optional Portable Prompt Generation phase into Phase 04b (unchanged behavior) and added new Phase 04a End-Prompt Generation (per LEAD §4) — an automatic, lighter-weight hand-off manifest generated at the close of every successful bundle run (bundle manifest + approval/commit state + Phase 02 gate summary + explicit next action), distinct from the file-access-less portable-prompt export in 04b.

No existing content was deleted. Where an existing phase needed disambiguation against new content (Phase 04), the original content was preserved verbatim under a new sub-label (04b) rather than removed or rewritten.
