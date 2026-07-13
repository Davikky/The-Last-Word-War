# The Last Word War™

## Match Completion Rules v1.0

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

This document defines the exceptional match completion rules for **The Last Word War™**.

Under normal circumstances, matches conclude according to the standard victory procedure defined in:

**VICTORY_CONDITIONS.md**

This document specifies the procedures followed when normal gameplay can no longer continue because multiplayer participation has broken down.

These rules preserve multiplayer continuity while remaining consistent with the project's principles of Computational Facilitation and Human-Governed Gameplay.

---

# Design Objectives

Exceptional match completion rules are designed to:

- preserve meaningful Human ↔ Human interaction whenever possible;
- allow active players to continue participating;
- remove persistently inactive players fairly;
- prevent abandoned matches from remaining indefinitely active;
- maintain computational fairness;
- preserve deterministic match completion.

These rules coordinate gameplay.

They do not interpret gameplay.

---

# Consecutive Timeout

A **consecutive timeout** occurs when a player's turn expires without a valid sentence submission.

Each player maintains an independent consecutive timeout counter.

Timeout counters are never shared between players.

---

# Timeout Counter Reset

Whenever a player successfully completes a turn:

- the player's consecutive timeout counter immediately resets to zero.

Only consecutive timeout penalties contribute toward automatic player removal.

---

# Automatic Inactive Player Removal

## Trigger Condition

A player is automatically removed from the current match after accumulating:

**Three consecutive timeout penalties**

without successfully completing a turn.

---

## Engine Actions

Upon removal, the engine shall:

- remove the player from the active turn rotation;
- preserve the player's score;
- preserve the player's sentence history;
- preserve all completed gameplay records;
- recalculate the turn order for the remaining active players.

The removed player no longer participates in the current match.

---

# Match Continuation

Removing an inactive player does **not** immediately end the match.

Whenever sufficient active players remain, gameplay continues normally according to the official victory procedure.

---

# Exceptional Match Completion

The engine evaluates exceptional completion whenever a player is removed for inactivity.

---

## Condition 1 — One Active Player Remaining

If only one active player remains:

- gameplay immediately concludes;
- the remaining player is declared the winner.

This represents an **Exceptional Match Victory**.

The winner is determined because no further competitive gameplay is possible.

---

## Condition 2 — No Active Players Remaining

If every remaining player becomes inactive:

- gameplay immediately concludes;
- no winner is declared.

The match is officially recorded as:

**Abandoned Due to Inactivity**

---

# Display Messages

## Exceptional Match Victory

Example:

```text
Match concluded.

All other players became inactive.

Victor wins by remaining the only active participant.
```

---

## Match Abandoned

Example:

```text
Match abandoned due to inactivity.

No active players remained.

No winner was declared.
```

---

# Interaction with the Official Victory Procedure

The official order of match completion is:

1. Standard Victory Procedure
2. Final Round
3. Winner Determination
4. Sudden Death
5. Official Draw (if Sudden Death limit is reached)

Exceptional Match Completion is evaluated only when normal gameplay can no longer continue because of player inactivity.

These rules supplement rather than replace the official victory procedure.

---

# Interaction with Sudden Death

Inactive-player removal remains active during Sudden Death.

If only one Sudden Death participant remains active, that player immediately wins through Exceptional Match Victory.

If every remaining Sudden Death participant becomes inactive, the match is abandoned.

---

# Computational Responsibilities

The software is responsible for:

- tracking consecutive timeout counters;
- resetting timeout counters after successful turns;
- removing inactive players;
- recalculating turn order;
- determining exceptional completion conditions;
- preserving gameplay history.

These responsibilities are entirely objective.

---

# Human Responsibilities

Players remain responsible for:

- participating actively;
- communicating with one another;
- deciding whether to begin a rematch;
- preserving the social culture of gameplay.

The software coordinates continuity.

Players create the experience.

---

# Design Rationale

These rules are intentionally conservative.

Rather than ending an entire match because one participant becomes inactive, the engine removes only the persistently inactive player while allowing active participants to continue.

Only when meaningful multiplayer interaction can no longer continue does the engine conclude the match through exceptional completion.

This approach preserves:

- Human ↔ Human interaction;
- Computational Facilitation;
- computational fairness;
- player responsibility;
- multiplayer integrity.

---

# Relationship to Other Documents

This specification should be read together with:

- PROJECT_PHILOSOPHY.md
- PROJECT_STRATEGY.md
- GAMEPLAY_PHILOSOPHY.md
- GDD.md
- GAME_ENGINE.md
- VICTORY_CONDITIONS.md
- SESSION_PERSISTENCE_AND_RECOVERY.md
- REMATCH_AND_ROTATION.md
- The_Last_Word_War_Rulebook.tex

Together these documents define the complete lifecycle of a match from initialization through normal or exceptional completion.

---

# Version History

## Version 1.0

Created following the separation of standard victory conditions from exceptional match completion.

This document now exclusively governs multiplayer integrity, inactive-player removal, and exceptional match completion resulting from player inactivity, while official winners and draws are defined by the Victory Conditions specification.

---

End of Document
