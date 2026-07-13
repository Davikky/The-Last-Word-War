# PLAYTEST NOTES

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

This document records observations collected during structured playtesting of **The Last Word War™**.

Unlike the Playtest Protocol, which defines how playtesting should be conducted, and the Playtest Verification Checklist, which records implementation verification, this document preserves what actually occurred during each playtesting session.

Its purpose is to document:

- player behaviour;
- gameplay observations;
- usability findings;
- research observations;
- technical observations;
- lessons learned.

Engineering defects identified during playtesting should be recorded separately in the **Engineering Issue Register**.

Likewise, architectural decisions resulting from playtesting should be recorded in the **Development Journal**.

---

# Observation Philosophy

Playtesting is conducted to understand both the software and the people using it.

The objective is not simply to discover software defects.

Instead, each playtest seeks to determine whether the implemented software successfully delivers the intended Human ↔ Human gameplay experience.

Observers should therefore record both objective and subjective observations.

Examples include:

- player confusion;
- spontaneous collaboration;
- competitive behaviour;
- meaningful conversation;
- unexpected gameplay strategies;
- usability concerns;
- implementation issues.

Whenever possible, observations should describe what occurred rather than immediately suggesting solutions.

---

# Observation Guidelines

Observations should remain objective.

Rather than writing:

> "Players disliked the interface."

prefer:

> "Three of four players hesitated before locating the Join Room button."

Whenever possible, observations should distinguish between:

- gameplay observations;
- usability observations;
- technical observations;
- research observations.

Separating these categories improves both engineering analysis and future research.

---

# Standard Playtest Session Template

The following template should be completed for every structured playtest session.

---

## Session Information

Date:

________________________

Observer:

________________________

Software Version:

________________________

Number of Players:

________________________

Location:

________________________

Devices:

________________________

Browsers:

________________________

---

## Session Summary

Match Completed:

☐ Yes

☐ No

Match Result:

____________________________________

Duration:

____________________________________

---

## Gameplay Observations

Record observations relating to gameplay itself.

Examples include:

- understanding of the sentence rule;
- turn order awareness;
- score awareness;
- Final Round understanding;
- Sudden Death understanding;
- player interaction.

Observations:

____________________________________________________

____________________________________________________

____________________________________________________

---

## Usability Observations

Record observations relating to the interface.

Examples include:

- confusing controls;
- navigation difficulties;
- unclear terminology;
- onboarding issues.

Observations:

____________________________________________________

____________________________________________________

____________________________________________________

---

## Technical Observations

Record implementation behaviour.

Examples include:

- synchronization issues;
- browser issues;
- timeout behaviour;
- unexpected software behaviour.

Engineering defects should later be transferred to the Engineering Issue Register.

Observations:

____________________________________________________

____________________________________________________

____________________________________________________

---

## Research Observations

Record observations relevant to the project's research programme.

Examples include:

- Human ↔ Human interaction;
- negotiation of meaning;
- collaborative behaviour;
- creativity;
- educational discussion;
- communication quality.

Observations:

____________________________________________________

____________________________________________________

____________________________________________________

---

## Participant Comments

Record representative comments from participants.

____________________________________________________

____________________________________________________

____________________________________________________

---

## Observer Summary

Overall assessment:

____________________________________________________

____________________________________________________

____________________________________________________

---

## Follow-up Actions

☐ Engineering Issue Register updated

☐ Development Journal updated

☐ Release Notes updated

☐ Documentation review required

☐ Additional playtesting recommended

---

---
# Playtest #1

Date:

18 June 2026

Software Version:

v0.1.0-alpha

Playtest Type:

Remote Multiplayer Validation

Status:

Completed

---

# Objective

Playtest #1 represented the first complete validation of The Last Word War™ in a live online multiplayer environment.

The primary objectives were to determine whether:

- remote multiplayer gameplay functioned correctly;
- synchronization remained consistent across connected players;
- players naturally understood the core gameplay mechanic;
- the project philosophy translated successfully into actual gameplay.

