# Bundle Index Schema

**Document ID:** Bundle_Index_Schema_2026-04-26_v01_I
**Status:** Initial (I)
**Owner:** Krystal Martinez (kjm2145@columbia.edu)
**Last Updated:** 2026-04-26

---

## 1. Purpose

A **bundle** is the set of artifacts that, together, fully specify a single coding initiative under the Dare-to-Rise methodology: typically one PRD, one TRD, one AVD, one TQVCD, one UXD, and one PSCAD, plus any references they pull in. (Per Methodology Mods Batch 2 Mod 8, PSCAD ships as the 6th D2R sibling doc 2026-04-27.) A **bundle index** (file ID prefix `BIDX`) is the manifest that names the bundle, lists its artifacts with versions and hashes, and exposes a flat heading-prefix table for cross-artifact navigation and traceability.

This reference defines the canonical schema for bundle indexes. Every bundle MUST ship with exactly one bundle index, and every bundle index MUST conform to this schema. Tooling (link-checkers, coverage matrices, agent skills) reads the index first to discover the rest of the bundle.

---

## 2. Scope

In scope:

- Required and optional sections of a bundle-index `.md` file.
- The flat heading-prefix table format and its column semantics.
- Versioning, hashing, and integrity rules for bundle contents.
- The relationship between the bundle index and individual artifacts.

Out of scope:

- The internal structure of PRD/TRD/AVD/TQVCD/UXD/PSCAD artifacts (covered by their templates).
- The heading-prefix grammar (covered by `Heading_Prefix_ID_Grammar_2026-04-26_v01_I.md`).
- The amendment workflow (covered by `Methodology_Versioning_And_Amendment_Protocol_2026-04-26_v01_I.md`).

---

## 3. File location and naming

A bundle index lives at the root of its bundle directory. Filename grammar:

```
BIDX_<bundle-slug>_<YYYY-MM-DD>_v<NN>_<status>.md
```

- `<bundle-slug>` is a kebab-cased short name for the initiative (e.g., `cold-read`, `inventory-rewrite`).
- `<YYYY-MM-DD>` is the date the bundle was first opened, not the date of the most recent amendment.
- `<NN>` is the bundle version (zero-padded, two digits): `v01`, `v02`, ...
- `<status>` is one of: `I` (Initial draft), `R` (under Review), `A` (Approved), `S` (Superseded), `D` (Deprecated).

Example: `BIDX_cold-read_2026-04-25_v01_I.md`

A bundle directory then looks like:

```
cold-read_2026-04-25/
├── BIDX_cold-read_2026-04-25_v01_I.md     ← THIS file
├── PRD_cold-read_2026-04-25_v01_I.md
├── TRD_cold-read_2026-04-25_v01_I.md
├── AVD_cold-read_2026-04-25_v01_I.md
├── TQVCD_cold-read_2026-04-25_v01_I.md
├── UXD_cold-read_2026-04-25_v01_I.md      ← optional
└── references/                             ← optional, bundle-specific refs
```

---

## 4. Required sections

Every bundle index MUST contain the following sections, in this order, with these exact heading-prefix IDs.

### 4.1 BIDX-1 Bundle manifest

A YAML or table block listing bundle-level metadata:

```
| Field             | Value                                       |
|-------------------|---------------------------------------------|
| Bundle ID         | cold-read_2026-04-25                        |
| Bundle slug       | cold-read                                   |
| Opened            | 2026-04-25                                  |
| Version           | v01                                         |
| Status            | I (Initial draft)                           |
| Owner             | Krystal Martinez <kjm2145@columbia.edu>    |
| Methodology       | Dare-to-Rise 0.3.0 (2026-04-26)             |
| Last index update | 2026-04-25                                  |
```

### 4.2 BIDX-2 Artifact roster

A table enumerating every artifact in the bundle:

```
| Artifact | File                                  | Version | Status | SHA-256 (short) |
|----------|---------------------------------------|---------|--------|-----------------|
| PRD      | PRD_cold-read_2026-04-25_v01_I.md     | v01     | I      | a3f1b2...       |
| TRD      | TRD_cold-read_2026-04-25_v01_I.md     | v01     | I      | 7c4e9d...       |
| AVD      | AVD_cold-read_2026-04-25_v01_I.md     | v01     | I      | 2e8f01...       |
| TQVCD     | TQVCD_cold-read_2026-04-25_v01_I.md    | v01     | I      | 9b6a3c...       |
| UXD      | UXD_cold-read_2026-04-25_v01_I.md     | v01     | I      | 5d2f7e...       |
```

The SHA-256 short column is the first 6 hex chars of the file's SHA-256, computed at the time of the most recent index update. It is a **freshness marker, not a security artifact** — its purpose is to flag when an artifact has changed without the index being updated.

### 4.2.1 BIDX-2.1 Standalone-file roster (ADR + RUNBOOK)

