# The Last Word War

## Refactor Plan v0.1.1

Author: Victor A. Adeyemi

Date: 2026-06-18

Status: Planning Document

---

# Purpose

This document defines the stabilization and refactoring plan for version v0.1.1 of The Last Word War.

Version v0.1.0-alpha successfully validated the first complete remote multiplayer match. The objective of v0.1.1 is not to add major new gameplay features, but to improve code organization, maintainability, readability, and scalability.

---

# Background

By v0.1.0-alpha, the project includes:

* Local gameplay
* Final round logic
* Sudden Death logic
* Supabase room creation
* Room joining
* Realtime lobby synchronization
* Online sentence submission
* Online timer synchronization
* Host-authoritative timeout handling
* Online winner synchronization

Most of this logic currently lives inside `App.jsx`.

This was acceptable during rapid prototyping, but it is no longer ideal for long-term development.

---

# Core Refactor Principle

The refactor should not change gameplay behavior.

The goal is:

Same behavior.

Cleaner structure.

Better maintainability.

Refactoring must be done incrementally with testing after each step.

---

# v0.1.1 Primary Goals

## Goal 1: Preserve Functionality

All behavior that worked in v0.1.0-alpha must continue to work.

This includes:

* Room creation
* Room joining
* Lobby entry
* Realtime player synchronization
* Online game start
* Online sentence submission
* Shared countdown
* Online timeout processing
* Final Round
* Sudden Death
* Game Over

---

## Goal 2: Improve Code Organization

Move repeated or logically distinct code out of `App.jsx`.

The long-term objective is to make `App.jsx` primarily responsible for application composition rather than containing all game logic.

---

## Goal 3: Prepare for Future Features

The refactor should make it easier to later add:

* AI referee
* educational modes
* challenge mechanism
* production security hardening
* room expiration
* deployment
* additional UI improvements

---

# Proposed Folder Structure

The planned structure is:

```text
src/
├── components/
├── constants/
├── hooks/
├── lib/
├── services/
├── utils/
├── App.jsx
└── App.css
```

---

# Refactor Phase 1: Constants

Move stable constants into dedicated files.

## Target Files

```text
src/constants/gamePhases.js
src/constants/gameConfig.js
```

## Expected Extractions

From `App.jsx`:

* GAME_PHASES
* default turn duration
* target score
* room-code length
* allowed room-code characters

## Intended Benefit

This reduces hardcoded values inside the application and makes game configuration easier to manage.

---

# Refactor Phase 2: Utility Functions

Move pure helper functions into utility files.

## Target Files

```text
src/utils/roomCode.js
src/utils/standings.js
src/utils/gameState.js
```

## Expected Extractions

* generateRoomCode()
* calculateStandings()
* evaluateOnlineGameState()

## Intended Benefit

These functions do not directly render UI and should be easier to test and reason about independently.

---

# Refactor Phase 3: Supabase Services

Move Supabase database operations into service files.

## Target File

```text
src/services/roomService.js
```

## Expected Extractions

* create room in Supabase
* join room lookup
* load room
* update room game state
* start room game

## Intended Benefit

This separates backend communication from UI logic.

`App.jsx` should not need to know the detailed structure of every Supabase query.

---

# Refactor Phase 4: Components

Move UI sections into reusable components.

## Target Files

```text
src/components/LobbyPanel.jsx
src/components/GamePanel.jsx
src/components/PlayersList.jsx
src/components/WinnerPanel.jsx
src/components/StandingsList.jsx
```

## Expected Extractions

* Lobby UI
* Player list
* Sentence submission panel
* Winner screen
* Final standings

## Intended Benefit

This makes the application easier to read and modify.

Each component should have a clear responsibility.

---

# Refactor Phase 5: Custom Hooks

Move complex stateful logic into hooks only after the simpler extractions are complete.

## Possible Target Files

```text
src/hooks/useRoomSubscription.js
src/hooks/useSharedTimer.js
```

## Expected Extractions

* Supabase realtime room subscription
* shared turn-deadline countdown logic

## Intended Benefit

Hooks will make complex synchronization logic reusable and easier to isolate.

This phase should be done carefully because hooks can be harder to debug if extracted too early.

---

# Refactor Phase 6: Comments and Documentation

Add comments only where they clarify intent or architectural reasoning.

Comments should explain why something exists, not simply repeat what the code already says.

## Good Comment Example

```javascript
// The host is the timeout authority in v0.1.x to prevent duplicate timeout penalties.
```

## Poor Comment Example

```javascript
// Set time left
setTimeLeft(60);
```

---

# Refactor Safety Rules

Each refactor step must follow this cycle:

1. Make one small structural change.
2. Run the application.
3. Perform a focused manual test.
4. Commit the change.
5. Continue to the next extraction.

No large multi-file refactor should be committed without testing.

---

# Required Tests After Refactor

At minimum, the following must still pass:

* Create room
* Join room
* Enter lobby
* Realtime lobby sync
* Host starts online game
* Submit sentence online
* Timeout online
* Final Round
* Sudden Death
* Game Over

---

# What v0.1.1 Should Not Include

v0.1.1 should not introduce major new features such as:

* AI referee
* user accounts
* public matchmaking
* ranking system
* spectator mode
* production deployment

The release should focus on stability and maintainability.

---

# Expected Outcome

After v0.1.1:

* `App.jsx` should be smaller.
* Game constants should be centralized.
* Supabase operations should be separated from UI.
* Core helper functions should be easier to understand.
* Multiplayer synchronization code should be clearer.
* The project should be easier to extend.

---

# Version History

## v0.1.1

Initial stabilization and refactor plan following successful v0.1.0-alpha remote multiplayer validation.

