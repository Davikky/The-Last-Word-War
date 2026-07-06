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

function RoomSetupPanel() {
	return (
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
	);
}

export default RoomSetupPanel;
