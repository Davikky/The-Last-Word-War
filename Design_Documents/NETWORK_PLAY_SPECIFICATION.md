# The Last Word War™

## Network Play Specification v1.1

**Steward:**

Victor A. Adeyemi

**Organization:**

Da-aim Services

**Status:**

Architectural Design Specification

**Date:**

2026-07

---

# Purpose

This document specifies the network communication model used by **The Last Word War™**.

It defines how clients, the multiplayer backend, and the game engine cooperate to maintain a synchronized multiplayer experience while preserving a single authoritative game state.

This document complements the higher-level **Network Play Architecture** by describing the operational behaviour of the networking subsystem.

---

# Design Objectives

The networking specification is designed to:

- support reliable remote multiplayer gameplay;
- maintain a single authoritative game state;
- synchronize all connected players;
- tolerate temporary network interruptions;
- preserve multiplayer integrity;
- remain scalable for future multiplayer expansion.

---

# Network Philosophy

The networking subsystem exists to facilitate communication between participants.

It does not participate in gameplay interpretation.

The networking layer transports state.

The game engine manages state.

Players govern gameplay.

---

# Minimum Viable Online Experience

The first online implementation supports:

- remote multiplayer gameplay;
- room-based sessions;
- real-time synchronization;
- authoritative shared game state;
- session recovery.

The MVP intentionally excludes:

- public matchmaking;
- authenticated user accounts;
- ranked play;
- friends lists;
- integrated chat.

---

# Communication Model

The networking model follows a client–server architecture.

```text
Client
    │
    ▼
Backend
    │
    ▼
Game Engine
    │
    ▼
Backend
    │
    ▼
Connected Clients
```

Every gameplay event passes through the authoritative backend.

Clients never communicate gameplay state directly to one another.

---

# Room Lifecycle

## Room Creation

The host creates a room.

The backend initializes:

- unique room identifier;
- shared game state;
- lobby state;
- host designation.

---

## Room Joining

A player joins by providing a valid room code.

Upon successful validation:

- player identity is registered;
- player list is synchronized;
- lobby state is synchronized;
- current room information is transmitted.

Once gameplay begins:

**No additional players may join the current match.**

---

## Match Start

When all required participants are present:

- the host initiates the match;
- the backend transitions the room into Active Play;
- clients synchronize to the new game state.

---

# Shared Game State

The authoritative shared state includes:

- player roster;
- active player list;
- scores;
- current player;
- current required word;
- sentence history;
- countdown timer;
- game phase;
- Final Round state;
- Sudden Death state;
- multiplayer integrity state;
- winner;
- match outcome.

Every client observes the same authoritative state.

---

# Client Responsibilities

Clients are responsible for:

- presenting the user interface;
- collecting player input;
- submitting gameplay actions;
- displaying synchronized state;
- reconnecting after temporary interruptions.

Clients never determine gameplay outcomes independently.

---

# Backend Responsibilities

The backend is responsible for:

- maintaining authoritative room state;
- synchronizing connected clients;
- validating network events;
- storing persistent match data;
- broadcasting state changes;
- supporting session recovery.

---

# Engine Interaction

The networking layer communicates with the game engine whenever gameplay events occur.

Typical event flow:

```text
Player Action
        ↓
Client
        ↓
Backend
        ↓
Game Engine
        ↓
Updated Game State
        ↓
Backend
        ↓
Connected Clients
```

The engine remains the authoritative source of gameplay decisions.

---

# Player Disconnect Handling

## Temporary Disconnect

When a player temporarily disconnects:

- connection status is updated;
- gameplay follows the configured timeout behaviour;
- the player may reconnect through session restoration.

---

## Session Recovery

Upon reconnection:

- player identity is restored;
- local session is validated;
- authoritative match state is retrieved;
- client synchronization resumes.

Gameplay always resumes from the authoritative shared state.

---

## Permanent Loss of Participation

If a player remains inactive, gameplay proceeds according to:

**MATCH_COMPLETION_RULES.md**

The networking subsystem reports connectivity.

The game engine determines gameplay consequences.

---

# Security Principles

The networking architecture protects against:

- unauthorized room access;
- state manipulation;
- score manipulation;
- timer manipulation;
- invalid gameplay events.

The backend remains the authoritative source of truth.

---

# Network Events

Typical gameplay events include:

- room creation;
- room join;
- player ready;
- match start;
- sentence submission;
- turn completion;
- timeout;
- player disconnect;
- player reconnect;
- state synchronization;
- match completion;
- rematch request.

Future implementations may expand the event model without changing the underlying architecture.

---

# AI Integration

Artificial intelligence is intentionally excluded from active network gameplay.

Following official match completion, completed match data may optionally be provided to the **AI Gameplay Analysis** subsystem.

This analysis:

- operates independently of gameplay;
- cannot modify the shared game state;
- cannot alter gameplay outcomes.

---

# Future Extensions

Potential future networking capabilities include:

- authenticated accounts;
- classroom management;
- tournament rooms;
- spectator mode;
- distributed hosting;
- regional servers;
- cloud match history;
- educational analytics.

Future enhancements must preserve Computational Facilitation and Human-Governed Gameplay.

---

# Success Criteria

The networking subsystem is considered successful when:

- remote players complete full matches;
- authoritative synchronization is maintained;
- gameplay continuity is preserved;
- session recovery functions correctly;
- multiplayer integrity remains intact.

---

# Relationship to Other Documents

This specification should be read together with:

- PROJECT_PHILOSOPHY.md
- GDD.md
- GAME_ENGINE.md
- NETWORK_PLAY_ARCHITECTURE.md
- SESSION_PERSISTENCE_AND_RECOVERY.md
- MATCH_COMPLETION_RULES.md
- POST_GAME_ANALYSIS_SPECIFICATION.md

Together these documents define the complete multiplayer networking model for The Last Word War™.

---

# Version History

## Version 1.0

Initial network play specification.

## Version 1.1

Synchronized with the mature multiplayer architecture. Removed AI referee integration, formalized client/backend/game engine responsibilities, introduced authoritative event flow, integrated session recovery and multiplayer integrity, and aligned the specification with Computational Facilitation and Human-Governed Gameplay.

---

End of Document
