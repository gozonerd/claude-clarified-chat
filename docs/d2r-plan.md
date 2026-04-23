---
name: Claude Clarified Chat — D2R Code Plan (Condition C4, Mixed-Model + Real ASAE)
project: Claude Clarified Chat
prefix: CCC
date: 2026-04-22
version: v01_I
planner_model: Opus 4.7 (1M context)
condition: C4 (D2R mixed-model + real ASAE)
inputs:
  - inputs/CCC_Phase1_Ideation_Summary_2026-04-22_v01_I.md
  - inputs/CCC_PRD_2026-04-22_v01_I.md
  - inputs/CCC_TRD_2026-04-22_v01_I.md
  - inputs/CCC_AVD_2026-04-22_v01_I.md
  - inputs/CCC_TQCD_2026-04-22_v01_I.md
status: Authored by Opus parent; governs Stage 02+ sub-agent delegation
---

# D2R Code Plan — Claude Clarified Chat MVP v0.1

## 0. Excellent End State (Backwards Target)

A local-only web application (form-factor choice: **static web app** — see Stage 00 below) that ingests a Claude.ai thread export zip and renders:

- An interactive, keyboard-operable, screen-reader-announced chronological timeline of every JSONL event, every sub-agent transcript, every tool result, every thinking block, and every log line.
- A detail view for any selected event.
- A token-accounting waterfall summing to ≥99% of declared metadata total.
- A Clarity Corpus export to PDF (PDF/UA-tagged), DOCX, XLSX (for structured types), and Markdown — running the four generators in parallel.
- A pre-export secret-pattern warning modal with ≥95% recall against a reference secret corpus.

Meeting: zero axe-core critical/serious, 100% line+branch coverage on testable surface, ≥80% mutation score on Parser Engine / Event Store / Export Engine / Secret Pattern Detector, p95 time-to-first-insight ≤10s on 300-line JSONL, zero network calls at runtime, WCAG 2.1 AA hardwired. Per CCC_TQCD Section 2–7.

## 1. Stage 00 — Research Findings (Opus parent; pre-authored from inputs)

Stage 00's five tracks are resolved against the prerequisite inputs as follows. Full in-depth multi-track research is **not re-run** — the inputs' own convergence-gated content already contains the research conclusions. Stage 00 here consolidates them.

### Track 1 — Tech Stack (Resolved)

- **Form-factor:** static web app (resolves PRD Q-001, TRD TQ-001, AVD AQ-001). Rationale: avoids desktop installer signing costs (PRD Section 6.1 "free to build"), satisfies AD-001 client-side-only, satisfies "works with network disabled" via a fully-bundled static deploy, keeps bundle install friction zero (open-file-locally model). Web matrix — Chrome ≥120, Firefox ≥120, Safari ≥17, Edge ≥120 — is the explicit target in TRD 3.7.
- **Language:** TypeScript (strict). Single-language monorepo. Resolves TRD TQ-002.
- **Framework:** **React 19 + Vite 5** (resolves AVD AQ-003). Rationale: (a) WCAG-accessible-by-default component primitives available (Radix UI + react-aria-components), (b) mature Playwright/axe-core/Vitest/Stryker ecosystem, (c) Opus training coverage is extremely high so Deep-spec is producible per Track 4.
- **Schema validation:** Zod 3.23+. Resolves TRD TQ-003.
- **PDF generation (PDF/UA):** `pdf-lib` + `@pdf-lib/fontkit` with tagged-PDF structure tree authoring. Resolves TRD TQ-004.
- **DOCX:** `docx` (dolanmiu/docx). Resolves TRD TQ-005.
- **XLSX:** `exceljs`.
- **Secret detection:** curated regex set (OpenAI `sk-`, Anthropic `sk-ant-`, AWS `AKIA`, generic JWT `eyJ…`, GitHub `ghp_`/`gho_`, RSA/SSH PEM headers, password= patterns) — no external scanner dependency.
- **Test:** Vitest 2 (unit + integration), Playwright 1.48+ (E2E multi-browser), fast-check 3 (property-based), Stryker 8 (mutation).
- **Lint:** ESLint 9 + `@typescript-eslint` + `eslint-plugin-jsx-a11y` + `eslint-plugin-react-hooks`.

