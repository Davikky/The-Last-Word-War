import { useState } from 'react';
import './App.css';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [players, setPlayers] = useState([]);

  function addPlayer(event) {
    event.preventDefault();

    const trimmedName = playerName.trim();

    if (trimmedName === '') {
      return;
    }

    setPlayers([...players, { name: trimmedName, score: 0 }]);
    setPlayerName('');
  }

  return (
    <main className="app-container">
      <section className="hero-card">
        <h1>The Last Word War</h1>
        <p className="subtitle">
          A turn-based language, reasoning, and knowledge game.
        </p>

        <form className="player-form" onSubmit={addPlayer}>
          <input
            type="text"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            placeholder="Enter player name"
          />
          <button type="submit">Add Player</button>
        </form>

        <div className="status-box">
          <p><strong>Current Stage:</strong> MVP Prototype</p>
          <p><strong>Mode:</strong> Manual Referee</p>
          <p><strong>Author:</strong> Victor A. Adeyemi</p>
        </div>

        <div className="players-section">
          <h2>Players</h2>

          {players.length === 0 ? (
            <p>No players added yet.</p>
          ) : (
            <ul>
              {players.map((player, index) => (
                <li key={index}>
                  {index + 1}. {player.name} — {player.score} points
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
