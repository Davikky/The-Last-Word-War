/**
 * ------------------------------------------------------------------------
 * RoomSetupPanel
 * ------------------------------------------------------------------------
 * Renders the setup interface used before gameplay begins.
 *
 * Responsibilities:
 * - Display the quick rules.
 * - Create or join an online room.
 * - Display room information.
 * - Allow the host to start a new play session.
 *
 * This component is presentational only. All state management and
 * game orchestration remain in App.jsx.
 * ------------------------------------------------------------------------
 */

function RoomSetupPanel({
	roomCode,
	joinRoomCode,
	setJoinRoomCode,
	createRoom,
	joinRoom,
}) {
	return (
		<>
			<div className="quick-rules">
				<h3>📜 Quick Rules</h3>

				<p>🎯 Create or Join a Room.</p>

				<p>🔄 Players take turns creating sentences.</p>

				<p>
					📝 Your sentence must begin with the LAST WORD of the previous sentence.
				</p>

				<p>✅ Valid play = +1 point.</p>

				<p>⏰ Timeout = -1 point.</p>

				<p>🏁 First player to 10 points triggers the Final Round.</p>

				<p>⚔️ Tied leaders enter Sudden Death.</p>

				<p>🤝 Interact meaningfully and have fun.</p>
			</div>

			<div className="online-room-panel">
				<p>CREATE a room or JOIN one REMOTELY:</p>

				{!roomCode && (
					<button
						className="start-button"
						onClick={createRoom}
					>
						Create Room
					</button>
				)}

				{!roomCode && (
					<div className="join-room-panel">
						<input
							type="text"
							value={joinRoomCode}
							onChange={(event) => setJoinRoomCode(event.target.value)}
							placeholder="Enter room code"
						/>

						<button
							className="start-button"
							onClick={joinRoom}
						>
							Join Room
						</button>
					</div>
				)}
			</div>
		</>
	);
}

export default RoomSetupPanel;
