# ENGINEERING ISSUE REGISTER

Project: **The Last Word War™**

Project Steward:

Victor A. Adeyemi

Organization:

Da-aim Services

Status:

Active

Document Version:

2026.07

---

# Purpose

This document records software defects, implementation gaps, technical debt, and planned engineering improvements identified during the development of The Last Word War™.

Unlike release notes, which summarize completed work, this register tracks work that either:

- has been completed and verified;
- remains under investigation;
- has been intentionally deferred;
- represents an approved future implementation.

The register serves as:

- the project's primary engineering issue tracker;
- a verification checklist during development;
- a reference for release planning;
- an implementation roadmap during architecture stabilization.

---

# Issue Classification

Every recorded issue belongs to one of the following categories.

## Bug

The software behaves differently from the approved specification.

Examples include:

- incorrect gameplay behaviour;
- synchronization failures;
- user interface defects;
- multiplayer inconsistencies.

---

## Implementation Gap

The official specification has been approved, but the corresponding functionality has not yet been implemented.

Implementation gaps are not software defects.

They simply indicate that development has not yet reached that portion of the approved design.

---

## Technical Debt

The software intentionally contains a temporary implementation that will later be replaced by a more robust architecture.

Technical debt represents engineering work rather than incorrect behaviour.

---

## Enhancement

A proposed improvement that extends the software beyond the current approved specification.

Enhancements are optional and are evaluated according to project priorities.

---

# Priority Levels

Issues are assigned one of four priorities.

## Critical

Prevents normal gameplay or causes loss of multiplayer integrity.

Must be addressed immediately.

---

## High

Significantly affects gameplay, synchronization, or user experience.

Should be resolved before the next stable release.

---

## Medium

Impacts maintainability or usability but does not prevent normal gameplay.

Should be addressed during routine development.

---

## Low

Minor issue with limited impact.

May be postponed.

---

# Status Definitions

Each issue maintains one of the following statuses.

| Status | Meaning |
|---------|---------|
| Pending | Work has not yet begun |
| In Progress | Implementation is underway |
| Deferred | Approved but intentionally postponed |
| Under Investigation | Cause not yet confirmed |
| Resolved | Fix completed |
| Verified | Resolution independently confirmed |
| Closed | Completed and archived |

---

# Resolved Issues

---

## BUG-0001

### Title

Winner Not Declared After Final Round

### Category

Bug

### Priority

Critical

### Status

Verified

### Reported During

Remote Match Test v0.1.0

### Description

The match continued indefinitely after a winner had already emerged.

### Expected Behaviour

The match should transition into the official Game Over state immediately after winner determination.

### Root Cause

Final Round completion failed to trigger winner determination correctly.

### Resolution

Updated Final Round completion logic and synchronized winner determination across all connected clients.

### Verification

- Multiplayer match completed successfully.
- Winner displayed correctly on all connected clients.

### Resolved In

v0.1.0-alpha

---

## BUG-0002

### Title

Current Word Failed To Synchronize Online

### Category

Bug

### Priority

Critical

### Status

Verified

### Reported During

UX Improvement Round 1

### Description

Following a valid submission, the displayed Current Word failed to update.

As a consequence, subsequent sentence validation became unreliable.

### Expected Behaviour

The Current Word should always synchronize to the extracted final word after every accepted submission.

### Root Cause

The shared room state failed to synchronize both:

- `currentWord`
- `currentPlayerIndex`

after online submissions.

### Resolution

Explicit synchronization of both values was introduced during room state updates.

### Verification

- Current Word updates correctly.
- Turn order advances correctly.
- Sentence validation restored.
- Multiplayer synchronization confirmed.

### Resolved In

v0.1.0-alpha

---

## BUG-0003

### Title

Sudden Death Rotation Included Non-Eligible Players

### Category

Bug

### Priority

High

### Status

Verified

### Reported During

Playtest #1 Follow-up Investigation

### Description

Players who were no longer participating in Sudden Death continued receiving turns.

