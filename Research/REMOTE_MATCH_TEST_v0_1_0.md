# Remote Match Test v0.1.0

Date: 18-06-2026

Tester: Victor A. Adeyemi

---

# Objective

Verify that a complete remote multiplayer match can be played from beginning to end using two browser sessions connected through Supabase.

---

# Environment

Host Browser: Browser tab1 (Firefox)

---

Guest Browser: Browser tab2 (Firefox)

---

Room Code: AA563

---

---

# Test 1: Room Creation

Steps:

1. Host creates room.

Expected:

* Room code generated.
* Room displayed.
* No errors.

Result:

[x] Pass

[ ] Fail

Notes: Worked as expected.

---

---

# Test 2: Room Join

Steps:

1. Guest enters room code.
2. Guest joins room.

Expected:

* Room found.
* Guest enters room successfully.

Result:

[x] Pass

[ ] Fail

Notes: Guest enters room successfully

---

---

# Test 3: Lobby Synchronization

Steps:

1. Host enters lobby.
2. Guest enters lobby.

Expected:

* Both players visible in both browsers.

Result:

[x] Pass

[ ] Fail

Notes: Bothe players are visible in both browsers

---

---

# Test 4: Online Game Start

Steps:

1. Host clicks Start Online Game.

Expected:

* Both browsers enter ACTIVE phase.
* Countdown visible.

Result:

[x] Pass

[ ] Fail

Notes: exactly as expected

---

---

# Test 5: Sentence Synchronization

Steps:

1. Host submits sentence.

Expected:

* Sentence history updates.
* Score updates.
* Turn advances.
* Guest sees update.

Result:

[x] Pass

[ ] Fail

Notes: exactly as expected

---

---

# Test 6: Guest Turn

Steps:

1. Guest submits sentence.

Expected:

* Score updates.
* Current word updates.
* Turn advances.
* Host sees update.

Result:

[x] Pass

[ ] Fail

Notes: as expected

---

---

# Test 7: Shared Countdown

Expected:

* Both browsers show nearly identical countdown.

Result:

[x] Pass

[ ] Fail

Notes: as expected

---

---

# Test 8: Timeout Synchronization

Steps:

1. Allow timer to expire.

Expected:

* Penalty applied once.
* Turn advances once.
* Both browsers synchronize.
* New timer starts.

Result:

[x] Pass

[ ] Fail

Notes: as expected

---

---

# Test 9: Final Round Trigger

Steps:

1. Continue play until a player reaches 10 points.

Expected:

* Final Round begins.
* Both browsers update.

Result:

[x] Pass

[ ] Fail

Notes:

---

---

# Test 10: Game Completion

Expected:

* Winner determined correctly.
* Winner displayed on both browsers.
* Standings match.

Result:

[ ] Pass

[x] Fail

Notes: Game continued indefinitely even when a winner emerges

---

---

# Summary

Total Tests:

10

Passed: 9

---

Failed: 1

---

Overall Status:

[ ] Ready for v0.1.0 Tag

[x] Requires Fixes

---

# Bugs Found

1. 

2.

3.

---

# Retest Required

[x] Yes

[ ] No

