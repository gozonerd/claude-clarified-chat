# Real Claude Desktop export fixtures

This directory holds **real Claude Desktop export `.zip` files** used by the F13 (fixture-tautological validation) prevention test suite.

## Why these are gitignored

Real exports contain session content (conversation text, tool call payloads, file paths, working directory names) that is local to a developer's environment. Committing them would leak that content into a public repository. The `.gitignore` excludes both the `.zip` files and their `-extracted/` directories.

## How to populate locally

1. In Claude Desktop, run **Export Session** on any session.
2. Move the resulting `session-export-<timestamp>.zip` into this directory.
3. Rename to one of the canonical fixture names declared in `loadRealExport.ts`:
   - `export-small-<timestamp>.zip` (small/short session)
   - `export-mid-<timestamp>.zip` (mid-length session)
   - `export-large-<timestamp>.zip` (long session with many tool calls / sub-agents)
4. Update `RealExportName` in `loadRealExport.ts` if your timestamps differ.
5. Extract each zip into `<name>-extracted/` (the test loader reads the extracted directory, not the zip itself).
6. Re-run `npm run test:coverage`. The F13 prevention suite (`parse — REAL Claude Desktop export drop-in`, `RawEventSchema — empirical Claude Desktop shape > against 3 real export JSONL files`, etc.) will activate.

## What happens without the fixtures

`realExportFixturesPresent()` in `loadRealExport.ts` returns `false`, the F13 acceptance tests `describe.runIf(...)`-skip, and the rest of the suite (unit tests for `normalize`, schema, parser with synthetic empirical-shape data) covers the code paths. Coverage stays 100% because the inline empirical-shape test data exercises all branches.

## Why this matters

CCC v1.0 shipped with 100/100/100/100 coverage and 293 tests, but every test fixture was synthesized from CCC's own (fictional) schema. When real Claude Desktop zips were dropped in, every event rendered as "unavailable" while still being counted. The F13 prevention discipline is: **every fixture used to validate a schema must trace to a real producer of that schema, never to the schema being tested**.
