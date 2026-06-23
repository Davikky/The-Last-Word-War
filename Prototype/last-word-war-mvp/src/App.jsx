import { useEffect, useState, useRef } from 'react';
import { supabase } from './lib/supabase';
import './App.css';

import { GAME_PHASES } from './constants/gamePhases';
import {
	calculateStandings, evaluateOnlineGameState, getNextEligiblePlayerIndex, applyScoreChange, parseSentenceWords, buildResetGameState,
	resolveFinalRoundWinner, resolveSuddenDeathWinner, appendSentenceHistoryEntry, 	determineNextPlayerIndex, buildInactivityGameState,
	buildTimeoutGameState, buildOnlineSubmissionGameState, prepareOnlineSubmissionState,
} from './utils/gameLogic';

import {
	fetchRoomByCode,
	createRoomRecord,
	updateRoomGameState,
} from './services/roomService';

import {
	saveSessionValue,
	loadSavedSession,
	clearSavedSession,
} from './services/sessionService';

import { generateRoomCode } from './utils/roomCode';

import WelcomeScreen from './components/WelcomeScreen';



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
	const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
	const hasRestoredSessionRef = useRef(false);


	useEffect(() => {
		if (!hasRestoredSessionRef.current) {
			return;
		}

		saveSessionValue('roomCode', roomCode);
	}, [roomCode]);

	useEffect(() => {
		if (!hasRestoredSessionRef.current) {
			return;
		}

		saveSessionValue(
			'localPlayerName',
			localPlayerName
		);
	}, [localPlayerName]);

	useEffect(() => {
		if (!hasRestoredSessionRef.current) {
			return;
		}

		saveSessionValue('isHost', isHost);
	}, [isHost]);

	useEffect(() => {
		if (!hasRestoredSessionRef.current) {
			return;
		}

		saveSessionValue(
			'hasJoinedLobby',
			hasJoinedLobby
		);
	}, [hasJoinedLobby]);


	useEffect(() => {
		const savedSession = loadSavedSession();

		if (!savedSession.roomCode) {
			hasRestoredSessionRef.current = true;
			return;
		}

		setRoomCode(savedSession.roomCode);
		setLocalPlayerName(savedSession.localPlayerName);
		setIsHost(savedSession.isHost);
		setHasJoinedLobby(savedSession.hasJoinedLobby);

		loadRoom(savedSession.roomCode);

		hasRestoredSessionRef.current = true;
	}, []);



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
			turnNumber: 0,
		};


		try {
			await createRoomRecord(newRoomCode, initialGameState);
		} catch (error) {
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


		try {
			await fetchRoomByCode(normalizedRoomCode);
		} catch (error) {
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


		let data;

		try {
			data = await fetchRoomByCode(roomCode);
		} catch (error) {
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


		try {
			await updateRoomGameState(roomCode, updatedGameState);
		} catch (error) {
			console.error(error);
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


		let data;

		try {
			data = await fetchRoomByCode(targetRoomCode);
		} catch (error) {
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
		setNotification(gameState.notification || '');
		setGameOverReason(gameState.gameOverReason || '');
	}


	async function startRoomGame() {

		let data;

		try {
			data = await fetchRoomByCode(roomCode);
		} catch (error) {
			console.error(error);
			alert('Could not load room.');
			return;
		}
		const updatedGameState = {
			...data.game_state,
			gamePhase: GAME_PHASES.ACTIVE,
			turnDeadline: Date.now() + 60000,
		};

		try {
			await updateRoomGameState(roomCode, updatedGameState);
		} catch (error) {
			console.error(error);
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

			try {
				await updateRoomGameState(roomCode, updatedGameState);
			} catch (error) {
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

		const {
			trimmedSentence,
			firstWord,
			lastWord,
		} = parseSentenceWords(sentence);

		if (trimmedSentence === '') {
			return;
		}

		if (currentWord !== 'START' && firstWord !== currentWord) {
			alert(`Sentence must begin with the current word: ${currentWord}`);
			return;
		}

		const currentPlayer = players[currentPlayerIndex];

		if (!currentPlayer) {
			return;
		}

		if (roomCode && hasJoinedLobby) {
			if (currentPlayer.name !== localPlayerName.trim()) {
				alert(`It is ${currentPlayer.name}'s turn.`);
				return;
			}

			const updatedGameState = prepareOnlineSubmissionState({
				players,
				currentPlayerIndex,
				sentenceHistory,
				currentPlayer,
				trimmedSentence,
				lastWord,
				gamePhase,
				suddenDeathPlayerNames,
				roomCode,
				winner,
				finalStandings,
				finalRoundStarterIndex,
				drawPlayers,
				suddenDeathRoundCount,
				gameOverReason,
				GAME_PHASES,
				turnNumber: roomData?.game_state?.turnNumber || 0,
				now: Date.now(),
			});

			try {
				await updateRoomGameState(roomCode, updatedGameState);
			} catch (error) {
				console.error(error);
				alert('Could not submit sentence.');
				return;
			}


			setSentence('');
			setTimeLeft(60);
			return;
		}


		/**
		 * Legacy single-device mode.
		 *
		 * This mode is currently hidden from the user interface
		 * but retained for future offline, tutorial, or AI-assisted
		 * gameplay experiments.
		 *
		 * Refactor policy:
		 * Preserve functionality unless a future release formally
		 * removes offline play support.
		 */


		const updatedSentenceHistory = appendSentenceHistoryEntry({
			sentenceHistory,
			playerName: currentPlayer.name,
			sentence: trimmedSentence,
			extractedWord: lastWord,
		});

		setSentenceHistory(updatedSentenceHistory);
		setLastSubmittedPlayerIndex(currentPlayerIndex);

		updateScore(currentPlayerIndex, 1);

		setCurrentWord(lastWord);

		let nextPlayer = determineNextPlayerIndex({
			currentPlayerIndex,
			playerList: players,
			gamePhase,
			suddenDeathPlayerNames,
			GAME_PHASES,
		});

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
		const updatedPlayers = applyScoreChange(players, playerIndex, change);

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


	function startNewPlayFromActiveSession() {
		clearSavedSession();

		setRoomCode('');
		setJoinRoomCode('');
		setLocalPlayerName('');
		setPlayers([]);
		setSentenceHistory([]);
		setWinner(null);
		setNotification('');
		setHasJoinedLobby(false);
		setIsHost(false);
		setCurrentWord('START');
		setCurrentPlayerIndex(0);
		setTimeLeft(60);
		setSentence('');
		setGamePhase(GAME_PHASES.SETUP);

		setShowWelcomeScreen(true);
	}


	async function processOnlineTimeout() {
		if (!roomCode || !isHost || !turnDeadline) {
			return;
		}

		if (Date.now() < turnDeadline) {
			return;
		}

		let data;

		try {
			data = await fetchRoomByCode(roomCode);
		} catch (error) {
			console.error(error);
			return;
		}

		const gameState = data.game_state;
		const observedTurnNumber = gameState.turnNumber || 0;

		const currentPlayers = gameState.players || [];
		const activePlayerIndex = gameState.currentPlayerIndex ?? 0;
		const activePlayer = currentPlayers[activePlayerIndex];

		if (!activePlayer || currentPlayers.length === 0) {
			return;
		}

		const updatedPlayers = applyScoreChange(
			currentPlayers,
			activePlayerIndex,
			-1
		);

		const nextPlayer = determineNextPlayerIndex({
			currentPlayerIndex: activePlayerIndex,
			playerList: currentPlayers,
			gamePhase: gameState.gamePhase,
			suddenDeathPlayerNames: gameState.suddenDeathPlayerNames || [],
			GAME_PHASES,
		});

		const nextPlayerName = currentPlayers[nextPlayer]?.name || 'next player';

		const nextConsecutiveTimeouts = (gameState.consecutiveTimeouts || 0) + 1;

		if (nextConsecutiveTimeouts >= 5) {
			const inactivityGameState = buildInactivityGameState({
				gameState,
				updatedPlayers,
				nextPlayer,
				nextConsecutiveTimeouts,
				GAME_PHASES,
			});

			const latestRoom = await fetchRoomByCode(roomCode);
			const latestTurnNumber = latestRoom.game_state.turnNumber || 0;

			if (latestTurnNumber !== observedTurnNumber) {
				return;
			}

			try {
				await updateRoomGameState(roomCode, inactivityGameState);
			} catch (error) {
				console.error(error);
			}

			return;
		}

		const timeoutNotification = `⏰ ${activePlayer.name} timed out. Penalty applied. Turn passes to ${nextPlayerName}.`;

		const evaluatedState = evaluateOnlineGameState({
			currentState: {
				roomCode,
				gamePhase: gameState.gamePhase,
				winner: gameState.winner || null,
				finalStandings: gameState.finalStandings || [],
				suddenDeathPlayerNames:
				gameState.suddenDeathPlayerNames || [],
				finalRoundStarterIndex:
				gameState.finalRoundStarterIndex ?? null,
				drawPlayers: gameState.drawPlayers || [],
				suddenDeathRoundCount:
				gameState.suddenDeathRoundCount || 0,
				gameOverReason: gameState.gameOverReason || '',
		turnNumber: gameState.turnNumber || 0,
			},
			updatedPlayers,
			updatedSentenceHistory: gameState.sentenceHistory || [],
			lastWord: gameState.currentWord || 'START',
			nextPlayer,
			GAME_PHASES,
		});

		const evaluatedGameState = buildTimeoutGameState({
			gameState,
			evaluatedGameState: evaluatedState,
			updatedPlayers,
			nextPlayer,
			timeoutNotification,
			nextConsecutiveTimeouts,
			now: Date.now(),
		});

		const latestRoomBeforeTimeoutUpdate =
			await fetchRoomByCode(roomCode);

		const latestTurnNumberBeforeTimeoutUpdate =
			latestRoomBeforeTimeoutUpdate.game_state.turnNumber || 0;

		if (
			latestTurnNumberBeforeTimeoutUpdate !==
			observedTurnNumber
		) {

			return;
		}
		try {
			await updateRoomGameState(roomCode, evaluatedGameState);
		} catch (error) {
			console.error(error);
		}

	}


	function determineWinner() {
		const result = resolveFinalRoundWinner(players);

		setFinalStandings(result.standings);

		if (result.isSuddenDeath) {
			setSuddenDeathPlayerNames(result.tiedPlayerNames);
			setGamePhase(GAME_PHASES.SUDDEN_DEATH);
			setWinner(null);
			return;
		}

		setWinner(result.winner);
		setGamePhase(GAME_PHASES.GAME_OVER);
	}


	function checkSuddenDeathWinner(playerList) {
		const result = resolveSuddenDeathWinner(
			playerList,
			suddenDeathPlayerNames
		);

		if (!result.hasWinner) {
			return;
		}

		setWinner(result.winner);
		setFinalStandings(calculateStandings(playerList));
		setGamePhase(GAME_PHASES.GAME_OVER);
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

			const resetGameState = buildResetGameState({
				roomCode,
				players,
				nextStarterIndex,
				GAME_PHASES,
				now: Date.now(),
			});

			try {
				await updateRoomGameState(roomCode, resetGameState);
			} catch (error) {
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


	if (showWelcomeScreen) {
		return (
			<WelcomeScreen
			onContinue={() => setShowWelcomeScreen(false)}
			/>
		);
	}

	return (
		<main className="app-container">
		<section className="hero-card">

		<h1>The Last Word War™</h1>


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

			<button
			className="start-button"
			onClick={startNewPlayFromActiveSession}
			>
			Start New Play
			</button>
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


		{notification && (
			<div className="notification-banner">
			{notification}
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

			<button
			className="start-button"
			onClick={startNewPlayFromActiveSession}
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

		<p className="research-note">
		A human-centered multiplayer experiment in
		conversation, learning, and collaborative creativity.
		</p>


		</section>
		</main>
	);
}



export default App;
