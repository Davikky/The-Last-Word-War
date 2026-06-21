# SESSION_PERSISTENCE_AND_RECOVERY_v1_0

## Purpose

Define how The Last Word War™ persists player identity and restores interrupted multiplayer sessions.

---

## Motivation

Browser refreshes, network interruptions, accidental tab closures, and mobile browser suspensions previously resulted in complete loss of the local client session.

The objective of this subsystem is to preserve gameplay continuity while maintaining player control.

---

## Persisted Session Data

The browser stores:

* roomCode
* localPlayerName
* isHost
* hasJoinedLobby

Storage mechanism:

```txt
Browser localStorage
```

---

## Architecture

Session persistence is isolated within:

```txt
src/services/sessionService.js
```

Core functions:

```txt
saveSessionValue()
loadSavedSession()
clearSavedSession()
```

---

## Session Restoration Workflow

Application startup:

1. Display Welcome Screen.
2. Player presses Continue.
3. Application checks for a saved session.
4. If a valid session exists:

   * restore room information,
   * restore player identity,
   * reconnect to Supabase room state.

---

## Session Abandonment

Players may intentionally abandon a session using:

```txt
Start New Play
```

Effects:

* local session storage cleared,
* application state reset,
* player returned to Welcome Screen.

---

## Future Extensions

* explicit Leave Game action,
* host room closure,
* disconnected-player cleanup,
* stale-session detection,
* multi-device session support.

