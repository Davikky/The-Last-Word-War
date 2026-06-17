# The Last Word War

## Network Play Specification v1.0

Author: Victor A. Adeyemi

Date: 2026-06-17

Status: Architectural Design Document

---

# Purpose

This document defines the first network-enabled version of The Last Word War.

The objective is to enable meaningful real-time interaction between human participants regardless of geographical location.

Remote human interaction is considered a core requirement of the project.

---

# Design Philosophy

The primary goal of network play is not merely connectivity.

The goal is to facilitate enjoyable and meaningful interaction between human beings.

Technology exists to support human interaction.

Technology is not the focus of the experience.

---

# Minimum Viable Online Experience

The first online version should support:

* Two remote human players
* Real-time gameplay
* Shared game state
* AI-assisted refereeing
* Room-based matchmaking

The first online version does not require:

* Public matchmaking
* User accounts
* Rankings
* Friends lists
* Tournament systems

---

# Room-Based Architecture

A player creates a room.

Example:

Player A:

Create Room

System:

Room Code: XJ72K

Player A shares the room code with Player B.

Player B enters the room code and joins the session.

---

# Room Lifecycle

## Room Creation

Host creates room.

System generates:

* Room identifier
* Shared game state
* Initial settings

---

## Room Join

A player joins using a valid room code.

Upon successful join:

* Player list is synchronized.
* Game settings are synchronized.
* Current state is synchronized.

---

## Room Start

The game begins when all required participants are present.

The host initiates game start.

---

# Shared Game State

The following data must remain synchronized across all participants:

* Player list
* Scores
* Current player
* Current word
* Sentence history
* Timer
* Game phase
* Winner state
* Challenge state

All participants should observe the same game state.

---

# Host Authority Model

Initially, one participant acts as room host.

The host controls:

* Game creation
* Rule configuration
* Match initiation

Future versions may support host transfer.

---

# Player Disconnect Handling

## Temporary Disconnect

If a player loses connection:

* Game pauses.
* Remaining players are informed.
* Reconnection window begins.

The player may rejoin using the existing room code.

---

## Permanent Disconnect

If a player fails to reconnect within the allowed period:

* Match may be terminated.
* Match may continue according to configured rules.

Future versions may support AI substitution.

---

# Security Principles

The system should prevent:

* Unauthorized room access
* State manipulation
* Score tampering
* Timer tampering

The server should remain the authoritative source of truth.

---

# Communication Model

The preferred architecture is:

Client
↔
Server
↔
Client

All state updates pass through the server.

Clients should not directly control other clients.

---

# AI Referee Integration

The AI referee should operate through the server layer.

AI may:

* Validate submissions
* Resolve disputes
* Verify facts
* Enforce rules

AI should not replace human participants.

---

# Future Extensions

Future network features may include:

* Ranked play
* Spectator mode
* Tournament rooms
* Team competitions
* Classroom rooms
* Educational sessions

---

# Success Criteria

Network play is considered successful when:

* Two remote players can complete a full game.
* State remains synchronized.
* Human interaction remains central.
* AI assistance remains supportive rather than dominant.

---

# Version History

## Version 1.0

Initial network-play architecture specification.

