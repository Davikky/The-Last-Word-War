/**
 * WelcomeScreen
 *
 * Introduces the philosophy of The Last Word War™
 * and prepares players for a Human ↔ Human experience.
 */
function WelcomeScreen({ onContinue }) {
	return (
		<div className="app-container">
		<div className="hero-card welcome-card">

		<h1>
		The Last Word War<sup>™</sup>
		</h1>

		<div className="status-box welcome-message">
		<h3>Before You Begin</h3>

		<p>
		The Last Word War™ is intentionally designed for
		<strong> two or more human players</strong>.
		</p>

		<p>
		Unlike many modern digital experiences, there is currently
		<strong> no AI opponent</strong>.
		</p>

		<p>
		<strong>
		Humans remain the primary participants.
		</strong>
		</p>
		</div>

		<button
		className="start-button"
		onClick={onContinue}
		>
		Continue
		</button>

		<div className="status-box project-status">

		<p><strong>Version:</strong> v0.1.2</p>

		<p><strong>Stage:</strong> Feature Complete Alpha</p>

		<p><strong>Mode:</strong> Human ↔ Human Multiplayer</p>

		<p><strong>Steward:</strong> Victor A. Adeyemi</p>

		<p><strong>Organization:</strong> Da-aim Services</p>

		<p>
		<strong>Contact:</strong>{' '}
		<a href="mailto:daaim4you@gmail.com">
		daaim4you@gmail.com
		</a>
		</p>

		</div>

		<p className="research-note">
		A human-centered multiplayer experiment in
		conversation, learning, and collaborative creativity.
		</p>

		</div>
		</div>
	);
}

export default WelcomeScreen;