### Expected Behaviour

Only tied players should participate in Sudden Death.

### Root Cause

Normal multiplayer rotation remained active instead of restricting turns to the Sudden Death participant set.

### Resolution

Turn selection was updated to rotate exclusively among eligible Sudden Death players.

### Verification

Three-player testing confirmed that eliminated players were correctly skipped.

### Resolved In

v0.1.0-alpha

---

## BUG-0004

### Title

Online Rematch Reset Was Client-Local

### Category

Bug

### Priority

High

### Status

Verified

### Reported During

Three-Player Online Testing

### Description

Selecting "Play Again" reset only the initiating client.

Other connected players remained in inconsistent match states.

### Expected Behaviour

A rematch should reset every connected client simultaneously.

### Root Cause

The rematch workflow updated only local React state.

### Resolution

The rematch workflow was converted into a synchronized multiplayer room reset.

### Verification

Host-initiated rematches correctly synchronized across every connected client.

### Resolved In

v0.1.0-alpha

---

## BUG-0005

### Title

Host Could Remove Self From Lobby

### Category

Bug

### Priority

Medium

### Status

Verified

### Description

The lobby interface allowed the room host to remove themselves before gameplay began.

### Expected Behaviour

The room host should only be able to remove guest players.

### Resolution

Self-removal controls were removed for the host.

### Verification

Host removal is no longer possible while guest removal remains fully functional.

### Resolved In

v0.1.0-alpha

---

## BUG-0006

### Title

Timeout Notification Integration Interrupted Timeout Processing

### Category

Bug

### Priority

Critical

### Status

Verified

### Description

Integrating synchronized timeout notifications prevented timeout penalties and turn advancement from executing correctly.

### Root Cause

Notification state introduced an invalid multiplayer state transition.

### Resolution

Notification state was integrated directly into the evaluated multiplayer room state before synchronization.

### Verification

- Timeout penalties restored.
- Turn advancement restored.
- Notifications synchronized correctly.

### Resolved In

v0.1.0-alpha

---

## BUG-0007

### Title

Near-Deadline Multiplayer Race Condition

### Category

Bug

### Priority

Critical

### Status

Verified

### Description

Near-deadline submissions could compete with timeout processing, allowing stale timeout events to overwrite newer room states.

### Expected Behaviour

Only the most recent authoritative turn state should be permitted to modify gameplay.

### Root Cause

Timeout processing lacked optimistic concurrency validation.

### Resolution

Introduced monotonic turn versioning together with optimistic concurrency checks before timeout state updates.

### Verification

- Late submissions no longer overwrite active turns.
- Stale timeout events are safely discarded.
- Multiplayer synchronization remains consistent.

### Resolved In

v0.1.1

---

---
# Current Engineering Issues

The following issues represent approved work that remains outstanding.

Unlike resolved bugs, these items generally reflect implementation work that is already specified by the project's governing documents.

---

# Implementation Gaps

Implementation Gaps represent gameplay behaviour that has already been approved through the project's constitutional documentation but has not yet been fully implemented in the software.

These items form the primary implementation objectives for the remainder of the v0.1.x Architecture Stabilization Phase.

---

## ISSUE-1001

### Title

Automatic Removal After Three Consecutive Personal Timeouts

### Category

Implementation Gap

### Priority

High

### Status

Deferred

### Specification Reference

- Rulebook v2.0
- Match Completion Rules
- Gameplay Philosophy

### Current Implementation

The current implementation tracks repeated room timeout events rather than consecutive timeout penalties for each individual player.

### Expected Behaviour

Each player maintains an independent consecutive timeout counter.

Whenever a player:

- successfully completes a turn,

their counter immediately resets to:

```text
0
```

A player accumulating:

```text
3 consecutive timeout penalties
```

is automatically removed from the active match.

Previously accepted sentences and scores remain part of the official match record.

### Planned Release

v0.1.3

---

## ISSUE-1002

### Title

Closed Match Enforcement

### Category

