---
name: asae
version: v08
audience: martinez_methods_internal
classification: INTERNAL ONLY
classification_reason: Methodology IP surface; audit-gate authoring spec for Martinez Methods internal use only.
description: "Use this skill when a caller needs a convergence gate run on an output artifact against original sources and a specification. Triggers on: '/asae', 'asae', 'asae gate', 'run asae', 'asae on this', 'audit this against sources', 'convergence gate', or when a parent skill (e.g., /dare-to-rise-code-plan) invokes ASAE at a stage boundary. Takes a scope definition (target, sources, prompt, domain, ASAE Certainty Threshold, severity policy). Runs iterative comparison passes with severity-classified findings. Exits when the configured ASAE Certainty Threshold is reached or halts on max-iteration exceeded. Produces a versioned audit log."
---

# ASAE (v08)

## v08 lineage

- v04 added Tier 1c (Independent Rater attestation, FM closure for single-persona-audit blind spots)
- v05 added Aspects A9-A13 via frontmatter blocks (`persona_role_manifest:`, `session_chain:`, `disclosures:`, `inputs_processed:`, `step_re_execution:`) with hook Tiers 1c-ext, 4-ext, 5, 6
- v06 absorbed Aspects A14-A20 from the gate-49 multi-taxonomy scoreboard (7 new prevention-axis aspects covering 168 FMs across 7 taxonomies) AND Aspect A21 — Detect-Revert-Redelegate (DRR) — from Two_Axis_Commercial_Pitch_2026-04-26_v02_I (recovery axis; first published methodology that catches LLM fabrication at commit time via independent parent verification + auto-revert + redelegate cycle, hook-enforced and audit-trailed). v06 also documented A22's REJECTION (Two-Axis Pitch v02; failed ≥3-FM-per-aspect guard; folded into A18 + roadmap P3 H8).
- v07 (predecessor) absorbed Methodology Mods Batch 1 surfaced from FAANG-principal-grade adversarial code reviews of 6 apps (orchestra, orchestra-box-office, drwrite, claudette-can-code-plugin, claude-cost, the trio = ftm-explorer + shadow-ai-assessment + governance-assessment). v07 codifies the Verification-Coverage Principle as new Section 0; adds 3 disclosures sub-blocks (compliance_claims / shipping_attestation / coverage_mutation_scope per A11.NEW-1/2/3) closing FM modes for user-facing-claim-without-verifying-test patterns; codifies Aspect 8 — Anti-Fabrication with new sub-aspect A8.2 Production-Code Stub Detection extending anti-fab from methodology-doc layer to source-code layer; extends A18 capability_scope with Sandbox-Quality-At-Stack-Selection requiring stack-rule-pack reference at TRD §6.4; adds two `/asae domain: code` checklist items (Tautology-Test Detector via banned-pattern catalog at `_grand_repo/docs/test-tautology-bans.md`; Cross-Layer Contract Verification via per-stack rule pack build-time checks). Anti-aspect-proliferation discipline preserved: no new top-level A22+ aspects; everything extends existing A8 / A11 / A18 / domain-code-checklist.
- v07.1 absorbed Methodology Mods Batch 2 + Batch 3 Locks 3/4/7/A2-strategic finalizations: Aspect 21 sub-shape #4 (Disclosure-Inline-Remediation; P3 carve-out per Krystal arbitration 2026-04-27) hook-enforced via v07.1 Tier 29 + v09 Tier 31; Lock 4 Mod 14 convergence-counter hardening (carry-forward as counter-satisfier explicitly forbidden — see Severity Classification section); Lock 7 Mod 13 Rater-Spawn Discipline (Rule A parent-only spawn + Rule B silent-failure-as-ABSENT + `rater_authored_by_context` frontmatter field; Hook v09 Tiers 33+34 enforcement; lib script `agent_invocation_history.sh`); Lock A2 strategic structured-frontmatter `passes[]` schema (forward-going alternative to prose-pattern markers; lib script `asae_pass_renderer.sh` + Hook v09 Tier 37 enforce render-equivalence; `/asae-render` skill is user-facing entry point); META-9 frontmatter fields (`audience` + `classification_reason`) added to /asae's own frontmatter as exemplar. Hook v09 Tiers 31-37 + lib script integration (mm-claude-canonical/scripts/lib/) provide commit-time enforcement layer for Locks 3/4/7/8/9/A2 strategic. v07.1 is forward-only (gates dated 2026-04-30+); v07 prose remains authoritative for prior gates.
- v08 (this version) absorbs **Hook v10** (Claudalisse W. Convergence Genius, mm-claude-canonical gate-86, 2026-05-28; commit `18f50d4`): the long-deferred **A14-A20 schema enforcement (hook Tiers 7-13) finally ships at refuse-level** — closing the SPECCED-but-DEFERRED gap that v06 opened and v07/v08-hook never delivered. The enforcement uses the **conditional-applicability + `domain:` gate pattern (Option B)**: each A14-A20 tier refuses only when its trigger fires, so `domain: documentation` / `methodology` gates stay low-friction while `domain: code` / agentic work gets the full battery. v08 also (a) adds **`methodology`** to the domain enum (the natural domain for ASAE/hook/methodology-doc authoring; mechanically accepted by Hook v10's Tier 7 case statement since gate-86; formally ratified here); (b) records that **Aspect 17 (Claim-Source Linkage) intentionally stays advisory** — it is a discipline aspect with no frontmatter block, so Hook v10 reserves Tier 10 but wires no check (rater-verified at Step 6); (c) records the **A18 split** — A18-main (`capability_scope:` schema) is now refuse-grade at Tier 11, while A18-ext (Sandbox-Quality-At-Stack-Selection / stack-rule-pack reference) remains advisory at Tier 19 (deferred to a future Hook v11); (d) introduces **Tier 38** (domain-vs-staged-diff consistency check; refuses `domain: documentation` when staged diff contains code files — a mechanical floor against domain mis-classification). The canonical machine-readable enforcement map is `mm-fm-taxonomy/docs/asae-aspect-reference-2026-05-31-v02.json` (gate-25; sha256 `a434adab4b253e8d1c73ba799f760cb93a44d1d2bc8a9e1e141cef2655d32492`). The anti-fabrication discipline that underwrites A8/A17 is consolidated in `mm-claude-canonical/references/anti-fabrication.md` (gate-88). v08 is forward-only (gates dated 2026-05-28+ are subject to Hook v10's A14-A20 refuse tiers); v07.1 prose remains authoritative for gates dated 2026-04-30 through 2026-05-27. Mod 8 sync-IO-in-async-boundary detector RESERVED for a future hook.

**v08 hook enforcement scope (Hook v10 — closes the gate-49/v06 deferral):** Hook v10 implements **Tiers 7-13** (A14-A20 schema enforcement) at **refuse-level** for gates dated 2026-05-28+, via Option B conditional applicability: Tier 7 (A14 `dependencies_attested:`) fires when `domain ∈ {code, methodology, research}` OR dependency-manifest files are staged; Tier 8 (A15 `output_execution_boundary:`) fires when staged diff produces executable output; Tier 9 (A16 `bias_disclosure:`) fires when `domain ∈ {code, research}` AND user-facing copy / ML-decision file patterns are present; **Tier 10 (A17) is RESERVED-but-unwired** (discipline aspect; no frontmatter block; rater-verified only); Tier 11 (A18-main `capability_scope:`) is **always-mandatory**; Tier 12 (A19 `hai_integrity:`) fires when `capability_scope.autonomy_level: high`; Tier 13 (A20 `identity_attestation:`) is **always-mandatory**. Hook v10 also adds **Tier 38** (domain-vs-staged-diff consistency). Hook v10 retains all v07 refuse tiers (15-20: compliance_claims / shipping_attestation / coverage_mutation_scope at refuse-level; A8.2 production-code-stub at Tier 18 ADVISORY; A18-ext stack-rule-pack at Tier 19 ADVISORY; cross-layer-contract at Tier 20 ADVISORY) + v09 Tiers 31-37 + v06 Tier 14 (recovery_events). **Still deferred to a future hook:** A8.2 AST-level stub detection (Tier 18 advisory→refuse), A18-ext stack-rule-pack config-parsing (Tier 19 advisory→refuse), Tier 36 fork-event refuse-promotion, Mod 8 Tier 21 sync-IO detection. See the canonical aspect-reference JSON (gate-25) for the full per-aspect enforcement map.

## Verification-Coverage Principle

ASAE measures verification, not passing. For each user-facing behavior the code claims, there must exist a test that fails when the behavior breaks. Tautological assertions, stub-asserting-stub patterns, and "the data layer is mocked so the test always passes" patterns do not satisfy this principle. Mutation testing (with honest scope per A11.NEW-3 — see `disclosures.coverage_mutation_scope` below) is the canonical empirical measurement when behaviors-verified can't be enumerated. Test counts and line-coverage percentages are reporting artifacts visible to operators; they are NOT quality gates and NOT user-facing claims of methodology compliance.

This is the foundational principle Batch 1 codifies after FAANG-principal adversarial reviews of 6 apps surfaced a single root-cause pattern across all 6: **infrastructure ceremony ships clean; substance behind the ceremony lags or stubs**. Coverage % was the headline metric; that's exactly what enabled the "100% coverage but exclusion-cluster carved" theater pattern (CDCC plugin's mutation scope carved to exclude every load-bearing module; claude-cost's claimed Stryker that doesn't exist; box-office's "12/12 API tests" that mocked the entire data layer). Naming the principle gives the enforcement mechanism teeth.

