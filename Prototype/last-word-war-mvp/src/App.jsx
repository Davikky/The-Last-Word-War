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
	const [turnDeadline, setTurnDeadline] = useState(null);
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
		setFinalStandings(gameState.finalStandings || []);
		setSuddenDeathPlayerNames(gameState.suddenDeathPlayerNames || []);
		setFinalRoundStarterIndex(gameState.finalRoundStarterIndex ?? null);
		setTurnDeadline(gameState.turnDeadline || null);	
	}


	async function startRoomGame() {
		const { data, error } = await supabase
			.from('rooms')
			.select('*')
			.eq('room_code', roomCode)
			.single();

		if (error || !data) {
			console.error(error);
			alert('Could not load room.');
			return;
		}

		const updatedGameState = {
			...data.game_state,
			gamePhase: GAME_PHASES.ACTIVE,
			turnDeadline: Date.now() + 60000,
		};

		const { error: updateError } = await supabase
			.from('rooms')
			.update({
				game_state: updatedGameState,
			})
			.eq('room_code', roomCode);

		if (updateError) {
			console.error(updateError);
			alert('Could not start game.');
		}
	}


	useEffect(() => {
		if (
			gamePhase !== GAME_PHASES.ACTIVE &&
			gamePhase !== GAME_PHASES.FINAL_ROUND &&
			gamePhase !== GAME_PHASES.SUDDEN_DEATH
		) {
			return;
		}

		const timer = setInterval(() => {
			if (roomCode && turnDeadline) {
				const remainingTime = Math.max(
					0,
					Math.ceil((turnDeadline - Date.now()) / 1000)
				);

				setTimeLeft(remainingTime);

				if (remainingTime === 0 && isHost) {
					processOnlineTimeout();
				}

				return;
			}

			setTimeLeft((previousTime) => {
				if (previousTime <= 0) {
					return 0;
				}

				return previousTime - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [gamePhase, roomCode, turnDeadline]);


	useEffect(() => {
		if (!roomCode) {
			return;
		}

		const channel = supabase
			.channel(`room-${roomCode}`)
			.on(
				'postgres_changes',
				{
					event: 'UPDATE',
					schema: 'public',
					table: 'rooms',
					filter: `room_code=eq.${roomCode}`,
				},
				(payload) => {
					const updatedRoom = payload.new;
					const updatedGameState = updatedRoom.game_state;

					setRoomData(updatedRoom);
					setPlayers(updatedGameState.players || []);
					setGamePhase(updatedGameState.gamePhase || GAME_PHASES.SETUP);
					setCurrentPlayerIndex(updatedGameState.currentPlayerIndex || 0);
					setCurrentWord(updatedGameState.currentWord || 'START');
					setSentenceHistory(updatedGameState.sentenceHistory || []);
					setWinner(updatedGameState.winner || null);
					setFinalStandings(updatedGameState.finalStandings || []);
					setSuddenDeathPlayerNames(updatedGameState.suddenDeathPlayerNames || []);
					setFinalRoundStarterIndex(updatedGameState.finalRoundStarterIndex ?? null);
					setTurnDeadline(updatedGameState.turnDeadline || null);
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [roomCode]);


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


	async function submitSentence(event) {
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

		if (!currentPlayer) {
			return;
		}

		if (roomCode && hasJoinedLobby) {
			if (currentPlayer.name !== localPlayerName.trim()) {
				alert(`It is ${currentPlayer.name}'s turn.`);
				return;
			}

			const updatedPlayers = players.map((player, index) => {
				if (index === currentPlayerIndex) {
					return {
						...player,
						score: player.score + 1,
					};
				}

				return player;
			});

			const updatedSentenceHistory = [
				...sentenceHistory,
				{
					player: currentPlayer.name,
					sentence: trimmedSentence,
					extractedWord: lastWord,
				},
			];

			let nextPlayer = (currentPlayerIndex + 1) % players.length;


			const updatedGameState = {
				...evaluateOnlineGameState({
					updatedPlayers,
					updatedSentenceHistory,
					lastWord,
					nextPlayer,
				}),
				currentWord: lastWord,
				currentPlayerIndex: nextPlayer,
				turnDeadline: Date.now() + 60000,
			};


			const { error } = await supabase
				.from('rooms')
				.update({
					game_state: updatedGameState,
				})
				.eq('room_code', roomCode);

			if (error) {
				console.error(error);
				alert('Could not submit sentence.');
				return;
			}

			setSentence('');
			setTimeLeft(60);
			return;
		}

		const updatedSentenceHistory = [
			...sentenceHistory,
			{
				player: currentPlayer.name,
				sentence: trimmedSentence,
				extractedWord: lastWord,
			},
		];

		setSentenceHistory(updatedSentenceHistory);
		setLastSubmittedPlayerIndex(currentPlayerIndex);

		updateScore(currentPlayerIndex, 1);

		setCurrentWord(lastWord);

		let nextPlayer = (currentPlayerIndex + 1) % players.length;

		if (gamePhase === GAME_PHASES.SUDDEN_DEATH) {
			while (!suddenDeathPlayerNames.includes(players[nextPlayer].name)) {
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




	function evaluateOnlineGameState({
		updatedPlayers,
		updatedSentenceHistory,
		lastWord,
		nextPlayer,
	}) {
		let updatedGamePhase = gamePhase;
		let updatedWinner = winner;
		let updatedFinalStandings = finalStandings;
		let updatedSuddenDeathPlayerNames = suddenDeathPlayerNames;
		let updatedFinalRoundStarterIndex = finalRoundStarterIndex;

		if (gamePhase === GAME_PHASES.SUDDEN_DEATH) {
			const activeSuddenDeathPlayers = updatedPlayers.filter((player) =>
				suddenDeathPlayerNames.includes(player.name)
			);

			const sortedSuddenDeathPlayers = [...activeSuddenDeathPlayers].sort(
				(a, b) => b.score - a.score
			);

			const leader = sortedSuddenDeathPlayers[0];
			const secondPlace = sortedSuddenDeathPlayers[1];

			if (leader && secondPlace && leader.score - secondPlace.score >= 2) {
				updatedWinner = leader;
				updatedFinalStandings = calculateStandings(updatedPlayers);
				updatedGamePhase = GAME_PHASES.GAME_OVER;
			}
		}

		if (gamePhase === GAME_PHASES.FINAL_ROUND && nextPlayer === finalRoundStarterIndex) {
			const standings = calculateStandings(updatedPlayers);
			updatedFinalStandings = standings;

			const highestScore = Math.max(...updatedPlayers.map((player) => player.score));

			const topPlayers = updatedPlayers.filter(
				(player) => player.score === highestScore
			);

			if (topPlayers.length === 1) {
				updatedWinner = topPlayers[0];
				updatedGamePhase = GAME_PHASES.GAME_OVER;
			} else {
				updatedSuddenDeathPlayerNames = topPlayers.map((player) => player.name);
				updatedWinner = null;
				updatedGamePhase = GAME_PHASES.SUDDEN_DEATH;
			}
		}

		if (gamePhase === GAME_PHASES.ACTIVE) {
			const winningPlayerIndex = updatedPlayers.findIndex(
				(player) => player.score >= 10
			);

			if (winningPlayerIndex !== -1) {
				updatedGamePhase = GAME_PHASES.FINAL_ROUND;
				updatedFinalRoundStarterIndex = winningPlayerIndex;
			}
		}

		return {
			roomCode,
			players: updatedPlayers,
			gamePhase: updatedGamePhase,
			currentPlayerIndex: nextPlayer,
			currentWord: lastWord,
			sentenceHistory: updatedSentenceHistory,
			winner: updatedWinner,
			finalStandings: updatedFinalStandings,
			suddenDeathPlayerNames: updatedSuddenDeathPlayerNames,
			finalRoundStarterIndex: updatedFinalRoundStarterIndex,
		};
	}


	async function processOnlineTimeout() {
		if (!roomCode || !isHost || !turnDeadline) {
			return;
		}

		if (Date.now() < turnDeadline) {
			return;
		}

		const { data, error } = await supabase
			.from('rooms')
			.select('*')
			.eq('room_code', roomCode)
			.single();

		if (error || !data) {
			console.error(error);
			return;
		}

		const gameState = data.game_state;
		const currentPlayers = gameState.players || [];
		const activePlayerIndex = gameState.currentPlayerIndex || 0;
		const activePlayer = currentPlayers[activePlayerIndex];

		if (!activePlayer) {
			return;
		}

		const updatedPlayers = currentPlayers.map((player, index) => {
			if (index === activePlayerIndex) {
				return {
					...player,
					score: player.score - 1,
				};
			}

			return player;
		});

		let nextPlayer = (activePlayerIndex + 1) % currentPlayers.length;

		const updatedGameState = {
			...gameState,
			players: updatedPlayers,
			currentPlayerIndex: nextPlayer,
			turnDeadline: Date.now() + 60000,
		};

		const { error: updateError } = await supabase
			.from('rooms')
			.update({
				game_state: updatedGameState,
			})
			.eq('room_code', roomCode);

		if (updateError) {
			console.error(updateError);
		}
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

		<div className="landing-message">
		<p>War is not the goal of this GAME at all.</p>
		<p>All it seeks is to promote HUMAN interactions;</p>
		<p>Interactions built firmly upon the previous LAST WORD.</p>
		
		<br />
		
		<p><strong>[WORD GAME FOR HUMANS ONLY]</strong></p>
		</div>

		{gamePhase === GAME_PHASES.SETUP && (
			<div className="online-room-panel">

			<p>CREATE a room or JOIN one REMOTELY:</p>



			{!roomCode && (
				<button className="start-button" onClick={createRoom}>
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

				<button className="start-button" onClick={joinRoom}>
				Join Room
				</button>
				</div>
			)}

			</div>
		)}



		{roomCode && gamePhase === GAME_PHASES.SETUP && (
			<div className="status-box">
			<p><strong>Room Code:</strong> {roomCode}</p>
			<p>Share ROOM CODE with another player.</p>
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


		{roomCode &&
				hasJoinedLobby &&
				isHost &&
				players.length >= 2 &&
				gamePhase === GAME_PHASES.SETUP && (
					<button
					className="start-button"
					onClick={startRoomGame}
					>
					Start Online Game
					</button>
				)}


		{!roomCode && (
			<>
			<form className="player-form" onSubmit={addPlayer}>

			<br />
			<p>SINGLE DEVICE MODE:</p>

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
			</>
		)}




		{sentenceHistory.length > 0 && (
			<div className="history-panel">
			<h2>Sentence History</h2>

			<ol>
			{sentenceHistory.map((entry, index) => (
				<li key={index}>
				<strong>{entry.player}:</strong> {entry.sentence}
				<br />
				</li>
			))}
			</ol>
			</div>
		)}


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


		<div className="status-box">
		<p><strong>Current Stage:</strong> MVP Prototype</p>
		<p><strong>Mode:</strong> Manual Referee</p>
		<p><strong>Author:</strong> Victor A. Adeyemi</p>
		</div>


		</section>
		</main>
	);
}



export default App;