---

# Participants

Host:

Oasis

Guest:

Davikky

Number of Players:

2

Environment:

Remote multiplayer session

---

# Session Summary

The match successfully progressed through every major gameplay phase from room creation to official match completion.

Both participants completed the match using independent clients connected through the multiplayer backend.

The playtest demonstrated that the core gameplay concept remained engaging outside the local development environment.

---

# Gameplay Timeline

The following gameplay stages were successfully completed.

✓ Room creation

✓ Room joining

✓ Lobby synchronization

✓ Match start

✓ Sentence submission

✓ Current Word progression

✓ Score progression

✓ Timeout handling

✓ Final Round

✓ Sudden Death

✓ Winner determination

✓ Game Over

The complete gameplay lifecycle was successfully exercised during a single multiplayer session.

---

# Gameplay Observations

Players quickly understood the sentence-building mechanic after only a small number of turns.

Rather than constructing isolated sentences, participants naturally attempted to continue one another's ideas.

Competition emerged without reducing conversational quality.

The sentence-chain mechanic encouraged participants to think about both gameplay strategy and communication simultaneously.

This behaviour closely matched the project's intended gameplay philosophy.

---

# Usability Observations

Overall onboarding was successful.

Players were able to:

- create rooms;
- join rooms;
- begin gameplay;
- submit sentences;
- follow score progression.

However, several areas of confusion were observed.

Participants required additional clarification regarding:

- host responsibilities;
- timeout behaviour;
- visibility of gameplay notifications.

These observations later informed subsequent user experience improvements.

---

# Technical Observations

Overall multiplayer synchronization remained stable throughout the session.

Successful observations included:

- room synchronization;
- turn synchronization;
- score synchronization;
- Current Word synchronization;
- winner synchronization.

Several implementation issues were nevertheless identified during the playtest.

These issues were subsequently investigated, documented within the Engineering Issue Register, and resolved during the Architecture Stabilization Phase.

---

# Research Observations

The most significant observation from Playtest #1 was unrelated to software.

Players naturally used the sentence mechanic to communicate meaningful ideas rather than merely attempting to maximize their scores.

Conversation emerged organically through gameplay.

Participants frequently expanded, clarified, or redirected previous ideas while remaining within the rules of the game.

This observation provided early evidence supporting the project's central hypothesis that carefully designed computational constraints can encourage meaningful Human ↔ Human interaction.

---

# Participant Feedback

Participants described the gameplay as:

- simple;
- engaging;
- conversational;
- intuitive after a short learning period.

The sentence-chain mechanic was viewed as both entertaining and intellectually engaging.

Players indicated interest in participating again following the conclusion of the match.

---

# Lessons Learned

Playtest #1 demonstrated that the core gameplay concept successfully translated from prototype into a functioning online multiplayer experience.

The session also revealed that software stability alone is insufficient.

Player understanding of the interface, notifications, and gameplay flow is equally important.

Future development therefore expanded its emphasis beyond implementation to include usability, onboarding, and player experience.

---

# Actions Taken

Following completion of Playtest #1:

- engineering issues were documented within the Engineering Issue Register;
- architectural improvements were recorded in the Development Journal;
- multiplayer synchronization was further strengthened;
- usability improvements were scheduled for subsequent development;
- additional playtesting was approved.

Playtest #1 therefore served as both a technical validation milestone and the foundation for evidence-driven refinement throughout the remainder of the Architecture Stabilization Phase.

---

---
# Overall Findings

The observations recorded throughout structured playtesting provide an increasingly clear picture of both the strengths of the software and the behaviour of its participants.

Although additional playtesting remains necessary, several consistent patterns have already emerged.

## Gameplay

Players generally understand the sentence-building mechanic after only a small number of turns.

Once the core rule is understood, gameplay flows naturally with relatively little intervention from the observer.

The transition from learning the rules to actively participating occurs quickly for most participants.

---

## Human Interaction

One of the most significant findings is that players naturally communicate through gameplay.