Implementation Gap

### Priority

High

### Status

Deferred

### Specification Reference

- Rulebook v2.0
- Network Play Architecture
- Match Completion Rules

### Current Implementation

Late joins are partially restricted but the implementation is not yet fully synchronized with the approved gameplay specification.

### Expected Behaviour

Once Active Play begins:

- no additional players may join;
- room membership becomes fixed;
- new participants must wait until the next match.

### Planned Release

v0.1.3

---

## ISSUE-1003

### Title

Exceptional Match Completion

### Category

Implementation Gap

### Priority

High

### Status

Deferred

### Specification Reference

- Match Completion Rules
- Victory Conditions
- Rulebook v2.0

### Current Implementation

The software correctly handles normal match completion but does not yet fully implement all exceptional completion scenarios.

### Expected Behaviour

The software shall correctly conclude matches when:

- only one active player remains;
- every remaining player has become inactive.

Winner determination shall follow the official Match Completion Rules.

### Planned Release

v0.1.3

---

## ISSUE-1004

### Title

Official Sudden Death Draw Limit

### Category

Implementation Gap

### Priority

Medium

### Status

Deferred

### Specification Reference

- Victory Conditions
- Rulebook v2.0

### Current Implementation

Sudden Death currently continues indefinitely.

### Expected Behaviour

Sudden Death ends after:

```text
Five Complete Sudden Death Rounds
```

if neither player establishes the required two-point lead.

The match is then recorded as an official draw.

### Planned Release

v0.1.3

---

## ISSUE-1005

### Title

Starter Rotation Between Consecutive Matches

### Category

Implementation Gap

### Priority

Medium

### Status

Deferred

### Specification Reference

- Rematch and Rotation

### Current Implementation

The rematch system resets gameplay but does not yet rotate the starting player.

### Expected Behaviour

Each completed match advances the starting position by one player.

The rotation repeats cyclically across consecutive matches.

### Planned Release

v0.1.3

---

# Technical Debt

Technical Debt represents temporary engineering decisions that intentionally remain in the software while architectural refactoring continues.

These items are not software defects.

The software behaves correctly under the current implementation, but a more robust architecture has already been identified.

---

## ISSUE-2001

### Title

Host-Authoritative Timeout Processing

### Category

Technical Debt

### Priority

Medium

### Status

Deferred

### Specification Reference

- Time Synchronization

### Current Implementation

The room host remains responsible for timeout processing.

This implementation was intentionally adopted during the early multiplayer prototype.

### Long-Term Direction

Future versions will replace host authority with a server-authoritative timeout processor.

Possible implementations include:

- Supabase Edge Functions;
- dedicated backend services;
- authoritative game server.

### Planned Release

Post-v0.1.x

---

## ISSUE-2002

### Title

Frontend Architecture Refactoring

### Category

Technical Debt

### Priority

High

### Status

In Progress

### Current Implementation

Frontend responsibilities continue to be extracted from the original monolithic application into a layered architecture.

### Current Objectives

- component extraction;
- custom hook extraction;
- service-layer refinement;
- utility consolidation;
- improved separation of responsibilities.

### Planned Completion

Architecture Stabilization Phase

---

## ISSUE-2003

### Title

Shared Game State Simplification

### Category

Technical Debt

### Priority

Medium

### Status

Planned

### Current Implementation

The multiplayer room state continues to evolve as gameplay rules mature.

### Long-Term Direction

Establish a clearly documented and stable shared game-state model suitable for long-term maintenance and future server-authoritative validation.

### Planned Release

Post-refactoring

---

---
# Enhancement Backlog

The following enhancements extend the project beyond the currently approved gameplay specification.

Unlike Implementation Gaps, these items are optional and are evaluated according to project priorities, available evidence from playtesting, and long-term research objectives.

Implementation of these items should not delay completion of the approved architecture.

---

## ENH-3001

### Title

Gameplay Analytics Dashboard

### Category

Enhancement

### Priority

Low

### Status

Planned

