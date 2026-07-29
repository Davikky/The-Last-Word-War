/**
 * ------------------------------------------------------------------------
 * useRealtimeGame
 * ------------------------------------------------------------------------
 * Manages realtime synchronization for an online room.
 *
 * Responsibilities:
 * - Subscribe to Supabase room updates.
 * - Apply incoming room snapshots.
 * - Remove the subscription during cleanup.
 *
 * Room-state hydration remains delegated to applyRoomSnapshot.
 * ------------------------------------------------------------------------
 */

import { useEffect } from 'react';

import { supabase } from '../lib/supabase';

function useRealtimeGame({
	roomCode,
	applyRoomSnapshot,
}) {
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
					applyRoomSnapshot(payload.new);
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [roomCode, applyRoomSnapshot]);
}

export default useRealtimeGame;
