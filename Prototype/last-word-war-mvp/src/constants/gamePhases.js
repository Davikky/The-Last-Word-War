/**
 * The Last Word War
 *
 * Central game phase definitions.
 *
 * These values describe the high-level state of a match and are shared by:
 * - local React state
 * - online Supabase game state
 * - winner detection logic
 * - UI rendering logic
 *
 * Keep these values stable because saved room states may depend on them.
 */
export const GAME_PHASES = {
        SETUP: 'SETUP',
        ACTIVE: 'ACTIVE',
        FINAL_ROUND: 'FINAL_ROUND',
        SUDDEN_DEATH: 'SUDDEN_DEATH',
        GAME_OVER: 'GAME_OVER',
};
