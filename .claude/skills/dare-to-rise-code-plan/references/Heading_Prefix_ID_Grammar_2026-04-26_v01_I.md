# Heading Prefix ID Grammar

**Document ID:** Heading_Prefix_ID_Grammar_2026-04-26_v01_I
**Status:** Initial (I)
**Owner:** Krystal Martinez (kjm2145@columbia.edu)
**Last Updated:** 2026-04-26

---

## 1. Purpose

This reference defines the canonical grammar for heading-prefix IDs used across all Dare-to-Rise code-plan artifacts (PRD, TRD, AVD, TQVCD, UXD, and bundle indexes). Heading-prefix IDs are short, stable, machine-parseable tokens placed at the start of every numbered heading in a deliverable. They serve four functions:

1. **Stable cross-referencing** — any line in any artifact can reference any heading in any other artifact by ID alone, without depending on heading text or page number.
2. **Bundle-index-friendly enumeration** — the Bundle Index Schema (see companion reference) consumes these IDs verbatim as primary keys.
3. **Diff resilience** — heading text can be reworded without breaking inbound references, as long as the prefix ID is preserved.
4. **Tooling target** — downstream scripts (link-checkers, coverage matrices, traceability reports) parse the prefix to build dependency graphs.

This document is the single source of truth for prefix construction. If any template appears to contradict this grammar, the grammar wins and the template is in error.

---

## 2. Scope

In scope:

- Heading-prefix IDs in all `.md` artifacts produced under the `dare-to-rise-code-plan` skill.
- Anchor syntax for in-document and cross-document links.
- Reserved namespaces and conflict resolution rules.

Out of scope:

- Filename grammar (covered by `File_Naming_And_Versioning_2026-04-26_v01_I.md`).
- Section-body identifiers such as requirement IDs (`PRD-FR-001`), test IDs (`TQVCD-T-042`), or risk IDs (`AVD-R-007`) — these have their own grammars defined inside their respective templates.
- Identifiers used inside source code (variable names, type names, etc.).

---

## 3. The Grammar

### 3.1 Formal definition (EBNF)

```
heading-prefix   = artifact-code "-" section-path
artifact-code    = "PRD" | "TRD" | "AVD" | "TQVCD" | "UXD" | "PSCAD" | "BIDX" | "REF"
                 | "ADR" | "RUNBOOK"
section-path     = section-segment { "." section-segment }
section-segment  = digit { digit } | scoped-segment
scoped-segment   = scope "-" segment-kind "-" digit { digit }    (* RUNBOOK only *)
scope            = lower-letter { lower-letter | digit | "-" }
segment-kind     = "step" | "alert" | "action"
digit            = "0" | "1" | ... | "9"
lower-letter     = "a" | "b" | ... | "z"
```

A heading line in a deliverable then takes the form:

```
## <heading-prefix> <heading-text>
```

Examples:

- `## PRD-1 Purpose`
- `### PRD-1.2 Out-of-scope`
- `## TRD-4.3.1 Persistence layer choice`
- `## AVD-7 Risk register`
- `### TQVCD-3.2 Acceptance criteria mapping`
- `## UXD-2.1 Primary persona`
- `## BIDX-1 Bundle manifest`
- `## REF-1 Purpose` (this document, section 1)

### 3.2 Artifact codes

| Code      | Artifact                                  | Scope            | Plural form in prose |
|-----------|-------------------------------------------|------------------|----------------------|
| `PRD`     | Product Requirements Document             | bundle-doc       | PRDs                 |
| `TRD`     | Technical Requirements Document           | bundle-doc       | TRDs                 |
| `AVD`     | Architecture & Validation Document        | bundle-doc       | AVDs                 |
| `TQVCD`   | Test Quality + Verification Coverage Doc  | bundle-doc       | TQVCDs               |
| `UXD`     | User Experience Document                  | bundle-doc       | UXDs                 |
| `PSCAD`   | Pattern-Space Coverage Audit Document     | bundle-doc       | PSCADs               |
| `BIDX`    | Bundle Index                              | bundle-manifest  | bundle indexes       |
| `REF`     | Reference document (e.g., this file)      | reference        | references           |
| `ADR`     | Architectural Decision Record (standalone)| standalone-file  | ADRs                 |
| `RUNBOOK` | Operational Runbook                       | standalone-file  | runbooks             |

