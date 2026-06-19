import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import './App.css';

import { GAME_PHASES } from './constants/gamePhases';
import {
	calculateStandings,
	evaluateOnlineGameState,
} from './utils/gameLogic';



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
	const [hostName, setHostName] = useState('');
	const [notification, setNotification] = useState('');
	const [gameOverReason, setGameOverReason] = useState('');
	const [drawPlayers, setDrawPlayers] = useState([]);
	const [suddenDeathRoundCount, setSuddenDeathRoundCount] = useState(0);



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
			hostName: isHost ? trimmedName : existingGameState.hostName,
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
		setHostName(gameState.hostName || '');
		setGamePhase(gameState.gamePhase || GAME_PHASES.SETUP);
		setCurrentPlayerIndex(gameState.currentPlayerIndex || 0);
		setCurrentWord(gameState.currentWord || 'START');
		setSentenceHistory(gameState.sentenceHistory || []);
		setWinner(gameState.winner || null);
		setFinalStandings(gameState.finalStandings || []);
		setSuddenDeathPlayerNames(gameState.suddenDeathPlayerNames || []);
		setFinalRoundStarterIndex(gameState.finalRoundStarterIndex ?? null);
		setMatchStarterIndex(gameState.matchStarterIndex ?? 0);
		setTurnDeadline(gameState.turnDeadline || null);
		setNotification(updatedGameState.notification || '');
		setGameOverReason(gameState.gameOverReason || '');
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
	}, [gamePhase, roomCode, turnDeadline, isHost, currentPlayerIndex]);


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
					setHostName(updatedGameState.hostName || '');
					setCurrentPlayerIndex(updatedGameState.currentPlayerIndex || 0);
					setCurrentWord(updatedGameState.currentWord || 'START');
					setSentenceHistory(updatedGameState.sentenceHistory || []);
					setWinner(updatedGameState.winner || null);
					setFinalStandings(updatedGameState.finalStandings || []);
					setSuddenDeathPlayerNames(updatedGameState.suddenDeathPlayerNames || []);
					setFinalRoundStarterIndex(updatedGameState.finalRoundStarterIndex ?? null);
					setMatchStarterIndex(updatedGameState.matchStarterIndex ?? 0);
					setTurnDeadline(updatedGameState.turnDeadline || null);
					setNotification(updatedGameState.notification || '');
					setGameOverReason(updatedGameState.gameOverReason || '');
					setDrawPlayers(updatedGameState.drawPlayers || []);
					setSuddenDeathRoundCount(updatedGameState.suddenDeathRoundCount || 0);

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



	async function removePlayer(playerIndex) {
		if (roomCode && hasJoinedLobby && !isHost) {
			alert('Only the host can remove players.');
			return;
		}

		const updatedPlayers = players.filter(
			(_, index) => index !== playerIndex
		);

		if (roomCode && hasJoinedLobby) {
			const updatedGameState = {
				...roomData.game_state,
				players: updatedPlayers,
			};

			const { error } = await supabase
				.from('rooms')
				.update({
					game_state: updatedGameState,
				})
				.eq('room_code', roomCode);

			if (error) {
				console.error(error);
				alert('Could not remove player.');
				return;
			}

			return;
		}

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

			if (gamePhase === GAME_PHASES.SUDDEN_DEATH) {
				nextPlayer = getNextEligiblePlayerIndex(
					updatedPlayers,
					nextPlayer,
					suddenDeathPlayerNames
				);
			}

			const evaluatedGameState = evaluateOnlineGameState({
				currentState: {
					roomCode,
					gamePhase,
					winner,
					finalStandings,
					suddenDeathPlayerNames,
					finalRoundStarterIndex,
					drawPlayers,
					suddenDeathRoundCount,
					gameOverReason,
				},
				updatedPlayers,
				updatedSentenceHistory,
				lastWord,
				nextPlayer,
				GAME_PHASES,
			});

			if (evaluatedGameState.gamePhase === GAME_PHASES.SUDDEN_DEATH) {
				nextPlayer = getNextEligiblePlayerIndex(
					updatedPlayers,
					nextPlayer,
					evaluatedGameState.suddenDeathPlayerNames
				);
			}

			const updatedGameState = {
				...evaluatedGameState,
				currentWord: lastWord,
				currentPlayerIndex: nextPlayer,
				turnDeadline: Date.now() + 60000,
				notification: '',
				consecutiveTimeouts: 0,
				gameOverReason: '',
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




	function getNextEligiblePlayerIndex(playerList, startIndex, eligiblePlayerNames) {
		if (!eligiblePlayerNames || eligiblePlayerNames.length === 0) {
			return startIndex;
		}

		let candidateIndex = startIndex;
		let attempts = 0;

		while (
			attempts < playerList.length &&
			!eligiblePlayerNames.includes(playerList[candidateIndex].name)
		) {
			candidateIndex = (candidateIndex + 1) % playerList.length;
			attempts += 1;
		}

		return candidateIndex;
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
		const activePlayerIndex = gameState.currentPlayerIndex ?? 0;
		const activePlayer = currentPlayers[activePlayerIndex];

		if (!activePlayer || currentPlayers.length === 0) {
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

		if (gameState.gamePhase === GAME_PHASES.SUDDEN_DEATH) {
			const activeSuddenDeathNames = gameState.suddenDeathPlayerNames || [];

			while (
				activeSuddenDeathNames.length > 0 &&
				!activeSuddenDeathNames.includes(currentPlayers[nextPlayer].name)
			) {
				nextPlayer = (nextPlayer + 1) % currentPlayers.length;
			}
		}


		const nextPlayerName = currentPlayers[nextPlayer]?.name || 'next player';

		const nextConsecutiveTimeouts = (gameState.consecutiveTimeouts || 0) + 1;

		if (nextConsecutiveTimeouts >= 5) {
			const inactivityGameState = {
				...gameState,
				players: updatedPlayers,
				gamePhase: GAME_PHASES.GAME_OVER,
				winner: null,
				finalStandings: calculateStandings(updatedPlayers),
				currentWord: gameState.currentWord || 'START',
				currentPlayerIndex: nextPlayer,
				turnDeadline: null,
				notification: '⏰ Match ended after 5 consecutive timeouts.',
				consecutiveTimeouts: nextConsecutiveTimeouts,
				gameOverReason: 'INACTIVITY',
			};

			const { error: inactivityUpdateError } = await supabase
				.from('rooms')
				.update({
					game_state: inactivityGameState,
				})
				.eq('room_code', roomCode);

			if (inactivityUpdateError) {
				console.error(inactivityUpdateError);
			}

			return;
		}

		const timeoutNotification = `⏰ ${activePlayer.name} timed out. Penalty applied. Turn passes to ${nextPlayerName}.`;

		const evaluatedGameState = {
			...gameState,
			...evaluateOnlineGameState({
				currentState: {
					roomCode,
					gamePhase: gameState.gamePhase,
					winner: gameState.winner || null,
					finalStandings: gameState.finalStandings || [],
					suddenDeathPlayerNames: gameState.suddenDeathPlayerNames || [],
					finalRoundStarterIndex: gameState.finalRoundStarterIndex ?? null,
					drawPlayers: gameState.drawPlayers || [],
					suddenDeathRoundCount: gameState.suddenDeathRoundCount || 0,
					gameOverReason: gameState.gameOverReason || '',
				},
				updatedPlayers,
				updatedSentenceHistory: gameState.sentenceHistory || [],
				lastWord: gameState.currentWord || 'START',
				nextPlayer,
				GAME_PHASES,
			}),
			players: updatedPlayers,
			currentWord: gameState.currentWord || 'START',
			currentPlayerIndex: nextPlayer,
			turnDeadline: Date.now() + 60000,
			notification: timeoutNotification,
			consecutiveTimeouts: nextConsecutiveTimeouts,
			gameOverReason: '',
		};

		const { error: updateError } = await supabase
			.from('rooms')
			.update({
				game_state: evaluatedGameState,
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



	async function resetMatch() {
		const resetPlayers = players.map((player) => ({
			...player,
			score: 0,
		}));

		const nextStarterIndex = (matchStarterIndex + 1) % players.length;

		if (roomCode && hasJoinedLobby) {
			if (!isHost) {
				alert('Only the host can start a rematch.');
				return;
			}

			const resetGameState = {
				roomCode,
				players: resetPlayers,
				gamePhase: GAME_PHASES.ACTIVE,
				currentPlayerIndex: nextStarterIndex,
				currentWord: 'START',
				sentenceHistory: [],
				winner: null,
				finalStandings: [],
				suddenDeathPlayerNames: [],
				finalRoundStarterIndex: null,
				matchStarterIndex: nextStarterIndex,
				turnDeadline: Date.now() + 60000,
				consecutiveTimeouts: 0,
				gameOverReason: '',
				notification: '',
				drawPlayers: [],
				suddenDeathRoundCount: 0,

			};

			const { error } = await supabase
				.from('rooms')
				.update({
					game_state: resetGameState,
				})
				.eq('room_code', roomCode);

			if (error) {
				console.error(error);
				alert('Could not start rematch.');
			}

			return;
		}

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
		setGameOverReason('');
		setNotification('');
		setConsecutiveTimeouts(0);
		setDrawPlayers([]);
		setSuddenDeathRoundCount(0);
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

		)}

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


		{false && (
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



		{notification && (
			<div className="notification-banner">
			{notification}
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


		{gamePhase === GAME_PHASES.GAME_OVER && (
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

			<button className="start-button" onClick={resetMatch}>
			{roomCode ? 'Start Rematch' : 'Play Again'}
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
		)}



		<div className="players-section">
		<h2>Players</h2>


		{roomCode && hasJoinedLobby && gamePhase === GAME_PHASES.SETUP && (
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
		)}


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


		<div className="status-box">
		<p><strong>Version:</strong> v0.1.1</p>
		<p><strong>Stage:</strong> Feature Complete Alpha</p>
		<p><strong>Mode:</strong> Human ↔ Human Multiplayer</p>
		<p><strong>Author:</strong> Victor A. Adeyemi</p>
		</div>

		</section>
		</main>
	);
}



export default App;
