[![tlww-image](https://github.com/Davikky/The-Last-Word-War/blob/main/the-last-word-war.png?raw=true)](https://the-last-word-war.vercel.app)

# The Last Word War™

*A human-governed multiplayer language game built to promote conversation, creativity, learning, and meaningful Human ↔ Human interaction.*

---

## Overview

**The Last Word War™** is a turn-based multiplayer language game in which players collaboratively build an evolving chain of ideas by beginning each new sentence with the **last word** of the previous player's sentence.

Unlike traditional word games that focus primarily on vocabulary or automated rule enforcement, The Last Word War™ transforms ordinary conversation into a shared challenge of language, creativity, reasoning, and social interaction.

The project adopts the principle of **Computational Facilitation**, where software coordinates gameplay while intentionally preserving human judgment. Rather than replacing interpretation with artificial intelligence, the game empowers players to negotiate meaning, creativity, and the culture of play themselves.

---

## Foundational Philosophy

The project is founded upon three simple statements:

> **War is not the goal of this GAME at all.**  
> **All it seeks is to promote HUMAN interactions;**  
> **interactions built firmly upon the previous LAST WORD.**

Every aspect of the project—from gameplay to software architecture and research—is guided by these principles.

The software provides the computational framework.

The players create the experience.

---

## Human-Governed Gameplay

The Last Word War™ intentionally preserves human responsibility throughout gameplay.

The software coordinates objective computational tasks such as:

- multiplayer synchronization;
- turn management;
- score tracking;
- timeout management;
- automatic last-word extraction;
- session persistence;
- multiplayer integrity.

Players remain responsible for:

- interpreting meaning;
- evaluating creativity;
- resolving disagreements;
- establishing local gameplay culture;
- determining acceptable play.

> **The software defines the framework of play.**  
> **The players define the culture of play.**

---

# Quick Rules

1. Create or join a multiplayer room.
2. Once a match begins, no new players may join.
3. Players take turns submitting sentences.
4. Every sentence must begin with the **last word** of the previous accepted sentence.
5. Every successful turn awards **1 point**.
6. A timeout awards no point and counts as one consecutive timeout.
7. A player who accumulates **three consecutive timeout penalties** is automatically removed from the current match.
8. The first player to reach **10 points** triggers the **Final Round**.
9. Every remaining active player receives one final turn.
10. If the highest score remains tied, tied players enter **Sudden Death**.
11. Sudden Death ends when one player leads by **two points**, or after **five complete Sudden Death rounds**, resulting in an official draw.
12. If normal gameplay becomes impossible because of player inactivity, the match concludes according to the **Exceptional Match Completion Rules**.

---

# Example Gameplay

**Player 1**

> Science helps us understand nature.

**Player 2**

> Nature inspires technological innovation.

**Player 3**

> Innovation drives economic growth.

The conversation continues by repeatedly beginning each sentence with the previous sentence's final word.

---

# Features

## Gameplay

- Human-governed multiplayer gameplay
- Sentence-chain mechanics
- Automatic last-word extraction
- Automatic score tracking
- Shared sentence history
- Final Round
- Sudden Death
- Official draw resolution
- Exceptional Match Completion
- Multiplayer integrity rules
- Automatic inactive-player removal
- Starter rotation for rematches

---

## Multiplayer

- Online room creation
- Room joining by code
- Server-authoritative game state
- Shared countdown timer
- Closed-match enforcement
- Session persistence
- Automatic session recovery
- Online rematches
- Realtime synchronization

---

## User Experience

- Welcome screen onboarding
- Quick Rules guide
- Match status indicators
- Timeout notifications
- Browser session recovery
- Responsive multiplayer interface

---

## Optional AI Gameplay Analysis

Artificial intelligence is intentionally **not** part of gameplay.

Instead, after an official match concludes, players may optionally request an **AI Gameplay Analysis**.

The analysis may provide educational observations regarding:

- grammar;
- sentence continuity;
- logical consistency;
- factual correctness;
- scientific accuracy;
- communication quality.

The analysis never changes:

- the official winner;
- the official scoreboard;
- the official sentence history;
- the official match outcome.

Gameplay belongs to the players.

Reflection may optionally involve artificial intelligence.

---

# Current Development Status

**Current Version**

> **v0.1.2**

**Project Stage**

> **Feature-Complete Alpha (Architecture Stabilization Phase)**

Current development priorities include:

- architecture refactoring;
- component modularization;
- UX refinement;
- Playtest #2;
- gameplay observation;
- documentation synchronization;
- research preparation;
- publication development.

---

# Technology Stack

| Layer | Technology |
|--------|------------|
| Frontend | React + Vite |
| Backend | Supabase + PostgreSQL |
| Realtime | Supabase Realtime |
| Deployment | Vercel |
| Version Control | Git + GitHub |

---

# Repository Structure

```text
Artwork/
Design_Documents/
Legal/
Marketing/
Papers/
Project_Archive/
Prototype/
Releases/
Research/
Rulebook/
Website/

README.md
PROJECT_ROADMAP.md
```

---

# Documentation

The repository is organized around a layered documentation architecture.

| Directory | Purpose |
|------------|---------|
| `Design_Documents/` | Philosophy, architecture, gameplay specifications, and software design |
| `Rulebook/` | Official gameplay rules |
| `Research/` | Development journals, playtesting, observations, and research materials |
| `Papers/` | Academic manuscripts and publications |
| `Releases/` | Release notes and version history |
| `Prototype/` | Source code for the playable implementation |

---

# Research Themes

The Last Word War™ also serves as a long-term research initiative investigating:

- Human-Centered Computing
- Human ↔ Human Interaction
- Computational Facilitation
- Educational Gaming
- Multiplayer Collaboration
- Language-Based Interaction
- Responsible AI-Assisted Development
- Human-Centered Digital Systems

---

# Roadmap

## Current Phase

- Complete architecture refactoring
- Continue Playtest #2
- Improve onboarding
- Improve maintainability
- Collect gameplay evidence
- Prepare the first research publication

---

## Future Development

Planned future initiatives include:

- Classroom Edition
- Educational Themes
- Tournament Platform
- Spectator Mode
- Analytics Dashboard
- Mobile Application
- Research Collaborations

Future features will be guided by evidence collected through development and playtesting rather than by feature accumulation.

---

# Design Principles

Every future feature is evaluated according to five guiding questions:

1. Does it strengthen Human ↔ Human interaction?
2. Does it preserve human responsibility?
3. Does it improve usability?
4. Does it encourage learning or creativity?
5. Is it supported by evidence from playtesting?

---

# Stewardship

**Project Steward**

Victor A. Adeyemi

**Organization**

Da-aim Services

**Contact**

<daaim4you@gmail.com>

---

# License

License to be determined.

---

*"The software coordinates interaction. Humans determine meaning."*
