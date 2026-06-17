import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import './App.css';

const GAME_PHASES = {
	SETUP: 'SETUP',
	ACTIVE: 'ACTIVE',
	FINAL_ROUND: 'FINAL_ROUND',
	SUDDEN_DEATH: 'SUDDEN_DEATH',
	GAME_OVER: 'GAME_OVER',
};

function App() {
	const [playerName, setPlayerName] = useState('');
	const [players, setPlayers] = useState([]);
	const [gamePhase, setGamePhase] = useState(GAME_PHASES.SETUP);
	const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
	const [currentWord, setCurrentWord] = useState('START');
	const [sentence, setSentence] = useState('');
	const [sentenceHistory, setSentenceHistory] = useState([]);
	const [lastSubmittedPlayerIndex, setLastSubmittedPlayerIndex] = useState(null);
	const [timeLeft, setTimeLeft] = useState(60);
	const [winner, setWinner] = useState(null);
	const [finalStandings, setFinalStandings] = useState([]);
	const [suddenDeathPlayerNames, setSuddenDeathPlayerNames] = useState([]);
	const [finalRoundStarterIndex, setFinalRoundStarterIndex] = useState(null);
	const [matchStarterIndex, setMatchStarterIndex] = useState(0);
	const [roomCode, setRoomCode] = useState('');
	const [isHost, setIsHost] = useState(false);
	const [joinRoomCode, setJoinRoomCode] = useState('');
	const [localPlayerName, setLocalPlayerName] = useState('');
	const [hasJoinedLobby, setHasJoinedLobby] = useState(false);
	const [roomData, setRoomData] = useState(null);


	function generateRoomCode() {
		const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
		let code = '';

		for (let index = 0; index < 5; index += 1) {
			code += letters[Math.floor(Math.random() * letters.length)];
		}

		return code;
	}

	async function createRoom() {
		const newRoomCode = generateRoomCode();

		const initialGameState = {
			roomCode: newRoomCode,
			players: [],
			gamePhase: GAME_PHASES.SETUP,
			currentPlayerIndex: 0,
			currentWord: 'START',
			sentenceHistory: [],
			winner: null,
		};

		const { error } = await supabase
			.from('rooms')
			.insert([
				{
					room_code: newRoomCode,
					game_state: initialGameState,
				},
			]);

		if (error) {
			console.error(error);
			alert('Room creation failed');
			return;
		}

		setRoomCode(newRoomCode);
		setIsHost(true);

		await loadRoom(newRoomCode);

		alert(`Room created: ${newRoomCode}`);
	}


	async function joinRoom() {
		const normalizedRoomCode = joinRoomCode.trim().toUpperCase();

		if (normalizedRoomCode === '') {
			alert('Please enter a room code.');
			return;
		}

		const { data, error } = await supabase
			.from('rooms')
			.select('*')
			.eq('room_code', normalizedRoomCode)
			.single();

		if (error || !data) {
			console.error(error);
			alert('Room not found.');
			return;
		}

		setRoomCode(normalizedRoomCode);
		setIsHost(false);

		await loadRoom(normalizedRoomCode);

		alert(`Joined room: ${normalizedRoomCode}`);
	}


	async function joinLobby() {
		const trimmedName = localPlayerName.trim();

		if (trimmedName === '') {
			alert('Please enter your name.');
			return;
		}

		const { data, error } = await supabase
			.from('rooms')
			.select('*')
			.eq('room_code', roomCode)
			.single();

		if (error || !data) {
			console.error(error);
			alert('Room not found.');
			return;
		}

		const existingGameState = data.game_state;

		const existingPlayers = existingGameState.players || [];

		const updatedPlayers = [
			...existingPlayers,
			{
				name: trimmedName,
				score: 0,
			},
		];

		const updatedGameState = {
			...existingGameState,
			players: updatedPlayers,
		};

		const { error: updateError } = await supabase
			.from('rooms')
			.update({
				game_state: updatedGameState,
			})
			.eq('room_code', roomCode);

		if (updateError) {
			console.error(updateError);
			alert('Could not join lobby.');
			return;
		}

		setPlayers(updatedPlayers);
		setHasJoinedLobby(true);

		await loadRoom(roomCode);
	}


	async function loadRoom(targetRoomCode = roomCode) {
		if (!targetRoomCode) {
			return;
		}

		const { data, error } = await supabase
			.from('rooms')
			.select('*')
			.eq('room_code', targetRoomCode)
			.single();

		if (error || !data) {
			console.error(error);
			alert('Could not load room.');
			return;
		}

		const gameState = data.game_state;

		setRoomData(data);
		setPlayers(gameState.players || []);
		setGamePhase(gameState.gamePhase || GAME_PHASES.SETUP);
		setCurrentPlayerIndex(gameState.currentPlayerIndex || 0);
		setCurrentWord(gameState.currentWord || 'START');
		setSentenceHistory(gameState.sentenceHistory || []);
		setWinner(gameState.winner || null);
	}


	useEffect(() => {
		if (gamePhase !== GAME_PHASES.ACTIVE) {
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
	}, [gamePhase, timeLeft]);

	function addPlayer(event) {
		event.preventDefault();

		const trimmedName = playerName.trim();

		if (trimmedName === '') {
			return;
		}

		setPlayers([...players, { name: trimmedName, score: 0 }]);
		setPlayerName('');
	}


	function removePlayer(playerIndex) {
		const updatedPlayers = players.filter(
			(_, index) => index !== playerIndex
		);

		setPlayers(updatedPlayers);
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

		let nextPlayer = (currentPlayerIndex + 1) % players.length;

		if (gamePhase === GAME_PHASES.SUDDEN_DEATH) {
			while (
				!suddenDeathPlayerNames.includes(players[nextPlayer].name)
			) {
				nextPlayer = (nextPlayer + 1) % players.length;
			}
		}	

		if (
			gamePhase === GAME_PHASES.FINAL_ROUND &&
			nextPlayer === finalRoundStarterIndex
		) {
			determineWinner();
			setTimeLeft(60);
			setSentence('');
			return;
		}

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

		if (gamePhase === GAME_PHASES.SUDDEN_DEATH) {
			checkSuddenDeathWinner(updatedPlayers);
			return;
		}

		const winningPlayer = updatedPlayers.find(
			(player) => player.score >= 10
		);

		if (winningPlayer && gamePhase === GAME_PHASES.ACTIVE) {
			setGamePhase(GAME_PHASES.FINAL_ROUND);
			setFinalRoundStarterIndex(playerIndex);
		}

	}


	function calculateStandings(playerList) {
		const sortedPlayers = [...playerList].sort(
			(a, b) => b.score - a.score
		);

		let previousScore = null;
		let previousRank = 0;

		return sortedPlayers.map((player, index) => {
			let rank;

			if (player.score === previousScore) {
				rank = previousRank;
			} else {
				rank = index + 1;
			}

			previousScore = player.score;
			previousRank = rank;

			return {
				...player,
				rank,
				isTied: sortedPlayers.filter(
					(otherPlayer) => otherPlayer.score === player.score
				).length > 1,
			};
		});
	}



	function determineWinner() {
		const standings = calculateStandings(players);
		setFinalStandings(standings);

		const highestScore = Math.max(...players.map((player) => player.score));

		const topPlayers = players.filter(
			(player) => player.score === highestScore
		);

		if (topPlayers.length === 1) {
			setWinner(topPlayers[0]);
			setGamePhase(GAME_PHASES.GAME_OVER);

		} else {
			const tiedPlayerNames = topPlayers.map((player) => player.name);

			setSuddenDeathPlayerNames(tiedPlayerNames);
			setGamePhase(GAME_PHASES.SUDDEN_DEATH);
			setWinner(null);
		}
	}


	function checkSuddenDeathWinner(playerList) {
		const activeSuddenDeathPlayers = playerList.filter((player) =>
			suddenDeathPlayerNames.includes(player.name)
		);

		const sortedPlayers = [...activeSuddenDeathPlayers].sort(
			(a, b) => b.score - a.score
		);

		const leader = sortedPlayers[0];
		const secondPlace = sortedPlayers[1];

		if (leader.score - secondPlace.score >= 2) {
			setWinner(leader);
			setFinalStandings(calculateStandings(playerList));
			setGamePhase(GAME_PHASES.GAME_OVER);
		}
	}


	function resetMatch() {
		const resetPlayers = players.map((player) => ({
			...player,
			score: 0,
		}));

		const nextStarterIndex = (matchStarterIndex + 1) % players.length;

		setPlayers(resetPlayers);
		setSentenceHistory([]);
		setWinner(null);
		setCurrentWord('START');
		setCurrentPlayerIndex(nextStarterIndex);
		setTimeLeft(60);
		setSentence('');
		setLastSubmittedPlayerIndex(null);
		setFinalRoundStarterIndex(null);
		setSuddenDeathPlayerNames([]);
		setMatchStarterIndex(nextStarterIndex);
		setGamePhase(GAME_PHASES.ACTIVE);
	}


	return (
		<main className="app-container">
		<section className="hero-card">
		<h1>The Last Word War</h1>


		<button className="start-button" onClick={createRoom}>
		Create Room
		</button>

		<div className="join-room-panel">
		<input
		type="text"
		value={joinRoomCode}
		onChange={(event) => setJoinRoomCode(event.target.value)}
		placeholder="Enter room code"
		/>

		<button className="start-button" onClick={joinRoom}>
		Join Room
		</button>
		</div>

		{roomCode && (
			<div className="status-box">
			<p><strong>Room Code:</strong> {roomCode}</p>
			<p>Share this code with another player.</p>
			</div>
		)}


		{roomCode && !hasJoinedLobby && (
			<div className="join-room-panel">
			<input
			type="text"
			value={localPlayerName}
			onChange={(event) => setLocalPlayerName(event.target.value)}
			placeholder="Enter your player name"
			/>

			<button className="start-button" onClick={joinLobby}>
			Enter Lobby
			</button>
			</div>
		)}


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

		{players.length >= 2 && gamePhase === GAME_PHASES.SETUP && (

			<button
			className="start-button"
			onClick={() => {
				setCurrentPlayerIndex(matchStarterIndex);
				setGamePhase(GAME_PHASES.ACTIVE);
			}}
			>
			Start Game
			</button>

		)}

		<div className="status-box">
		<p><strong>Current Stage:</strong> MVP Prototype</p>
		<p><strong>Mode:</strong> Manual Referee</p>
		<p><strong>Author:</strong> Victor A. Adeyemi</p>
		</div>

		{(gamePhase === GAME_PHASES.ACTIVE ||
			gamePhase === GAME_PHASES.FINAL_ROUND ||
			gamePhase === GAME_PHASES.SUDDEN_DEATH) && (
				<div className="game-panel">


				<h2>
				{gamePhase === GAME_PHASES.SUDDEN_DEATH
					? 'Sudden Death'
					: gamePhase === GAME_PHASES.FINAL_ROUND
					? 'Final Round'
					: 'Game Started'}
				</h2>

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


		{gamePhase === GAME_PHASES.GAME_OVER && winner && (
			<div className="winner-panel">
			<h2>🏆 Game Over</h2>

			<p className="winner-name">
			<strong>Winner:</strong> {winner.name}
			</p>

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

			<button className="start-button" onClick={resetMatch}>
			Play Again
			</button>
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
				<span>
				{index + 1}. {player.name} — {player.score} points
				</span>

				{gamePhase === GAME_PHASES.SETUP && (
					<button onClick={() => removePlayer(index)}>
					Remove
					</button>
				)}
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
