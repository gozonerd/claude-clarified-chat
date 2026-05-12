# File Naming and Versioning

**Document ID:** File_Naming_And_Versioning_2026-04-26_v01_I
**Status:** Initial (I)
**Owner:** Krystal Martinez (kjm2145@columbia.edu)
**Last Updated:** 2026-04-26

---

## 1. Purpose

This reference defines the canonical grammar for **filenames and directory structure** across all Dare-to-Rise code-plan artifacts. It is the on-disk-layer counterpart to:

- `Heading_Prefix_ID_Grammar_2026-04-26_v01_I.md` — IDs *inside* files.
- `Bundle_Index_Schema_2026-04-26_v01_I.md` — bundle manifest *content*.
- `Methodology_Versioning_And_Amendment_Protocol_2026-04-26_v01_I.md` — version + status *lifecycle*.

Together those four foundation files fully specify "how to name and locate every artifact in the methodology, and how versions and statuses move." This file owns the on-disk concerns: filenames, directory layout, renaming on transition.

A filename that conforms to this grammar is **machine-parseable** in a single pass: every component (artifact type, bundle slug, date, version, status) is recoverable from the filename alone, without reading the file. This is the property that makes link-checkers, index-rebuilders, and migration tooling possible.

---

## 2. Scope

In scope:

- Filename patterns for every artifact type produced under the `dare-to-rise-code-plan` skill.
- Universal filename components (bundle slug, date, version, status) and their construction rules.
- Directory structure for bundles, deprecated artifacts, and audit logs.
- Renaming rules at status transitions.

Out of scope:

- Heading-prefix IDs *inside* files (covered by `Heading_Prefix_ID_Grammar`).
- Version-bump and status-transition *semantics* (covered by `Methodology_Versioning_And_Amendment_Protocol`).
- Bundle-index *content* (covered by `Bundle_Index_Schema`).
- Source code filenames inside a project's working tree (governed by the project's own conventions).

---

## 3. Universal components

Every artifact filename in this methodology is built from a small set of components. The components are defined once here; per-artifact patterns in §4 compose them.

### 3.1 `<bundle-slug>`

A short, kebab-cased identifier for the initiative the artifact belongs to.

- **Format:** lowercase letters, digits, and hyphens. No underscores, no dots, no spaces, no leading/trailing hyphens.
- **Length:** 3–40 characters.
- **No embedded dates or versions.** The slug is stable for the life of the bundle. Date and version live in their own components.
- **Examples:** `cold-read`, `inventory-rewrite`, `auth-rebuild-2026`.
- **Counter-examples:** `Cold_Read` (wrong case + underscore), `cold-read-v2` (version embedded), `cold-read-2026-04-25` (date embedded).

### 3.2 `<YYYY-MM-DD>`

The date the artifact's bundle was first opened — **never** the date of the most recent amendment.

- **Format:** ISO 8601 calendar date, zero-padded: `2026-04-25`, not `2026-4-25`.
- **Stability:** the date in the filename never changes once the bundle is opened. Amendments update the change log and the "Last Updated" front-matter field, not the filename.
- **Bundle-wide consistency:** every artifact in a single bundle MUST share the same `<YYYY-MM-DD>` component. The bundle's opening date is the bundle's identity.

### 3.3 `v<NN>`

The artifact's version number.

- **Format:** lowercase `v` followed by a two-digit zero-padded integer: `v01`, `v02`, ..., `v99`.
- **Semantics:** defined by `Methodology_Versioning §3`. This file does not re-specify version-bump rules.
- **Starting value:** every artifact begins at `v01`.

### 3.4 `<status>`

The artifact's lifecycle status.

- **Format:** single uppercase letter, one of:
  - `I` — Initial (draft)
  - `R` — Review
  - `A` — Approved
  - `S` — Superseded
  - `D` — Deprecated
- **Semantics:** defined by `Methodology_Versioning §4.1`. This file does not re-specify lifecycle rules.

### 3.5 Separator

Components are separated by **single underscores**. No double underscores. No mixed separators.

