import { useCallback, useEffect, useState, useRef } from 'react';
import './App.css';

import { GAME_PHASES } from './constants/gamePhases';
import {
	evaluateOnlineGameState, applyScoreChange, parseSentenceWords, buildResetGameState, determineNextPlayerIndex, buildInactivityGameState, buildTimeoutGameState, prepareOnlineSubmissionState,
} from './utils/gameLogic';

import {
	fetchRoomByCode,
	updateRoomGameState,
} from './services/roomService';

import {
	saveSessionValue,
	loadSavedSession,
	clearSavedSession,
} from './services/sessionService';

import  WelcomeScreen  from './components/WelcomeScreen';
import SentenceHistoryPanel from './components/SentenceHistoryPanel';
import PlayerListPanel from './components/PlayerListPanel';
import GameStatusPanel from './components/GameStatusPanel';
import RoomSetupPanel from './components/RoomSetupPanel';
import LobbyPanel from './components/LobbyPanel';
import GameOverPanel from './components/GameOverPanel';
import useCountdown from './hooks/useCountdown';
import useRoom from './hooks/useRoom';
import useRealtimeGame from './hooks/useRealtimeGame';

import {
	INITIAL_TIME_LEFT,
} from './constants/gameConfig';


function App() {
	const [players, setPlayers] = useState([]);
	const [gamePhase, setGamePhase] = useState(GAME_PHASES.SETUP);
	const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
	const [currentWord, setCurrentWord] = useState('START');
	const [sentence, setSentence] = useState('');
	const [sentenceHistory, setSentenceHistory] = useState([]);
	const [turnDeadline, setTurnDeadline] = useState(null);
	const [winner, setWinner] = useState(null);
	const [finalStandings, setFinalStandings] = useState([]);
	const [suddenDeathPlayerNames, setSuddenDeathPlayerNames] = useState([]);
	const [finalRoundStarterIndex, setFinalRoundStarterIndex] = useState(null);
	const [matchStarterIndex, setMatchStarterIndex] = useState(0);
	const [savedSession] = useState(() => loadSavedSession());
	const [roomCode, setRoomCode] = useState(
		savedSession.roomCode || ''
	);
	const [localPlayerName, setLocalPlayerName] = useState(
		savedSession.localPlayerName || ''
	);
	const [isHost, setIsHost] = useState(
		savedSession.isHost ?? false
	);
	const [hasJoinedLobby, setHasJoinedLobby] = useState(
		savedSession.hasJoinedLobby ?? false
	);
	const [joinRoomCode, setJoinRoomCode] = useState('');
	const [roomData, setRoomData] = useState(null);
	const [hostName, setHostName] = useState('');
	const [notification, setNotification] = useState('');
	const [gameOverReason, setGameOverReason] = useState('');
	const [drawPlayers, setDrawPlayers] = useState([]);
	const [suddenDeathRoundCount, setSuddenDeathRoundCount] = useState(0);
	const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
	const hasRestoredSessionRef = useRef(true);
	const timeoutProcessingRef = useRef(false);

	const applyRoomSnapshot = useCallback((roomSnapshot) => {
		const gameState = roomSnapshot.game_state;

		setRoomData(roomSnapshot);
		setPlayers(gameState.players || []);
		setGamePhase(gameState.gamePhase || GAME_PHASES.SETUP);
		setHostName(gameState.hostName || '');
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
		setDrawPlayers(gameState.drawPlayers || []);
		setSuddenDeathRoundCount(gameState.suddenDeathRoundCount || 0);
	}, []);



	const room = useRoom({
		roomCode,
		applyRoomSnapshot,
	});

	const { timeLeft, setTimeLeft } = useCountdown({
		gamePhase,
		roomCode,
		turnDeadline,
		isHost,
		currentPlayerIndex,
		onTimeout: processOnlineTimeout,
		GAME_PHASES,
	});

	useRealtimeGame({
		roomCode,
		applyRoomSnapshot,
	});

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
		if (!savedSession.roomCode) {
			hasRestoredSessionRef.current = true;
			return;
		}

		room.load(savedSession.roomCode);
		hasRestoredSessionRef.current = true;

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	async function createRoom() {
		const newRoomCode = await room.create();

		if (!newRoomCode) {
			return;
		}

		setRoomCode(newRoomCode);
		setIsHost(true);
	}


	async function joinRoom() {
		const normalizedRoomCode = await room.join(joinRoomCode);

		if (!normalizedRoomCode) {
			return;
		}

		setRoomCode(normalizedRoomCode);
		setIsHost(false);
	}

	async function joinLobby() {
		await room.enterLobby({
			localPlayerName,
			isHost,
			setPlayers,
			setHasJoinedLobby,
		});
	}


	async function startRoomGame() {
		await room.start();
	}



	async function removePlayer(playerIndex) {
		await room.removePlayer({
			playerIndex,
			players,
			roomData,
			hasJoinedLobby,
			isHost,
			setPlayers,
		});
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
			setTimeLeft(INITIAL_TIME_LEFT);
			return;
		}
	}


	function exitRoom() {
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
		setTimeLeft(INITIAL_TIME_LEFT);
		setSentence('');
		setGamePhase(GAME_PHASES.SETUP);

		setShowWelcomeScreen(true);
	}


	async function processOnlineTimeout() {
		if (timeoutProcessingRef.current) {
			return;
		}

		if (!roomCode || !isHost || !turnDeadline) {
			return;
		}

		if (Date.now() < turnDeadline) {
			return;
		}

		timeoutProcessingRef.current = true;

		try {
			const data = await fetchRoomByCode(roomCode);
			const gameState = data.game_state;
			const authoritativeTurnDeadline = gameState.turnDeadline;

			if (
				!authoritativeTurnDeadline ||
				Date.now() < authoritativeTurnDeadline
			) {
				return;
			}

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

			await updateRoomGameState(
				roomCode,
				evaluatedGameState
			);
		} catch (error) {
			console.error(error);
		} finally {
			timeoutProcessingRef.current = false;
		}
	}


	async function startRematch() {
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
			<RoomSetupPanel
			roomCode={roomCode}
			joinRoomCode={joinRoomCode}
			setJoinRoomCode={setJoinRoomCode}
			createRoom={createRoom}
			joinRoom={joinRoom}
			exitRoom={exitRoom}

			gamePhase={gamePhase}
			GAME_PHASES={GAME_PHASES}
			hasJoinedLobby={hasJoinedLobby}
			isHost={isHost}
			players={players}
			startRoomGame={startRoomGame}

			/>

		)}


		{gamePhase === GAME_PHASES.SETUP && (
			<LobbyPanel
			roomCode={roomCode}
			hasJoinedLobby={hasJoinedLobby}
			localPlayerName={localPlayerName}
			setLocalPlayerName={setLocalPlayerName}
			joinLobby={joinLobby}
			/>
		)}


		{!hasJoinedLobby && gamePhase !== GAME_PHASES.SETUP && (
			<div className="room-closed-message">
			<h3>Game Already in Progress</h3>

			<p>
			Only players who joined the lobby before the game started may participate.
			</p>

			<p>
			Exit Room to create or join a new room.
			</p>

			<button
			type="button"
			className="start-button"
			onClick={exitRoom}
			>
			Exit Room
			</button>
			</div>
		)}

		{hasJoinedLobby && (
			<SentenceHistoryPanel sentenceHistory={sentenceHistory} />
		)}

		{notification && (
			<div className="notification-banner">
			{notification}
			</div>
		)}


		{hasJoinedLobby &&
				(gamePhase === GAME_PHASES.ACTIVE ||
					gamePhase === GAME_PHASES.FINAL_ROUND ||
					gamePhase === GAME_PHASES.SUDDEN_DEATH) && (
						<GameStatusPanel
						gamePhase={gamePhase}
						players={players}
						currentPlayerIndex={currentPlayerIndex}
						currentWord={currentWord}
						timeLeft={timeLeft}
						sentence={sentence}
						setSentence={setSentence}
						submitSentence={submitSentence}
						/>
					)}



		{hasJoinedLobby && gamePhase === GAME_PHASES.GAME_OVER && (
			<GameOverPanel
			winner={winner}
			gameOverReason={gameOverReason}
			drawPlayers={drawPlayers}
			finalStandings={finalStandings}
			roomCode={roomCode}
			startRematch={startRematch}
			exitRoom={exitRoom}
			/>
		)}


		<PlayerListPanel
		players={players}
		roomCode={roomCode}
		hasJoinedLobby={hasJoinedLobby}
		gamePhase={gamePhase}
		isHost={isHost}
		hostName={hostName}
		removePlayer={removePlayer}
		GAME_PHASES={GAME_PHASES}
		/>


		<p className="research-note">
		A human-centered multiplayer experiment in
		conversation, learning, and collaborative creativity.
		</p>


		</section>
		</main>
	);
}



export default App;
