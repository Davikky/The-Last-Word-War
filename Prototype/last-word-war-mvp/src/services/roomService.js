/**
 * roomService.js
 *
 * Room-related Supabase database helpers.
 *
 * Refactor rule:
 * This file should handle database communication only.
 * It should not update React state, show alerts, or control UI flow.
 */

import { supabase } from '../lib/supabase';

/**
 * Fetches one room from Supabase by room code.
 *
 * This replaces the repeated pattern:
 * supabase.from('rooms').select('*').eq('room_code', roomCode).single()
 *
 * @param {string} roomCode - The room code to search for.
 * @returns {Promise<Object>} The matching room row.
 */
export async function fetchRoomByCode(roomCode) {
	const { data, error } = await supabase
		.from('rooms')
		.select('*')
		.eq('room_code', roomCode)
		.single();

	if (error || !data) {
		throw error || new Error('Room not found.');
	}

	return data;
}


/**
 * Creates a new room in Supabase.
 *
 * @param {string} roomCode
 * @param {Object} initialGameState
 */
export async function createRoomRecord(roomCode, initialGameState) {
	const { error } = await supabase
		.from('rooms')
		.insert([
			{
				room_code: roomCode,
				game_state: initialGameState,
			},
		]);

	if (error) {
		throw error;
	}
}
