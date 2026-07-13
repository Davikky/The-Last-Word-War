# The Last Word War™

## Rematch and Starter Rotation Specification v1.1

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

This document defines the official rematch procedure and starter rotation system used in **The Last Word War™**.

Its purpose is to support repeated matches while preserving fairness across multiple games played by the same group of participants.

The rematch system minimizes unnecessary setup while ensuring that no player permanently benefits from always taking the first turn.

---

# Design Objectives

The rematch system is designed to:

- reduce downtime between matches;
- preserve the existing player group where appropriate;
- eliminate long-term starting-player advantage;
- support repeated casual play;
- support classroom activities;
- support tournament sessions.

---

# Match Eligibility

A rematch may begin after any officially completed match, including:

- Standard Victory;
- Official Draw;
- Exceptional Match Victory;
- Match Abandoned Due to Inactivity.

The previous match must have reached an official completion state before a rematch becomes available.

---

# Quick Rematch

A Quick Rematch begins a new match while preserving the current player roster.

The new match is treated as an entirely independent game.

---

# Match State Reset

The following are reset:

- scores;
- sentence history;
- current word;
- turn number;
- countdown timer;
- winner;
- Final Round state;
- Sudden Death state;
- consecutive timeout counters;
- inactive-player status.

Every new match begins with a clean gameplay state.

---

# Preserved Information

The following are preserved:

- player names;
- player identities;
- player roster;
- room membership;
- room settings (unless modified);
- starter rotation sequence.

Future versions may additionally preserve cumulative match statistics.

---

# Starter Rotation

To eliminate long-term first-player advantage, the starting player rotates after every completed match.

The rotation advances by one position through the player roster.

---

## Example

Players:

1. Victor
2. Sarah
3. Ahmed
4. Grace

---

### Match 1

Starter:

Victor

Turn Order:

```text
Victor → Sarah → Ahmed → Grace
```

---

### Match 2

Starter:

Sarah

Turn Order:

```text
Sarah → Ahmed → Grace → Victor
```

---

### Match 3

Starter:

Ahmed

Turn Order:

```text
Ahmed → Grace → Victor → Sarah
```

---

### Match 4

Starter:

Grace

Turn Order:

```text
Grace → Victor → Sarah → Ahmed
```

---

### Match 5

Starter:

Victor

The rotation repeats.

---

# Rotation After Exceptional Match Completion

Starter rotation is determined by the player roster participating in the new match.

Players removed for inactivity during the previous match may participate in the next match if they remain in the room and choose to continue.

If the player roster changes before the rematch begins, the starter rotation is recalculated using the new roster.

---

# Player Choice

A rematch begins only after the required rematch acceptance conditions have been satisfied.

Players remain free to:

- accept a rematch;
- decline a rematch;
- leave the room;
- join a future match (subject to normal lobby rules).

The rematch system never forces continued participation.

---

# Advantages

The official rematch system:

- minimizes downtime between matches;
- eliminates persistent first-player advantage;
- supports fair repeated play;
- accommodates changing player groups;
- integrates naturally with multiplayer gameplay.

---

# Future Extensions

Future versions may support:

- randomized starter selection;
- tournament seeding;
- team rotation;
- ranked matchmaking;
- cumulative player statistics;
- match history;
- seasonal ladders.

Future extensions should preserve the fairness established by the standard rotation system.

---

# Relationship to Other Documents

This specification should be read together with:

- PROJECT_PHILOSOPHY.md
- PROJECT_STRATEGY.md
- GDD.md
- GAME_ENGINE.md
- VICTORY_CONDITIONS.md
- MATCH_COMPLETION_RULES.md
- SESSION_PERSISTENCE_AND_RECOVERY.md
- The_Last_Word_War_Rulebook.tex

Together these documents define how one officially completed match transitions into the next.

---

# Version History

## Version 1.0

Initial rematch and starter rotation specification.

## Version 1.1

Synchronized with the mature match completion architecture. Removed the obsolete Referee State, integrated Winner, Draw, and Exceptional Match Completion into rematch eligibility, clarified state reset behaviour, formalized roster handling after inactive-player removal, and aligned document references with the updated repository structure.

---

End of Document
