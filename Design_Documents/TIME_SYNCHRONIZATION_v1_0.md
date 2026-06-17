# The Last Word War

## Time Synchronization v1.0

Author: Victor A. Adeyemi

Status: Approved

Date: 2026-06-18

---

# Purpose

This document defines the multiplayer time synchronization architecture for The Last Word War.

The objective is to ensure all connected players observe the same countdown timer and that timeout events are processed consistently across all clients.

---

# Problem Statement

In the local version of the game, each browser maintains its own timer using local state.

Example:

Player A Browser

Time Remaining: 12 seconds

Player B Browser

Time Remaining: 15 seconds

Because each browser runs its own independent countdown, network latency, browser scheduling, and local processing differences may cause timers to diverge.

This creates several problems:

* Different players observe different remaining times.
* Timeout penalties may be applied inconsistently.
* Multiple clients may attempt to process the same timeout.
* Shared game state may become inconsistent.

This behavior is unacceptable for multiplayer gameplay.

---

# Design Goal

All connected players must observe a synchronized countdown for the active turn.

Timeout penalties must be applied exactly once.

Turn advancement must occur exactly once.

The room state must remain authoritative.

---

# Rejected Approach

## Shared Time Left

Example:

```json
{
  "timeLeft": 42
}
```

This approach requires continuous updates to the backend.

Every second:

42 → 41 → 40 → 39

This generates unnecessary database traffic and increases synchronization complexity.

For these reasons, this approach is rejected.

---

# Adopted Approach

## Shared Turn Deadline

The room stores a deadline rather than a countdown value.

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

The deadline is written once when a turn begins.

Each client independently computes the remaining time.

Example:

```javascript
Math.max(
  0,
  Math.ceil((turnDeadline - Date.now()) / 1000)
);
```

---

# Benefits

The deadline model provides:

* Consistent countdown display
* Minimal network traffic
* Reduced synchronization complexity
* Improved scalability
* Deterministic timeout behavior

The database is updated only when a turn begins or ends.

---

# Timeout Authority

A multiplayer room must have exactly one timeout authority.

If multiple clients process timeouts simultaneously, duplicate penalties may occur.

Example:

Host applies timeout.

Guest applies timeout.

Result:

* Double penalty
* Incorrect scores
* Corrupted game state

---

# Adopted Authority Model

For v0.1.0:

Host = Timeout Authority

Responsibilities:

* Monitor deadline expiration
* Apply timeout penalties
* Advance the turn
* Update room state

Guest clients:

* Display countdown
* Display updated state
* Do not process timeout penalties

This guarantees a single authoritative timeout processor.

---

# Timeout Flow

Turn Starts

↓

turnDeadline written to room state

↓

All clients display countdown

↓

Deadline reached

↓

Host detects expiration

↓

Host applies timeout penalty

↓

Host advances turn

↓

Host writes updated room state

↓

Supabase broadcasts update

↓

All clients synchronize

---

# Room State Requirements

The shared game state should eventually include:

```json
{
  "turnDeadline": 1750250100000
}
```

or equivalent timestamp representation.

Additional fields may be introduced later if needed.

---

# Future Improvements

Future versions may replace host authority with:

* Server authority
* Supabase Edge Functions
* Dedicated game server

These approaches would further reduce the possibility of client-side manipulation.

However, host authority is sufficient for the first remote multiplayer release.

---

# Success Criteria

The implementation is considered successful when:

1. All players observe the same countdown.
2. Timeout penalties occur exactly once.
3. Turn advancement occurs exactly once.
4. Timeout updates synchronize automatically.
5. Multiplayer gameplay remains consistent under normal network conditions.

---

# Version History

## v1.0

Initial multiplayer time synchronization architecture based on shared turn deadlines and host timeout authority.

