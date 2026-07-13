# The Last Word War™

## Time Synchronization Architecture v1.2

**Steward:** Victor A. Adeyemi

**Organization:** Da-aim Services

**Status:** Approved Infrastructure Specification

**Date:** 2026-07

------------------------------------------------------------------------

# Purpose

This document defines the multiplayer time synchronization architecture
for **The Last Word War™**.

The architecture ensures:

-   all connected players observe a consistent countdown;
-   timeout penalties are applied exactly once;
-   turn advancement occurs exactly once;
-   stale timeout requests cannot corrupt active gameplay;
-   timer authority does not depend on any player's browser;
-   matches remain recoverable after temporary disconnections.

The system uses a **shared turn deadline** for countdown display and a
**database-authoritative timeout processor** for timeout resolution.

------------------------------------------------------------------------

# Scope

This specification governs:

-   shared turn deadlines;
-   countdown display;
-   timeout detection;
-   authoritative timeout processing;
-   optimistic concurrency;
-   stale-event rejection;
-   timeout recovery.

Gameplay rules such as timeout penalties, inactivity thresholds, and
victory conditions are defined elsewhere.

------------------------------------------------------------------------

# Problem Statement

Independent browser timers diverge because of latency, browser
scheduling, tab throttling, device clocks and temporary disconnections.

Such divergence may produce:

-   inconsistent countdown displays;
-   duplicate timeout penalties;
-   skipped turns;
-   stale callbacks;
-   corrupted shared state.

Competitive multiplayer requires exactly one authoritative timeout
transition.

------------------------------------------------------------------------

# Design Goals

The architecture shall ensure:

1.  Every client derives its countdown from the same deadline.
2.  Timeout penalties occur exactly once.
3.  Turn advancement occurs exactly once.
4.  Server time determines official expiration.
5.  No browser possesses timeout authority.
6.  Stale timeout requests cannot overwrite newer state.
7.  Timeout processing remains reliable after client failures.

------------------------------------------------------------------------

# Rejected Architecture 1 --- Shared Remaining Time

Persisting `timeLeft` every second would require continuous writes and
broadcasts.

This approach increases:

-   database traffic;
-   synchronization complexity;
-   race conditions.

It is therefore rejected.

------------------------------------------------------------------------

# Rejected Architecture 2 --- Host-Authoritative Timeout Processing

Earlier versions delegated timeout processing to the host browser.

This approach depended upon:

-   the host remaining connected;
-   the host browser remaining responsive;
-   local timer accuracy.

Observed implementation issues included:

-   delayed timeout processing;
-   duplicate timeout penalties;
-   stale callbacks timing out the next player;
-   gameplay stalling after host disconnection.

The host-authoritative model is therefore retired.

------------------------------------------------------------------------

# Adopted Architecture

The adopted architecture consists of:

1.  Shared Turn Deadline
2.  Database-Authoritative Timeout Processor

Clients display time.

The database authoritatively resolves timeout transitions.

------------------------------------------------------------------------

# Shared Turn Deadline

Each turn stores a single deadline.

Example:

``` json
{
  "turnDeadline": "2026-07-12T20:35:00Z"
}
```

Clients calculate the remaining display time locally.

The display timer is informational only.

------------------------------------------------------------------------

# Database-Authoritative Timeout Processor

Timeout processing occurs inside a single atomic PostgreSQL transaction.

Conceptually:

``` text
process_expired_turn(roomCode, expectedTurnVersion)
```

The processor:

-   locks the room;
-   validates turn version;
-   validates server time;
-   verifies the turn remains unresolved;
-   applies timeout penalties;
-   updates inactivity counters;
-   removes inactive players when required;
-   advances the turn;
-   creates the next deadline;
-   commits the updated state.

Either the entire transition succeeds or no gameplay state changes.

------------------------------------------------------------------------

# Row-Level Serialization

The room record is locked before processing.

Competing timeout requests serialize automatically.

Only one transaction may resolve a turn.

Later requests observe the updated turn version and exit without
mutation.

------------------------------------------------------------------------

# Timeout Trigger Model

Any connected client may detect that the displayed deadline appears
expired.

The client submits a timeout-processing request.

