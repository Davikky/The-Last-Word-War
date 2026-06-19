# Playtest Notes

Project: The Last Word War

Purpose:

Collect observations, feedback, usability concerns, bugs, and gameplay suggestions from external testers.

---

# Tester Template

## Tester Information

Date:

Tester:

Version:

---

## Environment

Device:

Browser:

Location:

---

## Gameplay Session

Room Code:

Number of Players:

Match Completed:

[ ] Yes

[ ] No

---

## What Worked Well?

*

*

*

---

## What Was Confusing?

*

*

*

---

## What Was Most Enjoyable?

*

*

*

---

## Bugs Observed

*

*

*

---

## Suggestions

*

*

*

---

## Would You Play Again?

[ ] Yes

[ ] No

[ ] Maybe

Comments:

---

---

# Summary Metrics

Total Testers:

0

Completed Matches:

0

Reported Bugs:

0

Feature Requests:

0


# Playtest Notes

Project: The Last Word War

---

## Playtest #1

Date: 2026-06-18

Version:

v0.1.0-alpha

Mode:

Remote Multiplayer

Participants:

Host: Oasis

Guest: Davikky

Final Score:

Host | Oasis | 15

Guest | Davikky | 17 (Winner)

---

### Test Outcome

SUCCESS

A complete multiplayer match was played from beginning to end.

All major gameplay systems were exercised, including:

* Room creation
* Room joining
* Turn synchronization
* Countdown timer
* Timeout handling
* Sudden death
* Winner determination

---

### Positive Findings

1. Room creation worked correctly.

2. Room joining worked correctly.

3. Turn synchronization worked correctly.

4. Sudden death mode activated correctly.

5. Host timeout penalty worked correctly.

6. Winner determination worked correctly.

7. Players naturally used the sentence mechanic to communicate meaningful ideas.

8. The game philosophy was well received.

9. The first-time user described the game as simple and elegant.

---

### Issues Observed

Issue 1:

Guest timeout penalty failed.

Severity:

High

Status:

Open

---

Issue 2:

Guest did not understand that the Host must start the game.

Severity:

Medium

Status:

Open

---

Issue 3:

Timeout events were not clearly visible.

Severity:

Medium

Status:

Open

---

### Design Observations

Sudden death may continue indefinitely when players remain tied.

This is currently considered a design question rather than a bug.

Further testing is required.

---

### Key Insight

Players used the game's sentence-building mechanic to communicate meaningful ideas during gameplay.

This validates the core design philosophy of The Last Word War.

---

End of Playtest #1

Follow-up Investigation

Date: 2026-06-18

Three-player local testing revealed a Sudden Death rotation issue.

The issue allowed eliminated players to continue receiving turns.

The issue was reproduced, fixed, and verified locally.

Status:

Resolved

Follow-up Investigation

Date: 2026-06-18

Three-player testing was conducted.

Verified:

- Normal rotation
- Consecutive timeouts
- Guest timeout handling
- Final round trigger
- Winner determination
- Online rematch

Issues Found:

- BUG-0004 Sudden Death rotation

Status:

Fixed and verified.

Issues Found:

- BUG-0005 Online rematch synchronization

Status:

Fixed and verified.


### Post-Playtest Stabilization

Date: 2026-06-18

Following Playtest #1, additional local and multiplayer validation was performed.

#### Issue: Sudden Death Rotation

Observation:

In a three-player match, a player who was not eligible for Sudden Death continued receiving turns.

Impact:

Sudden Death rules were violated.

Resolution:

Turn rotation was restricted to players participating in Sudden Death.

Status:

Resolved and verified.

---

#### Issue: Online Rematch Synchronization

Observation:

Different users could trigger independent match resets.

Impact:

Clients could become desynchronized after Game Over.

Resolution:

Rematch authority was assigned to the Host and synchronized through Supabase.

Status:

Resolved and verified.

---

#### Issue: Host Self-Removal

Observation:

The Host could remove themselves from the lobby during setup.

Impact:

The authoritative room controller could disappear before match start.

Resolution:

Hosts may remove guests but cannot remove themselves.

Status:

Resolved and verified.
---

### Additional Stabilization

Timeout notifications were implemented and synchronized across clients.

A regression temporarily prevented timeout processing.

The issue was identified, corrected, and verified.

Status:

Resolved.
---

### Additional Verification Completed

Verified Successfully:

* Three-player multiplayer rotation
* Consecutive timeout handling
* Guest timeout penalties
* Host timeout penalties
* Final Round transition
* Sudden Death transition
* Winner determination
* Online rematch synchronization
* Lobby authority enforcement

---
### Additional Stabilization

#### Inactivity Termination Rule

Date: 2026-06-19

Objective:

Prevent abandoned matches from remaining active indefinitely.

Implementation:

A consecutive timeout counter was introduced.

The counter increments whenever a player's turn expires without a valid sentence submission.

Any successful sentence submission immediately resets the counter.

Verification Performed:

Test A:

Timeout × 5 consecutively

Result:

Match automatically entered GAME_OVER state.

No winner declared.

Final standings displayed correctly.

Pass.

---

Test B:

Timeout → Timeout → Valid Sentence → Timeout

Result:

Valid sentence submission reset inactivity counter as intended.

Subsequent timeout was counted as the first inactivity event.

Pass.

---

Outcome:

The Inactivity Termination Rule is considered stable and ready for public playtesting.

Status:

Resolved and Verified.
---


### Current Assessment

The multiplayer alpha is considered stable for continued usability testing and external playtesting.



