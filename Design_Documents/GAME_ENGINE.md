# The Last Word War™

## Game Engine Specification v0.3

**Steward:**

Victor A. Adeyemi

**Organization:**

Da-aim Services

**Date:**

2026-07

**Status:**

Active Design Document

---

# Purpose

This document specifies the computational responsibilities of the software engine that powers **The Last Word War™**.

The game engine exists to coordinate multiplayer gameplay by maintaining a consistent shared game state across all participants.

The engine implements the principle of **Computational Facilitation** by providing objective computational services while intentionally avoiding subjective interpretation.

It coordinates gameplay.

Players govern gameplay.

---

# Engine Philosophy

The engine exists to facilitate interaction rather than govern it.

Its purpose is to provide a reliable computational framework that allows human players to interact fairly and consistently.

Whenever a responsibility requires subjective interpretation, that responsibility belongs to the players rather than the software.

---

# Design Objectives

The game engine is designed to provide:

- deterministic game state management;
- reliable multiplayer synchronization;
- computational fairness;
- predictable behaviour;
- fault tolerance;
- scalable architecture;
- maintainable implementation.

The engine intentionally separates computational coordination from human judgment.

---

# Engine Responsibilities

The engine performs objective computational tasks including:

- room creation;
- room joining (before match start);
- player registration;
- match initialization;
- multiplayer synchronization;
- turn management;
- countdown timer management;
- timeout enforcement;
- score tracking;
- automatic last-word extraction;
- sentence history management;
- inactivity tracking;
- inactive-player removal;
- multiplayer integrity enforcement;
- match state transitions;
- winner determination;
- rematch initialization;
- session persistence;
- session recovery.

These responsibilities are deterministic and reproducible.

---

# Engine Non-Responsibilities

The engine intentionally does not:

- judge sentence quality;
- validate grammar;
- determine creativity;
- interpret meaning;
- resolve disagreements;
- enforce house rules;
- determine player intent;
- evaluate humour;
- police loopholes;
- govern gameplay culture.

These responsibilities remain with the participants.

---

# Engine State Model

The engine operates as a finite-state system.

---

## Setup

Players prepare for gameplay.

Allowed operations include:

- create room;
- join room;
- remove player;
- configure match;
- ready players;
- start match.

---

## Active Play

Normal gameplay is in progress.

Allowed operations include:

- receive sentence submission;
- validate objective submission requirements;
- update score;
- extract final word;
- update sentence history;
- advance turn;
- monitor timeout;
- update inactivity counters.

---

## Final Round

Triggered when an active player first reaches the configured target score.

The engine:

- completes the remaining player turns;
- updates scores;
- determines the final standings.

---

## Sudden Death

Triggered only when tied leaders remain after the Final Round.

The engine:

- limits participation to tied leaders;
- continues score tracking;
- determines when a winner has been established according to the configured victory rules.

---

## Game Over

Gameplay has officially concluded.

Available operations include:

- display results;
- preserve match history;
- initiate AI Gameplay Analysis (optional);
- start rematch;
- return to lobby.

---

# Match State Transitions

The normal gameplay lifecycle is:

```text
Setup
    ↓
Active Play
    ↓
Final Round
    ↓
Winner Determination
        │
        ├── Winner
        │      ↓
        │  Game Over
        │
        └── Tie
               ↓
         Sudden Death
               ↓
        Winner Determination
               ↓
           Game Over
```

Exceptional multiplayer integrity events may terminate the match early if normal gameplay can no longer continue.

---

# Multiplayer Integrity

The engine preserves multiplayer continuity through objective computational rules.

These mechanisms exist solely to maintain a playable multiplayer session.

They do not interpret gameplay.

---

## Closed Match

Once gameplay begins:

- no additional players may join the current match;
- existing participants continue until the match concludes or are removed through inactivity.

---

## Player Inactivity

The engine tracks consecutive timeout penalties.

A player who accumulates three consecutive timeout penalties is automatically removed from the current match.

Upon successful completion of a turn:

- the consecutive timeout counter resets to zero.

Upon removal:

- previous scores remain recorded;
- previous sentences remain in history;
- turn order is recalculated automatically.

---

## Exceptional Match Termination

The engine terminates a match when normal gameplay can no longer continue.

This occurs when:

- only one active player remains; or
- every remaining player has become inactive.

Outcomes:

- one remaining active player → winner;
- no remaining active players → abandoned match.

These conditions supplement, rather than replace, the standard victory conditions.

---

# Victory Management

The engine manages objective victory determination.

Default target score:

**10 points**

When the target score is first reached:

1. Final Round begins.
2. Remaining active players complete their turns.
3. Final standings are calculated.
4. If tied leaders remain, Sudden Death begins.
5. Otherwise the winner is declared.

Future versions may support configurable victory parameters.

---

# Computational Fairness

The engine promotes computational fairness by ensuring:

- synchronized state;
- consistent timer behaviour;
- deterministic turn order;
- equal Final Round opportunities;
- reliable score calculation;
- reproducible state transitions.

Fairness of interpretation remains a human responsibility.

---

# AI Integration

Artificial intelligence is intentionally excluded from active gameplay.

Following official match completion, the engine may optionally expose the completed match to an **AI Gameplay Analysis** service.

The engine guarantees that this service:

- operates only after gameplay has concluded;
- cannot modify gameplay results;
- cannot alter the official winner;
- cannot alter the official scoreboard.

The engine remains the authoritative source of gameplay outcomes.

---

# Future Engine Extensions

Potential future engine capabilities include:

- Team Mode;
- Tournament Mode;
- Ranked Play;
- Spectator Mode;
- Educational Analytics;
- Classroom Dashboard;
- Mobile Synchronization;
- Distributed Match Hosting.

Future extensions must preserve the principle of Computational Facilitation.

---

# Relationship to Other Documents
- MATCH_COMPLETION_RULES.md
Th

- PROJECT_PHILOSOPHY.md
- PROJECT_STRATEGY.md
- GAMEPLAY_PHILOSOPHY.md
- GDD.md
- VICTORY_CONDITIONS.md
- INACTIVITY_AND_DRAW_RULES.md
- SESSION_PERSISTENCE_AND_RECOVERY.md
- NETWORK_PLAY_ARCHITECTURE.md
- POST_GAME_ANALYSIS_SPECIFICATION.md
- The_Last_Word_War_Rulebook.tex

Together these documents define the philosophical, architectural, and implementation responsibilities of The Last Word War™.

---

# Version History

## Version 0.1

Initial engine specification.

## Version 0.2

Aligned the engine with Computational Facilitation, Multiplayer Integrity, automatic inactive-player removal, and separation between computational and human responsibilities.

## Version 0.3

Reorganized the document as an architectural specification. Formalized the finite-state engine model, introduced deterministic engine responsibilities, clarified multiplayer integrity, distinguished computational fairness from human judgment, integrated post-game AI Gameplay Analysis, and synchronized the specification with the mature project architecture.

---

End of Document
