# The Last Word War™

## Network Play Architecture v1.2

**Steward:**

Victor A. Adeyemi

**Organization:**

Da-aim Services

**Status:**

Implementation Architecture Document

**Date:**

2026-07

---

# Purpose

This document defines the multiplayer networking architecture of **The Last Word War™**.

Its purpose is to specify how multiple clients participate in a shared match while maintaining a single authoritative game state.

The network architecture implements the project's principle of **Computational Facilitation** by ensuring reliable synchronization without participating in gameplay interpretation.

---

# Architectural Objectives

The multiplayer architecture is designed to:

- synchronize all connected players;
- preserve a single authoritative game state;
- support reliable remote gameplay;
- tolerate temporary client disconnections;
- minimize network complexity;
- remain scalable for future multiplayer features.

---

# Network Philosophy

The multiplayer network coordinates interaction.

It does not govern interaction.

Responsibilities requiring subjective interpretation remain entirely with the players.

The network is responsible only for reliable communication and synchronization.

---

# MVP Objective

The first remote multiplayer milestone establishes the minimum viable online experience.

Success is defined as:

> Multiple remote human players can complete a full match through a shared online room without requiring user accounts.

Although the initial implementation targets two-player testing, the architecture is designed to support additional players.

---

# Initial Player Flow

```text
Application Launch
        ↓
Welcome Screen
        ↓
Landing Page
        ↓
Create Room
        │
        └───────┐
                │
          Share Room Code
                │
                ▼
           Join Room
                ▼
             Lobby
                ▼
          Match Begins
```

---

# Room Creation

When the host selects:

```text
Create Room
```

the system creates:

- unique room code;
- initial room state;
- host player registration;
- multiplayer session.

Example:

```text
Room Code: XJ72K
```

---

# Room Joining

A player joins an existing room by entering a valid room code.

If the room is available:

- player identity is registered;
- player joins the lobby;
- shared room state is synchronized.

Once gameplay has begun:

**No additional players may join the current match.**

This preserves multiplayer integrity.

---

# Lobby Architecture

Before gameplay begins, the lobby maintains:

- room code;
- player roster;
- host designation;
- ready status;
- game configuration;
- start controls.

The lobby exists only during the Setup phase.

---

# Shared Match State

The authoritative shared state includes:

- player roster;
- active players;
- scores;
- current turn;
- current required word;
- sentence history;
- countdown timer;
- game phase;
- Final Round state;
- Sudden Death state;
- multiplayer integrity state;
- winner;
- match outcome.

Every connected client observes the same authoritative state.

---

# Authoritative State Model

The backend is the authoritative source of truth.

Clients:

- display state;
- submit player actions;
- synchronize updates.

Clients never independently determine:

- scores;
- winners;
- turn order;
- timers;
- match outcomes.

This prevents divergence between participants.

---

# Synchronization Model

Whenever the authoritative state changes:

1. Engine updates shared state.
2. Backend persists the update.
3. Connected clients receive the update.
4. Local interfaces synchronize automatically.

Synchronization is event-driven rather than client-driven.

---

# Session Recovery

If a client disconnects temporarily:

- local identity is restored;
- connection is re-established;
- authoritative match state is retrieved;
- gameplay resumes from the current shared state.

Session recovery never reconstructs gameplay from local assumptions.

---

# Recommended Technology

Current implementation target:

**Supabase Realtime**

Reasons include:

- integrated database;
- realtime synchronization;
- simplified deployment;
- room-based architecture;
- low operational overhead;
- rapid MVP development.

Future implementations may adopt alternative networking technologies without changing the gameplay architecture.

---

# Network Responsibilities

The networking subsystem is responsible for:

- room communication;
- state synchronization;
- connection management;
- player registration;
- session restoration;
- message delivery;
- backend persistence.

The networking subsystem intentionally avoids gameplay interpretation.

---

# Out of Scope

The current multiplayer architecture intentionally excludes:

- user accounts;
- public matchmaking;
- ranked matchmaking;
- social profiles;
- friends lists;
- integrated chat;
- cross-platform accounts;
- voice communication.

These capabilities may be introduced in future versions if supported by project objectives and community demand.

---

# MVP Success Criteria

The initial multiplayer milestone is considered successful when:

1. a host can create a room;
2. remote players can join using a room code;
3. all connected players observe synchronized state;
4. turns progress correctly;
5. gameplay reaches official completion;
6. every client displays the same final outcome.

---

# Future Extensions

Potential future enhancements include:

- authenticated player accounts;
- classroom room management;
- tournament infrastructure;
- spectator mode;
- distributed hosting;
- regional multiplayer servers;
- cloud match history;
- educational analytics.

Future extensions must preserve the principles of Computational Facilitation and Human-Governed Gameplay.

---

# Relationship to Other Documents

This specification should be read together with:

- PROJECT_PHILOSOPHY.md
- PROJECT_STRATEGY.md
- GDD.md
- GAME_ENGINE.md
- SESSION_PERSISTENCE_AND_RECOVERY.md
- NETWORK_PLAY_SPECIFICATION.md
- MATCH_COMPLETION_RULES.md

Together these documents define how multiplayer gameplay is established, synchronized, maintained, and concluded.

---

# Version History

## Version 1.0

Initial multiplayer networking concept.

## Version 1.1

Introduced the Supabase-based room architecture for the first remote multiplayer milestone.

## Version 1.2

Synchronized the network architecture with the mature project design. Formalized the authoritative state model, integrated session recovery and multiplayer integrity, removed obsolete AI referee references, generalized the architecture beyond the initial two-player MVP, and aligned terminology with the Game Engine and Session Persistence specifications.

---

End of Document
