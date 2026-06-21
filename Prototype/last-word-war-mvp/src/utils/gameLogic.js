/**
 * The Last Word War
 *
 * Core gameplay utility functions.
 *
 * These functions contain deterministic game logic and
 * should not depend on:
 *
 * - React state
 * - React hooks
 * - Supabase
 * - Browser APIs
 *
 * Keeping these functions pure makes them easier to:
 *
 * - test
 * - refactor
 * - reuse
 * - validate
 */



/**
 * Generates ranked standings for the current player list.
 *
 * Players are sorted by score in descending order.
 * Players with equal scores receive the same rank.
 *
 * Used by:
 * - Final standings
 * - Winner display
 * - Sudden Death resolution
 * - Inactivity and draw outcomes
 */
export function calculateStandings(playerList) {
        const sortedPlayers = [...playerList].sort(
                (a, b) => b.score - a.score
        );

        let previousScore = null;
        let previousRank = 0;

        return sortedPlayers.map((player, index) => {
                let rank;

                if (player.score === previousScore) {
                        rank = previousRank;
                } else {
                        rank = index + 1;
                }

                previousScore = player.score;
                previousRank = rank;

                return {
                        ...player,
                        rank,
                        isTied: sortedPlayers.filter(
                                (otherPlayer) => otherPlayer.score === player.score
                        ).length > 1,
                };
        });
}





/**
 * Evaluates the next online game state after a valid sentence
 * or timeout-related state change.
 *
 * This function is intentionally pure:
 * - no React state setters
 * - no Supabase calls
 * - no browser APIs
 *
 * It receives the current state explicitly and returns the next
 * synchronized game state object.
 */


/**
 * IMPORTANT:
 *
 * The caller must provide the authoritative current state.
 *
 * For normal gameplay this may come from React state.
 *
 * For timeout processing this must come from the latest
 * Supabase room state because timeout resolution is
 * host-authoritative.
 */


export function evaluateOnlineGameState({
        currentState,
        updatedPlayers,
        updatedSentenceHistory,
        lastWord,
        nextPlayer,
        GAME_PHASES,
}) {
        const {
                roomCode,
                gamePhase,
                winner,
                finalStandings,
                suddenDeathPlayerNames,
                finalRoundStarterIndex,
                drawPlayers,
                suddenDeathRoundCount,
                gameOverReason,
        } = currentState;

        let updatedGamePhase = gamePhase;
        let updatedWinner = winner;
        let updatedFinalStandings = finalStandings;
        let updatedSuddenDeathPlayerNames = suddenDeathPlayerNames;
        let updatedFinalRoundStarterIndex = finalRoundStarterIndex;
        let updatedDrawPlayers = drawPlayers;
        let updatedSuddenDeathRoundCount = suddenDeathRoundCount;
        let updatedGameOverReason = gameOverReason;

        if (gamePhase === GAME_PHASES.SUDDEN_DEATH) {
                const activeSuddenDeathPlayers = updatedPlayers.filter((player) =>
                        suddenDeathPlayerNames.includes(player.name)
                );

                const sortedSuddenDeathPlayers = [...activeSuddenDeathPlayers].sort(
                        (a, b) => b.score - a.score
                );

                const leader = sortedSuddenDeathPlayers[0];
                const secondPlace = sortedSuddenDeathPlayers[1];

                if (leader && secondPlace && leader.score - secondPlace.score >= 2) {
                        updatedWinner = leader;
                        updatedFinalStandings = calculateStandings(updatedPlayers);
                        updatedGamePhase = GAME_PHASES.GAME_OVER;
                        updatedDrawPlayers = [];
                        updatedGameOverReason = '';
                } else if (nextPlayer === finalRoundStarterIndex) {
                        updatedSuddenDeathRoundCount = suddenDeathRoundCount + 1;

                        if (updatedSuddenDeathRoundCount >= 5) {
                                updatedWinner = null;
                                updatedFinalStandings = calculateStandings(updatedPlayers);
                                updatedDrawPlayers = activeSuddenDeathPlayers;
                                updatedGamePhase = GAME_PHASES.GAME_OVER;
                                updatedGameOverReason = 'SUDDEN_DEATH_DRAW';
                        }
                }
        }

        if (
                gamePhase === GAME_PHASES.FINAL_ROUND &&
                nextPlayer === finalRoundStarterIndex
        ) {
                const standings = calculateStandings(updatedPlayers);
                updatedFinalStandings = standings;

                const highestScore = Math.max(
                        ...updatedPlayers.map((player) => player.score)
                );

                const topPlayers = updatedPlayers.filter(
                        (player) => player.score === highestScore
                );

                if (topPlayers.length === 1) {
                        updatedWinner = topPlayers[0];
                        updatedGamePhase = GAME_PHASES.GAME_OVER;
                } else {
                        updatedSuddenDeathPlayerNames = topPlayers.map(
                                (player) => player.name
                        );
                        updatedWinner = null;
                        updatedGamePhase = GAME_PHASES.SUDDEN_DEATH;
                        updatedSuddenDeathRoundCount = 0;
                        updatedDrawPlayers = [];
                        updatedGameOverReason = '';
                }
        }

        if (gamePhase === GAME_PHASES.ACTIVE) {
                const winningPlayerIndex = updatedPlayers.findIndex(
                        (player) => player.score >= 10
                );

                if (winningPlayerIndex !== -1) {
                        updatedGamePhase = GAME_PHASES.FINAL_ROUND;
                        updatedFinalRoundStarterIndex = winningPlayerIndex;
                }
        }

        return {
                roomCode,
                players: updatedPlayers,
                gamePhase: updatedGamePhase,
                currentPlayerIndex: nextPlayer,
                currentWord: lastWord,
                sentenceHistory: updatedSentenceHistory,
                winner: updatedWinner,
                finalStandings: updatedFinalStandings,
                suddenDeathPlayerNames: updatedSuddenDeathPlayerNames,
                finalRoundStarterIndex: updatedFinalRoundStarterIndex,
                drawPlayers: updatedDrawPlayers,
                suddenDeathRoundCount: updatedSuddenDeathRoundCount,
                gameOverReason: updatedGameOverReason,
        };
}