### Description

Provide optional gameplay analytics including:

- score progression;
- average turn duration;
- sentence statistics;
- timeout frequency;
- match summaries.

### Notes

Intended primarily for educational use and future research.

---

## ENH-3002

### Title

Classroom Edition

### Category

Enhancement

### Priority

Medium

### Status

Planned

### Description

Develop an educational version of The Last Word War™ suitable for classroom environments.

Possible additions include:

- instructor controls;
- classroom rooms;
- educational topics;
- learning objectives;
- downloadable classroom reports.

---

## ENH-3003

### Title

Tournament Mode

### Category

Enhancement

### Priority

Low

### Status

Planned

### Description

Support organized competitive play through:

- tournament brackets;
- match progression;
- standings;
- tournament statistics.

---

## ENH-3004

### Title

Spectator Mode

### Category

Enhancement

### Priority

Low

### Status

Planned

### Description

Allow non-participating users to observe ongoing multiplayer matches without influencing gameplay.

---

## ENH-3005

### Title

Player Accounts

### Category

Enhancement

### Priority

Low

### Status

Deferred

### Description

Introduce optional player accounts supporting:

- persistent identity;
- gameplay history;
- achievements;
- personalization.

Player accounts are intentionally excluded from the current alpha phase.

---

## ENH-3006

### Title

Premium AI Gameplay Analysis

### Category

Enhancement

### Priority

Medium

### Status

Planned

### Description

Provide optional post-game AI Gameplay Analysis capable of generating educational reports covering:

- grammar;
- continuity;
- factual accuracy;
- communication quality;
- learning recommendations.

This feature remains completely independent of official gameplay.

---

# Verification Guidelines

Every issue should be independently verified before being marked as **Verified** or **Closed**.

Verification should include, where appropriate:

- successful project build;
- manual gameplay testing;
- multiplayer testing;
- regression testing;
- synchronization validation;
- documentation review.

Whenever possible, verification should be performed independently of the original implementation.

---

# Issue Lifecycle

Every issue progresses through the following lifecycle.

```text
Reported
        ↓
Confirmed
        ↓
Prioritized
        ↓
Implemented
        ↓
Verified
        ↓
Closed
```

Implementation Gaps and Technical Debt follow the same lifecycle once active development begins.

---

# Release Readiness

A planned release is considered ready when:

- all Critical issues have been resolved;
- all High-priority issues scheduled for that release have been completed;
- multiplayer synchronization remains stable;
- gameplay behaviour conforms to the approved specifications;
- documentation reflects the implemented behaviour;
- regression testing has been completed successfully.

The objective is to ensure that every release accurately represents the documented architecture and gameplay model.

---

# Relationship to Other Documents

This Engineering Issue Register complements:

- Rulebook v2.0
- Project Philosophy
- Gameplay Philosophy
- Game Design Document
- Game Engine Specification
- Match Completion Rules
- Victory Conditions
- Time Synchronization
- Session Persistence and Recovery
- Development Journal
- Release Notes

Together, these documents provide the authoritative reference for identifying, implementing, verifying, and documenting software changes.

---

# Engineering Philosophy

The Last Word War™ emphasizes architectural quality over rapid feature growth.

Engineering effort is guided by three principles:

1. Preserve approved gameplay behaviour.
2. Improve architectural quality through disciplined refactoring.
3. Align implementation with the project's constitutional documentation.

Whenever implementation differs from the approved specification, the specification remains authoritative until formally revised.

---

# Closing Remarks

The Engineering Issue Register serves as the operational guide for completing the Architecture Stabilization Phase of The Last Word War™.

As the project matures, the nature of this register is expected to evolve.

Early development focused primarily on discovering software defects.

Current development focuses on closing implementation gaps, reducing technical debt, and refining architectural quality while preserving established gameplay behaviour.

Future releases should therefore contain progressively fewer defects and increasingly concentrate on evidence-driven improvements informed by playtesting and research.

---

**End of Engineering Issue Register**