### Track 2 — Applicable Standards (Resolved)

Operationalized in CCC_TQCD §3: WCAG 2.1 AA, PDF/UA, ARIA Authoring Practices 1.2, OWASP ASVS L1, CERT TS (typescript-subset of CERT secure coding). No EU AI Act binding at MVP.

### Track 3 — Benchmarks (Resolved)

Per CCC_TQCD §4: performance budgets (p50/p95/p99 TTI, export, search, keystroke latency), code quality (complexity median ≤10, coverage 100%, mutation ≥80%), domain (event coverage 100%, token fidelity ≥99%, secret recall ≥95%, parse-recovery 100%).

### Track 4 — Depth Feasibility

Opus can produce Deep-level specifications for the chosen React 19 + Vite 5 + Zod 3 + Vitest 2 + Playwright 1.48 stack. This stack is well-within training coverage. All Stage 03+ stages therefore run at **Deep depth** with Haiku as executor.

### Track 5 — Skill/Plugin Ecosystem

Available at pinned skill bundle `0d79e98999d13568f8886b419379622c63886cec`:

- `/asae` — real, non-passthrough (verified in Step 1 of the build entrypoint). Used at every stage boundary.
- `/dare-to-rise-code-plan` — this plan itself is its output.
- `/file-versioning`, `/file-presentation` — used for authored documents.

No conflicts. No gap requiring install-before-Stage-02.

## 2. Stage 01 — Plan Skeleton + Full Plan (this document)

Model: Opus parent. Depth: N/A (this document IS the Deep spec for Stage 03+).

## 3. Stage 02 — Project Scaffold (Sonnet sub-agent via Task/Agent with model=sonnet)

Output directory: `workspace/app/`.

Scaffold content (Sonnet authors from this exact specification):

- `package.json` with these exact scripts (authoritative for F7 sub-agent exit criteria and final pre-sentinel):
  - `"test": "vitest run"`
  - `"test:coverage": "vitest run --coverage"`
  - `"typecheck": "tsc --noEmit"`
  - `"lint": "eslint . --max-warnings=0"`
  - `"build": "vite build"`
  - `"e2e": "playwright test"`
  - `"mutation": "stryker run"`
- Exact dependencies: `react@^19.0.0`, `react-dom@^19.0.0`, `zod@^3.23.8`, `pdf-lib@^1.17.1`, `@pdf-lib/fontkit@^1.1.1`, `docx@^8.5.0`, `exceljs@^4.4.0`.
- Exact devDependencies: `typescript@^5.5.0`, `vite@^5.4.0`, `@vitejs/plugin-react@^4.3.0`, `vitest@^2.1.0`, `@vitest/coverage-v8@^2.1.0`, `@playwright/test@^1.48.0`, `axe-core@^4.10.0`, `@axe-core/playwright@^4.10.0`, `fast-check@^3.22.0`, `@stryker-mutator/core@^8.6.0`, `@stryker-mutator/vitest-runner@^8.6.0`, `eslint@^9.13.0`, `@typescript-eslint/parser@^8.12.0`, `@typescript-eslint/eslint-plugin@^8.12.0`, `eslint-plugin-jsx-a11y@^6.10.0`, `eslint-plugin-react-hooks@^5.0.0`.
- `tsconfig.json`: strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes, target ES2022, jsx react-jsx.
- `vitest.config.ts`: coverage provider v8, reporter text+json+lcov, **thresholds { lines: 100, branches: 100, functions: 100, statements: 100 }**, include src/**/*.ts[x].
- `playwright.config.ts`: projects for chromium, firefox, webkit; baseURL from vite preview.
- `eslint.config.js`: flat config with typescript, react, jsx-a11y strict rules, no-console, no-restricted-imports blocking `fetch`/`XMLHttpRequest`/`WebSocket`/`EventSource` to enforce AD-007 no-network.
- `stryker.conf.mjs`: testRunner vitest, mutate `src/core/**`, thresholds `{high:80, low:75, break:80}`.
- `src/` directory scaffolded per AVD §3.1 components:
  - `src/core/ingest/` — Ingest Adapter
  - `src/core/parse/` — Parser Engine
  - `src/core/store/` — Event Store
  - `src/core/token/` — Token Accounting Engine
  - `src/core/secret/` — Secret Pattern Detector
  - `src/core/export/` — Export Engine (pdf/docx/xlsx/md generators)
  - `src/core/audit/` — Local Audit Logger
  - `src/ui/shell/`, `src/ui/timeline/`, `src/ui/detail/`, `src/ui/landing/`, `src/ui/exportModal/` — UI Shell + renderers
  - `src/ui/a11y/` — Accessibility Layer
  - `src/schemas/` — Zod schemas for JSONL event types + metadata
