/**
 * ------------------------------------------------------------------------
 * useRoom
 * ------------------------------------------------------------------------
 * Coordinates online room lifecycle operations.
 *
 * Responsibilities:
 * - Create a room.
 * - Join an existing room.
 * - Load room state.
 * - Enter the lobby.
 * - Start an online game.
 * - Remove players from a room.
 *
 * This hook should coordinate room flow, while Supabase database access
 * remains isolated inside roomService.js.
 * ------------------------------------------------------------------------
 */

import {
	fetchRoomByCode,
	createRoomRecord,
	updateRoomGameState,
} from '../services/roomService';

import { GAME_PHASES } from '../constants/gamePhases';
import { generateRoomCode } from '../utils/roomCode';
import {
	TURN_DURATION_MS,
} from '../constants/gameConfig';

function useRoom({
	roomCode,
	applyRoomSnapshot,
}) {
	async function load(targetRoomCode = roomCode) {
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

		applyRoomSnapshot(data);
	}


	async function create() {
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

		await load(newRoomCode);

		alert(`Room created: ${newRoomCode}`);

		return newRoomCode;

	}

	async function join(joinRoomCode) {
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

		await load(normalizedRoomCode);

		alert(`Joined room: ${normalizedRoomCode}`);

		return normalizedRoomCode;
	}


async function enterLobby({
	localPlayerName,
	isHost,
	setPlayers,
	setHasJoinedLobby,
}) {
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
		hostName: isHost
			? trimmedName
			: existingGameState.hostName,
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

	await load(roomCode);
}


async function start() {
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
		turnDeadline: Date.now() + TURN_DURATION_MS,
	};

	try {
		await updateRoomGameState(roomCode, updatedGameState);
	} catch (error) {
		console.error(error);
		alert('Could not start game.');
		return;
	}
}

async function removePlayer({
	playerIndex,
	players,
	roomData,
	hasJoinedLobby,
	isHost,
	setPlayers,
}) {
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


	return {
		create,
		join,
		load,
		enterLobby,
		start,
		removePlayer,
	};
}

export default useRoom;
