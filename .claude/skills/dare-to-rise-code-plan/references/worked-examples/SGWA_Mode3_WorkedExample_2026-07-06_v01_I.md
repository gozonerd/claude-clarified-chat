---
title: "SGWA Worked Example — Mode 3 (New-Feature / brownfield-extend)"
filename: SGWA_Mode3_WorkedExample_2026-07-06_v01_I.md
mode: 3
example_app: "Simple Games Web App (SGWA) — canonical worked example (L3)"
status: "theoretical/projected (L10) — refine post-actual-build"
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 6 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
d1_floor_demonstrated: true
---

# SGWA Worked Example — Mode 3 (New-Feature / brownfield-extend)

## The SGWA scenario for this mode

SGWA (Simple Games Web App) already ships as a working single-player system: a browser client
renders game boards, a `GameEngine` service holds authoritative game state per session, and a
`SavedGamesService` persists completed games. It has a full 6-doc bundle (PRD/TRD/AVD/TQVCD/UXD/
PSCAD) already authored and current.

Product wants to add **real-time multiplayer** — two players in the same game session, moves
synchronized live, both clients seeing the same board state within a bounded latency window. This
is not a rewrite of anything: single-player mode keeps working unchanged. It is a new capability
grafted onto a live system. That is exactly Mode 3's shape: something new added to something that
already exists and already works.

## Inputs (which schemas)

- **6-doc bundle** — required, present. `AVD` documents `GameEngine` as a single-session-owner
  service (one authoritative state machine per game, no cross-session communication today).