The request has **no authority**.

The authoritative processor independently verifies:

-   current turn;
-   server time;
-   turn version;
-   unresolved state.

Only then is a timeout committed.

------------------------------------------------------------------------

# Server-Side Watchdog

A scheduled server process periodically scans for overdue turns.

If an expired unresolved turn exists, it invokes the same authoritative
timeout processor.

Both client-triggered and watchdog-triggered processing share identical
logic.

------------------------------------------------------------------------

# Processing Responsibilities

## Client

-   displays countdown;
-   submits player actions;
-   may request timeout processing;
-   synchronizes state.

## Database Processor

-   determines timeout validity;
-   applies gameplay transitions;
-   serializes concurrent requests.

## Realtime Layer

-   broadcasts committed state;
-   synchronizes clients.

------------------------------------------------------------------------

# Turn Version Synchronization

Each turn maintains a monotonically increasing `turnVersion`.

Every submission and timeout request includes the observed version.

If the authoritative version differs, the request is rejected as stale.

This prevents:

-   double timeout;
-   stale submission acceptance;
-   timing out the next player.

------------------------------------------------------------------------

# Near-Deadline Race

Sentence submissions and timeout requests compete for the same turn.

Only the first valid transaction acquires the lock and increments
`turnVersion`.

Subsequent requests become stale automatically.

------------------------------------------------------------------------

# Idempotency

Repeated timeout requests for an already resolved turn return:

``` text
NO_ACTION_ALREADY_RESOLVED
```

No gameplay state is modified.

------------------------------------------------------------------------

# Interaction with Match Completion

After a valid timeout:

-   inactivity counters are updated;
-   successful turns reset the counter;
-   player removal and exceptional completion follow
    **MATCH_COMPLETION_RULES.md**.

------------------------------------------------------------------------

# Interaction with Session Recovery

Recovered clients retrieve:

-   authoritative turn deadline;
-   turn version;
-   current player;
-   current game phase.

Clients reconstruct only the display timer.

------------------------------------------------------------------------

# Security

Clients must never directly modify:

-   scores;
-   timeout counters;
-   turn version;
-   winner;
-   match outcome;
-   active player.

These fields are modified only through authoritative database
operations.

------------------------------------------------------------------------

# Testing Requirements

The implementation should verify:

-   duplicate timeout requests;
-   simultaneous submissions;
-   host disconnection;
-   all-client disconnection;
-   watchdog processing;
-   stale callbacks;
-   inactivity removal;
-   Final Round;
-   Sudden Death;
-   recovery after reconnect.

------------------------------------------------------------------------

# Success Criteria

The architecture succeeds when:

1.  countdown displays remain synchronized;
2.  server time determines expiration;
3.  timeout penalties occur exactly once;
4.  turn advancement occurs exactly once;
5.  host disconnection does not affect timeout authority;
6.  stale callbacks never corrupt gameplay.

------------------------------------------------------------------------

# Future Improvements

Potential enhancements include:

-   dedicated authoritative game services;
-   distributed timeout workers;
-   regional processing;
-   advanced telemetry;
-   automated stalled-match recovery.

The authority model shall remain server-side.

------------------------------------------------------------------------

# Relationship to Other Documents

-   PROJECT_PHILOSOPHY.md
-   GAMEPLAY_PHILOSOPHY.md
-   GDD.md
-   GAME_ENGINE.md
-   NETWORK_PLAY_ARCHITECTURE.md
-   NETWORK_PLAY_SPECIFICATION.md
-   SESSION_PERSISTENCE_AND_RECOVERY.md
-   MATCH_COMPLETION_RULES.md
-   VICTORY_CONDITIONS.md

------------------------------------------------------------------------

# Version History

## Version 1.0

Initial synchronization architecture using shared deadlines and
host-authoritative timeout processing.

## Version 1.1

Introduced turn-version synchronization and optimistic concurrency.

## Version 1.2

Introduced a database-authoritative timeout processor, server-time
validation, row-level serialization, client-triggered timeout requests,
watchdog recovery, idempotent processing, and removal of
host-authoritative timeout handling.

------------------------------------------------------------------------

End of Document

