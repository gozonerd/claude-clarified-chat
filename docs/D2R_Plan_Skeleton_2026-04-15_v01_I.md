# D2R Plan Skeleton — Claude Clarified Chat

**Project:** Claude Clarified Chat
**Date:** 2026-04-15
**Approved:** Yes (user confirmed with `✓`)

---

## Stage Plan

| Stage | Description | Model | Parallel? |
|-------|-------------|-------|-----------|
| Stage 00 | Enterprise Standards Research (3 tracks) | Opus | No — complete |
| Stage 01 | Project scaffold (SvelteKit 5, Tailwind 4, Vitest, Playwright, Vercel config, git init) | Haiku | No — foundation |
| Stage 02 | ZIP parser + security (Web Worker, JSZip, JSONL line parser, zip-slip protection, size limits, DOMPurify setup) | Haiku | No — depends on 01 |
| Stage 03 | Data model + event graph (TypeScript types for all 6 record types, parentUuid chain resolver, subagent linker, unified event graph) | Haiku | No — depends on 02 |
| Stage 04 | Upload UI (drag-drop + file input, progress indicator during parse, error states) | Haiku | No — depends on 03 |
| Stage 05 | Timeline layout (chronological card structure, expandable sections, color coding by record type, responsive) | Haiku | No — depends on 04 |
| Stage 06 | Content renderers (thinking block renderer, text renderer, tool call plain-English translator, subagent branch renderer, error/recovery renderer) | Haiku, escalate to Sonnet for tool translation logic | No — depends on 05 |
| Stage 07 | Glossary + plain language layer (built-in glossary component, tooltip definitions, jargon-free labels throughout) | Haiku | Yes — parallel with 06 after 05 |
| Stage 08 | Analysis engine (reliability score, transparency score, efficiency score, trust flags, contradiction/hedging detection) | Sonnet | No — depends on 03 + 06 |
| Stage 09 | Clarity Corpus generator (session narrative, decision log, tool activity report, subagent report, cost report, error report, contradiction report — all as structured data) | Haiku, escalate to Sonnet for narrative generation logic | No — depends on 08 |
| Stage 10 | Export — Markdown | Haiku | Yes — parallel with 11, 12, 13 after 09 |
| Stage 11 | Export — PDF (lazy-load jsPDF + autotable) | Haiku | Yes — parallel with 10, 12, 13 |
| Stage 12 | Export — DOCX (lazy-load docx) | Haiku | Yes — parallel with 10, 11, 13 |
| Stage 13 | Export — XLSX (lazy-load ExcelJS, watch for JSZip double-bundle) | Haiku | Yes — parallel with 10, 11, 12 |
| Stage 14 | Session comparison (upload two ZIPs, side-by-side diff, divergence highlighting) | Sonnet | No — depends on 03 + 05 |
| Stage 15 | Legal pages (privacy policy, terms of use, footer links) | Haiku | Yes — parallel with any stage after 01 |
| Stage 16 | Deployment (Vercel config, CSP headers, security headers, beforeunload cleanup, blob URL revocation) | Haiku | No — depends on all prior stages |
| Stage QA | Stress test + adversarial review loop | Sonnet | No — terminal |

## Dependency Graph

```
00 → 01 → 02 → 03 → 04 → 05 → 06 → 08 → 09 → 10/11/12/13 → 16 → QA
                                  ↘ 07 (parallel w/ 06)         ↗
                           01 → 15 (parallel, any time) -------↗
                      03 + 05 → 14 (after both complete) -----↗
```

## Parallelization Notes

- Stages 10-13 (all export formats) can run concurrently after Stage 09
- Stage 07 (glossary) can run parallel with Stage 06 (renderers) — both depend on Stage 05
- Stage 15 (legal pages) can run any time after Stage 01
- Stage 14 (session comparison) can start after Stages 03 + 05 are complete
- All other stages are sequential dependencies
