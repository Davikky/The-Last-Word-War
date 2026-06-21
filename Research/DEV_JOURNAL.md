# DEVELOPMENT_JOURNAL

Project: The Last Word War™

Steward:

Victor A. Adeyemi

Organization:

Da-aim Services

Status:

Active

Purpose:

This journal records major development milestones, architectural decisions, implementation lessons, playtesting outcomes, and project evolution.

The journal serves as:

* Development record
* Research evidence source
* Publication support material
* Historical archive

---

# Journal Entry Format

Each entry should contain:

* Date
* Milestone
* Completed Work
* Validation Results
* Lessons Learned
* Architectural Decisions
* Next Goals

---

# 2026-06-18

Milestone:

v0.1.0-alpha Public Deployment

Status:

Completed

## Completed

* Public Vercel deployment
* Remote multiplayer validation
* Shared countdown synchronization
* Shared timeout synchronization
* Victory synchronization
* Mobile browser validation
* Landing-page redesign
* History panel redesign
* Online/local flow cleanup
* Mobile UI fixes
* Current-word synchronization bug fix

## Validation Results

* Successful public deployment
* Successful remote multiplayer validation
* Mobile browser compatibility confirmed

## Lessons Learned

* Multiplayer state synchronization requires explicit updates.
* Mobile browsers may override CSS colors unexpectedly.
* UX issues become visible only after real gameplay testing.
* Public deployment accelerates discovery of usability problems.

## Architectural Decisions

* Shared timer architecture retained.
* Host-authoritative synchronization retained.
* Public deployment adopted as a primary validation mechanism.

## Next Goals

* Feedback collection system
* External playtesting
* v0.1.1 refactor
* Component extraction
* AI referee groundwork

---

# 2026-06-18

Milestone:

v0.1.0-alpha Remote Multiplayer Completion

Status:

Completed

## Completed

* Supabase project setup
* Rooms table creation
* Row Level Security enabled
* Temporary development policies added
* React Supabase client configured
* Room creation
* Room joining
* Lobby entry
* Realtime lobby synchronization
* Host-controlled online game start
* Online sentence submission synchronization
* Shared score synchronization
* Shared current word synchronization
* Shared sentence history synchronization
* Shared turn deadline countdown
* Host-controlled online timeout synchronization
* Online final round synchronization
* Online sudden death synchronization
* Online winner determination
* Full remote match integration test
* v0.1.0-alpha release tag

## Validation Results

* Two browser sessions joined the same room successfully.
* Remote multiplayer gameplay completed successfully.
* Scores, turns, timers, sentence history, and winner state synchronized correctly.

## Bug Found and Resolved

Issue:

Online game completion did not initially synchronize correctly.

Root Cause:

Missing synchronization of:

* finalStandings
* suddenDeathPlayerNames
* finalRoundStarterIndex

Resolution:

Added missing room-state loading and realtime synchronization fields.

## Lessons Learned

* Supabase can support early room-based multiplayer architecture.
* Realtime synchronization requires complete shared-state loading.
* Multiplayer timers should rely on shared deadlines.
* Host-authoritative timeout processing prevents duplicate penalties.
* Integration testing is essential after connecting independent systems.

## Architectural Decisions

* Shared turnDeadline architecture adopted.
* Host-authority model retained.
* Supabase retained as multiplayer backend.

## Next Goals

* v0.1.1 stabilization
* Refactor App.jsx
* Extract constants
* Extract room services
* Extract reusable UI components
* Improve maintainability

---

# 2026-06-17

Milestone:

v0.0.6 Foundation Prototype

Status:

Completed

## Completed

* Repository setup
* Rulebook archive
* Game Design Document
* MVP specification
* React application setup
* Player registration
* Sentence submission
* Word extraction
* Rule validation
* Sentence history
* Manual referee scoring
* Countdown timer
* Timeout penalty

## Lessons Learned

* React state management fundamentals
* useState
* useEffect
* Git workflow
* Git commits
* Git tags
* Vite development workflow

## Architectural Decisions

* React selected as frontend framework.
* Vite selected as development environment.
* Git-based versioning adopted.

