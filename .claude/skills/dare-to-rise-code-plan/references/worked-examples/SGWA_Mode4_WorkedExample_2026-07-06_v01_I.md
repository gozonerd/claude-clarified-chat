---
title: "SGWA Worked Example — Mode 4 (Staged Replacement / strangler-fig)"
filename: SGWA_Mode4_WorkedExample_2026-07-06_v01_I.md
mode: 4
example_app: "Simple Games Web App (SGWA) — canonical worked example (L3)"
status: "theoretical/projected (L10) — refine post-actual-build"
created: 2026-07-06
authored_by: "Claudette-Claudemilla W. Goldseam v01 (claude-opus-4-8), FORK-A D2R v03 Stage 6 — drafted via TESS-T1 Sonnet"
classification: internal (mm-d2r-code-plan-stack)
d1_floor_demonstrated: true
---

# SGWA Worked Example — Mode 4 (Staged Replacement / strangler-fig)

## The SGWA scenario for this mode

SGWA's `GameEngine` currently holds all in-flight game state **in memory**, per server process.
This was fine at launch (single-player, low concurrency) but now blocks two things product wants:
horizontal scaling of the game-server fleet (in-memory state pins a session to one process) and
crash-safe resume (a process restart today loses any game not yet saved). The fix is to replace
the in-memory state store with a **persistent backend** (e.g. a Redis-backed session store) behind
the same `GameEngine` interface.

This is not additive the way multiplayer (Mode 3) was — it is a **replacement** of a load-bearing
subsystem that the entire rest of SGWA depends on, done while the system keeps serving live games.
That is Mode 4's shape exactly: OLD (in-memory store) is walked to NEW (persistent store) via an
interleaved sequence of ADDED/REMOVED cutover events, never a single atomic swap, because a
mid-flight game session cannot simply be paused.

## Inputs (which schemas)

- **6-doc bundle** — required, present. AVD documents `GameEngine`'s current in-memory store as
  an implementation detail behind a stable interface (`get_state`, `apply_move`, `save_and_close`).
