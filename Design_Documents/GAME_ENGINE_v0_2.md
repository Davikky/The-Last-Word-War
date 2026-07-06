# The Last Word War™

## Game Engine Specification v0.2

Steward:

Victor A. Adeyemi

Organization:

Da-aim Services

Date:

2026-07

Status:

Active Design Document

---

# Purpose

This document specifies the computational responsibilities of the game engine used by the digital implementation of The Last Word War™.

The engine coordinates multiplayer gameplay by maintaining a consistent shared game state while intentionally preserving human judgment during play.

The engine facilitates interaction.

Players determine meaning.

---

# Design Principle

The game engine follows the principle of **Computational Facilitation**.

Its responsibility is to coordinate gameplay rather than govern it.

The engine performs objective computational tasks but does not evaluate creativity, grammar, sentence quality, honesty, humour, or interpretation.

These responsibilities remain with the players.

---

# Engine Responsibilities

The engine is responsible for:

* room creation;
* room joining (before match start);
* multiplayer synchronization;
* turn management;
* timeout enforcement;
* score tracking;
* automatic last-word extraction;
* sentence history;
* inactivity tracking;
* automatic removal of inactive players;
* closed-match enforcement;
* victory determination;
* session persistence and recovery.

---

# Non-Responsibilities

The engine intentionally does not:

* judge sentence quality;
* validate grammar;
* determine creativity;
* interpret meaning;
* resolve disagreements;
* enforce house rules;
* determine acceptable gameplay culture.

These remain human responsibilities.

---

# Game States

The engine operates in one of the following states.

## Setup

Players are registering before gameplay begins.

Allowed actions:

* Create room
* Join room
* Remove player
* Configure game
* Start match

---

## Active Play

Normal multiplayer gameplay.

Allowed actions:

* Submit sentence
* Update score
* Advance turn
* Timeout handling
* Sentence recording
* History updates
* Inactivity tracking

---

## Final Round

Triggered when a player reaches the target score.

Allowed actions:

* Complete remaining player turns
* Update scores
* Determine final standings

---

## Sudden Death

Triggered when tied leaders remain after the Final Round.

Allowed actions:

* Continue play among tied players
* Monitor score separation

Victory condition:

Lead by at least two points.

---

## Game Over

Gameplay has concluded.

Allowed actions:

* Display standings
* Review history
* Start rematch
* Return to lobby

---

# Multiplayer Integrity Rules

The engine automatically preserves multiplayer integrity.

## Closed Match

Once gameplay begins:

* no new players may join the current match;
* existing participants continue until the match concludes or are removed through inactivity.

---

## Player Inactivity

A player who accumulates three consecutive timeout penalties is considered inactive.

The engine automatically removes inactive players from the current match.

Upon removal:

* the player's score is preserved;
* previous sentences remain in the match history;
* turn order is recalculated automatically.

A successful turn resets that player's consecutive timeout counter to zero.

---

## Match Termination

The engine terminates a match when either:

* only one active player remains; or
* every remaining player becomes inactive.

If one active player remains, that player is declared the winner.

If no active players remain, the match is declared abandoned due to inactivity.

---

# State Transition Diagram

```
Setup
    ↓
Active Play
    ↓
Final Round
    ↓
Winner Determination
    ↓
Game Over
```

or

```
Setup
    ↓
Active Play
    ↓
Final Round
    ↓
Sudden Death
    ↓
Game Over
```

Player removal due to inactivity may occur during Active Play, Final Round, or Sudden Death without interrupting the current match.

---

# Target Score

Default target score:

**10 points**

Future versions may allow configurable target scores.

---

# Winner Determination

A player reaching the target score does not immediately win the match.

The engine guarantees equal opportunities for all remaining active players by completing the Final Round before determining the winner.

If tied leaders remain, Sudden Death begins.

---

# Relationship to Other Documents

This document should be read together with:

* PROJECT_PHILOSOPHY_v1_2.md
* GAMEPLAY_PHILOSOPHY_v1_0.md
* GDD_v0_2.md
* The_Last_Word_War_Rulebook_v1_1.tex

---

# Future Engine Extensions

Potential future extensions include:

* Team Mode
* Tournament Mode
* Ranked Play
* Spectator Mode
* Educational Analytics
* Classroom Dashboard
* Mobile Synchronization

Future extensions should preserve the principle of Computational Facilitation and avoid replacing human judgment with automated gameplay governance.

---

# Version History

## Version 0.1

Initial engine specification.

## Version 0.2

Updated to align with the Human-Centered Gameplay Philosophy, introducing Computational Facilitation, Multiplayer Integrity Rules, automatic inactive-player removal, closed-match enforcement, and a clear separation between computational and human responsibilities.

---

End of Document
