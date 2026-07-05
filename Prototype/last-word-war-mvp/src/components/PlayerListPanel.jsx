/**
 * Displays the current player roster together with
 * scores and lobby status information.
 *
 * Responsibilities:
 * - Render the list of players.
 * - Display lobby waiting messages.
 * - Allow the host to remove players during setup.
 * - Display an empty-state message when no players exist.
 *
 * Refactor history:
 * Extracted from App.jsx during the component
 * refactoring phase (v0.1.1) to improve separation
 * of presentation and game orchestration.
 */
function PlayerListPanel({
	players,
	roomCode,
	hasJoinedLobby,
	gamePhase,
	isHost,
	hostName,
	removePlayer,
	GAME_PHASES,
}) {

	/**
	 * Renders the lobby status shown before gameplay
	 * begins in online multiplayer rooms.
	 */
	function renderLobbyStatus() {
		if (
			!roomCode ||
			!hasJoinedLobby ||
			gamePhase !== GAME_PHASES.SETUP
		) {
			return null;
		}

		return (
			<div className="lobby-status">
				{isHost ? (
					<p>
						<strong>You are the Host.</strong>
						<br />
						Start the game when everyone has joined.
					</p>
				) : (
					<p>
						<strong>
							Waiting for {hostName || 'Host'} to Start the Game...
						</strong>
					</p>
				)}
			</div>
		);
	}

	return (
		<div className="players-section">
			<h2>Players</h2>

			{renderLobbyStatus()}

			{players.length === 0 ? (
				<p>No players added yet.</p>
			) : (
				<ul>
					{players.map((player, index) => (
						<li key={index}>
							<span>
								{index + 1}. {player.name} — {player.score} points
							</span>

							{gamePhase === GAME_PHASES.SETUP &&
								(!roomCode || isHost) &&
								player.name !== hostName && (
									<button onClick={() => removePlayer(index)}>
										Remove
									</button>
								)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default PlayerListPanel;