These ten codes are the **closed set** post-Methodology Mods Batch 2 Mod 8 (PSCAD addition 2026-04-27). Adding a new code requires an amendment under the protocol defined in `Methodology_Versioning_And_Amendment_Protocol_2026-04-26_v01_I.md`. v01 of this grammar shipped with 9 codes (PRD/TRD/AVD/TQCD/UXD/BIDX/REF/ADR/RUNBOOK); v02 cascade per Mod 6.5 renamed TQCD→TQVCD; v03 cascade per Mod 8 adds PSCAD as the 10th code.

**Scope distinctions and collision rules:**

- **`ADR-NN`** is for *standalone* Architectural Decision Record files — one decision per file, the decision being weighty enough to warrant living outside the AVD. Filename grammar (canonical, per `File_Naming_And_Versioning §4.3`): `<bundle-slug>_ADR-NN_<decision-slug>_<YYYY-MM-DD>_v<NN>_<status>.md`. Section heading inside the file: `### ADR-NN: <Title>`. **Does not collide** with `AVD-AD-NN` because the scopes differ: `AVD-AD-NN` is a doc-section inline decision *inside* an AVD; `ADR-NN` is a file-level standalone decision. A bundle MAY contain both; cross-references use the full prefix to disambiguate.

- **`RUNBOOK-<scope>-<kind>-NN`** is for operational runbooks tracking observability, on-call, and release-engineering procedures. Unlike other artifact codes, RUNBOOK uses a *scoped section path* (see EBNF above). Format examples:
  - `### RUNBOOK-deploy-step-01 Pre-flight checks`
  - `### RUNBOOK-incident-alert-04 Database connection saturation`
  - `### RUNBOOK-rollback-action-02 Revert and notify`

  The `<scope>` is a kebab-cased domain tag (e.g., `deploy`, `incident`, `rollback`, `oncall`). The `<kind>` is one of `step` (procedural step), `alert` (alarm definition), or `action` (remediation action). Filename grammar (canonical, per `File_Naming_And_Versioning §4.4`): `<bundle-slug>_RUNBOOK-<scope>_<YYYY-MM-DD>_v<NN>_<status>.md` — a single file may host one scope's full set of steps/alerts/actions. The Bundle Index tracks RUNBOOK files in a dedicated roster (see Bundle_Index_Schema §4.2.1).

### 3.3 Section path rules

1. **Numeric only.** Section segments are always integers. No letters, no Roman numerals, no zero-padding (use `1`, not `01`).
2. **Top-level sections start at 1**, not 0. Section 0 is reserved for front-matter / preamble headings that do not appear in the table of contents.
3. **Depth is unbounded but discouraged past 4 levels** (`X.Y.Z.W`). Past depth 4, prefer prose with bold sub-labels over more numbered subsections.
4. **No skipping.** If a document has section `3.2`, it must also have `3.1`. Renumber on amendment if a section is removed.
5. **No re-use within a document.** A given prefix may appear at most once per artifact. Cross-document re-use is fine and expected (e.g., both PRD-1 and TRD-1 are "Purpose").

### 3.4 Anchor syntax

For Markdown rendering, every numbered heading also gets a slug-style anchor derived from the prefix:

```
## PRD-1 Purpose          → anchor: #prd-1-purpose
### PRD-1.2 Out-of-scope  → anchor: #prd-1-2-out-of-scope
```

The grammar is: lower-case the prefix, replace dots with hyphens, append a hyphen and the kebab-cased heading text. Most Markdown renderers do this automatically; the rule is documented here so authors can hand-construct stable links when needed.

