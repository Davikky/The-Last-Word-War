/**
 * ------------------------------------------------------------------------
 * useCountdown
 * ------------------------------------------------------------------------
 * Manages the gameplay countdown timer.
 *
 * Responsibilities:
 * - Maintain the remaining turn time.
 * - Synchronize countdown with online turn deadlines.
 * - Trigger timeout handling for the room host.
 *
 * This hook does not contain gameplay logic. It only manages
 * countdown progression and invokes the supplied timeout callback.
 * ------------------------------------------------------------------------
 */

import { useEffect, useState } from 'react';

import { INITIAL_TIME_LEFT } from '../constants/gameConfig';

function useCountdown({
	gamePhase,
	roomCode,
	turnDeadline,
	isHost,
	currentPlayerIndex,
	onTimeout,
	GAME_PHASES,
}) {
	const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_LEFT);

	useEffect(() => {
		if (
			gamePhase !== GAME_PHASES.ACTIVE &&
			gamePhase !== GAME_PHASES.FINAL_ROUND &&
			gamePhase !== GAME_PHASES.SUDDEN_DEATH
		) {
			return;
		}

		const timer = setInterval(() => {
			if (roomCode && turnDeadline) {
				const remainingTime = Math.max(
					0,
					Math.ceil((turnDeadline - Date.now()) / 1000)
				);

				setTimeLeft(remainingTime);

				if (remainingTime === 0 && isHost) {
					onTimeout();
				}

				return;
			}

			setTimeLeft((previousTime) => {
				if (previousTime <= 0) {
					return 0;
				}

				return previousTime - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [
		gamePhase,
		roomCode,
		turnDeadline,
		isHost,
		currentPlayerIndex,
		onTimeout,
		GAME_PHASES,
	]);

	return {
		timeLeft,
		setTimeLeft,
	};
}

export default useCountdown;
