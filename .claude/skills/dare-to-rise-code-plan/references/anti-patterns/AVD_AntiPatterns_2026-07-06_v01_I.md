---
title: "AVD Anti-Patterns — reference"
filename: AVD_AntiPatterns_2026-07-06_v01_I.md
companion_skill: write-avd
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 7 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
per_L7: "separate anti-pattern reference per /write-* skill; in-SKILL sections become summary pointers"
---

## Purpose

Consolidate the failure modes specific to authoring an Architecture Vision Document under `/write-avd`, so the skill itself can stay lean (a pointer) while this doc carries the full rationale and fix for each. The AVD describes the system's high-level shape downstream of the PRD (what it IS) and TRD (what it MUST DO) — its distinctive failure modes are ungrounded authorship, Claude making architecture decisions that belong to the user, and skipping the trivially-simple-project escape hatch (or its inverse: skipping real architecture work by mislabeling a project trivial).

## Anti-patterns

1. **Authoring an AVD without PRD and TRD** — proceeding to describe system shape, components, or data flow without both prerequisite documents approved. Architecture decisions made without a grounded problem statement (PRD) and grounded technical requirements (TRD) are guesses — there's nothing to justify why the shape looks the way it does. Fix: refuse to proceed if either is missing; offer `/ideate-to-d2r-ready` or the specific missing skill (`/write-prd`, `/write-trd`).

2. **Inventing architectural decisions the user hasn't made** — Claude deciding the language, framework, sync/async model, or monolith/services split on the user's behalf and presenting it as settled, because deciding is faster than asking. The AVD's Architectural Decisions section exists specifically to record user-facing decisions with rationale; if Claude fills them in unilaterally, the mini-ADRs become fiction and the "why" trail is worthless. Fix: for every significant decision, either capture the user's actual choice + rationale, or flag it as an Open Architectural Question — never silently decide and record it as if the user chose it.

3. **Skipping mini-ADRs for significant decisions** — recording a decision ("we used Svelte") without the rationale, alternatives considered, or trade-offs, or omitting the mini-ADR entirely for a decision that clearly qualifies as significant (language choice, framework choice, sync/async choice, monolith/services choice, client/server choice). Mini-ADRs are the audit trail for why the architecture looks this way; without them, a future reviewer (or a re-architecture effort) has no way to know whether the decision was deliberate or accidental. Fix: every significant decision gets a mini-ADR with specific rationale — "we liked it" is not a rationale; name the trade-off actually being made (e.g., "chose SSR over CSR for SEO requirements in TRD Section 3").

4. **Producing a full AVD for a trivially simple project** — running the entire Step 3–5 authoring flow (System Shape, Components, Data Flow, Deployment, Cross-Cutting Concerns, mini-ADRs) on a single-file utility with no cross-component boundaries and no architectural decisions to make. This wastes authoring effort and produces a document with padded, low-content sections just to satisfy the template's shape. Fix: assess triviality first (Step 2) — single file, no cross-component boundaries, no language/framework/sync-async/monolith-services/client-server decisions — and if trivial, produce the Skipped-Status AVD (Step 2a) instead: a short statement of evaluation + specific rationale + stakeholder acknowledgment.

5. **Misusing the Skipped-Status escape hatch to avoid real architecture work** *(derived)* — labeling a project "trivially simple" when it actually has cross-component boundaries or unmade architectural decisions, in order to skip the harder authoring work. This produces the inverse failure of #4: a project that needed a real AVD ships without one, and downstream D2R stages inherit unexamined architecture risk. Fix: apply the triviality signals literally (single file AND no cross-component boundaries AND no architectural decisions) — if any signal is false, author the full AVD; don't let time pressure relabel a real project as trivial.

6. **Every component missing inputs/outputs/responsibility** *(derived from ASAE domain checks in Step 5)* — listing components by name only ("Auth Service," "Data Layer") without specifying what each takes in, produces, or is responsible for. This makes the Components And Boundaries section unusable for anyone trying to reason about where a bug or a change belongs. Fix: every component entry needs inputs, outputs, and a one-line responsibility statement — no bare name-only entries.

7. **Data flows that aren't traced end-to-end** *(derived from ASAE domain checks in Step 5)* — describing a data flow's origin without following it to its persistence point or final consumer, leaving gaps a reader has to infer. Fix: every primary data flow must be traced from source to terminus (persistence point, external system, or user-facing output) with no unstated hops.

## Summary-pointer text

Full anti-pattern catalog with rationale and fixes lives in `AVD_AntiPatterns_2026-07-06_v01_I.md` (references/anti-patterns/) — covers PRD/TRD-less authorship, Claude inventing architecture decisions, skipped or unrationaled mini-ADRs, misuse of the Skipped-Status escape hatch (both over- and under-application), components missing inputs/outputs/responsibility, and data flows not traced end-to-end.

## Honest gaps

Anti-patterns 1–4 were extracted directly from the `## Anti-Patterns` section of `write-avd/SKILL.md` (near-verbatim rationale, expanded with the "why it's bad" and "fix" framing this doc's format requires). Anti-pattern 5 is a derived inverse of #4, flagged because the skill's own "When NOT To Use" triviality signals create room for the opposite failure (avoiding real work by mislabeling), which the skill file doesn't call out explicitly. Anti-patterns 6–7 were not listed under the skill's `## Anti-Patterns` heading but were derived from the domain-specific ASAE checks in Step 5. This doc has not been run through an ASAE pass; whether it needs a bundle-index entry alongside the other `references/` files is deferred to whoever wires the in-SKILL pointer change into the live `write-avd/SKILL.md`.