```
<artifact-prefix>_<bundle-slug>_<YYYY-MM-DD>_v<NN>_<status>.md
```

Hyphens appear *inside* components (the bundle slug, kebab-cased section names, ISO date) but never *between* components.

---

## 4. Per-artifact filename patterns

### 4.1 Bundle docs (PRD / TRD / AVD / TQVCD / UXD)

```
<DOC>_<bundle-slug>_<YYYY-MM-DD>_v<NN>_<status>.md
```

Where `<DOC>` is one of: `PRD`, `TRD`, `AVD`, `TQVCD`, `UXD`.

**Examples:**
- `PRD_cold-read_2026-04-25_v01_I.md`
- `TRD_cold-read_2026-04-25_v02_A.md`
- `UXD_inventory-rewrite_2026-03-12_v01_R.md`

### 4.2 Bundle index (BIDX)

```
BIDX_<bundle-slug>_<YYYY-MM-DD>_v<NN>_<status>.md
```

Exactly one BIDX per bundle. Lives at the root of the bundle directory.

**Example:** `BIDX_cold-read_2026-04-25_v01_I.md`

### 4.3 Standalone Architectural Decision Records (ADR)

```
<bundle-slug>_ADR-NN_<decision-slug>_<YYYY-MM-DD>_v<NN>_<status>.md
```

- `<bundle-slug>` — the bundle this decision belongs to.
- `ADR-NN` — the decision number, zero-padded to two digits, matching the heading-prefix ID inside the file (`### ADR-NN: <Title>`).
- `<decision-slug>` — kebab-cased short name for the decision (e.g., `sqlite-vs-postgres`).
- `<YYYY-MM-DD>` — the date the ADR was first opened (NOT the bundle's opening date — ADRs have their own opening dates because they're authored at decision-time, not bundle-opening-time).
- `<NN>` — version of the ADR. ADRs are append-only in spirit, but typo-fix amendments still bump.
- `<status>` — same lifecycle as other artifacts.

**Examples:**
- `cold-read_ADR-01_sqlite-vs-postgres_2026-04-25_v01_A.md`
- `cold-read_ADR-02_event-sourcing_2026-04-26_v01_I.md`

### 4.4 Standalone Operational Runbooks (RUNBOOK)

```
<bundle-slug>_RUNBOOK-<scope>_<YYYY-MM-DD>_v<NN>_<status>.md
```

- `<scope>` — kebab-cased domain tag (e.g., `deploy`, `incident`, `rollback`, `oncall`).
- One file per scope. Steps, alerts, and actions for that scope all live inside (per `Heading_Prefix_ID_Grammar §3.2`).
- `<YYYY-MM-DD>` — the date this runbook scope was first authored.
- Versioning is independent of the bundle (operational procedures evolve on their own cadence).

**Examples:**
- `cold-read_RUNBOOK-deploy_2026-04-25_v02_A.md`
- `cold-read_RUNBOOK-incident_2026-04-25_v01_I.md`

### 4.5 Reference documents (REF)

```
<topic>_<YYYY-MM-DD>_v<NN>_<status>.md
```

- `<topic>` — title-cased with underscores between words (e.g., `Heading_Prefix_ID_Grammar`, `File_Naming_And_Versioning`). Reference docs do NOT carry a bundle slug because they are bundle-independent.
- `<YYYY-MM-DD>` — the date the reference was first authored.

**Examples:**
- `Heading_Prefix_ID_Grammar_2026-04-26_v01_I.md`
- `File_Naming_And_Versioning_2026-04-26_v01_I.md` (this file)

Reference docs are the only artifact type whose filename uses title-case-with-underscores rather than the kebab-cased bundle-slug pattern. The reason: refs sit outside any bundle, so there's no slug to inherit; their topic *is* their identifier.

### 4.6 ASAE audit logs

ASAE logs are **append-only audit artifacts**, not workflow documents. They do not move through `I → R → A` because they are not edited after creation — each log is the immutable record of a single gate run.

