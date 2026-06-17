# The Last Word War

## Game Engine Specification v0.1

Author: Victor A. Adeyemi

Date: 2026-06-17

---

# Purpose

This document describes the internal game-state transitions used by the digital implementation of The Last Word War.

---

# Game States

The game operates in one of the following states:

## Setup

Players are being registered.

Allowed actions:

* Add player
* Remove player
* Configure game

---

## Active Play

Normal gameplay.

Allowed actions:

* Submit sentence
* Update score
* Timeout
* View history

---

## Final Round

Triggered when any player reaches the target score.

Allowed actions:

* Continue remaining turns
* Update scores
* Determine final standings

---

## Sudden Death

Triggered when tied players remain after Final Round.

Allowed actions:

* Continue gameplay among tied players
* Determine score separation

Victory condition:

Lead by at least 2 points.

---

## Game Over

Winner determined.

Allowed actions:

* View results
* Start new game

---

# State Transition Diagram

Setup
↓
Active Play
↓
Final Round
↓
Winner Determination
↓
Game Over

or

Setup
↓
Active Play
↓
Final Round
↓
Tie
↓
Sudden Death
↓
Game Over

---

# Target Score

Default:

10 points

Configurable in future releases.

---

# Winner Logic

Winner is not determined immediately when a player reaches the target score.

All players must receive equal turns.

Winner determination occurs only after completion of the Final Round.

---

# Future Enhancements

* Team mode
* Tournament mode
* Ranked mode
* AI referee
* Multiplayer networking

