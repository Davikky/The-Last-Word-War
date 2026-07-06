# The Last Word War™ — Game Design Document v0.2

Steward:

Victor A. Adeyemi

Organization:

Da-aim Services

Status:

Active Design Document

Date:

2026-07

---

# Purpose

This document describes the design of The Last Word War™.

It translates the project's philosophy into concrete gameplay and implementation decisions.

While the Project Philosophy explains **why** the project exists and the Gameplay Philosophy explains **how** gameplay is intended to function, this document specifies **what** is built.

---

# 1. Game Vision

The Last Word War™ is a turn-based multiplayer language game in which players collaboratively build an evolving chain of ideas.

Each player constructs a sentence beginning with the last word of the previous player's sentence.

The game is designed primarily to encourage:

* Human interaction
* Conversation
* Creativity
* Learning
* Reasoning
* Friendly competition

The project intentionally places Human ↔ Human interaction at the center of the experience.

---

# 2. Core Gameplay Loop

1. A player submits a sentence.
2. The software extracts the final word.
3. The next player begins with that word.
4. The timer determines whether the submission is made in time.
5. Scores and history are updated.
6. Play continues to the next participant.

The software coordinates gameplay.

The players determine the quality and culture of play.

---

# 3. Current Implementation Target

The current implementation target is a web-based multiplayer platform.

Core features include:

* Player registration
* Online room creation
* Room joining
* Turn management
* Shared countdown timer
* Current word display
* Sentence submission
* Automatic last-word extraction
* Shared scoreboard
* Sentence history
* Final Round
* Sudden Death
* Inactivity handling
* Session recovery
* Online rematch

---

# 4. Gameplay Philosophy

Gameplay intentionally preserves human judgment.

The software provides structure while avoiding unnecessary governance of player interaction.

The software is responsible for:

* multiplayer coordination;
* timing;
* synchronization;
* score management;
* session management.

Players remain responsible for:

* interpreting meaning;
* evaluating sentence quality;
* resolving disagreements;
* defining acceptable gameplay culture.

---

# 5. Initial Game Modes

Current modes include:

* Standard Mode
* Blitz Mode
* Lightning Mode
* Story Mode
* Reverse Mode

Future educational themes may include:

* Physics
* Mathematics
* Cryptography
* History
* Language Learning
* Engineering
* Medical Sciences

Themes provide context without changing the core gameplay loop.

---

# 6. Design Principles

The project follows the following design principles:

* Easy to learn
* Difficult to master
* Human-centered
* Educationally valuable
* Technically reliable
* Scalable
* Computationally simple
* Socially flexible

Every feature should strengthen Human ↔ Human interaction.

---

# 7. Computational Responsibilities

The software is responsible for objective computational tasks.

These include:

* room management;
* player synchronization;
* turn rotation;
* timeout enforcement;
* score tracking;
* sentence history;
* session persistence;
* multiplayer reliability.

The software intentionally avoids making subjective judgments about language or creativity.

---

# 8. Human Responsibilities

Human participants remain responsible for:

* judging sentence quality;
* interpreting meaning;
* evaluating creativity;
* resolving disagreements;
* deciding how to respond to loopholes;
* establishing local gameplay culture.

The software defines the framework of play.

The players define the culture of play.

---

# 9. Onboarding Philosophy

External playtesting revealed that many players initially expected:

* an AI opponent;
* a single-player mode;
* automatic gameplay validation.

These expectations reflect broader trends in contemporary digital experiences.

The Last Word War™ intentionally adopts a different philosophy.

Players should understand before gameplay begins that the experience is fundamentally Human ↔ Human.

---

# 10. Welcome Screen

The application begins with a dedicated welcome screen.

Player Flow:

```text
Application Launch
        ↓
Welcome Screen
        ↓
Continue
        ↓
Landing Page
        ↓
Create Room / Join Room
```

The welcome screen communicates:

* the project's philosophy;
* the Human ↔ Human nature of gameplay;
* the multiplayer requirement.

Its purpose is to align player expectations before play begins.

---

# 11. Research Through Playtesting

Playtesting is treated as an essential part of the design process.

The project seeks evidence regarding:

* onboarding clarity;
* multiplayer usability;
* player behaviour;
* player expectations;
* social interaction;
* educational engagement.

Observed behaviour should guide future development.

---

# 12. Current Development Priorities

Current priorities are:

* Continue Playtest #2
* Complete component refactoring
* Improve onboarding
* Improve maintainability
* Collect gameplay observations
* Prepare the first research publication

---

# 13. Future Development

Future work may include:

* Classroom Edition
* Tournament Platform
* Educational themes
* Mobile application
* Spectator mode
* Analytics dashboard

Future features should preserve the project's human-centered philosophy and be supported by evidence from development and playtesting.

---

# Relationship to Other Documents

This document should be read together with:

* PROJECT_PHILOSOPHY_v1_2.md
* GAMEPLAY_PHILOSOPHY_v1_0.md
* PROJECT_STRATEGY_v1_2.md
* The_Last_Word_War_Rulebook_v1_0.tex

---

# Version History

## Version 0.1

Initial Game Design Document.

## Version 0.2

Updated to align with the project's constitutional documents. The design now emphasizes Human ↔ Human interaction, computational facilitation, preservation of human judgment, evidence-driven development, and onboarding informed by playtesting.

---

End of Document
