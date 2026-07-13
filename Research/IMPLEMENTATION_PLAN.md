# IMPLEMENTATION PLAN

Project: **The Last Word War™**

Project Steward:

Victor A. Adeyemi

Organization:

Da-aim Services

Target Release:

v0.1.3

Status:

Deferred Until Completion of Frontend Refactoring

---

# Purpose

This document defines the implementation work required to bring the software into full compliance with the approved gameplay specifications.

Unlike the Rulebook and other constitutional documents, this document does not introduce new gameplay rules.

Instead, it serves as the engineering execution plan for implementing gameplay behaviours that have already been formally approved.

This document bridges the gap between the approved specifications and their software implementation.

---

# Scope

The implementation work described here focuses exclusively on gameplay behaviour that was intentionally deferred while frontend architectural refactoring remains in progress.

The work covered includes:

- player inactivity management;
- exceptional match completion;
- Sudden Death draw resolution;
- closed-match enforcement;
- rematch starter rotation;
- multiplayer synchronization updates.

No new gameplay mechanics are introduced.

---

# Guiding Principle

Implementation shall conform to the approved specifications contained within:

- Rulebook v2.0
- Gameplay Philosophy
- Game Engine Specification
- Match Completion Rules
- Victory Conditions
- Time Synchronization
- Session Persistence and Recovery
- Rematch and Rotation

Where implementation differs from documentation, the documentation remains the authoritative source.

---

# Current Development Status

Current software status:

**Frontend Architecture Refactoring**

The project is currently undergoing architectural refactoring intended to improve maintainability without altering gameplay behaviour.

Gameplay implementation work described in this document intentionally remains deferred until the refactoring phase has been completed.

This minimizes regression risk and avoids introducing unnecessary complexity into code that is actively being reorganized.

---

# Implementation Phase 1

## Automatic Removal After Three Consecutive Timeout Penalties

### Specification References

- Rulebook v2.0
- Match Completion Rules
- Gameplay Philosophy

### Current Implementation

The current implementation tracks repeated room timeout events rather than consecutive timeout penalties for each individual player.

As a result, inactive players are not yet removed according to the approved gameplay rules.

### Required Behaviour

Each player shall maintain an independent:

```text
consecutiveTimeouts
```

counter.

The counter shall:

- increase after every timeout;
- reset immediately following every successful submission.

When the counter reaches:

```text
3
```

the player shall be automatically removed from the active match.

Removal shall preserve:

- existing score;
- previously accepted sentences;
- match history.

The removed player shall no longer participate in turn rotation.

### Implementation Tasks

- [ ] Add `consecutiveTimeouts` to player state.
- [ ] Increment after timeout.
- [ ] Reset after successful submission.
- [ ] Remove player after third consecutive timeout.
- [ ] Recalculate active turn order.
- [ ] Synchronize removal across all connected clients.
- [ ] Verify rematch resets timeout counters correctly.

### Completion Criteria

Implementation is complete when:

- timeout counters operate independently for every player;
- inactive players are removed correctly;
- multiplayer synchronization remains consistent;
- regression testing confirms existing gameplay remains unaffected.

---

---
# Implementation Phase 2

## Exceptional Match Completion

### Specification References

- Match Completion Rules
- Victory Conditions
- Rulebook v2.0

### Current Implementation

The software correctly handles standard match completion but does not yet fully implement all exceptional completion scenarios defined by the official gameplay specification.

Current winner determination assumes that gameplay proceeds normally through the Final Round and, where necessary, Sudden Death.

### Required Behaviour

The software shall continuously monitor the number of active players remaining throughout the match.

Following any player removal due to inactivity, the game shall immediately evaluate whether normal gameplay can continue.

Two exceptional outcomes are possible.

#### Case 1 — One Active Player Remaining

If only one active player remains:

- the match immediately concludes;
- that player is declared the official winner;
- no further turns are played.

#### Case 2 — No Active Players Remaining

If no active players remain:

- the match immediately concludes;
- no winner is declared;
- the match is officially recorded as abandoned due to inactivity.

