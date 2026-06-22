# The Last Word War™

# Time Synchronization Architecture v1.1

**Author:** Victor A. Adeyemi

**Status:** Approved

**Date:** 2026-06-22

---

# Purpose

This document defines the multiplayer time synchronization architecture for The Last Word War™.

The objective is to ensure that:

* all connected players observe a synchronized countdown;
* timeout penalties are applied exactly once;
* multiplayer state remains consistent under normal network conditions;
* stale timeout events cannot corrupt active gameplay.

---

# Problem Statement

In a purely local implementation, each browser maintains its own countdown timer.

Example:

```text
Player A Browser

Time Remaining: 12 seconds
```

```text
Player B Browser

Time Remaining: 15 seconds
```

Independent timers may diverge because of:

* network latency;
* browser scheduling differences;
* local processing delays;
* tab throttling on mobile devices.

This divergence can create several problems:

* players observe different remaining times;
* timeout penalties may be applied inconsistently;
* multiple clients may process the same timeout;
* shared game state may become corrupted.

Such behaviour is unacceptable for competitive multiplayer gameplay.

---

# Design Goals

The multiplayer synchronization architecture must satisfy the following requirements:

1. All players observe the same countdown.
2. Timeout penalties occur exactly once.
3. Turn advancement occurs exactly once.
4. Multiplayer state remains authoritative.
5. Stale events must never overwrite newer game states.

---

# Rejected Approach

## Shared Remaining Time

Example:

```json
{
    "timeLeft": 42
}
```

This approach requires continuous backend updates:

```text
42 → 41 → 40 → 39 ...
```

Disadvantages:

* unnecessary database traffic;
* increased synchronization complexity;
* higher risk of inconsistent countdown displays.

For these reasons, this approach was rejected.

---

# Adopted Approach

## Shared Turn Deadline

The room stores a single deadline value rather than continuously updating the remaining time.

Example:

```json
{
    "turnDeadline": 1750250100000
}
```

or

```json
{
    "turnDeadline": "2026-06-18T12:35:00Z"
}
```

The deadline is written once whenever a new turn begins.

Each client independently computes the remaining time:

```javascript
Math.max(
    0,
    Math.ceil((turnDeadline - Date.now()) / 1000)
);
```

---

# Benefits

The deadline-based model provides:

* synchronized countdown displays;
* minimal network traffic;
* reduced synchronization complexity;
* deterministic timeout behaviour;
* improved scalability.

The backend is updated only when turns begin or end.

---

# Timeout Authority

A multiplayer room must contain exactly one timeout authority.

If multiple clients process timeout events simultaneously, duplicate penalties may occur.

Example:

```text
Host applies timeout.
Guest applies timeout.
```

Possible consequences:

* duplicate penalties;
* incorrect scores;
* corrupted game state.

---

# Adopted Authority Model

For v0.1.x:

```text
Host = Timeout Authority
```

Host responsibilities:

* monitor deadline expiration;
* apply timeout penalties;
* advance turns;
* update room state.

Guest responsibilities:

* display countdown;
* display synchronized state;
* never process timeout penalties.

This guarantees a single authoritative timeout processor.

---

# Timeout Synchronization Flow

```text
Turn Starts
      ↓
Host writes turnDeadline
      ↓
All clients display countdown
      ↓
Deadline reached
      ↓
Host detects expiration
      ↓
Host applies timeout
      ↓
Host writes updated room state
      ↓
Supabase broadcasts update
      ↓
All clients synchronize
```

---

# Multiplayer Race Condition

Testing revealed a race condition during near-deadline submissions.

Example:

```text
Player submits at t = 59.8 s
        ↓
Network latency delays submission
        ↓
Host timer reaches zero
        ↓
Host begins timeout processing
        ↓
Submission arrives moments later
```

Without additional protection:

* incorrect penalties may occur;
* turns may be skipped;
* newer game states may be overwritten.

---

# Turn Version Synchronization

To prevent stale timeout events from corrupting multiplayer state, every active turn maintains a monotonically increasing version number.

Example:

```json
{
    "turnNumber": 17
}
```

Rules:

* every successful submission increments `turnNumber`;
* every timeout transition increments `turnNumber`;
* timeout processing records the observed turn number;
* immediately before committing updates, the host re-fetches the latest room state;
* if the latest turn number differs from the observed value, timeout processing aborts.

Example:

```javascript
const observedTurn = gameState.turnNumber;

const latestRoom = await fetchRoomByCode(roomCode);

if (latestRoom.game_state.turnNumber !== observedTurn) {
    return; // stale timeout event
}
```

---

# Architectural Impact

Turn versioning introduces optimistic concurrency protection into multiplayer state transitions.

This prevents stale timeout events from overwriting newer game states while preserving the existing host-authoritative architecture.

---

# Future Improvements

Future versions may replace host authority with:

* server authority;
* Supabase Edge Functions;
* dedicated game servers.

Additional future work includes:

* server-authoritative turn validation;
* rematch version synchronization;
* leave-game synchronization;
* stale-session detection.

---

# Success Criteria

The synchronization architecture is considered successful when:

1. All players observe the same countdown.
2. Timeout penalties occur exactly once.
3. Turn advancement occurs exactly once.
4. Stale timeout events cannot overwrite newer game states.
5. Multiplayer gameplay remains consistent under normal network conditions.

---

# Version History

## v1.1

* Added turn version synchronization.
* Added stale-timeout protection.
* Introduced optimistic concurrency validation.

## v1.0

Initial multiplayer synchronization architecture based on shared deadlines and host timeout authority.

---

**End of Document**

