# Stage 01 Handoff Prompt — Claude Clarified Chat

Copy everything below the line into a new Haiku session.

---

You are continuing the Dare to Rise (D2R) build of **Claude Clarified Chat** — a web app that takes Claude session export ZIP files and makes everything that happened behind the scenes human-understandable.

## WHERE WE ARE

Stage 00 (research) is complete and committed. You are executing **Stage 01: Project Scaffold.** The repo exists at `C:\Users\NerdyKrystal\repos\claude-clarified-chat\` with one commit (research artifacts). The GitHub repo is at https://github.com/nerdykrystal/claude-clarified-chat.

## BEFORE YOU WRITE ANY CODE

Read these files in full:

1. `C:\Users\NerdyKrystal\repos\claude-clarified-chat\docs\D2R_Stage00_Research_Summary_2026-04-15_v01_I.md` — All enterprise standards, tooling, and best practices you must follow
2. `C:\Users\NerdyKrystal\repos\claude-clarified-chat\docs\D2R_Plan_Skeleton_2026-04-15_v01_I.md` — The full stage plan
3. `C:\Users\NerdyKrystal\repos\claude-clarified-chat\docs\DATA_FORMAT_SPEC.md` — Complete data format specification (795 lines) for the ZIP files this app will parse
4. `C:\Users\NerdyKrystal\repos\.claude\skills\dare-to-rise-code-plan\SKILL.md` — Your execution protocol (D2R skill)

Read ALL FOUR files before writing any code. Do not proceed until you have read them.

## YOUR ROLE

You are the implementation executor. You make ZERO architecture or design decisions — all decisions were made in Stage 00 research. Follow the plan exactly. If you encounter ambiguity, STOP and ask — do not improvise.

## STAGE 01: Project Scaffold

### What to Build

1. **Initialize SvelteKit project** in the existing repo directory using `npx sv create` (Svelte 5, TypeScript)
2. **Install and configure Tailwind CSS 4** — `npm install tailwindcss @tailwindcss/vite`, add to `vite.config.ts` BEFORE `sveltekit()`, use `@import "tailwindcss"` in CSS (NOT the old v3 directives)
3. **Install core dependencies:**
   - `jszip` (>= 3.8.0 — VERIFY version, older versions have zip-slip vulnerability)
   - `dompurify` + `@types/dompurify`
   - Do NOT install jspdf, docx, or exceljs yet — those are lazy-loaded in Stages 10-13
4. **Install dev dependencies:**
   - `vitest` + `@sveltejs/vite-plugin-svelte` (for component testing)
   - `playwright` + `@playwright/test`
   - `eslint` + `prettier` + Svelte plugins
   - `axe-core` (for accessibility testing)
5. **Configure Vitest** in `vite.config.ts`
6. **Configure Playwright** with `playwright.config.ts`
7. **Configure ESLint + Prettier** with Svelte support
8. **Create Vercel project config** (`vercel.json`) with security headers:
   - Content-Security-Policy (see research summary for full policy)
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - Referrer-Policy: strict-origin-when-cross-origin
   - Permissions-Policy: camera=(), microphone=(), geolocation=()
9. **Create CLAUDE.md** at repo root with project name, tech stack, and purpose
10. **Create .gitignore** appropriate for SvelteKit + Node
11. **Write initial tests:**
    - A smoke test that the app loads (Vitest)
    - A Playwright config test that verifies the test infrastructure works
12. **Verify:** Run `npm run build`, `npm run test`, `npm run lint` — all must pass

### Exit Criteria (from Stage 00 Research)

- `npm audit` zero critical/high vulnerabilities
- JSZip version >= 3.8.0 confirmed
- `npm run build` succeeds
- `npm run test` succeeds (smoke test passes)
- `npm run lint` succeeds
- ESLint + Prettier configured with zero warnings on generated scaffold
- Vercel config has all required security headers
- Tailwind CSS 4 working (verify with a test class in the default page)

### After Implementation

Run the **D2R audit gate (Stage 01-A):** 5 consecutive full audit passes with zero errors. Each pass checks:
- All exit criteria above
- Compliance with Stage 00 research findings (all three tracks)
- File naming conventions (project rules)
- No secrets or credentials committed
- Accessibility: default page must have proper semantic HTML, lang attribute, viewport meta

Then run the **commit gate (Stage 01-B):** Commit with the D2R template:

```
Stage 01: Project scaffold

WHAT: [specific files]
WHY: [reasoning]
VERIFIED: Self-audit-edit gate passed — [N] total loops, [N] edits, 5 consecutive null-edit passes
STANDARDS: [which standards verified]
RESEARCH BASIS: [which Stage 00 findings informed this]

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>
```

Push immediately after commit.

### After Stage 01 is Complete

Report what you did and stop. Do NOT proceed to Stage 02 without Krystal's approval. Present:

```
## Stage 01-B: Commit Complete

**Commit:** [hash]
**Files:** [list]
**Pushed:** [yes/no]

Ready for Stage 02 (ZIP parser + security). Proceed?
```

## CRITICAL RULES

1. All processing is CLIENT-SIDE. No server-side data handling. ZIPs never leave the browser.
2. Svelte 5 runes syntax only (`$state`, `$derived`, `$effect`, `$props`). No Svelte 4 syntax.
3. Tailwind CSS 4 syntax only (`@import "tailwindcss"`, NOT `@tailwind base/components/utilities`).
4. Accessibility is not a polish pass — semantic HTML and ARIA from the first component.
5. Commit only files YOU created or modified. Never `git add -A`.
6. Push after every commit.
7. If anything is unclear, STOP and ask.

Go.
