# D2R Stage 00: Research Summary — Claude Clarified Chat

**Project:** Claude Clarified Chat
**Date:** 2026-04-15
**Purpose:** Three-track research findings informing all implementation stages

---

## Track 1: Enterprise Standards

### OWASP Top 10 (Web)

**Applies:**
- **A03: Injection / XSS (CWE-79)** — ZIP contents rendered into DOM must be sanitized. Exit criteria: no raw HTML insertion; all user content passes through DOMPurify or equivalent. Constrains stages: 02 (parser), 05 (timeline), 06 (renderers).
- **A05: Security Misconfiguration** — CSP headers, security headers on Vercel. Exit criteria: SecurityHeaders.com grade A. Constrains stages: 01 (scaffold), 16 (deployment).
- **A06: Vulnerable/Outdated Components** — npm dependencies. Exit criteria: `npm audit` zero critical/high; Dependabot enabled. Constrains stages: 01 (scaffold), all stages that add dependencies.
- **A08: Software and Data Integrity Failures** — Subresource integrity for CDN assets. Exit criteria: all external scripts use SRI hashes. Constrains stages: 16 (deployment).

**Does NOT apply:** SQL injection, SSRF, server-side auth, broken authentication (no auth, no server-side data processing).

**Client-side specific (OWASP Client-Side Top 10):**
- **Risk #6: Sensitive Data in Client Storage** — conversation data must never persist to localStorage/sessionStorage. Exit criteria: no `Storage.setItem` calls with user data; data lives only in JS memory. Constrains stages: 02 (parser), 03 (data model), 08 (analysis engine).
- **Risk #8: Missing Browser Security Controls** — CSP, X-Frame-Options required. Constrains stages: 01 (scaffold), 16 (deployment).

### CWE Top 25

| CWE | Risk | Exit Criteria | Constrains Stages |
|-----|------|---------------|-------------------|
| CWE-79 (XSS) | ZIP may contain HTML/script in thinking/text blocks | No `eval()` or `innerHTML` with user content; DOMPurify on all rendered content | 02, 05, 06 |
| CWE-94 (Code Injection) | Eval of extracted file contents | No dynamic code execution from parsed data | 02, 03 |
| CWE-1321 (Prototype Pollution) | JSON parsing of ZIP contents | `Object.create(null)` for parsed data maps | 02, 03 |
| CWE-22 (Path Traversal / Zip-Slip) | ZIP filenames can contain `../` | Validate all zip entry paths; reject traversal patterns | 02 |
| CWE-400 (Resource Exhaustion) | Zip bombs, oversized files | File size limits (100MB uncompressed default); user confirmation for files > 50MB | 02, 04 |

### WCAG 2.1 AA

| Criterion | Relevance | Exit Criteria | Constrains Stages |
|-----------|-----------|---------------|-------------------|
| 1.1.1 Non-text Content | Timeline icons, status indicators | All images/icons have alt text | 04, 05, 06, 07, 08 |
| 1.3.1 Info and Relationships | Expandable cards, timeline structure | Semantic HTML; ARIA roles on custom widgets | 04, 05, 06, 14 |
| 1.4.3 Contrast (Minimum) | All text/UI | 4.5:1 ratio (text), 3:1 (large text) | All UI stages |
| 1.4.11 Non-text Contrast | Interactive controls, timeline | 3:1 against adjacent colors | All UI stages |
| 2.1.1 Keyboard | All interactive elements | Full keyboard navigation; no traps | All UI stages |
| 2.4.7 Focus Visible | Expandable cards, buttons | Visible focus indicator on all interactives | All UI stages |
| 4.1.2 Name, Role, Value | File upload, expandable cards, downloads | axe-core zero violations | 04, 05, 06, 10-13, 14 |

**Constrains stages:** Every stage that produces UI (04, 05, 06, 07, 08, 14, 15). Accessibility is not a polish pass.

**Measurable gate:** Lighthouse Accessibility >= 95; axe-core zero violations; manual keyboard walkthrough documented per stage.

### Content Security Policy