Operationalized at three layers in v07:
- **Companion artifact:** TQCD template renamed to TQVCD (Test Quality + Verification Coverage Document) per Phase 2 of Batch 1; §5.0 introduces "behaviors-verified / behaviors-claimed" as headline metric; §5.4 banned-phrase list refuses headline phrases like "100% test coverage" / "comprehensive test suite" / "production-grade testing" in user-facing copy without `disclosures.coverage_mutation_scope` block populated
- **Frontmatter sub-blocks:** `disclosures.compliance_claims` / `shipping_attestation` / `coverage_mutation_scope` (v07+ section below) require user-facing claims to point at verifying-test paths
- **Domain audit checklist:** `domain: code` adds Tautology-Test Detector (Mod 6) refusing banned tautological-test patterns; Cross-Layer Contract Verification (Mod 7) refusing build-time-unresolvable cross-layer calls

The principle is NOT a tooling note. It is a structural reframe: passing tests + green coverage + Stryker score in the README ≠ verified behavior; only behaviors-mapped-to-mutation-killing-tests count.

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
| `domain` | Yes | One of: `document`, `code`, `design`, `research`, `instructional_design`, `legal`, `methodology`, `other`. **`methodology`** (v08) is for ASAE/hook/methodology-doc authoring (e.g., Convergence Genius gates); it triggers Hook v10 Tier 7 (dependencies_attested) but not the code-class Tiers 8/9. **`domain` is load-bearing under Hook v10**: Tier 38 refuses `domain: documentation` when the staged diff contains code files (mechanical anti-mis-classification floor), and Tiers 7/9 condition on the domain value. If omitted, the hook defaults to `documentation` (most restrictive — triggers Tier 38 if any code is staged). |
| `asae_certainty_threshold` | Yes | Integer (default 3). Number of consecutive passes required at the exit severity policy. |
| `severity_policy` | Yes | `strict` or `standard` (see Severity Classification below) |
| `max_iterations` | No | Default 10. Halt and escalate if exceeded. |

If the caller does not provide a scope definition, the skill requests one before proceeding. No audit runs without scope.

## Required Audit Log Frontmatter Fields (v05+)

In addition to the v04 fields (gate_id / target / sources / prompt / domain / asae_certainty_threshold / severity_policy / invoking_model / round / Applied from), v05+ requires three more frontmatter blocks per gate audit log. All three are REQUIRED for every /asae invocation regardless of severity policy (D1 universal scope per 2026-04-26 standardization).

### `session_chain:` (Aspect 10 — Session-chain provenance, FM-2.1 + partial FM-1.4)

Lists prior sessions/gates this gate continues from. Closes MAST FM-2.1 (conversation reset) by structurally requiring chain-of-custody from prior context.

```yaml
session_chain:
  - kind: session_handoff
    path: <relative or absolute path to SESSION_HANDOFF_*.md>
    relation: <description of how this gate continues from that handoff>
  - kind: gate
    path: <relative or absolute path to deprecated/asae-logs/gate-NN-*.md>
    relation: <description of predecessor relationship>
  - kind: external
    path: <path to non-Martinez-Methods context if applicable>
    relation: <description>
```

Hook v05 Tier 4-extended verifies each entry resolves to existing file; refuses if chain breaks (orphan session). Backfill posture: forward-only — gates dated 2026-04-26+ require this field; older gates grandfathered.

### `disclosures:` (Aspect 11 — Required-disclosure verification, FM-2.4)

Enumerates known issues, deviations, omissions, and partial completions at gate exit. Closes MAST FM-2.4 (information withholding) by structural disclosure requirement at every handoff/exit boundary.

```yaml
disclosures:
  known_issues:
    - issue: <description>
      severity: CRITICAL | HIGH | MEDIUM | LOW
      mitigation: <or "deferred to <gate-NN>">
  deviations_from_canonical:
    - canonical: <canonical name/spec>
      deviation: <how this commit deviates>
      rationale: <why deviation was necessary>
  omissions_with_reason:
    - omitted: <what was omitted>
      reason: <why>
      defer_to: <gate-NN or "next session">
  partial_completions:
    - intended: <full scope>
      completed: <what was done>
      remaining: <what's left>
  none: false  # set to true ONLY when all four sub-blocks are explicitly empty
```

Hook v05 Tier 1c-extended requires this block; rater extension brief includes "verify disclosures honestly enumerate items rater can independently see were withheld/deviated/omitted/partially-completed."

### `inputs_processed:` (Aspect 12 — Upstream-input processing verification, FM-2.5)