For cross-document links, prefer the relative-path form:

```
[see TRD-4.3.1](../TRD/TRD_<slug>_<date>_<version>.md#trd-4-3-1-persistence-layer-choice)
```

For prose mentions where a hyperlink is overkill, the bare ID is sufficient and conventional:

> "...as captured in TRD-4.3.1, the persistence layer choice depends on..."

---

## 4. Conflict and edge cases

### 4.1 Front matter

Front-matter headings (document title, status block, table of contents) use prefix `<CODE>-0` or no prefix at all. They do not appear in cross-references and may be renumbered freely.

### 4.2 Appendices

Appendices follow the same grammar but conventionally start at section 90 to leave room: `## PRD-90 Appendix A: Glossary`, `## PRD-91 Appendix B: ...`. This is a soft convention, not a rule — appendix numbering may also continue the main sequence if the author prefers.

### 4.3 Renumbering on amendment

When an amendment removes a section, the section is **not renumbered away**. Instead, the heading is replaced with a tombstone:

```
## PRD-3.2 [REMOVED in v02 — see PRD-3.5]
```

This preserves stable references from older artifacts and makes the amendment history visible. Full renumbering is permitted only on a major version bump (e.g., `v01` → `v02`) and must be flagged in the amendment log.

### 4.4 Forward references

A heading may reference a not-yet-written section by ID. The link will simply 404 until the section exists. This is acceptable during drafting; the link-checker will flag it. Do not invent placeholder sections solely to make links resolve.

---

## 5. Worked example

Suppose a PRD has the following structure:

```
# Product Requirements: Cold-read system for 2026-04-25

## PRD-0 Front matter
## PRD-1 Purpose
### PRD-1.1 Problem statement
### PRD-1.2 Out-of-scope
## PRD-2 Personas
### PRD-2.1 Primary persona
### PRD-2.2 Secondary personas
## PRD-3 Functional requirements
### PRD-3.1 Capture
### PRD-3.2 Review
### PRD-3.3 Export
## PRD-90 Appendix A: Glossary
```

The corresponding TRD might cross-reference these as:

> "TRD-4.3 satisfies PRD-3.2 and PRD-3.3 by..."

And the bundle index would list:

```
| ID         | Heading                       | File                              |
| PRD-1      | Purpose                       | PRD_cold-read_2026-04-25_v01_I.md |
| PRD-1.1    | Problem statement             | PRD_cold-read_2026-04-25_v01_I.md |
| ...        | ...                           | ...                               |
```

---

## 6. Compliance checklist

A deliverable conforms to this grammar if and only if:

- [ ] Every numbered heading has a prefix of the form `<CODE>-<section-path>`.
- [ ] The artifact code matches the document type from the closed set in section 3.2.
- [ ] Section paths use only digits and dots, with no zero-padding and no skipped numbers.
- [ ] No prefix appears more than once in the document.
- [ ] Removed sections are tombstoned, not deleted, within a minor version.
- [ ] All inbound cross-references in companion artifacts still resolve.

A simple grep regex to audit a file:

```
^#{1,6} (PRD|TRD|AVD|TQVCD|UXD|BIDX|REF|ADR)-\d+(\.\d+)*\s+\S
^#{1,6} RUNBOOK-[a-z][a-z0-9-]*-(step|alert|action)-\d+\s+\S
```

Lines that match are compliant headings; numbered headings that do not match are violations.

---

## 7. Change log

- **v01 (2026-04-26):** Initial grammar. Closed set of 9 artifact codes (PRD, TRD, AVD, TQVCD, UXD, BIDX, REF, ADR, RUNBOOK). RUNBOOK uses scoped section paths (`<scope>-<kind>-NN`) instead of dotted numerics. ADR is reserved for standalone decision records, distinct in scope from inline AVD-AD-NN. Tombstone rule for amendments. ALOG / AUDIT / HANDOFF / REPORT deferred — admit by amendment when concrete cross-reference use cases emerge.