Rather than constructing isolated sentences simply to earn points, participants frequently:

- extend previous ideas;
- introduce new perspectives;
- challenge one another's reasoning;
- collaborate to build coherent conversations.

This behaviour consistently supports the project's Human ↔ Human philosophy.

---

## User Experience

Most usability concerns have been associated with learning the interface rather than understanding the gameplay itself.

Observed areas requiring continued refinement include:

- onboarding;
- room creation;
- host responsibilities;
- timeout visibility;
- gameplay notifications;
- match completion messaging.

These observations have informed ongoing user experience improvements.

---

## Software Behaviour

Multiplayer synchronization has demonstrated progressive improvement throughout development.

As architectural refactoring continues, playtesting increasingly focuses on confirming behavioural consistency rather than discovering fundamental gameplay defects.

Engineering issues identified during playtesting are now documented separately within the Engineering Issue Register.

---

# Emerging Research Themes

Playtesting has begun to generate observations that extend beyond software validation.

Several recurring research themes have emerged.

## Human ↔ Human Interaction

The sentence-chain mechanic encourages participants to pay close attention to one another's ideas.

Gameplay rewards active listening rather than isolated participation.

---

## Computational Facilitation

Players rarely discuss the software itself during successful gameplay.

Instead, the software gradually becomes an invisible facilitator while conversation becomes the primary focus.

This observation provides encouraging evidence supporting the project's Computational Facilitation philosophy.

---

## Communication

Participants frequently adapt their language in response to previous sentences.

This demonstrates that gameplay encourages:

- contextual reasoning;
- conversational continuity;
- collaborative communication.

---

## Learning

Many participants improve noticeably within a single match.

Rather than relying on explicit instruction, understanding develops naturally through participation.

This suggests that the gameplay mechanic possesses considerable educational potential.

---

# Lessons Learned

Several important lessons have emerged from early playtesting.

## Simplicity Encourages Participation

The relatively simple gameplay rule allows players to begin interacting quickly.

Complexity arises naturally from conversation rather than from complicated software mechanics.

---

## Software Should Remain Invisible

The most enjoyable sessions occur when players focus almost entirely on one another rather than on the software.

Successful implementation therefore minimizes unnecessary interface distractions.

---

## Documentation Matters

Improved documentation has significantly reduced ambiguity during development.

Synchronizing gameplay rules, software architecture, and implementation has made future development substantially more predictable.

---

## Evidence Should Guide Development

Playtesting continues to reinforce the importance of evidence-driven development.

Observed player behaviour provides stronger guidance than assumptions regarding how players might interact with the software.

---

# Future Playtesting Strategy

Future playtesting should continue expanding both engineering validation and research observation.

Primary objectives include:

- validating remaining gameplay implementations scheduled for v0.1.3;
- evaluating multiplayer reliability under broader conditions;
- observing larger groups of first-time players;
- collecting structured usability feedback;
- gathering evidence for future academic publications.

As the software matures, future playtesting is expected to shift progressively from defect discovery toward behavioural analysis and educational evaluation.

---

# Relationship to Other Documents

This document complements:

- Playtest #2 Protocol
- Playtest Verification Checklist
- Engineering Issue Register
- Development Journal
- Project State
- Release Notes
- Feedback Collection Plan

Together, these documents establish a complete workflow for:

1. planning playtests;
2. executing structured validation;
3. recording observations;
4. tracking engineering issues;
5. documenting development decisions;
6. informing future research.

---

# Closing Remarks

Playtesting occupies a central role within the development methodology of **The Last Word War™**.

Each session provides two complementary forms of evidence.

The first evaluates whether the software faithfully implements the approved gameplay specifications.

The second explores how people naturally communicate, collaborate, and compete within the computational framework provided by the software.

As development continues, this document will serve as the permanent observational record of the project's evolution from an experimental multiplayer prototype into a mature human-centered interaction platform.

The insights recorded here will continue to guide engineering decisions, gameplay refinement, usability improvements, and future research publications.

---

**End of Playtest Notes**

