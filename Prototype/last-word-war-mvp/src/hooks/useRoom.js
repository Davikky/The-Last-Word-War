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
} from '../services/roomService';

import { GAME_PHASES } from '../constants/gamePhases';
import { generateRoomCode } from '../utils/roomCode';


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


	return {
		create,
		join,
		load,
		enterLobby,
	};
}

export default useRoom;
