Implementation Plan for Inactivity and Draw

Rule 1: Inactivity Termination

[ ] Add consecutiveTimeouts state
[ ] Increment on timeout
[ ] Reset on valid submission
[ ] Trigger GAME_OVER at 5
[ ] Add inactivity game over message
[ ] Verify multiplayer synchronization

Rule 2: Sudden Death Draw

[ ] Add suddenDeathRoundCount state
[ ] Detect completion of a sudden death round
[ ] Increment round counter
[ ] Trigger draw at 5 rounds
[ ] Add draw game over message
[ ] Verify 2-player case
[ ] Verify 3-player case
[ ] Verify multiplayer synchronization

Documentation

[ ] Update BUG_TRACKER if regressions appear
[ ] Update PLAYTEST_NOTES
