# INACTIVITY_AND_DRAW_RULES_v1_0

Project: The Last Word War

Version: 1.0

Status: Approved for Implementation

Date: 2026-06-19

---

# Purpose

The Last Word War is fundamentally a game of human interaction.

The objective is not merely to accumulate points, but to encourage meaningful exchanges built upon the previous last word.

To preserve gameplay flow and prevent matches from continuing indefinitely, inactivity and prolonged deadlock conditions require explicit termination rules.

This document defines those conditions.

---

# Rule 1 — Inactivity Termination

## Description

A match shall automatically terminate if players collectively fail to provide valid responses for an extended period.

## Definition

A consecutive timeout occurs when a player's turn expires without a valid sentence submission.

A valid sentence submission immediately resets the inactivity counter.

## Trigger Condition

The match ends automatically after:

5 consecutive timeouts

with no successful sentence submission occurring between them.

## Result

The game enters:

GAME_OVER

with:

Winner = None

## Display Message

Example:

Match ended due to inactivity.

No winner was declared.

## Rationale

This prevents abandoned matches from remaining active indefinitely.

---

# Rule 2 — Sudden Death Draw Resolution

## Description

Sudden Death exists to resolve ties among leading players.

However, equally skilled participants may continue producing valid responses indefinitely.

A hard limit is therefore required.

## Definition

A Sudden Death Round is completed when every active Sudden Death participant has received one turn opportunity.

Timeouts continue to function normally during Sudden Death.

## Trigger Condition

If:

Sudden Death Round Count >= 5

and

No player has achieved the required victory condition

then Sudden Death ends immediately.

## Result

The game enters:

GAME_OVER

with:

Winner = None

and

Draw Players = Remaining Sudden Death Participants

---

# Draw Declaration

Example:

Sudden Death ended in a draw.

Players:

Oasis

Davikky

---

# Round Definition

## Two Players

Round 1:

Player A → Player B

Round 2:

Player A → Player B

Round 3:

Player A → Player B

Round 4:

Player A → Player B

Round 5:

Player A → Player B

A total of 10 turn opportunities have occurred.

If no player achieves the required winning lead after Round 5, the match is declared a draw.

---

## Three Players

Round 1:

Player A → Player B → Player C

Round 2:

Player A → Player B → Player C

Round 3:

Player A → Player B → Player C

Round 4:

Player A → Player B → Player C

Round 5:

Player A → Player B → Player C

A total of 15 turn opportunities have occurred.

If no player achieves the required winning lead after Round 5, the match is declared a draw.

---

# Two-Player Example

Suppose:

Oasis = 18

Davikky = 18

Both enter Sudden Death.

After:

5 Sudden Death Rounds

if neither achieves the required winning margin,

then:

Game Over

Draw declared between:

Oasis

Davikky

---

# Three-Player Example

Suppose:

Player A = 15

Player B = 15

Player C = 15

All three enter Sudden Death.

After:

5 Sudden Death Rounds

if no participant establishes the required lead,

then:

Game Over

Draw declared among:

Player A

Player B

Player C

---

# Priority Order

Game termination conditions shall be evaluated in the following order:

1. Normal Winner Determination

2. Final Round Winner Determination

3. Sudden Death Winner Determination

4. Inactivity Termination

5. Sudden Death Draw Resolution

A valid winner always takes precedence over a draw.

---

# Design Philosophy

These rules are intentionally designed to prevent endless matches while preserving the human-centered nature of the game.

Players should leave a match with a sense of completion rather than exhaustion.

The goal is not to force a winner at all costs, but to ensure that meaningful interaction reaches a natural conclusion.

A draw is considered a valid and respectable outcome when equally matched participants remain inseparable after multiple complete Sudden Death rounds.

---

End of Document

