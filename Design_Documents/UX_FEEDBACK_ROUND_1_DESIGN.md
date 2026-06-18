# The Last Word War

## UX Feedback Round 1

Author: Victor A. Adeyemi

Date: 2026-06-18

Status: Approved for Implementation

---

# Purpose

This document records the first set of user-experience observations made after the public deployment of The Last Word War v0.1.0-alpha.

The purpose is to improve clarity, usability, and player flow before wider external playtesting.

---

# Context

The game has been successfully deployed publicly at:

https://the-last-word-war.vercel.app/

Initial testing was performed using:

* Laptop browser
* Mobile browser
* Remote multiplayer flow
* Room creation
* Room joining
* Online gameplay

The technical multiplayer flow worked as expected.

The next improvement area is the presentation and user experience flow.

---

# UX Observation 1: Landing Page Flow

## Current Issue

The interface currently feels closer to a developer test page than a first-time player onboarding page.

## Recommended Flow

The opening page should follow this order:

1. Title
2. Short explanation of what the game is about
3. Create Room / Join Room controls
4. Room code information
5. Lobby
6. Game interface
7. Metadata and version information

## Reason

First-time users should immediately understand:

* What the game is
* What they are expected to do
* How to start or join a game

---

# UX Observation 2: Hide Local Add Player Flow for Online Users

## Current Issue

The "Add Player" interface remains visible even though online play already uses Create Room, Join Room, and Lobby entry.

This may confuse online users.

## Recommendation

For the online-first experience, hide the local Add Player section from users once room-based play is active.

## Reason

Online play should follow:

Create Room / Join Room

↓

Enter Lobby

↓

Start Online Game

The old local-player flow should not compete visually with the online-player flow.

---

# UX Observation 3: Sentence History Should Appear Before Sentence Input

## Current Issue

Sentence history appears after the input area.

## Recommendation

Move sentence history above the sentence submission box.

## Reason

This mirrors familiar chat and conversation interfaces.

Players should see the recent conversation before submitting their next sentence.

Recommended order during gameplay:

1. Current phase
2. Current player
3. Current word
4. Sentence history
5. Sentence input
6. Scoreboard

---

# UX Observation 4: Remove Repeated Next Word From History

## Current Issue

Sentence history includes the extracted next word even though the current word is already displayed elsewhere.

## Recommendation

History should show only:

* Player name
* Submitted sentence

The current word should remain in the main game panel.

## Reason

This reduces redundancy and makes the history cleaner.

---

# UX Observation 5: Scoreboard Position

## Current Issue

The scoreboard currently competes with gameplay elements.

## Recommendation

The scoreboard should appear after the sentence submission area.

## Reason

During active play, the main player focus should be:

History

↓

Current word

↓

Sentence input

Scores are important, but secondary to turn-taking and sentence construction.

---

# UX Observation 6: Feedback Button

## Current Issue

There is no direct way for testers to provide feedback from the game page.

## Recommendation

Add a visible feedback button or link.

Possible label:

Give Feedback

The link may point to:

* Google Form
* Microsoft Form
* Tally form
* Other feedback collection tool

## Reason

External testers should be able to submit feedback immediately while the experience is fresh.

---

# Recommended Implementation Priority

## Priority 1

* Reorganize landing page flow
* Hide local Add Player flow for online users
* Move sentence history above input
* Remove repeated next word from history

## Priority 2

* Add feedback button

## Priority 3

* Improve styling after layout changes are stable

---

# Success Criteria

The UX update is successful if:

* First-time users understand what the game is.
* Online users are not confused by local-player controls.
* Gameplay flow resembles a conversation.
* Sentence history is easier to read.
* Testers can provide feedback easily.

---

# Version Target

These changes should be implemented before or during:

v0.1.0-beta

They should be completed before broader external playtesting.

