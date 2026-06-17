import { useState, useEffect } from 'react';
import './App.css';

function App() {
	const [playerName, setPlayerName] = useState('');
	const [players, setPlayers] = useState([]);
	const [gameStarted, setGameStarted] = useState(false);
	const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
	const [currentWord, setCurrentWord] = useState('START');
	const [sentence, setSentence] = useState('');
	const [sentenceHistory, setSentenceHistory] = useState([]);
	const [lastSubmittedPlayerIndex, setLastSubmittedPlayerIndex] = useState(null);
	const [timeLeft, setTimeLeft] = useState(60);
	const [gameOver, setGameOver] = useState(false);
	const [winner, setWinner] = useState(null);

	useEffect(() => {
		if (!gameStarted) {
			return;
		}

		if (timeLeft <= 0) {
			alert(`${players[currentPlayerIndex].name} timed out!`);

			updateScore(currentPlayerIndex, -1);

			const nextPlayer = (currentPlayerIndex + 1) % players.length;
			setCurrentPlayerIndex(nextPlayer);
			setTimeLeft(60);

			return;
		}

		const timer = setInterval(() => {
			setTimeLeft((previousTime) => previousTime - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [gameStarted, timeLeft]);

	function addPlayer(event) {
		event.preventDefault();

		const trimmedName = playerName.trim();

		if (trimmedName === '') {
			return;
		}

		setPlayers([...players, { name: trimmedName, score: 0 }]);
		setPlayerName('');
	}

	function submitSentence(event) {
		event.preventDefault();

		const trimmedSentence = sentence.trim();

		if (trimmedSentence === '') {
			return;
		}

		const firstWord = trimmedSentence
			.split(/\s+/)[0]
			.replace(/[^\w]/g, '')
			.toUpperCase();

		if (currentWord !== 'START' && firstWord !== currentWord) {
			alert(`Sentence must begin with the current word: ${currentWord}`);
			return;
		}

		const words = trimmedSentence.split(/\s+/);

		const lastWord = words[words.length - 1]
			.replace(/[^\w]/g, '')
			.toUpperCase();

		const currentPlayer = players[currentPlayerIndex];
		setSentenceHistory([
			...sentenceHistory,
			{
				player: currentPlayer.name,
				sentence: trimmedSentence,
				extractedWord: lastWord,
			},
		]);

		setLastSubmittedPlayerIndex(currentPlayerIndex);

		updateScore(currentPlayerIndex, 1);

		setCurrentWord(lastWord);

		const nextPlayer = (currentPlayerIndex + 1) % players.length;

		setCurrentPlayerIndex(nextPlayer);
		setTimeLeft(60);
		setSentence('');
	}


	function updateScore(playerIndex, change) {
		const updatedPlayers = players.map((player, index) => {
			if (index === playerIndex) {
				return {
					...player,
					score: player.score + change,
				};
			}

			return player;
		});

		setPlayers(updatedPlayers);

		const winningPlayer = updatedPlayers.find(
			(player) => player.score >= 10
		);

		if (winningPlayer) {
			setWinner(winningPlayer);
			setGameOver(true);
		}
	}

	return (
		<main className="app-container">
		<section className="hero-card">
		<h1>The Last Word War</h1>

		<p className="subtitle">
		A turn-based language, reasoning, and knowledge game.
		</p>

		<form className="player-form" onSubmit={addPlayer}>
		<input
		type="text"
		value={playerName}
		onChange={(event) => setPlayerName(event.target.value)}
		placeholder="Enter player name"
		/>
		<button type="submit">Add Player</button>
		</form>

		{players.length >= 2 && !gameStarted && (
			<button className="start-button" onClick={() => setGameStarted(true)}>
			Start Game
			</button>
		)}

		<div className="status-box">
		<p><strong>Current Stage:</strong> MVP Prototype</p>
		<p><strong>Mode:</strong> Manual Referee</p>
		<p><strong>Author:</strong> Victor A. Adeyemi</p>
		</div>

		{gameStarted && (
			<div className="game-panel">
			<h2>Game Started</h2>

			<p><strong>Current Player:</strong> {players[currentPlayerIndex].name}</p>
			<p><strong>Current Word:</strong> {currentWord}</p>
			<p><strong>Time Remaining:</strong> {timeLeft} seconds</p>

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
		)}

		{sentenceHistory.length > 0 && (
			<div className="history-panel">
			<h2>Sentence History</h2>

			<ol>
			{sentenceHistory.map((entry, index) => (
				<li key={index}>
				<strong>{entry.player}:</strong> {entry.sentence}
				<br />
				<span>Next word: {entry.extractedWord}</span>
				</li>
			))}
			</ol>
			</div>
		)}

		<div className="players-section">
		<h2>Players</h2>

		{players.length === 0 ? (
			<p>No players added yet.</p>
		) : (
			<ul>
			{players.map((player, index) => (
				<li key={index}>
				{index + 1}. {player.name} — {player.score} points
				</li>
			))}
			</ul>
		)}
		</div>
		</section>
		</main>
	);
}

export default App;