For each entry in `sources:`, declare how it was processed. Closes MAST FM-2.5 (ignored other agent's input) by requiring processing-evidence at gate exit.

```yaml
inputs_processed:
  - source: <path matching an entry in sources:>
    processed: yes
    extracted: <what was extracted from this source>
    influenced: <how the extracted content influenced the gate's output>
  # OR
  - source: <path matching an entry in sources:>
    processed: no
    reason: <why source was loaded but not processed>
```

Hook v05 Rule 8 / Tier 6 verifies every entry in `sources:` has matching `inputs_processed:` entry; refuses if any source unacknowledged. D1 universal scope: required for all gates regardless of severity policy. Tier 0 propagation receipts inherit `inputs_processed:` from canonical gate — they reference rather than re-enumerate.

### `step_re_execution:` (Aspect 13 — Bounded step repetition, FM-1.3 elevation; OPTIONAL field, only required when step is a re-execution)

When a step is a re-execution of a prior step (matching step_id + hash_of_inputs in CDCC H6 step-history), the audit log frontmatter must include this field with rationale.

```yaml
step_re_execution:
  - prior_step: <step_id from CDCC step-history.jsonl>
    rationale: <why re-execution is justified>
    expected_difference_from_prior: <what should differ in this run>
```

CDCC plugin H6 hook (PreToolUse on Write/Edit/Bash — destructive tools per 2026-04-26 scope decision) blocks re-execution unless commit body contains corresponding `Step-Re-Execution: gate-NN reason "<rationale>"` trailer.

### `persona_role_manifest:` (Aspect 9 — Role-bounded action authority, FM-1.2)

Reference to the persona's role-manifest at gate-author time. Hook v05 Rule 7 / Tier 5 enforces that staged content is within role-manifest scope_bounds.

```yaml
persona_role_manifest:
  path: _grand_repo/role-manifests/<persona-slug>.yaml
  loaded_at_gate_authoring: yes
  scope_bounds_satisfied: yes
```

## Required Audit Log Frontmatter Fields (v06+)

v06 adds eight new aspects total: A14-A20 (prevention-axis multi-taxonomy aspects per gate-49 scoreboard) and A21 (recovery-axis Detect-Revert-Redelegate per Two-Axis Pitch v02). Forward-only posture: gates dated 2026-04-26+ should include these blocks (hook v06 enforces only Tier 14 / A21 at refuse-level; A14-A20 enforcement is deferred to v07 hook per the explicit scope choice in v06 lineage above). All A14-A21 schemas are documented here so authoring patterns lock in across the methodology before hook enforcement catches up.

### `dependencies_attested:` (Aspect 14 — Dependency-Provenance Attestation, F3+F5+F6+F8 closure)

Closes 11 ECs across F3 (training poisoning), F5 (model theft), F6 (supply chain — primary), F8 (RAG corpus integrity), F9, F13, F16. Each external artifact consumed during work is enumerated with integrity check and trust basis.

```yaml
dependencies_attested:
  - kind: model | dataset | package | mcp_server | tool | rag_corpus
    name: <canonical name>
    version: <version-or-commit-hash>
    source: <URL or registry path>
    integrity: <hash | signature | "verified-via-platform-N">
    trust_basis: official | internal | community-reviewed | unverified
    notes: <optional>
  - none: true   # if and only if work consumes no external dependencies
```

Hook v07 Tier 7 (deferred): presence + each entry has 5 required fields; trust_basis "unverified" requires matching disclosures.known_issues entry.

### `output_execution_boundary:` (Aspect 15 — Output-Execution-Boundary Attestation, F9+F13 closure)

Closes 4 ECs across F9 (insecure output: code execution / web injection / phishing-grade) and F13 (output integrity). When work product produces executable output (code, SQL, shell, template, config), execution-boundary controls must be declared.

```yaml
output_execution_boundary:
  produces_executable: true | false
  # if true:
  output_kinds: [code, sql, shell, template, config, ...]
  execution_boundary_controls:
    sandbox: <description or "none">
    param_escape: <description or "n/a">
    permission_scope: <runtime permissions enforced>
    human_approval_required_before_exec: true | false
    automated_static_analysis: <linter/scanner used or "none">
  rationale: <why these controls are sufficient for this output kind>
  # if false:
  rationale_no_exec_output: <e.g., "work product is documentation only">
```

Hook v07 Tier 8 (deferred): presence; if produces_executable=true, all 5 control fields required.

### `bias_disclosure:` (Aspect 16 — Bias-Audit Disclosure, F15 closure)

Closes 4 ECs across F15 (discrimination/bias). Posture options: `none` (must be defensible), `sampled`, `full`, `deferred`.

```yaml
bias_disclosure:
  posture: none | sampled | full | deferred
  rationale: <why this posture is appropriate>
  # if posture in [sampled, full]:
  method: <e.g., "demographic parity check on synthetic test set">
  groups_evaluated: [list of groups tested for]
  findings:
    - finding: <description>
      severity: low | medium | high
      mitigation: <action taken or "deferred to gate-NN">
  # if posture: deferred:
  defer_to: <gate-NN reference>
  defer_reason: <why deferral is acceptable>
  # if posture: none:
  zero_bias_surface_basis: <why work product has zero bias surface>
```

Hook v07 Tier 9 (deferred): presence + posture-conditional sub-fields.

### Aspect 17 — Claim-Source Linkage (discipline aspect, no frontmatter block, F8+F13 closure)

Closes 4 ECs across F8 (hallucinated entity) + F13 (factual hallucination, expertise misrep, unsafe code). Every assertion in the audit log must trace to a declared source via `inputs_processed[].extracted` content or `dependencies_attested[]` reference. Free-floating claims without source linkage are fabrication-prone (closes A8 anti-fabrication's blind spot for claims that look authoritative but have no traceable basis).

This is a *discipline* aspect — no frontmatter block. Verified by:
1. Independent rater Step 6 brief explicitly asks: "Are there assertions in the gate without traceable source backing?"
2. Hook v07 Tier 10 (deferred): heuristic regex on result-blocks; >2 unsourced-assertion patterns triggers WARNING; refusal level requires explicit rater FLAG.

### `capability_scope:` (Aspect 18 — Capability-Scope Attestation, F9+F10 closure)

Closes 5 ECs across F9 (tool/output) + F10 (excessive agency — primary). Diff check: actually-used tools/permissions/autonomy vs role-manifest declared scope. **A18 NOTE (per Two-Axis Pitch v02 A22-rejection rationale):** A18's scope_diff_check extends to BOTH the role-manifest's `allowed_operations` field (operation-level scope) AND `allowed_paths` field (path-level scope). The path-level concern that v01 of Two-Axis Pitch proposed as standalone A22 is folded here; runtime enforcement of paths is roadmap P3 (CDCC H8 Capability-Scope Runtime Enforcer).

**A18 extension (v07): Sandbox-Quality-At-Stack-Selection.** When Stage 00 Track 1 (Tech Stack) selection lands, the corresponding stack rule pack activates automatically. Each stack rule pack codifies the sandbox/security defaults that any application on that stack must meet. **TRD §6.4 Hook Orchestration Requirements must name the applicable stack rule pack by canonical doc path** (e.g., `_grand_repo/docs/sandbox-rules-tauri.md`). TQVCD §3 Standards Operationalized must reference the rule pack's specific defaults as exit criteria per the standard's instantiation in this stack. Stage 00 Track 1 ("Tech Stack Research") output now includes "Sandbox-model-quality assessment per candidate stack" as first-class selection criterion (not a post-hoc concern after stack pick).

Per-stack rule packs ship at `_grand_repo/docs/sandbox-rules-{stack}.md` (authored in Phase 4 of Methodology Mods Batch 1):
- `sandbox-rules-tauri.md`: csp non-null required (no `unsafe-eval`/`unsafe-inline` in script-src); `capabilities/*.json` allowlist required (no `:default` plugin permissions); SQLCipher feature flag required if "encryption at rest" claimed; `bundle.active: true` required for any "ship installer" claim
- `sandbox-rules-electron.md`: every BrowserWindow with user-content surface requires `webPreferences: { sandbox: true, nodeIntegration: false, contextIsolation: true }`; every IPC surface that ships HTML/JS to chrome-context window must sanitize via DOMPurify (or equivalent) at boundary; `csp` set non-null on every `loadFile`/`loadURL` window; auto-update requires code-signing config + `disableWebInstaller: true`
- `sandbox-rules-sveltekit.md`: `hooks.server.ts` exports `handle` setting CSP/HSTS/X-Frame-Options/Permissions-Policy; CSP nonce-mode (no `unsafe-inline`); assessment-store-equivalent exports class not instance (no SSR-shared singleton)
- `sandbox-rules-nextjs.md` / `sandbox-rules-fastapi.md` / `sandbox-rules-rest-api.md`: placeholder — author when first app on each stack surfaces

**Hook v07 Tier 19 (NEW):** detects stack via config-file presence (tauri.conf.json / electron-builder.json / svelte.config.js / next.config.js / pyproject.toml / etc.); runs the corresponding rule pack at gate time. Refuses commit if rule pack assertions fail (e.g., Tauri repo with `csp: null` is refused). Empirically observed at refuse-grade across 3 of 6 apps: box-office Tauri shipped with `csp: null` + no capabilities allowlist (tauri-plugin-shell + tauri-plugin-fs default-permissioned = remote-shell-as-a-service if any XSS lands); orchestra Tauri shipped with `unsafe-eval` (RCE-grade XSS amplifier); drwrite Electron shipped 3 chrome-context windows with default-trusting webPreferences (user-pasted markdown → script execution + file read + exfiltrate). Three stacks, three stack-specific failures, all RCE-class.

```yaml
capability_scope:
  tools_used: [list of tool IDs invoked during work]
  permissions_exercised: [list of permissions exercised]
  paths_written: [list of file globs written or modified]
  autonomy_level: low | medium | high
  # autonomy levels:
  #   low = every operation surfaces to user before commit
  #   medium = batched operations with summary surface
  #   high = operations execute, summary at gate time
  scope_diff_check:
    matches_role_manifest_operations: true | false
    matches_role_manifest_paths: true | false
    # If false on either:
    expansions:
      - kind: tool | permission | autonomy | path
        name: <which item exceeded scope>
        rationale: <why this expansion was necessary>
        approved_by: user | named-subagent | "self-approved with rationale"
```

Hook v07 Tier 11 (deferred): presence + matches_role_manifest_* booleans + expansions[] required when either is false.

### `hai_integrity:` (Aspect 19 — Human-AI Interface Integrity Attestation, F10+F12 closure)

Closes 5 ECs across F10 (excessive autonomy via missing HitL) + F12 (HitL bypass, trust exploitation, loss of agency, parasocial manipulation).

```yaml
hai_integrity:
  hitl_gates_honored:
    - gate_kind: <e.g., "tool-call-pre-execute", "commit-pre-push", "data-deletion-pre-execute">
      honored: true | false
      bypass_rationale: <required if honored=false>
      bypass_authorized_by: <user | named-subagent>
  autonomy_bounds_disclosed:
    declared: true | false
    boundary: <e.g., "no production-system writes; no external API calls outside declared list">
  manipulation_vector_check:
    posture: not_applicable | clean | flagged
    flagged_patterns: [list, e.g., "parasocial language", "emotional-coercion", "fabricated-urgency"]
    mitigation: <action taken if flagged>
  user_confirmations:
    - action: <high-impact action>
      confirmed_at: <ISO-8601 timestamp>
      method: "explicit-yes-prompt" | "permission-prompt" | "implicit-via-allowlist"
```

Hook v07 Tier 12 (deferred): conditional on capability_scope.autonomy_level=high; presence + hitl_gates_honored + autonomy_bounds_disclosed required.

### `identity_attestation:` (Aspect 20 — Persona Identity Attestation, F10+F14 closure)

Closes 4 ECs across F10 (credential abuse) + F14 (agent impersonation, user impersonation, identity compromise).

```yaml
identity_attestation:
  primary_persona:
    model: <e.g., "claude-opus-4-7">
    persona_name: <e.g., "Clauda the Value Genius v03">
    role_manifest_path: <path to YAML>
    scope_verified: true | false
    scope_violation: <description if false>
  participating_personas:
    - <same fields as primary_persona, for each subagent / co-author>
  acted_as_human: false | true
  acted_as_human_disclosure:
    user: <Krystal Martinez | other named human>
    nature_of_action: <description>
    user_authorized: true | false
    user_authorization_evidence: <ref to authorization record>
```

Hook v07 Tier 13 (deferred): presence + primary_persona 4-sub-field + acted_as_human boolean (with disclosure block if true).

### Aspect A22 (Protected-Files Capability Boundary) — REJECTED, FOLDED INTO A18

Proposed in Two-Axis Pitch v01 as standalone aspect; failed ≥3-FM-per-aspect anti-proliferation guard per FM thread rater verification 2026-04-26 (triple-counted FMs already closed by A18+A20+A21; OWASP LLM06.4 citation does not exist; NIST AML F10 was internal family code conflated with NIST canonical ID; MS-RT-AN3 mismapped). Path-level scope folded into A18's `capability_scope.paths_written` + `scope_diff_check.matches_role_manifest_paths` above. Runtime enforcement implemented via roadmap P3 (CDCC H8 Capability-Scope Runtime Enforcer). No new aspect ships.

The rejection is anti-proliferation discipline working as intended (same discipline that rejected A21-A24 candidates in gate-49 Phase 4). Documented here so downstream readers do not re-propose A22.

### Worked example — A14-A20 enforced frontmatter under Hook v10 (v08)

Hook v10 (gate-86) ships A14-A20 at refuse-level via conditional applicability. The schemas above describe each block; this is a worked example showing which blocks a real gate needs given its trigger profile. The canonical exemplar is gate-86's own audit log (`mm-claude-canonical/deprecated/asae-logs/gate-86-hook-v10-conditional-enforcement-a14-a20-2026-05-28.md`) — a `domain: methodology` gate with `autonomy_level: high`.

**Which blocks does my gate need?** Resolve by trigger:

| If your gate… | …then these A14-A20 blocks are REQUIRED (refuse if absent) |
|---|---|
| `domain: documentation`, stages only `.md`/`.json`, autonomy low/medium | `capability_scope:` (Tier 11, always) + `identity_attestation:` (Tier 13, always). Nothing else fires. |
| `domain: methodology` (e.g., ASAE/hook authoring), autonomy high | + `dependencies_attested:` (Tier 7, domain trigger) + `hai_integrity:` (Tier 12, autonomy=high). |
| `domain: code`, stages source files | + `dependencies_attested:` (Tier 7) + `output_execution_boundary:` (Tier 8, executable output) + (if user-facing copy / ML-decision code) `bias_disclosure:` (Tier 9). |
| any gate whose staged diff has code but you declared `domain: documentation` | **REFUSED by Tier 38** — change `domain:` to match the staged work, or unstage the incidental code. |

**Always-mandatory at v10 (every gate, regardless of trigger):** `capability_scope:` (A18-main, Tier 11) + `identity_attestation:` (A20, Tier 13).

**Minimal v10-compliant frontmatter for a `domain: methodology` + `autonomy: high` gate** (the most common Convergence-Genius shape; abbreviated — see the full schemas above for every sub-field):

```yaml
domain: methodology
# ... (gate_id, target, sources, asae_certainty_threshold, severity_policy,
#      session_chain, persona_role_manifest, inputs_processed, disclosures per v05+) ...

dependencies_attested:          # Tier 7 (domain trigger)
  - kind: tool
    name: <tool>
    version: <ver>
    source: <url>
    integrity: verified-via-platform-<N>
    trust_basis: official
  # OR: - none: true

output_execution_boundary:      # defensive (Tier 8 won't fire on .md/.json, but declaring is clean)
  produces_executable: false
  rationale_no_exec_output: "work product is methodology documentation"

capability_scope:               # Tier 11 (ALWAYS-MANDATORY)
  tools_used: [...]
  permissions_exercised: [...]
  paths_written: [...]
  autonomy_level: high
  scope_diff_check:
    matches_role_manifest_operations: true
    matches_role_manifest_paths: true

hai_integrity:                  # Tier 12 (fires because autonomy_level: high)
  hitl_gates_honored: [...]
  autonomy_bounds_disclosed: { declared: true, boundary: "..." }
  manipulation_vector_check: { posture: clean }
  user_confirmations: [...]

identity_attestation:           # Tier 13 (ALWAYS-MANDATORY)
  primary_persona:
    model: claude-opus-4-7
    persona_name: "<persona> v<NN>"
    role_manifest_path: _grand_repo/role-manifests/<slug>.yaml
    scope_verified: true
  participating_personas: [...]  # raters, co-authors
  acted_as_human: false
```

**Gotcha (empirical, gate-86):** do NOT include `step_re_execution:` if your gate has no re-executions — an empty `step_re_execution: []` still triggers the Step-Re-Execution trailer requirement (Tier 1c-ext) and refuses the commit. Omit the field entirely. (This is the same Quickstart v03_I amendment 3 lesson; gate-86's first commit attempt was refused on exactly this.)

The full per-aspect enforcement map (enforced/advisory/specced status, hook tier, trigger condition, FM-family coverage) is machine-readable at `mm-fm-taxonomy/docs/asae-aspect-reference-2026-05-31-v02.json` (gate-25). The anti-fabrication discipline underwriting A8/A17 is consolidated at `mm-claude-canonical/references/anti-fabrication.md` (gate-88).

### `recovery_events:` (Aspect 21 — Detect-Revert-Redelegate / DRR on F-class violations, MAST FM-1.1+1.2+3.2 + OWASP-Agentic T6+T3 + MS-RT silent-failure-family closure)

A21 (DRR) is the recovery axis. When a sub-agent's emitted work product is verified by parent governance (F8 + Aspect 9 role-manifest scope-bounds + Aspect 12 inputs-processed) and found to violate scope (committed bad code, modified protected file, false attestation, coverage drop, role-manifest violation, fabrication event), parent **reverts the violating commits + working-tree state + re-delegates with corrected constraints**. Closes 6 FMs across 3 taxonomies (verified per Two_Axis_Commercial_Pitch_2026-04-26_v02_I FM-thread-rater pass 2026-04-26):

| FM | Source taxonomy | EC ref |
|---|---|---|
| MAST FM-1.1 Disobey Task Specification | MAST | EC-44 |
| MAST FM-1.2 Disobey Role Specification | MAST | EC-45 |
| MAST FM-3.2 No or Incomplete Verification | MAST | EC-54 |
| OWASP Agentic T6 Intent Breaking & Goal Manipulation | OWASP Agentic | T6 canonical |
| OWASP Agentic T3 Privilege Compromise | OWASP Agentic | T3 canonical |
| MS-RT silent-failure family (cluster) | Microsoft AI Red Team | (cluster) |

Empirically demonstrated 4× in the CCC build (Stages 04, 05, 07, 07b — including the marquee Stage 07 fabrication-detection-at-commit-time event where a Haiku sub-agent modified protected `main.tsx` and lied about committing; parent verification independently caught the discrepancy; working tree reset; sub-agent re-delegated within scope; no human intervention). 2 of 3 IBM-recoverable MAST modes empirically demonstrated (FM-2.6 Reasoning-Action Mismatch via Stage 05; FM-3.3 Incorrect Verification via Stage 07).

```yaml
recovery_events:
  - stage_id: <string identifier of the stage that recovered>
    violation_type: scope_violation | false_attestation | coverage_drop | protected_file_mutation | role_boundary | fabrication
    detected_by: parent_verification | F8_governance | aspect_9 | aspect_12 | hook_tier_X
    revert_target: <commit_hash referenced (or "working_tree_state" literal)>
    redelegation_spec_diff: <description of corrected constraints applied to redelegation>
    recovery_pass: true | false
```

**Hook v06 Tier 14 (ACTIVE in v06 — the unblocking enforcement):** When the audit log frontmatter contains a `recovery_events:` block, the hook validates that each entry has all 6 required fields (stage_id, violation_type, detected_by, revert_target, redelegation_spec_diff, recovery_pass), that violation_type and detected_by are from the enum sets above, that revert_target is either a 7-40 character hex commit hash OR the literal string "working_tree_state", and that recovery_pass is a boolean. Tier 14 prevents fake-recovery attestation in the same way Tier 1c prevents fake rater attestation: a forged recovery event cannot pass schema validation, and the rater extension brief explicitly verifies the recovery event corresponds to actual reverts visible in git history.

**Why A21 is structurally different from /asae Steps 4-5:** Step 4 (counter reset) is audit-internal (finding caught, counter resets, loop continues against same code; no code reverts). Step 5 (apply edits) is primary-auditor self-fix (single-actor remediation). A21 DRR is parent-over-sub-agent (delegation arrangement where parent reverts the sub-agent's emitted work product; multi-actor; structural separation between "the actor that emitted the violation" and "the actor that detects and reverts"). The CCC build's 4 events demonstrate A21 working across model boundaries (Sonnet parent, Haiku sub-agents) at MVP-build scale.

**CDCC plugin integration (deferred — separate gate):** new hook H9 (Recovery Verifier) fires PostToolUse on parent verification. If parent-verification finds violation AND F8 reversion fires AND redelegation succeeds, H9 emits the recovery_events audit entry automatically. Operationalizes A21 at execution time, not just at gate time.

### Aspect 21 sub-shape — Disclosure-Inline-Remediation (4th DRR sub-shape, P3 carve-out per Krystal arbitration 2026-04-27)

The recovery_events block enumerates concrete recovery events. The DRR sub-shape characterizes the SHAPE of the recovery: what category of fix the gate represents. Three sub-shapes were established at v06 (full_revert / carry_forward / uncommitted_revert per CCC build evidence). Per Krystal arbitration on EE-DRR-CDCC-07 (2026-04-27 main thread Reliability Compositor) a 4th sub-shape is recognized: **disclosure_inline_remediation** — covers the case where a prior gate's audit log shipped with an honest disclosure, and a follow-up gate's audit log corrects the disclosure in-place (no work-product change, just an audit-log-fix that more accurately describes prior work). Empirical case: CDCC v1.1.0 build transcript L699 Stage 03 disclosure-honesty MEDIUM finding.

**Schema (top-level frontmatter field; gate-level property not per-finding):**

```yaml
drr_sub_shape: full_revert | carry_forward | uncommitted_revert | disclosure_inline_remediation
```

The 4th sub-shape `disclosure_inline_remediation` is conditional on three hardwired constraints:

1. **Constraint 1 (hook-enforced):** the commit MUST NOT touch non-audit-log files. Combined work-product/audit-log fixes are forbidden in a single commit. Sequential-commit-pattern enforced (constraint 3).
2. **Constraint 2 (rater-verified):** the rater extension brief explicitly verifies that the audit-log inline correction is honest about the prior gate's actual state — not a retroactive whitewash. Faking an inline-remediation disclosure to make a prior gate look better than it was is anti-fab per A8.1.
3. **Constraint 3 (workflow-guidance):** sequential-commit pattern — the work-product-fix commit (if any) MUST land FIRST, then a separate audit-log-fix commit with `drr_sub_shape: disclosure_inline_remediation`.

**Hook v07.1 Tier 29 enforcement (NEW per Spec Genius coordination 2026-04-28):** parses audit-log frontmatter for `drr_sub_shape:` field; if value is `disclosure_inline_remediation` AND `git diff --name-only --cached` lists any path NOT under `deprecated/asae-logs/` (or `Deprecated/asae-logs/` or `workspace/deprecated/asae-logs/`), refuse commit with structured stderr message naming the rule + non-audit-log file list + sequential-commit-pattern fix path.

**Why constraint 1 is hook-enforced and constraints 2-3 are not:**

- Constraint 1 is mechanical (file-path filtering against staged set) — bash hooks can do this reliably + at refuse-level
- Constraint 2 requires honest-evaluation of disclosure content — only rater-extension can verify; hook layer cannot
- Constraint 3 is workflow guidance for the primary thread — hook layer enforces the OUTCOME (constraint 1 refuses combined commits, forcing the primary thread to use sequential commits) but doesn't actively orchestrate the workflow

This 4-sub-shape DRR taxonomy with hook-enforced constraint 1 closes the EE-DRR-CDCC-07 boundary case where neither full_revert nor carry_forward nor uncommitted_revert cleanly characterized the recovery; option (c) hybrid disposition recognized the inline-remediation pattern but refused to allow combined commits that could obscure the work-product-fix-vs-audit-log-fix distinction.

## Required Audit Log Frontmatter Fields (v07+)

v07 adds three sub-blocks under `disclosures:` (Aspect 11) that close FM modes for the user-facing-claim-without-verifying-test patterns surfaced in Batch 1's adversarial code reviews. All three extend the existing v05+ `disclosures:` infrastructure rather than introducing new top-level frontmatter blocks (anti-aspect-proliferation discipline; A11 already had partial-completions / omissions / deviations / known-issues sub-blocks — these add three more closure axes). Forward-only posture: gates dated 2026-04-27+ should include these sub-blocks where applicable; hook v07 enforces presence at refuse-level when triggering files are touched.

### `disclosures.compliance_claims:` (A11.NEW-1, FM closure for fabricated-compliance-claim patterns)

Closes the failure mode where user-facing copy (README, SECURITY.md, marketing pages, landing pages) makes a compliance claim (e.g., "AES-256 at rest", "WCAG 2.1 AA", "100% test coverage", "SOC 2 controls applied") without a verifying test that fails when the claim breaks. Empirically observed at refuse-grade across 4 of 6 apps in Batch 1: box-office SECURITY.md "SQLCipher AES-256" while Cargo.toml had `bundled` not `bundled-sqlcipher` (DB plaintext); CDCC plugin H1 README "FS comparison" while code did `array.length > 0`; claude-cost README "Stryker mutation testing" while Stryker is not installed; drwrite "works offline" while runtime loads Google Fonts CDN.

```yaml
disclosures:
  compliance_claims:
    - claim: <verbatim user-facing claim, e.g., "SQLCipher AES-256 encryption at rest">
      verifying_test_path: <path to test that fails when claim breaks>
      last_run_passing: <ISO 8601 timestamp of last passing run>
      claim_surface: README | SECURITY.md | LANDING_PAGE | docs/x.md | etc.
    - none: true   # if and only if user-facing copy makes zero compliance claims
```

**Hook v07 Tier 15 (NEW):** when a commit touches user-facing copy (README*, SECURITY.md, marketing pages, landing pages, *_LAUNCH_*.md, *_RELEASE_*.md), verify `disclosures.compliance_claims` either (a) lists each touched-file claim with `verifying_test_path` that resolves to an existing file AND `last_run_passing` within retention window OR (b) sets `none: true`. Refuses commit if claim has no verifying test or test path doesn't resolve. Rater extension brief verifies: "for each compliance claim listed, does the cited test actually fail when the claim breaks (e.g., does flipping `bundled-sqlcipher` to `bundled` cause the test to fail)?"

### `disclosures.shipping_attestation:` (A11.NEW-2, FM closure for launch-doc-without-traced-claims patterns)

Extends A11 disclosure infrastructure for launch / release / production / readiness / v-tag docs. Each assertion in the doc must be traced to a code location (path:line) and a test location (path:line) that verifies the assertion. Empirically observed at refuse-grade in box-office: `LAUNCH_READINESS_REPORT.md` declared "READY FOR LAUNCH" with green checkmarks across SQLCipher (false), API tested 12/12 (mocks-mocking-mocks), DB migrations (function body is `Ok(())`), row-level security (doesn't exist); sign-off table listed Engineering Lead + Security Officer pattern when Krystal is solo (multi-person-review fabrication).

```yaml
disclosures:
  shipping_attestation:
    - doc_path: <path to launch/release/production/v1.x.x/readiness doc>
      claims_traced:
        - claim: <verbatim assertion from the doc>
          code_ref: <path:line in source where claim is implemented>
          test_ref: <path:line where test verifies claim>
          last_passing_run: <ISO 8601>
      reviewers_attested: [list of named reviewers; flag if "Engineering Lead, Security Officer, etc." pattern when author is solo]
    - none: true   # if no shipping/launch/release/v-tag/readiness docs in this commit
```

**Hook v07 Tier 16 (NEW):** when a commit touches a doc whose title or filename matches `(launch|readiness|production|v\d+\.\d+\.\d+|complete|release)` (case-insensitive), verify `disclosures.shipping_attestation` is populated with `claims_traced`. Each claim must have non-empty `code_ref`, `test_ref`, `last_passing_run`. Rater Step 6 verifies the `code_ref` + `test_ref` actually contain what the claim asserts (semantic check, not presence check). Solo-author + multi-name-reviewer pattern flagged at refuse-level.

### `disclosures.coverage_mutation_scope:` (A11.NEW-3, FM closure for headline-coverage-without-honest-scope patterns)

Closes the failure mode where README/marketing/SECURITY mentions a coverage % or mutation score (or claims "100% test coverage" / "production-grade testing" / equivalent headline) without disclosing what the coverage/mutation tool was scoped to exclude. Empirically observed at refuse-grade in 2 of 6 apps: CDCC plugin advertised "100/100/100/100 + 83% mutation" while `stryker.conf.mjs:4-10` carved mutation scope to exclude `audit/`, `hook-installer/`, `plan-writer/`, `cli/` — every load-bearing module. claude-cost advertised "Vitest + Stryker mutation" — Stryker not installed at all.

The TQVCD methodology already requires documented exclusions in §5.1 (TQVCD-CC-01/02/03 floors with exclusion rationale per path) and §TQVCD-TC-17 (Mutation Testing applicability + exit criteria + skip reason fields). What this lock adds is **hook-time linkage from the user-facing claim to TQVCD's existing exclusion sections** — the methodology had the disclosure infrastructure; the gap was the linkage.

```yaml
disclosures:
  coverage_mutation_scope:
    coverage:
      tool: <e.g., "vitest --coverage" | "cargo tarpaulin" | "pytest-cov">
      threshold_advertised: <e.g., "100% lines + branches">
      tqvcd_reference: <path:section, e.g., "TQVCD §5.1 + TQVCD-CC-01">
      excluded_paths_documented_at: <TQVCD-CC-NN section reference where exclusions live>
    mutation:
      tool: <e.g., "stryker" | "mutmut" | "cargo-mutants">
      score_advertised: <e.g., "83%">
      tqvcd_reference: <path:section, e.g., "TQVCD-TC-17">
      excluded_paths_documented_at: <TQVCD-TC-17 section reference where exclusions live>
    none: false  # set to true ONLY if zero coverage/mutation claims in user-facing copy
```

**Hook v07 Tier 17 (NEW):** if README or marketing files (per Tier 15 file-class) mention a coverage % or mutation score, this block must be populated AND the `tqvcd_reference` paths must resolve to actual TQVCD sections that disclose the exclusions per excluded path. Rater Step 6 verifies the referenced TQVCD sections actually enumerate excluded paths with rationale per path (semantic check). The methodology already requires documented exclusions in TQVCD; this lock requires the user-facing claim to point at that documentation.

## Aspect 8 — Anti-Fabrication (v07 codification)

A8 anti-fabrication discipline has been referenced throughout this skill (Step 6 rater anti-fabrication block, the Anti-Patterns section, the manufactured-completeness-is-corrupted-output rule per `feedback_false_balance.md`) but was not formally enumerated as a top-level aspect with sub-aspects until v07. This section codifies A8 with sub-aspects so v08 hook can implement Tier 18 enforcement against a stable target.

### A8.1 — Methodology-doc anti-fabrication (existing discipline)

The discipline already operationalized in Step 6 rater anti-fabrication block + the Anti-Patterns section. Faking a rater verdict, manufacturing rejected alternatives that don't survive examination, fabricating FM-IDs that don't exist in source taxonomies, false-balance hallucination per `feedback_false_balance.md` — all instances of A8.1. Hook v04 Tier 1c structurally enforces the rater portion (placeholder text refuses, missing verdict refuses, non-CONFIRMED-PARTIAL-FLAG verdict refuses). Methodology-doc-layer anti-fab continues to apply to all gate audits, role-definitions, methodology specs, and rater attestations.

### A8.2 — Production-Code Stub Detection (NEW v07)

Production code paths must use language-equivalent of "loud crash" for unimplemented logic — `unimplemented!()` / `todo!()` in Rust, `throw new NotImplementedError()` in TypeScript / JavaScript, `raise NotImplementedError` in Python — never silent stubs that return plausible mock values (`Ok(None)`, `false`, hardcoded literals, `undefined`, hardcoded empty arrays/strings). Distinguishes test files from production code via path heuristics: anything under `tests/` / `__tests__/`, files matching `*.test.*` / `*.spec.*` / `*.integration.*`, files marked `#[cfg(test)]` or inside a `#[cfg(test)]` mod, files under `__mocks__/` are test code; everything else under `src/` / `lib/` / `app/` / `crates/<x>/src/` is production code.

Empirically observed at refuse-grade across 3 of 6 apps in Batch 1:
- box-office `api/src/db.rs` returned hardcoded mocks for every method (`fn get_concerts() -> Vec<Concert> { vec![Concert { id: 1, name: "Hardcoded".to_string(), ... }] }`) while marketing claimed production-ready cloud sync
- CDCC plugin H3 hook wrote `decision: 'allow'` plus a marker so it never re-evaluates (silent allow-list-as-stub)
- claude-cost H6 `estimateCost` returned `undefined` — CDCC consumer's cost gates fail open silently

Methodology gap closure: A8.1 anti-fab covers fabricated FM-IDs at the doc layer; A8.2 extends to fabricated implementations at the code layer. Same discipline (substance behind the ceremony), different surface.

**Hook v07 Tier 18 (NEW):** scans the staged diff for unconditional returns of zero/undefined/false/None/empty-collection in functions whose names match the regex `(estimate|verify|validate|compute|authenticate|parse|encrypt|decrypt|fetch|store|sync|reconcile|sign|hash|encode|decode|authorize|authenticate)([A-Z][a-zA-Z]*|_[a-z_]+)?` outside test files (per the path heuristics above). Flags for rater review at refuse-level if no `unimplemented!()` / `todo!()` / `throw new NotImplementedError()` / `raise NotImplementedError` marker is present in the function body. Rationale fields can be added via inline comment `// stub-deferred: gate-NN <reason>` or equivalent per language for genuine stub-with-rationale cases.

## Severity Classification

Every finding in every audit pass is classified at one of four severity levels:

| Severity | Definition | Counter Impact (standard policy) | Counter Impact (strict policy) |
|----------|------------|----------------------------------|--------------------------------|
| CRITICAL | Factual inaccuracy, hallucination, missing required content, security vulnerability, regulatory noncompliance | Resets counter to 0; must remediate before next pass | Resets counter to 0 |
| HIGH | Logic gap, structural error, misrepresentation of source, accessibility violation, incorrect type signatures, failed test assertion | Resets counter to 0; must remediate before next pass | Resets counter to 0 |
| MEDIUM | Formatting violation, inconsistent naming, minor omission, non-idiomatic patterns | Does NOT reset counter. Must remediate before loop exit. | Resets counter to 0 |
| LOW | Style preference, minor rewording opportunity, non-material improvement | Does NOT reset counter. Logged. Remediation optional. | Does NOT reset counter. Logged. |

Default policy is `standard` unless caller specifies `strict`. Strict is appropriate for high-stakes outputs (regulatory filings, published research, production code in regulated domains).

### Lock 4 Mod 14 — Convergence-Counter Hardening (v07.1+)

Per Methodology Mods Batch 3 Lock 4 (Mod 14): the convergence counter MUST track CURRENT-LOOP consecutive clean passes only. The following carry-forward patterns are **explicitly forbidden** as counter-satisfiers:

1. **Prior-gate counter carry-forward forbidden**: a current /asae loop MUST start counter at 0. Any prior gate's PASS counter cannot satisfy the current loop's threshold. Each gate is independent.

2. **Cross-pass severity-downgrade carry-forward forbidden**: a finding that was MEDIUM (strict) in Pass N cannot be re-classified to LOW in Pass N+1 to preserve counter state. Reclassification requires (a) genuine re-evaluation surfacing new evidence that the original severity was wrong, (b) the reclassification documented in the audit log with rationale, (c) the new classification independently rater-verified per Mod 13 Rule A.

3. **Re-attestation-without-remediation forbidden**: claiming "same Pass passed independently again" without re-running the actual checks. Each Pass block MUST represent an independent re-evaluation. The Tier 1b required-phrase markers (`Same comprehensive scope` / `full re-evaluation`) attest to re-evaluation discipline at the prose surface; the underlying re-execution discipline is the auditor's responsibility.

4. **Disclosure-Inline-Remediation carve-out exception** (sub-shape #4 per Aspect 21): when a follow-up gate's audit log corrects a prior gate's disclosure in-place (no work-product change), the prior gate's substantive findings DO carry forward as historical context. The follow-up gate's counter starts fresh; the prior gate's PASS verdict and counter are untouched. Distinguished from Rule 1 above because the follow-up gate isn't "satisfying" the prior gate's threshold — it's correcting historical disclosure honesty without re-opening the prior gate's substantive scope.

**Hook v09 Tier 32 enforcement** (Phase 4 of Methodology Mods Batch 3): inspects each Pass block; if any Pass claims clean counter state but contains CRITICAL/HIGH/MEDIUM (under strict policy) finding, refuses commit. This is the hook-enforced floor; the underlying discipline (Rules 1-3 above) is auditor-responsibility per /asae Step 1 + Step 4 protocol.

**Why this hardening matters**: convergence-counter gaming was identified as PAT-CONVERGENCE-COUNTER-GAMING in the Production_Pattern_Catalog (active pattern, observed in CCC build evidence). The pattern: reclassification of severity to satisfy null cycles without remediation. Lock 4 makes the prohibition explicit at the methodology-doc surface so future-auditors don't inadvertently game the counter via reclassification or carry-forward.

## Domain Audit Checklists

When `domain` is specified, ASAE applies the domain's audit checklist in every pass. Every checklist item must be evaluated and assigned a result: PASS, FAIL (with severity), or NA (with reason).

### domain: document
- Factual accuracy (every factual claim traced to a source)
- Source fidelity (no misrepresentation of source material)
- Completeness against prompt (every requested element present)
- Internal consistency (no contradictions within the document)
- Formatting compliance (per applicable style rules)
- File naming and versioning (per project conventions)
- Compliance audit-readiness (when the document is in a regulated domain or when Track 20 is APPLICABLE): control-mapping completeness (every applicable framework control mapped to evidence in the document or referenced from it); evidence freshness (timestamps within retention window for the framework); approver chain documented (named approvers with roles, dates, and any conditions); cross-references to primary sources current (not pointing at superseded versions of the standard); jurisdiction specificity where regulations vary by region; PII / regulated-data redaction verified for any document that may be shared externally

### domain: code
- Correctness (behavior matches specification)
- Test coverage (100% line + branch coverage of testable surface, per D2R hardwired requirement)
- Security compliance (OWASP Top 10 applicable items + OWASP LLM Top 10 if AI-integrated + CERT secure coding for language) — operationalizes TRD §3.3 + Track 9 threat model
- Auth flow correctness — authentication + authorization + session management exercised end-to-end against real provider in staging (not mocked); negative-case tests cover token validation (expired, malformed, revoked, swapped); MFA enforced for required roles per TRD §3.3 + Track 15
- Accessibility compliance (WCAG 2.1 AA if UI code, per D2R hardwired requirement) — this is layer 4 of the 6-layer accessibility model in D2R; the floor, not the ceiling
- Type correctness (no type errors, explicit types where language permits)
- Naming conventions (per project conventions)
- No secrets committed (verified by gitleaks/trufflehog/detect-secrets pre-commit hook output)
- Observability instrumentation present where TRD §3.8 + Track 10 require it: structured logging at every defined level with required fields (request_id, user_id, span_id, timestamp, event, level); metrics exposed at /metrics or equivalent; distributed-tracing propagation across service hops; SLI/SLO queries implemented; alerts firing on threshold breach in staging
- Performance budget compliance per TRD §3.1 + Track 11: p50/p95/p99 measured against budgets; bundle size + memory + CPU + DB-query budgets verified; performance regression alarm thresholds enforced in CI
- Reliability pattern adherence per TRD §3.2 + Track 14: retries with backoff use bounded budgets; circuit breakers wrap downstream dependencies that can fail; idempotency keys on all idempotent endpoints; queue / DLQ patterns implemented for async work; timeouts everywhere there is network or I/O
- Release-engineering practice per TRD §3.9 + Track 16: SemVer / CalVer adhered to (CI fails on missing/malformed version); CHANGELOG entry present; feature flags used for risky changes (not unconditional merges to main); rollback path verified in staging within current release cycle
- Audit-on-observed-behavior, NOT intent (F7 anti-pattern guard): the audit MUST execute tests, typecheck, lint, and build. Reading code without running these is incomplete. Sub-agents performing this audit MUST run tests before returning verdicts. Parent verifies sub-agent diffs against scope (F8 guard) and verifies sub-agent exit-code claims against literal shell output (F10 guard); never accept a "tests pass" verdict without seeing the actual test runner output
- Tautology-test absence (Mod 6, v07): tests must verify behavior, not assert tautologies. Banned patterns enumerated in canonical catalog `_grand_repo/docs/test-tautology-bans.md` (initial list: `expect(true).toBe(true)` / `expect(true).toBeTruthy()`; `expect(x).toBeDefined()` where `x` is initialized via constant or non-nullable initializer; `expect(arr.length).toBeGreaterThanOrEqual(0)` (always true); `expect(stub).toBe(stub)` (testing the stub against itself); component tests that mock the entire data layer with `vi.fn().mockResolvedValue(literal)` then assert `screen.getByText(literal)` (verifies React renders strings, not behavior); Rust `assert!(true)` / `assert_eq!(x, x)` / `#[ignore]` without rationale comment). CI lint refuses commit on banned-pattern detection (initial impl `@martinez-methods/no-tautology-tests` ESLint custom rule; placeholder ships in catalog file, full impl in Stage 02 of remediation builds). Allowlist: `it.todo()`, `it.skip()`, `expect.assertions(N)`. Per-file exempt with `// tautology-allowed: <rationale>` comment for genuine edge cases. Closes the failure mode where box-office tests asserted `useState(false)` is defined (always true) and CDCC plugin had 11 `expect(true)` reliability tests counted in the 256-test green tally
- Cross-layer contract resolution (Mod 7, v07): every cross-layer call must resolve to an actual export at build time. Per-stack resolution checks ship as part of the stack rule pack (per A18 extension / Mod 5): Tauri rule pack adds build-time check that frontend `invoke("X")` resolves to `#[tauri::command]` export; Electron rule pack adds build-time check that contextBridge surface matches consumer call sites; SvelteKit rule pack requires every workspace `tsc --noEmit` runs in CI (closes META-5 cross-package typecheck — applies to any TS monorepo regardless of frontend framework, not SvelteKit-specific); REST-API rule pack requires typed client generated from OpenAPI spec so client can't compile against undefined endpoint. Hook v07 Tier 20 runs the per-stack contract check at gate time per stack rule pack; refuses commit on unresolved cross-layer call. Per-call exempt with `// contract-deferred: gate-NN <reason>` comment for genuinely-deferred surface. Closes the failure mode where box-office `useCloudSync.ts` called 8 Tauri commands that don't exist in `commands/mod.rs` (first real build would throw) and claude-cost web Compare button called `parsed.ok`/`parsed.value` on a return that has neither (every valid input shows "Parse error: undefined" — root cause: web `tsc --noEmit` not run in CI)

### domain: design

Used for UXD authorship gates (`/write-uxd` Step 3) and for D2R Stage NN+1 Design Polish convergence loops. Audits the visual + interaction surface of an application against the prerequisite UXD instance.

- Aesthetic anchor fidelity — rendered application is visually consistent with UXD Section 1.1 reference apps; UXD Section 1.2 brand-voice decisions are observable in the rendered output; UXD Section 1.3 polish criteria pass observable-test review
- Visual design system adherence — every color used in the application is in the UXD Section 2.1 palette; every type size is on the UXD Section 2.2 scale; every spacing value is on the UXD Section 2.3 grid; every component instance maps to a UXD Section 2.4 component token
- Interaction state completeness — every interactive component class has its full UXD Section 3.1 state set rendered (default / hover / focus / focus-visible / active / disabled / loading / empty / error / success — applicable subset)
- Empty / loading / error / success state coverage — every screen-or-surface state declared in UXD Section 3.2 is rendered with the specified copy + visual treatment + actions
- Animation and transition compliance — motion is allowed only in UXD Section 3.3 declared categories at declared durations + curves; `prefers-reduced-motion` policy honored per UXD Section 3.3
- Information architecture compliance — UXD Section 4 hierarchy rules + grouping/prioritization rules + navigation pattern observed in the rendered application
- Accessibility-as-delight (layer 6 of the 6-layer accessibility model in D2R; ABOVE WCAG 2.1 AA compliance which is gated at /asae domain=code) — ARIA label quality per UXD Section 5.1 (action verbs not nouns; describe outcome not mechanism; consistent vocabulary); keyboard nav quality per UXD Section 5.2 (focus order matches visual reading order; focus-visible always rendered; modal dialogs trap focus); screen-reader experience per UXD Section 5.3 (page landmarks present; decorative images marked decorative; live regions for async status; reading order matches visual order); motion + sensory preferences per UXD Section 5.4
- Responsive + mobile compliance — UXD Section 6 breakpoints, per-breakpoint layout changes, touch-target sizing, mobile-only patterns observed
- Anti-pattern absence — none of the UXD Section 7 named anti-patterns are present in the rendered application
- Reference design asset fidelity — rendered application visually consistent with the reference design assets at the paths declared in UXD Section 8.1 (this is the F13-equivalent reality-anchor check; without reference assets, the audit has no external anchor and re-introduces the fictional-validation tautology)

The design domain audit MUST run the application and observe the rendered output (capture screenshots; interact with components; verify state transitions). Reading code without rendering is the F7-equivalent failure mode at the design layer — the audit-on-intent-not-observed-behavior anti-pattern, applied to visual + interaction quality. A design audit that skips the render-and-observe pass is incomplete.

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

### Lock A2 strategic — Structured-frontmatter passes[] schema (v07.1+)

Per Methodology Mods Batch 3 Lock A2 strategic, audit logs MAY (forward-going optional, not required) author the Pass section as a structured `passes:` block in YAML frontmatter, with the prose body rendered via `mm-claude-canonical/scripts/lib/asae_pass_renderer.sh` and `/asae-render` skill.

**Structured form (Lock A2 strategic alternative to prose-pattern):**

```yaml
passes:
  - n: 1
    description: "Full checklist re-evaluation"
    items:
      - num: 1
        label: "Item label"
        result: "PASS"
        notes: "second independent verification"
    issues:
      critical: 0
      high: 0
      medium: 0
      low: 0
    counter: "1 / 5 consecutive clean passes"
    required_phrase: "Same comprehensive scope"
  # ... continues for all N passes
```

**Rationale**: structured form is machine-readable; prose body is generated artifact; render-equivalence enforced at commit time by Hook v09 Tier 37. Eliminates the prose-pattern parsing fragility that surfaced in `feedback_codify_what_you_mean_explicitly.md` work.

**Migration path** (prose-pattern → structured): see `/asae-render` skill at `mm-claude-canonical/skills/asae-render/SKILL.md`.

**Tactical fallback** (Lock A2 tactical): legacy audit logs without `passes[]` block continue using prose-pattern markers (Tier 1b enforcement); Tier 37 INFO-skips legacy form.

### Step 4: Update Counter

Apply the severity policy to update the consecutive-clean-pass counter per the Severity Classification table.

### Step 5: Version Bump (Target-Type-Dependent)

If target type is a document (domain: `document`, `research`, `instructional_design`, `legal`, or `other` with a document output):
- Increment version number per `file-naming-and-versioning` rule
- Move superseded version to `deprecated/` folder in the same directory

If target type is code (domain: `code`) and the target is tracked by git:
- Do NOT bump filename version. Git history carries version.
- Stage the edits for commit; the parent skill's commit gate will handle the git commit with ASAE metadata.

### Step 6: Independent Rater Verification (REQUIRED for all /asae invocations)

After the primary auditor reaches strict-N convergence (counter == threshold AND no blocking findings), spawn an independent rater to confirm the verdict BEFORE issuing PASS to the caller. REQUIRED for all /asae invocations regardless of severity policy.

**Why:** Single-persona audit is structurally vulnerable to systematic blind spots — the primary auditor is the same persona that authored the artifact. Independent verification by a different persona running the SAME identical-pass checklist against the SAME target catches discrepancies the primary missed. Per axis 3.10.I structural-prevention-vs-vigilance discipline: methodology should not require Krystal-vigilance.

**How:**

1. Spawn a subagent with no shared context with the primary auditor. Use the Agent tool with `subagent_type: general-purpose` (default; domain-specialized agent types may be substituted at caller's discretion if applicable to the audit's domain).

2. Brief the rater self-contained (independence requires zero context-leak from the primary auditor's reasoning):
   - Provide the canonical `/asae SKILL.md` path for methodology reference
   - Provide the audit log path (the primary auditor's strict-N PASS log)
   - Provide the target artifact paths
   - Direct the rater to independently re-evaluate the SAME N-item checklist defined in the audit log's Audit Scope section against the SAME target
   - Direct the rater NOT to fix anything — only rate
   - Direct the rater to return one of three verdicts: CONFIRMED | PARTIAL | FLAG
   - Direct the rater to be skeptical: do not assume good faith on individual claims; verify independently per item

3. Capture the rater's verdict in the audit log under section `## Independent Rater Verification` with:
   - Subagent type used
   - Verbatim summary of brief delivered to rater
   - Per-item or aggregate verdict
   - Specific findings (if PARTIAL or FLAG)
   - Rater's own honest gaps section

4. Disposition by verdict:
   - **CONFIRMED:** Audit proceeds to PASS. Rater verdict appended to audit log. Counter remains at threshold.
   - **PARTIAL:** Address rater's specific findings.
     - If findings are LOW severity (cosmetic): document corrected detail in a follow-up corrective gate (per gate-03-corrective-count-correction-2026-04-25.md pattern in `repos`); audit may still PASS with the corrective record committed.
     - If findings are MEDIUM/HIGH/CRITICAL: RESET counter and re-run the loop from Step 1 incorporating rater's findings as new audit-scope items.
   - **FLAG:** Audit does NOT pass. RESET counter to 0. Return rater findings to caller as new audit-scope items. Do not issue PASS.

5. PASS verdict requires CONFIRMED rater outcome OR PARTIAL with all findings classified as LOW severity and documented in a corrective gate. FLAG-verdict audits cannot exit PASS.

**CRITICAL — The rater spawn must be REAL, not simulated:**

If the rater step is reached and the verdict is not yet CONFIRMED (because no rater has been spawned yet), the ONLY correct action is to actually spawn the subagent. There is no shortcut.

**DO:**
- Use the Agent tool to spawn a real subagent with the self-contained brief specified above
- WAIT for the subagent's actual response
- Append the actual response verbatim (or faithful summary) into the audit log's `## Independent Rater Verification` section
- Include the subagent's `agentId` (returned by the Agent tool) in the audit log for traceability

**DO NOT:**
- Write a fake "CONFIRMED" verdict as if a rater confirmed it
- Author hypothetical rater findings as if they came from a subagent
- Self-write a "verdict" section by simulating what a rater might say
- Skip the rater step and proceed to PASS without actual rater verification
- Treat the rater step as ceremonial or formal-only
- Mark the rater section "[TO BE FILLED IN]" and then commit with PASS without filling it in
- Substitute the primary auditor's own re-read of the artifact for an independent rater's reading

**Why this matters:** if the audit log contains a rater verdict that was not produced by an actual subagent spawn, that is FABRICATION (per F1 fabrication failure mode + `feedback_false_balance.md` manufactured-completeness-is-corrupted-output rule). The audit log loses its evidentiary value AND reproduces the exact failure mode the rater step was added to close (single-persona audit blind spots).

The rater step exists BECAUSE single-persona audit is structurally insufficient. Faking the rater verdict is not just a process violation — it's the definitional opposite of what the rater step is for. A faked rater verdict is worse than no rater verdict, because it claims independence that does not exist.

If you find yourself about to write a "CONFIRMED" rater verdict without having spawned an actual subagent: STOP. Spawn the subagent. Wait for the real response. Then proceed.

**Rater spawn applicability:**
- **REQUIRED** for all /asae invocations regardless of severity policy
- **EXEMPT** for merge commits and revert commits (already exempt from Rule 2 ASAE attestation per commit-msg hook spec)

### Step 6 Lock 7 — Mod 13 Rater-Spawn Discipline (v07.1+)

Per Methodology Mods Batch 3 Lock 7, two additional rules harden Step 6 against the F1 fabrication failure mode + sub-agent self-substitution recurrence (PAT-SUB-AGENT-SELF-RATING-RECURRENCE) + silent-failure-as-ABSENT pattern (PAT-RATER-SILENT-FAILURE):

**Rule A — Parent-only rater spawn (anti-self-substitution):**

The rater Agent-tool spawn MUST be performed by the parent thread (the thread running /asae). Sub-agents (workers spawned by the parent) MUST NOT self-spawn raters. Rationale: a sub-agent spawning a rater is structurally indistinguishable from a sub-agent rating its own output (the spawn happens in the same context); this defeats the independence the rater step exists for.

Operational consequence: if /asae is invoked from inside a sub-agent context, that sub-agent must surface the rater requirement back up to the parent thread. The parent spawns the rater. The sub-agent's audit log explicitly notes "rater spawned by parent thread" so the audit trail is honest.

Schema requirement: audit log frontmatter MUST include `rater_authored_by_context: parent` field declaring parent-thread-spawned discipline. Legacy gates without this field default to legacy-compat-prose-marker (audit log body says "Mod 13 Rule A parent-only spawn" or equivalent in rater section).

Hook v09 Tier 33 enforcement: parses `rater_authored_by_context:` frontmatter field OR scans rater section for legacy-compat prose marker; refuses commit if neither present + checks `**Rater agentId:**` lines for distinct values (no duplicate self-spawn). Backed by `mm-claude-canonical/scripts/lib/agent_invocation_history.sh --validate <audit-log>`.

**Rule B — Silent-failure-as-ABSENT (anti-rater-skip):**

If a rater spawn returns 0-byte output, times out, or otherwise fails to produce a verdict, the rater verdict counts as ABSENT (not as PASS, not as PARTIAL). ABSENT verdict = gate FAIL (cannot exit PASS).

Recovery protocol: tiered re-attempt mechanism:

1. Re-spawn rater with same brief (same Agent tool invocation; new agent instance). If second attempt succeeds → record verdict + agentId, audit log notes "first-attempt silent failure" in honest gaps.
2. If second attempt also fails → spawn rater with different mechanism (e.g., domain-specialized agent type if applicable to audit domain; or alternative subagent_type). Record both prior agentIds + the new mechanism + verdict.
3. If third attempt also fails → escalate to caller with rater-unavailable status. Gate cannot exit PASS until rater verdict is obtained.

Rule B prevents the silent-skip pattern where audit log just stops mentioning the rater after a failed attempt + caller infers "rater not needed." The audit log MUST explicitly document the silent-failure + recovery attempts; faking a CONFIRMED verdict to bypass a failed rater spawn is anti-fab per A8.1.

Hook v09 Tier 34 enforcement: if audit log declares strict-N + 2-rater requirement, ALL `**Rater verdict:**` lines MUST eventually resolve to CONFIRMED for gate PASS. PARTIAL verdicts without documented PARTIAL→CONFIRMED transition (via "Initial pass note" or "post-fix re-verification" prose marker) trigger refuse.

**Rater_authored_by_context schema field (v07.1+):**

Audit log frontmatter SHOULD include this field at top-level alongside other gate fields:

```yaml
rater_authored_by_context: parent
```

Legal values: `parent` (default; required for strict-5 + 2-rater under Mod 13 Rule A), `legacy_compat_prose_marker` (for gates pre-v07.1 that use prose marker in rater section instead of frontmatter field).

Forward-only: gates dated 2026-04-30+ with strict-5 + 2-rater MUST use `rater_authored_by_context: parent` (or pass Tier 33's legacy-compat prose marker check). Pre-v07.1 gates may continue using prose marker only.

### Step 6 Exemplar — What A Good Rater Spawn Looks Like (gate-69 pattern, EE-RATER-SG-01)

The gate-69 Spec Genius role-definition lock-in rater spawn (2026-04-27, agentId `a091234b0ca0e3b05`) is the gold-standard reference pattern. Cite this when uncertain how to structure a Step 6 brief; SSOT entry EE-RATER-SG-01 has the full brief content. The pattern's six load-bearing properties:

1. **Real Agent-tool spawn**, not a simulated rater. Use the Agent tool with `subagent_type: general-purpose` (or a domain-specialized agent type if applicable). The rater output appears in the audit log as a verbatim quote of the subagent's actual response.

2. **Self-contained brief.** The rater has zero context from the primary auditor's reasoning. The brief must include: paths to all artifacts under audit (absolute or repo-relative), paths to canonical reference docs, the full N-item checklist defined in the audit log's Audit Scope section, and the exact disposition options (CONFIRMED | PARTIAL | FLAG).

3. **Skeptical-instruction discipline.** Include verbatim language directing the rater to be skeptical, not deferential. Gate-69's brief used: *"Be skeptical. Do not defer to the primary auditor. Open files yourself, run checks yourself, return what you actually find."* Independence requires this explicit instruction; without it, raters tend to rubber-stamp.

4. **Per-item structured findings.** Direct the rater to return one finding per checklist item (not a single aggregate verdict). Each finding has: item name + verdict (CONFIRMED | PARTIAL | FLAG) + technical-check evidence (e.g., line numbers, grep results, file existence checks, byte-equality comparisons).

5. **Honest-gaps section.** Direct the rater to enumerate the limitations of their own verification (e.g., "did not run propagation script end-to-end", "YAML schema check via library only, not against published JSON-Schema"). Honest gaps from the rater are first-class evidence of audit thoroughness; raters who claim no gaps are suspect.

6. **agentId capture.** Direct the rater to return their subagent agentId in the response. The agentId appears in the audit log for provenance + future cross-referencing. If unavailable, a synthesized identifier (`general-purpose-subagent-<gate-id>`) is acceptable but lower-fidelity.

**Brief template** (adapt per gate; gate-69 used this exact structure):

```
You are an independent rater for a Martinez Methods ASAE strict-N gate. The primary
auditor has authored [N artifacts] for [purpose]. Your job is to independently
verify the work and return CONFIRMED, PARTIAL, or FLAG with per-item findings +
honest gaps + your subagent agentId.

Be skeptical. Open files yourself, run checks yourself, return what you actually find.

## Context
[1-2 paragraphs explaining the gate's purpose + lineage]

## The N staged artifacts to verify
[bulleted list of paths]

## The audit log to verify
[path; rater section will go in `## Independent Rater Verification` placeholder]

## Reference / template artifacts
[bulleted list of canonical reference paths for cross-checks]

## N-item checklist to verify INDEPENDENTLY
[verbatim copy of the audit log's Audit Scope section, item-by-item]

## What to return
[exact structure: subagent type / brief summary / verdict / per-item findings /
honest gaps / agentId]

Be specific. If you see a real problem, FLAG it; do not manufacture issues to
look balanced, but do not rubber-stamp either.
```

**Empirical motivation:** EE-RATER-SG-01 SSOT entry (2026-04-27 evidence pass) identified gate-69's rater spawn as the structural floor for Step 6 quality. Gates with shorter or less-skeptical briefs produce raters who CONFIRM-without-checking; gates with the gate-69 structure produce raters who actually find problems (gate-71 + gate-55 raters both surfaced PARTIAL findings the primary auditor missed; both findings were corrected inline before final convergence verdict). The structured brief is a cause-not-just-correlation: vague briefs invite rubber-stamping, structured briefs invite real verification.

## Iteration Semantics

One loop = Steps 1 through 5. Continue iterating from Step 1 until exit condition.

### Exit Conditions

**Pass:** Counter reaches the configured ASAE Certainty Threshold AND no MEDIUM-severity findings are outstanding.

**Halt:** Iteration count exceeds `max_iterations` (default 10). Return status `HALT` to caller with a report of the final pass's findings. Parent skill decides whether to escalate, re-scope, or abandon.

### What Counts As A Pass

A pass requires ALL of:
1. The full audit (Step 1) returns zero findings at CRITICAL, HIGH, and (under strict policy) MEDIUM severity
2. Counter increments only on a full, comprehensive pass with no severity-resetting findings
3. **Independent rater verdict is CONFIRMED** (per Step 6) — required for all /asae invocations regardless of severity policy

Partial audits do not count. If an audit pass checks only some domain checklist items, it is not a pass — it is an incomplete audit. Run the full checklist every time.

Single-persona audits do not count. Independent rater verification per Step 6 is required for all /asae invocations.

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
- **Independent Rater Verification section** (per Step 6): subagent type used, verbatim summary of brief delivered, verdict (CONFIRMED | PARTIAL | FLAG), specific findings if any, rater's own honest gaps section

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
  "independent_rater": {
    "verdict": "CONFIRMED" | "PARTIAL" | "FLAG",
    "subagent_type": "<agent type used; default general-purpose>",
    "findings_count": <integer>,
    "corrective_gate_path": "<path if PARTIAL>" | null
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
- **Skipping Step 6 (independent rater) on any /asae invocation.** Single-persona audit + structural enforcement at hook layer is necessary but not sufficient; independent rater catches blind spots structural enforcement cannot detect. Per axis 3.10.I structural-prevention-vs-vigilance: methodology should not require Krystal-vigilance.
- **Briefing the rater with shared context from the primary auditor's reasoning.** Independence requires zero context-leak. The rater must arrive at their verdict via their own reading of artifacts + the canonical /asae SKILL.md, not via the primary auditor's narrative.
- **Treating PARTIAL with LOW findings as silently acceptable.** PARTIAL with LOW findings still requires a corrective gate (per gate-03 pattern in `repos`) to document the corrected detail. The corrective gate is the audit-trail-of-record for the correction.
- **Authoring fake rater verdicts in the audit log without a real subagent spawn.** The Independent Rater Verification section must contain output from an actual Agent tool invocation, not self-authored content simulating what a rater might say. Per F1 (fabrication failure mode) + `feedback_false_balance.md` (manufactured completeness is corrupted output): faking the rater verdict produces CORRUPTED OUTPUT that loses evidentiary value AND reproduces the exact failure mode the rater step was designed to close. If the rater step is reached and the verdict is not yet CONFIRMED, the correct action is to ACTUALLY SPAWN THE SUBAGENT — not to fake the rating or verdict. There is no shortcut.

## Related Skills

- `/dare-to-rise-code-plan` — Invokes this skill at every stage boundary
- `/file-versioning` — Used in Step 5 for document outputs
- `/file-presentation` — Used when presenting the audit log file to the user

## Related Rules

- `file-naming-and-versioning` — Governs Step 5 document version bumps
- `no-silent-execution` — Every loop iteration produces the Step 3 in-thread summary
- `ip-language-discipline` — Branded terminology only in all outputs
