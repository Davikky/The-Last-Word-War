# REFACTOR_PLAN_v0_1_1

Project: The Last Word War

Version: v0.1.1

Date: 2026-06-19

Status: Planned

---

# Purpose

The current implementation is stable and feature complete for the Alpha phase.

The primary objective of this refactor is to improve maintainability, readability, testability, and future scalability without changing gameplay behavior.

No new gameplay features shall be introduced during this refactor.

---

# Current State

Main application file:

App.jsx

Approximate size:

1350 lines

Current issues:

* Multiple responsibilities in a single file
* Game logic mixed with UI rendering
* Supabase operations mixed with React components
* Increasing difficulty of maintenance
* Increasing risk of regressions

---

# Refactor Principles

1. Preserve behavior.

2. Preserve existing gameplay.

3. Preserve existing multiplayer functionality.

4. Preserve existing game rules.

5. Refactor in small verified steps.

6. Test after every extraction.

---

# Phase 1 — Constants Extraction

Goal:

Move static constants into dedicated files.

Target:

src/constants/

Files:

gamePhases.js

Contents:

* GAME_PHASES

Expected Benefit:

* Cleaner imports
* Reduced App.jsx size
* Centralized constants

Status:

Pending

---

# Phase 2 — Game Logic Extraction

Goal:

Move pure game logic out of App.jsx.

Target:

src/utils/gameLogic.js

Candidate Functions:

* calculateStandings()
* evaluateOnlineGameState()
* determineWinner()
* helper functions

Expected Benefit:

* Easier testing
* Cleaner component code
* Separation of logic and presentation

Status:

Pending

---

# Phase 3 — Service Layer Extraction

Goal:

Separate Supabase operations from UI.

Target:

src/services/

Files:

roomService.js

Candidate Functions:

* createRoom()
* joinRoom()
* loadRoom()
* updateRoomState()
* room synchronization helpers

Expected Benefit:

* Cleaner networking layer
* Easier backend replacement
* Reduced App.jsx complexity

Status:

Pending

---

# Phase 4 — Component Extraction

Goal:

Split major UI sections into reusable React components.

Target:

src/components/

Candidate Components:

LandingPage.jsx

Lobby.jsx

PlayerList.jsx

GameBoard.jsx

WinnerPanel.jsx

NotificationBanner.jsx

Expected Benefit:

* Smaller files
* Easier maintenance
* Easier feature expansion

Status:

Pending

---

# Phase 5 — Custom Hooks

Goal:

Extract reusable React state logic.

Target:

src/hooks/

Candidate Hooks:

useRoomSync.js

useGameTimer.js

useNotifications.js

Expected Benefit:

* Cleaner state management
* Improved separation of concerns

Status:

Pending

---

# Success Criteria

The refactor shall be considered successful when:

* Gameplay remains unchanged.
* Multiplayer behavior remains unchanged.
* Playtest results remain unaffected.
* App.jsx is reduced below 400 lines.
* All existing tests pass.

---

# Non-Goals

The following are explicitly excluded from this refactor:

* New game modes
* AI referee
* Educational modes
* Tournament mode
* Spectator mode
* Gameplay rule changes

These items belong to future releases.

---

# End State

Target Structure

src/

├── components/

├── constants/

├── hooks/

├── services/

├── utils/

└── App.jsx

App.jsx becomes a coordinator rather than the location of all game logic.

---

End of Document