## Next Goals

* Game over conditions
* Elimination mode
* Challenge system
* Automatic validation
* AI referee exploration

---

# Development Themes

Recurring themes observed throughout development:

* Human-centered design
* Multiplayer synchronization
* Playtest-driven iteration
* Documentation-first development
* Incremental architecture refinement
* Human-guided AI-assisted development

---

# Long-Term Purpose

This journal exists to preserve the evolution of The Last Word War™ as both:

* A multiplayer conversational platform
* A human-centered AI research initiative

under the Da-aim Services research and development ecosystem.

---

Observation:

Multiple playtest participants expected an AI opponent or single-player mode.

Interpretation:

Contemporary users increasingly assume Human ↔ AI interaction as the default digital experience.

Action Taken:

A Human-Centered Welcome Screen was introduced to explicitly communicate the philosophy and multiplayer requirements of The Last Word War™.
---

## Known Issue: Race Condition Between Late Submission and Host Timeout

**Date Identified:** 2026-06-21

### Description

A race condition has been observed in online multiplayer mode when a player submits a sentence very close to the timeout deadline.

Current architecture relies on the host client to enforce timeouts. Under certain network conditions, a valid submission may be delayed in transit while the host simultaneously processes a timeout event.

### Example Scenario

1. Player 1 is the active player.
2. Player 1 submits a valid sentence at approximately `t = 59.8 s`.
3. Due to network latency, the submission arrives at Supabase after the host timer reaches zero.
4. The host processes a timeout and advances the turn to Player 2.
5. The delayed submission from Player 1 is subsequently processed.
6. The game state becomes inconsistent:

   * Player 2 may lose a turn unfairly.
   * Incorrect timeout penalties may be applied.
   * Turn order may become corrupted.
   * The wrong player may be penalized.

### Severity

**HIGH PRIORITY**

This issue affects competitive fairness and game-state correctness.

### Root Cause

The current implementation lacks a mechanism for distinguishing stale timeout events from already-resolved turns.

Timeout processing and sentence submission operate independently and may update the room state concurrently.

### Proposed Long-Term Solution

Introduce a monotonically increasing `turnNumber` (or `stateVersion`) field within `game_state`.

Example:

```javascript
{
    currentPlayerIndex: 0,
    turnNumber: 17
}
```

Rules:

* Every successful submission increments `turnNumber`.
* Every timeout event increments `turnNumber`.
* Before applying a timeout update, the host must verify that the observed `turnNumber` still matches the latest room state.
* If the version has changed, abort timeout processing because another event has already advanced the game.

Pseudo-code:

```javascript
const observedTurn = gameState.turnNumber;

const latestRoom = await fetchRoomByCode(roomCode);

if (latestRoom.game_state.turnNumber !== observedTurn) {
    return; // stale timeout event
}
```

### Interim Mitigation

A short timeout grace window (e.g., 3 seconds) may reduce the probability of unfair penalties but does not completely eliminate this race condition.

### Future Work

Implement server-authoritative turn versioning in a dedicated branch:

`hotfix-turn-versioning-v0.1.1`


## Known Issue: Duplicate or Confusingly Similar Player Names

**Date Identified:** 2026-06-21

### Description

Online multiplayer currently allows players to join a room using identical or very similar display names.

This can create confusion during play because player names are used throughout the interface for turn ownership, sentence history, timeout notifications, Sudden Death resolution, and winner display.

### Example Scenario

If two players join as:

- `Victor`
- `victor`
- `Victor A.`
- `Victo r`

players may struggle to identify whose turn it is or who received a penalty.

### Severity

**MEDIUM-HIGH**

This does not necessarily corrupt game state, but it can significantly affect gameplay clarity and fairness.

### Proposed Solution

Reject duplicate or confusingly similar player names during lobby entry.

Initial implementation should normalize names before comparison by:

- trimming whitespace
- converting to lowercase
- collapsing repeated spaces

Future implementation may also detect very close names using stricter similarity checks.

### Suggested Branch

`hotfix-unique-player-names-v0.1.1`

End of Document

