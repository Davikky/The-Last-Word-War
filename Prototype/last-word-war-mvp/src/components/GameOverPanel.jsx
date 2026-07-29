/**
 * ------------------------------------------------------------------------
 * GameOverPanel
 * ------------------------------------------------------------------------
 * Displays the end-of-game summary.
 *
 * Responsibilities:
 * - Display the winner or draw outcome.
 * - Display the final standings.
 * - Render rematch and new game controls.
 * - Provide the feedback link.
 *
 * This component is presentational only.
 * ------------------------------------------------------------------------
 */

function GameOverPanel({
	winner,
	gameOverReason,
	drawPlayers,
	finalStandings,
	roomCode,
	startRematch,
	exitRoom,
}) {
	return (
		<div className="winner-panel">
			<h2>🏆 Game Over</h2>

			{winner ? (
				<p className="winner-name">
					<strong>Winner:</strong> {winner.name}
				</p>
			) : (
				<div className="winner-name">
					<strong>No winner declared.</strong>
					<br />
					{gameOverReason === 'INACTIVITY' && 'Match ended due to inactivity.'}
					{gameOverReason === 'SUDDEN_DEATH_DRAW' && 'Sudden Death ended in a draw.'}

					{drawPlayers.length > 0 && (
						<>
							<h3>Draw Players</h3>
							<ul>
								{drawPlayers.map((player, index) => (
									<li key={index}>{player.name}</li>
								))}
							</ul>
						</>
					)}
				</div>
			)}

			<h3>Final Standings</h3>

			<ol className="standings-list">
				{finalStandings.map((player, index) => (
					<li key={index}>
						<span>
							{player.rank}
							{player.isTied ? 'T' : ''}. {player.name}
						</span>

						<span>{player.score} points</span>
					</li>
				))}
			</ol>

			<button className="start-button" onClick={startRematch}>
				{roomCode ? 'Start Rematch' : 'Play Again'}
			</button>

			<button
				className="start-button"
				onClick={exitRoom}
			>
				Start New Play
			</button>

			<a
				className="feedback-button"
				href="https://forms.gle/XBmDWmfaSz9M8dZn8"
				target="_blank"
				rel="noreferrer"
			>
				Leave Feedback
			</a>
		</div>
	);
}

export default GameOverPanel;
