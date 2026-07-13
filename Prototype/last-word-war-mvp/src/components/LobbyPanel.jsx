/**
 * ------------------------------------------------------------------------
 * LobbyPanel
 * ------------------------------------------------------------------------
 * Displays the lobby interface before gameplay begins.
 *
 * Responsibilities:
 * - Allow a player to enter the lobby.
 *
 * This component is presentational only.
 * ------------------------------------------------------------------------
 */

function LobbyPanel({
	roomCode,
	hasJoinedLobby,
	localPlayerName,
	setLocalPlayerName,
	joinLobby,
}) {
	if (!roomCode || hasJoinedLobby) {
		return null;
	}

	return (
		<div className="join-room-panel">
			<input
				type="text"
				value={localPlayerName}
				onChange={(event) => setLocalPlayerName(event.target.value)}
				placeholder="Enter your player name"
			/>

			<button
				className="start-button"
				onClick={joinLobby}
			>
				Enter Lobby to continue...
			</button>
		</div>
	);
}

export default LobbyPanel;
