# Bug Tracker

Project: The Last Word War

---

## BUG-0001

Date: 2026-06-18

Title:

Winner Not Declared After Final Round

Status:

RESOLVED

Reported During:

Remote Match Test v0.1.0

Description:

The game continued indefinitely after a winner had emerged.

Expected Behaviour:

The game should enter GAME_OVER state and display the winner.

Root Cause:

Winner determination was not being triggered correctly at the end of the Final Round cycle.

Fix:

Updated final-round completion logic and winner synchronization.

Verification:

Remote multiplayer match completed successfully and winner displayed on both clients.

Resolved In:

v0.1.0-alpha

---

## BUG-0002

Date: 2026-06-18

Title:

Online Current Word Failed To Update

Status:

RESOLVED

Reported During:

UX Improvement Round 1

Description:

After a valid sentence submission, the displayed Current Word remained unchanged.

Because the Current Word never changed, the sentence validation rule:

"Sentence must begin with the current word"

was effectively bypassed.

Expected Behaviour:

The Current Word should update to the extracted last word after every valid submission.

Root Cause:

The online game-state update did not explicitly synchronize currentWord and currentPlayerIndex into Supabase.

Fix:

Added explicit synchronization:

* currentWord: lastWord
* currentPlayerIndex: nextPlayer

during online state updates.

Verification:

1. Current Word updates after every valid submission.
2. Invalid first words are rejected.
3. Rule enforcement restored.
4. Multiplayer synchronization confirmed.

Resolved In:

v0.1.0-alpha

---

# Open Bugs

None

---

# Future Improvements

Not bugs, but known improvements:

* Feedback button
* External playtesting
* Mobile layout refinement
* Component refactor
* AI referee integration