/**
 * Finds the next player whose name is eligible for the current phase.
 *
 * This is used during restricted phases such as Sudden Death,
 * where only a subset of players should continue taking turns.
 *
 * If no eligibility list is provided, the original start index is
 * preserved so normal turn rotation remains unchanged.
 */
export function getNextEligiblePlayerIndex(
	playerList,
	startIndex,
	eligiblePlayerNames
) {
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


/**
 * Score changes are calculated as immutable player updates
 * so React can detect the new player list reliably.
 *
 * Keeping this logic pure makes score updates reusable across
 * local play, online play, and future AI-referee workflows.
 */
export function applyScoreChange(playerList, playerIndex, change) {
	return playerList.map((player, index) => {
		if (index === playerIndex) {
			return {
				...player,
				score: player.score + change,
			};
		}

		return player;
	});
}


/**
 * Sentence parsing is isolated so the word-extraction
 * rule remains consistent across local play, online play,
 * and future AI-referee validation.
 *
 * Punctuation is removed before comparison because the game
 * depends on spoken/written word continuity, not punctuation.
 */
export function parseSentenceWords(sentence) {
	const trimmedSentence = sentence.trim();

	const words = trimmedSentence.split(/\s+/);

	const firstWord = words[0]
		.replace(/[^\w]/g, '')
		.toUpperCase();

	const lastWord = words[words.length - 1]
		.replace(/[^\w]/g, '')
		.toUpperCase();

	return {
		trimmedSentence,
		firstWord,
		lastWord,
	};
}


/**
 * Match reset state is built in one place so online rematches
 * and future local/rematch flows can share the same reset rules.
 *
 * The next starter rotates to reduce repeated first-player advantage.
 */
export function buildResetGameState({
	roomCode,
	players,
	nextStarterIndex,
	GAME_PHASES,
	now,
}) {
	const resetPlayers = players.map((player) => ({
		...player,
		score: 0,
	}));

	return {
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
		turnDeadline: now + 60000,
		consecutiveTimeouts: 0,
		gameOverReason: '',
		notification: '',
		drawPlayers: [],
		suddenDeathRoundCount: 0,
	};
}

/**
 * Winner resolution is separated from React state updates
 * so the game rule can be tested independently of the UI.
 *
 * A single top player ends the game immediately; tied leaders
 * move into Sudden Death.
 */
export function resolveFinalRoundWinner(playerList) {
	const standings = calculateStandings(playerList);

	const highestScore = Math.max(
		...playerList.map((player) => player.score)
	);

	const topPlayers = playerList.filter(
		(player) => player.score === highestScore
	);

	if (topPlayers.length === 1) {
		return {
			standings,
			winner: topPlayers[0],
			tiedPlayerNames: [],
			isSuddenDeath: false,
		};
	}

	return {
		standings,
		winner: null,
		tiedPlayerNames: topPlayers.map((player) => player.name),
		isSuddenDeath: true,
	};
}

/**
 * Sudden Death uses a win-by-two rule so a tied match is
 * resolved by clear separation rather than a single lucky turn.
 *
 * This helper only decides whether the rule has been satisfied;
 * React state updates remain in App.jsx.
 */
export function resolveSuddenDeathWinner(
	playerList,
	suddenDeathPlayerNames
) {
	const activeSuddenDeathPlayers = playerList.filter((player) =>
		suddenDeathPlayerNames.includes(player.name)
	);

	const sortedPlayers = [...activeSuddenDeathPlayers].sort(
		(a, b) => b.score - a.score
	);

	const leader = sortedPlayers[0];
	const secondPlace = sortedPlayers[1];

	if (!leader || !secondPlace) {
		return {
			hasWinner: false,
			winner: null,
		};
	}

	if (leader.score - secondPlace.score >= 2) {
		return {
			hasWinner: true,
			winner: leader,
		};
	}

	return {
		hasWinner: false,
		winner: null,
	};
}

/**
 * Sentence history is built through one helper so online
 * and local submissions record the same player, sentence,
 * and extracted-word structure.
 *
 * This keeps the history format stable for future replay,
 * moderation, and AI-referee features.
 */
export function appendSentenceHistoryEntry({
	sentenceHistory,
	playerName,
	sentence,
	extractedWord,
}) {
	return [
		...sentenceHistory,
		{
			player: playerName,
			sentence,
			extractedWord,
		},
	];
}

/**
 * Turn rotation is centralized so all game modes advance
 * players using the same rules.
 *
 * During Sudden Death, only eligible players may receive
 * the next turn.
 */
export function determineNextPlayerIndex({
	currentPlayerIndex,
	playerList,
	gamePhase,
	suddenDeathPlayerNames,
	GAME_PHASES,
}) {
	let nextPlayer =
		(currentPlayerIndex + 1) % playerList.length;

	if (gamePhase === GAME_PHASES.SUDDEN_DEATH) {
		nextPlayer = getNextEligiblePlayerIndex(
			playerList,
			nextPlayer,
			suddenDeathPlayerNames
		);
	}

	return nextPlayer;
}

/**
 * Consecutive timeouts can terminate a match to prevent
 * abandoned rooms from remaining active indefinitely.
 *
 * This helper centralizes the inactivity-forfeit rule so
 * all timeout-based game termination follows one policy.
 */
export function buildInactivityGameState({
	gameState,
	updatedPlayers,
	nextPlayer,
	nextConsecutiveTimeouts,
	GAME_PHASES,
}) {
	return {
		...gameState,
		players: updatedPlayers,
		gamePhase: GAME_PHASES.GAME_OVER,
		winner: null,
		finalStandings: calculateStandings(updatedPlayers),
		currentWord: gameState.currentWord || 'START',
		currentPlayerIndex: nextPlayer,
		turnDeadline: null,
		notification:
			'⏰ Match ended after 5 consecutive timeouts.',
		consecutiveTimeouts: nextConsecutiveTimeouts,
		gameOverReason: 'INACTIVITY',
	};
}