Bundles MAY include standalone Architectural Decision Records (`ADR-NN`) and Operational Runbooks (`RUNBOOK-<scope>`) as separate files alongside the core five-doc bundle. These are tracked in a dedicated roster, distinct from BIDX-2, because they have different lifecycle semantics: ADRs are append-only (a superseded ADR is tombstoned, not edited in place), and RUNBOOKs version independently of the bundle as on-call procedures evolve.

```
| Code        | File                                                  | Version | Status | Supersedes | SHA-256 (short) |
|-------------|-------------------------------------------------------|---------|--------|------------|-----------------|
| ADR-01      | cold-read_ADR-01_sqlite-vs-postgres_2026-04-25_v01_A.md | v01   | A      | —          | 4f8a2c...       |
| ADR-02      | cold-read_ADR-02_event-sourcing_2026-04-26_v01_I.md     | v01   | I      | —          | 1d9b3e...       |
| RUNBOOK-deploy   | cold-read_RUNBOOK-deploy_2026-04-25_v02_A.md     | v02     | A      | v01        | 7e2c4a...       |
| RUNBOOK-incident | cold-read_RUNBOOK-incident_2026-04-25_v01_I.md   | v01     | I      | —          | 3b8f1d...       |
```

Column semantics:

- **Code** — for ADRs, the bare `ADR-NN` token (matches the section heading inside the file). For runbooks, `RUNBOOK-<scope>` (the scope tag only — individual `step`/`alert`/`action` rows live in BIDX-3).
- **Supersedes** — for ADRs, the prior ADR-NN this one replaces (or `—` if novel). For runbooks, the prior version of this scope's runbook. This column makes the decision/procedure history machine-traceable.
- All other columns mirror BIDX-2 semantics.

The roster MAY be omitted if a bundle contains no standalone ADRs or runbooks. If present, every file named here MUST also have its individual headings enumerated in BIDX-3.

### 4.3 BIDX-3 Heading-prefix table

The flat enumeration of every numbered heading across every artifact in the bundle. Columns:

```
| ID            | Level | Heading                       | Artifact | Anchor                        |
|---------------|-------|-------------------------------|----------|-------------------------------|
| PRD-1         | 2     | Purpose                       | PRD      | #prd-1-purpose                |
| PRD-1.1       | 3     | Problem statement             | PRD      | #prd-1-1-problem-statement    |
| PRD-1.2       | 3     | Out-of-scope                  | PRD      | #prd-1-2-out-of-scope         |
| ...           | ...   | ...                           | ...      | ...                           |
| TRD-4.3.1     | 4     | Persistence layer choice      | TRD      | #trd-4-3-1-persistence-...    |
| AVD-7         | 2     | Risk register                 | AVD      | #avd-7-risk-register          |
| TQVCD-3.2      | 3     | Acceptance criteria mapping   | TQVCD     | #tqcd-3-2-acceptance-...      |
```

Column semantics:

- **ID** — the full heading-prefix ID (per the heading-prefix grammar). Primary key; MUST be unique across the table.
- **Level** — the Markdown heading depth (`#` = 1, `##` = 2, etc.). Used for tree reconstruction.
- **Heading** — the human-readable heading text, copied verbatim (without the prefix).
- **Artifact** — the artifact code; MUST match the prefix's artifact code.
- **Anchor** — the slug anchor inside the artifact file, leading `#` included.

This table is the load-bearing part of the index. Tooling consumes it to:

- Resolve `PRD-3.2`-style references in any artifact to a concrete file + anchor.
- Verify that every requirement in the PRD has a matching design section in the TRD and a matching test in the TQVCD.
- Detect orphan headings (a heading exists in an artifact but not in the index, or vice versa).

### 4.4 BIDX-4 Cross-reference matrix (optional but recommended)

A traceability matrix showing which PRD requirements are covered by which TRD/AVD/TQVCD sections. Format is flexible; one common form:

```
| PRD Req   | TRD Design     | AVD Risk(s) | TQVCD Test(s)        | Status   |
|-----------|----------------|-------------|---------------------|----------|
| PRD-3.1   | TRD-4.1        | AVD-7.2     | TQVCD-3.1, TQVCD-3.4  | covered  |
| PRD-3.2   | TRD-4.2        | —           | TQVCD-3.2            | covered  |
| PRD-3.3   | TRD-4.3        | AVD-7.5     | (none)              | GAP      |
```

Marking a row as `GAP` is how the methodology surfaces unfinished traceability without blocking the bundle from progressing.

### 4.5 BIDX-5 Change log

A reverse-chronological list of bundle-level changes:

```
- **2026-04-25 v01 I:** Initial bundle opened. PRD/TRD/AVD/TQVCD/UXD all in I status.
```

Each entry MUST name the date, the bundle version, the new status, and a one-line summary. Detail belongs in the artifact-level change logs, not here.

---

## 5. Optional sections

The following sections MAY appear, with these reserved IDs:

- `BIDX-90 Appendix A: External references` — links to materials outside the bundle that informed it.
- `BIDX-91 Appendix B: Open questions` — a parking lot for unresolved methodology or scope questions.
- `BIDX-92 Appendix C: Glossary` — bundle-specific terms.

If used, these MUST appear after BIDX-5 and before any other appendices. Numbering past BIDX-92 is at the author's discretion but should follow the heading-prefix grammar.

---

## 6. Integrity rules

A bundle index is **valid** if and only if:

1. All required sections (BIDX-1 through BIDX-5) are present, in order.
2. Every artifact named in BIDX-2 exists at the named path.
3. Every SHA-256 short in BIDX-2 matches the current file content (within tolerance: tooling MAY warn rather than fail if the index is older than 24 hours).
4. The SHA-256 short for every artifact MUST be recomputed at every status transition (`I → R`, `R → A`, `A → S`, etc.), independent of whether other index sections need updating. Once an artifact reaches status `R` or `A`, its hash is the cryptographic record of "the bytes that were reviewed / approved" — any post-transition byte change requires either a version bump (which itself triggers recompute) or an explicit tombstone+supersede entry.
5. Every heading in every artifact has exactly one row in BIDX-3, and every row in BIDX-3 corresponds to an existing heading.
6. Every ID in BIDX-3 conforms to the heading-prefix grammar.
7. No ID appears twice in BIDX-3.
8. The bundle's version and status in BIDX-1 match the filename of the index itself.

A bundle index is **stale** (warning, not error) if:

- Any artifact's SHA-256 short does not match.
- The "Last index update" in BIDX-1 is older than the most recent artifact mtime.

---

## 7. Update workflow

When an artifact in the bundle changes:

1. The author edits the artifact and bumps its artifact-level version if the change is non-trivial (per the amendment protocol).
2. The author re-runs the index-rebuild step (manual or tool-assisted), which:
   a. Recomputes all SHA-256 shorts in BIDX-2.
   b. Rescans all artifacts and rebuilds BIDX-3.
   c. Updates "Last index update" in BIDX-1.
3. The author appends an entry to BIDX-5 if the change rises to bundle-level significance.
4. The author commits the artifact and the index together (atomic update).

If the index is updated without an artifact change (e.g., to add a cross-reference matrix entry), only steps 2c, 3, and 4 apply.

---

## 8. Worked minimal example

```
# Bundle Index: cold-read 2026-04-25

## BIDX-1 Bundle manifest

| Field       | Value                                    |
|-------------|------------------------------------------|
| Bundle ID   | cold-read_2026-04-25                     |
| Version     | v01                                      |
| Status      | I                                        |
| Owner       | Krystal Martinez <kjm2145@columbia.edu> |
| Methodology | Dare-to-Rise 0.3.0 (2026-04-26)          |

## BIDX-2 Artifact roster

| Artifact | File                              | Version | Status | SHA-256 (short) |
|----------|-----------------------------------|---------|--------|-----------------|
| PRD      | PRD_cold-read_2026-04-25_v01_I.md | v01     | I      | a3f1b2          |
| TRD      | TRD_cold-read_2026-04-25_v01_I.md | v01     | I      | 7c4e9d          |

## BIDX-3 Heading-prefix table

| ID      | Level | Heading             | Artifact | Anchor                |
|---------|-------|---------------------|----------|-----------------------|
| PRD-1   | 2     | Purpose             | PRD      | #prd-1-purpose        |
| PRD-2   | 2     | Functional reqs     | PRD      | #prd-2-functional...  |
| TRD-1   | 2     | Purpose             | TRD      | #trd-1-purpose        |
| TRD-2   | 2     | Architecture        | TRD      | #trd-2-architecture   |

## BIDX-4 Cross-reference matrix

| PRD Req | TRD Design | Status  |
|---------|------------|---------|
| PRD-2   | TRD-2      | covered |

## BIDX-5 Change log

- **2026-04-25 v01 I:** Initial bundle opened.
```

---

## 9. Compliance checklist

A bundle index conforms to this schema if and only if:

- [ ] Filename matches `BIDX_<slug>_<date>_v<NN>_<status>.md`.
- [ ] All five required sections (BIDX-1 .. BIDX-5) are present and in order.
- [ ] Every artifact in BIDX-2 exists at its named path.
- [ ] Every SHA-256 short is current (or stale-warning is acknowledged).
- [ ] BIDX-3 is a complete and unique enumeration of all numbered headings in the bundle.
- [ ] All IDs conform to the heading-prefix grammar.
- [ ] BIDX-1 metadata matches the index filename.

---

## 10. Change log

- **v01 (2026-04-26):** Initial schema. Five required sections. Optional BIDX-2.1 standalone-file roster for ADR / RUNBOOK artifacts (independent lifecycle from the core five-doc bundle, with a `Supersedes` column for decision/procedure history). SHA-256 short as freshness marker, with mandatory recompute at every status transition so the hash at `R`/`A` is the cryptographic record of reviewed/approved bytes. GAP marking allowed in cross-reference matrix.