- **Cutover Plan** (schema #5 of 8) — required, hard-refuse if missing or size-skipped. See
  excerpts below.
- **Bundle Delta Plan** (schema #7, shared with Mode 3, L6) — authored in-flight as AVD/TQVCD
  entries change (new persistent-store component, new data-consistency VC entries).

## Stage-00 walkthrough (00S)

00S runs 00F's three tracks (dependency analysis, integration-point mapping, capability-fit —
all at the **full**, non-negotiable D1 floor for Mode 4, not the Mode-3 substantive-by-default
floor) plus the four cutover-specific tracks:

1. **Dependency analysis** — everything that reads/writes `GameEngine` state transitively:
   the move-validation path, `SavedGamesService` (reads final state on save), the (new, from the
   Mode-3 example) `SessionSyncService` (reads state on every move to fan out), and any admin/
   debug tooling that inspects live sessions.
2. **Integration-point mapping** — every seam where OLD (in-memory store) is touched: the
   `GameEngine` internal state accessor, process-restart/crash-recovery path (today: none, state
   is simply lost), and the deploy pipeline (today: assumes stateless-restart is safe for
   *server* code but not for *session* state, an implicit and undocumented distinction).
3. **Capability-fit vs existing architecture (full floor)** — is a persistent backend compatible
   with `GameEngine`'s existing interface shape? Assessed as yes: `get_state`/`apply_move`/
   `save_and_close` do not leak "in-memory" as an assumption anywhere in their signatures, so NEW
   can sit behind the same interface. This is still a real, full-depth analysis (not skipped just
   because Mode 3's version of this track already exists in the codebase) — Mode 4 does not get to
   reuse Mode 3's shallower floor.
4. **Cutover-readiness** — is there a safe entry point? Yes: `GameEngine` already routes all state
   access through its accessor methods (no direct field access elsewhere in the codebase), so a
   dual-write shim can be inserted there without touching every call site individually.
5. **OLD/NEW state modeling** — see D1 floor section below.
6. **Data-migration integrity** — for games already in-flight at cutover time, moves must land
   consistently whether the request hits the OLD in-memory path or the NEW persistent path during
   the transition window.
7. **Routing/gateway design** — a per-session feature flag (not global) is buildable today via
   SGWA's existing feature-flag service, confirmed buildable before Stage 01S commits to it.

## D1 floor demonstrated: full OLD/NEW state models + data-consistency checks

This is the section this document exists to demonstrate: even though "swap the state store" can
sound like a small, contained change, the Mode-4 floor gives it the full, non-negotiable
treatment — no abbreviated version exists for this mode.

```yaml
OLD_state_model:
  components: [GameEngineInMemoryStore]
  data_stores: ["process-local heap map: session_id -> GameState"]
  invariants:
    - "session state survives for the lifetime of the owning process"
    - "exactly one process holds authoritative state for a given session_id at any time"
    - "state is lost on process crash or restart (accepted today, not a guarantee — documented as a known gap)"
  traffic_paths: ["client -> load balancer (sticky session) -> GameEngine (same process every request)"]

NEW_state_model:
  components: [GameEngineRedisStore, RedisSessionCluster]
  data_stores: ["Redis-backed session store, keyed by session_id, replicated across cluster nodes"]
  invariants:
    - "session state survives for the lifetime of the owning process"        # carried over, unchanged
    - "exactly one process holds authoritative WRITE access for a given session_id at any time"  # carried over, refined: read access may now be multi-process
    - "state survives process crash or restart"                              # NEWLY INTRODUCED — the reason for this cutover
    - "state written during cutover window is visible to whichever store services the NEXT request for that session"  # NEWLY INTRODUCED — cutover-window-specific
  traffic_paths: ["client -> load balancer (no longer sticky-session-dependent) -> any GameEngine process -> RedisSessionCluster"]

cutover_events:
  - event_id: CO-01
    type: ADDED
    target_component: GameEngineRedisStore
    description: "Deploy Redis-backed store dark; GameEngine writes to BOTH old in-memory and new Redis store, reads still from in-memory"
    precondition: "RedisSessionCluster healthy, passes smoke suite"
    postcondition: "dual-write active, zero read-path change, zero user-visible change"
    owning_stage_ref: 01S-01
  - event_id: CO-02
    type: ADDED
    target_component: routing_gateway
    description: "Flip READS to Redis for 5% of sessions (writes still dual-path for all sessions)"
    precondition: "CO-01 postcondition met; dual-write comparator shows zero diffs over 24h soak"
    postcondition: "5% cohort reads Redis, zero desync incidents"
    owning_stage_ref: 01S-02
  - event_id: CO-03
    type: ADDED
    target_component: routing_gateway
    description: "Ramp Redis-read cohort 5% -> 50% -> 100%"
    precondition: "prior ring's postcondition held for its full soak window"
    postcondition: "100% of sessions read from Redis; in-memory store still written (safety net)"
    owning_stage_ref: 01S-03
  - event_id: CO-04
    type: REMOVED
    target_component: GameEngineInMemoryStore
    description: "Stop dual-write; decommission in-memory store code path entirely"
    precondition: "100% Redis-read for >=7 days, zero invariant violations, zero rollback triggers fired"
    postcondition: "GameEngineInMemoryStore code path removed, not just unused"
    owning_stage_ref: 01S-04

routing_gateway_plan:
  mechanism: "per-session feature flag, cohort-assigned at session-start"
  stages: ["0% (dark dual-write)", "5% read-canary", "50%", "100% read, dual-write still active", "100%, dual-write removed"]

data_consistency_checks:
  - check_id: DC-01
    invariant_ref: "exactly one process holds authoritative WRITE access for a given session_id at any time"
    verification_method: "dual-write comparator: every apply_move call diffs the in-memory result against the Redis-write result before either is considered committed"
    run_cadence: continuous
    owning_TQVCD_VC_ref: TQVCD-VC-22
  - check_id: DC-02
    invariant_ref: "state written during cutover window is visible to whichever store services the NEXT request for that session"
    verification_method: "synthetic session probe: write via old path, immediately read via new path (and vice versa) once per minute during active cutover rings"
    run_cadence: per-event
    owning_TQVCD_VC_ref: TQVCD-VC-23
  - check_id: DC-03
    invariant_ref: "state survives process crash or restart (NEW invariant)"
    verification_method: "chaos test: kill -9 a GameEngine process mid-session during CO-03 ring, confirm session resumes from Redis with zero data loss"
    run_cadence: pre-post
    owning_TQVCD_VC_ref: TQVCD-VC-24

rollback_per_event:
  - event_id: CO-02
    reversal_action: "flip per-session read flag back to in-memory for the affected cohort"
    precondition: "dual-write comparator reports any diff, OR desync incident confirmed"
    postcondition: "100% of sessions reading from in-memory store again; Redis dual-write continues (no data loss, just paused adoption)"
  - event_id: CO-03
    reversal_action: "flip per-session read flag back to in-memory for whichever ring is active"
    precondition: "any invariant violation detected at 50% or 100% read-ring"
    postcondition: "read traffic fully reverted to in-memory; investigate before re-attempting ramp"
  - event_id: CO-04
    reversal_action: "redeploy GameEngine build with in-memory store code path restored from last-known-good image; re-enable dual-write"
    precondition: "post-removal regression discovered (e.g. a crash-recovery path Redis handles differently than expected)"
    postcondition: "in-memory store serving again as safety net; Redis remains as source of truth for already-migrated sessions"
```

**Note what did NOT happen here:** this is "just" a storage-backend swap behind an already-stable
interface — about as small as a Mode-4 cutover can plausibly look. It still gets full OLD/NEW
models (four invariants each, explicitly marked carried-over/refined/newly-introduced), four
interleaved cutover events with individually reasoned pre/postconditions, three data-consistency
checks at three different cadences, and three paired rollback entries. Per the D1 ruling —
*"cutover IS architecture surgery, there is no small version"* — a thinner version of this
(e.g., skipping DC-03's chaos test because "Redis is reliable") would be refused at the Mode-4
input gate, not merely flagged as a QA-S finding to catch later.

## Stage sequence (abbreviated)

- **00S** — tracks above; exit when cutover-readiness confirmed and OLD/NEW models are populated
  and field-for-field diffable.
- **01S** — plan of interleaved cutover events; hands `cutover_events[]` + `rollback_per_event` to
  a Phased Plan for stage-by-stage model-assignment (stage naming `02S-NN`, one stage per event or
  tightly-coupled event group, in the interleaved CO-01→CO-04 order — never reordered to
  "add everything, then remove everything").
- **02S-NN** — implementation stages per `cutover_events[]`, in order.
- **QA-S** — see below.
- **Exit** — threshold-2 gate, Mode-4 audit checklist (per `Mode4_StagedReplacement_Spec`).

## QA-S protocol for this example

1. **Re-review-of-OLD** — confirm `OLD_state_model` still matches production reality at cutover
   time (e.g., has anything started depending directly on in-memory state's crash-loses-data
   behavior as an implicit feature, such as a test harness relying on restart-to-reset?).
2. **Canary-of-NEW** — execute CO-01 -> CO-04 in order, confirming each event's postcondition
   before advancing to the next.
3. **Gateway-routing verification** — confirm the per-session feature flag is actually the
   mechanism moving traffic (not, e.g., a load-balancer sticky-session rule silently still pinning
   some sessions to the old path even after their flag flips).
4. **Data-consistency verification** — DC-01 run continuously throughout; DC-02 run at every
   event boundary; DC-03's chaos test run pre- and post-CO-04.
5. **Cutover-completeness verification** — confirm CO-04's postcondition ("code path removed, not
   just unused") is literally true — a REMOVED event where the old code path still exists,
   dormant, does not count as complete.

## What this example demonstrates

- Mode 4's input gate (bundle + Cutover Plan, hard-refuse on missing or size-skipped) applied to
  a concrete brownfield-replacement scenario.
- The 00S track set (00F's three tracks at full floor + cutover-readiness + OLD/NEW modeling +
  data-migration integrity + routing design) walked against a real storage-backend swap.
- **The D1 full/non-negotiable floor, populated, not asserted**: complete `OLD_state_model` and
  `NEW_state_model` blocks marked field-for-field diffable with invariants explicitly tagged
  carried-over / refined / newly-introduced; four interleaved ADDED/REMOVED `cutover_events[]`
  (never batched by type); three `data_consistency_checks[]` at three cadences; three
  `rollback_per_event` entries 1:1 with the events that need them — applied to a change that looks
  "small" on its face, demonstrating that Mode 4 gives it the full treatment anyway.

## Honest gaps

- This is a theoretical/projected worked example (L10) — no actual SGWA codebase or Redis
  deployment exists yet; the dual-write comparator and chaos-test mechanics are plausible designs,
  not implementations verified against a real system.
- The genuinely-trivial-single-file-swap edge case (flagged as an open empirical question in both
  the Cutover Plan schema spec and the Mode-4 mode spec) is not resolved by this example — this
  storage-backend swap is a reasonably substantial cutover on its own merits, not the minimal case
  that would stress-test whether the full floor ever feels disproportionate.
- `owning_TQVCD_VC_ref` entries (TQVCD-VC-22/23/24) are illustrative identifiers; this example
  does not show the corresponding TQVCD authoring flow that would mint them, including the
  not-yet-specified flow for minting a fresh VC entry for a NEWLY-introduced invariant (flagged as
  an honest gap in the Cutover Plan schema spec itself).
- Reconciliation behavior when `data_consistency_checks` disagree with each other (e.g., DC-01
  and DC-02 report contradictory drift at the same moment) is not defined here — inherited
  directly from the Cutover Plan schema spec's own unresolved gap.
