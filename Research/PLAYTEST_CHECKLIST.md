# PLAYTEST VERIFICATION CHECKLIST

Project: **The Last Word War™**

Project Steward:

Victor A. Adeyemi

Organization:

Da-aim Services

Target Release:

v0.1.3 (Architecture Stabilization)

Status:

Ready

---

# Purpose

This checklist is used during Playtest #2 to verify that the implementation of The Last Word War™ conforms to the approved gameplay specifications.

Unlike the Playtest Protocol, which explains how the playtest should be conducted, this document records whether the software behaves correctly during actual gameplay.

Every checklist item should be marked as:

- Pass
- Fail
- Not Tested
- Not Applicable

Any failed item should be documented in the Engineering Issue Register.

---

# Session Information

Date:

__________________________

Observer:

__________________________

Players:

__________________________

Number of Players:

__________________________

Platform(s):

__________________________

Browser(s):

__________________________

Build / Version:

__________________________

Notes:

__________________________________________________________

---

# Phase 1 — Room Setup

## Room Creation

| Check | Status |
|--------|--------|
| Room can be created successfully | ☐ Pass ☐ Fail ☐ N/A |
| Room code generated correctly | ☐ Pass ☐ Fail ☐ N/A |
| Room code can be shared | ☐ Pass ☐ Fail ☐ N/A |

---

## Room Joining

| Check | Status |
|--------|--------|
| Players can join using room code | ☐ Pass ☐ Fail ☐ N/A |
| Duplicate player names rejected | ☐ Pass ☐ Fail ☐ N/A |
| Player list synchronized | ☐ Pass ☐ Fail ☐ N/A |
| Host correctly identified | ☐ Pass ☐ Fail ☐ N/A |

---

## Lobby

| Check | Status |
|--------|--------|
| Players appear correctly | ☐ Pass ☐ Fail ☐ N/A |
| Host can remove guests | ☐ Pass ☐ Fail ☐ N/A |
| Host cannot remove self | ☐ Pass ☐ Fail ☐ N/A |
| Match starts successfully | ☐ Pass ☐ Fail ☐ N/A |
| Room closes after match begins* | ☐ Pass ☐ Fail ☐ N/A |

\*Pending until implementation.

---

# Phase 2 — Core Gameplay

## Turn Management

| Check | Status |
|--------|--------|
| Correct player receives turn | ☐ Pass ☐ Fail ☐ N/A |
| Turn rotates correctly | ☐ Pass ☐ Fail ☐ N/A |
| Turn indicator remains accurate | ☐ Pass ☐ Fail ☐ N/A |

---

## Sentence Rules

| Check | Status |
|--------|--------|
| Current Word displayed correctly | ☐ Pass ☐ Fail ☐ N/A |
| Current Word updates after every accepted sentence | ☐ Pass ☐ Fail ☐ N/A |
| Sentence must begin with Current Word | ☐ Pass ☐ Fail ☐ N/A |
| Invalid sentence rejected | ☐ Pass ☐ Fail ☐ N/A |

---

## Score Tracking

| Check | Status |
|--------|--------|
| Score increments correctly | ☐ Pass ☐ Fail ☐ N/A |
| Standings update correctly | ☐ Pass ☐ Fail ☐ N/A |
| Tie handling correct | ☐ Pass ☐ Fail ☐ N/A |

---

## Timeout Behaviour

| Check | Status |
|--------|--------|
| Countdown synchronized | ☐ Pass ☐ Fail ☐ N/A |
| Timeout notification displayed | ☐ Pass ☐ Fail ☐ N/A |
| Timeout penalty applied | ☐ Pass ☐ Fail ☐ N/A |
| Turn advances after timeout | ☐ Pass ☐ Fail ☐ N/A |
| Consecutive timeout tracking* | ☐ Pass ☐ Fail ☐ N/A |

\*Pending until implementation.

---

---
# Phase 3 — Match Completion

## Final Round

| Check | Status |
|--------|--------|
| Final Round triggers at 10 points | ☐ Pass ☐ Fail ☐ N/A |
| All remaining players receive one final turn | ☐ Pass ☐ Fail ☐ N/A |
| Final Round messaging is clear | ☐ Pass ☐ Fail ☐ N/A |

---

## Sudden Death

| Check | Status |
|--------|--------|
| Sudden Death triggered correctly | ☐ Pass ☐ Fail ☐ N/A |
| Only tied players participate | ☐ Pass ☐ Fail ☐ N/A |
| Turn rotation restricted to tied players | ☐ Pass ☐ Fail ☐ N/A |
| Winner declared after two-point lead | ☐ Pass ☐ Fail ☐ N/A |
| Five-round draw limit* | ☐ Pass ☐ Fail ☐ N/A |

