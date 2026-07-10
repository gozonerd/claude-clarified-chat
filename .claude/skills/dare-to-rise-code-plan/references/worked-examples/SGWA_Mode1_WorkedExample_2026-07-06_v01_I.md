---
title: "SGWA Worked Example — Mode 1 (Greenfield)"
filename: SGWA_Mode1_WorkedExample_2026-07-06_v01_I.md
mode: 1
example_app: "Simple Games Web App (SGWA) — canonical worked example (L3)"
status: "theoretical/projected (L10) — refine post-actual-build"
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 6 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
---

# SGWA Worked Example — Mode 1 (Greenfield)

## The SGWA scenario for this mode

SGWA is a small web app that hosts a handful of casual browser games — to start, a **Tic-Tac-Toe**
board with local two-player play, a **Reaction-Time** click game with a per-session best-time
tracker, and a **shared Leaderboard** page that ranks scores across whichever games report them.
There is no existing code. Mode 1 is the from-scratch build: nothing pre-exists to re-verify
(Mode 2), extend (Mode 3), or migrate off of (Mode 4) — the entire brownfield floor discipline
that governs those three modes simply does not apply here. Mode 1's job is to backwards-plan from
"what does an excellent SGWA look like" and build every stage toward that, with no existing
system's constraints to inherit or work around.

## Inputs

Mode 1's input gate is **the 6-doc bundle, required-universal** (per LEAD §5.0) — there is no
on-demand posture here, unlike Mode 2. All six must exist and be approved before Stage 00 runs:

- **PRD** — SGWA's product shape: three games (Tic-Tac-Toe, Reaction-Time, Leaderboard), local
  play only (no accounts, no multiplayer-over-network in v1), session-scoped score persistence,
  target audience = casual desktop + mobile-web players.
- **TRD** — technical requirements: client-side game-state machines per game, a shared score-event
  contract each game emits to the Leaderboard, `localStorage`-backed persistence for v1 (no backend
  in scope), responsive layout down to 375px.
- **AVD** — architecture vision: a single-page app with per-game route components, a shared
  `GameShell` layout, a `ScoreEventBus` module the Leaderboard subscribes to, no server component
  in v1's boundary.
- **TQVCD** — test/verification coverage: 100% line+branch on all three game-state machines and the
  score-event contract; WCAG 2.1 AA legal floor + LIVED floor (cognitive/reading/vision) per the
  2026-05-05 Accessibility Floor Update; behaviors-verified/behaviors-claimed headline metric.
- **UXD** — visual system: a bright, low-friction "arcade cabinet" visual language; both-theme
  (light/dark) token set; reference apps annotated for the Leaderboard's ranking-list treatment.
- **PSCAD** — pattern-space coverage: production input/sequence patterns not covered by TQVCD tests
  alone — e.g., rapid repeated clicks on Reaction-Time faster than the debounce window, a
  Tic-Tac-Toe board resized mid-game, localStorage quota exhaustion on the Leaderboard.

All six are required and approved before Stage 00 opens; a missing or unapproved doc blocks Stage
00 per the skill's Prerequisite Inputs discipline — Mode 1 gets no exception.

## Stage-00 walkthrough

Stage 00 runs the full **20-track** research sweep (16 hardwired + 4 applicability-gated), scoped
by the six bundle docs above. A sample of how a few tracks land for SGWA specifically:

- **Track 1 (tech stack):** evaluates Vite + vanilla TS vs. a light framework (Preact/Svelte) for
  three small, mostly-independent game components; recommends Vite + TypeScript + a minimal
  component layer, rejecting a heavier framework as disproportionate to three games with no shared
  server state, with sandbox-quality assessment (Track 1's A18 extension) folded in since SGWA ships
  as a static deploy with no Tauri/Electron shell in scope.
- **Track 6/7/8 (design + a11y):** SGWA has no parent-org design system to inherit, so it becomes
  its own source-of-truth (Track 6); Track 7 recommends CSS custom properties + a small headless
  component set over a full component library given the app's size; Track 8 covers both the legal
  floor (axe-core in CI, both-theme contrast checks) and the lived floor — Phase 00 Q18/Q19/Q20 are
  evaluated: cognitive (Q18, applicable — Reaction-Time's timer-driven UI is exactly the modal-
  discipline risk case the lived floor exists for), reading (Q19, applicable — leaderboard score
  tables benefit from a dyslexia-conscious font option), vision (Q20, applicable — theme toggle).
- **Track 11 (performance):** Reaction-Time's core loop is latency-sensitive (measuring the user's
  own reaction time means the app's input-to-paint latency must not distort the measurement) —
  Track 11 sets a specific budget: input-to-timestamp capture must resolve sub-16ms, informing a
  `requestAnimationFrame`-anchored timing approach rather than a naive `Date.now()` on click.
- **Tracks 17-20 (applicability-gated):** cost (Track 17) — NA-with-justification, static hosting,
  negligible cost; i18n (Track 18) — NA-with-justification, English-only v1, note on retrofit cost
  if it expands; AI-native (Track 19) — NA, no LLM in the runtime path; compliance ops (Track 20) —
  NA, no regulated data (no accounts, no PII beyond a session-scoped display name).

Stage 00 exits through the ASAE gate at threshold 2 once all 20 tracks are complete (16
full + 4 applicability-gated with explicit applicability decisions recorded), cross-track
consistency is confirmed (e.g., Track 1's Vite choice + Track 7's CSS-custom-property approach +
Track 8's theme-toggle pattern all integrate without conflict), and the lived-floor tooling for
Q18/Q19/Q20 is documented per the HIGH-severity refusal table in TQVCD §6.9 / UXD §5.8.

## Stage sequence (abbreviated)

- **Stage 01a (Opus):** skeleton authorship. Defines SGWA's excellent end state (three fully
  playable games, shared Leaderboard, both-theme + lived-floor accessibility, 100% coverage on
  state machines) and designs QA first from the TQVCD before any implementation stage is named.
  Produces the stage list at metadata level; exits through ASAE gate at threshold 2 + user approval.
- **Stage 01b (Opus):** full plan authorship at Deep/Medium/Shallow depth per stage. Given Haiku
  executes Stage 03+, most game-logic stages are tagged Deep (exact TypeScript signatures for the
  Tic-Tac-Toe win-check function, the Reaction-Time timing state machine, the `ScoreEventBus`
  publish/subscribe contract). Exits through ASAE gate at threshold 3.
- **Stage 02 (Sonnet) — ALWAYS Project Scaffold in Mode 1:** repo creation, README + LICENSE
  drafted from Opus's content decisions, `package.json`/`tsconfig`/`eslint`/`vite.config`/
  `prettier` configs, CI workflow (build + test + a11y-scan), `.claude/settings.json` +
  `.githooks/` hook installation, initial commit + push. This is the stage Mode 2/3/4 replace with
  an EV stage (baseline capture against existing code) — in Mode 1 there is no existing code to
  baseline, so Scaffold is unconditionally the right Stage 02. Exits through ASAE gate at threshold
  3 + commit gate.
- **Stage 03 (Haiku, Deep spec):** Tic-Tac-Toe game — board state, win/draw detection, local
  two-player turn logic, score-event emission on game end. Test coverage 100% authored alongside.
- **Stage 04 (Haiku, Deep spec):** Reaction-Time game — `requestAnimationFrame`-anchored timing
  state machine, false-start detection (click before prompt), per-session best-time tracking,
  score-event emission.
- **Stage 05 (Haiku, Deep spec):** Leaderboard — `ScoreEventBus` subscriber, ranked-list rendering,
  `localStorage` persistence with PSCAD's quota-exhaustion pattern handled (graceful degradation to
  session-only if quota is hit).
- **Stage 06 (Sonnet):** Design Polish — visual + interaction pass against the UXD's arcade-cabinet
  language and both-theme token set; iterates with `/asae` at `domain=design` until 3 consecutive
  clean cycles.
- **Stage QA — 5-cycle convergence:** full applicable Testing Taxonomy sweep (unit, integration,
  a11y in both themes, stress on Reaction-Time's timing precision under PSCAD's rapid-click
  pattern, cross-browser) plus stress testing, iterating until ASAE Certainty Threshold of 5
  consecutive clean cycles is reached. Opus judges convergence; Sonnet authors remediation; Haiku
  transcribes rote fixes.

## What this example demonstrates

- The **6-doc bundle as required-universal** input posture specific to Mode 1 — no on-demand
  softening the way Mode 2 gets for its bundle.
- Stage 00 running the **full 20-track sweep** with no brownfield exemptions — every track (design,
  security, performance, the four applicability-gated tracks) gets a first-run assessment because
  nothing pre-exists to inherit assumptions from.
- **Stage 02 as unconditionally Project Scaffold** — the baseline case the EV-stage substitution in
  Modes 2/3/4 is defined against.
- The lived-floor accessibility tracks (Q18/Q19/Q20) landing as APPLICABLE for a small, latency-
  sensitive, casual-audience app — a concrete case where "small app" does not mean "accessibility
  floor doesn't apply."
- **5-cycle QA convergence** as Mode 1's exit gate, contrasted implicitly with Mode 2's QA-R
  (re-verification-focused) and Mode 3/4's canary-rollout-focused exit gates.

## Honest gaps

- This is a **projected** worked example (L10) authored from the SGWA concept before any actual
  build exists — the specific Track 1 stack recommendation, the exact Deep-spec function
  signatures, and the PSCAD pattern list are illustrative of the *shape* Stage 00/01 output takes,
  not verified outputs of an actual Stage 00 run against a real SGWA bundle. Refine this doc against
  the real bundle + real Stage 00 findings once SGWA is actually built.
- The abbreviated stage sequence collapses what would likely be more than 3 feature stages in a
  real Stage 01b (e.g., shared `GameShell` layout might reasonably be its own stage rather than
  folded into Stage 03) — this doc trades completeness for readability at ~100-140 lines.
- Track-level findings shown here (Track 1, 6/7/8, 11, 17-20) are a representative sample, not the
  full 20-track output — a real Stage 00 Research Findings document would be substantially longer.
- The interplay between Reaction-Time's sub-16ms latency budget (Track 11) and the lived-floor
  cognitive tooling's "time-to-first-productive-action" measurement (Track 8) is asserted as
  compatible here but not actually worked through — a real build might surface tension between
  precise input-timing requirements and cognitive-load instrumentation overhead.