```
default-src 'self';
script-src 'self' 'nonce-{generated}';
style-src 'self' 'unsafe-inline';
img-src 'self' blob: data:;
font-src 'self';
connect-src 'self';
object-src 'none';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

Additional headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

**Constrains stages:** 01 (scaffold — initial config), 16 (deployment — enforce).

### Privacy

- No analytics scripts; privacy statement confirms client-only processing
- Data cleared on tab close; `beforeunload` cleanup handler
- Blob URLs revoked after download (`URL.revokeObjectURL()`)
- Honor Global Privacy Control (`navigator.globalPrivacyControl`)
- Zero cookies set by the application (no cookie banner needed)

**Constrains stages:** 02 (parser — in-memory only), 03 (data model — no persistence), 04 (upload — cleanup handler), 15 (legal — privacy policy content), 16 (deployment — GPC, no analytics).

### Performance

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| Lighthouse Performance | >= 90 |
| Lighthouse Accessibility | >= 95 |
| JS bundle (initial) | < 200KB gzipped |
| ZIP processing | Web Worker (main thread never blocked) |

**Constrains stages:** 01 (scaffold — bundle budget), 02 (parser — Web Worker architecture), 10-13 (exports — lazy loading), 16 (deployment — Lighthouse CI gate).

---

## Track 2: Claude Code Tooling

### Available Skills

| Skill | Applies To | Action |
|-------|-----------|--------|
| `dare-to-rise-code-plan` | Execution protocol | Active — this skill governs the build |
| `ai-self-audit-edit` | Every -A audit gate | Active — used at every stage |
| `file-versioning` | Document outputs | Active — filename conventions |
| `file-presentation` | Presenting files to Krystal | Active — file delivery format |

### MCP Servers Available

| Server | Useful For |
|--------|-----------|
| Claude Preview | Dev server preview, screenshots, accessibility snapshot |
| Context7 | Up-to-date library documentation lookups |

### Recommended Installations and Verifications

- npm packages (installed in Stage 01): JSZip, jsPDF, jspdf-autotable, docx, ExcelJS, DOMPurify
- **Action:** Verify JSZip >= 3.8.0 at install time (versions <= 3.7.1 have zip-slip vulnerability — CWE-22)
- **Action:** Verify ExcelJS does not double-bundle JSZip if both are dependencies (check bundle analyzer output in Stage 01)

---

## Track 3: Best Practices

### SvelteKit + Svelte 5

- **Scaffold:** `npx sv create` — Svelte 5 is default, uses runes syntax
- **Runes:** `$state()`, `$derived()`, `$effect()`, `$props()` — replace Svelte 4 reactivity
- **Convention:** All new code uses runes exclusively
- **Sources:** Svelte 5 docs (svelte.dev), SvelteKit docs (svelte.dev/docs/kit)

### Tailwind CSS 4

- **Install:** `npm install tailwindcss @tailwindcss/vite` — add to vite.config before sveltekit()
- **Breaking from v3:** `@import "tailwindcss"` replaces directives; `@reference` needed for `@apply` in Svelte style blocks
- **No PostCSS config needed**
- **Sources:** Tailwind CSS v4 docs (tailwindcss.com/docs), Tailwind Vite plugin docs

### JSZip (v3.10.x, ~95KB)

- `JSZip.loadAsync(arrayBuffer)` → iterate entries → `entry.async("string")`
- **Pitfall:** Versions <=3.7.1 had zip-slip vulnerability — use 3.8.0+
- **Architecture:** Pass ArrayBuffer to Web Worker via `postMessage` (transferable, zero-copy)
- **Sources:** JSZip docs (stuk.github.io/jszip), CVE-2022-48285 (zip-slip advisory)

### jsPDF (v2.5.x, ~300KB) — Lazy load only

- Declarative API: `new jsPDF()` → `doc.text()` → `doc.save()`
- Use `jspdf-autotable` plugin for table formatting
- **Bundle strategy:** Dynamic `import()` only when user clicks PDF export
- **Sources:** jsPDF docs (github.com/parallax/jsPDF), jspdf-autotable docs

### docx (v9.x, ~350KB) — Lazy load only

- Declarative tree: `Document` → `sections` → `Paragraph/Table/TextRun`
- Browser export via `Packer.toBlob()`
- **Bundle strategy:** Dynamic `import()` only when user clicks DOCX export
- **Sources:** docx npm package docs (docx.js.org)

### ExcelJS (v4.4.x, ~350KB) — Lazy load only

- `Workbook` → `addWorksheet()` → `columns` → `addRows()`
- **Gotcha:** ExcelJS bundles its own JSZip internally — do NOT double-bundle
- **Bundle strategy:** Dynamic `import()` only when user clicks XLSX export
- **Sources:** ExcelJS docs (github.com/exceljs/exceljs)

### Large JSONL Processing

| File Size | Strategy |
|-----------|---------|
| < 1MB | JSON.parse line-by-line, main thread |
| 1-10MB | Web Worker + line-by-line split |
| 10-50MB | Web Worker + TextDecoder streaming |
| > 50MB | User confirmation before processing |

### Data Storage

- **In-memory only** — plain JS objects/Maps
- No IndexedDB (data is ephemeral, no persistence needed)
- No localStorage (privacy requirement)
- Data cleared on page unload

---

## Data Format Specification

Full specification (795 lines) at: `docs/DATA_FORMAT_SPEC.md`

### Key Structural Findings

- **6 record types:** user, assistant, system, queue-operation, last-prompt, attachment
- **3 assistant content block types:** thinking (with signature), text, tool_use
- **2 user content block types:** text, tool_result
- **14 distinct tool names** across sample data
- **parentUuid chains** form a linked list — each assistant content block gets its own JSONL record
- **Subagent files** use `agent-a{hash}` (non-compact) or `agent-acompact-{hash}` (compacted) naming
- **Subagent linking:** main JSONL `Agent` tool_use → `toolUseResult.agentId` → subagent filename
- **isMeta** user records are system-injected (not human-typed)
- **isCompactSummary** + **isVisibleInTranscriptOnly** mark auto-compaction summaries
- **tool-results/** directory stores oversized tool outputs as separate .txt files
