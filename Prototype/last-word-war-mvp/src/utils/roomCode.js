/**
 * roomCode.js
 *
 * Room codes are generated in a dedicated utility so
 * room creation logic remains independent from the
 * code-generation strategy.
 *
 * This allows the room-code format to evolve later
 * without modifying game-flow logic.
 */


/**
 * Room codes are intentionally short and human-readable
 * because players frequently enter them manually when
 * joining multiplayer matches.
 *
 * The current project scale makes random collisions
 * sufficiently unlikely for the prototype phase.
 */

export function generateRoomCode() {
	return Math.random()
		.toString(36)
		.substring(2, 8)
		.toUpperCase();
}