```
<target-name>_asae-log_<YYYY-MM-DD>_v<NN>.md
```

- `<target-name>` — the artifact the audit ran against, slugified (e.g., `prd-cold-read` for `PRD_cold-read_2026-04-25_v01_I.md`).
- `<YYYY-MM-DD>` — the date of the audit run.
- `<NN>` — incrementing per same-target same-day audits (most cases will be `v01`).
- **No status suffix.** An ASAE log is born complete and immutable.

**Location:** see §5.3 below.

**Example:** `prd-cold-read_asae-log_2026-04-26_v01.md`

---

## 5. Directory structure

### 5.1 Bundle directory

A bundle lives in a single directory whose name matches the slug + opening date:

```
<bundle-slug>_<YYYY-MM-DD>/
├── BIDX_<bundle-slug>_<YYYY-MM-DD>_v<NN>_<status>.md
├── PRD_<bundle-slug>_<YYYY-MM-DD>_v<NN>_<status>.md
├── TRD_<bundle-slug>_<YYYY-MM-DD>_v<NN>_<status>.md
├── AVD_<bundle-slug>_<YYYY-MM-DD>_v<NN>_<status>.md
├── TQVCD_<bundle-slug>_<YYYY-MM-DD>_v<NN>_<status>.md
├── UXD_<bundle-slug>_<YYYY-MM-DD>_v<NN>_<status>.md     (optional)
├── <bundle-slug>_ADR-NN_<slug>_<YYYY-MM-DD>_v<NN>_<status>.md   (zero or more)
├── <bundle-slug>_RUNBOOK-<scope>_<YYYY-MM-DD>_v<NN>_<status>.md  (zero or more)
├── deprecated/
└── references/    (optional, bundle-specific refs)
```

The directory name uses the same `<bundle-slug>_<YYYY-MM-DD>` pattern as the filenames. This keeps the slug-and-date pairing visible from a parent listing.

### 5.2 `deprecated/` subdirectory

When an artifact transitions to `S` (Superseded) or `D` (Deprecated), the file is **moved** (not copied) to a `deprecated/` subdirectory inside the bundle (or inside the references directory for refs). The filename is updated to reflect the new status.

```
cold-read_2026-04-25/
├── PRD_cold-read_2026-04-25_v02_A.md     ← current
└── deprecated/
    └── PRD_cold-read_2026-04-25_v01_S.md  ← superseded by v02
```

The `deprecated/` subdirectory is **flat** — no nested subdirectories per artifact type. The filename's artifact prefix is sufficient to disambiguate.

### 5.3 ASAE audit log location

Per `/asae SKILL.md §Log Location`:

- **Document targets:** `<target-directory>/deprecated/asae-logs/<target-name>_asae-log_<YYYY-MM-DD>_v<NN>.md`
- **Code targets:** `<repo-root>/.asae-logs/<target-name>_asae-log_<YYYY-MM-DD>_v<NN>.md`

ASAE logs go under `deprecated/` for document targets because they are immutable historical records — same conceptual category as superseded artifacts, even though logs aren't themselves "superseded."

### 5.4 References directory

Reference documents that apply to a single bundle live in `<bundle-directory>/references/`. Reference documents that apply across all bundles (foundation files like this one) live at the methodology level: `.claude/skills/dare-to-rise-code-plan/references/`.

The same filename grammar applies in both locations.

---

## 6. Renaming on status transition

A status transition involves three coordinated changes:

1. **Rename the file** so its `<status>` component matches the new state.
2. **Update the front-matter** "Status" field inside the file.
3. **Append a change-log entry** naming the transition.

The three MUST be atomic — a commit that updates front-matter without renaming, or vice versa, is a violation. Tooling MAY refuse to validate a file whose filename status disagrees with its front-matter status.

When transitioning to `S` or `D`, the file MUST also be moved to the appropriate `deprecated/` subdirectory (per §5.2) in the same atomic commit.

---

## 7. Compliance regex

A complete filename validator (POSIX extended regex):