- **Capability Spec** (schema #4 of 8) — required, authored for this feature. See excerpts below.
- **Bundle Delta Plan** (schema #7) — authored in-flight per Lock L6, not gated at entry. As 00F
  and 02F-NN stages touch the AVD (new `SessionSyncService` boundary) and TQVCD (new verification
  coverage for sync latency), each touch gets a timestamped `delta_entries[]` line, cross-checked
  against the bundle's BIDX-5 change log at exit.

## Stage-00 walkthrough (00F)

00F keeps the Mode-1 tracks scoped to the delta (production-engineering assessed only for the
sync-related surfaces; accessibility for the new "invite a friend" UI; test-strategy for the
multiplayer acceptance criteria — not a full-system retest) and adds the three brownfield-specific
tracks:

1. **Dependency analysis.** Multiplayer depends on: `GameEngine` (must expose move events, not
   just accept them), a new pub/sub or WebSocket transport (does not exist in SGWA today), and
   `SavedGamesService` (must record which player made which move, a schema addition). Nothing
   currently depends on multiplayer, since it doesn't exist yet — but `SessionSyncService` (new)
   will become a dependency of both the client and `GameEngine` once shipped.
2. **Integration-point mapping.** Populates `integration_points[]` directly (see excerpt below) —
   `GameEngine` (event-emission add), `SavedGamesService` (schema extension), client render loop
   (new subscribe-to-remote-moves path).
3. **Capability-fit-vs-existing-architecture analysis.** Populates `architecture_fit`. This is the
   section this document exists to demonstrate — see below.

00F does not exit until `integration_points[]` and `architecture_fit` are both populated to
schema — not a placeholder, not a one-liner.

## D1 floor demonstrated: full `architecture_fit` block

Below is the actual populated block that would ship in this feature's Capability Spec. This is
what "substantive-by-default" looks like in practice — not maximal, not padded, but a real
analysis a reviewer could falsify by checking the referenced AVD section.

```yaml
architecture_fit:
  fit_assessment: >
    GameEngine today is architected as a single-session-owner state machine: one instance holds
    authoritative state for exactly one game, with no inter-instance communication and no
    assumption that another party needs to observe its state changes in near-real-time. Grafting
    multiplayer directly into GameEngine — e.g. having GameEngine itself push state deltas to a
    second client — would break its single-responsibility shape: GameEngine would now own both
    "compute the next valid game state" AND "fan out that state to N observers with delivery
    guarantees," which are different concerns with different failure modes (a stalled fan-out
    should never block move validation). Instead, this capability is proposed as a NEW service,
    SessionSyncService, sitting alongside GameEngine rather than inside it: GameEngine emits a
    move-applied event (a small, additive change to its existing interface — it does not need to
    know how many observers exist or how they're notified), and SessionSyncService subscribes to
    that event stream, maintains the two-client fan-out, and enforces the bounded-latency
    guarantee. This keeps GameEngine's boundary exactly as it is today (still the single source of
    truth for valid moves) while the new real-time-fan-out concern lives in a module built for it.
    The one boundary this does strain slightly is SavedGamesService, which today assumes one
    player authors a saved game; it needs a schema extension (player_id per move) rather than a new
    service, since "who made this move" is a data-shape question, not a new responsibility.
  boundary_map_ref: "docs/AVD_Template_2026-04-26_v03_I.md#game-engine-module (current AVD, rev 2026-06-20)"
  architectural_risks:
    - risk_id: AR-01
      description: "SessionSyncService introduces a new stateful pub/sub dependency (WebSocket fan-out) SGWA has not operated before"
      likelihood: medium
      impact: medium
      mitigation_or_accepted_by: "start with a managed WebSocket relay rather than self-hosting; revisit self-hosting only if cost/latency demands it post-GA"
    - risk_id: AR-02
      description: "Move-applied event stream could silently desync from GameEngine's authoritative state under partial delivery failure"
      likelihood: low
      impact: high
      mitigation_or_accepted_by: "SessionSyncService periodically re-syncs full board state (not just deltas) as a self-healing floor; see data_consistency framing in QA-F acceptance pass"
  alternatives_considered: >
    Considered (a) building fan-out directly into GameEngine — rejected per fit_assessment above,
    conflates move-validation with delivery concerns; (b) client-to-client peer sync (WebRTC, no
    server relay) — rejected because it removes GameEngine as the single authoritative arbiter of
    valid moves, which every other SGWA feature (replay, spectating, anti-cheat) currently assumes;
    SessionSyncService-as-new-module was chosen as the option that adds the new concern without
    relocating the existing one.
```

Note what this is not: it is not "Multiplayer fits fine, GameEngine can handle two clients." A
one-liner like that would be rejected at the 00F capability-fit pass — `fit_assessment` would be
judged a placeholder, and 00F cannot proceed past that pass without a real analysis, regardless of
how "obviously fine" the feature might look to whoever is authoring it.

## Stage sequence (abbreviated)

- **00F** — tracks above; exit when `integration_points[]` + `architecture_fit` populated to
  schema and scoped Mode-1 tracks clear.
- **01F** — plan from Capability Spec + Bundle Delta Plan; produces `02F-NN` per-component stages
  (e.g. 02F-01 GameEngine event emission, 02F-02 SessionSyncService build, 02F-03 SavedGamesService
  schema extension, 02F-04 client subscribe path).
- **02F-NN** — implementation stages per above, bundle updated inline (Bundle Delta Plan
  `delta_entries[]` written contemporaneously, not reconstructed after).
- **QA-F** — see below.
- **Exit** — threshold-2 gate, Mode-3 audit checklist (per `Mode3_NewFeature_Spec`).

## QA-F protocol for this example

1. **Acceptance pass** against `acceptance_criteria_summary` (e.g., "both clients see a move within
   400ms; no move is ever delivered out of order").
2. **Canary rollout** per `canary_rings[]`: internal test accounts -> 1% of new game sessions ->
   5% -> 25% -> 100%, each ring gated on `promotion_criteria` (e.g. "sync latency p95 < 400ms,
   zero desync incidents over the ring's soak window") and watched against `rollback_trigger`
   (e.g. "any confirmed desync incident").
3. **Kill-switch verification** — `multiplayer_enabled` flag, default `false`, owned by the
   feature-flag service, confirmed < 60s propagation, tested before GA.
4. **Success-metrics review**, post-GA — e.g. "% of active players who start >=1 multiplayer game
   within 30 days," measured against the Opportunity Assessment that motivated the feature.
5. **Bundle Delta Plan reconciliation** — every `delta_entries[]` line (AVD: new
   SessionSyncService boundary; TQVCD: new sync-latency VC entries) cross-checked against BIDX-5.

## What this example demonstrates

- Mode 3's input gate (bundle + Capability Spec, Bundle Delta Plan in-flight) applied to a
  concrete brownfield feature.
- The 00F track set (retained-scoped Mode-1 tracks + dependency analysis + integration-point
  mapping + capability-fit) walked against a real architectural decision (new service vs.
  in-module extension).
- **The D1 substantive-by-default floor, populated, not asserted**: a full `architecture_fit`
  block with real prose reasoning about module boundaries, a falsifiable `boundary_map_ref`, two
  non-trivial `architectural_risks[]` entries with likelihood/impact/mitigation, and a genuine
  `alternatives_considered` showing two rejected integration shapes — the concrete shape 00F
  cannot proceed without, and the concrete shape a one-liner ("fits fine") would fail against.

## Honest gaps

- This is a theoretical/projected worked example (L10) — no actual SGWA codebase exists yet to
  verify that `SessionSyncService` is really the right boundary; the architecture_fit reasoning is
  plausible-and-illustrative, not empirically checked against a real GameEngine implementation.
- The mechanical "is this prose substantive or padded" question remains reviewer judgment (per
  `Mode3_NewFeature_Spec`'s own honest gap) — this example is written to obviously clear that bar,
  but does not itself resolve how a future gate would check it automatically.
- Real-time multiplayer's actual latency/consistency numbers (400ms, etc.) are illustrative
  placeholders, not derived from any real SGWA performance baseline.
- This example does not yet show what a *rejected* (placeholder) `architecture_fit` block would
  look like side-by-side — that contrast is asserted in prose here but not shown as a worked
  negative example; a future revision could add one for training/review purposes.
