# Development Journal

## 2026-06-17

Milestone: v0.0.6

Completed:

- Repository setup
- Rulebook archive
- Game Design Document
- MVP specification
- React application setup
- Player registration
- Sentence submission
- Word extraction
- Rule validation
- Sentence history
- Manual referee scoring
- Countdown timer
- Timeout penalty

Lessons Learned:

- React state management
- useState
- useEffect
- Git commits
- Git tags
- Vite development workflow

Next Goals:

- Game over conditions
- Elimination mode
- Challenge system
- Automatic validation
- AI referee



---

## 2026-06-18

Milestone: v0.1.0-alpha

Completed:

- Supabase project setup
- Rooms table creation
- Row Level Security enabled
- Temporary development policies added
- React Supabase client configured
- Room creation
- Room joining
- Lobby entry
- Realtime lobby synchronization
- Host-controlled online game start
- Online sentence submission synchronization
- Shared score synchronization
- Shared current word synchronization
- Shared sentence history synchronization
- Shared turn deadline countdown
- Host-controlled online timeout synchronization
- Online final round synchronization
- Online sudden death synchronization
- Online winner determination
- Full remote match integration test
- v0.1.0-alpha release tag

Validated:

- Two browser sessions can join the same room.
- Two remote players can complete a synchronized match.
- Scores, turns, timer, sentence history, and winner state synchronize through Supabase.
- The project has crossed from local prototype to remote multiplayer prototype.

Bug Found and Fixed:

- Online game completion did not initially synchronize correctly.
- Root cause: missing synchronization of finalStandings, suddenDeathPlayerNames, and finalRoundStarterIndex.
- Resolution: added missing room-state loading and realtime synchronization fields.

Lessons Learned:

- Supabase can serve as the first backend for room-based multiplayer.
- Realtime synchronization requires complete shared-state loading.
- Multiplayer timers should use a shared turnDeadline instead of independent local countdowns.
- Host-authoritative timeout processing prevents duplicate timeout penalties.
- Integration testing is necessary after connecting multiple working features.

Next Goals:

- v0.1.1 stabilization
- Refactor App.jsx
- Extract constants
- Extract Supabase room services
- Extract reusable UI components
- Add meaningful architectural comments
- Remove temporary or redundant code
- Improve maintainability before adding major new features
