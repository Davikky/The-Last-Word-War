/**
 * sessionService.js
 *
 * Browser session persistence is isolated from App.jsx so
 * refresh recovery can evolve without coupling storage details
 * to React game flow.
 */

const SESSION_KEYS = {
	roomCode: 'tlww_roomCode',
	localPlayerName: 'tlww_localPlayerName',
	isHost: 'tlww_isHost',
	hasJoinedLobby: 'tlww_hasJoinedLobby',
};

export function saveSessionValue(key, value) {
	if (value === '' || value === null || value === undefined) {
		localStorage.removeItem(SESSION_KEYS[key]);
		return;
	}

	localStorage.setItem(SESSION_KEYS[key], JSON.stringify(value));
}

export function loadSavedSession() {
	return {
		roomCode: JSON.parse(
			localStorage.getItem(SESSION_KEYS.roomCode) || '""'
		),
		localPlayerName: JSON.parse(
			localStorage.getItem(SESSION_KEYS.localPlayerName) || '""'
		),
		isHost: JSON.parse(
			localStorage.getItem(SESSION_KEYS.isHost) || 'false'
		),
		hasJoinedLobby: JSON.parse(
			localStorage.getItem(SESSION_KEYS.hasJoinedLobby) || 'false'
		),
	};
}

export function clearSavedSession() {
	Object.values(SESSION_KEYS).forEach((key) => {
		localStorage.removeItem(key);
	});
}
