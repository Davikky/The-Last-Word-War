# The Last Word War™

## Official Victory Conditions v1.1

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

This document defines the official victory conditions for **The Last Word War™**.

Its purpose is to establish a fair, deterministic, and scalable procedure for determining the outcome of every match conducted under normal gameplay conditions.

This document specifies **how a match is won or drawn**.

Exceptional match completion resulting from player inactivity is specified separately in **MATCH_COMPLETION_RULES.md**.

---

# Design Objectives

The official victory system is designed to:

- provide equal opportunities for all active players;
- eliminate first-player advantage;
- remain simple to understand;
- scale naturally to any number of players;
- produce engaging endgame scenarios;
- support casual, educational, tournament, and online play.

---

# Definitions

## Turn

A turn occurs when an active player receives the opportunity to submit a sentence according to the current game rules.

---

## Round

A round consists of one completed turn for every active player.

Example (Four Players)

```text
Player A
    ↓
Player B
    ↓
Player C
    ↓
Player D
```

One complete cycle constitutes one round.

---

## Target Score

Default target score:

**10 points**

Future implementations may support configurable target scores.

---

# Standard Victory Procedure

The official victory procedure consists of four stages.

---

## Stage 1 — Normal Gameplay

Players accumulate points according to the active game mode until an active player reaches or exceeds the configured target score.

---

## Stage 2 — Target Score Reached

When an active player first reaches the target score,

```text
Score ≥ Target Score
```

the match immediately enters the **Final Round**.

The match does **not** end immediately.

---

## Stage 3 — Final Round

Every remaining active player must complete one final turn.

This guarantees equal scoring opportunities for every participant.

Example:

| Player | Score |
|---------|------:|
| Victor | 10 |
| Sarah | 6 |
| Oasis | 8 |

Victor reaches the target score.

The match continues until:

- Sarah completes her turn.
- Oasis completes her turn.

---

## Stage 4 — Winner Determination

After the Final Round concludes:

The player with the highest score is declared the winner.

Example:

| Player | Score |
|---------|------:|
| Victor | 10 |
| Sarah | 7 |
| Oasis | 9 |

Winner:

**Victor**

---

# Tie Resolution

If two or more players remain tied for the highest score after the Final Round, the match enters **Sudden Death**.

---

# Sudden Death

Only the tied leaders continue participating.

All remaining players retain their final recorded scores but are eliminated from championship contention.

Example:

| Player | Score |
|---------|------:|
| Victor | 10 |
| Oasis | 10 |
| Sarah | 8 |

Victor and Oasis continue.

Sarah is eliminated from championship contention.

---

# Sudden Death Victory Condition

Sudden Death continues until one of the following occurs:

- a player establishes the required winning margin; or
- the configured maximum number of Sudden Death rounds is reached.

---

## Winning Margin

A player wins Sudden Death by establishing a lead of at least:

**2 points**

Example:

```text
10–10
11–10
11–11
12–11
13–11
```

Winner:

Player with **13 points**.

---

## Maximum Sudden Death Rounds

Default maximum:

**Five complete Sudden Death rounds**

A Sudden Death round consists of one turn by every remaining Sudden Death participant.

---

## Official Draw

If the configured maximum number of Sudden Death rounds is completed without producing a winner:

The match is declared an **Official Draw**.

Every remaining Sudden Death participant shares the draw.

Example:

| Player | Score |
|---------|------:|
| Victor | 18 |
| Oasis | 18 |

Five complete Sudden Death rounds are played.

Neither player establishes a two-point lead.

Result:

**Official Draw**

---

# Official Match Outcomes

Every officially completed match concludes with one of the following outcomes.

---

## Winner

A player wins:

- after the Final Round; or
- after Sudden Death.

---

## Draw

A draw occurs only after the configured maximum number of Sudden Death rounds has been completed without establishing a winner.

---

## Exceptional Match Completion

If normal gameplay cannot continue because of player inactivity, the match concludes according to the procedures defined in:

**MATCH_COMPLETION_RULES.md**

These exceptional procedures supplement, rather than replace, the standard victory procedure.

---

# Advantages of the Official System

The official victory procedure provides:

- equal turn opportunities;
- elimination of first-player advantage;
- deterministic match completion;
- scalable multiplayer competition;
- classroom suitability;
- tournament suitability;
- exciting endgame scenarios.

---

# Future Extensions

Future gameplay formats may support:

- configurable target scores;
- configurable Sudden Death limits;
- elimination tournaments;
- league rankings;
- team competitions;
- ranked online play.

Future extensions should preserve the fairness established by this specification.

---

# Relationship to Other Documents

This document should be read together with:

- PROJECT_PHILOSOPHY.md
- PROJECT_STRATEGY.md
- GAMEPLAY_PHILOSOPHY.md
- GDD.md
- GAME_ENGINE.md
- MATCH_COMPLETION_RULES.md
- The_Last_Word_War_Rulebook.tex

Together these documents define the complete framework governing normal and exceptional match completion.

---

# Version History

## Version 1.0

Initial official victory specification.

## Version 1.1

Aligned terminology with the mature gameplay architecture.

Established the complete normal match completion procedure, including Final Round, Sudden Death, Official Draw, and formal match outcomes. Exceptional inactivity handling was separated into MATCH_COMPLETION_RULES.md, creating a clear distinction between standard victory determination and exceptional multiplayer termination.

---

End of Document
