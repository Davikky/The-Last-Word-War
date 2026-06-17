# The Last Word War

## Network Play Architecture v1.1

Author: Victor A. Adeyemi  
Date: 2026-06-17  
Status: Implementation Planning Document  

---

# Purpose

This document defines the first practical remote multiplayer architecture for The Last Word War.

The goal is to allow two human players in different locations to create a room, join a room, and play a complete match remotely.

---

# Core Goal for v0.1.0

v0.1.0 is defined as:

Two remote human players can complete a full game through a shared online room.

No accounts are required.

---

# First Screen

The first public screen should show:

- Create Room
- Join Room

The system should avoid login, passwords, profiles, and user accounts in the first online version.

---

# Room Flow

## Create Room

Host clicks:

Create Room

System generates:

- Room code
- Room state
- Host player slot

Example:

Room Code: XJ72K

---

## Join Room

Second player enters the room code.

If valid:

- Player joins room.
- Both players see the lobby.
- Host may start the game.

---

# Lobby State

Before the game starts, the room shows:

- Room code
- Player list
- Start game button for host
- Waiting message for guest

---

# Game State

The shared game state includes:

- Players
- Scores
- Current player
- Current word
- Sentence history
- Timer
- Game phase
- Winner
- Final standings

---

# Synchronization Principle

All connected players must see the same game state.

The server/backend must act as the authoritative state source.

Clients should not independently invent game state.

---

# Recommended Technology

For the first remote multiplayer version, Supabase Realtime is recommended.

Reasons:

- Less backend complexity
- Built-in database
- Built-in realtime subscriptions
- Easier deployment path
- Suitable for room-based play
- Avoids early server maintenance burden

---

# Not Included in v0.1.0

The first remote version does not include:

- User accounts
- Public matchmaking
- Rankings
- Friends lists
- Chat system
- Mobile app
- AI referee

---

# v0.1.0 Success Criteria

The version is successful if:

1. A host can create a room.
2. A second player can join using a room code.
3. Both players see synchronized game state.
4. Both players can take turns remotely.
5. The game can reach Game Over.
6. The winner screen appears for both players.

---

# Future Extensions

Later versions may include:

- AI referee
- Public lobbies
- Classroom rooms
- Tournaments
- Spectator mode
- Accounts
- Player statistics
- Educational modes

---

# Version History

## v1.1

Defines Supabase-based no-account room architecture for first remote multiplayer milestone.
