/**
 * ------------------------------------------------------------------------
 * GameStatusPanel
 * ------------------------------------------------------------------------
 * Displays the current gameplay status.
 *
 * This is a presentational component responsible only for rendering the
 * current game phase, active player, current word, and remaining turn time.
 *
 * It intentionally contains no gameplay logic or state mutations.
 * ------------------------------------------------------------------------
 */

import { GAME_PHASES } from '../constants/gamePhases';

function GameStatusPanel({
	gamePhase,
	currentPlayerName,
	currentWord,
	timeLeft,
}) {
	return (
		<>
			<h2>
				{gamePhase === GAME_PHASES.SUDDEN_DEATH
					? 'Sudden Death'
					: gamePhase === GAME_PHASES.FINAL_ROUND
						? 'Final Round'
						: 'Game Started'}
			</h2>

			<p>
				<strong>Current Player:</strong> {currentPlayerName}
			</p>

			<p>
				<strong>Current Word:</strong> {currentWord}
			</p>

			<p>
				<strong>Time Remaining:</strong> {timeLeft} seconds
			</p>
		</>
	);
}

export default GameStatusPanel;
