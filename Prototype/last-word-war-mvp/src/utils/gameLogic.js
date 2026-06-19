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
