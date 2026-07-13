# The Last Word War™

## Session Persistence and Recovery Specification v1.1

**Steward:**

Victor A. Adeyemi

**Organization:**

Da-aim Services

**Status:**

Approved Design Specification

**Date:**

2026-07

---

# Purpose

This document defines how **The Last Word War™** preserves player identity and restores interrupted multiplayer sessions.

The objective is to maximize gameplay continuity while ensuring that the authoritative game state remains consistent across all connected players.

Session persistence restores the player's connection to an existing match.

It does not modify the official match state.

---

# Design Objectives

The session persistence subsystem is designed to:

- preserve player identity;
- minimize disruption caused by accidental disconnections;
- restore participation whenever possible;
- prevent duplicate player identities;
- maintain multiplayer integrity;
- preserve the authoritative game state.

---

# Motivation

Players may temporarily disconnect because of:

- browser refreshes;
- accidental tab closure;
- mobile browser suspension;
- temporary network interruption;
- application restart.

Without session persistence, these events unnecessarily interrupt gameplay and degrade the multiplayer experience.

---

# Persistence Model

The architecture distinguishes between:

## Local Session State

Stored on the player's device.

Used only to restore the player's local identity and connection information.

---

## Shared Match State

Stored by the multiplayer backend.

Represents the authoritative state of the current match.

The shared match state always takes precedence over locally stored information.

---

# Persisted Local Session Data

The browser stores information such as:

- roomCode;
- localPlayerName;
- playerIdentifier;
- isHost;
- hasJoinedLobby.

Current storage mechanism:

```text
Browser localStorage
```

Future implementations may support more advanced persistence mechanisms.

---

# Session Service

Session persistence is isolated within:

```text
src/services/sessionService.js
```

Current responsibilities include:

- saveSessionValue()
- loadSavedSession()
- clearSavedSession()

Future implementations may extend this service without affecting gameplay logic.

---

# Session Restoration Workflow

When the application starts:

1. Display the Welcome Screen.
2. The player selects **Continue**.
3. The application checks for an existing local session.
4. If a saved session exists:
   - restore the player's local identity;
   - reconnect to the multiplayer backend;
   - retrieve the authoritative shared match state;
   - synchronize the local client with the current match.

Only the authoritative shared state determines the current progress of gameplay.

---

# Session Validation

Before restoring a session, the client should verify that:

- the room still exists;
- the match remains active;
- the player identity remains valid;
- the player has not already been replaced or removed.

If validation fails, normal application startup continues.

---

# Session Recovery

Successful recovery restores:

- player identity;
- room membership;
- current game phase;
- active turn information;
- current scores;
- sentence history.

Gameplay resumes from the current authoritative state.

---

# Session Abandonment

Players may intentionally abandon their locally stored session.

Current interface:

```text
Start New Play
```

Upon abandonment:

- local session data is cleared;
- application state is reset;
- the player returns to the Welcome Screen.

Abandoning a local session does not modify the shared multiplayer state.

---

# Failure Handling

If session restoration cannot be completed successfully, the application should:

- discard invalid local session data;
- return the player to the normal startup flow;
- allow the player to create or join another room.

The application should fail gracefully without corrupting the shared game state.

---

# Computational Responsibilities

The session persistence subsystem is responsible for:

- storing local session information;
- restoring local player identity;
- reconnecting clients;
- validating saved sessions;
- synchronizing with the authoritative multiplayer state;
- clearing obsolete session data.

The subsystem does not determine gameplay outcomes.

---

# Future Extensions

Potential future enhancements include:

- explicit Leave Game functionality;
- host-controlled room closure;
- disconnected-player cleanup;
- stale-session expiration;
- multi-device session support;
- authenticated player accounts;
- cloud-backed player profiles.

Future extensions should continue to preserve multiplayer integrity while minimizing disruption to gameplay.

---

# Relationship to Other Documents

This specification should be read together with:

- PROJECT_PHILOSOPHY.md
- GDD.md
- GAME_ENGINE.md
- NETWORK_PLAY_ARCHITECTURE.md
- NETWORK_PLAY_SPECIFICATION.md
- MATCH_COMPLETION_RULES.md
- REMATCH_AND_ROTATION.md

Together these documents define how multiplayer sessions are established, maintained, recovered, and concluded.

---

# Version History

## Version 1.0

Initial session persistence specification.

## Version 1.1

Expanded the document into a complete architectural specification. Distinguished local session state from authoritative shared match state, formalized validation and recovery workflows, clarified subsystem responsibilities, improved failure handling, and synchronized the specification with the mature multiplayer architecture.

---

End of Document
