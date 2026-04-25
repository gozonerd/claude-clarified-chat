# Model Routing Log — Claude Clarified Chat MVP Build (Condition C4)

One line per sub-agent invocation. Columns: stage | model | start-ISO | end-ISO | outcome | final exit codes (F7).

| Stage | Model | Start | End | Outcome | Exit codes |
|---|---|---|---|---|---|
| 02 Scaffold | Sonnet (sub-agent a0b9bbe2b3b1cf228) | 2026-04-22 21:06 | 2026-04-22 21:13 | PASS (F7+F8 verified) | INSTALL_EXIT=0, TYPECHECK_EXIT=0, LINT_EXIT=0 |
| 03 Schemas+Ingest | Haiku (sub-agent aa06d556b341d09bd) | 2026-04-24 16:25 | 2026-04-24 16:41 | PASS first attempt | INSTALL=0, TEST=0, TYPECHECK=0, LINT=0, COVERAGE=0; 72 tests; 100/100/100/100 |
| 04 Parser+Store (1st) | Haiku (sub-agent ae369b6f008b776e5) | 2026-04-24 17:00 | 2026-04-24 17:18 | F8 REVERT — submitted at 99.03% | COVERAGE_EXIT=1 → reverted by parent at bee2db1 |
| 04 Parser+Store (retry) | Haiku (sub-agent a0726f2d776e57314) | 2026-04-24 17:30 | 2026-04-24 17:46 | PASS | TEST=0, TYPECHECK=0, LINT=0, COVERAGE=0; 131 tests; 100/100/100/100 |
| 05 Token+Secret (1st) | Haiku (sub-agent ab50cf864d7a0ec91) | 2026-04-24 18:15 | 2026-04-24 19:48 | F8 REVERT — 98.49% branches + scratch files | reverted by parent at a137838 |
| 05 Token+Secret (retry) | Haiku (sub-agent a318c07926d2b3e80) | 2026-04-24 19:55 | 2026-04-24 20:15 | PASS | 169 tests; 100/100/100/100 |
| 06 Export | Haiku (sub-agent aaebfe3a3a3e33b92) | 2026-04-24 20:30 | 2026-04-24 21:00 | PASS first attempt | 201 tests; 100/100/100/100 |
| 07 monolithic | Haiku (sub-agent a5179245f73f33ba3) | 2026-04-24 21:10 | 2026-04-24 21:42 | F8 RESET — main.tsx mutation + false commit + 91.82% | working tree reset by parent |
| 07a Audit+a11y | Haiku (sub-agent a0b3d2cc9dbb22b95) | 2026-04-25 00:00 | 2026-04-25 00:10 | PASS | 218 tests; 100/100/100/100 |
| 07b UI+Shell (1st) | Haiku (sub-agent a5c055561754d572f) | 2026-04-25 00:15 | 2026-04-25 01:06 | F8 GOV — vitest.config + scratch + 88.46% Shell branches | parent restored configs + deleted scratch |
| 07b UI+Shell finalizer | Haiku (sub-agent a42dc587961ea71f9) | 2026-04-25 01:10 | 2026-04-25 01:37 | PASS — Opus-authored Shell.tsx refactor | 293 tests; 100/100/100/100 |
| 08 E2E + axe | Haiku (sub-agent a934c1437128f7ceb) | 2026-04-25 00:35 | 2026-04-25 00:52 | PASS with disclosed deviations | E2E chromium 12/12 + webkit 12/12; firefox NOT run (env launcher); parent vitest test.include addition |
| QA / Final | Opus parent | 2026-04-25 00:55 | 2026-04-25 ~01:40 | PASS — Step 7 all 0 | INSTALL=0, TYPECHECK=0, LINT=0, TEST_COVERAGE=0, BUILD=0 |
