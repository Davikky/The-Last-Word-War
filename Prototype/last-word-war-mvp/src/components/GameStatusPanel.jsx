/**
 * ------------------------------------------------------------------------
 * GameStatusPanel
 * ------------------------------------------------------------------------
 * Displays the active gameplay interface.
 *
 * Responsibilities:
 * - Display the current game phase.
 * - Display the active player.
 * - Display the current required word.
 * - Display the remaining turn time.
 * - Render the sentence submission form.
 * - Render referee controls after a sentence is submitted.
 *
 * This component is presentational only. App.jsx owns all gameplay state,
 * validation, scoring, turn progression, and persistence.
 * ------------------------------------------------------------------------
 */

import { GAME_PHASES } from '../constants/gamePhases';

function GameStatusPanel({
	gamePhase,
	players,
	currentPlayerIndex,
	currentWord,
	timeLeft,
	sentence,
	setSentence,
	submitSentence,
	lastSubmittedPlayerIndex,
	updateScore,
}) {
	return (
		<div className="game-panel">
			<h2>
				{gamePhase === GAME_PHASES.SUDDEN_DEATH
					? 'Sudden Death'
					: gamePhase === GAME_PHASES.FINAL_ROUND
						? 'Final Round'
						: 'Game Started'}
			</h2>

			<p>
				<strong>Current Player:</strong> {players[currentPlayerIndex].name}
			</p>

			<p>
				<strong>Current Word:</strong> {currentWord}
			</p>

			<p>
				<strong>Time Remaining:</strong> {timeLeft} seconds
			</p>

			<form onSubmit={submitSentence}>
				<input
					type="text"
					value={sentence}
					onChange={(event) => setSentence(event.target.value)}
					placeholder="Enter a sentence"
				/>

				<button type="submit">
					Submit Sentence
				</button>
			</form>

			{lastSubmittedPlayerIndex !== null && (
				<div className="referee-buttons">
					<button onClick={() => updateScore(lastSubmittedPlayerIndex, -1)}>
						Undo Point -1
					</button>

					<button onClick={() => updateScore(lastSubmittedPlayerIndex, -2)}>
						Penalty -2
					</button>
				</div>
			)}
		</div>
	);
}

export default GameStatusPanel;
