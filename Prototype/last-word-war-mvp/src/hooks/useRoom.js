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

import { fetchRoomByCode } from '../services/roomService';

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

	return {
		load,
	};
}

export default useRoom;