### Implementation Tasks

- [ ] Detect changes to active player count.
- [ ] Evaluate active player count after every automatic removal.
- [ ] Trigger immediate winner declaration when one player remains.
- [ ] Trigger official match abandonment when no players remain.
- [ ] Synchronize outcome across all connected clients.
- [ ] Display the appropriate match completion message.

### Completion Criteria

Implementation is complete when:

- both exceptional completion paths behave exactly as defined;
- multiplayer synchronization remains correct;
- regression testing confirms standard gameplay remains unaffected.

---

# Implementation Phase 3

## Official Sudden Death Draw Resolution

### Specification References

- Victory Conditions
- Match Completion Rules
- Rulebook v2.0

### Current Implementation

Sudden Death currently continues indefinitely until one participant establishes a two-point lead.

The official maximum Sudden Death duration has not yet been implemented.

### Required Behaviour

Maintain an independent:

```text
suddenDeathRoundCount
```

representing the number of completed Sudden Death rounds.

A Sudden Death Round is complete only after every remaining Sudden Death participant has received one turn.

If:

- neither player achieves the required two-point lead; and
- five complete Sudden Death rounds have been completed,

the match immediately ends as an:

```text
Official Draw
```

Neither player is declared the winner.

### Implementation Tasks

- [ ] Add `suddenDeathRoundCount` to multiplayer game state.
- [ ] Detect completion of a full Sudden Death round.
- [ ] Increment the round counter.
- [ ] Detect completion of five rounds.
- [ ] Trigger official draw.
- [ ] Display draw result.
- [ ] Synchronize draw state across all connected clients.

### Completion Criteria

Implementation is complete when:

- Sudden Death rounds are counted correctly;
- draw detection occurs only after five complete rounds;
- multiplayer synchronization remains correct;
- two-player and multiplayer scenarios behave consistently.

---

# Implementation Phase 4

## Closed Match Enforcement

### Specification References

- Network Play Architecture
- Rulebook v2.0
- Match Completion Rules

### Current Implementation

Room membership is partially restricted once gameplay begins, but enforcement is not yet fully aligned with the approved gameplay specification.

### Required Behaviour

Once Active Play begins:

- room membership becomes fixed;
- no additional players may join the current match;
- join requests are rejected;
- players attempting to join receive an informative message explaining that the match has already started.

New participants must wait until a new match is created.

### Implementation Tasks

- [ ] Lock room membership when Active Play begins.
- [ ] Reject late join attempts.
- [ ] Display informative rejection message.
- [ ] Ensure rejected joins do not affect active multiplayer state.
- [ ] Verify behaviour after rematches.

### Completion Criteria

Implementation is complete when:

- no player can join after Active Play begins;
- existing players remain unaffected;
- multiplayer synchronization remains stable;
- room behaviour matches the official Rulebook.

---

---
# Implementation Phase 5

## Starter Rotation for Consecutive Matches

### Specification References

- Rematch and Rotation
- Rulebook v2.0

### Current Implementation

The current rematch system correctly resets gameplay but always preserves the original starting player.

This introduces a persistent first-player advantage across consecutive matches.

### Required Behaviour

Following every completed match, the starting position shall rotate to the next player in the original player order.

Example:

```text
Match 1

Victor
↓
Sarah
↓
James
↓
Grace

Match 2

Sarah
↓
James
↓
Grace
↓
Victor

Match 3

James
↓
Grace
↓
Victor
↓
Sarah
```

The rotation continues cyclically throughout the lifetime of the multiplayer room.

The player order itself remains unchanged.

Only the starting position rotates.

### Implementation Tasks

- [ ] Introduce `startingPlayerIndex`.
- [ ] Advance the starting index after every completed match.
- [ ] Recalculate turn order before each rematch.
- [ ] Synchronize updated turn order across all connected clients.
- [ ] Reset correctly after room recreation.
- [ ] Verify behaviour for rooms containing two or more players.

### Completion Criteria

Implementation is complete when:

