# The Last Word War — Game Design Document v0.1

Author: Victor A. Adeyemi  
Status: Draft  
Date: 2026-06-17  

## 1. Game Vision

The Last Word War is a turn-based language, reasoning, and knowledge game where each player constructs a meaningful sentence using the last word of the previous player's sentence.

The game is designed for entertainment, education, classrooms, study groups, social gatherings, and future digital implementation.

## 2. Core Gameplay Loop

1. A player submits a sentence.
2. The system or referee extracts the last word.
3. The next player must create a meaningful sentence using that word.
4. The sentence is judged valid or invalid.
5. Scores are updated.
6. The next turn begins.

## 3. Current Implementation Target

The first implementation target is a simple web-based prototype.

Minimum features:

- Player name entry
- Turn order
- Current word display
- Sentence input box
- Timer
- Scoreboard
- Manual valid/invalid button
- Automatic last-word extraction

## 4. Initial Game Modes

- Easy Mode
- Medium Mode
- Hard Mode
- Story Mode
- Blitz Mode
- Lightning Mode
- Reverse Mode

## 5. Design Principles

- Easy to learn
- Difficult to master
- Educationally useful
- Scalable across age groups
- Suitable for AI-assisted moderation
- Flexible across themes and subjects

## 6. Future Features

- AI referee
- Online multiplayer
- Classroom mode
- Tournament mode
- Mobile app
- User accounts
- Leaderboards
- Subject-specific game packs

## 7. Development Notes

This document will evolve as the project develops. Each new version should be archived in the repository.

---

# Human-Centered Onboarding Philosophy

## Motivation

Early external playtesting revealed that a significant number of players initially expected The Last Word War™ to include an artificial intelligence opponent or a single-player mode.

This observation suggests that many contemporary users approach digital experiences with an implicit expectation of Human ↔ AI interaction.

Because The Last Word War™ is intentionally designed as a Human ↔ Human experience, explicit onboarding is required to communicate the project's philosophy and reduce player confusion.

---

## Design Goal

The onboarding experience shall clearly communicate that:

* The game requires at least two human participants.
* Artificial intelligence is not the primary participant.
* Human interaction is the central objective of the experience.

---

## Welcome Screen Layer

A dedicated welcome screen shall appear before the main menu.

Player Flow:

```text
Application Launch
        ↓
Welcome Screen
        ↓
Continue
        ↓
Main Landing Page
        ↓
Create Room / Join Room
```

---

## Welcome Screen Content

The welcome screen should communicate:

### Project Philosophy

War is not the goal of this GAME at all.

All it seeks is to promote HUMAN interactions;

Interactions built firmly upon the previous LAST WORD.

### Human-Centered Statement

The Last Word War™ is intentionally designed for two or more human players.

Unlike many modern digital experiences, there is currently no AI opponent.

Artificial intelligence serves only as:

* Referee
* Moderator
* Rule Validator
* Educational Assistant

Humans remain the primary participants.

---

## UX Objectives

The welcome screen should:

* Reduce onboarding confusion.
* Align player expectations.
* Reinforce project identity.
* Differentiate the game from AI-centered experiences.
* Encourage meaningful human interaction.

---

## Research Significance

The onboarding layer also serves as an experimental intervention for studying player expectations in an increasingly AI-mediated digital environment.

Future playtesting should evaluate:

* Whether explicit onboarding reduces confusion.
* Whether players continue to request AI opponents.
* How users respond to intentionally human-centered experiences.

These observations may contribute to future research publications concerning Human-Centered AI-Assisted Design.

---

## Success Criteria

The onboarding layer is considered successful if:

* Fewer players misunderstand the multiplayer requirement.
* Players understand the Human ↔ Human philosophy before gameplay begins.
* Confusion regarding the absence of AI opponents decreases in subsequent playtests.