\*Pending until implementation.

---

## Exceptional Match Completion

| Check | Status |
|--------|--------|
| Player removed after three consecutive timeouts* | ☐ Pass ☐ Fail ☐ N/A |
| Match ends when only one active player remains* | ☐ Pass ☐ Fail ☐ N/A |
| Match abandoned when no active players remain* | ☐ Pass ☐ Fail ☐ N/A |

\*Pending until implementation.

---

## Official Match Result

| Check | Status |
|--------|--------|
| Winner displayed correctly | ☐ Pass ☐ Fail ☐ N/A |
| Draw displayed correctly (if applicable) | ☐ Pass ☐ Fail ☐ N/A |
| Final standings correct | ☐ Pass ☐ Fail ☐ N/A |
| Match enters Game Over state | ☐ Pass ☐ Fail ☐ N/A |

---

# Phase 4 — Multiplayer Reliability

## Synchronization

| Check | Status |
|--------|--------|
| Player list synchronized | ☐ Pass ☐ Fail ☐ N/A |
| Turn synchronization correct | ☐ Pass ☐ Fail ☐ N/A |
| Score synchronization correct | ☐ Pass ☐ Fail ☐ N/A |
| Current Word synchronized | ☐ Pass ☐ Fail ☐ N/A |
| Match completion synchronized | ☐ Pass ☐ Fail ☐ N/A |

---

## Browser Session Recovery

| Check | Status |
|--------|--------|
| Browser refresh restores session | ☐ Pass ☐ Fail ☐ N/A |
| Session resumes correctly | ☐ Pass ☐ Fail ☐ N/A |
| Gameplay continues normally after recovery | ☐ Pass ☐ Fail ☐ N/A |

---

## Rematch

| Check | Status |
|--------|--------|
| Rematch starts successfully | ☐ Pass ☐ Fail ☐ N/A |
| All players synchronize correctly | ☐ Pass ☐ Fail ☐ N/A |
| Previous match state cleared | ☐ Pass ☐ Fail ☐ N/A |
| Starter rotation functions correctly* | ☐ Pass ☐ Fail ☐ N/A |

\*Pending until implementation.

---

# Phase 5 — User Experience

## Interface

| Check | Status |
|--------|--------|
| Landing page understandable | ☐ Pass ☐ Fail ☐ N/A |
| Quick Rules sufficient | ☐ Pass ☐ Fail ☐ N/A |
| Current player clearly indicated | ☐ Pass ☐ Fail ☐ N/A |
| Scores easy to understand | ☐ Pass ☐ Fail ☐ N/A |
| Notifications understandable | ☐ Pass ☐ Fail ☐ N/A |

---

## Player Understanding

| Check | Status |
|--------|--------|
| Players understand the sentence rule | ☐ Pass ☐ Fail ☐ N/A |
| Players understand turn order | ☐ Pass ☐ Fail ☐ N/A |
| Players understand timeout penalties | ☐ Pass ☐ Fail ☐ N/A |
| Players understand Final Round | ☐ Pass ☐ Fail ☐ N/A |
| Players understand why the match ended | ☐ Pass ☐ Fail ☐ N/A |

---

# Participant Feedback Summary

## Confusing Moments

______________________________________________________________

______________________________________________________________

______________________________________________________________

---

## Positive Reactions

______________________________________________________________

______________________________________________________________

______________________________________________________________

---

## Suggestions for Improvement

______________________________________________________________

______________________________________________________________

______________________________________________________________

---

## Technical Issues Observed

______________________________________________________________

______________________________________________________________

______________________________________________________________

---

## Engineering Issue Register Updated?

☐ Yes

☐ No

Issue Number(s):

______________________________________________________________

---

# Overall Session Assessment

| Category | Rating |
|----------|:------:|
| Gameplay Flow | ☐ Excellent ☐ Good ☐ Fair ☐ Poor |
| Multiplayer Stability | ☐ Excellent ☐ Good ☐ Fair ☐ Poor |
| User Experience | ☐ Excellent ☐ Good ☐ Fair ☐ Poor |
| Rule Clarity | ☐ Excellent ☐ Good ☐ Fair ☐ Poor |
| Overall Enjoyment | ☐ Excellent ☐ Good ☐ Fair ☐ Poor |

---

# Observer Sign-off

Observer:

____________________________________

Date:

____________________________________

Overall Recommendation:

☐ Ready for continued Architecture Stabilization

☐ Additional implementation required

☐ Major issues identified

Comments:

______________________________________________________________

______________________________________________________________

______________________________________________________________

---

**End of Playtest Verification Checklist**
