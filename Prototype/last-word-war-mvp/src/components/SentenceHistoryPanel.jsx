/**
 * Displays the chronological history of all accepted
 * sentences submitted during a match.
 *
 * Responsibilities:
 * - Render submitted sentences in order.
 * - Display the player responsible for each sentence.
 * - Hide itself when no sentence history exists.
 *
 * Refactor history:
 * Extracted from App.jsx during the component
 * refactoring phase (v0.1.1) to reduce UI coupling
 * and improve maintainability.
 */
function SentenceHistoryPanel({ sentenceHistory }) {

	/**
	 * Avoid rendering an empty history container
	 * before gameplay has begun.
	 */
	if (sentenceHistory.length === 0) {
		return null;
	}

	return (
		<div className="history-panel">
			<h2>Sentence History</h2>

			<ol>
				{sentenceHistory.map((entry, index) => (
					<li key={index}>
						<strong>{entry.player}:</strong>
						{' '}
						{entry.sentence}
						<br />
					</li>
				))}
			</ol>
		</div>
	);
}

export default SentenceHistoryPanel;