- every completed match rotates the starting player;
- turn order remains consistent for all players;
- multiplayer synchronization is maintained;
- rematches preserve player order while rotating the starting position.

---

# Implementation Phase 6

## Multiplayer Verification and Regression Testing

Every gameplay implementation introduced through this document shall undergo comprehensive verification before being considered complete.

Implementation is not complete when the code compiles.

Implementation is complete only after successful behavioural validation.

### Required Verification

Each completed implementation shall satisfy the following checks.

#### Build Verification

- [ ] Project builds successfully.
- [ ] No runtime errors.
- [ ] No new console errors or warnings related to gameplay.

#### Gameplay Verification

- [ ] Rulebook behaviour matches implementation.
- [ ] Match flow remains correct.
- [ ] Scoring remains correct.
- [ ] Turn order remains correct.
- [ ] Final Round behaves correctly.
- [ ] Sudden Death behaves correctly.
- [ ] Exceptional Match Completion behaves correctly.

#### Multiplayer Verification

- [ ] Two-player testing.
- [ ] Three-player testing.
- [ ] Four-player testing (where applicable).
- [ ] Browser refresh recovery.
- [ ] Player reconnection.
- [ ] Timeout synchronization.
- [ ] Rematch synchronization.

#### Regression Testing

Previously completed functionality shall continue operating correctly, including:

- room creation;
- room joining;
- lobby behaviour;
- sentence submission;
- last-word extraction;
- score synchronization;
- timer synchronization;
- session recovery;
- multiplayer state synchronization.

Regression testing shall be completed before every release candidate.

---

# Documentation Updates

Following completion of each implementation phase, the following documents shall be reviewed and updated where necessary.

- [ ] Engineering Issue Register (`BUG_TRACKER.md`)
- [ ] Development Journal
- [ ] Release Notes
- [ ] Playtest Preparation
- [ ] Playtest Checklist
- [ ] Playtest Notes
- [ ] Project State (if appropriate)

Documentation shall remain synchronized with the implemented software.

---

# Release Readiness Criteria

The implementation plan shall be considered complete when all of the following conditions are satisfied.

## Gameplay

- [ ] All approved gameplay rules have been implemented.
- [ ] Match completion conforms to the Rulebook.
- [ ] Multiplayer behaviour matches the approved specifications.

## Software Quality

- [ ] Frontend refactoring completed.
- [ ] No Critical engineering issues remain open.
- [ ] High-priority implementation gaps scheduled for v0.1.3 have been resolved.

## Verification

- [ ] Multiplayer testing completed successfully.
- [ ] Regression testing completed successfully.
- [ ] Behaviour verified against the Rulebook.
- [ ] Documentation synchronized.

---

# Relationship to Other Documents

This implementation plan complements:

- Rulebook v2.0
- Gameplay Philosophy
- Game Engine Specification
- Match Completion Rules
- Victory Conditions
- Time Synchronization
- Session Persistence and Recovery
- Rematch and Rotation
- Engineering Issue Register
- Development Journal
- Release Notes

These documents collectively define the approved gameplay behaviour and provide the authoritative reference for implementation.

---

# Completion Milestone

Successful completion of this implementation plan marks the end of the **v0.1.x Gameplay Implementation Phase**.

At that point, the project will have:

- implemented all approved gameplay mechanics;
- aligned the software with the constitutional documentation;
- completed the Architecture Stabilization Phase;
- established a stable platform for expanded playtesting, research, and preparation for the project's first beta release.

Future development will primarily focus on:

- evidence-driven refinement;
- user experience improvements;
- educational features;
- research outcomes;
- long-term platform growth.

---

# Closing Remarks

This document intentionally separates **design** from **implementation**.

The approved gameplay architecture has already been established through the project's constitutional documents.

The purpose of this implementation plan is therefore not to invent new gameplay mechanics, but to execute the remaining engineering work necessary to achieve full compliance with those approved specifications.

By following this plan, implementation remains disciplined, traceable, verifiable, and aligned with the long-term philosophy of **The Last Word War™**.

---

**End of Implementation Plan**