- `index.html`, `src/main.tsx`, `src/App.tsx` entrypoints with UI Shell minimal layout.
- `.githooks/pre-commit` running typecheck + lint + test + axe (npx playwright test --project=a11y if present).
- `.githooks/pre-push` running test:coverage + build + e2e.
- `.github/workflows/ci.yml` running install + typecheck + lint + test:coverage + build on pull_request and push.
- `README.md` with install + first-use + export sections (Sonnet drafts prose from: "Claude Clarified Chat un-black-boxes a Claude.ai thread export. Local-only. WCAG 2.1 AA. MIT.").
- `LICENSE`: MIT, copyright 2026 Martinez Methods.
- `.gitignore`: node_modules, dist, coverage, .stryker-tmp, playwright-report, test-results.

Sonnet sub-agent exit criteria (F7, verbatim in delegation prompt):

    Before returning, run in workspace/app/:
      npm install --no-audit --no-fund 2>&1 | tail -20; echo "INSTALL_EXIT: $?"
      npm run typecheck 2>&1 | tail -10; echo "TYPECHECK_EXIT: $?"
      npm run lint 2>&1 | tail -10; echo "LINT_EXIT: $?"
    All exit codes MUST be 0 before returning. Include the literal exit output in your return summary.
    At this scaffold stage there are no tests yet, so `npm test` may show "no test files" — that is acceptable and not a failure. Scripts MUST exist in package.json.
    Do NOT modify any files outside workspace/app/.

ASAE gate (Opus parent): domain=code, severity=strict, threshold=3. Opus verifies scaffold matches this spec and that exit codes above are all 0.

## 4. Stage 03 — Schemas + Ingest Adapter (Haiku sub-agent, Deep depth)

Target: `workspace/app/src/schemas/*.ts` + `workspace/app/src/core/ingest/*.ts`.

Deep spec:

- `src/schemas/event.ts`: Zod discriminated union `EventSchema` on `type` ∈ `{'user','assistant','tool_use','tool_result','thinking','system'}`. Each variant schema includes `id: z.string()`, `timestamp: z.string().datetime()`, `content: z.unknown()`, optional `tokens: z.object({input: z.number().int().nonnegative(), output: z.number().int().nonnegative()}).optional()`, optional `subagent_id: z.string().optional()`. Export `type Event = z.infer<typeof EventSchema>`.
- `src/schemas/metadata.ts`: Zod schema for `metadata.json` — `{session_id: string, cli_session_id: string, cwd: string, model: string, created_at: string.datetime(), last_activity_at: string.datetime(), title: string, total_input_tokens?: number, total_output_tokens?: number}`.
- `src/schemas/subagent.ts`: Zod for `*.meta.json` — `{id: string, spawned_at: string.datetime(), parent_id: string, purpose: string.optional()}`.
- `src/schemas/unavailable.ts`: `UnavailableMarker = {kind: 'unavailable', reason: string, source_path: string}` — the AD-006 marker pattern.
- `src/core/ingest/types.ts`: `type FileMap = ReadonlyMap<string, Uint8Array>`; `type IngestResult = {files: FileMap} | {error: IngestError}`; `class IngestError extends Error { constructor(public readonly kind: 'zip-slip'|'zip-bomb'|'not-a-zip'|'missing-required'|'io', msg: string) }`.
- `src/core/ingest/ingest.ts`: `export async function ingest(zipBytes: Uint8Array, opts?: {maxFileBytes?: number; maxTotalBytes?: number}): Promise<IngestResult>`. Uses browser-native `DecompressionStream` where available, falls back to `fflate` (add `fflate@^0.8.2` if the scaffold didn't include it — Stage 02 already did; if not, Haiku adds it). Enforces: (a) reject any entry whose path, after normalization, contains `..` segments or starts with `/` → `{error: IngestError('zip-slip', …)}`. (b) per-entry decompressed-size cap 100 MB by default → `'zip-bomb'`. (c) total decompressed cap 500 MB by default. Returns `{files}` containing every extracted relative path.
- Tests at `src/core/ingest/ingest.test.ts` (Vitest): at minimum (a) accepts a well-formed zip, (b) rejects zip with `../escape.txt` entry, (c) rejects a synthetic zip-bomb entry > cap, (d) rejects non-zip bytes, (e) property test via fast-check that any random byte array either returns a valid IngestResult or a typed IngestError (no throw). 100% line+branch coverage.

Haiku sub-agent exit criteria (F7 verbatim):

    In workspace/app/:
      npm test -- --coverage --run 2>&1 | tail -40; echo "TEST_EXIT: $?"
      npm run typecheck 2>&1 | tail -10; echo "TYPECHECK_EXIT: $?"
      npm run lint 2>&1 | tail -10; echo "LINT_EXIT: $?"
    All three MUST exit 0 AND coverage on src/core/ingest/** and src/schemas/** MUST be 100% lines/branches/functions.
    Do NOT modify vitest.config.*, tsconfig.json, eslint.config.*, package.json scripts, stryker.conf.*. Do NOT add .skip or xtest. Do NOT narrow include or expand exclude on coverage config.
    Include the literal exit output and the coverage summary lines for those directories in your return.

ASAE gate: domain=code, severity=strict, threshold=3. Opus parent verifies via git diff that no protected config was touched.

## 5. Stage 04 — Parser Engine + Event Store (Haiku, Deep depth)

Target: `src/core/parse/*.ts` + `src/core/store/*.ts`.

Deep spec:

- `src/core/parse/parser.ts`: `export async function parse(files: FileMap): Promise<EventStore>`. Decodes `events.jsonl` (or top-level `*.jsonl` — check both) line-by-line via `TextDecoder`. Each line: try `JSON.parse` → `EventSchema.safeParse`. Success → push typed Event. Failure → push `UnavailableMarker` with reason+source_path. Iterate `subagents/*.jsonl` + associated `*.meta.json`; same pattern. Iterate `tool-results/*.txt` and associate to tool_use events by id extracted from filename (pattern: `{tool_use_id}.txt`). Iterate `logs/*.log` into `LogEntry` objects. Return populated store.
- `src/core/store/store.ts`: `export class EventStore { add(e: Event|UnavailableMarker|LogEntry): void; query(filter: Filter): ReadonlyArray<…>; get(id: string): Event|undefined; readonly size: number; }` with indexes by id (Map), by type (Map<type, Set<id>>), by timestamp (sorted array maintained with binary insertion). Locking lifecycle flag `frozen: boolean` — `add` throws `StoreFrozenError` if called after `freeze()`, per AD-005.
- Tests: parser.test.ts (valid events round-trip; malformed JSON → marker; malformed event shape → marker; subagent meta/jsonl pairing; orphaned files flagged not discarded; tool-result id association; log parsing). store.test.ts (add/query/get/size/freeze). Property tests: idempotent parse, deterministic id per event. 100% coverage.

Exit criteria: same F7 pattern. Coverage 100% on `src/core/parse/**` and `src/core/store/**`.

## 6. Stage 05 — Token Accounting + Secret Pattern Detector (Haiku, Deep)

Target: `src/core/token/*.ts` + `src/core/secret/*.ts`.

Deep spec:

- `src/core/token/waterfall.ts`: `export function computeWaterfall(store: EventStore, metadataTotal?: {input: number; output: number}): Waterfall`. Waterfall = `{total: {input, output}, perEvent: Array<{eventId, input, output}>, perSubagent: Map<string, {input, output}>, reconciliationPct: number}`. Sum per-event tokens + per-subagent tokens; compare against metadataTotal; reconciliation = sum / declared. MUST be ≥ 0.99 for the waterfall to be considered trustworthy per FR-010.
- `src/core/secret/detector.ts`: `export function scan(events: ReadonlyArray<Event>): Detection[]`. Detection = `{eventId, pattern: 'openai'|'anthropic'|'aws'|'jwt'|'github-pat'|'rsa-pem'|'password-kv', start: number, end: number, preview: string}`. Regex set (literal): `sk-[A-Za-z0-9]{32,}` (openai) / `sk-ant-[A-Za-z0-9-]{20,}` (anthropic overrides openai) / `AKIA[0-9A-Z]{16}` (aws) / `eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}` (jwt) / `gh[pousr]_[A-Za-z0-9]{36,}` (github-pat) / `-----BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----` (rsa-pem) / `(?i)(password|passwd|pwd|secret|token|api[_-]?key)\s*[:=]\s*['"]?[A-Za-z0-9!@#$%^&*_-]{8,}` (password-kv). Preview = 12-char masked context.
- Tests: unit + property + a **reference corpus** at `src/core/secret/__fixtures__/reference-corpus.json` with ≥ 50 positive samples across all 7 patterns and ≥ 50 negative samples. Recall assertion: ≥ 95% on positives. 100% code coverage.

Exit criteria: same F7. Coverage 100% on `src/core/token/**` and `src/core/secret/**`.

## 7. Stage 06 — Export Engine (Haiku, Deep)

Target: `src/core/export/*.ts`.

Deep spec:

- `src/core/export/pdf.ts`: `export async function exportPdf(store, waterfall): Promise<Uint8Array>`. Uses `pdf-lib` with tagged PDF — document structure tree with `/Document → /Part → /Sect → /P` tags, sets catalog `/Lang = 'en-US'`, sets `/MarkInfo << /Marked true >>` and `/StructTreeRoot`. Title page + per-section content.
- `src/core/export/docx.ts`: uses `docx` library; paragraphs and tables for timeline + waterfall.
- `src/core/export/xlsx.ts`: uses `exceljs`; sheets `Events`, `SubAgents`, `ToolUses`, `TokenWaterfall` with typed numeric columns.
- `src/core/export/md.ts`: returns a CommonMark string.
- `src/core/export/exporter.ts`: `export async function exportAll(store, waterfall, secretAck: boolean): Promise<{pdf: Uint8Array; docx: Uint8Array; xlsx: Uint8Array; md: string}>`. Runs all four in `Promise.all`. Throws `SecretAckRequiredError` if detector returns non-empty and `secretAck !== true`.
- Tests: each generator produces a nonzero artifact; parallel runner returns when all four complete; secretAck gate enforced. 100% coverage.

Exit criteria: same F7. Coverage 100% on `src/core/export/**`.

## 8. Stage 07 — UI Shell + Accessibility Layer (Haiku, Deep)

Target: `src/ui/**`.

Deep spec: Landing (drag-drop + file picker), Timeline (virtualized list via `react-window` or plain windowing — Haiku may use a minimal 100-at-a-time pagination if plain easier), Detail (per-type layouts), Export Modal (secret warning + format toggle), Accessibility Layer (ARIAlive region provider, focus trap for modal, keyboard navigation harness, `prefers-reduced-motion` observer). Every interactive element: keyboard-operable, focus-visible (3:1 contrast), aria-label. No color-only indicators.

Tests: Vitest + React Testing Library component tests with `jest-axe` / `@axe-core/react` — zero critical/serious. Keyboard walkthrough test for J1/J2/J3.

Exit criteria: same F7 + `npm test` passes axe assertions.

## 9. Stage 08 — E2E + Playwright (Haiku, Deep) + Stage QA (Opus judgment)

- E2E tests at `e2e/` — J1, J2, J3, E1, E2, E3 per PRD §4.
- Multi-browser: Playwright projects chromium, firefox, webkit.
- axe-core via `@axe-core/playwright` — zero critical/serious on every route × theme.
- Stage QA: Opus runs ASAE domain=code severity=strict threshold=5 against full repo + executes `npm run test:coverage && npm run typecheck && npm run lint && npm run build && npm run e2e` — all must exit 0 and coverage must be 100%/100%.

## 10. Model-Routing Policy (Hook-Enforced Intent)

| Stage | Model | Tool invocation pattern |
|---|---|---|
| 00 | Opus parent | In-line (this document) |
| 01 | Opus parent | In-line (this document) |
| 02 Scaffold | Sonnet sub-agent | `Agent(model="sonnet", subagent_type="general-purpose", prompt=<Stage 02 spec + F7 exit criteria>)` |
| 03 Ingest+Schemas | Haiku sub-agent | `Agent(model="haiku", …)` |
| 04 Parser+Store | Haiku sub-agent | `Agent(model="haiku", …)` |
| 05 Token+Secret | Haiku sub-agent | `Agent(model="haiku", …)` |
| 06 Export | Haiku sub-agent | `Agent(model="haiku", …)` |
| 07 UI | Haiku sub-agent | `Agent(model="haiku", …)` |
| 08 E2E | Haiku sub-agent | `Agent(model="haiku", …)` |
| QA | Opus parent | In-line ASAE + final verification |

Parent (Opus) does not write feature code. Parent authors plans, runs ASAE gates, verifies sub-agent commits via git diff (F8), and runs final Step 7 pre-sentinel verification.

## 11. ASAE Gate Calendar

| Stage | Domain | Severity | Threshold |
|---|---|---|---|
| 00 | document | strict | 2 |
| 01 | document | strict | 2 |
| 02 | code | strict | 3 |
| 03–07 | code | strict | 3 |
| 08 | code | strict | 3 |
| QA final | code | strict | 5 |

Each gate's log → `workspace/deprecated/asae-logs/stage-NN.md`. Code-domain gates MUST include F7 execution sub-checks (actual npm test/typecheck/lint/build exit codes recorded).

## 12. F8 Parent Verification Checklist (applied after every sub-agent return)

1. `git -C workspace/app diff HEAD~1 HEAD --stat` — inspect files changed.
2. Assert NO changes to: `vitest.config.*`, `jest.config.*`, `stryker.conf.*`, `tsconfig.json`, `eslint.config.*`, `package.json` scripts section — unless delegation explicitly authorized.
3. `git -C workspace/app grep -nE "\\.skip\\(|xtest|xit\\(|test\\.skip|describe\\.skip" src/ e2e/` — must return empty.
4. Sub-agent return text MUST contain literal `TEST_EXIT: 0`, `TYPECHECK_EXIT: 0`, `LINT_EXIT: 0` (or INSTALL_EXIT for Stage 02). If missing → REJECT return and re-delegate.
5. If any out-of-scope change detected → parent runs `git -C workspace/app revert` for that commit as governance reversion, then re-delegates with explicit "do NOT modify <file>".

## 13. IP-Cleanliness

All produced files use branded terminology. Parent runs Step 6 IP-clean grep before BUILD COMPLETE. Any match → BUILD HALTED.