```
^(PRD|TRD|AVD|TQVCD|UXD|BIDX)_[a-z0-9][a-z0-9-]*[a-z0-9]_\d{4}-\d{2}-\d{2}_v\d{2}_[IRASD]\.md$
```

For ADRs:

```
^[a-z0-9][a-z0-9-]*[a-z0-9]_ADR-\d{2}_[a-z0-9][a-z0-9-]*[a-z0-9]_\d{4}-\d{2}-\d{2}_v\d{2}_[IRASD]\.md$
```

For RUNBOOKs:

```
^[a-z0-9][a-z0-9-]*[a-z0-9]_RUNBOOK-[a-z][a-z0-9-]*_\d{4}-\d{2}-\d{2}_v\d{2}_[IRASD]\.md$
```

For reference docs:

```
^[A-Z][A-Za-z0-9_]+_\d{4}-\d{2}-\d{2}_v\d{2}_[IRASD]\.md$
```

For ASAE logs:

```
^[a-z0-9][a-z0-9-]*_asae-log_\d{4}-\d{2}-\d{2}_v\d{2}\.md$
```

A filename that matches one of these regexes is well-formed. Tooling that walks the methodology tree should classify every `.md` file by which (if any) regex matches and report files that match none.

---

## 8. Worked examples

A complete, well-formed bundle directory:

```
cold-read_2026-04-25/
├── BIDX_cold-read_2026-04-25_v01_R.md
├── PRD_cold-read_2026-04-25_v01_R.md
├── TRD_cold-read_2026-04-25_v01_R.md
├── AVD_cold-read_2026-04-25_v01_R.md
├── TQVCD_cold-read_2026-04-25_v01_R.md
├── UXD_cold-read_2026-04-25_v01_R.md
├── cold-read_ADR-01_sqlite-vs-postgres_2026-04-25_v01_A.md
├── cold-read_RUNBOOK-deploy_2026-04-25_v01_I.md
├── deprecated/
│   ├── PRD_cold-read_2026-04-25_v01_S.md   ← superseded; v02_A is current (not shown above for compactness)
│   └── asae-logs/
│       └── prd-cold-read_asae-log_2026-04-26_v01.md
└── references/
    └── (bundle-specific refs, if any)
```

Note: per §5.2 and §9, every file inside `deprecated/` MUST carry status `S` or `D` (or be an asae-log). The example shows the canonical case: a `v01_S` PRD that was superseded by a `v02_A` (omitted from the tree above only to keep the example tight). An `_I` file inside `deprecated/` is a violation, not an edge case — `I → R` and `R → A` transitions rename in place without relocation; only `* → S` and `* → D` relocate.

---

## 9. Compliance checklist

A file conforms to this grammar if and only if:

- [ ] The filename matches exactly one of the §7 compliance regexes.
- [ ] The `<bundle-slug>` (where applicable) matches the bundle directory's slug.
- [ ] The `<YYYY-MM-DD>` (where applicable) matches the bundle's opening date.
- [ ] The `<status>` component matches the file's front-matter "Status" field.
- [ ] If the file is in `deprecated/`, its status is `S` or `D` (or it is an asae-log).
- [ ] Renaming on the most recent status transition was atomic with the front-matter and change-log updates (per §6).

A bundle directory conforms if and only if:

- [ ] Directory name matches `<bundle-slug>_<YYYY-MM-DD>` and that slug + date appear in every contained artifact's filename.
- [ ] Exactly one BIDX file is present at the directory root.
- [ ] All non-`A` non-`R` non-`I` files are inside `deprecated/`.

---

## 10. Change log

- **v01 (2026-04-26):** Initial filename and directory grammar. Six artifact-type patterns (bundle docs, BIDX, ADR, RUNBOOK, reference docs, ASAE logs). Universal components (bundle-slug kebab-case, ISO date, two-digit version, single-letter status). `deprecated/` subdirectory rule. Renaming-on-transition atomicity. Five compliance regexes. Resolves the dangling "file-naming-and-versioning" Related Rule reference in `/asae SKILL.md`.
